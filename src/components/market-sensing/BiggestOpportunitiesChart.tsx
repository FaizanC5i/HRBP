import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { marketOpportunities } from '@/data/marketSensingData';
import { TrendingUp, Target } from 'lucide-react';

const BiggestOpportunitiesChart = () => {
  const topOpportunities = [...marketOpportunities]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 8)
    .map(opp => ({
      name: opp.title.length > 35 ? opp.title.substring(0, 35) + '...' : opp.title,
      fullName: opp.title,
      score: Math.round(opp.priorityScore * 100),
      confidence: Math.round(opp.confidenceScore * 100),
      marketSize: opp.marketSizeIndicator,
      recommendation: opp.investmentRecommendation,
      priority: opp.priorityCategory
    }));

  const getBarColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Invest': return 'hsl(var(--chart-2))';
      case 'Accelerate': return 'hsl(var(--chart-1))';
      case 'Shift': return 'hsl(var(--chart-4))';
      case 'Stop': return 'hsl(var(--chart-5))';
      default: return 'hsl(var(--chart-3))';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-xl">
          <p className="font-semibold text-sm text-foreground mb-1">{data.fullName}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Priority Score:</span>
              <span className="font-medium">{data.score}/100</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Confidence:</span>
              <span className="font-medium">{data.confidence}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Market Size:</span>
              <span className="font-medium">{data.marketSize}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Action:</span>
              <Badge className="text-[9px] px-1.5 py-0">{data.recommendation}</Badge>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Target className="h-4 w-4 text-emerald-500" />
            </div>
            <CardTitle className="text-base font-semibold">Biggest Opportunities</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Ranked by Priority Score</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={topOpportunities} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={180}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                radius={[0, 4, 4, 0]}
                barSize={20}
              >
                {topOpportunities.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.recommendation)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded bg-[hsl(var(--chart-2))]" />
            <span className="text-muted-foreground">Invest</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded bg-[hsl(var(--chart-1))]" />
            <span className="text-muted-foreground">Accelerate</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded bg-[hsl(var(--chart-4))]" />
            <span className="text-muted-foreground">Shift</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded bg-[hsl(var(--chart-5))]" />
            <span className="text-muted-foreground">Stop</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiggestOpportunitiesChart;
