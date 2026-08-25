import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Layers, 
  Rotate3d, 
  ArrowLeft, 
  ArrowRight, 
  Shuffle, 
  Star, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Plus, 
  X, 
  Filter, 
  Sparkles,
  HelpCircle,
  Eye
} from 'lucide-react';
import { FlashcardItem } from '../types';

export const FlashcardsView: React.FC = () => {
  const { activeDocument, updateDocument, addToast, setActiveTab } = useApp();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'revision' | 'learning' | 'mastered'>('all');
  
  // Custom Card Creation Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [customFront, setCustomFront] = useState<string>('');
  const [customBack, setCustomBack] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');

  if (!activeDocument || !activeDocument.flashcards) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31]">
        <Layers className="w-12 h-12 text-stone-400 mx-auto mb-3 opacity-50" />
        <h3 className="text-lg font-bold text-[#3d4a3e] dark:text-white">No Flashcard Deck Found</h3>
        <p className="text-xs text-stone-500 mt-1 mb-6">Select a document from your library or upload a new study PDF.</p>
        <button
          id="flashcards-empty-upload-btn"
          onClick={() => setActiveTab('upload')}
          className="py-2.5 px-5 bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold rounded-xl shadow-xs"
        >
          Upload PDF
        </button>
      </div>
    );
  }

  const allCards = activeDocument.flashcards;

  // Filter cards
  const displayedCards = useMemo(() => {
    switch (filterMode) {
      case 'revision':
        return allCards.filter(c => c.isStarred);
      case 'learning':
        return allCards.filter(c => !c.isKnown);
      case 'mastered':
        return allCards.filter(c => c.isKnown);
      case 'all':
      default:
        return allCards;
    }
  }, [allCards, filterMode]);

  // Current Card
  const currentCard: FlashcardItem | undefined = displayedCards[currentIndex] || displayedCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1 < displayedCards.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 >= 0 ? prev - 1 : displayedCards.length - 1));
  };

  const handleShuffle = () => {
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    updateDocument(activeDocument.id, { flashcards: shuffled });
    setCurrentIndex(0);
    setIsFlipped(false);
    addToast({ type: 'info', title: 'Deck Shuffled', message: 'Cards randomized for optimal spaced recall.' });
  };

  // Toggle Known / Mastered
  const toggleKnown = (isKnown: boolean) => {
    if (!currentCard) return;
    const updated = allCards.map(c => c.id === currentCard.id ? { ...c, isKnown } : c);
    updateDocument(activeDocument.id, { flashcards: updated });
    
    // Auto advance
    setTimeout(() => {
      handleNext();
    }, 200);
  };

  // Toggle Star / Revision
  const toggleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    const updated = allCards.map(c => c.id === currentCard.id ? { ...c, isStarred: !c.isStarred } : c);
    updateDocument(activeDocument.id, { flashcards: updated });
  };

  // Reset progress
  const handleResetProgress = () => {
    const reset = allCards.map(c => ({ ...c, isKnown: false, isStarred: false }));
    updateDocument(activeDocument.id, { flashcards: reset });
    setCurrentIndex(0);
    setIsFlipped(false);
    addToast({ type: 'info', title: 'Progress Reset', message: 'All flashcard states reset to learning mode.' });
  };

  // Add Custom Flashcard
  const handleAddCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFront.trim() || !customBack.trim()) return;

    const newCard: FlashcardItem = {
      id: 'fc-custom-' + Date.now(),
      front: customFront.trim(),
      back: customBack.trim(),
      topic: customTopic.trim() || 'Custom Term',
      isKnown: false,
      isStarred: false,
    };

    updateDocument(activeDocument.id, {
      flashcards: [newCard, ...allCards],
    });

    setCustomFront('');
    setCustomBack('');
    setCustomTopic('');
    setIsCreateModalOpen(false);
    setCurrentIndex(0);
    setIsFlipped(false);

    addToast({ type: 'success', title: 'Card Created', message: 'Custom flashcard added to this deck.' });
  };

  // Metrics
  const totalCount = allCards.length;
  const knownCount = allCards.filter(c => c.isKnown).length;
  const starredCount = allCards.filter(c => c.isStarred).length;
  const masteryPercentage = totalCount > 0 ? Math.round((knownCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#202922] p-6 rounded-2xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5f7464] dark:text-[#a7c2a9]">
              Interactive 3D Flashcards
            </span>
            <span className="text-xs text-stone-400">• {masteryPercentage}% Mastered</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#3d4a3e] dark:text-white tracking-tight">
            {activeDocument.title}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Active recall cards synthesized from course notes with spaced repetition indicators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="add-custom-card-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="py-2 px-3.5 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>

          <button
            id="shuffle-flashcards-btn"
            onClick={handleShuffle}
            className="p-2 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-700 dark:text-stone-200 text-xs font-semibold border border-[#ecebe4] dark:border-[#2e3a31]"
            title="Shuffle Cards"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            id="reset-flashcards-progress-btn"
            onClick={handleResetProgress}
            className="p-2 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-700 dark:text-stone-200 text-xs font-semibold border border-[#ecebe4] dark:border-[#2e3a31]"
            title="Reset Mastered Progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Mastery Tracker Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            id="filter-cards-all"
            onClick={() => { setFilterMode('all'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-[#5f7464] text-white shadow-xs'
                : 'bg-white dark:bg-[#202922] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31]'
            }`}
          >
            All Cards ({totalCount})
          </button>

          <button
            id="filter-cards-revision"
            onClick={() => { setFilterMode('revision'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'revision'
                ? 'bg-[#5f7464] text-white shadow-xs'
                : 'bg-white dark:bg-[#202922] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31]'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>Marked for Revision ({starredCount})</span>
          </button>

          <button
            id="filter-cards-learning"
            onClick={() => { setFilterMode('learning'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'learning'
                ? 'bg-[#5f7464] text-white shadow-xs'
                : 'bg-white dark:bg-[#202922] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31]'
            }`}
          >
            Still Learning ({totalCount - knownCount})
          </button>

          <button
            id="filter-cards-mastered"
            onClick={() => { setFilterMode('mastered'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'mastered'
                ? 'bg-[#5f7464] text-white shadow-xs'
                : 'bg-white dark:bg-[#202922] text-stone-600 dark:text-stone-300 border border-[#ecebe4] dark:border-[#2e3a31]'
            }`}
          >
            Mastered ({knownCount})
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
            {knownCount}/{totalCount} Mastered
          </span>
          <div className="w-32 bg-[#ecebe4] dark:bg-[#2e3a31] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#5f7464] h-full rounded-full transition-all duration-300"
              style={{ width: `${masteryPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* FLASHCARD INTERACTIVE 3D FLIP CONTAINER */}
      {displayedCards.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] text-stone-400 text-xs">
          No flashcards in this filter category.
        </div>
      ) : currentCard ? (
        <div className="space-y-6">
          {/* Card Meta details */}
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-2">
            <span>
              Card {currentIndex + 1} of {displayedCards.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#f3f4ee] dark:bg-[#263128] text-[11px] font-bold text-[#3d4a3e] dark:text-[#a7c2a9] border border-[#ecebe4] dark:border-[#2e3a31]">
              {currentCard.topic}
            </span>
          </div>

          {/* 3D Flip Card */}
          <div 
            id="flashcard-3d-box"
            className="w-full h-80 sm:h-96 [perspective:1000px] cursor-pointer select-none"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform rounded-3xl shadow-sm ${
                isFlipped ? '[transform:rotateY(180deg)]' : ''
              }`}
            >
              {/* FRONT SIDE */}
              <div className="absolute inset-0 w-full h-full bg-white dark:bg-[#202922] p-8 sm:p-12 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] flex flex-col justify-between [backface-visibility:hidden]">
                {/* Top toolbar */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5f7464] dark:text-[#a7c2a9] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Question / Term
                  </span>
                  <button
                    id="star-card-btn-front"
                    onClick={toggleStar}
                    className="p-2 rounded-full hover:bg-[#f3f4ee] dark:hover:bg-[#263128] transition-colors"
                  >
                    <Star className={`w-5 h-5 ${currentCard.isStarred ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                  </button>
                </div>

                {/* Question Text */}
                <div className="text-center my-auto">
                  <p className="text-lg sm:text-2xl font-bold text-[#3d4a3e] dark:text-white leading-relaxed">
                    {currentCard.front}
                  </p>
                </div>

                {/* Bottom hint */}
                <div className="flex items-center justify-center gap-2 text-xs text-stone-400 font-medium">
                  <Rotate3d className="w-4 h-4" />
                  <span>Click anywhere on card to reveal answer</span>
                </div>
              </div>

              {/* BACK SIDE */}
              <div className="absolute inset-0 w-full h-full bg-[#f3f4ee] dark:bg-[#263128] p-8 sm:p-12 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden]">
                {/* Top toolbar */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5f7464] dark:text-[#a7c2a9] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Answer / Definition
                  </span>
                  <button
                    id="star-card-btn-back"
                    onClick={toggleStar}
                    className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-[#303d32] transition-colors"
                  >
                    <Star className={`w-5 h-5 ${currentCard.isStarred ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                  </button>
                </div>

                {/* Answer Text */}
                <div className="text-center my-auto overflow-y-auto max-h-48 px-2">
                  <p className="text-base sm:text-xl font-medium text-[#3d4a3e] dark:text-stone-100 leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>

                {/* Bottom hint */}
                <div className="flex items-center justify-center gap-2 text-xs text-[#5f7464] dark:text-[#a7c2a9] font-medium">
                  <Rotate3d className="w-4 h-4" />
                  <span>Click to flip back to question</span>
                </div>
              </div>
            </div>
          </div>

          {/* Spaced Repetition Mastery Buttons & Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {/* Prev / Next */}
            <div className="flex items-center gap-3">
              <button
                id="flashcard-prev-btn"
                onClick={handlePrev}
                className="py-2.5 px-4 rounded-xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-[#fafaf8] flex items-center gap-1.5 shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                id="flashcard-next-btn"
                onClick={handleNext}
                className="py-2.5 px-5 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mastery Actions */}
            <div className="flex items-center gap-3">
              <button
                id="mark-still-learning-btn"
                onClick={() => toggleKnown(false)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                  !currentCard.isKnown
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-700 dark:text-rose-300'
                    : 'bg-white dark:bg-[#202922] border-[#ecebe4] dark:border-[#2e3a31] text-stone-600 dark:text-stone-300 hover:bg-rose-50/50'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Still Learning</span>
              </button>

              <button
                id="mark-mastered-btn"
                onClick={() => toggleKnown(true)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                  currentCard.isKnown
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                    : 'bg-white dark:bg-[#202922] border-[#ecebe4] dark:border-[#2e3a31] text-stone-600 dark:text-stone-300 hover:bg-emerald-50/50'
                }`}
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Mastered</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* CREATE CUSTOM CARD MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#202922] rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#ecebe4] dark:border-[#2e3a31]">
              <h3 className="font-bold text-base text-[#3d4a3e] dark:text-white">
                Add Custom Flashcard
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomCard} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Topic / Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Neural Networks"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5f7464]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Front (Question or Term)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. What is the difference between supervised and unsupervised learning?"
                  value={customFront}
                  onChange={(e) => setCustomFront(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5f7464]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Back (Answer or Explanation)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Supervised learning trains on labeled ground truth data, while unsupervised discovers latent clusters without labels."
                  value={customBack}
                  onChange={(e) => setCustomBack(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5f7464]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-[#fafaf8] dark:hover:bg-[#263128]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold shadow-xs"
                >
                  Add to Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
