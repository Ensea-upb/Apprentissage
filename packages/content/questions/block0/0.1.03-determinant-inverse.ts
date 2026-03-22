// packages/content/questions/block0/0.1.03-determinant-inverse.ts
import { ConceptQuestionSet } from '../../types';

export const determinantInverse: ConceptQuestionSet = {
  conceptId: '0.1.03',
  conceptName: 'Déterminant & matrice inverse',
  module: '0.1',
  block: 0,

  phase1: {
    targetCount: 8,
    questions: [
      {
        id: 'p1_0103_001',
        type: 'mcq',
        difficulty: 1,
        question: 'Le déterminant d\'une matrice 2×2 [[a,b],[c,d]] est :',
        options: ['a+d', 'ad+bc', 'ad-bc', 'ab+cd'],
        correctIndex: 2,
        explanation:
          'det([[a,b],[c,d]]) = ad - bc. Intuition géométrique : |det(A)| est l\'aire du parallélogramme formé par les colonnes de A. Si det(A) = 0 → les colonnes sont colinéaires → pas de parallélogramme → matrice non inversible.',
        commonMistake: 'Confondre avec la trace (a+d) ou utiliser ad+bc au lieu de ad-bc.',
      },
      {
        id: 'p1_0103_002',
        type: 'truefalse',
        difficulty: 2,
        statement: 'Une matrice A est inversible si et seulement si det(A) ≠ 0.',
        isTrue: true,
        justificationRequired: false,
        explanation:
          'Vrai. det(A) = 0 ⟺ les colonnes (ou lignes) sont linéairement dépendantes ⟺ rang(A) < n ⟺ A est singulière (non inversible). En ML : si XᵀX est singulière (det = 0), la régression linéaire n\'a pas de solution unique → ridge regression (XᵀX + λI) rend la matrice inversible.',
      },
      {
        id: 'p1_0103_003',
        type: 'mcq',
        difficulty: 2,
        question: 'Si A est inversible, A⁻¹ satisfait :',
        options: [
          'A⁻¹ + A = I',
          'A⁻¹ · A = A · A⁻¹ = I',
          'A⁻¹ = -A',
          'det(A⁻¹) = det(A)',
        ],
        correctIndex: 1,
        explanation:
          'A⁻¹A = AA⁻¹ = I (matrice identité). Propriétés utiles : (AB)⁻¹ = B⁻¹A⁻¹ (ordre inversé), (Aᵀ)⁻¹ = (A⁻¹)ᵀ, det(A⁻¹) = 1/det(A).',
      },
      {
        id: 'p1_0103_004',
        type: 'mcq',
        difficulty: 2,
        question: 'Géométriquement, det(A) = 2 pour une transformation linéaire A : ℝ² → ℝ². Que signifie ce déterminant ?',
        options: [
          'La transformation A double les aires (multiplie les surfaces par 2)',
          'La transformation A double toutes les longueurs',
          'La transformation A a exactement 2 vecteurs propres',
          'La transformation A est une rotation d\'angle 2 radians',
        ],
        correctIndex: 0,
        explanation:
          'Le déterminant mesure le facteur de changement de volume (aire en 2D, volume en 3D). det(A) = 2 → A multiplie les aires par 2. det(A) < 0 → A inverse l\'orientation (flip). det(A) = 0 → A écrase vers une dimension inférieure (projection, non inversible).',
      },
      {
        id: 'p1_0103_005',
        type: 'mcq',
        difficulty: 3,
        question: 'Pourquoi la méthode de Gauss-Jordan est-elle préférée à la formule de Cramer pour inverser une matrice n×n en pratique ?',
        options: [
          'Cramer\'s rule exige plus de mémoire',
          'Gauss-Jordan est O(n³) vs Cramer O(n!) — bien plus efficace pour n > 3',
          'Cramer ne fonctionne que pour les matrices symétriques',
          'Gauss-Jordan donne une réponse exacte, Cramer est approximatif',
        ],
        correctIndex: 1,
        explanation:
          'La règle de Cramer calcule n+1 déterminants d\'ordre n, chacun coûtant O(n!) → complexité totale O(n·n!) ≈ exponentielle. Gauss-Jordan (élimination) est O(n³) via les opérations élémentaires sur les lignes. Pour n=10 : Cramer ≈ 10! = 3.6M opérations vs Gauss-Jordan ≈ 1000.',
      },
      {
        id: 'p1_0103_006',
        type: 'truefalse',
        difficulty: 3,
        statement: 'Une matrice carrée A peut être non-inversible même si toutes ses entrées sont non-nulles.',
        isTrue: true,
        justificationRequired: true,
        explanation:
          'Vrai. Exemple : A = [[1,2],[2,4]]. Toutes les entrées sont non-nulles, mais la ligne 2 = 2 × ligne 1 → lignes linéairement dépendantes → det(A) = 1·4 - 2·2 = 0 → non inversible. La non-inversibilité dépend des relations linéaires entre lignes/colonnes, pas de la nullité des entrées individuelles.',
      },
      {
        id: 'p1_0103_007',
        type: 'mcq',
        difficulty: 3,
        question: 'Dans Ridge Regression, on résout (XᵀX + λI)β = Xᵀy. Pourquoi ajouter λI garantit-il l\'inversibilité ?',
        options: [
          'Parce que λI augmente toutes les valeurs propres de λ, donc elles restent toutes positives (> 0)',
          'Parce que λI change le rang de la matrice',
          'Parce que λI rend XᵀX symétrique',
          'Parce que λI rend les colonnes orthogonales',
        ],
        correctIndex: 0,
        explanation:
          'Si XᵀX a des valeurs propres {σ₁², σ₂², …}, alors XᵀX + λI a des valeurs propres {σ₁² + λ, σ₂² + λ, …}. Pour λ > 0, toutes sont > 0 → det > 0 → inversible. La régularisation Ridge est exactement cela : "forcer" l\'inversibilité en décalant les valeurs propres vers le haut.',
        sourceNote: 'Ridge regression — connexion directe à l\'inversibilité des matrices.',
      },
      {
        id: 'p1_0103_008',
        type: 'mcq',
        difficulty: 3,
        question: 'det(AB) = ?',
        options: [
          'det(A) + det(B)',
          'det(A) · det(B)',
          'det(A) / det(B)',
          'det(AᵀBᵀ)',
        ],
        correctIndex: 1,
        explanation:
          'det(AB) = det(A)·det(B) — le déterminant du produit est le produit des déterminants. Conséquences : det(A⁻¹) = 1/det(A), det(Aⁿ) = det(A)ⁿ. Cette propriété est la raison pour laquelle les transformations qui conservent les volumes (det = ±1) comme les rotations et réflexions forment des groupes.',
      },
    ],
  },

  phase2: {
    targetCount: 6,
    questions: [
      {
        id: 'p2_0103_001',
        type: 'numerical',
        difficulty: 4,
        latexQuestion: `Calcule le déterminant de $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 1 & 3 & 2 \\\\ 0 & 2 & 1 \\end{pmatrix}$ par développement selon la première ligne.`,
        solution: {
          step1: 'Cofacteur de 2 (pos [0,0]) : det([[3,2],[2,1]]) = 3·1 - 2·2 = -1',
          step2: 'Cofacteur de 1 (pos [0,1]) : -det([[1,2],[0,1]]) = -(1·1 - 2·0) = -1',
          step3: 'Cofacteur de 0 (pos [0,2]) : det([[1,3],[0,2]]) = 2 (mais multiplié par 0)',
          step4: 'det(A) = 2·(-1) + 1·(-1) + 0 = -2 - 1 = -3',
          result: 'det(A) = -3',
        },
        tolerance: 0,
        explanation:
          'Développement selon la 1ère ligne : det(A) = Σⱼ (-1)^{0+j} A₀ⱼ · M₀ⱼ. Le signe (-1)^{i+j} alterne en damier. det(A) = -3 < 0 → la transformation inverse l\'orientation.',
      },
      {
        id: 'p2_0103_002',
        type: 'formula_completion',
        difficulty: 4,
        latex_question: `L'inverse d'une matrice 2×2 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ est : $A^{-1} = \\frac{1}{\\boxed{?}} \\begin{pmatrix} \\boxed{?} & \\boxed{?} \\\\ \\boxed{?} & \\boxed{?} \\end{pmatrix}$`,
        correctLatex: ['ad-bc', 'd', '-b', '-c', 'a'],
        explanation:
          'A⁻¹ = 1/(ad-bc) · [[d, -b], [-c, a]]. La matrice est la "cofacteur transposée" (adjointe) de A. On échange les éléments diagonaux (a↔d) et on change le signe des anti-diagonaux (b→-b, c→-c). Valide uniquement si det(A) = ad-bc ≠ 0.',
        sourceNote: 'Formule d\'inversion 2×2 — à connaître par cœur.',
      },
      {
        id: 'p2_0103_003',
        type: 'mcq',
        difficulty: 4,
        question: 'Les valeurs propres de A⁻¹ (si A est inversible avec valeurs propres λ₁, …, λₙ) sont :',
        options: [
          '-λ₁, …, -λₙ',
          '1/λ₁, …, 1/λₙ',
          'λ₁², …, λₙ²',
          'Les mêmes λ₁, …, λₙ',
        ],
        correctIndex: 1,
        explanation:
          'Si Av = λv, alors A⁻¹v = (1/λ)v. Preuve : multiplier des deux côtés par A⁻¹ : v = λA⁻¹v → A⁻¹v = v/λ. Les vecteurs propres sont identiques ; les valeurs propres sont inversées. Implication : si A a une petite valeur propre λ ≈ 0, alors A⁻¹ a une valeur propre 1/λ ≫ 1 → A⁻¹ amplifie les directions presque nulles.',
        sourceNote: 'Connexion valeurs propres / inverse — essentiel pour comprendre la pseudo-inverse et la régularisation.',
      },
      {
        id: 'p2_0103_004',
        type: 'mcq',
        difficulty: 5,
        question: 'La pseudo-inverse de Moore-Penrose A⁺ est définie pour toute matrice A (même non-carrée). Pour une matrice A de rang plein en colonnes, A⁺ = ?',
        options: [
          '(AᵀA)⁻¹Aᵀ',
          'Aᵀ(AAᵀ)⁻¹',
          '(AᵀA)⁻¹',
          'Aᵀ',
        ],
        correctIndex: 0,
        explanation:
          'Si A ∈ ℝ^{m×n} avec rang(A) = n (rang plein en colonnes, m ≥ n), alors A⁺ = (AᵀA)⁻¹Aᵀ. C\'est exactement le terme de la régression linéaire ! A⁺ est le "gauche-inverse" : A⁺A = I. Utilisé pour résoudre les systèmes sur-déterminés (plus d\'équations que d\'inconnues).',
        sourceNote: 'Pseudo-inverse — au cœur de la régression linéaire et de la SVD.',
      },
      {
        id: 'p2_0103_005',
        type: 'truefalse',
        difficulty: 5,
        statement: 'Le conditionnement d\'une matrice cond(A) = ‖A‖·‖A⁻¹‖ mesure la sensibilité aux perturbations. Un cond(A) élevé indique une matrice bien conditionnée.',
        isTrue: false,
        justificationRequired: true,
        explanation:
          'Faux. Un cond(A) élevé indique une matrice MAL conditionnée. Si cond(A) ≈ 10^k, une erreur relative ε dans les données peut amplifier l\'erreur dans la solution d\'un facteur ≈ 10^k. Pour la norme spectrale : cond(A) = σ_max/σ_min (ratio des valeurs singulières extrêmes). Un cond proche de 1 → bien conditionné → stable numériquement.',
        sourceNote: 'Conditionnement — crucial pour la stabilité numérique des algorithmes ML.',
      },
      {
        id: 'p2_0103_006',
        type: 'mcq',
        difficulty: 5,
        question: 'Soit A ∈ ℝ^{n×n} avec det(A) = 0. Laquelle de ces propriétés est VRAIE ?',
        options: [
          'Il n\'existe aucun vecteur non-nul x tel que Ax = 0',
          'L\'équation Ax = b a toujours une solution unique pour tout b',
          'Il existe un vecteur non-nul x tel que Ax = 0 (noyau non trivial)',
          'La trace de A est nécessairement 0',
        ],
        correctIndex: 2,
        explanation:
          'det(A) = 0 ⟺ A est singulière ⟺ Ax = 0 a des solutions non triviales ⟺ ker(A) ≠ {0} (noyau non trivial). Ces solutions sont les "directions écrasées" par A. En ML : si la feature matrix X a un noyau non trivial, plusieurs β peuvent donner la même prédiction Xβ — le problème est sous-déterminé.',
      },
    ],
  },
};
