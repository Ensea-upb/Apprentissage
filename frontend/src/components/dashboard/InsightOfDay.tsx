import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { aiApi } from '../../api/ai';
import { DailyInsight } from '../../types';

const FALLBACK_INSIGHTS: DailyInsight[] = [
  {
    id: '1',
    title: 'La règle des 80/20 en Data Science',
    content: 'En pratique, 80% du temps d\'un data scientist est consacré à la collecte et au nettoyage des données. Seuls 20% sont dédiés à l\'analyse et la modélisation.',
    category: 'Productivité',
  },
  {
    id: '2',
    title: 'Biais de confirmation',
    content: 'Le biais de confirmation est l\'une des erreurs les plus courantes : les data scientists cherchent inconsciemment des résultats qui confirment leurs hypothèses initiales.',
    category: 'Statistiques',
  },
  {
    id: '3',
    title: 'La malédiction de la dimensionnalité',
    content: 'Avec l\'augmentation du nombre de features, l\'espace de données croît exponentiellement, rendant les algorithmes moins efficaces. C\'est pourquoi la réduction de dimension est essentielle.',
    category: 'Machine Learning',
  },
  {
    id: '4',
    title: 'Overfitting vs Underfitting',
    content: 'Un modèle qui performe bien sur les données d\'entraînement mais mal sur les nouvelles données souffre d\'overfitting. La régularisation (L1, L2) et la validation croisée sont vos meilleurs alliés.',
    category: 'Modélisation',
  },
  {
    id: '5',
    title: 'Loi des grands nombres',
    content: 'Plus l\'échantillon est grand, plus la moyenne empirique converge vers l\'espérance théorique. C\'est le fondement de presque toute la statistique inférentielle.',
    category: 'Statistiques',
  },
];

export default function InsightOfDay() {
  const [insight, setInsight] = useState<DailyInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadInsight();
  }, []);

  const loadInsight = async () => {
    setIsLoading(true);
    try {
      const data = await aiApi.getDailyInsight();
      setInsight(data);
    } catch {
      // Use a random fallback
      const random = FALLBACK_INSIGHTS[Math.floor(Math.random() * FALLBACK_INSIGHTS.length)];
      setInsight(random);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryColors: Record<string, string> = {
    Productivité: 'text-cyan-400',
    Statistiques: 'text-violet-400',
    'Machine Learning': 'text-emerald-400',
    Modélisation: 'text-amber-400',
    default: 'text-violet-400',
  };

  const categoryColor = insight
    ? (categoryColors[insight.category] || categoryColors.default)
    : 'text-violet-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-cyan-600/5 rounded-full translate-y-10 -translate-x-10" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-900/30 border border-amber-700/30 flex items-center justify-center">
              <Lightbulb size={16} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Insight du Jour</h3>
              {insight && (
                <span className={`text-xs ${categoryColor}`}>{insight.category}</span>
              )}
            </div>
          </div>

          <motion.button
            onClick={loadInsight}
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
            title="Nouvel insight"
          >
            <RefreshCw size={14} />
          </motion.button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-white/5 rounded animate-pulse" />
            <div className="h-3 bg-white/5 rounded animate-pulse w-5/6" />
          </div>
        ) : insight ? (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-white font-medium text-sm mb-2">{insight.title}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">{insight.content}</p>
            {insight.source && (
              <p className="text-slate-600 text-xs mt-2 italic">Source: {insight.source}</p>
            )}
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}
