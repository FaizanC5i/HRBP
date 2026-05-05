import { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Rocket, Play, GitBranch, Hand, GripVertical, RotateCcw, Info } from 'lucide-react';
import { toast } from 'sonner';

interface OpportunityItem {
  id: string;
  name: string;
  opportunityScore: number;
  quadrant: 'invest' | 'shift' | 'stop' | 'accelerate';
}

interface DraggableDecisionMatrixProps {
  opportunities: OpportunityItem[];
  onQuadrantChange?: (id: string, newQuadrant: 'invest' | 'shift' | 'stop' | 'accelerate') => void;
  getQuadrantColor: (quadrant: string) => string;
  onOpportunityClick: (opp: OpportunityItem) => void;
}

const quadrantConfig = {
  invest: {
    icon: Rocket,
    label: 'INVEST',
    description: 'High Value, Easy',
    color: 'chart-2'
  },
  accelerate: {
    icon: Play,
    label: 'ACCELERATE',
    description: 'High Value, Hard',
    color: 'chart-1'
  },
  shift: {
    icon: GitBranch,
    label: 'SHIFT',
    description: 'Low Value, Easy',
    color: 'chart-3'
  },
  stop: {
    icon: Hand,
    label: 'STOP',
    description: 'Low Value, Hard',
    color: 'chart-5'
  }
};

export const DraggableDecisionMatrix = ({ 
  opportunities, 
  onQuadrantChange,
  getQuadrantColor,
  onOpportunityClick
}: DraggableDecisionMatrixProps) => {
  const [overrides, setOverrides] = useState<Record<string, 'invest' | 'shift' | 'stop' | 'accelerate'>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverQuadrant, setDragOverQuadrant] = useState<string | null>(null);

  const getEffectiveQuadrant = (opp: OpportunityItem) => {
    return overrides[opp.id] || opp.quadrant;
  };

  const handleDragStart = (e: React.DragEvent, oppId: string) => {
    setDraggedItem(oppId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', oppId);
  };

  const handleDragOver = (e: React.DragEvent, quadrant: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverQuadrant(quadrant);
  };

  const handleDragLeave = () => {
    setDragOverQuadrant(null);
  };

  const handleDrop = (e: React.DragEvent, newQuadrant: 'invest' | 'shift' | 'stop' | 'accelerate') => {
    e.preventDefault();
    const oppId = e.dataTransfer.getData('text/plain');
    
    if (oppId && draggedItem) {
      setOverrides(prev => ({ ...prev, [oppId]: newQuadrant }));
      onQuadrantChange?.(oppId, newQuadrant);
      toast.success(`Moved to ${newQuadrant.toUpperCase()} quadrant`, {
        description: 'Manual override applied'
      });
    }
    
    setDraggedItem(null);
    setDragOverQuadrant(null);
  };

  const handleReset = () => {
    setOverrides({});
    toast.info('Decision matrix reset to auto-placement');
  };

  const hasOverrides = Object.keys(overrides).length > 0;

  const renderQuadrant = (quadrant: 'invest' | 'shift' | 'stop' | 'accelerate') => {
    const config = quadrantConfig[quadrant];
    const Icon = config.icon;
    const items = opportunities.filter(o => getEffectiveQuadrant(o) === quadrant).slice(0, 5);
    const isDropTarget = dragOverQuadrant === quadrant;
    
    return (
      <div 
        className={`p-3 transition-all ${
          isDropTarget ? 'ring-2 ring-primary ring-inset bg-primary/10' : `bg-${config.color}/5`
        }`}
        onDragOver={(e) => handleDragOver(e, quadrant)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, quadrant)}
      >
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`h-4 w-4 text-${config.color}`} />
          <span className={`text-xs font-semibold text-${config.color}`}>{config.label}</span>
          <span className="text-[9px] text-muted-foreground">({config.description})</span>
        </div>
        <div className="flex flex-wrap gap-1.5 min-h-[32px]">
          {items.map(opp => {
            const isOverridden = overrides[opp.id] !== undefined;
            return (
              <Badge 
                key={opp.id}
                variant="outline"
                className={`text-[9px] cursor-grab active:cursor-grabbing hover:bg-${config.color}/10 border-${config.color}/30 ${
                  isOverridden ? 'ring-1 ring-primary' : ''
                } ${draggedItem === opp.id ? 'opacity-50' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, opp.id)}
                onClick={() => onOpportunityClick(opp as any)}
              >
                <GripVertical className="h-2.5 w-2.5 mr-0.5 text-muted-foreground" />
                {opp.name.length > 12 ? opp.name.slice(0, 12) + '..' : opp.name}
                {isOverridden && <span className="ml-1 text-primary">*</span>}
              </Badge>
            );
          })}
          {items.length === 0 && (
            <span className="text-[9px] text-muted-foreground italic">Drop items here</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">Drag items between quadrants to override auto-placement. Items with * have been manually moved.</p>
            </TooltipContent>
          </Tooltip>
          {hasOverrides && (
            <Badge variant="secondary" className="text-[8px] h-4">
              {Object.keys(overrides).length} override(s)
            </Badge>
          )}
        </div>
        {hasOverrides && (
          <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={handleReset}>
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-px bg-border rounded-lg overflow-hidden">
        {renderQuadrant('invest')}
        {renderQuadrant('accelerate')}
        {renderQuadrant('shift')}
        {renderQuadrant('stop')}
      </div>
    </div>
  );
};
