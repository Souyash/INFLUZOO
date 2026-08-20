import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'emerald' | 'amber' | 'blue' | 'rose' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'purple',
  size = 'sm',
  className = '',
}) => {
  const styles = {
    purple: 'bg-violet-950/60 text-violet-300 border-violet-700/50',
    emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-700/50',
    blue: 'bg-blue-950/60 text-blue-300 border-blue-700/50',
    rose: 'bg-rose-950/60 text-rose-300 border-rose-700/50',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-sm px-3 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
