import { useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Available skillsets
const AVAILABLE_SKILLS = [
  'Cloud Solutions (AWS/Azure/GCP)',
  'AI/ML in Sales Processes',
  'CRM Tools (Salesforce)',
  'Account Management',
  'Customer Trust Building',
  'Digital Transformation',
  'Sales Analytics',
  'Remote Sales Methodologies',
  'Partner Collaboration',
  'SMB Market Expertise',
];

// Available training programs
const TRAINING_PROGRAMS = [
  'AWS Cloud Practitioner Certification',
  'Azure Sales Specialist',
  'Cloud Solution Selling',
  'Microsoft Azure Fundamentals (AZ-900)',
  'Azure AI Fundamentals (AI-900)',
  'Power BI Data Analyst (PL-300)',
  'Salesforce Administrator',
  'Google Cloud Sales Credential',
  'Digital Sales Methodology',
  'Enterprise Account Management',
];

interface ApprovalButtonProps {
  roleId: string;
  roleName: string;
  skillsRequired: string[];
  trendReason: string;
  sourceDataSummary: string;
  isApproved: boolean;
  onApprove: (data: {
    roleId: string;
    roleName: string;
    skillsRequired: string[];
    trendReason: string;
    sourceDataSummary: string;
    approvedBy: string;
    priority: 'high' | 'medium' | 'low';
    notes?: string;
    selectedSkills?: string[];
    selectedPrograms?: string[];
  }) => void;
}

export const ApprovalButton = ({
  roleId,
  roleName,
  skillsRequired,
  trendReason,
  sourceDataSummary,
  isApproved,
  onApprove,
}: ApprovalButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const { toast } = useToast();

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleProgramToggle = (program: string) => {
    setSelectedPrograms(prev => 
      prev.includes(program) 
        ? prev.filter(p => p !== program)
        : [...prev, program]
    );
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onApprove({
      roleId,
      roleName,
      skillsRequired: selectedSkills.length > 0 ? selectedSkills : skillsRequired,
      trendReason,
      sourceDataSummary,
      approvedBy: 'HRBP Admin',
      priority,
      notes: notes || undefined,
      selectedSkills,
      selectedPrograms,
    });

    setIsSubmitting(false);
    setIsDialogOpen(false);
    setNotes('');
    setPriority('medium');
    setSelectedSkills([]);
    setSelectedPrograms([]);

    toast({
      title: "Opportunity Approved! ✓",
      description: `${roleName} has been added to your approved opportunities.`,
    });
  };

  if (isApproved) {
    return (
      <Button 
        disabled 
        className="bg-success/20 text-success border border-success/30 cursor-default"
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Approved
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        className={cn(
          "bg-gradient-to-r from-accent to-chart-2 text-white",
          "hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        )}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Approve as Business Opportunity
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              Approve Business Opportunity
            </DialogTitle>
            <DialogDescription>
              You're about to approve <strong>{roleName}</strong> as a business opportunity. This will add it to your tracking dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select value={priority} onValueChange={(v: 'high' | 'medium' | 'low') => setPriority(v)}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-destructive" />
                      High Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-warning" />
                      Medium Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                      Low Priority
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Skillset Multi-select */}
            <div className="space-y-2">
              <Label>Skillset</Label>
              <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={skillsOpen}
                    className="w-full justify-between bg-background font-normal"
                  >
                    {selectedSkills.length === 0 
                      ? "Select skills..." 
                      : `${selectedSkills.length} skill(s) selected`}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-background z-50" align="start">
                  <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                    {AVAILABLE_SKILLS.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        <Checkbox
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <span className="text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedSkills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className="text-xs cursor-pointer hover:bg-destructive/20"
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill.split(' ').slice(0, 2).join(' ')}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Training Programs Multi-select */}
            <div className="space-y-2">
              <Label>Training Programs</Label>
              <Popover open={programsOpen} onOpenChange={setProgramsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={programsOpen}
                    className="w-full justify-between bg-background font-normal"
                  >
                    {selectedPrograms.length === 0 
                      ? "Select training programs..." 
                      : `${selectedPrograms.length} program(s) selected`}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-background z-50" align="start">
                  <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                    {TRAINING_PROGRAMS.map((program) => (
                      <div
                        key={program}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => handleProgramToggle(program)}
                      >
                        <Checkbox
                          checked={selectedPrograms.includes(program)}
                          onCheckedChange={() => handleProgramToggle(program)}
                        />
                        <span className="text-sm">{program}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {selectedPrograms.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedPrograms.map((program) => (
                    <Badge 
                      key={program} 
                      variant="secondary" 
                      className="text-xs cursor-pointer hover:bg-destructive/20"
                      onClick={() => handleProgramToggle(program)}
                    >
                      {program.split(' ').slice(0, 3).join(' ')}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes about this opportunity..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium">What will be saved:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Role: {roleName}</li>
                <li>• Skills: {selectedSkills.length > 0 
                  ? selectedSkills.slice(0, 3).join(', ') + (selectedSkills.length > 3 ? '...' : '')
                  : skillsRequired.slice(0, 3).join(', ') + (skillsRequired.length > 3 ? '...' : '')
                }</li>
                <li>• Training: {selectedPrograms.length > 0 
                  ? selectedPrograms.slice(0, 2).join(', ') + (selectedPrograms.length > 2 ? '...' : '')
                  : 'None selected'
                }</li>
                <li>• Trend Reason: {trendReason.slice(0, 80)}...</li>
                <li>• Approval Date & Approver</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApprove} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-accent to-chart-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm Approval
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
