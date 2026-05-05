import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { insightOpportunities } from '@/data/insightsData';
import { Grid3X3, TrendingUp, ArrowRightLeft, StopCircle, Zap } from 'lucide-react';

interface InvestmentDecisionMatrixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  highlightRecommendation?: string;
}

const InvestmentDecisionMatrixDialog = ({ 
  open, 
  onOpenChange,
  highlightRecommendation 
}: InvestmentDecisionMatrixDialogProps) => {
  // Get top priority opportunities grouped by investment recommendation
  const topOpportunities = [...insightOpportunities]
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const quadrants = {
    invest: topOpportunities.filter(o => o.investmentRecommendation === 'Invest'),
    accelerate: topOpportunities.filter(o => o.investmentRecommendation === 'Accelerate'),
    shift: topOpportunities.filter(o => o.investmentRecommendation === 'Shift'),
    stop: topOpportunities.filter(o => o.investmentRecommendation === 'Stop'),
  };

  const QuadrantCard = ({ 
    title, 
    items, 
    bgColor, 
    borderColor,
    icon: Icon,
    iconColor,
    isHighlighted
  }: { 
    title: string; 
    items: typeof insightOpportunities; 
    bgColor: string;
    borderColor: string;
    icon: any;
    iconColor: string;
    isHighlighted: boolean;
  }) => (
    <div className={`rounded-xl p-3 ${bgColor} ${borderColor} border min-h-[200px] ${
      isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h4 className="font-semibold text-sm text-foreground">{title}</h4>
        <Badge variant="outline" className="text-[10px] ml-auto">{items.length}</Badge>
      </div>
      <ScrollArea className="h-[180px] pr-1">
        <div className="space-y-2">
          {items.map(item => (
            <div 
              key={item.id} 
              className="bg-background/80 rounded-lg p-2 shadow-sm border border-border/30 hover:shadow-md transition-shadow cursor-pointer"
            >
              <p className="text-xs font-medium text-foreground line-clamp-1">{item.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="outline" 
                  className={`text-[9px] px-1.5 py-0 ${
                    item.priorityCategory === 'High' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                    item.priorityCategory === 'Medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                    'bg-gray-500/10 text-gray-600 border-gray-500/20'
                  }`}
                >
                  {item.priorityCategory}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  Score: {Math.round(item.priorityScore * 100)}
                </span>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-xs text-muted-foreground text-center py-4">
              No opportunities in this category
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Grid3X3 className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <DialogTitle className="text-lg">Investment Decision Matrix</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Top priority opportunities organized by investment recommendation
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <QuadrantCard 
            title="Invest" 
            items={quadrants.invest}
            bgColor="bg-emerald-500/5"
            borderColor="border-emerald-500/20"
            icon={TrendingUp}
            iconColor="bg-emerald-500/20 text-emerald-600"
            isHighlighted={highlightRecommendation === 'Invest'}
          />
          <QuadrantCard 
            title="Accelerate" 
            items={quadrants.accelerate}
            bgColor="bg-blue-500/5"
            borderColor="border-blue-500/20"
            icon={Zap}
            iconColor="bg-blue-500/20 text-blue-600"
            isHighlighted={highlightRecommendation === 'Accelerate'}
          />
          <QuadrantCard 
            title="Shift" 
            items={quadrants.shift}
            bgColor="bg-amber-500/5"
            borderColor="border-amber-500/20"
            icon={ArrowRightLeft}
            iconColor="bg-amber-500/20 text-amber-600"
            isHighlighted={highlightRecommendation === 'Shift'}
          />
          <QuadrantCard 
            title="Stop" 
            items={quadrants.stop}
            bgColor="bg-rose-500/5"
            borderColor="border-rose-500/20"
            icon={StopCircle}
            iconColor="bg-rose-500/20 text-rose-600"
            isHighlighted={highlightRecommendation === 'Stop'}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Badge variant="outline" className="text-[10px]">
            Data Source: Market Intelligence Dataset
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentDecisionMatrixDialog;
