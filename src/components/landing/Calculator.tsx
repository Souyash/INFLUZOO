import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calculator as CalcIcon, TrendingUp, DollarSign, Users, Eye, Sparkles, ArrowRight } from 'lucide-react';
import { NicheType } from '../../types';

export const Calculator: React.FC = () => {
  const { setPerspective, setBrandTab, setCreatorTab } = useApp();
  const [calcMode, setCalcMode] = useState<'brand' | 'creator'>('brand');

  // Brand inputs
  const [budget, setBudget] = useState<number>(3500);
  const [selectedNiche, setSelectedNiche] = useState<NicheType>('Tech & AI');

  // Creator inputs
  const [followers, setFollowers] = useState<number>(150000);
  const [postsPerMonth, setPostsPerMonth] = useState<number>(3);

  // Calculations for Brand
  const estCreatorsCount = Math.max(1, Math.round(budget / 900));
  const estImpressions = budget * 95;
  const estClicks = Math.round(estImpressions * 0.038);
  const estConversions = Math.round(estClicks * 0.052);
  const estRevenue = Math.round(budget * 4.2);

  // Calculations for Creator
  const estMonthlyRate = Math.round((followers * 0.008) * postsPerMonth * 1.3);
  const estAnnualIncome = estMonthlyRate * 12;

  const niches: NicheType[] = [
    'Tech & AI',
    'Beauty & Skincare',
    'Fitness & Health',
    'Gaming & Esports',
    'Lifestyle & Travel',
    'Finance & Crypto'
  ];

  return (
    <section className="py-20 relative border-t border-slate-800/80 bg-[#0c0d14]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CalcIcon className="w-3.5 h-3.5" />
            <span>Interactive ROI & Earnings Engine</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Calculate Your Campaign ROI or Creator Potential
          </h2>
          <p className="text-sm text-slate-400">
            Backed by real historical benchmark data across 50,000+ influencer collaborations.
          </p>

          {/* Toggle pill */}
          <div className="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold mt-3">
            <button
              onClick={() => setCalcMode('brand')}
              className={`px-4 py-2 rounded-lg transition ${
                calcMode === 'brand' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              For Brands: Campaign ROI
            </button>
            <button
              onClick={() => setCalcMode('creator')}
              className={`px-4 py-2 rounded-lg transition ${
                calcMode === 'creator' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              For Creators: Earnings Potential
            </button>
          </div>
        </div>

        {/* Calculator Card */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-[#12131c] p-6 sm:p-8 shadow-2xl">
          {calcMode === 'brand' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left sliders */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Monthly Campaign Budget
                    </label>
                    <span className="text-lg font-extrabold text-violet-400">${budget.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={25000}
                    step={250}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>$500</span>
                    <span>$10,000</span>
                    <span>$25,000+</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Primary Industry / Niche
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {niches.map((n) => (
                      <button
                        key={n}
                        onClick={() => setSelectedNiche(n)}
                        className={`p-2 rounded-xl text-xs font-medium border text-left transition ${
                          selectedNiche === n
                            ? 'bg-violet-950/60 border-violet-500 text-violet-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <span>
                    With <strong>${budget.toLocaleString()}</strong> in {selectedNiche}, you can sponsor ~<strong>{estCreatorsCount} vetted creators</strong> under automated escrow.
                  </span>
                </div>
              </div>

              {/* Right Output Box */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-violet-950/40 via-purple-950/20 to-slate-900/80 border border-violet-500/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Forecasted Performance</span>
                  <span className="text-xs font-bold text-emerald-400">4.2x Est. ROAS</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      Est. Views
                    </span>
                    <p className="text-base font-bold text-white mt-1">{(estImpressions / 1000).toFixed(0)}k</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      High-Intent Clicks
                    </span>
                    <p className="text-base font-bold text-white mt-1">{estClicks.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      Est. Conversions
                    </span>
                    <p className="text-base font-bold text-emerald-300 mt-1">{estConversions.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                      Est. Revenue Lift
                    </span>
                    <p className="text-base font-bold text-amber-300 mt-1">${estRevenue.toLocaleString()}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPerspective('brand');
                    setBrandTab('studio');
                  }}
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition"
                >
                  <span>Build Campaign with this Budget</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Creator Sliders */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Your Total Following
                    </label>
                    <span className="text-lg font-extrabold text-emerald-400">{(followers / 1000).toFixed(0)}K</span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={1000000}
                    step={5000}
                    value={followers}
                    onChange={(e) => setFollowers(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>5K (Nano)</span>
                    <span>250K (Micro)</span>
                    <span>1M+ (Macro)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Sponsored Posts / Month
                    </label>
                    <span className="text-lg font-extrabold text-white">{postsPerMonth} collabs</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={postsPerMonth}
                    onChange={(e) => setPostsPerMonth(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
                  <DollarSign className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Influzo handles contract execution, invoice generation & 100% upfront escrow locking before you even create the draft.
                  </span>
                </div>
              </div>

              {/* Creator Output Box */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-teal-950/20 to-slate-900/80 border border-emerald-500/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Estimated Creator Earnings</span>
                  <span className="text-xs font-bold text-emerald-400">0% Commission Fee</span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Est. Monthly Earnings</span>
                      <span className="text-2xl font-black text-emerald-300 mt-1">${estMonthlyRate.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg font-medium">/ month</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Est. Annual Run-Rate</span>
                      <span className="text-xl font-black text-white mt-1">${estAnnualIncome.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg font-medium">Guaranteed Escrow</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPerspective('creator');
                    setCreatorTab('mediakit');
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
                >
                  <span>Claim Your Media Kit & Rate Card</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
};
