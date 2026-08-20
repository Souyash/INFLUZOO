import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';

export const adminRouter = Router();

// GET /api/admin/overview
adminRouter.get('/overview', (_req: Request, res: Response) => {
  const metrics = db.getAdminMetrics();
  const allCreators = db.getCreators();
  const allDeals = db.getDeals();
  const auditLogs = db.getAuditLogs();
  const config = db.getConfig();

  const pendingVerifications = allCreators.filter(c => !c.verified || c.verificationStatus === 'pending');
  const activeDisputes = allDeals.filter(d => d.escrowStatus === 'disputed');

  res.json({
    success: true,
    data: {
      metrics,
      pendingVerifications,
      activeDisputes,
      recentAuditLogs: auditLogs.slice(0, 30),
      config,
    }
  });
});

// POST /api/admin/verify-creator
adminRouter.post('/verify-creator', (req: Request, res: Response) => {
  const { creatorId, approve, reason } = req.body;
  const updated = db.updateCreator(creatorId, {
    verified: approve,
    verificationStatus: approve ? 'verified' : 'rejected',
  });

  if (!updated) return res.status(404).json({ success: false, message: 'Creator not found' });

  db.addAuditLog(
    approve ? 'CREATOR_VERIFICATION_APPROVED' : 'CREATOR_VERIFICATION_REJECTED',
    'creator',
    creatorId,
    `Admin ${approve ? 'approved' : 'rejected'} verification for ${updated.name} (${updated.handle}). Reason: ${reason || 'Criteria met'}`,
    'Super Admin'
  );

  res.json({
    success: true,
    message: approve ? 'Creator verified successfully.' : 'Creator verification application rejected.',
    data: updated,
  });
});

// POST /api/admin/arbitrate-dispute
adminRouter.post('/arbitrate-dispute', (req: Request, res: Response) => {
  const { dealId, verdict, notes } = req.body;
  const isRelease = verdict === 'release_to_creator';

  const updated = db.updateDeal(dealId, {
    escrowStatus: isRelease ? 'released' : 'approved',
    stage: 'completed',
    arbitrationVerdict: isRelease ? 'creator_paid' : 'brand_refunded',
    completedAt: new Date().toISOString().split('T')[0],
  });

  if (!updated) return res.status(404).json({ success: false, message: 'Deal not found' });

  db.addAuditLog(
    'DISPUTE_ARBITRATED',
    'escrow',
    dealId,
    `Super Admin Arbitrator issued verdict: ${isRelease ? 'Force Released to Creator' : 'Full Refund to Brand'}. Notes: ${notes || 'Standard arbitration'}`,
    'Super Admin Arbitrator'
  );

  res.json({
    success: true,
    message: isRelease ? 'Dispute resolved: Funds force-released to creator.' : 'Dispute resolved: Funds refunded to brand.',
    data: updated,
  });
});

// PATCH /api/admin/config
adminRouter.patch('/config', (req: Request, res: Response) => {
  const updated = db.updateConfig(req.body);
  db.addAuditLog('CONFIG_UPDATED', 'config', 'global_settings', `Platform config updated: Take-rate ${updated.platformTakeRatePercent}%`, 'Super Admin');

  res.json({
    success: true,
    message: 'Platform configuration updated.',
    data: updated,
  });
});

// GET /api/admin/audit-logs
adminRouter.get('/audit-logs', (_req: Request, res: Response) => {
  const logs = db.getAuditLogs();
  res.json({ success: true, count: logs.length, data: logs });
});
