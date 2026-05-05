import { LucideIcon, TrendingUp, TrendingDown, Minus, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  variant?: 'default' | 'accent' | 'success' | 'warning';
  className?: string;
  onClick?: () => void;
}

const MetricCard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend,
  variant = 'default',
  className,
  onClick
}: MetricCardProps) => {
  // Microsoft-inspired color palette with white backgrounds
  const variantStyles = {
    default: 'bg-white border-l-4 border-l-[hsl(206,100%,42%)] border-t-0 border-r-0 border-b-0',
    accent: 'bg-white border-l-4 border-l-[hsl(197,100%,47%)] border-t-0 border-r-0 border-b-0',
    success: 'bg-white border-l-4 border-l-[hsl(80,100%,36%)] border-t-0 border-r-0 border-b-0',
    warning: 'bg-white border-l-4 border-l-[hsl(43,100%,50%)] border-t-0 border-r-0 border-b-0'
  };

  const iconVariantStyles = {
    default: 'bg-gradient-to-br from-[hsl(206,100%,42%)] to-[hsl(206,100%,52%)] text-white shadow-lg shadow-[hsl(206,100%,42%)]/30',
    accent: 'bg-gradient-to-br from-[hsl(197,100%,47%)] to-[hsl(197,100%,57%)] text-white shadow-lg shadow-[hsl(197,100%,47%)]/30',
    success: 'bg-gradient-to-br from-[hsl(80,100%,36%)] to-[hsl(80,100%,46%)] text-white shadow-lg shadow-[hsl(80,100%,36%)]/30',
    warning: 'bg-gradient-to-br from-[hsl(43,100%,50%)] to-[hsl(43,100%,60%)] text-white shadow-lg shadow-[hsl(43,100%,50%)]/30'
  };

  const titleColors = {
    default: 'text-[hsl(206,100%,42%)]',
    accent: 'text-[hsl(197,100%,40%)]',
    success: 'text-[hsl(80,100%,30%)]',
    warning: 'text-[hsl(43,100%,35%)]'
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-[hsl(80,100%,36%)]' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  return (
    <div 
      className={cn(
        'rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        'shadow-md bg-white',
        variantStyles[variant],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn('text-sm font-semibold uppercase tracking-wide', titleColors[variant])}>{title}</p>
          <p className="text-3xl font-bold text-[hsl(207,100%,14%)] tracking-tight">{value}</p>
          {(change !== undefined || changeLabel) && (
            <div className="flex items-center gap-1.5 text-sm font-medium">
              {trend && <TrendIcon className={cn('h-4 w-4', trendColor)} />}
              {change !== undefined && (
                <span className={trendColor}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              )}
              {changeLabel && (
                <span className="text-[hsl(207,100%,31%)]">{changeLabel}</span>
              )}
              {variant === 'warning' && !change && (
                <Flame className="h-3.5 w-3.5 text-[hsl(14,100%,54%)] ml-1" />
              )}
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', iconVariantStyles[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {onClick && (
        <p className="text-xs text-[hsl(206,100%,42%)] mt-3 font-medium opacity-70 hover:opacity-100 transition-opacity">
          Click for details →
        </p>
      )}
    </div>
  );
};

export default MetricCard;
