import { useState } from 'react';
import { TrendingUp, Zap, AlertTriangle, DollarSign, Users, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getMarketMetrics } from '@/data/marketSensingData';
import MarketKPIModal from './MarketKPIModal';

type KPIType = 'opportunities' | 'acceleration' | 'risk' | 'investment' | 'action';

const tooltips = {
  opportunities: 'Total market opportunities identified, categorized by priority level (High/Medium/Low).',
  acceleration: 'Tracks how quickly market opportunities are gaining traction in the market.',
  risk: 'Quantifies exposure to competitive and market risks if action is not taken.',
  investment: 'Categorizes opportunities by recommended investment action.',
  action: 'Measures organizational capabilities required to capture opportunities.'
};

const KPICards = () => {
  const metrics = getMarketMetrics();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeKPI, setActiveKPI] = useState<KPIType>('opportunities');

  const handleCardClick = (kpiType: KPIType) => {
    setActiveKPI(kpiType);
    setModalOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Top Opportunities */}
        <Card 
          className="p-4 bg-card border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => handleCardClick('opportunities')}
        >
          <div className="flex items-start justify-between mb-2">
            <Badge variant="outline" className="text-[10px] bg-cyan-500/10 text-cyan-600 border-cyan-500/20">
              AI Specific Opportunity
            </Badge>
            <span className="text-sm font-semibold text-emerald-600">{Math.round(metrics.avgConfidence)}%</span>
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Top Strategic Technology Trends 2026</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-muted-foreground">Gartner Tech Trends</span>
            <Badge className="text-[9px] px-1.5 py-0 bg-blue-500/20 text-blue-600 border-0">
              Rapid
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-rose-500 text-[10px]">
            <AlertTriangle className="h-3 w-3" />
            <span>High Risk</span>
          </div>
          <div className="mt-2 pt-2 border-t border-border/30">
            <p className="text-[9px] text-muted-foreground">
              {metrics.totalRoleTransitions} roles transitioned
            </p>
          </div>
        </Card>

        {/* Acceleration Momentum */}
        <Card 
          className="p-4 bg-card border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => handleCardClick('acceleration')}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Zap className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex items-center gap-1">
              <Badge className="text-[9px] px-1.5 py-0 bg-blue-500/20 text-blue-600 border-0">
                {Math.round((metrics.accelerationBreakdown.rapid / metrics.totalOpportunities) * 100)}% Rapid
              </Badge>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p className="text-xs">{tooltips.acceleration}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Acceleration Momentum</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-foreground">{metrics.totalOpportunities}</span>
            <span className="text-sm text-muted-foreground">opportunities</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            <div className="text-center p-1 rounded bg-blue-500/10">
              <div className="text-xs font-semibold text-blue-500">{metrics.accelerationBreakdown.rapid}</div>
              <div className="text-[9px] text-muted-foreground">Rapid</div>
            </div>
            <div className="text-center p-1 rounded bg-cyan-500/10">
              <div className="text-xs font-semibold text-cyan-500">{metrics.accelerationBreakdown.moderate}</div>
              <div className="text-[9px] text-muted-foreground">Mod</div>
            </div>
            <div className="text-center p-1 rounded bg-amber-500/10">
              <div className="text-xs font-semibold text-amber-500">{metrics.accelerationBreakdown.slow}</div>
              <div className="text-[9px] text-muted-foreground">Slow</div>
            </div>
            <div className="text-center p-1 rounded bg-gray-500/10">
              <div className="text-xs font-semibold text-gray-400">{metrics.accelerationBreakdown.stable}</div>
              <div className="text-[9px] text-muted-foreground">Stbl</div>
            </div>
          </div>
        </Card>

        {/* Risk Exposure */}
        <Card 
          className="p-4 bg-card border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => handleCardClick('risk')}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-rose-500/10">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
            </div>
            <div className="flex items-center gap-1">
              <Badge className="text-[9px] px-1.5 py-0 bg-rose-500/20 text-rose-600 border-0">
                {metrics.riskBreakdown.high} High Risk
              </Badge>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p className="text-xs">{tooltips.risk}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Risk Exposure</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-foreground">{metrics.totalOpportunities}</span>
            <span className="text-sm text-muted-foreground">opportunities</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden flex">
            <div 
              className="bg-rose-500 h-full" 
              style={{ width: `${(metrics.riskBreakdown.high / metrics.totalOpportunities) * 100}%` }} 
            />
            <div 
              className="bg-amber-500 h-full" 
              style={{ width: `${(metrics.riskBreakdown.medium / metrics.totalOpportunities) * 100}%` }} 
            />
            <div 
              className="bg-emerald-500 h-full" 
              style={{ width: `${(metrics.riskBreakdown.low / metrics.totalOpportunities) * 100}%` }} 
            />
          </div>
          <div className="mt-1.5 grid grid-cols-3 gap-1 text-[9px]">
            <div className="text-center p-1 rounded bg-rose-500/10">
              <span className="font-semibold text-rose-600">High: {metrics.riskBreakdown.high}</span>
            </div>
            <div className="text-center p-1 rounded bg-amber-500/10">
              <span className="font-semibold text-amber-600">Med: {metrics.riskBreakdown.medium}</span>
            </div>
            <div className="text-center p-1 rounded bg-emerald-500/10">
              <span className="font-semibold text-emerald-600">Low: {metrics.riskBreakdown.low}</span>
            </div>
          </div>
        </Card>

        {/* Investment Readiness */}
        <Card 
          className="p-4 bg-card border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => handleCardClick('investment')}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <DollarSign className="h-5 w-5 text-violet-500" />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p className="text-xs">{tooltips.investment}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Investment Readiness Mix</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-foreground">{metrics.totalOpportunities}</span>
            <span className="text-sm text-muted-foreground">opportunities</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden flex">
            <div 
              className="bg-emerald-500 h-full" 
              style={{ width: `${(metrics.investmentMix.invest / metrics.totalOpportunities) * 100}%` }} 
              title="Invest"
            />
            <div 
              className="bg-blue-500 h-full" 
              style={{ width: `${(metrics.investmentMix.accelerate / metrics.totalOpportunities) * 100}%` }} 
              title="Accelerate"
            />
            <div 
              className="bg-amber-500 h-full" 
              style={{ width: `${(metrics.investmentMix.shift / metrics.totalOpportunities) * 100}%` }} 
              title="Shift"
            />
            <div 
              className="bg-rose-500 h-full" 
              style={{ width: `${(metrics.investmentMix.stop / metrics.totalOpportunities) * 100}%` }} 
              title="Stop"
            />
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1 text-[9px]">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Invest ({metrics.investmentMix.invest})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Accel ({metrics.investmentMix.accelerate})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Shift ({metrics.investmentMix.shift})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Stop ({metrics.investmentMix.stop})</span>
            </div>
          </div>
        </Card>

        {/* Organizational Action Load */}
        <Card 
          className="p-4 bg-card border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => handleCardClick('action')}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Users className="h-5 w-5 text-orange-500" />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p className="text-xs">{tooltips.action}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Organizational Action Load</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-foreground">{metrics.actionPercentages.skills}%</span>
            <span className="text-sm text-muted-foreground">need skills</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-purple-500/10 text-purple-600 border-purple-500/20">
              Skills {metrics.actionPercentages.skills}%
            </Badge>
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-blue-500/10 text-blue-600 border-blue-500/20">
              Tech {metrics.actionPercentages.tech}%
            </Badge>
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-cyan-500/10 text-cyan-600 border-cyan-500/20">
              Process {metrics.actionPercentages.process}%
            </Badge>
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-amber-500/10 text-amber-600 border-amber-500/20">
              Gov {metrics.actionPercentages.governance}%
            </Badge>
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-rose-500/10 text-rose-600 border-rose-500/20">
              Partners {metrics.actionPercentages.partnerships}%
            </Badge>
          </div>
        </Card>
      </div>

      <MarketKPIModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        kpiType={activeKPI} 
      />
    </TooltipProvider>
  );
};

export default KPICards;
