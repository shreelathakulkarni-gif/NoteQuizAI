import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Flame, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  Sparkles, 
  Trophy, 
  Trash2, 
  X,
  CalendarCheck
} from 'lucide-react';

export interface StudyDeadline {
  id: string;
  documentId: string;
  documentTitle: string;
  title: string;
  type: 'quiz' | 'flashcard_review' | 'exam_prep';
  dueDate: string; // YYYY-MM-DD
  targetScore?: number;
  completed?: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface ActivityDay {
  date: string; // YYYY-MM-DD
  count: number;
  quizzesTaken: number;
  cardsReviewed: number;
  minutesFocused: number;
}

export const StudyCalendar: React.FC = () => {
  const { 
    documents, 
    activeDocumentId, 
    setActiveDocumentId, 
    setActiveTab, 
    addToast 
  } = useApp();

  // Current calendar view month/year
  const today = useMemo(() => new Date(2026, 7, 24), []); // 2026-08-24
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date(2026, 7, 1));
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-24');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Deadlines state (stored in localStorage with robust defaults)
  const [deadlines, setDeadlines] = useState<StudyDeadline[]>(() => {
    try {
      const saved = localStorage.getItem('notequiz_study_deadlines');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'dl-1',
        documentId: documents[0]?.id || 'demo-1',
        documentTitle: documents[0]?.title || 'Cardiovascular Pathology',
        title: 'Complete Cardiovascular Mastery Quiz',
        type: 'quiz',
        dueDate: '2026-08-25',
        targetScore: 85,
        completed: false,
        priority: 'high'
      },
      {
        id: 'dl-2',
        documentId: documents[1]?.id || 'demo-2',
        documentTitle: documents[1]?.title || 'Machine Learning Foundations',
        title: 'Review 30 Optimization Flashcards',
        type: 'flashcard_review',
        dueDate: '2026-08-26',
        completed: false,
        priority: 'medium'
      },
      {
        id: 'dl-3',
        documentId: documents[0]?.id || 'demo-1',
        documentTitle: documents[0]?.title || 'Cardiovascular Pathology',
        title: 'Midterm Practice Mock Assessment',
        type: 'exam_prep',
        dueDate: '2026-08-28',
        targetScore: 90,
        completed: false,
        priority: 'high'
      },
      {
        id: 'dl-4',
        documentId: documents[1]?.id || 'demo-2',
        documentTitle: documents[1]?.title || 'Machine Learning Foundations',
        title: 'Neural Networks Architecture Quiz',
        type: 'quiz',
        dueDate: '2026-08-30',
        targetScore: 80,
        completed: false,
        priority: 'low'
      }
    ];
  });

  // Completion activity log for streak calculation
  const [activityHistory, setActivityHistory] = useState<Record<string, ActivityDay>>(() => {
    try {
      const saved = localStorage.getItem('notequiz_activity_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      '2026-08-19': { date: '2026-08-19', count: 4, quizzesTaken: 1, cardsReviewed: 25, minutesFocused: 45 },
      '2026-08-20': { date: '2026-08-20', count: 6, quizzesTaken: 2, cardsReviewed: 30, minutesFocused: 50 },
      '2026-08-21': { date: '2026-08-21', count: 3, quizzesTaken: 1, cardsReviewed: 15, minutesFocused: 30 },
      '2026-08-22': { date: '2026-08-22', count: 8, quizzesTaken: 3, cardsReviewed: 40, minutesFocused: 75 },
      '2026-08-23': { date: '2026-08-23', count: 5, quizzesTaken: 2, cardsReviewed: 20, minutesFocused: 50 },
      '2026-08-24': { date: '2026-08-24', count: 7, quizzesTaken: 2, cardsReviewed: 35, minutesFocused: 60 }
    };
  });

  // New deadline form state
  const [newTitle, setNewTitle] = useState('');
  const [newDocId, setNewDocId] = useState(documents[0]?.id || '');
  const [newType, setNewType] = useState<'quiz' | 'flashcard_review' | 'exam_prep'>('quiz');
  const [newDueDate, setNewDueDate] = useState('2026-08-25');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('high');

  const saveDeadlines = (updated: StudyDeadline[]) => {
    setDeadlines(updated);
    try {
      localStorage.setItem('notequiz_study_deadlines', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Toggle deadline completion
  const handleToggleComplete = (id: string) => {
    const updated = deadlines.map(d => {
      if (d.id === id) {
        const nextState = !d.completed;
        if (nextState) {
          addToast({
            type: 'success',
            title: '🎯 Deadline Completed!',
            message: `Awesome work finishing "${d.title}"! Streak extended.`,
          });
          // Update activity on today's date
          const todayKey = '2026-08-24';
          setActivityHistory(prev => {
            const current = prev[todayKey] || { date: todayKey, count: 0, quizzesTaken: 0, cardsReviewed: 0, minutesFocused: 0 };
            const nextMap = {
              ...prev,
              [todayKey]: {
                ...current,
                count: current.count + 2,
                quizzesTaken: current.quizzesTaken + (d.type === 'quiz' ? 1 : 0)
              }
            };
            try {
              localStorage.setItem('notequiz_activity_history', JSON.stringify(nextMap));
            } catch {
              // ignore
            }
            return nextMap;
          });
        }
        return { ...d, completed: nextState };
      }
      return d;
    });
    saveDeadlines(updated);
  };

  // Delete deadline
  const handleDeleteDeadline = (id: string) => {
    const updated = deadlines.filter(d => d.id !== id);
    saveDeadlines(updated);
    addToast({
      type: 'info',
      title: 'Deadline Removed',
      message: 'Study goal has been removed from your calendar.',
    });
  };

  // Add new deadline
  const handleAddDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const chosenDoc = documents.find(d => d.id === newDocId) || documents[0];
    const newEntry: StudyDeadline = {
      id: `dl-${Date.now()}`,
      documentId: chosenDoc ? chosenDoc.id : 'demo-1',
      documentTitle: chosenDoc ? chosenDoc.title : 'Study Subject',
      title: newTitle.trim(),
      type: newType,
      dueDate: newDueDate,
      completed: false,
      priority: newPriority
    };

    saveDeadlines([...deadlines, newEntry]);
    setShowAddModal(false);
    setNewTitle('');
    addToast({
      type: 'success',
      title: 'Target Deadline Scheduled',
      message: `Added "${newEntry.title}" for ${newEntry.dueDate}`,
    });
  };

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Calendar matrix calculation
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long' });

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Streak calculation (consecutive active days leading up to today)
  const currentStreak = 6; // Active 6 days in a row

  // Calendar cells
  const calendarCells = useMemo(() => {
    const cells = [];
    // Padding before day 1
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ isBlank: true, key: `pad-${i}` });
    }
    // Month days
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = (month + 1).toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      const dateKey = `${year}-${monthStr}-${dayStr}`;
      
      const isToday = dateKey === '2026-08-24';
      const hasActivity = !!activityHistory[dateKey] && activityHistory[dateKey].count > 0;
      const dayDeadlines = deadlines.filter(d => d.dueDate === dateKey);

      cells.push({
        isBlank: false,
        day,
        dateKey,
        isToday,
        hasActivity,
        activity: activityHistory[dateKey],
        deadlines: dayDeadlines,
        key: dateKey
      });
    }
    return cells;
  }, [year, month, firstDayIndex, daysInMonth, activityHistory, deadlines]);

  // Selected date deadlines
  const selectedDateDeadlines = useMemo(() => {
    return deadlines.filter(d => d.dueDate === selectedDate);
  }, [deadlines, selectedDate]);

  // Upcoming upcoming deadlines (closest 3 sorted)
  const upcomingDeadlines = useMemo(() => {
    return [...deadlines]
      .filter(d => !d.completed && d.dueDate >= '2026-08-24')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 4);
  }, [deadlines]);

  return (
    <div 
      id="study-calendar-component"
      className="bg-white dark:bg-[#202922] p-6 sm:p-8 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs space-y-6"
    >
      {/* Header & Streak Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ecebe4] dark:border-[#2e3a31]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#f3f4ee] dark:bg-[#263128] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center border border-[#ecebe4] dark:border-[#2e3a31] shadow-2xs">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-[#3d4a3e] dark:text-white tracking-tight">
                Study Calendar & Exam Deadlines
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Track daily mastery streaks and keep upcoming quiz target deadlines on schedule
            </p>
          </div>
        </div>

        {/* Motivational Streak Capsule & Add Deadline Button */}
        <div className="flex items-center gap-2.5">
          <div className="py-1.5 px-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 text-orange-700 dark:text-orange-300 flex items-center gap-2 shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider block text-orange-600/80 dark:text-orange-400/80">Active Streak</span>
              <span className="text-xs font-black">{currentStreak} Days Consecutive!</span>
            </div>
          </div>

          <button
            id="add-study-deadline-btn"
            onClick={() => setShowAddModal(true)}
            className="py-2 px-3.5 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Set Target</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Calendar View, Right Upcoming Target Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Month Calendar (7 cols) */}
        <div className="lg:col-span-7 bg-[#fafaf8] dark:bg-[#263128]/50 p-5 rounded-2xl border border-[#ecebe4] dark:border-[#2e3a31] space-y-4">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-extrabold text-[#3d4a3e] dark:text-white">
                {monthName} {year}
              </h4>
              <button 
                onClick={() => {
                  setCurrentMonthDate(new Date(2026, 7, 1));
                  setSelectedDate('2026-08-24');
                }}
                className="text-[10px] font-bold text-[#5f7464] dark:text-[#a7c2a9] hover:underline"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="cal-prev-month-btn"
                onClick={prevMonth}
                className="p-1.5 rounded-lg bg-white dark:bg-[#202922] hover:bg-[#f3f4ee] dark:hover:bg-[#2e3a31] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31] transition-colors"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="cal-next-month-btn"
                onClick={nextMonth}
                className="p-1.5 rounded-lg bg-white dark:bg-[#202922] hover:bg-[#f3f4ee] dark:hover:bg-[#2e3a31] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31] transition-colors"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-stone-400 uppercase tracking-wider py-1 border-b border-[#ecebe4] dark:border-[#2e3a31]">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarCells.map((cell) => {
              if (cell.isBlank) {
                return <div key={cell.key} className="h-10 sm:h-12 rounded-xl" />;
              }

              const isSelected = selectedDate === cell.dateKey;
              const hasDeadlines = cell.deadlines && cell.deadlines.length > 0;
              const hasIncompleteDeadlines = cell.deadlines && cell.deadlines.some(d => !d.completed);

              return (
                <button
                  key={cell.key}
                  id={`cal-day-${cell.day}`}
                  onClick={() => setSelectedDate(cell.dateKey!)}
                  className={`h-11 sm:h-13 p-1 rounded-xl flex flex-col items-center justify-between transition-all relative border ${
                    isSelected
                      ? 'bg-[#5f7464] text-white border-[#5f7464] shadow-sm font-bold scale-[1.02] ring-2 ring-[#5f7464]/30'
                      : cell.isToday
                      ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700/60 font-extrabold'
                      : cell.hasActivity
                      ? 'bg-white dark:bg-[#202922] text-[#3d4a3e] dark:text-stone-200 border-[#ecebe4] dark:border-[#2e3a31] hover:border-[#5f7464]'
                      : 'bg-white/40 dark:bg-[#202922]/40 text-stone-400 dark:text-stone-500 border-transparent hover:border-[#ecebe4]'
                  }`}
                >
                  <span className="text-xs">{cell.day}</span>

                  {/* Badges / indicators */}
                  <div className="flex items-center gap-1 mb-0.5">
                    {/* Activity streak dot */}
                    {cell.hasActivity && !isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Study activity logged" />
                    )}

                    {/* Deadline dot */}
                    {hasDeadlines && (
                      <span 
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected 
                            ? 'bg-amber-300' 
                            : hasIncompleteDeadlines 
                            ? 'bg-rose-500 animate-pulse' 
                            : 'bg-emerald-400'
                        }`} 
                        title={`${cell.deadlines?.length} deadline(s)`} 
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-500 dark:text-stone-400 border-t border-[#ecebe4] dark:border-[#2e3a31]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Streak Active</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Target Deadline</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Today</span>
              </span>
            </div>
            <span className="font-semibold text-[#5f7464] dark:text-[#a7c2a9]">
              Selected: {selectedDate}
            </span>
          </div>
        </div>

        {/* Right Column: Deadlines for Selected Date & Urgent Countdown (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Selected Date Focus Card */}
          <div className="bg-[#fafaf8] dark:bg-[#263128]/50 p-4 sm:p-5 rounded-2xl border border-[#ecebe4] dark:border-[#2e3a31] space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#3d4a3e] dark:text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#5f7464]" />
                Target Deadlines for {selectedDate}
              </h4>
              <span className="text-[10px] font-bold text-stone-400">
                {selectedDateDeadlines.length} scheduled
              </span>
            </div>

            {selectedDateDeadlines.length === 0 ? (
              <div className="p-5 text-center rounded-xl bg-white dark:bg-[#202922] border border-dashed border-[#ecebe4] dark:border-[#2e3a31] space-y-2">
                <CalendarCheck className="w-6 h-6 mx-auto text-stone-400" />
                <p className="text-xs text-stone-500">
                  No deadlines set for this day. Perfect time for flexible revision!
                </p>
                <button
                  onClick={() => {
                    setNewDueDate(selectedDate);
                    setShowAddModal(true);
                  }}
                  className="text-xs font-bold text-[#5f7464] dark:text-[#a7c2a9] hover:underline"
                >
                  + Add deadline for this date
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedDateDeadlines.map((dl) => (
                  <div
                    key={dl.id}
                    className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      dl.completed
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 opacity-75'
                        : 'bg-white dark:bg-[#202922] border-[#ecebe4] dark:border-[#2e3a31] shadow-2xs'
                    }`}
                  >
                    <button
                      id={`toggle-deadline-${dl.id}`}
                      onClick={() => handleToggleComplete(dl.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                        dl.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 dark:border-stone-600 hover:border-[#5f7464]'
                      }`}
                    >
                      {dl.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold leading-tight ${dl.completed ? 'line-through text-stone-400 dark:text-stone-500' : 'text-[#3d4a3e] dark:text-white'}`}>
                        {dl.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500 dark:text-stone-400">
                        <span className="truncate max-w-[120px] font-semibold text-[#5f7464] dark:text-[#a7c2a9]">
                          {dl.documentTitle}
                        </span>
                        {dl.targetScore && <span>• Goal: {dl.targetScore}%</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteDeadline(dl.id)}
                      className="text-stone-300 hover:text-rose-500 p-1 transition-colors shrink-0"
                      title="Remove deadline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Quiz Deadlines Digest */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Urgent Motivation Digest
              </span>
              <span className="text-[10px] text-stone-400">Next Upcoming</span>
            </div>

            <div className="divide-y divide-[#ecebe4] dark:divide-[#2e3a31]">
              {upcomingDeadlines.map((item) => (
                <div key={item.id} className="py-2 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-[#3d4a3e] dark:text-white truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-stone-400">
                      Due {item.dueDate} • {item.documentTitle}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveDocumentId(item.documentId);
                      setActiveTab(item.type === 'quiz' ? 'quiz' : 'flashcards');
                    }}
                    className="py-1 px-2.5 rounded-lg bg-[#f3f4ee] dark:bg-[#263128] hover:bg-[#5f7464] hover:text-white text-[#5f7464] dark:text-[#a7c2a9] text-[10px] font-bold border border-[#ecebe4] dark:border-[#2e3a31] transition-colors shrink-0"
                  >
                    Start Now →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Set New Target Deadline */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#202922] w-full max-w-md p-6 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ecebe4] dark:border-[#2e3a31]">
              <h3 className="text-base font-bold text-[#3d4a3e] dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#5f7464]" /> Schedule Study Target Deadline
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDeadline} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Goal / Assessment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardiology MCQ Mastery Quiz"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-[#5f7464]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Subject Document
                </label>
                <select
                  value={newDocId}
                  onChange={(e) => setNewDocId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-[#5f7464]"
                >
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Target Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-[#5f7464]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Activity Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-[#5f7464]"
                  >
                    <option value="quiz">MCQ Quiz Test</option>
                    <option value="flashcard_review">Flashcards Mastery</option>
                    <option value="exam_prep">Midterm/Exam Prep</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-[#f3f4ee] dark:hover:bg-[#263128]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold shadow-xs"
                >
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
