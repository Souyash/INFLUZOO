import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  Sparkles, 
  DollarSign, 
  Calendar,
  MessageSquare,
  Play
} from 'lucide-react';
import { Deal, DealStage } from '../../types';
import { Badge } from '../common/Badge';

export const DealPipeline: React.FC = () => {
  const { deals, depositEscrow, approveDraftAndReleaseEscrow, requestRevision } = useApp();
  const [revisionFeedback, setRevisionFeedback] = useState<{ [key: string]: string }>({});

  const totalLocked = deals
    .filter(d => d.escrowStatus === 'escrow_locked' || d.escrowStatus === 'draft_submitted')
    .reduce((acc, d) => acc + d.amount, 0);

  const totalReleased = deals
    .filter(d => d.escrowStatus === 'released')
    .reduce((acc, d) => acc + d.amount, 0);

  const stages: { key: DealStage; label: string; count: number; color: 'blue' | 'amber' | 'purple' | 'emerald' }[] = [
    { 
      key: 'offer_sent', 
      label: 'Offer Sent (Deposit Required)', 
      count: deals.filter(d => d.stage === 'offer_sent').length,
      color: 'blue'
    },
    { 
      key: 'accepted', 
      label: 'Escrow Locked (In Production)', 
      count: deals.filter(d => d.stage === 'accepted').length,
      color: 'purple'
    },
    { 
      key: 'draft_review', 
      label: 'Draft Content in Review', 
      count: deals.filter(d => d.stage === 'draft_review').length,
      color: 'amber'
    },
    { 
      key: 'completed', 
      label: 'Completed & Escrow Released', 
      count: deals.filter(d => d.stage === 'completed' || d.stage === 'live_verified').length,
      color: 'emerald'
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Metrics Ticker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#12131c] border border-slate-800">
          <span className="text-xs text-slate-400 block">Total Active Deals</span>
          <p className="text-xl font-extrabold text-white mt-1">{deals.length} deals</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#12131c] border border-slate-800">
          <span className="text-xs text-slate-400 block">Locked in Escrow</span>
          <p className="text-xl font-extrabold text-violet-400 mt-1">${totalLocked.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#12131c] border border-slate-800">
          <span className="text-xs text-slate-400 block">Completed Payouts</span>
          <p className="text-xl font-extrabold text-emerald-400 mt-1">${totalReleased.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#12131c] border border-slate-800">
          <span className="text-xs text-slate-400 block">Escrow Security</span>
          <p className="text-xl font-extrabold text-teal-400 mt-1">100% Protected</p>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {stages.map((stage) => {
          const stageDeals = deals.filter(d => {
            if (stage.key === 'completed') return d.stage === 'completed' || d.stage === 'live_verified';
            return d.stage === stage.key;
          });

          return (
            <div
              key={stage.key}
              className="p-3.5 rounded-2xl bg-[#10111a] border border-slate-800/90 flex flex-col gap-3 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    stage.color === 'blue' ? 'bg-blue-400' :
                    stage.color === 'purple' ? 'bg-violet-400' :
                    stage.color === 'amber' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  <h3 className="text-xs font-bold text-slate-200">{stage.label}</h3>
                </div>
                <Badge variant={stage.color} size="sm">{stageDeals.length}</Badge>
              </div>

              {/* Deal Cards in Column */}
              <div className="space-y-3">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-violet-500/40 transition shadow-lg space-y-3"
                  >
                    {/* Top Creator Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={deal.creatorAvatar}
                          alt={deal.creatorName}
                          className="w-8 h-8 rounded-full object-cover border border-violet-500/40"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{deal.creatorName}</h4>
                          <span className="text-[10px] text-slate-400">{deal.creatorHandle}</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-400">
                        ${deal.amount.toLocaleString()}
                      </span>
                    </div>

                    {/* Deliverable info */}
                    <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300">
                      <span className="font-semibold text-slate-200 block mb-0.5">{deal.packageTitle}</span>
                      <span className="text-slate-400 text-[10px]">Campaign: {deal.campaignTitle}</span>
                    </div>

                    {/* Context Specific Actions per Stage */}
                    {stage.key === 'offer_sent' && (
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <button
                          onClick={() => depositEscrow(deal.id)}
                          className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md transition"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Deposit & Lock ${deal.amount.toLocaleString()}</span>
                        </button>
                      </div>
                    )}

                    {stage.key === 'accepted' && (
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-violet-400 font-medium">
                          <Lock className="w-3 h-3" />
                          Escrow Locked
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          Due {deal.deadline}
                        </span>
                      </div>
                    )}

                    {stage.key === 'draft_review' && (
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        {deal.draftMediaUrl && (
                          <a
                            href={deal.draftMediaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center justify-between transition"
                          >
                            <span className="flex items-center gap-1.5">
                              <Play className="w-3 h-3 text-amber-400" />
                              <span>Preview Video Draft</span>
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        )}

                        <p className="text-[10px] text-slate-300 italic bg-slate-950 p-2 rounded border border-slate-800">
                          "{deal.draftNotes || 'Draft uploaded for review.'}"
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => approveDraftAndReleaseEscrow(deal.id)}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition shadow-md shadow-emerald-900/20"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Release</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {stage.key === 'completed' && (
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Paid & Verified
                        </span>
                        {deal.livePostUrl && (
                          <a
                            href={deal.livePostUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-violet-400 hover:underline flex items-center gap-0.5"
                          >
                            View Post <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    )}

                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-10 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl p-4">
                    No deals in this stage
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
