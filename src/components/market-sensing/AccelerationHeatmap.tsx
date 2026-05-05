import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { marketOpportunities } from '@/data/marketSensingData';
import { Zap, Clock, TrendingUp, Minus } from 'lucide-react';

const AccelerationHeatmap = () => {
  const sortedOpportunities = [...marketOpportunities]
    .sort((a, b) => {
      const statusOrder = { Rapid: 0, Moderate: 1, Slow: 2, Stable: 3 };
      return statusOrder[a.accelerationStatus] - statusOrder[b.accelerationStatus];
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Rapid': return 'bg-blue-500 text-white';
      case 'Moderate': return 'bg-cyan-500 text-white';
      case 'Slow': return 'bg-amber-500 text-white';
      case 'Stable': return 'bg-gray-400 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Rapid': return <Zap className="h-3 w-3" />;
      case 'Moderate': return <TrendingUp className="h-3 w-3" />;
      case 'Slow': return <Clock className="h-3 w-3" />;
      case 'Stable': return <Minus className="h-3 w-3" />;
      default: return null;
    }
  };

  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe) {
      case 'Immediate': return 'text-rose-500 bg-rose-500/10';
      case '6 months': return 'text-amber-500 bg-amber-500/10';
      case '1 year': return 'text-blue-500 bg-blue-500/10';
      case '3 years': return 'text-gray-500 bg-gray-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Zap className="h-4 w-4 text-blue-500" />
            </div>
            <CardTitle className="text-base font-semibold">Acceleration Heatmap</CardTitle>
          </div>
          <div className="flex gap-1">
            {['Rapid', 'Moderate', 'Slow', 'Stable'].map(status => (
              <Badge key={status} className={`text-[9px] px-1.5 py-0 ${getStatusColor(status)}`}>
                {status}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Opportunity</th>
                <th className="text-center py-2 px-2 text-muted-foreground font-medium w-24">Status</th>
                <th className="text-center py-2 px-2 text-muted-foreground font-medium w-24">Timeframe</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Momentum Insight</th>
              </tr>
            </thead>
            <tbody>
              {sortedOpportunities.map((opp, idx) => (
                <tr 
                  key={opp.id} 
                  className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                    idx % 2 === 0 ? 'bg-muted/10' : ''
                  }`}
                >
                  <td className="py-2.5 px-2">
                    <span className="font-medium text-foreground line-clamp-1">
                      {opp.title}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <Badge className={`text-[10px] px-2 py-0.5 ${getStatusColor(opp.accelerationStatus)}`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(opp.accelerationStatus)}
                        {opp.accelerationStatus}
                      </span>
                    </Badge>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${getTimeframeColor(opp.timeframe)}`}>
                      {opp.timeframe}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="text-muted-foreground line-clamp-1">
                      {opp.accelerationDetails}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccelerationHeatmap;
