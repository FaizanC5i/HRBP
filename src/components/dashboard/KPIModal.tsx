import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Briefcase, Zap, Building2, Target, TrendingUp, Calculator, Lightbulb, Info } from 'lucide-react';

interface KPIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  whyItMatters: string;
  howCalculated: string;
  currentValue: string | number;
  details: string[];
  icon: string;
}

const iconMap: Record<string, React.ElementType> = {
  Briefcase,
  Zap,
  Building2,
  Target
};

const KPIModal = ({
  open,
  onOpenChange,
  title,
  description,
  whyItMatters,
  howCalculated,
  currentValue,
  details,
  icon
}: KPIModalProps) => {
  const IconComponent = iconMap[icon] || Briefcase;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Value */}
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground mb-1">Current Value</p>
            <p className="text-3xl font-bold text-foreground">{currentValue}</p>
          </div>

          {/* What it measures */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              <h4 className="font-semibold text-sm">What it measures</h4>
            </div>
            <p className="text-sm text-muted-foreground pl-6">{description}</p>
          </div>

          <Separator />

          {/* Why it matters */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <h4 className="font-semibold text-sm">Why it matters</h4>
            </div>
            <p className="text-sm text-muted-foreground pl-6">{whyItMatters}</p>
          </div>

          <Separator />

          {/* How it's calculated */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-green-500" />
              <h4 className="font-semibold text-sm">How it's calculated</h4>
            </div>
            <p className="text-sm text-muted-foreground pl-6">{howCalculated}</p>
          </div>

          <Separator />

          {/* Key Insights */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-sm">Key Insights</h4>
            </div>
            <ul className="space-y-1 pl-6">
              {details.map((detail, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          {/* Data Source Badge */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Badge variant="outline" className="text-xs">
              Source: Scraped Data
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KPIModal;
