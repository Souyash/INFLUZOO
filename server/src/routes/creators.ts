import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';

export const creatorsRouter = Router();

// GET /api/creators (Filtered Search)
creatorsRouter.get('/', (req: Request, res: Response) => {
  const { niche, platform, verified, q } = req.query;

  const creators = db.getCreators({
    niche: niche ? String(niche) : undefined,
    platform: platform ? String(platform) : undefined,
    verified: verified !== undefined ? verified === 'true' : undefined,
    q: q ? String(q) : undefined,
  });

  res.json({
    success: true,
    count: creators.length,
    data: creators,
  });
});

// GET /api/creators/:id
creatorsRouter.get('/:id', (req: Request, res: Response) => {
  const creator = db.getCreatorById(req.params.id);
  if (!creator) {
    return res.status(404).json({ success: false, message: 'Creator not found' });
  }
  res.json({ success: true, data: creator });
});

// PATCH /api/creators/:id (Update Media Kit & Rates in SQLite)
creatorsRouter.patch('/:id', (req: Request, res: Response) => {
  const updated = db.updateCreator(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Creator not found' });
  }

  db.addAuditLog('CREATOR_PROFILE_UPDATED', 'creator', updated.id, `Creator ${updated.name} (${updated.handle}) updated rate card & profile.`, updated.name);

  res.json({
    success: true,
    message: 'Creator profile & rate card updated successfully.',
    data: updated,
  });
});

// POST /api/creators (Register new creator)
creatorsRouter.post('/', (req: Request, res: Response) => {
  const newCreator = db.createCreator({
    ...req.body,
    id: req.body.id || `c-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
  });

  db.addAuditLog('CREATOR_REGISTERED', 'creator', newCreator.id, `New creator registered: ${newCreator.name} (${newCreator.handle})`);

  res.status(201).json({
    success: true,
    message: 'Creator registered successfully.',
    data: newCreator,
  });
});
