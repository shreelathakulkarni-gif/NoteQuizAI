import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardHome } from './components/DashboardHome';
import { UploadPage } from './components/UploadPage';
import { NotesView } from './components/NotesView';
import { QuizPlayer } from './components/QuizPlayer';
import { FlashcardsView } from './components/FlashcardsView';
import { DocumentsView } from './components/DocumentsView';
import { ProgressView } from './components/ProgressView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { ToastContainer } from './components/ToastNotification';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  if (activeTab === 'landing') {
    return (
      <>
        <LandingPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <DashboardLayout>
        {activeTab === 'dashboard' && <DashboardHome />}
        {activeTab === 'upload' && <UploadPage />}
        {activeTab === 'notes' && <NotesView />}
        {activeTab === 'quiz' && <QuizPlayer />}
        {activeTab === 'flashcards' && <FlashcardsView />}
        {activeTab === 'documents' && <DocumentsView />}
        {activeTab === 'progress' && <ProgressView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'settings' && <SettingsView />}
      </DashboardLayout>
      <ToastContainer />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
