import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Percent, 
  Save, 
  DollarSign, 
  Clock, 
  Bot, 
  ShieldCheck, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const PlatformSettings: React.FC = () => {
  const { platformConfig, updatePlatformConfig, showToast } = useApp();

  const [takeRate, setTakeRate] = useState<number>(platformConfig.platformTakeRatePercent);
  const [minDeposit, setMinDeposit] = useState<number>(platformConfig.minEscrowDepositUSD);
  const [autoReleaseDays, setAutoReleaseDays] = useState<number>(platformConfig.autoReleaseAfterDays);
  const [aiModel, setAiModel] = useState<string>(platformConfig.aiMatchingModel);
  const [maintenance, setMaintenance] = useState<boolean>(platformConfig.maintenanceMode);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformConfig({
      platformTakeRatePercent: Number(takeRate),
      minEscrowDepositUSD: Number(minDeposit),
      autoReleaseAfterDays: Number(autoReleaseDays),
      aiMatchingModel: aiModel,
      maintenanceMode: maintenance,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Platform Configuration & Economics Manager
            <Badge variant="emerald">Live Synced</Badge>
          </h2>
          <p className="text-xs text-slate-400">
            Configure marketplace monetization take-rates, escrow parameters, and AI model routing.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        
        {/* Marketplace Economics */}
        <div className="p-6 rounded-3xl bg-[#12131c] border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              Marketplace Commission & Take-Rate
            </h3>
            <span className="text-xs font-black text-emerald-400">{takeRate}% Current Fee</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Platform Take-Rate Percentage (%)
                </label>
                <span className="text-base font-black text-emerald-400">{takeRate}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                step={0.5}
                value={takeRate}
                onChange={(e) => setTakeRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>0% (Free promotion)</span>
                <span>7.5% (Standard)</span>
                <span>20% (Max)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Minimum Campaign Escrow Deposit ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min={50}
                    value={minDeposit}
                    onChange={(e) => setMinDeposit(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Auto-Release Escrow Window (Days)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min={3}
                    max={60}
                    value={autoReleaseDays}
                    onChange={(e) => setAutoReleaseDays(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI & Infrastructure Settings */}
        <div className="p-6 rounded-3xl bg-[#12131c] border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Bot className="w-4 h-4 text-violet-400" />
              AI Intelligence & Matchmaking Router
            </h3>
            <Badge variant="purple">Gemini Engine</Badge>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary LLM Inference Model
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Gemini 2.0 Flash Enterprise">Gemini 2.0 Flash Enterprise (Fastest & Most Accurate)</option>
                <option value="Gemini 1.5 Pro High-Reasoning">Gemini 1.5 Pro High-Reasoning</option>
                <option value="Anthropic Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Platform Maintenance Mode</span>
                <span className="text-[11px] text-slate-400">Freeze new campaign creation while running scheduled database migrations.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenance}
                  onChange={(e) => setMaintenance(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-violet-600/30 flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply System Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
};
