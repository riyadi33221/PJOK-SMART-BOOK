import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'athletic' | 'highlight' | 'muted';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variantStyles = {
    default:
      'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm shadow-slate-100 dark:shadow-none',
    athletic:
      'bg-white dark:bg-slate-900 border-2 border-emerald-500/30 dark:border-emerald-500/40 relative overflow-hidden shadow-sm',
    highlight:
      'bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 dark:border-emerald-500/30 dark:bg-slate-900/90',
    muted:
      'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800',
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${paddingStyles[padding]} ${variantStyles[variant]} ${
        hoverEffect ? 'hover:shadow-md hover:border-emerald-400/50 dark:hover:border-emerald-500/50 hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, icon, className = '' }) => (
  <div className={`flex items-start justify-between gap-3 mb-4 ${className}`}>
    <div className="flex items-center gap-3">
      {icon && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shrink-0">
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
