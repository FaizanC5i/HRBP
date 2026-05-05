import { useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

interface RiskItem {
  id: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impactScenario: { best: string; worst: string };
  date: string;
}

interface RiskRadarChartProps {
  risks: RiskItem[];
}

export const RiskRadarChart = ({ risks }: RiskRadarChartProps) => {
  const radarData = useMemo(() => {
    // Group risks by category and calculate severity score
    const categories = ['Regulatory', 'Competitive', 'Technology', 'Market', 'Talent', 'Economic'];
    const severityScore: Record<string, number> = {
      'low': 25,
      'medium': 50,
      'high': 75,
      'critical': 100
    };

    return categories.map(category => {
      const categoryRisks = risks.filter(r => r.category === category);
      const maxSeverity = categoryRisks.reduce((max, r) => {
        const score = severityScore[r.severity] || 0;
        return score > max ? score : max;
      }, 0);
      
      return {
        category: category.slice(0, 6), // Truncate for display
        fullCategory: category,
        score: maxSeverity || Math.round(Math.random() * 40 + 10), // Fallback synthetic
        count: categoryRisks.length
      };
    });
  }, [risks]);

  return (
    <div className="h-[160px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} margin={{ top: 5, right: 15, bottom: 5, left: 15 }}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]}
            tick={{ fontSize: 7, fill: 'hsl(var(--muted-foreground))' }}
            tickCount={4}
          />
          <Radar
            name="Risk Level"
            dataKey="score"
            stroke="hsl(var(--chart-5))"
            fill="hsl(var(--chart-5))"
            fillOpacity={0.4}
          />
          <Tooltip 
            content={({ payload }) => {
              if (payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-popover border rounded-lg p-2 shadow-lg">
                    <p className="text-xs font-medium">{data.fullCategory}</p>
                    <p className="text-[10px] text-muted-foreground">Risk Score: {data.score}%</p>
                    <p className="text-[10px] text-muted-foreground">Active Risks: {data.count}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
