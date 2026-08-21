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
  const deal = db.getDealById(dealId);
  if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });

  const config = db.getConfig();
  const grossAmount = deal.amount;
  const platformFee = Math.round(grossAmount * (config.platformTakeRatePercent / 100));
  const netAmount = grossAmount - platformFee;

  const updated = db.updateDeal(dealId, {
    escrowStatus: 'escrow_locked',
    stage: 'accepted',
  });

  // Record transaction in SQLite ledger
  const tx = db.createTransaction({
    dealId,
    type: 'deposit',
    amount: grossAmount,
    platformFee,
    netAmount,
    currency: 'USD',
    paymentMethod: 'stripe_card',
    status: 'succeeded',
    payerName: deal.brandName,
    recipientName: `${deal.creatorName} (Smart Escrow Vault)`,
  });

  db.addAuditLog('ESCROW_MANUAL_DEPOSIT', 'escrow', dealId, `Brand deposited $${updated!.amount.toLocaleString()} into Escrow for ${updated!.creatorName}.`, updated!.brandName);

  res.json({ success: true, message: 'Escrow locked successfully.', data: { deal: updated, transaction: tx } });
});

// POST /api/escrow/release (Auto-Release to Creator Wallet)
escrowRouter.post('/release', (req: Request, res: Response) => {
  const { dealId } = req.body;
  const deal = db.getDealById(dealId);
  if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });

  const config = db.getConfig();
  const grossAmount = deal.amount;
  const platformFee = Math.round(grossAmount * (config.platformTakeRatePercent / 100));
  const netAmount = grossAmount - platformFee;

  const updated = db.updateDeal(dealId, {
    escrowStatus: 'released',
    stage: 'completed',
    completedAt: new Date().toISOString().split('T')[0],
  });

  // Record release entry in SQLite transaction ledger
  const tx = db.createTransaction({
    dealId,
    type: 'release',
    amount: grossAmount,
    platformFee,
    netAmount,
    currency: 'USD',
    paymentMethod: 'escrow_wallet',
    status: 'succeeded',
    payerName: `${deal.brandName} (Escrow Custody)`,
    recipientName: deal.creatorName,
  });

  db.addAuditLog(
    'ESCROW_RELEASED',
    'escrow',
    dealId,
    `Brand approved deliverables. $${grossAmount.toLocaleString()} released from Escrow: $${netAmount.toLocaleString()} credited to ${deal.creatorName}'s Wallet, $${platformFee.toLocaleString()} retained as Platform Revenue.`,
    deal.brandName
  );

  console.log(`[ESCROW] Released Deal #${dealId}: Gross $${grossAmount} | Net Creator: $${netAmount} | Fee: $${platformFee}`);

  res.json({
    success: true,
    message: `Escrow released! $${netAmount.toLocaleString()} credited to creator wallet.`,
    data: {
      deal: updated,
      transaction: tx,
    }
  });
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
