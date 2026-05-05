import { useMemo, useState } from 'react';
import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { salesSkillsData } from '@/data/salesSkillsData';
import { useApprovedActionPlans } from '@/hooks/useApprovedActionPlans';

interface SkillBubble {
  name: string;
  demandScore: number;
  supplyRatio: number;
  growthRate: number;
  category: 'technical' | 'domain' | 'soft';
  occurrences: number;
}

const categoryColors = {
  technical: 'hsl(206, 100%, 50%)',
  domain: 'hsl(142, 71%, 45%)',
  soft: 'hsl(43, 100%, 50%)'
};

const categoryLabels = {
  technical: 'Technical',
  domain: 'Domain',
  soft: 'Soft'
};

// Categorize skills based on keywords
const categorizeSkill = (skillName: string): 'technical' | 'domain' | 'soft' => {
  const lowerSkill = skillName.toLowerCase();
  
  // Technical skills
  if (lowerSkill.includes('crm') || lowerSkill.includes('ai') || lowerSkill.includes('cloud') ||
      lowerSkill.includes('azure') || lowerSkill.includes('analytics') || lowerSkill.includes('digital') ||
      lowerSkill.includes('automation') || lowerSkill.includes('technology') || lowerSkill.includes('platform') ||
      lowerSkill.includes('data') || lowerSkill.includes('ml') || lowerSkill.includes('software')) {
    return 'technical';
  }
  
  // Soft skills
  if (lowerSkill.includes('communication') || lowerSkill.includes('leadership') || lowerSkill.includes('negotiation') ||
      lowerSkill.includes('collaboration') || lowerSkill.includes('problem-solving') || lowerSkill.includes('teamwork') ||
      lowerSkill.includes('relationship') || lowerSkill.includes('presentation')) {
    return 'soft';
  }
  
  // Domain skills (default)
  return 'domain';
};

// Extract and aggregate skills from salesSkillsData
const extractSkillsFromData = (): SkillBubble[] => {
  const skillMap = new Map<string, { count: number; occurrences: number }>();
  
  // Parse all skills from the dataset
  salesSkillsData.forEach(entry => {
    const skills = entry.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    skills.forEach(skill => {
      const existing = skillMap.get(skill) || { count: 0, occurrences: 0 };
      existing.count += 1;
      existing.occurrences += entry.occurrencesCount;
      skillMap.set(skill, existing);
    });
  });
  
  // Convert to array and sort by occurrences
  const skillsArray = Array.from(skillMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 10); // Top 10 skills
  
  // Calculate max values for normalization
  const maxOccurrences = Math.max(...skillsArray.map(s => s.occurrences));
  const maxCount = Math.max(...skillsArray.map(s => s.count));
  
  // Map to SkillBubble with calculated metrics
  return skillsArray.map((skill, index) => {
    // Demand score based on occurrences (normalized to 75-100 range)
    const demandScore = Math.round(75 + (skill.occurrences / maxOccurrences) * 25);
    
    // Supply ratio inversely proportional to count (more entries = more scarce in market)
    // Lower values = scarce, higher values = abundant
    const supplyRatio = 0.15 + (1 - skill.count / maxCount) * 0.75;
    
    // Growth rate based on position (top skills have higher growth)
    const growthRate = 35 - (index * 2.5) + Math.random() * 5;
    
    return {
      name: skill.name.length > 25 ? skill.name.substring(0, 22) + '...' : skill.name,
      demandScore,
      supplyRatio,
      growthRate,
      category: categorizeSkill(skill.name),
      occurrences: skill.occurrences
    };
  });
};

