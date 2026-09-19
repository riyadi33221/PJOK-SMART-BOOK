import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: 'emerald' | 'blue' | 'amber' | 'athletic';
  size?: 'sm' | 'md' | 'lg';
  milestones?: { label: string; at: number }[];
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = true,
  color = 'emerald',
  size = 'md',
  milestones,
  className = '',
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  };

  const colorStyles = {
    emerald: 'bg-emerald-500 from-emerald-500 to-teal-400',
    blue: 'bg-blue-500 from-blue-500 to-cyan-400',
    amber: 'bg-amber-500 from-amber-500 to-yellow-400',
    athletic: 'bg-emerald-600 from-emerald-600 via-teal-500 to-emerald-400',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
          {label && <span className="font-semibold text-slate-800 dark:text-slate-100">{label}</span>}
          {showPercent && (
            <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 relative ${sizeStyles[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${colorStyles[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {milestones && milestones.length > 0 && (
        <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400 font-medium px-1">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center ${
                percentage >= m.at ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
              }`}
            >
              <span>{m.label}</span>
              <span className="text-[10px] opacity-75">{m.at}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
