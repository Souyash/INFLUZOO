import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  DollarSign, 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  ExternalLink,
  MessageSquare,
  Clock
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const EscrowArbitrator: React.FC = () => {
  const { deals, arbitrateDispute } = useApp();
  const [arbitrationNotes, setArbitrationNotes] = useState<{ [key: string]: string }>({});

  const disputedDeals = deals.filter(d => d.escrowStatus === 'disputed');
  const allEscrowDeals = deals.filter(d => d.escrowStatus !== 'pending_deposit');

  const handleArbitrate = (dealId: string, verdict: 'release_to_creator' | 'refund_to_brand') => {
    const notes = arbitrationNotes[dealId] || 'Decision reached based on deliverable compliance review.';
    arbitrateDispute(dealId, verdict, notes);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Escrow Dispute Resolution Arbitrator
            <Badge variant="rose">{disputedDeals.length} Active Disputes</Badge>
          </h2>
          <p className="text-xs text-slate-400">
            Super Admin legally binding dispute arbitration. Force release milestone funds to creators or refund brands.
          </p>
        </div>
      </div>

      {/* Disputed Deals Section */}
      <div className="space-y-4">
        {disputedDeals.length > 0 ? (
          disputedDeals.map((deal) => (
            <div
              key={deal.id}
              className="p-6 rounded-3xl bg-[#12131c] border-2 border-rose-500/40 space-y-5 shadow-2xl glow-purple"
            >
              {/* Top info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-rose-400">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">Dispute on Deal #{deal.id}</h3>
                      <Badge variant="rose">Action Required</Badge>
                    </div>
                    <p className="text-xs text-slate-400">
                      Brand: <strong className="text-white">{deal.brandName}</strong> vs Creator: <strong className="text-white">{deal.creatorName} ({deal.creatorHandle})</strong>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xl font-black text-rose-400">${deal.amount.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">Frozen in Escrow Custody</span>
                </div>
              </div>

              {/* Dispute Reason & Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Brand Claim / Dispute Reason
                  </span>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{deal.disputeReason || 'Brand filed non-compliance report on final video draft.'}"
                  </p>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    Opened at: {deal.disputeOpenedAt || '2026-08-15 11:20:00'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Contract Deliverables Scope
                  </span>
                  <p className="text-xs text-slate-300 font-semibold">{deal.packageTitle}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">"{deal.briefNotes}"</p>
                  {deal.draftMediaUrl && (
                    <a
                      href={deal.draftMediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-violet-400 hover:underline flex items-center gap-1 mt-1 font-medium"
                    >
                      <span>Inspect Submitted Evidence Draft</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Arbitrator Input & Decision Buttons */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Super Admin Verdict Notes & Findings (Recorded in immutable audit trail)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Creator fulfilled all primary brief requirements with verified video submission."
                    value={arbitrationNotes[deal.id] || ''}
                    onChange={(e) => setArbitrationNotes({ ...arbitrationNotes, [deal.id]: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Executing a verdict immediately disburses or returns locked Stripe escrow funds.</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleArbitrate(deal.id, 'refund_to_brand')}
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                      <span>Refund Brand (${deal.amount.toLocaleString()})</span>
                    </button>

                    <button
                      onClick={() => handleArbitrate(deal.id, 'release_to_creator')}
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Force Release to Creator (${deal.amount.toLocaleString()})</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-12 p-6 rounded-3xl bg-[#12131c] border border-slate-800 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-base font-bold text-white">Zero Active Escrow Disputes</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All ongoing collaborations are proceeding smoothly through milestone submissions and approvals.
            </p>
          </div>
        )}
      </div>

      {/* Escrow Custody Ledger Table */}
      <div className="p-6 rounded-3xl bg-[#12131c] border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          All Active Escrow Contracts in Custody
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Deal ID</th>
                <th className="pb-3 font-semibold">Brand Sponsor</th>
                <th className="pb-3 font-semibold">Creator Partner</th>
                <th className="pb-3 font-semibold">Escrow Status</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {allEscrowDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 font-mono text-slate-400">{deal.id}</td>
                  <td className="py-3 font-bold text-white">{deal.brandName}</td>
                  <td className="py-3 text-slate-300">{deal.creatorName} ({deal.creatorHandle})</td>
                  <td className="py-3">
                    <Badge 
                      variant={
                        deal.escrowStatus === 'released' ? 'emerald' :
                        deal.escrowStatus === 'disputed' ? 'rose' : 'purple'
                      }
                      size="sm"
                    >
                      {deal.escrowStatus}
                    </Badge>
                  </td>
                  <td className="py-3 font-black text-emerald-400">${deal.amount.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    {deal.escrowStatus === 'escrow_locked' || deal.escrowStatus === 'draft_submitted' ? (
                      <button
                        onClick={() => handleArbitrate(deal.id, 'release_to_creator')}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-violet-600 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-semibold transition"
                      >
                        Release Now
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Completed</span>
                    )}
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
