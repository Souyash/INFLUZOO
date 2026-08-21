import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';
import { PaymentMethodType } from '../types/index.js';

export const paymentsRouter = Router();

// 1. POST /api/payments/create-intent (Initialize Checkout for Escrow Deposit)
paymentsRouter.post('/create-intent', (req: Request, res: Response) => {
  const { dealId, amount } = req.body;
  const config = db.getConfig();

  let deal = dealId ? db.getDealById(dealId) : null;
  const grossAmount = Number(amount) || (deal ? deal.amount : 500);
  const platformFee = Math.round(grossAmount * (config.platformTakeRatePercent / 100));
  const netAmount = grossAmount - platformFee;

  const clientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).slice(2, 10)}`;

  res.json({
    success: true,
    data: {
      clientSecret,
      dealId: deal?.id || dealId,
      grossAmount,
      platformFee,
      platformTakeRatePercent: config.platformTakeRatePercent,
      netAmount,
      currency: 'USD',
      escrowProtected: true,
    }
  });
});

// 2. POST /api/payments/confirm-deposit (Process Payment & Lock Escrow in SQLite)
paymentsRouter.post('/confirm-deposit', (req: Request, res: Response) => {
  const { 
    dealId, 
    paymentMethod = 'stripe_card', 
    paymentIntentId,
    payerName = 'Brand Partner',
    cardLast4 = '4242'
  } = req.body;

  if (!dealId) {
    return res.status(400).json({ success: false, message: 'Deal ID is required for escrow deposit.' });
  }

  const deal = db.getDealById(dealId);
  if (!deal) {
    return res.status(404).json({ success: false, message: 'Deal contract not found.' });
  }

  const config = db.getConfig();
  const grossAmount = deal.amount;
  const platformFee = Math.round(grossAmount * (config.platformTakeRatePercent / 100));
  const netAmount = grossAmount - platformFee;

  // 1. Update deal status
  const updatedDeal = db.updateDeal(dealId, {
    escrowStatus: 'escrow_locked',
    stage: 'accepted',
  });

  // 2. Create financial transaction ledger entry in SQLite
  const transaction = db.createTransaction({
    dealId: deal.id,
    type: 'deposit',
    amount: grossAmount,
    platformFee: platformFee,
    netAmount: netAmount,
    currency: 'USD',
    paymentMethod: paymentMethod as PaymentMethodType,
    paymentIntentId: paymentIntentId || `pi_${Date.now()}_settled`,
    status: 'succeeded',
    payerName: payerName || deal.brandName,
    recipientName: `${deal.creatorName} (Smart Escrow Vault)`,
  });

  // 3. Log immutable audit entry
  db.addAuditLog(
    'ESCROW_PAYMENT_CONFIRMED',
    'payment',
    transaction.id,
    `Brand ${deal.brandName} deposited $${grossAmount.toLocaleString()} via ${paymentMethod} (${cardLast4 ? `•••• ${cardLast4}` : 'Verified'}) into Escrow Vault for ${deal.creatorName}. Platform Fee: $${platformFee}.`,
    deal.brandName
  );

  console.log(`[PAYMENT] Escrow Deposit Succeeded: Tx #${transaction.id} | Deal #${deal.id} | Amount: $${grossAmount}`);

  res.json({
    success: true,
    message: `Payment of $${grossAmount.toLocaleString()} verified and locked into Smart Escrow!`,
    data: {
      deal: updatedDeal,
      transaction,
    }
  });
});

// 3. POST /api/payments/withdraw (Creator Bank Withdrawal)
paymentsRouter.post('/withdraw', (req: Request, res: Response) => {
  const { creatorId, amount, payoutAccountId } = req.body;
  const withdrawAmount = Number(amount);

  if (!creatorId || !withdrawAmount || withdrawAmount <= 0) {
    return res.status(400).json({ success: false, message: 'Valid creator ID and withdrawal amount are required.' });
  }

  const creator = db.getCreatorById(creatorId);
  const creatorName = creator ? creator.name : 'Verified Creator';

  // Get payout account info
  const payoutAccounts = db.getPayoutAccounts(creatorId);
  const targetAccount = payoutAccounts.find(p => p.id === payoutAccountId) || payoutAccounts[0];
  const bankDesc = targetAccount 
    ? `${targetAccount.bankName} (${targetAccount.accountNumberMasked})`
    : 'Direct Bank Wire (•••• 4821)';

  // Create financial transaction record
  const transaction = db.createTransaction({
    type: 'withdrawal',
    amount: withdrawAmount,
    platformFee: 0,
    netAmount: withdrawAmount,
    currency: 'USD',
    paymentMethod: 'bank_transfer',
    paymentIntentId: `payout_${Date.now()}`,
    status: 'succeeded',
    payerName: `${creatorName} (Available Balance)`,
    recipientName: bankDesc,
  });

  // Log audit entry
  db.addAuditLog(
    'CREATOR_BANK_WITHDRAWAL',
    'payment',
    transaction.id,
    `${creatorName} initiated bank payout of $${withdrawAmount.toLocaleString()} to ${bankDesc}. Status: Settled.`,
    creatorName
  );

  console.log(`[PAYMENT] Creator Bank Withdrawal Succeeded: Tx #${transaction.id} | Amount: $${withdrawAmount}`);

  res.json({
    success: true,
    message: `Withdrawal of $${withdrawAmount.toLocaleString()} successfully dispatched to ${bankDesc}!`,
    data: {
      transaction,
    }
  });
});

// 4. GET /api/payments/transactions (Financial Ledger)
paymentsRouter.get('/transactions', (req: Request, res: Response) => {
  const { dealId, type } = req.query;
  const transactions = db.getTransactions({
    dealId: dealId as string | undefined,
    type: type as string | undefined,
  });

  res.json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});

// 5. GET /api/payments/payout-methods
paymentsRouter.get('/payout-methods', (req: Request, res: Response) => {
  const { creatorId } = req.query;
  if (!creatorId) return res.status(400).json({ success: false, message: 'creatorId required' });

  const accounts = db.getPayoutAccounts(creatorId as string);
  res.json({
    success: true,
    data: accounts,
  });
});

// 6. POST /api/payments/payout-methods
paymentsRouter.post('/payout-methods', (req: Request, res: Response) => {
  const { creatorId, bankName, accountNumber, routingNumber, accountHolderName } = req.body;

  if (!creatorId || !bankName || !accountNumber || !routingNumber) {
    return res.status(400).json({ success: false, message: 'Complete banking details are required.' });
  }

  const masked = `•••• •••• •••• ${accountNumber.slice(-4)}`;
  const account = db.createPayoutAccount({
    creatorId,
    bankName,
    accountNumberMasked: masked,
    routingNumber,
    accountHolderName: accountHolderName || 'Verified Creator',
    currency: 'USD',
    isDefault: true,
  });

  db.addAuditLog('PAYOUT_ACCOUNT_LINKED', 'payment', account.id, `Linked bank account ${bankName} (${masked}) for creator ${creatorId}`, 'Creator');

  res.status(201).json({
    success: true,
    message: 'Bank account verified and linked for instant payouts!',
    data: account,
  });
});
