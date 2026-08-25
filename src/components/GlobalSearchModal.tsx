import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Search, FileText, BookOpen, HelpCircle, Layers, ArrowRight, X } from 'lucide-react';
import { GlobalSearchResult } from '../types';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    documents, 
    setActiveDocumentId, 
    setActiveTab 
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Keyboard shortcut listener (Cmd/Ctrl + K and Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Build searchable index
  const results = useMemo<GlobalSearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const matches: GlobalSearchResult[] = [];

    documents.forEach((doc) => {
      // 1. Match document title & file name
      if (doc.title.toLowerCase().includes(q) || doc.fileName.toLowerCase().includes(q)) {
        matches.push({
          id: `doc-${doc.id}`,
          type: 'document',
          title: doc.title,
          subtitle: `PDF Document • ${doc.pageCount} pages`,
          documentId: doc.id,
          targetTab: 'notes',
        });
      }

      // 2. Match Topics
      doc.topics.forEach((topic) => {
        if (topic.toLowerCase().includes(q)) {
          matches.push({
            id: `topic-${doc.id}-${topic}`,
            type: 'note',
            title: topic,
            subtitle: `Topic in "${doc.title}"`,
            documentId: doc.id,
            targetTab: 'notes',
          });
        }
      });

      // 3. Match Note Sections
      doc.notes?.detailedNotes.forEach((sec) => {
        if (sec.heading.toLowerCase().includes(q) || sec.subheading?.toLowerCase().includes(q)) {
          matches.push({
            id: `sec-${sec.id}`,
            type: 'note',
            title: sec.heading,
            subtitle: `Note Section in "${doc.title}"`,
            documentId: doc.id,
            targetTab: 'notes',
          });
        }
      });

      // 4. Match Important Terms
      doc.notes?.importantTerms.forEach((t) => {
        if (t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)) {
          matches.push({
            id: `term-${t.id}`,
            type: 'term',
            title: t.term,
            subtitle: `Definition: ${t.definition.slice(0, 75)}...`,
            documentId: doc.id,
            targetTab: 'notes',
          });
        }
      });

      // 5. Match Quiz Questions
      doc.quiz?.forEach((qz, idx) => {
        if (qz.question.toLowerCase().includes(q) || qz.topic.toLowerCase().includes(q)) {
          matches.push({
            id: `quiz-${qz.id || idx}`,
            type: 'quiz',
            title: `Quiz Q: ${qz.question.slice(0, 65)}...`,
            subtitle: `Topic: ${qz.topic} • In "${doc.title}"`,
            documentId: doc.id,
            targetTab: 'quiz',
          });
        }
      });

      // 6. Match Flashcards
      doc.flashcards?.forEach((fc) => {
        if (fc.front.toLowerCase().includes(q) || fc.back.toLowerCase().includes(q)) {
          matches.push({
            id: `fc-${fc.id}`,
            type: 'flashcard',
            title: fc.front,
            subtitle: `Flashcard in "${doc.title}"`,
            documentId: doc.id,
            targetTab: 'flashcards',
          });
        }
      });
    });

    return matches.slice(0, 12);
  }, [query, documents]);

  if (!isSearchOpen) return null;

  const handleSelectResult = (result: GlobalSearchResult) => {
    setActiveDocumentId(result.documentId);
    if (result.targetTab) {
      setActiveTab(result.targetTab);
    }
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="global-search-container"
        className="w-full max-w-2xl bg-white dark:bg-[#202922] rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#ecebe4] dark:border-[#2e3a31] gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            id="global-search-input"
            ref={inputRef}
            type="text"
            placeholder="Search documents, note topics, MCQs, definitions, flashcards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#3d4a3e] dark:text-white placeholder-stone-400 focus:outline-none"
          />
          {query && (
            <button
              id="clear-global-search-btn"
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-stone-400 bg-[#f3f4ee] dark:bg-[#263128] rounded border border-[#ecebe4] dark:border-[#2e3a31]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-[#ecebe4] dark:divide-[#2e3a31]/60">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-stone-400 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>Type to search across all uploaded materials, generated notes, MCQs, and flashcards.</p>
              <p className="mt-1 text-stone-400">Pro tip: Press <span className="font-semibold text-stone-600 dark:text-stone-300">Cmd+K</span> or <span className="font-semibold text-stone-600 dark:text-stone-300">Ctrl+K</span> anywhere.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-xs">
              <p>No results found for "{query}".</p>
              <p className="mt-1 text-stone-500">Try searching for a broad keyword or subject name.</p>
            </div>
          ) : (
            results.map((result) => {
              let Icon = FileText;
              let iconColor = 'text-[#5f7464] bg-[#f3f4ee] dark:bg-[#263128]';

              if (result.type === 'note') {
                Icon = BookOpen;
                iconColor = 'text-[#5f7464] bg-[#f3f4ee] dark:bg-[#263128]';
              } else if (result.type === 'quiz') {
                Icon = HelpCircle;
                iconColor = 'text-[#3d4a3e] bg-[#f3f4ee] dark:bg-[#263128]';
              } else if (result.type === 'flashcard' || result.type === 'term') {
                Icon = Layers;
                iconColor = 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50';
              }

              return (
                <button
                  key={result.id}
                  id={`search-res-${result.id}`}
                  onClick={() => handleSelectResult(result)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#fafaf8] dark:hover:bg-[#263128]/70 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-[#ecebe4] dark:border-[#2e3a31] ${iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#3d4a3e] dark:text-white truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        {result.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#fafaf8] dark:bg-[#263128]/40 border-t border-[#ecebe4] dark:border-[#2e3a31] text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
          <span>Search index updated from {documents.length} document{documents.length !== 1 ? 's' : ''}</span>
          <button
            id="close-search-modal-bottom-btn"
            onClick={() => setIsSearchOpen(false)}
            className="hover:underline text-stone-600 dark:text-stone-300 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
