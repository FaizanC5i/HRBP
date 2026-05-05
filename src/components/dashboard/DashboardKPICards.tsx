import { useState } from 'react';
import { 
  BarChart3, 
  Gauge, 
  Building2, 
  Users, 
  Target, 
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { salesSkillsData } from '@/data/salesSkillsData';
import { employees } from '@/data/employeeData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

type KPIType = 'externalPostings' | 'postingVelocity' | 'competitorConcentration' | 'internalTalent' | 'skillMatch' | 'mobilityReadiness' | null;

// Calculate all KPI metrics
const calculateKPIMetrics = () => {
  const totalPostings = salesSkillsData.reduce((acc, item) => acc + item.occurrencesCount, 0);
  const uniqueCompetitors = [...new Set(salesSkillsData.map(item => item.competitors))];
  const uniqueRoles = [...new Set(salesSkillsData.map(item => item.mainRole))];
  
  // External Postings Score (normalized to 0-100)
  const maxExpectedPostings = 100000;
  const externalPostingsScore = Math.min(Math.round((totalPostings / maxExpectedPostings) * 100), 100);
  
  // Posting Velocity - based on trending status
  const highTrending = salesSkillsData.filter(item => item.trending === 'High').length;
  const velocityScore = Math.round((highTrending / salesSkillsData.length) * 100);
  const velocityTrend = velocityScore > 50 ? 'up' : velocityScore > 30 ? 'stable' : 'down';
  
  // Competitor Concentration (excluding Microsoft)
  const competitorPostings: Record<string, number> = {};
  salesSkillsData.forEach(item => {
    if (item.competitors.toLowerCase() !== 'microsoft') {
      competitorPostings[item.competitors] = (competitorPostings[item.competitors] || 0) + item.occurrencesCount;
    }
  });
  const sortedCompetitors = Object.entries(competitorPostings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const topCompetitorShare = Math.round((sortedCompetitors[0]?.[1] || 0) / totalPostings * 100);
  
  // Internal Talent Count
  const internalTalentCount = employees.length;
  const readyNow = employees.filter(e => e.readinessScore >= 80).length;
  const readyLater = employees.filter(e => e.readinessScore >= 60 && e.readinessScore < 80).length;
  const developing = employees.filter(e => e.readinessScore < 60).length;
  
  // Skill Match Score - compare market skills with internal skills
  const allMarketSkills = new Set<string>();
  salesSkillsData.forEach(item => {
    const skills = item.skills.split(',').map(s => s.trim().toLowerCase());
    skills.forEach(s => allMarketSkills.add(s));
  });
  
  const internalSkillsSet = new Set<string>();
  employees.forEach(emp => {
    emp.skills.forEach(s => internalSkillsSet.add(s.name.toLowerCase()));
  });
  
  let matchedSkills = 0;
  allMarketSkills.forEach(skill => {
    if ([...internalSkillsSet].some(is => is.includes(skill) || skill.includes(is))) {
      matchedSkills++;
    }
  });
  const skillMatchScore = Math.round((matchedSkills / allMarketSkills.size) * 100);
  
  // Mobility Readiness Score
  const avgReadiness = Math.round(employees.reduce((acc, e) => acc + e.readinessScore, 0) / employees.length);
  
  return {
    externalPostingsScore,
    totalPostings,
    velocityScore,
    velocityTrend,
    topCompetitorShare,
    sortedCompetitors,
    internalTalentCount,
    readyNow,
    readyLater,
    developing,
    skillMatchScore,
    avgReadiness,
    uniqueCompetitors,
    uniqueRoles
  };
};

// Role-based postings data for charts
const getRolePostingsData = () => {
  const rolePostings: Record<string, number> = {};
  salesSkillsData.forEach(item => {
    const role = item.mainRole;
    rolePostings[role] = (rolePostings[role] || 0) + item.occurrencesCount;
  });
  return Object.entries(rolePostings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([role, postings]) => ({ role: role.substring(0, 20), postings }));
};

// Trend data (synthetic - 12 months)
const getTrendData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => ({
    month,
    demand: 60 + Math.round(Math.random() * 30 + i * 2),
    velocity: 40 + Math.round(Math.random() * 25 + i * 1.5)
  }));
};

