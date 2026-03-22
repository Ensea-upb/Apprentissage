// packages/content/questions/block0/0.1.06-produit-scalaire.ts
import { ConceptQuestionSet } from '../../types';

export const produitScalaire: ConceptQuestionSet = {
  conceptId: '0.1.06',
  conceptName: 'Produit scalaire & normes',
  module: '0.1',
  block: 0,

  phase1: {
    targetCount: 10,
    questions: [
      {
        id: 'p1_0106_001',
        type: 'mcq',
        difficulty: 1,
        question: 'Le produit scalaire (dot product) de deux vecteurs u·v = 0 signifie que :',
        options: [
          'Les deux vecteurs sont parallèles',
          'Les deux vecteurs sont orthogonaux (perpendiculaires)',
          'Les deux vecteurs sont identiques',
          'L\'un des vecteurs est le vecteur nul',
        ],
        correctIndex: 1,
        explanation:
          'u·v = ‖u‖·‖v‖·cos(θ). Si u·v = 0 et que ni u ni v ne sont nuls, alors cos(θ) = 0 → θ = 90° → vecteurs orthogonaux. C\'est la définition de l\'orthogonalité en algèbre linéaire.',
        commonMistake: 'u·v = 0 n\'implique pas que l\'un des vecteurs est nul — les deux peuvent être non-nuls mais perpendiculaires.',
      },
      {
        id: 'p1_0106_002',
        type: 'mcq',
        difficulty: 2,
        question: 'Dans un moteur de recommandation, la similarité cosinus entre deux vecteurs d\'utilisateur est haute (proche de 1). Cela signifie :',
        options: [
          'Les deux utilisateurs ont les mêmes habitudes (vecteurs de même direction)',
          'Les deux utilisateurs ont exactement les mêmes achats',
          'Les vecteurs sont orthogonaux',
          'Les utilisateurs ont des goûts opposés',
        ],
        correctIndex: 0,
        explanation:
          'cos(θ) = u·v / (‖u‖·‖v‖). Valeur proche de 1 → θ ≈ 0° → même direction → profils similaires. La similarité cosinus ne mesure pas la magnitude des vecteurs (achats absolus) mais leur direction (profil relatif de préférences).',
      },
      {
        id: 'p1_0106_003',
        type: 'mcq',
        difficulty: 2,
        question: 'Le produit scalaire est une opération qui produit :',
        options: [
          'Un vecteur de même dimension que les opérandes',
          'Une matrice',
          'Un scalaire (nombre réel)',
          'Un vecteur de dimension 1',
        ],
        correctIndex: 2,
        explanation:
          'u·v = Σᵢ uᵢvᵢ — la somme de produits terme-à-terme est un nombre réel (scalaire), d\'où le nom "produit scalaire". À distinguer du produit vectoriel (cross product) qui produit un vecteur, uniquement défini en ℝ³.',
      },
      {
        id: 'p1_0106_004',
        type: 'truefalse',
        difficulty: 2,
        statement: 'La norme d\'un vecteur peut être négative.',
        isTrue: false,
        justificationRequired: false,
        explanation:
          'Non. Par définition ‖v‖ = √(Σᵢ vᵢ²) ≥ 0. La norme est toujours positive ou nulle (zéro uniquement si v = 0). C\'est l\'un des axiomes des espaces métriques : d(x,y) ≥ 0.',
      },
      {
        id: 'p1_0106_005',
        type: 'mcq',
        difficulty: 3,
        question: 'En NLP, deux mots ont des embeddings e₁ et e₂ avec e₁·e₂ = 0.95·‖e₁‖·‖e₂‖. Que peut-on en conclure ?',
        options: [
          'Les mots sont sémantiquement très proches (angle ~18°)',
          'Les mots sont antonymes (sens opposés)',
          'Les mots sont sémantiquement indépendants',
          'Les mots sont identiques',
        ],
        correctIndex: 0,
        explanation:
          'e₁·e₂ = 0.95·‖e₁‖·‖e₂‖ → cos(θ) = 0.95 → θ = arccos(0.95) ≈ 18°. Angle très faible → direction similaire → mots sémantiquement proches (ex: "roi" et "reine" dans Word2Vec). Pour des mots opposés, cos(θ) < 0 (angle > 90°).',
      },
      {
        id: 'p1_0106_006',
        type: 'analogy',
        difficulty: 2,
        template: 'Le produit scalaire u·v est à l\'orthogonalité ce que ___ est à ___',
        correctAnswer: 'une corrélation est à l\'indépendance',
        alternatives: [
          'un thermomètre est à zéro degré',
          'une balance est à l\'équilibre',
        ],
        explanation:
          'Produit scalaire = 0 ⟺ vecteurs orthogonaux. Corrélation = 0 ⟺ variables (linéairement) indépendantes. Les deux mesurent une relation entre deux objets — et zéro indique "aucune relation".',
      },
      {
        id: 'p1_0106_007',
        type: 'mcq',
        difficulty: 3,
        question: 'Pourquoi la norme L1 (‖v‖₁ = Σ|vᵢ|) favorise-t-elle la sparsité des poids en ML, contrairement à la norme L2 ?',
        options: [
          'Parce que la L1 est plus facile à calculer',
          'Parce que le contour de la boule L1 est un losange avec des coins sur les axes — la solution tend à "toucher" un coin où certains vᵢ = 0',
          'Parce que L1 a une dérivée partout définie, contrairement à L2',
          'Parce que L1 pénalise les grands poids plus sévèrement que L2',
        ],
        correctIndex: 1,
        explanation:
          'Géométriquement : la boule L1 est un losange (coins sur les axes). La solution du problème de régularisation tend à se trouver sur un coin → certaines coordonnées = 0 → sparsité (Lasso). La boule L2 est une sphère (pas de coins), la solution tombe rarement exactement à 0 (Ridge).',
      },
      {
        id: 'p1_0106_008',
        type: 'mcq',
        difficulty: 3,
        question: 'Dans un réseau de neurones, le calcul d\'une couche dense est h = σ(Wx + b). La partie Wx correspond à :',
        options: [
          'Un produit élément par élément (Hadamard)',
          'Des produits scalaires entre les lignes de W et le vecteur x',
          'Une addition vecteur-matrice',
          'Un produit vectoriel (cross product)',
        ],
        correctIndex: 1,
        explanation:
          'Wx : la matrice W ∈ ℝ^{d_out × d_in}, x ∈ ℝ^{d_in}. Chaque neurone i calcule hᵢ = wᵢ·x + bᵢ où wᵢ est la ligne i de W. C\'est un produit scalaire (dot product) entre les poids du neurone et le vecteur d\'entrée — la brique fondamentale de tout réseau dense.',
      },
      {
        id: 'p1_0106_009',
        type: 'truefalse',
        difficulty: 3,
        statement: 'Pour deux vecteurs u et v, |u·v| ≤ ‖u‖·‖v‖ (inégalité de Cauchy-Schwarz). Cette inégalité est toujours vraie même si u ou v est le vecteur nul.',
        isTrue: true,
        justificationRequired: true,
        explanation:
          'Vrai. L\'inégalité de Cauchy-Schwarz |u·v| ≤ ‖u‖·‖v‖ est toujours vraie. Si u = 0 : |0·v| = 0 ≤ 0·‖v‖ = 0 ✓. Si ni u ni v n\'est nul : |u·v| = ‖u‖·‖v‖·|cos(θ)| ≤ ‖u‖·‖v‖ car |cos(θ)| ≤ 1. L\'égalité est atteinte quand u et v sont colinéaires.',
        sourceNote: 'Inégalité de Cauchy-Schwarz — fondement de la définition de l\'angle entre vecteurs.',
      },
      {
        id: 'p1_0106_010',
        type: 'mcq',
        difficulty: 4,
        question: 'La similarité cosinus et le produit scalaire brut donnent le même classement dans un moteur de recherche si :',
        options: [
          'Jamais — ils produisent toujours des classements différents',
          'Toujours — les deux sont équivalents',
          'Uniquement si tous les vecteurs sont normalisés (‖v‖ = 1)',
          'Uniquement si les vecteurs sont en dimension 2',
        ],
        correctIndex: 2,
        explanation:
          'cos(u,v) = u·v / (‖u‖·‖v‖). Si tous les vecteurs sont normalisés (‖v‖ = 1 pour tout v), alors cos(u,v) = u·v. Le classement par similarité cosinus = classement par produit scalaire. C\'est pourquoi les embeddings dans la plupart des systèmes de recherche (FAISS, Pinecone) sont normalisés avant l\'indexation.',
      },
    ],
  },

  phase2: {
    targetCount: 8,
    questions: [
      {
        id: 'p2_0106_001',
        type: 'formula_completion',
        difficulty: 4,
        latex_question: `Le produit scalaire de $u, v \\in \\mathbb{R}^n$ est défini par : $u \\cdot v = \\boxed{?} = \\|u\\|_2 \\cdot \\|v\\|_2 \\cdot \\boxed{?}$`,
        correctLatex: ['\\sum_{i=1}^{n} u_i v_i', '\\cos(\\theta)'],
        explanation:
          'Deux formes équivalentes : (1) algébrique : u·v = Σᵢ uᵢvᵢ ; (2) géométrique : u·v = ‖u‖·‖v‖·cos(θ) où θ est l\'angle entre u et v. L\'équivalence définit l\'angle : cos(θ) = u·v / (‖u‖·‖v‖).',
        sourceNote: 'Définition standard — voir Strang, Introduction to Linear Algebra.',
      },
      {
        id: 'p2_0106_002',
        type: 'numerical',
        difficulty: 4,
        latexQuestion: `Calcule $u \\cdot v$ et $\\cos(\\theta)$ pour $u = [1, 2, 3]^\\top$ et $v = [4, 0, -2]^\\top$.`,
        solution: {
          step1: 'u·v = 1·4 + 2·0 + 3·(-2) = 4 + 0 - 6 = -2',
          step2: '‖u‖ = √(1+4+9) = √14 ≈ 3.742',
          step3: '‖v‖ = √(16+0+4) = √20 ≈ 4.472',
          step4: 'cos(θ) = -2 / (√14 · √20) = -2 / √280 ≈ -0.1195',
          result: 'u·v = -2, cos(θ) ≈ -0.120, θ ≈ 96.9°',
        },
        tolerance: 0.01,
        explanation:
          'u·v = -2 (négatif → angle obtus, vecteurs "légèrement opposés"). θ ≈ 97° > 90° confirme que les vecteurs pointent dans des directions plus opposées que parallèles.',
      },
      {
        id: 'p2_0106_003',
        type: 'mcq',
        difficulty: 4,
        question: 'La projection orthogonale de u sur v est donnée par proj_v(u) = ? En dimension 1D, qu\'est-ce que cela représente ?',
        options: [
          'u·v, la composante de u dans la direction de v (scalaire)',
          '(u·v / ‖v‖²)·v, le vecteur composante de u dans la direction de v',
          '‖u‖·cos(θ), un scalaire représentant la longueur projetée',
          'u × v, le produit vectoriel',
        ],
        correctIndex: 1,
        explanation:
          'proj_v(u) = (u·v / ‖v‖²)·v. C\'est un vecteur dans la direction de v. Sa magnitude est |u·v|/‖v‖ = ‖u‖·|cos(θ)|. La projection scalaire (composante) est u·v̂ = u·v/‖v‖ où v̂ = v/‖v‖ est v normalisé. Ces deux formes sont souvent confondues.',
        sourceNote: 'Projection — utilisée dans Gram-Schmidt, PCA (projection sur composantes principales).',
      },
      {
        id: 'p2_0106_004',
        type: 'proof_gap',
        difficulty: 5,
        instruction: 'Démontre que ‖u + v‖² = ‖u‖² + 2(u·v) + ‖v‖² (règle du parallélogramme)',
        steps: [
          {
            step: 1,
            statement: '‖u + v‖² = (u + v)·(u + v) = ...',
            correctFill: 'u·u + u·v + v·u + v·v  (bilinéarité du produit scalaire)',
          },
          {
            step: 2,
            statement: 'u·u = ___ et v·v = ___ (définition de la norme)',
            correctFill: '‖u‖²  et  ‖v‖²',
          },
          {
            step: 3,
            statement: 'u·v + v·u = ___ (symétrie du produit scalaire réel)',
            correctFill: '2(u·v)',
          },
          {
            step: 4,
            statement: 'Donc ‖u + v‖² = ___',
            correctFill: '‖u‖² + 2(u·v) + ‖v‖²  ∎',
          },
        ],
        conclusion: 'Cette identité généralise (a+b)² = a²+2ab+b² aux vecteurs. Elle donne l\'inégalité triangulaire : ‖u+v‖ ≤ ‖u‖ + ‖v‖ (car 2(u·v) ≤ 2‖u‖·‖v‖ par Cauchy-Schwarz).',
        sourceNote: 'Identité de polarisation — fondamentale pour les espaces de Hilbert.',
      },
      {
        id: 'p2_0106_005',
        type: 'mcq',
        difficulty: 4,
        question: 'La norme de Frobenius d\'une matrice A ∈ ℝ^{m×n} est définie comme ‖A‖_F = ? Quelle est son interprétation ?',
        options: [
          '√(Σᵢⱼ Aᵢⱼ²) — racine carrée de la somme de tous les éléments au carré',
          'max|Aᵢⱼ| — l\'élément de plus grande valeur absolue',
          'Σᵢ |λᵢ| — somme des valeurs absolues des valeurs propres',
          'rang(A) — le nombre de valeurs singulières non-nulles',
        ],
        correctIndex: 0,
        explanation:
          '‖A‖_F = √(Σᵢ Σⱼ Aᵢⱼ²) = √(trace(AᵀA)) = √(Σᵢ σᵢ²) où σᵢ sont les valeurs singulières. C\'est la norme L2 de la matrice "vectorisée". En ML : ‖W‖_F² est le terme de régularisation L2 (weight decay) sur les poids d\'un réseau.',
        sourceNote: 'Norme de Frobenius — utilisée dans la régularisation de matrices (matrix factorization, weight decay).',
      },
      {
        id: 'p2_0106_006',
        type: 'mcq',
        difficulty: 5,
        question: 'La distance cosinus est-elle une métrique (satisfait-elle les axiomes d\'une distance) ?',
        options: [
          'Oui — elle satisfait toujours la symétrie, la positivité et l\'inégalité triangulaire',
          'Non — la similarité cosinus peut être convertie en distance (1 - cos), mais 1-cos ne satisfait pas l\'inégalité triangulaire',
          'Non — la similarité cosinus peut être négative',
          'Oui — mais uniquement pour les vecteurs normalisés',
        ],
        correctIndex: 1,
        explanation:
          'La "distance cosinus" d = 1 - cos(u,v) ∈ [0, 2] satisfait la symétrie et d(u,u)=0, mais ne satisfait PAS l\'inégalité triangulaire en général. Pour obtenir une vraie métrique, on peut utiliser d = arccos(cos(u,v)) (distance angulaire), qui est une vraie métrique sur la sphère unitaire.',
        sourceNote: 'Propriétés métriques — important pour choisir la bonne mesure de similarité dans les algorithmes de clustering.',
      },
      {
        id: 'p2_0106_007',
        type: 'mcq',
        difficulty: 5,
        question: 'En PyTorch, quel code calcule le produit scalaire de deux vecteurs a et b de dimension 512 ?',
        options: [
          'torch.cross(a, b)',
          'torch.dot(a, b)',
          'a * b  (produit Hadamard)',
          'torch.matmul(a, b)',
        ],
        correctIndex: 1,
        explanation:
          'torch.dot(a, b) pour des vecteurs 1D. torch.matmul(a, b) fonctionne aussi pour des vecteurs 1D (donne un scalaire). a*b est le produit élément-par-élément (Hadamard), résultat = vecteur 512D. Pour des batches : torch.bmm ou (a.unsqueeze(0) @ b.unsqueeze(-1)).squeeze().',
        sourceNote: 'API PyTorch — torch.dot, torch.matmul, torch.einsum.',
      },
      {
        id: 'p2_0106_008',
        type: 'truefalse',
        difficulty: 5,
        statement: 'Dans un Transformer, le score d\'attention entre la Query q et la Key k est calculé comme q·k / √d_k. La division par √d_k est uniquement une normalisation numérique sans justification probabiliste.',
        isTrue: false,
        justificationRequired: true,
        explanation:
          'Faux. La division par √d_k a une justification statistique précise : si q, k ∈ ℝ^{d_k} ont des composantes i.i.d. N(0,1), alors Var(q·k) = d_k. Sans division, pour d_k grand, les scores ont une variance ≈ d_k → softmax saturé (une valeur → 1, les autres → 0) → gradient vanishing. Diviser par √d_k ramène Var = 1 quelle que soit la dimension. (Vaswani et al. 2017, footnote 4).',
        sourceNote: 'Vaswani et al. 2017, Section 3.2.1 et footnote 4.',
      },
    ],
  },
};
