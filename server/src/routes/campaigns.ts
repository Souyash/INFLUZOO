import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';
import { Campaign } from '../types/index.js';

export const campaignsRouter = Router();

// GET /api/campaigns
campaignsRouter.get('/', (req: Request, res: Response) => {
  const { brandId } = req.query;
  const campaigns = db.getCampaigns(brandId ? String(brandId) : undefined);
  res.json({ success: true, count: campaigns.length, data: campaigns });
});

// POST /api/campaigns
campaignsRouter.post('/', (req: Request, res: Response) => {
  const { title, brandName, brandLogo, niche, totalBudget, creatorsTargetCount, deliverablesSummary, deadline, targetPlatforms } = req.body;

  if (!title || !totalBudget || !creatorsTargetCount) {
    return res.status(400).json({ success: false, message: 'Title, budget, and creator target are required.' });
  }

  const newCampaign: Campaign = {
    id: `camp-${Date.now()}`,
    title,
    brandName: brandName || 'Brand Partner',
    brandLogo: brandLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    niche: niche || 'Tech & AI',
    status: 'active',
    totalBudget: Number(totalBudget),
    allocatedBudget: 0,
    creatorsTargetCount: Number(creatorsTargetCount),
    creatorsHiredCount: 0,
    deliverablesSummary: deliverablesSummary || 'Sponsored post with link in bio.',
    deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    targetPlatforms: targetPlatforms && targetPlatforms.length > 0 ? targetPlatforms : ['youtube', 'tiktok'],
    metrics: { totalViews: 0, totalClicks: 0, conversions: 0, roas: 0 },
  };

  const created = db.createCampaign(newCampaign);
  db.addAuditLog('CAMPAIGN_CREATED', 'campaign', created.id, `Brand created campaign: ${created.title} ($${created.totalBudget.toLocaleString()})`, created.brandName);

  res.status(201).json({
    success: true,
    message: 'Campaign created successfully.',
    data: created,
  });
});
