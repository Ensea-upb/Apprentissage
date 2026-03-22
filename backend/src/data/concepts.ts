export interface Concept {
  id: string;
  blockId: number;
  moduleId: string;
  blockName: string;
  moduleName: string;
  label: string;
  paperRef?: string;
  prerequisites: string[];
}

export const CONCEPTS: Concept[] = [
  // ── BLOCK 0 : Mathématiques fondamentales ──────────────────────────────────

  // Module 0.1 – Algèbre linéaire
  { id: '0.1.01', blockId: 0, moduleId: '0.1', blockName: 'Math Fondamentaux', moduleName: 'Algèbre Linéaire', label: 'Vecteurs & espaces vectoriels', prerequisites: [] },
  { id: '0.1.02', blockId: 0, moduleId: '0.1', blockName: 'Math Fondamentaux', moduleName: 'Algèbre Linéaire', label: 'Matrices & opérations', prerequisites: ['0.1.01'] },
  { id: '0.1.03', blockId: 0, moduleId: '0.1', blockName: 'Math Fondamentaux', moduleName: 'Algèbre Linéaire', label: 'Déterminant & inverse', prerequisites: ['0.1.02'] },
  { id: '0.1.04', blockId: 0, moduleId: '0.1', blockName: 'Math Fondamentaux', moduleName: 'Algèbre Linéaire', label: 'Valeurs propres & vecteurs propres', prerequisites: ['0.1.03'] },
  { id: '0.1.05', blockId: 0, moduleId: '0.1', blockName: 'Math Fondamentaux', moduleName: 'Algèbre Linéaire', label: 'Décomposition SVD', prerequisites: ['0.1.04'] },
  { id: '0.1.06', blockId: 0, moduleId: '0.1', blockName: 'Math Fondamentaux', moduleName: 'Algèbre Linéaire', label: 'Produit scalaire & normes', prerequisites: ['0.1.01'] },
  { id: '0.1.07', blockId: 0, moduleId: '0.1', blockName: 'Math Fondamentaux', moduleName: 'Algèbre Linéaire', label: 'Orthogonalité & projection', prerequisites: ['0.1.06'] },
  { id: '0.1.08', blockId: 0, moduleId: '0.1', blockName: 'Math Fondamentaux', moduleName: 'Algèbre Linéaire', label: 'Factorisation LU & QR', prerequisites: ['0.1.07'] },

  // Module 0.2 – Calcul & Optimisation
  { id: '0.2.01', blockId: 0, moduleId: '0.2', blockName: 'Math Fondamentaux', moduleName: 'Calcul & Optimisation', label: 'Dérivées & règle de la chaîne', prerequisites: ['0.1.08'] },
  { id: '0.2.02', blockId: 0, moduleId: '0.2', blockName: 'Math Fondamentaux', moduleName: 'Calcul & Optimisation', label: 'Gradient & dérivées partielles', prerequisites: ['0.2.01'] },
  { id: '0.2.03', blockId: 0, moduleId: '0.2', blockName: 'Math Fondamentaux', moduleName: 'Calcul & Optimisation', label: 'Descente de gradient', prerequisites: ['0.2.02'] },
  { id: '0.2.04', blockId: 0, moduleId: '0.2', blockName: 'Math Fondamentaux', moduleName: 'Calcul & Optimisation', label: 'Convexité & optima', prerequisites: ['0.2.03'] },
  { id: '0.2.05', blockId: 0, moduleId: '0.2', blockName: 'Math Fondamentaux', moduleName: 'Calcul & Optimisation', label: 'Multiplicateurs de Lagrange', prerequisites: ['0.2.04'] },
  { id: '0.2.06', blockId: 0, moduleId: '0.2', blockName: 'Math Fondamentaux', moduleName: 'Calcul & Optimisation', label: 'Intégration & théorèmes fondamentaux', prerequisites: ['0.2.01'] },
  { id: '0.2.07', blockId: 0, moduleId: '0.2', blockName: 'Math Fondamentaux', moduleName: 'Calcul & Optimisation', label: 'Approximation de Taylor', prerequisites: ['0.2.06'] },

  // Module 0.3 – Probabilités & Statistiques
  { id: '0.3.01', blockId: 0, moduleId: '0.3', blockName: 'Math Fondamentaux', moduleName: 'Probabilités & Statistiques', label: 'Espaces de probabilité & axiomes', prerequisites: ['0.2.07'] },
  { id: '0.3.02', blockId: 0, moduleId: '0.3', blockName: 'Math Fondamentaux', moduleName: 'Probabilités & Statistiques', label: 'Variables aléatoires discrètes', prerequisites: ['0.3.01'] },
  { id: '0.3.03', blockId: 0, moduleId: '0.3', blockName: 'Math Fondamentaux', moduleName: 'Probabilités & Statistiques', label: 'Variables aléatoires continues', prerequisites: ['0.3.02'] },
  { id: '0.3.04', blockId: 0, moduleId: '0.3', blockName: 'Math Fondamentaux', moduleName: 'Probabilités & Statistiques', label: 'Loi normale & TCL', prerequisites: ['0.3.03'] },
  { id: '0.3.05', blockId: 0, moduleId: '0.3', blockName: 'Math Fondamentaux', moduleName: 'Probabilités & Statistiques', label: 'Statistiques descriptives', prerequisites: ['0.3.04'] },
  { id: '0.3.06', blockId: 0, moduleId: '0.3', blockName: 'Math Fondamentaux', moduleName: 'Probabilités & Statistiques', label: 'Tests d\'hypothèses', prerequisites: ['0.3.05'] },
  { id: '0.3.07', blockId: 0, moduleId: '0.3', blockName: 'Math Fondamentaux', moduleName: 'Probabilités & Statistiques', label: 'Inférence bayésienne', prerequisites: ['0.3.06'] },
  { id: '0.3.08', blockId: 0, moduleId: '0.3', blockName: 'Math Fondamentaux', moduleName: 'Probabilités & Statistiques', label: 'Distributions multivariées', prerequisites: ['0.3.07'] },

  // Module 0.4 – Théorie de l'information
  { id: '0.4.01', blockId: 0, moduleId: '0.4', blockName: 'Math Fondamentaux', moduleName: 'Théorie de l\'Information', label: 'Entropie de Shannon', prerequisites: ['0.3.08'] },
  { id: '0.4.02', blockId: 0, moduleId: '0.4', blockName: 'Math Fondamentaux', moduleName: 'Théorie de l\'Information', label: 'Entropie croisée & KL divergence', prerequisites: ['0.4.01'] },
  { id: '0.4.03', blockId: 0, moduleId: '0.4', blockName: 'Math Fondamentaux', moduleName: 'Théorie de l\'Information', label: 'Information mutuelle', prerequisites: ['0.4.02'] },
  { id: '0.4.04', blockId: 0, moduleId: '0.4', blockName: 'Math Fondamentaux', moduleName: 'Théorie de l\'Information', label: 'MLE & MAP', prerequisites: ['0.4.03'] },

  // ── BLOCK 1 : Python & Outils ──────────────────────────────────────────────

  // Module 1.1 – Python core
  { id: '1.1.01', blockId: 1, moduleId: '1.1', blockName: 'Python & Outils', moduleName: 'Python Core', label: 'Types & structures de données Python', prerequisites: [] },
  { id: '1.1.02', blockId: 1, moduleId: '1.1', blockName: 'Python & Outils', moduleName: 'Python Core', label: 'Fonctions & closures', prerequisites: ['1.1.01'] },
  { id: '1.1.03', blockId: 1, moduleId: '1.1', blockName: 'Python & Outils', moduleName: 'Python Core', label: 'Programmation orientée objet', prerequisites: ['1.1.02'] },
  { id: '1.1.04', blockId: 1, moduleId: '1.1', blockName: 'Python & Outils', moduleName: 'Python Core', label: 'Itérateurs, générateurs & comprehensions', prerequisites: ['1.1.03'] },
  { id: '1.1.05', blockId: 1, moduleId: '1.1', blockName: 'Python & Outils', moduleName: 'Python Core', label: 'Gestion des erreurs & contextes', prerequisites: ['1.1.04'] },
  { id: '1.1.06', blockId: 1, moduleId: '1.1', blockName: 'Python & Outils', moduleName: 'Python Core', label: 'Modules & packages', prerequisites: ['1.1.05'] },

  // Module 1.2 – NumPy
  { id: '1.2.01', blockId: 1, moduleId: '1.2', blockName: 'Python & Outils', moduleName: 'NumPy', label: 'Tableaux ndarray', prerequisites: ['1.1.06'] },
  { id: '1.2.02', blockId: 1, moduleId: '1.2', blockName: 'Python & Outils', moduleName: 'NumPy', label: 'Indexation & slicing', prerequisites: ['1.2.01'] },
  { id: '1.2.03', blockId: 1, moduleId: '1.2', blockName: 'Python & Outils', moduleName: 'NumPy', label: 'Broadcasting', prerequisites: ['1.2.02'] },
  { id: '1.2.04', blockId: 1, moduleId: '1.2', blockName: 'Python & Outils', moduleName: 'NumPy', label: 'Opérations vectorisées', prerequisites: ['1.2.03'] },
  { id: '1.2.05', blockId: 1, moduleId: '1.2', blockName: 'Python & Outils', moduleName: 'NumPy', label: 'Algèbre linéaire NumPy', prerequisites: ['1.2.04'] },

  // Module 1.3 – Pandas
  { id: '1.3.01', blockId: 1, moduleId: '1.3', blockName: 'Python & Outils', moduleName: 'Pandas', label: 'Series & DataFrame', prerequisites: ['1.2.05'] },
  { id: '1.3.02', blockId: 1, moduleId: '1.3', blockName: 'Python & Outils', moduleName: 'Pandas', label: 'Sélection & filtrage', prerequisites: ['1.3.01'] },
  { id: '1.3.03', blockId: 1, moduleId: '1.3', blockName: 'Python & Outils', moduleName: 'Pandas', label: 'GroupBy & agrégation', prerequisites: ['1.3.02'] },
  { id: '1.3.04', blockId: 1, moduleId: '1.3', blockName: 'Python & Outils', moduleName: 'Pandas', label: 'Merge, join & reshape', prerequisites: ['1.3.03'] },
  { id: '1.3.05', blockId: 1, moduleId: '1.3', blockName: 'Python & Outils', moduleName: 'Pandas', label: 'Séries temporelles', prerequisites: ['1.3.04'] },

  // Module 1.4 – Matplotlib & Seaborn
  { id: '1.4.01', blockId: 1, moduleId: '1.4', blockName: 'Python & Outils', moduleName: 'Visualisation', label: 'Matplotlib fondamentaux', prerequisites: ['1.3.05'] },
  { id: '1.4.02', blockId: 1, moduleId: '1.4', blockName: 'Python & Outils', moduleName: 'Visualisation', label: 'Seaborn & visualisation statistique', prerequisites: ['1.4.01'] },
  { id: '1.4.03', blockId: 1, moduleId: '1.4', blockName: 'Python & Outils', moduleName: 'Visualisation', label: 'Visualisations interactives (Plotly)', prerequisites: ['1.4.02'] },

  // Module 1.5 – Environnements & outils
  { id: '1.5.01', blockId: 1, moduleId: '1.5', blockName: 'Python & Outils', moduleName: 'Environnements & Outils', label: 'Jupyter & notebooks', prerequisites: ['1.4.03'] },
  { id: '1.5.02', blockId: 1, moduleId: '1.5', blockName: 'Python & Outils', moduleName: 'Environnements & Outils', label: 'Git & contrôle de version', prerequisites: ['1.5.01'] },
  { id: '1.5.03', blockId: 1, moduleId: '1.5', blockName: 'Python & Outils', moduleName: 'Environnements & Outils', label: 'Environnements virtuels & Docker', prerequisites: ['1.5.02'] },
  { id: '1.5.04', blockId: 1, moduleId: '1.5', blockName: 'Python & Outils', moduleName: 'Environnements & Outils', label: 'Profilage & optimisation Python', prerequisites: ['1.5.03'] },

  // ── BLOCK 2 : Préparation des données ─────────────────────────────────────

  // Module 2.1 – Feature Engineering
  { id: '2.1.01', blockId: 2, moduleId: '2.1', blockName: 'Préparation des Données', moduleName: 'Feature Engineering', label: 'Nettoyage & valeurs manquantes', prerequisites: ['1.5.04'] },
  { id: '2.1.02', blockId: 2, moduleId: '2.1', blockName: 'Préparation des Données', moduleName: 'Feature Engineering', label: 'Encodage des variables catégorielles', prerequisites: ['2.1.01'] },
  { id: '2.1.03', blockId: 2, moduleId: '2.1', blockName: 'Préparation des Données', moduleName: 'Feature Engineering', label: 'Normalisation & standardisation', prerequisites: ['2.1.02'] },
  { id: '2.1.04', blockId: 2, moduleId: '2.1', blockName: 'Préparation des Données', moduleName: 'Feature Engineering', label: 'Feature selection', prerequisites: ['2.1.03'] },
  { id: '2.1.05', blockId: 2, moduleId: '2.1', blockName: 'Préparation des Données', moduleName: 'Feature Engineering', label: 'Feature construction & interactions', prerequisites: ['2.1.04'] },
  { id: '2.1.06', blockId: 2, moduleId: '2.1', blockName: 'Préparation des Données', moduleName: 'Feature Engineering', label: 'Outliers & distributions asymétriques', prerequisites: ['2.1.05'] },

  // Module 2.2 – Évaluation & validation
  { id: '2.2.01', blockId: 2, moduleId: '2.2', blockName: 'Préparation des Données', moduleName: 'Évaluation & Validation', label: 'Train/validation/test split', prerequisites: ['2.1.06'] },
  { id: '2.2.02', blockId: 2, moduleId: '2.2', blockName: 'Préparation des Données', moduleName: 'Évaluation & Validation', label: 'Cross-validation', prerequisites: ['2.2.01'] },
  { id: '2.2.03', blockId: 2, moduleId: '2.2', blockName: 'Préparation des Données', moduleName: 'Évaluation & Validation', label: 'Métriques de classification', prerequisites: ['2.2.02'] },
  { id: '2.2.04', blockId: 2, moduleId: '2.2', blockName: 'Préparation des Données', moduleName: 'Évaluation & Validation', label: 'Métriques de régression', prerequisites: ['2.2.03'] },
  { id: '2.2.05', blockId: 2, moduleId: '2.2', blockName: 'Préparation des Données', moduleName: 'Évaluation & Validation', label: 'Biais-variance & overfitting', prerequisites: ['2.2.04'] },
  { id: '2.2.06', blockId: 2, moduleId: '2.2', blockName: 'Préparation des Données', moduleName: 'Évaluation & Validation', label: 'Courbes ROC, AUC & calibration', prerequisites: ['2.2.05'] },

  // ── BLOCK 3 : ML Classique ────────────────────────────────────────────────

  // Module 3.1 – Régression
  { id: '3.1.01', blockId: 3, moduleId: '3.1', blockName: 'ML Classique', moduleName: 'Régression', label: 'Régression linéaire', prerequisites: ['2.2.06'] },
  { id: '3.1.02', blockId: 3, moduleId: '3.1', blockName: 'ML Classique', moduleName: 'Régression', label: 'Régression polynomiale', prerequisites: ['3.1.01'] },
  { id: '3.1.03', blockId: 3, moduleId: '3.1', blockName: 'ML Classique', moduleName: 'Régression', label: 'Régression Ridge, Lasso & ElasticNet', prerequisites: ['3.1.02'] },
  { id: '3.1.04', blockId: 3, moduleId: '3.1', blockName: 'ML Classique', moduleName: 'Régression', label: 'Régression logistique', prerequisites: ['3.1.03'] },
  { id: '3.1.05', blockId: 3, moduleId: '3.1', blockName: 'ML Classique', moduleName: 'Régression', label: 'Régression bayésienne', prerequisites: ['3.1.04'] },

  // Module 3.2 – Arbres & Ensembles
  { id: '3.2.01', blockId: 3, moduleId: '3.2', blockName: 'ML Classique', moduleName: 'Arbres & Ensembles', label: 'Arbres de décision (CART)', prerequisites: ['3.1.05'] },
  { id: '3.2.02', blockId: 3, moduleId: '3.2', blockName: 'ML Classique', moduleName: 'Arbres & Ensembles', label: 'Random Forest', prerequisites: ['3.2.01'] },
  { id: '3.2.03', blockId: 3, moduleId: '3.2', blockName: 'ML Classique', moduleName: 'Arbres & Ensembles', label: 'Gradient Boosting (GBM)', prerequisites: ['3.2.02'] },
  { id: '3.2.04', blockId: 3, moduleId: '3.2', blockName: 'ML Classique', moduleName: 'Arbres & Ensembles', label: 'XGBoost & LightGBM', prerequisites: ['3.2.03'] },
  { id: '3.2.05', blockId: 3, moduleId: '3.2', blockName: 'ML Classique', moduleName: 'Arbres & Ensembles', label: 'Stacking & blending', prerequisites: ['3.2.04'] },

  // Module 3.3 – SVM & méthodes à noyau
  { id: '3.3.01', blockId: 3, moduleId: '3.3', blockName: 'ML Classique', moduleName: 'SVM & Noyaux', label: 'SVM linéaire', prerequisites: ['3.2.05'] },
  { id: '3.3.02', blockId: 3, moduleId: '3.3', blockName: 'ML Classique', moduleName: 'SVM & Noyaux', label: 'Kernel trick & noyaux RBF', prerequisites: ['3.3.01'] },
  { id: '3.3.03', blockId: 3, moduleId: '3.3', blockName: 'ML Classique', moduleName: 'SVM & Noyaux', label: 'SVR & one-class SVM', prerequisites: ['3.3.02'] },

  // Module 3.4 – Clustering
  { id: '3.4.01', blockId: 3, moduleId: '3.4', blockName: 'ML Classique', moduleName: 'Clustering', label: 'K-Means', prerequisites: ['3.3.03'] },
  { id: '3.4.02', blockId: 3, moduleId: '3.4', blockName: 'ML Classique', moduleName: 'Clustering', label: 'Clustering hiérarchique', prerequisites: ['3.4.01'] },
  { id: '3.4.03', blockId: 3, moduleId: '3.4', blockName: 'ML Classique', moduleName: 'Clustering', label: 'DBSCAN & HDBSCAN', prerequisites: ['3.4.02'] },
  { id: '3.4.04', blockId: 3, moduleId: '3.4', blockName: 'ML Classique', moduleName: 'Clustering', label: 'Gaussian Mixture Models', prerequisites: ['3.4.03'] },

  // Module 3.5 – Réduction de dimensionnalité
  { id: '3.5.01', blockId: 3, moduleId: '3.5', blockName: 'ML Classique', moduleName: 'Réduction Dimensionnelle', label: 'PCA', prerequisites: ['3.4.04'] },
  { id: '3.5.02', blockId: 3, moduleId: '3.5', blockName: 'ML Classique', moduleName: 'Réduction Dimensionnelle', label: 't-SNE', prerequisites: ['3.5.01'] },
  { id: '3.5.03', blockId: 3, moduleId: '3.5', blockName: 'ML Classique', moduleName: 'Réduction Dimensionnelle', label: 'UMAP', prerequisites: ['3.5.02'] },
  { id: '3.5.04', blockId: 3, moduleId: '3.5', blockName: 'ML Classique', moduleName: 'Réduction Dimensionnelle', label: 'Autoencodeurs linéaires', prerequisites: ['3.5.03'] },

  // Module 3.6 – Modèles probabilistes
  { id: '3.6.01', blockId: 3, moduleId: '3.6', blockName: 'ML Classique', moduleName: 'Modèles Probabilistes', label: 'Naïve Bayes', prerequisites: ['3.5.04'] },
  { id: '3.6.02', blockId: 3, moduleId: '3.6', blockName: 'ML Classique', moduleName: 'Modèles Probabilistes', label: 'Hidden Markov Models', prerequisites: ['3.6.01'] },
  { id: '3.6.03', blockId: 3, moduleId: '3.6', blockName: 'ML Classique', moduleName: 'Modèles Probabilistes', label: 'Réseaux bayésiens', prerequisites: ['3.6.02'] },

  // ── BLOCK 4 : Deep Learning ───────────────────────────────────────────────

  // Module 4.1 – Fondations du DL
  { id: '4.1.01', blockId: 4, moduleId: '4.1', blockName: 'Deep Learning', moduleName: 'Fondations DL', label: 'Perceptron & réseaux de neurones', prerequisites: ['3.6.03'] },
  { id: '4.1.02', blockId: 4, moduleId: '4.1', blockName: 'Deep Learning', moduleName: 'Fondations DL', label: 'Rétropropagation', prerequisites: ['4.1.01'] },
  { id: '4.1.03', blockId: 4, moduleId: '4.1', blockName: 'Deep Learning', moduleName: 'Fondations DL', label: 'Fonctions d\'activation', prerequisites: ['4.1.02'] },
  { id: '4.1.04', blockId: 4, moduleId: '4.1', blockName: 'Deep Learning', moduleName: 'Fondations DL', label: 'Optimiseurs (SGD, Adam, RMSProp)', prerequisites: ['4.1.03'] },
  { id: '4.1.05', blockId: 4, moduleId: '4.1', blockName: 'Deep Learning', moduleName: 'Fondations DL', label: 'Régularisation (Dropout, BN, L1/L2)', prerequisites: ['4.1.04'] },
  { id: '4.1.06', blockId: 4, moduleId: '4.1', blockName: 'Deep Learning', moduleName: 'Fondations DL', label: 'Initialisation des poids', prerequisites: ['4.1.05'] },

  // Module 4.2 – CNN
  { id: '4.2.01', blockId: 4, moduleId: '4.2', blockName: 'Deep Learning', moduleName: 'CNN', label: 'Convolution & pooling', prerequisites: ['4.1.06'] },
  { id: '4.2.02', blockId: 4, moduleId: '4.2', blockName: 'Deep Learning', moduleName: 'CNN', label: 'Architectures classiques (LeNet, AlexNet, VGG)', prerequisites: ['4.2.01'] },
  { id: '4.2.03', blockId: 4, moduleId: '4.2', blockName: 'Deep Learning', moduleName: 'CNN', label: 'ResNet & connexions résiduelles', prerequisites: ['4.2.02'] },
  { id: '4.2.04', blockId: 4, moduleId: '4.2', blockName: 'Deep Learning', moduleName: 'CNN', label: 'Transfer learning & fine-tuning', prerequisites: ['4.2.03'] },
  { id: '4.2.05', blockId: 4, moduleId: '4.2', blockName: 'Deep Learning', moduleName: 'CNN', label: 'Data augmentation images', prerequisites: ['4.2.04'] },

  // Module 4.3 – RNN & séquences
  { id: '4.3.01', blockId: 4, moduleId: '4.3', blockName: 'Deep Learning', moduleName: 'RNN & Séquences', label: 'RNN vanille & BPTT', prerequisites: ['4.2.05'] },
  { id: '4.3.02', blockId: 4, moduleId: '4.3', blockName: 'Deep Learning', moduleName: 'RNN & Séquences', label: 'LSTM', prerequisites: ['4.3.01'] },
  { id: '4.3.03', blockId: 4, moduleId: '4.3', blockName: 'Deep Learning', moduleName: 'RNN & Séquences', label: 'GRU', prerequisites: ['4.3.02'] },
  { id: '4.3.04', blockId: 4, moduleId: '4.3', blockName: 'Deep Learning', moduleName: 'RNN & Séquences', label: 'Seq2Seq & attention de Bahdanau', prerequisites: ['4.3.03'] },

  // Module 4.4 – Transformers
  { id: '4.4.01', blockId: 4, moduleId: '4.4', blockName: 'Deep Learning', moduleName: 'Transformers', label: 'Mécanisme d\'attention (self-attention)', prerequisites: ['4.3.04'] },
  { id: '4.4.02', blockId: 4, moduleId: '4.4', blockName: 'Deep Learning', moduleName: 'Transformers', label: 'Multi-head attention', prerequisites: ['4.4.01'] },
  { id: '4.4.03', blockId: 4, moduleId: '4.4', blockName: 'Deep Learning', moduleName: 'Transformers', label: 'Architecture Transformer complète', prerequisites: ['4.4.02'], paperRef: 'Vaswani et al. 2017' },
  { id: '4.4.04', blockId: 4, moduleId: '4.4', blockName: 'Deep Learning', moduleName: 'Transformers', label: 'Encodages positionnels', prerequisites: ['4.4.03'] },
  { id: '4.4.05', blockId: 4, moduleId: '4.4', blockName: 'Deep Learning', moduleName: 'Transformers', label: 'BERT & encodeurs', prerequisites: ['4.4.04'], paperRef: 'Devlin et al. 2019' },

  // Module 4.5 – Modèles génératifs
  { id: '4.5.01', blockId: 4, moduleId: '4.5', blockName: 'Deep Learning', moduleName: 'Modèles Génératifs', label: 'Autoencodeurs variationnels (VAE)', prerequisites: ['4.4.05'], paperRef: 'Kingma & Welling 2014' },
  { id: '4.5.02', blockId: 4, moduleId: '4.5', blockName: 'Deep Learning', moduleName: 'Modèles Génératifs', label: 'GAN fondamentaux', prerequisites: ['4.5.01'], paperRef: 'Goodfellow et al. 2014' },
  { id: '4.5.03', blockId: 4, moduleId: '4.5', blockName: 'Deep Learning', moduleName: 'Modèles Génératifs', label: 'Conditional GAN & StyleGAN', prerequisites: ['4.5.02'] },
  { id: '4.5.04', blockId: 4, moduleId: '4.5', blockName: 'Deep Learning', moduleName: 'Modèles Génératifs', label: 'Flow models', prerequisites: ['4.5.03'] },
  { id: '4.5.05', blockId: 4, moduleId: '4.5', blockName: 'Deep Learning', moduleName: 'Modèles Génératifs', label: 'Diffusion models', prerequisites: ['4.5.04'], paperRef: 'Ho et al. 2020' },

  // ── BLOCK 5 : NLP ─────────────────────────────────────────────────────────

  // Module 5.1 – NLP classique
  { id: '5.1.01', blockId: 5, moduleId: '5.1', blockName: 'NLP', moduleName: 'NLP Classique', label: 'Tokenisation & prétraitement', prerequisites: ['4.5.05'] },
  { id: '5.1.02', blockId: 5, moduleId: '5.1', blockName: 'NLP', moduleName: 'NLP Classique', label: 'Bag of Words & TF-IDF', prerequisites: ['5.1.01'] },
  { id: '5.1.03', blockId: 5, moduleId: '5.1', blockName: 'NLP', moduleName: 'NLP Classique', label: 'Word embeddings (Word2Vec, GloVe)', prerequisites: ['5.1.02'] },
  { id: '5.1.04', blockId: 5, moduleId: '5.1', blockName: 'NLP', moduleName: 'NLP Classique', label: 'Topic modeling (LDA)', prerequisites: ['5.1.03'] },
  { id: '5.1.05', blockId: 5, moduleId: '5.1', blockName: 'NLP', moduleName: 'NLP Classique', label: 'NER & POS tagging', prerequisites: ['5.1.04'] },

  // Module 5.2 – NLP moderne
  { id: '5.2.01', blockId: 5, moduleId: '5.2', blockName: 'NLP', moduleName: 'NLP Moderne', label: 'GPT & modèles de langage autoregressifs', prerequisites: ['5.1.05'] },
  { id: '5.2.02', blockId: 5, moduleId: '5.2', blockName: 'NLP', moduleName: 'NLP Moderne', label: 'T5 & modèles encoder-decoder', prerequisites: ['5.2.01'] },
  { id: '5.2.03', blockId: 5, moduleId: '5.2', blockName: 'NLP', moduleName: 'NLP Moderne', label: 'Tokenisers BPE & SentencePiece', prerequisites: ['5.2.02'] },
  { id: '5.2.04', blockId: 5, moduleId: '5.2', blockName: 'NLP', moduleName: 'NLP Moderne', label: 'Sentence embeddings & recherche sémantique', prerequisites: ['5.2.03'] },
  { id: '5.2.05', blockId: 5, moduleId: '5.2', blockName: 'NLP', moduleName: 'NLP Moderne', label: 'Fine-tuning & instruction tuning', prerequisites: ['5.2.04'] },

  // Module 5.3 – Applications NLP
  { id: '5.3.01', blockId: 5, moduleId: '5.3', blockName: 'NLP', moduleName: 'Applications NLP', label: 'Classification de texte', prerequisites: ['5.2.05'] },
  { id: '5.3.02', blockId: 5, moduleId: '5.3', blockName: 'NLP', moduleName: 'Applications NLP', label: 'Question Answering (extractif & génératif)', prerequisites: ['5.3.01'] },
  { id: '5.3.03', blockId: 5, moduleId: '5.3', blockName: 'NLP', moduleName: 'Applications NLP', label: 'Résumé automatique', prerequisites: ['5.3.02'] },
  { id: '5.3.04', blockId: 5, moduleId: '5.3', blockName: 'NLP', moduleName: 'Applications NLP', label: 'Traduction automatique neuronale', prerequisites: ['5.3.03'] },

  // ── BLOCK 6 : Computer Vision ─────────────────────────────────────────────

  // Module 6.1
  { id: '6.1.01', blockId: 6, moduleId: '6.1', blockName: 'Computer Vision', moduleName: 'Computer Vision', label: 'Détection d\'objets (YOLO, Faster R-CNN)', prerequisites: ['5.3.04'] },
  { id: '6.1.02', blockId: 6, moduleId: '6.1', blockName: 'Computer Vision', moduleName: 'Computer Vision', label: 'Segmentation (FCN, U-Net, Mask R-CNN)', prerequisites: ['6.1.01'] },
  { id: '6.1.03', blockId: 6, moduleId: '6.1', blockName: 'Computer Vision', moduleName: 'Computer Vision', label: 'Vision Transformers (ViT)', prerequisites: ['6.1.02'], paperRef: 'Dosovitskiy et al. 2021' },
  { id: '6.1.04', blockId: 6, moduleId: '6.1', blockName: 'Computer Vision', moduleName: 'Computer Vision', label: 'Estimation de pose & depth estimation', prerequisites: ['6.1.03'] },
  { id: '6.1.05', blockId: 6, moduleId: '6.1', blockName: 'Computer Vision', moduleName: 'Computer Vision', label: 'Modèles vision-langage (CLIP, BLIP)', prerequisites: ['6.1.04'], paperRef: 'Radford et al. 2021' },

  // ── BLOCK 7 : MLOps ───────────────────────────────────────────────────────

  // Module 7.1 – Pipelines & déploiement
  { id: '7.1.01', blockId: 7, moduleId: '7.1', blockName: 'MLOps', moduleName: 'Pipelines & Déploiement', label: 'Containerisation Docker pour ML', prerequisites: ['6.1.05'] },
  { id: '7.1.02', blockId: 7, moduleId: '7.1', blockName: 'MLOps', moduleName: 'Pipelines & Déploiement', label: 'API REST pour modèles ML (FastAPI)', prerequisites: ['7.1.01'] },
  { id: '7.1.03', blockId: 7, moduleId: '7.1', blockName: 'MLOps', moduleName: 'Pipelines & Déploiement', label: 'CI/CD pour ML', prerequisites: ['7.1.02'] },
  { id: '7.1.04', blockId: 7, moduleId: '7.1', blockName: 'MLOps', moduleName: 'Pipelines & Déploiement', label: 'Kubernetes pour ML', prerequisites: ['7.1.03'] },

  // Module 7.2 – Suivi & monitoring
  { id: '7.2.01', blockId: 7, moduleId: '7.2', blockName: 'MLOps', moduleName: 'Suivi & Monitoring', label: 'MLflow & suivi d\'expériences', prerequisites: ['7.1.04'] },
  { id: '7.2.02', blockId: 7, moduleId: '7.2', blockName: 'MLOps', moduleName: 'Suivi & Monitoring', label: 'Data versioning (DVC)', prerequisites: ['7.2.01'] },
  { id: '7.2.03', blockId: 7, moduleId: '7.2', blockName: 'MLOps', moduleName: 'Suivi & Monitoring', label: 'Monitoring de la dérive des données', prerequisites: ['7.2.02'] },
  { id: '7.2.04', blockId: 7, moduleId: '7.2', blockName: 'MLOps', moduleName: 'Suivi & Monitoring', label: 'A/B testing & shadow deployment', prerequisites: ['7.2.03'] },

  // Module 7.3 – Feature stores & orchestration
  { id: '7.3.01', blockId: 7, moduleId: '7.3', blockName: 'MLOps', moduleName: 'Feature Stores & Orchestration', label: 'Feature stores (Feast)', prerequisites: ['7.2.04'] },
  { id: '7.3.02', blockId: 7, moduleId: '7.3', blockName: 'MLOps', moduleName: 'Feature Stores & Orchestration', label: 'Orchestration Airflow & Prefect', prerequisites: ['7.3.01'] },
  { id: '7.3.03', blockId: 7, moduleId: '7.3', blockName: 'MLOps', moduleName: 'Feature Stores & Orchestration', label: 'Model registry & governance', prerequisites: ['7.3.02'] },

  // ── BLOCK 8 : LLMs & Agents ───────────────────────────────────────────────

  // Module 8.1 – LLMs
  { id: '8.1.01', blockId: 8, moduleId: '8.1', blockName: 'LLMs & Agents', moduleName: 'LLMs', label: 'Architecture GPT-3/4 & scaling laws', prerequisites: ['7.3.03'] },
  { id: '8.1.02', blockId: 8, moduleId: '8.1', blockName: 'LLMs & Agents', moduleName: 'LLMs', label: 'RLHF & instruction following', prerequisites: ['8.1.01'] },
  { id: '8.1.03', blockId: 8, moduleId: '8.1', blockName: 'LLMs & Agents', moduleName: 'LLMs', label: 'Prompt engineering & few-shot learning', prerequisites: ['8.1.02'] },
  { id: '8.1.04', blockId: 8, moduleId: '8.1', blockName: 'LLMs & Agents', moduleName: 'LLMs', label: 'LoRA & fine-tuning efficace', prerequisites: ['8.1.03'] },
  { id: '8.1.05', blockId: 8, moduleId: '8.1', blockName: 'LLMs & Agents', moduleName: 'LLMs', label: 'Quantification & inférence optimisée', prerequisites: ['8.1.04'] },
  { id: '8.1.06', blockId: 8, moduleId: '8.1', blockName: 'LLMs & Agents', moduleName: 'LLMs', label: 'Hallucination & alignement', prerequisites: ['8.1.05'] },

  // Module 8.2 – Agents IA
  { id: '8.2.01', blockId: 8, moduleId: '8.2', blockName: 'LLMs & Agents', moduleName: 'Agents IA', label: 'RAG (Retrieval Augmented Generation)', prerequisites: ['8.1.06'] },
  { id: '8.2.02', blockId: 8, moduleId: '8.2', blockName: 'LLMs & Agents', moduleName: 'Agents IA', label: 'Vector databases & recherche dense', prerequisites: ['8.2.01'] },
  { id: '8.2.03', blockId: 8, moduleId: '8.2', blockName: 'LLMs & Agents', moduleName: 'Agents IA', label: 'Agents à base d\'outils (ReAct, Tool Use)', prerequisites: ['8.2.02'] },
  { id: '8.2.04', blockId: 8, moduleId: '8.2', blockName: 'LLMs & Agents', moduleName: 'Agents IA', label: 'Multi-agents & orchestration (LangGraph)', prerequisites: ['8.2.03'] },
  { id: '8.2.05', blockId: 8, moduleId: '8.2', blockName: 'LLMs & Agents', moduleName: 'Agents IA', label: 'Evaluation & benchmarking des LLMs', prerequisites: ['8.2.04'] },

  // ── BLOCK 9 : Reinforcement Learning ─────────────────────────────────────

  // Module 9.1
  { id: '9.1.01', blockId: 9, moduleId: '9.1', blockName: 'Reinforcement Learning', moduleName: 'RL Fondamentaux', label: 'MDP & équation de Bellman', prerequisites: ['8.2.05'] },
  { id: '9.1.02', blockId: 9, moduleId: '9.1', blockName: 'Reinforcement Learning', moduleName: 'RL Fondamentaux', label: 'Q-learning & SARSA', prerequisites: ['9.1.01'] },
  { id: '9.1.03', blockId: 9, moduleId: '9.1', blockName: 'Reinforcement Learning', moduleName: 'RL Fondamentaux', label: 'Deep Q-Network (DQN)', prerequisites: ['9.1.02'], paperRef: 'Mnih et al. 2015' },
  { id: '9.1.04', blockId: 9, moduleId: '9.1', blockName: 'Reinforcement Learning', moduleName: 'RL Fondamentaux', label: 'Policy gradient & REINFORCE', prerequisites: ['9.1.03'] },
  { id: '9.1.05', blockId: 9, moduleId: '9.1', blockName: 'Reinforcement Learning', moduleName: 'RL Fondamentaux', label: 'Actor-Critic & PPO', prerequisites: ['9.1.04'] },
  { id: '9.1.06', blockId: 9, moduleId: '9.1', blockName: 'Reinforcement Learning', moduleName: 'RL Fondamentaux', label: 'AlphaGo & RL basé sur les jeux', prerequisites: ['9.1.05'], paperRef: 'Silver et al. 2016' },
  { id: '9.1.07', blockId: 9, moduleId: '9.1', blockName: 'Reinforcement Learning', moduleName: 'RL Fondamentaux', label: 'RL hors ligne (Offline RL)', prerequisites: ['9.1.06'] },

  // ── BLOCK 10 : Bases de Données & Data Engineering ─────────────────────────
  // Accessible dès Python + Pandas (prérequis 1.3.04) — pas besoin du ML

  // Module 10.1 – SQL & Bases relationnelles
  { id: '10.1.01', blockId: 10, moduleId: '10.1', blockName: 'Bases de Données', moduleName: 'SQL & Relationnel', label: 'Modèle relationnel & algèbre relationnelle', prerequisites: ['1.3.04'] },
  { id: '10.1.02', blockId: 10, moduleId: '10.1', blockName: 'Bases de Données', moduleName: 'SQL & Relationnel', label: 'SELECT, WHERE, GROUP BY, HAVING', prerequisites: ['10.1.01'] },
  { id: '10.1.03', blockId: 10, moduleId: '10.1', blockName: 'Bases de Données', moduleName: 'SQL & Relationnel', label: 'JOIN (INNER, LEFT, RIGHT, FULL, CROSS)', prerequisites: ['10.1.02'] },
  { id: '10.1.04', blockId: 10, moduleId: '10.1', blockName: 'Bases de Données', moduleName: 'SQL & Relationnel', label: 'Sous-requêtes & CTEs (WITH)', prerequisites: ['10.1.03'] },
  { id: '10.1.05', blockId: 10, moduleId: '10.1', blockName: 'Bases de Données', moduleName: 'SQL & Relationnel', label: 'Fonctions fenêtrées (WINDOW FUNCTIONS)', prerequisites: ['10.1.04'] },
  { id: '10.1.06', blockId: 10, moduleId: '10.1', blockName: 'Bases de Données', moduleName: 'SQL & Relationnel', label: 'Indexation & plan d\'exécution (EXPLAIN)', prerequisites: ['10.1.05'] },
  { id: '10.1.07', blockId: 10, moduleId: '10.1', blockName: 'Bases de Données', moduleName: 'SQL & Relationnel', label: 'Transactions ACID & niveaux d\'isolation', prerequisites: ['10.1.06'] },
  { id: '10.1.08', blockId: 10, moduleId: '10.1', blockName: 'Bases de Données', moduleName: 'SQL & Relationnel', label: 'Normalisation (1NF, 2NF, 3NF, BCNF)', prerequisites: ['10.1.07'] },
  { id: '10.1.09', blockId: 10, moduleId: '10.1', blockName: 'Bases de Données', moduleName: 'SQL & Relationnel', label: 'SQL analytique & optimisation de requêtes', prerequisites: ['10.1.08'] },

  // Module 10.2 – Modélisation & Conception
  { id: '10.2.01', blockId: 10, moduleId: '10.2', blockName: 'Bases de Données', moduleName: 'Modélisation', label: 'Modélisation entité-relation (ERD)', prerequisites: ['10.1.09'] },
  { id: '10.2.02', blockId: 10, moduleId: '10.2', blockName: 'Bases de Données', moduleName: 'Modélisation', label: 'Schémas en étoile & flocon (Data Warehouse)', prerequisites: ['10.2.01'] },
  { id: '10.2.03', blockId: 10, moduleId: '10.2', blockName: 'Bases de Données', moduleName: 'Modélisation', label: 'OLTP vs OLAP — différences et cas d\'usage', prerequisites: ['10.2.02'] },
  { id: '10.2.04', blockId: 10, moduleId: '10.2', blockName: 'Bases de Données', moduleName: 'Modélisation', label: 'Partitionnement & sharding', prerequisites: ['10.2.03'] },

  // Module 10.3 – NoSQL & Bases distribuées
  { id: '10.3.01', blockId: 10, moduleId: '10.3', blockName: 'Bases de Données', moduleName: 'NoSQL & Distribué', label: 'Théorème CAP & BASE vs ACID', prerequisites: ['10.2.04'] },
  { id: '10.3.02', blockId: 10, moduleId: '10.3', blockName: 'Bases de Données', moduleName: 'NoSQL & Distribué', label: 'Bases document (MongoDB)', prerequisites: ['10.3.01'] },
  { id: '10.3.03', blockId: 10, moduleId: '10.3', blockName: 'Bases de Données', moduleName: 'NoSQL & Distribué', label: 'Bases clé-valeur & cache (Redis)', prerequisites: ['10.3.02'] },
  { id: '10.3.04', blockId: 10, moduleId: '10.3', blockName: 'Bases de Données', moduleName: 'NoSQL & Distribué', label: 'Bases colonne large (Cassandra, HBase)', prerequisites: ['10.3.03'] },
  { id: '10.3.05', blockId: 10, moduleId: '10.3', blockName: 'Bases de Données', moduleName: 'NoSQL & Distribué', label: 'Bases graphes (Neo4j & Cypher)', prerequisites: ['10.3.04'] },
  { id: '10.3.06', blockId: 10, moduleId: '10.3', blockName: 'Bases de Données', moduleName: 'NoSQL & Distribué', label: 'Bases vectorielles (Pinecone, Weaviate, pgvector)', prerequisites: ['10.3.05'] },
  { id: '10.3.07', blockId: 10, moduleId: '10.3', blockName: 'Bases de Données', moduleName: 'NoSQL & Distribué', label: 'Elasticsearch & recherche full-text', prerequisites: ['10.3.06'] },

  // Module 10.4 – Data Engineering & ETL
  { id: '10.4.01', blockId: 10, moduleId: '10.4', blockName: 'Bases de Données', moduleName: 'Data Engineering', label: 'Pipelines ETL vs ELT', prerequisites: ['10.3.07'] },
  { id: '10.4.02', blockId: 10, moduleId: '10.4', blockName: 'Bases de Données', moduleName: 'Data Engineering', label: 'Apache Kafka & streaming temps-réel', prerequisites: ['10.4.01'] },
  { id: '10.4.03', blockId: 10, moduleId: '10.4', blockName: 'Bases de Données', moduleName: 'Data Engineering', label: 'Apache Spark & traitement batch distribué', prerequisites: ['10.4.02'] },
  { id: '10.4.04', blockId: 10, moduleId: '10.4', blockName: 'Bases de Données', moduleName: 'Data Engineering', label: 'Data Lake vs Data Warehouse vs Lakehouse', prerequisites: ['10.4.03'] },
  { id: '10.4.05', blockId: 10, moduleId: '10.4', blockName: 'Bases de Données', moduleName: 'Data Engineering', label: 'dbt & transformation SQL en production', prerequisites: ['10.4.04'] },
  { id: '10.4.06', blockId: 10, moduleId: '10.4', blockName: 'Bases de Données', moduleName: 'Data Engineering', label: 'Qualité des données & Data Contracts', prerequisites: ['10.4.05'] },
];
