import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { insightOpportunities, getInsightsMetrics } from '@/data/insightsData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TrendExplorer = () => {
  const metrics = getInsightsMetrics();

  // Group by publication date (month) and opportunity type
  const timeSeriesData = insightOpportunities.reduce((acc, opp) => {
    const date = opp.publicationDate.substring(0, 7); // YYYY-MM
    if (!acc[date]) {
      acc[date] = { date, 'AI Specific Opportunity': 0, 'Tech Adoption Surge': 0, 'Market Expansion': 0, Other: 0 };
    }
    if (opp.opportunityType === 'AI Specific Opportunity') acc[date]['AI Specific Opportunity']++;
    else if (opp.opportunityType === 'Tech Adoption Surge') acc[date]['Tech Adoption Surge']++;
    else if (opp.opportunityType === 'Market Expansion') acc[date]['Market Expansion']++;
    else acc[date].Other++;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(timeSeriesData).sort((a, b) => a.date.localeCompare(b.date));

  // Extract key topics from insights
  const keywords = insightOpportunities
    .flatMap(opp => opp.keyInsights.toLowerCase().split(/\s+/))
    .filter(word => word.length > 5)
    .reduce((acc, word) => {
      const cleanWord = word.replace(/[.,!?]/g, '');
      acc[cleanWord] = (acc[cleanWord] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topKeywords = Object.entries(keywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));

  // Topic list ranked by priority
  const topicsList = Object.entries(metrics.opportunityTypes)
    .map(([type, countValue]) => {
      const count = countValue as number;
      const opps = insightOpportunities.filter(o => o.opportunityType === type);
      const avgPriority = opps.reduce((sum, o) => sum + o.priorityScore, 0) / opps.length;
      return { type, count, avgPriority, score: count * avgPriority };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      {/* Stacked Area Chart */}
      <Card className="p-4 bg-card border-border/50">
        <h3 className="text-lg font-semibold mb-4">Opportunity Trends Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="AI Specific Opportunity" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
            <Area type="monotone" dataKey="Tech Adoption Surge" stackId="1" stroke="#a855f7" fill="#a855f7" />
            <Area type="monotone" dataKey="Market Expansion" stackId="1" stroke="#10b981" fill="#10b981" />
            <Area type="monotone" dataKey="Other" stackId="1" stroke="#6b7280" fill="#6b7280" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>AI Specific Opportunity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-purple-500" />
            <span>Tech Adoption</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span>Market Expansion</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gray-500" />
            <span>Other</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Word Cloud (simplified as badges) */}
        <Card className="p-4 bg-card border-border/50">
          <h3 className="text-lg font-semibold mb-4">Key Topics</h3>
          <div className="flex flex-wrap gap-2">
            {topKeywords.map(({ word, count }) => (
              <Badge 
                key={word}
                variant="outline"
                className="text-xs"
                style={{ 
                  fontSize: `${Math.min(14, 9 + count)}px`,
                  opacity: 0.5 + (count / 10)
                }}
              >
                {word}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Topic Rankings */}
        <Card className="p-4 bg-card border-border/50">
          <h3 className="text-lg font-semibold mb-4">Topic Rankings</h3>
          <div className="space-y-3">
            {topicsList.map((topic, index) => (
              <div key={topic.type} className="flex items-center gap-3">
                <span className="text-lg font-bold text-muted-foreground w-6">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{topic.type}</span>
                    <span className="text-xs text-muted-foreground">
                      {topic.count} opps • {Math.round(topic.avgPriority * 100)}% avg
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(topic.score / topicsList[0].score) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TrendExplorer;
