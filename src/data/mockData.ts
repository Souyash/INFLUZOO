import { Creator, Campaign, Deal, NotificationItem } from '../types';

export const MOCK_CREATORS: Creator[] = [
  {
    id: 'c-1',
    name: 'Elena Rostova',
    handle: '@elenatech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    bio: 'AI product reviewer, productivity software geek & UI/UX enthusiast. Helping 350K+ developers & tech enthusiasts discover the best workflow tools.',
    location: 'San Francisco, CA',
    verified: true,
    rating: 4.98,
    reviewCount: 42,
    niches: ['Tech & AI', 'Lifestyle & Travel'],
    primaryPlatform: 'youtube',
    followersCount: 385000,
    avgEngagementRate: 6.4,
    avgViewsPerPost: 64200,
    priceRange: '$800 - $3,200',
    platforms: [
      { platform: 'youtube', handle: 'ElenaTechReviews', followers: 280000, engagementRate: 7.1, avgViews: 85000, profileUrl: '#' },
      { platform: 'twitter', handle: '@elenatech', followers: 65000, engagementRate: 4.2, avgViews: 32000, profileUrl: '#' },
      { platform: 'tiktok', handle: '@elena_ai_tips', followers: 40000, engagementRate: 8.5, avgViews: 55000, profileUrl: '#' },
    ],
    audienceDemographics: {
      topCountries: [
        { name: 'United States', percentage: 48 },
        { name: 'United Kingdom', percentage: 18 },
        { name: 'Germany', percentage: 12 },
        { name: 'Canada', percentage: 9 },
        { name: 'Other', percentage: 13 },
      ],
      ageGroups: [
        { label: '18-24', percentage: 22 },
        { label: '25-34', percentage: 54 },
        { label: '35-44', percentage: 18 },
        { label: '45+', percentage: 6 },
      ],
      genderSplit: { female: 38, male: 59, other: 3 },
    },
    stats: {
      completedCollabs: 54,
      onTimeRate: 100,
      responseHours: 2,
      repeatBrandRate: 88,
    },
    sampleWork: [
      {
        id: 'sw-1',
        title: 'Top 5 AI Code Editors in 2026',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        views: '142K views',
        platform: 'youtube',
        brandCollab: 'Cursor & Supabase'
      },
      {
        id: 'sw-2',
        title: 'How I Automated My Morning Routine with Notion AI',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        views: '98K views',
        platform: 'youtube',
        brandCollab: 'Notion'
      }
    ],
    packages: [
      {
        id: 'pkg-1',
        title: 'Dedicated YouTube Integration (60-90s)',
        description: 'Mid-roll sponsor integration with pinned comment link, dedicated UTM tracking, and full usage rights for 30 days.',
        price: 1600,
        deliverables: ['60-90s Mid-Roll Integration', 'Pinned Comment + Description Link', '30-Day Digital Ad Usage Rights'],
        turnaroundDays: 5,
        popular: true
      },
      {
        id: 'pkg-2',
        title: 'Full Dedicated Video Review',
        description: 'Complete 8-12 minute deep-dive review video centered exclusively on your software or hardware product.',
        price: 3200,
        deliverables: ['Dedicated 10-Min Video', 'X / Twitter Announcement Thread', 'Newsletter Feature (25k subs)', '90-Day Ad Usage'],
        turnaroundDays: 9,
      },
      {
        id: 'pkg-3',
        title: 'TikTok & Short-Form Bundle',
        description: '2x High-converting vertical 4K short videos for TikTok and YouTube Shorts featuring product demo.',
        price: 850,
        deliverables: ['2x Vertical Shorts (TikTok + Shorts)', 'Custom Audio & Captions', 'Bio Link for 14 Days'],
        turnaroundDays: 3,
      }
    ],
    featured: true,
  },
  {
    id: 'c-2',
    name: 'Marcus Vance',
    handle: '@marcusfitness',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
    bio: 'Calisthenics coach, hybrid athlete & nutrition science advocate. Certified trainer helping 500k+ stay shredded and injury-free.',
    location: 'Austin, TX',
    verified: true,
    rating: 4.95,
    reviewCount: 38,
    niches: ['Fitness & Health', 'Food & Culinary'],
    primaryPlatform: 'instagram',
    followersCount: 520000,
    avgEngagementRate: 5.8,
    avgViewsPerPost: 92000,
    priceRange: '$600 - $2,400',
    platforms: [
      { platform: 'instagram', handle: '@marcus_vance_fit', followers: 340000, engagementRate: 6.2, avgViews: 110000, profileUrl: '#' },
      { platform: 'tiktok', handle: '@marcuscalisthenics', followers: 180000, engagementRate: 5.4, avgViews: 75000, profileUrl: '#' },
    ],
    audienceDemographics: {
      topCountries: [
        { name: 'United States', percentage: 55 },
        { name: 'Australia', percentage: 14 },
        { name: 'United Kingdom', percentage: 12 },
        { name: 'Canada', percentage: 10 },
        { name: 'Other', percentage: 9 },
      ],
      ageGroups: [
        { label: '18-24', percentage: 34 },
        { label: '25-34', percentage: 48 },
        { label: '35-44', percentage: 14 },
        { label: '45+', percentage: 4 },
      ],
      genderSplit: { female: 32, male: 66, other: 2 },
    },
    stats: {
      completedCollabs: 67,
      onTimeRate: 98,
      responseHours: 1,
      repeatBrandRate: 91,
    },
    sampleWork: [
      {
        id: 'sw-3',
        title: '5 Daily Stretches for Posture & Core',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
        views: '290K views',
        platform: 'instagram',
        brandCollab: 'Gymshark'
      }
    ],
    packages: [
      {
        id: 'pkg-4',
        title: 'Instagram Reel + 3x Story Sequence',
        description: '1 high-energy Reel showcasing product in workout routine + 3 swipe-up Stories with promo code.',
        price: 1200,
        deliverables: ['1x 4K Instagram Reel', '3x Story frames with sticker link', 'High-res RAW photo asset'],
        turnaroundDays: 4,
        popular: true
      },
      {
        id: 'pkg-5',
        title: 'Multi-Platform Takeover (IG + TikTok)',
        description: 'Dual-posted workout challenge or supplement review synced on Instagram Reels and TikTok.',
        price: 2100,
        deliverables: ['1x Reel + 1x TikTok Video', '4x Story Frames', '30-Day Paid Whitelisting / Spark Ads'],
        turnaroundDays: 6,
      }
    ],
    featured: true,
  },
  {
    id: 'c-3',
    name: 'Aria Chen',
    handle: '@ariaskincare',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80',
    bio: 'Cosmetic chemistry student & clean beauty creator. Honest ingredient breakdowns, aesthetic routines & eczema-safe recommendations.',
    location: 'New York, NY',
    verified: true,
    rating: 4.99,
    reviewCount: 65,
    niches: ['Beauty & Skincare', 'Lifestyle & Travel'],
    primaryPlatform: 'tiktok',
    followersCount: 740000,
    avgEngagementRate: 8.2,
    avgViewsPerPost: 185000,
    priceRange: '$750 - $2,800',
    platforms: [
      { platform: 'tiktok', handle: '@ariachenbeauty', followers: 580000, engagementRate: 9.1, avgViews: 240000, profileUrl: '#' },
      { platform: 'instagram', handle: '@ariachen', followers: 160000, engagementRate: 5.3, avgViews: 65000, profileUrl: '#' },
    ],
    audienceDemographics: {
      topCountries: [
        { name: 'United States', percentage: 62 },
        { name: 'Canada', percentage: 15 },
        { name: 'United Kingdom', percentage: 11 },
        { name: 'France', percentage: 5 },
        { name: 'Other', percentage: 7 },
      ],
      ageGroups: [
        { label: '18-24', percentage: 46 },
        { label: '25-34', percentage: 41 },
        { label: '35-44', percentage: 10 },
        { label: '45+', percentage: 3 },
      ],
      genderSplit: { female: 84, male: 14, other: 2 },
    },
    stats: {
      completedCollabs: 82,
      onTimeRate: 100,
      responseHours: 3,
      repeatBrandRate: 94,
    },
    sampleWork: [
      {
        id: 'sw-4',
        title: 'The Glass Skin Routine That Actually Works',
        thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
        views: '840K views',
        platform: 'tiktok',
        brandCollab: 'Glow Recipe'
      }
    ],
    packages: [
      {
        id: 'pkg-6',
        title: 'TikTok UGC Style Aesthetic Product Review',
        description: 'Authentic 45-60s "get ready with me" (GRWM) style video highlighting formula texture and real results.',
        price: 1400,
        deliverables: ['1x TikTok Video (Organic + Spark Ad Code)', 'Link in Bio (10 Days)', 'High-resolution Product B-Roll'],
        turnaroundDays: 4,
        popular: true
      },
      {
        id: 'pkg-7',
        title: 'Full 360 Beauty Launch Campaign',
        description: '1 TikTok review + 1 Instagram Reel + 4 Story frames with direct swipeable shop links.',
        price: 2600,
        deliverables: ['1x TikTok + 1x IG Reel', '4x Stories', 'Whitelisting code for 60 days'],
        turnaroundDays: 7,
      }
    ],
    featured: true,
  },
  {
    id: 'c-4',
    name: 'Kai Nakamura',
    handle: '@kaigames',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    bio: 'Twitch Partner & indie game explorer. Specializing in gaming hardware reviews, stream setup builds & esports entertainment.',
    location: 'Seattle, WA',
    verified: true,
    rating: 4.88,
    reviewCount: 29,
    niches: ['Gaming & Esports', 'Tech & AI'],
    primaryPlatform: 'youtube',
    followersCount: 290000,
    avgEngagementRate: 6.9,
    avgViewsPerPost: 52000,
    priceRange: '$500 - $1,800',
    platforms: [
      { platform: 'youtube', handle: 'KaiNakamuraGaming', followers: 175000, engagementRate: 7.4, avgViews: 65000, profileUrl: '#' },
      { platform: 'tiktok', handle: '@kaigames_clips', followers: 115000, engagementRate: 6.1, avgViews: 38000, profileUrl: '#' },
    ],
    audienceDemographics: {
      topCountries: [
        { name: 'United States', percentage: 50 },
        { name: 'Canada', percentage: 16 },
        { name: 'Japan', percentage: 14 },
        { name: 'Germany', percentage: 8 },
        { name: 'Other', percentage: 12 },
      ],
      ageGroups: [
        { label: '18-24', percentage: 52 },
        { label: '25-34', percentage: 36 },
        { label: '35-44', percentage: 9 },
        { label: '45+', percentage: 3 },
      ],
      genderSplit: { female: 24, male: 73, other: 3 },
    },
    stats: {
      completedCollabs: 38,
      onTimeRate: 97,
      responseHours: 4,
      repeatBrandRate: 79,
    },
    sampleWork: [
      {
        id: 'sw-5',
        title: 'Building the Ultimate OLED Gaming Setup 2026',
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
        views: '175K views',
        platform: 'youtube',
        brandCollab: 'Razer'
      }
    ],
    packages: [
      {
        id: 'pkg-8',
        title: 'Hardware Setup Showcase / Stream Overlay',
        description: '2-hour live stream banner placement + 60s live verbal endorsement + YouTube highlights integration.',
        price: 950,
        deliverables: ['Live Stream Verbal Shoutout', 'Chat Command Sponsor Link', 'YouTube Video Mention'],
        turnaroundDays: 5,
        popular: true
      }
    ]
  },
  {
    id: 'c-5',
    name: 'Devon Harper',
    handle: '@devonfinances',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
    bio: 'Former FinTech analyst breaking down personal finance, investing apps, credit strategies, and smart wealth building for Gen Z & Millennials.',
    location: 'Chicago, IL',
    verified: true,
    rating: 4.96,
    reviewCount: 51,
    niches: ['Finance & Crypto', 'Tech & AI'],
    primaryPlatform: 'youtube',
    followersCount: 460000,
    avgEngagementRate: 5.1,
    avgViewsPerPost: 78000,
    priceRange: '$1,200 - $4,500',
    platforms: [
      { platform: 'youtube', handle: 'DevonHarperFinance', followers: 320000, engagementRate: 5.6, avgViews: 95000, profileUrl: '#' },
      { platform: 'twitter', handle: '@devonfinance', followers: 140000, engagementRate: 4.3, avgViews: 45000, profileUrl: '#' },
    ],
    audienceDemographics: {
      topCountries: [
        { name: 'United States', percentage: 70 },
        { name: 'Canada', percentage: 12 },
        { name: 'United Kingdom', percentage: 9 },
        { name: 'Australia', percentage: 4 },
        { name: 'Other', percentage: 5 },
      ],
      ageGroups: [
        { label: '18-24', percentage: 18 },
        { label: '25-34', percentage: 62 },
        { label: '35-44', percentage: 15 },
        { label: '45+', percentage: 5 },
      ],
      genderSplit: { female: 35, male: 63, other: 2 },
    },
    stats: {
      completedCollabs: 61,
      onTimeRate: 100,
      responseHours: 2,
      repeatBrandRate: 92,
    },
    sampleWork: [
      {
        id: 'sw-6',
        title: 'How I Automate 40% of My Monthly Savings',
        thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
        views: '210K views',
        platform: 'youtube',
        brandCollab: 'Wealthfront'
      }
    ],
    packages: [
      {
        id: 'pkg-9',
        title: 'YouTube FinTech Sponsor & App Walkthrough',
        description: 'In-depth 90-second segment showing app interface, security credentials, and registration onboarding bonus.',
        price: 2200,
        deliverables: ['90-second YouTube Segment', 'Affiliate/UTM Tracking Link in Top 3 Lines', 'Pinned Comment'],
        turnaroundDays: 6,
        popular: true
      }
    ]
  },
  {
    id: 'c-6',
    name: 'Chloe Monet',
    handle: '@chloemstyle',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
    bio: 'Capsule wardrobe enthusiast & sustainable luxury stylist. Sharing daily OOTDs, thrift flips, and seasonal fashion hauls.',
    location: 'London, UK',
    verified: true,
    rating: 4.93,
    reviewCount: 35,
    niches: ['Fashion & Apparel', 'Lifestyle & Travel'],
    primaryPlatform: 'instagram',
    followersCount: 310000,
    avgEngagementRate: 6.7,
    avgViewsPerPost: 58000,
    priceRange: '$550 - $2,000',
    platforms: [
      { platform: 'instagram', handle: '@chloemstyle', followers: 230000, engagementRate: 7.2, avgViews: 68000, profileUrl: '#' },
      { platform: 'tiktok', handle: '@chloevogue', followers: 80000, engagementRate: 5.4, avgViews: 35000, profileUrl: '#' },
    ],
    audienceDemographics: {
      topCountries: [
        { name: 'United Kingdom', percentage: 44 },
        { name: 'United States', percentage: 28 },
        { name: 'France', percentage: 12 },
        { name: 'Italy', percentage: 8 },
        { name: 'Other', percentage: 8 },
      ],
      ageGroups: [
        { label: '18-24', percentage: 38 },
        { label: '25-34', percentage: 50 },
        { label: '35-44', percentage: 9 },
        { label: '45+', percentage: 3 },
      ],
      genderSplit: { female: 89, male: 9, other: 2 },
    },
    stats: {
      completedCollabs: 47,
      onTimeRate: 100,
      responseHours: 2,
      repeatBrandRate: 85,
    },
    sampleWork: [
      {
        id: 'sw-7',
        title: '10 Pieces, 30 Outfits: Autumn Capsule',
        thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80',
        views: '320K views',
        platform: 'instagram',
        brandCollab: 'Everlane'
      }
    ],
    packages: [
      {
        id: 'pkg-10',
        title: 'Instagram Style Carousel + Reel',
        description: 'Multi-slide styling lookbook showcasing apparel versatility paired with an aesthetic transition Reel.',
        price: 980,
        deliverables: ['1x Instagram Reel', '1x 8-Slide Lookbook Carousel', 'Story with direct item tags'],
        turnaroundDays: 4,
        popular: true
      }
    ]
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    title: 'SaaS Productivity Launch Q3',
    brandName: 'TaskFlow AI',
    brandLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    niche: 'Tech & AI',
    status: 'active',
    totalBudget: 12500,
    allocatedBudget: 7800,
    creatorsTargetCount: 6,
    creatorsHiredCount: 4,
    deliverablesSummary: 'YouTube 60s integrations + TikTok product walk-throughs',
    deadline: '2026-09-30',
    targetPlatforms: ['youtube', 'tiktok', 'twitter'],
    metrics: {
      totalViews: 485000,
      totalClicks: 28400,
      conversions: 1820,
      roas: 3.8,
    }
  },
  {
    id: 'camp-2',
    title: 'Clean Energy & Hydration Bottle Drop',
    brandName: 'AeroHydrate',
    brandLogo: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=120&auto=format&fit=crop&q=80',
    niche: 'Fitness & Health',
    status: 'active',
    totalBudget: 8000,
    allocatedBudget: 5400,
    creatorsTargetCount: 5,
    creatorsHiredCount: 3,
    deliverablesSummary: 'Reels workout routines & Stories with discount codes',
    deadline: '2026-09-15',
    targetPlatforms: ['instagram', 'tiktok'],
    metrics: {
      totalViews: 620000,
      totalClicks: 41200,
      conversions: 2450,
      roas: 4.4,
    }
  },
  {
    id: 'camp-3',
    title: 'Barrier Repair Peptide Serum Launch',
    brandName: 'Lumiere Botanics',
    brandLogo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&auto=format&fit=crop&q=80',
    niche: 'Beauty & Skincare',
    status: 'active',
    totalBudget: 15000,
    allocatedBudget: 9600,
    creatorsTargetCount: 8,
    creatorsHiredCount: 5,
    deliverablesSummary: 'TikTok GRWM reviews + Spark Ads whitelist rights',
    deadline: '2026-10-10',
    targetPlatforms: ['tiktok', 'instagram'],
    metrics: {
      totalViews: 1150000,
      totalClicks: 89000,
      conversions: 4900,
      roas: 5.1,
    }
  }
];

