import { ReactNode } from 'react';

type BadgeVariant = 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'orange' | 'slate';
type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  violet: 'bg-violet-900/40 text-violet-300 border border-violet-700/40',
  cyan: 'bg-cyan-900/40 text-cyan-300 border border-cyan-700/40',
  emerald: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40',
  amber: 'bg-amber-900/40 text-amber-300 border border-amber-700/40',
  rose: 'bg-rose-900/40 text-rose-300 border border-rose-700/40',
  orange: 'bg-orange-900/40 text-orange-300 border border-orange-700/40',
  slate: 'bg-slate-800/60 text-slate-400 border border-slate-700/40',
};

const dotColors: Record<BadgeVariant, string> = {
  violet: 'bg-violet-400',
  cyan: 'bg-cyan-400',
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
  rose: 'bg-rose-400',
  orange: 'bg-orange-400',
  slate: 'bg-slate-400',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'text-xs px-1.5 py-0.5',
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1',
};

export default function Badge({
  children,
  variant = 'violet',
  size = 'sm',
  dot = false,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
