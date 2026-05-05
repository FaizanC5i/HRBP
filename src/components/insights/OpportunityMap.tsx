import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { insightOpportunities } from '@/data/insightsData';
import { internalInsightOpportunities } from '@/data/internalInsightsData';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Check, Map, Globe, MapPin } from 'lucide-react';

interface OpportunityMapProps {
  onSelectOpportunity: (id: string) => void;
}

const timeframeRank: Record<string, number> = {
  'Immediate': 1,
  'Short-term': 2,
  'Medium-term': 3,
  'Long-term': 4
};

const getTimeframeRank = (timeframe: string): number => {
  if (timeframe.toLowerCase().includes('immediate')) return 1;
  if (timeframe.toLowerCase().includes('short')) return 2;
  if (timeframe.toLowerCase().includes('medium')) return 3;
  if (timeframe.toLowerCase().includes('long')) return 4;
  return 3;
};

const opportunityTypeColors: Record<string, string> = {
  'AI Specific Opportunity': '#3b82f6',          // blue
  'Tech Adoption Surge': '#a855f7',     // purple
  'Market Expansion': '#10b981',        // emerald
  'Pain Point Cluster': '#f97316',      // orange
  'Automation Potential': '#06b6d4',    // cyan
  'Industry Disruption': '#14b8a6',     // teal
  'Skill Need': '#ec4899',               // pink
  'Vendor Rationalization': '#8b5cf6',  // violet
  'Infrastructure Modernization': '#0d9488', // teal-600
  'Partnership White Space': '#6366f1', // indigo
  'Corporate Transformation': '#f43f5e', // rose
  'Customer Experience': '#84cc16',     // lime
  'Digital Transformation': '#0ea5e9',  // sky
  'Security Enhancement': '#ef4444',    // red
  'Sustainability': '#22c55e',          // green
  'Internal': '#64748b',                // slate for internal
  'Financial Intelligence': '#059669',  // emerald-600 (distinct green)
  'Strategic Direction': '#7c3aed',     // violet-600 (distinct purple)
};

