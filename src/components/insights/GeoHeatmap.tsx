import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe, TrendingUp } from 'lucide-react';
import { insightOpportunities } from '@/data/insightsData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const GeoHeatmap = () => {
  // Aggregate by geographic scope
  const geoData = insightOpportunities.reduce((acc, opp) => {
    const geo = opp.geographicScope;
    if (!acc[geo]) {
      acc[geo] = { 
        geo, 
        count: 0, 
        totalPriority: 0, 
        types: {} as Record<string, number>
      };
    }
    acc[geo].count++;
    acc[geo].totalPriority += opp.priorityScore;
    acc[geo].types[opp.opportunityType] = (acc[geo].types[opp.opportunityType] || 0) + 1;
    return acc;
  }, {} as Record<string, { geo: string; count: number; totalPriority: number; types: Record<string, number> }>);

  const geoList = Object.values(geoData)
    .map(g => ({
      ...g,
      avgPriority: Math.round((g.totalPriority / g.count) * 100),
      topType: Object.entries(g.types).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    }))
    .sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...geoList.map(g => g.count));

  const getHeatColor = (count: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.7) return 'bg-rose-500';
    if (intensity > 0.4) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-6">
      {/* Visual Map Representation */}
      <Card className="p-6 bg-card border-border/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Geographic Distribution
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {geoList.map((geo) => (
            <Card 
              key={geo.geo}
              className={`p-4 border-2 ${
                geo.count > maxCount * 0.7 ? 'border-rose-500/50 bg-rose-500/5' :
                geo.count > maxCount * 0.4 ? 'border-amber-500/50 bg-amber-500/5' :
                'border-emerald-500/50 bg-emerald-500/5'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{geo.geo}</span>
              </div>
              <div className="text-2xl font-bold mb-1">{geo.count}</div>
              <div className="text-xs text-muted-foreground mb-2">opportunities</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[9px]">
                  {geo.avgPriority}% avg priority
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-rose-500" />
            <span>High Concentration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500" />
            <span>Low</span>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="p-4 bg-card border-border/50">
        <h3 className="text-lg font-semibold mb-4">Geographic Breakdown</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Region</TableHead>
              <TableHead className="text-center">Count</TableHead>
              <TableHead className="text-center">Avg Priority</TableHead>
              <TableHead>Top Opportunity Type</TableHead>
              <TableHead className="text-right">Intensity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {geoList.map((geo) => (
              <TableRow key={geo.geo}>
                <TableCell className="font-medium">{geo.geo}</TableCell>
                <TableCell className="text-center">{geo.count}</TableCell>
                <TableCell className="text-center">{geo.avgPriority}%</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">
                    {geo.topType}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getHeatColor(geo.count)}`}
                        style={{ width: `${(geo.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default GeoHeatmap;
