import { useMemo } from 'react';
import { Building2, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { salesSkillsData } from '@/data/salesSkillsData';

// Source URLs for competitor data
const competitorSources: Record<string, { url: string; label: string }> = {
  'Amazon': { url: 'https://www.amazon.jobs', label: 'Amazon Jobs' },
  'Google': { url: 'https://careers.google.com', label: 'Google Careers' },
  'Microsoft': { url: 'https://careers.microsoft.com', label: 'Microsoft Careers' },
  'Salesforce': { url: 'https://www.salesforce.com/company/careers', label: 'Salesforce Careers' },
  'Oracle': { url: 'https://www.oracle.com/careers', label: 'Oracle Careers' },
  'IBM': { url: 'https://www.ibm.com/careers', label: 'IBM Careers' },
  'Deloitte': { url: 'https://www2.deloitte.com/careers', label: 'Deloitte Careers' },
  'Accenture': { url: 'https://www.accenture.com/careers', label: 'Accenture Careers' },
  'McKinsey': { url: 'https://www.mckinsey.com/careers', label: 'McKinsey Careers' },
  'Meta': { url: 'https://www.metacareers.com', label: 'Meta Careers' },
};

// Extract top skills from dataset
const extractTopSkills = (): string[] => {
  const skillMap = new Map<string, number>();
  
  salesSkillsData.forEach(entry => {
    const skills = entry.skills.split(',').map(s => s.trim()).filter(s => s.length > 0 && s.length < 30);
    skills.forEach(skill => {
      skillMap.set(skill, (skillMap.get(skill) || 0) + entry.occurrencesCount);
    });
  });
  
  return Array.from(skillMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill.length > 20 ? skill.substring(0, 18) + '...' : skill);
};

// Extract competitors from dataset and calculate skill adoption
const extractCompetitorData = (topSkills: string[]) => {
  // Group data by competitor
  const competitorMap = new Map<string, { 
    totalOccurrences: number; 
    skillOccurrences: Map<string, number>;
    industry: string;
  }>();
  
  salesSkillsData.forEach(entry => {
    const competitor = entry.competitors;
    if (!competitor || competitor.toLowerCase() === 'microsoft') return;
    
    const existing = competitorMap.get(competitor) || {
      totalOccurrences: 0,
      skillOccurrences: new Map<string, number>(),
      industry: 'Tech'
    };
    
    existing.totalOccurrences += entry.occurrencesCount;
    
    // Parse skills and count occurrences
    const skills = entry.skills.split(',').map(s => s.trim());
    topSkills.forEach(topSkill => {
      const hasSkill = skills.some(s => 
        s.toLowerCase().includes(topSkill.toLowerCase().replace('...', '')) ||
        topSkill.toLowerCase().replace('...', '').includes(s.toLowerCase())
      );
      if (hasSkill) {
        existing.skillOccurrences.set(
          topSkill, 
          (existing.skillOccurrences.get(topSkill) || 0) + entry.occurrencesCount
        );
      }
    });
    
    competitorMap.set(competitor, existing);
  });
  
  // Convert to array and sort by total occurrences
  const competitors = Array.from(competitorMap.entries())
    .map(([company, data]) => {
      const skillAdoption: Record<string, { level: number; trend: 'up' | 'stable' | 'down' }> = {};
      
      topSkills.forEach(skill => {
        const skillOcc = data.skillOccurrences.get(skill) || 0;
        // Calculate adoption level based on skill occurrence relative to total
        const level = Math.min(100, Math.round((skillOcc / data.totalOccurrences) * 150) + 30);
        
        // Determine trend based on level
        const trend: 'up' | 'stable' | 'down' = 
          level > 70 ? 'up' : level > 50 ? 'stable' : 'down';
        
        skillAdoption[skill] = { level, trend };
      });
      
      return {
        id: company.toLowerCase().replace(/\s+/g, '-'),
        company,
        industry: data.totalOccurrences > 5000 ? 'Enterprise Tech' : 'Tech',
        totalOccurrences: data.totalOccurrences,
        skillAdoption,
        source: competitorSources[company] || { url: 'https://linkedin.com', label: 'LinkedIn' }
      };
    })
    .sort((a, b) => b.totalOccurrences - a.totalOccurrences)
    .slice(0, 6);
  
  return competitors;
};

const getLevelBadge = (level: number) => {
  if (level >= 85) return { label: 'Expert', className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' };
  if (level >= 70) return { label: 'High', className: 'bg-sky-500/15 text-sky-600 border-sky-500/30' };
  if (level >= 55) return { label: 'Medium', className: 'bg-amber-500/15 text-amber-600 border-amber-500/30' };
  return { label: 'Low', className: 'bg-rose-500/15 text-rose-600 border-rose-500/30' };
};

const CompetitorSkillAdoptions = () => {
  const topSkills = useMemo(() => extractTopSkills(), []);
  const competitorData = useMemo(() => extractCompetitorData(topSkills), [topSkills]);

  return (
    <Card className="card-shadow hover:card-shadow-lg transition-all">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-chart-3" />
          Competitor Skill Adoptions
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Skills being adopted by competitors (derived from demand sensing data)
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px]">Competitor</TableHead>
                {topSkills.map((skill, idx) => (
                  <TableHead key={idx} className="text-center min-w-[120px]">
                    {skill}
                  </TableHead>
                ))}
                <TableHead className="min-w-[120px]">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitorData.map((competitor) => (
                <TableRow key={competitor.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{competitor.company}</span>
                      <span className="text-xs text-muted-foreground">{competitor.industry}</span>
                    </div>
                  </TableCell>
                  {topSkills.map((skill, idx) => {
                    const adoption = competitor.skillAdoption[skill] || { level: 40, trend: 'stable' };
                    const levelBadge = getLevelBadge(adoption.level);
                    
                    return (
                      <TableCell key={idx} className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-sm">{adoption.level}%</span>
                            {adoption.trend === 'up' && (
                              <TrendingUp className="h-3 w-3 text-emerald-500" />
                            )}
                            {adoption.trend === 'down' && (
                              <TrendingDown className="h-3 w-3 text-rose-500" />
                            )}
                            {adoption.trend === 'stable' && (
                              <Minus className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                          <Badge variant="outline" className={cn('text-[10px] px-1.5', levelBadge.className)}>
                            {levelBadge.label}
                          </Badge>
                        </div>
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <a 
                      href={competitor.source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {competitor.source.label}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <span className="text-muted-foreground">Adoption Level:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-rose-500/50" />
            <span>Low (0-54%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-500/50" />
            <span>Medium (55-69%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-sky-500/50" />
            <span>High (70-84%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-500/50" />
            <span>Expert (85%+)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorSkillAdoptions;