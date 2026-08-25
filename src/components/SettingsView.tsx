import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Trash2, 
  Sparkles, 
  Check, 
  Sliders,
  AlertTriangle,
  FileText,
  Palette,
  Laptop
} from 'lucide-react';
import { NoteLength, QuizDifficulty, AppTheme } from '../types';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, toggleTheme, setTheme, loadDemoExperience, addToast } = useApp();

  const [confirmReset, setConfirmReset] = useState(false);

  const handleToggleSound = () => {
    updateSettings({ soundEffects: !settings.soundEffects });
    addToast({
      type: 'info',
      title: 'Sound Settings',
      message: `Sound effects ${!settings.soundEffects ? 'enabled' : 'disabled'}.`
    });
  };

  const handleResetDemoData = () => {
    loadDemoExperience();
    setConfirmReset(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3d4a3e] dark:text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Customize study interface themes, AI generation defaults, and local storage data.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Dedicated Theme & Appearance */}
        <div className="bg-white dark:bg-[#202922] p-6 sm:p-8 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#ecebe4] dark:border-[#2e3a31]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#f3f4ee] dark:bg-[#263128] flex items-center justify-center text-[#5f7464] dark:text-[#a7c2a9] border border-[#ecebe4] dark:border-[#2e3a31]">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#3d4a3e] dark:text-white">
                  Study Theme & Visual Mode
                </h3>
                <p className="text-xs text-stone-500">
                  Switch between daytime high-contrast reading and low-light Night Study mode
                </p>
              </div>
            </div>

            {/* Quick Toggle Button */}
            <button
              id="settings-theme-quick-toggle-btn"
              onClick={toggleTheme}
              className="self-start sm:self-auto py-2 px-4 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#2e3a31] text-xs font-bold text-[#3d4a3e] dark:text-stone-200 flex items-center gap-2 transition-all border border-[#ecebe4] dark:border-[#2e3a31] shadow-2xs"
            >
              {settings.theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Switch to Light Academic</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#5f7464]" />
                  <span>Switch to Night Study</span>
                </>
              )}
            </button>
          </div>

          {/* Theme Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Light Academic Theme Card */}
            <div
              id="theme-option-light"
              onClick={() => setTheme('light')}
              className={`cursor-pointer p-5 rounded-2xl border-2 transition-all relative flex flex-col justify-between ${
                settings.theme === 'light'
                  ? 'border-[#5f7464] bg-[#fdfcf8] dark:bg-[#263128] shadow-sm ring-2 ring-[#5f7464]/20'
                  : 'border-[#ecebe4] dark:border-[#2e3a31] bg-[#fafaf8] dark:bg-[#202922]/60 hover:border-[#cbdbcc] dark:hover:border-[#5f7464]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#3d4a3e] dark:text-white">
                        Light Academic Theme
                      </h4>
                      <span className="text-[10px] font-semibold text-[#5f7464] dark:text-[#a7c2a9]">
                        Daylight Reading & Crisp Linen
                      </span>
                    </div>
                  </div>
                  {settings.theme === 'light' && (
                    <span className="w-5 h-5 rounded-full bg-[#5f7464] text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                  Optimized for active daytime study sessions with natural linen canvas (<code className="text-[11px] font-mono text-[#5f7464]">#fdfcf8</code>), warm stone typography, and sage green highlights.
                </p>
              </div>

              {/* Color Swatches */}
              <div className="pt-3 border-t border-[#ecebe4] dark:border-[#2e3a31] flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Palette</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#fdfcf8] border border-stone-300 shadow-2xs" title="Linen Background (#fdfcf8)" />
                  <span className="w-5 h-5 rounded-full bg-[#f3f4ee] border border-stone-300" title="Sage 100 (#f3f4ee)" />
                  <span className="w-5 h-5 rounded-full bg-[#5f7464]" title="Sage 500 (#5f7464)" />
                  <span className="w-5 h-5 rounded-full bg-[#3d4a3e]" title="Sage 700 (#3d4a3e)" />
                </div>
              </div>
            </div>

            {/* Night Study Dark Mode Card */}
            <div
              id="theme-option-dark"
              onClick={() => setTheme('dark')}
              className={`cursor-pointer p-5 rounded-2xl border-2 transition-all relative flex flex-col justify-between ${
                settings.theme === 'dark'
                  ? 'border-[#5f7464] bg-[#181f1a] shadow-sm ring-2 ring-[#5f7464]/40'
                  : 'border-[#ecebe4] dark:border-[#2e3a31] bg-[#fafaf8] dark:bg-[#181f1a]/60 hover:border-[#cbdbcc] dark:hover:border-[#5f7464]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-950/60 border border-indigo-800 text-indigo-300 flex items-center justify-center">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#3d4a3e] dark:text-white">
                        Night Study Dark Mode
                      </h4>
                      <span className="text-[10px] font-semibold text-[#8da592] dark:text-[#a7c2a9]">
                        Eye-Safe Earth & Forest Tones
                      </span>
                    </div>
                  </div>
                  {settings.theme === 'dark' && (
                    <span className="w-5 h-5 rounded-full bg-[#5f7464] text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                  Engineered for nocturnal focus with deep earth charcoal (<code className="text-[11px] font-mono text-[#8da592]">#181f1a</code>), slate card layers (<code className="text-[11px] font-mono text-[#8da592]">#202922</code>), and soft sage highlights to minimize eye fatigue.
                </p>
              </div>

              {/* Color Swatches */}
              <div className="pt-3 border-t border-[#ecebe4] dark:border-[#2e3a31] flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Palette</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#181f1a] border border-[#2e3a31]" title="Earth Dark BG (#181f1a)" />
                  <span className="w-5 h-5 rounded-full bg-[#202922] border border-[#2e3a31]" title="Earth Dark Card (#202922)" />
                  <span className="w-5 h-5 rounded-full bg-[#2e3a31]" title="Earth Dark Border (#2e3a31)" />
                  <span className="w-5 h-5 rounded-full bg-[#8da592]" title="Sage Accent (#8da592)" />
                </div>
              </div>
            </div>
          </div>

          {/* Stationery Theme Details Banner */}
          <div className="p-4 rounded-2xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f3f4ee] dark:bg-[#1f2821] flex items-center justify-center text-xl shrink-0 border border-[#ecebe4] dark:border-[#2e3a31]">
                📐
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#3d4a3e] dark:text-white">Active Stationery Desk Wallpaper</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5f7464] text-white">Active</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Decorated with drafting compasses, student bags, hexagonal pencils, beveled erasers, rulers, set squares, and geometry doodles.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-400 shrink-0">
              <span className="text-sm">🎒</span>
              <span className="text-sm">✏️</span>
              <span className="text-sm">🧭</span>
              <span className="text-sm">🧼</span>
              <span className="text-sm">📏</span>
            </div>
          </div>
        </div>

        {/* Section 2: AI Generation Defaults */}
        <div className="bg-white dark:bg-[#202922] p-6 sm:p-8 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs space-y-6">
          <h3 className="text-base font-bold text-[#3d4a3e] dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#5f7464] dark:text-[#a7c2a9]" />
            <span>AI Generation Defaults</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Default Note Length */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                Default Note Depth
              </label>
              <div className="flex flex-col gap-2">
                {(['short', 'medium', 'detailed'] as NoteLength[]).map((len) => (
                  <button
                    key={len}
                    id={`setting-note-len-${len}`}
                    type="button"
                    onClick={() => {
                      updateSettings({ defaultNoteLength: len });
                      addToast({ type: 'info', title: 'Default Updated', message: `Default note depth: ${len}.` });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize text-left flex items-center justify-between border transition-all ${
                      settings.defaultNoteLength === len
                        ? 'bg-[#f3f4ee] dark:bg-[#263128] border-[#5f7464] text-[#3d4a3e] dark:text-[#a7c2a9]'
                        : 'bg-[#fafaf8] dark:bg-[#263128]/40 border-[#ecebe4] dark:border-[#2e3a31] text-stone-600 dark:text-stone-300 hover:border-[#5f7464]'
                    }`}
                  >
                    <span>{len}</span>
                    {settings.defaultNoteLength === len && <Check className="w-4 h-4 text-[#5f7464] dark:text-[#a7c2a9]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Question Count */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                Default MCQ Count
              </label>
              <div className="flex flex-col gap-2">
                {[5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    id={`setting-quiz-count-${count}`}
                    type="button"
                    onClick={() => {
                      updateSettings({ defaultQuizCount: count });
                      addToast({ type: 'info', title: 'Default Updated', message: `Default quiz questions: ${count}.` });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold text-left flex items-center justify-between border transition-all ${
                      settings.defaultQuizCount === count
                        ? 'bg-[#f3f4ee] dark:bg-[#263128] border-[#5f7464] text-[#3d4a3e] dark:text-[#a7c2a9]'
                        : 'bg-[#fafaf8] dark:bg-[#263128]/40 border-[#ecebe4] dark:border-[#2e3a31] text-stone-600 dark:text-stone-300 hover:border-[#5f7464]'
                    }`}
                  >
                    <span>{count} Questions</span>
                    {settings.defaultQuizCount === count && <Check className="w-4 h-4 text-[#5f7464] dark:text-[#a7c2a9]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Difficulty */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                Default Difficulty
              </label>
              <div className="flex flex-col gap-2">
                {(['easy', 'medium', 'hard'] as QuizDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    id={`setting-quiz-diff-${diff}`}
                    type="button"
                    onClick={() => {
                      updateSettings({ defaultQuizDifficulty: diff });
                      addToast({ type: 'info', title: 'Default Updated', message: `Default difficulty: ${diff}.` });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize text-left flex items-center justify-between border transition-all ${
                      settings.defaultQuizDifficulty === diff
                        ? 'bg-[#f3f4ee] dark:bg-[#263128] border-[#5f7464] text-[#3d4a3e] dark:text-[#a7c2a9]'
                        : 'bg-[#fafaf8] dark:bg-[#263128]/40 border-[#ecebe4] dark:border-[#2e3a31] text-stone-600 dark:text-stone-300 hover:border-[#5f7464]'
                    }`}
                  >
                    <span>{diff}</span>
                    {settings.defaultQuizDifficulty === diff && <Check className="w-4 h-4 text-[#5f7464] dark:text-[#a7c2a9]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Audio & Interaction Preferences */}
        <div className="bg-white dark:bg-[#202922] p-6 sm:p-8 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs space-y-6">
          <h3 className="text-base font-bold text-[#3d4a3e] dark:text-white">
            Audio & Interaction Preferences
          </h3>

          <div className="divide-y divide-[#ecebe4] dark:divide-[#2e3a31]">
            {/* Audio feedback */}
            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#3d4a3e] dark:text-white">Quiz Audio Cues & Bells</p>
                <p className="text-[11px] text-stone-500">Play subtle auditory sounds on quiz completion and timer events</p>
              </div>
              <button
                id="settings-sound-toggle-btn"
                onClick={handleToggleSound}
                className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border ${
                  settings.soundEffects 
                    ? 'bg-[#f3f4ee] dark:bg-[#263128] text-[#5f7464] dark:text-[#a7c2a9] border-[#5f7464]' 
                    : 'bg-[#fafaf8] dark:bg-[#263128] text-stone-500 border-[#ecebe4] dark:border-[#2e3a31]'
                }`}
              >
                {settings.soundEffects ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{settings.soundEffects ? 'Enabled' : 'Muted'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Data Management */}
        <div className="bg-white dark:bg-[#202922] p-6 sm:p-8 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#3d4a3e] dark:text-white">
            Data Management & Demo Restoration
          </h3>
          <p className="text-xs text-stone-500">
            Restore sample pre-loaded academic PDFs or reset your local study session storage.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="restore-demo-data-btn"
              onClick={() => setConfirmReset(true)}
              className="py-2.5 px-4 rounded-xl bg-[#f3f4ee] dark:bg-[#263128] hover:bg-[#ecebe4] text-[#3d4a3e] dark:text-[#a7c2a9] text-xs font-bold border border-[#ecebe4] dark:border-[#2e3a31] flex items-center gap-2 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-4 h-4 text-[#5f7464] dark:text-[#a7c2a9]" />
              <span>Reload Academic Demo PDFs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#202922] rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#f3f4ee] dark:bg-[#263128] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center mx-auto mb-4 border border-[#ecebe4] dark:border-[#2e3a31]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#3d4a3e] dark:text-white">
              Restore Sample Demo Data?
            </h3>
            <p className="text-xs text-stone-500 mt-2 mb-6">
              This will load high-quality computer science and neural network textbook chapters with complete structured notes, MCQs, and flashcards.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setConfirmReset(false)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-[#fafaf8] dark:hover:bg-[#263128]"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDemoData}
                className="py-2 px-5 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold shadow-xs"
              >
                Restore Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
