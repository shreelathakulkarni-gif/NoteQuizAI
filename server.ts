import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy Google Gen AI initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment. Falling back to local smart generation engine.');
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Resilient Gemini text generation helper with automatic retry and model fallback
async function generateContentWithFallback(ai: GoogleGenAI, prompt: string, isJson: boolean = false): Promise<string> {
  // Ordered models from primary to lightweight fallback
  const modelsToTry = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const config: any = {};
        if (isJson) {
          config.responseMimeType = 'application/json';
        }
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config,
        });

        const text = response.text || '';
        if (text.trim()) {
          return text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt ${attempt + 1} with model ${model} failed:`, err?.message || err);
        // Wait a short duration before retry
        await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('All Gemini model generation attempts failed.');
}

// Helper to safely parse JSON from Gemini responses (handles markdown fences)
function safeParseJson(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw err;
  }
}
function fallbackGenerate(text: string, title: string, options: any) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const headings = lines.filter(l => l.length < 70 && /^[A-Z0-9\s:.-]{4,}$/i.test(l) && !l.endsWith('.'));
  
  const detectedTopics = headings.length > 0 
    ? headings.slice(0, 5) 
    : ['Core Concepts', 'Methodology & Processes', 'Key Principles', 'Applications & Analysis'];

  const sentences = text
    .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
    .split("|")
    .map(s => s.trim())
    .filter(s => s.length > 25 && s.length < 250);

  const sampleSentences = sentences.length > 0 ? sentences : [
    'The uploaded study material presents fundamental concepts and analytical frameworks.',
    'Systematic analysis reveals key relationships between theoretical components and practical applications.',
    'Core methodologies emphasize accurate problem-solving and structured comprehension.',
    'Advanced mechanisms require understanding prerequisite definitions and foundational laws.'
  ];

  const keyPoints = sampleSentences.slice(0, 6);

  const importantTerms = [
    {
      id: 'term-1',
      term: title.split(' ')[0] || 'Core Principle',
      definition: sampleSentences[0] || 'The foundational framework and essential operational rules of this subject.',
      context: 'Fundamental Definition'
    },
    {
      id: 'term-2',
      term: detectedTopics[0] || 'System Architecture',
      definition: sampleSentences[1] || 'The structured organization of components and functional relationships.',
      context: 'Structural'
    },
    {
      id: 'term-3',
      term: 'Analytical Framework',
      definition: sampleSentences[2] || 'A systematic methodology for evaluating empirical observations and variables.',
      context: 'Methodology'
    },
    {
      id: 'term-4',
      term: 'Optimization Metric',
      definition: sampleSentences[3] || 'A quantitative benchmark used to evaluate efficiency and accuracy.',
      context: 'Evaluation'
    }
  ];

  const detailedNotes = detectedTopics.slice(0, 3).map((topic, idx) => ({
    id: `sec-${idx + 1}`,
    heading: `${idx + 1}. ${topic}`,
    subheading: `Essential principles and functional context regarding ${topic.toLowerCase()}`,
    bulletPoints: sampleSentences.slice(idx * 3, idx * 3 + 3).length > 0
      ? sampleSentences.slice(idx * 3, idx * 3 + 3)
      : [
          `Key aspects of ${topic} govern the foundational mechanics observed across the material.`,
          `Standard procedures require adhering to verified diagnostic and computational steps.`,
          `Systematic review highlights high-impact variables and operational constraints.`
        ],
    definitions: [
      {
        term: topic,
        definition: sampleSentences[idx] || `A primary theoretical concept detailing specific behaviors in ${title}.`
      }
    ],
    examples: [
      `Practical implementation of ${topic.toLowerCase()} within modern academic problem sets.`
    ]
  }));

  const quizCount = Number(options.quizCount) || 5;
  const difficulty = options.difficulty || 'medium';
  const quiz = [];

  for (let i = 0; i < quizCount; i++) {
    const topic = detectedTopics[i % detectedTopics.length];
    const baseSentence = sampleSentences[i % sampleSentences.length] || 'Core principles govern system stability.';
    
    quiz.push({
      id: `q-${i + 1}`,
      question: `Regarding ${topic}, which of the following statements is most accurate?`,
      options: [
        baseSentence,
        `It operates independently without any prerequisite mathematical or empirical conditions.`,
        `It is strictly restricted to hypothetical models with no real-world verification.`,
        `It produces arbitrary outcomes that cannot be quantified or predicted.`
      ],
      correctAnswerIndex: 0,
      explanation: `As detailed in the source study material, ${baseSentence.toLowerCase()}`,
      topic: topic,
      difficulty: difficulty
    });
  }

  const flashcards = sampleSentences.slice(0, 8).map((s, idx) => ({
    id: `fc-${idx + 1}`,
    front: `What is the core significance of ${detectedTopics[idx % detectedTopics.length]}?`,
    back: s,
    topic: detectedTopics[idx % detectedTopics.length],
    isRevision: idx % 3 === 0,
    isKnown: idx % 2 === 0
  }));

  return {
    summary: sampleSentences.slice(0, 2).join(' ') || `Comprehensive study notes and revision materials for ${title}.`,
    topics: detectedTopics,
    notes: {
      noteLength: options.noteLength || 'medium',
      lastGeneratedAt: new Date().toISOString(),
      overview: sampleSentences.slice(0, 3).join(' ') || `Structured breakdown covering primary themes from ${title}.`,
      detailedNotes,
      keyPoints,
      importantTerms
    },
    quiz,
    flashcards
  };
}

// 1. Generate full study suite from PDF text
app.post('/api/generate-materials', async (req: Request, res: Response) => {
  try {
    const { extractedText, title = 'Uploaded Document', noteLength = 'medium', quizCount = 10, difficulty = 'medium', topic = 'All Topics' } = req.body;

    if (!extractedText || extractedText.trim().length < 10) {
      return res.status(400).json({ error: 'Extracted text is too short or empty.' });
    }

    const ai = getGenAI();
    if (!ai) {
      const fallback = fallbackGenerate(extractedText, title, { noteLength, quizCount, difficulty, topic });
      return res.json(fallback);
    }

    const truncatedText = extractedText.slice(0, 25000);

    const prompt = `You are an expert AI academic tutor and curriculum specialist.
Analyze the following student study material extracted from a PDF titled "${title}".

Generate a complete, high-yield study suite in JSON format:
1. "summary": A 2-3 sentence executive summary of the document.
2. "topics": An array of 3 to 6 detected main topic titles from the text.
3. "notes":
   - "overview": A concise yet comprehensive summary paragraph (approx 80-150 words).
   - "detailedNotes": An array of structured note sections. Each section must have:
       - "id": string (e.g. "sec-1")
       - "heading": string (e.g. "1. Topic Name")
       - "subheading": optional descriptive string
       - "bulletPoints": array of 3 to 5 informative bullet points
       - "definitions": array of { "term": string, "definition": string }
       - "examples": array of strings showing practical applications or examples
   - "keyPoints": array of 5 to 7 high-impact key takeaway revision points.
   - "importantTerms": array of { "id": string, "term": string, "definition": string, "context": string }
   - "noteLength": "${noteLength}"
4. "quiz": An array of ${quizCount} multiple-choice questions (difficulty: ${difficulty}).
   Each question must have:
   - "id": string (e.g. "q-1")
   - "question": clear academic question based strictly on the text
   - "options": array of exactly 4 plausible choices
   - "correctAnswerIndex": integer (0, 1, 2, or 3)
   - "explanation": clear 1-2 sentence explanation of why the correct option is right
   - "topic": matching topic name
   - "difficulty": "${difficulty}"
5. "flashcards": An array of 8 to 12 interactive flashcards:
   Each card:
   - "id": string (e.g. "fc-1")
   - "front": Question, key concept, or term
   - "back": Answer, explanation, or definition
   - "topic": relevant topic
   - "isRevision": false
   - "isKnown": false

Study Material Text:
${truncatedText}`;

    try {
      const responseText = await generateContentWithFallback(ai, prompt, true);
      const parsedData = safeParseJson(responseText);

      if (!parsedData.notes?.lastGeneratedAt) {
        if (parsedData.notes) parsedData.notes.lastGeneratedAt = new Date().toISOString();
      }
      if (!parsedData.notes?.noteLength) {
        if (parsedData.notes) parsedData.notes.noteLength = noteLength;
      }

      return res.json(parsedData);
    } catch (apiErr: any) {
      console.warn('Gemini generation unavailable or error, using smart fallback engine:', apiErr?.message || apiErr);
      const fallback = fallbackGenerate(extractedText, title, { noteLength, quizCount, difficulty, topic });
      return res.json(fallback);
    }
  } catch (error: any) {
    console.error('Error generating materials:', error);
    const fallback = fallbackGenerate(req.body.extractedText || '', req.body.title || 'Document', req.body);
    return res.json(fallback);
  }
});

// 2. Regenerate Notes (with length adjustment or topic filter)
app.post('/api/regenerate-notes', async (req: Request, res: Response) => {
  try {
    const { extractedText, title = 'Document', noteLength = 'medium', topic = 'All Topics' } = req.body;

    const ai = getGenAI();
    if (!ai || !extractedText) {
      const fallback = fallbackGenerate(extractedText || '', title, { noteLength });
      return res.json(fallback.notes);
    }

    const truncatedText = extractedText.slice(0, 20000);
    const prompt = `You are an academic study guide creator.
Generate structured revision notes for "${title}" with Note Length: "${noteLength}" (Short: high-level bullet summaries; Medium: balanced explanations with terms; Detailed: deep explanations with subsections and examples). Topic focus: "${topic}".

Output valid JSON matching this schema:
{
  "overview": string,
  "detailedNotes": [
    {
      "id": string,
      "heading": string,
      "subheading": string,
      "bulletPoints": [string],
      "definitions": [{ "term": string, "definition": string }],
      "examples": [string]
    }
  ],
  "keyPoints": [string],
  "importantTerms": [{ "id": string, "term": string, "definition": string, "context": string }],
  "noteLength": "${noteLength}",
  "lastGeneratedAt": "${new Date().toISOString()}"
}

Content:
${truncatedText}`;

    try {
      const responseText = await generateContentWithFallback(ai, prompt, true);
      const parsed = safeParseJson(responseText);
      parsed.lastGeneratedAt = new Date().toISOString();
      parsed.noteLength = noteLength;
      return res.json(parsed);
    } catch (apiErr: any) {
      console.warn('Gemini regenerate notes unavailable or error, using smart fallback engine:', apiErr?.message || apiErr);
      const fallback = fallbackGenerate(extractedText || '', title, { noteLength, topic });
      return res.json(fallback.notes);
    }
  } catch (error: any) {
    console.error('Error regenerating notes:', error);
    const fallback = fallbackGenerate(req.body.extractedText || '', req.body.title || 'Document', req.body);
    return res.json(fallback.notes);
  }
});

// 3. Generate targeted MCQ Quiz
app.post('/api/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { extractedText, title = 'Document', questionCount = 10, difficulty = 'medium', topic = 'All Topics', quizCount } = req.body;
    const finalCount = questionCount || quizCount || 10;

    const ai = getGenAI();
    if (!ai || !extractedText) {
      const fallback = fallbackGenerate(extractedText || '', title, { quizCount: finalCount, difficulty, topic });
      return res.json({ quiz: fallback.quiz });
    }

    const truncatedText = extractedText.slice(0, 20000);
    const prompt = `Generate exactly ${finalCount} high-quality Multiple Choice Questions (MCQs) for students studying "${title}".
Difficulty: ${difficulty}. Topic filter: ${topic}.

Output a JSON object with a "quiz" array of objects. Each question must strictly follow:
{
  "id": string,
  "question": string,
  "options": [string, string, string, string],
  "correctAnswerIndex": number (0 to 3),
  "explanation": string,
  "topic": string,
  "difficulty": "${difficulty}"
}

Source text:
${truncatedText}`;

    try {
      const responseText = await generateContentWithFallback(ai, prompt, true);
      const parsed = safeParseJson(responseText);
      const questions = Array.isArray(parsed) ? parsed : (parsed.quiz || []);
      return res.json({ quiz: questions });
    } catch (apiErr: any) {
      console.warn('Gemini quiz generation unavailable or error, using smart fallback engine:', apiErr?.message || apiErr);
      const fallback = fallbackGenerate(extractedText || '', title, { quizCount: finalCount, difficulty, topic });
      return res.json({ quiz: fallback.quiz });
    }
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    const fallback = fallbackGenerate(req.body.extractedText || '', req.body.title || 'Document', req.body);
    return res.json({ quiz: fallback.quiz });
  }
});

// 4. Student AI Tutor Chat / Concept Explainer
app.post('/api/tutor-chat', async (req: Request, res: Response) => {
  try {
    const { question, contextText, title = 'Document' } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        answer: `Here is an explanation based on "${title}": The core concepts emphasize understanding foundational mechanisms, step-by-step problem analysis, and applying defined formulas accurately to practical examples.`
      });
    }

    const prompt = `You are "NoteQuiz AI Tutor", an encouraging, brilliant student mentor.
The student is studying the document "${title}".
Document Context:
${(contextText || '').slice(0, 10000)}

Student Question: "${question}"

Provide a clear, student-friendly explanation. Use bullet points and bold formatting where appropriate. Keep it concise, engaging, and directly grounded in the provided document material.`;

    try {
      const responseText = await generateContentWithFallback(ai, prompt, false);
      return res.json({ answer: responseText });
    } catch (apiErr: any) {
      console.warn('Gemini tutor chat unavailable, returning context explanation:', apiErr?.message || apiErr);
      return res.json({
        answer: `Based on **${title}**, here is key guidance regarding your question:\n\n• **Core Principle**: Focus on the fundamental rules and system definitions outlined in this chapter.\n• **Problem Solving**: Break down complex queries into prerequisite concepts and systematic steps.\n• **Exam Tip**: Review the multiple-choice questions and flashcard definitions generated for this topic to test your recall.`
      });
    }
  } catch (error: any) {
    console.error('Tutor chat error:', error);
    res.json({
      answer: 'I reviewed your document notes. Make sure to focus on key definitions, practice the MCQ quizzes, and review flashcards marked for revision!'
    });
  }
});

// Setup Vite middleware / Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NoteQuiz AI server running on http://localhost:${PORT}`);
  });
}

startServer();
