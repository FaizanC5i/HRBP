import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { marketOpportunities } from '@/data/marketSensingData';
import { AlertTriangle } from 'lucide-react';

const RiskIntelligencePanel = () => {
  const riskData = marketOpportunities.map(opp => {
    const timeframeSensitivity = {
      'Immediate': 95,
      '6 months': 70,
      '1 year': 45,
      '3 years': 20
    };
    
    const riskImpact = {
      'High': 90,
      'Medium': 55,
      'Low': 25
    };

    const riskSize = {
      'High': 400,
      'Medium': 200,
      'Low': 100
    };

    return {
      id: opp.id,
      title: opp.title,
      x: timeframeSensitivity[opp.timeframe] + (Math.random() * 10 - 5),
      y: riskImpact[opp.riskIfNotActing] + (Math.random() * 10 - 5),
      z: riskSize[opp.riskIfNotActing],
      risk: opp.riskIfNotActing,
      details: opp.riskDetails,
      timeframe: opp.timeframe
    };
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return '#ef4444'; // red-500
      case 'Medium': return '#f59e0b'; // amber-500
      case 'Low': return '#10b981'; // emerald-500
      default: return 'hsl(var(--muted))';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-xl max-w-xs">
          <p className="font-semibold text-sm text-foreground mb-2">{data.title}</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Risk Level:</span>
              <span className={`font-semibold ${
                data.risk === 'High' ? 'text-rose-500' : 
                data.risk === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
              }`}>{data.risk}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Timeframe:</span>
              <span className="font-medium">{data.timeframe}</span>
            </div>
            <p className="text-muted-foreground mt-2 border-t border-border pt-2">
              {data.details}
            </p>
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
            <div className="p-2 rounded-lg bg-rose-500/10">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            </div>
            <CardTitle className="text-base font-semibold">Risk Intelligence</CardTitle>
          </div>
          <div className="flex gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-muted-foreground">High</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Low</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
              <XAxis 
                type="number" 
                dataKey="x" 
                domain={[0, 100]}
                name="Time Sensitivity"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                label={{ 
                  value: 'Time Sensitivity →', 
                  position: 'bottom', 
                  offset: 10,
                  style: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' }
                }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                domain={[0, 100]}
                name="Impact"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                label={{ 
                  value: '← Impact', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' }
                }}
              />
              <ZAxis type="number" dataKey="z" range={[60, 400]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={riskData} fillOpacity={0.7}>
                {riskData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getRiskColor(entry.risk)}
                    stroke={getRiskColor(entry.risk)}
                    strokeWidth={1}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center text-xs text-muted-foreground">
          Bubble size represents risk severity
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskIntelligencePanel;
