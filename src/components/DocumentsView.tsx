import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FolderOpen, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  Download, 
  Trash2, 
  Edit3, 
  Search, 
  Plus, 
  MoreVertical, 
  ArrowUpDown, 
  Check, 
  X,
  AlertTriangle
} from 'lucide-react';
import { downloadNotesAsPDF, downloadFlashcardsAsCSV } from '../utils/exportUtils';
import { DocumentData } from '../types';

export const DocumentsView: React.FC = () => {
  const { 
    documents, 
    activeDocumentId, 
    setActiveDocumentId, 
    deleteDocument, 
    updateDocument, 
    setActiveTab, 
    addToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [deletingDoc, setDeletingDoc] = useState<DocumentData | null>(null);

  // Filter & Sort documents
  const filteredDocs = useMemo(() => {
    let result = documents.filter(d => 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'size') {
        return b.fileSize - a.fileSize;
      } else {
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
    });

    return result;
  }, [documents, searchQuery, sortBy]);

  const handleStartRename = (doc: DocumentData, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDocId(doc.id);
    setEditingTitle(doc.title);
  };

  const handleSaveRename = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTitle.trim()) return;

    updateDocument(id, { title: editingTitle.trim() });
    setEditingDocId(null);
    addToast({ type: 'success', title: 'Document Renamed', message: 'Title updated successfully.' });
  };

  const handleDeleteConfirm = () => {
    if (!deletingDoc) return;
    deleteDocument(deletingDoc.id);
    setDeletingDoc(null);
    addToast({ type: 'info', title: 'Document Removed', message: 'Material removed from library.' });
  };

  const handleDownloadPDF = (doc: DocumentData, e: React.MouseEvent) => {
    e.stopPropagation();
    if (doc.notes) {
      downloadNotesAsPDF(doc.notes, doc.title);
      addToast({ type: 'success', title: 'Download Started', message: `Exporting PDF for "${doc.title}".` });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#202922] p-6 rounded-2xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5f7464] dark:text-[#a7c2a9]">
              Study Library
            </span>
            <span className="text-xs text-stone-400">• {documents.length} PDF{documents.length !== 1 ? 's' : ''}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#3d4a3e] dark:text-white tracking-tight">
            My Study Documents
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your uploaded textbooks, course notes, generated MCQ decks, and flashcards.
          </p>
        </div>

        <button
          id="documents-upload-new-btn"
          onClick={() => setActiveTab('upload')}
          className="py-2.5 px-4 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New PDF</span>
        </button>
      </div>

      {/* Toolbar (Search & Sort) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-documents-library-input"
            type="text"
            placeholder="Search by title, file name, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5f7464]"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort:</span>
          <select
            id="sort-documents-select"
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="py-1.5 px-3 bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-stone-200 focus:outline-none"
          >
            <option value="date">Most Recent</option>
            <option value="name">Title (A-Z)</option>
            <option value="size">File Size</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31]">
          <FileText className="w-12 h-12 text-stone-400 mx-auto mb-3 opacity-40" />
          <h3 className="text-sm font-bold text-[#3d4a3e] dark:text-white">No documents matched your query</h3>
          <p className="text-xs text-stone-500 mt-1 mb-4">Try searching for a different keyword or upload a new PDF.</p>
          <button
            onClick={() => setActiveTab('upload')}
            className="py-2 px-4 bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Upload Study PDF
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => {
            const isSelected = doc.id === activeDocumentId;
            const isEditing = editingDocId === doc.id;

            return (
              <div
                key={doc.id}
                id={`doc-card-${doc.id}`}
                onClick={() => {
                  setActiveDocumentId(doc.id);
                  setActiveTab('notes');
                }}
                className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-[#f3f4ee]/80 dark:bg-[#263128] border-[#5f7464] shadow-xs'
                    : 'bg-white dark:bg-[#202922] border-[#ecebe4] dark:border-[#2e3a31] hover:border-[#5f7464] hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Top card bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f3f4ee] dark:bg-[#263128] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center shrink-0 border border-[#ecebe4] dark:border-[#2e3a31]">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        id={`rename-doc-${doc.id}`}
                        onClick={(e) => handleStartRename(doc, e)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-[#fafaf8] dark:hover:bg-[#263128] transition-colors"
                        title="Rename Document"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`download-pdf-doc-${doc.id}`}
                        onClick={(e) => handleDownloadPDF(doc, e)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-[#5f7464] dark:hover:text-[#a7c2a9] hover:bg-[#fafaf8] dark:hover:bg-[#263128] transition-colors"
                        title="Download Notes PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`delete-doc-${doc.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingDoc(doc);
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title / Inline Rename */}
                  {isEditing ? (
                    <form onSubmit={(e) => handleSaveRename(doc.id, e)} onClick={(e) => e.stopPropagation()} className="mb-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          autoFocus
                          className="flex-1 py-1 px-2 text-xs bg-[#fafaf8] dark:bg-[#263128] border border-[#5f7464] rounded-lg text-[#3d4a3e] dark:text-white"
                        />
                        <button type="submit" className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => setEditingDocId(null)} className="p-1 text-stone-400 hover:bg-[#fafaf8] rounded">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>
                  ) : (
                    <h3 className="text-sm font-bold text-[#3d4a3e] dark:text-white group-hover:text-[#5f7464] transition-colors line-clamp-2 mb-1">
                      {doc.title}
                    </h3>
                  )}

                  <p className="text-[11px] text-stone-400 line-clamp-1 mb-3">
                    {doc.fileName} • {(doc.fileSize / (1024 * 1024)).toFixed(1)} MB • {doc.pageCount} pages
                  </p>

                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed mb-4">
                    {doc.summary}
                  </p>
                </div>

                {/* Bottom Quick Modules Bar */}
                <div className="pt-3 border-t border-[#ecebe4] dark:border-[#2e3a31] flex items-center justify-between gap-1 text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDocumentId(doc.id);
                      setActiveTab('notes');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-[#f3f4ee] dark:hover:bg-[#263128] hover:text-[#5f7464] dark:hover:text-[#a7c2a9] transition-colors"
                  >
                    <BookOpen className="w-3 h-3 text-[#5f7464]" />
                    <span>Notes</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDocumentId(doc.id);
                      setActiveTab('quiz');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-[#f3f4ee] dark:hover:bg-[#263128] hover:text-[#3d4a3e] dark:hover:text-[#a7c2a9] transition-colors"
                  >
                    <HelpCircle className="w-3 h-3 text-[#5f7464]" />
                    <span>{doc.quiz.length} MCQs</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDocumentId(doc.id);
                      setActiveTab('flashcards');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-[#f3f4ee] dark:hover:bg-[#263128] hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                  >
                    <Layers className="w-3 h-3 text-amber-500" />
                    <span>{doc.flashcards.length} Cards</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#202922] rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#3d4a3e] dark:text-white">
              Delete Study Material?
            </h3>
            <p className="text-xs text-stone-500 mt-2 mb-6">
              Are you sure you want to remove <strong className="text-[#3d4a3e] dark:text-stone-200">"{deletingDoc.title}"</strong>? All associated notes, MCQs, and flashcards will be permanently deleted.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingDoc(null)}
                className="py-2.5 px-5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-[#fafaf8] dark:hover:bg-[#263128]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
