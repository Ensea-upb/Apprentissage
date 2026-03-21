import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-14 h-14',
};

export default function LoadingSpinner({
  size = 'md',
  color = '#7C3AED',
  label,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className={`${sizeMap[size]} rounded-full border-2 border-white/10`}
        style={{ borderTopColor: color }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      {label && (
        <motion.p
          className="text-slate-400 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}
