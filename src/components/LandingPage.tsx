import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Upload, 
  Play, 
  FileText, 
  CheckCircle, 
  Layers, 
  BarChart3, 
  Download, 
  BrainCircuit, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  GraduationCap, 
  CheckCircle2,
  Moon,
  Sun,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { AuthModal } from './AuthModal';
import { NoteQuizLogo } from './NoteQuizLogo';
import { StationeryBackground } from './StationeryBackground';

export const LandingPage: React.FC = () => {
  const { 
    setActiveTab, 
    loadDemoExperience, 
    isAuthenticated, 
    user, 
    settings, 
    updateSettings 
  } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <div className="relative min-h-screen bg-[#fdfcf8] dark:bg-[#181f1a] text-[#333333] dark:text-[#e5ebe5] transition-colors selection:bg-[#5f7464] selection:text-white overflow-x-hidden">
      {/* Cool Stationery Desk Theme Background (Compass, Bag, Pencil, Eraser, Ruler & Doodles) */}
      <StationeryBackground />

      {/* 1. Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#ecebe4] dark:border-[#2e3a31] bg-[#fdfcf8]/90 dark:bg-[#181f1a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('landing')}>
            <NoteQuizLogo variant="badge" size="md" showTagline={false} />
            <span className="hidden sm:inline-block ml-2.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#f4ede2] dark:bg-[#2e2924] text-[#8c7355] dark:text-[#aa957c] rounded-full border border-[#e8dfd1] dark:border-[#3b352f]">
              Student Edition
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 dark:text-stone-300">
            <a href="#hero" className="hover:text-[#5f7464] dark:hover:text-[#a7c2a9] transition-colors">Home</a>
            <a href="#features" className="hover:text-[#5f7464] dark:hover:text-[#a7c2a9] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#5f7464] dark:hover:text-[#a7c2a9] transition-colors">How It Works</a>
            <button 
              id="nav-dashboard-link"
              onClick={() => setActiveTab('dashboard')} 
              className="hover:text-[#5f7464] dark:hover:text-[#a7c2a9] transition-colors font-semibold"
            >
              Dashboard
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              id="theme-toggle-landing-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-[#f3f4ee] dark:hover:bg-[#2a342b] transition-colors"
              title="Toggle Theme"
            >
              {settings.theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[#5f7464]" />}
            </button>

            {isAuthenticated ? (
              <button
                id="landing-user-dashboard-btn"
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 py-2 px-4 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-sm font-semibold shadow-xs transition-all"
              >
                <UserIcon className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="landing-login-btn"
                  onClick={() => openAuth('login')}
                  className="py-2 px-3.5 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:text-[#5f7464] dark:hover:text-[#a7c2a9] transition-colors"
                >
                  Sign In
                </button>
                <button
                  id="landing-signup-btn"
                  onClick={() => openAuth('signup')}
                  className="py-2 px-4 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-sm font-semibold shadow-xs transition-all"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="hero" className="relative pt-8 pb-16 sm:pt-12 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Hero Mascot & Intro Grid */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 max-w-6xl mx-auto mb-16">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4ede2] dark:bg-[#2e2924] border border-[#e8dfd1] dark:border-[#3b352f] text-[#8c7355] dark:text-[#aa957c] text-xs font-semibold mb-6 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#8c7355] dark:text-[#aa957c]" />
                <span>Next-Gen AI Study Companion for Students</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#5e4b35] dark:text-white leading-[1.15] mb-6">
                Turn Your Study PDFs into Smart{' '}
                <span className="text-[#8c7355] dark:text-[#aa957c] underline decoration-[#ded3c1]">
                  Notes, Quizzes & Flashcards
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Upload your course materials and let our Scholar AI create structured revision summaries, interactive MCQs with detailed explanations, and active recall flashcards in seconds.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  id="hero-upload-pdf-btn"
                  onClick={() => setActiveTab('upload')}
                  className="py-3.5 px-6 rounded-xl bg-[#8c7355] hover:bg-[#786146] text-white font-semibold text-base shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2.5 group"
                >
                  <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Upload PDF</span>
                  <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-try-demo-btn"
                  onClick={loadDemoExperience}
                  className="py-3.5 px-6 rounded-xl bg-white dark:bg-[#26221f] hover:bg-[#f4ede2] dark:hover:bg-[#332c25] text-[#5e4b35] dark:text-[#d4c5b0] font-semibold text-base border border-[#e8dfd1] dark:border-[#3b352f] shadow-xs hover:-translate-y-0.5 transition-all flex items-center gap-2.5"
                >
                  <Play className="w-4 h-4 text-[#8c7355] fill-[#8c7355]" />
                  <span>Try Demo (AI & Neural Nets)</span>
                </button>
              </div>
            </div>

            {/* Right: Official Mascot Logo Artwork */}
            <div className="w-full max-w-md lg:max-w-lg shrink-0 flex items-center justify-center">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#26221f]/80 backdrop-blur-sm border border-[#e8dfd1] dark:border-[#3b352f] shadow-xl">
                <NoteQuizLogo variant="hero" />
              </div>
            </div>
          </div>

          {/* Educational Visual Layout / Interactive Feature Showcase */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-[#ecebe4] dark:border-[#2e3a31] bg-white dark:bg-[#202922] shadow-xl p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#ecebe4] dark:border-[#2e3a31]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-[#5f7464]" />
                <span className="text-xs font-medium text-stone-400 ml-2">NoteQuiz AI Study Dashboard Preview</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f3f4ee] dark:bg-[#263128] text-[#5f7464] dark:text-[#a7c2a9] border border-[#ecebe4] dark:border-[#2e3a31]">
                Live Interactive Mode
              </span>
            </div>

            {/* 3 Columns Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Smart Notes */}
              <div 
                onClick={() => {
                  loadDemoExperience();
                  setActiveTab('notes');
                }}
                className="p-4 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] hover:border-[#5f7464] cursor-pointer transition-all hover:shadow-xs group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f3f4ee] dark:bg-[#202922] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-[#5f7464] dark:text-[#a7c2a9] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    View Notes <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#3d4a3e] dark:text-white mb-1">
                  1. Structured Smart Notes
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3 line-clamp-2">
                  Hierarchical breakdowns with key definitions, bold concepts & summaries.
                </p>
                <div className="space-y-1.5 text-[11px] text-stone-600 dark:text-stone-300 bg-white dark:bg-[#202922] p-2.5 rounded-lg border border-[#ecebe4] dark:border-[#2e3a31]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5f7464]" />
                    <span>Machine Learning Paradigms</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5f7464]" />
                    <span>Backpropagation Mechanics</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Interactive MCQs */}
              <div 
                onClick={() => {
                  loadDemoExperience();
                  setActiveTab('quiz');
                }}
                className="p-4 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] hover:border-[#5f7464] cursor-pointer transition-all hover:shadow-xs group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f3f4ee] dark:bg-[#202922] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-[#5f7464] dark:text-[#a7c2a9] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Take Quiz <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#3d4a3e] dark:text-white mb-1">
                  2. Targeted MCQ Quizzes
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3 line-clamp-2">
                  4 options with immediate explanations, difficulty tuning & score tracking.
                </p>
                <div className="space-y-1.5 text-[11px] text-stone-600 dark:text-stone-300 bg-white dark:bg-[#202922] p-2.5 rounded-lg border border-[#ecebe4] dark:border-[#2e3a31]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#5f7464] dark:text-[#a7c2a9]">Score: 8/10 (80%)</span>
                    <span className="text-[10px] text-stone-400">Medium</span>
                  </div>
                  <div className="w-full bg-[#f3f4ee] dark:bg-[#181f1a] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#5f7464] h-full w-4/5 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Card 3: Interactive Flashcards */}
              <div 
                onClick={() => {
                  loadDemoExperience();
                  setActiveTab('flashcards');
                }}
                className="p-4 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] hover:border-[#5f7464] cursor-pointer transition-all hover:shadow-xs group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f3f4ee] dark:bg-[#202922] text-amber-700 dark:text-amber-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Flip Cards <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#3d4a3e] dark:text-white mb-1">
                  3. 3D Flip Flashcards
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3 line-clamp-2">
                  Spaced revision cards, mastery tracking & smooth 3D flipping animation.
                </p>
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] text-[11px] text-stone-700 dark:text-stone-300">
                  <p className="font-semibold text-amber-700 dark:text-amber-400">Q: What is ReLU?</p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">Click card to reveal definition</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 bg-[#fafaf6] dark:bg-[#1a221b] border-y border-[#ecebe4] dark:border-[#2e3a31]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-[#5f7464] dark:text-[#a7c2a9] uppercase mb-2">
              Everything Students Need
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#3d4a3e] dark:text-white tracking-tight">
              Six Powerful Study Acceleration Features
            </h3>
            <p className="mt-3 text-base text-stone-600 dark:text-stone-400">
              Engineered specifically for university & high school students to save hours of manual note-taking and revision prep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] hover:-translate-y-1 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#f3f4ee] dark:bg-[#2a342b] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center mb-5 border border-[#ecebe4] dark:border-[#354439]">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#3d4a3e] dark:text-white mb-2">
                1. AI Smart Notes
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Automatically extracts core topics, definitions, examples, and structured hierarchies. Choose between Short, Medium, or Detailed note depths.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] hover:-translate-y-1 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#f3f4ee] dark:bg-[#2a342b] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center mb-5 border border-[#ecebe4] dark:border-[#354439]">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#3d4a3e] dark:text-white mb-2">
                2. Automatic MCQ Generation
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Generates 5 to 20 multiple choice questions directly from your textbook slides, with four options, step-by-step explanations, and difficulty levels.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] hover:-translate-y-1 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#f3f4ee] dark:bg-[#2a342b] text-amber-700 dark:text-amber-400 flex items-center justify-center mb-5 border border-[#ecebe4] dark:border-[#354439]">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#3d4a3e] dark:text-white mb-2">
                3. Interactive Flashcards
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Active recall revision cards with smooth 3D flip mechanics, shuffle controls, and separate "Mark for Revision" filter queues.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] hover:-translate-y-1 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#f3f4ee] dark:bg-[#2a342b] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center mb-5 border border-[#ecebe4] dark:border-[#354439]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#3d4a3e] dark:text-white mb-2">
                4. PDF-Based Learning
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Zero hallucinations: all generated study materials are strictly grounded in your actual uploaded lecture slides, research papers, and textbook chapters.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] hover:-translate-y-1 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#f3f4ee] dark:bg-[#2a342b] text-[#5f7464] dark:text-[#a7c2a9] flex items-center justify-center mb-5 border border-[#ecebe4] dark:border-[#354439]">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#3d4a3e] dark:text-white mb-2">
                5. Quiz Performance Tracking
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Visualize score trends over time, topic strengths, average accuracy, and study streaks with dynamic student progress analytics.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] hover:-translate-y-1 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#f3f4ee] dark:bg-[#2a342b] text-rose-700 dark:text-rose-400 flex items-center justify-center mb-5 border border-[#ecebe4] dark:border-[#354439]">
                <Download className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#3d4a3e] dark:text-white mb-2">
                6. Download Study Materials
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Export beautifully formatted PDF study guides, Markdown summaries, or CSV flashcard decks for offline study on iPad, Kindle, or paper.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-[#5f7464] dark:text-[#a7c2a9] uppercase mb-2">
              Simple 3-Step Flow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#3d4a3e] dark:text-white tracking-tight">
              Upload PDF → AI Processes Content → Learn & Practice
            </h3>
            <p className="mt-3 text-base text-stone-600 dark:text-stone-400">
              No complicated configuration. Drop any course PDF and study immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#5f7464] text-white flex items-center justify-center text-xl font-bold mb-5 shadow-sm">
                1
              </div>
              <h4 className="text-lg font-bold text-[#3d4a3e] dark:text-white mb-2">
                Upload Your PDF
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Drag and drop your lecture slides, academic textbook chapter, or class notes into our secure uploader.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#506354] text-white flex items-center justify-center text-xl font-bold mb-5 shadow-sm">
                2
              </div>
              <h4 className="text-lg font-bold text-[#3d4a3e] dark:text-white mb-2">
                AI Processes Content
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Text is extracted, key concepts & topics are detected, and structured learning modules are synthesized in real-time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#3d4a3e] text-white flex items-center justify-center text-xl font-bold mb-5 shadow-sm">
                3
              </div>
              <h4 className="text-lg font-bold text-[#3d4a3e] dark:text-white mb-2">
                Learn & Practice
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Read organized notes, take customized MCQ quizzes with explanations, flip flashcards, and track your mastery score.
              </p>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="mt-14 p-8 rounded-3xl bg-[#5f7464] dark:bg-[#28342a] text-white text-center shadow-md border border-[#506354] dark:border-[#354439]">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Ready to Ace Your Next Exam?
            </h3>
            <p className="text-[#e8ebe8] max-w-xl mx-auto mb-6 text-sm sm:text-base">
              Try NoteQuiz AI right now with our pre-loaded academic demo or upload your own PDF material.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                id="cta-upload-btn"
                onClick={() => setActiveTab('upload')}
                className="py-3 px-6 rounded-xl bg-[#fdfcf8] text-[#3d4a3e] font-bold hover:bg-[#f3f4ee] transition-colors shadow-xs"
              >
                Upload Course PDF
              </button>
              <button
                id="cta-demo-btn"
                onClick={loadDemoExperience}
                className="py-3 px-6 rounded-xl bg-[#506354] hover:bg-[#435246] text-white font-bold border border-white/20 transition-colors"
              >
                Try Interactive Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8dfd1] dark:border-[#3b352f] py-10 bg-white dark:bg-[#26221f] text-stone-500 dark:text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <NoteQuizLogo variant="badge" size="sm" showTagline={false} />
            <span className="hidden md:inline text-stone-400">•</span>
            <span className="hidden md:inline">AI Notes to Quiz Generator for Students</span>
          </div>
          <p>© 2026 NoteQuiz AI. Built for student success.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};
