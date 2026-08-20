import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Server,
  Activity,
  Percent
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const AdminDashboard: React.FC = () => {
  const { 
    creators, 
    deals, 
    campaigns, 
    platformConfig, 
    setAdminTab,
    auditLogs
  } = useApp();

  const totalLocked = deals
    .filter(d => d.escrowStatus === 'escrow_locked' || d.escrowStatus === 'draft_submitted')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalReleased = deals
    .filter(d => d.escrowStatus === 'released')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalDisputed = deals
    .filter(d => d.escrowStatus === 'disputed')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalVolume = totalLocked + totalReleased + totalDisputed;
  const platformRevenue = Math.round(totalReleased * (platformConfig.platformTakeRatePercent / 100));

  const pendingVerifications = creators.filter(c => !c.verified || c.verificationStatus === 'pending');
  const disputedDeals = deals.filter(d => d.escrowStatus === 'disputed');

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-purple-950/30 to-[#12131c] border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Super Admin Operational Control Center</h2>
              <Badge variant="rose">Root Access</Badge>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Escrow custody management, KYC verifications, dispute arbitrator, and platform take-rate controls.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Backend Server Active (Port 5001)</span>
          </div>
        </div>
      </div>

      {/* Main Financial & Operational KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#12131c] border border-slate-800 space-y-1 shadow-xl">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Escrow In Custody</span>
            <Lock className="w-4 h-4 text-violet-400" />
          </span>
          <p className="text-2xl font-black text-white">${totalLocked.toLocaleString()}</p>
          <span className="text-[11px] text-violet-400 font-medium">Secured in smart milestone custody</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#12131c] border border-slate-800 space-y-1 shadow-xl">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>Platform Take-Rate Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </span>
          <p className="text-2xl font-black text-emerald-400">${platformRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-500 font-semibold">
            {platformConfig.platformTakeRatePercent}% take-rate cut
          </span>
        </div>

        <div 
          onClick={() => setAdminTab('verifications')}
          className="p-5 rounded-2xl bg-[#12131c] border border-slate-800 hover:border-amber-500/40 transition cursor-pointer space-y-1 shadow-xl"
        >
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>Pending Creator Verifications</span>
            <Users className="w-4 h-4 text-amber-400" />
          </span>
          <p className="text-2xl font-black text-amber-400">{pendingVerifications.length}</p>
          <span className="text-[11px] text-amber-400 flex items-center gap-1">
            <ArrowRight className="w-3 h-3" /> Review KYC applications
          </span>
        </div>

        <div 
          onClick={() => setAdminTab('disputes')}
          className="p-5 rounded-2xl bg-[#12131c] border border-slate-800 hover:border-rose-500/40 transition cursor-pointer space-y-1 shadow-xl"
        >
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>Open Escrow Disputes</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </span>
          <p className="text-2xl font-black text-rose-400">{disputedDeals.length}</p>
          <span className="text-[11px] text-rose-400 flex items-center gap-1">
            <ArrowRight className="w-3 h-3" /> ${totalDisputed.toLocaleString()} under dispute
          </span>
        </div>

      </div>

      {/* Control Actions & Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Verification Card */}
        <div className="p-5 rounded-2xl bg-[#12131c] border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-400" />
                Creator Verification Queue
              </h3>
              <Badge variant="amber">{pendingVerifications.length} Pending</Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify creator identity, inspect AI follower authenticity metrics, and grant verified blue badges.
            </p>
          </div>

          <button
            onClick={() => setAdminTab('verifications')}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-violet-600 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 hover:border-violet-500 transition flex items-center justify-center gap-2"
          >
            <span>Open Verification Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dispute Arbitrator Card */}
        <div className="p-5 rounded-2xl bg-[#12131c] border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Escrow Dispute Arbitrator
              </h3>
              <Badge variant="rose">{disputedDeals.length} Active</Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Super Admin override powers: Force release funds to creator or issue full refunds back to brand.
            </p>
          </div>

          <button
            onClick={() => setAdminTab('disputes')}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 hover:border-rose-500 transition flex items-center justify-center gap-2"
          >
            <span>Launch Arbitrator Tool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Platform Settings Card */}
        <div className="p-5 rounded-2xl bg-[#12131c] border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-400" />
                Take-Rate & System Config
              </h3>
              <Badge variant="emerald">{platformConfig.platformTakeRatePercent}% Fee</Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adjust marketplace commissions, minimum escrow limits, and AI inference configurations dynamically.
            </p>
          </div>

          <button
            onClick={() => setAdminTab('settings')}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 hover:border-emerald-500 transition flex items-center justify-center gap-2"
          >
            <span>Edit Platform Settings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Recent System Activity Stream */}
      <div className="p-5 rounded-2xl bg-[#12131c] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-violet-400" />
            Live System Audit Stream
          </h3>
          <button
            onClick={() => setAdminTab('audit')}
            className="text-xs text-violet-400 hover:underline font-semibold"
          >
            View All Logs
          </button>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 4).map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <span className="font-bold text-white mr-2">[{log.action}]</span>
                <span className="text-slate-300">{log.details}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono shrink-0">
                {log.timestamp} • {log.actor}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
