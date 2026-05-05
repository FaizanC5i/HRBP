import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Download, FileText, Table, Camera } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface MarketFiltersProps {
  timeWindow: string;
  setTimeWindow: (val: string) => void;
  geography: string;
  setGeography: (val: string) => void;
  industry: string;
  setIndustry: (val: string) => void;
  techCategory: string;
  setTechCategory: (val: string) => void;
  signalStrength: string;
  setSignalStrength: (val: string) => void;
  onExport: (type: 'pdf' | 'csv' | 'snapshot') => void;
}

export const MarketFilters = ({
  timeWindow,
  setTimeWindow,
  geography,
  setGeography,
  industry,
  setIndustry,
  techCategory,
  setTechCategory,
  signalStrength,
  setSignalStrength,
  onExport
}: MarketFiltersProps) => {
  const activeFilters = [
    timeWindow !== 'all' && { key: 'time', label: timeWindow, reset: () => setTimeWindow('all') },
    geography !== 'all' && { key: 'geo', label: geography, reset: () => setGeography('all') },
    industry !== 'all' && { key: 'industry', label: industry, reset: () => setIndustry('all') },
    techCategory !== 'all' && { key: 'tech', label: techCategory, reset: () => setTechCategory('all') },
    signalStrength !== 'all' && { key: 'signal', label: signalStrength, reset: () => setSignalStrength('all') },
  ].filter(Boolean) as Array<{ key: string; label: string; reset: () => void }>;

  const clearAllFilters = () => {
    setTimeWindow('all');
    setGeography('all');
    setIndustry('all');
    setTechCategory('all');
    setSignalStrength('all');
  };

  const handleExport = (type: 'pdf' | 'csv' | 'snapshot') => {
    onExport(type);
    const messages = {
      pdf: 'Executive brief exported as PDF',
      csv: 'Signals data exported as CSV',
      snapshot: 'Source snapshots attached for governance'
    };
    toast.success(messages[type]);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        
        <Select value={timeWindow} onValueChange={setTimeWindow}>
          <SelectTrigger className="h-7 text-[10px] w-24">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={geography} onValueChange={setGeography}>
          <SelectTrigger className="h-7 text-[10px] w-24">
            <SelectValue placeholder="Geography" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="na">North America</SelectItem>
            <SelectItem value="emea">EMEA</SelectItem>
            <SelectItem value="apac">APAC</SelectItem>
            <SelectItem value="latam">LATAM</SelectItem>
          </SelectContent>
        </Select>

        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="h-7 text-[10px] w-28">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
          </SelectContent>
        </Select>

        <Select value={techCategory} onValueChange={setTechCategory}>
          <SelectTrigger className="h-7 text-[10px] w-24">
            <SelectValue placeholder="Tech" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tech</SelectItem>
            <SelectItem value="ai">AI/ML</SelectItem>
            <SelectItem value="cloud">Cloud</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="data">Data/Analytics</SelectItem>
            <SelectItem value="automation">Automation</SelectItem>
          </SelectContent>
        </Select>

        <Select value={signalStrength} onValueChange={setSignalStrength}>
          <SelectTrigger className="h-7 text-[10px] w-24">
            <SelectValue placeholder="Signal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Signals</SelectItem>
            <SelectItem value="strong">Strong</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="weak">Weak</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-[10px]">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf')} className="text-xs">
                <FileText className="h-3.5 w-3.5 mr-2" />
                PDF Executive Brief
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')} className="text-xs">
                <Table className="h-3.5 w-3.5 mr-2" />
                CSV Signals Data
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('snapshot')} className="text-xs">
                <Camera className="h-3.5 w-3.5 mr-2" />
                Source Snapshots (Governance)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active filter pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {activeFilters.map(filter => (
            <Badge 
              key={filter.key}
              variant="secondary" 
              className="text-[9px] px-1.5 py-0 h-5 cursor-pointer hover:bg-destructive/20"
              onClick={filter.reset}
            >
              {filter.label}
              <X className="h-2.5 w-2.5 ml-1" />
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 text-[9px] px-1.5"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};
