// packages/content/questions/block0/0.1.07-orthogonalite.ts
import { ConceptQuestionSet } from '../../types';

export const orthogonalite: ConceptQuestionSet = {
  conceptId: '0.1.07',
  conceptName: 'Orthogonalité & projection',
  module: '0.1',
  block: 0,

  phase1: {
    targetCount: 6,
    questions: [
      {
        id: 'p1_0107_001',
        type: 'mcq',
        difficulty: 1,
        question: 'Une matrice orthogonale Q satisfait :',
        options: ['QQ = I', 'Qᵀ = Q', 'QᵀQ = QQᵀ = I', 'det(Q) = 0'],
        correctIndex: 2,
        explanation:
          'QᵀQ = QQᵀ = I — les colonnes (et lignes) de Q forment une base orthonormée. Conséquence clé : Q⁻¹ = Qᵀ (l\'inverse est la transposée — très facile à calculer). Propriétés : ‖Qx‖ = ‖x‖ (préserve les normes), det(Q) = ±1. Exemples : matrices de rotation, réflexions.',
      },
      {
        id: 'p1_0107_002',
        type: 'mcq',
        difficulty: 2,
        question: 'La projection orthogonale de y sur le sous-espace Col(X) (espace colonnes de X) est :',
        options: ['Xy', 'XᵀX y', 'X(XᵀX)⁻¹Xᵀy', 'Xᵀy'],
        correctIndex: 2,
        explanation:
          'ŷ = X(XᵀX)⁻¹Xᵀy = Hy où H est la "hat matrix" (matrice de projection). ŷ est le point de Col(X) le plus proche de y au sens de la norme L2. En régression linéaire, ŷ = Xβ̂ est exactement cette projection — le résidu r = y - ŷ est orthogonal à Col(X).',
      },
      {
        id: 'p1_0107_003',
        type: 'truefalse',
        difficulty: 2,
        statement: 'Dans une base orthonormée {e₁, …, eₙ}, les coordonnées d\'un vecteur v sont les produits scalaires v·eᵢ.',
        isTrue: true,
        justificationRequired: false,
        explanation:
          'Vrai. Si {eᵢ} est une base orthonormée (eᵢ·eⱼ = δᵢⱼ), alors v = Σᵢ (v·eᵢ)eᵢ. Les coordonnées cᵢ = v·eᵢ sont les "projections" de v sur chaque axe. Cette propriété rend les bases orthonormées très pratiques : pas de système d\'équations à résoudre pour trouver les coordonnées.',
      },
      {
        id: 'p1_0107_004',
        type: 'mcq',
        difficulty: 3,
        question: 'L\'algorithme de Gram-Schmidt transforme un ensemble de vecteurs linéairement indépendants {v₁, …, vₙ} en une base orthonormée. Quelle propriété est préservée à chaque étape ?',
        options: [
          'Les normes des vecteurs',
          'L\'espace engendré (Col({v₁,…,vₖ}) = Col({u₁,…,uₖ}) à chaque étape k)',
          'Les produits scalaires entre vecteurs',
          'Le déterminant de la matrice',
        ],
        correctIndex: 1,
        explanation:
          'Gram-Schmidt construit uₖ en soustrayant de vₖ ses projections sur {u₁,…,uₖ₋₁}, puis en normalisant. À chaque étape, Vect(u₁,…,uₖ) = Vect(v₁,…,vₖ). C\'est la base de la factorisation QR : A = QR, où Q a les vecteurs de Gram-Schmidt et R est triangulaire supérieure.',
      },
      {
        id: 'p1_0107_005',
        type: 'mcq',
        difficulty: 3,
        question: 'En deep learning, la "batch normalization" rend les activations orthogonales à la moyenne du batch. Quel lien avec la projection orthogonale ?',
        options: [
          'La BatchNorm projette les activations sur un hyperplan orthogonal au vecteur de moyenne',
          'La BatchNorm n\'a pas de lien avec l\'orthogonalité',
          'La BatchNorm soustrait la composante parallèle à la moyenne (projection), laissant la composante orthogonale (centrée)',
          'La BatchNorm fait une rotation orthogonale des activations',
        ],
        correctIndex: 2,
        explanation:
          'Centrer : x̃ = x - μ, c\'est soustraire la projection de x sur la direction constante μ. Le résidu x̃ est orthogonal à cette direction (Σᵢ x̃ᵢ = 0). La normalisation (diviser par σ) met à l\'échelle mais ne change pas l\'orthogonalité. Résultat : activations centrées et décorrélées de la tendance du batch.',
      },
      {
        id: 'p1_0107_006',
        type: 'mcq',
        difficulty: 3,
        question: 'Les sous-espaces noyau ker(A) et image im(Aᵀ) d\'une matrice A ∈ ℝ^{m×n} sont :',
        options: [
          'Identiques',
          'Orthogonaux complémentaires dans ℝⁿ : ker(A) ⊕ im(Aᵀ) = ℝⁿ',
          'Parallèles',
          'Sans relation particulière',
        ],
        correctIndex: 1,
        explanation:
          'Théorème fondamental de l\'algèbre linéaire : ker(A) ⊥ im(Aᵀ). Preuve : pour x ∈ ker(A) et y ∈ im(Aᵀ) : ∃z tel que y = Aᵀz. Alors x·y = xᵀ(Aᵀz) = (Ax)ᵀz = 0ᵀz = 0. Et ker(A) ⊕ im(Aᵀ) = ℝⁿ (décomposition orthogonale de ℝⁿ). C\'est la base de la régression linéaire.',
      },
    ],
  },

  phase2: {
    targetCount: 5,
    questions: [
      {
        id: 'p2_0107_001',
        type: 'formula_completion',
        difficulty: 4,
        latex_question: `La matrice de projection sur le sous-espace $\\text{Col}(X)$ est : $P = \\boxed{?}$, et satisfait $P^2 = \\boxed{?}$ et $P^\\top = \\boxed{?}$.`,
        correctLatex: ['X(X^\\top X)^{-1}X^\\top', 'P', 'P'],
        explanation:
          'P = X(XᵀX)⁻¹Xᵀ est la matrice de projection orthogonale. P² = P (idempotente — projeter deux fois = projeter une fois), Pᵀ = P (symétrique). Ces deux propriétés caractérisent les projections orthogonales. En régression : ŷ = Py, r = y - ŷ = (I-P)y avec rᵀŷ = 0.',
        sourceNote: 'Projection orthogonale — standard en régression linéaire.',
      },
      {
        id: 'p2_0107_002',
        type: 'mcq',
        difficulty: 4,
        question: 'La factorisation QR d\'une matrice A ∈ ℝ^{m×n} (m ≥ n, rang plein) donne A = QR. Quel avantage numérique offre-t-elle pour résoudre le moindres carrés min ‖Ax - b‖ ?',
        options: [
          'Elle évite de calculer AᵀA (qui donne cond(AᵀA) = cond(A)²) en travaillant directement avec A',
          'Elle accélère le calcul en parallélisant les opérations',
          'Elle garantit que la solution est toujours unique',
          'Elle permet de ne pas calculer la transposée de A',
        ],
        correctIndex: 0,
        explanation:
          'L\'équation normale (AᵀA)x = Aᵀb a cond(AᵀA) = cond(A)² → perte de la moitié des chiffres significatifs. Via QR : A = QR → min ‖Ax-b‖ = min ‖QRx-b‖ = min ‖Rx - Qᵀb‖ (QᵀQ = I). Résoudre Rx = Qᵀb (triangulaire supérieure) coûte O(n²) et a cond(R) = cond(A). Bien plus stable numériquement.',
        sourceNote: 'QR vs équation normale — Golub & Van Loan, Matrix Computations.',
      },
      {
        id: 'p2_0107_003',
        type: 'truefalse',
        difficulty: 4,
        statement: 'Si P est une matrice de projection orthogonale, alors I - P est aussi une matrice de projection orthogonale.',
        isTrue: true,
        justificationRequired: true,
        explanation:
          'Vrai. Si P² = P et Pᵀ = P, alors (I-P)² = I - 2P + P² = I - 2P + P = I - P, et (I-P)ᵀ = I - Pᵀ = I - P. Donc I-P est idempotente et symétrique → projection orthogonale sur le complément orthogonal de Col(P). En régression : P projette sur Col(X) et I-P projette sur les résidus.',
      },
      {
        id: 'p2_0107_004',
        type: 'mcq',
        difficulty: 5,
        question: 'Pourquoi la convolution dans les CNNs peut-elle être vue comme une projection sur des sous-espaces de filtres ?',
        options: [
          'Parce que les opérations de convolution sont des produits matriciels avec une matrice de Toeplitz, équivalente à une projection',
          'Parce que les filtres forment une base orthonormée de l\'espace des patches',
          'Parce que la convolution n\'est pas liée à la projection orthogonale',
          'Parce que les filtres maximisent la norme des features maps',
        ],
        correctIndex: 0,
        explanation:
          'La convolution 1D de signal x avec filtre h est un produit x·h_shifted, équivalent à une multiplication matricielle où la matrice est de Toeplitz (structure circulante). Le résultat de la convolution donne la "ressemblance" (projection non-normalisée) entre le patch d\'entrée et chaque filtre. Si les filtres sont normalisés, c\'est exactement la similarité cosinus.',
      },
      {
        id: 'p2_0107_005',
        type: 'mcq',
        difficulty: 5,
        question: 'L\'algorithme de Power Iteration pour calculer le vecteur propre dominant de A commence avec un vecteur aléatoire v₀ et calcule vₖ₊₁ = Avₖ/‖Avₖ‖. Pourquoi converge-t-il vers le vecteur propre dominant ?',
        options: [
          'Parce que la norme de vₖ est bornée par 1',
          'Parce que la composante dans la direction du vecteur propre dominant λ₁ croît à chaque étape par un facteur λ₁/λ₂ > 1 par rapport aux autres composantes',
          'Parce que l\'algorithme calcule QR à chaque étape',
          'Parce que v₀ est choisi aléatoirement dans l\'espace propre dominant',
        ],
        correctIndex: 1,
        explanation:
          'Soit v₀ = Σᵢ cᵢuᵢ (dans la base des vecteurs propres). Alors Aᵏv₀ = Σᵢ cᵢλᵢᵏuᵢ. Normaliser : vₖ ≈ u₁ + Σᵢ>₁ cᵢ(λᵢ/λ₁)ᵏuᵢ. Si |λ₁| > |λ₂|, les termes (λᵢ/λ₁)ᵏ → 0 → vₖ → u₁. Vitesse de convergence ∝ |λ₂/λ₁|ᵏ (ratio spectral).',
        sourceNote: 'Power Iteration — algorithme fondamental pour PageRank, calcul de valeurs singulières.',
      },
    ],
  },
};
