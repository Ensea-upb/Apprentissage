// packages/content/questions/block0/0.1.05-svd.ts
import { ConceptQuestionSet } from '../../types';

export const svd: ConceptQuestionSet = {
  conceptId: '0.1.05',
  conceptName: 'Décomposition SVD',
  module: '0.1',
  block: 0,

  phase1: {
    targetCount: 8,
    questions: [
      {
        id: 'p1_0105_001',
        type: 'mcq',
        difficulty: 1,
        question: 'La SVD (Singular Value Decomposition) décompose toute matrice A en :',
        options: [
          'A = LDU  (triangulaire inférieure × diagonale × triangulaire supérieure)',
          'A = QR  (orthogonale × triangulaire supérieure)',
          'A = UΣVᵀ  (orthogonale × diagonale × orthogonale transposée)',
          'A = PDP⁻¹  (diagonalisation)',
        ],
        correctIndex: 2,
        explanation:
          'SVD : A = UΣVᵀ où U ∈ ℝ^{m×m} et V ∈ ℝ^{n×n} sont orthogonales, Σ ∈ ℝ^{m×n} est diagonale avec des valeurs singulières σᵢ ≥ 0 sur la diagonale. La SVD existe pour TOUTE matrice (même non-carrée, même singulière). C\'est la généralisation universelle de la diagonalisation.',
      },
      {
        id: 'p1_0105_002',
        type: 'mcq',
        difficulty: 2,
        question: 'Dans A = UΣVᵀ, si on ne garde que les k premières valeurs singulières (rang-k approximation Aₖ), on obtient :',
        options: [
          'La meilleure approximation de rang k de A au sens de la norme de Frobenius',
          'La matrice identité de rang k',
          'La projection de A sur les k premiers vecteurs propres',
          'Le produit des k plus grandes valeurs singulières',
        ],
        correctIndex: 0,
        explanation:
          'Théorème de Eckart-Young-Mirsky : Aₖ = UₖΣₖVₖᵀ (en gardant les k plus grandes valeurs singulières) est la meilleure approximation de rang k au sens des normes de Frobenius ET spectrale. C\'est le fondement de PCA, des moteurs de recommandation (matrix factorization) et de la compression d\'images.',
        sourceNote: 'Eckart & Young 1936, Mirsky 1960 — Théorème d\'approximation de rang réduit.',
      },
      {
        id: 'p1_0105_003',
        type: 'truefalse',
        difficulty: 2,
        statement: 'La SVD et la diagonalisation (A = PDP⁻¹) sont la même chose pour les matrices carrées.',
        isTrue: false,
        justificationRequired: true,
        explanation:
          'Différences importantes : (1) SVD fonctionne pour toute matrice m×n, la diagonalisation uniquement pour n×n diagonalisables. (2) Dans SVD, U et V sont orthogonales (pas forcément la même matrice). (3) Les valeurs singulières σᵢ ≥ 0 toujours, les valeurs propres λᵢ peuvent être négatives ou complexes. Lien : σᵢ² = valeurs propres de AᵀA.',
      },
      {
        id: 'p1_0105_004',
        type: 'mcq',
        difficulty: 2,
        question: 'Dans un moteur de recommandation (ex: Netflix), la SVD est utilisée pour :',
        options: [
          'Calculer la distance euclidienne entre utilisateurs',
          'Factoriser la matrice utilisateurs×films en matrices latentes utilisateurs et films',
          'Trier les films par popularité',
          'Calculer le nombre de films regardés par utilisateur',
        ],
        correctIndex: 1,
        explanation:
          'La matrice R (utilisateurs × films) est souvent incomplète (ratings manquants). SVD / matrix factorization : R ≈ UΣVᵀ → U encode les "profils latents" utilisateurs, V encode les "facteurs latents" films. Pour prédire le rating de l\'utilisateur i pour le film j : (UΣVᵀ)ᵢⱼ.',
      },
      {
        id: 'p1_0105_005',
        type: 'mcq',
        difficulty: 3,
        question: 'La "dimension intrinsèque" d\'un dataset peut être estimée par la SVD. Comment ?',
        options: [
          'En comptant le nombre de valeurs singulières non-nulles (rang numérique de la matrice)',
          'En prenant le log de la plus grande valeur singulière',
          'En calculant la somme des valeurs singulières',
          'En comparant les valeurs singulières avec la dimension n des features',
        ],
        correctIndex: 0,
        explanation:
          'Le rang numérique (valeurs singulières significativement > 0) donne la dimensionnalité intrinsèque. Si X ∈ ℝ^{1000×100} mais rang(X) ≈ 10 (90 valeurs singulières ≈ 0), les données vivent dans un sous-espace de dimension 10. En pratique on utilise le "scree plot" : σᵢ en fonction de i, et on cherche un "coude".',
      },
      {
        id: 'p1_0105_006',
        type: 'analogy',
        difficulty: 3,
        template: 'Les valeurs singulières dans la SVD sont à une matrice ce que ___ sont à ___',
        correctAnswer: 'les fréquences spectrales sont à un signal audio',
        alternatives: [
          'les composantes de fréquence sont à une image en compression JPEG',
          'les axes principaux sont à une ellipse',
        ],
        explanation:
          'De même qu\'une transformée de Fourier décompose un signal en fréquences, la SVD décompose une matrice en "modes" (vecteurs singuliers) pondérés par leur importance (valeurs singulières). JPEG fait exactement cela sur des blocs d\'image (DCT ≈ SVD).',
      },
      {
        id: 'p1_0105_007',
        type: 'mcq',
        difficulty: 3,
        question: 'La norme spectrale ‖A‖₂ (norme matricielle induite par la norme euclidienne) est égale à :',
        options: [
          'La somme de toutes les valeurs singulières',
          'La plus grande valeur singulière σ₁',
          'La norme de Frobenius',
          'Le déterminant de A',
        ],
        correctIndex: 1,
        explanation:
          '‖A‖₂ = max_x ‖Ax‖₂/‖x‖₂ = σ₁ (plus grande valeur singulière). Interprétation : σ₁ est le facteur d\'étirement maximal de A. En deep learning : le "spectral normalization" divise chaque matrice de poids par σ₁ pour stabiliser l\'entraînement des GANs.',
        sourceNote: 'Miyato et al. 2018, "Spectral Normalization for GANs".',
      },
      {
        id: 'p1_0105_008',
        type: 'mcq',
        difficulty: 3,
        question: 'La relation entre SVD et PCA est :',
        options: [
          'PCA utilise la SVD de la matrice de données X centrée directement',
          'Ce sont deux méthodes sans lien mathématique',
          'PCA utilise la décomposition en valeurs propres de XᵀX, qui donne les mêmes vecteurs que la SVD de X',
          'PCA utilise la SVD de la matrice de corrélation, pas de covariance',
        ],
        correctIndex: 2,
        explanation:
          'Si X = UΣVᵀ (SVD de X), alors XᵀX = VΣᵀUᵀUΣVᵀ = VΣ²Vᵀ. Les vecteurs propres de XᵀX = colonnes de V = vecteurs singuliers droits de X. Les valeurs propres de XᵀX = σᵢ². PCA via SVD de X est numériquement plus stable que PCA via valeurs propres de XᵀX (évite le carré).',
        sourceNote: 'Connexion PCA-SVD — standard dans sklearn.decomposition.PCA.',
      },
    ],
  },

  phase2: {
    targetCount: 6,
    questions: [
      {
        id: 'p2_0105_001',
        type: 'formula_completion',
        difficulty: 4,
        latex_question: `La meilleure approximation de rang $k$ de $A = U\\Sigma V^\\top$ est : $A_k = \\boxed{?}$`,
        correctLatex: ['U_k \\Sigma_k V_k^\\top'],
        explanation:
          'Aₖ = UₖΣₖVₖᵀ où Uₖ = premières k colonnes de U, Σₖ = diag(σ₁,…,σₖ), Vₖ = premières k colonnes de V. Erreur minimale : ‖A - Aₖ‖_F² = Σᵢ>ₖ σᵢ². Pour k = rang(A), Aₖ = A exactement.',
        sourceNote: 'Théorème de Eckart-Young-Mirsky.',
      },
      {
        id: 'p2_0105_002',
        type: 'mcq',
        difficulty: 4,
        question: 'Pour la matrice A ∈ ℝ^{m×n} avec m > n, la SVD "économique" (thin SVD) a quelles shapes pour U, Σ, V ?',
        options: [
          'U: m×m, Σ: m×n, V: n×n',
          'U: m×n, Σ: n×n, V: n×n',
          'U: n×n, Σ: n×n, V: n×n',
          'U: m×n, Σ: m×n, V: n×n',
        ],
        correctIndex: 1,
        explanation:
          'SVD économique (thin/compact) : U ∈ ℝ^{m×n}, Σ ∈ ℝ^{n×n}, V ∈ ℝ^{n×n}. On ne garde que les n premières colonnes de U et les n premières valeurs singulières. Économique car m ≫ n souvent (plus d\'observations que de features). En NumPy : np.linalg.svd(A, full_matrices=False).',
        sourceNote: 'SVD économique — implémentation standard en calcul numérique.',
      },
      {
        id: 'p2_0105_003',
        type: 'mcq',
        difficulty: 4,
        question: 'Le conditionnement d\'une matrice via la SVD : cond₂(A) = σ₁/σₙ. Pourquoi une grande valeur de ce ratio est-elle problématique numériquement ?',
        options: [
          'Parce que la SVD prend plus de temps à calculer',
          'Parce qu\'un petit σₙ ≈ 0 signifie que A est proche d\'une matrice singulière — de petites perturbations peuvent changer drastiquement A⁻¹x',
          'Parce que les grandes valeurs singulières déstabilisent les GPU',
          'Parce que le ratio doit être inférieur à 1',
        ],
        correctIndex: 1,
        explanation:
          'cond(A) = σ₁/σₙ. Si σₙ ≈ 0, A est quasi-singulière. Pour Ax = b : ‖δx‖/‖x‖ ≤ cond(A) · ‖δb‖/‖b‖. Avec cond = 10^k, une erreur relative de 10^{-15} (précision machine) peut causer une erreur de 10^{-15+k} dans la solution. Ridge regression ajoute λ pour σₙ → √(σₙ² + λ), réduisant le conditionnement.',
      },
      {
        id: 'p2_0105_004',
        type: 'proof_gap',
        difficulty: 5,
        instruction: 'Démontre que les vecteurs singuliers droits V sont les vecteurs propres de AᵀA.',
        steps: [
          {
            step: 1,
            statement: 'Partir de A = UΣVᵀ, calculer AᵀA = ...',
            correctFill: '(UΣVᵀ)ᵀ(UΣVᵀ) = VΣᵀUᵀUΣVᵀ',
          },
          {
            step: 2,
            statement: 'Puisque U est orthogonale, UᵀU = I. Donc AᵀA = ...',
            correctFill: 'VΣᵀΣVᵀ = VΣ²Vᵀ  (car Σᵀ = Σ pour une matrice diagonale réelle)',
          },
          {
            step: 3,
            statement: 'Multiplier à droite par V : AᵀAV = VΣ²VᵀV = VΣ² car ...',
            correctFill: 'VᵀV = I (V orthogonale)',
          },
          {
            step: 4,
            statement: 'Donc pour la i-ème colonne vᵢ de V : AᵀAvᵢ = ...',
            correctFill: 'σᵢ²vᵢ — vᵢ est vecteur propre de AᵀA avec valeur propre σᵢ²  ∎',
          },
        ],
        conclusion: 'Les valeurs singulières σᵢ = √(valeurs propres de AᵀA). La SVD généralise la diagonalisation à toutes les matrices rectangulaires.',
        sourceNote: 'Connexion SVD-valeurs propres de AᵀA — fondement théorique de la SVD.',
      },
      {
        id: 'p2_0105_005',
        type: 'mcq',
        difficulty: 5,
        question: 'Dans les transformers modernes (LoRA), on approxime ΔW ≈ BA où B ∈ ℝ^{d×r}, A ∈ ℝ^{r×k} avec r ≪ min(d,k). Ce "rang faible" est justifié par la SVD car :',
        options: [
          'Les matrices de poids des LLMs ont numériquement un faible rang — la plupart de l\'information est dans les r premières composantes singulières',
          'Les matrices de rang faible sont plus faciles à calculer sur GPU',
          'La norme de Frobenius est minimisée par les matrices de rang faible',
          'Les matrices de rang r ont r valeurs propres non nulles par définition',
        ],
        correctIndex: 0,
        explanation:
          'Hu et al. 2021 (LoRA) ont observé empiriquement que les matrices de mise à jour ΔW dans les LLMs ont une "dimension intrinsèque" faible — les valeurs singulières chutent rapidement. Approximer ΔW ≈ BA avec r = 4 ou 8 capture ~90% de l\'information tout en ne mettant à jour que r(d+k) ≪ dk paramètres. Économie : pour d=k=1024, r=8 : 8×2048 vs 1024² = 16K vs 1M.',
        sourceNote: 'Hu et al. 2021, "LoRA: Low-Rank Adaptation of Large Language Models".',
      },
      {
        id: 'p2_0105_006',
        type: 'mcq',
        difficulty: 5,
        question: 'La norme nucléaire ‖A‖_* = Σᵢ σᵢ est la relaxation convexe de quel problème combinatoire ?',
        options: [
          'Minimiser le déterminant de A',
          'Minimiser le rang de A (rank minimization) — le rang est non-convexe',
          'Minimiser la norme spectrale ‖A‖₂',
          'Minimiser le conditionnement cond(A)',
        ],
        correctIndex: 1,
        explanation:
          'Le rang d\'une matrice est une fonction non-convexe et difficile à optimiser. La norme nucléaire Σᵢ σᵢ est sa plus grande enveloppe convexe — c\'est la relaxation convexe la plus serrée du rang. Minimiser la norme nucléaire favorise des solutions de faible rang (analogue à Lasso qui relaxe la norme L0 en L1). Applications : matrix completion (recommandation), compressed sensing.',
        sourceNote: 'Candès & Recht 2009, "Exact Matrix Completion via Convex Optimization".',
      },
    ],
  },
};
