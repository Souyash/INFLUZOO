import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye, 
  ShoppingCart, 
  ArrowUpRight, 
  Sparkles,
  BarChart3,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Badge } from '../common/Badge';

export const BrandAnalytics: React.FC = () => {
  const { campaigns, deals } = useApp();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  const performanceData = [
    { date: 'Aug 01', impressions: 45000, clicks: 2100, conversions: 110, spend: 800 },
    { date: 'Aug 04', impressions: 72000, clicks: 3800, conversions: 195, spend: 1400 },
    { date: 'Aug 08', impressions: 110000, clicks: 6400, conversions: 340, spend: 2200 },
    { date: 'Aug 12', impressions: 185000, clicks: 11200, conversions: 620, spend: 3600 },
    { date: 'Aug 16', impressions: 290000, clicks: 18900, conversions: 1040, spend: 5400 },
    { date: 'Aug 20', impressions: 420000, clicks: 27500, conversions: 1580, spend: 7800 },
  ];

  const platformDistribution = [
    { name: 'YouTube', value: 45, color: '#ef4444' },
    { name: 'TikTok', value: 35, color: '#8b5cf6' },
    { name: 'Instagram', value: 20, color: '#ec4899' },
  ];

  const creatorLeaderboard = [
    { name: 'Elena Rostova', handle: '@elenatech', platform: 'YouTube', views: '142,000', spend: '$1,600', roas: '4.8x', score: 98 },
    { name: 'Aria Chen', handle: '@ariaskincare', platform: 'TikTok', views: '280,000', spend: '$1,400', roas: '5.2x', score: 99 },
    { name: 'Marcus Vance', handle: '@marcusfitness', platform: 'Instagram', views: '110,000', spend: '$1,200', roas: '4.4x', score: 95 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Live Campaign ROI & Attribution
            <Badge variant="emerald">Live Shopify Sync</Badge>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time trackable links, discount code redemptions, and view-through conversions.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 rounded-lg transition ${
                dateRange === r ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Last {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#12131c] border border-slate-800 space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Verified Views</span>
            <Eye className="w-3.5 h-3.5 text-blue-400" />
          </span>
          <p className="text-2xl font-black text-white">420,000</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +28.4% this week
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#12131c] border border-slate-800 space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>Tracked Clicks</span>
            <Users className="w-3.5 h-3.5 text-purple-400" />
          </span>
          <p className="text-2xl font-black text-white">27,500</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 6.5% CTR Avg
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#12131c] border border-slate-800 space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>Direct Conversions</span>
            <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
          </span>
          <p className="text-2xl font-black text-emerald-400">1,580</p>
          <span className="text-[11px] text-slate-400">$4.93 Cost / Acquisition</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#12131c] border border-slate-800 space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>Blended Campaign ROAS</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <p className="text-2xl font-black text-amber-300">4.82x</p>
          <span className="text-[11px] text-emerald-400 font-semibold">$37,600 Tracked Rev</span>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trajectory Area Chart */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#12131c] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Impressions & Engagement Trajectory
            </h3>
            <span className="text-xs text-slate-400">Updated 10m ago</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#12131c', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
                />
                <Area type="monotone" dataKey="impressions" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorImpressions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Share Donut */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#12131c] border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Share by Platform
            </h3>
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformDistribution}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {platformDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            {platformDistribution.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>{p.name}</span>
                </div>
                <span className="font-bold text-white">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Creator Leaderboard Table */}
      <div className="p-5 rounded-2xl bg-[#12131c] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Top Performing Creator Partnerships
          </h3>
          <span className="text-xs text-violet-400 font-semibold cursor-pointer hover:underline">
            Export CSV
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Creator</th>
                <th className="pb-3 font-semibold">Platform</th>
                <th className="pb-3 font-semibold">Verified Views</th>
                <th className="pb-3 font-semibold">Escrow Spent</th>
                <th className="pb-3 font-semibold">Direct ROAS</th>
                <th className="pb-3 font-semibold">Influzo Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {creatorLeaderboard.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 font-bold text-white">
                    {item.name} <span className="text-slate-400 font-normal">({item.handle})</span>
                  </td>
                  <td className="py-3 text-slate-300">{item.platform}</td>
                  <td className="py-3 text-slate-200">{item.views}</td>
                  <td className="py-3 font-semibold text-white">{item.spend}</td>
                  <td className="py-3 font-bold text-emerald-400">{item.roas}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-violet-950/80 border border-violet-500/40 text-violet-300 font-extrabold text-[11px]">
                      {item.score} / 100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
