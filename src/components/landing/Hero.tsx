import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Users, 
  Lock, 
  CheckCircle2, 
  Play,
  Star
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const Hero: React.FC = () => {
  const { setPerspective, setBrandTab, setCreatorTab, setIsAiModalOpen, creators, setSelectedCreator } = useApp();

  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-violet-600/20 via-purple-700/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Pitch */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 text-violet-300 text-xs font-semibold backdrop-blur-md glow-purple">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Introducing Influzo 2.0 • AI Creator Deal Flow & Escrow</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Book Top Creators.{' '}
            <span className="gradient-text">Lock Escrow.</span>{' '}
            Scale Authentic ROI.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate endless DMs, ghosting, and pricing guesswork. Influzo matches high-growth brands with verified creators, automates legal contracts, and secures payments with milestone escrow.
          </p>

          {/* Interactive CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                setPerspective('brand');
                setBrandTab('discovery');
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition group"
            >
              <span>Explore as Brand / Agency</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => {
                setPerspective('creator');
                setCreatorTab('mediakit');
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <Zap className="w-4 h-4 text-violet-400" />
              <span>Join as a Creator</span>
            </button>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 hover:from-emerald-900/60 hover:to-teal-900/60 text-emerald-300 border border-emerald-500/30 font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Strategist</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Escrow Payment Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-violet-400" />
              <span>Zero Fake Followers (AI Vetted)</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Automated Standard Contracts</span>
            </div>
          </div>
        </div>

        {/* Floating Interactive Live Dashboard Showcase */}
        <div className="mt-14 relative">
          <div className="rounded-2xl border border-slate-800 bg-[#12131c]/90 p-5 shadow-2xl backdrop-blur-xl">
            
            {/* Window bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 font-mono ml-2">influzo.app/live-marketplace</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs text-emerald-400 font-medium">Marketplace Live: 2,490+ Verified Creators</span>
              </div>
            </div>

            {/* Creator Cards Carousel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {creators.slice(0, 3).map((creator) => (
                <div
                  key={creator.id}
                  onClick={() => {
                    setSelectedCreator(creator);
                    setPerspective('brand');
                  }}
                  className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 hover:border-violet-500/50 transition cursor-pointer group hover:scale-[1.01]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 group-hover:border-violet-500/60 transition"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition">{creator.name}</h4>
                          <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <p className="text-xs text-slate-400">{creator.handle}</p>
                      </div>
                    </div>
                    <Badge variant="purple">{creator.niches[0]}</Badge>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-3 mb-3">
                    {creator.bio}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Followers</span>
                      <span className="text-xs font-bold text-white">{(creator.followersCount / 1000).toFixed(0)}k</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Engagement</span>
                      <span className="text-xs font-bold text-emerald-400">{creator.avgEngagementRate}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Avg Views</span>
                      <span className="text-xs font-bold text-violet-300">{(creator.avgViewsPerPost / 1000).toFixed(0)}k</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400">Starting package</span>
                      <p className="font-bold text-white">{creator.priceRange.split('-')[0]}</p>
                    </div>
                    <span className="text-violet-400 group-hover:translate-x-1 transition font-medium flex items-center gap-1">
                      View Media Kit <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Quick Stats Row */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-xs text-slate-400">Total Escrow Processed</span>
                <p className="text-lg font-extrabold text-white mt-0.5">$4.2M+</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Avg. Campaign ROAS</span>
                <p className="text-lg font-extrabold text-emerald-400 mt-0.5">4.6x</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Dispute Rate</span>
                <p className="text-lg font-extrabold text-violet-400 mt-0.5">&lt; 0.1%</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Creator On-Time Rate</span>
                <p className="text-lg font-extrabold text-teal-400 mt-0.5">99.4%</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
