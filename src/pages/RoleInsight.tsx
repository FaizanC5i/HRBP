import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Building2, 
  Target,
  Zap,
  Users,
  Sparkles,
  Award,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Brain,
  BookOpen,
  Check,
  MessageSquare,
  UserPlus,
  RefreshCw,
  GraduationCap,
  DollarSign,
  Calendar,
  AlertTriangle,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApprovedOpportunities, SkillPriorityData } from '@/hooks/useApprovedOpportunities';
import { getInsightByRoleId, getInsightByRoleTitle, roleInsights, RoleInsight as RoleInsightType } from '@/data/roleInsightData';
import { employees } from '@/data/employeeData';
import { salesSkillsData } from '@/data/salesSkillsData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

// Suggested courses mapping by skill category
const suggestedCourses: Record<string, string[]> = {
  'CRM': ['MS Dynamics 365 Fundamentals', 'Salesforce Admin Certification', 'CRM Best Practices'],
  'Sales': ['Advanced Sales Techniques', 'Consultative Selling', 'Sales Leadership Program'],
  'Analytics': ['Power BI Fundamentals', 'Data Analytics for Sales', 'Excel Advanced Analytics'],
  'Communication': ['Executive Communication', 'Presentation Skills', 'Negotiation Mastery'],
  'Strategy': ['Strategic Account Planning', 'Business Strategy Essentials', 'Market Analysis'],
  'Leadership': ['Sales Management Certification', 'Team Leadership Program', 'Coaching Excellence'],
  'Digital': ['Digital Sales Transformation', 'Social Selling', 'AI in Sales'],
  'default': ['Microsoft Learn Pathway', 'LinkedIn Learning Course', 'Internal Training Program']
};

const getCoursesForSkill = (skillName: string): string[] => {
  const skillLower = skillName.toLowerCase();
  if (skillLower.includes('crm') || skillLower.includes('relationship')) return suggestedCourses['CRM'];
  if (skillLower.includes('analytics') || skillLower.includes('data')) return suggestedCourses['Analytics'];
  if (skillLower.includes('communication') || skillLower.includes('negotiation')) return suggestedCourses['Communication'];
  if (skillLower.includes('strategy') || skillLower.includes('planning')) return suggestedCourses['Strategy'];
  if (skillLower.includes('leadership') || skillLower.includes('management')) return suggestedCourses['Leadership'];
  if (skillLower.includes('digital') || skillLower.includes('ai') || skillLower.includes('automation')) return suggestedCourses['Digital'];
  if (skillLower.includes('sales') || skillLower.includes('account')) return suggestedCourses['Sales'];
  return suggestedCourses['default'];
};

type PriorityLevel = 'high' | 'medium' | 'low';

