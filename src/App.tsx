import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/landing/Hero';
import { Calculator } from './components/landing/Calculator';
import { Features } from './components/landing/Features';

// Brand components
import { CreatorDiscovery } from './components/brand/CreatorDiscovery';
import { CreatorModal } from './components/brand/CreatorModal';
import { CampaignStudio } from './components/brand/CampaignStudio';
import { DealPipeline } from './components/brand/DealPipeline';
import { BrandAnalytics } from './components/brand/BrandAnalytics';

// Creator components
import { CreatorDashboard } from './components/creator/CreatorDashboard';
import { DealsInbox } from './components/creator/DealsInbox';
import { MediaKitEditor } from './components/creator/MediaKitEditor';
import { WalletPayout } from './components/creator/WalletPayout';

// Admin components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { VerificationQueue } from './components/admin/VerificationQueue';
import { EscrowArbitrator } from './components/admin/EscrowArbitrator';
import { PlatformSettings } from './components/admin/PlatformSettings';
import { AuditLogs } from './components/admin/AuditLogs';

// Modals & Common
import { AiAssistantModal } from './components/common/AiAssistantModal';
import { Toast } from './components/common/Toast';
import { AuthModal } from './components/auth/AuthModal';
import { CreatorSignupSurveyModal } from './components/auth/CreatorSignupSurveyModal';
import { CreatorOnboarding } from './components/auth/CreatorOnboarding';
import { BrandOnboarding } from './components/auth/BrandOnboarding';
import { AdminLoginModal } from './components/auth/AdminLoginModal';

const MainContent: React.FC = () => {
  const { 
    perspective, 
    brandTab, 
    creatorTab, 
    adminTab,
    creatorSurveyModalOpen,
    setCreatorSurveyModalOpen
  } = useApp();

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {/* 1. Landing Mode */}
      {perspective === 'landing' && (
        <>
          <Hero />
          <Calculator />
          <Features />
        </>
      )}

      {/* 2. Brand Mode */}
      {perspective === 'brand' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
          {brandTab === 'discovery' && <CreatorDiscovery />}
          {brandTab === 'pipeline' && <DealPipeline />}
          {brandTab === 'studio' && <CampaignStudio />}
          {brandTab === 'analytics' && <BrandAnalytics />}
        </div>
      )}

      {/* 3. Creator Mode */}
      {perspective === 'creator' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
          {creatorTab === 'overview' && <CreatorDashboard />}
          {creatorTab === 'inbox' && <DealsInbox />}
          {creatorTab === 'mediakit' && <MediaKitEditor />}
          {creatorTab === 'wallet' && <WalletPayout />}
        </div>
      )}

      {/* 4. Super Admin Mode */}
      {perspective === 'admin' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
          {adminTab === 'overview' && <AdminDashboard />}
          {adminTab === 'verifications' && <VerificationQueue />}
          {adminTab === 'disputes' && <EscrowArbitrator />}
          {adminTab === 'settings' && <PlatformSettings />}
          {adminTab === 'audit' && <AuditLogs />}
        </div>
      )}

      {/* Modals & Overlays */}
      <CreatorModal />
      <AiAssistantModal />
      <AuthModal />
      <CreatorSignupSurveyModal 
        isOpen={creatorSurveyModalOpen} 
        onClose={() => setCreatorSurveyModalOpen(false)} 
      />
      <CreatorOnboarding />
      <BrandOnboarding />
      <AdminLoginModal />
      <Toast />
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#0a0b10] text-slate-100 flex flex-col justify-between selection:bg-violet-500/30 selection:text-violet-200">
        <Navbar />
        <MainContent />
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
