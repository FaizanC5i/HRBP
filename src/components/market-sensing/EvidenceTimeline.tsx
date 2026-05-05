import { useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, Newspaper, MessageSquare, GitBranch, BarChart3 } from 'lucide-react';

interface SignalItem {
  id: string;
  type: 'weak' | 'medium' | 'strong';
  source: string;
  sourceType: string;
  title: string;
  snippet: string;
  confidence: number;
  date: string;
  link: string;
}

interface EvidenceTimelineProps {
  signals: SignalItem[];
}

const getSourceIcon = (sourceType: string) => {
  switch (sourceType) {
    case 'analyst': return <BarChart3 className="h-3 w-3" />;
    case 'news': return <Newspaper className="h-3 w-3" />;
    case 'social': return <MessageSquare className="h-3 w-3" />;
    case 'jobs': return <FileText className="h-3 w-3" />;
    case 'patents': return <GitBranch className="h-3 w-3" />;
    default: return <FileText className="h-3 w-3" />;
  }
};

const getSourceColor = (sourceType: string) => {
  switch (sourceType) {
    case 'analyst': return 'bg-chart-1/20 border-chart-1/40 text-chart-1';
    case 'news': return 'bg-chart-2/20 border-chart-2/40 text-chart-2';
    case 'social': return 'bg-chart-3/20 border-chart-3/40 text-chart-3';
    case 'jobs': return 'bg-chart-4/20 border-chart-4/40 text-chart-4';
    case 'patents': return 'bg-primary/20 border-primary/40 text-primary';
    default: return 'bg-muted border-border text-muted-foreground';
  }
};

export const EvidenceTimeline = ({ signals }: EvidenceTimelineProps) => {
  const groupedSignals = useMemo(() => {
    // Group by date
    const groups: Record<string, SignalItem[]> = {};
    signals.forEach(sig => {
      const dateKey = sig.date;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(sig);
    });
    
    // Sort by date descending
    return Object.entries(groups)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [signals]);

  return (
    <ScrollArea className="h-[300px] pr-2">
      <div className="relative pl-4">
        {/* Timeline line */}
        <div className="absolute left-1 top-2 bottom-2 w-px bg-border" />
        
        {groupedSignals.map(([date, dateSignals]) => (
          <div key={date} className="mb-4">
            {/* Date marker */}
            <div className="flex items-center gap-2 mb-2">
              <div className="absolute left-0 w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] font-medium text-muted-foreground ml-2">{date}</span>
            </div>
            
            {/* Clustered source cards */}
            <div className="space-y-2 ml-2">
              {dateSignals.map(signal => (
                <div 
                  key={signal.id}
                  className={`p-2.5 rounded-lg border ${getSourceColor(signal.sourceType)}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {getSourceIcon(signal.sourceType)}
                      <span className="text-[10px] font-medium">{signal.source}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge 
                        variant="outline" 
                        className={`text-[8px] px-1 py-0 h-4 ${
                          signal.type === 'strong' ? 'border-chart-2 text-chart-2' :
                          signal.type === 'medium' ? 'border-chart-3 text-chart-3' :
                          'border-muted-foreground text-muted-foreground'
                        }`}
                      >
                        {signal.type}
                      </Badge>
                      <span className="text-[8px] text-muted-foreground">
                        {Math.round(signal.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] font-medium mt-1.5">{signal.title}</p>
                  <p className="text-[9px] text-muted-foreground mt-1 line-clamp-2">{signal.snippet}</p>
                  <a 
                    href={signal.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[9px] text-primary hover:underline mt-1.5"
                  >
                    View source <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
