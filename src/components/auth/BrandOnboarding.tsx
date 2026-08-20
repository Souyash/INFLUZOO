import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Globe, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  Target
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const BrandOnboarding: React.FC = () => {
  const { brandOnboardingOpen, setBrandOnboardingOpen, completeBrandOnboarding, currentUser } = useApp();

  const [companyName, setCompanyName] = useState(currentUser?.name || 'Acme Labs Inc.');
  const [website, setWebsite] = useState('https://acmelabs.io');
  const [monthlyBudget, setMonthlyBudget] = useState<number>(5000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!brandOnboardingOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await completeBrandOnboarding({
      companyName,
      website,
      monthlyBudget,
    });

    setIsSubmitting(false);
    setBrandOnboardingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl border border-indigo-500/40 bg-[#10111a] p-6 sm:p-8 shadow-2xl glow-purple text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">Brand / Agency Setup</h3>
                <Badge variant="blue">Organization Profile</Badge>
              </div>
              <p className="text-xs text-slate-400">Configure your company profile to launch campaigns & lock escrow.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Company / Brand Legal Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Apex Hyperwear Inc."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Official Website / Product URL
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="url"
                required
                placeholder="https://yourbrand.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Estimated Monthly Influencer Budget ($)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="number"
                min={500}
                step={250}
                required
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-extrabold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              All campaign payments are held in FDIC-insured Stripe escrow and only released upon your explicit deliverable approval.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Onboarding & Enter Brand Hub</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
