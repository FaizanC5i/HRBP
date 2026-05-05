import { useMemo } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DollarSign, Award, Beaker, GitBranch, Users, Activity } from 'lucide-react';

interface CompetitiveEvent {
  id: string;
  competitor: string;
  eventType: 'funding' | 'patent' | 'product' | 'acquisition' | 'partnership' | 'hiring';
  title: string;
  description: string;
  date: string;
  impact: 'low' | 'medium' | 'high';
}

interface CompetitorSwimlaneProps {
  events: CompetitiveEvent[];
  competitors: string[];
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'funding': return <DollarSign className="h-2.5 w-2.5" />;
    case 'patent': return <Award className="h-2.5 w-2.5" />;
    case 'product': return <Beaker className="h-2.5 w-2.5" />;
    case 'acquisition': return <GitBranch className="h-2.5 w-2.5" />;
    case 'partnership': return <Users className="h-2.5 w-2.5" />;
    case 'hiring': return <Activity className="h-2.5 w-2.5" />;
    default: return <Activity className="h-2.5 w-2.5" />;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'funding': return 'bg-chart-2/20 border-chart-2/40 text-chart-2';
    case 'patent': return 'bg-chart-3/20 border-chart-3/40 text-chart-3';
    case 'product': return 'bg-chart-1/20 border-chart-1/40 text-chart-1';
    case 'acquisition': return 'bg-chart-4/20 border-chart-4/40 text-chart-4';
    case 'partnership': return 'bg-primary/20 border-primary/40 text-primary';
    case 'hiring': return 'bg-chart-5/20 border-chart-5/40 text-chart-5';
    default: return 'bg-muted border-border text-muted-foreground';
  }
};

export const CompetitorSwimlane = ({ events, competitors }: CompetitorSwimlaneProps) => {
  const swimlaneData = useMemo(() => {
    // Get unique competitors from events
    const uniqueCompetitors = competitors.slice(0, 6);
    
    // Group events by competitor
    return uniqueCompetitors.map(competitor => ({
      competitor,
      events: events
        .filter(e => e.competitor === competitor)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }));
  }, [events, competitors]);

  return (
    <ScrollArea className="h-[180px]">
      <div className="space-y-2 pr-4">
        {swimlaneData.map(({ competitor, events: compEvents }) => (
          <div key={competitor} className="flex items-center gap-2">
            <div className="w-20 shrink-0">
              <p className="text-[9px] font-medium truncate text-muted-foreground">{competitor}</p>
            </div>
            <ScrollArea className="flex-1">
              <div className="flex items-center gap-1.5 pb-1">
                {compEvents.length > 0 ? (
                  compEvents.map(event => (
                    <Tooltip key={event.id}>
                      <TooltipTrigger asChild>
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[8px] cursor-pointer shrink-0 ${getEventColor(event.eventType)}`}>
                          {getEventIcon(event.eventType)}
                          <span className="max-w-[60px] truncate">{event.eventType}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px]">
                        <p className="text-xs font-medium">{event.title}</p>
                        <p className="text-[10px] text-muted-foreground">{event.description}</p>
                        <p className="text-[9px] text-muted-foreground mt-1">{event.date} • Impact: {event.impact}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))
                ) : (
                  <span className="text-[9px] text-muted-foreground italic">No recent events</span>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
