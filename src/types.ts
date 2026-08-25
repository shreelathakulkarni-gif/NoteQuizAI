export type NoteLength = 'short' | 'medium' | 'detailed';
export type QuizDifficulty = 'easy' | 'medium' | 'hard';
export type DocumentStatus = 'ready' | 'processing' | 'error';
export type AppTheme = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  bio?: string;
  institution?: string;
  major?: string;
}

export interface NoteDefinition {
  term: string;
  definition: string;
}

export interface NoteSection {
  id: string;
  heading: string;
  subheading?: string;
  bulletPoints: string[];
  definitions?: NoteDefinition[];
  examples?: string[];
}

export interface TermItem {
  id: string;
  term: string;
  definition: string;
  context?: string;
  category?: string;
}

export interface NotesData {
  overview: string;
  detailedNotes: NoteSection[];
  keyPoints: string[];
  importantTerms: TermItem[];
  noteLength: NoteLength;
  lastGeneratedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  topic: string;
  difficulty: QuizDifficulty;
}

export interface QuizAttempt {
  id: string;
  documentId: string;
  documentTitle: string;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  difficulty: QuizDifficulty;
  timeSpentSeconds?: number;
  topic?: string;
  answers?: {
    questionId: string;
    questionText: string;
    selectedOptionIndex: number;
    correctOptionIndex: number;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic: string;
  isRevision?: boolean;
  isStarred?: boolean;
  isKnown: boolean;
}

export type FlashcardItem = Flashcard;

export interface DocumentData {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  uploadedAt: string;
  extractedText: string;
  status: DocumentStatus;
  topics: string[];
  summary: string;
  notes: NotesData;
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
  quizHistory: QuizAttempt[];
}

export interface UserSettings {
  theme: AppTheme;
  defaultNoteLength: NoteLength;
  defaultQuizDifficulty: QuizDifficulty;
  defaultQuizCount: number;
  notifications: boolean;
  autoPlayAudio: boolean;
  soundEffects?: boolean;
}

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface GlobalSearchResult {
  id: string;
  type: 'document' | 'note' | 'quiz' | 'flashcard' | 'term';
  title: string;
  subtitle: string;
  documentId: string;
  targetTab?: string;
  targetId?: string;
}
