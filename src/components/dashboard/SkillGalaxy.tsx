import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, TrendingUp, Users, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InDemandSkill } from '@/data/marketData';
import { useDepartment } from '@/contexts/DepartmentContext';
import { getDepartmentData } from '@/data/departmentData';

interface BubbleProps {
  skill: InDemandSkill;
  isSelected: boolean;
  onSelect: (skill: InDemandSkill | null) => void;
}

const Bubble = ({ skill, isSelected, onSelect }: BubbleProps) => {
  // X position: Supply ratio (0.45 - 0.75 range mapped to 5% - 95%)
  const minSupply = 0.40;
  const maxSupply = 0.80;
  const xPos = ((skill.supplyRatio - minSupply) / (maxSupply - minSupply)) * 90 + 5;
  
  // Y position: Demand score (78 - 94 range mapped to 95% - 5% - inverted so high score is at top)
  const minScore = 75;
  const maxScore = 96;
  const yPos = 95 - ((skill.demandScore - minScore) / (maxScore - minScore)) * 90;
  
  // Bubble size based on growth rate (15 - 42 range mapped to 28px - 56px)
  const minGrowth = 15;
  const maxGrowth = 45;
  const normalizedGrowth = (skill.growthRate - minGrowth) / (maxGrowth - minGrowth);
  const bubbleSize = 28 + normalizedGrowth * 28;
  
  // Category colors
  const categoryColors: Record<string, { bg: string; border: string }> = {
    technical: { bg: 'bg-primary/80', border: 'border-primary' },
    domain: { bg: 'bg-success/80', border: 'border-success' },
    soft: { bg: 'bg-warning/80', border: 'border-warning' }
  };

  const colors = categoryColors[skill.category];

  return (
    <div
      className={`
        absolute cursor-pointer transition-all duration-300 ease-out
        rounded-full ${colors.bg} border-2 ${colors.border}
        flex items-center justify-center
        hover:scale-125 hover:z-50 hover:shadow-xl
        ${isSelected ? 'scale-125 z-50 ring-4 ring-primary/40 shadow-xl' : 'shadow-md'}
      `}
      style={{
        width: bubbleSize,
        height: bubbleSize,
        left: `calc(${xPos}% - ${bubbleSize / 2}px)`,
        top: `calc(${yPos}% - ${bubbleSize / 2}px)`,
      }}
      onClick={() => onSelect(isSelected ? null : skill)}
      onMouseEnter={() => onSelect(skill)}
      onMouseLeave={() => !isSelected && onSelect(null)}
    >
      <span className="text-white font-bold text-xs drop-shadow-md">
        {skill.demandScore}
      </span>
    </div>
  );
};

const SkillGalaxy = () => {
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState<InDemandSkill | null>(null);
  const { selectedDepartment } = useDepartment();
  const departmentData = getDepartmentData(selectedDepartment);
  const inDemandSkills = departmentData.inDemandSkills;

  return (
    <Card className="card-shadow hover:card-shadow-lg transition-all relative">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Skill Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chart Container */}
        <div className="relative h-[280px] bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border/50">
          {/* Y-axis label */}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground font-medium whitespace-nowrap">
            Demand Score →
          </div>
          
          {/* X-axis label */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-medium">
            Supply Ratio (Scarce → Abundant) →
          </div>

          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {/* Vertical grid lines */}
            {[20, 40, 60, 80].map((x) => (
              <line
                key={`v-${x}`}
                x1={`${x}%`}
                y1="10%"
                x2={`${x}%`}
                y2="90%"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeDasharray="4 4"
              />
            ))}
            {/* Horizontal grid lines */}
            {[20, 40, 60, 80].map((y) => (
              <line
                key={`h-${y}`}
                x1="10%"
                y1={`${y}%`}
                x2="90%"
                y2={`${y}%`}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeDasharray="4 4"
              />
            ))}
          </svg>

          {/* Axis values */}
          <div className="absolute left-3 top-[10%] text-[10px] text-muted-foreground">95</div>
          <div className="absolute left-3 top-[50%] text-[10px] text-muted-foreground">85</div>
          <div className="absolute left-3 top-[85%] text-[10px] text-muted-foreground">75</div>
          
          <div className="absolute bottom-5 left-[15%] text-[10px] text-muted-foreground">0.45</div>
          <div className="absolute bottom-5 left-[50%] -translate-x-1/2 text-[10px] text-muted-foreground">0.60</div>
          <div className="absolute bottom-5 right-[10%] text-[10px] text-muted-foreground">0.75</div>

          {/* Quadrant labels */}
          <div className="absolute top-4 left-6 text-[10px] font-medium text-destructive/70 bg-destructive/10 px-1.5 py-0.5 rounded">
            High Priority
          </div>
          <div className="absolute top-4 right-6 text-[10px] font-medium text-success/70 bg-success/10 px-1.5 py-0.5 rounded">
            Well Supplied
          </div>

          {/* Bubbles */}
          <div className="absolute inset-0 rounded-xl">
            {inDemandSkills.map((skill) => (
              <Bubble
                key={skill.id}
                skill={skill}
                isSelected={selectedSkill?.id === skill.id}
                onSelect={setSelectedSkill}
              />
            ))}
          </div>
        </div>

        {/* Tooltip - positioned inside card content */}
        {selectedSkill && (
          <div className="absolute top-0 right-0 w-48 p-3 bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-xl animate-scale-in z-[100]">
            <div className="mb-2">
              <h4 className="font-semibold text-sm text-foreground leading-tight">
                {selectedSkill.name}
              </h4>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">
                {selectedSkill.category} skill
              </p>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Demand Score</span>
                <span className="font-semibold text-primary">{selectedSkill.demandScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Supply Ratio</span>
                <span className="font-semibold">{selectedSkill.supplyRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Growth Rate</span>
                <span className="font-semibold text-success">+{selectedSkill.growthRate}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-primary/80 border-2 border-primary" />
              <span className="text-muted-foreground">Technical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-success/80 border-2 border-success" />
              <span className="text-muted-foreground">Domain</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-warning/80 border-2 border-warning" />
              <span className="text-muted-foreground">Soft</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
            <span>→</span>
            <div className="w-4 h-4 rounded-full bg-muted-foreground/50" />
            <span className="ml-1">Growth Rate</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillGalaxy;
