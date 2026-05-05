import { useState } from 'react';
import { Bell, User, Settings, LogOut, Building2, Database, Clock, Calendar, Check, RotateCcw, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import logo from '@/assets/logo.webp';
import { useDepartment } from '@/contexts/DepartmentContext';
import { useToast } from '@/hooks/use-toast';
import { useApprovedActionPlans } from '@/hooks/useApprovedActionPlans';

interface HeaderProps {
  onLogout: () => void;
}

type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

const Header = ({ onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDepartment, setSelectedDepartment, departments } = useDepartment();
  const { toast } = useToast();
  const { clearAllPlans } = useApprovedActionPlans();
  const [scheduleFrequency, setScheduleFrequency] = useState<ScheduleFrequency>('weekly');

  const navItems = [
    { label: 'Business Insights', path: '/market-sensing', tooltip: 'External Data configured' },
    { label: 'Job Market Insights', path: '/demand-sensing', tooltip: 'External Data (Job Postings Data) configured' },
    { label: 'Demand Vs Supply', path: '/dashboard', tooltip: 'Internal Data mapped with External Data' },
    { label: 'Monitor', path: '/approved-opportunities', tooltip: 'Internal Data Configured' },
  ];

  const scheduleOptions: { value: ScheduleFrequency; label: string; description: string }[] = [
    { value: 'daily', label: 'Daily', description: 'Every day at 6:00 AM' },
    { value: 'weekly', label: 'Weekly', description: 'Every Monday at 6:00 AM' },
    { value: 'monthly', label: 'Monthly', description: '1st of each month' },
    { value: 'quarterly', label: 'Quarterly', description: 'Start of each quarter' },
  ];

  const handleScheduleChange = (frequency: ScheduleFrequency) => {
    setScheduleFrequency(frequency);
    toast({
      title: "Scraper Schedule Updated",
      description: `Data will now refresh ${frequency}.`,
    });
  };

  const handleResetFilters = () => {
    // Clear action plans from session storage
    clearAllPlans();
    
    toast({
      title: "Filters Reset",
      description: "Action plan filters have been cleared.",
    });
  };

  return (
    <header className="bg-header text-header-foreground sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/market-sensing')}
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center p-1">
                <img src={logo} alt="HRBP Intelligence Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold text-lg hidden sm:block">HRBP Demand Sensing</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <TooltipProvider>
                {navItems.map((item) => (
                  <div key={item.path} className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(item.path)}
                      className={`text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/10 ${
                        location.pathname === item.path 
                          ? 'bg-header-foreground/10 text-header-foreground' 
                          : ''
                      }`}
                    >
                      {item.label}
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-header-foreground/50 hover:text-header-foreground/80 cursor-help -ml-1 mr-1" />
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-popover text-popover-foreground border shadow-md">
                        <p className="text-xs">{item.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </TooltipProvider>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Data Freshness Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-header-foreground/5 border border-header-foreground/10">
              <Database className="h-3.5 w-3.5 text-chart-2" />
              <span className="text-xs text-header-foreground/70">Data scraped {scheduleFrequency}</span>
            </div>

            {/* Department Label */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-header-foreground/10 text-header-foreground/90">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">Sales</span>
            </div>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/10 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-chart-4 rounded-full" />
            </Button>

            {/* Settings Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/10"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-popover">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  Settings
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Reset Filters */}
                <DropdownMenuItem 
                  onClick={handleResetFilters}
                  className="cursor-pointer"
                >
                  <RotateCcw className="mr-2 h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Reset All Filters</p>
                    <p className="text-xs text-muted-foreground">Clear action plan filters</p>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Scheduler Submenu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <Clock className="mr-2 h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Data Scraping Schedule</p>
                      <p className="text-xs text-muted-foreground">Current: {scheduleFrequency}</p>
                    </div>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-56 bg-popover">
                    {scheduleOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleScheduleChange(option.value)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{option.label}</p>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                        {scheduleFrequency === option.value && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/10"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
