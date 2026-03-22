// packages/content/questions/index.ts
// Central loader for all static question sets

import { ConceptQuestionSet } from '../types';

// Block 0 — Mathématiques fondamentales
import { scalaireVecteurMatrice } from './block0/0.1.01-scalaire-vecteur-matrice';
import { matricesOperations } from './block0/0.1.02-matrices-operations';
import { determinantInverse } from './block0/0.1.03-determinant-inverse';
import { valeursPropres } from './block0/0.1.04-valeurs-propres';
import { svd } from './block0/0.1.05-svd';
import { produitScalaire } from './block0/0.1.06-produit-scalaire';
import { orthogonalite } from './block0/0.1.07-orthogonalite';
import { factorisationLUQR } from './block0/0.1.08-factorisation-lu-qr';

// Block 4 — Deep Learning
import { scaledDotProductAttention } from './block4/4.5.05-scaled-dot-product';

// ─── Registry ────────────────────────────────────────────────────────────────

const QUESTION_SETS: ConceptQuestionSet[] = [
  scalaireVecteurMatrice,
  matricesOperations,
  determinantInverse,
  valeursPropres,
  svd,
  produitScalaire,
  orthogonalite,
  factorisationLUQR,
  scaledDotProductAttention,
];

/** Returns all question sets */
export function getAllQuestionSets(): ConceptQuestionSet[] {
  return QUESTION_SETS;
}

/** Returns the question set for a given concept ID, or undefined */
export function getQuestionSet(conceptId: string): ConceptQuestionSet | undefined {
  return QUESTION_SETS.find((qs) => qs.conceptId === conceptId);
}

/** Returns all questions for a given concept and phase */
export function getQuestionsForPhase(conceptId: string, phase: number) {
  const qs = getQuestionSet(conceptId);
  if (!qs) return [];
  const phaseKey = `phase${phase}` as keyof ConceptQuestionSet;
  const phaseData = qs[phaseKey] as { questions?: unknown[] } | undefined;
  return phaseData?.questions ?? [];
}

/** Returns the total number of static questions across all concepts */
export function getTotalQuestionCount(): number {
  return QUESTION_SETS.reduce((total, qs) => {
    let count = 0;
    for (let p = 1; p <= 6; p++) {
      const phaseData = qs[`phase${p}` as keyof ConceptQuestionSet] as { questions?: unknown[] } | undefined;
      count += phaseData?.questions?.length ?? 0;
    }
    return total + count;
  }, 0);
}
