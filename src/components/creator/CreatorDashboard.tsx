import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  Lock, 
  TrendingUp, 
  Inbox, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Play, 
  FileEdit,
  ExternalLink,
  Flame
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const CreatorDashboard: React.FC = () => {
  const { currentCreator, wallet, deals, setCreatorTab, updateCreatorProfile } = useApp();

  const isPending = !currentCreator.verified || currentCreator.verificationStatus === 'pending';
  const isRejected = currentCreator.verificationStatus === 'rejected';

  const activeCreatorDeals = deals.filter(d => d.creatorId === currentCreator.id || d.creatorHandle === currentCreator.handle);
  const pendingActionDeals = activeCreatorDeals.filter(d => d.stage === 'accepted' || d.stage === 'offer_sent');

  return (
    <div className="space-y-6">
      
      {/* Dynamic KYC Verification Alert Banner */}
      {isPending && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200 text-xs animate-in fade-in shadow-lg shadow-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Clock className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">KYC Verification Under Review by Admin</p>
              <p className="text-amber-300/80 text-[11px] mt-0.5">
                Your live selfie photo and profile survey have been submitted. An admin is vetting your account to grant the Verified Badge.
              </p>
            </div>
          </div>
          <Badge variant="amber" size="sm">Review Pending</Badge>
        </div>
      )}

      {isRejected && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-200 text-xs animate-in fade-in shadow-lg shadow-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">KYC Verification Needs Attention</p>
              <p className="text-rose-300/80 text-[11px] mt-0.5">
                Feedback: {currentCreator.kycRejectionReason || 'Please update your media kit or submit a clearer live selfie.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCreatorTab('mediakit')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 transition"
          >
            Update Profile
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950/60 via-[#12131c] to-slate-900 border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={currentCreator.avatar}
            alt={currentCreator.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-violet-500 shadow-lg shadow-violet-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">Welcome back, {currentCreator.name}!</h2>
              <Badge variant={currentCreator.verified ? 'emerald' : 'amber'}>
                {currentCreator.verified ? 'Verified Creator Pro' : 'KYC Under Review'}
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {currentCreator.handle} • {currentCreator.niches.join(', ')} • {currentCreator.stats.completedCollabs} Completed Collabs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreatorTab('mediakit')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <FileEdit className="w-3.5 h-3.5 text-violet-400" />
            <span>Edit Media Kit</span>
          </button>

          <button
            onClick={() => setCreatorTab('wallet')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Withdraw Balance</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => setCreatorTab('wallet')}
          className="p-4 rounded-2xl bg-[#12131c] border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer space-y-1 shadow-lg"
        >
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>Available to Cash Out</span>
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
          </span>
          <p className="text-2xl font-black text-emerald-400">${wallet.available.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Ready for Instant Stripe Payout
          </span>
        </div>

        <div 
          onClick={() => setCreatorTab('inbox')}
          className="p-4 rounded-2xl bg-[#12131c] border border-slate-800 hover:border-violet-500/40 transition cursor-pointer space-y-1 shadow-lg"
        >
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>Locked in Escrow</span>
            <Lock className="w-3.5 h-3.5 text-violet-400" />
          </span>
          <p className="text-2xl font-black text-violet-400">${wallet.lockedEscrow.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Guaranteed upon draft approval</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#12131c] border border-slate-800 space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>All-Time Earnings</span>
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <p className="text-2xl font-black text-white">${wallet.totalEarned.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-400">0% Influzo Take-Rate</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#12131c] border border-slate-800 space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>Avg Engagement Rate</span>
            <Flame className="w-3.5 h-3.5 text-orange-400" />
          </span>
          <p className="text-2xl font-black text-orange-400">{currentCreator.avgEngagementRate}%</p>
          <span className="text-[11px] text-slate-400">Top 3% in {currentCreator.niches[0]}</span>
        </div>

      </div>

      {/* Active Deliverables / Needs Attention */}
      <div className="p-6 rounded-3xl bg-[#12131c] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Action Required & In-Progress Deals
              <Badge variant="amber">{pendingActionDeals.length} Pending</Badge>
            </h3>
            <p className="text-xs text-slate-400">Upload drafts or submit live links to trigger automated escrow releases.</p>
          </div>

          <button
            onClick={() => setCreatorTab('inbox')}
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1"
          >
            <span>View All in Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {activeCreatorDeals.slice(0, 3).map((deal) => (
            <div
              key={deal.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={deal.brandLogo}
                  alt={deal.brandName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{deal.brandName}</h4>
                    <Badge variant={deal.escrowStatus === 'released' ? 'emerald' : 'purple'} size="sm">
                      {deal.escrowStatus === 'released' ? 'Paid & Completed' : 'Escrow Secured'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{deal.packageTitle}</p>
                  <span className="text-[11px] text-slate-500 font-mono">Due by {deal.deadline}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-left sm:text-right">
                  <span className="text-xs font-black text-emerald-400">${deal.amount.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block">Milestone Payout</span>
                </div>

                <button
                  onClick={() => setCreatorTab('inbox')}
                  className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition flex items-center gap-1"
                >
                  <span>Manage Deliverable</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
