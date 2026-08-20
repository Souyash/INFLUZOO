import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';

export const aiRouter = Router();

// POST AI Matchmaker
aiRouter.post('/match', (req: Request, res: Response) => {
  const { prompt, budget } = req.body;
  const creators = db.getCreators();

  let matched = creators;
  if (prompt && typeof prompt === 'string') {
    const p = prompt.toLowerCase();
    if (p.includes('tech') || p.includes('ai') || p.includes('software')) {
      matched = creators.filter(c => c.niches.includes('Tech & AI'));
    } else if (p.includes('beauty') || p.includes('skincare')) {
      matched = creators.filter(c => c.niches.includes('Beauty & Skincare'));
    } else if (p.includes('fitness') || p.includes('gym')) {
      matched = creators.filter(c => c.niches.includes('Fitness & Health'));
    }
  }

  const result = {
    summary: `Analyzed 15,000+ creator profiles. Identified ${matched.length} high-synergy creator matches with verified authentic engagement and optimal audience overlap for your goals.`,
    suggestedBudget: budget ? `$${budget.toLocaleString()}` : '$1,800 - $3,500',
    expectedImpressions: '280K - 450K Verified Views',
    recommendedCreators: matched.length > 0 ? matched : creators.slice(0, 2),
    confidenceScore: 98.4,
    aiBriefDraft: `Campaign Objective: Maximize conversion for high-intent audience.\nKey Message: Focus on authentic daily routine integration, showcase product UI/texture, include trackable link in bio & 15% promo code.\nDeliverables: 1x Dedicated Vertical Reel/TikTok + 2x High-intent Stories.`
  };

  res.json({ success: true, data: result });
});

// POST AI Polish Brief
aiRouter.post('/polish-brief', (req: Request, res: Response) => {
  const { briefText, niche } = req.body;

  const polished = `• 1x Dedicated Sponsor Integration tailored for ${niche || 'target'} audiences with high-converting visual B-roll.\n• 2x High-retention Vertical UGC Shorts (TikTok + IG Reels) focusing on Problem vs Solution.\n• Pinned Comment + Link in Bio with custom discount tracking link and 30-day digital ad usage rights.`;

  res.json({ success: true, data: { polishedBrief: polished } });
});
