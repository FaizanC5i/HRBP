import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Star, ChevronDown, Info, Building2 } from 'lucide-react';
import { insightOpportunities } from '@/data/insightsData';
import { internalInsightOpportunities } from '@/data/internalInsightsData';
import OpportunityMap from './OpportunityMap';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface InsightsOverviewProps {
  onSelectOpportunity: (id: string) => void;
}

type FilterCategory = 'all' | 'top-priority' | 'low-priority' | 'internal';

// Get top 6 opportunities by priority score (from external data only)
const getTopSixIds = () => {
  return [...insightOpportunities]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 6)
    .map(opp => opp.id);
};

const InsightsOverview = ({ onSelectOpportunity }: InsightsOverviewProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  
  const topSixIds = getTopSixIds();

  const filterOpportunities = () => {
    switch (activeFilter) {
      case 'all':
        // Show all cards - external + internal (only Microsoft source categories)
        const filteredInternal = internalInsightOpportunities.filter(opp => 
          opp.sourceCategory?.toLowerCase().includes('microsoft')
        );
        return [...insightOpportunities, ...filteredInternal]
          .sort((a, b) => b.priorityScore - a.priorityScore);
        
      case 'top-priority':
        // Show top 6 cards by priority (from external data)
        return [...insightOpportunities]
          .sort((a, b) => b.priorityScore - a.priorityScore)
          .slice(0, 6);
        
      case 'low-priority':
        // Show all cards NOT in top 6 (from external data)
        return [...insightOpportunities]
          .filter(opp => !topSixIds.includes(opp.id))
          .sort((a, b) => b.priorityScore - a.priorityScore);

      case 'internal':
        // Show ONLY internal opportunities where sourceCategory contains "Microsoft"
        return [...internalInsightOpportunities]
          .filter(opp => opp.sourceCategory?.toLowerCase().includes('microsoft'))
          .sort((a, b) => b.priorityScore - a.priorityScore);
        
      default:
        return insightOpportunities;
    }
  };

  const filteredOpportunities = filterOpportunities();

  const filterOptions = [
    { id: 'all' as FilterCategory, label: 'All', icon: Star },
    { id: 'top-priority' as FilterCategory, label: 'Top Priority', icon: Star },
    { id: 'low-priority' as FilterCategory, label: 'Low Priority', icon: ChevronDown },
    { id: 'internal' as FilterCategory, label: 'Internal', icon: Building2 },
  ];

  const activeOption = filterOptions.find(f => f.id === activeFilter);
  const ActiveIcon = activeOption?.icon || Star;

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-base font-semibold">Top Opportunities</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 px-2.5">
                <ActiveIcon className="h-3 w-3" />
                {activeOption?.label}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36">
              {filterOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => setActiveFilter(option.id)}
                    className={`text-xs gap-2 ${activeFilter === option.id ? 'bg-accent' : ''}`}
                  >
                    <Icon className="h-3 w-3" />
                    {option.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Opportunities Grid - Top 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredOpportunities.map((opp) => (
            <Card 
              key={opp.id}
              className="p-3 bg-card border-border/50 hover:shadow-md transition-all cursor-pointer"
              onClick={() => onSelectOpportunity(opp.id)}
            >
              {(() => {
                const isInternalCard = opp.id.startsWith('internal-');
                // Distinct colors for internal buckets vs external opportunity types
                const getBadgeColor = () => {
                  if (isInternalCard) {
                    // Internal bucket colors - distinct from orange
                    if (opp.opportunityType === 'Financial Intelligence') return 'bg-emerald-600';
                    if (opp.opportunityType === 'Strategic Direction') return 'bg-violet-600';
                    if (opp.opportunityType === 'Product Launch') return 'bg-sky-600';
                    if (opp.opportunityType === 'Strategic Investment') return 'bg-rose-600';
                    if (opp.opportunityType === 'Sales Performance') return 'bg-teal-600';
                    return 'bg-slate-600';
                  }
                  // External opportunity type colors
                  if (opp.opportunityType === 'AI Specific Opportunity') return 'bg-blue-500';
                  if (opp.opportunityType === 'Tech Adoption Surge') return 'bg-purple-500';
                  if (opp.opportunityType === 'Market Expansion') return 'bg-emerald-500';
                  if (opp.opportunityType === 'Automation Potential') return 'bg-cyan-500';
                  if (opp.opportunityType === 'Pain Point Cluster') return 'bg-orange-500';
                  if (opp.opportunityType === 'Infrastructure Modernization') return 'bg-teal-500';
                  if (opp.opportunityType === 'Partnership White Space') return 'bg-indigo-500';
                  if (opp.opportunityType === 'Corporate Transformation') return 'bg-rose-500';
                  return 'bg-amber-500';
                };

                return (
                  <>
                    <div className="flex items-start justify-between mb-1.5">
                      <Badge className={`text-[9px] px-1.5 py-0.5 ${getBadgeColor()}`}>
                        {opp.opportunityType}
                      </Badge>
                      <span className="text-[10px] font-semibold text-primary">
                        {Math.round(opp.priorityScore * 100)}%
                      </span>
                    </div>
                    {/* Title in black with info icon */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <h4 className="text-sm font-semibold text-black dark:text-foreground line-clamp-1 flex-1">
                        {opp.title}
                      </h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-primary cursor-help flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs bg-popover text-popover-foreground border shadow-md p-2">
                            <p className="text-xs leading-relaxed">{opp.opportunityDescription}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {/* Source Type displayed on card */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                      <span className="truncate max-w-[60%]">{opp.sourceType}</span>
                      <Badge variant="outline" className="text-[8px] px-1 py-0">
                        {opp.accelerationStatus}
                      </Badge>
                    </div>
                    {/* Executive Present - only for internal cards */}
                    {opp.executivePresent && (
                      <div className="flex items-center gap-1 text-[9px] text-blue-600 dark:text-blue-400 mb-1">
                        <Building2 className="h-2.5 w-2.5" />
                        <span className="truncate">{opp.executivePresent}</span>
                      </div>
                    )}
                    {/* Product/Tech Focus - only for internal cards with separator */}
                    {isInternalCard && opp.organizationalActionsNeeded && (
                      <div className="pt-1.5 mt-1.5 border-t border-border/40">
                        <div className="text-[9px] text-muted-foreground line-clamp-1">
                          <span className="font-medium">Tech Focus:</span> {opp.organizationalActionsNeeded}
                        </div>
                      </div>
                    )}
                    {opp.riskIfNotActing === 'High' && (
                      <div className="flex items-center gap-1 text-[9px] text-rose-500">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        <span>High Risk</span>
                      </div>
                    )}
                    {/* Roles Transition Data - ONLY for external cards, hidden for internal */}
                    {!isInternalCard && opp.rolesToBeTransitionedTo && opp.rolesToBeTransitionedTo.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/30">
                        <div className="text-[9px] text-muted-foreground mb-1">Roles Transition:</div>
                        <div className="flex flex-wrap gap-1">
                          {opp.rolesToBeTransitionedTo.slice(0, 2).map((role, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[8px] px-1.5 py-0 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                              {role}
                            </Badge>
                          ))}
                          {opp.rolesToBeTransitionedTo.length > 2 && (
                            <span className="text-[8px] text-muted-foreground">+{opp.rolesToBeTransitionedTo.length - 2}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </Card>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            No opportunities found for this filter.
          </div>
        )}
      </div>

      {/* Opportunity Map */}
      <OpportunityMap onSelectOpportunity={onSelectOpportunity} />
    </div>
  );
};

export default InsightsOverview;
