import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Activity, 
  Search, 
  ShieldCheck, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  Layers
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { AuditLog } from '../../types';

export const AuditLogs: React.FC = () => {
  const { auditLogs, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    if (typeFilter !== 'all' && log.entityType !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        log.entityId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExport = () => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `influzo_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported audit ledger JSON! 📁', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Immutable Audit Trail & Compliance Log
            <Badge variant="purple">{auditLogs.length} Events Logged</Badge>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time compliance ledger tracking every escrow deposit, smart payout, dispute arbitration, and admin override.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-violet-400" />
          <span>Export Compliance Audit (JSON)</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by action, actor, deal ID, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
        >
          <option value="all">All Entity Types</option>
          <option value="escrow">Escrow Transactions</option>
          <option value="creator">Creator KYC & Profiles</option>
          <option value="deal">Deals & Milestones</option>
          <option value="campaign">Campaigns</option>
          <option value="config">System Config</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="p-6 rounded-3xl bg-[#12131c] border border-slate-800 space-y-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold">Action Event</th>
                <th className="pb-3 font-semibold">Entity Type</th>
                <th className="pb-3 font-semibold">Actor / Origin</th>
                <th className="pb-3 font-semibold">Event Description & Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-3.5 font-mono text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3.5 font-bold text-white whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-violet-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <Badge 
                      variant={
                        log.entityType === 'escrow' ? 'emerald' :
                        log.entityType === 'creator' ? 'purple' :
                        log.entityType === 'deal' ? 'amber' : 'slate'
                      }
                      size="sm"
                    >
                      {log.entityType}
                    </Badge>
                  </td>
                  <td className="py-3.5 text-slate-300 font-semibold whitespace-nowrap">{log.actor}</td>
                  <td className="py-3.5 text-slate-300 leading-relaxed max-w-md">
                    {log.details}
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
