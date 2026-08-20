import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  PlusCircle, 
  Layers, 
  DollarSign, 
  Calendar, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { NicheType, PlatformType } from '../../types';
import { Badge } from '../common/Badge';

export const CampaignStudio: React.FC = () => {
  const { createCampaign, setBrandTab } = useApp();

  const [title, setTitle] = useState('Fall 2026 Brand Acceleration & UGC Push');
  const [brandName, setBrandName] = useState('Acme Growth Labs');
  const [niche, setNiche] = useState<NicheType>('Tech & AI');
  const [totalBudget, setTotalBudget] = useState<number>(6500);
  const [creatorsTargetCount, setCreatorsTargetCount] = useState<number>(4);
  const [deadline, setDeadline] = useState('2026-10-15');
  const [targetPlatforms, setTargetPlatforms] = useState<PlatformType[]>(['youtube', 'tiktok']);
  const [deliverablesSummary, setDeliverablesSummary] = useState(
    '60s Mid-Roll Integration + 2x TikTok UGC Demo videos highlighting speed & automation with custom discount tracking link.'
  );
  const [isAiPolishing, setIsAiPolishing] = useState(false);

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

  const handlePlatformToggle = (plat: PlatformType) => {
    if (targetPlatforms.includes(plat)) {
      if (targetPlatforms.length > 1) {
        setTargetPlatforms(targetPlatforms.filter(p => p !== plat));
      }
    } else {
      setTargetPlatforms([...targetPlatforms, plat]);
    }
  };

  const handleAiPolish = () => {
    setIsAiPolishing(true);
    setTimeout(() => {
      setDeliverablesSummary(
        `• 1x 60-90s Dedicated Sponsor Integration with high-converting visual B-roll.\n• 2x High-retention Vertical UGC Shorts (TikTok + IG Reels) focusing on "Problem vs Solution".\n• Pinned Comment + Link in Bio with custom 15% discount code and 30-day digital ad usage rights.`
      );
      setIsAiPolishing(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCampaign({
      title,
      brandName,
      brandLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      niche,
      status: 'active',
      totalBudget,
      creatorsTargetCount,
      deliverablesSummary,
      deadline,
      targetPlatforms,
    });
    setBrandTab('pipeline');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            AI Campaign Brief Studio
            <Badge variant="purple">Gemini Optimized</Badge>
          </h2>
          <p className="text-xs text-slate-400">
            Define deliverables, set budget milestones, and let AI structure standard contracts for your creators.
          </p>
        </div>
      </div>

      {/* Campaign Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-[#12131c] border border-slate-800 space-y-6 shadow-2xl">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Campaign Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Brand / Company Name
            </label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
            />
          </div>
        </div>

        {/* Niche & Target Platforms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Primary Category / Niche
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value as NicheType)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition cursor-pointer"
            >
              {niches.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Target Distribution Platforms
            </label>
            <div className="flex items-center gap-2 pt-1">
              {(['youtube', 'tiktok', 'instagram', 'twitter'] as PlatformType[]).map((plat) => (
                <button
                  type="button"
                  key={plat}
                  onClick={() => handlePlatformToggle(plat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                    targetPlatforms.includes(plat)
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Budget & Target Creators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Total Escrow Budget ($)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="number"
                min={200}
                step={100}
                required
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-bold transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Target Creator Count
            </label>
            <input
              type="number"
              min={1}
              max={50}
              required
              value={creatorsTargetCount}
              onChange={(e) => setCreatorsTargetCount(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-bold transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Campaign Deadline
            </label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition cursor-pointer"
            />
          </div>
        </div>

        {/* Deliverables & AI Enhancer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Deliverables & Creative Guidelines
            </label>
            <button
              type="button"
              onClick={handleAiPolish}
              disabled={isAiPolishing}
              className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1.5 bg-violet-950/40 border border-violet-500/30 px-3 py-1 rounded-lg transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiPolishing ? 'Optimizing Brief...' : 'Polish with AI'}</span>
            </button>
          </div>
          <textarea
            rows={4}
            value={deliverablesSummary}
            onChange={(e) => setDeliverablesSummary(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition leading-relaxed font-sans"
          />
        </div>

        {/* Escrow note & Action Button */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Budget is allocated to escrow on a per-creator milestone basis.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Initialize Campaign Pipeline</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
