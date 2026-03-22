// packages/content/questions/block0/0.1.04-valeurs-propres.ts
import { ConceptQuestionSet } from '../../types';

export const valeursPropres: ConceptQuestionSet = {
  conceptId: '0.1.04',
  conceptName: 'Valeurs propres & vecteurs propres',
  module: '0.1',
  block: 0,

  phase1: {
    targetCount: 8,
    questions: [
      {
        id: 'p1_0104_001',
        type: 'mcq',
        difficulty: 1,
        question: 'Un vecteur propre v d\'une matrice A avec valeur propre λ satisfait :',
        options: ['Av = v', 'Av = λv', 'Aᵀv = λv', 'A + v = λ'],
        correctIndex: 1,
        explanation:
          'Définition : Av = λv. La matrice A transforme v en un vecteur dans la MÊME direction (ou opposée si λ < 0), simplement mis à l\'échelle par λ. Le vecteur propre ne change pas de direction sous l\'action de A — il est "invariant en direction".',
        commonMistake: 'Av = v serait vrai uniquement pour λ = 1 (pas le cas général).',
      },
      {
        id: 'p1_0104_002',
        type: 'mcq',
        difficulty: 2,
        question: 'En PCA (Analyse en Composantes Principales), les composantes principales sont :',
        options: [
          'Les colonnes de la matrice de données X',
          'Les vecteurs propres de la matrice de covariance XᵀX',
          'Les valeurs propres de la matrice de covariance',
          'La moyenne de chaque feature',
        ],
        correctIndex: 1,
        explanation:
          'En PCA : (1) centrer les données, (2) calculer la matrice de covariance C = XᵀX/(n-1), (3) décomposer C en valeurs/vecteurs propres. Les vecteurs propres = directions de variance maximale (composantes principales). Les valeurs propres = variance expliquée dans chaque direction.',
      },
      {
        id: 'p1_0104_003',
        type: 'truefalse',
        difficulty: 2,
        statement: 'Une matrice A ∈ ℝ^{n×n} a toujours exactement n vecteurs propres linéairement indépendants.',
        isTrue: false,
        justificationRequired: true,
        explanation:
          'Faux. Une matrice peut avoir des valeurs propres répétées (géométriquement ou algébriquement). Ex : [[1,1],[0,1]] a λ = 1 avec multiplicité 2 mais un seul vecteur propre indépendant. Les matrices SYMÉTRIQUES ont toujours n vecteurs propres orthogonaux (théorème spectral) — c\'est pourquoi les matrices de covariance (symétriques) permettent une PCA complète.',
      },
      {
        id: 'p1_0104_004',
        type: 'mcq',
        difficulty: 2,
        question: 'Si λ est une valeur propre de A, que représente λᵏ ?',
        options: [
          'La k-ème valeur propre de A',
          'La valeur propre de Aᵏ (la k-ème puissance de A)',
          'λ·k',
          'La valeur propre de kA',
        ],
        correctIndex: 1,
        explanation:
          'Si Av = λv, alors A²v = A(Av) = A(λv) = λAv = λ²v. Par récurrence, Aᵏv = λᵏv. Application en deep learning : dans les RNN, si les valeurs propres de la matrice récurrente |λ| > 1 → explosion du gradient, |λ| < 1 → vanishing gradient. L\'initialisation orthogonale (|λ| = 1) adresse ce problème.',
      },
      {
        id: 'p1_0104_005',
        type: 'analogy',
        difficulty: 2,
        template: 'Un vecteur propre de A est à A ce que ___ est à ___',
        correctAnswer: 'un axe de rotation est à une rotation 3D',
        alternatives: [
          'une position d\'équilibre est à un système dynamique',
          'une direction invariante est à une transformation linéaire',
        ],
        explanation:
          'Une rotation 3D autour de l\'axe z ne change pas les vecteurs dans la direction z — ils sont "propres" avec λ = 1. De même, un vecteur propre est invariant en direction sous l\'action de A. Cette intuition est directe : les vecteurs propres sont les "axes naturels" de la transformation.',
      },
      {
        id: 'p1_0104_006',
        type: 'mcq',
        difficulty: 3,
        question: 'La somme des valeurs propres d\'une matrice carrée A est égale à :',
        options: ['det(A)', 'trace(A)', 'rang(A)', '‖A‖_F'],
        correctIndex: 1,
        explanation:
          'Σᵢ λᵢ = trace(A) = Σᵢ Aᵢᵢ. Dualité trace-valeurs propres : trace = somme des valeurs propres, det = produit des valeurs propres. En PCA, trace(C) = variance totale = Σᵢ λᵢ. La variance expliquée par k composantes = (Σᵢ₌₁ᵏ λᵢ) / trace(C).',
      },
      {
        id: 'p1_0104_007',
        type: 'mcq',
        difficulty: 3,
        question: 'Pourquoi les valeurs propres d\'une matrice de covariance sont-elles toujours ≥ 0 ?',
        options: [
          'Parce que les matrices de covariance sont triangulaires supérieures',
          'Parce que les matrices de covariance sont symétriques semi-définies positives : vᵀCv ≥ 0 pour tout v',
          'Parce que les variances sont des carrés de nombres réels',
          'Parce que les matrices de covariance ont un déterminant positif',
        ],
        correctIndex: 1,
        explanation:
          'C = XᵀX/(n-1) → pour tout v ≠ 0 : vᵀCv = vᵀXᵀXv/(n-1) = ‖Xv‖²/(n-1) ≥ 0. Donc C est semi-définie positive (SDP). Pour une matrice SDP, toutes les valeurs propres λᵢ ≥ 0. Une valeur propre = 0 signifie une direction de variance nulle (feature redondante ou constante).',
        sourceNote: 'Matrices symétriques définies positives (SDP) — fondamentales en ML.',
      },
      {
        id: 'p1_0104_008',
        type: 'mcq',
        difficulty: 3,
        question: 'Le "problème d\'explosion/disparition du gradient" dans les RNN est directement lié aux valeurs propres. Quelle condition sur les valeurs propres de la matrice récurrente Wₕₕ cause le vanishing gradient ?',
        options: [
          'Toutes les valeurs propres |λᵢ| > 1',
          'Toutes les valeurs propres |λᵢ| < 1',
          'Au moins une valeur propre λᵢ = 0',
          'La matrice a des valeurs propres complexes',
        ],
        correctIndex: 1,
        explanation:
          'À chaque pas de temps, le gradient est multiplié par Wₕₕ. Après T pas : gradient ∝ (Wₕₕ)ᵀ, dont les valeurs propres sont λᵢᵀ. Si |λᵢ| < 1 → λᵢᵀ → 0 exponentiellement (vanishing). Si |λᵢ| > 1 → explosion. Solution : LSTM/GRU (gates), initialisation orthogonale (|λᵢ| = 1).',
        sourceNote: 'Bengio et al. 1994, "Learning Long-Term Dependencies with Gradient Descent is Difficult".',
      },
    ],
  },

  phase2: {
    targetCount: 6,
    questions: [
      {
        id: 'p2_0104_001',
        type: 'formula_completion',
        difficulty: 4,
        latex_question: `Les valeurs propres de $A$ sont les racines de l'équation caractéristique : $\\det(\\boxed{?}) = 0$`,
        correctLatex: ['A - \\lambda I'],
        explanation:
          'det(A - λI) = 0 est le polynôme caractéristique de A. Pour une matrice n×n, c\'est un polynôme de degré n en λ → n racines (réelles ou complexes). Les valeurs propres réelles correspondent à des directions invariantes dans ℝⁿ.',
        sourceNote: 'Définition — équation caractéristique.',
      },
      {
        id: 'p2_0104_002',
        type: 'numerical',
        difficulty: 4,
        latexQuestion: `Trouve les valeurs propres de $A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 2 \\end{pmatrix}$.`,
        solution: {
          step1: 'Équation caractéristique : det(A - λI) = det([[3-λ, 1],[0, 2-λ]]) = 0',
          step2: '(3-λ)(2-λ) - 0 = 0',
          step3: 'λ² - 5λ + 6 = 0',
          step4: '(λ-3)(λ-2) = 0',
          result: 'λ₁ = 3, λ₂ = 2',
        },
        tolerance: 0,
        explanation:
          'Les valeurs propres d\'une matrice triangulaire supérieure (ou inférieure) sont les éléments diagonaux : ici 3 et 2. C\'est une propriété utile : det(A - λI) = Π(Aᵢᵢ - λ) pour les matrices triangulaires.',
      },
      {
        id: 'p2_0104_003',
        type: 'mcq',
        difficulty: 4,
        question: 'La décomposition A = QΛQ⁻¹ (diagonalisation) est possible quand :',
        options: [
          'A est une matrice carrée quelconque',
          'A a n valeurs propres distinctes (ou est symétrique)',
          'A est diagonale',
          'det(A) ≠ 0',
        ],
        correctIndex: 1,
        explanation:
          'A est diagonalisable si elle a n vecteurs propres linéairement indépendants. Condition suffisante : n valeurs propres distinctes. Condition nécessaire et suffisante pour les matrices symétriques réelles (théorème spectral) : toujours diagonalisables avec Q orthogonale. La diagonalisation simplifie Aᵏ = QΛᵏQ⁻¹.',
        sourceNote: 'Théorème spectral pour les matrices symétriques — fondement de PCA.',
      },
      {
        id: 'p2_0104_004',
        type: 'mcq',
        difficulty: 5,
        question: 'En PCA, on retient les k premiers vecteurs propres. Le ratio de variance expliquée par k composantes est :',
        options: [
          'k/n',
          '(Σᵢ₌₁ᵏ λᵢ) / (Σᵢ₌₁ⁿ λᵢ)',
          '(λ_max - λ_min) / (Σᵢ λᵢ)',
          '1 - λₖ₊₁/λ₁',
        ],
        correctIndex: 1,
        explanation:
          'Variance totale = trace(C) = Σᵢ λᵢ. Variance capturée par les k premières CP = Σᵢ₌₁ᵏ λᵢ. Ratio = Σᵢ₌₁ᵏ λᵢ / Σᵢ₌₁ⁿ λᵢ. Le "coude" de la courbe des valeurs propres (scree plot) indique où la variance marginale devient faible. Règle courante : garder 95% de variance expliquée.',
        sourceNote: 'PCA — analyse en composantes principales.',
      },
      {
        id: 'p2_0104_005',
        type: 'proof_gap',
        difficulty: 5,
        instruction: 'Pour une matrice symétrique A, démontre que deux vecteurs propres associés à des valeurs propres distinctes λ₁ ≠ λ₂ sont orthogonaux.',
        steps: [
          {
            step: 1,
            statement: 'Av₁ = λ₁v₁ et Av₂ = λ₂v₂. Calculer v₂ᵀ(Av₁) = ...',
            correctFill: 'v₂ᵀ(λ₁v₁) = λ₁(v₂ᵀv₁)',
          },
          {
            step: 2,
            statement: 'Calculer (Av₂)ᵀv₁ en utilisant la symétrie A = Aᵀ',
            correctFill: '(Av₂)ᵀv₁ = v₂ᵀAᵀv₁ = v₂ᵀAv₁ = λ₁(v₂ᵀv₁)  (même chose)',
          },
          {
            step: 3,
            statement: 'D\'un autre côté, (Av₂)ᵀv₁ = (λ₂v₂)ᵀv₁ = ...',
            correctFill: 'λ₂(v₂ᵀv₁)',
          },
          {
            step: 4,
            statement: 'Donc λ₁(v₂ᵀv₁) = λ₂(v₂ᵀv₁). Comme λ₁ ≠ λ₂, on conclut :',
            correctFill: 'v₂ᵀv₁ = 0, donc v₁ ⊥ v₂  ∎',
          },
        ],
        conclusion: 'Les vecteurs propres de matrices symétriques sont orthogonaux → la base de composantes principales est orthogonale → les composantes principales sont décorrélées.',
        sourceNote: 'Théorème spectral — Strang, Introduction to Linear Algebra, Theorem 6.4.',
      },
      {
        id: 'p2_0104_006',
        type: 'mcq',
        difficulty: 5,
        question: 'L\'initialisation orthogonale des matrices de poids dans un RNN consiste à initialiser Wₕₕ avec une matrice orthogonale. Quel est le lien avec les valeurs propres ?',
        options: [
          'Une matrice orthogonale a toutes ses valeurs propres réelles égales à 1',
          'Une matrice orthogonale a des valeurs singulières = 1, donc ‖Wₕₕ‖₂ = 1 et les valeurs propres sont sur le cercle unitaire |λ| ≤ 1',
          'Une matrice orthogonale a un déterminant = 0',
          'Une matrice orthogonale n\'a pas de valeurs propres',
        ],
        correctIndex: 1,
        explanation:
          'Pour une matrice orthogonale Q : QᵀQ = I → valeurs singulières σᵢ = 1. Les valeurs propres peuvent être complexes mais satisfont |λᵢ| = 1 (sur le cercle unitaire). Cela garantit que ‖Qᵏ‖ = ‖Q‖ᵏ ne croît ni ne décroît → gradient stable sur de nombreux pas de temps. Saxe et al. 2013 ont démontré les avantages de cette initialisation.',
        sourceNote: 'Saxe et al. 2013, "Exact solutions to the nonlinear dynamics of learning in deep linear neural networks".',
      },
    ],
  },
};
