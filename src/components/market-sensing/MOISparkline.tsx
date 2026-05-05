import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MOISparklineProps {
  moi: number;
  moiTrend: number;
  moiConfidence: { low: number; high: number };
}

export const MOISparkline = ({ moi, moiTrend, moiConfidence }: MOISparklineProps) => {
  // Calculate percentage for circular progress
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (moi / 100) * circumference;
  
  return (
    <div className="flex items-center gap-6">
      {/* Circular Progress Ring */}
      <div className="relative">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="hsl(210, 20%, 92%)"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#moiGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="moiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(206, 100%, 42%)" />
              <stop offset="100%" stopColor="hsl(197, 100%, 47%)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
          <span className="text-2xl font-bold text-[hsl(207,100%,14%)]">{moi}</span>
          <span className="text-[10px] text-muted-foreground font-medium">of 100</span>
        </div>
      </div>
      
      {/* Metrics */}
      <div className="flex flex-col gap-2">
        {/* Trend */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-6 h-6 rounded-full ${moiTrend > 0 ? 'bg-[hsl(80,100%,36%)]/10' : 'bg-destructive/10'}`}>
            {moiTrend > 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-[hsl(80,100%,36%)]" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            )}
          </div>
          <span className={`text-sm font-semibold ${moiTrend > 0 ? 'text-[hsl(80,100%,36%)]' : 'text-destructive'}`}>
            {moiTrend > 0 ? '+' : ''}{moiTrend}%
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
        
        {/* Confidence */}
        <Badge 
          variant="outline" 
          className="w-fit text-[10px] px-2.5 py-1 border-[hsl(206,100%,42%)]/30 text-[hsl(206,100%,42%)] bg-[hsl(206,100%,42%)]/5 font-medium"
        >
          {moiConfidence.low}–{moiConfidence.high}% confidence
        </Badge>
      </div>
    </div>
  );
};
