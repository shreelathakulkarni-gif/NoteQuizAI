import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Layers, 
  KeyRound, 
  Sparkles, 
  Search, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  MessageSquare,
  Send,
  HelpCircle,
  FileText,
  Sliders,
  Headphones,
  Volume2,
  VolumeX,
  Play,
  Square
} from 'lucide-react';
import { copyNotesToClipboard, downloadNotesAsPDF, downloadNotesAsMarkdown, printNotes } from '../utils/exportUtils';
import { NoteLength, NotesData } from '../types';
import { NotesAudioPlayer } from './NotesAudioPlayer';
import { PDFExportModal } from './PDFExportModal';

export const NotesView: React.FC = () => {
  const { activeDocument, updateDocument, addToast, setActiveTab } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'overview' | 'detailed' | 'keypoints' | 'terms'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedNoteLength, setSelectedNoteLength] = useState<NoteLength>(
    activeDocument?.notes?.noteLength || 'medium'
  );

  // PDF Export Modal State
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  // Audio / Text-to-Speech states
  const [audioPlayerOpen, setAudioPlayerOpen] = useState(true);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // AI Tutor chat state
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorChatHistory, setTutorChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hi there! I am your AI Study Tutor for this document. Ask me to clarify any concept, explain a difficult formula, or summarize specific sections!'
    }
  ]);

  // Clean up any ongoing browser speech synthesis when unmounting or switching docs
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeDocument?.id]);

  if (!activeDocument || !activeDocument.notes) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31]">
        <FileText className="w-12 h-12 text-stone-400 mx-auto mb-3 opacity-50" />
        <h3 className="text-lg font-bold text-[#3d4a3e] dark:text-white">No Document Selected</h3>
        <p className="text-xs text-stone-500 mt-1 mb-6">Upload a PDF or select an existing document from your library.</p>
        <button
          id="notes-empty-upload-btn"
          onClick={() => setActiveTab('upload')}
          className="py-2.5 px-5 bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold rounded-xl shadow-xs"
        >
          Upload PDF Study Material
        </button>
      </div>
    );
  }

  const notes = activeDocument.notes;

  // Single snippet TTS narration helper
  const speakSnippet = (id: string, text: string, title?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      addToast({
        type: 'warning',
        title: 'Speech Unavailable',
        message: 'Text-to-speech is not supported by your browser.',
      });
      return;
    }

    if (activeSpeakingId === id) {
      window.speechSynthesis.cancel();
      setActiveSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setActiveSpeakingId(id);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    
    // Choose clear English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.default));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onend = () => {
      setActiveSpeakingId(null);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled') {
        console.warn('Speech error:', e);
      }
      setActiveSpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
    addToast({
      type: 'info',
      title: 'Listening on the Go',
      message: `Reading: ${title || 'Study Material'}`,
    });
  };

  // Toggle single section expand
  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id]
    }));
  };

  // Expand / Collapse all
  const expandAll = (expand: boolean) => {
    const newState: Record<string, boolean> = {};
    notes.detailedNotes.forEach(s => {
      newState[s.id] = expand;
    });
    setExpandedSections(newState);
  };

  // Filtered detailed notes based on search
  const filteredDetailedNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes.detailedNotes;
    const q = searchQuery.toLowerCase().trim();
    return notes.detailedNotes.filter(sec => 
      sec.heading.toLowerCase().includes(q) ||
      sec.subheading?.toLowerCase().includes(q) ||
      sec.bulletPoints.some(bp => bp.toLowerCase().includes(q)) ||
      sec.definitions?.some(d => d.term.toLowerCase().includes(q) || d.definition.toLowerCase().includes(q)) ||
      sec.examples?.some(e => e.toLowerCase().includes(q))
    );
  }, [notes.detailedNotes, searchQuery]);

  // Filtered key points
  const filteredKeyPoints = useMemo(() => {
    if (!searchQuery.trim()) return notes.keyPoints;
    const q = searchQuery.toLowerCase().trim();
    return notes.keyPoints.filter(kp => kp.toLowerCase().includes(q));
  }, [notes.keyPoints, searchQuery]);

  // Filtered terms
  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return notes.importantTerms;
    const q = searchQuery.toLowerCase().trim();
    return notes.importantTerms.filter(t => 
      t.term.toLowerCase().includes(q) || 
      t.definition.toLowerCase().includes(q) || 
      t.context?.toLowerCase().includes(q)
    );
  }, [notes.importantTerms, searchQuery]);

  // Copy notes action
  const handleCopy = async () => {
    const success = await copyNotesToClipboard(notes, activeDocument.title);
    if (success) {
      setCopied(true);
      addToast({ type: 'success', title: 'Notes Copied', message: 'Formatted notes copied to clipboard.' });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Download PDF
  const handleDownloadPDF = () => {
    downloadNotesAsPDF(notes, activeDocument.title);
    addToast({ type: 'success', title: 'PDF Downloaded', message: 'Study guide PDF created successfully.' });
  };

  // Download Markdown
  const handleDownloadMarkdown = () => {
    downloadNotesAsMarkdown(notes, activeDocument.title);
    addToast({ type: 'success', title: 'Markdown Downloaded', message: 'Markdown file saved.' });
  };

  // Regenerate Notes with selected length
  const handleRegenerate = async (lengthToUse?: NoteLength) => {
    const length = lengthToUse || selectedNoteLength;
    setIsRegenerating(true);

    try {
      const response = await fetch('/api/regenerate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extractedText: activeDocument.extractedText,
          title: activeDocument.title,
          noteLength: length,
        }),
      });

      if (!response.ok) throw new Error('Failed to regenerate notes.');

      const newNotes: NotesData = await response.json();
      newNotes.noteLength = length;
      
      updateDocument(activeDocument.id, {
        notes: newNotes,
      });

      setSelectedNoteLength(length);
      addToast({
        type: 'success',
        title: 'Notes Regenerated',
        message: `Notes updated with ${length.toUpperCase()} depth.`,
      });
    } catch (err: any) {
      console.error(err);
      addToast({ type: 'error', title: 'Regeneration Error', message: 'Could not regenerate notes at this time.' });
    } finally {
      setIsRegenerating(false);
    }
  };

  // Student AI Study Tutor message handler
  const handleSendTutorMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuestion.trim() || tutorLoading) return;

    const q = tutorQuestion.trim();
    setTutorQuestion('');
    setTutorChatHistory(prev => [...prev, { role: 'user', text: q }]);
    setTutorLoading(true);

    try {
      const response = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          contextText: activeDocument.extractedText,
          title: activeDocument.title,
        }),
      });

      const data = await response.json();
      setTutorChatHistory(prev => [...prev, { role: 'assistant', text: data.answer || 'Concept explained.' }]);
    } catch (err) {
      setTutorChatHistory(prev => [
        ...prev, 
        { role: 'assistant', text: 'I am here to help you study! Focus on reviewing the key terms and taking the 10-question practice quiz.' }
      ]);
    } finally {
      setTutorLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Primary Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#202922] p-6 rounded-2xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5f7464] dark:text-[#a7c2a9]">
              AI Smart Notes
            </span>
            <span className="text-xs text-stone-400">• Length: {notes.noteLength.toUpperCase()}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#3d4a3e] dark:text-white tracking-tight">
            {activeDocument.title}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Source: {activeDocument.fileName} • {activeDocument.pageCount} pages • Last generated: {new Date(notes.lastGeneratedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Note Length Selector */}
          <div className="flex items-center bg-[#fafaf8] dark:bg-[#263128] p-1 rounded-xl border border-[#ecebe4] dark:border-[#2e3a31]">
            {(['short', 'medium', 'detailed'] as NoteLength[]).map((len) => (
              <button
                key={len}
                id={`length-btn-${len}`}
                onClick={() => {
                  setSelectedNoteLength(len);
                  handleRegenerate(len);
                }}
                disabled={isRegenerating}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedNoteLength === len
                    ? 'bg-white dark:bg-[#303d32] text-[#5f7464] dark:text-[#a7c2a9] shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {len}
              </button>
            ))}
          </div>

          {/* Listen / TTS Player Toggle */}
          <button
            id="toggle-audio-player-btn"
            onClick={() => setAudioPlayerOpen(!audioPlayerOpen)}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              audioPlayerOpen 
                ? 'bg-[#5f7464] text-white border-[#5f7464] shadow-xs' 
                : 'bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-[#5f7464] dark:text-[#a7c2a9] border-[#ecebe4] dark:border-[#2e3a31]'
            }`}
            title="Listen to Study Material on the Go (Text-to-Speech)"
          >
            <Headphones className="w-4 h-4" />
            <span className="hidden sm:inline">Audio Narration</span>
          </button>

          {/* Copy Button */}
          <button
            id="copy-notes-btn"
            onClick={handleCopy}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#ecebe4] dark:border-[#2e3a31]"
            title="Copy all notes to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-[#5f7464]" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Download PDF button */}
          <button
            id="download-pdf-notes-btn"
            onClick={() => setPdfModalOpen(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            title="Export Formatted PDF Study Guide for Offline Printing"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF Guide</span>
          </button>

          <button
            id="download-md-notes-btn"
            onClick={handleDownloadMarkdown}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#ecebe4] dark:border-[#2e3a31]"
            title="Download Markdown file"
          >
            <FileText className="w-4 h-4 text-[#5f7464] dark:text-[#a7c2a9]" />
            <span className="hidden sm:inline">Markdown</span>
          </button>

          {/* Print Button */}
          <button
            id="print-notes-btn"
            onClick={printNotes}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#ecebe4] dark:border-[#2e3a31]"
            title="Print notes"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Regenerate Button */}
          <button
            id="regenerate-notes-btn"
            onClick={() => handleRegenerate()}
            disabled={isRegenerating}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
            title="Regenerate with AI"
          >
            <RotateCcw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Generating...' : 'Regenerate'}</span>
          </button>

          {/* AI Tutor Assistant Button */}
          <button
            id="toggle-tutor-drawer-btn"
            onClick={() => setTutorOpen(!tutorOpen)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#f3f4ee] dark:bg-[#263128] hover:bg-[#ecebe4] dark:hover:bg-[#303d32] text-[#5f7464] dark:text-[#a7c2a9] text-xs font-bold flex items-center gap-1.5 border border-[#ecebe4] dark:border-[#2e3a31] transition-colors"
            title="Ask AI Study Tutor"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>
        </div>
      </div>

      {/* DEDICATED AUDIO PLAYER BAR (ON-THE-GO LISTENING) */}
      {audioPlayerOpen && (
        <NotesAudioPlayer
          notes={notes}
          documentTitle={activeDocument.title}
          activeTab={activeTab}
          currentlyPlayingId={activeSpeakingId}
          onStop={() => setActiveSpeakingId(null)}
        />
      )}

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ecebe4] dark:border-[#2e3a31] pb-3">
        {/* 4 Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            id="tab-notes-overview"
            onClick={() => setActiveTabLocal('overview')}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#5f7464] text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-[#fafaf8] dark:hover:bg-[#263128]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            id="tab-notes-detailed"
            onClick={() => setActiveTabLocal('detailed')}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'detailed'
                ? 'bg-[#5f7464] text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-[#fafaf8] dark:hover:bg-[#263128]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Detailed Notes ({notes.detailedNotes?.length || 0})</span>
          </button>

          <button
            id="tab-notes-keypoints"
            onClick={() => setActiveTabLocal('keypoints')}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'keypoints'
                ? 'bg-[#5f7464] text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-[#fafaf8] dark:hover:bg-[#263128]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Key Points ({notes.keyPoints?.length || 0})</span>
          </button>

          <button
            id="tab-notes-terms"
            onClick={() => setActiveTabLocal('terms')}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'terms'
                ? 'bg-[#5f7464] text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-[#fafaf8] dark:hover:bg-[#263128]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Important Terms ({notes.importantTerms?.length || 0})</span>
          </button>
        </div>

        {/* Search within Notes Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-notes-input"
            type="text"
            placeholder="Search within notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5f7464]"
          />
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={tutorOpen ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#3d4a3e] dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#5f7464] dark:text-[#a7c2a9]" />
                    Executive Document Overview
                  </h3>
                  <button
                    id="listen-overview-btn"
                    onClick={() => speakSnippet('overview', `Overview for ${activeDocument.title}. ${notes.overview}`, 'Executive Overview')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      activeSpeakingId === 'overview'
                        ? 'bg-[#5f7464] text-white border-[#5f7464] animate-pulse'
                        : 'bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-[#5f7464] dark:text-[#a7c2a9] border-[#ecebe4] dark:border-[#2e3a31]'
                    }`}
                    title="Listen to Executive Overview"
                  >
                    {activeSpeakingId === 'overview' ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{activeSpeakingId === 'overview' ? 'Stop Listening' : 'Listen'}</span>
                  </button>
                </div>
                <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                  {notes.overview}
                </p>
              </div>

              {/* Detected Topics Grid */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">
                  Core Topics Detected
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeDocument.topics.map((topic, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] flex items-center gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#f3f4ee] dark:bg-[#202922] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center font-bold text-xs">
                        {i + 1}
                      </div>
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  id="jump-to-quiz-btn"
                  onClick={() => setActiveTab('quiz')}
                  className="py-2.5 px-4 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4" />
                  Practice MCQs on this material
                </button>
                <button
                  id="jump-to-flashcards-btn"
                  onClick={() => setActiveTab('flashcards')}
                  className="py-2.5 px-4 rounded-xl bg-[#3d4a3e] hover:bg-[#2f3930] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Layers className="w-4 h-4" />
                  Flip Revision Flashcards
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED NOTES */}
          {activeTab === 'detailed' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Expand / Collapse Controls */}
              <div className="flex items-center justify-between px-1 text-xs text-stone-500">
                <span>Showing {filteredDetailedNotes.length} section{filteredDetailedNotes.length !== 1 ? 's' : ''}</span>
                <div className="flex items-center gap-3">
                  <button
                    id="expand-all-sections-btn"
                    onClick={() => expandAll(true)}
                    className="hover:text-[#5f7464] font-medium"
                  >
                    Expand All
                  </button>
                  <span>•</span>
                  <button
                    id="collapse-all-sections-btn"
                    onClick={() => expandAll(false)}
                    className="hover:text-[#5f7464] font-medium"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {filteredDetailedNotes.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-[#202922] rounded-2xl border border-[#ecebe4] dark:border-[#2e3a31] text-stone-400 text-xs">
                  No note sections matched "{searchQuery}".
                </div>
              ) : (
                filteredDetailedNotes.map((section) => {
                  const isCollapsed = expandedSections[section.id] === false;
                  const isSpeakingThisSection = activeSpeakingId === section.id;

                  // Build text for section narration
                  const sectionSpeechText = `${section.heading}. ${section.subheading || ''}. ${section.bulletPoints.join('. ')}. ${
                    section.definitions ? section.definitions.map(d => `${d.term}: ${d.definition}`).join('. ') : ''
                  }`;

                  return (
                    <div
                      key={section.id}
                      id={`note-sec-${section.id}`}
                      className={`rounded-2xl bg-white dark:bg-[#202922] border shadow-xs overflow-hidden transition-all ${
                        isSpeakingThisSection 
                          ? 'border-[#5f7464] ring-2 ring-[#5f7464]/30' 
                          : 'border-[#ecebe4] dark:border-[#2e3a31]'
                      }`}
                    >
                      {/* Section Header */}
                      <div className="w-full flex items-center justify-between p-4 sm:p-5 bg-[#fafaf8] dark:bg-[#263128] border-b border-[#ecebe4] dark:border-[#2e3a31]">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="flex-1 flex items-center text-left pr-3 focus:outline-none"
                        >
                          <div className="pr-4">
                            <h3 className="text-sm sm:text-base font-bold text-[#3d4a3e] dark:text-white leading-tight">
                              {section.heading}
                            </h3>
                            {section.subheading && (
                              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                                {section.subheading}
                              </p>
                            )}
                          </div>
                        </button>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* In-line Listen Button */}
                          <button
                            id={`listen-sec-${section.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              speakSnippet(section.id, sectionSpeechText, section.heading);
                            }}
                            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                              isSpeakingThisSection
                                ? 'bg-[#5f7464] text-white border-[#5f7464] animate-pulse'
                                : 'bg-white dark:bg-[#202922] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-[#5f7464] dark:text-[#a7c2a9] border-[#ecebe4] dark:border-[#2e3a31]'
                            }`}
                            title={`Listen to ${section.heading}`}
                          >
                            {isSpeakingThisSection ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">{isSpeakingThisSection ? 'Stop' : 'Listen'}</span>
                          </button>

                          <button
                            onClick={() => toggleSection(section.id)}
                            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                            title={isCollapsed ? 'Expand' : 'Collapse'}
                          >
                            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Section Body */}
                      {!isCollapsed && (
                        <div className="p-6 space-y-4">
                          {/* Bullet points */}
                          <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                            {section.bulletPoints.map((bp, i) => (
                              <li key={i} className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#5f7464] dark:bg-[#a7c2a9] mt-2 shrink-0" />
                                <span className="leading-relaxed">{bp}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Definitions */}
                          {section.definitions && section.definitions.length > 0 && (
                            <div className="pt-3 border-t border-[#ecebe4] dark:border-[#2e3a31]">
                              <h5 className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
                                Key Definitions
                              </h5>
                              <div className="space-y-2">
                                {section.definitions.map((def, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs flex items-start justify-between gap-2"
                                  >
                                    <div>
                                      <span className="font-bold text-stone-900 dark:text-white">{def.term}: </span>
                                      <span className="text-stone-700 dark:text-stone-300">{def.definition}</span>
                                    </div>
                                    <button
                                      onClick={() => speakSnippet(`def-${idx}-${section.id}`, `${def.term}. ${def.definition}`, def.term)}
                                      className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 shrink-0"
                                      title="Pronounce term and definition"
                                    >
                                      <Volume2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Examples */}
                          {section.examples && section.examples.length > 0 && (
                            <div className="pt-2">
                              <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#5f7464] dark:text-[#a7c2a9] mb-2">
                                Practical Examples & Applications
                              </h5>
                              <div className="space-y-1.5">
                                {section.examples.map((ex, idx) => (
                                  <div
                                    key={idx}
                                    className="p-2.5 rounded-xl bg-[#f3f4ee] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] text-xs text-stone-700 dark:text-stone-300"
                                  >
                                    <strong className="text-[#3d4a3e] dark:text-[#a7c2a9]">Example: </strong>
                                    {ex}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: KEY POINTS */}
          {activeTab === 'keypoints' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs text-stone-500">
                  High-yield revision takeaways designed for rapid exam review.
                </p>
                <button
                  id="listen-all-keypoints-btn"
                  onClick={() => speakSnippet('all-keypoints', `High-Yield Takeaways: ${filteredKeyPoints.map((p, i) => `Point ${i + 1}: ${p}`).join('. ')}`, 'All Key Takeaways')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    activeSpeakingId === 'all-keypoints'
                      ? 'bg-[#5f7464] text-white border-[#5f7464] animate-pulse'
                      : 'bg-white dark:bg-[#202922] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-[#5f7464] dark:text-[#a7c2a9] border-[#ecebe4] dark:border-[#2e3a31]'
                  }`}
                  title="Listen to all key points sequentially"
                >
                  {activeSpeakingId === 'all-keypoints' ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{activeSpeakingId === 'all-keypoints' ? 'Stop' : 'Listen to All'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredKeyPoints.map((point, idx) => {
                  const isPlayingThisPoint = activeSpeakingId === `kp-${idx}`;
                  return (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl bg-white dark:bg-[#202922] border shadow-xs flex items-start gap-3.5 transition-all ${
                        isPlayingThisPoint 
                          ? 'border-[#5f7464] ring-2 ring-[#5f7464]/30' 
                          : 'border-[#ecebe4] dark:border-[#2e3a31] hover:border-[#5f7464] dark:hover:border-[#a7c2a9]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#f3f4ee] dark:bg-[#263128] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center font-bold text-xs shrink-0 border border-[#ecebe4] dark:border-[#2e3a31]">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                          {point}
                        </p>
                        <button
                          id={`listen-kp-${idx}-btn`}
                          onClick={() => speakSnippet(`kp-${idx}`, `Point ${idx + 1}: ${point}`, `Key Point ${idx + 1}`)}
                          className="text-[11px] font-bold text-[#5f7464] dark:text-[#a7c2a9] hover:underline flex items-center gap-1"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{isPlayingThisPoint ? 'Stop Audio' : 'Listen'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: IMPORTANT TERMS */}
          {activeTab === 'terms' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs text-stone-500">
                  Essential vocabulary and conceptual definitions extracted directly from the material.
                </p>
                <button
                  id="listen-all-terms-btn"
                  onClick={() => speakSnippet('all-terms', `Important Vocabulary: ${filteredTerms.map(t => `${t.term}: ${t.definition}`).join('. ')}`, 'All Important Terms')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    activeSpeakingId === 'all-terms'
                      ? 'bg-[#5f7464] text-white border-[#5f7464] animate-pulse'
                      : 'bg-white dark:bg-[#202922] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-[#5f7464] dark:text-[#a7c2a9] border-[#ecebe4] dark:border-[#2e3a31]'
                  }`}
                  title="Listen to all terms and definitions"
                >
                  {activeSpeakingId === 'all-terms' ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{activeSpeakingId === 'all-terms' ? 'Stop' : 'Listen to All'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {filteredTerms.map((t) => {
                  const isPlayingThisTerm = activeSpeakingId === `term-${t.id}`;
                  return (
                    <div
                      key={t.id}
                      className={`p-4 rounded-2xl bg-white dark:bg-[#202922] border shadow-xs flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 transition-all ${
                        isPlayingThisTerm 
                          ? 'border-[#5f7464] ring-2 ring-[#5f7464]/30' 
                          : 'border-[#ecebe4] dark:border-[#2e3a31] hover:border-[#5f7464] dark:hover:border-[#a7c2a9]'
                      }`}
                    >
                      <div className="sm:w-1/3 shrink-0 flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-[#5f7464] dark:text-[#a7c2a9]">
                            {t.term}
                          </span>
                          {t.context && (
                            <span className="block text-[10px] text-stone-400 mt-0.5">
                              {t.context}
                            </span>
                          )}
                        </div>
                        <button
                          id={`listen-term-${t.id}-btn`}
                          onClick={() => speakSnippet(`term-${t.id}`, `${t.term}. Definition: ${t.definition}`, t.term)}
                          className="p-1 text-stone-400 hover:text-[#5f7464] dark:hover:text-[#a7c2a9] shrink-0"
                          title={`Listen to pronunciation of ${t.term}`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex-1 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                        {t.definition}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* AI STUDY TUTOR DRAWER (Right Column) */}
        {tutorOpen && (
          <div className="lg:col-span-1 p-5 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-lg flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#ecebe4] dark:border-[#2e3a31] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#5f7464] text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#3d4a3e] dark:text-white">NoteQuiz AI Tutor</h4>
                  <p className="text-[10px] text-stone-400">Ask questions about this PDF</p>
                </div>
              </div>
              <button
                id="close-tutor-btn"
                onClick={() => setTutorOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
              {tutorChatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#5f7464] text-white ml-6 rounded-tr-xs'
                      : 'bg-[#fafaf8] dark:bg-[#263128] text-stone-800 dark:text-stone-200 mr-4 rounded-tl-xs border border-[#ecebe4] dark:border-[#2e3a31]'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {tutorLoading && (
                <div className="p-3 rounded-xl bg-[#fafaf8] dark:bg-[#263128] text-stone-400 text-xs mr-4 flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-[#5f7464] border-t-transparent rounded-full animate-spin" />
                  <span>Thinking...</span>
                </div>
              )}
            </div>

            {/* Question input form */}
            <form onSubmit={handleSendTutorMessage} className="mt-2 pt-2 border-t border-[#ecebe4] dark:border-[#2e3a31] flex gap-2 shrink-0">
              <input
                id="tutor-question-input"
                type="text"
                placeholder="Ask e.g. What is ReLU in plain English?"
                value={tutorQuestion}
                onChange={(e) => setTutorQuestion(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5f7464]"
              />
              <button
                id="tutor-send-btn"
                type="submit"
                disabled={!tutorQuestion.trim() || tutorLoading}
                className="p-2 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* PDF Export & Print Customizer Modal */}
      <PDFExportModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        notes={notes}
        documentTitle={activeDocument.title}
        flashcards={activeDocument.flashcards}
        quizQuestions={activeDocument.quiz}
      />
    </div>
  );
};
