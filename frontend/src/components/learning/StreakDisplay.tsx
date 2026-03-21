import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  showLabel?: boolean;
}

export default function StreakDisplay({ streak, showLabel = true }: StreakDisplayProps) {
  const isHot = streak >= 3;
  const isOnFire = streak >= 5;

  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        animate={isHot ? {
          scale: [1, 1.2, 1],
          rotate: [0, -5, 5, 0],
        } : {}}
        transition={{ duration: 0.5, repeat: isOnFire ? Infinity : 0, repeatDelay: 1 }}
      >
        <Flame
          size={20}
          className={`transition-colors duration-300 ${
            isOnFire
              ? 'text-orange-400 fill-orange-400'
              : isHot
              ? 'text-amber-400 fill-amber-500'
              : 'text-slate-600 fill-slate-700'
          }`}
        />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span
          key={streak}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`font-bold text-sm ${
            isOnFire
              ? 'text-orange-400'
              : isHot
              ? 'text-amber-400'
              : 'text-slate-500'
          }`}
        >
          {streak}
        </motion.span>
      </AnimatePresence>
      {showLabel && (
        <span className="text-slate-500 text-xs">série</span>
      )}
    </div>
  );
}
