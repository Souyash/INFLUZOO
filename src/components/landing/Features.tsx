import React from 'react';
import { 
  Bot, 
  ShieldCheck, 
  Layers, 
  BarChart3, 
  Lock, 
  FileCheck2, 
  Coins, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Bot className="w-6 h-6 text-violet-400" />,
      title: "AI Creator Discovery & Vetting",
      description: "Filter through verified creator profiles by engagement rate, audience demographics, and past conversion history. AI automatically flags bot followers.",
      tag: "Gemini 2.0 AI"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "Milestone-Locked Escrow",
      description: "Brands lock campaign funds upfront. Creators work with 100% confidence knowing payment is secured. Funds release automatically upon approved deliverables.",
      tag: "100% Guaranteed"
    },
    {
      icon: <FileCheck2 className="w-6 h-6 text-blue-400" />,
      title: "Standardized Briefs & Contracts",
      description: "Say goodbye to vague DM negotiations. Pick standardized packages (1 Reel + Story, YouTube Sponsor) with pre-built usage rights and timelines.",
      tag: "Zero Legal Overhead"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-amber-400" />,
      title: "Real-Time ROAS & Attribution",
      description: "Track live impressions, engagement, trackable UTM click-throughs, and Shopify conversion rates directly inside your brand campaign dashboard.",
      tag: "Full Visibility"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/50 border border-violet-500/30 text-violet-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built For Modern Creators & Scaled Brands</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Everything You Need to Scale Influencer Partnerships
          </h2>
          <p className="text-sm text-slate-400">
            From first outreach to final tax-ready payout, Influzo replaces 5 separate tools in one unified deal OS.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#12131c] border border-slate-800 hover:border-violet-500/40 transition group hover:shadow-xl hover:shadow-violet-900/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center group-hover:scale-110 transition">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-slate-400 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                <span>Enterprise grade security</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
