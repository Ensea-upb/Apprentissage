// packages/content/questions/block0/0.1.02-matrices-operations.ts
import { ConceptQuestionSet } from '../../types';

export const matricesOperations: ConceptQuestionSet = {
  conceptId: '0.1.02',
  conceptName: 'Matrices & opérations',
  module: '0.1',
  block: 0,

  phase1: {
    targetCount: 8,
    questions: [
      {
        id: 'p1_0102_001',
        type: 'mcq',
        difficulty: 1,
        question: 'Deux matrices A (2×3) et B (3×4) peuvent-elles être multipliées ? Si oui, quelle est la shape du résultat ?',
        options: [
          'Non — les dimensions sont incompatibles',
          'Oui — résultat de shape 2×4',
          'Oui — résultat de shape 3×3',
          'Oui — résultat de shape 2×3',
        ],
        correctIndex: 1,
        explanation:
          'Pour AB : nombre de colonnes de A doit égaler le nombre de lignes de B. Ici : 3 = 3 ✓. Résultat : (lignes de A) × (colonnes de B) = 2×4. Mémo : (m×n)·(n×p) = (m×p) — "les n se consomment".',
        commonMistake: 'Confondre (2×3)·(3×4) avec (2×3)+(3×4) — l\'addition de matrices exige des shapes identiques, pas le produit.',
      },
      {
        id: 'p1_0102_002',
        type: 'mcq',
        difficulty: 1,
        question: 'La matrice identité I joue le même rôle que :',
        options: [
          'Le 0 pour l\'addition (a + 0 = a)',
          'Le 1 pour la multiplication (a × 1 = a)',
          'Le -1 pour la multiplication (a × (-1) = -a)',
          'Aucune analogie n\'est correcte',
        ],
        correctIndex: 1,
        explanation:
          'AI = IA = A pour toute matrice A compatible. La matrice identité I est l\'élément neutre de la multiplication matricielle, exactement comme 1 est l\'élément neutre de la multiplication scalaire. I est diagonale avec des 1 sur la diagonale.',
      },
      {
        id: 'p1_0102_003',
        type: 'truefalse',
        difficulty: 2,
        statement: 'Si A et B sont deux matrices de même shape, alors A + B = B + A (l\'addition matricielle est commutative).',
        isTrue: true,
        justificationRequired: false,
        explanation:
          'Vrai. L\'addition matricielle est définie élément par élément : (A+B)ᵢⱼ = Aᵢⱼ + Bᵢⱼ = Bᵢⱼ + Aᵢⱼ = (B+A)ᵢⱼ. La commutativité de l\'addition réelle implique la commutativité de l\'addition matricielle. Attention : le PRODUIT matriciel n\'est généralement pas commutatif.',
      },
      {
        id: 'p1_0102_004',
        type: 'mcq',
        difficulty: 2,
        question: 'La transposée d\'une matrice A s\'obtient en :',
        options: [
          'Multipliant chaque élément par -1',
          'Échangeant les lignes et les colonnes : (Aᵀ)ᵢⱼ = Aⱼᵢ',
          'Prenant le complexe conjugué de chaque élément',
          'Inversant l\'ordre des lignes',
        ],
        correctIndex: 1,
        explanation:
          'La transposée échange lignes et colonnes. Si A ∈ ℝ^{m×n}, alors Aᵀ ∈ ℝ^{n×m} avec (Aᵀ)ᵢⱼ = Aⱼᵢ. Une matrice symétrique vérifie A = Aᵀ. AᵀA et AAᵀ sont toujours symétriques semi-définies positives.',
      },
      {
        id: 'p1_0102_005',
        type: 'mcq',
        difficulty: 2,
        question: 'Le produit élément par élément A ⊙ B (produit de Hadamard) et le produit matriciel AB sont-ils équivalents ?',
        options: [
          'Oui, pour les matrices carrées',
          'Non — A ⊙ B calcule Cᵢⱼ = Aᵢⱼ·Bᵢⱼ, tandis que AB calcule Cᵢⱼ = Σₖ Aᵢₖ·Bₖⱼ',
          'Oui, si A et B sont diagonales',
          'Non — ils nécessitent des shapes différentes',
        ],
        correctIndex: 1,
        explanation:
          'Ce sont deux opérations fondamentalement différentes. Hadamard (⊙) : multiplication terme à terme, même shape pour A, B et C. Matriciel (AB) : somme sur la dimension intérieure, shapes (m×n)·(n×p) → m×p. En deep learning : les masks d\'attention utilisent Hadamard, les couches denses utilisent le produit matriciel.',
      },
      {
        id: 'p1_0102_006',
        type: 'ordering',
        difficulty: 3,
        instruction: 'Dans la backpropagation, les gradients traversent une couche Dense y = Wx + b. Ordonne les calculs du gradient ∂L/∂W :',
        steps: [
          'Calculer ∂L/∂W = ∂L/∂y · xᵀ  (produit externe)',
          'Recevoir le gradient entrant ∂L/∂y depuis la couche suivante',
          'Calculer ∂L/∂x = Wᵀ · ∂L/∂y  (pour propager en arrière)',
          'Mettre à jour W ← W - α · ∂L/∂W  (descente de gradient)',
        ],
        correctOrder: [1, 0, 2, 3],
        explanation:
          'Ordre : (1) recevoir ∂L/∂y, (2) calculer ∂L/∂W = ∂L/∂y · xᵀ, (3) calculer ∂L/∂x = Wᵀ · ∂L/∂y pour continuer la propagation, (4) mettre à jour W. Les shapes : ∂L/∂y ∈ ℝ^{d_out}, x ∈ ℝ^{d_in} → ∂L/∂W ∈ ℝ^{d_out × d_in} (même shape que W).',
      },
      {
        id: 'p1_0102_007',
        type: 'mcq',
        difficulty: 3,
        question: 'Dans NumPy, np.dot(A, B) et A @ B produisent-ils le même résultat pour deux matrices 2D ?',
        options: [
          'Non — np.dot fait le produit scalaire, @ fait le produit matriciel',
          'Oui — les deux font le produit matriciel pour des tableaux 2D',
          'Oui — mais np.dot est plus rapide',
          'Non — np.dot exige des shapes identiques',
        ],
        correctIndex: 1,
        explanation:
          'Pour des tableaux 2D, np.dot(A, B) et A @ B sont équivalents (produit matriciel). La différence : np.dot pour des tableaux nD a un comportement plus complexe (somme sur le dernier axe de A et l\'avant-dernier de B). L\'opérateur @ (PEP 465) est plus lisible et recommandé pour le code ML moderne.',
      },
      {
        id: 'p1_0102_008',
        type: 'mcq',
        difficulty: 3,
        question: 'Une matrice diagonale D avec des valeurs {d₁, d₂, …, dₙ} sur la diagonale a une multiplication particulièrement efficace. Da (pour a ∈ ℝⁿ) produit :',
        options: [
          'Un vecteur où chaque composante aᵢ est divisée par dᵢ',
          'Un vecteur où chaque composante aᵢ est multipliée par dᵢ (mis à l\'échelle)',
          'Le même vecteur a (une matrice diagonale est toujours l\'identité)',
          'La somme de tous les aᵢ·dᵢ (un scalaire)',
        ],
        correctIndex: 1,
        explanation:
          'Da = [d₁a₁, d₂a₂, …, dₙaₙ]ᵀ — chaque composante est mise à l\'échelle par son facteur diagonal. Complexité O(n) au lieu de O(n²) pour une matrice dense. En PCA : la transformation avec valeurs singulières est diagonale (D·Σ·V).',
      },
    ],
  },

  phase2: {
    targetCount: 6,
    questions: [
      {
        id: 'p2_0102_001',
        type: 'formula_completion',
        difficulty: 4,
        latex_question: `Pour $A \\in \\mathbb{R}^{m \\times n}$, $B \\in \\mathbb{R}^{n \\times p}$, la transposée du produit est : $(AB)^\\top = \\boxed{?}$`,
        correctLatex: ['B^\\top A^\\top'],
        explanation:
          '(AB)ᵀ = BᵀAᵀ — l\'ordre est inversé. Preuve : ((AB)ᵀ)ᵢⱼ = (AB)ⱼᵢ = Σₖ Aⱼₖ Bₖᵢ = Σₖ (Bᵀ)ᵢₖ (Aᵀ)ₖⱼ = (BᵀAᵀ)ᵢⱼ. Généralisation : (ABC)ᵀ = CᵀBᵀAᵀ.',
        sourceNote: 'Propriété fondamentale — utilisée constamment en backpropagation.',
      },
      {
        id: 'p2_0102_002',
        type: 'mcq',
        difficulty: 4,
        question: 'La trace d\'une matrice carrée A est définie comme trace(A) = Σᵢ Aᵢᵢ. Quelle propriété remarquable possède la trace ?',
        options: [
          'trace(AB) = trace(A)·trace(B)',
          'trace(AB) = trace(BA) même si AB ≠ BA',
          'trace(A) = déterminant(A) pour les matrices diagonales',
          'trace(A + B) = trace(A)·trace(B)',
        ],
        correctIndex: 1,
        explanation:
          'trace(AB) = trace(BA) — la trace est invariante par permutation cyclique. Preuve : trace(AB) = Σᵢⱼ AᵢⱼBⱼᵢ = Σᵢⱼ BⱼᵢAᵢⱼ = trace(BA). Plus généralement trace(ABC) = trace(BCA) = trace(CAB). En ML : trace(WᵀW) = ‖W‖_F² (norme de Frobenius au carré).',
        sourceNote: 'Propriété de la trace — utilisée dans les preuves d\'invariances et la régularisation.',
      },
      {
        id: 'p2_0102_003',
        type: 'numerical',
        difficulty: 4,
        latexQuestion: `Calcule $A^2 = A \\cdot A$ pour $A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ (matrice de cisaillement).`,
        solution: {
          step1: 'A²[0,0] = 1·1 + 1·0 = 1',
          step2: 'A²[0,1] = 1·1 + 1·1 = 2',
          step3: 'A²[1,0] = 0·1 + 1·0 = 0',
          step4: 'A²[1,1] = 0·1 + 1·1 = 1',
          result: '[[1, 2], [0, 1]]',
        },
        tolerance: 0,
        explanation:
          'A² = [[1,2],[0,1]]. Remarque : Aⁿ = [[1,n],[0,1]] pour cette matrice de cisaillement. Ce n\'est pas [[1,1],[0,1]]² = [[1,2],[0,1]] en multipliant simplement les éléments ! Le produit matriciel n\'est pas le produit terme-à-terme.',
      },
      {
        id: 'p2_0102_004',
        type: 'mcq',
        difficulty: 5,
        question: 'Le broadcasting en NumPy permet d\'additionner une matrice A (3×4) avec un vecteur v (4,). Le vecteur est traité comme :',
        options: [
          'Une matrice (1×4) dupliquée 3 fois en lignes pour obtenir (3×4)',
          'Une matrice (4×1) dupliquée 3 fois en colonnes pour obtenir (3×4)',
          'Un scalaire multipliant toute la matrice',
          'Un vecteur de 4 lignes additionné à la première colonne de A',
        ],
        correctIndex: 0,
        explanation:
          'v (shape: 4,) est broadcasté comme (1,4) puis dupliqué en (3,4). Chaque ligne de A reçoit le même vecteur v. C\'est équivalent à np.tile(v, (3,1)) mais sans copie mémoire. Règle : les dimensions sont alignées par la droite et dupliquées si nécessaire.',
      },
      {
        id: 'p2_0102_005',
        type: 'truefalse',
        difficulty: 5,
        statement: 'Le produit matriciel A @ B avec A ∈ ℝ^{n×n} peut être calculé en O(n²) opérations avec l\'algorithme standard.',
        isTrue: false,
        justificationRequired: true,
        explanation:
          'Faux. L\'algorithme standard est O(n³) : pour chaque des n² éléments du résultat, on fait une somme de n termes → n² × n = n³. Le record théorique actuel (Coppersmith-Winograd et variantes) est O(n^{2.37...}). En pratique, les GPUs exploitent les propriétés SIMD pour accélérer, mais restent ≈ O(n³) algorithmiquement.',
        sourceNote: 'Complexité du produit matriciel — crucial pour comprendre les coûts computationnels en ML.',
      },
      {
        id: 'p2_0102_006',
        type: 'mcq',
        difficulty: 5,
        question: 'Dans l\'équation normale β = (XᵀX)⁻¹Xᵀy, la matrice XᵀX joue le rôle de :',
        options: [
          'La matrice de covariance des features (à une constante près)',
          'La matrice de corrélation entre y et X',
          'La matrice identité pour les features normalisées',
          'L\'inverse de la matrice de covariance',
        ],
        correctIndex: 0,
        explanation:
          'XᵀX/n est exactement la matrice de covariance empirique des features (si X est centré). Ses éléments (XᵀX)ᵢⱼ = Σₖ Xₖᵢ·Xₖⱼ = produit scalaire entre les colonnes i et j de X. L\'équation normale résout le problème de moindres carrés : minimise ‖Xβ - y‖².',
        sourceNote: 'Régression linéaire — équation normale = (XᵀX)⁻¹Xᵀy.',
      },
    ],
  },
};
