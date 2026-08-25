import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HelpCircle, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Timer, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Sliders, 
  ChevronRight,
  RefreshCw,
  Zap,
  Clock,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizDifficulty, QuizQuestion, QuizAttempt } from '../types';

export const QuizPlayer: React.FC = () => {
  const { activeDocument, updateDocument, addToast, setActiveTab, settings } = useApp();

  // Mode: 'config' | 'playing' | 'results'
  const [viewState, setViewState] = useState<'config' | 'playing' | 'results'>('config');

  // Configuration options
  const [questionCount, setQuestionCount] = useState<number>(settings.defaultQuizCount || 10);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>(settings.defaultQuizDifficulty || 'medium');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [instantFeedback, setInstantFeedback] = useState<boolean>(true);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true);

  // Active quiz state
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isGeneratingNewQuiz, setIsGeneratingNewQuiz] = useState<boolean>(false);

  // Review mode filter on results screen
  const [resultsFilter, setResultsFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  // Timer interval
  useEffect(() => {
    let interval: any;
    if (viewState === 'playing' && timerEnabled && !isSubmitted) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewState, timerEnabled, isSubmitted]);

  if (!activeDocument) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31]">
        <HelpCircle className="w-12 h-12 text-stone-400 mx-auto mb-3 opacity-50" />
        <h3 className="text-lg font-bold text-[#3d4a3e] dark:text-white">No Document Selected</h3>
        <p className="text-xs text-stone-500 mt-1 mb-6">Select a document from library or upload a new PDF.</p>
        <button
          id="quiz-empty-upload-btn"
          onClick={() => setActiveTab('upload')}
          className="py-2.5 px-5 bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold rounded-xl shadow-xs"
        >
          Upload PDF
        </button>
      </div>
    );
  }

  // Start Quiz with configuration
  const handleStartQuiz = () => {
    let pool = activeDocument.quiz || [];
    
    // Filter by topic if selected
    if (selectedTopic !== 'all') {
      pool = pool.filter(q => q.topic.toLowerCase() === selectedTopic.toLowerCase());
    }

    // Filter by difficulty if needed
    if (pool.length > 0) {
      const matchDiff = pool.filter(q => q.difficulty === difficulty);
      if (matchDiff.length >= 3) {
        pool = matchDiff;
      }
    }

    // Fallback if pool is small
    if (pool.length === 0) {
      pool = activeDocument.quiz || [];
    }

    // Slice to desired questionCount
    const selected = pool.slice(0, Math.min(questionCount, pool.length));

    setActiveQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setSecondsElapsed(0);
    setViewState('playing');
  };

  // Select Option for current question
  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    
    // Calculate score
    let correctCount = 0;
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const total = activeQuestions.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // Save attempt in document history
    const attempt: QuizAttempt = {
      id: 'att-' + Date.now(),
      documentId: activeDocument.id,
      documentTitle: activeDocument.title,
      date: new Date().toISOString(),
      score: correctCount,
      totalQuestions: total,
      percentage,
      difficulty,
      timeSpentSeconds: secondsElapsed,
    };

    const updatedHistory = [attempt, ...(activeDocument.quizHistory || [])];
    updateDocument(activeDocument.id, {
      quizHistory: updatedHistory,
    });

    // Fire confetti on high score (80%+)
    if (percentage >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }

    setViewState('results');
  };

  // Retake all or retake incorrect questions
  const handleRetakeQuiz = (onlyIncorrect = false) => {
    if (onlyIncorrect) {
      const incorrectQuestions = activeQuestions.filter((q, idx) => userAnswers[idx] !== q.correctAnswerIndex);
      if (incorrectQuestions.length > 0) {
        setActiveQuestions(incorrectQuestions);
      }
    }
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setSecondsElapsed(0);
    setViewState('playing');
  };

  // Generate Brand New Quiz from PDF with AI
  const handleGenerateFreshQuiz = async () => {
    setIsGeneratingNewQuiz(true);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extractedText: activeDocument.extractedText,
          title: activeDocument.title,
          quizCount: questionCount,
          difficulty,
          topic: selectedTopic !== 'all' ? selectedTopic : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate fresh questions.');

      const data = await response.json();
      const newQuestions: QuizQuestion[] = Array.isArray(data) ? data : (data.quiz || []);
      
      if (newQuestions.length === 0) {
        throw new Error('No questions returned');
      }

      // Update document with new questions
      updateDocument(activeDocument.id, {
        quiz: [...newQuestions, ...(activeDocument.quiz || [])].slice(0, 30),
      });

      setActiveQuestions(newQuestions);
      setCurrentIndex(0);
      setUserAnswers({});
      setIsSubmitted(false);
      setSecondsElapsed(0);
      setViewState('playing');

      addToast({
        type: 'success',
        title: 'Fresh Quiz Generated',
        message: `Created ${newQuestions.length} new exam questions.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: 'Could not create new questions at this time.',
      });
    } finally {
      setIsGeneratingNewQuiz(false);
    }
  };

  const currentQ = activeQuestions[currentIndex];
  const isCurrentAnswered = userAnswers[currentIndex] !== undefined;

  // Format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
  };

  // Compute results statistics
  const resultsStats = useMemo(() => {
    let correct = 0;
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correct++;
      }
    });
    const total = activeQuestions.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const incorrect = total - correct;
    return { correct, total, pct, incorrect };
  }, [activeQuestions, userAnswers]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. QUIZ CONFIGURATION SCREEN */}
      {viewState === 'config' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white dark:bg-[#202922] p-6 sm:p-8 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#f3f4ee] dark:bg-[#263128] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center border border-[#ecebe4] dark:border-[#2e3a31]">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#3d4a3e] dark:text-white">
                  Practice Quiz: {activeDocument.title}
                </h1>
                <p className="text-xs text-stone-500">
                  Customized MCQ generator based strictly on your uploaded course PDF.
                </p>
              </div>
            </div>

            <div className="space-y-6 mt-6 pt-6 border-t border-[#ecebe4] dark:border-[#2e3a31]">
              {/* Option 1: Number of Questions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      id={`quiz-count-btn-${num}`}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                        questionCount === num
                          ? 'bg-[#5f7464] text-white border-[#5f7464] shadow-xs'
                          : 'bg-[#fafaf8] dark:bg-[#263128] text-stone-700 dark:text-stone-300 border-[#ecebe4] dark:border-[#2e3a31] hover:bg-[#f3f4ee]'
                      }`}
                    >
                      {num} MCQs
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Difficulty */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['easy', 'medium', 'hard'] as QuizDifficulty[]).map((diff) => (
                    <button
                      key={diff}
                      id={`quiz-diff-btn-${diff}`}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`py-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                        difficulty === diff
                          ? 'bg-[#3d4a3e] text-white border-[#3d4a3e] shadow-xs'
                          : 'bg-[#fafaf8] dark:bg-[#263128] text-stone-700 dark:text-stone-300 border-[#ecebe4] dark:border-[#2e3a31] hover:bg-[#f3f4ee]'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Filter by Topic */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Filter By Topic
                </label>
                <select
                  id="quiz-topic-select"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] text-[#3d4a3e] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#5f7464]"
                >
                  <option value="all">All Topics (Comprehensive Coverage)</option>
                  {activeDocument.topics.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Option 4: Study Mode Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={instantFeedback}
                    onChange={(e) => setInstantFeedback(e.target.checked)}
                    className="w-4 h-4 text-[#5f7464] accent-[#5f7464] rounded"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-[#3d4a3e] dark:text-white">Instant Feedback</p>
                    <p className="text-stone-500 text-[11px]">Show explanation right after each question</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timerEnabled}
                    onChange={(e) => setTimerEnabled(e.target.checked)}
                    className="w-4 h-4 text-[#5f7464] accent-[#5f7464] rounded"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-[#3d4a3e] dark:text-white">Practice Timer</p>
                    <p className="text-stone-500 text-[11px]">Track study pacing and speed</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button
                id="start-quiz-now-btn"
                onClick={handleStartQuiz}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#5f7464] hover:bg-[#506354] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Practice Quiz ({Math.min(questionCount, activeDocument.quiz?.length || 10)} Qs)</span>
              </button>

              <button
                id="generate-fresh-ai-quiz-btn"
                onClick={handleGenerateFreshQuiz}
                disabled={isGeneratingNewQuiz}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-800 dark:text-stone-200 font-semibold text-xs border border-[#ecebe4] dark:border-[#2e3a31] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 text-[#5f7464] dark:text-[#a7c2a9] ${isGeneratingNewQuiz ? 'animate-spin' : ''}`} />
                <span>{isGeneratingNewQuiz ? 'Synthesizing...' : 'Generate New Questions with AI'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE QUIZ PLAYER SCREEN */}
      {viewState === 'playing' && currentQ && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between bg-white dark:bg-[#202922] p-4 rounded-2xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs text-xs font-semibold text-stone-600 dark:text-stone-300">
            <div className="flex items-center gap-3">
              <button
                id="quit-quiz-btn"
                onClick={() => setViewState('config')}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-[#fafaf8] dark:hover:bg-[#263128]"
                title="Exit Quiz"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-[#3d4a3e] dark:text-white">
                Question {currentIndex + 1} of {activeQuestions.length}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#f3f4ee] dark:bg-[#263128] text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 border border-[#ecebe4] dark:border-[#2e3a31]">
                {currentQ.topic}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {timerEnabled && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#fafaf8] dark:bg-[#263128] text-stone-700 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31]">
                  <Clock className="w-3.5 h-3.5 text-[#5f7464] dark:text-[#a7c2a9]" />
                  <span className="font-mono font-bold">{formatTime(secondsElapsed)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#ecebe4] dark:bg-[#2e3a31] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#5f7464] h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-[#202922] p-6 sm:p-8 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-[#3d4a3e] dark:text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* 4 Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentIndex] === optIdx;
                const isCorrect = optIdx === currentQ.correctAnswerIndex;
                const showInstant = instantFeedback && isCurrentAnswered;

                let optionStyles = 'bg-[#fafaf8] dark:bg-[#263128] border-[#ecebe4] dark:border-[#2e3a31] text-stone-800 dark:text-stone-200 hover:bg-[#f3f4ee] dark:hover:bg-[#303d32]';

                if (showInstant) {
                  if (isCorrect) {
                    optionStyles = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optionStyles = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 font-semibold';
                  }
                } else if (isSelected) {
                  optionStyles = 'bg-[#f3f4ee] dark:bg-[#303d32] border-[#5f7464] text-[#3d4a3e] dark:text-white font-semibold';
                }

                const letter = String.fromCharCode(65 + optIdx); // 'A', 'B', 'C', 'D'

                return (
                  <button
                    key={optIdx}
                    id={`quiz-opt-${currentIndex}-${optIdx}`}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={showInstant}
                    className={`w-full flex items-start gap-3.5 p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all ${optionStyles}`}
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      showInstant && isCorrect
                        ? 'bg-emerald-600 text-white'
                        : showInstant && isSelected && !isCorrect
                        ? 'bg-rose-600 text-white'
                        : isSelected
                        ? 'bg-[#5f7464] text-white'
                        : 'bg-white dark:bg-[#303d32] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31]'
                    }`}>
                      {letter}
                    </span>
                    <span className="flex-1 mt-0.5 leading-relaxed">{opt}</span>
                    {showInstant && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    {showInstant && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback Explanation Box */}
            {instantFeedback && isCurrentAnswered && (
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed animate-in fade-in ${
                userAnswers[currentIndex] === currentQ.correctAnswerIndex
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
                  : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-950 dark:text-rose-200'
              }`}>
                <p className="font-bold mb-1">
                  {userAnswers[currentIndex] === currentQ.correctAnswerIndex ? '✓ Correct Answer' : '✗ Incorrect'}
                </p>
                <p className="opacity-90">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              id="quiz-prev-btn"
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="py-2.5 px-4 rounded-xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] text-xs font-semibold text-stone-700 dark:text-stone-300 disabled:opacity-40 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < activeQuestions.length - 1 ? (
              <button
                id="quiz-next-btn"
                onClick={() => setCurrentIndex(prev => prev + 1)}
                disabled={!isCurrentAnswered}
                className="py-2.5 px-5 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="quiz-submit-btn"
                onClick={handleSubmitQuiz}
                disabled={!isCurrentAnswered}
                className="py-2.5 px-6 rounded-xl bg-[#3d4a3e] hover:bg-[#2f3930] text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Quiz Results</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. RESULTS SCREEN */}
      {viewState === 'results' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Score Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#5f7464] text-white flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3d4a3e] dark:text-white">
              {resultsStats.pct >= 80 ? 'Outstanding Mastery! 🎉' : resultsStats.pct >= 60 ? 'Good Effort! 👍' : 'Keep Practicing! 💪'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              You scored <strong className="text-[#3d4a3e] dark:text-white font-bold">{resultsStats.correct} out of {resultsStats.total}</strong> ({resultsStats.pct}%)
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto my-6">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900">
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{resultsStats.correct}</p>
                <p className="text-[10px] text-stone-500">Correct</p>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900">
                <p className="text-lg font-black text-rose-600 dark:text-rose-400">{resultsStats.incorrect}</p>
                <p className="text-[10px] text-stone-500">Incorrect</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#f3f4ee] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31]">
                <p className="text-lg font-black text-[#5f7464] dark:text-[#a7c2a9]">{formatTime(secondsElapsed)}</p>
                <p className="text-[10px] text-stone-500">Time Spent</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                id="retake-all-quiz-btn"
                onClick={() => handleRetakeQuiz(false)}
                className="py-2.5 px-4 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake All ({resultsStats.total})</span>
              </button>

              {resultsStats.incorrect > 0 && (
                <button
                  id="retake-incorrect-quiz-btn"
                  onClick={() => handleRetakeQuiz(true)}
                  className="py-2.5 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Incorrect Only ({resultsStats.incorrect})</span>
                </button>
              )}

              <button
                id="quiz-settings-new-btn"
                onClick={() => setViewState('config')}
                className="py-2.5 px-4 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-700 dark:text-stone-200 text-xs font-semibold border border-[#ecebe4] dark:border-[#2e3a31]"
              >
                Configure New Quiz
              </button>
            </div>
          </div>

          {/* Review Answers Header & Filters */}
          <div className="flex items-center justify-between border-b border-[#ecebe4] dark:border-[#2e3a31] pb-3">
            <h3 className="text-sm font-bold text-[#3d4a3e] dark:text-white">
              Detailed Question Review
            </h3>
            <div className="flex items-center gap-1 bg-[#fafaf8] dark:bg-[#263128] p-1 rounded-xl text-xs border border-[#ecebe4] dark:border-[#2e3a31]">
              <button
                onClick={() => setResultsFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${resultsFilter === 'all' ? 'bg-white dark:bg-[#303d32] text-[#5f7464] dark:text-[#a7c2a9] shadow-xs' : 'text-stone-500'}`}
              >
                All ({activeQuestions.length})
              </button>
              <button
                onClick={() => setResultsFilter('incorrect')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${resultsFilter === 'incorrect' ? 'bg-white dark:bg-[#303d32] text-rose-600 shadow-xs' : 'text-stone-500'}`}
              >
                Mistakes ({resultsStats.incorrect})
              </button>
              <button
                onClick={() => setResultsFilter('correct')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${resultsFilter === 'correct' ? 'bg-white dark:bg-[#303d32] text-emerald-600 shadow-xs' : 'text-stone-500'}`}
              >
                Correct ({resultsStats.correct})
              </button>
            </div>
          </div>

          {/* Answer Breakdown list */}
          <div className="space-y-4">
            {activeQuestions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctAnswerIndex;

              if (resultsFilter === 'incorrect' && isCorrect) return null;
              if (resultsFilter === 'correct' && !isCorrect) return null;

              return (
                <div
                  key={idx}
                  id={`review-q-${idx}`}
                  className="p-5 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#3d4a3e] dark:text-white leading-snug">
                        {q.question}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isCorrect ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950' : 'bg-rose-100 text-rose-700 dark:bg-rose-950'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <div className="space-y-1.5 pl-8 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isOptionCorrect = optIdx === q.correctAnswerIndex;
                      const isOptionSelected = optIdx === userAns;

                      let rowClass = 'text-stone-600 dark:text-stone-400 bg-[#fafaf8]/50 dark:bg-[#263128]/30';
                      if (isOptionCorrect) {
                        rowClass = 'text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 font-semibold border border-emerald-200 dark:border-emerald-800';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        rowClass = 'text-rose-900 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/50 font-semibold border border-rose-200 dark:border-rose-800';
                      }

                      return (
                        <div key={optIdx} className={`p-2 rounded-xl flex items-center justify-between ${rowClass}`}>
                          <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                          {isOptionCorrect && <span className="text-[10px] text-emerald-600 font-bold">✓ Correct Answer</span>}
                          {isOptionSelected && !isOptionCorrect && <span className="text-[10px] text-rose-600 font-bold">✗ Your Pick</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pl-8 pt-2">
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 bg-[#fafaf8] dark:bg-[#263128] p-2.5 rounded-xl border border-[#ecebe4] dark:border-[#2e3a31]">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
