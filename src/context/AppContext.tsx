import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppPerspective, 
  BrandTab, 
  CreatorTab, 
  AdminTab,
  Creator, 
  Campaign, 
  Deal, 
  NotificationItem, 
  EscrowStatus, 
  DealStage, 
  AuditLog,
  PlatformConfig,
  User,
  UserRole
} from '../types';
import { MOCK_CREATORS, MOCK_CAMPAIGNS, MOCK_DEALS, MOCK_NOTIFICATIONS } from '../data/mockData';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

interface AppContextType {
  perspective: AppPerspective;
  setPerspective: (p: AppPerspective) => void;
  brandTab: BrandTab;
  setBrandTab: (t: BrandTab) => void;
  creatorTab: CreatorTab;
  setCreatorTab: (t: CreatorTab) => void;
  adminTab: AdminTab;
  setAdminTab: (t: AdminTab) => void;
  
  // Auth & Session
  currentUser: User | null;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalInitialRole: UserRole;
  setAuthModalInitialRole: (role: UserRole) => void;
  creatorOnboardingOpen: boolean;
  setCreatorOnboardingOpen: (open: boolean) => void;
  brandOnboardingOpen: boolean;
  setBrandOnboardingOpen: (open: boolean) => void;
  adminLoginModalOpen: boolean;
  setAdminLoginModalOpen: (open: boolean) => void;
  creatorSurveyModalOpen: boolean;
  setCreatorSurveyModalOpen: (open: boolean) => void;