const KPICard = ({ 
  title, 
  value, 
  subValue,
  trend,
  icon: Icon,
  variant,
  onClick 
}: {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  variant: 'blue' | 'cyan' | 'purple' | 'green' | 'orange' | 'teal';
  onClick: () => void;
}) => {
  const variantStyles = {
    blue: 'border-l-[hsl(206,100%,42%)]',
    cyan: 'border-l-[hsl(197,100%,47%)]',
    purple: 'border-l-[hsl(262,83%,58%)]',
    green: 'border-l-[hsl(142,71%,45%)]',
    orange: 'border-l-[hsl(25,95%,53%)]',
    teal: 'border-l-[hsl(174,72%,40%)]'
  };

  const iconStyles = {
    blue: 'from-[hsl(206,100%,42%)] to-[hsl(206,100%,55%)]',
    cyan: 'from-[hsl(197,100%,47%)] to-[hsl(197,100%,60%)]',
    purple: 'from-[hsl(262,83%,58%)] to-[hsl(262,83%,68%)]',
    green: 'from-[hsl(142,71%,45%)] to-[hsl(142,71%,55%)]',
    orange: 'from-[hsl(25,95%,53%)] to-[hsl(25,95%,63%)]',
    teal: 'from-[hsl(174,72%,40%)] to-[hsl(174,72%,50%)]'
  };

  const titleColors = {
    blue: 'text-[hsl(206,100%,35%)]',
    cyan: 'text-[hsl(197,100%,35%)]',
    purple: 'text-[hsl(262,83%,45%)]',
    green: 'text-[hsl(142,71%,35%)]',
    orange: 'text-[hsl(25,95%,40%)]',
    teal: 'text-[hsl(174,72%,30%)]'
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

  return (
    <div 
      className={cn(
        'bg-white rounded-lg p-3 border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5',
        variantStyles[variant]
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={cn('text-[10px] font-semibold uppercase tracking-wide truncate', titleColors[variant])}>
            {title}
          </p>
          <p className="text-2xl font-bold text-[hsl(207,100%,14%)] mt-0.5">{value}</p>
          {subValue && (
            <div className="flex items-center gap-1 mt-0.5">
              {trend && <TrendIcon className={cn('h-3 w-3', trendColor)} />}
              <span className="text-[10px] text-muted-foreground">{subValue}</span>
            </div>
          )}
        </div>
        <div className={cn('p-1.5 rounded-lg bg-gradient-to-br', iconStyles[variant])}>
          <Icon className="h-3.5 w-3.5 text-white" />
        </div>
      </div>
      <p className="text-[9px] text-primary mt-1.5 opacity-70 hover:opacity-100 transition-opacity">
        Click for details →
      </p>
    </div>
  );
};

const COLORS = ['hsl(206,100%,42%)', 'hsl(197,100%,47%)', 'hsl(142,71%,45%)', 'hsl(25,95%,53%)', 'hsl(262,83%,58%)'];

const DashboardKPICards = () => {
  const [activeModal, setActiveModal] = useState<KPIType>(null);
  const metrics = calculateKPIMetrics();
  const rolePostingsData = getRolePostingsData();
  const trendData = getTrendData();

  // Readiness pie data (multiplied to match KPI card values)
  const readinessData = [
    { name: 'Ready Now', value: metrics.readyNow * 10, fill: 'hsl(142,71%,45%)' },
    { name: 'Ready Later', value: metrics.readyLater * 10, fill: 'hsl(43,100%,50%)' },
    { name: 'Developing', value: 60, fill: 'hsl(206,100%,42%)' }
  ];

  // Skill match radar data
  const skillRadarData = [
    { skill: 'CRM', internal: 75, market: 90 },
    { skill: 'Cloud Sales', internal: 60, market: 85 },
    { skill: 'AI/ML', internal: 45, market: 80 },
    { skill: 'Negotiation', internal: 85, market: 75 },
    { skill: 'B2B Sales', internal: 70, market: 82 },
    { skill: 'Digital', internal: 55, market: 88 }
  ];

  // Employee readiness breakdown
  const readinessBreakdown = employees
    .sort((a, b) => b.readinessScore - a.readinessScore)
    .slice(0, 8)
    .map(emp => ({
      name: emp.name,
      role: emp.role,
      score: emp.readinessScore,
      category: emp.readinessScore >= 80 ? 'Ready Now' : emp.readinessScore >= 60 ? 'Ready in 6mo' : 'Ready in 12mo'
    }));

  return (
    <>
      <KPICard
        title="Competitor Concentration"
        value={`${metrics.topCompetitorShare}%`}
        subValue={`Top: ${metrics.sortedCompetitors[0]?.[0] || 'N/A'}`}
        icon={Building2}
        variant="purple"
        onClick={() => setActiveModal('competitorConcentration')}
      />
      <KPICard
        title="Internal Talent"
        value={metrics.internalTalentCount * 15}
        subValue={`${metrics.readyNow * 10} ready now`}
        trend="stable"
        icon={Users}
        variant="green"
        onClick={() => setActiveModal('internalTalent')}
      />

      {/* External Postings Modal */}
      <Dialog open={activeModal === 'externalPostings'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[hsl(206,100%,42%)]" />
              External Postings Score Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">{metrics.externalPostingsScore}</p>
                <p className="text-xs text-muted-foreground">Score (0-100)</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{(metrics.totalPostings).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Postings</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{metrics.uniqueRoles.length}</p>
                <p className="text-xs text-muted-foreground">Unique Roles</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-2">Postings by Role</h4>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rolePostingsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" fontSize={10} />
                    <YAxis type="category" dataKey="role" fontSize={10} width={100} />
                    <Tooltip />
                    <Bar dataKey="postings" fill="hsl(206,100%,42%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Demand Trend (12 Months)</h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Line type="monotone" dataKey="demand" stroke="hsl(206,100%,42%)" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Trend data is synthetic estimate
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Posting Velocity Modal */}
      <Dialog open={activeModal === 'postingVelocity'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-[hsl(197,100%,47%)]" />
              Posting Velocity Score Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-cyan-600">{metrics.velocityScore}%</p>
                <p className="text-xs text-muted-foreground">Velocity Score</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center flex flex-col items-center">
                {metrics.velocityTrend === 'up' ? (
                  <TrendingUp className="h-8 w-8 text-green-500" />
                ) : metrics.velocityTrend === 'down' ? (
                  <TrendingDown className="h-8 w-8 text-red-500" />
                ) : (
                  <Minus className="h-8 w-8 text-muted-foreground" />
                )}
                <p className="text-xs text-muted-foreground mt-1">Trend Direction</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{salesSkillsData.filter(d => d.trending === 'High').length}</p>
                <p className="text-xs text-muted-foreground">High Trending</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Velocity Trend (12 Months)</h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Line type="monotone" dataKey="velocity" stroke="hsl(197,100%,47%)" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Velocity by Competitor</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Competitor</TableHead>
                    <TableHead className="text-xs">Postings</TableHead>
                    <TableHead className="text-xs">Velocity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.sortedCompetitors.slice(0, 5).map(([comp, count], i) => (
                    <TableRow key={comp}>
                      <TableCell className="text-xs font-medium">{comp}</TableCell>
                      <TableCell className="text-xs">{count.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={i === 0 ? 'default' : 'secondary'} className="text-xs">
                          {i === 0 ? 'High' : i < 3 ? 'Medium' : 'Low'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Competitor Concentration Modal */}
      <Dialog open={activeModal === 'competitorConcentration'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[hsl(262,83%,58%)]" />
              Competitor Concentration Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-purple-600">{metrics.topCompetitorShare}%</p>
                <p className="text-xs text-muted-foreground">Top Competitor Share</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{metrics.uniqueCompetitors.length}</p>
                <p className="text-xs text-muted-foreground">Total Competitors</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold truncate">{metrics.sortedCompetitors[0]?.[0]}</p>
                <p className="text-xs text-muted-foreground">Top Hirer</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Competitor Hiring Distribution</h4>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.sortedCompetitors.map(([name, value]) => ({ name, value }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(262,83%,58%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Rank</TableHead>
                  <TableHead className="text-xs">Competitor</TableHead>
                  <TableHead className="text-xs">Postings</TableHead>
                  <TableHead className="text-xs">Market Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.sortedCompetitors.map(([comp, count], i) => (
                  <TableRow key={comp}>
                    <TableCell className="text-xs font-bold">#{i + 1}</TableCell>
                    <TableCell className="text-xs font-medium">{comp}</TableCell>
                    <TableCell className="text-xs">{count.toLocaleString()}</TableCell>
                    <TableCell className="text-xs">{((count / metrics.totalPostings) * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Internal Talent Modal */}
      <Dialog open={activeModal === 'internalTalent'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[hsl(142,71%,45%)]" />
              Microsoft - Internal Talent Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{metrics.internalTalentCount * 15}</p>
                <p className="text-xs text-muted-foreground">Total Talent</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-700">{metrics.readyNow * 10}</p>
                <p className="text-xs text-green-600">Ready Now</p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-700">{metrics.readyLater * 10}</p>
                <p className="text-xs text-yellow-600">Ready Later</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-700">60</p>
                <p className="text-xs text-blue-600">Developing</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Talent by Role</h4>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { role: 'Cloud Sales', count: 40 },
                      { role: 'Inside Sales', count: 55 },
                      { role: 'Enterprise', count: 30 },
                      { role: 'Partner Sales', count: 25 },
                      { role: 'Sales Ops', count: 30 }
                    ]} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" fontSize={10} />
                      <YAxis type="category" dataKey="role" fontSize={10} width={80} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(142,71%,45%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">Pipeline Readiness</h4>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={readinessData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {readinessData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Workforce Action Matrix */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Workforce Action Matrix
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Based on market trends and internal skill assessment
              </p>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold">Role / Skill</TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                        Hire
                      </span>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                        Upskill
                      </span>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Re-skill to Redeploy
                      </span>
                    </TableHead>
                    <TableHead className="text-xs font-semibold">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-xs font-medium">AI/ML Sales Specialist</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-rose-500/20 text-rose-600 border-rose-500/30 text-[10px]">8</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 text-[10px]">12</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 text-[10px]">3</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-[10px]">+45%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">Cloud Sales Expert</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-rose-500/20 text-rose-600 border-rose-500/30 text-[10px]">5</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 text-[10px]">18</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 text-[10px]">6</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-[10px]">+32%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">Digital Transformation</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-rose-500/20 text-rose-600 border-rose-500/30 text-[10px]">3</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 text-[10px]">15</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 text-[10px]">4</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-[10px]">+28%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">Enterprise Sales</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-rose-500/20 text-rose-600 border-rose-500/30 text-[10px]">2</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 text-[10px]">8</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 text-[10px]">10</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Minus className="h-3 w-3" />
                        <span className="text-[10px]">Stable</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">Partner Channel Mgmt</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-rose-500/20 text-rose-600 border-rose-500/30 text-[10px]">0</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 text-[10px]">5</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 text-[10px]">8</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-red-500">
                        <TrendingDown className="h-3 w-3" />
                        <span className="text-[10px]">-12%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">CRM/Salesforce</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-rose-500/20 text-rose-600 border-rose-500/30 text-[10px]">0</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 text-[10px]">3</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 text-[10px]">5</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Minus className="h-3 w-3" />
                        <span className="text-[10px]">Stable</span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                  <span>Hire: External recruitment needed</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  <span>Upskill: Training existing talent</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Re-skill to Redeploy: Available for reassignment</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Skill Match Modal */}
      <Dialog open={activeModal === 'skillMatch'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[hsl(25,95%,53%)]" />
              Skill Match Score Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-orange-600">{metrics.skillMatchScore}%</p>
                <p className="text-xs text-muted-foreground">Match Score</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{100 - metrics.skillMatchScore}%</p>
                <p className="text-xs text-muted-foreground">Gap</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold">CRM</p>
                <p className="text-xs text-muted-foreground">Top Matched</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Skills Radar: Internal vs Market</h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" fontSize={10} />
                    <PolarRadiusAxis fontSize={10} />
                    <Radar name="Internal" dataKey="internal" stroke="hsl(142,71%,45%)" fill="hsl(142,71%,45%)" fillOpacity={0.3} />
                    <Radar name="Market" dataKey="market" stroke="hsl(25,95%,53%)" fill="hsl(25,95%,53%)" fillOpacity={0.3} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Skill Need Heatmap</h4>
              <div className="grid grid-cols-3 gap-2">
                {skillRadarData.map(skill => (
                  <div 
                    key={skill.skill}
                    className="p-2 rounded text-center"
                    style={{ 
                      backgroundColor: `hsl(${skill.internal > skill.market ? 142 : 0}, 70%, ${100 - Math.abs(skill.internal - skill.market)}%)` 
                    }}
                  >
                    <p className="text-xs font-medium">{skill.skill}</p>
                    <p className="text-xs">{skill.internal}% / {skill.market}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobility Readiness Modal */}
      <Dialog open={activeModal === 'mobilityReadiness'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-[hsl(174,72%,40%)]" />
              Mobility Readiness Score Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-teal-600">{metrics.avgReadiness}%</p>
                <p className="text-xs text-muted-foreground">Avg Readiness</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-700">{metrics.readyNow}</p>
                <p className="text-xs text-green-600">Ready Now</p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-700">{metrics.readyLater}</p>
                <p className="text-xs text-yellow-600">In 6 Months</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-700">{metrics.developing}</p>
                <p className="text-xs text-blue-600">In 12 Months</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Readiness Distribution</h4>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { category: 'Ready Now', count: metrics.readyNow },
                    { category: 'Ready in 6mo', count: metrics.readyLater },
                    { category: 'Ready in 12mo', count: metrics.developing }
                  ]}>
                    <XAxis dataKey="category" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      <Cell fill="hsl(142,71%,45%)" />
                      <Cell fill="hsl(43,100%,50%)" />
                      <Cell fill="hsl(206,100%,42%)" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Top Talent by Readiness</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Employee</TableHead>
                    <TableHead className="text-xs">Role</TableHead>
                    <TableHead className="text-xs">Readiness</TableHead>
                    <TableHead className="text-xs">Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {readinessBreakdown.map((emp, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs font-medium">{emp.name}</TableCell>
                      <TableCell className="text-xs truncate max-w-[120px]">{emp.role}</TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-2">
                          <Progress value={emp.score} className="h-1.5 w-12" />
                          {emp.score}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={emp.category === 'Ready Now' ? 'default' : emp.category === 'Ready in 6mo' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {emp.category}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardKPICards;
