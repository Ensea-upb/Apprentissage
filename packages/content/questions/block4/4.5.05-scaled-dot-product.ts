// packages/content/questions/block4/4.5.05-scaled-dot-product.ts
import { ConceptQuestionSet } from '../../types';

export const scaledDotProductAttention: ConceptQuestionSet = {
  conceptId: '4.5.05',
  conceptName: 'Scaled Dot-Product Attention',
  module: '4.5',
  block: 4,
  paper: 'attention-is-all-you-need-2017',

  phase1: {
    targetCount: 10,
    questions: [
      {
        id: 'p1_sdpa_001',
        type: 'mcq',
        difficulty: 2,
        question: `Dans une bibliothèque, tu cherches des livres sur "l'apprentissage automatique". Le bibliothécaire compare ta demande avec le titre de chaque livre, puis te donne les livres les plus pertinents, pondérés par leur correspondance. Quelle composante du mécanisme d'attention ce bibliothécaire représente-t-il ?`,
        options: [
          'Le mécanisme de Query, Key et Value ensemble',
          'Le positional encoding',
          'Le feed-forward network',
          'La normalisation par couches',
        ],
        correctIndex: 0,
        explanation: `Ta demande = Query (Q), les titres des livres = Keys (K), le contenu des livres = Values (V). L'attention calcule exactement cette correspondance : Q est comparé à tous les K, et les V sont agrégés proportionnellement aux scores de correspondance.`,
        commonMistake: `Beaucoup confondent Key et Value : le Key est l'étiquette (ce qui permet de trouver), le Value est le contenu réel (ce qui est donné).`,
      },
      {
        id: 'p1_sdpa_002',
        type: 'truefalse',
        difficulty: 2,
        statement: `Dans le mécanisme d'attention, un token peut s'attendre à lui-même (s'accorder une attention maximale) tout en accordant également de l'attention aux autres tokens.`,
        isTrue: true,
        justificationRequired: true,
        explanation: `Oui. Le self-attention calcule les scores entre TOUS les tokens de la séquence, y compris le token avec lui-même. Un token donnera souvent un score élevé à lui-même, mais pas nécessairement le plus élevé — cela dépend du contexte. Cette propriété distingue l'attention du masquage.`,
      },
      {
        id: 'p1_sdpa_003',
        type: 'ordering',
        difficulty: 3,
        instruction: `Remets dans l'ordre les étapes du calcul du Scaled Dot-Product Attention :`,
        steps: [
          'Multiplier chaque score par les Values correspondants et sommer',
          'Diviser les scores bruts par la racine carrée de d_k',
          'Calculer le produit scalaire entre Q et Kᵀ',
          'Appliquer softmax pour obtenir des poids qui somment à 1',
        ],
        correctOrder: [2, 1, 3, 0],
        explanation: `L'ordre exact : (1) QKᵀ → scores bruts, (2) ÷√d_k → scores mis à l'échelle, (3) softmax → poids d'attention, (4) × V → sortie pondérée.`,
      },
      {
        id: 'p1_sdpa_004',
        type: 'analogy',
        difficulty: 3,
        template: 'Q est à K ce que ___ est à ___',
        correctAnswer: 'une requête de recherche est aux mots-clés indexés',
        alternatives: [
          'une question est aux réponses possibles',
          'un filtre est aux données à filtrer',
        ],
        explanation: `Q (Query) représente "ce que je cherche", K (Key) représente "les étiquettes de ce qui existe". Le score Q·Kᵀ mesure leur compatibilité — exactement comme un moteur de recherche score la pertinence d'un document.`,
      },
      {
        id: 'p1_sdpa_005',
        type: 'mcq',
        difficulty: 3,
        question: `Pourquoi diviser par √d_k change-t-il le comportement du softmax ?`,
        options: [
          `Sans cette division, le softmax devient trop "peaked" (une valeur domine à ~1, les autres à ~0) rendant le gradient presque nul`,
          `Cette division accélère le calcul matriciel en réduisant la taille des vecteurs`,
          `Cette division garantit que les poids d'attention restent négatifs`,
          `Sans cette division, les matrices Q et K ne peuvent pas être multipliées`,
        ],
        correctIndex: 0,
        explanation: `Pour d_k grand, le produit scalaire Q·K peut avoir une grande variance (~d_k). Des scores très grands poussent le softmax dans des zones de gradient ≈ 0 (saturation). Diviser par √d_k maintient une variance unitaire, et le softmax reste dans une zone exploitable. C'est le même problème que le vanishing gradient, mais causé par la magnitude des activations.`,
        sourceNote: 'Vaswani et al. 2017, Section 3.2.1',
      },
      {
        id: 'p1_sdpa_006',
        type: 'mcq',
        difficulty: 2,
        question: `Quelle est la différence principale entre le self-attention et le cross-attention ?`,
        options: [
          'Il n\'y a pas de différence — ce sont des noms différents pour la même chose',
          'En self-attention, Q, K et V proviennent de la même séquence. En cross-attention, Q vient d\'une séquence et K, V d\'une autre',
          'Le cross-attention utilise une plus grande dimension d_k',
          'Le self-attention ne peut pas être parallélisé',
        ],
        correctIndex: 1,
        explanation: `Self-attention : Q = K = V = même séquence (l'encodeur lit son propre contexte). Cross-attention (dans le décodeur) : Q vient du décodeur, K et V viennent de l'encodeur → le décodeur "interroge" l'encodeur pour la traduction. C'est l'analogue du mécanisme d'attention de Bahdanau 2015, généralisé.`,
        sourceNote: 'Vaswani et al. 2017, Section 3.2.3',
      },
      {
        id: 'p1_sdpa_007',
        type: 'mcq',
        difficulty: 3,
        question: `Un token en début de séquence dans un décodeur autorégressif ne peut pas "regarder" les tokens futurs. Comment est implémentée cette contrainte ?`,
        options: [
          'En supprimant les tokens futurs de la séquence avant le calcul',
          'En ajoutant -∞ aux scores d\'attention des positions futures avant le softmax (masque causal)',
          'En multipliant les poids d\'attention des positions futures par 0 après le softmax',
          'En utilisant des heads d\'attention séparées pour les tokens passés et futurs',
        ],
        correctIndex: 1,
        explanation: `Masque causal : Mᵢⱼ = 0 si j ≤ i (passé autorisé), -∞ si j > i (futur masqué). Après softmax : exp(-∞) = 0 → poids exactement nuls sur les futures positions. Utiliser 0 au lieu de -∞ serait incorrect : exp(0) = 1 contribuerait à la normalisation.`,
        sourceNote: 'Vaswani et al. 2017, Section 3.1',
      },
      {
        id: 'p1_sdpa_008',
        type: 'mcq',
        difficulty: 3,
        question: `Dans un RNN, accéder à un token distant requiert de traverser tous les tokens intermédiaires. Dans le Transformer, un token peut "voir" directement n'importe quel autre token. Quelle métrique reflète cet avantage ?`,
        options: [
          'La complexité temporelle O(n²)',
          'La longueur maximale du chemin entre deux positions : O(1) pour le Transformer vs O(n) pour un RNN',
          'Le nombre de paramètres',
          'La batch size',
        ],
        correctIndex: 1,
        explanation: `Table 1 de Vaswani 2017 : longueur du chemin maximum entre deux positions = O(1) pour le self-attention (connexion directe), O(n) pour les RNN, O(log(n)) pour les ConvNets. Un chemin court = gradient qui circule mieux = meilleure modélisation des dépendances à longue distance.`,
        sourceNote: 'Vaswani et al. 2017, Table 1 — Complexité par type de couche.',
      },
      {
        id: 'p1_sdpa_009',
        type: 'truefalse',
        difficulty: 3,
        statement: `Les poids d'attention (après softmax) d'une ligne de la matrice d'attention somment toujours à 1.`,
        isTrue: true,
        justificationRequired: false,
        explanation: `Vrai par définition de softmax. softmax(x)ᵢ = exp(xᵢ) / Σⱼ exp(xⱼ). La somme sur i : Σᵢ softmax(x)ᵢ = (Σᵢ exp(xᵢ)) / (Σⱼ exp(xⱼ)) = 1. Donc chaque ligne de la matrice d'attention est une distribution de probabilité sur les positions de la séquence.`,
      },
      {
        id: 'p1_sdpa_010',
        type: 'mcq',
        difficulty: 4,
        question: `Le Multi-Head Attention calcule h instances de l'attention en parallèle avec des projections différentes. L'intérêt principal est :`,
        options: [
          'Réduire la complexité temporelle de O(n²) à O(n²/h)',
          'Permettre au modèle d\'assister à l\'information depuis différents sous-espaces de représentation simultanément',
          'Garantir que les poids d\'attention sont positifs',
          'Augmenter la taille des séquences traitables',
        ],
        correctIndex: 1,
        explanation: `Chaque tête apprend des "types de relations" différents : certaines têtes capturent des relations syntaxiques (sujet-verbe), d'autres des relations sémantiques, d'autres encore la coréférence. Avec une seule tête, le modèle ne peut capter qu'un seul type de relation par couche. Avec h têtes, h sous-espaces différents sont explorés simultanément.`,
        sourceNote: 'Vaswani et al. 2017, Section 3.2.2',
      },
    ],
  },

  phase2: {
    targetCount: 8,
    questions: [
      {
        id: 'p2_sdpa_001',
        type: 'formula_completion',
        difficulty: 4,
        latex_question: `La formule complète du Scaled Dot-Product Attention est : \\[\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{\\boxed{?}}{\\boxed{?}}\\right)\\boxed{?}\\]`,
        correctLatex: ['QK^\\top', '\\sqrt{d_k}', 'V'],
        explanation: `La formule exacte de Vaswani et al. (2017) : \\[\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V\\] Q ∈ ℝ^{n×d_k}, K ∈ ℝ^{m×d_k}, V ∈ ℝ^{m×d_v}, Sortie ∈ ℝ^{n×d_v}`,
        sourceNote: 'Vaswani et al. 2017, Eq. 1',
      },
      {
        id: 'p2_sdpa_002',
        type: 'proof_gap',
        difficulty: 5,
        instruction: `Démontre que si Q, K ∈ ℝ^{d_k} avec composantes i.i.d. N(0,1), alors Var(Q·K) = d_k et donc Var(Q·K / √d_k) = 1.`,
        steps: [
          {
            step: 1,
            statement: 'Var(qᵢkᵢ) = E[qᵢ²kᵢ²] - E[qᵢkᵢ]² = ...',
            correctFill: 'E[qᵢ²]·E[kᵢ²] - 0 = 1·1 = 1  (indépendance)',
          },
          {
            step: 2,
            statement: 'Var(Q·K) = Var(Σᵢ qᵢkᵢ) = Σᵢ Var(qᵢkᵢ) = ...',
            correctFill: 'd_k  (linéarité de la variance pour des termes indépendants)',
          },
          {
            step: 3,
            statement: 'Var(Q·K / √d_k) = Var(Q·K) / d_k = ...',
            correctFill: '1  ∎',
          },
        ],
        conclusion: `Diviser par √d_k ramène la variance à 1 quelle que soit la dimension d_k, préservant un gradient exploitable dans le softmax.`,
        sourceNote: 'Vaswani et al. 2017, footnote 4',
      },
      {
        id: 'p2_sdpa_003',
        type: 'mcq',
        difficulty: 5,
        question: `Soit une séquence de n tokens, d_k=64. La complexité temporelle et spatiale du calcul QKᵀ est :`,
        options: [
          'O(n·d_k) en temps, O(n) en espace',
          'O(n²·d_k) en temps, O(n²) en espace',
          'O(n·log(n)·d_k) en temps, O(n·log(n)) en espace',
          'O(d_k²) en temps, O(d_k) en espace',
        ],
        correctIndex: 1,
        explanation: `QKᵀ est un produit matriciel (n×d_k)·(d_k×n) = n×n. Complexité temps : O(n²·d_k). Complexité espace : O(n²) pour stocker la matrice d'attention. C'est la raison pour laquelle l'attention standard est quadratique en la longueur de séquence, et pourquoi Flash Attention (Dao et al. 2022) vise à réduire l'empreinte mémoire à O(n).`,
        sourceNote: 'Vaswani et al. 2017, Table 1 ; Dao et al. 2022, FlashAttention.',
      },
      {
        id: 'p2_sdpa_004',
        type: 'numerical',
        difficulty: 4,
        latexQuestion: `Soit $Q = [1, 0]$, $K = [[1, 0], [0, 1], [-1, 0]]$, $V = [[3], [7], [2]]$, $d_k = 2$. Calcule la sortie Attention(Q, K, V).`,
        solution: {
          step1: 'QKᵀ = [1·1+0·0, 1·0+0·1, 1·(-1)+0·0] = [1, 0, -1]',
          step2: '[1/√2, 0, -1/√2] ≈ [0.707, 0, -0.707]',
          step3: 'softmax([0.707, 0, -0.707]) ≈ [0.576, 0.274, 0.150]',
          step4: '0.576·3 + 0.274·7 + 0.150·2 ≈ 1.728 + 1.918 + 0.300 ≈ 3.946',
        },
        tolerance: 0.05,
        explanation: `Le token Q=[1,0] ressemble au premier Key [1,0] (score=1), est orthogonal au second [0,1] (score=0), et opposé au troisième [-1,0] (score=-1). Le softmax lui donne donc un poids majoritaire sur le premier Value (3), d'où une sortie proche de 3.`,
      },
      {
        id: 'p2_sdpa_005',
        type: 'mcq',
        difficulty: 5,
        latexQuestion: `Dans le cas du masquage causal (decoder), la matrice de masque M est définie par : M_ij = 0 si j ≤ i, -∞ si j > i. Pourquoi utiliser -∞ plutôt que 0 dans le masque ?`,
        question: `Dans le masquage causal du décodeur, la valeur -∞ est utilisée pour les positions futures dans le masque. Pourquoi -∞ et non 0 ?`,
        options: [
          `Parce que softmax(-∞) = 0 exactement, ce qui annule l'attention vers les positions futures sans affecter les gradients des positions passées`,
          `Parce que -∞ indique au GPU d'ignorer ces positions pour accélérer le calcul`,
          `Parce que 0 rendrait le softmax indéfini sur ces positions`,
          `Parce que cela permet de réutiliser les mêmes paramètres Q, K, V en encoder et decoder`,
        ],
        correctIndex: 0,
        explanation: `softmax(x_i) = exp(x_i) / Σ_j exp(x_j). Si x_j = -∞, alors exp(-∞) = 0, donc ce token ne contribue pas à la somme de normalisation et obtient un poids exactement 0. Utiliser 0 reviendrait à donner un score de 1 (exp(0)=1) à ces positions masquées, ce qui leur donnerait une attention non nulle.`,
        sourceNote: 'Vaswani et al. 2017, Section 3.1',
      },
      {
        id: 'p2_sdpa_006',
        type: 'mcq',
        difficulty: 5,
        question: `Flash Attention (Dao et al. 2022) réduit la complexité mémoire de O(n²) à O(n). Quel est le principe clé ?`,
        options: [
          'Calculer les poids d\'attention de façon approchée (sparse attention)',
          'Tiling : calculer l\'attention par blocs en SRAM, accumuler la sortie sans jamais matérialiser la matrice n×n en HBM (mémoire GPU principale)',
          'Remplacer softmax par une fonction linéaire pour éviter la quadraticité',
          'Compresser les matrices Q, K, V avec la SVD avant le calcul',
        ],
        correctIndex: 1,
        explanation: `Flash Attention exploite la hiérarchie mémoire GPU : SRAM (rapide, petite) vs HBM (lente, grande). L'idée : charger les blocs de Q, K, V en SRAM, calculer l'attention par blocs, accumuler dans la sortie. Jamais de matrice n×n en HBM → mémoire O(n). L'attention finale est exacte (pas approchée). Accélération : 2-4x vs implémentation naïve.`,
        sourceNote: 'Dao et al. 2022, "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness".',
      },
      {
        id: 'p2_sdpa_007',
        type: 'mcq',
        difficulty: 4,
        question: `Dans le Multi-Head Attention, d_k = d_model/h. Pour d_model=512, h=8, la complexité totale est comparable à celle d'une seule tête avec d_k=512. Pourquoi ?`,
        options: [
          'Parce que les h têtes sont calculées en parallèle — pas de surcoût',
          'Parce que d_k = 512/8 = 64 et h têtes avec d_k=64 ont la même complexité O(n²·d_model) qu\'une tête avec d_k=512',
          'Parce que la projection finale W_O annule le coût supplémentaire',
          'Parce que le coût des 8 têtes est amorti par le batch size',
        ],
        correctIndex: 1,
        explanation: `Complexité totale du Multi-Head : h · O(n²·d_k) = h · O(n²·d_model/h) = O(n²·d_model). Identique à une seule tête avec d_k = d_model. Le Multi-Head offre donc une plus grande expressivité (h sous-espaces différents) sans surcoût computationnel — c'est le compromis clé justifiant son utilisation.`,
        sourceNote: 'Vaswani et al. 2017, Section 3.2.2',
      },
      {
        id: 'p2_sdpa_008',
        type: 'truefalse',
        difficulty: 5,
        statement: `L'attention additive (Bahdanau 2015) et le Scaled Dot-Product Attention ont la même complexité asymptotique pour de grands d_k.`,
        isTrue: false,
        justificationRequired: true,
        explanation: `Faux. Dot-product : O(n²·d_k) et implémenté via multiplication matricielle optimisée (BLAS). Additive (Bahdanau) : atten = v·tanh(W₁Q + W₂K) nécessite un FFN pour chaque paire (Q_i, K_j) → O(n²·d_k) mais avec une constante plus grande (opérations non-vectorisables efficacement). Pour d_k petit, les différences sont minimes ; pour d_k grand, le dot-product est bien plus rapide en pratique grâce aux bibliothèques BLAS.`,
        sourceNote: 'Vaswani et al. 2017, Section 3.2.1 — comparaison avec Bahdanau 2015.',
      },
    ],
  },

  phase5: {
    questions: [
      {
        id: 'p5_sdpa_001',
        type: 'implementation',
        difficulty: 4,
        title: 'Implémenter le Scaled Dot-Product Attention from scratch',
        starter: `import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q: (batch, seq_q, d_k)
    K: (batch, seq_k, d_k)
    V: (batch, seq_k, d_v)
    mask: (batch, seq_q, seq_k) ou None

    Retourne: output (batch, seq_q, d_v), attention_weights (batch, seq_q, seq_k)
    """
    d_k = Q.shape[-1]

    # Étape 1: Calcule les scores bruts
    scores = ___  # shape: (batch, seq_q, seq_k)

    # Étape 2: Mise à l'échelle
    scores = scores / ___

    # Étape 3: Applique le masque (optionnel)
    if mask is not None:
        scores = scores + mask * ___  # -1e9 simule -inf

    # Étape 4: Softmax sur la dernière dimension
    attention_weights = ___

    # Étape 5: Pondération des Values
    output = ___

    return output, attention_weights`,
        solution: `import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.shape[-1]
    scores = np.matmul(Q, K.transpose(0, 2, 1))  # (b, sq, sk)
    scores = scores / np.sqrt(d_k)
    if mask is not None:
        scores = scores + mask * (-1e9)

    def softmax(x):
        x_max = np.max(x, axis=-1, keepdims=True)
        exp_x = np.exp(x - x_max)
        return exp_x / np.sum(exp_x, axis=-1, keepdims=True)

    attention_weights = softmax(scores)
    output = np.matmul(attention_weights, V)
    return output, attention_weights`,
        testCases: [
          {
            input: {
              Q: 'np.array([[[1,0],[0,1]]])',
              K: 'np.array([[[1,0],[0,1],[1,1]]])',
              V: 'np.array([[[1],[2],[3]]])',
            },
            expectedShape_output: [1, 2, 1],
            expectedShape_weights: [1, 2, 3],
            checkSumToOne: 'attention_weights.sum(axis=-1) ≈ 1.0',
          },
        ],
      },
    ],
  },

  phase6: {
    paper: {
      title: 'Attention Is All You Need',
      authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit',
                'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
      year: 2017,
      venue: 'NeurIPS 2017',
      arxiv: '1706.03762',
      keyContributions: [
        'Élimination complète des récurrences et convolutions',
        'Architecture basée uniquement sur l\'attention (self-attention)',
        'Parallélisation complète de l\'entraînement',
        'BLEU state-of-the-art sur WMT 2014 EN-DE (28.4) et EN-FR (41.0)',
      ],
    },
    questions: [
      {
        id: 'p6_sdpa_001',
        type: 'open',
        difficulty: 5,
        question: `Section 3.2.2 du paper : les auteurs justifient l'utilisation du Scaled Dot-Product Attention plutôt que l'Additive Attention (Bahdanau 2015) par des arguments de complexité et de performance pratique. Explique précisément (a) pourquoi le dot-product est plus rapide, et (b) pourquoi les auteurs pensent néanmoins que l'additive attention pourrait être préférable pour de grands d_k.`,
        expectedKeyPoints: [
          'Dot-product : implémenté comme multiplication matricielle optimisée (BLAS), beaucoup plus rapide en pratique',
          'Additive : nécessite un réseau FFN supplémentaire, plus coûteux par opération',
          'Pour grand d_k, le dot-product a variance d_k → saturation du softmax → gradients ≈ 0',
          'L\'additive attention est plus stable pour grand d_k car la variance ne dépend pas de d_k de la même façon',
          'Solution des auteurs : diviser par √d_k → dot-product stable à toutes dimensions',
        ],
        evaluationMode: 'ai_rubric',
        rubricWeight: [3, 3, 3, 3, 3],
      },
      {
        id: 'p6_sdpa_002',
        type: 'mcq',
        difficulty: 5,
        question: `Table 2 du paper : le Transformer (big) atteint 28.4 BLEU sur EN-DE avec un coût d'entraînement de 3.3×10¹⁸ FLOPs. ByteNet (Kalchbrenner et al.) atteignait 23.75. Quel est l'argument principal des auteurs pour expliquer cette supériorité ?`,
        options: [
          `Le Transformer réduit le nombre d'opérations séquentielles à O(1) vs O(n) pour ByteNet, permettant de capturer des dépendances à longue portée plus efficacement`,
          `Le Transformer utilise plus de paramètres que ByteNet (213M vs 20M)`,
          `ByteNet utilise des convolutions causales qui ne peuvent pas traiter le texte de droite à gauche`,
          `Le Transformer bénéficie de pré-entraînement sur plus de données`,
        ],
        correctIndex: 0,
        explanation: `Les auteurs (Table 1) comparent la longueur du chemin maximum entre deux positions. Pour les RNN : O(n). Pour les CNN (ByteNet) : O(log_k(n)). Pour le Transformer : O(1). Un chemin plus court = gradient qui circule mieux = meilleure modélisation des dépendances longues.`,
        sourceNote: 'Vaswani et al. 2017, Section 4, Table 1',
      },
    ],
  },
};
