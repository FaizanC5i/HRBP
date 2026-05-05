import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ChevronRight,
  Briefcase,
  Filter,
  Users,
  AlertTriangle,
  Flame,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useDepartment } from '@/contexts/DepartmentContext';
import { getDepartmentData } from '@/data/departmentData';
import { salesSkillsData } from '@/data/salesSkillsData';
import { useApprovedActionPlans } from '@/hooks/useApprovedActionPlans';

// Types
interface RoleMetrics {
  hires: number;
  bucket: 'Critical' | 'Trending' | 'Emerging';
  growthRate: number;
  trendingStatus: string;
  recencyScore: number;
}

interface RoleOpportunity {
  id: string;
  name: string;
  metrics: RoleMetrics;
}

// Calculate role metrics from scraped data
const calculateRoleMetricsFromScrapedData = (): Map<string, RoleMetrics> => {
  const roleMetricsMap = new Map<string, RoleMetrics>();
  
  // Aggregate data by mainRole
  const roleAggregates = new Map<string, {
    totalHires: number;
    externalHires: number; // Excludes Microsoft postings
    trendingStatuses: string[];
    postingDates: string[];
    occurrences: number[];
  }>();

  salesSkillsData.forEach(entry => {
    const role = entry.mainRole;
    const isMicrosoft = entry.competitors?.toLowerCase().trim() === 'microsoft';
    const existing = roleAggregates.get(role) || {
      totalHires: 0,
      externalHires: 0,
      trendingStatuses: [],
      postingDates: [],
      occurrences: []
    };
    
    existing.totalHires += entry.occurrencesCount;
    if (!isMicrosoft) {
      existing.externalHires += entry.occurrencesCount;
    }
    existing.trendingStatuses.push(entry.trending);
    existing.postingDates.push(entry.postingDate);
    existing.occurrences.push(entry.occurrencesCount);
    
    roleAggregates.set(role, existing);
  });

  // Calculate metrics for each role
  const now = new Date();
  // For Critical classification, use external hires only (excludes Microsoft)
  const allExternalHires = Array.from(roleAggregates.values()).map(r => r.externalHires);
  const sortedExternalHires = [...allExternalHires].sort((a, b) => b - a);
  const totalRoles = sortedExternalHires.length;
  
  // Sort by external hires for bucket assignment (Critical requires external demand)
  const roleEntries = Array.from(roleAggregates.entries());
  roleEntries.sort((a, b) => b[1].externalHires - a[1].externalHires);
  
  const criticalCount = Math.ceil(totalRoles * 0.3);
  const trendingCount = Math.ceil(totalRoles * 0.4);
  
  roleEntries.forEach((entry, index) => {
    const [roleName, data] = entry;
    
    // Calculate recency score (more recent = higher score)
    const dates = data.postingDates.map(d => new Date(d));
    const mostRecentDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const daysSincePosting = Math.floor((now.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));
    const recencyScore = Math.max(0, 100 - daysSincePosting);

    // Count trending statuses
    const highTrendingCount = data.trendingStatuses.filter(t => t === 'High').length;
    const mediumTrendingCount = data.trendingStatuses.filter(t => t === 'Medium').length;

    // Calculate growth rate
    const maxExternalHires = sortedExternalHires[0] || 1;
    const hiresRatio = data.externalHires / maxExternalHires;
    const trendingRatio = (highTrendingCount * 2 + mediumTrendingCount) / (data.trendingStatuses.length * 2);
    const growthRate = Math.round((hiresRatio * 25 + trendingRatio * 25 + (recencyScore / 100) * 10) - 5);

    // Assign bucket based on external hires - Critical only if there's external demand
    let bucket: 'Critical' | 'Trending' | 'Emerging';
    if (data.externalHires > 0 && index < criticalCount) {
      bucket = 'Critical';
    } else if (index < criticalCount + trendingCount) {
      bucket = 'Trending';
    } else {
      bucket = 'Emerging';
    }

    const dominantTrending = highTrendingCount >= mediumTrendingCount 
      ? (highTrendingCount > 0 ? 'High' : 'Low')
      : 'Medium';

    roleMetricsMap.set(roleName, {
      hires: data.totalHires,
      bucket,
      growthRate,
      trendingStatus: dominantTrending,
      recencyScore
    });
  });

  return roleMetricsMap;
};