  signupWithPassword: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; message?: string }>;
  signupCreatorWithSurvey: (data: {
    name: string;
    email: string;
    password: string;
    handle: string;
    location: string;
    bio: string;
    niches: string[];
    primaryPlatform: string;
    followersCount: number;
    avgEngagementRate: number;
    basePrice: number;
    kycPhoto: string;
  }) => Promise<{ success: boolean; message?: string }>;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  requestOtp: (emailOrPhone: string, role: UserRole) => Promise<{ success: boolean; message: string; debugCode?: string }>;
  loginWithOtp: (emailOrPhone: string, code: string) => Promise<boolean>;
  loginAsAdmin: (masterKey: string) => Promise<boolean>;
  logout: () => Promise<void>;
  completeCreatorOnboarding: (data: any) => Promise<void>;
  completeBrandOnboarding: (data: any) => Promise<void>;

  creators: Creator[];
  campaigns: Campaign[];
  deals: Deal[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  platformConfig: PlatformConfig;
  
  selectedCreator: Creator | null;
  setSelectedCreator: (c: Creator | null) => void;
  
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  
  wallet: {
    available: number;
    lockedEscrow: number;
    totalEarned: number;
  };
  
  currentCreator: Creator;
  
  // Core Actions
  createCampaign: (campaign: Omit<Campaign, 'id' | 'metrics' | 'allocatedBudget' | 'creatorsHiredCount'>) => Promise<void>;
  sendDealOffer: (creator: Creator, packageId: string, briefNotes: string, customAmount?: number) => Promise<void>;
  depositEscrow: (dealId: string) => Promise<void>;
  submitDraft: (dealId: string, notes: string, mediaUrl: string) => Promise<void>;
  approveDraftAndReleaseEscrow: (dealId: string) => Promise<void>;
  requestRevision: (dealId: string, feedback: string) => void;
  submitLivePostUrl: (dealId: string, liveUrl: string) => Promise<void>;
  withdrawFunds: (amount: number) => boolean;
  updateCreatorProfile: (updated: Partial<Creator>) => Promise<void>;
  
  // Admin Actions
  verifyCreator: (creatorId: string, approve: boolean, reason?: string) => Promise<void>;
  arbitrateDispute: (dealId: string, verdict: 'release_to_creator' | 'refund_to_brand', notes?: string) => Promise<void>;
  updatePlatformConfig: (updates: Partial<PlatformConfig>) => Promise<void>;

  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [perspective, setPerspective] = useState<AppPerspective>('landing');
  const [brandTab, setBrandTab] = useState<BrandTab>('discovery');
  const [creatorTab, setCreatorTab] = useState<CreatorTab>('overview');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<UserRole>('creator');
  const [creatorOnboardingOpen, setCreatorOnboardingOpen] = useState(false);
  const [brandOnboardingOpen, setBrandOnboardingOpen] = useState(false);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  const [creatorSurveyModalOpen, setCreatorSurveyModalOpen] = useState(false);

  const [creators, setCreators] = useState<Creator[]>(MOCK_CREATORS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [platformConfig, setPlatformConfigState] = useState<PlatformConfig>({
    platformTakeRatePercent: 7.5,
    minEscrowDepositUSD: 250,
    autoReleaseAfterDays: 14,
    aiMatchingModel: 'Gemini 2.0 Flash Enterprise',
    maintenanceMode: false,
  });
  
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const [currentCreator, setCurrentCreator] = useState<Creator>(MOCK_CREATORS[0]);

  const [wallet, setWallet] = useState({
    available: 3450,
    lockedEscrow: 4800,
    totalEarned: 24800,
  });

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Sync initial state and check active session
  useEffect(() => {
    async function init() {
      // 1. Check active user session
      const meData = await api.getMe();
      if (meData?.user) {
        setCurrentUser(meData.user);
        if (meData.creator) {
          setCurrentCreator(meData.creator);
        }
        if (meData.user.role === 'brand') setPerspective('brand');
        else if (meData.user.role === 'creator') setPerspective('creator');
        else if (meData.user.role === 'admin') setPerspective('admin');
      }

      // 2. Fetch live creators from SQLite
      const serverCreators = await api.getCreators();
      if (serverCreators && serverCreators.length > 0) {
        setCreators(serverCreators);
        if (!meData?.creator) {
          setCurrentCreator(serverCreators[0]);
        }
      }

      // 3. Fetch live campaigns from SQLite
      const serverCampaigns = await api.getCampaigns();
      if (serverCampaigns && serverCampaigns.length > 0) {
        setCampaigns(serverCampaigns);
      }

      // 4. Fetch live deals from SQLite
      const serverDeals = await api.getDeals();
      if (serverDeals && serverDeals.length > 0) {
        setDeals(serverDeals);
        
        // Compute live wallet figures
        const released = serverDeals
          .filter(d => d.escrowStatus === 'released')
          .reduce((acc, d) => acc + d.amount, 0);
        const locked = serverDeals
          .filter(d => d.escrowStatus === 'escrow_locked' || d.escrowStatus === 'draft_submitted')
          .reduce((acc, d) => acc + d.amount, 0);
        
        setWallet({
          available: Math.max(1200, released),
          lockedEscrow: locked,
          totalEarned: released + 18000,
        });
      }

      // 5. Admin data
      const adminData = await api.getAdminOverview();
      if (adminData) {
        if (adminData.config) setPlatformConfigState(adminData.config);
        if (adminData.recentAuditLogs) setAuditLogs(adminData.recentAuditLogs);
      }
    }
    init();
  }, []);

  // --- AUTH OPERATIONS ---
  const signupWithPassword = async (name: string, email: string, password: string, role: UserRole) => {
    const res = await api.signup({ name, email, password, role });
    if (res.success && res.data?.user) {
      const user = res.data.user as User;
      setCurrentUser(user);
      if (res.data?.creator) {
        setCurrentCreator(res.data.creator);
        setCreators(prev => [res.data.creator, ...prev]);
      }
      if (user.role === 'brand') setPerspective('brand');
      else if (user.role === 'creator') setPerspective('creator');
      else if (user.role === 'admin') setPerspective('admin');

      confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
      showToast(`Welcome to Influzo, ${user.name}! Account created & stored in SQLite. 🎉`, 'success');
      return { success: true };
    }
    return { success: false, message: res.message || 'Signup failed' };
  };

  const signupCreatorWithSurvey = async (data: {
    name: string;
    email: string;
    password: string;
    handle: string;
    location: string;
    bio: string;
    niches: string[];
    primaryPlatform: string;
    followersCount: number;
    avgEngagementRate: number;
    basePrice: number;
    kycPhoto: string;
  }) => {
    const res = await api.signupCreatorWithSurvey(data);
    if (res.success && res.data?.user) {
      const user = res.data.user as User;
      setCurrentUser(user);
      if (res.data?.creator) {
        setCurrentCreator(res.data.creator);
        setCreators(prev => [res.data.creator, ...prev]);
      }
      setPerspective('creator');
      setCreatorTab('overview');

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      showToast('Creator account & Live Photo KYC submitted! Under review by Admin. 🎉', 'success');
      return { success: true };
    }
    return { success: false, message: res.message || 'Signup failed' };
  };

  const loginWithPassword = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    if (res.success && res.data?.user) {
      const user = res.data.user as User;
      setCurrentUser(user);
      if (res.data?.creator) {
        setCurrentCreator(res.data.creator);
      }
      if (user.role === 'brand') setPerspective('brand');
      else if (user.role === 'creator') setPerspective('creator');
      else if (user.role === 'admin') setPerspective('admin');

      showToast(`Welcome back, ${user.name}! Authenticated. 🚀`, 'success');
      return { success: true };
    }
    return { success: false, message: res.message || 'Invalid credentials' };
  };

  const requestOtp = async (emailOrPhone: string, role: UserRole) => {
    const res = await api.sendOtp(emailOrPhone, role);
    if (res.success) {
      showToast(`6-Digit OTP code sent to ${emailOrPhone}`, 'info');
    }
    return res;
  };

  const loginWithOtp = async (emailOrPhone: string, code: string) => {
    const res = await api.verifyOtp(emailOrPhone, code);
    if (res.success && res.data?.user) {
      const user = res.data.user as User;
      setCurrentUser(user);
      if (res.data?.creator) {
        setCurrentCreator(res.data.creator);
      }
      if (user.role === 'brand') setPerspective('brand');
      else if (user.role === 'creator') setPerspective('creator');
      else if (user.role === 'admin') setPerspective('admin');

      showToast(`Welcome back, ${user.name}! Authenticated via OTP.`, 'success');
      return true;
    } else {
      showToast(res.message || 'Invalid OTP code', 'warning');
      return false;
    }
  };

  const loginAsAdmin = async (masterKey: string) => {
    const res = await api.adminLogin(masterKey);
    if (res.success && res.data?.user) {
      const admin = res.data.user as User;
      setCurrentUser(admin);
      setPerspective('admin');
      setAdminTab('overview');
      showToast('Super Admin Operator Authenticated! 🛡️', 'success');
      return true;
    }
    return false;
  };

  const logout = async () => {
    await api.logout();
    setCurrentUser(null);
    setPerspective('landing');
    showToast('Logged out successfully.', 'info');
  };

  const completeCreatorOnboarding = async (data: any) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, onboarded: true, name: data.name };
      setCurrentUser(updatedUser);
    }
    setPerspective('creator');
    setCreatorTab('overview');
    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    showToast('Creator profile activated! 🎉', 'success');
  };

  const completeBrandOnboarding = async (data: any) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, onboarded: true, name: data.companyName };
      setCurrentUser(updatedUser);
    }
    setPerspective('brand');
    setBrandTab('discovery');
    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    showToast('Brand organization profile configured! 🚀', 'success');
  };

  // --- CORE ACTIONS WITH BACKEND PERSISTENCE ---
  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'metrics' | 'allocatedBudget' | 'creatorsHiredCount'>) => {
    const saved = await api.createCampaign(campaignData);
    if (saved) {
      setCampaigns(prev => [saved, ...prev]);
      showToast(`Campaign "${saved.title}" saved to SQLite database!`, 'success');
    }
  };

  const sendDealOffer = async (creator: Creator, packageId: string, briefNotes: string, customAmount?: number) => {
    const pkg = creator.packages.find(p => p.id === packageId) || creator.packages[0];
    const amount = customAmount || pkg?.price || 1200;

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      campaignTitle: 'Direct Creator Booking',
      brandName: currentUser?.name || 'TaskFlow AI',
      brandLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      creatorId: creator.id,
      creatorName: creator.name,
      creatorHandle: creator.handle,
      creatorAvatar: creator.avatar,
      platform: creator.primaryPlatform,
      packageTitle: pkg?.title || 'Custom Campaign Package',
      amount,
      escrowStatus: 'escrow_locked',
      stage: 'accepted',
      deliverables: pkg?.deliverables || ['1x Dedicated Post', 'Usage Rights'],
      briefNotes,
      createdAt: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    const saved = await api.createDeal(newDeal);
    if (saved) {
      setDeals(prev => [saved, ...prev]);
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Offer sent to ${creator.name}`,
        message: `$${amount.toLocaleString()} locked in Escrow. Creator notified!`,
        type: 'deal',
        timestamp: 'Just now',
        read: false,
        dealId: saved.id,
      };
      setNotifications(prev => [newNotif, ...prev]);
      showToast(`Deal sent to ${creator.name}! $${amount.toLocaleString()} locked into escrow.`, 'success');
    }
    setSelectedCreator(null);
  };

  const depositEscrow = async (dealId: string) => {
    const updated = await api.depositEscrow(dealId);
    if (updated) {
      setDeals(prev => prev.map(d => d.id === dealId ? updated : d));
      showToast('Escrow funds securely locked! Creator notified to start production.', 'success');
    }
  };

  const submitDraft = async (dealId: string, notes: string, mediaUrl: string) => {
    const updated = await api.submitDraft(dealId, notes, mediaUrl);
    if (updated) {
      setDeals(prev => prev.map(d => d.id === dealId ? updated : d));
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Draft Content Submitted',
        message: `Content draft uploaded for review on deal #${dealId}.`,
        type: 'review',
        timestamp: 'Just now',
        read: false,
        dealId
      };
      setNotifications(prev => [newNotif, ...prev]);
      showToast('Content draft submitted for Brand review & stored in DB!', 'success');
    }
  };

  const approveDraftAndReleaseEscrow = async (dealId: string) => {
    const updated = await api.releaseEscrow(dealId);
    if (updated) {
      setDeals(prev => prev.map(d => d.id === dealId ? updated : d));
      setWallet(prev => ({
        available: prev.available + updated.amount,
        lockedEscrow: Math.max(0, prev.lockedEscrow - updated.amount),
        totalEarned: prev.totalEarned + updated.amount,
      }));

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      showToast(`Draft approved! $${updated.amount.toLocaleString()} released from Escrow! 🎉`, 'success');
    }
  };

  const requestRevision = (_dealId: string, feedback: string) => {
    showToast(`Revision request sent to creator: "${feedback.slice(0, 40)}..."`, 'info');
  };

  const submitLivePostUrl = async (dealId: string, liveUrl: string) => {
    const updated = await api.submitLivePost(dealId, liveUrl);
    if (updated) {
      setDeals(prev => prev.map(d => d.id === dealId ? updated : d));
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      showToast('Live post verified! Automated Escrow released successfully! 🚀', 'success');
    }
  };

  const withdrawFunds = (amount: number) => {
    if (amount > wallet.available) {
      showToast('Insufficient available balance to withdraw', 'warning');
      return false;
    }
    setWallet(prev => ({
      ...prev,
      available: prev.available - amount,
    }));

    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    showToast(`Payout initiated! $${amount.toLocaleString()} sent via Stripe Instant Payout.`, 'success');
    return true;
  };

  const updateCreatorProfile = async (updated: Partial<Creator>) => {
    const saved = await api.updateCreatorProfile(currentCreator.id, updated);
    if (saved) {
      setCurrentCreator(saved);
      setCreators(prev => prev.map(c => c.id === saved.id ? saved : c));
      showToast('Media Kit & Rate Card saved directly to SQLite database!', 'success');
    }
  };

  // --- ADMIN ACTIONS ---
  const verifyCreator = async (creatorId: string, approve: boolean, reason?: string) => {
    const updated = await api.verifyCreator(creatorId, approve, reason);
    if (updated) {
      setCreators(prev => prev.map(c => c.id === creatorId ? updated : c));
      showToast(
        approve ? 'Creator verification approved! Badge granted.' : 'Creator application rejected.',
        approve ? 'success' : 'info'
      );
    }
  };

  const arbitrateDispute = async (dealId: string, verdict: 'release_to_creator' | 'refund_to_brand', notes?: string) => {
    const updated = await api.arbitrateDispute(dealId, verdict, notes);
    if (updated) {
      setDeals(prev => prev.map(d => d.id === dealId ? updated : d));
      showToast(
        verdict === 'release_to_creator'
          ? 'Dispute resolved: Funds force-released to Creator! 🎉'
          : 'Dispute resolved: Funds refunded to Brand! 💳',
        'success'
      );
    }
  };

  const updatePlatformConfig = async (updates: Partial<PlatformConfig>) => {
    const updated = await api.updatePlatformConfig(updates);
    if (updated) {
      setPlatformConfigState(updated);
      showToast('Platform configuration saved to SQLite database!', 'success');
    }
  };

  return (
    <AppContext.Provider
      value={{
        perspective,
        setPerspective,
        brandTab,
        setBrandTab,
        creatorTab,
        setCreatorTab,
        adminTab,
        setAdminTab,
        currentUser,
        authModalOpen,
        setAuthModalOpen,
        authModalInitialRole,
        setAuthModalInitialRole,
        creatorOnboardingOpen,
        setCreatorOnboardingOpen,
        brandOnboardingOpen,
        setBrandOnboardingOpen,
        adminLoginModalOpen,
        setAdminLoginModalOpen,
        creatorSurveyModalOpen,
        setCreatorSurveyModalOpen,
        signupWithPassword,
        signupCreatorWithSurvey,
        loginWithPassword,
        requestOtp,
        loginWithOtp,
        loginAsAdmin,
        logout,
        completeCreatorOnboarding,
        completeBrandOnboarding,
        creators,
        campaigns,
        deals,
        notifications,
        auditLogs,
        platformConfig,
        selectedCreator,
        setSelectedCreator,
        isAiModalOpen,
        setIsAiModalOpen,
        wallet,
        currentCreator,
        createCampaign,
        sendDealOffer,
        depositEscrow,
        submitDraft,
        approveDraftAndReleaseEscrow,
        requestRevision,
        submitLivePostUrl,
        withdrawFunds,
        updateCreatorProfile,
        verifyCreator,
        arbitrateDispute,
        updatePlatformConfig,
        toast,
        showToast,
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
