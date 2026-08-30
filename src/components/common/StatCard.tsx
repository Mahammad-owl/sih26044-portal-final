import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = 'text-indigo-400',
  iconBg = 'bg-indigo-500/10 border-indigo-500/20',
  className = '',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel p-5 rounded-2xl transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900/80 hover:translate-y-[-2px]' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1.5 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                  trend.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {trend.value}
              </span>
              <span className="text-[11px] text-slate-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl border ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};
