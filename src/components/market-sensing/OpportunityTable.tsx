import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { marketOpportunities, MarketOpportunity } from '@/data/marketSensingData';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  ExternalLink,
  FileText,
  Calendar,
  Globe,
  Target,
  Lightbulb,
  Filter,
  X
} from 'lucide-react';

const OpportunityTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const [accelerationFilters, setAccelerationFilters] = useState<Set<string>>(new Set());
  const [riskFilters, setRiskFilters] = useState<Set<string>>(new Set());
  const [actionFilters, setActionFilters] = useState<Set<string>>(new Set());
  const [sourceFilters, setSourceFilters] = useState<Set<string>>(new Set());

  // Extract unique values for filters
  const uniqueAccelerations = useMemo(() => 
    [...new Set(marketOpportunities.map(o => o.accelerationStatus))], []);
  const uniqueRisks = useMemo(() => 
    [...new Set(marketOpportunities.map(o => o.riskIfNotActing))], []);
  const uniqueActions = useMemo(() => 
    [...new Set(marketOpportunities.map(o => o.investmentRecommendation))], []);
  const uniqueSources = useMemo(() => 
    [...new Set(marketOpportunities.map(o => o.sourceType))], []);

  const filteredOpportunities = useMemo(() => {
    return marketOpportunities.filter(opp => {
      const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.sourceType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAcceleration = accelerationFilters.size === 0 || accelerationFilters.has(opp.accelerationStatus);
      const matchesRisk = riskFilters.size === 0 || riskFilters.has(opp.riskIfNotActing);
      const matchesAction = actionFilters.size === 0 || actionFilters.has(opp.investmentRecommendation);
      const matchesSource = sourceFilters.size === 0 || sourceFilters.has(opp.sourceType);
      
      return matchesSearch && matchesAcceleration && matchesRisk && matchesAction && matchesSource;
    });
  }, [searchTerm, accelerationFilters, riskFilters, actionFilters, sourceFilters]);

  const toggleFilter = (set: Set<string>, setFn: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) => {
    const newSet = new Set(set);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setFn(newSet);
  };

  const clearAllFilters = () => {
    setAccelerationFilters(new Set());
    setRiskFilters(new Set());
    setActionFilters(new Set());
    setSourceFilters(new Set());
  };

  const activeFilterCount = accelerationFilters.size + riskFilters.size + actionFilters.size + sourceFilters.size;

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'Invest': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Accelerate': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Shift': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Stop': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Low': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      'Gartner': 'bg-blue-500/10 text-blue-600',
      'Forrester': 'bg-emerald-500/10 text-emerald-600',
      'McKinsey': 'bg-violet-500/10 text-violet-600',
      'LinkedIn Intelligence': 'bg-cyan-500/10 text-cyan-600',
      'Bloomberg': 'bg-amber-500/10 text-amber-600',
      'USPTO': 'bg-rose-500/10 text-rose-600',
      'MIT Sloan': 'bg-purple-500/10 text-purple-600',
      'Reuters': 'bg-orange-500/10 text-orange-600',
      'IDC': 'bg-teal-500/10 text-teal-600',
      'Deloitte': 'bg-indigo-500/10 text-indigo-600',
    };
    return colors[source] || 'bg-gray-500/10 text-gray-600';
  };

  const ExpandedContent = ({ opp }: { opp: MarketOpportunity }) => (
    <div className="px-6 py-4 bg-muted/20 border-t border-border/50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Details */}
        <div className="space-y-3">
          <div>
            <h5 className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
              <FileText className="h-3 w-3" /> Description
            </h5>
            <p className="text-xs text-foreground">{opp.description}</p>
          </div>
          <div>
            <h5 className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
              <Target className="h-3 w-3" /> Biggest Opportunity
            </h5>
            <p className="text-xs text-foreground">{opp.biggestOpportunityAssessment}</p>
          </div>
          <div>
            <h5 className="text-xs font-semibold text-muted-foreground mb-1">Risk Details</h5>
            <p className="text-xs text-foreground">{opp.riskDetails}</p>
          </div>
        </div>

        {/* Middle Column - Insights */}
        <div className="space-y-3">
          <div>
            <h5 className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
              <Lightbulb className="h-3 w-3" /> Key Insights
            </h5>
            <ul className="space-y-1">
              {opp.keyInsights.map((insight, i) => (
                <li key={i} className="text-xs text-foreground flex items-start gap-1">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-semibold text-muted-foreground mb-1">Sales Relevance</h5>
            <p className="text-xs text-foreground">{opp.relevanceToSales}</p>
          </div>
        </div>

        {/* Right Column - Meta */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background rounded-lg p-2 border border-border/30">
              <span className="text-[10px] text-muted-foreground">Market Size</span>
              <p className="text-xs font-semibold text-foreground">{opp.marketSizeIndicator}</p>
            </div>
            <div className="bg-background rounded-lg p-2 border border-border/30">
              <span className="text-[10px] text-muted-foreground">Confidence</span>
              <p className="text-xs font-semibold text-foreground">{Math.round(opp.confidenceScore * 100)}%</p>
            </div>
            <div className="bg-background rounded-lg p-2 border border-border/30">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Globe className="h-2.5 w-2.5" /> Geography
              </span>
              <p className="text-xs font-semibold text-foreground">{opp.geographicScope}</p>
            </div>
            <div className="bg-background rounded-lg p-2 border border-border/30">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" /> Published
              </span>
              <p className="text-xs font-semibold text-foreground">{opp.publicationDate}</p>
            </div>
          </div>
          <div>
            <h5 className="text-xs font-semibold text-muted-foreground mb-1">Actions Required</h5>
            <div className="flex flex-wrap gap-1">
              {opp.organizationalActions.skills && (
                <Badge variant="outline" className="text-[9px] bg-purple-500/10 text-purple-600">Skills</Badge>
              )}
              {opp.organizationalActions.tech && (
                <Badge variant="outline" className="text-[9px] bg-blue-500/10 text-blue-600">Tech</Badge>
              )}
              {opp.organizationalActions.process && (
                <Badge variant="outline" className="text-[9px] bg-cyan-500/10 text-cyan-600">Process</Badge>
              )}
              {opp.organizationalActions.governance && (
                <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-600">Governance</Badge>
              )}
              {opp.organizationalActions.partnerships && (
                <Badge variant="outline" className="text-[9px] bg-rose-500/10 text-rose-600">Partnerships</Badge>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs h-8"
            onClick={() => window.open(opp.url, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1.5" />
            View Source
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">Opportunity Intelligence</CardTitle>
            {activeFilterCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
              </Button>
            )}
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-8"></TableHead>
                <TableHead className="text-xs font-semibold">Title</TableHead>
                {/* Source Filter */}
                <TableHead className="text-xs font-semibold w-28">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 px-1 text-xs font-semibold gap-1">
                        Source
                        <Filter className={`h-3 w-3 ${sourceFilters.size > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                        {sourceFilters.size > 0 && (
                          <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-primary">
                            {sourceFilters.size}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="start">
                      <div className="space-y-1">
                        {uniqueSources.map(source => (
                          <div key={source} className="flex items-center gap-2">
                            <Checkbox 
                              id={`source-${source}`}
                              checked={sourceFilters.has(source)}
                              onCheckedChange={() => toggleFilter(sourceFilters, setSourceFilters, source)}
                            />
                            <label htmlFor={`source-${source}`} className="text-xs cursor-pointer flex-1">
                              {source}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableHead>
                <TableHead className="text-xs font-semibold w-28">Type</TableHead>
                {/* Acceleration Filter */}
                <TableHead className="text-xs font-semibold w-28 text-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 px-1 text-xs font-semibold gap-1">
                        Acceleration
                        <Filter className={`h-3 w-3 ${accelerationFilters.size > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                        {accelerationFilters.size > 0 && (
                          <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-primary">
                            {accelerationFilters.size}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2" align="start">
                      <div className="space-y-1">
                        {uniqueAccelerations.map(acc => (
                          <div key={acc} className="flex items-center gap-2">
                            <Checkbox 
                              id={`acc-${acc}`}
                              checked={accelerationFilters.has(acc)}
                              onCheckedChange={() => toggleFilter(accelerationFilters, setAccelerationFilters, acc)}
                            />
                            <label htmlFor={`acc-${acc}`} className="text-xs cursor-pointer flex-1">
                              {acc}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableHead>
                {/* Risk Filter */}
                <TableHead className="text-xs font-semibold w-20 text-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 px-1 text-xs font-semibold gap-1">
                        Risk
                        <Filter className={`h-3 w-3 ${riskFilters.size > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                        {riskFilters.size > 0 && (
                          <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-primary">
                            {riskFilters.size}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 p-2" align="start">
                      <div className="space-y-1">
                        {uniqueRisks.map(risk => (
                          <div key={risk} className="flex items-center gap-2">
                            <Checkbox 
                              id={`risk-${risk}`}
                              checked={riskFilters.has(risk)}
                              onCheckedChange={() => toggleFilter(riskFilters, setRiskFilters, risk)}
                            />
                            <label htmlFor={`risk-${risk}`} className="text-xs cursor-pointer flex-1">
                              {risk}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableHead>
                {/* Action Filter */}
                <TableHead className="text-xs font-semibold w-24 text-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 px-1 text-xs font-semibold gap-1">
                        Action
                        <Filter className={`h-3 w-3 ${actionFilters.size > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                        {actionFilters.size > 0 && (
                          <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-primary">
                            {actionFilters.size}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-36 p-2" align="start">
                      <div className="space-y-1">
                        {uniqueActions.map(action => (
                          <div key={action} className="flex items-center gap-2">
                            <Checkbox 
                              id={`action-${action}`}
                              checked={actionFilters.has(action)}
                              onCheckedChange={() => toggleFilter(actionFilters, setActionFilters, action)}
                            />
                            <label htmlFor={`action-${action}`} className="text-xs cursor-pointer flex-1">
                              {action}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableHead>
                <TableHead className="text-xs font-semibold w-16 text-center">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpportunities.map((opp, idx) => (
                <Collapsible key={opp.id} open={expandedRows.has(opp.id)} asChild>
                  <>
                    <CollapsibleTrigger asChild>
                      <TableRow 
                        className={`cursor-pointer hover:bg-muted/30 transition-colors ${
                          idx % 2 === 0 ? 'bg-muted/10' : ''
                        }`}
                        onClick={() => toggleRow(opp.id)}
                      >
                        <TableCell className="py-2.5">
                          {expandedRows.has(opp.id) ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <span className="text-xs font-medium text-foreground line-clamp-1">
                            {opp.title}
                          </span>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge className={`text-[9px] px-1.5 py-0 ${getSourceColor(opp.sourceType)}`}>
                            {opp.sourceType}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <span className="text-[10px] text-muted-foreground">{opp.opportunityType}</span>
                        </TableCell>
                        <TableCell className="py-2.5 text-center">
                          <Badge 
                            className={`text-[9px] px-1.5 py-0 ${
                              opp.accelerationStatus === 'Rapid' ? 'bg-blue-500 text-white' :
                              opp.accelerationStatus === 'Moderate' ? 'bg-cyan-500 text-white' :
                              opp.accelerationStatus === 'Slow' ? 'bg-amber-500 text-white' :
                              'bg-gray-400 text-white'
                            }`}
                          >
                            {opp.accelerationStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-center">
                          <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${getRiskColor(opp.riskIfNotActing)}`}>
                            {opp.riskIfNotActing}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-center">
                          <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${getRecommendationColor(opp.investmentRecommendation)}`}>
                            {opp.investmentRecommendation}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-center">
                          <span className="text-xs font-semibold text-foreground">
                            {Math.round(opp.priorityScore * 100)}
                          </span>
                        </TableCell>
                      </TableRow>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                      <tr>
                        <td colSpan={8} className="p-0">
                          <ExpandedContent opp={opp} />
                        </td>
                      </tr>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityTable;
