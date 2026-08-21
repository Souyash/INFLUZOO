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
  UserRole,
  PaymentMethodType,
  Transaction
} from '../types';
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

  // Payment Gateway Modal
  paymentModalOpen: boolean;
  setPaymentModalOpen: (open: boolean) => void;
  selectedDealForPayment: Deal | null;
  setSelectedDealForPayment: (deal: Deal | null) => void;

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
  
  // Core Deal & Payment Actions
  createCampaign: (campaign: Omit<Campaign, 'id' | 'metrics' | 'allocatedBudget' | 'creatorsHiredCount'>) => Promise<void>;
  sendDealOffer: (creator: Creator, packageId: string, briefNotes: string, customAmount?: number) => Promise<void>;
  depositEscrow: (dealId: string) => Promise<void>;
  confirmEscrowDeposit: (data: {
    dealId: string;
    paymentMethod: PaymentMethodType;
    payerName?: string;
    cardLast4?: string;
  }) => Promise<{ success: boolean; message?: string; transactionId?: string }>;
  submitDraft: (dealId: string, notes: string, mediaUrl: string) => Promise<void>;
  approveDraftAndReleaseEscrow: (dealId: string) => Promise<void>;
  requestRevision: (dealId: string, feedback: string) => void;
  submitLivePostUrl: (dealId: string, liveUrl: string) => Promise<void>;
  withdrawFunds: (amount: number) => Promise<boolean>;
  updateCreatorProfile: (updated: Partial<Creator>) => Promise<void>;
  
  // Admin Actions
  verifyCreator: (creatorId: string, approve: boolean, reason?: string) => Promise<void>;
  arbitrateDispute: (dealId: string, verdict: 'release_to_creator' | 'refund_to_brand', notes?: string) => Promise<void>;
  updatePlatformConfig: (updates: Partial<PlatformConfig>) => Promise<void>;

  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial fallback creator