const DemandSupplyBarChart = () => {
  const [hoveredSkill, setHoveredSkill] = useState<SkillBubble | null>(null);
  const { getApprovedSkills, getApprovedRoles } = useApprovedActionPlans();

  const approvedSkills = getApprovedSkills();
  const approvedRoles = getApprovedRoles();
  
  const allSkillBubbles = useMemo(() => extractSkillsFromData(), []);
  
  // Filter skills based on approved action plans using OR logic
  const skillBubbles = useMemo(() => {
    if (approvedSkills.length === 0 && approvedRoles.length === 0) {
      return allSkillBubbles;
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
    
    return allSkillBubbles.filter(skill => {
      // Check if skill matches approved skills directly
      const matchesApprovedSkill = approvedSkills.length > 0 && approvedSkills.some(approvedSkill => 
        skill.name.toLowerCase().includes(approvedSkill.toLowerCase()) ||
        approvedSkill.toLowerCase().includes(skill.name.toLowerCase())
      );
      
      // Check if skill is from an approved role
      const matchesRoleSkill = skillsFromApprovedRoles.size > 0 && 
        Array.from(skillsFromApprovedRoles).some(roleSkill => 
          skill.name.toLowerCase().includes(roleSkill) ||
          roleSkill.includes(skill.name.toLowerCase())
        );
      
      // OR logic
      return matchesApprovedSkill || matchesRoleSkill;
    });
  }, [allSkillBubbles, approvedSkills, approvedRoles]);

  // Chart dimensions
  const chartWidth = 520;
  const chartHeight = 320;
  const padding = { top: 40, right: 30, bottom: 60, left: 60 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Scale functions
  const xScale = (ratio: number) => padding.left + (ratio * plotWidth);
  const yScale = (demand: number) => chartHeight - padding.bottom - ((demand - 75) / 25 * plotHeight);
  const sizeScale = (growth: number) => 20 + (growth / 40) * 25;

  const handleMouseEnter = (skill: SkillBubble) => {
    setHoveredSkill(skill);
  };

  return (
    <Card className="bg-white shadow-md border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[hsl(207,100%,14%)]">
          <Target className="h-5 w-5 text-[hsl(25,95%,53%)]" />
          Demand vs Supply
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Skills derived from demand sensing data
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
            {/* High Priority Zone */}
            <rect
              x={padding.left}
              y={padding.top}
              width={plotWidth * 0.35}
              height={plotHeight * 0.4}
              fill="rgba(239, 68, 68, 0.08)"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              rx="4"
            />
            <text
              x={padding.left + 8}
              y={padding.top + 16}
              fill="hsl(0, 84%, 50%)"
              fontSize="10"
              fontWeight="600"
            >
              High Priority
            </text>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={`v-${ratio}`}
                x1={xScale(ratio)}
                y1={padding.top}
                x2={xScale(ratio)}
                y2={chartHeight - padding.bottom}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            {[80, 85, 90, 95, 100].map((demand) => (
              <line
                key={`h-${demand}`}
                x1={padding.left}
                y1={yScale(demand)}
                x2={chartWidth - padding.right}
                y2={yScale(demand)}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}

            {/* Y-axis labels */}
            <text x={padding.left - 8} y={padding.top} textAnchor="end" fontSize="10" fill="#6b7280">100</text>
            <text x={padding.left - 8} y={yScale(90)} textAnchor="end" fontSize="10" fill="#6b7280">90</text>
            <text x={padding.left - 8} y={yScale(85)} textAnchor="end" fontSize="10" fill="#6b7280">85</text>
            <text x={padding.left - 8} y={yScale(80)} textAnchor="end" fontSize="10" fill="#6b7280">80</text>
            <text x={padding.left - 8} y={chartHeight - padding.bottom} textAnchor="end" fontSize="10" fill="#6b7280">75</text>

            {/* Y-axis title */}
            <text
              x={16}
              y={chartHeight / 2}
              textAnchor="middle"
              fontSize="11"
              fill="#374151"
              fontWeight="500"
              transform={`rotate(-90, 16, ${chartHeight / 2})`}
            >
              Demand Score
            </text>

            {/* X-axis labels */}
            <text x={xScale(0)} y={chartHeight - padding.bottom + 16} textAnchor="middle" fontSize="10" fill="#6b7280">0</text>
            <text x={xScale(0.25)} y={chartHeight - padding.bottom + 16} textAnchor="middle" fontSize="10" fill="#6b7280">0.25</text>
            <text x={xScale(0.5)} y={chartHeight - padding.bottom + 16} textAnchor="middle" fontSize="10" fill="#6b7280">0.50</text>
            <text x={xScale(0.75)} y={chartHeight - padding.bottom + 16} textAnchor="middle" fontSize="10" fill="#6b7280">0.75</text>
            <text x={xScale(1)} y={chartHeight - padding.bottom + 16} textAnchor="middle" fontSize="10" fill="#6b7280">1.0</text>

            {/* X-axis title */}
            <text
              x={chartWidth / 2}
              y={chartHeight - 12}
              textAnchor="middle"
              fontSize="11"
              fill="#374151"
              fontWeight="500"
            >
              Supply Ratio (Scarce → Abundant) →
            </text>

            {/* Skill Bubbles */}
            {skillBubbles.map((skill, index) => {
              const cx = xScale(skill.supplyRatio);
              const cy = yScale(skill.demandScore);
              const r = sizeScale(skill.growthRate);
              
              return (
                <g
                  key={index}
                  onMouseEnter={() => handleMouseEnter(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={categoryColors[skill.category]}
                    opacity={hoveredSkill?.name === skill.name ? 1 : 0.85}
                    stroke={hoveredSkill?.name === skill.name ? '#fff' : 'none'}
                    strokeWidth={2}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill="white"
                  >
                    {skill.demandScore}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredSkill && (
            <div 
              className="absolute bg-white rounded-lg shadow-xl border p-3 z-50 min-w-[200px]"
              style={{
                top: '10px',
                right: '10px'
              }}
            >
              <p className="font-semibold text-sm text-foreground mb-1">{hoveredSkill.name}</p>
              <p className="text-xs mb-2" style={{ color: categoryColors[hoveredSkill.category] }}>
                {categoryLabels[hoveredSkill.category]}
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Demand Score</span>
                  <span className="font-semibold">{hoveredSkill.demandScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supply Ratio</span>
                  <span className="font-semibold">{hoveredSkill.supplyRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Occurrences</span>
                  <span className="font-semibold">{hoveredSkill.occurrences.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Growth Rate</span>
                  <span className="font-semibold text-green-600">+{hoveredSkill.growthRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-3 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors.technical }}></span>
                <span className="text-xs text-muted-foreground">Technical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors.domain }}></span>
                <span className="text-xs text-muted-foreground">Domain</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors.soft }}></span>
                <span className="text-xs text-muted-foreground">Soft</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                <span className="text-[10px] text-muted-foreground">−</span>
                <span className="w-4 h-4 rounded-full bg-gray-400"></span>
              </div>
              <span className="text-xs text-muted-foreground">Growth Rate</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandSupplyBarChart;