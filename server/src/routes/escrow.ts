import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';

export const escrowRouter = Router();

// GET /api/escrow/summary
escrowRouter.get('/summary', (_req: Request, res: Response) => {
  const metrics = db.getAdminMetrics();
  res.json({
    success: true,
    data: {
      totalEscrowInCustody: metrics.totalEscrowLocked,
      totalReleased: metrics.totalEscrowReleased,
      totalDisputed: metrics.totalDisputedAmount,
      totalVolume: metrics.totalVolume,
      platformRevenue: metrics.platformRevenue,
      takeRatePercent: metrics.platformTakeRate,
    }
  });
});

// POST /api/escrow/deposit
escrowRouter.post('/deposit', (req: Request, res: Response) => {
  const { dealId } = req.body;
  const updated = db.updateDeal(dealId, {
    escrowStatus: 'escrow_locked',
    stage: 'accepted',
  });

  if (!updated) return res.status(404).json({ success: false, message: 'Deal not found' });

  db.addAuditLog('ESCROW_MANUAL_DEPOSIT', 'escrow', dealId, `Brand deposited $${updated.amount.toLocaleString()} into Escrow for ${updated.creatorName}.`, updated.brandName);

  res.json({ success: true, message: 'Escrow locked successfully.', data: updated });
});

// POST /api/escrow/release
escrowRouter.post('/release', (req: Request, res: Response) => {
  const { dealId } = req.body;
  const updated = db.updateDeal(dealId, {
    escrowStatus: 'released',
    stage: 'completed',
    completedAt: new Date().toISOString().split('T')[0],
  });

  if (!updated) return res.status(404).json({ success: false, message: 'Deal not found' });

  db.addAuditLog('ESCROW_RELEASED', 'escrow', dealId, `Brand approved deliverables. $${updated.amount.toLocaleString()} released to ${updated.creatorName}.`, updated.brandName);

  res.json({ success: true, message: 'Escrow released successfully to creator wallet.', data: updated });
});

// POST /api/escrow/dispute
escrowRouter.post('/dispute', (req: Request, res: Response) => {
  const { dealId, reason } = req.body;
  const updated = db.updateDeal(dealId, {
    escrowStatus: 'disputed',
    disputeReason: reason || 'Contract deliverable discrepancy reported.',
    disputeOpenedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  });

  if (!updated) return res.status(404).json({ success: false, message: 'Deal not found' });

  db.addAuditLog('DISPUTE_FILED', 'escrow', dealId, `Dispute opened on deal #${dealId}. Reason: ${reason}`, 'Dispute Initiator');

  res.json({ success: true, message: 'Dispute submitted to Super Admin Arbitrator.', data: updated });
});
