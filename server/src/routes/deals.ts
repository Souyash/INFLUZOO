import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';
import { Deal } from '../types/index.js';

export const dealsRouter = Router();

// GET /api/deals
dealsRouter.get('/', (req: Request, res: Response) => {
  const { creatorId, campaignId } = req.query;
  const deals = db.getDeals({
    creatorId: creatorId ? String(creatorId) : undefined,
    campaignId: campaignId ? String(campaignId) : undefined,
  });
  res.json({ success: true, count: deals.length, data: deals });
});

// POST /api/deals (Create offer & lock escrow)
dealsRouter.post('/', (req: Request, res: Response) => {
  const dealData = req.body;
  const newDeal: Deal = {
    id: dealData.id || `deal-${Date.now()}`,
    campaignId: dealData.campaignId || undefined,
    campaignTitle: dealData.campaignTitle || 'Direct Collaboration',
    brandName: dealData.brandName || 'Brand Partner',
    brandLogo: dealData.brandLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    creatorId: dealData.creatorId,
    creatorName: dealData.creatorName,
    creatorHandle: dealData.creatorHandle,
    creatorAvatar: dealData.creatorAvatar || '',
    platform: dealData.platform || 'youtube',
    packageTitle: dealData.packageTitle || 'Custom Package',
    amount: Number(dealData.amount) || 500,
    escrowStatus: dealData.escrowStatus || 'escrow_locked',
    stage: dealData.stage || 'accepted',
    deliverables: dealData.deliverables || ['1x Sponsored Post'],
    briefNotes: dealData.briefNotes || '',
    createdAt: dealData.createdAt || new Date().toISOString().split('T')[0],
    deadline: dealData.deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };

  const created = db.createDeal(newDeal);
  db.addAuditLog('DEAL_CREATED_ESCROW_LOCKED', 'deal', created.id, `Brand locked $${created.amount.toLocaleString()} into Escrow for ${created.creatorName}.`, created.brandName);

  res.status(201).json({
    success: true,
    message: `Deal created and $${created.amount.toLocaleString()} locked into escrow.`,
    data: created,
  });
});

// POST /api/deals/:id/draft (Submit video draft link)
dealsRouter.post('/:id/draft', (req: Request, res: Response) => {
  const { notes, mediaUrl } = req.body;
  const updated = db.updateDeal(req.params.id, {
    escrowStatus: 'draft_submitted',
    stage: 'draft_review',
    draftNotes: notes,
    draftMediaUrl: mediaUrl,
  });

  if (!updated) return res.status(404).json({ success: false, message: 'Deal not found' });

  db.addAuditLog('DRAFT_SUBMITTED', 'deal', updated.id, `Creator submitted draft content preview for deal #${updated.id}.`, updated.creatorName);

  res.json({ success: true, message: 'Draft submitted for review.', data: updated });
});

// POST /api/deals/:id/live-post (Submit live verified link)
dealsRouter.post('/:id/live-post', (req: Request, res: Response) => {
  const { livePostUrl } = req.body;
  const updated = db.updateDeal(req.params.id, {
    livePostUrl,
    stage: 'completed',
    escrowStatus: 'released',
    completedAt: new Date().toISOString().split('T')[0],
  });

  if (!updated) return res.status(404).json({ success: false, message: 'Deal not found' });

  db.addAuditLog('LIVE_POST_VERIFIED_ESCROW_RELEASED', 'deal', updated.id, `Live post verified (${livePostUrl}). $${updated.amount.toLocaleString()} released from Escrow!`, 'System Escrow Autorelease');

  res.json({ success: true, message: 'Live post verified and escrow released.', data: updated });
});
