import { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  GraduationCap,
  Users,
  Award,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  TrendingUp,
  AlertCircle,
  BookOpen,
  LayoutGrid,
  List,
  Filter,
  CheckSquare,
  Send,
  MessageSquare,
  DollarSign,
  Timer,
  CheckCircle,
  Circle,
  ClipboardList,
  Flag,
  Target,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import MetricCard from '@/components/ui/metric-card';
import { useApprovedTraining, ApprovedTrainingEmployee } from '@/hooks/useApprovedTraining';
import { getStoredOpportunities } from '@/hooks/useApprovedOpportunities';
import { useApprovedActionPlans, ApprovedActionPlan } from '@/hooks/useApprovedActionPlans';
import { useDepartment } from '@/contexts/DepartmentContext';
import { getDepartmentData } from '@/data/departmentData';
import { toast } from 'sonner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';


// Employee skills data (current skills)
const employeeSkillsMap: Record<string, string[]> = {
  'EMP002': ['CRM Tools', 'Customer Engagement', 'Remote Sales'],
  'EMP004': ['Team Leadership', 'Sales Analytics', 'CRM Tools', 'Partner Management'],
  'EMP009': ['Cloud Sales', 'Customer Engagement', 'CRM Tools', 'Remote Sales'],
  'EMP010': ['CRM Tools', 'Customer Engagement', 'Remote Sales'],
  'EMP012': ['Partner Management', 'B2B Sales', 'Team Leadership', 'Customer Engagement'],
  'EMP007': ['Sales Analytics', 'CRM Tools', 'Digital Transformation'],
};

const ApprovedOpportunities = () => {
  const { approvedTraining, updateTrainingStatus, removeApprovedTraining, addApprovedTraining, isEmployeeApproved, clearAllApprovedTraining } = useApprovedTraining();
  const { actionPlans, removeActionPlan } = useApprovedActionPlans();
  const { selectedDepartment } = useDepartment();
  const departmentData = getDepartmentData(selectedDepartment);
  const { learningRecommendations, trainingMetrics } = departmentData;

  // View toggle state: 'skills' for skill status, 'plans' for action plans
  const [activeView, setActiveView] = useState<'skills' | 'plans'>('skills');

  const [searchQuery, setSearchQuery] = useState('');
  
  // Upskilling state
  const [selectedType, setSelectedType] = useState<'all' | 'upskill' | 'reskill'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());

  // Approval dialog state
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [sendForValidation, setSendForValidation] = useState(false);
  const [approveDirectly, setApproveDirectly] = useState(true);
  const [requirementType, setRequirementType] = useState<string>('upskilling');
  
  // New approval form fields
  const [problemStatement, setProblemStatement] = useState('');
  const [dataSources, setDataSources] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [recommendedActions, setRecommendedActions] = useState('');
  const [costBenefits, setCostBenefits] = useState('');
  const [riskIfIgnored, setRiskIfIgnored] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get skill priorities from approved opportunities
  const getSkillPriority = (skills: string[]): { priority: 'high' | 'medium' | 'low' | null; courses: string[] } => {
    const opportunities = getStoredOpportunities();
    for (const skill of skills) {
      const skillLower = skill.toLowerCase();
      for (const opp of opportunities) {
        // First check in skillPriorities array (new structure)
        if (opp.skillPriorities && opp.skillPriorities.length > 0) {
          for (const sp of opp.skillPriorities) {
            if (sp.skillName.toLowerCase().includes(skillLower) || skillLower.includes(sp.skillName.toLowerCase())) {
              // Return highest priority if multiple exist
              const priorityOrder = { high: 3, medium: 2, low: 1 };
              const highestPriority = sp.priorities.sort((a, b) => priorityOrder[b] - priorityOrder[a])[0] || null;
              return { priority: highestPriority, courses: sp.selectedCourses || [] };
            }
          }
        }
        
        // Fallback to old structure
        const selectedSkills = opp.selectedSkills || [];
        const allSkills = [...selectedSkills, ...opp.skillsRequired];
        
        if (allSkills.some(s => s.toLowerCase().includes(skillLower) || skillLower.includes(s.toLowerCase()))) {
          return { priority: opp.priority, courses: [] };
        }
      }
    }
    return { priority: null, courses: [] };
  };

  // Use synthetic stats based on learningRecommendations when no approvals exist
  const stats = useMemo(() => {
    const hasApprovals = approvedTraining.length > 0;
    if (hasApprovals) {
      return {
        total: approvedTraining.length,
        hrbpApproved: approvedTraining.filter(t => t.status === 'hrbp-approved').length,
        businessPending: approvedTraining.filter(t => t.status === 'business-owner-pending').length,
        inProgress: approvedTraining.filter(t => t.status === 'in-progress').length,
        completed: approvedTraining.filter(t => t.status === 'completed').length,
      };
    }
    // Synthetic data based on department recommendations
    const total = learningRecommendations.length;
    return {
      total: total,
      hrbpApproved: Math.floor(total * 0.35),
      businessPending: Math.floor(total * 0.25),
      inProgress: Math.floor(total * 0.25),
      completed: Math.floor(total * 0.15),
    };
  }, [approvedTraining, learningRecommendations]);

  // Get unique skills for filter dropdown
  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    learningRecommendations.forEach(r => r.targetSkills.forEach(s => skills.add(s)));
    return Array.from(skills).sort();
  }, [learningRecommendations]);

  // Filter recommendations
  const filteredRecommendations = useMemo(() => {
    return learningRecommendations.filter(rec => {
      if (selectedType !== 'all' && rec.recommendationType !== selectedType) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = rec.employeeName.toLowerCase().includes(query);
        const matchesRole = rec.currentRole.toLowerCase().includes(query);
        const matchesTarget = rec.targetRole?.toLowerCase().includes(query);
        if (!matchesName && !matchesRole && !matchesTarget) return false;
      }
      if (skillFilter !== 'all' && !rec.targetSkills.includes(skillFilter)) return false;
      return true;
    });
  }, [learningRecommendations, selectedType, searchQuery, skillFilter]);
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredRecommendations.length / itemsPerPage);
  const paginatedRecommendations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecommendations.slice(start, start + itemsPerPage);
  }, [filteredRecommendations, currentPage, itemsPerPage]);

  // Count by type
  const upskillCount = learningRecommendations.filter(r => r.recommendationType === 'upskill').length;
  const reskillCount = learningRecommendations.filter(r => r.recommendationType === 'reskill').length;

  // Handle checkbox selection
  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    const newSelected = new Set(selectedEmployees);
    if (checked) {
      newSelected.add(employeeId);
    } else {
      newSelected.delete(employeeId);
    }
    setSelectedEmployees(newSelected);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredRecommendations
        .filter(rec => !isEmployeeApproved(rec.employeeId))
        .map(rec => rec.employeeId);
      setSelectedEmployees(new Set(allIds));
    } else {
      setSelectedEmployees(new Set());
    }
  };

  // Handle deselect all
  const handleDeselectAll = () => {
    setSelectedEmployees(new Set());
  };

  // Open approval dialog with pre-filled data
  const handleOpenApprovalDialog = () => {
    if (selectedEmployees.size === 0) {
      toast.error('Please select at least one employee to approve');
      return;
    }
    
    // Pre-fill fields based on selected employees
    const selectedRecs = filteredRecommendations.filter(rec => selectedEmployees.has(rec.employeeId));
    const allSkills = [...new Set(selectedRecs.flatMap(r => r.targetSkills))];
    const totalCost = selectedRecs.reduce((sum, r) => sum + parseFloat(r.estimatedCost.replace(/[$,]/g, '')), 0);
    const avgReadiness = Math.round(selectedRecs.reduce((sum, r) => sum + r.readinessScore, 0) / selectedRecs.length);
    
    // Auto-generate problem statement
    setProblemStatement(`${selectedRecs.length} employee(s) identified with skill needs in critical areas. Current readiness score averages ${avgReadiness}%, indicating need for targeted intervention to meet market demands.`);
    
    // Auto-generate data sources
    setDataSources('Market demand analysis from job portals, competitor hiring patterns, internal skill assessments, and performance metrics.');
    
    // Auto-fill skills required
    setSkillsRequired(allSkills.join(', '));
    
    // Auto-generate recommended actions
    const interventionTypes = [...new Set(selectedRecs.map(r => r.recommendationType))];
    setRecommendedActions(`Implement ${interventionTypes.map(t => t === 'upskill' ? 'upskilling' : 're-skilling').join(' and ')} programs targeting ${allSkills.slice(0, 3).join(', ')}${allSkills.length > 3 ? ' and more' : ''}.`);
    
    // Auto-generate cost and benefits
    setCostBenefits(`Total estimated investment: $${totalCost.toLocaleString()}. Expected outcomes: 15-25% productivity improvement, reduced hiring costs, and enhanced competitive positioning.`);
    
    // Auto-generate risk if ignored
    const highPriorityCount = selectedRecs.filter(r => r.priority === 'high').length;
    setRiskIfIgnored(highPriorityCount > 0 
      ? `${highPriorityCount} high priority training(s) identified. Delayed skill development may result in reduced competitiveness and missed market opportunities.`
      : 'Delayed skill development may result in reduced competitiveness and missed market opportunities.');
    
    setApprovalDialogOpen(true);
  };

  // Handle submit approval
  const handleSubmitApproval = () => {
    if (!sendForValidation && !approveDirectly) {
      toast.error('Please select at least one action');
      return;
    }

    const employeesToApprove = filteredRecommendations
      .filter(rec => selectedEmployees.has(rec.employeeId))
      .map(rec => ({
        employeeId: rec.employeeId,
        employeeName: rec.employeeName,
        currentRole: rec.currentRole,
        skillsToTrain: rec.targetSkills,
      }));

    // Add training with appropriate status based on selection
    const status = sendForValidation ? 'business-owner-pending' : 'hrbp-approved';
    
    employeesToApprove.forEach(emp => {
      addApprovedTraining([{
        ...emp,
      }]);
    });

    // If both options selected, update status to business-owner-pending
    if (sendForValidation && approveDirectly) {
      // First approve, then send for validation
      toast.success(`${employeesToApprove.length} employee(s) approved and sent for business owner validation`);
    } else if (sendForValidation) {
      toast.success(`${employeesToApprove.length} employee(s) sent for business owner validation`);
    } else {
      toast.success(`${employeesToApprove.length} employee(s) approved by HRBP`);
    }

    // Reset all state
    setSelectedEmployees(new Set());
    setApprovalDialogOpen(false);
    setApprovalComment('');
    setSendForValidation(false);
    setApproveDirectly(true);
    setRequirementType('upskilling');
    setProblemStatement('');
    setDataSources('');
    setSkillsRequired('');
    setRecommendedActions('');
    setCostBenefits('');
    setRiskIfIgnored('');
  };

  const allSelectableSelected = filteredRecommendations
    .filter(rec => !isEmployeeApproved(rec.employeeId))
    .every(rec => selectedEmployees.has(rec.employeeId)) && filteredRecommendations.filter(rec => !isEmployeeApproved(rec.employeeId)).length > 0;

  const getStatusConfig = (status: ApprovedTrainingEmployee['status']) => {
    switch (status) {
      case 'hrbp-approved':
        return { 
          label: 'HRBP Approved', 
          color: 'bg-success/15 text-success border-success/30',
          progress: 25,
          steps: [true, false, false, false]
        };
      case 'business-owner-pending':
        return { 
          label: 'BO Pending', 
          color: 'bg-warning/15 text-warning border-warning/30',
          progress: 50,
          steps: [true, true, false, false]
        };
      case 'in-progress':
        return { 
          label: 'In Progress', 
          color: 'bg-accent/15 text-accent border-accent/30',
          progress: 75,
          steps: [true, true, true, false]
        };
      case 'completed':
        return { 
          label: 'Completed', 
          color: 'bg-primary/15 text-primary border-primary/30',
          progress: 100,
          steps: [true, true, true, true]
        };
      default:
        return { 
          label: status, 
          color: 'bg-muted text-muted-foreground',
          progress: 0,
          steps: [false, false, false, false]
        };
    }
  };

  // Get approval status for an employee
  const getEmployeeApprovalStatus = (employeeId: string) => {
    const approval = approvedTraining.find(t => t.employeeId === employeeId);
    if (approval) {
      return getStatusConfig(approval.status);
    }
    return null;
  };

  const handleStatusChange = (id: string, newStatus: ApprovedTrainingEmployee['status']) => {
    updateTrainingStatus(id, newStatus);
  };

  // Get selected employees info for dialog
  const selectedEmployeesInfo = useMemo(() => {
    return filteredRecommendations.filter(rec => selectedEmployees.has(rec.employeeId));
  }, [filteredRecommendations, selectedEmployees]);

  // Action plan stats
  const actionPlanStats = useMemo(() => {
    return {
      total: actionPlans.length,
      tracking: actionPlans.filter(p => p.status === 'tracking').length,
      notTracking: actionPlans.filter(p => p.status === 'not-tracking').length,
      inProgress: actionPlans.filter(p => p.status === 'in-progress').length,
      completed: actionPlans.filter(p => p.status === 'completed').length,
    };
  }, [actionPlans]);

  // Get action plan status config
  const getActionPlanStatusConfig = (status: ApprovedActionPlan['status']) => {
    switch (status) {
      case 'tracking':
        return { label: 'Tracking', color: 'bg-success/15 text-success border-success/30' };
      case 'not-tracking':
        return { label: 'Not Tracking', color: 'bg-muted text-muted-foreground border-muted' };
      case 'in-progress':
        return { label: 'In Progress', color: 'bg-accent/15 text-accent border-accent/30' };
      case 'completed':
        return { label: 'Completed', color: 'bg-primary/15 text-primary border-primary/30' };
      default:
        return { label: status, color: 'bg-muted text-muted-foreground' };
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
      high: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
      medium: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
      low: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    };
    return colors[priority] || 'bg-muted text-muted-foreground';
  };

  const getTimelineLabel = (timeline: string) => {
    const labels: Record<string, string> = {
      immediate: '0-30 days',
      short: '1-3 months',
      medium: '3-6 months',
      long: '6-12 months',
    };
    return labels[timeline] || timeline;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center shadow-lg">
              <GraduationCap className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Monitor</h1>
              <p className="text-muted-foreground">Skill status monitor & training approvals</p>
            </div>
          </div>
          
          {/* View Toggle */}
          <ToggleGroup type="single" value={activeView} onValueChange={(value) => value && setActiveView(value as 'skills' | 'plans')}>
            <ToggleGroupItem value="skills" aria-label="Skill Status" className="gap-2 px-4">
              <GraduationCap className="h-4 w-4" />
              Skill Status
            </ToggleGroupItem>
            <ToggleGroupItem value="plans" aria-label="Action Plans" className="gap-2 px-4">
              <ClipboardList className="h-4 w-4" />
              Action Plans
              {actionPlans.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 h-5">
                  {actionPlans.length}
                </Badge>
              )}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Conditional View Content */}
      {activeView === 'skills' ? (
        <>
          {/* Skills Status View */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="card-shadow border-0 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow border-0 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">HRBP Approved</p>
                <p className="text-3xl font-bold text-success">{stats.hrbpApproved}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow border-0 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">BO Pending</p>
                <p className="text-3xl font-bold text-warning">{stats.businessPending}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow border-0 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">In Progress</p>
                <p className="text-3xl font-bold text-accent">{stats.inProgress}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow border-0 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Completed</p>
                <p className="text-3xl font-bold text-primary">{stats.completed}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Skill Matrix */}
      <Card className="card-shadow">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-chart-3" />
                Skill Status
              </CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedEmployees.size > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAll}
                      className="gap-1"
                    >
                      Deselect All
                    </Button>
                    <Button
                      onClick={handleOpenApprovalDialog}
                      className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
                    >
                      <CheckSquare className="h-4 w-4" />
                      Approve ({selectedEmployees.size})
                    </Button>
                  </>
                )}
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="gap-1"
                >
                  <List className="h-4 w-4" />
                  Table
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className="gap-1"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Cards
                </Button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name, role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={skillFilter} onValueChange={setSkillFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    {allSkills.map(skill => (
                      <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('all')}
              >
                All ({learningRecommendations.length})
              </Button>
              <Button
                variant={selectedType === 'upskill' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('upskill')}
                className={selectedType === 'upskill' ? '' : 'text-chart-1 border-chart-1/30 hover:bg-chart-1/10'}
              >
                Upskilling ({upskillCount})
              </Button>
              <Button
                variant={selectedType === 'reskill' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('reskill')}
                className={selectedType === 'reskill' ? '' : 'text-chart-2 border-chart-2/30 hover:bg-chart-2/10'}
              >
                Re-skilling ({reskillCount})
              </Button>
              <span className="text-sm text-muted-foreground ml-2">
                Showing {filteredRecommendations.length} results
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allSelectableSelected}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Skillset</TableHead>
                    <TableHead>Skills Need</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Intervention</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Time Required</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Approval Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRecommendations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        No employees found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRecommendations.map((rec, index) => {
                      const isApproved = isEmployeeApproved(rec.employeeId);
                      const approvalStatus = getEmployeeApprovalStatus(rec.employeeId);
                      const approvalRecord = approvedTraining.find(t => t.employeeId === rec.employeeId);
                      const pageNumber = (currentPage - 1) * itemsPerPage + index + 1;

                      // Risk level styling
                      const getRiskStyles = (level: string) => {
                        switch (level) {
                          case 'critical':
                            return 'bg-destructive/15 text-destructive border-destructive/30';
                          case 'high':
                            return 'bg-warning/15 text-warning border-warning/30';
                          case 'medium':
                            return 'bg-accent/15 text-accent border-accent/30';
                          default:
                            return 'bg-muted text-muted-foreground border-muted-foreground/30';
                        }
                      };

                      return (
                        <TableRow key={rec.employeeId} className={isApproved ? 'bg-muted/30' : ''}>
                          <TableCell>
                            <Checkbox
                              checked={selectedEmployees.has(rec.employeeId)}
                              onCheckedChange={(checked) => handleSelectEmployee(rec.employeeId, checked as boolean)}
                              disabled={isApproved}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {rec.employeeName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{rec.currentRole}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-0.5 max-w-[160px]">
                              {rec.skillsets.slice(0, 2).map((skillset) => (
                                <span 
                                  key={skillset}
                                  className="text-[10px] leading-tight px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium"
                                  title={skillset}
                                >
                                  {skillset.length > 15 ? skillset.substring(0, 15) + '…' : skillset}
                                </span>
                              ))}
                              {rec.skillsets.length > 2 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{rec.skillsets.length - 2}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-0.5 max-w-[160px]">
                              {rec.targetSkills.slice(0, 2).map((skill) => (
                                <span 
                                  key={skill}
                                  className="text-[10px] leading-tight px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 font-medium"
                                  title={skill}
                                >
                                  {skill.length > 15 ? skill.substring(0, 15) + '…' : skill}
                                </span>
                              ))}
                              {rec.targetSkills.length > 2 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{rec.targetSkills.length - 2}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={`capitalize flex items-center gap-1.5 ${
                                rec.priority === 'high' ? 'bg-destructive/10 text-destructive border-destructive/30' :
                                rec.priority === 'medium' ? 'bg-warning/10 text-warning border-warning/30' :
                                'bg-muted text-muted-foreground border-muted-foreground/30'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${
                                rec.priority === 'high' ? 'bg-destructive' :
                                rec.priority === 'medium' ? 'bg-warning' :
                                'bg-muted-foreground'
                              }`} />
                              {rec.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={`capitalize ${
                                rec.recommendationType === 'upskill' ? 'bg-chart-1/10 text-chart-1 border-chart-1/30' :
                                'bg-chart-2/10 text-chart-2 border-chart-2/30'
                              }`}
                            >
                              {rec.recommendationType === 'upskill' ? 'Upskilling' : 'Re-skilling'}
                            </Badge>
                          </TableCell>
                          {/* Cost Column */}
                          <TableCell>
                            <span className="text-sm font-medium">${rec.estimatedCost}</span>
                          </TableCell>
                          {/* Time Required Column */}
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">{rec.timeRequired}</span>
                            </div>
                          </TableCell>
                          {/* Courses Column */}
                          <TableCell>
                            <div className="flex flex-col gap-1.5 max-w-[200px]">
                              {/* Completed Courses */}
                              {rec.completedCourses && rec.completedCourses.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {rec.completedCourses.slice(0, 2).map((course) => (
                                    <span 
                                      key={course}
                                      className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success"
                                    >
                                      <CheckCircle className="h-2.5 w-2.5" />
                                      {course.length > 15 ? course.substring(0, 15) + '...' : course}
                                    </span>
                                  ))}
                                  {rec.completedCourses.length > 2 && (
                                    <span className="text-[10px] text-success">+{rec.completedCourses.length - 2}</span>
                                  )}
                                </div>
                              )}
                              {/* Needed Courses */}
                              {rec.neededCourses && rec.neededCourses.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {rec.neededCourses.slice(0, 2).map((course) => (
                                    <span 
                                      key={course}
                                      className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-warning/15 text-warning"
                                    >
                                      <Circle className="h-2.5 w-2.5" />
                                      {course.length > 15 ? course.substring(0, 15) + '...' : course}
                                    </span>
                                  ))}
                                  {rec.neededCourses.length > 2 && (
                                    <span className="text-[10px] text-warning">+{rec.neededCourses.length - 2}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {approvalStatus ? (
                              <div className="space-y-1">
                                <Badge variant="outline" className={approvalStatus.color}>
                                  {approvalStatus.label}
                                </Badge>
                                <div className="flex items-center gap-0.5">
                                  {['HRBP', 'BO', 'Train', 'Done'].map((step, index) => (
                                    <div key={step} className="flex items-center">
                                      <div 
                                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-medium transition-all ${
                                          approvalStatus.steps[index] 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'bg-muted text-muted-foreground'
                                        }`}
                                      >
                                        {approvalStatus.steps[index] ? '✓' : index + 1}
                                      </div>
                                      {index < 3 && (
                                        <div className={`w-2 h-0.5 ${
                                          approvalStatus.steps[index + 1] ? 'bg-primary' : 'bg-muted'
                                        }`} />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {approvalRecord && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleStatusChange(approvalRecord.id, 'business-owner-pending')}>
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                    Send to Business Owner
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(approvalRecord.id, 'in-progress')}>
                                    <GraduationCap className="h-4 w-4 mr-2" />
                                    Start Training
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(approvalRecord.id, 'completed')}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Mark Complete
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => removeApprovedTraining(approvalRecord.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between py-4 px-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRecommendations.length)} of {filteredRecommendations.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Reset Button */}
              <div className="flex justify-center py-3 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSelectedEmployees(new Set());
                    setSearchQuery('');
                    setSkillFilter('all');
                    setSelectedType('all');
                    setCurrentPage(1);
                    clearAllApprovedTraining();
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedRecommendations.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No employees found matching your criteria
                </div>
              ) : (
                paginatedRecommendations.map((rec) => {
                  const employeeSkills = employeeSkillsMap[rec.employeeId] || ['General Sales', 'Communication'];
                  const isApproved = isEmployeeApproved(rec.employeeId);
                  const approvalStatus = getEmployeeApprovalStatus(rec.employeeId);

                  return (
                    <div 
                      key={rec.employeeId}
                      className={`p-4 rounded-lg border bg-card hover:card-shadow-lg transition-all ${isApproved ? 'bg-muted/30' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedEmployees.has(rec.employeeId)}
                            onCheckedChange={(checked) => handleSelectEmployee(rec.employeeId, checked as boolean)}
                            disabled={isApproved}
                          />
                          <div>
                            <p className="font-semibold">{rec.employeeName}</p>
                            <p className="text-sm text-muted-foreground">{rec.currentRole}</p>
                          </div>
                        </div>
                        {approvalStatus && (
                          <Badge variant="outline" className={approvalStatus.color}>
                            {approvalStatus.label}
                          </Badge>
                        )}
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Current Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {employeeSkills.slice(0, 3).map((skill) => (
                            <span 
                              key={skill}
                              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-muted-foreground">Intervention</p>
                          <Badge 
                            variant="outline"
                            className={`capitalize ${
                              rec.recommendationType === 'upskill' ? 'bg-chart-1/10 text-chart-1 border-chart-1/30' :
                              'bg-chart-2/10 text-chart-2 border-chart-2/30'
                            }`}
                          >
                            {rec.recommendationType === 'upskill' ? 'Upskilling' : 'Re-skilling'}
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Courses:</p>
                        {(() => {
                          const { courses } = getSkillPriority(rec.targetSkills);
                          if (courses.length > 0) {
                            return (
                              <div className="flex flex-wrap gap-1">
                                {courses.slice(0, 2).map((course) => (
                                  <span 
                                    key={course}
                                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                                  >
                                    {course.length > 20 ? course.substring(0, 20) + '...' : course}
                                  </span>
                                ))}
                                {courses.length > 2 && (
                                  <span className="text-xs text-muted-foreground">+{courses.length - 2}</span>
                                )}
                              </div>
                            );
                          }
                          return <span className="text-xs text-muted-foreground">—</span>;
                        })()}
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{rec.estimatedDuration}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              HRBP Approval
            </DialogTitle>
            <DialogDescription>
              Review and approve training for {selectedEmployees.size} selected employee(s)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 overflow-y-auto flex-1 pr-2">
            {/* Selected Employees Summary */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected Employees</Label>
              <div className="max-h-24 overflow-y-auto rounded-md border p-2 space-y-1">
                {selectedEmployeesInfo.map(emp => (
                  <div key={emp.employeeId} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{emp.employeeName}</span>
                    <span className="text-muted-foreground">{emp.currentRole}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-xs font-semibold text-destructive">Problem Statement</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{problemStatement}</p>
              </div>

              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">Data Sources</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{dataSources}</p>
              </div>

              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-accent" />
                  <span className="text-xs font-semibold text-accent">Skills Required</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skillsRequired.split(',').slice(0, 4).map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">{skill.trim()}</Badge>
                  ))}
                  {skillsRequired.split(',').length > 4 && (
                    <span className="text-[10px] text-muted-foreground">+{skillsRequired.split(',').length - 4}</span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-xs font-semibold text-success">Recommended Actions</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{recommendedActions}</p>
              </div>

              <div className="p-3 rounded-lg bg-chart-1/10 border border-chart-1/20">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-chart-1" />
                  <span className="text-xs font-semibold text-chart-1">Cost & Benefits</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{costBenefits}</p>
              </div>

              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-xs font-semibold text-warning">Risk if Ignored</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{riskIfIgnored}</p>
              </div>
            </div>

            {/* Requirement Type */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Intervention Type</span>
              </div>
              <Select value={requirementType} onValueChange={setRequirementType}>
                <SelectTrigger className="w-40 h-8 bg-background">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="upskilling">Upskilling</SelectItem>
                  <SelectItem value="reskilling">Reskilling</SelectItem>
                  <SelectItem value="skilling">Skilling</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Options */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Action</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="approve"
                    checked={approveDirectly}
                    onCheckedChange={(checked) => setApproveDirectly(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="approve" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Approve
                    </Label>
                    <p className="text-xs text-muted-foreground">Mark as HRBP approved</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="validation"
                    checked={sendForValidation}
                    onCheckedChange={(checked) => setSendForValidation(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="validation" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                      <Send className="h-4 w-4 text-warning" />
                      Send for Business Owner Validation
                    </Label>
                    <p className="text-xs text-muted-foreground">Request business owner approval</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setApprovalDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitApproval}
              disabled={!sendForValidation && !approveDirectly}
              className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
            >
              <CheckSquare className="h-4 w-4" />
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </>
      ) : (
        /* Action Plans View */
        <div className="space-y-6">
          {/* Action Plan Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="card-shadow border-0 bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Plans</p>
                    <p className="text-3xl font-bold text-primary">{actionPlanStats.total}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow border-0 bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Tracking</p>
                    <p className="text-3xl font-bold text-success">{actionPlanStats.tracking}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow border-0 bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Not Tracking</p>
                    <p className="text-3xl font-bold text-muted-foreground">{actionPlanStats.notTracking}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow border-0 bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">In Progress</p>
                    <p className="text-3xl font-bold text-accent">{actionPlanStats.inProgress}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-shadow border-0 bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Completed</p>
                    <p className="text-3xl font-bold text-emerald-600">{actionPlanStats.completed}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Plans Table */}
          <Card className="card-shadow border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Action Plans Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              {actionPlans.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No Action Plans Yet</h3>
                  <p className="text-sm text-muted-foreground/70">
                    Create action plans from Market Insights to track them here.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs font-semibold">Opportunity</TableHead>
                        <TableHead className="text-xs font-semibold">Priority</TableHead>
                        <TableHead className="text-xs font-semibold">Skills</TableHead>
                        <TableHead className="text-xs font-semibold">Roles</TableHead>
                        <TableHead className="text-xs font-semibold">Budget</TableHead>
                        <TableHead className="text-xs font-semibold">Timeline</TableHead>
                        <TableHead className="text-xs font-semibold">Status</TableHead>
                        <TableHead className="text-xs font-semibold">Created</TableHead>
                        <TableHead className="text-xs font-semibold w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {actionPlans.map((plan) => (
                        <TableRow key={plan.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium text-sm max-w-[200px]">
                            <div className="truncate" title={plan.opportunityTitle}>
                              {plan.opportunityTitle}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] ${getPriorityBadge(plan.priority)}`}>
                              {plan.priority.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {plan.selectedSkills.slice(0, 2).map((skill, idx) => (
                                <Badge key={idx} variant="outline" className="text-[9px] px-1.5">
                                  {skill}
                                </Badge>
                              ))}
                              {plan.selectedSkills.length > 2 && (
                                <Badge variant="outline" className="text-[9px] px-1.5">
                                  +{plan.selectedSkills.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {plan.selectedRoles.slice(0, 2).map((role, idx) => (
                                <Badge key={idx} variant="secondary" className="text-[9px] px-1.5">
                                  {role}
                                </Badge>
                              ))}
                              {plan.selectedRoles.length > 2 && (
                                <Badge variant="secondary" className="text-[9px] px-1.5">
                                  +{plan.selectedRoles.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 text-muted-foreground" />
                              {plan.estimatedBudget || '-'}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {plan.timeline ? getTimelineLabel(plan.timeline) : '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] ${getActionPlanStatusConfig(plan.status).color}`}>
                              {getActionPlanStatusConfig(plan.status).label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(plan.dateApproved).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => {
                                    removeActionPlan(plan.id);
                                    toast.success('Action plan removed');
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ApprovedOpportunities;