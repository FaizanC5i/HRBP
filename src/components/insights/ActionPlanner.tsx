import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb, Download, Mail, FileSpreadsheet, Users, GraduationCap, Rocket, Plus, X } from 'lucide-react';
import { insightOpportunities } from '@/data/insightsData';
import { toast } from 'sonner';

interface ActionItem {
  id: string;
  play: string;
  owner: string;
  startDate: string;
  endDate: string;
  impactEstimate: string;
  opportunityType: string;
}

const suggestedPlays: Record<string, { icon: any; plays: string[] }> = {
  'AI Opportunity': {
    icon: Rocket,
    plays: ['AI/ML Training Program', 'CRM AI Integration Pilot', 'Sales AI Tools Evaluation', 'AI Coaching Implementation']
  },
  'Tech Adoption Surge': {
    icon: GraduationCap,
    plays: ['Technology Assessment', 'Vendor Selection Process', 'Integration Roadmap', 'Training Rollout']
  },
  'Market Expansion': {
    icon: Users,
    plays: ['Market Entry Strategy', 'Local Partnership Development', 'Regional Team Hiring', 'Localization Initiative']
  },
  'Pain Point Cluster': {
    icon: Lightbulb,
    plays: ['Process Improvement Workshop', 'Customer Journey Mapping', 'Quick Win Implementation', 'Change Management']
  },
  'Automation Potential': {
    icon: Rocket,
    plays: ['Automation Audit', 'RPA Pilot Project', 'Workflow Optimization', 'Integration Development']
  }
};

const ActionPlanner = () => {
  const [roadmap, setRoadmap] = useState<ActionItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');

  const addToRoadmap = (play: string, type: string) => {
    const newItem: ActionItem = {
      id: Date.now().toString(),
      play,
      owner: '',
      startDate: '',
      endDate: '',
      impactEstimate: 'Medium',
      opportunityType: type
    };
    setRoadmap([...roadmap, newItem]);
    toast.success(`Added "${play}" to roadmap`);
  };

  const updateRoadmapItem = (id: string, field: keyof ActionItem, value: string) => {
    setRoadmap(roadmap.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeFromRoadmap = (id: string) => {
    setRoadmap(roadmap.filter(item => item.id !== id));
  };

  const handleExport = (format: 'csv' | 'email' | 'pptx') => {
    toast.success(`Exporting roadmap as ${format.toUpperCase()}...`);
  };

  const opportunityTypes = Object.keys(suggestedPlays);

  return (
    <div className="space-y-6">
      {/* Auto Suggestions */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Suggested Action Plays
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunityTypes.map((type) => {
            const { icon: Icon, plays } = suggestedPlays[type];
            const count = insightOpportunities.filter(o => o.opportunityType === type).length;
            
            return (
              <Card key={type} className="p-4 bg-card border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{type}</span>
                  <Badge variant="outline" className="text-[9px] ml-auto">
                    {count} opps
                  </Badge>
                </div>
                <div className="space-y-2">
                  {plays.map((play) => (
                    <Button
                      key={play}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-8"
                      onClick={() => addToRoadmap(play, type)}
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      {play}
                    </Button>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Roadmap Builder */}
      <Card className="p-4 bg-card border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Action Roadmap</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('email')}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pptx')}>
              <Download className="h-4 w-4 mr-2" />
              PPTX
            </Button>
          </div>
        </div>

        {roadmap.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Rocket className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No action items yet. Add plays from the suggestions above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {roadmap.map((item, index) => (
              <Card key={item.id} className="p-3 bg-muted/30">
                <div className="flex items-start gap-3">
                  <span className="text-lg font-bold text-muted-foreground w-6 pt-1">
                    {index + 1}
                  </span>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-muted-foreground">Play</label>
                      <Input 
                        value={item.play} 
                        onChange={(e) => updateRoadmapItem(item.id, 'play', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">Owner</label>
                      <Input 
                        placeholder="Assign owner"
                        value={item.owner} 
                        onChange={(e) => updateRoadmapItem(item.id, 'owner', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">Start Date</label>
                      <Input 
                        type="date"
                        value={item.startDate} 
                        onChange={(e) => updateRoadmapItem(item.id, 'startDate', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">Impact</label>
                      <Select 
                        value={item.impactEstimate} 
                        onValueChange={(v) => updateRoadmapItem(item.id, 'impactEstimate', v)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => removeFromRoadmap(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="ml-9 mt-1">
                  <Badge variant="outline" className="text-[9px]">
                    {item.opportunityType}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ActionPlanner;
