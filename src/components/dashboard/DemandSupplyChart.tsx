import { useState, useMemo } from 'react';
import { Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { salesSkillsData } from '@/data/salesSkillsData';
import { employees } from '@/data/employeeData';
import { useApprovedActionPlans } from '@/hooks/useApprovedActionPlans';

interface SkillGap {
  skillName: string;
  marketDemand: number;
  internalSupply: number;
  gap: number;
  criticalityLevel: 'critical' | 'high' | 'medium' | 'low';
  employeesWithSkill: number;
  avgProficiency: number;
}

// Extract skill gaps by comparing market demand from salesSkillsData with internal employee skills
const calculateSkillGaps = (): SkillGap[] => {
  // Get market skills from demand sensing data
  const marketSkillMap = new Map<string, number>();
  
  salesSkillsData.forEach(entry => {
    const skills = entry.skills.split(',').map(s => s.trim()).filter(s => s.length > 0 && s.length < 35);
    skills.forEach(skill => {
      marketSkillMap.set(skill, (marketSkillMap.get(skill) || 0) + entry.occurrencesCount);
    });
  });
  
  // Get top 10 market skills
  const topMarketSkills = Array.from(marketSkillMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const maxMarketOccurrences = topMarketSkills[0]?.[1] || 1;
  
  // Calculate skill gaps
  return topMarketSkills.map(([skillName, occurrences]) => {
    // Find employees with this skill
    const employeesWithSkill = employees.filter(emp => 
      emp.skills.some(s => 
        s.name.toLowerCase().includes(skillName.toLowerCase().substring(0, 10)) ||
        skillName.toLowerCase().includes(s.name.toLowerCase().substring(0, 10))
      )
    );
    
    // Calculate average proficiency of employees with this skill
    const avgProficiency = employeesWithSkill.length > 0
      ? Math.round(employeesWithSkill.reduce((acc, emp) => {
          const matchingSkill = emp.skills.find(s => 
            s.name.toLowerCase().includes(skillName.toLowerCase().substring(0, 10)) ||
            skillName.toLowerCase().includes(s.name.toLowerCase().substring(0, 10))
          );
          return acc + (matchingSkill?.score || 50);
        }, 0) / employeesWithSkill.length)
      : 35;
    
    // Normalize market demand to 0-100
    const marketDemand = Math.round((occurrences / maxMarketOccurrences) * 100);
    
    // Internal supply based on employee count and proficiency
    const internalSupply = Math.min(100, Math.round(
      (employeesWithSkill.length / employees.length) * 100 * (avgProficiency / 100) * 2
    ));
    
    // Gap calculation
    const gap = Math.max(0, marketDemand - internalSupply);
    
    // Criticality based on gap size and market demand
    let criticalityLevel: 'critical' | 'high' | 'medium' | 'low';
    if (gap > 50 && marketDemand > 70) {
      criticalityLevel = 'critical';
    } else if (gap > 35 || marketDemand > 80) {
      criticalityLevel = 'high';
    } else if (gap > 20) {
      criticalityLevel = 'medium';
    } else {
      criticalityLevel = 'low';
    }
    
    return {
      skillName: skillName.length > 30 ? skillName.substring(0, 28) + '...' : skillName,
      marketDemand,
      internalSupply,
      gap,
      criticalityLevel,
      employeesWithSkill: employeesWithSkill.length,
      avgProficiency
    };
  });
};

const DemandSupplyChart = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getApprovedSkills, getApprovedRoles } = useApprovedActionPlans();
  
  const approvedSkills = getApprovedSkills();
  const approvedRoles = getApprovedRoles();
  const allSkillGaps = useMemo(() => calculateSkillGaps(), []);
  
  // Filter skill gaps based on approved action plans using OR logic
  const skillGapAnalysis = useMemo(() => {
    if (approvedSkills.length === 0 && approvedRoles.length === 0) {
      return allSkillGaps;
    }
    
    // Get skills associated with approved roles
    const skillsFromApprovedRoles = new Set<string>();
    if (approvedRoles.length > 0) {
      salesSkillsData.forEach(entry => {
        const matchesRole = approvedRoles.some(role => 
          entry.mainRole.toLowerCase().includes(role.toLowerCase()) ||
          role.toLowerCase().includes(entry.mainRole.toLowerCase())
        );
        if (matchesRole) {
          entry.skills.split(',').map(s => s.trim()).forEach(s => skillsFromApprovedRoles.add(s.toLowerCase()));
        }
      });
    }
    
    return allSkillGaps.filter(gap => {
      // Check if skill matches approved skills directly
      const matchesApprovedSkill = approvedSkills.length > 0 && approvedSkills.some(approvedSkill => 
        gap.skillName.toLowerCase().includes(approvedSkill.toLowerCase()) ||
        approvedSkill.toLowerCase().includes(gap.skillName.toLowerCase())
      );
      
      // Check if skill is from an approved role
      const matchesRoleSkill = skillsFromApprovedRoles.size > 0 && 
        Array.from(skillsFromApprovedRoles).some(roleSkill => 
          gap.skillName.toLowerCase().includes(roleSkill) ||
          roleSkill.includes(gap.skillName.toLowerCase())
        );
      
      // OR logic
      return matchesApprovedSkill || matchesRoleSkill;
    });
  }, [allSkillGaps, approvedSkills, approvedRoles]);

  // Summary stats for the card
  const criticalCount = skillGapAnalysis.filter(g => g.criticalityLevel === 'critical').length;
  const highCount = skillGapAnalysis.filter(g => g.criticalityLevel === 'high').length;
  const avgGap = Math.round(skillGapAnalysis.reduce((acc, g) => acc + g.gap, 0) / skillGapAnalysis.length);

  return (
    <>
      <div 
        className="bg-white rounded-lg p-4 border-l-4 border-l-[hsl(25,95%,53%)] shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide truncate text-[hsl(25,95%,40%)]">
              Skill Map
            </p>
            <p className="text-2xl font-bold text-[hsl(207,100%,14%)] mt-1">{avgGap}%</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Avg Gap</span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(25,95%,53%)] to-[hsl(25,95%,63%)]">
            <Target className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs mt-2">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-destructive"></span>
            <span className="text-muted-foreground">{criticalCount} Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            <span className="text-muted-foreground">{highCount} High</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          Derived from demand sensing data
        </p>
        <p className="text-[10px] text-primary mt-1 opacity-70 hover:opacity-100 transition-opacity">
          Click for details →
        </p>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-chart-4" />
              Skill Need Details
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground mb-4">
            Skills and gaps derived from demand sensing dataset compared with internal employee skills
          </p>
          <div className="space-y-3">
            {skillGapAnalysis.map((gap) => (
              <div key={gap.skillName} className="space-y-2 p-3 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{gap.skillName}</span>
                    <Badge 
                      variant={
                        gap.criticalityLevel === 'critical' ? 'destructive' :
                        gap.criticalityLevel === 'high' ? 'default' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {gap.criticalityLevel}
                    </Badge>
                  </div>
                  <span className="text-sm font-semibold">Need: {gap.gap}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full flex">
                      <div 
                        className="h-full bg-accent"
                        style={{ width: `${gap.internalSupply}%` }}
                      />
                      <div 
                        className="h-full bg-chart-4/50"
                        style={{ width: `${gap.gap}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground w-16 text-right">
                    {gap.internalSupply} / {gap.marketDemand}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {gap.employeesWithSkill} employees • Avg proficiency: {gap.avgProficiency}%
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DemandSupplyChart;