const RoleInsight = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { addOpportunity, removeOpportunity, getOpportunityByRoleId } = useApprovedOpportunities();
  const [skillPriorities, setSkillPriorities] = useState<Record<string, PriorityLevel[]>>({});
  const [skillCourses, setSkillCourses] = useState<Record<string, string[]>>({});
  const [isApproved, setIsApproved] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalComments, setApprovalComments] = useState('');
  const [sendForBOApproval, setSendForBOApproval] = useState(false);
  const [hireCount, setHireCount] = useState(0);
  const [upskillCount, setUpskillCount] = useState(0);
  const [redeployCount, setRedeployCount] = useState(0);

  const togglePriority = (skillName: string, priority: PriorityLevel) => {
    setSkillPriorities(prev => {
      const current = prev[skillName] || [];
      if (current.includes(priority)) {
        return { ...prev, [skillName]: current.filter(p => p !== priority) };
      } else {
        return { ...prev, [skillName]: [...current, priority] };
      }
    });
  };

  const toggleCourse = (skillName: string, course: string) => {
    setSkillCourses(prev => {
      const current = prev[skillName] || [];
      if (current.includes(course)) {
        return { ...prev, [skillName]: current.filter(c => c !== course) };
      } else {
        return { ...prev, [skillName]: [...current, course] };
      }
    });
  };

  const getAIRecommendation = (skill: { hasInternal: boolean; internalAvgScore: number; gap: number; externalSkill: string; externalCount: number; internalEmployeeCount: number }) => {
    const demandLevel = skill.externalCount >= 5 ? 'high' : skill.externalCount >= 3 ? 'moderate' : 'emerging';
    const sources = "job portals, career pages, and industry reports";
    
    if (!skill.hasInternal) {
      return `This skill shows ${demandLevel} market demand (${skill.externalCount}x mentions across ${sources}). Currently, 0 internal employees possess this skill, creating a 100% need. Recommend prioritizing external hiring or launching an intensive training program to build this capability from scratch.`;
    }
    if (skill.gap <= 20) {
      return `Strong internal capability with ${skill.internalEmployeeCount} employees at ${Math.round(skill.internalAvgScore)}% avg proficiency. Market demand is ${demandLevel} (${skill.externalCount}x mentions). Only ${skill.gap}% need exists. Recommend maintaining proficiency through refresher courses and knowledge sharing sessions.`;
    }
    if (skill.gap <= 50) {
      return `${skill.internalEmployeeCount} internal employees have this skill at ${Math.round(skill.internalAvgScore)}% proficiency. With ${demandLevel} demand (${skill.externalCount}x mentions) and a ${skill.gap}% need, recommend targeted upskilling programs to enhance existing workforce capabilities.`;
    }
    return `${skill.internalEmployeeCount} employees possess this skill but only at ${Math.round(skill.internalAvgScore)}% proficiency. Given ${demandLevel} market demand (${skill.externalCount}x mentions) and a significant ${skill.gap}% need, consider a comprehensive reskilling program or supplement with external recruitment.`;
  };

  // Generate insight dynamically from salesSkillsData when not found in predefined data
  const generateDynamicInsight = (roleName: string): RoleInsightType => {
    // Find all entries matching this role
    const roleEntries = salesSkillsData.filter(entry => 
      entry.mainRole?.toLowerCase().includes(roleName.toLowerCase()) ||
      roleName.toLowerCase().includes(entry.mainRole?.toLowerCase() || '') ||
      entry.roles?.toLowerCase().includes(roleName.toLowerCase())
    );
    
    // If no direct match, use all data for a general insight
    const relevantEntries = roleEntries.length > 0 ? roleEntries : salesSkillsData.slice(0, 10);
    
    // Aggregate skills from entries
    const skillsMap = new Map<string, number>();
    relevantEntries.forEach(entry => {
      const skills = entry.skills?.split(',').map(s => s.trim()).filter(s => s.length > 0 && s.length < 40) || [];
      skills.forEach(skill => {
        skillsMap.set(skill, (skillsMap.get(skill) || 0) + entry.occurrencesCount);
      });
    });
    
    const topSkills = Array.from(skillsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([skill], idx) => ({
        skill: skill.length > 35 ? skill.substring(0, 32) + '...' : skill,
        percentage: 95 - idx * 5,
        trend: (idx < 2 ? 'rising' : idx < 4 ? 'stable' : 'rising') as 'rising' | 'stable' | 'declining'
      }));
    
    // Calculate total occurrences
    const totalOccurrences = relevantEntries.reduce((sum, e) => sum + e.occurrencesCount, 0);
    
    // Get unique competitors
    const competitors = new Map<string, number>();
    relevantEntries.forEach(entry => {
      if (entry.competitors) {
        competitors.set(entry.competitors, (competitors.get(entry.competitors) || 0) + entry.occurrencesCount);
      }
    });
    
    const topCompetitors = Array.from(competitors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([company, hires]) => ({
        company,
        hires,
        trend: (hires > 1000 ? 'up' : 'stable') as 'up' | 'down' | 'stable'
      }));
    
    // Get locations
    const locations = [...new Set(relevantEntries.map(e => e.location).filter(Boolean))].slice(0, 5);
    
    // Generate trend data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const demandTrend = months.map((month, idx) => ({
      month,
      demand: 70 + Math.round(idx * 2 + Math.random() * 10),
      postings: Math.round(totalOccurrences / 12 * (0.8 + idx * 0.02 + Math.random() * 0.2))
    }));
    
    const formattedRoleName = roleName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      roleId: roleName,
      roleTitle: formattedRoleName,
      trendExplanation: {
        summary: `${formattedRoleName} positions show strong market demand with ${totalOccurrences.toLocaleString()} occurrences across major companies. This role is essential for driving business growth and digital transformation initiatives.`,
        marketSignals: [
          `${totalOccurrences.toLocaleString()}+ positions tracked across job portals`,
          `High demand in ${locations.slice(0, 3).join(', ') || 'multiple regions'}`,
          'Cloud and AI adoption driving role evolution',
          'Digital transformation creating new skill requirements'
        ],
        topIndustries: ['Technology', 'Enterprise Software', 'Cloud Services', 'Financial Services', 'E-commerce'],
        competitorActions: topCompetitors.slice(0, 3).map(c => `${c.company} actively hiring with ${c.hires.toLocaleString()} positions`)
      },
      sourceBreakdown: {
        jobPortals: {
          description: `Tracked ${formattedRoleName} postings across LinkedIn, Glassdoor, and Indeed`,
          increase: 25 + Math.round(Math.random() * 20),
          timeframe: 'last 30 days'
        },
        careerPages: {
          description: `Monitored career pages of ${topCompetitors.length} major companies`,
          companiesTracked: 50 + Math.round(Math.random() * 30)
        },
        industryReports: {
          description: 'Analyzed market reports on workforce trends',
          reportsAnalyzed: 10 + Math.round(Math.random() * 10)
        },
        competitorAnnouncements: {
          description: 'Tracked press releases and hiring announcements',
          announcementsTracked: 20 + Math.round(Math.random() * 20)
        }
      },
      demandTrend,
      skillRequirements: topSkills,
      competitorHiring: topCompetitors,
      emergingSkills: topSkills.slice(0, 5).map((s, idx) => ({
        skill: s.skill,
        heatScore: 95 - idx * 5
      })),
      growthRate: 20 + Math.round(Math.random() * 20),
      openPositions: totalOccurrences,
      relatedInsights: {
        topSkillsRequested: topSkills.slice(0, 5).map(s => s.skill),
        internalMatchCount: 3 + Math.round(Math.random() * 10),
        suggestedUpskillingPaths: ['Microsoft Certification', 'Advanced Training Program', 'Leadership Development']
      }
    };
  };

  // Try to find insight by ID first, then by title (converting slug back to title)
  const findInsight = (): RoleInsightType => {
    if (!roleId) return generateDynamicInsight('sales-representative');
    
    // First try direct ID match
    let found = getInsightByRoleId(roleId);
    if (found) return found;
    
    // Try converting slug to title and match
    const titleFromSlug = roleId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    found = getInsightByRoleTitle(titleFromSlug);
    if (found) return found;
    
    // Try partial title match
    const allInsights = Object.values(roleInsights);
    found = allInsights.find((insight) => 
      insight.roleTitle.toLowerCase().includes(roleId.replace(/-/g, ' ')) ||
      roleId.replace(/-/g, ' ').includes(insight.roleTitle.toLowerCase())
    );
    if (found) return found;
    
    // Generate dynamic insight from salesSkillsData
    return generateDynamicInsight(roleId);
  };
  
  const insight = findInsight();

  // Build summary data for the approval dialog
  const getApprovalSummary = () => {
    const summary: { skillName: string; priorities: PriorityLevel[]; courses: string[] }[] = [];
    
    const allSkills = new Set([...Object.keys(skillCourses), ...Object.keys(skillPriorities)]);
    allSkills.forEach(skillName => {
      const priorities = skillPriorities[skillName] || [];
      const courses = skillCourses[skillName] || [];
      if (priorities.length > 0 || courses.length > 0) {
        summary.push({ skillName, priorities, courses });
      }
    });
    
    return summary;
  };

  const handleOpenApprovalDialog = () => {
    // Initialize counts based on calculated values
    const calcHire = skillComparison.filter(s => !s.hasInternal).length > 0 
      ? Math.ceil(skillComparison.filter(s => !s.hasInternal).reduce((sum, s) => sum + s.externalCount * 0.5, 0))
      : 0;
    const calcUpskill = skillComparison.filter(s => s.hasInternal && s.gap > 40).reduce((sum, s) => sum + s.internalEmployeeCount, 0);
    const calcRedeploy = skillComparison.filter(s => s.hasInternal && s.gap <= 20 && s.internalEmployeeCount > 2)
      .reduce((sum, s) => sum + Math.floor(s.internalEmployeeCount * 0.3), 0);
    
    setHireCount(calcHire);
    setUpskillCount(calcUpskill);
    setRedeployCount(calcRedeploy);
    setShowApprovalDialog(true);
  };

  const handleConfirmApproval = () => {
    // Build skill priorities data from selected courses and priorities
    const skillPrioritiesData: SkillPriorityData[] = Object.keys(skillCourses)
      .filter(skillName => skillCourses[skillName].length > 0)
      .map(skillName => ({
        skillName,
        priorities: skillPriorities[skillName] || ['medium'],
        selectedCourses: skillCourses[skillName],
        roleId: insight.roleId,
        roleName: insight.roleTitle
      }));

    // Also include skills with priorities but no courses
    Object.keys(skillPriorities)
      .filter(skillName => skillPriorities[skillName].length > 0 && !skillCourses[skillName]?.length)
      .forEach(skillName => {
        skillPrioritiesData.push({
          skillName,
          priorities: skillPriorities[skillName],
          selectedCourses: [],
          roleId: insight.roleId,
          roleName: insight.roleTitle
        });
      });

    // Remove existing approval for this role if exists
    const existingOpp = getOpportunityByRoleId(insight.roleId);
    if (existingOpp) {
      removeOpportunity(existingOpp.id);
    }

    // Add to approved opportunities
    addOpportunity({
      roleId: insight.roleId,
      roleName: insight.roleTitle,
      skillsRequired: insight.relatedInsights.topSkillsRequested,
      trendReason: insight.trendExplanation.summary,
      sourceDataSummary,
      approvedBy: 'admin@hrbp.com',
      priority: 'high',
      skillPriorities: skillPrioritiesData,
      comments: approvalComments
    });

    setIsApproved(true);
    setShowApprovalDialog(false);

    toast({
      title: "HRBP Approved",
      description: `${insight.roleTitle} with ${skillPrioritiesData.length} skill priorities and courses saved to Monitor.`
    });
  };

  const sourceDataSummary = `Job portals show +${insight.sourceBreakdown.jobPortals.increase}% increase in ${insight.sourceBreakdown.jobPortals.timeframe}. Tracked ${insight.sourceBreakdown.careerPages.companiesTracked} company career pages and analyzed ${insight.sourceBreakdown.industryReports.reportsAnalyzed} industry reports.`;

  // Find internal employee matches with their skills
  const internalMatches = employees.filter(emp => 
    insight.relatedInsights.topSkillsRequested.some(skill => 
      emp.skills.some(s => s.name === skill)
    )
  ).slice(0, 8);

  // Get unique skills from all matching employees
  const allMatchedSkills = internalMatches.flatMap(emp => emp.skills);
  const skillsAggregated = insight.relatedInsights.topSkillsRequested.map(skillName => {
    const matchingSkills = allMatchedSkills.filter(s => s.name === skillName);
    const avgScore = matchingSkills.length > 0 
      ? Math.round(matchingSkills.reduce((sum, s) => sum + s.score, 0) / matchingSkills.length)
      : 0;
    const employeeCount = matchingSkills.length;
    return { skillName, avgScore, employeeCount };
  }).filter(s => s.employeeCount > 0);

