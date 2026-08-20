import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  SlidersHorizontal, 
  Users, 
  Eye, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Flame
} from 'lucide-react';
import { NicheType, PlatformType, Creator } from '../../types';
import { Badge } from '../common/Badge';

export const CreatorDiscovery: React.FC = () => {
  const { creators, setSelectedCreator, setIsAiModalOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [minEngagement, setMinEngagement] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'followers' | 'engagement' | 'rating'>('engagement');

  const niches: NicheType[] = [
    'Tech & AI',
    'Beauty & Skincare',
    'Fitness & Health',
    'Gaming & Esports',
    'Lifestyle & Travel',
    'Fashion & Apparel',
    'Finance & Crypto'
  ];

  const filteredCreators = useMemo(() => {
    return creators
      .filter((creator) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = creator.name.toLowerCase().includes(q);
          const matchesHandle = creator.handle.toLowerCase().includes(q);
          const matchesBio = creator.bio.toLowerCase().includes(q);
          const matchesNiche = creator.niches.some(n => n.toLowerCase().includes(q));
          if (!matchesName && !matchesHandle && !matchesBio && !matchesNiche) return false;
        }

        // Niche filter
        if (selectedNiche !== 'all' && !creator.niches.includes(selectedNiche as NicheType)) {
          return false;
        }

        // Platform filter
        if (selectedPlatform !== 'all' && creator.primaryPlatform !== selectedPlatform) {
          return false;
        }

        // Min Engagement
        if (creator.avgEngagementRate < minEngagement) {
          return false;
        }

        // Verified
        if (verifiedOnly && !creator.verified) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'engagement') return b.avgEngagementRate - a.avgEngagementRate;
        if (sortBy === 'followers') return b.followersCount - a.followersCount;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [creators, searchQuery, selectedNiche, selectedPlatform, minEngagement, verifiedOnly, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Top Header & AI Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Creator Discovery Engine
            <Badge variant="purple">{filteredCreators.length} Verified Creators</Badge>
          </h2>
          <p className="text-xs text-slate-400">
            Search verified creators across YouTube, TikTok, & Instagram with authentic engagement audits.
          </p>
        </div>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 flex items-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI Matchmaker</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#12131c] border border-slate-800 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Main search text input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by creator name, @handle, keyword (e.g. AI, skincare)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
            />
          </div>

          {/* Niche Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500 transition cursor-pointer"
            >
              <option value="all">All Niches & Categories</option>
              {niches.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Platform Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500 transition cursor-pointer"
            >
              <option value="all">All Platforms</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500 transition cursor-pointer"
            >
              <option value="engagement">Highest Engagement %</option>
              <option value="followers">Most Followers</option>
              <option value="rating">Top Rated (5.0★)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Tags & Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-medium">Quick Niches:</span>
            {niches.slice(0, 4).map(n => (
              <button
                key={n}
                onClick={() => setSelectedNiche(selectedNiche === n ? 'all' : n)}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
                  selectedNiche === n 
                    ? 'bg-violet-900/60 border border-violet-500 text-violet-200 font-medium' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-violet-600 focus:ring-0 cursor-pointer"
              />
              <span>Verified Only</span>
            </label>

            <div className="flex items-center gap-2 text-slate-400">
              <span>Min ER:</span>
              <select
                value={minEngagement}
                onChange={(e) => setMinEngagement(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-slate-200 text-xs cursor-pointer"
              >
                <option value={0}>Any ER</option>
                <option value={5}>&gt; 5% ER</option>
                <option value={7}>&gt; 7% ER (Viral)</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Creator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCreators.map((creator) => (
          <div
            key={creator.id}
            onClick={() => setSelectedCreator(creator)}
            className="group rounded-2xl bg-[#12131c] border border-slate-800 hover:border-violet-500/50 p-5 shadow-xl transition cursor-pointer flex flex-col justify-between hover:shadow-2xl hover:shadow-violet-900/10 hover:-translate-y-0.5"
          >
            {/* Header info */}
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-violet-500 transition"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition">
                        {creator.name}
                      </h3>
                      {creator.verified && <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />}
                    </div>
                    <p className="text-xs text-slate-400">{creator.handle}</p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{creator.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-lg text-amber-300 text-xs font-semibold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{creator.rating}</span>
                </div>
              </div>

              {/* Niches badges */}
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {creator.niches.map((n) => (
                  <Badge key={n} variant="purple" size="sm">
                    {n}
                  </Badge>
                ))}
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                {creator.bio}
              </p>

              {/* Key Metrics Pill Grid */}
              <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Followers</span>
                  <span className="text-xs font-bold text-white">{(creator.followersCount / 1000).toFixed(0)}k</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium flex items-center justify-center gap-0.5">
                    <Flame className="w-3 h-3 text-orange-400" />
                    Eng. Rate
                  </span>
                  <span className="text-xs font-bold text-emerald-400">{creator.avgEngagementRate}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Avg Views</span>
                  <span className="text-xs font-bold text-violet-300">{(creator.avgViewsPerPost / 1000).toFixed(0)}k</span>
                </div>
              </div>

              {/* Audience preview summary */}
              <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Top Audience: <strong>{creator.audienceDemographics.topCountries[0].name} ({creator.audienceDemographics.topCountries[0].percentage}%)</strong></span>
                <span>{creator.stats.onTimeRate}% On-Time</span>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Package Starts at</span>
                <span className="text-xs font-black text-white">{creator.priceRange.split('-')[0]}</span>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-slate-900 group-hover:bg-violet-600 text-slate-300 group-hover:text-white text-xs font-semibold border border-slate-800 group-hover:border-violet-500 transition flex items-center gap-1.5 shadow-sm">
                <span>View Media Kit</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredCreators.length === 0 && (
        <div className="text-center py-16 p-6 rounded-2xl bg-[#12131c] border border-slate-800">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">No creators match your current filter</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, lowering the engagement threshold, or ask our AI Strategist to discover matching influencers.
          </p>
        </div>
      )}

    </div>
  );
};
