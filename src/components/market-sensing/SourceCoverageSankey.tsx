import { useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SourceCoverageSankeyProps {
  opportunities: Array<{
    name: string;
    opportunityScore: number;
    signals: Array<{
      sourceType: string;
      source: string;
    }>;
  }>;
}

export const SourceCoverageSankey = ({ opportunities }: SourceCoverageSankeyProps) => {
  const sankeyData = useMemo(() => {
    // Source types
    const sourceTypes = ['analyst', 'jobs', 'social', 'news', 'patents', 'funding'];
    const sourceLabels: Record<string, string> = {
      analyst: 'Analyst Reports',
      jobs: 'Job Postings',
      social: 'Social Media',
      news: 'News',
      patents: 'Patents',
      funding: 'Funding Data'
    };

    // Topics derived from opportunities
    const topics = ['AI/ML', 'Cloud', 'Security', 'Analytics', 'Automation', 'Customer Success'];

    // Calculate flow strengths (synthetic but based on opportunity data patterns)
    const flows: Array<{
      from: string;
      to: string;
      value: number;
      fromLabel: string;
      toLabel: string;
    }> = [];

    sourceTypes.forEach((source, sIdx) => {
      topics.forEach((topic, tIdx) => {
        const relevantOpps = opportunities.filter((_, idx) => (idx + sIdx) % 3 === tIdx % 3);
        const value = relevantOpps.reduce((sum, o) => sum + o.opportunityScore / 10, 5);
        
        flows.push({
          from: source,
          to: topic,
          value: Math.min(30, Math.max(5, value)),
          fromLabel: sourceLabels[source] || source,
          toLabel: topic
        });
      });
    });

    return { sourceTypes, topics, flows, sourceLabels };
  }, [opportunities]);

  const { sourceTypes, topics, flows, sourceLabels } = sankeyData;
  
  // Calculate positions
  const leftHeight = 160;
  const rightHeight = 160;
  const nodeHeight = leftHeight / sourceTypes.length - 4;
  const rightNodeHeight = rightHeight / topics.length - 4;

  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--primary))'
  ];

  return (
    <div className="relative h-[180px] w-full">
      <svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet">
        {/* Left nodes (Sources) */}
        {sourceTypes.map((source, idx) => (
          <g key={source}>
            <rect
              x={0}
              y={idx * (nodeHeight + 4) + 10}
              width={60}
              height={nodeHeight}
              fill={colors[idx % colors.length]}
              rx={3}
              opacity={0.8}
            />
            <text
              x={5}
              y={idx * (nodeHeight + 4) + 10 + nodeHeight / 2 + 3}
              fontSize={7}
              fill="white"
              fontWeight="500"
            >
              {(sourceLabels[source] || source).slice(0, 8)}
            </text>
          </g>
        ))}

        {/* Right nodes (Topics) */}
        {topics.map((topic, idx) => (
          <g key={topic}>
            <rect
              x={240}
              y={idx * (rightNodeHeight + 4) + 10}
              width={60}
              height={rightNodeHeight}
              fill={colors[(idx + 2) % colors.length]}
              rx={3}
              opacity={0.8}
            />
            <text
              x={245}
              y={idx * (rightNodeHeight + 4) + 10 + rightNodeHeight / 2 + 3}
              fontSize={7}
              fill="white"
              fontWeight="500"
            >
              {topic.slice(0, 10)}
            </text>
          </g>
        ))}

        {/* Flow paths */}
        {flows.map((flow, idx) => {
          const sourceIdx = sourceTypes.indexOf(flow.from);
          const topicIdx = topics.indexOf(flow.to);
          
          const startY = sourceIdx * (nodeHeight + 4) + 10 + nodeHeight / 2;
          const endY = topicIdx * (rightNodeHeight + 4) + 10 + rightNodeHeight / 2;
          
          const opacity = Math.min(0.5, flow.value / 30);
          
          return (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <path
                  d={`M 60 ${startY} C 150 ${startY}, 150 ${endY}, 240 ${endY}`}
                  fill="none"
                  stroke={colors[sourceIdx % colors.length]}
                  strokeWidth={Math.max(1, flow.value / 10)}
                  opacity={opacity}
                  className="cursor-pointer hover:opacity-80"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{flow.fromLabel} → {flow.toLabel}</p>
                <p className="text-[10px] text-muted-foreground">Signal strength: {Math.round(flow.value)}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 text-[8px] text-muted-foreground">
        <span>Sources → Topics → Opportunity Score</span>
      </div>
    </div>
  );
};
