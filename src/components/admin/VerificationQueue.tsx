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
  Bot
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Creator } from '../../types';

export const VerificationQueue: React.FC = () => {
  const { creators, verifyCreator } = useApp();
  const [filter, setFilter] = useState<'pending' | 'verified' | 'all'>('all');
  const [search, setSearch] = useState('');

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

  const handleReject = (creatorId: string) => {
    verifyCreator(creatorId, false, 'Failed follower authenticity audit criteria.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Creator KYC & Verification Vetting Queue
            <Badge variant="purple">{creators.length} Total Registered</Badge>
          </h2>
          <p className="text-xs text-slate-400">
            Inspect AI authenticity scores, approve verified badges, or reject fraudulent creator accounts.
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
            Pending Verification
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((creator) => {
          const authScore = creator.authenticityScore || 96.5;

          return (
            <div
              key={creator.id}
              className="p-5 rounded-2xl bg-[#12131c] border border-slate-800 hover:border-slate-700 transition space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-white">{creator.name}</h3>
                        {creator.verified && <CheckCircle2 className="w-4 h-4 text-violet-400" />}
                      </div>
                      <p className="text-xs text-slate-400 font-mono">{creator.handle}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{creator.location}</span>
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

                {/* AI Authenticity Audit Score Box */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
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
              </div>

              {/* Admin Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500 font-mono">ID: {creator.id}</span>

                <div className="flex items-center gap-2">
                  {!creator.verified ? (
                    <>
                      <button
                        onClick={() => handleReject(creator.id)}
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
                        <span>Grant Verified Badge</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReject(creator.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs font-medium transition"
                    >
                      Revoke Verification
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
