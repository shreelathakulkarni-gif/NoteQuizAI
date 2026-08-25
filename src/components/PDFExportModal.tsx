import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NotesData, Flashcard, QuizQuestion } from '../types';
import { downloadNotesAsPDF, PDFExportOptions, printNotes } from '../utils/exportUtils';
import { 
  FileDown, 
  Printer, 
  Check, 
  X, 
  Palette, 
  Layout, 
  CheckSquare, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  FileText, 
  Sliders,
  Settings2,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: NotesData;
  documentTitle: string;
  flashcards?: Flashcard[];
  quizQuestions?: QuizQuestion[];
}

export const PDFExportModal: React.FC<PDFExportModalProps> = ({
  isOpen,
  onClose,
  notes,
  documentTitle,
  flashcards = [],
  quizQuestions = []
}) => {
  const { addToast } = useApp();

  const [theme, setTheme] = useState<'sage' | 'academic' | 'monochrome' | 'warm'>('sage');
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [studentName, setStudentName] = useState('');
  
  // Section inclusion flags
  const [includeOverview, setIncludeOverview] = useState(true);
  const [includeDetailedNotes, setIncludeDetailedNotes] = useState(true);
  const [includeKeyPoints, setIncludeKeyPoints] = useState(true);
  const [includeTerms, setIncludeTerms] = useState(true);
  const [includeCheckboxes, setIncludeCheckboxes] = useState(true);
  const [includeFlashcards, setIncludeFlashcards] = useState(false);
  const [includeQuizQuestions, setIncludeQuizQuestions] = useState(false);

  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    try {
      const options: PDFExportOptions = {
        theme,
        pageSize,
        studentName: studentName.trim(),
        includeOverview,
        includeDetailedNotes,
        includeKeyPoints,
        includeTerms,
        includeCheckboxes,
        includeFlashcards,
        includeQuizQuestions,
        flashcards,
        quizQuestions
      };

      const filename = downloadNotesAsPDF(notes, documentTitle, options);
      addToast({
        type: 'success',
        title: 'PDF Study Guide Created!',
        message: `Saved as "${filename}". Ready for offline printing and study!`,
      });
      onClose();
    } catch (err) {
      console.error('PDF export error:', err);
      addToast({
        type: 'error',
        title: 'Export Failed',
        message: 'Could not generate PDF at this time.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickPrint = () => {
    onClose();
    setTimeout(() => {
      printNotes();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="pdf-export-modal"
        className="bg-white dark:bg-[#202922] w-full max-w-xl rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#ecebe4] dark:border-[#2e3a31] flex items-center justify-between bg-[#fafaf8] dark:bg-[#263128]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5f7464] text-white flex items-center justify-center shadow-xs">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#3d4a3e] dark:text-white">
                Export Formatted PDF Study Guide
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Customized for crisp offline reading, pen-and-paper revision, and printing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#ecebe4] dark:hover:bg-[#2e3a31] text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Settings */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* 1. Theme Selection */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#5f7464]" /> 1. Document Visual Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'sage', label: 'Sage Botanical', sub: 'App Signature', border: 'border-[#5f7464]', badge: 'bg-[#5f7464] text-white' },
                { id: 'academic', label: 'Academic Blue', sub: 'University Style', border: 'border-blue-600', badge: 'bg-blue-600 text-white' },
                { id: 'monochrome', label: 'Ink Saver', sub: 'Black & White', border: 'border-stone-800', badge: 'bg-stone-800 text-white' },
                { id: 'warm', label: 'Warm Amber', sub: 'Editorial Paper', border: 'border-amber-600', badge: 'bg-amber-600 text-white' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    theme === t.id
                      ? `${t.border} bg-[#fafaf8] dark:bg-[#263128] ring-2 ring-[#5f7464]/30 shadow-xs`
                      : 'border-[#ecebe4] dark:border-[#2e3a31] hover:border-stone-400 bg-white dark:bg-[#202922]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#3d4a3e] dark:text-white truncate">{t.label}</span>
                    {theme === t.id && <Check className="w-3.5 h-3.5 text-[#5f7464] dark:text-[#a7c2a9]" />}
                  </div>
                  <span className="text-[10px] text-stone-400 block">{t.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Content Sections to Include */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-[#5f7464]" /> 2. Content Sections to Include
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#fafaf8] dark:bg-[#263128]/50 p-3.5 rounded-2xl border border-[#ecebe4] dark:border-[#2e3a31]">
              <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white dark:hover:bg-[#202922] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeOverview}
                  onChange={(e) => setIncludeOverview(e.target.checked)}
                  className="rounded text-[#5f7464] focus:ring-[#5f7464]"
                />
                <div>
                  <span className="font-bold text-[#3d4a3e] dark:text-white block">Executive Overview</span>
                  <span className="text-[10px] text-stone-400">High-level summary breakdown</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white dark:hover:bg-[#202922] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeDetailedNotes}
                  onChange={(e) => setIncludeDetailedNotes(e.target.checked)}
                  className="rounded text-[#5f7464] focus:ring-[#5f7464]"
                />
                <div>
                  <span className="font-bold text-[#3d4a3e] dark:text-white block">Detailed Concepts ({notes.detailedNotes?.length || 0})</span>
                  <span className="text-[10px] text-stone-400">Core notes & structured bullets</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white dark:hover:bg-[#202922] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeKeyPoints}
                  onChange={(e) => setIncludeKeyPoints(e.target.checked)}
                  className="rounded text-[#5f7464] focus:ring-[#5f7464]"
                />
                <div>
                  <span className="font-bold text-[#3d4a3e] dark:text-white block">Key Takeaways ({notes.keyPoints?.length || 0})</span>
                  <span className="text-[10px] text-stone-400">Active recall revision items</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white dark:hover:bg-[#202922] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeTerms}
                  onChange={(e) => setIncludeTerms(e.target.checked)}
                  className="rounded text-[#5f7464] focus:ring-[#5f7464]"
                />
                <div>
                  <span className="font-bold text-[#3d4a3e] dark:text-white block">Glossary of Terms ({notes.importantTerms?.length || 0})</span>
                  <span className="text-[10px] text-stone-400">Definitions with context</span>
                </div>
              </label>
            </div>
          </div>

          {/* 3. Study Extras & Add-ons */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-[#5f7464]" /> 3. Offline Study Add-ons
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#fafaf8] dark:bg-[#263128]/50 border border-[#ecebe4] dark:border-[#2e3a31] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCheckboxes}
                  onChange={(e) => setIncludeCheckboxes(e.target.checked)}
                  className="mt-0.5 rounded text-[#5f7464] focus:ring-[#5f7464]"
                />
                <div>
                  <span className="font-bold text-[#3d4a3e] dark:text-white block">
                    Printable Study Checkboxes [  ]
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">
                    Inserts physical pen-and-paper check-boxes next to all key points and concept bullets for active revision.
                  </span>
                </div>
              </label>

              {flashcards.length > 0 && (
                <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#fafaf8] dark:bg-[#263128]/50 border border-[#ecebe4] dark:border-[#2e3a31] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeFlashcards}
                    onChange={(e) => setIncludeFlashcards(e.target.checked)}
                    className="mt-0.5 rounded text-[#5f7464] focus:ring-[#5f7464]"
                  />
                  <div>
                    <span className="font-bold text-[#3d4a3e] dark:text-white block flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      Append Flashcard 2-Column Study Sheets ({flashcards.length} cards)
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400">
                      Adds an organized prompt & solution table for quick flashcard review without a screen.
                    </span>
                  </div>
                </label>
              )}

              {quizQuestions.length > 0 && (
                <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#fafaf8] dark:bg-[#263128]/50 border border-[#ecebe4] dark:border-[#2e3a31] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeQuizQuestions}
                    onChange={(e) => setIncludeQuizQuestions(e.target.checked)}
                    className="mt-0.5 rounded text-[#5f7464] focus:ring-[#5f7464]"
                  />
                  <div>
                    <span className="font-bold text-[#3d4a3e] dark:text-white block flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Append Practice Quiz & Answer Key ({quizQuestions.length} Questions)
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400">
                      Prints test questions with bubble options and answers for self-proctored mock exams.
                    </span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* 4. Page Size & Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Paper Format
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPageSize('a4')}
                  className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                    pageSize === 'a4'
                      ? 'bg-[#5f7464] text-white border-[#5f7464]'
                      : 'bg-[#fafaf8] dark:bg-[#263128] text-stone-600 dark:text-stone-300 border-[#ecebe4] dark:border-[#2e3a31]'
                  }`}
                >
                  A4 Standard
                </button>
                <button
                  type="button"
                  onClick={() => setPageSize('letter')}
                  className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                    pageSize === 'letter'
                      ? 'bg-[#5f7464] text-white border-[#5f7464]'
                      : 'bg-[#fafaf8] dark:bg-[#263128] text-stone-600 dark:text-stone-300 border-[#ecebe4] dark:border-[#2e3a31]'
                  }`}
                >
                  US Letter
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Student Name / Course (Optional Header)
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Miller • Bio 101"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full text-xs p-2 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] text-stone-800 dark:text-stone-200"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#ecebe4] dark:border-[#2e3a31] bg-[#fafaf8] dark:bg-[#263128]/60 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleQuickPrint}
            className="py-2.5 px-4 rounded-xl bg-white dark:bg-[#202922] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-700 dark:text-stone-200 font-bold border border-[#ecebe4] dark:border-[#2e3a31] flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Browser Print Dialog</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-[#f3f4ee] dark:hover:bg-[#263128] font-semibold"
            >
              Cancel
            </button>

            <button
              id="generate-pdf-download-btn"
              onClick={handleExport}
              disabled={isExporting}
              className="py-2.5 px-6 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white font-extrabold flex items-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExporting ? 'Generating PDF...' : 'Download Print-Ready PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
