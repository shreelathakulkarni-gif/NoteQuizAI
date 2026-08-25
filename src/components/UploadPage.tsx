import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UploadCloud, 
  FileText, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  HelpCircle,
  FileCheck,
  RefreshCw,
  Zap
} from 'lucide-react';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { DocumentData } from '../types';
import { NoteQuizLogo } from './NoteQuizLogo';

export const UploadPage: React.FC = () => {
  const { addDocument, setActiveTab, settings, addToast } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0); // 1: Uploading, 2: Extracting, 3: Analyzing, 4: Generating
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedSnippet, setExtractedSnippet] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setErrorMessage(null);
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMessage('Invalid file type. Please upload a valid PDF document (.pdf).');
      return;
    }

    if (file.size > 35 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 35MB limit. Please upload a smaller PDF.');
      return;
    }

    setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startProcessing = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStep(1);
    setProgressPercent(15);

    try {
      // Step 1: Uploading & Reading file buffer
      await new Promise(r => setTimeout(r, 600));
      setCurrentStep(2);
      setProgressPercent(40);

      // Step 2: Extracting Text
      const extracted = await extractTextFromPDF(selectedFile);
      setExtractedSnippet(extracted.previewSnippet);

      if (!extracted.text || extracted.text.trim().length < 40) {
        throw new Error('This PDF contains very little or no readable text. It may be a scanned image-only PDF without OCR.');
      }

      await new Promise(r => setTimeout(r, 500));
      setCurrentStep(3);
      setProgressPercent(70);

      // Step 3: AI Analyzing Content & Generating Study Materials
      const docTitle = selectedFile.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
      
      const payload = {
        extractedText: extracted.text,
        title: docTitle,
        noteLength: settings.defaultNoteLength,
        quizCount: settings.defaultQuizCount,
        difficulty: settings.defaultQuizDifficulty,
      };

      setCurrentStep(4);
      setProgressPercent(88);

      const response = await fetch('/api/generate-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Server error while generating study materials.');
      }

      const generatedData = await response.json();
      setProgressPercent(100);

      const newDoc: DocumentData = {
        id: 'doc-' + Date.now(),
        title: docTitle,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        pageCount: extracted.pageCount || 1,
        uploadedAt: new Date().toISOString(),
        extractedText: extracted.text,
        status: 'ready',
        topics: generatedData.topics || ['General Topics'],
        summary: generatedData.summary || 'Summary generated from uploaded PDF material.',
        notes: generatedData.notes || {
          overview: 'Overview generated from PDF material.',
          detailedNotes: [],
          keyPoints: [],
          importantTerms: [],
          noteLength: settings.defaultNoteLength,
          lastGeneratedAt: new Date().toISOString()
        },
        quiz: generatedData.quiz || [],
        flashcards: generatedData.flashcards || [],
        quizHistory: [],
      };

      // Add to store and transition to notes
      await new Promise(r => setTimeout(r, 600));
      addDocument(newDoc);
      setActiveTab('notes');

    } catch (err: any) {
      console.error('Processing error:', err);
      setErrorMessage(err.message || 'An error occurred while processing the PDF.');
      setIsProcessing(false);
      setProgressPercent(0);
      setCurrentStep(0);
    }
  };

  const loadPresetSample = async (presetName: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStep(1);
    setProgressPercent(20);

    let sampleText = '';
    let title = '';

    if (presetName === 'cs') {
      title = 'Data Structures & Algorithmic Complexity';
      sampleText = `DATA STRUCTURES AND ALGORITHM ANALYSIS
Chapter 3: Asymptotic Notations and Binary Search Trees

1. ASYMPTOTIC RUNTIME COMPLEXITY
Asymptotic analysis describes the limiting behavior of an algorithm execution time as input size n approaches infinity.
- Big-O Notation (O): Represents the formal upper bound on worst-case time complexity. E.g., Linear Search is O(n), Binary Search on sorted array is O(log n).
- Omega Notation (Ω): Represents asymptotic lower bound (best-case performance).
- Theta Notation (Θ): Represents tight asymptotic bound where upper and lower bounds coincide.

2. TREE STRUCTURES & BINARY SEARCH TREES (BST)
A Binary Search Tree is a node-based binary tree data structure with the invariant property:
- For any node x, all keys in the left subtree are strictly less than key(x).
- All keys in the right subtree are strictly greater than key(x).
Operations:
- Search: Average case O(log n) when balanced, worst case O(n) for degenerate skewed trees.
- Insertion & Deletion: O(h) where h is the tree height.
- Self-Balancing Trees (AVL Trees, Red-Black Trees) maintain height h = O(log n) via tree rotations.`;
    } else if (presetName === 'econ') {
      title = 'Principles of Macroeconomics: Inflation & Monetary Policy';
      sampleText = `PRINCIPLES OF MACROECONOMICS
Module 5: Aggregate Demand, Inflation Dynamics & Central Bank Tools

1. INFLATION MEASUREMENT & CAUSES
Inflation is the sustained increase in the general price level of goods and services over time, eroding purchasing power.
- Demand-Pull Inflation: Occurs when aggregate demand for goods exceeds the economy productive capacity ('too much money chasing too few goods').
- Cost-Push Inflation: Occurs when supply-side shocks or raw material price spikes shift the short-run aggregate supply curve leftward.

2. CENTRAL BANK MONETARY POLICY
The Federal Reserve regulates macroeconomic stability through three primary instruments:
- Open Market Operations: Buying government bonds injects liquidity into commercial banking reserves, lowering the Federal Funds Rate.
- Reserve Requirements: Minimum percentage of deposits institutions must hold in reserve.
- Discount Rate: The interest rate charged to commercial banks borrowing from the central bank discount window.`;
    } else {
      title = 'Quantum Physics & Wave-Particle Duality';
      sampleText = `QUANTUM MECHANICS FUNDAMENTALS
Section 2: The Photoelectric Effect & Schrödinger Wave Equation

1. WAVE-PARTICLE DUALITY
Electromagnetic radiation exhibits both wave-like characteristics (diffraction, interference) and particle-like characteristics (discrete photon energy quanta E = h*f).
- De Broglie Wavelength: lambda = h / p, establishing that all matter with momentum p has an associated quantum wavelength.

2. THE SCHRÖDINGER WAVE EQUATION
The time-dependent Schrödinger equation governing non-relativistic quantum states:
i*hbar * d(psi)/dt = H(psi)
where psi represents the complex probability wave function, and |psi|^2 yields the probability density of locating a particle.`;
    }

    try {
      await new Promise(r => setTimeout(r, 600));
      setCurrentStep(2);
      setProgressPercent(50);
      await new Promise(r => setTimeout(r, 600));
      setCurrentStep(3);
      setProgressPercent(75);

      const response = await fetch('/api/generate-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extractedText: sampleText,
          title: title,
          noteLength: 'medium',
          quizCount: 10,
          difficulty: 'medium',
        }),
      });

      setCurrentStep(4);
      setProgressPercent(95);

      const data = await response.json();
      setProgressPercent(100);

      const newDoc: DocumentData = {
        id: 'doc-' + Date.now(),
        title: title,
        fileName: `${title.replace(/\s+/g, '_')}.pdf`,
        fileSize: 1540000,
        pageCount: 8,
        uploadedAt: new Date().toISOString(),
        extractedText: sampleText,
        status: 'ready',
        topics: data.topics || ['Core Principles'],
        summary: data.summary || `Comprehensive study suite for ${title}.`,
        notes: data.notes,
        quiz: data.quiz || [],
        flashcards: data.flashcards || [],
        quizHistory: [],
      };

      await new Promise(r => setTimeout(r, 400));
      addDocument(newDoc);
      setActiveTab('notes');
    } catch (err: any) {
      setErrorMessage('Could not generate sample preset.');
      setIsProcessing(false);
    }
  };

  const steps = [
    { num: 1, label: 'Uploading PDF', desc: 'Validating and reading file binary' },
    { num: 2, label: 'Extracting Text', desc: 'Parsing pages, headings, and structure' },
    { num: 3, label: 'AI Analyzing Content', desc: 'Detecting concepts and key definitions' },
    { num: 4, label: 'Generating Study Materials', desc: 'Synthesizing notes, MCQs & flashcards' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3d4a3e] dark:text-white tracking-tight">
          Upload PDF Study Material
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
          Drop your lecture slides, academic papers, or textbook chapters. AI will automatically generate smart notes, quizzes, and flashcards.
        </p>
      </div>

      {/* Error state */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-rose-800 dark:text-rose-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Upload Failed</p>
            <p className="text-xs mt-0.5 text-rose-700 dark:text-rose-300">{errorMessage}</p>
          </div>
          <button
            id="dismiss-upload-error-btn"
            onClick={() => setErrorMessage(null)}
            className="text-xs font-semibold text-rose-600 hover:underline shrink-0"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Processing State Modal / Card */}
      {isProcessing ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-[#26221f] border border-[#e8dfd1] dark:border-[#3b352f] shadow-xl text-center">
          <div className="flex justify-center mb-6">
            <NoteQuizLogo variant="icon" size="xl" className="animate-bounce duration-1000 shadow-md" />
          </div>

          <h3 className="text-xl font-bold text-[#5e4b35] dark:text-white mb-1">
            Generating Your AI Study Materials
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-8 max-w-md mx-auto">
            Please wait a few seconds while our Scholar AI analyzes your document content, extracts key definitions, and formats interactive quizzes.
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between text-xs font-semibold text-stone-600 dark:text-stone-300 mb-2">
              <span>Overall Progress</span>
              <span className="text-[#5f7464] dark:text-[#a7c2a9]">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-[#f3f4ee] dark:bg-[#181f1a] rounded-full overflow-hidden p-0.5 border border-[#ecebe4] dark:border-[#2e3a31]">
              <div
                className="h-full bg-[#5f7464] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 4 Steps Checklist */}
          <div className="max-w-md mx-auto grid grid-cols-1 gap-3 text-left">
            {steps.map((s) => {
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div
                  key={s.num}
                  className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-[#f3f4ee] dark:bg-[#263128] border-[#5f7464] dark:border-[#a7c2a9] text-[#3d4a3e] dark:text-[#cbdbcc]'
                      : isDone
                      ? 'bg-[#fafaf8] dark:bg-[#202922] border-[#ecebe4] dark:border-[#2e3a31] text-stone-700 dark:text-stone-300'
                      : 'bg-[#fafaf8]/50 dark:bg-[#1c241e] border-[#ecebe4]/60 dark:border-[#2e3a31]/60 text-stone-400'
                  }`}
                >
                  <div className="shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-[#5f7464]" />
                    ) : isCurrent ? (
                      <div className="w-5 h-5 border-2 border-[#5f7464] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-[#ecebe4] dark:border-[#2e3a31] flex items-center justify-center text-[10px] font-bold text-stone-400">
                        {s.num}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-tight">{s.label}</p>
                    <p className="text-[11px] opacity-75 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div className="space-y-6">
          <div
            id="pdf-dropzone"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
            className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-[#5f7464] bg-[#f3f4ee] dark:bg-[#263128] scale-[1.01]'
                : selectedFile
                ? 'border-[#ecebe4] dark:border-[#2e3a31] bg-white dark:bg-[#202922] cursor-default'
                : 'border-[#ecebe4] dark:border-[#2e3a31] hover:border-[#5f7464] hover:bg-[#fafaf8] dark:hover:bg-[#263128]/50 bg-white dark:bg-[#202922]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInput}
              className="hidden"
            />

            {!selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#f3f4ee] dark:bg-[#263128] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center mb-4 shadow-xs border border-[#ecebe4] dark:border-[#2e3a31]">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#3d4a3e] dark:text-white">
                  Drag & Drop your PDF here
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  or <span className="text-[#5f7464] dark:text-[#a7c2a9] font-semibold underline">click to browse</span>
                </p>
                <div className="mt-4 flex items-center gap-4 text-[11px] text-stone-400">
                  <span>Supports .pdf format</span>
                  <span>•</span>
                  <span>Up to 35MB</span>
                  <span>•</span>
                  <span>Instant OCR text extraction</span>
                </div>
              </div>
            ) : (
              /* Selected File Card */
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] text-left">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[#5f7464] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#3d4a3e] dark:text-white truncate">
                      {selectedFile.name}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id="remove-selected-pdf-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedFile();
                    }}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    id="start-generate-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      startProcessing();
                    }}
                    className="py-2.5 px-5 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Materials</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Academic Presets (Try sample materials) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31]">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-[#5f7464] dark:text-[#a7c2a9]" />
              <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Don't have a PDF ready? Test with Sample Course Materials
              </h4>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              Click any subject below to load realistic university course material and test notes, quizzes, and flashcards instantly:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                id="preset-cs-btn"
                onClick={() => loadPresetSample('cs')}
                className="p-3 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] border border-[#ecebe4] dark:border-[#2e3a31] text-left transition-colors group"
              >
                <p className="text-xs font-bold text-[#3d4a3e] dark:text-white group-hover:text-[#5f7464] dark:group-hover:text-[#a7c2a9] transition-colors">
                  💻 Computer Science
                </p>
                <p className="text-[11px] text-stone-400 mt-1 truncate">
                  Data Structures & Asymptotic Big-O
                </p>
              </button>

              <button
                id="preset-econ-btn"
                onClick={() => loadPresetSample('econ')}
                className="p-3 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] border border-[#ecebe4] dark:border-[#2e3a31] text-left transition-colors group"
              >
                <p className="text-xs font-bold text-[#3d4a3e] dark:text-white group-hover:text-[#5f7464] dark:group-hover:text-[#a7c2a9] transition-colors">
                  📈 Macroeconomics
                </p>
                <p className="text-[11px] text-stone-400 mt-1 truncate">
                  Inflation & Monetary Policy Tools
                </p>
              </button>

              <button
                id="preset-physics-btn"
                onClick={() => loadPresetSample('physics')}
                className="p-3 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] border border-[#ecebe4] dark:border-[#2e3a31] text-left transition-colors group"
              >
                <p className="text-xs font-bold text-[#3d4a3e] dark:text-white group-hover:text-[#5f7464] dark:group-hover:text-[#a7c2a9] transition-colors">
                  ⚛️ Quantum Physics
                </p>
                <p className="text-[11px] text-stone-400 mt-1 truncate">
                  Wave-Particle Duality & Schrödinger
                </p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
