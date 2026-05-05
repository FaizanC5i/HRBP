import { useState, useMemo } from 'react';
import { TrendingUp, Target, Search, ExternalLink, ChevronDown, ChevronUp, Building2, MapPin, ChevronLeft, ChevronRight, X, Info, Clock, Sparkles, Zap, AlertTriangle, Users, BarChart3, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { salesSkillsData, type SalesSkillReport } from '@/data/salesSkillsData';
import RoleExpandedDetails from '@/components/demand-sensing/RoleExpandedDetails';
import { useApprovedActionPlans } from '@/hooks/useApprovedActionPlans';

const ITEMS_PER_PAGE = 50;

type KPIType = 'postings' | 'competitors' | 'topSkill' | 'roles' | 'sources' | null;

type TimeRange = 'last30days' | 'last6months' | 'last1year' | 'last3years' | null;

type RoleClassification = 'Critical' | 'Emerging' | 'Trending' | 'Other';

interface ClassifiedRole extends SalesSkillReport {
  classification: RoleClassification;
  classificationReason: string;
  metricLabel: string;
  metricValue: string;
  isSynthetic: boolean;
}

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last6months', label: 'Last 6 Months' },
  { value: 'last1year', label: 'Last 1 Year' },
  { value: 'last3years', label: 'Last 3 Years' },
];

