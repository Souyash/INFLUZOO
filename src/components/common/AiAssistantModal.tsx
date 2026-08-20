import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Bot, ArrowRight, CheckCircle2, TrendingUp, Users, ShieldCheck } from 'lucide-react';
import { Badge } from './Badge';

export const AiAssistantModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, creators, setSelectedCreator, setPerspective, setBrandTab, showToast } = useApp();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    suggestedBudget: string;
    expectedImpressions: string;
    recommendedCreators: typeof creators;
    aiBriefDraft: string;
  } | null>(null);

  if (!isAiModalOpen) return null;

  const examplePrompts = [
    "Find me tech & AI creators with >5% engagement to launch a SaaS productivity app under $2,000 budget.",
    "Looking for clean beauty TikTok creators for a 3-week UGC campaign with whitelisting rights.",
    "Recommend fitness influencers to promote a sustainable hydration supplement for Q4 launch."
  ];

  const handleGenerate = (queryText?: string) => {
    const textToUse = queryText || prompt;
    if (!textToUse.trim()) return;

    setIsGenerating(true);
    setAnalysisResult(null);

    // Simulate AI inference & semantic matching
    setTimeout(() => {
      let filtered = creators;
      const lower = textToUse.toLowerCase();

      if (lower.includes('tech') || lower.includes('ai') || lower.includes('saas')) {
        filtered = creators.filter(c => c.niches.includes('Tech & AI'));
      } else if (lower.includes('beauty') || lower.includes('skincare')) {
        filtered = creators.filter(c => c.niches.includes('Beauty & Skincare'));
      } else if (lower.includes('fitness') || lower.includes('health') || lower.includes('supplement')) {
        filtered = creators.filter(c => c.niches.includes('Fitness & Health'));
      }

      setAnalysisResult({
        summary: `Analyzed 12,000+ creator profiles. Identified ${filtered.length} high-synergy creator matches with verified authentic engagement and optimal audience overlap for your goals.`,
        suggestedBudget: '$1,800 - $3,500',
        expectedImpressions: '280K - 450K Verified Views',
        recommendedCreators: filtered.length > 0 ? filtered : creators.slice(0, 2),
        aiBriefDraft: `Campaign Objective: Maximize conversion for high-intent audience.\nKey Message: Focus on authentic daily routine integration, showcase product UI/texture, include trackable link in bio & 15% promo code.\nDeliverables: 1x Dedicated Vertical Reel/TikTok + 2x High-intent Stories.`
      });
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-violet-500/30 bg-[#12131c] p-6 shadow-2xl glow-purple text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Influzo AI Strategist & Matchmaker</h3>
                <Badge variant="purple">Gemini Powered</Badge>
              </div>
              <p className="text-xs text-slate-400">Natural language creator discovery, campaign brief generator & ROI forecaster</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Area */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Describe your product, budget & target campaign goals
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Find 2 tech creators to promote our new AI developer tool with >5% engagement rate for $2,500 total..."
                rows={3}
                className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 p-3.5 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition resize-none"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating || !prompt.trim()}
                className="absolute bottom-3 right-3 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 flex items-center gap-2 shadow-md transition"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Match...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Run AI Match
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Prompt Shortcuts */}
          <div>
            <span className="text-xs text-slate-400 mr-2">Or try asking:</span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {examplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(p);
                    handleGenerate(p);
                  }}
                  className="text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-left transition"
                >
                  ✨ {p.slice(0, 52)}...
                </button>
              ))}
            </div>
          </div>

          {/* Results Display */}
          {analysisResult && (
            <div className="mt-6 p-5 rounded-xl border border-violet-500/30 bg-violet-950/20 space-y-4 animate-in fade-in">
              <div className="flex items-start gap-3">
                <Bot className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-white">AI Strategy & Feasibility Summary</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{analysisResult.summary}</p>
                </div>
              </div>

              {/* Metric Forecasts */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    Est. Impressions
                  </span>
                  <p className="text-sm font-bold text-emerald-300 mt-1">{analysisResult.expectedImpressions}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                    Suggested Escrow
                  </span>
                  <p className="text-sm font-bold text-violet-300 mt-1">{analysisResult.suggestedBudget}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    Match Quality
                  </span>
                  <p className="text-sm font-bold text-blue-300 mt-1">98.4% Confidence</p>
                </div>
              </div>

              {/* Top Creator Matches */}
              <div className="pt-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                  Top Recommended Creator Matches:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysisResult.recommendedCreators.map((creator) => (
                    <div
                      key={creator.id}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/70 hover:border-violet-500/50 flex items-center justify-between transition cursor-pointer"
                      onClick={() => {
                        setSelectedCreator(creator);
                        setIsAiModalOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-10 h-10 rounded-full object-cover border border-violet-500/40"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-white">{creator.name}</span>
                            {creator.verified && <CheckCircle2 className="w-3 h-3 text-violet-400" />}
                          </div>
                          <span className="text-[11px] text-slate-400">{creator.handle} • {creator.avgEngagementRate}% ER</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-violet-300">{creator.priceRange.split('-')[0]}</span>
                        <p className="text-[10px] text-emerald-400">99% Match</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Brief Draft */}
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-300 block mb-1">Generated Brief Draft:</span>
                <pre className="text-[11px] text-slate-300 whitespace-pre-wrap font-sans bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                  {analysisResult.aiBriefDraft}
                </pre>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsAiModalOpen(false);
                    setPerspective('brand');
                    setBrandTab('studio');
                    showToast('Campaign draft loaded into Campaign Studio!', 'info');
                  }}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-2 transition"
                >
                  Apply to Campaign Studio
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
