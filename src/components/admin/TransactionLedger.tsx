import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  DollarSign, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Building2, 
  ShieldCheck, 
  Download,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Transaction } from '../../types';

export const TransactionLedger: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTxs() {
      setIsLoading(true);
      const data = await api.getTransactions();
      setTransactions(data);
      setIsLoading(false);
    }
    fetchTxs();
  }, []);

  const filtered = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.payerName.toLowerCase().includes(q) ||
      t.recipientName.toLowerCase().includes(q) ||
      (t.dealId && t.dealId.toLowerCase().includes(q))
    );
  });

  const totalGross = transactions.reduce((acc, t) => acc + (t.type === 'deposit' ? t.amount : 0), 0);
  const totalFees = transactions.reduce((acc, t) => acc + t.platformFee, 0);
  const totalWithdrawn = transactions.reduce((acc, t) => acc + (t.type === 'withdrawal' ? t.amount : 0), 0);

  const handleExportCSV = () => {
    const headers = 'Transaction ID,Type,Amount,Platform Fee,Net Amount,Method,Status,Payer,Recipient,Timestamp\n';
    const rows = filtered.map(t => 
      `"${t.id}","${t.type}",${t.amount},${t.platformFee},${t.netAmount},"${t.paymentMethod}","${t.status}","${t.payerName}","${t.recipientName}","${t.createdAt}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Influzo_Master_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Master Financial & Escrow Ledger
            <Badge variant="emerald">Live SQLite Engine</Badge>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time double-entry ledger tracking all brand deposits, escrow locks, platform fees, and creator payouts.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-violet-400" />
          <span>Export Ledger (CSV)</span>
        </button>
      </div>

      {/* Financial Summary Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#12131c] border border-slate-800 space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 font-medium">Total Gross Inflow (Deposits)</span>
          <p className="text-2xl font-black text-emerald-400">${totalGross.toLocaleString()}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#12131c] border border-slate-800 space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 font-medium">Platform Fee Revenue (Retained)</span>
          <p className="text-2xl font-black text-violet-400">${totalFees.toLocaleString()}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#12131c] border border-slate-800 space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 font-medium">Creator Cash Out Volume</span>
          <p className="text-2xl font-black text-teal-400">${totalWithdrawn.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Tx ID, payer, recipient, or deal ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'all' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({transactions.length})
          </button>
          <button
            onClick={() => setFilterType('deposit')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'deposit' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setFilterType('release')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'release' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Releases
          </button>
          <button
            onClick={() => setFilterType('withdrawal')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'withdrawal' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cash Outs
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6 rounded-3xl bg-[#12131c] border border-slate-800 space-y-4 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Transaction ID</th>
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Payer</th>
                <th className="pb-3 font-semibold">Recipient</th>
                <th className="pb-3 font-semibold">Platform Fee</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Gross Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 font-mono text-slate-400 text-[11px]">{tx.id}</td>
                  <td className="py-3.5 text-slate-400">{tx.createdAt}</td>
                  <td className="py-3.5">
                    <Badge 
                      variant={
                        tx.type === 'deposit' ? 'emerald' : tx.type === 'release' ? 'purple' : 'amber'
                      }
                      size="sm"
                    >
                      {tx.type.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3.5 font-semibold text-white">{tx.payerName}</td>
                  <td className="py-3.5 text-slate-300">{tx.recipientName}</td>
                  <td className="py-3.5 font-mono text-violet-400">
                    {tx.platformFee > 0 ? `+$${tx.platformFee.toLocaleString()}` : '$0'}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold text-[10px]">
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-black text-emerald-400">
                    ${tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
