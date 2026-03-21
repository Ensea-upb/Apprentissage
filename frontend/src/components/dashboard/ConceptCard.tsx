import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Play, CheckCircle, RefreshCw, ChevronRight, Zap } from 'lucide-react';
import { Concept, ConceptStatus, ConceptProgress } from '../../types';
import { getDecayColor, getDecayLabel } from '../../utils/decayUtils';
import Badge from '../common/Badge';

interface ConceptCardProps {
  concept: Concept;
  status: ConceptStatus;
  progress?: ConceptProgress;
  decayLevel?: number;
  compact?: boolean;
}

const statusConfig = {
  locked: {
    icon: Lock,
    color: 'text-slate-600',
    bgColor: 'bg-slate-800/30',
    border: 'border-white/5',
    label: 'Verrouillé',
    badgeVariant: 'slate' as const,
  },
  available: {
    icon: Play,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-900/10',
    border: 'border-cyan-700/20',
    label: 'Disponible',
    badgeVariant: 'cyan' as const,
  },
  in_progress: {
    icon: ChevronRight,
    color: 'text-violet-400',
    bgColor: 'bg-violet-900/10',
    border: 'border-violet-700/20',
    label: 'En cours',
    badgeVariant: 'violet' as const,
  },
  mastered: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/10',
    border: 'border-emerald-700/20',
    label: 'Maîtrisé',
    badgeVariant: 'emerald' as const,
  },
  decaying: {
    icon: RefreshCw,
    color: 'text-orange-400',
    bgColor: 'bg-orange-900/10',
    border: 'border-orange-700/20',
    label: 'À réviser',
    badgeVariant: 'orange' as const,
  },
};

function getCompletedPhases(progress?: ConceptProgress): number {
  if (!progress) return 0;
  return [
    progress.phase1Done,
    progress.phase2Done,
    progress.phase3Done,
    progress.phase4Done,
    progress.phase5Done,
    progress.phase6Done,
  ].filter(Boolean).length;
}

export default function ConceptCard({
  concept,
  status,
  progress,
  decayLevel,
  compact = false,
}: ConceptCardProps) {
  const navigate = useNavigate();
  const config = statusConfig[status];
  const Icon = config.icon;
  const completedPhases = getCompletedPhases(progress);
  const isClickable = status !== 'locked';

  const handleClick = () => {
    if (!isClickable) return;
    navigate(`/learn/${concept.id}`);
  };

  if (compact) {
    return (
      <motion.div
        onClick={handleClick}
        whileHover={isClickable ? { scale: 1.01, x: 2 } : {}}
        className={`
          flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
          ${config.bgColor} ${config.border}
          ${isClickable ? 'cursor-pointer hover:shadow-md' : 'cursor-default opacity-60'}
        `}
      >
        <Icon size={14} className={config.color} />
        <span className="text-slate-300 text-sm flex-1 truncate">{concept.label}</span>
        {progress?.xpEarned !== undefined && progress.xpEarned > 0 && (
          <span className="text-violet-400 text-xs font-medium flex items-center gap-0.5">
            <Zap size={10} />
            {progress.xpEarned}
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={handleClick}
      whileHover={isClickable ? { y: -3, scale: 1.01 } : {}}
      whileTap={isClickable ? { scale: 0.98 } : {}}
      className={`
        relative rounded-xl p-4 border transition-all duration-200
        ${config.bgColor} ${config.border}
        ${isClickable
          ? 'cursor-pointer hover:shadow-lg hover:shadow-black/20'
          : 'cursor-default opacity-60'
        }
      `}
    >
      {/* Status icon */}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${config.bgColor} border ${config.border}`}>
          <Icon size={16} className={config.color} />
        </div>
        <Badge variant={config.badgeVariant} size="xs" dot>
          {config.label}
        </Badge>
      </div>

      {/* Title */}
      <h3 className={`font-semibold text-sm mb-2 leading-tight ${
        status === 'locked' ? 'text-slate-500' : 'text-white'
      }`}>
        {concept.label}
      </h3>

      {/* Module badge */}
      <div className="flex items-center gap-1.5 mb-3">
        <Badge variant="slate" size="xs">{concept.blockName}</Badge>
        <span className="text-slate-600 text-xs">/</span>
        <span className="text-slate-500 text-xs truncate">{concept.moduleName}</span>
      </div>

      {/* Progress bar (phases) */}
      {status !== 'locked' && (
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-xs">{completedPhases}/6 phases</span>
            {progress?.xpEarned !== undefined && progress.xpEarned > 0 && (
              <span className="text-violet-400 text-xs font-medium flex items-center gap-0.5">
                <Zap size={10} />
                {progress.xpEarned} XP
              </span>
            )}
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(completedPhases / 6) * 100}%`,
                background: status === 'mastered'
                  ? '#10B981'
                  : status === 'decaying'
                  ? decayLevel !== undefined ? getDecayColor(decayLevel) : '#F97316'
                  : 'linear-gradient(to right, #7C3AED, #6366F1)',
              }}
            />
          </div>
        </div>
      )}

      {/* Decay label */}
      {status === 'decaying' && decayLevel !== undefined && (
        <div className="mt-2 flex items-center gap-1">
          <RefreshCw size={11} style={{ color: getDecayColor(decayLevel) }} />
          <span className="text-xs" style={{ color: getDecayColor(decayLevel) }}>
            {getDecayLabel(decayLevel)} — À réviser bientôt
          </span>
        </div>
      )}

      {/* Locked message */}
      {status === 'locked' && (
        <div className="flex items-center gap-1.5 mt-2">
          <Lock size={11} className="text-slate-600" />
          <span className="text-slate-600 text-xs">Prérequis manquants</span>
        </div>
      )}
    </motion.div>
  );
}
