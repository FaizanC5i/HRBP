import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { marketOpportunities } from '@/data/marketSensingData';
import { Users, Cog, Monitor, Shield, Handshake, Check, X } from 'lucide-react';

const OrganizationalActionMatrix = () => {
  const sortedOpportunities = [...marketOpportunities]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 10);

  const actions = [
    { key: 'skills', label: 'Skills', icon: Users, color: 'text-purple-500 bg-purple-500/10' },
    { key: 'tech', label: 'Tech', icon: Monitor, color: 'text-blue-500 bg-blue-500/10' },
    { key: 'process', label: 'Process', icon: Cog, color: 'text-cyan-500 bg-cyan-500/10' },
    { key: 'governance', label: 'Gov', icon: Shield, color: 'text-amber-500 bg-amber-500/10' },
    { key: 'partnerships', label: 'Partners', icon: Handshake, color: 'text-rose-500 bg-rose-500/10' },
  ];

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Users className="h-4 w-4 text-orange-500" />
            </div>
            <CardTitle className="text-base font-semibold">Organizational Action Matrix</CardTitle>
          </div>
          <div className="flex gap-1">
            {actions.map(action => (
              <Badge key={action.key} variant="outline" className={`text-[9px] px-1.5 py-0 ${action.color}`}>
                <action.icon className="h-2.5 w-2.5 mr-0.5" />
                {action.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Opportunity</th>
                <th className="text-center py-2 px-1 text-muted-foreground font-medium w-14">
                  <div className="flex flex-col items-center gap-0.5">
                    <Users className="h-3.5 w-3.5 text-purple-500" />
                    <span>Skills</span>
                  </div>
                </th>
                <th className="text-center py-2 px-1 text-muted-foreground font-medium w-14">
                  <div className="flex flex-col items-center gap-0.5">
                    <Monitor className="h-3.5 w-3.5 text-blue-500" />
                    <span>Tech</span>
                  </div>
                </th>
                <th className="text-center py-2 px-1 text-muted-foreground font-medium w-14">
                  <div className="flex flex-col items-center gap-0.5">
                    <Cog className="h-3.5 w-3.5 text-cyan-500" />
                    <span>Process</span>
                  </div>
                </th>
                <th className="text-center py-2 px-1 text-muted-foreground font-medium w-14">
                  <div className="flex flex-col items-center gap-0.5">
                    <Shield className="h-3.5 w-3.5 text-amber-500" />
                    <span>Gov</span>
                  </div>
                </th>
                <th className="text-center py-2 px-1 text-muted-foreground font-medium w-14">
                  <div className="flex flex-col items-center gap-0.5">
                    <Handshake className="h-3.5 w-3.5 text-rose-500" />
                    <span>Partners</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedOpportunities.map((opp, idx) => (
                <tr 
                  key={opp.id} 
                  className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                    idx % 2 === 0 ? 'bg-muted/10' : ''
                  }`}
                >
                  <td className="py-2 px-2">
                    <span className="font-medium text-foreground line-clamp-1">
                      {opp.title}
                    </span>
                  </td>
                  <td className="py-2 px-1 text-center">
                    {opp.organizationalActions.skills ? (
                      <div className="flex justify-center">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-purple-500" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <X className="h-3 w-3 text-muted-foreground/40" />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-1 text-center">
                    {opp.organizationalActions.tech ? (
                      <div className="flex justify-center">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-blue-500" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <X className="h-3 w-3 text-muted-foreground/40" />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-1 text-center">
                    {opp.organizationalActions.process ? (
                      <div className="flex justify-center">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-cyan-500" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <X className="h-3 w-3 text-muted-foreground/40" />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-1 text-center">
                    {opp.organizationalActions.governance ? (
                      <div className="flex justify-center">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-amber-500" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <X className="h-3 w-3 text-muted-foreground/40" />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-1 text-center">
                    {opp.organizationalActions.partnerships ? (
                      <div className="flex justify-center">
                        <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-rose-500" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <X className="h-3 w-3 text-muted-foreground/40" />
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationalActionMatrix;
