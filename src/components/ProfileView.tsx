import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, 
  Mail, 
  GraduationCap, 
  Building, 
  ShieldCheck, 
  Save, 
  Sparkles, 
  Flame, 
  Check, 
  Camera 
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, addToast, documents } = useApp();

  const [name, setName] = useState(user?.name || 'Student');
  const [email, setEmail] = useState(user?.email || 'student@university.edu');
  const [major, setMajor] = useState(user?.major || 'Computer Science & Engineering');
  const [institution, setInstitution] = useState(user?.institution || 'University of California');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      major: major.trim(),
      institution: institution.trim(),
      avatar: avatar.trim(),
    });
    addToast({ type: 'success', title: 'Profile Updated', message: 'Your student profile information was saved.' });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast({ type: 'error', title: 'Invalid Password', message: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({ type: 'error', title: 'Mismatch', message: 'New passwords do not match.' });
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 3000);
    addToast({ type: 'success', title: 'Password Changed', message: 'Security credentials updated.' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3d4a3e] dark:text-white tracking-tight">
          Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Manage your personal academic details, university affiliations, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <div className="md:col-span-1 bg-white dark:bg-[#202922] p-6 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-3xl bg-[#5f7464] text-white flex items-center justify-center font-extrabold text-3xl shadow-xs overflow-hidden">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                name.charAt(0) || 'S'
              )}
            </div>
          </div>

          <h3 className="text-base font-bold text-[#3d4a3e] dark:text-white">{name}</h3>
          <p className="text-xs text-stone-500">{email}</p>

          <div className="w-full mt-6 pt-6 border-t border-[#ecebe4] dark:border-[#2e3a31] space-y-3 text-left text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Major:</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">{major}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Institution:</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">{institution}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Study Streak:</span>
              <span className="font-bold text-[#5f7464] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" /> 3 Days
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Uploaded PDFs:</span>
              <span className="font-bold text-[#5f7464] dark:text-[#a7c2a9]">{documents.length} Materials</span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#202922] p-6 sm:p-8 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs">
            <h3 className="text-base font-bold text-[#3d4a3e] dark:text-white mb-4">
              Academic Information
            </h3>

            <form onSubmit={handleSubmitProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="profile-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-2 px-3 text-xs bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white focus:ring-2 focus:ring-[#5f7464] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="profile-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2 px-3 text-xs bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white focus:ring-2 focus:ring-[#5f7464] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Major / Field of Study
                  </label>
                  <input
                    id="profile-major-input"
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full py-2 px-3 text-xs bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white focus:ring-2 focus:ring-[#5f7464] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Institution / University
                  </label>
                  <input
                    id="profile-institution-input"
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full py-2 px-3 text-xs bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white focus:ring-2 focus:ring-[#5f7464] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  id="save-profile-btn"
                  type="submit"
                  className="py-2.5 px-5 bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white dark:bg-[#202922] p-6 sm:p-8 rounded-3xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs">
            <h3 className="text-base font-bold text-[#3d4a3e] dark:text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5f7464]" />
              <span>Change Password</span>
            </h3>

            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Password has been successfully changed!</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    New Password
                  </label>
                  <input
                    id="new-password-input"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full py-2 px-3 text-xs bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white focus:ring-2 focus:ring-[#5f7464] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-new-password-input"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-2 px-3 text-xs bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] rounded-xl text-[#3d4a3e] dark:text-white focus:ring-2 focus:ring-[#5f7464] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  id="update-password-btn"
                  type="submit"
                  className="py-2.5 px-5 bg-[#3d4a3e] hover:bg-[#2e3a31] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
