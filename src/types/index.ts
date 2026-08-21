export type PlatformType = 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin';

export type NicheType = 
  | 'Tech & AI' 
  | 'Fitness & Health' 
  | 'Beauty & Skincare' 
  | 'Gaming & Esports' 
  | 'Lifestyle & Travel' 
  | 'Fashion & Apparel' 
  | 'Finance & Crypto' 
  | 'Food & Culinary';

export interface DemographicSlice {
  label: string;
  percentage: number;
}

export interface CreatorPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  deliverables: string[];
  turnaroundDays: number;
  popular?: boolean;
}

export interface Creator {
  id: string;
  userId?: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  verified: boolean;
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  authenticityScore?: number;
  rating: number;
  reviewCount: number;
  niches: NicheType[];
  primaryPlatform: PlatformType;
  followersCount: number;
  avgEngagementRate: number;
  avgViewsPerPost: number;
  priceRange: string;
  platforms: {
    platform: PlatformType;
    handle: string;
    followers: number;
    engagementRate: number;
    avgViews: number;
    profileUrl: string;
  }[];
  audienceDemographics: {
    topCountries: { name: string; percentage: number }[];
    ageGroups: DemographicSlice[];
    genderSplit: { female: number; male: number; other: number };
  };
  stats: {
    completedCollabs: number;
    onTimeRate: number;
    responseHours: number;
    repeatBrandRate: number;
  };
  sampleWork: {
    id: string;
    title: string;
    thumbnail: string;
    views: string;
    platform: PlatformType;
    brandCollab?: string;
  }[];
  packages: CreatorPackage[];
  featured?: boolean;
  kycPhoto?: string;
  kycSubmittedAt?: string;
  kycReviewedAt?: string;
  kycRejectionReason?: string;
  createdAt?: string;
}

export type EscrowStatus = 
  | 'pending_deposit' 
  | 'escrow_locked' 
  | 'draft_submitted' 
  | 'approved' 
  | 'released' 
  | 'disputed';

export type DealStage = 
  | 'offer_sent' 
  | 'accepted' 
  | 'draft_review' 
  | 'live_verified' 
  | 'completed';

export interface Deal {
  id: string;
  campaignId?: string;
  campaignTitle: string;
  brandName: string;
  brandLogo: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  platform: PlatformType;
  packageTitle: string;
  amount: number;
  escrowStatus: EscrowStatus;
  stage: DealStage;
  deliverables: string[];
  briefNotes: string;
  draftNotes?: string;
  draftMediaUrl?: string;
  livePostUrl?: string;
  createdAt: string;
  deadline: string;
  completedAt?: string;
  disputeReason?: string;
  disputeOpenedAt?: string;
  arbitrationVerdict?: 'creator_paid' | 'brand_refunded';
}

export interface Campaign {
  id: string;
  brandId?: string;
  title: string;
  brandName: string;
  brandLogo: string;
  niche: NicheType;
  status: 'active' | 'draft' | 'completed';
  totalBudget: number;
  allocatedBudget: number;
  creatorsTargetCount: number;
  creatorsHiredCount: number;
  deliverablesSummary: string;
  deadline: string;
  targetPlatforms: PlatformType[];
  metrics: {
    totalViews: number;
    totalClicks: number;
    conversions: number;
    roas: number;
  };
}

export type TransactionType = 'deposit' | 'release' | 'platform_fee' | 'withdrawal' | 'refund';
export type PaymentMethodType = 'stripe_card' | 'apple_pay' | 'google_pay' | 'bank_transfer' | 'escrow_wallet';

export interface Transaction {
  id: string;
  dealId?: string;
  type: TransactionType;
  amount: number;
  platformFee: number;
  netAmount: number;
  currency: string;
  paymentMethod: PaymentMethodType;
  paymentIntentId?: string;
  status: 'succeeded' | 'pending' | 'failed';
  payerName: string;
  recipientName: string;
  createdAt: string;
}

export interface PayoutAccount {
  id: string;
  creatorId: string;
  bankName: string;
  accountNumberMasked: string;
  routingNumber: string;
  accountHolderName: string;
  currency: string;
  isDefault: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'deal' | 'escrow' | 'review' | 'system' | 'payment';
  timestamp: string;
  read: boolean;
  dealId?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: 'escrow' | 'creator' | 'campaign' | 'deal' | 'config' | 'auth' | 'payment';
  entityId: string;
  details: string;
  actor: string;
  timestamp: string;
}

export interface PlatformConfig {
  platformTakeRatePercent: number;
  minEscrowDepositUSD: number;
  autoReleaseAfterDays: number;
  aiMatchingModel: string;
  maintenanceMode: boolean;
}

export interface AdminMetrics {
  totalVolume: number;
  totalEscrowLocked: number;
  totalEscrowReleased: number;
  totalDisputedAmount: number;
  platformRevenue: number;
  platformTakeRate: number;
  activeCreatorsCount: number;
  pendingVerificationsCount: number;
  activeCampaignsCount: number;
  activeDisputesCount: number;
}

export type UserRole = 'brand' | 'creator' | 'admin';

export interface User {
  id: string;
  emailOrPhone: string;
  name: string;
  role: UserRole;
  avatar: string;
  onboarded: boolean;
  createdAt: string;
  creatorProfileId?: string;
  brandProfileId?: string;
}

export type AppPerspective = 'landing' | 'brand' | 'creator' | 'admin';
export type BrandTab = 'discovery' | 'pipeline' | 'studio' | 'analytics';
export type CreatorTab = 'overview' | 'inbox' | 'mediakit' | 'wallet';
export type AdminTab = 'overview' | 'verifications' | 'disputes' | 'transactions' | 'settings' | 'audit';
