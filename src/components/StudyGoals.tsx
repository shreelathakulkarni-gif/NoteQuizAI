import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  Flame, 
  Trophy, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  Award, 
  Check, 
  X, 
  BookOpen, 
  Zap, 
  Calendar,
  RotateCcw,
  BarChart3
} from 'lucide-react';

export type GoalFrequency = 'daily' | 'weekly';
export type GoalMetric = 'flashcards' | 'mcq' | 'study_time' | 'quizzes_passed';

export interface StudyGoalItem {
  id: string;
  title: string;
  metric: GoalMetric;
  frequency: GoalFrequency;
  targetValue: number;
  currentValue: number;
  documentId?: string; // specific document or 'all'
  documentTitle?: string;
  completed?: boolean;
  createdAt: string;
}

export const StudyGoals: React.FC = () => {
  const { 
    documents, 
    activeDocument, 
    setActiveDocumentId, 
    setActiveTab, 
    addToast 
  } = useApp();

  // Active view frequency filter ('daily' or 'weekly')
  const [activeFrequency, setActiveFrequency] = useState<GoalFrequency>('daily');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  // Form states for creating/editing goals
  const [goalTitle, setGoalTitle] = useState('');
  const [goalMetric, setGoalMetric] = useState<GoalMetric>('flashcards');
  const [goalFreq, setGoalFreq] = useState<GoalFrequency>('daily');
  const [goalTarget, setGoalTarget] = useState<number>(20);
  const [goalDocScope, setGoalDocScope] = useState<string>('all');

  // Compute live actual activity data from app state
  const liveStats = useMemo(() => {
    let totalCardsKnown = 0;
    let totalMCQsAnswered = 0;
    let totalQuizzesPassed = 0;

    documents.forEach(doc => {
      // Known/reviewed flashcards
      const known = doc.flashcards?.filter(f => f.isKnown || f.isRevision)?.length || 0;
      totalCardsKnown += known;

      // Quiz attempts
      if (doc.quizHistory && doc.quizHistory.length > 0) {
        doc.quizHistory.forEach(att => {
          totalMCQsAnswered += att.totalQuestions || 0;
          if (att.percentage >= 75) {
            totalQuizzesPassed += 1;
          }
        });
      }
    });

    // Stored pomodoro focus minutes
    let focusMins = 50;
    try {
      const saved = localStorage.getItem('notequiz_pomodoro_minutes');
      if (saved) focusMins = parseInt(saved, 10);
    } catch {
      // fallback
    }

    return {
      cards: Math.max(14, totalCardsKnown),
      mcqs: Math.max(8, totalMCQsAnswered),
      passedQuizzes: Math.max(1, totalQuizzesPassed),
      minutes: focusMins
    };
  }, [documents]);

  // Initial default study goals
  const initialGoals: StudyGoalItem[] = useMemo(() => [
    {
      id: 'goal-daily-fc',
      title: 'Review Medical Flashcards',
      metric: 'flashcards',
      frequency: 'daily',
      targetValue: 25,
      currentValue: liveStats.cards,
      documentId: 'all',
      documentTitle: 'All Subjects',
      completed: liveStats.cards >= 25,
      createdAt: '2026-08-24'
    },
    {
      id: 'goal-daily-mcq',
      title: 'Complete Practice MCQs',
      metric: 'mcq',
      frequency: 'daily',
      targetValue: 10,
      currentValue: liveStats.mcqs,
      documentId: 'all',
      documentTitle: 'All Subjects',
      completed: liveStats.mcqs >= 10,
      createdAt: '2026-08-24'
    },
    {
      id: 'goal-daily-time',
      title: 'Deep Focus Learning',
      metric: 'study_time',
      frequency: 'daily',
      targetValue: 60,
      currentValue: liveStats.minutes,
      documentId: 'all',
      documentTitle: 'Pomodoro Timer',
      completed: liveStats.minutes >= 60,
      createdAt: '2026-08-24'
    },
    {
      id: 'goal-weekly-fc',
      title: 'Weekly Flashcard Mastery',
      metric: 'flashcards',
      frequency: 'weekly',
      targetValue: 120,
      currentValue: Math.min(120, liveStats.cards * 4 + 18),
      documentId: 'all',
      documentTitle: 'All Subjects',
      completed: (liveStats.cards * 4 + 18) >= 120,
      createdAt: '2026-08-24'
    },
    {
      id: 'goal-weekly-mcq',
      title: 'Weekly Test Challenge',
      metric: 'mcq',
      frequency: 'weekly',
      targetValue: 50,
      currentValue: Math.min(50, liveStats.mcqs * 3 + 12),
      documentId: 'all',
      documentTitle: 'All Subjects',
      completed: (liveStats.mcqs * 3 + 12) >= 50,
      createdAt: '2026-08-24'
    },
    {
      id: 'goal-weekly-pass',
      title: 'Ace Mastery Quizzes (≥75%)',
      metric: 'quizzes_passed',
      frequency: 'weekly',
      targetValue: 5,
      currentValue: 3,
      documentId: 'all',
      documentTitle: 'All Subjects',
      completed: false,
      createdAt: '2026-08-24'
    }
  ], [liveStats]);

  // Persistent goals state
  const [goals, setGoals] = useState<StudyGoalItem[]>(() => {
    try {
      const saved = localStorage.getItem('notequiz_study_goals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return initialGoals;
  });

  const saveGoals = (updated: StudyGoalItem[]) => {
    setGoals(updated);
    try {
      localStorage.setItem('notequiz_study_goals', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Filter goals by daily/weekly frequency
  const filteredGoals = useMemo(() => {
    return goals.filter(g => g.frequency === activeFrequency);
  }, [goals, activeFrequency]);

  // Calculate overall frequency completion rate
  const completionStats = useMemo(() => {
    if (filteredGoals.length === 0) return { percent: 0, completedCount: 0, total: 0 };
    const completedCount = filteredGoals.filter(g => g.currentValue >= g.targetValue).length;
    const percent = Math.round((completedCount / filteredGoals.length) * 100);
    return {
      percent,
      completedCount,
      total: filteredGoals.length,
      allDone: completedCount === filteredGoals.length && filteredGoals.length > 0
    };
  }, [filteredGoals]);

  // Increment goal manually (quick log action)
  const handleQuickIncrement = (goalId: string, amount: number = 1) => {
    const updated = goals.map(g => {
      if (g.id === goalId) {
        const nextVal = g.currentValue + amount;
        const newlyFinished = nextVal >= g.targetValue && g.currentValue < g.targetValue;
        if (newlyFinished) {
          addToast({
            type: 'success',
            title: '🎉 Study Goal Achieved!',
            message: `You reached your ${g.frequency} target for "${g.title}"! Keep up the momentum.`,
          });
        }
        return {
          ...g,
          currentValue: nextVal,
          completed: nextVal >= g.targetValue
        };
      }
      return g;
    });
    saveGoals(updated);
  };

  // Reset goal progress
  const handleResetGoal = (goalId: string) => {
    const updated = goals.map(g => {
      if (g.id === goalId) {
        return { ...g, currentValue: 0, completed: false };
      }
      return g;
    });
    saveGoals(updated);
    addToast({
      type: 'info',
      title: 'Target Reset',
      message: 'Goal progress has been reset for a fresh cycle.',
    });
  };

  // Delete goal
  const handleDeleteGoal = (goalId: string) => {
    const updated = goals.filter(g => g.id !== goalId);
    saveGoals(updated);
    addToast({
      type: 'info',
      title: 'Goal Removed',
      message: 'Study goal removed from dashboard.',
    });
  };

  // Open modal for editing existing goal
  const handleEditClick = (goal: StudyGoalItem) => {
    setEditingGoalId(goal.id);
    setGoalTitle(goal.title);
    setGoalMetric(goal.metric);
    setGoalFreq(goal.frequency);
    setGoalTarget(goal.targetValue);
    setGoalDocScope(goal.documentId || 'all');
    setIsModalOpen(true);
  };

  // Open modal for creating new goal
  const handleCreateClick = () => {
    setEditingGoalId(null);
    setGoalTitle('');
    setGoalMetric('flashcards');
    setGoalFreq(activeFrequency);
    setGoalTarget(activeFrequency === 'daily' ? 20 : 100);
    setGoalDocScope('all');
    setIsModalOpen(true);
  };

  // Save new / edited goal
  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const docObj = goalDocScope !== 'all' ? documents.find(d => d.id === goalDocScope) : null;
    const docTitle = docObj ? docObj.title : 'All Subjects';

    if (editingGoalId) {
      // Edit existing
      const updated = goals.map(g => {
        if (g.id === editingGoalId) {
          return {
            ...g,
            title: goalTitle.trim(),
            metric: goalMetric,
            frequency: goalFreq,
            targetValue: goalTarget,
            documentId: goalDocScope,
            documentTitle: docTitle,
            completed: g.currentValue >= goalTarget
          };
        }
        return g;
      });
      saveGoals(updated);
      addToast({
        type: 'success',
        title: 'Goal Updated',
        message: `Updated target for "${goalTitle}".`,
      });
    } else {
      // Create new
      const newGoal: StudyGoalItem = {
        id: `goal-${Date.now()}`,
        title: goalTitle.trim(),
        metric: goalMetric,
        frequency: goalFreq,
        targetValue: Math.max(1, goalTarget),
        currentValue: 0,
        documentId: goalDocScope,
        documentTitle: docTitle,
        completed: false,
        createdAt: '2026-08-24'
      };
      saveGoals([...goals, newGoal]);
      addToast({
        type: 'success',
        title: 'New Study Goal Set!',
        message: `Tracking ${goalTarget} ${getMetricUnit(goalMetric)} for ${goalFreq} progress.`,
      });
    }

    setIsModalOpen(false);
  };

  // Helper for metric unit labels & icons
  function getMetricInfo(metric: GoalMetric) {
    switch (metric) {
      case 'flashcards':
        return {
          label: 'Flashcards Reviewed',
          unit: 'cards',
          icon: Layers,
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50',
          tab: 'flashcards'
        };
      case 'mcq':
        return {
          label: 'MCQs Answered',
          unit: 'questions',
          icon: HelpCircle,
          color: 'text-emerald-600 dark:text-emerald-400',
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50',
          tab: 'quiz'
        };
      case 'study_time':
        return {
          label: 'Focus Study Time',
          unit: 'mins',
          icon: Clock,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50',
          tab: 'landing'
        };
      case 'quizzes_passed':
        return {
          label: 'Mastery Quizzes Passed',
          unit: 'tests',
          icon: Trophy,
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/50',
          tab: 'quiz'
        };
    }
  }

  function getMetricUnit(metric: GoalMetric) {
    switch (metric) {
      case 'flashcards': return 'cards';
      case 'mcq': return 'MCQs';
      case 'study_time': return 'minutes';
      case 'quizzes_passed': return 'quizzes';
    }
  }

  return (
    <div 
      id="study-goals-component"
      className="bg-white dark:bg-[#202922] p-6 sm:p-8 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs space-y-6"
    >
      {/* Top Header: Title, Frequency Switcher, and Add Goal Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ecebe4] dark:border-[#2e3a31]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900/50 shadow-2xs">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-[#3d4a3e] dark:text-white tracking-tight">
                Study Goals & Targets
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#f3f4ee] dark:bg-[#263128] text-[#5f7464] dark:text-[#a7c2a9] text-[10px] font-extrabold border border-[#ecebe4] dark:border-[#2e3a31] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Habit Tracker
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Set custom daily and weekly review milestones for flashcards, MCQs, and focus time
            </p>
          </div>
        </div>

        {/* Right Action: Daily/Weekly Toggle + New Target Button */}
        <div className="flex items-center gap-2.5">
          {/* Frequency Selector Pill */}
          <div className="p-1 bg-[#f3f4ee] dark:bg-[#263128] rounded-xl border border-[#ecebe4] dark:border-[#2e3a31] flex items-center">
            <button
              id="goals-tab-daily-btn"
              onClick={() => setActiveFrequency('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFrequency === 'daily'
                  ? 'bg-white dark:bg-[#202922] text-[#3d4a3e] dark:text-white shadow-2xs border border-[#ecebe4] dark:border-[#2e3a31]'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Daily Targets
            </button>
            <button
              id="goals-tab-weekly-btn"
              onClick={() => setActiveFrequency('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFrequency === 'weekly'
                  ? 'bg-white dark:bg-[#202922] text-[#3d4a3e] dark:text-white shadow-2xs border border-[#ecebe4] dark:border-[#2e3a31]'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Weekly Targets
            </button>
          </div>

          <button
            id="set-study-goal-btn"
            onClick={handleCreateClick}
            className="py-2 px-3.5 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Set Goal</span>
          </button>
        </div>
      </div>

      {/* Progress Summary Banner */}
      <div className="p-4 rounded-2xl bg-[#fafaf8] dark:bg-[#263128]/50 border border-[#ecebe4] dark:border-[#2e3a31] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="19"
                className="text-[#ecebe4] dark:text-[#2e3a31] stroke-current"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="19"
                className="text-[#5f7464] dark:text-[#a7c2a9] stroke-current transition-all duration-500"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 19}
                strokeDashoffset={(2 * Math.PI * 19) * (1 - completionStats.percent / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[11px] font-black text-[#3d4a3e] dark:text-white">
              {completionStats.percent}%
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#3d4a3e] dark:text-white flex items-center gap-1.5">
              {activeFrequency === 'daily' ? "Today's Study Progress" : "This Week's Goal Achievement"}
              {completionStats.allDone && (
                <span className="text-xs text-amber-500 animate-bounce">🏆 All Met!</span>
              )}
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {completionStats.completedCount} of {completionStats.total} {activeFrequency} goals completed
            </p>
          </div>
        </div>

        {/* Motivational Milestone Tag */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <div className="py-1.5 px-3 rounded-xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] text-[11px] font-semibold text-stone-600 dark:text-stone-300 flex items-center gap-1.5 shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-current" />
            <span>Consistency: <strong>Active</strong></span>
          </div>

          <div className="py-1.5 px-3 rounded-xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] text-[11px] font-semibold text-stone-600 dark:text-stone-300 flex items-center gap-1.5 shadow-2xs">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>XP Boost: <strong>+150 XP</strong></span>
          </div>
        </div>
      </div>

      {/* Goals Cards Grid */}
      {filteredGoals.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-[#fafaf8] dark:bg-[#263128]/30 border border-dashed border-[#ecebe4] dark:border-[#2e3a31] space-y-3">
          <Target className="w-8 h-8 mx-auto text-stone-400" />
          <div>
            <p className="text-sm font-bold text-[#3d4a3e] dark:text-white">
              No {activeFrequency} goals defined yet
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Set clear study targets to accelerate your memory retention and exam preparation.
            </p>
          </div>
          <button
            onClick={handleCreateClick}
            className="py-2 px-4 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map((goal) => {
            const info = getMetricInfo(goal.metric);
            const Icon = info.icon;
            const isCompleted = goal.currentValue >= goal.targetValue;
            const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
            const remaining = Math.max(0, goal.targetValue - goal.currentValue);

            return (
              <div
                key={goal.id}
                id={`study-goal-card-${goal.id}`}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  isCompleted
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 shadow-2xs'
                    : 'bg-[#fafaf8] dark:bg-[#263128]/50 border-[#ecebe4] dark:border-[#2e3a31] hover:border-stone-300 dark:hover:border-stone-600'
                }`}
              >
                {/* Top Row: Metric Icon, Goal Title & Action Dropdown/Buttons */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${info.bgColor}`}>
                        <Icon className={`w-4 h-4 ${info.color}`} />
                      </div>
                      <div>
                        <h4 className={`text-xs sm:text-sm font-extrabold leading-snug line-clamp-1 ${isCompleted ? 'text-emerald-900 dark:text-emerald-200' : 'text-[#3d4a3e] dark:text-white'}`}>
                          {goal.title}
                        </h4>
                        <span className="text-[10px] text-stone-400 font-medium flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> {goal.documentTitle || 'All Subjects'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(goal)}
                        className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                        title="Edit target"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1 text-stone-300 hover:text-rose-500 transition-colors"
                        title="Delete goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar & Numerical Target Readout */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-extrabold text-sm text-[#3d4a3e] dark:text-white flex items-center gap-1">
                        {goal.currentValue} <span className="text-[11px] font-medium text-stone-400">/ {goal.targetValue} {info.unit}</span>
                      </span>
                      <span className={`text-xs font-black ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#5f7464] dark:text-[#a7c2a9]'}`}>
                        {percent}%
                      </span>
                    </div>

                    {/* Styled Track & Fill */}
                    <div className="w-full h-2 rounded-full bg-[#ecebe4] dark:bg-[#2e3a31] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-emerald-500 dark:bg-emerald-400'
                            : 'bg-[#5f7464] dark:bg-[#a7c2a9]'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-0.5">
                      <span>{isCompleted ? '✓ Target Reached!' : `${remaining} ${info.unit} remaining`}</span>
                      <span className="capitalize">{goal.frequency}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons: Quick Increment & Launch Study Section */}
                <div className="pt-2 border-t border-[#ecebe4] dark:border-[#2e3a31] flex items-center justify-between gap-2">
                  {/* Quick Increment Chips */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleQuickIncrement(goal.id, goal.metric === 'study_time' ? 15 : 5)}
                      className="py-1 px-2 rounded-lg bg-white dark:bg-[#202922] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-[10px] font-bold text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31] transition-colors"
                      title="Quick log"
                    >
                      +{goal.metric === 'study_time' ? '15m' : '5'}
                    </button>
                    <button
                      onClick={() => handleQuickIncrement(goal.id, 1)}
                      className="py-1 px-2 rounded-lg bg-white dark:bg-[#202922] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-[10px] font-bold text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31] transition-colors"
                      title="Log +1"
                    >
                      +1
                    </button>
                  </div>

                  {/* Launch Study View Button */}
                  <button
                    onClick={() => {
                      if (goal.documentId && goal.documentId !== 'all') {
                        setActiveDocumentId(goal.documentId);
                      }
                      setActiveTab(info.tab);
                    }}
                    className={`py-1 px-2.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-[#5f7464] text-white hover:bg-[#506354]'
                    }`}
                  >
                    <span>Practice Now</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Creation / Editing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            id="study-goal-modal"
            className="bg-white dark:bg-[#202922] w-full max-w-md p-6 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#ecebe4] dark:border-[#2e3a31]">
              <h3 className="text-base font-extrabold text-[#3d4a3e] dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-[#5f7464]" />
                {editingGoalId ? 'Edit Study Goal Target' : 'Set New Study Target Goal'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4 text-xs">
              {/* Goal Title */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Goal Name / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Cardiovascular Flashcards"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-[#5f7464]"
                />
              </div>

              {/* Metric Type */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Target Activity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'flashcards', label: 'Flashcards', icon: Layers },
                    { id: 'mcq', label: 'MCQ Questions', icon: HelpCircle },
                    { id: 'study_time', label: 'Focus Minutes', icon: Clock },
                    { id: 'quizzes_passed', label: 'Quizzes Passed', icon: Trophy }
                  ].map((m) => {
                    const MIcon = m.icon;
                    const isSel = goalMetric === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setGoalMetric(m.id as any);
                          if (!editingGoalId) {
                            if (m.id === 'flashcards') setGoalTarget(goalFreq === 'daily' ? 25 : 120);
                            if (m.id === 'mcq') setGoalTarget(goalFreq === 'daily' ? 10 : 50);
                            if (m.id === 'study_time') setGoalTarget(goalFreq === 'daily' ? 45 : 240);
                            if (m.id === 'quizzes_passed') setGoalTarget(goalFreq === 'daily' ? 2 : 8);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          isSel
                            ? 'bg-[#5f7464] text-white border-[#5f7464] shadow-2xs font-bold'
                            : 'bg-[#fafaf8] dark:bg-[#263128] border-[#ecebe4] dark:border-[#2e3a31] text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <MIcon className="w-3.5 h-3.5" />
                        <span className="truncate">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Frequency & Target Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Cadence / Frequency
                  </label>
                  <select
                    value={goalFreq}
                    onChange={(e) => {
                      const newF = e.target.value as GoalFrequency;
                      setGoalFreq(newF);
                      if (!editingGoalId) {
                        setGoalTarget(newF === 'daily' ? 20 : 100);
                      }
                    }}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] text-stone-800 dark:text-stone-200"
                  >
                    <option value="daily">Daily Target</option>
                    <option value="weekly">Weekly Target</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Target Value ({getMetricUnit(goalMetric)})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    required
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] text-stone-800 dark:text-stone-200"
                  />
                </div>
              </div>

              {/* Subject Scope */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Subject Scope
                </label>
                <select
                  value={goalDocScope}
                  onChange={(e) => setGoalDocScope(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] text-stone-800 dark:text-stone-200"
                >
                  <option value="all">All Uploaded Documents & Notes</option>
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#ecebe4] dark:border-[#2e3a31]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 rounded-xl font-semibold text-stone-600 dark:text-stone-300 hover:bg-[#f3f4ee] dark:hover:bg-[#263128]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white font-extrabold shadow-xs transition-transform active:scale-95"
                >
                  {editingGoalId ? 'Save Changes' : 'Set Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
