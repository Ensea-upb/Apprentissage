// packages/content/questions/block0/0.1.01-scalaire-vecteur-matrice.ts
import { ConceptQuestionSet } from '../../types';

export const scalaireVecteurMatrice: ConceptQuestionSet = {
  conceptId: '0.1.01',
  conceptName: 'Scalaires, vecteurs & matrices',
  module: '0.1',
  block: 0,

  phase1: {
    targetCount: 10,
    questions: [
      {
        id: 'p1_0101_001',
        type: 'mcq',
        difficulty: 1,
        question: 'Un scalaire est une quantité qui possède :',
        options: [
          'Une magnitude et une direction',
          'Une magnitude uniquement (sans direction)',
          'Une direction uniquement (sans magnitude)',
          'Ni magnitude ni direction',
        ],
        correctIndex: 1,
        explanation:
          'Un scalaire (ex: température, masse, prix) ne possède qu\'une magnitude — c\'est un simple nombre réel. Un vecteur, lui, possède à la fois une magnitude ET une direction (ex: vitesse = 90 km/h vers le nord).',
        commonMistake: 'Confondre scalaire et vecteur : la vitesse est un vecteur (90 km/h vers le nord), la rapidité (speed) est un scalaire (90 km/h).',
      },
      {
        id: 'p1_0101_002',
        type: 'truefalse',
        difficulty: 1,
        statement: 'Un vecteur de dimension n peut être représenté comme une colonne de n nombres réels.',
        isTrue: true,
        justificationRequired: false,
        explanation:
          'Oui. En algèbre linéaire, un vecteur v ∈ ℝⁿ s\'écrit comme une liste ordonnée de n réels : v = [v₁, v₂, …, vₙ]ᵀ. La représentation en colonne est la convention standard.',
      },
      {
        id: 'p1_0101_003',
        type: 'mcq',
        difficulty: 2,
        question: 'Dans une matrice A de dimension 3×4, combien y a-t-il d\'éléments au total ?',
        options: ['3', '4', '7', '12'],
        correctIndex: 3,
        explanation:
          'Une matrice m×n a m lignes et n colonnes → m·n éléments. Ici 3×4 = 12 éléments. La notation m×n se lit "m lignes, n colonnes".',
        commonMistake: 'Additionner (3+4=7) au lieu de multiplier — le nombre d\'éléments est le produit, pas la somme des dimensions.',
      },
      {
        id: 'p1_0101_004',
        type: 'mcq',
        difficulty: 2,
        question: 'En Data Science, une dataset de 1000 observations avec 20 features est naturellement représentée comme :',
        options: [
          'Un scalaire',
          'Un vecteur de dimension 1000',
          'Une matrice 1000×20',
          'Une matrice 20×1000',
        ],
        correctIndex: 2,
        explanation:
          'Convention standard : chaque ligne = une observation (sample), chaque colonne = une feature. Donc 1000 observations × 20 features → matrice X ∈ ℝ^{1000×20}. C\'est la forme attendue par scikit-learn, PyTorch, etc.',
        commonMistake: 'Inverser lignes/colonnes : en ML, les observations sont en lignes (pas en colonnes).',
      },
      {
        id: 'p1_0101_005',
        type: 'ordering',
        difficulty: 2,
        instruction: 'Classe ces objets mathématiques du plus simple (scalaire) au plus général :',
        steps: ['Tenseur de rang 3', 'Scalaire (rang 0)', 'Matrice (rang 2)', 'Vecteur (rang 1)'],
        correctOrder: [1, 3, 2, 0],
        explanation:
          'Hiérarchie des tenseurs par rang : Scalaire (rang 0, 0 indice) → Vecteur (rang 1, 1 indice) → Matrice (rang 2, 2 indices) → Tenseur rang 3 (3 indices, ex: image RGB de shape H×W×C).',
      },
      {
        id: 'p1_0101_006',
        type: 'mcq',
        difficulty: 3,
        question: 'Pourquoi les images en deep learning sont-elles représentées comme des tenseurs de rang 3 (H×W×C) et non comme des matrices ?',
        options: [
          'Parce que les GPU ne peuvent traiter que des tenseurs de rang 3',
          'Parce qu\'une image a 3 dimensions indépendantes : hauteur, largeur et canaux de couleur (RGB)',
          'Parce que les matrices ne peuvent stocker que des entiers',
          'Parce qu\'une image est toujours carrée (H=W)',
        ],
        correctIndex: 1,
        explanation:
          'Une image RGB a 3 dimensions structurellement indépendantes : H (hauteur en pixels), W (largeur en pixels) et C (canaux : R, G, B = 3 valeurs). Une matrice n\'a que 2 dimensions, donc insuffisant. En pratique, avec un batch de N images : tenseur de rang 4, shape N×H×W×C.',
      },
      {
        id: 'p1_0101_007',
        type: 'truefalse',
        difficulty: 2,
        statement: 'Une matrice carrée 3×3 est à la fois un vecteur de dimension 9 et une matrice 3×3 — les deux représentations sont équivalentes.',
        isTrue: false,
        justificationRequired: true,
        explanation:
          'Faux. Bien que les 9 mêmes nombres soient présents, la structure est différente. Un vecteur de dimension 9 est une liste ordonnée sans structure de ligne/colonne. Une matrice 3×3 possède une structure bidimensionnelle qui définit des opérations différentes (multiplication matricielle, déterminant, trace). L\'opération de "vectorisation" (reshape) est possible mais change la sémantique.',
      },
      {
        id: 'p1_0101_008',
        type: 'mcq',
        difficulty: 3,
        question: 'Dans PyTorch, un embedding de vocabulaire de taille 10 000 avec des vecteurs de dimension 512 est stocké comme :',
        options: [
          'Un vecteur de dimension 512',
          'Une matrice 10 000×512',
          'Un tenseur de rang 3 de shape (10000, 512, 1)',
          'Un scalaire',
        ],
        correctIndex: 1,
        explanation:
          'nn.Embedding(10000, 512) crée une matrice E ∈ ℝ^{10000×512}. Chaque ligne i est le vecteur d\'embedding du token i. Pour accéder à l\'embedding du token j : E[j, :], un vecteur de dimension 512.',
      },
      {
        id: 'p1_0101_009',
        type: 'analogy',
        difficulty: 2,
        template: 'Un scalaire est à un vecteur ce que ___ est à ___',
        correctAnswer: 'une température est à une vitesse',
        alternatives: [
          'un point est à une flèche',
          'un âge est à une adresse postale',
        ],
        explanation:
          'Un scalaire = magnitude seule (température : 37°C). Un vecteur = magnitude + direction (vitesse : 90 km/h vers le nord). Un point (sans direction) vs une flèche (avec direction) est l\'analogie géométrique la plus directe.',
      },
      {
        id: 'p1_0101_010',
        type: 'mcq',
        difficulty: 3,
        question: 'Si X est une matrice 100×5 et y est un vecteur de dimension 100, quelle opération produit un scalaire ?',
        options: [
          'X · y  (produit matrice-vecteur)',
          'yᵀ · y  (produit interne)',
          'X + y  (addition)',
          'X · Xᵀ  (produit matrice-matrice)',
        ],
        correctIndex: 1,
        explanation:
          'yᵀ · y est le produit scalaire de y avec lui-même : yᵀy = Σᵢ yᵢ² = ‖y‖² — un scalaire (norme au carré). X·y donne un vecteur 100×1. X+y est invalide (dimensions incompatibles). X·Xᵀ donne une matrice 100×100.',
      },
    ],
  },

  phase2: {
    targetCount: 8,
    questions: [
      {
        id: 'p2_0101_001',
        type: 'mcq',
        difficulty: 4,
        latexQuestion: `Soit $v = \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}$. La norme euclidienne $\\|v\\|_2$ est :`,
        question: 'Soit v = [3, 4]ᵀ. La norme euclidienne ‖v‖₂ est :',
        options: ['3', '4', '5', '7'],
        correctIndex: 2,
        explanation:
          '‖v‖₂ = √(3² + 4²) = √(9 + 16) = √25 = 5. C\'est le théorème de Pythagore en dimension 2. En général, ‖v‖₂ = √(Σᵢ vᵢ²).',
        sourceNote: 'Définition standard, norme L2 (norme euclidienne).',
      },
      {
        id: 'p2_0101_002',
        type: 'formula_completion',
        difficulty: 4,
        latex_question: `L'élément à la ligne $i$, colonne $j$ du produit $C = AB$ (où $A \\in \\mathbb{R}^{m \\times n}$ et $B \\in \\mathbb{R}^{n \\times p}$) est donné par : $C_{ij} = \\boxed{?}$`,
        correctLatex: ['\\sum_{k=1}^{n} A_{ik} B_{kj}'],
        explanation:
          'Cᵢⱼ = Σₖ Aᵢₖ·Bₖⱼ — produit de la ligne i de A par la colonne j de B. Condition de compatibilité : nombre de colonnes de A = nombre de lignes de B (ici n). Résultat C ∈ ℝ^{m×p}.',
        sourceNote: 'Définition du produit matriciel standard.',
      },
      {
        id: 'p2_0101_003',
        type: 'mcq',
        difficulty: 4,
        question: 'Soit A ∈ ℝ^{m×n}. Le produit AᵀA produit une matrice de shape :',
        options: ['m×m', 'n×n', 'm×n', 'n×m'],
        correctIndex: 1,
        explanation:
          'A ∈ ℝ^{m×n} → Aᵀ ∈ ℝ^{n×m}. Produit (n×m)·(m×n) = n×n. AᵀA est une matrice carrée n×n, toujours symétrique et semi-définie positive. Elle apparaît dans la régression linéaire ((AᵀA)⁻¹Aᵀb).',
        sourceNote: 'Propriété fondamentale : AᵀA est symétrique semi-définie positive.',
      },
      {
        id: 'p2_0101_004',
        type: 'truefalse',
        difficulty: 4,
        statement: 'La multiplication matricielle est commutative : AB = BA pour toutes matrices carrées A, B de même dimension.',
        isTrue: false,
        justificationRequired: true,
        explanation:
          'Faux. En général AB ≠ BA. Contre-exemple : A = [[1,2],[0,0]], B = [[0,1],[0,0]]. AB = [[0,1],[0,0]], BA = [[0,0],[0,0]]. La commutativité est une exception (matrices diagonales, ou lorsque AB = BA par coïncidence), pas la règle.',
        sourceNote: 'Propriété fondamentale — la non-commutativité distingue l\'algèbre matricielle de l\'algèbre scalaire.',
      },
      {
        id: 'p2_0101_005',
        type: 'mcq',
        difficulty: 4,
        question: 'La transposée d\'un produit (AB)ᵀ est égale à :',
        options: ['AᵀBᵀ', 'BᵀAᵀ', 'ABᵀ', 'AᵀB'],
        correctIndex: 1,
        explanation:
          '(AB)ᵀ = BᵀAᵀ — l\'ordre est inversé. Preuve : ((AB)ᵀ)ᵢⱼ = (AB)ⱼᵢ = Σₖ Aⱼₖ Bₖᵢ = Σₖ (Aᵀ)ₖⱼ (Bᵀ)ᵢₖ = (BᵀAᵀ)ᵢⱼ. Cette règle s\'étend : (ABC)ᵀ = CᵀBᵀAᵀ.',
        sourceNote: 'Propriété de transposition du produit — utilisée constamment en backprop.',
      },
      {
        id: 'p2_0101_006',
        type: 'numerical',
        difficulty: 4,
        latexQuestion: `Soit $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ et $B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$. Calcule $AB$.`,
        solution: {
          step1: 'C[0,0] = 1·5 + 2·7 = 5 + 14 = 19',
          step2: 'C[0,1] = 1·6 + 2·8 = 6 + 16 = 22',
          step3: 'C[1,0] = 3·5 + 4·7 = 15 + 28 = 43',
          step4: 'C[1,1] = 3·6 + 4·8 = 18 + 32 = 50',
          result: '[[19, 22], [43, 50]]',
        },
        tolerance: 0,
        explanation:
          'Chaque Cᵢⱼ = (ligne i de A) · (colonne j de B). C = [[19, 22], [43, 50]]. Note : BA ≠ AB (vérifiable en calculant BA = [[23,34],[31,46]]).',
      },
      {
        id: 'p2_0101_007',
        type: 'mcq',
        difficulty: 5,
        question: 'En régression linéaire, la solution des moindres carrés est β̂ = (XᵀX)⁻¹Xᵀy. Quelle condition sur X rend XᵀX inversible ?',
        options: [
          'X doit être une matrice carrée (n=p)',
          'Les colonnes de X doivent être linéairement indépendantes (rang plein en colonnes)',
          'Toutes les valeurs de X doivent être positives',
          'X doit être symétrique',
        ],
        correctIndex: 1,
        explanation:
          'XᵀX ∈ ℝ^{p×p} est inversible ⟺ rang(XᵀX) = p ⟺ rang(X) = p ⟺ les colonnes de X sont linéairement indépendantes. Si deux features sont parfaitement corrélées (multicolinéarité parfaite), XᵀX est singulière → la solution n\'est pas unique. C\'est le problème de multicolinéarité en régression.',
        sourceNote: 'Algèbre des moindres carrés — voir Strang, Linear Algebra and its Applications.',
      },
      {
        id: 'p2_0101_008',
        type: 'truefalse',
        difficulty: 5,
        statement: 'Le rang d\'une matrice A ∈ ℝ^{m×n} peut dépasser min(m, n).',
        isTrue: false,
        justificationRequired: true,
        explanation:
          'Faux. Le rang d\'une matrice est le nombre de lignes (ou colonnes) linéairement indépendantes. Il est toujours ≤ min(m, n). Pour A ∈ ℝ^{3×5}, rang(A) ≤ 3. Cela implique que si m < n (plus de features que d\'observations), rang(X) ≤ m < n et le système est sous-déterminé.',
        sourceNote: 'Théorème du rang — fondamental pour comprendre les problèmes sur-/sous-déterminés en ML.',
      },
    ],
  },
};
