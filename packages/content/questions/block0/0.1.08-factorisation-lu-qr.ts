// packages/content/questions/block0/0.1.08-factorisation-lu-qr.ts
import { ConceptQuestionSet } from '../../types';

export const factorisationLUQR: ConceptQuestionSet = {
  conceptId: '0.1.08',
  conceptName: 'Factorisation LU & QR',
  module: '0.1',
  block: 0,

  phase1: {
    targetCount: 6,
    questions: [
      {
        id: 'p1_0108_001',
        type: 'mcq',
        difficulty: 1,
        question: 'La factorisation LU décompose une matrice carrée A en A = LU où :',
        options: [
          'L est orthogonale, U est la matrice de permutation',
          'L est triangulaire inférieure avec des 1 sur la diagonale, U est triangulaire supérieure',
          'L et U sont toutes les deux symétriques',
          'L est diagonale, U est quelconque',
        ],
        correctIndex: 1,
        explanation:
          'LU : L (Lower) est triangulaire inférieure avec 1 sur la diagonale, U (Upper) est triangulaire supérieure. Avantage : résoudre Ax = b via LUx = b → Ly = b (substitution avant, O(n²)) puis Ux = y (substitution arrière, O(n²)). La factorisation LU coûte O(n³) mais une fois calculée, chaque nouveau b ne coûte que O(n²).',
      },
      {
        id: 'p1_0108_002',
        type: 'mcq',
        difficulty: 2,
        question: 'Pourquoi utilise-t-on la factorisation LU avec pivoting partiel (PA = LU, P = matrice de permutation) en pratique ?',
        options: [
          'Pour garantir que L et U ont le même déterminant',
          'Pour éviter la division par zéro et améliorer la stabilité numérique',
          'Pour réduire la complexité de O(n³) à O(n²)',
          'Pour que les facteurs L et U soient symétriques',
        ],
        correctIndex: 1,
        explanation:
          'Sans pivoting, si un pivot (élément diagonal de U) est zéro ou très petit, la factorisation échoue (division par zéro) ou amplifie les erreurs d\'arrondi. Le pivoting partiel : à chaque étape, échange les lignes pour placer le plus grand élément (en valeur absolue) sur la diagonale → évite les petits pivots → stabilité numérique.',
      },
      {
        id: 'p1_0108_003',
        type: 'mcq',
        difficulty: 2,
        question: 'La factorisation QR est préférée à la LU pour résoudre les problèmes de moindres carrés car :',
        options: [
          'QR est plus rapide (O(n²) vs O(n³))',
          'QR évite le carré du conditionnement : cond(R) = cond(A), pas cond(A)²',
          'QR fonctionne uniquement pour les matrices carrées',
          'QR ne nécessite pas de pivoting',
        ],
        correctIndex: 1,
        explanation:
          'L\'équation normale AᵀAx = Aᵀb double le conditionnement : cond(AᵀA) = cond(A)². Si cond(A) = 10⁸ (grand mais gérable), cond(AᵀA) = 10¹⁶ ≈ précision machine en float64 → solution inutilisable. QR travaille avec A directement : cond(R) = cond(A). Règle pratique en ML : utiliser scipy.linalg.lstsq (via QR), pas (XᵀX)⁻¹Xᵀy.',
      },
      {
        id: 'p1_0108_004',
        type: 'truefalse',
        difficulty: 2,
        statement: 'La factorisation de Cholesky A = LLᵀ est applicable à toute matrice carrée.',
        isTrue: false,
        justificationRequired: false,
        explanation:
          'Faux. Cholesky s\'applique uniquement aux matrices symétriques définies positives (SDP). Pour une SDP, Cholesky est deux fois plus efficace que LU (exploite la symétrie). Application clé : matrices de covariance, noyaux (Gram matrices) dans les SVMs. Si vous essayez Cholesky sur une non-SDP → erreur (racine carrée d\'un nombre négatif).',
      },
      {
        id: 'p1_0108_005',
        type: 'mcq',
        difficulty: 3,
        question: 'Dans scikit-learn, LinearRegression utilise np.linalg.lstsq qui est basé sur la SVD. Pourquoi la SVD plutôt que QR ou LU pour la régression linéaire générale ?',
        options: [
          'La SVD est plus rapide que QR pour les petites matrices',
          'La SVD gère automatiquement les matrices de rang déficient (multicolinéarité) via la pseudo-inverse',
          'La SVD n\'a pas besoin de pivoting',
          'La SVD est implémentée en FORTRAN pur',
        ],
        correctIndex: 1,
        explanation:
          'QR échoue si X n\'est pas de rang plein (colonnes linéairement dépendantes — multicolinéarité). La SVD calcule automatiquement la pseudo-inverse de Moore-Penrose A⁺ = VΣ⁺Uᵀ (met 0 là où σᵢ ≈ 0). La solution β̂ = A⁺b est la solution de moindre norme parmi toutes les solutions de moindres carrés. C\'est la plus robuste pour X mal conditionné.',
        sourceNote: 'numpy.linalg.lstsq utilise la SVD (LAPACK dgelsd).',
      },
      {
        id: 'p1_0108_006',
        type: 'mcq',
        difficulty: 3,
        question: 'La décomposition de Cholesky d\'une matrice de covariance C = LLᵀ est utilisée pour générer des échantillons d\'une distribution N(μ, C). Le procédé est :',
        options: [
          'Générer z ~ N(0,I), puis calculer x = μ + Lz',
          'Générer z ~ N(0,C), puis soustraire μ',
          'Générer x ~ N(0,I), puis multiplier par C',
          'Générer z ~ N(0,I), puis calculer x = μ + L⁻¹z',
        ],
        correctIndex: 0,
        explanation:
          'Si z ~ N(0,I), alors Lz ~ N(0, LLᵀ) = N(0,C). Donc x = μ + Lz ~ N(μ, C). C\'est la méthode standard pour échantillonner des distributions gaussiennes multivariées. Application : VAE (Variational Autoencoders), génération de données synthétiques corrélées.',
      },
    ],
  },

  phase2: {
    targetCount: 5,
    questions: [
      {
        id: 'p2_0108_001',
        type: 'mcq',
        difficulty: 4,
        question: 'La complexité de la factorisation LU d\'une matrice n×n est O(n³/3) opérations flottantes. Pour un système avec n = 10 000, combien de FLOPS sont nécessaires approximativement ?',
        options: [
          '10⁸ FLOPS',
          '3.3 × 10¹¹ FLOPS',
          '10¹² FLOPS',
          '10⁶ FLOPS',
        ],
        correctIndex: 1,
        explanation:
          '(10⁴)³/3 = 10¹²/3 ≈ 3.3 × 10¹¹ FLOPS. Un GPU moderne (ex: A100) fait ≈ 10¹³ FLOPS → résolution en ≈ 0.03 secondes. Un CPU (10¹¹ FLOPS/s) : ≈ 3 secondes. Pour n = 100 000 : 3.3 × 10¹⁴ FLOPS → impraticable sur CPU, challengeant même sur GPU.',
        sourceNote: 'Complexité O(n³) — à connaître pour estimer les coûts computationnels.',
      },
      {
        id: 'p2_0108_002',
        type: 'truefalse',
        difficulty: 4,
        statement: 'Pour une matrice symétrique définie positive A, la factorisation de Cholesky A = LLᵀ et la factorisation LDLᵀ (où D est diagonale) sont identiques.',
        isTrue: false,
        justificationRequired: true,
        explanation:
          'Différentes. Cholesky : A = LLᵀ, L triangulaire inférieure avec entrées diagonales positives. LDLᵀ : L triangulaire inférieure avec 1 sur la diagonale, D diagonale avec entrées positives (SDP). Relation : si A = LDLᵀ, alors A = (L√D)(√DLᵀ) = L\'L\'ᵀ avec L\' = L√D. LDLᵀ est plus stable (évite les racines carrées) et s\'étend aux matrices semi-définies.',
      },
      {
        id: 'p2_0108_003',
        type: 'mcq',
        difficulty: 4,
        question: 'Le rang d\'une matrice A peut être calculé via la factorisation QR avec pivoting de colonnes (QR avec pivoting). Le rang est :',
        options: [
          'Le nombre de colonnes de A',
          'Le nombre d\'éléments diagonaux non-nuls de R (supérieurs à un seuil numérique)',
          'Le nombre de lignes de Q',
          'La dimension de l\'espace noyau',
        ],
        correctIndex: 1,
        explanation:
          'AP = QR avec P = matrice de permutation. Les éléments diagonaux de R sont décroissants : |R₁₁| ≥ |R₂₂| ≥ … ≥ |Rₙₙ|. Le rang numérique = nombre de |Rᵢᵢ| > ε (seuil de tolérance numérique, ex: ε = n·σ_machine·max|Rᵢᵢ|). C\'est la méthode utilisée par numpy.linalg.matrix_rank.',
        sourceNote: 'Rang numérique via QR — numpy.linalg.matrix_rank.',
      },
      {
        id: 'p2_0108_004',
        type: 'mcq',
        difficulty: 5,
        question: 'Le "QR algorithm" (différent de la factorisation QR) est l\'algorithme standard pour calculer les valeurs propres d\'une matrice dense. Il consiste à itérer :',
        options: [
          'Aₖ₊₁ = RₖQₖ (inverser l\'ordre Q et R à chaque étape)',
          'Aₖ₊₁ = QₖAₖQₖᵀ (conjugaison orthogonale)',
          'Aₖ₊₁ = AₖᵀAₖ (carré de la transposée)',
          'Aₖ₊₁ = Qₖ + Rₖ (somme des facteurs)',
        ],
        correctIndex: 0,
        explanation:
          'QR algorithm : factoriser Aₖ = QₖRₖ, puis Aₖ₊₁ = RₖQₖ. La séquence {Aₖ} converge vers une forme de Schur (quasi-triangulaire) dont les éléments diagonaux sont les valeurs propres. Complexité : O(n³) par itération, ~10-30 itérations pour converger. C\'est l\'algorithme utilisé par LAPACK (et donc NumPy/SciPy) pour numpy.linalg.eig.',
        sourceNote: 'QR algorithm — Francis 1961, implémenté dans LAPACK/numpy.linalg.eig.',
      },
      {
        id: 'p2_0108_005',
        type: 'mcq',
        difficulty: 5,
        question: 'En deep learning, la "QR decomposition" est utilisée implicitement dans l\'initialisation orthogonale (torch.nn.init.orthogonal_). L\'algorithme est :',
        options: [
          'Générer W aléatoirement, puis calculer W = QR, garder Q',
          'Générer W aléatoirement, puis calculer W ← W/‖W‖',
          'Initialiser W = I (matrice identité)',
          'Générer W à partir d\'une distribution uniforme sur les matrices orthogonales',
        ],
        correctIndex: 0,
        explanation:
          'torch.nn.init.orthogonal_(W) : (1) générer un tenseur aléatoire W ~ N(0,1), (2) calculer sa SVD ou QR, (3) garder Q (la partie orthogonale). Ainsi Q est uniformément distribuée sur le groupe orthogonal O(n) (mesure de Haar). Cette initialisation garantit ‖Wv‖ = ‖v‖ → pas d\'explosion/disparition du gradient au premier pas.',
        sourceNote: 'Saxe et al. 2013 — initialisation orthogonale pour les RNN et réseaux linéaires profonds.',
      },
    ],
  },
};
