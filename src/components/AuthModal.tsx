import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { NoteQuizLogo } from './NoteQuizLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, signup, addToast, setActiveTab } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'forgot') {
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setResetSent(true);
        addToast({
          type: 'success',
          title: 'Reset Link Sent',
          message: `Password reset instructions sent to ${email}`,
        });
      }, 700);
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setLoading(true);
      try {
        await signup(fullName, email, password);
        onClose();
        setActiveTab('dashboard');
      } catch (err: any) {
        setError(err.message || 'Failed to create account.');
      } finally {
        setLoading(false);
      }
    } else {
      // Login
      setLoading(true);
      try {
        await login(email, password);
        onClose();
        setActiveTab('dashboard');
      } catch (err: any) {
        setError(err.message || 'Invalid credentials.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    await login('alex.rivera@university.edu', 'demo123456');
    setLoading(false);
    onClose();
    setActiveTab('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="auth-modal-card"
        className="w-full max-w-md bg-white dark:bg-[#202922] rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#e8dfd1] dark:border-[#3b352f]">
          <div className="flex items-center gap-3">
            <NoteQuizLogo variant="icon" size="md" />
            <div>
              <h3 className="font-bold text-lg text-[#5e4b35] dark:text-white leading-tight">
                {mode === 'login' && 'Sign in to NoteQuiz AI'}
                {mode === 'signup' && 'Create Student Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {mode === 'login' && 'Continue generating notes & quizzes'}
                {mode === 'signup' && 'Start learning smarter with AI assistance'}
                {mode === 'forgot' && 'Enter your email to receive recovery instructions'}
              </p>
            </div>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-[#f4ede2] dark:hover:bg-[#332c25] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl">
              {error}
            </div>
          )}

          {resetSent ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-[#3d4a3e] dark:text-white mb-1">Check your inbox</h4>
              <p className="text-xs text-stone-500 mb-6">
                We've sent a temporary password reset code to <strong>{email}</strong>.
              </p>
              <button
                id="back-to-login-btn"
                type="button"
                onClick={() => {
                  setResetSent(false);
                  setMode('login');
                }}
                className="w-full py-2.5 px-4 bg-[#5f7464] hover:bg-[#506354] text-white text-sm font-semibold rounded-xl transition-colors shadow-xs"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-name-input"
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5f7464]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5f7464]"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        id="forgot-password-link"
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-xs text-[#5f7464] dark:text-[#a7c2a9] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 text-sm bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5f7464]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-confirm-password-input"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 text-sm bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5f7464]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#5f7464] hover:bg-[#506354] text-white text-sm font-semibold rounded-xl transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Access */}
          {mode === 'login' && !resetSent && (
            <div className="mt-4 pt-4 border-t border-[#ecebe4] dark:border-[#2e3a31] text-center">
              <button
                id="quick-demo-login-btn"
                type="button"
                onClick={handleQuickDemoLogin}
                className="text-xs font-semibold text-[#5f7464] dark:text-[#a7c2a9] hover:text-[#506354] dark:hover:text-[#cbdbcc] inline-flex items-center gap-1.5 py-1 px-3 rounded-lg bg-[#f3f4ee] dark:bg-[#263128] hover:bg-[#ecebe4] dark:hover:bg-[#303d32] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Instant Demo Student Sign In
              </button>
            </div>
          )}

          {/* Switch mode */}
          <div className="mt-5 text-center text-xs text-stone-500">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  id="switch-to-signup-btn"
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('signup');
                  }}
                  className="text-[#5f7464] dark:text-[#a7c2a9] font-semibold hover:underline"
                >
                  Sign up free
                </button>
              </p>
            ) : mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  id="switch-to-login-btn"
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('login');
                  }}
                  className="text-[#5f7464] dark:text-[#a7c2a9] font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Remembered your password?{' '}
                <button
                  id="switch-to-login-from-forgot-btn"
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('login');
                  }}
                  className="text-[#5f7464] dark:text-[#a7c2a9] font-semibold hover:underline"
                >
                  Back to Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
