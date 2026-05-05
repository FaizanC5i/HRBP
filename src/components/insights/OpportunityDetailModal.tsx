import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, AlertTriangle, Zap, Target, MapPin, Calendar, TrendingUp, ClipboardList, Link2, Building2, Lightbulb, BarChart3, Cpu, MessageSquareQuote, HelpCircle } from 'lucide-react';
import { insightOpportunities, InsightOpportunity } from '@/data/insightsData';
import { internalInsightOpportunities, internalAnalystCalls } from '@/data/internalInsightsData';
import ActionPlanDialog from './ActionPlanDialog';

interface OpportunityDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunityId: string | null;
}

// Combine both external and internal opportunities for lookup
const allOpportunities = [...insightOpportunities, ...internalInsightOpportunities];

const OpportunityDetailModal = ({ open, onOpenChange, opportunityId }: OpportunityDetailModalProps) => {
  const [actionPlanOpen, setActionPlanOpen] = useState(false);
  // Search in both external and internal opportunities
  const opportunity = allOpportunities.find(o => o.id === opportunityId);
  
  // Check if this is an internal opportunity and get the full analyst call data
  const isInternalOpportunity = opportunityId?.startsWith('internal-');
  const internalData = isInternalOpportunity 
    ? internalAnalystCalls.find(call => call.id === opportunityId)
    : null;
  
  if (!opportunity) return null;

  const relatedOpportunities = allOpportunities
    .filter(o => o.id !== opportunityId && o.opportunityType === opportunity.opportunityType)
    .slice(0, 3);

  const getRiskColor = (risk: string) => {
    if (risk === 'High') return 'bg-rose-500';
    if (risk === 'Medium') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getAccelerationColor = (status: string) => {
    if (status === 'Rapid') return 'bg-blue-500';
    if (status === 'Moderate') return 'bg-cyan-500';
    if (status === 'Slow') return 'bg-amber-500';
    return 'bg-gray-500';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className="bg-blue-500 text-[10px]">{opportunity.opportunityType}</Badge>
                <Badge className={`${getAccelerationColor(opportunity.accelerationStatus)} text-[10px]`}>
                  {opportunity.accelerationStatus}
                </Badge>
                <Badge className={`${getRiskColor(opportunity.riskIfNotActing)} text-[10px]`}>
                  {opportunity.riskIfNotActing} Risk
                </Badge>
              </div>
              <DialogTitle className="text-lg">{opportunity.title}</DialogTitle>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {Math.round(opportunity.priorityScore * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Priority Score</div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Header Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="truncate">{opportunity.sourceType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{opportunity.publicationDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{opportunity.geographicScope}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{Math.round(opportunity.confidenceScore * 100)}% Confidence</span>
            </div>
          </div>

          {/* Executive Present - Only for internal opportunities */}
          {internalData && internalData.executivePresent && (
            <div className="flex items-center gap-2 text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
              <Building2 className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-blue-700 dark:text-blue-300">Executive Present:</span>
              <span className="text-blue-600 dark:text-blue-400">{internalData.executivePresent}</span>
            </div>
          )}

          <Separator />

          {/* INTERNAL OPPORTUNITY: Show 5 sections with all Excel columns */}
          {isInternalOpportunity && internalData ? (
            <>
              {/* Section 1: Strategic Direction & Financial Performance */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Strategic Direction & Financial Performance
                </h4>
                <div className="space-y-3">
                  {internalData.strategicDirection && (
                    <div className="bg-muted/30 p-2.5 rounded-md">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Strategic Direction</span>
                      <p className="text-xs text-foreground mt-1">{internalData.strategicDirection}</p>
                    </div>
                  )}
                  {internalData.financialPerformance && (
                    <div className="bg-muted/30 p-2.5 rounded-md">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Financial Performance (AI & Cloud)</span>
                      <p className="text-xs text-foreground mt-1">{internalData.financialPerformance}</p>
                    </div>
                  )}
                  {internalData.strategicShifts && (
                    <div className="bg-muted/30 p-2.5 rounded-md">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Strategic Shifts</span>
                      <p className="text-xs text-foreground mt-1">{internalData.strategicShifts}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Market Signals */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-cyan-500" />
                  Market Signals & Investor Sentiment
                </h4>
                <div className="space-y-3">
                  {internalData.investorSentiment && (
                    <div className="bg-muted/30 p-2.5 rounded-md">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Investor Sentiment</span>
                      <p className="text-xs text-foreground mt-1">{internalData.investorSentiment}</p>
                    </div>
                  )}
                  {internalData.strongMarketSignals && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2.5 rounded-md border-l-2 border-emerald-500">
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Strong Market Signals</span>
                      <p className="text-xs text-foreground mt-1">{internalData.strongMarketSignals}</p>
                    </div>
                  )}
                  {internalData.weakMarketSignals && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-md border-l-2 border-amber-500">
                      <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">Weak Market Signals</span>
                      <p className="text-xs text-foreground mt-1">{internalData.weakMarketSignals}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Product & Technology Focus */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-purple-500" />
                  Product & Technology Focus
                </h4>
                <div className="space-y-3">
                  {internalData.productTechPriorities && (
                    <div className="bg-muted/30 p-2.5 rounded-md">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Product/Tech Priorities</span>
                      <p className="text-xs text-foreground mt-1">{internalData.productTechPriorities}</p>
                    </div>
                  )}
                  {internalData.emergingCapabilitiesFocus && (
                    <div className="bg-muted/30 p-2.5 rounded-md">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Emerging Capabilities Focus</span>
                      <p className="text-xs text-foreground mt-1">{internalData.emergingCapabilitiesFocus}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Key Insights & Details */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  Key Insights & Details
                </h4>
                <div className="space-y-3">
                  {internalData.mainPoints && (
                    <div className="bg-muted/30 p-2.5 rounded-md">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Main Points</span>
                      <p className="text-xs text-foreground mt-1">{internalData.mainPoints}</p>
                    </div>
                  )}
                  {internalData.details && (
                    <div className="bg-muted/30 p-2.5 rounded-md">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Details</span>
                      <p className="text-xs text-foreground mt-1">{internalData.details}</p>
                    </div>
                  )}
                  {internalData.keyExecutiveQuotes && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2.5 rounded-md border-l-2 border-indigo-500">
                      <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1">
                        <MessageSquareQuote className="h-3 w-3" />
                        Key Executive Quotes
                      </span>
                      <p className="text-xs text-foreground mt-1 italic">"{internalData.keyExecutiveQuotes}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 5: Analyst Focus & Q&A */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-rose-500" />
                  Analyst Focus & Q&A Highlights
                </h4>
                <div className="space-y-3">
                  {internalData.analystQuestionsFocus && (
                    <div className="bg-muted/30 p-2.5 rounded-md">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Analyst Questions Focus</span>
                      <p className="text-xs text-foreground mt-1">{internalData.analystQuestionsFocus}</p>
                    </div>
                  )}
                  {internalData.qaSegmentHighlights && (
                    <div className="bg-muted/30 p-2.5 rounded-md">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Q&A Segment Highlights</span>
                      <p className="text-xs text-foreground mt-1">{internalData.qaSegmentHighlights}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* EXTERNAL OPPORTUNITY: Show original 5 sections */}
              {/* Opportunity Description */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  Opportunity Description
                </h4>
                <p className="text-sm text-muted-foreground">{opportunity.opportunityDescription}</p>
              </div>

              {/* Acceleration Details */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-500" />
                  Acceleration Details
                </h4>
                <p className="text-sm text-muted-foreground">{opportunity.accelerationDetails}</p>
              </div>

              {/* Risk Details */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  Risk If Not Acting
                </h4>
                <p className="text-sm text-muted-foreground">{opportunity.riskDetails}</p>
              </div>

              {/* Organizational Actions */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-purple-500" />
                  Organizational Actions Needed
                </h4>
                <p className="text-sm text-muted-foreground">{opportunity.organizationalActionsNeeded}</p>
              </div>

              {/* Key Insights */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Key Insights</h4>
                <p className="text-sm text-muted-foreground">{opportunity.keyInsights}</p>
              </div>
            </>
          )}

          {/* Source URL - Single URL for internal, multiple for external */}
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Link2 className="h-4 w-4 text-indigo-500" />
              Source
            </h4>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {/* Main source URL */}
              {opportunity.url && (
                <a 
                  href={opportunity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-primary hover:underline font-medium"
                >
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {(() => {
                      try {
                        return new URL(opportunity.url).hostname.replace('www.', '');
                      } catch {
                        return opportunity.url;
                      }
                    })()}
                  </span>
                  {!isInternalOpportunity && <Badge variant="secondary" className="text-[8px] px-1 py-0 ml-1">Primary</Badge>}
                </a>
              )}
              {/* Additional source URLs - only for external opportunities */}
              {!isInternalOpportunity && opportunity.sourceUrls && opportunity.sourceUrls.map((url, idx) => {
                let domain = url;
                try {
                  domain = new URL(url).hostname.replace('www.', '');
                } catch {
                  domain = url;
                }
                return (
                  <a 
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-primary hover:underline truncate"
                  >
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{domain}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Related Opportunities */}
          {relatedOpportunities.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-3">Related Opportunities</h4>
              <div className="space-y-2">
                {relatedOpportunities.map(rel => (
                  <Card key={rel.id} className="p-2 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{rel.title}</span>
                      <Badge variant="outline" className="text-[9px]">
                        {Math.round(rel.priorityScore * 100)}%
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" size="sm" onClick={() => setActionPlanOpen(true)}>
              <ClipboardList className="h-4 w-4 mr-2" />
              Create Action Plan
            </Button>
          </div>
        </div>

        <ActionPlanDialog 
          open={actionPlanOpen} 
          onOpenChange={setActionPlanOpen} 
          opportunity={opportunity} 
        />

      </DialogContent>
    </Dialog>
  );
};

export default OpportunityDetailModal;