export const MOCK_DEALS: Deal[] = [
  {
    id: 'deal-101',
    campaignId: 'camp-1',
    campaignTitle: 'SaaS Productivity Launch Q3',
    brandName: 'TaskFlow AI',
    brandLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    creatorId: 'c-1',
    creatorName: 'Elena Rostova',
    creatorHandle: '@elenatech',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    platform: 'youtube',
    packageTitle: 'Dedicated YouTube Integration (60-90s)',
    amount: 1600,
    escrowStatus: 'draft_submitted',
    stage: 'draft_review',
    deliverables: [
      '60-90s mid-roll product demonstration',
      'Pinned comment with discount tracking link',
      '30 days digital usage rights'
    ],
    briefNotes: 'Focus on the real-time AI meeting transcription and task automation. Target power users & startup founders.',
    draftNotes: 'Draft is ready! The mid-roll starts at 04:15 with custom motion graphics showing the TaskFlow dashboard.',
    draftMediaUrl: 'https://loom.com/share/preview-taskflow-elena-v1',
    createdAt: '2026-08-10',
    deadline: '2026-08-20',
  },
  {
    id: 'deal-102',
    campaignId: 'camp-2',
    campaignTitle: 'Clean Energy & Hydration Bottle Drop',
    brandName: 'AeroHydrate',
    brandLogo: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=120&auto=format&fit=crop&q=80',
    creatorId: 'c-2',
    creatorName: 'Marcus Vance',
    creatorHandle: '@marcusfitness',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    platform: 'instagram',
    packageTitle: 'Instagram Reel + 3x Story Sequence',
    amount: 1200,
    escrowStatus: 'released',
    stage: 'completed',
    deliverables: [
      '1x 4K Instagram Reel showing HIIT routine + electrolyte mix',
      '3x Stories with sticker link',
      'RAW photo assets'
    ],
    briefNotes: 'Highlight 0 sugar, natural electrolytes, and sustainable titanium bottle design.',
    livePostUrl: 'https://instagram.com/p/C9x81093zL/',
    createdAt: '2026-08-01',
    deadline: '2026-08-12',
    completedAt: '2026-08-14',
  },
  {
    id: 'deal-103',
    campaignId: 'camp-3',
    campaignTitle: 'Barrier Repair Peptide Serum Launch',
    brandName: 'Lumiere Botanics',
    brandLogo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&auto=format&fit=crop&q=80',
    creatorId: 'c-3',
    creatorName: 'Aria Chen',
    creatorHandle: '@ariaskincare',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    platform: 'tiktok',
    packageTitle: 'TikTok UGC Style Aesthetic Product Review',
    amount: 1400,
    escrowStatus: 'escrow_locked',
    stage: 'accepted',
    deliverables: [
      '1x TikTok Video (Organic + Spark Ad Code)',
      'Link in Bio for 10 Days',
      'High-res B-Roll'
    ],
    briefNotes: 'Explain the 3% copper peptide mechanism and show the instant glow on clean skin.',
    createdAt: '2026-08-14',
    deadline: '2026-08-25',
  },
  {
    id: 'deal-104',
    campaignTitle: 'NextGen OLED Monitor Promotion',
    brandName: 'Apex Visuals',
    brandLogo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&auto=format&fit=crop&q=80',
    creatorId: 'c-1',
    creatorName: 'Elena Rostova',
    creatorHandle: '@elenatech',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    platform: 'youtube',
    packageTitle: 'Full Dedicated Video Review',
    amount: 3200,
    escrowStatus: 'pending_deposit',
    stage: 'offer_sent',
    deliverables: [
      'Dedicated 10-Min Video',
      'X / Twitter Announcement Thread',
      'Newsletter Feature'
    ],
    briefNotes: 'We want you to test the 360Hz refresh rate and color accuracy for creators.',
    createdAt: '2026-08-15',
    deadline: '2026-08-30',
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Draft Submitted for Review',
    message: 'Elena Rostova uploaded the draft video for TaskFlow AI SaaS Launch.',
    type: 'review',
    timestamp: '2 hours ago',
    read: false,
    dealId: 'deal-101'
  },
  {
    id: 'notif-2',
    title: 'Escrow Funds Released',
    message: '$1,200 has been transferred to Marcus Vance for AeroHydrate Campaign.',
    type: 'escrow',
    timestamp: '1 day ago',
    read: false,
    dealId: 'deal-102'
  },
  {
    id: 'notif-3',
    title: 'New Collaboration Proposal',
    message: 'Lumiere Botanics accepted your terms and locked $1,400 into escrow.',
    type: 'deal',
    timestamp: '2 days ago',
    read: true,
    dealId: 'deal-103'
  }
];
