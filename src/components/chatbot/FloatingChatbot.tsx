import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Sparkles, Lightbulb, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { trendingRoles, inDemandSkills, competitorHiring, marketSummary } from '@/data/marketData';
import { employees, learningRecommendations, skillNeedAnalysis } from '@/data/employeeData';
import { roleInsights, getInsightByRoleId } from '@/data/roleInsightData';
import { getStoredOpportunities } from '@/hooks/useApprovedOpportunities';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const quickActions = [
  { label: 'Trending Roles', query: 'Show me trending sales roles' },
  { label: 'Skill Gaps', query: 'What are the critical skill gaps?' },
  { label: 'Approved Opps', query: 'Which opportunities are approved?' },
  { label: 'Top Employees', query: 'Who are the top performers?' },
];

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your HRBP Demand Sensing Assistant. I can help you understand market trends, analyze employee skills, suggest upskilling paths, review approved opportunities, and provide actionable insights.\n\n**Try asking me:**\n• What are the trending sales roles?\n• Which opportunities are approved?\n• What skills does Enterprise AE need?\n• Which employees can be upskilled?",
      timestamp: new Date(),
      suggestions: ['Show trending roles', 'View skill gaps', 'Check approved opportunities']
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = (query: string): { content: string; suggestions?: string[] } => {
    const lowerQuery = query.toLowerCase();
    const approvedOpportunities = getStoredOpportunities();

    // Approved opportunities queries
    if (lowerQuery.includes('approved') || lowerQuery.includes('opportunities')) {
      if (approvedOpportunities.length === 0) {
        return {
          content: "📋 **No Approved Opportunities Yet**\n\nYou haven't approved any business opportunities. Visit the Role Insight pages and click 'Approve as Business Opportunity' to add roles to your approved list.\n\n**💡 Next Steps:**\n1. Explore Market Trends\n2. Select a trending role\n3. Review the insights\n4. Approve promising opportunities",
          suggestions: ['Show trending roles', 'What makes a good opportunity?']
        };
      }
      const oppList = approvedOpportunities.slice(0, 5).map((o, i) => 
        `${i + 1}. **${o.roleName}** - ${o.status.charAt(0).toUpperCase() + o.status.slice(1)} • ${o.priority} priority`
      ).join('\n');
      return {
        content: `📋 **Approved Business Opportunities (${approvedOpportunities.length})**\n\n${oppList}\n\n**📊 Status Summary:**\n• Approved: ${approvedOpportunities.filter(o => o.status === 'approved').length}\n• In Progress: ${approvedOpportunities.filter(o => o.status === 'in-progress').length}\n• Completed: ${approvedOpportunities.filter(o => o.status === 'completed').length}\n\n**💡 Recommendation:** Focus on high-priority opportunities first to maximize business impact.`,
        suggestions: ['View opportunity details', 'What are the skill requirements?']
      };
    }

    // Role-specific queries
    if (lowerQuery.includes('enterprise') && (lowerQuery.includes('ae') || lowerQuery.includes('account executive'))) {
      const insight = getInsightByRoleId('sr-001');
      if (insight) {
        return {
          content: `🎯 **Enterprise Account Executive Insight**\n\n**Why It's Trending:**\n${insight.trendExplanation.summary}\n\n**📈 Growth Rate:** +${insight.growthRate}%\n**🏢 Open Positions:** ${insight.openPositions.toLocaleString()}\n\n**🔥 Top Skills Required:**\n${insight.skillRequirements.slice(0, 4).map(s => `• ${s.skill} (${s.percentage}%)`).join('\n')}\n\n**💡 Recommended Actions:**\n1. Validate internal talent readiness\n2. Assess competitor hiring velocity\n3. Identify upskilling candidates\n4. Consider approving as business opportunity`,
          suggestions: ['Who can be upskilled for this?', 'Approve this opportunity']
        };
      }
    }

    // Skills for specific roles
    if (lowerQuery.includes('skill') && (lowerQuery.includes('operations') || lowerQuery.includes('revops'))) {
      const insight = getInsightByRoleId('sr-003');
      if (insight) {
        return {
          content: `🛠️ **Revenue Operations Manager Skills**\n\n**Core Requirements:**\n${insight.skillRequirements.map(s => `• **${s.skill}** - ${s.percentage}% demand (${s.trend})`).join('\n')}\n\n**🔥 Emerging Skills:**\n${insight.emergingSkills.slice(0, 4).map(s => `• ${s.skill} (Heat: ${s.heatScore}%)`).join('\n')}\n\n**💡 Questions to Ask Business:**\n• What RevOps tools are currently in use?\n• Is there cross-functional alignment?\n• What are the forecasting accuracy targets?`,
          suggestions: ['Find internal matches', 'View upskilling paths']
        };
      }
    }

    // Market trend queries
    if (lowerQuery.includes('trending') && lowerQuery.includes('role')) {
      const topRoles = trendingRoles.slice(0, 5);
      return {
        content: `📈 **Top Trending Sales Roles**\n\n${topRoles.map((r, i) => 
          `${i + 1}. **${r.title}**\n   • Growth: +${r.growthRate}%\n   • Open Positions: ${r.openPositions.toLocaleString()}\n   • Demand Index: ${r.demandIndex}/100`
        ).join('\n\n')}\n\n**💡 Strategic Insight:**\nRevenue Operations and Enterprise AE roles show strongest growth. Consider prioritizing talent development in these areas.\n\n**🎯 Recommended Next Steps:**\n1. Review each role's detailed insights\n2. Identify internal talent matches\n3. Approve high-potential opportunities`,
        suggestions: ['Tell me more about RevOps', 'View Enterprise AE details']
      };
    }

    if (lowerQuery.includes('skill') && (lowerQuery.includes('demand') || lowerQuery.includes('trending') || lowerQuery.includes('top'))) {
      const topSkills = inDemandSkills.slice(0, 5);
      return {
        content: `🎯 **Most In-Demand Sales Skills**\n\n${topSkills.map((s, i) => 
          `${i + 1}. **${s.name}**\n   • Demand Score: ${s.demandScore}/100\n   • Supply Ratio: ${s.supplyRatio}\n   • Growth Rate: +${s.growthRate}%`
        ).join('\n\n')}\n\n**📊 Key Insight:**\nNegotiation and Solution Selling show high demand with limited supply — prime candidates for internal upskilling programs.\n\n**💡 Questions for Business:**\n• Which skills are most critical for Q1 targets?\n• Are there certification requirements?\n• What's the timeline for skill development?`,
        suggestions: ['Show skill gaps', 'Who needs upskilling?']
      };
    }

    if (lowerQuery.includes('competitor') || lowerQuery.includes('hiring')) {
      const aggressive = competitorHiring.filter(c => c.velocity === 'aggressive');
      return {
        content: `🏢 **Competitor Hiring Intelligence**\n\n**⚡ Aggressive Hiring:**\n${aggressive.slice(0, 4).map(c => 
          `• **${c.company}**: ${c.salesHires} hires • ${c.avgTimeToFill} days avg fill time`
        ).join('\n')}\n\n**📊 Market Analysis:**\n• Total competitor hires tracked: ${competitorHiring.reduce((sum, c) => sum + c.salesHires, 0)}\n• Average time to fill: ${Math.round(competitorHiring.reduce((sum, c) => sum + c.avgTimeToFill, 0) / competitorHiring.length)} days\n\n**💡 Strategic Recommendations:**\n1. Accelerate your hiring process\n2. Focus on passive candidate engagement\n3. Consider counter-offer strategies\n4. Invest in employer branding`,
        suggestions: ['How to compete?', 'View our talent pool']
      };
    }

    // Skill need queries
    if (lowerQuery.includes('skill need') || lowerQuery.includes('skill gap') || lowerQuery.includes('gap analysis')) {
      const criticalNeeds = skillNeedAnalysis.filter(g => g.criticalityLevel === 'critical');
      return {
        content: `⚠️ **Critical Skill Need Analysis**\n\n${criticalNeeds.map(g => 
          `**${g.skillName}**\n• Market Demand: ${g.marketDemand} vs Internal: ${g.internalSupply}\n• Need: ${g.gap} • Impact: ${g.criticalityLevel}\n• Employees with skill: ${g.employeesWithSkill} (Avg proficiency: ${g.avgProficiency}%)`
        ).join('\n\n')}\n\n**📈 Summary Metrics:**\n• Total Critical Needs: ${criticalNeeds.length}\n• Highest Priority: ${criticalNeeds[0]?.skillName || 'N/A'}\n\n**💡 Recommended Actions:**\n1. Launch targeted training programs\n2. Consider external hiring for critical roles\n3. Partner with learning platforms\n4. Create mentorship programs`,
        suggestions: ['Start upskilling program', 'View training recommendations']
      };
    }

    // Upskilling queries
    if (lowerQuery.includes('upskill') || lowerQuery.includes('training') || lowerQuery.includes('recommend')) {
      const recs = learningRecommendations.slice(0, 4);
      return {
        content: `📚 **Personalized Upskilling Recommendations**\n\n${recs.map(r => 
          `**${r.employeeName}** (${r.currentRole})\n• Type: ${r.recommendationType.toUpperCase()}\n• Target: ${r.targetRole || 'Skill Enhancement'}\n• Skills: ${r.targetSkills.join(', ')}\n• Duration: ${r.estimatedDuration}\n• Readiness: ${r.readinessScore}%`
        ).join('\n\n')}\n\n**💡 Business Questions to Consider:**\n• What's the project timeline for these skills?\n• Is there budget for external training?\n• Can we pair learners with mentors?`,
        suggestions: ['View all recommendations', 'Check readiness scores']
      };
    }

    // Employee queries
    if (lowerQuery.includes('employee') && (lowerQuery.includes('top') || lowerQuery.includes('best') || lowerQuery.includes('performer'))) {
      const topEmployees = employees.filter(e => e.performanceScore >= 88).slice(0, 5);
      return {
        content: `⭐ **Top Performing Employees**\n\n${topEmployees.map((e, i) => 
          `${i + 1}. **${e.name}** - ${e.role}\n   • Performance: ${e.performanceScore}%\n   • Readiness: ${e.readinessScore}%\n   • Location: ${e.location}\n   • Key Skills: ${e.skills.slice(0, 2).map(s => s.name).join(', ')}`
        ).join('\n\n')}\n\n**💡 Insight:**\nThese employees show high potential for leadership roles or strategic assignments. Consider them for new opportunities.`,
        suggestions: ['View upskilling paths', 'Match to opportunities']
      };
    }

    // Re-skilling queries
    if (lowerQuery.includes('re-skill') || lowerQuery.includes('reskill') || (lowerQuery.includes('internal') && lowerQuery.includes('match'))) {
      const reskillRecs = learningRecommendations.filter(r => r.recommendationType === 'reskill');
      return {
        content: `🔄 **Re-skilling Opportunities**\n\n${reskillRecs.map(r => 
          `**${r.employeeName}** (${r.currentRole})\n• Target Role: ${r.targetRole}\n• Skills to Develop: ${r.targetSkills.join(', ')}\n• Readiness Score: ${r.readinessScore}%\n• Timeline: ${r.estimatedDuration}`
        ).join('\n\n')}\n\n**💡 Next Steps:**\n1. Conduct skill assessment interviews\n2. Create individual development plans\n3. Set milestone check-ins\n4. Track progress metrics`,
        suggestions: ['View skill requirements', 'Create development plan']
      };
    }

    // Market summary
    if (lowerQuery.includes('market') && lowerQuery.includes('summary')) {
      return {
        content: `📊 **Market Intelligence Summary**\n\n**Key Metrics:**\n• Total Open Roles: ${marketSummary.totalOpenRoles.toLocaleString()}\n• Demand Index: ${marketSummary.demandIndex}/100\n• Skill Gap Index: ${marketSummary.skillGapIndex}%\n• Competitor Activity: ${marketSummary.competitorActivity}\n\n**📈 Trend Analysis:**\nThe market shows strong demand with significant skill gaps. Companies are aggressively hiring, especially in RevOps and Enterprise Sales.\n\n**💡 Strategic Recommendations:**\n1. Prioritize internal talent development\n2. Focus on high-impact skill gaps\n3. Monitor competitor movements\n4. Approve promising opportunities early`,
        suggestions: ['View detailed trends', 'Show competitor analysis']
      };
    }

    // Navigation help
    if (lowerQuery.includes('navigate') || lowerQuery.includes('page') || lowerQuery.includes('where') || lowerQuery.includes('help')) {
      return {
        content: `🧭 **Navigation Guide**\n\n**Available Pages:**\n• **Dashboard** - Overview of market metrics & quick insights\n• **Market Trends** - Deep dive into roles, skills, competitors\n• **Upskilling** - Skill gaps and employee development\n• **Analytics** - Workforce impact and ROI tracking\n• **Approved Opportunities** - Manage approved business opportunities\n\n**Pro Tips:**\n• Click 'Explore' on any role to see detailed insights\n• Use 'Approve' button to add opportunities to your tracking list\n• Ask me specific questions about any data point!`,
        suggestions: ['Show dashboard overview', 'View Market Trends']
      };
    }

    // Next steps / recommendations
    if (lowerQuery.includes('next step') || lowerQuery.includes('what should')) {
      return {
        content: `🎯 **Recommended Next Steps**\n\n**1. Validate Business Demand**\n• Review trending roles data\n• Cross-reference with business priorities\n• Confirm headcount approvals\n\n**2. Assess Internal Readiness**\n• Run skill gap analysis\n• Identify high-potential employees\n• Review readiness scores\n\n**3. Approve & Track Opportunities**\n• Approve promising roles\n• Set priorities (high/medium/low)\n• Track progress to completion\n\n**4. Execute Development Plans**\n• Launch upskilling programs\n• Monitor learning completion\n• Measure business impact\n\n**💡 Questions to Ask Business:**\n• What's the project timeline?\n• Is headcount approved?\n• What systems/tools are needed?`,
        suggestions: ['Show skill gaps', 'View trending roles']
      };
    }

    // Default response with smart suggestions
    return {
      content: `I can help you with:\n\n**📈 Market Intelligence**\n• Trending roles & growth rates\n• In-demand skills & supply ratios\n• Competitor hiring analysis\n\n**👥 Talent Insights**\n• Skill gap analysis\n• Employee readiness scores\n• Upskilling recommendations\n\n**📋 Opportunity Management**\n• View approved opportunities\n• Track approval status\n• Generate action plans\n\n**💡 Try asking:**\n"What are the trending sales roles?"\n"Which opportunities are approved?"\n"What skills does a RevOps Manager need?"\n"Who can be upskilled into Enterprise AE?"`,
      suggestions: ['Show trending roles', 'View skill gaps', 'Check approved opportunities']
    };
  };

  const handleSend = (customQuery?: string) => {
    const queryText = customQuery || input;
    if (!queryText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: queryText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(queryText);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl',
          'flex items-center justify-center transition-all duration-300 hover:scale-110 z-50',
          'bg-gradient-to-br from-accent to-chart-2 text-white',
          'animate-float hover:shadow-2xl',
          isOpen && 'scale-0 opacity-0'
        )}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
          <Sparkles className="h-2.5 w-2.5 text-white" />
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          'fixed bottom-6 right-6 w-[420px] h-[600px] bg-card rounded-2xl shadow-2xl border',
          'flex flex-col transition-all duration-300 z-50 overflow-hidden',
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-primary to-primary/80">
          <div className="flex items-center gap-3 text-primary-foreground">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">HRBP Demand Sensing</p>
              <p className="text-xs opacity-80 flex items-center gap-1">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                AI-Powered Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 rounded-xl"
              onClick={() => setIsOpen(false)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 rounded-xl"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3 border-b bg-muted/30 flex gap-2 overflow-x-auto">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              className="h-7 text-xs whitespace-nowrap rounded-full flex-shrink-0"
              onClick={() => handleSend(action.query)}
            >
              {action.label}
            </Button>
          ))}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-accent" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    )}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
                {/* Suggestions */}
                {message.role === 'assistant' && message.suggestions && (
                  <div className="ml-11 mt-2 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs bg-accent/10 hover:bg-accent/20 text-accent rounded-full"
                        onClick={() => handleSend(suggestion)}
                      >
                        <Lightbulb className="h-3 w-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-accent" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about trends, skills, employees..."
              className="flex-1 rounded-xl bg-background border-border/50"
            />
            <Button 
              size="icon" 
              onClick={() => handleSend()} 
              disabled={!input.trim()}
              className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            <HelpCircle className="h-3 w-3 inline mr-1" />
            AI-powered insights from market data & employee database
          </p>
        </div>
      </div>
    </>
  );
};

export default FloatingChatbot;
