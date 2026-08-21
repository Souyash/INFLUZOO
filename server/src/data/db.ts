import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { 
  Creator, 
  Campaign, 
  Deal, 
  AuditLog, 
  PlatformConfig, 
  User, 
  UserRole,
  AdminMetrics,
  Transaction,
  PayoutAccount
} from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'influzo.db');

// Ensure directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Open SQLite database
const sqlite = new Database(DB_PATH);
sqlite.pragma('journal_mode = WAL');

// Initialize Tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar TEXT,
    onboarded INTEGER DEFAULT 1,
    creator_profile_id TEXT,
    brand_profile_id TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS creators (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    handle TEXT NOT NULL,
    avatar TEXT,
    cover_image TEXT,
    bio TEXT,
    location TEXT,
    verified INTEGER DEFAULT 0,
    verification_status TEXT DEFAULT 'pending',
    authenticity_score REAL DEFAULT 95.0,
    rating REAL DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    niches TEXT NOT NULL,
    primary_platform TEXT NOT NULL,
    followers_count INTEGER NOT NULL,
    avg_engagement_rate REAL NOT NULL,
    avg_views_per_post INTEGER NOT NULL,
    price_range TEXT,
    platforms_json TEXT NOT NULL,
    audience_demographics_json TEXT NOT NULL,
    stats_json TEXT NOT NULL,
    sample_work_json TEXT NOT NULL,
    packages_json TEXT NOT NULL,
    featured INTEGER DEFAULT 0,
    kyc_photo TEXT,
    kyc_submitted_at TEXT,
    kyc_reviewed_at TEXT,
    kyc_rejection_reason TEXT,
    wallet_available REAL DEFAULT 0,
    wallet_locked REAL DEFAULT 0,
    wallet_earned REAL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    brand_id TEXT,
    title TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    brand_logo TEXT,
    niche TEXT NOT NULL,
    status TEXT NOT NULL,
    total_budget REAL NOT NULL,
    allocated_budget REAL DEFAULT 0,
    creators_target_count INTEGER NOT NULL,
    creators_hired_count INTEGER DEFAULT 0,
    deliverables_summary TEXT,
    deadline TEXT NOT NULL,
    target_platforms_json TEXT NOT NULL,
    metrics_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS deals (
    id TEXT PRIMARY KEY,
    campaign_id TEXT,
    campaign_title TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    brand_logo TEXT,
    creator_id TEXT NOT NULL,
    creator_name TEXT NOT NULL,
    creator_handle TEXT NOT NULL,
    creator_avatar TEXT,
    platform TEXT NOT NULL,
    package_title TEXT NOT NULL,
    amount REAL NOT NULL,
    escrow_status TEXT NOT NULL,
    stage TEXT NOT NULL,
    deliverables_json TEXT NOT NULL,
    brief_notes TEXT,
    draft_notes TEXT,
    draft_media_url TEXT,
    live_post_url TEXT,
    dispute_reason TEXT,
    dispute_opened_at TEXT,
    arbitration_verdict TEXT,
    created_at TEXT NOT NULL,
    deadline TEXT NOT NULL,
    completed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    deal_id TEXT,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    platform_fee REAL DEFAULT 0,
    net_amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT NOT NULL,
    payment_intent_id TEXT,
    status TEXT NOT NULL,
    payer_name TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS payout_accounts (
    id TEXT PRIMARY KEY,
    creator_id TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    account_number_masked TEXT NOT NULL,
    routing_number TEXT NOT NULL,
    account_holder_name TEXT NOT NULL,
    currency TEXT DEFAULT 'USD',
    is_default INTEGER DEFAULT 1,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details TEXT NOT NULL,
    actor TEXT NOT NULL,
    timestamp TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS platform_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS otp_codes (
    email_or_phone TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    role TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  );
`);

// Dynamic column migrations
try { sqlite.exec(`ALTER TABLE creators ADD COLUMN wallet_available REAL DEFAULT 0;`); } catch {}
try { sqlite.exec(`ALTER TABLE creators ADD COLUMN wallet_locked REAL DEFAULT 0;`); } catch {}
try { sqlite.exec(`ALTER TABLE creators ADD COLUMN wallet_earned REAL DEFAULT 0;`); } catch {}
try { sqlite.exec(`ALTER TABLE creators ADD COLUMN kyc_photo TEXT;`); } catch {}
try { sqlite.exec(`ALTER TABLE creators ADD COLUMN kyc_submitted_at TEXT;`); } catch {}
try { sqlite.exec(`ALTER TABLE creators ADD COLUMN kyc_reviewed_at TEXT;`); } catch {}
try { sqlite.exec(`ALTER TABLE creators ADD COLUMN kyc_rejection_reason TEXT;`); } catch {}

console.log(`[SQLITE] Influzo Relational Database loaded with Transaction Ledger at: ${DB_PATH}`);

function safeJsonParse<T>(str: string, fallback: T): T {
  try { return JSON.parse(str); } catch { return fallback; }
}

function rowToCreator(row: any): Creator {
  return {
    id: row.id,
    userId: row.user_id || undefined,
    name: row.name,
    handle: row.handle,
    avatar: row.avatar || '',
    coverImage: row.cover_image || '',
    bio: row.bio || '',
    location: row.location || '',
    verified: Boolean(row.verified),
    verificationStatus: row.verification_status,
    authenticityScore: row.authenticity_score,
    rating: row.rating,
    reviewCount: row.review_count,
    niches: safeJsonParse(row.niches, []),
    primaryPlatform: row.primary_platform,
    followersCount: row.followers_count,
    avgEngagementRate: row.avg_engagement_rate,
    avgViewsPerPost: row.avg_views_per_post,
    priceRange: row.price_range || '',
    platforms: safeJsonParse(row.platforms_json, []),
    audienceDemographics: safeJsonParse(row.audience_demographics_json, { topCountries: [], ageGroups: [], genderSplit: { female: 50, male: 50, other: 0 } }),
    stats: safeJsonParse(row.stats_json, { completedCollabs: 0, onTimeRate: 100, responseHours: 2, repeatBrandRate: 0 }),
    sampleWork: safeJsonParse(row.sample_work_json, []),
    packages: safeJsonParse(row.packages_json, []),
    featured: Boolean(row.featured),
    kycPhoto: row.kyc_photo || undefined,
    kycSubmittedAt: row.kyc_submitted_at || undefined,
    kycReviewedAt: row.kyc_reviewed_at || undefined,
    kycRejectionReason: row.kyc_rejection_reason || undefined,
    createdAt: row.created_at,
  };
}

function rowToCampaign(row: any): Campaign {
  return {
    id: row.id,
    brandId: row.brand_id || undefined,
    title: row.title,
    brandName: row.brand_name,
    brandLogo: row.brand_logo || '',
    niche: row.niche,
    status: row.status,
    totalBudget: row.total_budget,
    allocatedBudget: row.allocated_budget,
    creatorsTargetCount: row.creators_target_count,
    creatorsHiredCount: row.creators_hired_count,
    deliverablesSummary: row.deliverables_summary || '',
    deadline: row.deadline,
    targetPlatforms: safeJsonParse(row.target_platforms_json, []),
    metrics: safeJsonParse(row.metrics_json, { totalViews: 0, totalClicks: 0, conversions: 0, roas: 0 }),
  };
}

function rowToDeal(row: any): Deal {
  return {
    id: row.id,
    campaignId: row.campaign_id || undefined,
    campaignTitle: row.campaign_title,
    brandName: row.brand_name,
    brandLogo: row.brand_logo || '',
    creatorId: row.creator_id,
    creatorName: row.creator_name,
    creatorHandle: row.creator_handle,
    creatorAvatar: row.creator_avatar || '',
    platform: row.platform,
    packageTitle: row.package_title,
    amount: row.amount,
    escrowStatus: row.escrow_status,
    stage: row.stage,
    deliverables: safeJsonParse(row.deliverables_json, []),
    briefNotes: row.brief_notes || '',
    draftNotes: row.draft_notes || undefined,
    draftMediaUrl: row.draft_media_url || undefined,
    livePostUrl: row.live_post_url || undefined,
    disputeReason: row.dispute_reason || undefined,
    disputeOpenedAt: row.dispute_opened_at || undefined,
    arbitrationVerdict: row.arbitration_verdict || undefined,
    createdAt: row.created_at,
    deadline: row.deadline,
    completedAt: row.completed_at || undefined,
  };
}

function rowToUser(row: any): User {
  return {
    id: row.id,
    emailOrPhone: row.email,
    name: row.name,
    role: row.role as UserRole,
    avatar: row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    onboarded: Boolean(row.onboarded),
    creatorProfileId: row.creator_profile_id || undefined,
    brandProfileId: row.brand_profile_id || undefined,
    createdAt: row.created_at,
  };
}

function rowToTransaction(row: any): Transaction {
  return {
    id: row.id,
    dealId: row.deal_id || undefined,
    type: row.type,
    amount: row.amount,
    platformFee: row.platform_fee,
    netAmount: row.net_amount,
    currency: row.currency || 'USD',
    paymentMethod: row.payment_method,
    paymentIntentId: row.payment_intent_id || undefined,
    status: row.status,
    payerName: row.payer_name,
    recipientName: row.recipient_name,
    createdAt: row.created_at,
  };
}

function rowToPayoutAccount(row: any): PayoutAccount {
  return {
    id: row.id,
    creatorId: row.creator_id,
    bankName: row.bank_name,
    accountNumberMasked: row.account_number_masked,
    routingNumber: row.routing_number,
    accountHolderName: row.account_holder_name,
    currency: row.currency || 'USD',
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at,
  };
}

// Seed initial database
function seedDatabaseIfEmpty() {
  const userCount = sqlite.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) {
    // Seed initial transactions if empty
    const txCount = sqlite.prepare('SELECT COUNT(*) as count FROM transactions').get() as { count: number };
    if (txCount.count === 0) {
      sqlite.prepare(`
        INSERT INTO transactions (id, deal_id, type, amount, platform_fee, net_amount, currency, payment_method, payment_intent_id, status, payer_name, recipient_name, created_at)
        VALUES 
          ('tx-101', 'deal-101', 'deposit', 1600, 120, 1480, 'USD', 'stripe_card', 'pi_3MtwL2KZomN3UrX0001', 'succeeded', 'TaskFlow AI', 'Elena Rostova (Escrow Vault)', '2026-08-10 14:22:00'),
          ('tx-102', null, 'release', 2400, 180, 2220, 'USD', 'escrow_wallet', null, 'succeeded', 'Influzo Escrow Vault', 'Elena Rostova', '2026-08-08 11:30:00'),
          ('tx-103', null, 'withdrawal', 1500, 0, 1500, 'USD', 'bank_transfer', 'payout_w1234', 'succeeded', 'Elena Rostova', 'Chase Bank (•••• 4821)', '2026-08-09 16:45:00')
      `).run();
    }

    // Seed default payout account if empty
    const poCount = sqlite.prepare('SELECT COUNT(*) as count FROM payout_accounts').get() as { count: number };
    if (poCount.count === 0) {
      sqlite.prepare(`
        INSERT INTO payout_accounts (id, creator_id, bank_name, account_number_masked, routing_number, account_holder_name, currency, is_default, created_at)
        VALUES ('po-1', 'c-1', 'JPMorgan Chase Bank, N.A.', '•••• •••• •••• 4821', '021000021', 'Elena Rostova', 'USD', 1, '2026-08-06')
      `).run();
    }
    return;
  }

  console.log('[SQLITE] Seeding initial database records...');

  const defaultPasswordHash = bcrypt.hashSync('password123', 10);
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);

  // 1. Users
  const insertUser = sqlite.prepare(`
    INSERT INTO users (id, email, password_hash, name, role, avatar, onboarded, creator_profile_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('u-admin', 'admin@influzo.com', adminPasswordHash, 'Alex Rivera (Super Admin)', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 1, null, '2026-08-01');
  insertUser.run('u-creator-1', 'elena@techreviews.com', defaultPasswordHash, 'Elena Rostova', 'creator', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 1, 'c-1', '2026-08-05');
  insertUser.run('u-brand-1', 'growth@taskflow.ai', defaultPasswordHash, 'TaskFlow AI Growth Team', 'brand', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80', 1, null, '2026-08-08');

  // 2. Creators
  const insertCreator = sqlite.prepare(`
    INSERT INTO creators (
      id, user_id, name, handle, avatar, cover_image, bio, location, verified,
      verification_status, authenticity_score, rating, review_count, niches,
      primary_platform, followers_count, avg_engagement_rate, avg_views_per_post,
      price_range, platforms_json, audience_demographics_json, stats_json,
      sample_work_json, packages_json, featured, kyc_photo, kyc_submitted_at,
      wallet_available, wallet_locked, wallet_earned, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCreator.run(
    'c-1',
    'u-creator-1',
    'Elena Rostova',
    '@elenatech',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    'AI product reviewer, productivity software geek & UI/UX enthusiast. Helping 350K+ developers & tech enthusiasts discover the best workflow tools.',
    'San Francisco, CA',
    1,
    'verified',
    98.8,
    4.98,
    42,
    JSON.stringify(['Tech & AI', 'Lifestyle & Travel']),
    'youtube',
    385000,
    6.4,
    64200,
    '$800 - $3,200',
    JSON.stringify([
      { platform: 'youtube', handle: 'ElenaTechReviews', followers: 280000, engagementRate: 7.1, avgViews: 85000, profileUrl: '#' },
      { platform: 'twitter', handle: '@elenatech', followers: 65000, engagementRate: 4.2, avgViews: 32000, profileUrl: '#' },
      { platform: 'tiktok', handle: '@elena_ai_tips', followers: 40000, engagementRate: 8.5, avgViews: 55000, profileUrl: '#' }
    ]),
    JSON.stringify({
      topCountries: [
        { name: 'United States', percentage: 48 },
        { name: 'United Kingdom', percentage: 18 },
        { name: 'Germany', percentage: 12 }
      ],
      ageGroups: [
        { label: '18-24', percentage: 22 },
        { label: '25-34', percentage: 54 },
        { label: '35-44', percentage: 18 }
      ],
      genderSplit: { female: 38, male: 59, other: 3 }
    }),
    JSON.stringify({ completedCollabs: 54, onTimeRate: 100, responseHours: 2, repeatBrandRate: 88 }),
    JSON.stringify([
      { id: 'sw-1', title: 'Top 5 AI Code Editors in 2026', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80', views: '142K views', platform: 'youtube', brandCollab: 'Cursor & Supabase' }
    ]),
    JSON.stringify([
      { id: 'pkg-1', title: 'Dedicated YouTube Integration (60-90s)', description: 'Mid-roll sponsor integration with pinned comment link and 30-day digital ad rights.', price: 1600, deliverables: ['60-90s Mid-Roll Integration', 'Pinned Comment Link', '30-Day Digital Ad Rights'], turnaroundDays: 5, popular: true },
      { id: 'pkg-2', title: 'Full Dedicated Video Review (8-10 min)', description: 'Complete deep dive video dedicated 100% to your tool/product.', price: 3200, deliverables: ['8-10min Dedicated Video', 'SEO Tag Optimization', 'Permanent Pinned Link'], turnaroundDays: 8 }
    ]),
    1,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    '2026-08-05 10:30:00',
    2400,
    1600,
    28400,
    '2026-08-05'
  );

  insertCreator.run(
    'c-2',
    null,
    'Marcus Vance',
    '@marcusfitness',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
    'Calisthenics coach, hybrid athlete & nutrition science advocate. Certified trainer helping 500k+ stay shredded and injury-free.',
    'Austin, TX',
    1,
    'verified',
    97.4,
    4.95,
    38,
    JSON.stringify(['Fitness & Health', 'Food & Culinary']),
    'instagram',
    520000,
    5.8,
    92000,
    '$600 - $2,400',
    JSON.stringify([{ platform: 'instagram', handle: '@marcus_vance_fit', followers: 340000, engagementRate: 6.2, avgViews: 110000, profileUrl: '#' }]),
    JSON.stringify({ topCountries: [{ name: 'United States', percentage: 55 }], ageGroups: [{ label: '18-24', percentage: 34 }], genderSplit: { female: 32, male: 66, other: 2 } }),
    JSON.stringify({ completedCollabs: 67, onTimeRate: 98, responseHours: 1, repeatBrandRate: 91 }),
    JSON.stringify([]),
    JSON.stringify([{ id: 'pkg-4', title: 'Instagram Reel + 3x Story Sequence', description: '1 high-energy Reel showcasing product in workout routine + 3 swipe-up Stories with promo code.', price: 1200, deliverables: ['1x 4K Instagram Reel', '3x Story frames with sticker link'], turnaroundDays: 4, popular: true }]),
    0,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    '2026-08-06 14:15:00',
    1200,
    0,
    18200,
    '2026-08-06'
  );

  // 3. Campaigns
  const insertCampaign = sqlite.prepare(`
    INSERT INTO campaigns (
      id, brand_id, title, brand_name, brand_logo, niche, status,
      total_budget, allocated_budget, creators_target_count, creators_hired_count,
      deliverables_summary, deadline, target_platforms_json, metrics_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCampaign.run(
    'camp-1',
    'u-brand-1',
    'SaaS Productivity Launch Q3',
    'TaskFlow AI',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    'Tech & AI',
    'active',
    12500,
    7800,
    6,
    4,
    'YouTube 60s integrations + TikTok product walk-throughs',
    '2026-09-30',
    JSON.stringify(['youtube', 'tiktok', 'twitter']),
    JSON.stringify({ totalViews: 485000, totalClicks: 28400, conversions: 1820, roas: 3.8 }),
    '2026-08-10'
  );

  // 4. Deals
  const insertDeal = sqlite.prepare(`
    INSERT INTO deals (
      id, campaign_id, campaign_title, brand_name, brand_logo, creator_id,
      creator_name, creator_handle, creator_avatar, platform, package_title,
      amount, escrow_status, stage, deliverables_json, brief_notes, draft_notes,
      draft_media_url, live_post_url, dispute_reason, dispute_opened_at,
      arbitration_verdict, created_at, deadline, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertDeal.run(
    'deal-101',
    'camp-1',
    'SaaS Productivity Launch Q3',
    'TaskFlow AI',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    'c-1',
    'Elena Rostova',
    '@elenatech',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'youtube',
    'Dedicated YouTube Integration (60-90s)',
    1600,
    'escrow_locked',
    'draft_review',
    JSON.stringify(['60-90s mid-roll product demonstration', 'Pinned comment with discount tracking link']),
    'Focus on real-time AI transcription and productivity.',
    'Draft is ready! The mid-roll starts at 04:15 with custom graphics.',
    'https://loom.com/share/preview-taskflow-elena-v1',
    null,
    null,
    null,
    null,
    '2026-08-10',
    '2026-08-20',
    null
  );

  // 5. Transactions
  sqlite.prepare(`
    INSERT INTO transactions (id, deal_id, type, amount, platform_fee, net_amount, currency, payment_method, payment_intent_id, status, payer_name, recipient_name, created_at)
    VALUES 
      ('tx-101', 'deal-101', 'deposit', 1600, 120, 1480, 'USD', 'stripe_card', 'pi_3MtwL2KZomN3UrX0001', 'succeeded', 'TaskFlow AI', 'Elena Rostova (Escrow Vault)', '2026-08-10 14:22:00'),
      ('tx-102', null, 'release', 2400, 180, 2220, 'USD', 'escrow_wallet', null, 'succeeded', 'Influzo Escrow Vault', 'Elena Rostova', '2026-08-08 11:30:00'),
      ('tx-103', null, 'withdrawal', 1500, 0, 1500, 'USD', 'bank_transfer', 'payout_w1234', 'succeeded', 'Elena Rostova', 'Chase Bank (•••• 4821)', '2026-08-09 16:45:00')
  `).run();

  // 6. Payout Accounts
  sqlite.prepare(`
    INSERT INTO payout_accounts (id, creator_id, bank_name, account_number_masked, routing_number, account_holder_name, currency, is_default, created_at)
    VALUES ('po-1', 'c-1', 'JPMorgan Chase Bank, N.A.', '•••• •••• •••• 4821', '021000021', 'Elena Rostova', 'USD', 1, '2026-08-06')
  `).run();

  // 7. Audit Logs
  const insertAudit = sqlite.prepare(`
    INSERT INTO audit_logs (id, action, entity_type, entity_id, details, actor, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertAudit.run('log-1', 'ESCROW_DEPOSIT_LOCKED', 'escrow', 'deal-101', 'TaskFlow AI deposited $1,600 into Smart Escrow with Visa •••• 4242.', 'Brand: TaskFlow AI', '2026-08-10 14:22:05');

  // 8. Config
  const insertConfig = sqlite.prepare(`INSERT OR REPLACE INTO platform_config (key, value) VALUES (?, ?)`);
  insertConfig.run('platformTakeRatePercent', '7.5');
  insertConfig.run('minEscrowDepositUSD', '250');
  insertConfig.run('autoReleaseAfterDays', '14');
  insertConfig.run('aiMatchingModel', 'Gemini 2.0 Flash Enterprise');
  insertConfig.run('maintenanceMode', 'false');

  console.log('[SQLITE] Database seeding complete with real ledger records!');
}

seedDatabaseIfEmpty();

// Database Access Object
export const db = {
  // --- USERS & AUTH ---
  getUserByEmail(email: string): (User & { passwordHash?: string }) | null {
    const row = sqlite.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim()) as any;
    if (!row) return null;
    return { ...rowToUser(row), passwordHash: row.password_hash };
  },

  getUserById(id: string): User | null {
    const row = sqlite.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
    return row ? rowToUser(row) : null;
  },

  createUser(user: { id?: string; email: string; passwordHash?: string; name: string; role: UserRole; avatar?: string; onboarded?: boolean; creatorProfileId?: string }): User {
    const id = user.id || `u-${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];
    const avatar = user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
    const onboarded = user.onboarded !== undefined ? (user.onboarded ? 1 : 0) : 1;

    sqlite.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, avatar, onboarded, creator_profile_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, user.email.toLowerCase().trim(), user.passwordHash || null, user.name, user.role, avatar, onboarded, user.creatorProfileId || null, createdAt);

    return this.getUserById(id)!;
  },

  // --- OTP CODES ---
  setOTP(emailOrPhone: string, code: string, role: UserRole): void {
    const expiresAt = Date.now() + 5 * 60 * 1000;
    sqlite.prepare(`INSERT OR REPLACE INTO otp_codes (email_or_phone, code, role, expires_at) VALUES (?, ?, ?, ?)`).run(emailOrPhone.toLowerCase().trim(), code, role, expiresAt);
  },

  verifyOTP(emailOrPhone: string, code: string): { valid: boolean; role?: UserRole } {
    const row = sqlite.prepare(`SELECT * FROM otp_codes WHERE LOWER(email_or_phone) = LOWER(?) AND code = ? AND expires_at > ?`).get(emailOrPhone.trim(), code.trim(), Date.now()) as any;
    if (!row) return { valid: false };
    sqlite.prepare('DELETE FROM otp_codes WHERE LOWER(email_or_phone) = LOWER(?)').run(emailOrPhone.trim());
    return { valid: true, role: row.role as UserRole };
  },

  // --- CREATORS ---
  getCreators(params?: { niche?: string; platform?: string; verified?: boolean; q?: string }): Creator[] {
    let query = 'SELECT * FROM creators WHERE 1=1';
    const bindings: any[] = [];
    if (params?.niche && params.niche !== 'all') { query += ' AND niches LIKE ?'; bindings.push(`%${params.niche}%`); }
    if (params?.platform && params.platform !== 'all') { query += ' AND primary_platform = ?'; bindings.push(params.platform); }
    if (params?.verified !== undefined) { query += ' AND verified = ?'; bindings.push(params.verified ? 1 : 0); }
    if (params?.q) { query += ' AND (name LIKE ? OR handle LIKE ? OR bio LIKE ?)'; bindings.push(`%${params.q}%`, `%${params.q}%`, `%${params.q}%`); }
    query += ' ORDER BY verified DESC, created_at DESC';
    return sqlite.prepare(query).all(...bindings).map(rowToCreator);
  },

  getCreatorById(id: string): Creator | null {
    const row = sqlite.prepare('SELECT * FROM creators WHERE id = ?').get(id) as any;
    return row ? rowToCreator(row) : null;
  },

  getCreatorByUserId(userId: string): Creator | null {
    const row = sqlite.prepare('SELECT * FROM creators WHERE user_id = ?').get(userId) as any;
    return row ? rowToCreator(row) : null;
  },

  createCreator(creator: Creator): Creator {
    sqlite.prepare(`
      INSERT INTO creators (
        id, user_id, name, handle, avatar, cover_image, bio, location, verified,
        verification_status, authenticity_score, rating, review_count, niches,
        primary_platform, followers_count, avg_engagement_rate, avg_views_per_post,
        price_range, platforms_json, audience_demographics_json, stats_json,
        sample_work_json, packages_json, featured, kyc_photo, kyc_submitted_at,
        kyc_reviewed_at, kyc_rejection_reason, wallet_available, wallet_locked, wallet_earned, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      creator.id, creator.userId || null, creator.name, creator.handle, creator.avatar, creator.coverImage, creator.bio, creator.location,
      creator.verified ? 1 : 0, creator.verificationStatus || 'pending', creator.authenticityScore || 95, creator.rating || 5.0, creator.reviewCount || 0,
      JSON.stringify(creator.niches), creator.primaryPlatform, creator.followersCount, creator.avgEngagementRate, creator.avgViewsPerPost,
      creator.priceRange, JSON.stringify(creator.platforms), JSON.stringify(creator.audienceDemographics), JSON.stringify(creator.stats),
      JSON.stringify(creator.sampleWork), JSON.stringify(creator.packages), creator.featured ? 1 : 0, creator.kycPhoto || null,
      creator.kycSubmittedAt || new Date().toISOString().replace('T', ' ').slice(0, 19), creator.kycReviewedAt || null, creator.kycRejectionReason || null,
      0, 0, 0, creator.createdAt || new Date().toISOString().split('T')[0]
    );
    return this.getCreatorById(creator.id)!;
  },

  updateCreator(id: string, updates: Partial<Creator>): Creator | null {
    const current = this.getCreatorById(id);
    if (!current) return null;
    const merged = { ...current, ...updates };

    sqlite.prepare(`
      UPDATE creators SET
        name = ?, handle = ?, avatar = ?, cover_image = ?, bio = ?, location = ?,
        verified = ?, verification_status = ?, authenticity_score = ?, niches = ?,
        primary_platform = ?, followers_count = ?, avg_engagement_rate = ?,
        avg_views_per_post = ?, price_range = ?, platforms_json = ?,
        audience_demographics_json = ?, packages_json = ?, kyc_photo = ?,
        kyc_reviewed_at = ?, kyc_rejection_reason = ?
      WHERE id = ?
    `).run(
      merged.name, merged.handle, merged.avatar, merged.coverImage, merged.bio, merged.location,
      merged.verified ? 1 : 0, merged.verificationStatus, merged.authenticityScore, JSON.stringify(merged.niches),
      merged.primaryPlatform, merged.followersCount, merged.avgEngagementRate, merged.avgViewsPerPost,
      merged.priceRange, JSON.stringify(merged.platforms), JSON.stringify(merged.audienceDemographics),
      JSON.stringify(merged.packages), merged.kycPhoto || null, merged.kycReviewedAt || null,
      merged.kycRejectionReason || null, id
    );
    return this.getCreatorById(id);
  },

  // --- CAMPAIGNS ---
  getCampaigns(brandId?: string): Campaign[] {
    let query = 'SELECT * FROM campaigns';
    const bindings: any[] = [];
    if (brandId) { query += ' WHERE brand_id = ?'; bindings.push(brandId); }
    query += ' ORDER BY created_at DESC';
    return sqlite.prepare(query).all(...bindings).map(rowToCampaign);
  },

  getCampaignById(id: string): Campaign | null {
    const row = sqlite.prepare('SELECT * FROM campaigns WHERE id = ?').get(id) as any;
    return row ? rowToCampaign(row) : null;
  },

  createCampaign(campaign: Campaign): Campaign {
    sqlite.prepare(`
      INSERT INTO campaigns (
        id, brand_id, title, brand_name, brand_logo, niche, status,
        total_budget, allocated_budget, creators_target_count, creators_hired_count,
        deliverables_summary, deadline, target_platforms_json, metrics_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      campaign.id, campaign.brandId || null, campaign.title, campaign.brandName, campaign.brandLogo,
      campaign.niche, campaign.status, campaign.totalBudget, campaign.allocatedBudget, campaign.creatorsTargetCount,
      campaign.creatorsHiredCount, campaign.deliverablesSummary, campaign.deadline, JSON.stringify(campaign.targetPlatforms),
      JSON.stringify(campaign.metrics), new Date().toISOString().split('T')[0]
    );
    return this.getCampaignById(campaign.id)!;
  },

  // --- DEALS & ESCROW ---
  getDeals(filters?: { creatorId?: string; campaignId?: string }): Deal[] {
    let query = 'SELECT * FROM deals WHERE 1=1';
    const bindings: any[] = [];
    if (filters?.creatorId) { query += ' AND creator_id = ?'; bindings.push(filters.creatorId); }
    if (filters?.campaignId) { query += ' AND campaign_id = ?'; bindings.push(filters.campaignId); }
    query += ' ORDER BY created_at DESC';
    return sqlite.prepare(query).all(...bindings).map(rowToDeal);
  },

  getDealById(id: string): Deal | null {
    const row = sqlite.prepare('SELECT * FROM deals WHERE id = ?').get(id) as any;
    return row ? rowToDeal(row) : null;
  },

  createDeal(deal: Deal): Deal {
    sqlite.prepare(`
      INSERT INTO deals (
        id, campaign_id, campaign_title, brand_name, brand_logo, creator_id,
        creator_name, creator_handle, creator_avatar, platform, package_title,
        amount, escrow_status, stage, deliverables_json, brief_notes, draft_notes,
        draft_media_url, live_post_url, dispute_reason, dispute_opened_at,
        arbitration_verdict, created_at, deadline, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      deal.id, deal.campaignId || null, deal.campaignTitle, deal.brandName, deal.brandLogo,
      deal.creatorId, deal.creatorName, deal.creatorHandle, deal.creatorAvatar, deal.platform,
      deal.packageTitle, deal.amount, deal.escrowStatus, deal.stage, JSON.stringify(deal.deliverables),
      deal.briefNotes || null, deal.draftNotes || null, deal.draftMediaUrl || null, deal.livePostUrl || null,
      deal.disputeReason || null, deal.disputeOpenedAt || null, deal.arbitrationVerdict || null,
      deal.createdAt || new Date().toISOString().split('T')[0], deal.deadline, deal.completedAt || null
    );
    return this.getDealById(deal.id)!;
  },

  updateDeal(id: string, updates: Partial<Deal>): Deal | null {
    const current = this.getDealById(id);
    if (!current) return null;
    const merged = { ...current, ...updates };

    sqlite.prepare(`
      UPDATE deals SET
        escrow_status = ?, stage = ?, draft_notes = ?, draft_media_url = ?,
        live_post_url = ?, dispute_reason = ?, dispute_opened_at = ?,
        arbitration_verdict = ?, completed_at = ?
      WHERE id = ?
    `).run(
      merged.escrowStatus, merged.stage, merged.draftNotes || null, merged.draftMediaUrl || null,
      merged.livePostUrl || null, merged.disputeReason || null, merged.disputeOpenedAt || null,
      merged.arbitrationVerdict || null, merged.completedAt || null, id
    );
    return this.getDealById(id);
  },

  // --- FINANCIAL LEDGER & TRANSACTIONS ---
  getTransactions(filters?: { dealId?: string; type?: string }): Transaction[] {
    let query = 'SELECT * FROM transactions WHERE 1=1';
    const bindings: any[] = [];
    if (filters?.dealId) { query += ' AND deal_id = ?'; bindings.push(filters.dealId); }
    if (filters?.type) { query += ' AND type = ?'; bindings.push(filters.type); }
    query += ' ORDER BY created_at DESC';
    return sqlite.prepare(query).all(...bindings).map(rowToTransaction);
  },

  createTransaction(tx: Omit<Transaction, 'id' | 'createdAt'> & { id?: string }): Transaction {
    const id = tx.id || `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const createdAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

    sqlite.prepare(`
      INSERT INTO transactions (
        id, deal_id, type, amount, platform_fee, net_amount, currency,
        payment_method, payment_intent_id, status, payer_name, recipient_name, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, tx.dealId || null, tx.type, tx.amount, tx.platformFee || 0, tx.netAmount,
      tx.currency || 'USD', tx.paymentMethod, tx.paymentIntentId || null,
      tx.status, tx.payerName, tx.recipientName, createdAt
    );

    return sqlite.prepare('SELECT * FROM transactions WHERE id = ?').all(id).map(rowToTransaction)[0];
  },

  getPayoutAccounts(creatorId: string): PayoutAccount[] {
    const rows = sqlite.prepare('SELECT * FROM payout_accounts WHERE creator_id = ? ORDER BY is_default DESC, created_at DESC').all(creatorId);
    return rows.map(rowToPayoutAccount);
  },

  createPayoutAccount(po: Omit<PayoutAccount, 'id' | 'createdAt'>): PayoutAccount {
    const id = `po-${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];

    // If default, unset previous defaults
    if (po.isDefault) {
      sqlite.prepare('UPDATE payout_accounts SET is_default = 0 WHERE creator_id = ?').run(po.creatorId);
    }

    sqlite.prepare(`
      INSERT INTO payout_accounts (id, creator_id, bank_name, account_number_masked, routing_number, account_holder_name, currency, is_default, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, po.creatorId, po.bankName, po.accountNumberMasked, po.routingNumber, po.accountHolderName, po.currency || 'USD', po.isDefault ? 1 : 0, createdAt);

    return sqlite.prepare('SELECT * FROM payout_accounts WHERE id = ?').all(id).map(rowToPayoutAccount)[0];
  },

  // --- ADMIN & METRICS ---
  getAdminMetrics(): AdminMetrics {
    const deals = this.getDeals();
    const creators = this.getCreators();
    const campaigns = this.getCampaigns();
    const config = this.getConfig();
    const transactions = this.getTransactions();

    const totalVolume = deals.reduce((acc, d) => acc + d.amount, 0);
    const totalEscrowLocked = deals
      .filter(d => d.escrowStatus === 'escrow_locked' || d.escrowStatus === 'draft_submitted')
      .reduce((acc, d) => acc + d.amount, 0);
    const totalEscrowReleased = deals
      .filter(d => d.escrowStatus === 'released')
      .reduce((acc, d) => acc + d.amount, 0);
    const totalDisputedAmount = deals
      .filter(d => d.escrowStatus === 'disputed')
      .reduce((acc, d) => acc + d.amount, 0);

    // Platform revenue from fee ledger
    const platformRevenue = transactions
      .filter(t => t.type === 'deposit' || t.type === 'release')
      .reduce((acc, t) => acc + t.platformFee, 0) || Math.round(totalEscrowReleased * (config.platformTakeRatePercent / 100));

    return {
      totalVolume,
      totalEscrowLocked,
      totalEscrowReleased,
      totalDisputedAmount,
      platformRevenue,
      platformTakeRate: config.platformTakeRatePercent,
      activeCreatorsCount: creators.filter(c => c.verified).length,
      pendingVerificationsCount: creators.filter(c => !c.verified || c.verificationStatus === 'pending').length,
      activeCampaignsCount: campaigns.filter(c => c.status === 'active').length,
      activeDisputesCount: deals.filter(d => d.escrowStatus === 'disputed').length,
    };
  },

  getAuditLogs(): AuditLog[] {
    const rows = sqlite.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100').all() as any[];
    return rows.map(r => ({
      id: r.id,
      action: r.action,
      entityType: r.entity_type,
      entityId: r.entity_id,
      details: r.details,
      actor: r.actor,
      timestamp: r.timestamp,
    }));
  },

  addAuditLog(action: string, entityType: AuditLog['entityType'], entityId: string, details: string, actor = 'System'): void {
    const id = `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    sqlite.prepare(`
      INSERT INTO audit_logs (id, action, entity_type, entity_id, details, actor, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, action, entityType, entityId, details, actor, timestamp);
  },

  getConfig(): PlatformConfig {
    const rows = sqlite.prepare('SELECT key, value FROM platform_config').all() as { key: string; value: string }[];
    const map: Record<string, string> = {};
    rows.forEach(r => { map[r.key] = r.value; });

    return {
      platformTakeRatePercent: Number(map.platformTakeRatePercent) || 7.5,
      minEscrowDepositUSD: Number(map.minEscrowDepositUSD) || 250,
      autoReleaseAfterDays: Number(map.autoReleaseAfterDays) || 14,
      aiMatchingModel: map.aiMatchingModel || 'Gemini 2.0 Flash Enterprise',
      maintenanceMode: map.maintenanceMode === 'true',
    };
  },

  updateConfig(updates: Partial<PlatformConfig>): PlatformConfig {
    const stmt = sqlite.prepare('INSERT OR REPLACE INTO platform_config (key, value) VALUES (?, ?)');
    if (updates.platformTakeRatePercent !== undefined) stmt.run('platformTakeRatePercent', updates.platformTakeRatePercent.toString());
    if (updates.minEscrowDepositUSD !== undefined) stmt.run('minEscrowDepositUSD', updates.minEscrowDepositUSD.toString());
    if (updates.autoReleaseAfterDays !== undefined) stmt.run('autoReleaseAfterDays', updates.autoReleaseAfterDays.toString());
    if (updates.aiMatchingModel !== undefined) stmt.run('aiMatchingModel', updates.aiMatchingModel);
    if (updates.maintenanceMode !== undefined) stmt.run('maintenanceMode', updates.maintenanceMode ? 'true' : 'false');

    return this.getConfig();
  }
};
