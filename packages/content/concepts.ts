// packages/content/concepts.ts
// Directed Acyclic Graph of all concepts — topologically ordered

import { ConceptMeta } from './types';

export const CONCEPTS: Record<string, ConceptMeta> = {
  // ── BLOCK 0 : Mathématiques fondamentales ─────────────────────────────────

  // Module 0.1 – Algèbre Linéaire
  '0.1.01': {
    id: '0.1.01', name: 'Scalaires, vecteurs & matrices', shortName: 'Scalaires/Vecteurs',
    block: 0, module: '0.1', prerequisites: [], unlocks: ['0.1.02', '0.1.06'],
    estimatedMinutes: 30, questionFile: 'block0/0.1.01-scalaire-vecteur-matrice',
    paper: null, kaggle: null, tags: ['linear-algebra', 'foundational'],
  },
  '0.1.02': {
    id: '0.1.02', name: 'Matrices & opérations', shortName: 'Matrices',
    block: 0, module: '0.1', prerequisites: ['0.1.01'], unlocks: ['0.1.03'],
    estimatedMinutes: 35, questionFile: 'block0/0.1.02-matrices-operations',
    paper: null, kaggle: null, tags: ['linear-algebra', 'foundational'],
  },
  '0.1.03': {
    id: '0.1.03', name: 'Déterminant & matrice inverse', shortName: 'Déterminant',
    block: 0, module: '0.1', prerequisites: ['0.1.02'], unlocks: ['0.1.04'],
    estimatedMinutes: 40, questionFile: 'block0/0.1.03-determinant-inverse',
    paper: null, kaggle: null, tags: ['linear-algebra'],
  },
  '0.1.04': {
    id: '0.1.04', name: 'Valeurs propres & vecteurs propres', shortName: 'Valeurs propres',
    block: 0, module: '0.1', prerequisites: ['0.1.03'], unlocks: ['0.1.05'],
    estimatedMinutes: 45, questionFile: 'block0/0.1.04-valeurs-propres',
    paper: null, kaggle: null, tags: ['linear-algebra'],
  },
  '0.1.05': {
    id: '0.1.05', name: 'Décomposition SVD', shortName: 'SVD',
    block: 0, module: '0.1', prerequisites: ['0.1.04'], unlocks: ['0.2.01'],
    estimatedMinutes: 50, questionFile: 'block0/0.1.05-svd',
    paper: null, kaggle: null, tags: ['linear-algebra', 'dimensionality-reduction'],
  },
  '0.1.06': {
    id: '0.1.06', name: 'Produit scalaire & normes', shortName: 'Dot product',
    block: 0, module: '0.1', prerequisites: ['0.1.01'], unlocks: ['0.1.07', '4.5.03'],
    estimatedMinutes: 35, questionFile: 'block0/0.1.06-produit-scalaire',
    paper: null, kaggle: null, tags: ['linear-algebra', 'foundational'],
  },
  '0.1.07': {
    id: '0.1.07', name: 'Orthogonalité & projection', shortName: 'Orthogonalité',
    block: 0, module: '0.1', prerequisites: ['0.1.06'], unlocks: ['0.1.08'],
    estimatedMinutes: 40, questionFile: 'block0/0.1.07-orthogonalite',
    paper: null, kaggle: null, tags: ['linear-algebra'],
  },
  '0.1.08': {
    id: '0.1.08', name: 'Factorisation LU & QR', shortName: 'LU/QR',
    block: 0, module: '0.1', prerequisites: ['0.1.07'], unlocks: ['0.2.01'],
    estimatedMinutes: 45, questionFile: 'block0/0.1.08-factorisation-lu-qr',
    paper: null, kaggle: null, tags: ['linear-algebra', 'numerical-methods'],
  },

  // Module 0.2 – Calcul & Optimisation
  '0.2.01': {
    id: '0.2.01', name: 'Dérivées & règle de la chaîne', shortName: 'Dérivées',
    block: 0, module: '0.2', prerequisites: ['0.1.05', '0.1.08'], unlocks: ['0.2.02'],
    estimatedMinutes: 40, questionFile: 'block0/0.2.01-derivees',
    paper: null, kaggle: null, tags: ['calculus', 'foundational'],
  },
  '0.2.02': {
    id: '0.2.02', name: 'Gradient & dérivées partielles', shortName: 'Gradient',
    block: 0, module: '0.2', prerequisites: ['0.2.01'], unlocks: ['0.2.03'],
    estimatedMinutes: 40, questionFile: 'block0/0.2.02-gradient',
    paper: null, kaggle: null, tags: ['calculus', 'optimization'],
  },
  '0.2.03': {
    id: '0.2.03', name: 'Descente de gradient', shortName: 'SGD',
    block: 0, module: '0.2', prerequisites: ['0.2.02'], unlocks: ['0.2.04'],
    estimatedMinutes: 45, questionFile: 'block0/0.2.03-descente-gradient',
    paper: null, kaggle: null, tags: ['optimization', 'ml'],
  },

  // Module 0.3 – Probabilités
  '0.3.01': {
    id: '0.3.01', name: 'Espaces de probabilité & axiomes', shortName: 'Probabilités',
    block: 0, module: '0.3', prerequisites: ['0.2.01'], unlocks: ['0.3.02'],
    estimatedMinutes: 35, questionFile: 'block0/0.3.01-probabilites',
    paper: null, kaggle: null, tags: ['probability', 'foundational'],
  },
  '0.3.04': {
    id: '0.3.04', name: 'Loi normale & TCL', shortName: 'Loi normale',
    block: 0, module: '0.3', prerequisites: ['0.3.01'], unlocks: ['0.3.05'],
    estimatedMinutes: 45, questionFile: 'block0/0.3.04-loi-normale',
    paper: null, kaggle: null, tags: ['probability', 'statistics'],
  },

  // Module 0.4 – Théorie de l'information
  '0.4.01': {
    id: '0.4.01', name: 'Entropie de Shannon', shortName: 'Entropie',
    block: 0, module: '0.4', prerequisites: ['0.3.01'], unlocks: ['0.4.02'],
    estimatedMinutes: 40, questionFile: 'block0/0.4.01-entropie',
    paper: null, kaggle: null, tags: ['information-theory'],
  },
  '0.4.02': {
    id: '0.4.02', name: 'Entropie croisée & divergence KL', shortName: 'KL divergence',
    block: 0, module: '0.4', prerequisites: ['0.4.01'], unlocks: ['0.4.03'],
    estimatedMinutes: 45, questionFile: 'block0/0.4.02-kl-divergence',
    paper: null, kaggle: null, tags: ['information-theory', 'loss-functions'],
  },

  // ── BLOCK 4 : Deep Learning ───────────────────────────────────────────────

  '4.5.03': {
    id: '4.5.03', name: 'Embeddings & représentations vectorielles', shortName: 'Embeddings',
    block: 4, module: '4.5', prerequisites: ['0.1.06'], unlocks: ['4.5.04'],
    estimatedMinutes: 50, questionFile: 'block4/4.5.03-embeddings',
    paper: 'word2vec-2013', kaggle: null, tags: ['nlp', 'embeddings'],
  },
  '4.5.04': {
    id: '4.5.04', name: 'Mécanisme d\'attention (Bahdanau)', shortName: 'Attention',
    block: 4, module: '4.5', prerequisites: ['4.5.03'], unlocks: ['4.5.05'],
    estimatedMinutes: 60, questionFile: 'block4/4.5.04-attention-bahdanau',
    paper: 'neural-machine-translation-2015', kaggle: null, tags: ['attention', 'nlp'],
  },
  '4.5.05': {
    id: '4.5.05', name: 'Scaled Dot-Product Attention', shortName: 'Scaled attention',
    block: 4, module: '4.5', prerequisites: ['4.5.03', '4.5.04', '0.3.01', '4.1.10'],
    unlocks: ['4.5.07', '4.5.08', '4.5.12'],
    estimatedMinutes: 90, questionFile: 'block4/4.5.05-scaled-dot-product',
    paper: 'attention-is-all-you-need-2017',
    kaggle: 'feedback-prize-effectiveness-2022',
    tags: ['attention', 'transformer', 'nlp'],
  },
};

// ─── Topological sort (Kahn's algorithm, O(V+E)) ─────────────────────────────

export function topologicalSort(concepts: Record<string, ConceptMeta>): string[] {
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};

  for (const id of Object.keys(concepts)) {
    inDegree[id] = 0;
    adj[id] = [];
  }
  for (const [id, c] of Object.entries(concepts)) {
    for (const prereq of c.prerequisites) {
      if (adj[prereq]) {
        adj[prereq].push(id);
        inDegree[id] = (inDegree[id] ?? 0) + 1;
      }
    }
  }

  const queue = Object.keys(concepts).filter((id) => inDegree[id] === 0);
  const order: string[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of adj[node]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  return order;
}
