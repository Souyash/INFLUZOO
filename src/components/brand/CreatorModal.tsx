import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Clock, 
  Repeat, 
  Send, 
  Lock, 
  Play, 
  BarChart2, 
  Package, 
  FileText
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const CreatorModal: React.FC = () => {
  const { selectedCreator, setSelectedCreator, sendDealOffer, setPerspective, setBrandTab } = useApp();
  const [modalTab, setModalTab] = useState<'packages' | 'audience' | 'portfolio'>('packages');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [briefNotes, setBriefNotes] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedCreator) return null;

  const currentPkg = selectedCreator.packages.find(p => p.id === (selectedPackageId || selectedCreator.packages[0]?.id)) || selectedCreator.packages[0];

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      sendDealOffer(
        selectedCreator,
        currentPkg.id,
        briefNotes || `Hi ${selectedCreator.name}, we would love to collaborate on our upcoming product launch. Standard deliverables and usage rights apply.`,
        customPrice
      );
      setIsSubmitting(false);
      setPerspective('brand');
      setBrandTab('pipeline');
    }, 600);
  };

  const ageData = selectedCreator.audienceDemographics.ageGroups;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-700 bg-[#0f1019] shadow-2xl text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedCreator(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Image & Header Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-800">
          <img
            src={selectedCreator.coverImage}
            alt={selectedCreator.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1019] via-transparent to-black/30" />
        </div>

        {/* Profile Card Summary Header */}
        <div className="px-6 sm:px-8 pb-4 relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            
            <div className="flex items-end gap-4">
              <img
                src={selectedCreator.avatar}
                alt={selectedCreator.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-[#0f1019] shadow-2xl shadow-black/50"
              />
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">{selectedCreator.name}</h2>
                  {selectedCreator.verified && <CheckCircle2 className="w-5 h-5 text-violet-400" />}
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-mono">{selectedCreator.handle}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedCreator.location}</span>
                  <span>•</span>
                  <div className="flex items-center text-amber-400 font-semibold gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{selectedCreator.rating} ({selectedCreator.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Escrow guarantee pill */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Influzo Escrow Verified</span>
            </div>

          </div>

          {/* Niches and quick metrics */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {selectedCreator.niches.map((n) => (
              <Badge key={n} variant="purple" size="md">
                {n}
              </Badge>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed max-w-3xl">
            {selectedCreator.bio}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <div className="p-2">
              <span className="text-[11px] text-slate-400 block font-medium">Followers</span>
              <span className="text-base font-extrabold text-white">{(selectedCreator.followersCount / 1000).toFixed(0)}k</span>
            </div>
            <div className="p-2 border-l border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Engagement Rate</span>
              <span className="text-base font-extrabold text-emerald-400">{selectedCreator.avgEngagementRate}%</span>
            </div>
            <div className="p-2 border-l border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Completed Collabs</span>
              <span className="text-base font-extrabold text-violet-300">{selectedCreator.stats.completedCollabs}</span>
            </div>
            <div className="p-2 border-l border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">On-Time Delivery</span>
              <span className="text-base font-extrabold text-teal-300">{selectedCreator.stats.onTimeRate}%</span>
            </div>
          </div>

          {/* Sub-tabs inside Modal */}
          <div className="flex items-center gap-2 border-b border-slate-800 mt-6 pb-2 text-xs font-semibold">
            <button
              onClick={() => setModalTab('packages')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                modalTab === 'packages'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              <Package className="w-4 h-4" />
              Standard Packages & Book Deal
            </button>
            <button
              onClick={() => setModalTab('audience')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                modalTab === 'audience'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Audience Demographics & Audit
            </button>
            <button
              onClick={() => setModalTab('portfolio')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                modalTab === 'portfolio'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              <Play className="w-4 h-4" />
              Sample Work & Case Studies
            </button>
          </div>

          {/* Modal Tab Content */}
          <div className="mt-6">
            {modalTab === 'packages' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                    Select a Deliverable Package
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedCreator.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                          currentPkg.id === pkg.id
                            ? 'bg-violet-950/50 border-violet-500 ring-1 ring-violet-500 shadow-xl'
                            : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          {pkg.popular && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-600 text-white px-2 py-0.5 rounded-md inline-block mb-2">
                              Most Popular
                            </span>
                          )}
                          <h5 className="text-sm font-bold text-white mb-1">{pkg.title}</h5>
                          <p className="text-xs text-slate-400 mb-3 leading-relaxed">{pkg.description}</p>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {pkg.deliverables.map((d, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-lg font-black text-emerald-400">${pkg.price.toLocaleString()}</span>
                          <span className="text-[11px] text-slate-400">{pkg.turnaroundDays} days delivery</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instant Offer Form */}
                <form onSubmit={handleSendOffer} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-violet-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        Send Collaboration Brief & Lock Escrow
                      </h4>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold">
                      Total Escrow: ${currentPkg.price.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Campaign Objective & Key Deliverable Notes
                    </label>
                    <textarea
                      rows={3}
                      value={briefNotes}
                      onChange={(e) => setBriefNotes(e.target.value)}
                      placeholder={`e.g. Hi ${selectedCreator.name}, we want to feature our product in your upcoming video. We need a 60s dedicated segment focusing on workflow speed with our trackable promo code.`}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Funds are held in secure escrow and ONLY released once you approve the live post.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Securing Escrow...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Send Offer (${currentPkg.price.toLocaleString()})
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {modalTab === 'audience' && (
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age breakdown bar chart */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
                      Audience Age Distribution
                    </h5>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ageData}>
                          <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="%" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e1b4b', borderColor: '#4338ca', borderRadius: '8px', fontSize: '12px' }} 
                          />
                          <Bar dataKey="percentage" radius={[6, 6, 0, 0]} fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Countries & Gender Split */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                        Top Geographic Markets
                      </h5>
                      <div className="space-y-2">
                        {selectedCreator.audienceDemographics.topCountries.map((c) => (
                          <div key={c.name} className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-300">
                              <span>{c.name}</span>
                              <span className="font-semibold text-white">{c.percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-violet-500 h-full rounded-full"
                                style={{ width: `${c.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Female Audience</span>
                        <span className="font-bold text-pink-400 text-sm">{selectedCreator.audienceDemographics.genderSplit.female}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Male Audience</span>
                        <span className="font-bold text-blue-400 text-sm">{selectedCreator.audienceDemographics.genderSplit.male}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Authentic Followers</span>
                        <span className="font-bold text-emerald-400 text-sm">98.8% Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {modalTab === 'portfolio' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Recent Sponsored Work & Content Proof
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedCreator.sampleWork.map((sw) => (
                    <div
                      key={sw.id}
                      className="p-3 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden space-y-2.5 group"
                    >
                      <div className="relative h-36 rounded-xl overflow-hidden bg-slate-800">
                        <img
                          src={sw.thumbnail}
                          alt={sw.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                            <Play className="w-4 h-4 fill-white" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold">
                          {sw.views}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white line-clamp-1">{sw.title}</h5>
                        {sw.brandCollab && (
                          <span className="text-[11px] text-violet-400 font-medium block mt-0.5">
                            Sponsor: {sw.brandCollab}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
