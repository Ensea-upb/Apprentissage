import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: string;
  bgColor?: string;
  height?: number;
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
  className?: string;
  gradient?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  color = '#7C3AED',
  bgColor = 'rgba(255,255,255,0.05)',
  height = 8,
  animated = true,
  showLabel = false,
  label,
  className = '',
  gradient = false,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const barColor = gradient
    ? 'linear-gradient(to right, #7C3AED, #06B6D4)'
    : color;

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showLabel && (
            <span className="text-xs text-slate-400">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: `${height}px`, backgroundColor: bgColor }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: barColor }}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.8, ease: 'easeOut' } : undefined}
        />
      </div>
    </div>
  );
}
