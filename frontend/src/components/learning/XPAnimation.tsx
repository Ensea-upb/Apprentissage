import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

interface XPAnimationProps {
  amount: number;
  visible: boolean;
  streakBonus?: boolean;
}

export default function XPAnimation({ amount, visible, streakBonus = false }: XPAnimationProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`flex items-center gap-1 font-bold text-2xl drop-shadow-lg ${
              streakBonus ? 'text-amber-400' : 'text-violet-400'
            }`}
            initial={{ y: 0, scale: 0.5, opacity: 0 }}
            animate={{ y: -80, scale: 1.2, opacity: 1 }}
            exit={{ y: -120, scale: 0.8, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <Zap size={24} className="fill-current" />
            +{amount} XP
            {streakBonus && (
              <motion.span
                className="text-sm ml-1 text-amber-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Combo!
              </motion.span>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
