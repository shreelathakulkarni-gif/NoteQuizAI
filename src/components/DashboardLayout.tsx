import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FolderOpen, 
  UploadCloud, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  TrendingUp, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  ChevronDown, 
  Sparkles, 
  FileText, 
  Plus,
  Home,
  Check
} from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NoteQuizLogo } from './NoteQuizLogo';
import { StationeryBackground } from './StationeryBackground';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { 
    activeTab, 
    setActiveTab, 
    isSidebarCollapsed, 
    setIsSidebarCollapsed, 
    user, 
    logout, 
    settings, 
    updateSettings, 
    toggleTheme,
    documents, 
    activeDocumentId, 
    setActiveDocumentId, 
    setIsSearchOpen 
  } = useApp();

  const [docDropdownOpen, setDocDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const activeDoc = documents.find(d => d.id === activeDocumentId) || documents[0];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'My Documents', icon: FolderOpen, badge: documents.length },
    { id: 'upload', label: 'Upload PDF', icon: UploadCloud, highlight: true },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="relative min-h-screen bg-[#f7f4ed] dark:bg-[#1c1917] text-[#3b352f] dark:text-[#f0ebe1] flex flex-col md:flex-row transition-colors overflow-x-hidden">
      {/* Cool Stationery Desk Theme Background (Compass, Bag, Pencil, Eraser, Ruler & Doodles) */}
      <StationeryBackground />

      {/* 1. Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-white dark:bg-[#26221f] border-r border-[#e8dfd1] dark:border-[#3b352f] transition-all duration-300 ${
          isSidebarCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#e8dfd1] dark:border-[#3b352f] shrink-0">
          <div 
            className="flex items-center cursor-pointer overflow-hidden" 
            onClick={() => setActiveTab('dashboard')}
          >
            {isSidebarCollapsed ? (
              <NoteQuizLogo variant="icon" size="md" />
            ) : (
              <NoteQuizLogo variant="badge" size="sm" showTagline={false} />
            )}
          </div>
          
          <button
            id="collapse-sidebar-btn"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-[#f4ede2] dark:hover:bg-[#332c25] md:flex hidden"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) {
                    setIsSidebarCollapsed(true);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#f4ede2] dark:bg-[#38312a] text-[#8c7355] dark:text-[#aa957c] font-bold shadow-xs'
                    : item.highlight
                    ? 'bg-[#f9f6f0] dark:bg-[#2e2924] text-[#8c7355] dark:text-[#d4c5b0] hover:bg-[#f4ede2] dark:hover:bg-[#38312a] font-semibold border border-[#ded3c1] dark:border-[#443b32]'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-[#fbf9f4] dark:hover:bg-[#2e2924] hover:text-[#5e4b35] dark:hover:text-stone-200'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#8c7355] dark:text-[#aa957c]' : item.highlight ? 'text-[#8c7355] dark:text-[#aa957c]' : 'text-stone-400 dark:text-stone-500'}`} />
                {!isSidebarCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!isSidebarCollapsed && item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#8c7355] text-white' : 'bg-[#e8dfd1] dark:bg-[#38312a] text-[#8c7355] dark:text-[#aa957c]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Streak Widget */}
        {!isSidebarCollapsed && (
          <div className="p-4 mx-3 mb-2 bg-[#f4ede2] dark:bg-[#2e2924] rounded-2xl border border-[#e8dfd1] dark:border-[#3b352f]">
            <p className="text-[11px] font-bold text-[#8c7355] dark:text-[#aa957c] uppercase tracking-wider mb-1.5">Study Streak</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-[#5e4b35] dark:text-white">3 Days</span>
              <div className="w-7 h-7 bg-white dark:bg-[#26221f] rounded-full flex items-center justify-center text-orange-500 shadow-xs text-xs">🔥</div>
            </div>
          </div>
        )}

        {/* Bottom Actions / Logout */}
        <div className="p-3 border-t border-[#e8dfd1] dark:border-[#3b352f] shrink-0 space-y-1">
          <button
            id="sidebar-landing-btn"
            onClick={() => setActiveTab('landing')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-stone-500 dark:text-stone-400 hover:bg-[#f4ede2] dark:hover:bg-[#332c25] hover:text-[#5e4b35] dark:hover:text-stone-200 transition-colors"
          >
            <Home className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Landing Page</span>}
          </button>

          <button
            id="sidebar-logout-btn"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!isSidebarCollapsed && (
        <div 
          onClick={() => setIsSidebarCollapsed(true)} 
          className="fixed inset-0 z-20 bg-stone-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* 2. Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 h-16 bg-[#f7f4ed]/95 dark:bg-[#26221f]/95 backdrop-blur-md border-b border-[#e8dfd1] dark:border-[#3b352f] px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & Active Document Selector */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-[#f4ede2] dark:hover:bg-[#332c25] md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Document Switcher dropdown */}
            <div className="relative">
              <button
                id="active-doc-dropdown-btn"
                onClick={() => setDocDropdownOpen(!docDropdownOpen)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-[#f9f6f0] dark:bg-[#2e2924] hover:bg-[#f4ede2] dark:hover:bg-[#38312a] text-xs font-semibold text-[#5e4b35] dark:text-[#d4c5b0] border border-[#ded3c1] dark:border-[#443b32] transition-colors max-w-[200px] sm:max-w-xs truncate shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#8c7355] dark:text-[#aa957c] shrink-0" />
                <span className="truncate">{activeDoc?.title || 'Select Study PDF'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </button>

              {docDropdownOpen && (
                <div 
                  id="doc-selector-menu"
                  className="absolute left-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#26221f] rounded-2xl border border-[#e8dfd1] dark:border-[#3b352f] shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-2 py-1.5 text-[11px] font-bold text-[#8c7355] dark:text-[#aa957c] uppercase tracking-wider">
                    Study Documents ({documents.length})
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {documents.map((doc) => (
                      <button
                        key={doc.id}
                        id={`select-doc-${doc.id}`}
                        onClick={() => {
                          setActiveDocumentId(doc.id);
                          setDocDropdownOpen(false);
                        }}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left text-xs transition-colors ${
                          doc.id === activeDocumentId
                            ? 'bg-[#f4ede2] dark:bg-[#38312a] text-[#5e4b35] dark:text-[#d4c5b0] font-semibold'
                            : 'text-stone-700 dark:text-stone-300 hover:bg-[#f9f6f0] dark:hover:bg-[#2e2924]'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-[#8c7355] shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{doc.title}</p>
                          <p className="text-[10px] text-stone-400">{doc.pageCount} pages • {doc.quiz.length} MCQs</p>
                        </div>
                        {doc.id === activeDocumentId && (
                          <Check className="w-4 h-4 text-[#8c7355] shrink-0 mt-0.5" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 mt-1 border-t border-[#e8dfd1] dark:border-[#3b352f]">
                    <button
                      id="dropdown-upload-new-btn"
                      onClick={() => {
                        setDocDropdownOpen(false);
                        setActiveTab('upload');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#8c7355] hover:bg-[#786146] text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Upload New PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Search bar trigger, Theme Toggle, Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Bar trigger */}
            <button
              id="top-search-trigger-btn"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-[#f9f6f0] dark:bg-[#2e2924] text-stone-600 dark:text-stone-400 hover:text-[#5e4b35] dark:hover:text-stone-200 border border-[#ded3c1] dark:border-[#443b32] text-xs transition-colors shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search study materials...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-[#26221f] rounded border border-[#ded3c1] dark:border-[#443b32] text-stone-400">
                ⌘K
              </kbd>
            </button>

            {/* Theme toggle */}
            <button
              id="top-theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-[#f4ede2] dark:hover:bg-[#332c25] transition-colors"
              title={settings.theme === 'dark' ? 'Switch to Light Beige mode' : 'Switch to Night Study mode'}
              aria-label={settings.theme === 'dark' ? 'Switch to Light Beige mode' : 'Switch to Night Study mode'}
            >
              {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#8c7355]" />}
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                id="top-profile-menu-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#8c7355]/40 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-[#8c7355] text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden border border-white dark:border-[#26221f]">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || 'S'
                  )}
                </div>
              </button>

              {profileDropdownOpen && (
                <div
                  id="profile-dropdown-menu"
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#26221f] rounded-2xl border border-[#e8dfd1] dark:border-[#3b352f] shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3 py-2 border-b border-[#e8dfd1] dark:border-[#3b352f]">
                    <p className="text-xs font-bold text-[#5e4b35] dark:text-white truncate">{user?.name || 'Student'}</p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{user?.email || 'student@university.edu'}</p>
                  </div>
                  <div className="py-1 space-y-0.5">
                    <button
                      id="profile-menu-item-profile"
                      onClick={() => {
                        setActiveTab('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-stone-700 dark:text-stone-300 hover:bg-[#f4ede2] dark:hover:bg-[#332c25] transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#8c7355]" />
                      Student Profile
                    </button>
                    <button
                      id="profile-menu-item-settings"
                      onClick={() => {
                        setActiveTab('settings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-stone-700 dark:text-stone-300 hover:bg-[#f4ede2] dark:hover:bg-[#332c25] transition-colors"
                    >
                      <SettingsIcon className="w-3.5 h-3.5 text-[#8c7355]" />
                      App Settings
                    </button>
                    <button
                      id="profile-menu-item-logout"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal />
    </div>
  );
};
