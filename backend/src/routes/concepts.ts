import { Router, Request, Response } from 'express';
import { CONCEPTS } from '../data/concepts';

const router = Router();

// Build block summary once at startup
const BLOCKS = Array.from(
  CONCEPTS.reduce((map, c) => {
    if (!map.has(c.blockId)) {
      map.set(c.blockId, { blockId: c.blockId, blockName: c.blockName, conceptCount: 0 });
    }
    map.get(c.blockId)!.conceptCount += 1;
    return map;
  }, new Map<number, { blockId: number; blockName: string; conceptCount: number }>()),
).map(([, v]) => v).sort((a, b) => a.blockId - b.blockId);

// GET /api/concepts
router.get('/', (_req: Request, res: Response) => {
  res.json(CONCEPTS);
});

// GET /api/concepts/blocks  — must come before /:id
router.get('/blocks', (_req: Request, res: Response) => {
  res.json(BLOCKS);
});

// GET /api/concepts/block/:blockId
router.get('/block/:blockId', (req: Request, res: Response) => {
  const blockId = parseInt(req.params.blockId);
  if (isNaN(blockId) || blockId < 0 || blockId > 9) {
    res.status(400).json({ error: 'Invalid blockId (0-9)' });
    return;
  }
  res.json(CONCEPTS.filter((c) => c.blockId === blockId));
});

// GET /api/concepts/module/:moduleId  — e.g. "4.5"
router.get('/module/:moduleId', (req: Request, res: Response) => {
  const { moduleId } = req.params;
  const concepts = CONCEPTS.filter((c) => c.moduleId === moduleId);
  if (concepts.length === 0) {
    res.status(404).json({ error: 'Module not found' });
    return;
  }
  res.json(concepts);
});

// GET /api/concepts/:id  (must come last)
router.get('/:id', (req: Request, res: Response) => {
  const concept = CONCEPTS.find((c) => c.id === req.params.id);
  if (!concept) {
    res.status(404).json({ error: 'Concept not found' });
    return;
  }
  res.json(concept);
});

export default router;
