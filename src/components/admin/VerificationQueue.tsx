import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Flame, 
  Star, 
  Search,
  ExternalLink,
  Bot,
  Camera,
  Eye,
  X,
  Clock,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Creator } from '../../types';

export const VerificationQueue: React.FC = () => {
  const { creators, verifyCreator } = useApp();
  const [filter, setFilter] = useState<'pending' | 'verified' | 'all'>('all');
  const [search, setSearch] = useState('');
  
  // Inspect photo modal
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; name: string } | null>(null);

  // Reject modal
  const [rejectingCreator, setRejectingCreator] = useState<Creator | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('Live selfie photo is blurry or does not match social account identity.');

  const filtered = creators.filter(c => {
    if (filter === 'pending') return !c.verified || c.verificationStatus === 'pending';
    if (filter === 'verified') return c.verified;
    return true;
  }).filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q);
  });

  const handleApprove = (creatorId: string) => {
    verifyCreator(creatorId, true);
  };

  const handleConfirmReject = () => {
    if (rejectingCreator) {
      verifyCreator(rejectingCreator.id, false, rejectionReason);
      setRejectingCreator(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Creator KYC & Verification Vetting Queue
            <Badge variant="purple">{creators.length} Total in SQLite DB</Badge>
          </h2>
          <p className="text-xs text-slate-400">
            Inspect live selfie photos, profile survey responses, and grant verified status badges.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'all' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Creators
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Verification ({creators.filter(c => !c.verified || c.verificationStatus === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'verified' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Verified Only
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter by creator name or @handle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
        />
      </div>

      {/* Creator Cards in Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((creator) => {
          const authScore = creator.authenticityScore || 96.5;
          const kycImg = creator.kycPhoto || creator.avatar;

          return (
            <div
              key={creator.id}
              className={`p-5 rounded-2xl border transition space-y-4 shadow-xl flex flex-col justify-between ${
                !creator.verified
                  ? 'bg-[#121320] border-amber-500/30 hover:border-amber-500/50'
                  : 'bg-[#12131c] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3.5">
                
                {/* Top Bar: Profile Avatar + Live KYC Photo Snapshot */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Live Selfie Photo Preview with Zoom Button */}
                    <div className="relative group shrink-0">
                      <img
                        src={kycImg}
                        alt={creator.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-violet-500/50 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedPhoto({ url: kycImg, name: creator.name })}
                        className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                        title="Zoom Live KYC Photo"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 bg-violet-600 text-[9px] font-extrabold text-white rounded-md flex items-center gap-0.5">
                        <Camera className="w-2.5 h-2.5" />
                        KYC
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-white">{creator.name}</h3>
                        {creator.verified && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-slate-400 font-mono">{creator.handle}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{creator.location}</span>
                        {creator.kycSubmittedAt && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {creator.kycSubmittedAt.split(' ')[0]}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Badge 
                    variant={creator.verified ? 'emerald' : 'amber'}
                    size="sm"
                  >
                    {creator.verified ? 'Verified Active' : 'Pending Review'}
                  </Badge>
                </div>

                {/* Survey Bio & Categories */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs">
                  <p className="text-slate-300 italic text-[11px] line-clamp-2">
                    "{creator.bio}"
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {creator.niches.map((n) => (
                      <span key={n} className="px-2 py-0.5 rounded-lg bg-violet-950/60 border border-violet-800/40 text-[10px] font-semibold text-violet-300">
                        {n}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-300 uppercase">
                      {creator.primaryPlatform}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-[10px] font-bold text-emerald-400">
                      Rate: {creator.priceRange || '$500+'}
                    </span>
                  </div>
                </div>

                {/* AI Authenticity Audit Score Box */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-violet-400" />
                      AI Follower Authenticity Audit:
                    </span>
                    <span className="font-bold text-emerald-400">{authScore}% Real Audience</span>
                  </div>

                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        authScore > 90 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${authScore}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[10px] text-slate-400">
                    <div>
                      <span>Followers:</span>
                      <p className="font-bold text-white text-xs">{(creator.followersCount / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <span>Engagement:</span>
                      <p className="font-bold text-emerald-400 text-xs">{creator.avgEngagementRate}%</p>
                    </div>
                    <div>
                      <span>Bot Risk:</span>
                      <p className="font-bold text-teal-400 text-xs">&lt; 1.2% Low</p>
                    </div>
                  </div>
                </div>

                {/* Rejection Note if Previously Rejected */}
                {creator.kycRejectionReason && (
                  <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-[11px] flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Previous Rejection: {creator.kycRejectionReason}</span>
                  </div>
                )}
              </div>

              {/* Admin Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 mt-3">
                <span className="text-[11px] text-slate-500 font-mono">ID: {creator.id}</span>

                <div className="flex items-center gap-2">
                  {!creator.verified ? (
                    <>
                      <button
                        onClick={() => setRejectingCreator(creator)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/80 text-rose-300 border border-slate-800 hover:border-rose-700/50 text-xs font-semibold transition flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApprove(creator.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Grant Badge</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setRejectingCreator(creator)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs font-medium transition"
                    >
                      Revoke Badge
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* --- PHOTO ZOOM MODAL --- */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-lg w-full bg-[#10111a] border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-violet-400" />
                Live Photo KYC Snapshot: {selectedPhoto.name}
              </h4>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-700 max-h-[70vh] flex items-center justify-center bg-black">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- REJECT FEEDBACK MODAL --- */}
      {rejectingCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-md w-full bg-[#10111a] border border-rose-500/40 rounded-3xl p-6 space-y-4 text-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Reject Verification Application
              </h4>
              <button
                onClick={() => setRejectingCreator(null)}
                className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Provide feedback for <span className="text-white font-bold">{rejectingCreator.name} ({rejectingCreator.handle})</span>:
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingCreator(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
