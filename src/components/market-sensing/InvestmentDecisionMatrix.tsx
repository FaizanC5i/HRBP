import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { marketOpportunities } from '@/data/marketSensingData';
import { Grid3X3, TrendingUp, ArrowRightLeft, StopCircle, Zap } from 'lucide-react';

const InvestmentDecisionMatrix = () => {
  const quadrants = {
    invest: marketOpportunities.filter(o => o.investmentRecommendation === 'Invest'),
    accelerate: marketOpportunities.filter(o => o.investmentRecommendation === 'Accelerate'),
    shift: marketOpportunities.filter(o => o.investmentRecommendation === 'Shift'),
    stop: marketOpportunities.filter(o => o.investmentRecommendation === 'Stop'),
  };

  const QuadrantCard = ({ 
    title, 
    items, 
    bgColor, 
    borderColor,
    icon: Icon,
    iconColor
  }: { 
    title: string; 
    items: typeof marketOpportunities; 
    bgColor: string;
    borderColor: string;
    icon: any;
    iconColor: string;
  }) => (
    <div className={`rounded-xl p-3 ${bgColor} ${borderColor} border min-h-[200px]`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h4 className="font-semibold text-sm text-foreground">{title}</h4>
        <Badge variant="outline" className="text-[10px] ml-auto">{items.length}</Badge>
      </div>
      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
        {items.map(item => (
          <div 
            key={item.id} 
            className="bg-background/80 rounded-lg p-2 shadow-sm border border-border/30"
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
      </div>
    </div>
  );

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <Grid3X3 className="h-4 w-4 text-violet-500" />
          </div>
          <CardTitle className="text-base font-semibold">Investment Decision Matrix</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <QuadrantCard 
            title="Invest" 
            items={quadrants.invest}
            bgColor="bg-emerald-500/5"
            borderColor="border-emerald-500/20"
            icon={TrendingUp}
            iconColor="bg-emerald-500/20 text-emerald-600"
          />
          <QuadrantCard 
            title="Accelerate" 
            items={quadrants.accelerate}
            bgColor="bg-blue-500/5"
            borderColor="border-blue-500/20"
            icon={Zap}
            iconColor="bg-blue-500/20 text-blue-600"
          />
          <QuadrantCard 
            title="Shift" 
            items={quadrants.shift}
            bgColor="bg-amber-500/5"
            borderColor="border-amber-500/20"
            icon={ArrowRightLeft}
            iconColor="bg-amber-500/20 text-amber-600"
          />
          <QuadrantCard 
            title="Stop" 
            items={quadrants.stop}
            bgColor="bg-rose-500/5"
            borderColor="border-rose-500/20"
            icon={StopCircle}
            iconColor="bg-rose-500/20 text-rose-600"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentDecisionMatrix;
