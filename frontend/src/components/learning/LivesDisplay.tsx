import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LivesDisplayProps {
  lives: number;
  maxLives?: number;
}

export default function LivesDisplay({ lives, maxLives = 3 }: LivesDisplayProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: maxLives }).map((_, i) => {
        const isFull = i < lives;
        return (
          <AnimatePresence key={i} mode="wait">
            <motion.div
              key={`heart-${i}-${isFull}`}
              initial={!isFull ? { scale: 1.3, opacity: 0.8 } : { scale: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Heart
                size={20}
                className={`transition-all duration-300 ${
                  isFull
                    ? 'text-rose-500 fill-rose-500'
                    : 'text-slate-700 fill-slate-800'
                }`}
              />
            </motion.div>
          </AnimatePresence>
        );
      })}
    </div>
  );
}
