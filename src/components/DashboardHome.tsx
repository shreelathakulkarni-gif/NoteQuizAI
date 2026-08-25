import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  TrendingUp, 
  Upload, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Award,
  Play,
  RotateCcw
} from 'lucide-react';
import { PomodoroTimer } from './PomodoroTimer';
import { StudyCalendar } from './StudyCalendar';
import { StudyGoals } from './StudyGoals';

export const DashboardHome: React.FC = () => {
  const { 
    documents, 
    activeDocument, 
    setActiveDocumentId, 
    setActiveTab, 
    user 
  } = useApp();

  // Compute overall stats across all documents
  const totalPdfs = documents.length;
  const notesGenerated = documents.filter(d => d.notes && d.notes.detailedNotes?.length > 0).length;
  const totalFlashcards = documents.reduce((acc, doc) => acc + (doc.flashcards?.length || 0), 0);
  
  // Aggregate all quiz attempts across documents
  const allAttempts = documents.flatMap(d => d.quizHistory || []);
  const quizzesCompleted = allAttempts.length;
  const averageQuizScore = quizzesCompleted > 0
    ? Math.round(allAttempts.reduce((acc, a) => acc + a.percentage, 0) / quizzesCompleted)
    : 0;

  // Flashcards known/mastered
  const totalKnownCards = documents.reduce(
    (acc, doc) => acc + (doc.flashcards?.filter(fc => fc.isKnown)?.length || 0),
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Welcome & Primary Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#5f7464] dark:bg-[#28342a] p-6 sm:p-8 text-white shadow-md border border-[#506354] dark:border-[#354439]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Smart Study Assistant Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="mt-2 text-sm text-[#e8ebe8] leading-relaxed">
              You have <strong className="text-white underline decoration-white/40">{totalPdfs} study documents</strong> ready. Turn your lecture PDFs into instant notes, practice high-yield MCQs, and review key flashcards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="dash-upload-primary-btn"
              onClick={() => setActiveTab('upload')}
              className="py-3 px-5 rounded-2xl bg-[#fdfcf8] text-[#3d4a3e] hover:bg-[#f3f4ee] font-bold text-sm shadow-sm transition-all flex items-center gap-2 group"
            >
              <Upload className="w-4 h-4 text-[#5f7464] group-hover:scale-110 transition-transform" />
              <span>Upload New PDF</span>
            </button>
            {activeDocument && (
              <button
                id="dash-quick-quiz-btn"
                onClick={() => setActiveTab('quiz')}
                className="py-3 px-5 rounded-2xl bg-[#506354] hover:bg-[#435246] text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2 shadow-xs"
              >
                <Play className="w-4 h-4 text-amber-200 fill-amber-200" />
                <span>Start Quiz</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient background decoration with cool stationery elements */}
        <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Subtle decorative stationery motifs inside hero banner */}
        <div className="absolute right-6 -bottom-4 hidden lg:flex items-end gap-3 opacity-25 pointer-events-none select-none">
          {/* Compass motif */}
          <div className="w-16 h-16 transform -rotate-12">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
              <circle cx="50" cy="18" r="5" />
              <line x1="50" y1="13" x2="50" y2="6" strokeWidth="2" />
              <path d="M47 22 L28 85 L25 94" />
              <path d="M53 22 L72 80" />
              <rect x="68" y="76" width="10" height="8" rx="1" />
              <path d="M38 52 Q50 60 62 52" strokeDasharray="2 2" />
            </svg>
          </div>
          {/* Backpack motif */}
          <div className="w-20 h-20 transform rotate-6">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
              <path d="M42 25 C42 15, 58 15, 58 25" strokeWidth="3" />
              <rect x="25" y="25" width="50" height="60" rx="12" />
              <path d="M30 42 Q50 36 70 42" strokeDasharray="2 2" />
              <rect x="33" y="52" width="34" height="25" rx="6" />
              <line x1="38" y1="58" x2="62" y2="58" strokeDasharray="2 1" />
            </svg>
          </div>
          {/* Pencil & Eraser motif */}
          <div className="w-16 h-16 transform -rotate-25">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
              <rect x="15" y="40" width="50" height="10" rx="1" />
              <polygon points="65,40 80,45 65,50" />
              <rect x="8" y="40" width="7" height="10" />
              <path d="M2 40 L8 40 L8 50 L2 50 Q0 45 2 40" />
              {/* Wedge eraser next to pencil */}
              <path d="M45 75 L75 75 L85 88 L55 88 Z" fill="currentColor" fillOpacity="0.2" />
              <path d="M45 75 L75 75 L70 65 L40 65 Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Stat 1 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold">Total PDFs</span>
            <div className="w-8 h-8 rounded-lg bg-[#f3f4ee] dark:bg-[#2a342b] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#3d4a3e] dark:text-white">{totalPdfs}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Uploaded materials</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold">Notes Generated</span>
            <div className="w-8 h-8 rounded-lg bg-[#f3f4ee] dark:bg-[#2a342b] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#3d4a3e] dark:text-white">{notesGenerated}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Study guide suites</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold">Quizzes Taken</span>
            <div className="w-8 h-8 rounded-lg bg-[#f3f4ee] dark:bg-[#2a342b] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#3d4a3e] dark:text-white">{quizzesCompleted}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Completed sessions</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold">Flashcards</span>
            <div className="w-8 h-8 rounded-lg bg-[#f3f4ee] dark:bg-[#2a342b] text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#3d4a3e] dark:text-white">{totalFlashcards}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              {totalKnownCards} cards mastered
            </p>
          </div>
        </div>

        {/* Stat 5 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold">Avg. Score</span>
            <div className="w-8 h-8 rounded-lg bg-[#f3f4ee] dark:bg-[#2a342b] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#3d4a3e] dark:text-white">
              {averageQuizScore}%
            </p>
            <p className="text-[11px] text-[#5f7464] dark:text-[#a7c2a9] font-semibold mt-0.5">
              ★ Strong Mastery
            </p>
          </div>
        </div>
      </div>

      {/* 3. Study Goals & Targets Tracker */}
      <StudyGoals />

      {/* 4. Pomodoro Study Timer */}
      <PomodoroTimer />

      {/* 5. Visual Study Calendar & Exam Deadlines */}
      <StudyCalendar />

      {/* 6. Active Study Document Spotlight */}
      {activeDocument && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ecebe4] dark:border-[#2e3a31]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5f7464] dark:text-[#a7c2a9]">
                  Currently Studying
                </span>
                <span className="text-xs text-stone-400">• {activeDocument.pageCount} Pages</span>
              </div>
              <h3 className="text-xl font-bold text-[#3d4a3e] dark:text-white mt-1">
                {activeDocument.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="spotlight-notes-btn"
                onClick={() => setActiveTab('notes')}
                className="py-2 px-3.5 rounded-xl bg-[#f3f4ee] dark:bg-[#2a342b] hover:bg-[#e7eae1] text-[#3d4a3e] dark:text-[#cbdbcc] text-xs font-bold transition-colors flex items-center gap-1.5 border border-[#e5e5df] dark:border-[#354439]"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#5f7464]" />
                Notes
              </button>
              <button
                id="spotlight-quiz-btn"
                onClick={() => setActiveTab('quiz')}
                className="py-2 px-3.5 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Quiz ({activeDocument.quiz.length} Qs)
              </button>
              <button
                id="spotlight-flashcards-btn"
                onClick={() => setActiveTab('flashcards')}
                className="py-2 px-3.5 rounded-xl bg-[#f3f4ee] dark:bg-[#2a342b] hover:bg-[#e7eae1] text-[#3d4a3e] dark:text-[#cbdbcc] text-xs font-bold transition-colors flex items-center gap-1.5 border border-[#e5e5df] dark:border-[#354439]"
              >
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                Flashcards ({activeDocument.flashcards.length})
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-4 leading-relaxed line-clamp-2">
            {activeDocument.summary}
          </p>

          {/* Topics Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {activeDocument.topics.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs rounded-lg bg-[#f3f4ee] dark:bg-[#2a342b] text-[#3d4a3e] dark:text-[#cbdbcc] border border-[#ecebe4] dark:border-[#2e3a31] font-medium"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Recent Activity & Document Library Quick Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents (2 columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#3d4a3e] dark:text-white">
              Recently Uploaded PDFs
            </h3>
            <button
              id="view-all-documents-btn"
              onClick={() => setActiveTab('documents')}
              className="text-xs font-bold text-[#5f7464] dark:text-[#a7c2a9] hover:underline flex items-center gap-1"
            >
              View All ({documents.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {documents.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                id={`recent-doc-row-${doc.id}`}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#2d3a30] border border-[#ecebe4] dark:border-[#2e3a31] transition-all group"
              >
                <div 
                  className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                  onClick={() => {
                    setActiveDocumentId(doc.id);
                    setActiveTab('notes');
                  }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#f3f4ee] dark:bg-[#202922] text-[#5f7464] dark:text-[#a7c2a9] border border-[#ecebe4] dark:border-[#354439] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#3d4a3e] dark:text-white truncate group-hover:text-[#5f7464] transition-colors">
                      {doc.title}
                    </h4>
                    <p className="text-xs text-stone-400 flex items-center gap-2 mt-0.5">
                      <span>{doc.pageCount} pages</span>
                      <span>•</span>
                      <span>{doc.quiz.length} MCQs</span>
                      <span>•</span>
                      <span>{doc.flashcards.length} Cards</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <button
                    id={`open-notes-${doc.id}`}
                    onClick={() => {
                      setActiveDocumentId(doc.id);
                      setActiveTab('notes');
                    }}
                    className="p-2 rounded-lg bg-white dark:bg-[#202922] hover:bg-[#f3f4ee] dark:hover:bg-[#2a342b] text-[#3d4a3e] dark:text-[#cbdbcc] hover:text-[#5f7464] border border-[#ecebe4] dark:border-[#2e3a31] transition-colors text-xs font-semibold shadow-xs"
                    title="View Notes"
                  >
                    <BookOpen className="w-4 h-4 text-[#5f7464]" />
                  </button>
                  <button
                    id={`open-quiz-${doc.id}`}
                    onClick={() => {
                      setActiveDocumentId(doc.id);
                      setActiveTab('quiz');
                    }}
                    className="p-2 rounded-lg bg-white dark:bg-[#202922] hover:bg-[#5f7464] hover:text-white text-[#3d4a3e] dark:text-[#cbdbcc] border border-[#ecebe4] dark:border-[#2e3a31] transition-colors text-xs font-semibold shadow-xs"
                    title="Take Quiz"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quiz Scores & Progress (1 column) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#3d4a3e] dark:text-white">
                Recent Quiz Scores
              </h3>
              <button
                id="view-all-progress-btn"
                onClick={() => setActiveTab('progress')}
                className="text-xs font-bold text-[#5f7464] dark:text-[#a7c2a9] hover:underline"
              >
                Analytics
              </button>
            </div>

            {allAttempts.length === 0 ? (
              <div className="py-8 text-center text-stone-400 text-xs">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#5f7464]" />
                <p>No quizzes taken yet.</p>
                <button
                  id="take-first-quiz-btn"
                  onClick={() => setActiveTab('quiz')}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-[#5f7464] hover:bg-[#506354] text-white font-semibold text-xs shadow-xs"
                >
                  Take Your First Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {allAttempts.slice(0, 4).map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-[#3d4a3e] dark:text-white truncate">
                        {att.documentTitle}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        {new Date(att.date).toLocaleDateString()} • {att.difficulty}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        att.percentage >= 80 
                          ? 'bg-[#e5ebe5] dark:bg-[#2d3a30] text-[#3d4a3e] dark:text-[#cbdbcc] border border-[#cbdbcc] dark:border-[#3d4a3e]' 
                          : att.percentage >= 60
                          ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
                      }`}>
                        {att.score}/{att.totalQuestions} ({att.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#ecebe4] dark:border-[#2e3a31]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f3f4ee] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31]">
              <Flame className="w-5 h-5 text-orange-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#3d4a3e] dark:text-white">Active 3-Day Study Streak!</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Keep practicing daily to build concept retention.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
