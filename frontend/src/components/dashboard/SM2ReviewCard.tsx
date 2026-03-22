import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, Clock, ChevronRight } from 'lucide-react';
import { SM2Card } from '../../types';
import { getDecayColor, getDecayLabel, getRetentionPercentage } from '../../utils/decayUtils';

interface SM2ReviewCardProps {
  card: SM2Card;
  index?: number;
}

function getIntervalLabel(interval: number): string {
  if (interval === 0) return 'À réviser maintenant';
  if (interval === 1) return 'Demain';
  if (interval < 7) return `Dans ${interval} jours`;
  if (interval < 30) return `Dans ${Math.floor(interval / 7)} semaine(s)`;
  return `Dans ${Math.floor(interval / 30)} mois`;
}

export default function SM2ReviewCard({ card, index = 0 }: SM2ReviewCardProps) {
  const navigate = useNavigate();
  const decayColor = getDecayColor(card.decayLevel);
  const retentionPct = getRetentionPercentage(card.decayLevel);
  const isUrgent = card.decayLevel >= 0.75;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/learn/${card.conceptId}`)}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200
        border hover:shadow-md
        ${isUrgent
          ? 'bg-orange-900/10 border-orange-700/30 hover:border-orange-600/50'
          : 'bg-bg-elevated border-white/10 hover:border-violet-500/30'
        }
      `}
    >
      {/* Decay indicator circle */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2"
        style={{ borderColor: decayColor, backgroundColor: `${decayColor}15` }}
      >
        <RefreshCw
          size={16}
          style={{ color: decayColor }}
          className={isUrgent ? 'animate-spin-slow' : ''}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">
          {card.conceptLabel || card.conceptId}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs" style={{ color: decayColor }}>
            {getDecayLabel(card.decayLevel)}
          </span>
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <Clock size={10} />
            <span>Rép. #{card.repetitionNumber}</span>
          </div>
          {card.blockName && (
            <span className="text-slate-600 text-xs truncate hidden sm:block">
              {card.blockName}
            </span>
          )}
        </div>

        {/* Retention bar */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${retentionPct}%`, backgroundColor: decayColor }}
            />
          </div>
          <span className="text-xs text-slate-500 w-12 text-right">
            {retentionPct}% ret.
          </span>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight size={16} className="text-slate-600 flex-shrink-0" />
    </motion.div>
  );
}
