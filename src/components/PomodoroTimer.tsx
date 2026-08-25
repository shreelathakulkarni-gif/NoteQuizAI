import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Coffee, 
  Flame, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Settings, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  HelpCircle,
  Clock,
  Bell,
  Check,
  ChevronRight,
  Headphones,
  Timer
} from 'lucide-react';

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

interface TimerPreset {
  mode: PomodoroMode;
  label: string;
  defaultMinutes: number;
  icon: React.ElementType;
}

const PRESETS: TimerPreset[] = [
  { mode: 'focus', label: 'Deep Focus', defaultMinutes: 25, icon: Flame },
  { mode: 'shortBreak', label: 'Short Break', defaultMinutes: 5, icon: Coffee },
  { mode: 'longBreak', label: 'Long Break', defaultMinutes: 15, icon: Sparkles }
];

export const PomodoroTimer: React.FC = () => {
  const { 
    activeDocument, 
    documents, 
    setActiveDocumentId, 
    setActiveTab, 
    addToast,
    settings 
  } = useApp();

  // Mode state
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [customMinutes, setCustomMinutes] = useState<{ [key in PomodoroMode]: number }>({
    focus: 25,
    shortBreak: 5,
    longBreak: 15
  });

  // Timer run state
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('notequiz_pomodoro_completed');
      return saved ? parseInt(saved, 10) : 2;
    } catch {
      return 2;
    }
  });
  const [totalFocusMinutes, setTotalFocusMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('notequiz_pomodoro_minutes');
      return saved ? parseInt(saved, 10) : 50;
    } catch {
      return 50;
    }
  });

  // Audio & ambient states
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [ambientSound, setAmbientSound] = useState<'none' | 'whiteNoise' | 'gentleRain'>('none');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // Selected document for this focus session
  const [selectedDocId, setSelectedDocId] = useState<string>(activeDocument?.id || documents[0]?.id || '');

  // Web Audio Context reference
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<AudioNode | null>(null);

  // Sync selected doc with active document if available
  useEffect(() => {
    if (activeDocument?.id && !selectedDocId) {
      setSelectedDocId(activeDocument.id);
    }
  }, [activeDocument?.id]);

  // Handle mode switch
  const switchMode = (newMode: PomodoroMode, newDurationMin?: number) => {
    setIsRunning(false);
    setMode(newMode);
    const duration = (newDurationMin || customMinutes[newMode]) * 60;
    setTimeLeft(duration);
  };

  // Play pleasant acoustic chime using Web Audio API
  const playChime = (type: 'break' | 'focus') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === 'break') {
        // Joyful ascending 3-note chime for break time
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.15);

          gain.gain.setValueAtTime(0.2, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.8);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.85);
        });
      } else {
        // Grounding 2-note chime for focus session
        [440, 554.37, 659.25].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.2);

          gain.gain.setValueAtTime(0.25, now + i * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.9);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.2);
          osc.stop(now + i * 0.2 + 0.95);
        });
      }
    } catch (e) {
      console.warn('Audio chime notice:', e);
    }
  };

  // Ambient sound synthesis
  useEffect(() => {
    if (ambientSound === 'none' || !isRunning) {
      if (ambientNodeRef.current) {
        try {
          // disconnect previous
          ambientNodeRef.current.disconnect();
        } catch {
          // ignore
        }
        ambientNodeRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      // Generate soft pink/white noise buffer for focus
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Soft pink noise filter
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 0.15; // low volume
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = ambientSound === 'gentleRain' ? 'bandpass' : 'lowpass';
      filter.frequency.value = ambientSound === 'gentleRain' ? 800 : 400;

      const gain = ctx.createGain();
      gain.gain.value = 0.05;

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();
      ambientNodeRef.current = gain;

      return () => {
        try {
          noiseSource.stop();
          gain.disconnect();
        } catch {
          // ignore
        }
      };
    } catch (e) {
      console.warn('Ambient audio error:', e);
    }
  }, [ambientSound, isRunning]);

  // Main countdown timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleSessionCompleted();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  // Session completion handler
  const handleSessionCompleted = () => {
    if (mode === 'focus') {
      const addedMinutes = customMinutes.focus;
      const newCompleted = completedSessions + 1;
      const newTotalMin = totalFocusMinutes + addedMinutes;

      setCompletedSessions(newCompleted);
      setTotalFocusMinutes(newTotalMin);

      try {
        localStorage.setItem('notequiz_pomodoro_completed', newCompleted.toString());
        localStorage.setItem('notequiz_pomodoro_minutes', newTotalMin.toString());
      } catch {
        // ignore
      }

      playChime('break');

      const isLongBreakDue = newCompleted % 4 === 0;
      addToast({
        type: 'success',
        title: '🎯 Focus Session Complete!',
        message: isLongBreakDue 
          ? `Incredible! You completed 4 sessions (${newTotalMin} mins total). Time for a well-deserved 15-minute Long Break!`
          : `Great job focusing! Take a 5-minute breather to recharge your mind.`,
      });

      // Automatically transition to appropriate break
      if (isLongBreakDue) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      // Break finished
      playChime('focus');
      addToast({
        type: 'info',
        title: '⚡ Break Ended',
        message: 'Ready to start another deep focus session? Pick your topic and let\'s go!',
      });
      switchMode('focus');
    }
  };

  // Adjust time by seconds
  const adjustTime = (secondsDelta: number) => {
    setTimeLeft(prev => Math.max(60, prev + secondsDelta));
  };

  // Reset current mode timer
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(customMinutes[mode] * 60);
  };

  // Format MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const totalModeSeconds = customMinutes[mode] * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalModeSeconds - timeLeft) / totalModeSeconds) * 100));

  // Current focus document
  const currentDoc = documents.find(d => d.id === selectedDocId) || activeDocument || documents[0];

  return (
    <div 
      id="pomodoro-timer-card"
      className={`rounded-3xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs overflow-hidden transition-all duration-300 ${
        isExpanded ? 'fixed inset-4 sm:inset-10 z-50 flex flex-col justify-between shadow-2xl p-6 sm:p-10 bg-white/95 dark:bg-[#1c241e]/95 backdrop-blur-lg' : 'p-6'
      }`}
    >
      {/* Top Bar: Title, Mode Badges & Expansion Toggle */}
      <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-[#ecebe4] dark:border-[#2e3a31]">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${
            mode === 'focus' 
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50' 
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
          }`}>
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#3d4a3e] dark:text-white flex items-center gap-1.5">
              Pomodoro Focus Timer
              {isRunning && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Science-backed 25m interval learning with automated break notifications
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            id="pomodoro-sound-toggle-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31] transition-colors"
            title={soundEnabled ? 'Chime sound active' : 'Sound muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#5f7464]" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>
          <button
            id="pomodoro-settings-toggle-btn"
            onClick={() => setShowConfig(!showConfig)}
            className={`p-2 rounded-xl border transition-colors ${
              showConfig 
                ? 'bg-[#5f7464] text-white border-[#5f7464]' 
                : 'bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-600 dark:text-stone-300 border-[#ecebe4] dark:border-[#2e3a31]'
            }`}
            title="Custom interval durations"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            id="pomodoro-fullscreen-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31] transition-colors"
            title={isExpanded ? 'Exit expanded focus view' : 'Expand full-screen focus view'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-[#f3f4ee] dark:bg-[#263128] rounded-2xl border border-[#ecebe4] dark:border-[#2e3a31] mb-6">
        {PRESETS.map((p) => {
          const Icon = p.icon;
          const isActive = mode === p.mode;
          return (
            <button
              key={p.mode}
              id={`pomodoro-mode-${p.mode}-btn`}
              onClick={() => switchMode(p.mode)}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-white dark:bg-[#202922] text-[#3d4a3e] dark:text-white shadow-xs border border-[#ecebe4] dark:border-[#2e3a31]'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? (p.mode === 'focus' ? 'text-rose-500' : 'text-emerald-500') : 'text-stone-400'}`} />
              <span className="truncate">{p.label} ({customMinutes[p.mode]}m)</span>
            </button>
          );
        })}
      </div>

      {/* Main Timer Display & SVG Circular Ring */}
      <div className="flex flex-col md:flex-row items-center justify-around gap-6 my-2">
        {/* Circular Progress Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-44 h-44 sm:w-52 sm:h-52 transform -rotate-90">
            {/* Background track circle */}
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              className="text-[#f3f4ee] dark:text-[#263128] stroke-current"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Animated progress circle */}
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              className={`transition-all duration-500 stroke-current ${
                mode === 'focus' 
                  ? 'text-[#5f7464] dark:text-[#a7c2a9]' 
                  : 'text-emerald-500 dark:text-emerald-400'
              }`}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 80}
              strokeDashoffset={(2 * Math.PI * 80) * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time text centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl sm:text-4xl font-mono font-black text-[#3d4a3e] dark:text-white tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mt-1 flex items-center gap-1">
              {mode === 'focus' ? '🎯 Deep Work' : '☕ Relax & Recharge'}
            </span>
          </div>
        </div>

        {/* Controls & Quick Actions */}
        <div className="flex-1 w-full max-w-sm space-y-4">
          {/* Primary Play/Pause and Reset Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="pomodoro-play-pause-btn"
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 py-3.5 px-6 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                isRunning 
                  ? 'bg-amber-600 hover:bg-amber-700' 
                  : 'bg-[#5f7464] hover:bg-[#506354]'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>{timeLeft < totalModeSeconds ? 'Resume Session' : 'Start Focus'}</span>
                </>
              )}
            </button>

            <button
              id="pomodoro-reset-btn"
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31] transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              id="pomodoro-skip-btn"
              onClick={() => {
                if (mode === 'focus') switchMode('shortBreak');
                else switchMode('focus');
              }}
              className="p-3.5 rounded-2xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31] transition-colors"
              title="Skip to next session"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Adjustment Chips */}
          <div className="flex items-center justify-between gap-1.5 text-xs">
            <span className="text-[11px] text-stone-400 font-semibold">Adjust:</span>
            <button
              onClick={() => adjustTime(-300)}
              className="py-1 px-2.5 rounded-lg bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31] font-semibold"
            >
              -5m
            </button>
            <button
              onClick={() => adjustTime(-60)}
              className="py-1 px-2.5 rounded-lg bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31] font-semibold"
            >
              -1m
            </button>
            <button
              onClick={() => adjustTime(60)}
              className="py-1 px-2.5 rounded-lg bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31] font-semibold"
            >
              +1m
            </button>
            <button
              onClick={() => adjustTime(300)}
              className="py-1 px-2.5 rounded-lg bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31] font-semibold"
            >
              +5m
            </button>
          </div>

          {/* Target Document Association */}
          {documents.length > 0 && (
            <div className="p-3 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#5f7464]" /> Focus Subject
                </span>
                {currentDoc && (
                  <span className="text-stone-400 font-medium truncate max-w-[140px]">
                    {currentDoc.quiz.length} Qs • {currentDoc.flashcards.length} Cards
                  </span>
                )}
              </div>

              <select
                id="pomodoro-document-select"
                value={selectedDocId}
                onChange={(e) => {
                  setSelectedDocId(e.target.value);
                  setActiveDocumentId(e.target.value);
                }}
                className="w-full text-xs font-semibold p-2 rounded-lg bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] text-[#3d4a3e] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#5f7464]"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>

              {/* Quick Jump Buttons for the document */}
              {currentDoc && (
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => {
                      setActiveDocumentId(currentDoc.id);
                      setActiveTab('notes');
                    }}
                    className="flex-1 py-1 px-2 rounded-lg bg-white dark:bg-[#202922] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-[11px] font-bold text-[#5f7464] dark:text-[#a7c2a9] border border-[#ecebe4] dark:border-[#2e3a31] flex items-center justify-center gap-1"
                  >
                    <BookOpen className="w-3 h-3" /> Study Notes
                  </button>
                  <button
                    onClick={() => {
                      setActiveDocumentId(currentDoc.id);
                      setActiveTab('quiz');
                    }}
                    className="flex-1 py-1 px-2 rounded-lg bg-white dark:bg-[#202922] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-[11px] font-bold text-[#5f7464] dark:text-[#a7c2a9] border border-[#ecebe4] dark:border-[#2e3a31] flex items-center justify-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3" /> Take Quiz
                  </button>
                  <button
                    onClick={() => {
                      setActiveDocumentId(currentDoc.id);
                      setActiveTab('flashcards');
                    }}
                    className="flex-1 py-1 px-2 rounded-lg bg-white dark:bg-[#202922] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-[11px] font-bold text-amber-700 dark:text-amber-400 border border-[#ecebe4] dark:border-[#2e3a31] flex items-center justify-center gap-1"
                  >
                    <Layers className="w-3 h-3" /> Flashcards
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Config Drawer for Custom Session Lengths & Ambient Background Noise */}
      {showConfig && (
        <div className="mt-5 p-4 rounded-2xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#3d4a3e] dark:text-white flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-[#5f7464]" /> Custom Timer Intervals & Ambient Sound
            </h4>
            <button
              onClick={() => setShowConfig(false)}
              className="text-xs font-bold text-[#5f7464] dark:text-[#a7c2a9] hover:underline"
            >
              Done
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Focus (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="90"
                value={customMinutes.focus}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 25;
                  setCustomMinutes(prev => ({ ...prev, focus: val }));
                  if (mode === 'focus' && !isRunning) setTimeLeft(val * 60);
                }}
                className="w-full text-xs p-2 rounded-xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] text-stone-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Short Break (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={customMinutes.shortBreak}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 5;
                  setCustomMinutes(prev => ({ ...prev, shortBreak: val }));
                  if (mode === 'shortBreak' && !isRunning) setTimeLeft(val * 60);
                }}
                className="w-full text-xs p-2 rounded-xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] text-stone-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Long Break (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={customMinutes.longBreak}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 15;
                  setCustomMinutes(prev => ({ ...prev, longBreak: val }));
                  if (mode === 'longBreak' && !isRunning) setTimeLeft(val * 60);
                }}
                className="w-full text-xs p-2 rounded-xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] text-stone-800 dark:text-white"
              />
            </div>
          </div>

          {/* Ambient Background Generator */}
          <div className="pt-3 border-t border-[#ecebe4] dark:border-[#2e3a31] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-[#5f7464]" />
              <span className="text-xs font-semibold text-[#3d4a3e] dark:text-white">Concentration Pink Noise:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAmbientSound('none')}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  ambientSound === 'none'
                    ? 'bg-[#5f7464] text-white border-[#5f7464]'
                    : 'bg-white dark:bg-[#202922] text-stone-600 dark:text-stone-300 border-[#ecebe4] dark:border-[#2e3a31]'
                }`}
              >
                Off
              </button>
              <button
                onClick={() => setAmbientSound('whiteNoise')}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  ambientSound === 'whiteNoise'
                    ? 'bg-[#5f7464] text-white border-[#5f7464]'
                    : 'bg-white dark:bg-[#202922] text-stone-600 dark:text-stone-300 border-[#ecebe4] dark:border-[#2e3a31]'
                }`}
              >
                Gentle Static
              </button>
              <button
                onClick={() => setAmbientSound('gentleRain')}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  ambientSound === 'gentleRain'
                    ? 'bg-[#5f7464] text-white border-[#5f7464]'
                    : 'bg-white dark:bg-[#202922] text-stone-600 dark:text-stone-300 border-[#ecebe4] dark:border-[#2e3a31]'
                }`}
              >
                Rain Frequency
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Session Counter & Daily Streak Track */}
      <div className="mt-5 pt-4 border-t border-[#ecebe4] dark:border-[#2e3a31] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-semibold">Today's Cycles:</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((cycleNum) => {
              const isCompletedInRound = ((completedSessions - 1) % 4) + 1 >= cycleNum && completedSessions > 0;
              return (
                <div
                  key={cycleNum}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold border transition-all ${
                    isCompletedInRound
                      ? 'bg-[#5f7464] text-white border-[#5f7464] shadow-2xs'
                      : 'bg-[#f3f4ee] dark:bg-[#263128] text-stone-400 border-[#ecebe4] dark:border-[#2e3a31]'
                  }`}
                  title={`Session ${cycleNum} of 4 before Long Break`}
                >
                  {isCompletedInRound ? '✓' : cycleNum}
                </div>
              );
            })}
          </div>
          <span className="text-[11px] text-[#5f7464] dark:text-[#a7c2a9] font-bold ml-1">
            ({completedSessions} completed)
          </span>
        </div>

        <div className="flex items-center gap-3 text-stone-500 dark:text-stone-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#5f7464]" />
            <strong>{totalFocusMinutes} mins</strong> focused
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-semibold">
            <Flame className="w-3.5 h-3.5 fill-current" />
            Active Streak
          </span>
        </div>
      </div>
    </div>
  );
};
