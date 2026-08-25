import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  DocumentData, 
  UserSettings, 
  Toast, 
  QuizAttempt, 
  NoteLength, 
  QuizDifficulty,
  AppTheme
} from '../types';
import { SAMPLE_DOCUMENTS, INITIAL_USER } from '../data/demoData';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  documents: DocumentData[];
  activeDocumentId: string | null;
  activeDocument: DocumentData | null;
  setActiveDocumentId: (id: string | null) => void;
  addDocument: (doc: DocumentData) => void;
  updateDocument: (id: string, updates: Partial<DocumentData>) => void;
  deleteDocument: (id: string) => void;
  renameDocument: (id: string, newTitle: string) => void;
  recordQuizAttempt: (attempt: QuizAttempt) => void;
  toggleFlashcardRevision: (docId: string, cardId: string) => void;
  toggleFlashcardKnown: (docId: string, cardId: string) => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  loadDemoExperience: () => void;
  clearAllHistory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'notequiz_user',
  DOCUMENTS: 'notequiz_documents',
  SETTINGS: 'notequiz_settings',
  ACTIVE_DOC: 'notequiz_active_doc',
  TAB: 'notequiz_active_tab',
};

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  defaultNoteLength: 'medium',
  defaultQuizDifficulty: 'medium',
  defaultQuizCount: 10,
  notifications: true,
  autoPlayAudio: false,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User state
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TAB);
      return saved || 'landing';
    } catch {
      return 'landing';
    }
  });

  // Documents state
  const [documents, setDocuments] = useState<DocumentData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return SAMPLE_DOCUMENTS;
    } catch {
      return SAMPLE_DOCUMENTS;
    }
  });

  // Active document ID
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_DOC);
      return saved || 'doc-ai-foundations';
    } catch {
      return 'doc-ai-foundations';
    }
  });

  // Settings state
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [documents]);

  useEffect(() => {
    try {
      if (activeDocumentId) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_DOC, activeDocumentId);
      }
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [activeDocumentId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TAB, activeTab);
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [activeTab]);

  // Theme application
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // Active document helper
  const activeDocument = documents.find(d => d.id === activeDocumentId) || (documents.length > 0 ? documents[0] : null);

  // Toast Helpers
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth actions
  const login = async (email: string): Promise<boolean> => {
    const loggedUser: User = {
      id: 'user-' + Date.now(),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      joinedDate: 'August 2026',
      bio: 'Student exploring AI-accelerated learning with NoteQuiz AI.',
      institution: 'University College'
    };
    setUser(loggedUser);
    addToast({
      type: 'success',
      title: 'Welcome back!',
      message: `Signed in as ${email}`
    });
    return true;
  };

  const signup = async (name: string, email: string): Promise<boolean> => {
    const newUser: User = {
      id: 'user-' + Date.now(),
      name,
      email,
      joinedDate: 'August 2026',
      bio: 'Lifelong learner leveraging interactive AI notes and quizzes.',
      institution: 'University'
    };
    setUser(newUser);
    addToast({
      type: 'success',
      title: 'Account created!',
      message: `Welcome to NoteQuiz AI, ${name}!`
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    setActiveTab('landing');
    addToast({
      type: 'info',
      title: 'Signed out',
      message: 'You have been safely signed out.'
    });
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, ...data } : null);
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile changes have been saved.'
    });
  };

  // Document actions
  const addDocument = (doc: DocumentData) => {
    setDocuments(prev => [doc, ...prev]);
    setActiveDocumentId(doc.id);
    addToast({
      type: 'success',
      title: 'Document Ready!',
      message: `"${doc.title}" was analyzed and study materials generated.`
    });
  };

  const updateDocument = (id: string, updates: Partial<DocumentData>) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDocument = (id: string) => {
    const docToDelete = documents.find(d => d.id === id);
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (activeDocumentId === id) {
      const remaining = documents.filter(d => d.id !== id);
      setActiveDocumentId(remaining.length > 0 ? remaining[0].id : null);
    }
    addToast({
      type: 'info',
      title: 'Document Deleted',
      message: docToDelete ? `"${docToDelete.title}" was removed.` : 'Document removed.'
    });
  };

  const renameDocument = (id: string, newTitle: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, title: newTitle } : d));
    addToast({
      type: 'success',
      title: 'Document Renamed',
      message: `Title updated to "${newTitle}"`
    });
  };

  const recordQuizAttempt = (attempt: QuizAttempt) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === attempt.documentId) {
        return {
          ...doc,
          quizHistory: [attempt, ...(doc.quizHistory || [])]
        };
      }
      return doc;
    }));
    addToast({
      type: 'success',
      title: 'Quiz Score Saved!',
      message: `Score: ${attempt.score}/${attempt.totalQuestions} (${attempt.percentage}%)`
    });
  };

  const toggleFlashcardRevision = (docId: string, cardId: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          flashcards: doc.flashcards.map(fc => 
            fc.id === cardId ? { ...fc, isRevision: !fc.isRevision } : fc
          )
        };
      }
      return doc;
    }));
  };

  const toggleFlashcardKnown = (docId: string, cardId: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          flashcards: doc.flashcards.map(fc => 
            fc.id === cardId ? { ...fc, isKnown: !fc.isKnown, isRevision: fc.isKnown ? fc.isRevision : false } : fc
          )
        };
      }
      return doc;
    }));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your preferences have been updated.'
    });
  };

  const toggleTheme = () => {
    const nextTheme: AppTheme = settings.theme === 'dark' ? 'light' : 'dark';
    setSettings(prev => ({ ...prev, theme: nextTheme }));
    addToast({
      type: 'info',
      title: nextTheme === 'dark' ? 'Night Study Mode Activated' : 'Light Academic Mode Activated',
      message: nextTheme === 'dark' 
        ? 'Switched to eye-safe Night Study theme (dark earth & deep forest tones).' 
        : 'Switched to crisp Light Academic theme (linen paper & sage tones).'
    });
  };

  const setTheme = (newTheme: AppTheme) => {
    setSettings(prev => ({ ...prev, theme: newTheme }));
    addToast({
      type: 'info',
      title: newTheme === 'dark' ? 'Night Study Mode' : newTheme === 'light' ? 'Light Academic Mode' : 'System Theme',
      message: `Theme set to ${newTheme === 'dark' ? 'Night Study' : newTheme === 'light' ? 'Light Academic' : 'System Default'}.`
    });
  };

  const loadDemoExperience = () => {
    setDocuments(SAMPLE_DOCUMENTS);
    setActiveDocumentId('doc-ai-foundations');
    setActiveTab('dashboard');
    addToast({
      type: 'success',
      title: 'Demo Loaded!',
      message: 'Explore notes, take a 10-question MCQ quiz, and review flashcards.'
    });
  };

  const clearAllHistory = () => {
    setDocuments(SAMPLE_DOCUMENTS);
    setActiveDocumentId('doc-ai-foundations');
    addToast({
      type: 'info',
      title: 'Data Reset',
      message: 'Quiz histories and documents have been reset to default state.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        documents,
        activeDocumentId,
        activeDocument,
        setActiveDocumentId,
        addDocument,
        updateDocument,
        deleteDocument,
        renameDocument,
        recordQuizAttempt,
        toggleFlashcardRevision,
        toggleFlashcardKnown,
        settings,
        updateSettings,
        toggleTheme,
        setTheme,
        toasts,
        addToast,
        removeToast,
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isSearchOpen,
        setIsSearchOpen,
        loadDemoExperience,
        clearAllHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
