import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileEdit, 
  Share2, 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Sparkles, 
  DollarSign, 
  ExternalLink,
  Package
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const MediaKitEditor: React.FC = () => {
  const { currentCreator, updateCreatorProfile, showToast } = useApp();

  const [bio, setBio] = useState(currentCreator.bio);
  const [location, setLocation] = useState(currentCreator.location);
  const [packages, setPackages] = useState(currentCreator.packages);

  const handlePriceChange = (pkgId: string, newPrice: number) => {
    setPackages(prev => prev.map(p => p.id === pkgId ? { ...p, price: newPrice } : p));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCreatorProfile({
      bio,
      location,
      packages,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(`https://influzo.app/@${currentCreator.handle.replace('@', '')}`);
    showToast('Media Kit share link copied to clipboard! 📋', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Dynamic Media Kit & Rate Card Builder
            <Badge variant="purple">Live Synced</Badge>
          </h2>
          <p className="text-xs text-slate-400">
            Customize your public media kit, adjust standardized rates, and send instant booking links to brand sponsors.
          </p>
        </div>

        <button
          onClick={handleCopyLink}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition flex items-center gap-2"
        >
          <Share2 className="w-4 h-4 text-violet-400" />
          <span>Copy Public Media Kit Link</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile Info Card */}
        <div className="p-6 rounded-3xl bg-[#12131c] border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Public Creator Bio & Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Niches</label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentCreator.niches.map(n => (
                  <Badge key={n} variant="purple">{n}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Bio / Media Kit Summary</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Rate Cards & Deliverable Packages */}
        <div className="p-6 rounded-3xl bg-[#12131c] border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Standard Sponsorship Packages & Rate Card
              </h3>
              <p className="text-[11px] text-slate-400">Brands can instant-book these with upfront escrow protection.</p>
            </div>
          </div>

          <div className="space-y-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-violet-400" />
                    <h4 className="text-xs font-bold text-white">{pkg.title}</h4>
                    {pkg.popular && <Badge variant="purple" size="sm">Popular</Badge>}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Rate:</span>
                    <div className="relative w-28">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400 absolute left-2 top-2" />
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => handlePriceChange(pkg.id, Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-6 pr-2 py-1.5 text-xs text-emerald-400 font-extrabold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400">{pkg.description}</p>

                <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-300">
                  {pkg.deliverables.map((d, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                      ✓ {d}
                    </span>
                  ))}
                  <span className="text-slate-500 px-2 py-0.5">• {pkg.turnaroundDays} days delivery</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-7 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-xl shadow-violet-600/30 flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Media Kit & Rates</span>
          </button>
        </div>

      </form>

    </div>
  );
};
