import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  MapPin, 
  Layers, 
  Play, 
  ShieldCheck,
  Bot
} from 'lucide-react';
import { NicheType, PlatformType } from '../../types';
import { Badge } from '../common/Badge';

export const CreatorOnboarding: React.FC = () => {
  const { creatorOnboardingOpen, setCreatorOnboardingOpen, completeCreatorOnboarding, currentUser } = useApp();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState(currentUser?.name || '');
  const [handle, setHandle] = useState('@');
  const [location, setLocation] = useState('Los Angeles, CA');
  const [bio, setBio] = useState('Passionate content creator sharing authentic reviews and tutorials.');
  
  const [selectedNiches, setSelectedNiches] = useState<NicheType[]>(['Tech & AI']);
  const [primaryPlatform, setPrimaryPlatform] = useState<PlatformType>('youtube');
  
  const [followersCount, setFollowersCount] = useState<number>(85000);
  const [avgEngagementRate, setAvgEngagementRate] = useState<number>(5.8);
  const [basePrice, setBasePrice] = useState<number>(750);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!creatorOnboardingOpen) return null;

  const niches: NicheType[] = [
    'Tech & AI',
    'Beauty & Skincare',
    'Fitness & Health',
    'Gaming & Esports',
    'Lifestyle & Travel',
    'Fashion & Apparel',
    'Finance & Crypto',
    'Food & Culinary'
  ];

  const handleNicheToggle = (n: NicheType) => {
    if (selectedNiches.includes(n)) {
      if (selectedNiches.length > 1) {
        setSelectedNiches(selectedNiches.filter(x => x !== n));
      }
    } else {
      setSelectedNiches([...selectedNiches, n]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const packages = [
      {
        id: `pkg-${Date.now()}-1`,
        title: 'Dedicated Reel / Short Video',
        description: '1x High-retention vertical video with pinned comment link.',
        price: basePrice,
        deliverables: ['1x 4K Short Video', 'Link in Bio (14 Days)'],
        turnaroundDays: 4,
        popular: true
      },
      {
        id: `pkg-${Date.now()}-2`,
        title: 'Full Product Review & Multi-Story Bundle',
        description: 'In-depth integration + 3x Story frames with direct trackable link.',
        price: Math.round(basePrice * 1.8),
        deliverables: ['1x Dedicated Video', '3x Stories with Stickers', '30-Day Usage Rights'],
        turnaroundDays: 7,
      }
    ];

    await completeCreatorOnboarding({
      name: name || currentUser?.name || 'Creator',
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      location,
      bio,
      niches: selectedNiches,
      primaryPlatform,
      followersCount,
      avgEngagementRate,
      packages,
    });

    setIsSubmitting(false);
    setCreatorOnboardingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-violet-500/40 bg-[#10111a] p-6 sm:p-8 shadow-2xl glow-purple text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">Creator Profile Setup</h3>
              <Badge variant="purple">Step {step} of 3</Badge>
            </div>
            <p className="text-xs text-slate-400">Complete your verified media kit to start receiving inbound brand deals.</p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-violet-500' : 'bg-slate-800'}`} />
            <span className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-violet-500' : 'bg-slate-800'}`} />
            <span className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-violet-500' : 'bg-slate-800'}`} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          
          {/* STEP 1: Basic Identity & Bio */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Creator Name / Brand
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Primary Handle
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@alexcreates"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Location (City, Country)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Austin, TX, USA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Bio / Value Pitch for Brands
                </label>
                <textarea
                  rows={3}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 transition"
                >
                  <span>Next: Categories & Platforms</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Niches & Primary Platform */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Content Niches (Pick 1-3)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {niches.map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => handleNicheToggle(n)}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left transition ${
                        selectedNiches.includes(n)
                          ? 'bg-violet-950/70 border-violet-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Primary Social Platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['youtube', 'tiktok', 'instagram'] as PlatformType[]).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPrimaryPlatform(p)}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition ${
                        primaryPlatform === p
                          ? 'bg-violet-600 text-white shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 transition"
                >
                  <span>Next: Rates & Audience</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Rates, Audience & AI Verification */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Followers Count
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    required
                    value={followersCount}
                    onChange={(e) => setFollowersCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Avg Engagement Rate (%)
                  </label>
                  <input
                    type="number"
                    min={0.5}
                    max={30}
                    step={0.1}
                    required
                    value={avgEngagementRate}
                    onChange={(e) => setAvgEngagementRate(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Starting Post Rate ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      min={50}
                      step={50}
                      required
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-emerald-400 font-extrabold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* AI Verification Badge Preview */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-violet-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-violet-400" />
                    Automated AI Audience Authenticity Scan
                  </span>
                  <Badge variant="emerald">97.8% High Trust</Badge>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your profile will automatically be submitted to the Super Admin KYC Queue with zero upfront listing fees.
                </p>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-violet-600/30 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete & Launch Creator OS</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