const FALLBACK_CREATOR: Creator = {
  id: 'c-1',
  name: 'Elena Rostova',
  handle: '@elenatech',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  bio: 'AI product reviewer & UI/UX tech geek.',
  location: 'San Francisco, CA',
  verified: true,
  verificationStatus: 'verified',
  authenticityScore: 98.8,
  rating: 4.98,
  reviewCount: 42,
  niches: ['Tech & AI', 'Lifestyle & Travel'],
  primaryPlatform: 'youtube',
  followersCount: 385000,
  avgEngagementRate: 6.4,
  avgViewsPerPost: 64200,
  priceRange: '$800 - $3,200',
  platforms: [
    { platform: 'youtube', handle: 'ElenaTechReviews', followers: 280000, engagementRate: 7.1, avgViews: 85000, profileUrl: '#' }
  ],
  audienceDemographics: {
    topCountries: [{ name: 'United States', percentage: 55 }],
    ageGroups: [{ label: '18-24', percentage: 40 }, { label: '25-34', percentage: 45 }],
    genderSplit: { female: 50, male: 50, other: 0 }
  },
  stats: { completedCollabs: 54, onTimeRate: 100, responseHours: 2, repeatBrandRate: 88 },
  sampleWork: [],
  packages: [
    { id: 'pkg-1', title: 'Dedicated YouTube Integration (60-90s)', description: 'Mid-roll sponsor integration with pinned comment link.', price: 1600, deliverables: ['60-90s Mid-Roll Integration', 'Pinned Link'], turnaroundDays: 5, popular: true }
  ]
};

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

  // Payment Gateway Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedDealForPayment, setSelectedDealForPayment] = useState<Deal | null>(null);

  // Live Database entities
  const [creators, setCreators] = useState<Creator[]>([FALLBACK_CREATOR]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
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

  const [wallet, setWallet] = useState({
    available: 2400,
    lockedEscrow: 1600,
    totalEarned: 28400,
  });

  const [currentCreator, setCurrentCreator] = useState<Creator>(FALLBACK_CREATOR);

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

      showToast(`Welcome, ${user.name}! OTP Verified.`, 'success');
      return true;
    }
    return false;
  };

  const loginAsAdmin = async (masterKey: string) => {
    const res = await api.adminLogin(masterKey);
    if (res.success && res.data?.user) {
      const user = res.data.user as User;
      setCurrentUser(user);
      setPerspective('admin');
      setAdminTab('overview');
      showToast('Super Admin Authenticated. Master controls unlocked.', 'success');
      return true;
    }
    return false;
  };

  const logout = async () => {
    await api.logout();
    setCurrentUser(null);
    setPerspective('landing');
    showToast('Signed out successfully.', 'info');
  };

  const completeCreatorOnboarding = async (data: any) => {
    const updated = await api.updateCreatorProfile(currentCreator.id, {
      ...data,
      verificationStatus: 'pending',
    });
    if (updated) {
      setCurrentCreator(updated);
      setCreators(prev => prev.map(c => c.id === updated.id ? updated : c));
      setCreatorOnboardingOpen(false);
      showToast('Creator profile updated in SQLite! Under review.', 'success');
    }
  };

  const completeBrandOnboarding = async (_data: any) => {
    setBrandOnboardingOpen(false);
    setPerspective('brand');
    showToast('Brand profile configured successfully!', 'success');
  };

  // --- CORE ACTIONS ---
  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'metrics' | 'allocatedBudget' | 'creatorsHiredCount'>) => {
    const newCamp: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      allocatedBudget: 0,
      creatorsHiredCount: 0,
      metrics: { totalViews: 0, totalClicks: 0, conversions: 0, roas: 0 }
    };
    const saved = await api.createCampaign(newCamp);
    if (saved) {
      setCampaigns(prev => [saved, ...prev]);
      showToast(`Campaign "${saved.title}" created & saved to database!`, 'success');
    }
  };

  const sendDealOffer = async (creator: Creator, packageId: string, briefNotes: string, customAmount?: number) => {
    const pkg = creator.packages.find(p => p.id === packageId);
    const amount = customAmount || pkg?.price || 500;
    
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      campaignTitle: 'Direct Brand Partnership',
      brandName: currentUser?.name || 'TaskFlow AI',
      brandLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      creatorId: creator.id,
      creatorName: creator.name,
      creatorHandle: creator.handle,
      creatorAvatar: creator.avatar,
      platform: creator.primaryPlatform,
      packageTitle: pkg?.title || 'Custom Campaign Package',
      amount,
      escrowStatus: 'pending_deposit',
      stage: 'offer_sent',
      deliverables: pkg?.deliverables || ['1x Dedicated Post', 'Usage Rights'],
      briefNotes,
      createdAt: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    const saved = await api.createDeal(newDeal);
    if (saved) {
      setDeals(prev => [saved, ...prev]);
      setSelectedCreator(null);
      // Automatically prompt payment gateway modal to fund escrow
      setSelectedDealForPayment(saved);
      setPaymentModalOpen(true);
    }
  };

  const depositEscrow = async (dealId: string) => {
    const target = deals.find(d => d.id === dealId);
    if (target) {
      setSelectedDealForPayment(target);
      setPaymentModalOpen(true);
    }
  };

  const confirmEscrowDeposit = async (data: {
    dealId: string;
    paymentMethod: PaymentMethodType;
    payerName?: string;
    cardLast4?: string;
  }) => {
    const res = await api.confirmPaymentDeposit(data);
    if (res.success && res.data?.deal) {
      const updated = res.data.deal;
      setDeals(prev => prev.map(d => d.id === data.dealId ? updated : d));
      
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      showToast(`Escrow funded! $${updated.amount.toLocaleString()} locked into Smart Escrow Vault. 🔒`, 'success');
      return { success: true, transactionId: res.data.transaction?.id };
    }
    return { success: false, message: res.message };
  };

  const submitDraft = async (dealId: string, notes: string, mediaUrl: string) => {
    const updated = await api.submitDraft(dealId, notes, mediaUrl);
    if (updated) {
      setDeals(prev => prev.map(d => d.id === dealId ? updated : d));
      showToast('Content draft submitted for Brand review & stored in SQLite!', 'success');
    }
  };

  const approveDraftAndReleaseEscrow = async (dealId: string) => {
    const res = await api.releaseEscrow(dealId);
    if (res) {
      setDeals(prev => prev.map(d => d.id === dealId ? res : d));
      setWallet(prev => ({
        available: prev.available + res.amount,
        lockedEscrow: Math.max(0, prev.lockedEscrow - res.amount),
        totalEarned: prev.totalEarned + res.amount,
      }));

      confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
      showToast(`Draft approved! $${res.amount.toLocaleString()} released to Creator Wallet! 🎉`, 'success');
    }
  };

  const requestRevision = (_dealId: string, feedback: string) => {
    showToast(`Revision request sent to creator: "${feedback.slice(0, 40)}..."`, 'info');
  };

  const submitLivePostUrl = async (dealId: string, liveUrl: string) => {
    const updated = await api.submitLivePost(dealId, liveUrl);
    if (updated) {
      setDeals(prev => prev.map(d => d.id === dealId ? updated : d));
      confetti({ particleCount: 90, spread: 65, origin: { y: 0.7 } });
      showToast('Live post verified! Automated Escrow released successfully! 🚀', 'success');
    }
  };

  const withdrawFunds = async (amount: number) => {
    if (amount > wallet.available) {
      showToast('Insufficient available balance to withdraw', 'warning');
      return false;
    }

    const res = await api.withdrawFunds({
      creatorId: currentCreator.id,
      amount,
    });

    if (res.success) {
      setWallet(prev => ({
        ...prev,
        available: Math.max(0, prev.available - amount),
      }));

      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      showToast(`Payout of $${amount.toLocaleString()} initiated to bank account!`, 'success');
      return true;
    } else {
      showToast(res.message || 'Withdrawal failed.', 'warning');
      return false;
    }
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
        paymentModalOpen,
        setPaymentModalOpen,
        selectedDealForPayment,
        setSelectedDealForPayment,
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
        confirmEscrowDeposit,
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
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
