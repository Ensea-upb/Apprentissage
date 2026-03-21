import { Router, Request, Response } from 'express';
import { CONCEPTS } from '../data/concepts';

const router = Router();

// GET /api/concepts
router.get('/', (_req: Request, res: Response) => {
  res.json(CONCEPTS);
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

// GET /api/concepts/:id  (must come after /block/:blockId)
router.get('/:id', (req: Request, res: Response) => {
  const concept = CONCEPTS.find((c) => c.id === req.params.id);
  if (!concept) {
    res.status(404).json({ error: 'Concept not found' });
    return;
  }
  res.json(concept);
});

export default router;
