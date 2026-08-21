import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
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
  Plus,
  X,
  Clock,
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Transaction, PayoutAccount } from '../../types';

export const WalletPayout: React.FC = () => {
  const { wallet, currentCreator, withdrawFunds, showToast } = useApp();
  const [withdrawAmount, setWithdrawAmount] = useState<number>(wallet.available);
  const [payoutMethod, setPayoutMethod] = useState<'stripe' | 'bank'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Real DB state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);

  // Add Bank Modal
  const [addBankModalOpen, setAddBankModalOpen] = useState(false);
  const [newBankName, setNewBankName] = useState('JPMorgan Chase Bank');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newRoutingNumber, setNewRoutingNumber] = useState('021000021');
  const [newHolderName, setNewHolderName] = useState(currentCreator.name);

  useEffect(() => {
    setWithdrawAmount(wallet.available);
    async function loadData() {
      const txs = await api.getTransactions();
      setTransactions(txs);
      const accounts = await api.getPayoutMethods(currentCreator.id);
      setPayoutAccounts(accounts);
    }
    loadData();
  }, [wallet.available, currentCreator.id]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > wallet.available) return;

    setIsProcessing(true);
    const success = await withdrawFunds(withdrawAmount);
    setIsProcessing(false);

    if (success) {
      // Refresh transactions
      const txs = await api.getTransactions();
      setTransactions(txs);
    }
  };

  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankName || !newAccountNumber || !newRoutingNumber) {
      showToast('Please fill in all banking fields.', 'warning');
      return;
    }

    const res = await api.addPayoutMethod({
      creatorId: currentCreator.id,
      bankName: newBankName,
      accountNumber: newAccountNumber,
      routingNumber: newRoutingNumber,
      accountHolderName: newHolderName,
    });

    if (res.success && res.data) {
      setPayoutAccounts(prev => [res.data!, ...prev]);
      setAddBankModalOpen(false);
      setNewAccountNumber('');
      showToast('Bank payout account linked & verified in SQLite database!', 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Escrow Wallet & Payout Center
            <Badge variant="emerald">Live SQLite Ledger</Badge>
          </h2>
          <p className="text-xs text-slate-400">
            Guaranteed milestone payments held in secure escrow. Instant payouts with 0% Influzo withdrawal fees.
          </p>
        </div>

        <button
          onClick={() => setAddBankModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Add Bank Account</span>
        </button>
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
          <span className="text-[11px] text-slate-400">Unlocks automatically on live post approval</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#12131c] border border-slate-800 space-y-2 shadow-xl">
          <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Lifetime Total Earnings</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </span>
          <p className="text-3xl font-black text-white">${wallet.totalEarned.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Across completed brand collaborations</span>
        </div>

      </div>

      {/* Instant Payout Form */}
      <form onSubmit={handleWithdraw} className="p-6 sm:p-8 rounded-3xl bg-[#12131c] border border-slate-800 space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Instant Bank Cash Out Request
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-bold">Transfer Fee: $0.00 (Free)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Withdrawal Amount ($ USD)
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
                <span>Instant Debit Card</span>
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
                <span>Direct ACH Bank</span>
              </button>
            </div>

            {payoutAccounts.length > 0 && (
              <p className="text-[11px] text-slate-400 mt-1.5">
                Target: {payoutAccounts[0].bankName} ({payoutAccounts[0].accountNumberMasked})
              </p>
            )}
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Transfers are processed securely through 256-bit encrypted banking rails.</span>
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
            Live Financial Transaction Ledger ({transactions.length})
          </h3>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <span>SQLite WAL Store</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Tx ID</th>
                <th className="pb-3 font-semibold">Date & Time</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Method</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 font-mono text-slate-500 text-[11px]">{tx.id}</td>
                  <td className="py-3 text-slate-400">{tx.createdAt}</td>
                  <td className="py-3 font-bold text-white">
                    {tx.type === 'deposit' && `Escrow Deposit from ${tx.payerName}`}
                    {tx.type === 'release' && `Milestone Release to ${tx.recipientName}`}
                    {tx.type === 'withdrawal' && `Bank Cash Out to ${tx.recipientName}`}
                  </td>
                  <td className="py-3 text-slate-300 font-mono text-[11px] uppercase">{tx.paymentMethod}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px]">
                      {tx.status}
                    </span>
                  </td>
                  <td className={`py-3 text-right font-black ${
                    tx.type === 'withdrawal' ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {tx.type === 'withdrawal' ? `-$${tx.amount.toLocaleString()}` : `+$${tx.amount.toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD BANK ACCOUNT MODAL --- */}
      {addBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-md w-full bg-[#10111a] border border-emerald-500/40 rounded-3xl p-6 space-y-4 text-slate-100 shadow-2xl glow-emerald">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                Link Bank Account for Instant Payouts
              </h4>
              <button
                onClick={() => setAddBankModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBank} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  required
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1029384756"
                  value={newAccountNumber}
                  onChange={(e) => setNewAccountNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Routing / IFSC
                  </label>
                  <input
                    type="text"
                    required
                    value={newRoutingNumber}
                    onChange={(e) => setNewRoutingNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Account Holder
                  </label>
                  <input
                    type="text"
                    required
                    value={newHolderName}
                    onChange={(e) => setNewHolderName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAddBankModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save & Verify Bank</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