const TrendingRolesWithBuckets = () => {
  const navigate = useNavigate();
  const { selectedDepartment } = useDepartment();
  const departmentData = getDepartmentData(selectedDepartment);
  const { getApprovedRoles, getApprovedSkills } = useApprovedActionPlans();
  
  const [bucketFilter, setBucketFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  const approvedRoles = getApprovedRoles();
  const approvedSkills = getApprovedSkills();
  
  // Get real metrics from scraped data for Sales department
  const scrapedMetrics = useMemo(() => calculateRoleMetricsFromScrapedData(), []);
  
  const opportunities = useMemo(() => {
    if (selectedDepartment === 'Sales') {
      // Use real scraped data for Sales
      const rolesFromScraped: RoleOpportunity[] = [];
      scrapedMetrics.forEach((metrics, roleName) => {
        rolesFromScraped.push({
          id: roleName.toLowerCase().replace(/\s+/g, '-'),
          name: roleName,
          metrics
        });
      });
      // Sort by hires descending and take top 10
      const sortedRoles = rolesFromScraped.sort((a, b) => b.metrics.hires - a.metrics.hires).slice(0, 10);
      
      // Re-categorize the top 10 roles: 3 Critical, 4 Trending, 3 Emerging
      return sortedRoles.map((role, index) => {
        let bucket: 'Critical' | 'Trending' | 'Emerging';
        if (index < 3) {
          bucket = 'Critical';
        } else if (index < 7) {
          bucket = 'Trending';
        } else {
          bucket = 'Emerging';
        }
        return {
          ...role,
          metrics: {
            ...role.metrics,
            bucket
          }
        };
      });
    } else {
      // For other departments, derive from department data
      return departmentData.trendingRoles.slice(0, 8).map((role, index) => {
        const bucket: 'Critical' | 'Trending' | 'Emerging' = 
          role.growthRate > 25 ? 'Critical' : role.growthRate > 15 ? 'Trending' : 'Emerging';
        return {
          id: role.id,
          name: role.title,
          metrics: {
            hires: role.openPositions || Math.floor(Math.random() * 500) + 100,
            bucket,
            growthRate: role.growthRate,
            trendingStatus: role.growthRate > 20 ? 'High' : role.growthRate > 10 ? 'Medium' : 'Low',
            recencyScore: 80
          }
        };
      });
    }
  }, [selectedDepartment, scrapedMetrics, departmentData.trendingRoles]);

  const filteredOpportunities = useMemo(() => {
    let filtered = opportunities.filter(opp => {
      const matchesBucket = bucketFilter === 'all' || opp.metrics.bucket === bucketFilter;
      const matchesRole = roleFilter === 'all' || opp.name.toLowerCase().includes(roleFilter.toLowerCase());
      
      return matchesBucket && matchesRole;
    });
    
    // If there are approved roles OR skills, filter using OR logic
    if (approvedRoles.length > 0 || approvedSkills.length > 0) {
      filtered = filtered.filter(opp => {
        // Check if role matches any approved role
        const matchesRole = approvedRoles.length > 0 && approvedRoles.some(approvedRole => 
          opp.name.toLowerCase().includes(approvedRole.toLowerCase()) ||
          approvedRole.toLowerCase().includes(opp.name.toLowerCase())
        );
        
        // For skills matching, we need to check against the original data
        // Since opportunities don't have skills directly, we check against salesSkillsData
        const roleData = salesSkillsData.filter(d => 
          d.mainRole.toLowerCase() === opp.name.toLowerCase() ||
          d.mainRole.toLowerCase().includes(opp.name.toLowerCase()) ||
          opp.name.toLowerCase().includes(d.mainRole.toLowerCase())
        );
        const roleSkills = roleData.map(d => d.skills.toLowerCase()).join(' ');
        const matchesSkill = approvedSkills.length > 0 && approvedSkills.some(approvedSkill => 
          roleSkills.includes(approvedSkill.toLowerCase())
        );
        
        // OR logic: show if matches either role OR skill
        return matchesRole || matchesSkill;
      });
    }
    
    return filtered;
  }, [opportunities, bucketFilter, roleFilter, approvedRoles, approvedSkills]);

  const handleExplore = (opportunity: RoleOpportunity) => {
    navigate(`/role-insight/${opportunity.id}`);
  };

  const getDemandGrowthIcon = (growth: number) => {
    if (growth > 0) return TrendingUp;
    if (growth < 0) return TrendingDown;
    return Minus;
  };

  const getBucketIcon = (bucket: string) => {
    switch (bucket) {
      case 'Critical': return AlertTriangle;
      case 'Trending': return Flame;
      case 'Emerging': return Zap;
      default: return Zap;
    }
  };

  const getBucketStyles = (bucket: string) => {
    switch (bucket) {
      case 'Critical':
        return 'bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,45%)] border-[hsl(0,84%,60%)]/30';
      case 'Trending':
        return 'bg-[hsl(25,95%,53%)]/10 text-[hsl(25,95%,40%)] border-[hsl(25,95%,53%)]/30';
      case 'Emerging':
        return 'bg-[hsl(206,100%,50%)]/10 text-[hsl(206,100%,40%)] border-[hsl(206,100%,50%)]/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const uniqueRoles = useMemo(() => 
    [...new Set(opportunities.map(o => o.name))],
    [opportunities]
  );

  // Count roles per bucket
  const bucketCounts = useMemo(() => ({
    Critical: opportunities.filter(o => o.metrics.bucket === 'Critical').length,
    Trending: opportunities.filter(o => o.metrics.bucket === 'Trending').length,
    Emerging: opportunities.filter(o => o.metrics.bucket === 'Emerging').length
  }), [opportunities]);

  return (
    <Card className="bg-white shadow-md border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[hsl(207,100%,14%)]">
            <Briefcase className="h-5 w-5 text-[hsl(206,100%,42%)]" />
            Roles
          </CardTitle>
          <Filter className="h-4 w-4 text-[hsl(207,100%,31%)]" />
        </div>
        {/* Bucket summary */}
        <div className="flex gap-3 mt-2">
          <div className="flex items-center gap-1.5 text-xs">
            <AlertTriangle className="h-3.5 w-3.5 text-[hsl(0,84%,50%)]" />
            <span className="font-medium text-[hsl(0,84%,45%)]">{bucketCounts.Critical} Critical</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Flame className="h-3.5 w-3.5 text-[hsl(25,95%,53%)]" />
            <span className="font-medium text-[hsl(25,95%,40%)]">{bucketCounts.Trending} Trending</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Zap className="h-3.5 w-3.5 text-[hsl(206,100%,50%)]" />
            <span className="font-medium text-[hsl(206,100%,40%)]">{bucketCounts.Emerging} Emerging</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Select value={bucketFilter} onValueChange={setBucketFilter}>
            <SelectTrigger className="w-[120px] h-8 text-xs bg-white">
              <SelectValue placeholder="Bucket" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Buckets</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="Trending">Trending</SelectItem>
              <SelectItem value="Emerging">Emerging</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs bg-white">
              <SelectValue placeholder="Job Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {uniqueRoles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {filteredOpportunities.map((opportunity, index) => {
            const GrowthIcon = getDemandGrowthIcon(opportunity.metrics.growthRate);
            const BucketIcon = getBucketIcon(opportunity.metrics.bucket);
            const isPositive = opportunity.metrics.growthRate > 0;
            
            return (
              <div 
                key={opportunity.id}
                onClick={() => handleExplore(opportunity)}
                className="flex items-center justify-between py-3 px-3 rounded-lg bg-white border border-[hsl(210,14%,89%)] shadow-sm hover:shadow-md cursor-pointer transition-all group hover:border-[hsl(206,100%,42%)]/30"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-[hsl(206,100%,42%)]/10 text-[hsl(206,100%,42%)] text-xs font-semibold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-[hsl(207,100%,14%)] truncate">{opportunity.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          'text-[10px] px-1.5 py-0 h-4 font-medium',
                          getBucketStyles(opportunity.metrics.bucket)
                        )}
                      >
                        <BucketIcon className="h-2.5 w-2.5 mr-0.5" />
                        {opportunity.metrics.bucket}
                      </Badge>
                      <div className="flex items-center gap-1 text-[10px] text-[hsl(207,100%,31%)]">
                        <Users className="h-3 w-3" />
                        <span className="font-semibold">{opportunity.metrics.hires.toLocaleString()}</span>
                        <span>hires</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className={cn(
                    'flex items-center gap-1 text-sm font-semibold',
                    isPositive ? 'text-[hsl(80,100%,30%)]' : 'text-[hsl(0,84%,50%)]'
                  )}>
                    <GrowthIcon className="h-3.5 w-3.5" />
                    <span>{isPositive ? '+' : ''}{opportunity.metrics.growthRate}%</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[hsl(207,100%,31%)] group-hover:text-[hsl(206,100%,42%)] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingRolesWithBuckets;