// Get top 10 unique roles from salesSkillsData sorted by occurrences
  const roleAggregation = new Map<string, { totalOccurrences: number; skills: Map<string, { count: number; trending: boolean }> }>();
  
  salesSkillsData.forEach(item => {
    const roleName = item.mainRole || item.roles;
    if (!roleName) return;
    
    const existing = roleAggregation.get(roleName);
    const skills = item.skills?.split(',').map(s => s.trim()).filter(s => s.length > 0) || [];
    const isTrending = item.trending === 'High';
    
    if (existing) {
      existing.totalOccurrences += item.occurrencesCount || 1;
      skills.forEach(skill => {
        const skillData = existing.skills.get(skill);
        if (skillData) {
          skillData.count += 1;
          skillData.trending = skillData.trending || isTrending;
        } else {
          existing.skills.set(skill, { count: 1, trending: isTrending });
        }
      });
    } else {
      const skillsMap = new Map<string, { count: number; trending: boolean }>();
      skills.forEach(skill => {
        skillsMap.set(skill, { count: 1, trending: isTrending });
      });
      roleAggregation.set(roleName, { totalOccurrences: item.occurrencesCount || 1, skills: skillsMap });
    }
  });

  // Get top 10 roles by occurrences
  const top10Roles = Array.from(roleAggregation.entries())
    .map(([name, data]) => ({
      name,
      totalOccurrences: data.totalOccurrences,
      skills: Array.from(data.skills.entries())
        .map(([skillName, skillData]) => ({ name: skillName, ...skillData }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15)
    }))
    .sort((a, b) => b.totalOccurrences - a.totalOccurrences)
    .slice(0, 10);

  // Find the current role in our top 10 or fallback to best match
  const currentRoleNameLower = insight.roleTitle.toLowerCase();
  const matchedRole = top10Roles.find(role => 
    role.name.toLowerCase().includes(currentRoleNameLower) ||
    currentRoleNameLower.includes(role.name.toLowerCase())
  ) || top10Roles[0];

  // Get skills for the matched role from demand sensing data only
  const externalSkills = matchedRole?.skills || [];

  // Get internal skills from employees
  const internalSkillsMap = new Map<string, { avgScore: number; employeeCount: number }>();
  employees.forEach(emp => {
    emp.skills.forEach(skill => {
      const existing = internalSkillsMap.get(skill.name);
      if (existing) {
        existing.avgScore = (existing.avgScore * existing.employeeCount + skill.score) / (existing.employeeCount + 1);
        existing.employeeCount += 1;
      } else {
        internalSkillsMap.set(skill.name, { avgScore: skill.score, employeeCount: 1 });
      }
    });
  });

  // Compare external vs internal skills - using only skills from demand sensing
  const skillComparison = externalSkills.map(extSkill => {
    const extSkillLower = extSkill.name.toLowerCase();
    let internalMatch: { avgScore: number; employeeCount: number } | undefined;
    let matchedInternalName = '';
    
    for (const [internalName, data] of internalSkillsMap.entries()) {
      const internalLower = internalName.toLowerCase();
      if (internalLower.includes(extSkillLower) || extSkillLower.includes(internalLower) ||
          internalLower.split(' ').some(word => extSkillLower.includes(word) && word.length > 3)) {
        internalMatch = data;
        matchedInternalName = internalName;
        break;
      }
    }

    return {
      externalSkill: extSkill.name,
      externalCount: extSkill.count,
      trending: extSkill.trending,
      hasInternal: !!internalMatch,
      internalSkillName: matchedInternalName,
      internalAvgScore: internalMatch?.avgScore || 0,
      internalEmployeeCount: internalMatch?.employeeCount || 0,
      gap: internalMatch ? 100 - Math.round(internalMatch.avgScore) : 100
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{insight.roleTitle}</h1>
          <p className="text-muted-foreground">Role Insight & Market Analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            +{insight.growthRate}% Growth
          </Badge>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
            {insight.openPositions.toLocaleString()} Open Positions
          </Badge>
          <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/30">
            <Users className="h-3 w-3 mr-1" />
            {insight.relatedInsights.internalMatchCount} Internal Matches
          </Badge>
          <Button 
            onClick={handleOpenApprovalDialog}
            disabled={isApproved}
            className={isApproved 
              ? "bg-success/20 text-success border border-success/30" 
              : "bg-primary text-primary-foreground"
            }
          >
            {isApproved ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Approved
              </>
            ) : (
              'Approve as Business Opportunity'
            )}
          </Button>
        </div>
      </div>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Approval Summary - {insight.roleTitle}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            {/* Workforce Requirements Section */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Workforce Requirements
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {/* Hire Requirements */}
                <div className="p-4 rounded-lg border border-rose-500/20 bg-rose-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-rose-500/20">
                        <UserPlus className="h-4 w-4 text-rose-600" />
                      </div>
                      <span className="text-sm font-semibold text-rose-700">Hire</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 border-rose-300 text-rose-600 bg-rose-50">
                      Demand Sensing
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="number"
                      min="0"
                      value={hireCount}
                      onChange={(e) => setHireCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-16 text-2xl font-bold text-rose-600 bg-transparent border-b border-rose-300 focus:outline-none focus:border-rose-500 text-center"
                    />
                    <span className="text-xs text-muted-foreground">people</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-2">External recruitment needed</p>
                  <div className="space-y-1.5">
                    {skillComparison.filter(s => !s.hasInternal).slice(0, 3).map((skill, idx) => (
                      <div key={idx} className="text-[10px] flex items-center justify-between">
                        <span className="truncate text-foreground flex-1">{skill.externalSkill}</span>
                        <Badge variant="outline" className="text-[8px] px-1 py-0 ml-1 border-rose-300 text-rose-500 bg-white">
                          {skill.externalCount}
                        </Badge>
                      </div>
                    ))}
                    {skillComparison.filter(s => !s.hasInternal).length === 0 && (
                      <p className="text-[10px] text-muted-foreground italic">All skills matched internally</p>
                    )}
                  </div>
                </div>

                {/* Upskill Requirements */}
                <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-amber-500/20">
                        <GraduationCap className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-sm font-semibold text-amber-700">Upskill</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 border-amber-300 text-amber-600 bg-amber-50">
                      Gap Analysis
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="number"
                      min="0"
                      value={upskillCount}
                      onChange={(e) => setUpskillCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-16 text-2xl font-bold text-amber-600 bg-transparent border-b border-amber-300 focus:outline-none focus:border-amber-500 text-center"
                    />
                    <span className="text-xs text-muted-foreground">people</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-2">Employees for training</p>
                  <div className="space-y-1.5">
                    {skillComparison.filter(s => s.hasInternal && s.gap > 40).slice(0, 3).map((skill, idx) => (
                      <div key={idx} className="text-[10px] flex items-center justify-between">
                        <span className="truncate text-foreground flex-1">{skill.externalSkill}</span>
                        <span className="text-amber-600 font-medium text-[9px]">{Math.round(skill.internalAvgScore)}% prof.</span>
                      </div>
                    ))}
                    {skillComparison.filter(s => s.hasInternal && s.gap > 40).length === 0 && (
                      <p className="text-[10px] text-muted-foreground italic">Proficiency levels adequate</p>
                    )}
                  </div>
                </div>

                {/* Re-skill to Redeploy Requirements */}
                <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-blue-500/20">
                        <RefreshCw className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-blue-700">Re-skill to Redeploy</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 border-blue-300 text-blue-600 bg-blue-50">
                      Internal Match
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="number"
                      min="0"
                      value={redeployCount}
                      onChange={(e) => setRedeployCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-16 text-2xl font-bold text-blue-600 bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-500 text-center"
                    />
                    <span className="text-xs text-muted-foreground">people</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-2">Available for reassignment</p>
                  <div className="space-y-1.5">
                    {skillComparison.filter(s => s.hasInternal && s.gap <= 20 && s.internalEmployeeCount > 2).slice(0, 3).map((skill, idx) => (
                      <div key={idx} className="text-[10px] flex items-center justify-between">
                        <span className="truncate text-foreground flex-1">{skill.externalSkill}</span>
                        <span className="text-blue-600 font-medium text-[9px]">{skill.internalAvgScore}% ready</span>
                      </div>
                    ))}
                    {skillComparison.filter(s => s.hasInternal && s.gap <= 20 && s.internalEmployeeCount > 2).length === 0 && (
                      <p className="text-[10px] text-muted-foreground italic">No candidates ready for reassignment</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary of Selected Skills, Priorities & Courses */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Selected Skills & Training</h4>
              {getApprovalSummary().length > 0 ? (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {getApprovalSummary().map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{item.skillName}</span>
                        <div className="flex gap-1">
                          {item.priorities.map((p, i) => (
                            <Badge 
                              key={i} 
                              variant="outline"
                              className={
                                p === 'high' ? 'bg-destructive/10 text-destructive border-destructive/30 text-xs' :
                                p === 'medium' ? 'bg-chart-2/10 text-chart-2 border-chart-2/30 text-xs' :
                                'bg-muted text-muted-foreground text-xs'
                              }
                            >
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {item.courses.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.courses.map((course, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {course}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No skills or courses selected. Please select priorities and courses from the table above before approving.</p>
              )}
            </div>

            {/* Send for BO Approval Checkbox */}
            <div className="flex items-center gap-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
              <input
                type="checkbox"
                id="sendForBOApproval"
                checked={sendForBOApproval}
                onChange={(e) => setSendForBOApproval(e.target.checked)}
                className="h-4 w-4 rounded border-primary/50 text-primary focus:ring-primary"
              />
              <label htmlFor="sendForBOApproval" className="flex-1 cursor-pointer">
                <span className="text-sm font-medium text-foreground">Send for Business Owner Approvals</span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Route this approval to business owner for final validation before proceeding
                </p>
              </label>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Add Comments
              </h4>
              <Textarea
                placeholder="Enter any additional comments or notes for this approval..."
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                className="min-h-[80px] bg-background"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmApproval}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              <Check className="h-4 w-4 mr-1" />
              {sendForBOApproval ? 'Send for BO Approval' : 'HRBP Approved'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Trend Explanation */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Why This Role is Trending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">{insight.trendExplanation.summary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Market Signals */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-chart-2" />
                Market Signals
              </h4>
              <ul className="space-y-2">
                {insight.trendExplanation.marketSignals.map((signal, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-2 flex-shrink-0" />
                    {signal}
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Industries */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-chart-3" />
                Top Industries Hiring
              </h4>
              <div className="flex flex-wrap gap-2">
                {insight.trendExplanation.topIndustries.map((industry, i) => (
                  <Badge key={i} variant="secondary">{industry}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Competitor Actions */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-chart-4" />
              Competitor Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {insight.trendExplanation.competitorActions.map((action, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  {action}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Opportunity */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Business Opportunity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            The <span className="font-medium text-foreground">{insight.roleTitle}</span> role is experiencing a significant surge in demand with a <span className="text-success font-medium">+{insight.growthRate}%</span> growth rate. This trend is driven by digital transformation initiatives across {insight.trendExplanation.topIndustries.slice(0, 2).join(' and ')} sectors. Companies are investing heavily in this capability to drive revenue growth and competitive advantage. With {insight.openPositions.toLocaleString()} open positions and {insight.relatedInsights.internalMatchCount} internal matches, this presents both a hiring challenge and an upskilling opportunity for your workforce.
          </p>
        </CardContent>
      </Card>

      {/* Skill Matching Visualization - External vs Internal */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-chart-2" />
            External vs Internal Skills Matching - Microsoft
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Skills trending externally for this role compared with internal Microsoft capabilities
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
              <div className="col-span-2">Skillset Demand</div>
              <div className="col-span-1 text-center">Demand</div>
              <div className="col-span-2 text-center">Internal Match</div>
              <div className="col-span-1 text-center">Priority</div>
              <div className="col-span-2 text-center">Suggested Courses</div>
              <div className="col-span-4 text-center">AI Recommendation</div>
            </div>
            
            {skillComparison.map((skill, index) => {
              const currentPriorities = skillPriorities[skill.externalSkill] || [];
              const currentCourses = skillCourses[skill.externalSkill] || [];
              const availableCourses = getCoursesForSkill(skill.externalSkill);
              
              return (
                <div 
                  key={index} 
                  className={`grid grid-cols-12 gap-2 px-4 py-3 rounded-lg border transition-colors ${
                    skill.hasInternal 
                      ? 'bg-success/5 border-success/20 hover:bg-success/10' 
                      : 'bg-destructive/5 border-destructive/20 hover:bg-destructive/10'
                  }`}
                >
                  {/* Skillset Demand */}
                  <div className="col-span-2 flex items-center gap-1">
                    <span className="font-medium text-xs truncate">{skill.externalSkill}</span>
                    {skill.trending && (
                      <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/30 text-[10px] px-1">
                        <TrendingUp className="h-2 w-2" />
                      </Badge>
                    )}
                  </div>
                  
                  {/* Market Demand */}
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="flex items-center gap-1">
                      <div className="w-10 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-chart-2 rounded-full"
                          style={{ width: `${Math.min((skill.externalCount / 10) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{skill.externalCount}x</span>
                    </div>
                  </div>
                  
                  {/* Internal Match Status */}
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    {skill.hasInternal ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-success" />
                        <span className="text-xs text-success font-medium">
                          {skill.internalEmployeeCount} emp
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 text-destructive" />
                        <span className="text-xs text-destructive">No match</span>
                      </>
                    )}
                  </div>
                  
                  {/* Priority Multi-Select */}
                  <div className="col-span-1 flex items-center justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-6 px-1.5 text-xs min-w-[36px]">
                          {currentPriorities.length === 0 ? (
                            '...'
                          ) : (
                            <div className="flex gap-0.5">
                              {currentPriorities.map(p => (
                                <span 
                                  key={p}
                                  className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold ${
                                    p === 'high' ? 'bg-destructive/20 text-destructive' :
                                    p === 'medium' ? 'bg-chart-2/20 text-chart-2' :
                                    'bg-success/20 text-success'
                                  }`}
                                >
                                  {p.charAt(0).toUpperCase()}
                                </span>
                              ))}
                            </div>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-24 bg-background border shadow-lg z-50">
                        <DropdownMenuCheckboxItem
                          checked={currentPriorities.includes('high')}
                          onCheckedChange={() => togglePriority(skill.externalSkill, 'high')}
                          className="text-xs"
                        >
                          <span className="text-destructive font-medium">High</span>
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={currentPriorities.includes('medium')}
                          onCheckedChange={() => togglePriority(skill.externalSkill, 'medium')}
                          className="text-xs"
                        >
                          <span className="text-chart-2 font-medium">Medium</span>
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={currentPriorities.includes('low')}
                          onCheckedChange={() => togglePriority(skill.externalSkill, 'low')}
                          className="text-xs"
                        >
                          <span className="text-success font-medium">Low</span>
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Suggested Courses */}
                  <div className="col-span-2 flex items-center justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-6 px-2 text-xs max-w-full">
                          {currentCourses.length === 0 ? (
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              Select
                            </span>
                          ) : (
                            <span className="truncate text-[10px]">
                              {currentCourses.length} selected
                            </span>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-56 bg-background border shadow-lg z-50">
                        {availableCourses.map((course) => (
                          <DropdownMenuCheckboxItem
                            key={course}
                            checked={currentCourses.includes(course)}
                            onCheckedChange={() => toggleCourse(skill.externalSkill, course)}
                            className="text-xs"
                          >
                            {course}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* AI Recommendation */}
                  <div className="col-span-4 flex items-start justify-start">
                    <div className="flex items-start gap-1 text-[10px] text-muted-foreground">
                      <Brain className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-left leading-relaxed">{getAIRecommendation(skill)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-success">
                {skillComparison.filter(s => s.hasInternal).length}
              </div>
              <div className="text-xs text-muted-foreground">Skills Available Internally</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-destructive">
                {skillComparison.filter(s => !s.hasInternal).length}
              </div>
              <div className="text-xs text-muted-foreground">Skills Need (Hiring/Training)</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-chart-2">
                {Math.round(skillComparison.filter(s => s.hasInternal).reduce((sum, s) => sum + s.internalAvgScore, 0) / Math.max(skillComparison.filter(s => s.hasInternal).length, 1))}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Internal Proficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI-Powered Workforce Recommendations Card */}
      <WorkforceRecommendationsCard 
        roleName={insight.roleTitle}
        skillComparison={skillComparison}
        matchedRole={matchedRole}
      />

    </div>
  );
};

// Workforce Recommendations Card Component
const WorkforceRecommendationsCard = ({ 
  roleName, 
  skillComparison,
  matchedRole
}: { 
  roleName: string; 
  skillComparison: { 
    externalSkill: string; 
    hasInternal: boolean; 
    internalAvgScore: number; 
    gap: number; 
    externalCount: number;
    internalEmployeeCount: number;
  }[];
  matchedRole: { name: string; totalOccurrences: number; skills: { name: string; count: number; trending: boolean }[] } | undefined;
}) => {
  // Calculate workforce action recommendations
  const recommendations = useMemo(() => {
    const hireNeeds: { skill: string; urgency: 'high' | 'medium' | 'low'; count: number }[] = [];
    const upskillNeeds: { skill: string; currentLevel: number; targetLevel: number; employeeCount: number }[] = [];
    const redeployPool: { skill: string; availableCount: number; readiness: number }[] = [];
    
    skillComparison.forEach(skill => {
      if (!skill.hasInternal) {
        // No internal capability - need to hire
        hireNeeds.push({
          skill: skill.externalSkill,
          urgency: skill.externalCount >= 5 ? 'high' : skill.externalCount >= 3 ? 'medium' : 'low',
          count: Math.ceil(skill.externalCount * 0.5)
        });
      } else if (skill.gap > 40) {
        // Large gap - need upskilling
        upskillNeeds.push({
          skill: skill.externalSkill,
          currentLevel: skill.internalAvgScore,
          targetLevel: Math.min(skill.internalAvgScore + skill.gap * 0.6, 95),
          employeeCount: skill.internalEmployeeCount
        });
      } else if (skill.gap <= 20 && skill.internalEmployeeCount > 2) {
        // Good internal capability - available for redeployment
        redeployPool.push({
          skill: skill.externalSkill,
          availableCount: Math.floor(skill.internalEmployeeCount * 0.3),
          readiness: skill.internalAvgScore
        });
      }
    });
    
    return { hireNeeds, upskillNeeds, redeployPool };
  }, [skillComparison]);


  // Generate market demand analysis
  const marketDemandAnalysis = useMemo(() => {
    const topDemandSkills = skillComparison
      .sort((a, b) => b.externalCount - a.externalCount)
      .slice(0, 5)
      .map(s => ({
        skill: s.externalSkill,
        demandScore: s.externalCount,
        supplyGap: s.gap,
        criticalLevel: s.externalCount >= 5 ? 'Critical' : s.externalCount >= 3 ? 'High' : 'Moderate'
      }));
    
    const avgDemandGrowth = 12 + Math.random() * 8;
    const competitorHiringIntensity = skillComparison.reduce((sum, s) => sum + s.externalCount, 0) / skillComparison.length;
    
    return {
      topSkills: topDemandSkills,
      avgGrowth: avgDemandGrowth,
      competitorIntensity: competitorHiringIntensity > 4 ? 'High' : competitorHiringIntensity > 2 ? 'Moderate' : 'Low',
      timeToFill: 45 + Math.floor(Math.random() * 25),
      talentScarcity: skillComparison.filter(s => !s.hasInternal).length / skillComparison.length * 100
    };
  }, [skillComparison]);

  // Generate AI summary
  const aiSummary = useMemo(() => {
    const hireCount = recommendations.hireNeeds.reduce((sum, h) => sum + h.count, 0);
    const upskillCount = recommendations.upskillNeeds.reduce((sum, u) => sum + u.employeeCount, 0);
    const redeployCount = recommendations.redeployPool.reduce((sum, r) => sum + r.availableCount, 0);
    const highUrgencySkills = recommendations.hireNeeds.filter(h => h.urgency === 'high').map(h => h.skill);
    
    // Enhanced detailed summary paragraph
    const detailedSummary = `Based on comprehensive market analysis, the ${roleName} position shows strong demand with ${marketDemandAnalysis.topSkills.slice(0, 3).map(s => s.skill).join(', ')} being the most sought-after skillsets. ${marketDemandAnalysis.talentScarcity.toFixed(0)}% of required skills show internal talent scarcity. The average time-to-fill for this role is ${marketDemandAnalysis.timeToFill} days, with competitor hiring intensity rated as ${marketDemandAnalysis.competitorIntensity}.

Recommendation: ${hireCount > 5 ? 'Given the significant skill needs, prioritize external recruitment.' : hireCount > 0 ? 'Strategic hiring combined with internal development programs will optimize cost while building capabilities.' : 'Focus on upskilling existing workforce to meet evolving market demands.'} ${upskillCount > 0 ? `Invest in targeted training programs for ${upskillCount} employees to bridge proficiency gaps.` : ''} ${redeployCount > 0 ? `Re-skill to redeploy ${redeployCount} employees from adjacent roles for rapid capability deployment.` : ''}`;
    
    return {
      summary: `For ${roleName}, analysis indicates a need to hire ${hireCount} new talent, upskill ${upskillCount} existing employees, and re-skill to redeploy ${redeployCount} available resources. ${highUrgencySkills.length > 0 ? `High-priority hiring focus: ${highUrgencySkills.slice(0, 2).join(', ')}.` : 'No critical hiring gaps identified.'}`,
      detailedSummary,
      keyInsights: [
        hireCount > 0 ? `${hireCount} external hires needed for skills not available internally` : 'Internal talent pool covers core skill requirements',
        upskillCount > 0 ? `${upskillCount} employees identified for targeted upskilling programs` : 'Current proficiency levels meet market demands',
        redeployCount > 0 ? `${redeployCount} employees available for redeployment from adjacent roles` : 'Limited redeployment opportunities identified'
      ],
      riskFactors: [
        hireCount > 5 ? 'High external dependency may delay capability building' : null,
        upskillCount > 10 ? 'Large-scale training requires significant L&D resources' : null,
        recommendations.hireNeeds.filter(h => h.urgency === 'high').length > 2 ? 'Multiple critical skill needs require immediate attention' : null,
        marketDemandAnalysis.competitorIntensity === 'High' ? 'Intense competitor hiring may increase talent acquisition costs' : null
      ].filter(Boolean) as string[]
    };
  }, [recommendations, roleName, marketDemandAnalysis]);

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          Internal Requirement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Action Matrix */}
        <div className="grid grid-cols-3 gap-4">
          {/* Hire Card */}
          <div className="p-4 rounded-lg border border-rose-500/20 bg-rose-500/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-rose-500/20">
                  <UserPlus className="h-4 w-4 text-rose-600" />
                </div>
                <span className="text-sm font-semibold text-rose-700">Hire</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-rose-600 mb-1">
              {recommendations.hireNeeds.reduce((sum, h) => sum + h.count, 0)}
            </div>
            <p className="text-[10px] text-muted-foreground mb-3">External recruitment needed</p>
            
            <div className="space-y-1.5">
              {recommendations.hireNeeds.slice(0, 3).map((need, idx) => (
                <div key={idx} className="flex items-center justify-between text-[10px]">
                  <span className="truncate flex-1 text-foreground">{need.skill}</span>
                  <Badge 
                    variant="outline" 
                    className={`ml-1 text-[8px] px-1 ${
                      need.urgency === 'high' ? 'border-rose-500 text-rose-600' :
                      need.urgency === 'medium' ? 'border-amber-500 text-amber-600' :
                      'border-muted text-muted-foreground'
                    }`}
                  >
                    {need.count}
                  </Badge>
                </div>
              ))}
              {recommendations.hireNeeds.length === 0 && (
                <p className="text-[10px] text-muted-foreground italic">No hiring gaps identified</p>
              )}
            </div>
          </div>

          {/* Upskill Card */}
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-amber-500/20">
                  <GraduationCap className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-sm font-semibold text-amber-700">Upskill</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-amber-600 mb-1">
              {recommendations.upskillNeeds.reduce((sum, u) => sum + u.employeeCount, 0)}
            </div>
            <p className="text-[10px] text-muted-foreground mb-3">Employees for training</p>
            
            <div className="space-y-1.5">
              {recommendations.upskillNeeds.slice(0, 3).map((need, idx) => (
                <div key={idx} className="flex items-center justify-between text-[10px]">
                  <span className="truncate flex-1 text-foreground">{need.skill}</span>
                  <span className="text-amber-600 font-medium">
                    {Math.round(need.currentLevel)}% → {Math.round(need.targetLevel)}%
                  </span>
                </div>
              ))}
              {recommendations.upskillNeeds.length === 0 && (
                <p className="text-[10px] text-muted-foreground italic">Proficiency levels adequate</p>
              )}
            </div>
          </div>

          {/* Re-skill to Redeploy Card */}
          <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-blue-500/20">
                  <RefreshCw className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-blue-700">Re-skill to Redeploy</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {recommendations.redeployPool.reduce((sum, r) => sum + r.availableCount, 0)}
            </div>
            <p className="text-[10px] text-muted-foreground mb-3">Available for reassignment</p>
            
            <div className="space-y-1.5">
              {recommendations.redeployPool.slice(0, 3).map((pool, idx) => (
                <div key={idx} className="flex items-center justify-between text-[10px]">
                  <span className="truncate flex-1 text-foreground">{pool.skill}</span>
                  <span className="text-blue-600 font-medium">{pool.readiness}% ready</span>
                </div>
              ))}
              {recommendations.redeployPool.length === 0 && (
                <p className="text-[10px] text-muted-foreground italic">Limited redeployment pool</p>
              )}
            </div>
          </div>
        </div>


        {/* Trend Indicator */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium">Market Demand Trend</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Next 12 months projection:</span>
            <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
              +{matchedRole ? Math.min(Math.round(matchedRole.totalOccurrences / 1000), 35) : 18}% Growth
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleInsight;
