import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Inbox, 
  Lock, 
  CheckCircle2, 
  Send, 
  ExternalLink, 
  FileText, 
  Play, 
  Clock, 
  AlertCircle, 
  Sparkles,
  Check
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Deal } from '../../types';

export const DealsInbox: React.FC = () => {
  const { deals, currentCreator, submitDraft, submitLivePostUrl } = useApp();

  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  const [draftMediaUrl, setDraftMediaUrl] = useState('');
  const [draftNotes, setDraftNotes] = useState('');
  const [livePostUrl, setLivePostUrl] = useState('');

  const creatorDeals = deals.filter(
    d => d.creatorId === currentCreator.id || d.creatorHandle === currentCreator.handle
  );

  const handleDraftSubmit = (dealId: string) => {
    if (!draftMediaUrl.trim()) return;
    submitDraft(dealId, draftNotes || 'Draft video uploaded for review.', draftMediaUrl);
    setActiveDealId(null);
    setDraftMediaUrl('');
    setDraftNotes('');
  };

  const handleLivePostSubmit = (dealId: string) => {
    if (!livePostUrl.trim()) return;
    submitLivePostUrl(dealId, livePostUrl);
    setActiveDealId(null);
    setLivePostUrl('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Deals & Inbound Opportunities Inbox
            <Badge variant="purple">{creatorDeals.length} Total Collabs</Badge>
          </h2>
          <p className="text-xs text-slate-400">
            Accept proposals, upload draft deliverables, and trigger automated escrow releases.
          </p>
        </div>
      </div>

      {/* Deals List */}
      <div className="space-y-4">
        {creatorDeals.map((deal) => {
          const isDraftOpen = activeDealId === `draft-${deal.id}`;
          const isLiveOpen = activeDealId === `live-${deal.id}`;

          return (
            <div
              key={deal.id}
              className="p-5 rounded-2xl bg-[#12131c] border border-slate-800 space-y-4 shadow-xl"
            >
              {/* Top Deal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <img
                    src={deal.brandLogo}
                    alt={deal.brandName}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{deal.brandName}</h3>
                      <Badge 
                        variant={
                          deal.stage === 'completed' ? 'emerald' :
                          deal.stage === 'draft_review' ? 'amber' : 'purple'
                        }
                        size="sm"
                      >
                        {deal.stage === 'completed' ? 'Escrow Released 🎉' :
                         deal.stage === 'draft_review' ? 'In Brand Review' : 'Active Collab'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{deal.campaignTitle} • Due {deal.deadline}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-lg font-black text-emerald-400">${deal.amount.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block flex items-center sm:justify-end gap-1">
                    <Lock className="w-3 h-3 text-violet-400" />
                    {deal.escrowStatus === 'released' ? 'Paid to Balance' : '100% Escrow Secured'}
                  </span>
                </div>
              </div>

              {/* Package Details & Deliverables Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Deliverables Package: {deal.packageTitle}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Brand Brief Notes:</p>
                  <p className="text-slate-300 italic">"{deal.briefNotes}"</p>
                </div>
              </div>

              {/* Action Buttons Area */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                
                <div className="flex items-center gap-2">
                  {deal.stage === 'accepted' && (
                    <button
                      onClick={() => setActiveDealId(isDraftOpen ? null : `draft-${deal.id}`)}
                      className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 transition flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isDraftOpen ? 'Cancel' : 'Submit Video Draft for Review'}</span>
                    </button>
                  )}

                  {deal.stage === 'draft_review' && (
                    <div className="text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Brand is currently reviewing your draft submission.</span>
                    </div>
                  )}

                  {(deal.stage === 'draft_review' || deal.stage === 'accepted') && (
                    <button
                      onClick={() => setActiveDealId(isLiveOpen ? null : `live-${deal.id}`)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isLiveOpen ? 'Cancel' : 'Submit Live Post Link'}</span>
                    </button>
                  )}

                  {deal.stage === 'completed' && (
                    <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Deal Completed. Payout released to your available balance!</span>
                    </div>
                  )}
                </div>

                {deal.draftMediaUrl && (
                  <a
                    href={deal.draftMediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                  >
                    <span>View Submitted Draft</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Interactive Draft Submission Dropdown */}
              {isDraftOpen && (
                <div className="p-4 rounded-xl bg-slate-900 border border-violet-500/40 space-y-3 animate-in fade-in">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Submit Content Draft for Brand Approval
                  </h4>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Loom / Google Drive / Frame.io Preview Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://loom.com/share/your-video-draft-v1"
                      value={draftMediaUrl}
                      onChange={(e) => setDraftMediaUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Notes for the Brand Team (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mid-roll starts at 02:40, included the custom motion graphic as requested."
                      value={draftNotes}
                      onChange={(e) => setDraftNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <button
                    onClick={() => handleDraftSubmit(deal.id)}
                    disabled={!draftMediaUrl.trim()}
                    className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs disabled:opacity-50 transition"
                  >
                    Send Draft to Brand
                  </button>
                </div>
              )}

              {/* Interactive Live URL Submission */}
              {isLiveOpen && (
                <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-3 animate-in fade-in">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Submit Live Published URL
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Once verified, Influzo's smart contract will immediately release the ${deal.amount.toLocaleString()} escrow to your wallet!
                  </p>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Live Instagram / TikTok / YouTube URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/p/your-live-reel"
                      value={livePostUrl}
                      onChange={(e) => setLivePostUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    onClick={() => handleLivePostSubmit(deal.id)}
                    disabled={!livePostUrl.trim()}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs disabled:opacity-50 transition"
                  >
                    Verify & Release Escrow Funds 🚀
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