const DemandSensing = () => {
  // Note: Filtering by approved roles/skills is disabled on app refresh
  // Action plan filters only apply within the same session after approval
  const { actionPlans } = useApprovedActionPlans();
  
  // Get approved roles and skills from action plans
  const approvedRoles = actionPlans.flatMap(plan => plan.selectedRoles);
  const approvedSkills = actionPlans.flatMap(plan => plan.selectedSkills);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedTrending, setSelectedTrending] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedClassifications, setSelectedClassifications] = useState<RoleClassification[]>([]);
  const [sortField, setSortField] = useState<keyof SalesSkillReport>('occurrencesCount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openKPI, setOpenKPI] = useState<KPIType>(null);
  const [rolesModalFilter, setRolesModalFilter] = useState<RoleClassification | 'all'>('all');

  // Get unique values for filters
  const competitors = useMemo(() => 
    [...new Set(salesSkillsData.map(d => d.competitors))].sort(), 
  []);
  
  const sources = useMemo(() => 
    [...new Set(salesSkillsData.map(d => d.source))].sort(), 
  []);

  const trendingLevels = useMemo(() => 
    [...new Set(salesSkillsData.map(d => d.trending))], 
  []);

  const locations = useMemo(() => 
    [...new Set(salesSkillsData.map(d => d.location))].sort(), 
  []);

  const roles = useMemo(() => 
    [...new Set(salesSkillsData.map(d => d.mainRole))].sort(), 
  []);

  // Get date boundaries for time ranges
  const getDateBoundary = (range: TimeRange): Date | null => {
    if (!range) return null;
    const now = new Date();
    switch (range) {
      case 'last30days':
        return new Date(now.setDate(now.getDate() - 30));
      case 'last6months':
        return new Date(now.setMonth(now.getMonth() - 6));
      case 'last1year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      case 'last3years':
        return new Date(now.setFullYear(now.getFullYear() - 3));
      default:
        return null;
    }
  };

  // Calculate role classification based on time window
  const classifyRole = (
    item: SalesSkillReport, 
    allData: SalesSkillReport[], 
    selectedRange: TimeRange
  ): { classification: RoleClassification; reason: string; metricLabel: string; metricValue: string; isSynthetic: boolean } => {
    // Find all postings for the same role
    const rolePostings = allData.filter(d => d.mainRole === item.mainRole);
    
    // For Critical classification, exclude Microsoft postings - only count external competitor postings
    const externalRolePostings = rolePostings.filter(d => d.competitors?.toLowerCase().trim() !== 'microsoft');
    const externalOccurrences = externalRolePostings.reduce((sum, d) => sum + d.occurrencesCount, 0);
    const totalOccurrences = rolePostings.reduce((sum, d) => sum + d.occurrencesCount, 0);
    
    // Critical: High posting count from external competitors only (excludes Microsoft)
    if (externalOccurrences >= 5000 || (externalRolePostings.length > 0 && externalRolePostings.some(d => d.occurrencesCount >= 2000))) {
      return { 
        classification: 'Critical', 
        reason: `High competitor demand with ${externalOccurrences.toLocaleString()} external postings`,
        metricLabel: 'External Postings',
        metricValue: externalOccurrences.toLocaleString(),
        isSynthetic: false 
      };
    }

    // If no time range selected, use data-driven classification
    if (!selectedRange) {
      // Emerging: Lower occurrences but trending or newer roles
      if (item.occurrencesCount < 500 && item.trending !== 'Low') {
        return { 
          classification: 'Emerging', 
          reason: 'New market role with growing presence',
          metricLabel: 'Posting Velocity',
          metricValue: item.occurrencesCount.toLocaleString(),
          isSynthetic: false 
        };
      }
      
      if (item.trending === 'High' && item.occurrencesCount >= 500) {
        return { 
          classification: 'Trending', 
          reason: 'High trending status with strong posting velocity',
          metricLabel: 'Posting Velocity',
          metricValue: item.occurrencesCount.toLocaleString(),
          isSynthetic: false 
        };
      }
      
      // Also classify as Emerging for medium trending with moderate velocity
      if (item.trending === 'Medium' && item.occurrencesCount >= 100 && item.occurrencesCount < 800) {
        return { 
          classification: 'Emerging', 
          reason: 'Growing market presence with increasing demand',
          metricLabel: 'Posting Velocity',
          metricValue: item.occurrencesCount.toLocaleString(),
          isSynthetic: false 
        };
      }
      
      return { 
        classification: 'Other', 
        reason: 'Standard market presence',
        metricLabel: 'Velocity',
        metricValue: item.occurrencesCount.toLocaleString(),
        isSynthetic: false 
      };
    }

    const boundary = getDateBoundary(selectedRange);
    if (!boundary) {
      return { 
        classification: 'Other', 
        reason: 'Standard market presence',
        metricLabel: 'Velocity',
        metricValue: item.occurrencesCount.toLocaleString(),
        isSynthetic: false 
      };
    }
    
    // Count postings before and within the selected period
    const postingsBeforePeriod = rolePostings.filter(d => new Date(d.postingDate) < boundary);
    const postingsWithinPeriod = rolePostings.filter(d => new Date(d.postingDate) >= boundary);
    
    const beforeCount = postingsBeforePeriod.length;
    const withinCount = postingsWithinPeriod.length;
    const beforeOccurrences = postingsBeforePeriod.reduce((sum, d) => sum + d.occurrencesCount, 0);
    const withinOccurrences = postingsWithinPeriod.reduce((sum, d) => sum + d.occurrencesCount, 0);
    
    // Check if we have enough data to classify
    const hasHistoricalData = beforeCount > 0;
    const hasRecentData = withinCount > 0;
    
    if (!hasRecentData) {
      return { 
        classification: 'Other', 
        reason: 'No postings in selected time window',
        metricLabel: 'Recent Postings',
        metricValue: '0',
        isSynthetic: false 
      };
    }
    
    // Emerging: Little to no presence before, sudden rise within period
    if (beforeCount <= 2 && withinCount >= 1) {
      const timeLabel = TIME_RANGE_OPTIONS.find(o => o.value === selectedRange)?.label || 'period';
      return { 
        classification: 'Emerging', 
        reason: `New role appearing with ${withinCount} postings in ${timeLabel}`,
        metricLabel: `Postings (${timeLabel})`,
        metricValue: withinCount.toString(),
        isSynthetic: false 
      };
    }
    
    if (beforeOccurrences < 300 && withinOccurrences >= 100) {
      const growthPercent = beforeOccurrences > 0 
        ? Math.round(((withinOccurrences - beforeOccurrences) / beforeOccurrences) * 100)
        : 100;
      return { 
        classification: 'Emerging', 
        reason: `Posting velocity surged ${growthPercent}% in selected period`,
        metricLabel: 'Growth',
        metricValue: `+${growthPercent}%`,
        isSynthetic: false 
      };
    }
    
    // Trending: Historical presence with clear increase
    if (hasHistoricalData && beforeOccurrences > 0 && withinOccurrences > beforeOccurrences * 1.2) {
      const growthPercent = Math.round(((withinOccurrences - beforeOccurrences) / beforeOccurrences) * 100);
      return { 
        classification: 'Trending', 
        reason: `${growthPercent}% increase in posting velocity within selected period`,
        metricLabel: 'Growth',
        metricValue: `+${growthPercent}%`,
        isSynthetic: false 
      };
    }
    
    if (hasHistoricalData && item.trending === 'High') {
      return { 
        classification: 'Trending', 
        reason: 'Consistent high demand with historical market presence',
        metricLabel: 'Status',
        metricValue: 'High Demand',
        isSynthetic: false 
      };
    }
    
    // If insufficient data to determine, use synthetic estimate
    if (!hasHistoricalData && !hasRecentData) {
      return { 
        classification: 'Other', 
        reason: 'Insufficient data - classification based on trending status (synthetic)',
        metricLabel: 'Estimate',
        metricValue: 'N/A',
        isSynthetic: true 
      };
    }
    
    return { 
      classification: 'Other', 
      reason: 'Stable market presence without significant change',
      metricLabel: 'Velocity',
      metricValue: item.occurrencesCount.toLocaleString(),
      isSynthetic: false 
    };
  };

  // Filter and classify data
  const filteredData = useMemo(() => {
    let data = [...salesSkillsData];

    // Apply time range filter first
    if (selectedTimeRange) {
      const boundary = getDateBoundary(selectedTimeRange);
      if (boundary) {
        data = data.filter(item => new Date(item.postingDate) >= boundary);
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(item =>
        item.roles.toLowerCase().includes(query) ||
        item.mainRole.toLowerCase().includes(query) ||
        item.skills.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.jobDescription.toLowerCase().includes(query)
      );
    }

    if (selectedCompetitors.length > 0) {
      data = data.filter(item => selectedCompetitors.includes(item.competitors));
    }

    if (selectedSources.length > 0) {
      data = data.filter(item => selectedSources.includes(item.source));
    }

    if (selectedTrending.length > 0) {
      data = data.filter(item => selectedTrending.includes(item.trending));
    }

    if (selectedLocations.length > 0) {
      data = data.filter(item => selectedLocations.includes(item.location));
    }

    if (selectedRoles.length > 0) {
      data = data.filter(item => selectedRoles.includes(item.mainRole));
    }
    
    // Filter by approved roles OR skills from action plans (OR logic)
    // Only apply if there are approved items in current session
    console.log('Filtering - approvedRoles:', approvedRoles, 'approvedSkills:', approvedSkills);
    
    if (approvedRoles.length > 0 || approvedSkills.length > 0) {
      console.log('Applying action plan filter with', approvedRoles.length, 'roles and', approvedSkills.length, 'skills');
      data = data.filter(item => {
        // Check if role matches any approved role (exact or close partial match only)
        const matchesRole = approvedRoles.length > 0 && approvedRoles.some(approvedRole => {
          const roleLower = approvedRole.toLowerCase().trim();
          const titleLower = item.title.toLowerCase();
          const mainRoleLower = item.mainRole.toLowerCase();
          const rolesLower = item.roles.toLowerCase();
          
          // Extract key role words (removing common words)
          const roleWords = roleLower.split(/\s+/).filter(w => 
            w.length > 2 && !['the', 'and', 'for', 'with'].includes(w)
          );
          
          // Match if ALL key words from approved role appear in title/mainRole/roles
          const allWordsMatch = roleWords.length > 0 && roleWords.every(word =>
            titleLower.includes(word) || mainRoleLower.includes(word) || rolesLower.includes(word)
          );
          
          return allWordsMatch;
        });
        
        // Check if any skill matches approved skills (exact match on skill name)
        const itemSkillsList = item.skills.toLowerCase().split(',').map(s => s.trim());
        const matchesSkill = approvedSkills.length > 0 && approvedSkills.some(approvedSkill => {
          const skillLower = approvedSkill.toLowerCase().trim();
          // Check if any item skill contains the approved skill name
          return itemSkillsList.some(itemSkill => 
            itemSkill.includes(skillLower) || skillLower.includes(itemSkill)
          );
        });
        
        // OR logic: show if matches either role OR skill
        return matchesRole || matchesSkill;
      });
      console.log('Filtered data count:', data.length);
    }

    // Classify each role
    const classifiedData: ClassifiedRole[] = data.map(item => {
      const { classification, reason, metricLabel, metricValue, isSynthetic } = classifyRole(item, salesSkillsData, selectedTimeRange);
      return {
        ...item,
        classification,
        classificationReason: reason,
        metricLabel,
        metricValue,
        isSynthetic
      };
    });

    // Filter by classification if selected
    const filteredByClassification = selectedClassifications.length > 0
      ? classifiedData.filter(item => selectedClassifications.includes(item.classification))
      : classifiedData;

    filteredByClassification.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortDirection === 'asc' 
        ? aStr.localeCompare(bStr) 
        : bStr.localeCompare(aStr);
    });

    return filteredByClassification;
  }, [searchQuery, selectedCompetitors, selectedSources, selectedTrending, selectedLocations, selectedRoles, selectedTimeRange, selectedClassifications, sortField, sortDirection, approvedRoles]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCompetitors, selectedSources, selectedTrending, selectedLocations, selectedRoles, selectedTimeRange, selectedClassifications]);

  const handleSort = (field: keyof SalesSkillReport) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getClassificationBadge = (classification: RoleClassification, isSynthetic: boolean) => {
    const baseClasses = {
      'Critical': 'bg-rose-500/20 text-rose-600 border-rose-500/30',
      'Emerging': 'bg-violet-500/20 text-violet-600 border-violet-500/30',
      'Trending': 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
      'Other': 'bg-slate-500/20 text-slate-600 border-slate-500/30',
    };
    return `${baseClasses[classification]} ${isSynthetic ? 'border-dashed' : ''}`;
  };

  const getClassificationIcon = (classification: RoleClassification) => {
    switch (classification) {
      case 'Critical':
        return <AlertTriangle className="h-3 w-3" />;
      case 'Emerging':
        return <Sparkles className="h-3 w-3" />;
      case 'Trending':
        return <Zap className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getSourceBadge = (source: string) => {
    const variants: Record<string, string> = {
      'LinkedIn': 'bg-blue-500/20 text-blue-600 border-blue-500/30',
      'Glassdoor': 'bg-green-500/20 text-green-600 border-green-500/30',
      'Amazon Careers': 'bg-orange-500/20 text-orange-600 border-orange-500/30',
      'Google Careers': 'bg-red-500/20 text-red-600 border-red-500/30',
      'Deloitte': 'bg-purple-500/20 text-purple-600 border-purple-500/30',
    };
    return variants[source] || 'bg-slate-500/20 text-slate-600 border-slate-500/30';
  };

  const SortIcon = ({ field }: { field: keyof SalesSkillReport }) => {
    if (sortField !== field) return <ChevronDown className="h-3 w-3 inline ml-1 opacity-30" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-3 w-3 inline ml-1 text-primary" /> : 
      <ChevronDown className="h-3 w-3 inline ml-1 text-primary" />;
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCompetitors([]);
    setSelectedSources([]);
    setSelectedTrending([]);
    setSelectedLocations([]);
    setSelectedRoles([]);
    setSelectedClassifications([]);
    setSelectedTimeRange(null);
  };

  const classificationOptions: RoleClassification[] = ['Critical', 'Trending', 'Emerging', 'Other'];

  // Multi-select filter component
  const MultiSelectFilter = ({ 
    label, 
    options, 
    selected, 
    onSelect,
    icon: Icon
  }: { 
    label: string; 
    options: string[]; 
    selected: string[]; 
    onSelect: (values: string[]) => void;
    icon?: React.ElementType;
  }) => {
    const toggleOption = (option: string) => {
      if (selected.includes(option)) {
        onSelect(selected.filter(s => s !== option));
      } else {
        onSelect([...selected, option]);
      }
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 text-sm gap-2">
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {label}
            {selected.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {selected.length}
              </Badge>
            )}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start">
          <div className="max-h-60 overflow-y-auto space-y-1">
            {options.map(option => (
              <div
                key={option}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => toggleOption(option)}
              >
                <Checkbox checked={selected.includes(option)} />
                <span className="text-sm truncate">{option}</span>
              </div>
            ))}
          </div>
          {selected.length > 0 && (
            <div className="border-t mt-2 pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => onSelect([])}
              >
                Clear selection
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  };

  // Single-select time range filter
  const TimeRangeFilter = () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 text-sm gap-2 border-primary/50 bg-primary/5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {selectedTimeRange 
              ? TIME_RANGE_OPTIONS.find(o => o.value === selectedTimeRange)?.label 
              : 'Time Window'}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          <div className="space-y-1">
            {TIME_RANGE_OPTIONS.map(option => (
              <div
                key={option.value}
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                  selectedTimeRange === option.value 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedTimeRange(
                  selectedTimeRange === option.value ? null : option.value
                )}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedTimeRange === option.value 
                    ? 'border-primary' 
                    : 'border-muted-foreground/30'
                }`}>
                  {selectedTimeRange === option.value && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>
          {selectedTimeRange && (
            <div className="border-t mt-2 pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setSelectedTimeRange(null)}
              >
                Clear selection
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  };

  // Summary stats - meaningful KPIs
  const totalPostingsInTimeline = filteredData.reduce((sum, item) => sum + item.occurrencesCount, 0);
  
  // Total postings by competitors (excluding Microsoft)
  const totalCompetitorPostings = useMemo(() => {
    return filteredData
      .filter(d => d.competitors.toLowerCase() !== 'microsoft')
      .reduce((sum, item) => sum + item.occurrencesCount, 0);
  }, [filteredData]);
  
  // Unique competitors count for modal
  const uniqueCompetitors = useMemo(() => {
    return [...new Set(filteredData
      .filter(d => d.competitors.toLowerCase() !== 'microsoft')
      .map(d => d.competitors))].length;
  }, [filteredData]);
  
  const topSkillsData = useMemo(() => {
    const skillCounts: Record<string, number> = {};
    filteredData.forEach(item => {
      item.skills.split(', ').forEach(skill => {
        const s = skill.trim();
        if (s) skillCounts[s] = (skillCounts[s] || 0) + item.occurrencesCount;
      });
    });
    const sorted = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]);
    return {
      top3: sorted.slice(0, 3).map(([skill, count]) => ({ skill, count })),
      top10: sorted.slice(0, 10).map(([skill, count]) => ({ skill, count })),
      topCount: Math.min(sorted.length, 10) // Count of top demanded skills (up to 10)
    };
  }, [filteredData]);
  
  const top3Skills = topSkillsData.top3;
  const topSkillsCount = topSkillsData.topCount;
  const topSkill = top3Skills[0] || { skill: 'N/A', count: 0 };

  // Calculate unique roles per classification
  const roleClassifications = useMemo(() => {
    const roleData: Record<string, RoleClassification> = {};
    filteredData.forEach(item => {
      if (!roleData[item.mainRole]) {
        roleData[item.mainRole] = item.classification;
      }
      // Use the most severe classification
      if (item.classification === 'Critical') {
        roleData[item.mainRole] = 'Critical';
      } else if (item.classification === 'Emerging' && roleData[item.mainRole] !== 'Critical') {
        roleData[item.mainRole] = 'Emerging';
      } else if (item.classification === 'Trending' && roleData[item.mainRole] === 'Other') {
        roleData[item.mainRole] = 'Trending';
      }
    });
    return roleData;
  }, [filteredData]);

  const criticalCount = Object.values(roleClassifications).filter(c => c === 'Critical').length;
  const emergingCount = Object.values(roleClassifications).filter(c => c === 'Emerging').length;
  const trendingCount = Object.values(roleClassifications).filter(c => c === 'Trending').length;
  const totalRolesCount = Object.keys(roleClassifications).length;
  
  // Sources scraped calculation
  const uniqueSources = useMemo(() => [...new Set(filteredData.map(d => d.source))], [filteredData]);
  const sourcesCount = uniqueSources.length;
  
  const sourceAnalytics = useMemo(() => {
    const analytics: Record<string, { postings: number; velocity: number; roles: Set<string>; topSkills: Record<string, number> }> = {};
    filteredData.forEach(item => {
      if (!analytics[item.source]) {
        analytics[item.source] = { postings: 0, velocity: 0, roles: new Set(), topSkills: {} };
      }
      analytics[item.source].postings++;
      analytics[item.source].velocity += item.occurrencesCount;
      analytics[item.source].roles.add(item.mainRole);
      item.skills.split(', ').forEach(skill => {
        const s = skill.trim();
        analytics[item.source].topSkills[s] = (analytics[item.source].topSkills[s] || 0) + 1;
      });
    });
    return Object.entries(analytics).map(([source, data]) => ({
      source,
      postings: data.postings,
      velocity: data.velocity,
      rolesCount: data.roles.size,
      topSkill: Object.entries(data.topSkills).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    })).sort((a, b) => b.velocity - a.velocity);
  }, [filteredData]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${month} '${year}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Job Postings</h1>
        <p className="text-muted-foreground">
          Complete scraped market data from job postings and competitor analysis
        </p>
      </div>

      {/* Summary Cards - Unified KPI Design System */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Card 1: Total Posting Velocity */}
        <Card 
          className="bg-card border border-border/60 cursor-pointer hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 relative rounded-xl"
          onClick={() => setOpenKPI('postings')}
        >
          <CardContent className="p-4 h-[130px] flex flex-col">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
                    onClick={(e) => { e.stopPropagation(); setOpenKPI('postings'); }}
                  >
                    <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px] text-xs">
                  Total job postings volume across all sources. Click for detailed breakdown.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* Header: Icon + Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Total Posting<br/>Velocity</p>
            </div>
            {/* Primary Metric */}
            <p className="text-[28px] font-bold text-foreground mt-auto leading-none">{totalPostingsInTimeline.toLocaleString()}</p>
          </CardContent>
        </Card>

        {/* Card 2: Competitor Postings */}
        <Card 
          className="bg-card border border-border/60 cursor-pointer hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 relative rounded-xl"
          onClick={() => setOpenKPI('competitors')}
        >
          <CardContent className="p-4 h-[130px] flex flex-col">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
                    onClick={(e) => { e.stopPropagation(); setOpenKPI('competitors'); }}
                  >
                    <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px] text-xs">
                  Total job postings by competitors. Click for competitor breakdown.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* Header: Icon + Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10">
                <Users className="h-5 w-5 text-teal-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Competitor<br/>Postings</p>
            </div>
            {/* Primary Metric */}
            <p className="text-[28px] font-bold text-foreground mt-auto leading-none">{totalCompetitorPostings.toLocaleString()}</p>
          </CardContent>
        </Card>

        {/* Card 3: Top Demanded Skills */}
        <Card 
          className="bg-card border border-border/60 cursor-pointer hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 relative rounded-xl"
          onClick={() => setOpenKPI('topSkill')}
        >
          <CardContent className="p-4 h-[130px] flex flex-col">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
                    onClick={(e) => { e.stopPropagation(); setOpenKPI('topSkill'); }}
                  >
                    <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-xs">
                  Top 3 demanded skills in the market. Click for full rankings.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* Header: Icon + Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10">
                <Target className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Top Demanded<br/>Skills</p>
            </div>
            {/* Primary Metric - Top 3 skills with ranked badges */}
            <div className="flex flex-col gap-1 mt-auto">
              {top3Skills.slice(0, 3).map((item, idx) => (
                <div key={item.skill} className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${
                    idx === 0 ? 'bg-amber-500/20 text-amber-600' :
                    idx === 1 ? 'bg-slate-400/20 text-slate-600' :
                    'bg-orange-400/20 text-orange-600'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-xs font-medium text-foreground truncate max-w-[120px]">{item.skill}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Roles */}
        <Card 
          className="bg-card border border-border/60 cursor-pointer hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 relative rounded-xl"
          onClick={() => setOpenKPI('roles')}
        >
          <CardContent className="p-4 h-[130px] flex flex-col">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
                    onClick={(e) => { e.stopPropagation(); setOpenKPI('roles'); }}
                  >
                    <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-xs">
                  Role categories by market demand. Critical = High Posting Volume. Click for details.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* Header: Icon + Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Top Demanding Roles</p>
            </div>
            {/* Category Counts - Even spacing */}
            <div className="flex items-end justify-between mt-auto">
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-[22px] font-bold text-rose-500 leading-none">{criticalCount}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Critical</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[22px] font-bold text-emerald-500 leading-none">{trendingCount}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Trending</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                  <span className="text-[22px] font-bold text-violet-500 leading-none">{emergingCount}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Emerging</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Sources Scraped */}
        <Card 
          className="bg-card border border-border/60 cursor-pointer hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 relative rounded-xl"
          onClick={() => setOpenKPI('sources')}
        >
          <CardContent className="p-4 h-[130px] flex flex-col">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
                    onClick={(e) => { e.stopPropagation(); setOpenKPI('sources'); }}
                  >
                    <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-xs">
                  Data sources scraped for market intelligence. Click for source breakdown.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* Header: Icon + Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10">
                <Database className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Sources<br/>Scraped</p>
            </div>
            {/* Primary Metric */}
            <p className="text-[28px] font-bold text-foreground leading-none mt-1">{sourcesCount}</p>
            {/* Source Tags - Unified chip style */}
            <div className="flex items-center gap-1.5 mt-2">
              {uniqueSources.slice(0, 2).map((src) => (
                <span key={src} className="text-[8px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                  {src.length > 8 ? src.slice(0, 8) + '..' : src}
                </span>
              ))}
              {uniqueSources.length > 2 && (
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 font-medium">
                  +{uniqueSources.length - 2}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Modals with Enhanced Diagnostics */}
      <Dialog open={openKPI === 'postings'} onOpenChange={() => setOpenKPI(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
              Total Posting Velocity
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Total job postings volume across all sources within a time period. This metric represents the cumulative hiring activity detected from scraped job portals and career pages.
              </p>
            </div>
            <div className="text-3xl font-bold text-blue-500">{totalPostingsInTimeline.toLocaleString()}</div>
            
            {/* Top Roles by Velocity */}
            <div className="space-y-3">
              <p className="font-medium text-foreground text-sm">Top Roles by Posting Velocity</p>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs font-medium">Role</TableHead>
                      <TableHead className="text-xs font-medium text-right">Velocity</TableHead>
                      <TableHead className="text-xs font-medium">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const roleVelocity: Record<string, { total: number; trending: string; classification: RoleClassification }> = {};
                      filteredData.forEach(item => {
                        if (!roleVelocity[item.mainRole]) {
                          roleVelocity[item.mainRole] = { total: 0, trending: item.trending, classification: item.classification };
                        }
                        roleVelocity[item.mainRole].total += item.occurrencesCount;
                      });
                      return Object.entries(roleVelocity)
                        .sort((a, b) => b[1].total - a[1].total)
                        .slice(0, 5)
                        .map(([role, data]) => (
                          <TableRow key={role}>
                            <TableCell className="text-xs font-medium">{role}</TableCell>
                            <TableCell className="text-xs text-right font-bold">{data.total.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge className={getClassificationBadge(data.classification, false)} variant="outline">
                                {data.classification}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ));
                    })()}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Source Breakdown */}
            <div className="space-y-3">
              <p className="font-medium text-foreground text-sm">Top Data Sources</p>
              <div className="grid grid-cols-2 gap-2">
                {(() => {
                  const sourceBreakdown: Record<string, number> = {};
                  filteredData.forEach(item => {
                    sourceBreakdown[item.source] = (sourceBreakdown[item.source] || 0) + item.occurrencesCount;
                  });
                  return Object.entries(sourceBreakdown)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([source, count]) => (
                      <div key={source} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <span className="text-xs">{source}</span>
                        <span className="text-xs font-bold text-blue-600">{count.toLocaleString()}</span>
                      </div>
                    ));
                })()}
              </div>
            </div>

            {/* Summary */}
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <span className="font-medium">Summary:</span> {filteredData.filter(d => d.classification === 'Critical').length > 0 
                  ? `${filteredData.filter(d => d.classification === 'Critical').length} critical roles with high demand detected. Focus workforce planning on these positions.`
                  : 'Posting velocity indicates stable market demand across roles.'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openKPI === 'competitors'} onOpenChange={() => setOpenKPI(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Users className="h-5 w-5 text-emerald-500" />
              </div>
              Competitors Hiring Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unique competitor companies actively hiring in the market. Excludes internal organization to focus on external market intelligence.
              </p>
            </div>
            <div className="text-3xl font-bold text-emerald-500">{uniqueCompetitors} Companies</div>
            
            {/* Competitor Matrix */}
            <div className="space-y-3">
              <p className="font-medium text-foreground text-sm">Competitor Hiring Matrix</p>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs font-medium">Competitor</TableHead>
                      <TableHead className="text-xs font-medium text-right">Total Postings</TableHead>
                      <TableHead className="text-xs font-medium">Demand Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const competitorData: Record<string, { total: number; roles: Set<string>; highTrending: number }> = {};
                      filteredData
                        .filter(item => item.competitors.toLowerCase() !== 'microsoft')
                        .forEach(item => {
                          if (!competitorData[item.competitors]) {
                            competitorData[item.competitors] = { total: 0, roles: new Set(), highTrending: 0 };
                          }
                          competitorData[item.competitors].total += item.occurrencesCount;
                          competitorData[item.competitors].roles.add(item.mainRole);
                          if (item.trending === 'High') competitorData[item.competitors].highTrending++;
                        });
                      return Object.entries(competitorData)
                        .sort((a, b) => b[1].total - a[1].total)
                        .map(([competitor, data]) => {
                          const demandLevel = data.total > 15000 ? 'Aggressive' : data.total > 5000 ? 'Moderate' : 'Standard';
                          const demandColor = data.total > 15000 ? 'text-rose-600 bg-rose-100 dark:bg-rose-900/30' : 
                            data.total > 5000 ? 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' : 'text-slate-600 bg-slate-100 dark:bg-slate-900/30';
                          return (
                            <TableRow key={competitor}>
                              <TableCell className="text-xs font-medium">{competitor}</TableCell>
                              <TableCell className="text-xs text-right font-bold">{data.total.toLocaleString()}</TableCell>
                              <TableCell>
                                <span className={`text-xs px-2 py-1 rounded-full ${demandColor}`}>
                                  {demandLevel} ({data.roles.size} roles)
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        });
                    })()}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Insight */}
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                <span className="font-medium">Market Insight:</span> {(() => {
                  const competitorCounts: Record<string, number> = {};
                  filteredData
                    .filter(item => item.competitors.toLowerCase() !== 'microsoft')
                    .forEach(item => {
                      competitorCounts[item.competitors] = (competitorCounts[item.competitors] || 0) + item.occurrencesCount;
                    });
                  const sorted = Object.entries(competitorCounts).sort((a, b) => b[1] - a[1]);
                  const topCompetitor = sorted[0];
                  return topCompetitor 
                    ? `${topCompetitor[0]} leads with ${topCompetitor[1].toLocaleString()} postings, indicating strong expansion strategy.`
                    : 'No competitor data available.';
                })()}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openKPI === 'topSkill'} onOpenChange={() => setOpenKPI(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Target className="h-5 w-5 text-purple-500" />
              </div>
              Skills Demand Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Top demanded skills identified from job posting requirements. These skills appear most frequently across all scraped positions.
              </p>
            </div>
            
            {/* Top 3 Skills Highlight */}
            <div className="grid grid-cols-3 gap-3">
              {top3Skills.map((item, idx) => (
                <div 
                  key={item.skill}
                  className={`p-4 rounded-lg text-center border ${
                    idx === 0 
                      ? 'bg-purple-500/10 border-purple-500/30' 
                      : idx === 1 
                        ? 'bg-purple-400/10 border-purple-400/30' 
                        : 'bg-purple-300/10 border-purple-300/30'
                  }`}
                >
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center font-bold text-sm ${
                    idx === 0 
                      ? 'bg-purple-500 text-white' 
                      : idx === 1 
                        ? 'bg-purple-400 text-white' 
                        : 'bg-purple-300 text-purple-800'
                  }`}>
                    {idx + 1}
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate" title={item.skill}>
                    {item.skill}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.count.toLocaleString()} postings
                  </p>
                </div>
              ))}
            </div>
            
            {/* Top Skills Table */}
            <div className="space-y-3">
              <p className="font-medium text-foreground text-sm">Top 15 In-Demand Skills</p>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs font-medium w-8">#</TableHead>
                      <TableHead className="text-xs font-medium">Skill</TableHead>
                      <TableHead className="text-xs font-medium text-right">Demand Score</TableHead>
                      <TableHead className="text-xs font-medium text-right">% of Total</TableHead>
                      <TableHead className="text-xs font-medium w-24">Demand</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const skillCounts: Record<string, number> = {};
                      filteredData.forEach(item => {
                        item.skills.split(', ').forEach(skill => {
                          const s = skill.trim();
                          if (s) skillCounts[s] = (skillCounts[s] || 0) + item.occurrencesCount;
                        });
                      });
                      const total = Object.values(skillCounts).reduce((a, b) => a + b, 0);
                      const maxCount = Math.max(...Object.values(skillCounts));
                      return Object.entries(skillCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 15)
                        .map(([skill, count], idx) => (
                          <TableRow key={skill} className={idx < 3 ? 'bg-purple-50/50 dark:bg-purple-950/20' : ''}>
                            <TableCell className="text-xs">
                              <span className={`w-5 h-5 inline-flex items-center justify-center rounded-full text-[10px] font-bold ${
                                idx === 0 ? 'bg-purple-500 text-white' : 
                                idx === 1 ? 'bg-purple-400 text-white' : 
                                idx === 2 ? 'bg-purple-300 text-purple-800' : 
                                'text-muted-foreground'
                              }`}>
                                {idx + 1}
                              </span>
                            </TableCell>
                            <TableCell className={`text-xs ${idx < 3 ? 'font-semibold' : 'font-medium'}`}>{skill}</TableCell>
                            <TableCell className="text-xs text-right font-bold text-purple-600">{count.toLocaleString()}</TableCell>
                            <TableCell className="text-xs text-right text-muted-foreground">
                              {((count / total) * 100).toFixed(1)}%
                            </TableCell>
                            <TableCell>
                              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-purple-500 rounded-full" 
                                  style={{ width: `${(count / maxCount) * 100}%` }}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ));
                    })()}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Insight */}
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <p className="text-xs text-purple-700 dark:text-purple-300">
                <span className="font-medium">Training Priority:</span> Focus upskilling programs on {top3Skills.map(s => s.skill).join(', ')} to address market demand gaps.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openKPI === 'roles'} onOpenChange={() => { setOpenKPI(null); setRolesModalFilter('all'); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              Roles Classification Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unique role classifications based on posting velocity and market demand. <span className="font-medium">Critical = High Posting Volume from Competitors.</span> Trending and Emerging roles identified from hiring patterns.
              </p>
            </div>
            
            {/* Classification Breakdown - Clickable Filter Cards */}
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setRolesModalFilter(rolesModalFilter === 'Critical' ? 'all' : 'Critical')}
                className={`p-4 rounded-lg border text-center transition-all ${
                  rolesModalFilter === 'Critical' 
                    ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-500 ring-2 ring-rose-500/30' 
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 hover:border-rose-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  <span className="text-sm font-medium text-rose-600">Critical</span>
                </div>
                <p className="text-2xl font-bold text-rose-500">{criticalCount}</p>
                <p className="text-[10px] text-muted-foreground mt-1">High Posting Volume</p>
              </button>
              <button 
                onClick={() => setRolesModalFilter(rolesModalFilter === 'Trending' ? 'all' : 'Trending')}
                className={`p-4 rounded-lg border text-center transition-all ${
                  rolesModalFilter === 'Trending' 
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500 ring-2 ring-emerald-500/30' 
                    : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-600">Trending</span>
                </div>
                <p className="text-2xl font-bold text-emerald-500">{trendingCount}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Growing demand</p>
              </button>
              <button 
                onClick={() => setRolesModalFilter(rolesModalFilter === 'Emerging' ? 'all' : 'Emerging')}
                className={`p-4 rounded-lg border text-center transition-all ${
                  rolesModalFilter === 'Emerging' 
                    ? 'bg-violet-100 dark:bg-violet-900/50 border-violet-500 ring-2 ring-violet-500/30' 
                    : 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800 hover:border-violet-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  <span className="text-sm font-medium text-violet-600">Emerging</span>
                </div>
                <p className="text-2xl font-bold text-violet-500">{emergingCount}</p>
                <p className="text-[10px] text-muted-foreground mt-1">New in market</p>
              </button>
            </div>

            {/* Active Filter Indicator */}
            {rolesModalFilter !== 'all' && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Filtering: {rolesModalFilter}
                </Badge>
                <button 
                  onClick={() => setRolesModalFilter('all')}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Clear filter
                </button>
              </div>
            )}

            {/* Roles by Classification Table */}
            <div className="space-y-3">
              <p className="font-medium text-foreground text-sm">
                {rolesModalFilter === 'all' ? 'Top Roles by Classification' : `${rolesModalFilter} Roles`}
              </p>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs font-medium">Role</TableHead>
                      <TableHead className="text-xs font-medium">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                              Classification
                              <ChevronDown className="h-3 w-3" />
                              {rolesModalFilter !== 'all' && (
                                <span className="ml-1 w-1.5 h-1.5 rounded-full bg-orange-500" />
                              )}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-2" align="start">
                            <div className="space-y-1">
                              <button
                                onClick={() => setRolesModalFilter('all')}
                                className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors ${rolesModalFilter === 'all' ? 'bg-muted font-medium' : ''}`}
                              >
                                All Classifications
                              </button>
                              <button
                                onClick={() => setRolesModalFilter('Critical')}
                                className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors flex items-center gap-2 ${rolesModalFilter === 'Critical' ? 'bg-muted font-medium' : ''}`}
                              >
                                <div className="w-2 h-2 rounded-full bg-rose-500" />
                                Critical
                              </button>
                              <button
                                onClick={() => setRolesModalFilter('Trending')}
                                className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors flex items-center gap-2 ${rolesModalFilter === 'Trending' ? 'bg-muted font-medium' : ''}`}
                              >
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                Trending
                              </button>
                              <button
                                onClick={() => setRolesModalFilter('Emerging')}
                                className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors flex items-center gap-2 ${rolesModalFilter === 'Emerging' ? 'bg-muted font-medium' : ''}`}
                              >
                                <div className="w-2 h-2 rounded-full bg-violet-500" />
                                Emerging
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      <TableHead className="text-xs font-medium text-right">Velocity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const roleData: Record<string, { total: number; classification: RoleClassification }> = {};
                      filteredData.forEach(item => {
                        if (!roleData[item.mainRole]) {
                          roleData[item.mainRole] = { total: 0, classification: item.classification };
                        }
                        roleData[item.mainRole].total += item.occurrencesCount;
                        // Use the most severe classification
                        if (item.classification === 'Critical') {
                          roleData[item.mainRole].classification = 'Critical';
                        } else if (item.classification === 'Emerging' && roleData[item.mainRole].classification !== 'Critical') {
                          roleData[item.mainRole].classification = 'Emerging';
                        } else if (item.classification === 'Trending' && roleData[item.mainRole].classification === 'Other') {
                          roleData[item.mainRole].classification = 'Trending';
                        }
                      });
                      return Object.entries(roleData)
                        .filter(([_, data]) => rolesModalFilter === 'all' || data.classification === rolesModalFilter)
                        .sort((a, b) => b[1].total - a[1].total)
                        .slice(0, 15)
                        .map(([role, data]) => (
                          <TableRow key={role}>
                            <TableCell className="text-xs font-medium">{role}</TableCell>
                            <TableCell>
                              <Badge className={getClassificationBadge(data.classification, false)} variant="outline">
                                {getClassificationIcon(data.classification)}
                                <span className="ml-1">{data.classification}</span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-right font-bold">{data.total.toLocaleString()}</TableCell>
                          </TableRow>
                        ));
                    })()}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Insight */}
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
              <p className="text-xs text-orange-700 dark:text-orange-300">
                <span className="font-medium">Summary:</span> {criticalCount > 0 
                  ? `${criticalCount} critical roles (high competitor posting volume) require immediate attention. Focus workforce planning on these high-demand positions.`
                  : trendingCount > 0 
                    ? `${trendingCount} trending roles showing growth. Consider proactive skill development in these areas.`
                    : 'Market demand is distributed across multiple roles with stable patterns.'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sources Scraped Modal */}
      <Dialog open={openKPI === 'sources'} onOpenChange={() => setOpenKPI(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Database className="h-5 w-5 text-cyan-500" />
              </div>
              Sources Scraped Analytics
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unique data sources from which job postings were scraped. Includes major job portals, company career pages, and industry-specific platforms.
              </p>
            </div>
            <div className="text-3xl font-bold text-cyan-500">{sourcesCount} Data Sources</div>
            
            {/* Source Overview Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 text-center">
                <p className="text-2xl font-bold text-cyan-600">{filteredData.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Records</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-center">
                <p className="text-2xl font-bold text-blue-600">{totalPostingsInTimeline.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Velocity</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-center">
                <p className="text-2xl font-bold text-purple-600">{totalRolesCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Unique Roles</p>
              </div>
            </div>

            {/* Source Analytics Table */}
            <div className="space-y-3">
              <p className="font-medium text-foreground text-sm">Source-by-Source Analytics</p>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs font-medium">Source</TableHead>
                      <TableHead className="text-xs font-medium text-right">Postings</TableHead>
                      <TableHead className="text-xs font-medium text-right">Velocity</TableHead>
                      <TableHead className="text-xs font-medium text-right">Roles</TableHead>
                      <TableHead className="text-xs font-medium">Top Skill</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sourceAnalytics.map((src) => (
                      <TableRow key={src.source}>
                        <TableCell>
                          <Badge className={`${getSourceBadge(src.source)} text-xs`}>
                            {src.source}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-right">{src.postings.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-right font-bold">{src.velocity.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-right">{src.rolesCount}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{src.topSkill}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Key Insights */}
            <div className="space-y-3">
              <p className="font-medium text-foreground text-sm">Key Insights from Scraped Data</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-xs font-medium text-foreground mb-1">📊 Highest Velocity Source</p>
                  <p className="text-sm font-bold text-cyan-600">{sourceAnalytics[0]?.source || 'N/A'}</p>
                  <p className="text-[10px] text-muted-foreground">{sourceAnalytics[0]?.velocity.toLocaleString() || 0} total velocity</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-xs font-medium text-foreground mb-1">📋 Most Roles Covered</p>
                  <p className="text-sm font-bold text-blue-600">
                    {sourceAnalytics.sort((a, b) => b.rolesCount - a.rolesCount)[0]?.source || 'N/A'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {sourceAnalytics.sort((a, b) => b.rolesCount - a.rolesCount)[0]?.rolesCount || 0} unique roles
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-xs font-medium text-foreground mb-1">🎯 Data Coverage</p>
                  <p className="text-sm font-bold text-purple-600">{Math.round((filteredData.length / 705) * 100)}%</p>
                  <p className="text-[10px] text-muted-foreground">of total dataset in current view</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-xs font-medium text-foreground mb-1">🔥 Most Active Platform</p>
                  <p className="text-sm font-bold text-orange-600">
                    {sourceAnalytics.sort((a, b) => b.postings - a.postings)[0]?.source || 'N/A'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {sourceAnalytics.sort((a, b) => b.postings - a.postings)[0]?.postings || 0} job postings
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800">
              <p className="text-xs text-cyan-700 dark:text-cyan-300">
                <span className="font-medium">Summary:</span> Data scraped from {sourcesCount} sources covering {totalRolesCount} unique roles. 
                {sourceAnalytics[0] && ` ${sourceAnalytics[0].source} leads with ${sourceAnalytics[0].velocity.toLocaleString()} posting velocity.`}
                {' '}This provides comprehensive market coverage for demand sensing and workforce planning.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Classification Legend */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-medium text-muted-foreground">Classification:</span>
            <div className="flex items-center gap-2">
              <Badge className="bg-rose-500/20 text-rose-600 border-rose-500/30 gap-1">
                <AlertTriangle className="h-3 w-3" />
                Critical
              </Badge>
              <span className="text-xs text-muted-foreground">High Posting Volume from Competitors</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-violet-500/20 text-violet-600 border-violet-500/30 gap-1">
                <Sparkles className="h-3 w-3" />
                Emerging
              </Badge>
              <span className="text-xs text-muted-foreground">New roles with sudden rise</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30 gap-1">
                <Zap className="h-3 w-3" />
                Trending
              </Badge>
              <span className="text-xs text-muted-foreground">Historical roles with increased demand</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Scraped Sales Skills Data
          </CardTitle>
          
          {/* Filters */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by role, title, skills, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <TimeRangeFilter />
              
              <Button variant="outline" onClick={resetFilters} size="sm" className="h-9">
                Reset Filters
              </Button>
            </div>
            
            {/* Active filters display */}
            {(selectedTimeRange || selectedCompetitors.length > 0 || selectedLocations.length > 0 || selectedSources.length > 0 || selectedRoles.length > 0 || selectedTrending.length > 0) && (
              <div className="flex flex-wrap gap-1.5">
                {selectedTimeRange && (
                  <Badge 
                    variant="secondary" 
                    className="gap-1 cursor-pointer hover:bg-destructive/20"
                    onClick={() => setSelectedTimeRange(null)}
                  >
                    <Clock className="h-3 w-3" />
                    {TIME_RANGE_OPTIONS.find(o => o.value === selectedTimeRange)?.label}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                {selectedCompetitors.map(comp => (
                  <Badge 
                    key={comp} 
                    variant="secondary" 
                    className="gap-1 cursor-pointer hover:bg-destructive/20"
                    onClick={() => setSelectedCompetitors(selectedCompetitors.filter(c => c !== comp))}
                  >
                    {comp}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
                {selectedLocations.map(loc => (
                  <Badge 
                    key={loc} 
                    variant="secondary" 
                    className="gap-1 cursor-pointer hover:bg-destructive/20"
                    onClick={() => setSelectedLocations(selectedLocations.filter(l => l !== loc))}
                  >
                    {loc}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
                {selectedSources.map(source => (
                  <Badge 
                    key={source} 
                    variant="secondary" 
                    className="gap-1 cursor-pointer hover:bg-destructive/20"
                    onClick={() => setSelectedSources(selectedSources.filter(s => s !== source))}
                  >
                    {source}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
                {selectedRoles.map(role => (
                  <Badge 
                    key={role} 
                    variant="secondary" 
                    className="gap-1 cursor-pointer hover:bg-destructive/20"
                    onClick={() => setSelectedRoles(selectedRoles.filter(r => r !== role))}
                  >
                    {role}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
                {selectedTrending.map(trend => (
                  <Badge 
                    key={trend} 
                    variant="secondary" 
                    className="gap-1 cursor-pointer hover:bg-destructive/20"
                    onClick={() => setSelectedTrending(selectedTrending.filter(t => t !== trend))}
                  >
                    {trend}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[50px] text-center font-semibold">#</TableHead>
                    <TableHead className="font-semibold min-w-[220px]">
                      <div className="flex items-center gap-1">
                        <span 
                          className="cursor-pointer hover:text-primary"
                          onClick={() => handleSort('title')}
                        >
                          Job Title
                        </span>
                        <SortIcon field="title" />
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold min-w-[140px]">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-auto p-0 font-semibold hover:bg-transparent gap-1">
                            Role Category
                            {selectedRoles.length > 0 && (
                              <Badge variant="secondary" className="ml-1 px-1 py-0 text-[10px]">{selectedRoles.length}</Badge>
                            )}
                            <ChevronDown className="h-3 w-3 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-2 z-50 bg-white dark:bg-gray-800" align="start">
                          <div className="max-h-60 overflow-y-auto space-y-1">
                            {roles.map(role => (
                              <div
                                key={role}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                                onClick={() => setSelectedRoles(
                                  selectedRoles.includes(role) 
                                    ? selectedRoles.filter(r => r !== role) 
                                    : [...selectedRoles, role]
                                )}
                              >
                                <Checkbox checked={selectedRoles.includes(role)} />
                                <span className="text-sm truncate">{role}</span>
                              </div>
                            ))}
                          </div>
                          {selectedRoles.length > 0 && (
                            <div className="border-t mt-2 pt-2">
                              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setSelectedRoles([])}>
                                Clear
                              </Button>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                    <TableHead className="font-semibold min-w-[100px]">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-auto p-0 font-semibold hover:bg-transparent gap-1">
                            Company
                            {selectedCompetitors.length > 0 && (
                              <Badge variant="secondary" className="ml-1 px-1 py-0 text-[10px]">{selectedCompetitors.length}</Badge>
                            )}
                            <ChevronDown className="h-3 w-3 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-2 z-50 bg-white dark:bg-gray-800" align="start">
                          <div className="max-h-60 overflow-y-auto space-y-1">
                            {competitors.map(comp => (
                              <div
                                key={comp}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                                onClick={() => setSelectedCompetitors(
                                  selectedCompetitors.includes(comp) 
                                    ? selectedCompetitors.filter(c => c !== comp) 
                                    : [...selectedCompetitors, comp]
                                )}
                              >
                                <Checkbox checked={selectedCompetitors.includes(comp)} />
                                <span className="text-sm truncate">{comp}</span>
                              </div>
                            ))}
                          </div>
                          {selectedCompetitors.length > 0 && (
                            <div className="border-t mt-2 pt-2">
                              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setSelectedCompetitors([])}>
                                Clear
                              </Button>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                    <TableHead className="font-semibold min-w-[100px]">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-auto p-0 font-semibold hover:bg-transparent gap-1">
                            Location
                            {selectedLocations.length > 0 && (
                              <Badge variant="secondary" className="ml-1 px-1 py-0 text-[10px]">{selectedLocations.length}</Badge>
                            )}
                            <ChevronDown className="h-3 w-3 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-2 z-50 bg-white dark:bg-gray-800" align="start">
                          <div className="max-h-60 overflow-y-auto space-y-1">
                            {locations.map(loc => (
                              <div
                                key={loc}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                                onClick={() => setSelectedLocations(
                                  selectedLocations.includes(loc) 
                                    ? selectedLocations.filter(l => l !== loc) 
                                    : [...selectedLocations, loc]
                                )}
                              >
                                <Checkbox checked={selectedLocations.includes(loc)} />
                                <span className="text-sm truncate">{loc}</span>
                              </div>
                            ))}
                          </div>
                          {selectedLocations.length > 0 && (
                            <div className="border-t mt-2 pt-2">
                              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setSelectedLocations([])}>
                                Clear
                              </Button>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted transition-colors font-semibold text-center min-w-[80px]"
                      onClick={() => handleSort('occurrencesCount')}
                    >
                      Velocity <SortIcon field="occurrencesCount" />
                    </TableHead>
                    <TableHead className="font-semibold min-w-[120px]">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-auto p-0 font-semibold hover:bg-transparent gap-1">
                            Classification
                            {selectedClassifications.length > 0 && (
                              <Badge variant="secondary" className="ml-1 px-1 py-0 text-[10px]">{selectedClassifications.length}</Badge>
                            )}
                            <ChevronDown className="h-3 w-3 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2 z-50 bg-white dark:bg-gray-800" align="start">
                          <div className="space-y-1">
                            {classificationOptions.map(cls => (
                              <div
                                key={cls}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                                onClick={() => setSelectedClassifications(
                                  selectedClassifications.includes(cls) 
                                    ? selectedClassifications.filter(c => c !== cls) 
                                    : [...selectedClassifications, cls]
                                )}
                              >
                                <Checkbox checked={selectedClassifications.includes(cls)} />
                                <Badge className={`${getClassificationBadge(cls, false)} text-xs`}>{cls}</Badge>
                              </div>
                            ))}
                          </div>
                          {selectedClassifications.length > 0 && (
                            <div className="border-t mt-2 pt-2">
                              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setSelectedClassifications([])}>
                                Clear
                              </Button>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                    <TableHead className="font-semibold min-w-[100px]">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-auto p-0 font-semibold hover:bg-transparent gap-1">
                            Source
                            {selectedSources.length > 0 && (
                              <Badge variant="secondary" className="ml-1 px-1 py-0 text-[10px]">{selectedSources.length}</Badge>
                            )}
                            <ChevronDown className="h-3 w-3 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-2 z-50 bg-white dark:bg-gray-800" align="start">
                          <div className="max-h-60 overflow-y-auto space-y-1">
                            {sources.map(source => (
                              <div
                                key={source}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                                onClick={() => setSelectedSources(
                                  selectedSources.includes(source) 
                                    ? selectedSources.filter(s => s !== source) 
                                    : [...selectedSources, source]
                                )}
                              >
                                <Checkbox checked={selectedSources.includes(source)} />
                                <span className="text-sm truncate">{source}</span>
                              </div>
                            ))}
                          </div>
                          {selectedSources.length > 0 && (
                            <div className="border-t mt-2 pt-2">
                              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setSelectedSources([])}>
                                Clear
                              </Button>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                    <TableHead className="font-semibold text-center w-[60px]">Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item, index) => {
                    const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                    return (
                    <>
                      <TableRow 
                        key={globalIndex} 
                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => setExpandedRow(expandedRow === globalIndex ? null : globalIndex)}
                      >
                        <TableCell className="text-center text-muted-foreground text-sm align-middle">
                          {globalIndex + 1}
                        </TableCell>
                        <TableCell className="align-middle">
                          <div className="space-y-1.5">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <p className="font-medium text-primary text-sm line-clamp-2 max-w-[200px] hover:underline">
                                    {item.title}
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[400px]">
                                  <p className="text-sm">{item.title}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal text-muted-foreground bg-muted/50">
                              {formatDate(item.postingDate)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="align-middle">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 font-normal text-xs whitespace-normal text-left leading-tight">
                            {item.mainRole}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-middle">
                          <span className="text-sm font-medium">{item.competitors}</span>
                        </TableCell>
                        <TableCell className="align-middle">
                          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-muted-foreground font-normal gap-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate max-w-[80px]">{item.location}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center align-middle">
                          <span className="font-bold text-foreground text-sm">
                            {item.occurrencesCount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="align-middle">
                          <div className="space-y-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge className={`gap-1 ${getClassificationBadge(item.classification, item.isSynthetic)}`}>
                                    {getClassificationIcon(item.classification)}
                                    {item.classification}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[300px]">
                                  <p className="text-sm font-medium mb-1">{item.classificationReason}</p>
                                  {item.isSynthetic && (
                                    <p className="text-xs text-amber-500">⚠️ Synthetic estimate</p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <p className="text-[10px] text-muted-foreground">
                              {item.metricLabel}: <span className="font-medium text-foreground">{item.metricValue}</span>
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="align-middle">
                          <Badge className={`${getSourceBadge(item.source)} text-xs`}>
                            {item.source}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center align-middle">
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-primary/10 text-primary transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </TableCell>
                      </TableRow>
                      {expandedRow === globalIndex && (
                        <TableRow key={`expanded-${globalIndex}`}>
                          <TableCell colSpan={9} className="p-0 bg-muted/20">
                            <div className="p-4">
                              {/* Insight Banner */}
                              <div className={`mb-4 p-3 rounded-lg border ${
                                item.classification === 'Critical' 
                                  ? 'bg-rose-500/10 border-rose-500/30' 
                                  : item.classification === 'Emerging'
                                  ? 'bg-violet-500/10 border-violet-500/30'
                                  : item.classification === 'Trending'
                                  ? 'bg-emerald-500/10 border-emerald-500/30'
                                  : 'bg-muted/50 border-border'
                              }`}>
                                <div className="flex items-start gap-2">
                                  {getClassificationIcon(item.classification)}
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{item.classificationReason}</p>
                                    {item.isSynthetic && (
                                      <p className="text-xs text-amber-600 mt-1">⚠️ This classification uses synthetic data due to insufficient historical records.</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <RoleExpandedDetails item={item} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-9"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Reset all filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DemandSensing;