const OpportunityMap = ({ onSelectOpportunity }: OpportunityMapProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('scatter');
  
  // Combine external and internal opportunities
  const allOpportunities = useMemo(() => {
    return [...insightOpportunities, ...internalInsightOpportunities];
  }, []);

  // Calculate metrics from combined data
  const metrics = useMemo(() => {
    const opportunityTypes: Record<string, number> = {};
    allOpportunities.forEach(opp => {
      opportunityTypes[opp.opportunityType] = (opportunityTypes[opp.opportunityType] || 0) + 1;
    });
    return {
      totalOpportunities: allOpportunities.length,
      opportunityTypes
    };
  }, [allOpportunities]);

  const toggleType = (type: string) => {
    const newSet = new Set(selectedTypes);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setSelectedTypes(newSet);
  };

  const filteredOpportunities = useMemo(() => {
    if (selectedTypes.size === 0) return allOpportunities;
    return allOpportunities.filter(opp => selectedTypes.has(opp.opportunityType));
  }, [selectedTypes, allOpportunities]);

  // Add jitter to prevent overlapping dots
  const chartData = useMemo(() => {
    return filteredOpportunities.map((opp, index) => {
      // Add small random offset to spread overlapping points
      const jitterX = (Math.random() - 0.5) * 0.4; // ±0.2 jitter on x-axis
      const jitterY = (Math.random() - 0.5) * 8; // ±4 jitter on y-axis
      
      return {
        id: opp.id,
        title: opp.title,
        x: getTimeframeRank(opp.timeframe) + jitterX,
        y: Math.min(100, Math.max(0, opp.priorityScore * 100 + jitterY)),
        z: opp.confidenceScore * 50,
        type: opp.opportunityType,
        color: opportunityTypeColors[opp.opportunityType] || '#6b7280',
        isInternal: opp.sourceType === 'Internal'
      };
    });
  }, [filteredOpportunities]);

  // Geographic data aggregation
  const geoData = useMemo(() => {
    const data = filteredOpportunities.reduce((acc, opp) => {
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

    return Object.values(data)
      .map(g => ({
        ...g,
        avgPriority: Math.round((g.totalPriority / g.count) * 100),
        topType: Object.entries(g.types).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredOpportunities]);

  const maxCount = Math.max(...geoData.map(g => g.count), 1);

  const getHeatColor = (count: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.7) return 'bg-rose-500';
    if (intensity > 0.4) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="p-3 bg-card border shadow-lg">
          <p className="text-sm font-medium mb-1">{data.title}</p>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>Priority: {Math.round(data.y)}%</span>
            <span>•</span>
            <span>{data.type}</span>
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Opportunity Map</h3>
        <div className="flex items-center gap-3">
          {selectedTypes.size > 0 && (
            <button 
              onClick={() => setSelectedTypes(new Set())}
              className="text-xs text-primary hover:underline"
            >
              Clear filters ({selectedTypes.size})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Opportunities by Type - Interactive Legend */}
        <Card className="p-4 bg-card border-border/50 lg:col-span-1">
          <h4 className="text-sm font-semibold mb-3">Filter by Type</h4>
          <div className="space-y-2">
            {Object.entries(metrics.opportunityTypes)
              .sort((a, b) => (b[1] as number) - (a[1] as number))
              .map(([type, countValue]) => {
                const count = countValue as number;
                const isSelected = selectedTypes.has(type);
                const isFiltered = selectedTypes.size > 0 && !isSelected;
                return (
                  <div 
                    key={type} 
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                      isSelected ? 'bg-muted ring-1 ring-primary/30' : ''
                    } ${isFiltered ? 'opacity-40' : ''}`}
                    onClick={() => toggleType(type)}
                  >
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: opportunityTypeColors[type] || '#6b7280' }}
                    >
                      {isSelected && <Check className="h-2 w-2 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{type}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${(count / metrics.totalOpportunities) * 100}%`,
                              backgroundColor: opportunityTypeColors[type] || '#6b7280'
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-4">{count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredOpportunities.length}</span> of {allOpportunities.length}
            </div>
          </div>
        </Card>

        {/* Tabbed Chart Views */}
        <Card className="p-4 bg-card border-border/50 lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 h-8">
              <TabsTrigger value="scatter" className="text-xs flex items-center gap-1.5 h-7">
                <Map className="h-3.5 w-3.5" />
                Priority Map
              </TabsTrigger>
              <TabsTrigger value="geographic" className="text-xs flex items-center gap-1.5 h-7">
                <Globe className="h-3.5 w-3.5" />
                Geographic
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scatter" className="mt-0">
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Timeframe" 
                    domain={[0.5, 4.5]}
                    ticks={[1, 2, 3, 4]}
                    tickFormatter={(value) => {
                      const labels = ['', 'Immediate', 'Short-term', 'Medium-term', 'Long-term'];
                      return labels[value] || '';
                    }}
                    tick={{ fontSize: 11 }}
                    label={{ value: 'Timeframe', position: 'bottom', fontSize: 12 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Priority Score" 
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    label={{ value: 'Priority Score', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[100, 400]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter 
                    data={chartData} 
                    onClick={(data) => onSelectOpportunity(data.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {chartData.map((entry) => (
                      <Cell 
                        key={entry.id} 
                        fill={entry.color}
                        fillOpacity={hoveredId === entry.id ? 1 : 0.7}
                        onMouseEnter={() => setHoveredId(entry.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Bubble size represents confidence score. Click any bubble for details.
              </p>
            </TabsContent>

            <TabsContent value="geographic" className="mt-0 space-y-4">
              {/* Geographic Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {geoData.slice(0, 6).map((geo) => (
                  <Card 
                    key={geo.geo}
                    className={`p-3 border-2 ${
                      geo.count > maxCount * 0.7 ? 'border-rose-500/50 bg-rose-500/5' :
                      geo.count > maxCount * 0.4 ? 'border-amber-500/50 bg-amber-500/5' :
                      'border-emerald-500/50 bg-emerald-500/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium text-xs">{geo.geo}</span>
                    </div>
                    <div className="text-xl font-bold">{geo.count}</div>
                    <div className="text-[10px] text-muted-foreground mb-1">opportunities</div>
                    <Badge variant="outline" className="text-[9px]">
                      {geo.avgPriority}% avg priority
                    </Badge>
                  </Card>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-4 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-rose-500" />
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span>Low</span>
                </div>
              </div>

              {/* Compact Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Region</TableHead>
                    <TableHead className="text-xs text-center">Count</TableHead>
                    <TableHead className="text-xs text-center">Avg Priority</TableHead>
                    <TableHead className="text-xs">Top Type</TableHead>
                    <TableHead className="text-xs text-right">Intensity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {geoData.map((geo) => (
                    <TableRow key={geo.geo}>
                      <TableCell className="text-xs font-medium py-2">{geo.geo}</TableCell>
                      <TableCell className="text-xs text-center py-2">{geo.count}</TableCell>
                      <TableCell className="text-xs text-center py-2">{geo.avgPriority}%</TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className="text-[9px]">
                          {geo.topType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-2">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
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
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default OpportunityMap;
