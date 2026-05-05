import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ClipboardList, 
  Flag, 
  Users, 
  Send, 
  AlertCircle, 
  Calendar,
  Building2,
  UserCheck,
  Shield,
  FileText,
  Target,
  Clock,
  DollarSign,
  Plus,
  X,
  CheckCircle2
} from 'lucide-react';
import { InsightOpportunity } from '@/data/insightsData';
import { toast } from '@/hooks/use-toast';
import { useApprovedActionPlans } from '@/hooks/useApprovedActionPlans';

interface ActionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: InsightOpportunity;
}

interface ApprovalLevel {
  id: string;
  level: string;
  approver: string;
  status: 'pending' | 'sent' | 'approved';
}

interface ExternalValidation {
  id: string;
  team: string;
  contact: string;
  status: 'pending' | 'sent' | 'validated';
}

const ActionPlanDialog = ({ open, onOpenChange, opportunity }: ActionPlanDialogProps) => {
  const { addActionPlan } = useApprovedActionPlans();
  
  const [priority, setPriority] = useState<string>('high');
  const [businessJustification, setBusinessJustification] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [riskMitigation, setRiskMitigation] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  const [approvalLevels, setApprovalLevels] = useState<ApprovalLevel[]>([
    { id: '1', level: 'L1 - Direct Manager', approver: '', status: 'pending' },
    { id: '2', level: 'L2 - Department Head', approver: '', status: 'pending' },
  ]);
  
  const [externalValidations, setExternalValidations] = useState<ExternalValidation[]>([
    { id: '1', team: 'Finance', contact: '', status: 'pending' },
  ]);

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const skillOptions = ['Sales Strategy', 'AI/ML Integration', 'Digital Transformation', 'Customer Analytics', 'Revenue Operations'];
  const actionOptions = ['Training Program', 'Hiring Initiative', 'Process Redesign', 'Technology Upgrade', 'Partnership Development'];
  const roleOptions = ['Sales Manager', 'Account Executive', 'Business Development Rep', 'Sales Operations Analyst', 'Revenue Manager', 'Customer Success Manager'];

  const addApprovalLevel = () => {
    const newLevel: ApprovalLevel = {
      id: Date.now().toString(),
      level: `L${approvalLevels.length + 1} - Custom Level`,
      approver: '',
      status: 'pending'
    };
    setApprovalLevels([...approvalLevels, newLevel]);
  };

  const removeApprovalLevel = (id: string) => {
    setApprovalLevels(approvalLevels.filter(l => l.id !== id));
  };

  const updateApprovalLevel = (id: string, field: 'level' | 'approver', value: string) => {
    setApprovalLevels(approvalLevels.map(l => 
      l.id === id ? { ...l, [field]: value } : l
    ));
  };

  const addExternalValidation = () => {
    const newValidation: ExternalValidation = {
      id: Date.now().toString(),
      team: '',
      contact: '',
      status: 'pending'
    };
    setExternalValidations([...externalValidations, newValidation]);
  };

  const removeExternalValidation = (id: string) => {
    setExternalValidations(externalValidations.filter(v => v.id !== id));
  };

  const updateExternalValidation = (id: string, field: 'team' | 'contact', value: string) => {
    setExternalValidations(externalValidations.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleAction = (action: string) => {
    setSelectedActions(prev => 
      prev.includes(action) ? prev.filter(a => a !== action) : [...prev, action]
    );
  };

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = () => {
    // Save to approved action plans for filtering across pages
    addActionPlan({
      opportunityTitle: opportunity.title,
      selectedSkills,
      selectedRoles,
      selectedActions,
      priority,
      estimatedBudget,
      timeline,
      businessJustification,
      expectedOutcome,
    });
    
    toast({
      title: "Action Plan Created",
      description: `Action plan for "${opportunity.title}" has been created and sent for approval.`,
    });
    onOpenChange(false);
  };

  const handleSendForApproval = () => {
    setApprovalLevels(approvalLevels.map(l => ({ ...l, status: 'sent' as const })));
    toast({
      title: "Sent for Approval",
      description: "Action plan has been sent to all approval levels.",
    });
  };

  const handleSendForValidation = () => {
    setExternalValidations(externalValidations.map(v => ({ ...v, status: 'sent' as const })));
    toast({
      title: "Sent for Validation",
      description: "Action plan has been sent to external teams for validation.",
    });
  };

  const getPriorityColor = (p: string) => {
    if (p === 'critical') return 'bg-rose-500';
    if (p === 'high') return 'bg-orange-500';
    if (p === 'medium') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg">Create Action Plan</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">{opportunity.title}</p>
            </div>
            <Badge className={`${getPriorityColor(priority)} text-[10px]`}>
              {priority.toUpperCase()} Priority
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="px-6 py-4 space-y-6">
            {/* Priority & Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1.5">
                  <Flag className="h-3.5 w-3.5" />
                  Priority Level
                </Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  Estimated Budget
                </Label>
                <Input 
                  className="h-9 text-sm"
                  placeholder="e.g., $50,000 - $100,000"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Timeline
                </Label>
                <Select value={timeline} onValueChange={setTimeline}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (0-30 days)</SelectItem>
                    <SelectItem value="short">Short-term (1-3 months)</SelectItem>
                    <SelectItem value="medium">Medium-term (3-6 months)</SelectItem>
                    <SelectItem value="long">Long-term (6-12 months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* HRBP Inputs Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                HRBP Inputs & Justification
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Business Justification *</Label>
                  <Textarea 
                    className="text-sm min-h-[80px]"
                    placeholder="Explain why this action plan is critical for the business..."
                    value={businessJustification}
                    onChange={(e) => setBusinessJustification(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Expected Outcome</Label>
                  <Textarea 
                    className="text-sm min-h-[60px]"
                    placeholder="Describe the expected outcomes and success metrics..."
                    value={expectedOutcome}
                    onChange={(e) => setExpectedOutcome(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Risk Mitigation Strategy</Label>
                  <Textarea 
                    className="text-sm min-h-[60px]"
                    placeholder="How will potential risks be mitigated..."
                    value={riskMitigation}
                    onChange={(e) => setRiskMitigation(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Skills, Roles & Actions Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-cyan-500" />
                  Target Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map(skill => (
                    <Badge 
                      key={skill}
                      variant={selectedSkills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer text-[10px] transition-all"
                      onClick={() => toggleSkill(skill)}
                    >
                      {selectedSkills.includes(skill) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-500" />
                  Recommended Roles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {roleOptions.map(role => (
                    <Badge 
                      key={role}
                      variant={selectedRoles.includes(role) ? "default" : "outline"}
                      className="cursor-pointer text-[10px] transition-all"
                      onClick={() => toggleRole(role)}
                    >
                      {selectedRoles.includes(role) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-purple-500" />
                  Recommended Actions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {actionOptions.map(action => (
                    <Badge 
                      key={action}
                      variant={selectedActions.includes(action) ? "default" : "outline"}
                      className="cursor-pointer text-[10px] transition-all"
                      onClick={() => toggleAction(action)}
                    >
                      {selectedActions.includes(action) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Approval Workflow */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-500" />
                  Approval Workflow
                </h3>
                <Button variant="outline" size="sm" onClick={addApprovalLevel} className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Level
                </Button>
              </div>

              <div className="space-y-3">
                {approvalLevels.map((level, index) => (
                  <Card key={level.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          className="h-8 text-xs"
                          placeholder="Approval Level"
                          value={level.level}
                          onChange={(e) => updateApprovalLevel(level.id, 'level', e.target.value)}
                        />
                        <Input
                          className="h-8 text-xs"
                          placeholder="Approver Name/Email"
                          value={level.approver}
                          onChange={(e) => updateApprovalLevel(level.id, 'approver', e.target.value)}
                        />
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-[9px] ${
                          level.status === 'sent' ? 'bg-amber-500/10 text-amber-500 border-amber-500' :
                          level.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500' :
                          ''
                        }`}
                      >
                        {level.status.toUpperCase()}
                      </Badge>
                      {approvalLevels.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => removeApprovalLevel(level.id)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full h-8 text-xs"
                onClick={handleSendForApproval}
              >
                <Send className="h-3.5 w-3.5 mr-2" />
                Send to All Approval Levels
              </Button>
            </div>

            <Separator />

            {/* External Validation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-indigo-500" />
                  External Team Validation
                </h3>
                <Button variant="outline" size="sm" onClick={addExternalValidation} className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Team
                </Button>
              </div>

              <div className="space-y-3">
                {externalValidations.map((validation) => (
                  <Card key={validation.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-indigo-500/10">
                        <Users className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Select 
                          value={validation.team} 
                          onValueChange={(value) => updateExternalValidation(validation.id, 'team', value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select Team" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                            <SelectItem value="IT">IT / Technology</SelectItem>
                            <SelectItem value="Compliance">Compliance</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Sales">Sales Leadership</SelectItem>
                            <SelectItem value="Procurement">Procurement</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          className="h-8 text-xs"
                          placeholder="Contact Person/Email"
                          value={validation.contact}
                          onChange={(e) => updateExternalValidation(validation.id, 'contact', e.target.value)}
                        />
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-[9px] ${
                          validation.status === 'sent' ? 'bg-amber-500/10 text-amber-500 border-amber-500' :
                          validation.status === 'validated' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500' :
                          ''
                        }`}
                      >
                        {validation.status.toUpperCase()}
                      </Badge>
                      {externalValidations.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => removeExternalValidation(validation.id)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full h-8 text-xs"
                onClick={handleSendForValidation}
              >
                <Shield className="h-3.5 w-3.5 mr-2" />
                Send for External Validation
              </Button>
            </div>

            <Separator />

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                Additional Notes
              </Label>
              <Textarea 
                className="text-sm min-h-[60px]"
                placeholder="Any additional comments, attachments references, or special instructions..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-xs">
            Cancel
          </Button>
          <Button variant="secondary" className="text-xs">
            <Calendar className="h-3.5 w-3.5 mr-2" />
            Save as Draft
          </Button>
          <Button onClick={handleSubmit} className="text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
            Submit Action Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionPlanDialog;
