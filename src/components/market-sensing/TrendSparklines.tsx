import { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface OpportunityItem {
  id: string;
  name: string;
  segment: string;
  opportunityScore: number;
  accelerationScore: number;
  growthRate: number;
}

interface TrendSparklinesProps {
  opportunities: OpportunityItem[];
}

export const TrendSparklines = ({ opportunities }: TrendSparklinesProps) => {
  const sparklineData = useMemo(() => {
    return opportunities.slice(0, 8).map(opp => {
      // Generate 12 months of synthetic trend data
      const data = [];
      let value = opp.opportunityScore - (opp.growthRate * 0.5);
      for (let i = 0; i < 12; i++) {
        value += (opp.growthRate / 12) + (Math.random() - 0.5) * 5;
        data.push({ month: i, value: Math.max(0, Math.min(100, value)) });
      }
      
      const trend = data[11].value > data[0].value ? 'up' : data[11].value < data[0].value ? 'down' : 'flat';
      const change = ((data[11].value - data[0].value) / Math.max(1, data[0].value) * 100).toFixed(1);
      
      return {
        ...opp,
        trendData: data,
        trend,
        change
      };
    });
  }, [opportunities]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {sparklineData.map(item => (
        <div 
          key={item.id}
          className="p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium truncate max-w-[100px]">{item.name}</p>
            {item.trend === 'up' ? (
              <TrendingUp className="h-3.5 w-3.5 text-chart-2" />
            ) : item.trend === 'down' ? (
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            ) : (
              <Minus className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>
          <div className="h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={item.trendData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={item.trend === 'up' ? 'hsl(var(--chart-2))' : item.trend === 'down' ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))'} 
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 h-4">
              {item.segment}
            </Badge>
            <span className={`text-xs font-medium ${
              parseFloat(item.change) > 0 ? 'text-chart-2' : parseFloat(item.change) < 0 ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {parseFloat(item.change) > 0 ? '+' : ''}{item.change}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
