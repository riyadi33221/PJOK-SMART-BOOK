import React, { useState } from 'react';

// 1. Weekly Student Activity Bar Chart
export const ActivityBarChart: React.FC<{
  data: { day: string; students: number; attendance: number }[];
  className?: string;
}> = ({ data, className = '' }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxStudents = 200;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 pt-6 pb-2 px-2">
        {data.map((item, idx) => {
          const heightPercent = Math.min(Math.round((item.students / maxStudents) * 100), 100);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.day}
              className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-10 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[11px] font-bold py-1 px-2 rounded-lg shadow-lg z-20 whitespace-nowrap pointer-events-none animate-in fade-in">
                  {item.students} Siswa ({item.attendance}%)
                </div>
              )}

              {/* Bar */}
              <div className="w-full max-w-[38px] bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden h-full flex items-end p-0.5">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ease-out ${
                    isHovered
                      ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                      : 'bg-gradient-to-t from-emerald-500 to-emerald-400 dark:from-emerald-600 dark:to-teal-500'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Label */}
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 2. Score Trend Area / Curve Chart
export const ScoreTrendChart: React.FC<{
  data?: { label: string; score: number }[];
  className?: string;
}> = ({
  data = [
    { label: 'PTS 1', score: 82 },
    { label: 'Kuis 1-3', score: 85 },
    { label: 'Praktik 1', score: 89 },
    { label: 'PTS 2', score: 86 },
    { label: 'Praktik 2', score: 92 },
    { label: 'PAS Gasal', score: 88 },
  ],
  className = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const min = 70;
  const max = 100;
  const range = max - min;
  const pointsCount = data.length;

  const points = data.map((d, i) => {
    const x = (i / (pointsCount - 1)) * 340 + 30;
    const y = 140 - ((d.score - min) / range) * 110;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cx1 = prev.x + (curr.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (curr.x - prev.x) / 2;
    const cy2 = curr.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z`;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="relative w-full aspect-[400/160]">
        <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="30" y1="30" x2="370" y2="30" stroke="#94a3b8" strokeOpacity="0.15" strokeDasharray="3 3" />
          <line x1="30" y1="85" x2="370" y2="85" stroke="#94a3b8" strokeOpacity="0.15" strokeDasharray="3 3" />
          <line x1="30" y1="140" x2="370" y2="140" stroke="#94a3b8" strokeOpacity="0.25" />

          {/* Area */}
          <path d={areaD} fill="url(#scoreAreaGrad)" />

          {/* Line */}
          <path d={pathD} fill="none" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" />

          {/* Points */}
          {points.map((pt, i) => (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === i ? 7 : 5}
                className="fill-white dark:fill-slate-900 stroke-sky-600 stroke-[3px] transition-all"
              />
              <text
                x={pt.x}
                y="155"
                textAnchor="middle"
                className="text-[10px] font-semibold fill-slate-400"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>

        {hoveredIdx !== null && (
          <div
            className="absolute -top-1 bg-slate-900 text-white text-xs font-bold py-1 px-2.5 rounded-lg shadow-lg pointer-events-none -translate-x-1/2"
            style={{ left: `${(points[hoveredIdx].x / 400) * 100}%` }}
          >
            Nilai: {points[hoveredIdx].score}
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Attendance Donut Target Chart
export const AttendanceDonutChart: React.FC<{
  percent?: number;
  label?: string;
  size?: number;
  className?: string;
}> = ({ percent = 94, label = 'Kehadiran Semester', size = 150, className = '' }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-emerald-500 transition-all duration-1000 ease-out"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {percent}%
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Tercapai
          </span>
        </div>
      </div>
      <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2 text-center">
        {label}
      </p>
    </div>
  );
};
