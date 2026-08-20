import { Creator, Campaign, Deal, AuditLog, PlatformConfig, AdminMetrics, User, UserRole } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('influzo_session_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // --- AUTH & USER SESSION ---
  async signup(data: { name: string; email: string; password: string; role: UserRole }) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success && json.data?.token) {
      localStorage.setItem('influzo_session_token', json.data.token);
    }
    return json;
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success && json.data?.token) {
      localStorage.setItem('influzo_session_token', json.data.token);
    }
    return json;
  },

  async getMe(): Promise<{ user: User; creator?: Creator } | null> {
    try {
      const token = localStorage.getItem('influzo_session_token');
      if (!token) return null;

      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        localStorage.removeItem('influzo_session_token');
        return null;
      }
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  async sendOtp(emailOrPhone: string, role: UserRole) {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone, role }),
    });
    return await res.json();
  },

  async verifyOtp(emailOrPhone: string, code: string) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone, code }),
    });
    const json = await res.json();
    if (json.success && json.data?.token) {
      localStorage.setItem('influzo_session_token', json.data.token);
    }
    return json;
  },

  async adminLogin(masterKey: string) {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ masterKey }),
    });
    const json = await res.json();
    if (json.success && json.data?.token) {
      localStorage.setItem('influzo_session_token', json.data.token);
    }
    return json;
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } finally {
      localStorage.removeItem('influzo_session_token');
    }
  },

  // --- HEALTH CHECK ---
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  // --- CREATORS ---
  async getCreators(params?: { niche?: string; platform?: string; verified?: boolean; q?: string }): Promise<Creator[]> {
    try {
      const query = new URLSearchParams();
      if (params?.niche && params.niche !== 'all') query.set('niche', params.niche);
      if (params?.platform && params.platform !== 'all') query.set('platform', params.platform);
      if (params?.verified !== undefined) query.set('verified', String(params.verified));
      if (params?.q) query.set('q', params.q);

      const res = await fetch(`${API_BASE}/creators${query.toString() ? `?${query.toString()}` : ''}`);
      const json = await res.json();
      return json.success ? (json.data as Creator[]) : [];
    } catch (err) {
      console.warn('API getCreators error:', err);
      return [];
    }
  },

  async getCreatorById(id: string): Promise<Creator | null> {
    try {
      const res = await fetch(`${API_BASE}/creators/${id}`);
      const json = await res.json();
      return json.success ? (json.data as Creator) : null;
    } catch {
      return null;
    }
  },

  async updateCreatorProfile(creatorId: string, updates: Partial<Creator>): Promise<Creator | null> {
    try {
      const res = await fetch(`${API_BASE}/creators/${creatorId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      return json.success ? (json.data as Creator) : null;
    } catch {
      return null;
    }
  },

  // --- CAMPAIGNS ---
  async getCampaigns(brandId?: string): Promise<Campaign[]> {
    try {
      const res = await fetch(`${API_BASE}/campaigns${brandId ? `?brandId=${brandId}` : ''}`);
      const json = await res.json();
      return json.success ? (json.data as Campaign[]) : [];
    } catch {
      return [];
    }
  },

  async createCampaign(campaign: Omit<Campaign, 'id' | 'metrics' | 'allocatedBudget' | 'creatorsHiredCount'>): Promise<Campaign | null> {
    try {
      const res = await fetch(`${API_BASE}/campaigns`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(campaign),
      });
      const json = await res.json();
      return json.success ? (json.data as Campaign) : null;
    } catch {
      return null;
    }
  },

  // --- DEALS & ESCROW ---
  async getDeals(filters?: { creatorId?: string; campaignId?: string }): Promise<Deal[]> {
    try {
      const query = new URLSearchParams();
      if (filters?.creatorId) query.set('creatorId', filters.creatorId);
      if (filters?.campaignId) query.set('campaignId', filters.campaignId);

      const res = await fetch(`${API_BASE}/deals${query.toString() ? `?${query.toString()}` : ''}`);
      const json = await res.json();
      return json.success ? (json.data as Deal[]) : [];
    } catch {
      return [];
    }
  },

  async createDeal(deal: Partial<Deal>): Promise<Deal | null> {
    try {
      const res = await fetch(`${API_BASE}/deals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(deal),
      });
      const json = await res.json();
      return json.success ? (json.data as Deal) : null;
    } catch {
      return null;
    }
  },

  async submitDraft(dealId: string, notes: string, mediaUrl: string): Promise<Deal | null> {
    try {
      const res = await fetch(`${API_BASE}/deals/${dealId}/draft`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ notes, mediaUrl }),
      });
      const json = await res.json();
      return json.success ? (json.data as Deal) : null;
    } catch {
      return null;
    }
  },

  async submitLivePost(dealId: string, livePostUrl: string): Promise<Deal | null> {
    try {
      const res = await fetch(`${API_BASE}/deals/${dealId}/live-post`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ livePostUrl }),
      });
      const json = await res.json();
      return json.success ? (json.data as Deal) : null;
    } catch {
      return null;
    }
  },

  async depositEscrow(dealId: string): Promise<Deal | null> {
    try {
      const res = await fetch(`${API_BASE}/escrow/deposit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ dealId }),
      });
      const json = await res.json();
      return json.success ? (json.data as Deal) : null;
    } catch {
      return null;
    }
  },

  async releaseEscrow(dealId: string): Promise<Deal | null> {
    try {
      const res = await fetch(`${API_BASE}/escrow/release`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ dealId }),
      });
      const json = await res.json();
      return json.success ? (json.data as Deal) : null;
    } catch {
      return null;
    }
  },

  async disputeEscrow(dealId: string, reason: string): Promise<Deal | null> {
    try {
      const res = await fetch(`${API_BASE}/escrow/dispute`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ dealId, reason }),
      });
      const json = await res.json();
      return json.success ? (json.data as Deal) : null;
    } catch {
      return null;
    }
  },

  // --- ADMIN ---
  async getAdminOverview(): Promise<{
    metrics: AdminMetrics;
    pendingVerifications: Creator[];
    activeDisputes: Deal[];
    recentAuditLogs: AuditLog[];
    config: PlatformConfig;
  } | null> {
    try {
      const res = await fetch(`${API_BASE}/admin/overview`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  async verifyCreator(creatorId: string, approve: boolean, reason?: string): Promise<Creator | null> {
    try {
      const res = await fetch(`${API_BASE}/admin/verify-creator`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ creatorId, approve, reason }),
      });
      const json = await res.json();
      return json.success ? (json.data as Creator) : null;
    } catch {
      return null;
    }
  },

  async arbitrateDispute(dealId: string, verdict: 'release_to_creator' | 'refund_to_brand', notes?: string): Promise<Deal | null> {
    try {
      const res = await fetch(`${API_BASE}/admin/arbitrate-dispute`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ dealId, verdict, notes }),
      });
      const json = await res.json();
      return json.success ? (json.data as Deal) : null;
    } catch {
      return null;
    }
  },

  async updatePlatformConfig(updates: Partial<PlatformConfig>): Promise<PlatformConfig | null> {
    try {
      const res = await fetch(`${API_BASE}/admin/config`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      return json.success ? (json.data as PlatformConfig) : null;
    } catch {
      return null;
    }
  },

  // --- AI ENGINE ---
  async runAiMatch(prompt: string, budget?: number) {
    try {
      const res = await fetch(`${API_BASE}/ai/match`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ prompt, budget }),
      });
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }
};
