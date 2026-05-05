import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, AlertTriangle, DollarSign, Users } from 'lucide-react';
import { marketOpportunities } from '@/data/marketSensingData';

interface MarketKPIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpiType: 'opportunities' | 'acceleration' | 'risk' | 'investment' | 'action';
}

const iconMap = {
  opportunities: TrendingUp,
  acceleration: Zap,
  risk: AlertTriangle,
  investment: DollarSign,
  action: Users
};

const colorMap = {
  opportunities: 'text-emerald-500',
  acceleration: 'text-blue-500',
  risk: 'text-rose-500',
  investment: 'text-violet-500',
  action: 'text-orange-500'
};

const bgMap = {
  opportunities: 'bg-emerald-500/10',
  acceleration: 'bg-blue-500/10',
  risk: 'bg-rose-500/10',
  investment: 'bg-violet-500/10',
  action: 'bg-orange-500/10'
};

const titleMap = {
  opportunities: 'Top Opportunities Breakdown',
  acceleration: 'Acceleration Momentum Breakdown',
  risk: 'Risk Exposure Breakdown',
  investment: 'Investment Readiness Breakdown',
  action: 'Organizational Action Breakdown'
};

const MarketKPIModal = ({ open, onOpenChange, kpiType }: MarketKPIModalProps) => {
  const IconComponent = iconMap[kpiType];
  const title = titleMap[kpiType];

  const renderContent = () => {
    switch (kpiType) {
      case 'opportunities': {
        const high = marketOpportunities.filter(o => o.priorityCategory === 'High');
        const medium = marketOpportunities.filter(o => o.priorityCategory === 'Medium');
        const low = marketOpportunities.filter(o => o.priorityCategory === 'Low');
        
        return (
          <div className="space-y-4">
            {/* High Priority */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-emerald-500">{high.length} High Priority</Badge>
              </div>
              <div className="space-y-1.5">
                {high.map((opp, i) => (
                  <div key={i} className="p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                    <p className="text-sm font-medium">{opp.title}</p>
                    <p className="text-xs text-muted-foreground">{opp.sourceCategory} • Confidence: {opp.confidenceScore}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Medium Priority */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-amber-500">{medium.length} Medium Priority</Badge>
              </div>
              <div className="space-y-1.5">
                {medium.map((opp, i) => (
                  <div key={i} className="p-2 bg-amber-500/5 rounded-lg border border-amber-500/20">
                    <p className="text-sm font-medium">{opp.title}</p>
                    <p className="text-xs text-muted-foreground">{opp.sourceCategory} • Confidence: {opp.confidenceScore}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Priority */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-gray-500">{low.length} Low Priority</Badge>
              </div>
              <div className="space-y-1.5">
                {low.map((opp, i) => (
                  <div key={i} className="p-2 bg-gray-500/5 rounded-lg border border-gray-500/20">
                    <p className="text-sm font-medium">{opp.title}</p>
                    <p className="text-xs text-muted-foreground">{opp.sourceCategory} • Confidence: {opp.confidenceScore}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'acceleration': {
        const rapid = marketOpportunities.filter(o => o.accelerationStatus === 'Rapid');
        const moderate = marketOpportunities.filter(o => o.accelerationStatus === 'Moderate');
        const slow = marketOpportunities.filter(o => o.accelerationStatus === 'Slow');
        const stable = marketOpportunities.filter(o => o.accelerationStatus === 'Stable');
        
        return (
          <div className="space-y-4">
            {[
              { label: 'Rapid', items: rapid, color: 'blue' },
              { label: 'Moderate', items: moderate, color: 'cyan' },
              { label: 'Slow', items: slow, color: 'amber' },
              { label: 'Stable', items: stable, color: 'gray' }
            ].map(group => (
              <div key={group.label}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`bg-${group.color}-500`}>{group.items.length} {group.label}</Badge>
                </div>
                <div className="space-y-1.5">
                  {group.items.map((opp, i) => (
                    <div key={i} className={`p-2 bg-${group.color}-500/5 rounded-lg border border-${group.color}-500/20`}>
                      <p className="text-sm font-medium">{opp.title}</p>
                      <p className="text-xs text-muted-foreground">{opp.accelerationDetails}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }

      case 'risk': {
        const high = marketOpportunities.filter(o => o.riskIfNotActing === 'High');
        const medium = marketOpportunities.filter(o => o.riskIfNotActing === 'Medium');
        const low = marketOpportunities.filter(o => o.riskIfNotActing === 'Low');
        
        return (
          <div className="space-y-4">
            {/* High Risk */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-rose-500">{high.length} High Risk</Badge>
              </div>
              <div className="space-y-1.5">
                {high.map((opp, i) => (
                  <div key={i} className="p-2 bg-rose-500/5 rounded-lg border border-rose-500/20">
                    <p className="text-sm font-medium">{opp.title}</p>
                    <p className="text-xs text-muted-foreground">{opp.riskDetails}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Medium Risk */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-amber-500">{medium.length} Medium Risk</Badge>
              </div>
              <div className="space-y-1.5">
                {medium.map((opp, i) => (
                  <div key={i} className="p-2 bg-amber-500/5 rounded-lg border border-amber-500/20">
                    <p className="text-sm font-medium">{opp.title}</p>
                    <p className="text-xs text-muted-foreground">{opp.riskDetails}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Risk */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-emerald-500">{low.length} Low Risk</Badge>
              </div>
              <div className="space-y-1.5">
                {low.map((opp, i) => (
                  <div key={i} className="p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                    <p className="text-sm font-medium">{opp.title}</p>
                    <p className="text-xs text-muted-foreground">{opp.riskDetails}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'investment': {
        const invest = marketOpportunities.filter(o => o.investmentRecommendation === 'Invest');
        const accelerate = marketOpportunities.filter(o => o.investmentRecommendation === 'Accelerate');
        const shift = marketOpportunities.filter(o => o.investmentRecommendation === 'Shift');
        const stop = marketOpportunities.filter(o => o.investmentRecommendation === 'Stop');
        
        return (
          <div className="space-y-4">
            {[
              { label: 'Invest', items: invest, colorClass: 'bg-emerald-500', bgClass: 'bg-emerald-500/5', borderClass: 'border-emerald-500/20' },
              { label: 'Accelerate', items: accelerate, colorClass: 'bg-blue-500', bgClass: 'bg-blue-500/5', borderClass: 'border-blue-500/20' },
              { label: 'Shift', items: shift, colorClass: 'bg-amber-500', bgClass: 'bg-amber-500/5', borderClass: 'border-amber-500/20' },
              { label: 'Stop', items: stop, colorClass: 'bg-rose-500', bgClass: 'bg-rose-500/5', borderClass: 'border-rose-500/20' }
            ].map(group => (
              <div key={group.label}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={group.colorClass}>{group.items.length} {group.label}</Badge>
                </div>
                <div className="space-y-1.5">
                  {group.items.map((opp, i) => (
                    <div key={i} className={`p-2 ${group.bgClass} rounded-lg border ${group.borderClass}`}>
                      <p className="text-sm font-medium">{opp.title}</p>
                      <p className="text-xs text-muted-foreground">Priority: {opp.priorityCategory} • {opp.timeframe}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }

      case 'action': {
        const actionTypes = ['skills', 'tech', 'process', 'governance', 'partnerships'] as const;
        const actionLabels = {
          skills: 'Skills Development',
          tech: 'Technology Investment',
          process: 'Process Changes',
          governance: 'Governance Updates',
          partnerships: 'Partnership Building'
        };
        const actionColors = {
          skills: { badge: 'bg-purple-500', bg: 'bg-purple-500/5', border: 'border-purple-500/20' },
          tech: { badge: 'bg-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
          process: { badge: 'bg-cyan-500', bg: 'bg-cyan-500/5', border: 'border-cyan-500/20' },
          governance: { badge: 'bg-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/20' },
          partnerships: { badge: 'bg-rose-500', bg: 'bg-rose-500/5', border: 'border-rose-500/20' }
        };
        
        return (
          <div className="space-y-4">
            {actionTypes.map(actionType => {
              const items = marketOpportunities.filter(o => o.organizationalActions[actionType]);
              const colors = actionColors[actionType];
              
              return (
                <div key={actionType}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={colors.badge}>
                      {items.length} need {actionLabels[actionType]}
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    {items.slice(0, 3).map((opp, i) => (
                      <div key={i} className={`p-2 ${colors.bg} rounded-lg border ${colors.border}`}>
                        <p className="text-sm font-medium">{opp.title}</p>
                        <p className="text-xs text-muted-foreground">{opp.sourceCategory} • {opp.timeframe}</p>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-2">+{items.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${bgMap[kpiType]}`}>
              <IconComponent className={`h-5 w-5 ${colorMap[kpiType]}`} />
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-2">
          {renderContent()}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t mt-4">
          <Badge variant="outline" className="text-xs">
            Source: Scraped Market Data
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarketKPIModal;