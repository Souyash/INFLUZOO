import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  Lock, 
  ArrowUpRight, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  CreditCard, 
  Building, 
  Download,
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const WalletPayout: React.FC = () => {
  const { wallet, withdrawFunds } = useApp();
  const [withdrawAmount, setWithdrawAmount] = useState<number>(wallet.available);
  const [payoutMethod, setPayoutMethod] = useState<'stripe' | 'bank'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      withdrawFunds(withdrawAmount);
      setIsProcessing(false);
      setWithdrawAmount(0);
    }, 900);
  };

  const payoutHistory = [
    { id: 'tx-1', date: 'Aug 14, 2026', title: 'Clean Energy & Hydration Bottle Drop', brand: 'AeroHydrate', amount: '$1,200', status: 'Completed', method: 'Stripe Instant' },
    { id: 'tx-2', date: 'Jul 28, 2026', title: 'Top 5 AI Tools Video Sponsorship', brand: 'Supabase', amount: '$1,800', status: 'Completed', method: 'Direct ACH' },
    { id: 'tx-3', date: 'Jul 12, 2026', title: 'Productivity App Walkthrough Review', brand: 'Notion', amount: '$2,400', status: 'Completed', method: 'Stripe Instant' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Escrow Wallet & Payout Center
            <Badge variant="emerald">Stripe Connect Active</Badge>
          </h2>
          <p className="text-xs text-slate-400">
            Guaranteed milestone payments held in secure escrow. Instant payouts with 0% Influzo withdrawal fees.
          </p>
        </div>
      </div>

      {/* Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-[#12131c] to-slate-900 border border-emerald-500/40 space-y-2 shadow-xl">
          <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Available for Instant Cash Out</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </span>
          <p className="text-3xl font-black text-emerald-400">${wallet.available.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 1-Click Instant Withdrawal
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#12131c] border border-slate-800 space-y-2 shadow-xl">
          <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Locked in Milestone Escrow</span>
            <Lock className="w-4 h-4 text-violet-400" />
          </span>
          <p className="text-3xl font-black text-violet-400">${wallet.lockedEscrow.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Unlocks upon draft/post approval</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#12131c] border border-slate-800 space-y-2 shadow-xl">
          <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Lifetime Total Earnings</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </span>
          <p className="text-3xl font-black text-white">${wallet.totalEarned.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Across 54 Brand Collabs</span>
        </div>

      </div>

      {/* Instant Payout Form */}
      <form onSubmit={handleWithdraw} className="p-6 sm:p-8 rounded-3xl bg-[#12131c] border border-slate-800 space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Instant Payout Request
            </h3>
          </div>
          <span className="text-xs text-slate-400">Fee: $0.00 (Free)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Withdrawal Amount ($)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="number"
                min={10}
                max={wallet.available}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs font-black text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setWithdrawAmount(wallet.available)}
              className="text-[11px] text-emerald-400 hover:underline mt-1 font-medium"
            >
              Withdraw Full Balance (${wallet.available.toLocaleString()})
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Destination Account
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPayoutMethod('stripe')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                  payoutMethod === 'stripe'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Stripe Instant Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPayoutMethod('bank')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                  payoutMethod === 'bank'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>ACH Bank Transfer</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Transfers are processed securely through Stripe Connect 256-bit encryption.</span>
          </div>

          <button
            type="submit"
            disabled={isProcessing || withdrawAmount <= 0 || withdrawAmount > wallet.available}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending Payout...
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                <span>Transfer ${withdrawAmount.toLocaleString()} to Account</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Payout History Ledger */}
      <div className="p-6 rounded-3xl bg-[#12131c] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Recent Escrow Payout History
          </h3>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-violet-400" />
            <span>Download 1099 Tax PDF</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Campaign / Brand</th>
                <th className="pb-3 font-semibold">Payout Method</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {payoutHistory.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 text-slate-400">{tx.date}</td>
                  <td className="py-3 font-bold text-white">
                    {tx.brand} <span className="text-slate-400 font-normal">({tx.title})</span>
                  </td>
                  <td className="py-3 text-slate-300">{tx.method}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px]">
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-black text-emerald-400">{tx.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
