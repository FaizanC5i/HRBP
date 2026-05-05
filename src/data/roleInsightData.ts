// Role Insight Data - Based on scraped job posting data
// Sources: LinkedIn, Glassdoor, Amazon Careers, Google Careers, Microsoft Careers

export interface RoleInsight {
  roleId: string;
  roleTitle: string;
  
  // Trend Explanation
  trendExplanation: {
    summary: string;
    marketSignals: string[];
    topIndustries: string[];
    competitorActions: string[];
  };
  
  // Source Breakdown
  sourceBreakdown: {
    jobPortals: {
      description: string;
      increase: number;
      timeframe: string;
    };
    careerPages: {
      description: string;
      companiesTracked: number;
    };
    industryReports: {
      description: string;
      reportsAnalyzed: number;
    };
    competitorAnnouncements: {
      description: string;
      announcementsTracked: number;
    };
  };
  
  // Monthly Trend Data
  demandTrend: { month: string; demand: number; postings: number }[];
  
  // Skill Requirements
  skillRequirements: { skill: string; percentage: number; trend: 'rising' | 'stable' | 'declining' }[];
  
  // Competitor Hiring
  competitorHiring: { company: string; hires: number; trend: 'up' | 'down' | 'stable' }[];
  
  // Emerging Skills
  emergingSkills: { skill: string; heatScore: number }[];
  
  // Role Growth
  growthRate: number;
  openPositions: number;
  
  // Related Insights
  relatedInsights: {
    topSkillsRequested: string[];
    internalMatchCount: number;
    suggestedUpskillingPaths: string[];
  };
}

export const roleInsights: Record<string, RoleInsight> = {
  'sales-representative': {
    roleId: 'sales-representative',
    roleTitle: 'Sales Representative',
    trendExplanation: {
      summary: 'Sales Representatives are in critical demand as companies like Microsoft, Google, AWS, and Salesforce aggressively expand their sales teams across APAC, EMEA, and North America. This role is essential for driving cloud adoption, digital transformation, and customer acquisition.',
      marketSignals: [
        'Microsoft listing 2429+ Sales Representative positions globally',
        'High posting frequency across LinkedIn, Glassdoor, and company career pages',
        'Cloud and AI sales driving new role specializations',
        'Digital transformation creating demand for tech-savvy sales professionals'
      ],
      topIndustries: ['Cloud Services', 'Enterprise Software', 'E-commerce', 'Financial Services', 'Technology'],
      competitorActions: [
        'Microsoft actively hiring across US, UK, and India',
        'Google Cloud expanding sales teams in Turkey and Taiwan',
        'AWS building SMB market penetration teams',
        'Salesforce investing in cloud-native sales capabilities'
      ]
    },
    sourceBreakdown: {
      jobPortals: {
        description: 'Tracked significant increase in Sales Rep postings across LinkedIn, Glassdoor, and Indeed',
        increase: 45,
        timeframe: 'last 30 days'
      },
      careerPages: {
        description: 'Monitored career pages of Microsoft, Google, AWS, Salesforce, Adobe, and Amazon',
        companiesTracked: 85
      },
      industryReports: {
        description: 'Analyzed market reports on sales workforce trends and digital transformation',
        reportsAnalyzed: 18
      },
      competitorAnnouncements: {
        description: 'Tracked press releases and earnings calls mentioning sales expansion',
        announcementsTracked: 42
      }
    },
    demandTrend: [
      { month: 'Jan', demand: 75, postings: 3500 },
      { month: 'Feb', demand: 78, postings: 3720 },
      { month: 'Mar', demand: 82, postings: 3950 },
      { month: 'Apr', demand: 85, postings: 4180 },
      { month: 'May', demand: 88, postings: 4420 },
      { month: 'Jun', demand: 90, postings: 4580 },
      { month: 'Jul', demand: 89, postings: 4520 },
      { month: 'Aug', demand: 92, postings: 4750 },
      { month: 'Sep', demand: 94, postings: 4920 },
      { month: 'Oct', demand: 95, postings: 5050 },
      { month: 'Nov', demand: 94, postings: 4980 },
      { month: 'Dec', demand: 92, postings: 4820 }
    ],
    skillRequirements: [
      { skill: 'Sales Strategy & Development', percentage: 95, trend: 'rising' },
      { skill: 'Customer Relationship Management (CRM)', percentage: 92, trend: 'stable' },
      { skill: 'Account Management', percentage: 88, trend: 'stable' },
      { skill: 'Business Development', percentage: 85, trend: 'rising' },
      { skill: 'Cloud Solutions Sales', percentage: 82, trend: 'rising' },
      { skill: 'Digital Transformation', percentage: 78, trend: 'rising' }
    ],
    competitorHiring: [
      { company: 'Microsoft', hires: 2429, trend: 'up' },
      { company: 'Google', hires: 850, trend: 'up' },
      { company: 'Amazon/AWS', hires: 720, trend: 'up' },
      { company: 'Salesforce', hires: 540, trend: 'stable' },
      { company: 'Adobe', hires: 380, trend: 'stable' }
    ],
    emergingSkills: [
      { skill: 'AI/ML in Sales Processes', heatScore: 95 },
      { skill: 'Remote/Hybrid Sales Methodologies', heatScore: 88 },
      { skill: 'Sales Analytics', heatScore: 85 },
      { skill: 'Partner Channel Management', heatScore: 82 },
      { skill: 'Customer Engagement Strategies', heatScore: 78 }
    ],
    growthRate: 45,
    openPositions: 6252,
    relatedInsights: {
      topSkillsRequested: ['Sales Strategy', 'CRM', 'Account Management', 'Business Development', 'Cloud Solutions'],
      internalMatchCount: 12,
      suggestedUpskillingPaths: ['Microsoft Sales Certification', 'CRM Advanced Training', 'Cloud Solution Selling']
    }
  },
  'microsoft-sales-jobs': {
    roleId: 'microsoft-sales-jobs',
    roleTitle: 'Microsoft Sales Jobs',
    trendExplanation: {
      summary: 'Microsoft Sales Jobs represent one of the highest-demand categories in the tech sales market. With 110,000+ positions across the United States alone, Microsoft is aggressively expanding its sales organization to drive cloud and AI adoption.',
      marketSignals: [
        '110,000+ Microsoft Sales positions posted on LinkedIn',
        'Focus on Cloud & AI Platform Sales Manager roles',
        'Customer Success and Account Executive positions surging',
        'Sales Excellence and Operations roles expanding'
      ],
      topIndustries: ['Cloud Services', 'Enterprise Software', 'AI/ML Platforms', 'Business Solutions', 'Technology'],
      competitorActions: [
        'Microsoft leading enterprise sales hiring globally',
        'Google Cloud matching Microsoft in enterprise sales expansion',
        'AWS competing for similar talent pool',
        'Salesforce expanding partnership sales teams'
      ]
    },
    sourceBreakdown: {
      jobPortals: {
        description: 'Tracked 110,000+ Microsoft Sales positions across LinkedIn and career portals',
        increase: 52,
        timeframe: 'last 30 days'
      },
      careerPages: {
        description: 'Monitored Microsoft Careers, LinkedIn, and partner company pages',
        companiesTracked: 120
      },
      industryReports: {
        description: 'Analyzed Microsoft earnings calls and workforce expansion announcements',
        reportsAnalyzed: 22
      },
      competitorAnnouncements: {
        description: 'Tracked tech industry sales expansion announcements',
        announcementsTracked: 55
      }
    },
    demandTrend: [
      { month: 'Jan', demand: 80, postings: 4200 },
      { month: 'Feb', demand: 83, postings: 4450 },
      { month: 'Mar', demand: 86, postings: 4720 },
      { month: 'Apr', demand: 88, postings: 4950 },
      { month: 'May', demand: 90, postings: 5180 },
      { month: 'Jun', demand: 92, postings: 5350 },
      { month: 'Jul', demand: 91, postings: 5280 },
      { month: 'Aug', demand: 93, postings: 5520 },
      { month: 'Sep', demand: 95, postings: 5720 },
      { month: 'Oct', demand: 96, postings: 5850 },
      { month: 'Nov', demand: 95, postings: 5780 },
      { month: 'Dec', demand: 93, postings: 5620 }
    ],
    skillRequirements: [
      { skill: 'Cloud Solutions Sales', percentage: 95, trend: 'rising' },
      { skill: 'AI/ML Sales Processes', percentage: 90, trend: 'rising' },
      { skill: 'Customer Relationship Management', percentage: 88, trend: 'stable' },
      { skill: 'Partner Channel Management', percentage: 85, trend: 'rising' },
      { skill: 'Digital Transformation Consulting', percentage: 82, trend: 'rising' },
      { skill: 'Sales Analytics', percentage: 78, trend: 'rising' }
    ],
    competitorHiring: [
      { company: 'Microsoft', hires: 6182, trend: 'up' },
      { company: 'Google', hires: 2100, trend: 'up' },
      { company: 'Amazon/AWS', hires: 1850, trend: 'up' },
      { company: 'Salesforce', hires: 980, trend: 'stable' },
      { company: 'Oracle', hires: 620, trend: 'stable' }
    ],
    emergingSkills: [
      { skill: 'Generative AI Sales', heatScore: 98 },
      { skill: 'Copilot Integration Sales', heatScore: 92 },
      { skill: 'Azure Cloud Expertise', heatScore: 88 },
      { skill: 'Customer Success Management', heatScore: 85 },
      { skill: 'Remote Sales Leadership', heatScore: 80 }
    ],
    growthRate: 45,
    openPositions: 6182,
    relatedInsights: {
      topSkillsRequested: ['Cloud Solutions', 'AI/ML', 'CRM', 'Partner Management', 'Digital Transformation'],
      internalMatchCount: 15,
      suggestedUpskillingPaths: ['Microsoft Certified Sales Professional', 'Azure Solutions Architect', 'AI Sales Specialist']
    }
  },
  'sales-manager': {
    roleId: 'sales-manager',
    roleTitle: 'Sales Manager',
    trendExplanation: {
      summary: 'Sales Managers are essential for driving regional sales strategies and leading high-performing teams. Tech giants like Microsoft, Amazon, and Google are heavily investing in sales management to support enterprise customer acquisition and B2B growth.',
      marketSignals: [
        'Microsoft listing 1,980+ Sales Manager positions',
        'Focus on CXO engagement and enterprise deal navigation',
        'Sales operations leadership becoming critical',
        'Regional expansion driving management hiring'
      ],
      topIndustries: ['E-commerce', 'Enterprise Software', 'Cloud Services', 'B2B Marketplace', 'Technology'],
      competitorActions: [
        'Microsoft scaling Sales Manager hiring across regions',
        'Amazon Business expanding B2B sales leadership',
        'Google Cloud building regional management teams',
        'Salesforce investing in sales management capabilities'
      ]
    },
    sourceBreakdown: {
      jobPortals: {
        description: 'Tracked Sales Manager postings on LinkedIn, Amazon Careers, and Microsoft Careers',
        increase: 38,
        timeframe: 'last 30 days'
      },
      careerPages: {
        description: 'Monitored career pages of major B2B and enterprise companies',
        companiesTracked: 95
      },
      industryReports: {
        description: 'Analyzed sales leadership benchmark reports from CSO Insights and Gartner',
        reportsAnalyzed: 15
      },
      competitorAnnouncements: {
        description: 'Tracked organizational announcements about sales team expansion',
        announcementsTracked: 38
      }
    },
    demandTrend: [
      { month: 'Jan', demand: 72, postings: 2800 },
      { month: 'Feb', demand: 75, postings: 2980 },
      { month: 'Mar', demand: 78, postings: 3150 },
      { month: 'Apr', demand: 81, postings: 3320 },
      { month: 'May', demand: 84, postings: 3480 },
      { month: 'Jun', demand: 86, postings: 3620 },
      { month: 'Jul', demand: 85, postings: 3580 },
      { month: 'Aug', demand: 88, postings: 3750 },
      { month: 'Sep', demand: 90, postings: 3920 },
      { month: 'Oct', demand: 91, postings: 4020 },
      { month: 'Nov', demand: 90, postings: 3980 },
      { month: 'Dec', demand: 88, postings: 3850 }
    ],
    skillRequirements: [
      { skill: 'Enterprise Sales Experience', percentage: 92, trend: 'stable' },
      { skill: 'CXO/C-Suite Engagement', percentage: 88, trend: 'rising' },
      { skill: 'Sales Partnerships & Alliances', percentage: 85, trend: 'rising' },
      { skill: 'Complex Negotiations', percentage: 82, trend: 'stable' },
      { skill: 'CRM Tools (Salesforce/Dynamics)', percentage: 80, trend: 'stable' },
      { skill: 'Sales Analytics & Forecasting', percentage: 78, trend: 'rising' }
    ],
    competitorHiring: [
      { company: 'Microsoft', hires: 1980, trend: 'up' },
      { company: 'Amazon', hires: 1650, trend: 'up' },
      { company: 'Google', hires: 1420, trend: 'up' },
      { company: 'Salesforce', hires: 850, trend: 'stable' },
      { company: 'Adobe', hires: 580, trend: 'stable' }
    ],
    emergingSkills: [
      { skill: 'AI-Powered Sales Leadership', heatScore: 90 },
      { skill: 'Sales Automation Strategy', heatScore: 86 },
      { skill: 'Pipeline & Lead Analytics', heatScore: 84 },
      { skill: 'Customer Success Integration', heatScore: 80 },
      { skill: 'Remote Team Management', heatScore: 78 }
    ],
    growthRate: 38,
    openPositions: 5320,
    relatedInsights: {
      topSkillsRequested: ['Enterprise Sales', 'CXO Engagement', 'Sales Partnerships', 'CRM Tools', 'Analytics'],
      internalMatchCount: 8,
      suggestedUpskillingPaths: ['Sales Leadership Certification', 'Enterprise Deal Navigation', 'CRM Advanced Training']
    }
  },
  'microsoft-sales-development-specialist': {
    roleId: 'microsoft-sales-development-specialist',
    roleTitle: 'Microsoft Sales Development Specialist',
    trendExplanation: {
      summary: 'Microsoft Sales Development Specialists are crucial for pipeline generation and lead qualification. With 2,593+ positions, this role focuses on leveraging Microsoft Dynamics 365, lead generation, and business development.',
      marketSignals: [
        '2,593+ Sales Development Specialist positions at Microsoft',
        'Focus on Microsoft Dynamics 365 expertise',
        'Pipeline management and lead generation critical',
        'Cold calling evolving to multi-channel outreach'
      ],
      topIndustries: ['Enterprise Software', 'Cloud Services', 'Technology', 'Business Solutions', 'SaaS'],
      competitorActions: [
        'Microsoft heavily investing in SDR teams',
        'Salesforce building competing SDR programs',
        'HubSpot expanding sales development teams',
        'Google Cloud matching with similar roles'
      ]
    },
    sourceBreakdown: {
      jobPortals: {
        description: 'Tracked Microsoft Sales Development positions on LinkedIn and job portals',
        increase: 35,
        timeframe: 'last 30 days'
      },
      careerPages: {
        description: 'Monitored Microsoft Careers and partner company pages',
        companiesTracked: 75
      },
      industryReports: {
        description: 'Analyzed SDR benchmark reports and sales development trends',
        reportsAnalyzed: 12
      },
      competitorAnnouncements: {
        description: 'Tracked sales development team expansion announcements',
        announcementsTracked: 30
      }
    },
    demandTrend: [
      { month: 'Jan', demand: 68, postings: 1800 },
      { month: 'Feb', demand: 72, postings: 1950 },
      { month: 'Mar', demand: 75, postings: 2080 },
      { month: 'Apr', demand: 78, postings: 2220 },
      { month: 'May', demand: 82, postings: 2380 },
      { month: 'Jun', demand: 84, postings: 2480 },
      { month: 'Jul', demand: 83, postings: 2420 },
      { month: 'Aug', demand: 86, postings: 2580 },
      { month: 'Sep', demand: 88, postings: 2720 },
      { month: 'Oct', demand: 89, postings: 2820 },
      { month: 'Nov', demand: 88, postings: 2780 },
      { month: 'Dec', demand: 86, postings: 2650 }
    ],
    skillRequirements: [
      { skill: 'Microsoft Dynamics 365', percentage: 95, trend: 'rising' },
      { skill: 'Lead Generation & Qualification', percentage: 90, trend: 'stable' },
      { skill: 'CRM Management', percentage: 88, trend: 'stable' },
      { skill: 'Pipeline Management', percentage: 85, trend: 'rising' },
      { skill: 'Cold Calling & Outreach', percentage: 80, trend: 'declining' },
      { skill: 'Sales Analytics', percentage: 78, trend: 'rising' }
    ],
    competitorHiring: [
      { company: 'Microsoft', hires: 2593, trend: 'up' },
      { company: 'Salesforce', hires: 1200, trend: 'up' },
      { company: 'HubSpot', hires: 680, trend: 'up' },
      { company: 'Oracle', hires: 450, trend: 'stable' },
      { company: 'SAP', hires: 320, trend: 'stable' }
    ],
    emergingSkills: [
      { skill: 'AI-Powered Prospecting', heatScore: 92 },
      { skill: 'Multi-Channel Outreach', heatScore: 88 },
      { skill: 'Sales Automation Tools', heatScore: 85 },
      { skill: 'Data-Driven Targeting', heatScore: 82 },
      { skill: 'Social Selling', heatScore: 78 }
    ],
    growthRate: 28,
    openPositions: 2593,
    relatedInsights: {
      topSkillsRequested: ['Dynamics 365', 'Lead Generation', 'CRM', 'Pipeline Management', 'Sales Analytics'],
      internalMatchCount: 6,
      suggestedUpskillingPaths: ['Microsoft Dynamics Certification', 'Sales Development Representative Training', 'CRM Mastery']
    }
  },
  'microsoft-sales-support': {
    roleId: 'microsoft-sales-support',
    roleTitle: 'Microsoft Sales Support',
    trendExplanation: {
      summary: 'Microsoft Sales Support roles are trending as companies need professionals to assist sales teams, manage customer relationships, and support sales operations. With 63,000+ positions, this is a high-volume hiring category.',
      marketSignals: [
        '63,000+ Microsoft Sales Support positions on LinkedIn',
        'Growing need for sales operations support',
        'CRM and sales enablement tools expertise required',
        'Customer engagement strategies becoming critical'
      ],
      topIndustries: ['Technology', 'Enterprise Software', 'Cloud Services', 'Business Solutions', 'SaaS'],
      competitorActions: [
        'Microsoft scaling sales support operations',
        'Salesforce building support infrastructure',
        'Google Cloud expanding customer support teams',
        'AWS investing in sales enablement'
      ]
    },
    sourceBreakdown: {
      jobPortals: {
        description: 'Tracked 63,000+ Microsoft Sales Support positions across job portals',
        increase: 28,
        timeframe: 'last 30 days'
      },
      careerPages: {
        description: 'Monitored Microsoft Careers and partner company pages',
        companiesTracked: 90
      },
      industryReports: {
        description: 'Analyzed sales support and operations trend reports',
        reportsAnalyzed: 10
      },
      competitorAnnouncements: {
        description: 'Tracked sales operations expansion announcements',
        announcementsTracked: 25
      }
    },
    demandTrend: [
      { month: 'Jan', demand: 65, postings: 1500 },
      { month: 'Feb', demand: 68, postings: 1620 },
      { month: 'Mar', demand: 71, postings: 1750 },
      { month: 'Apr', demand: 74, postings: 1880 },
      { month: 'May', demand: 77, postings: 2020 },
      { month: 'Jun', demand: 79, postings: 2120 },
      { month: 'Jul', demand: 78, postings: 2080 },
      { month: 'Aug', demand: 81, postings: 2220 },
      { month: 'Sep', demand: 83, postings: 2350 },
      { month: 'Oct', demand: 84, postings: 2420 },
      { month: 'Nov', demand: 83, postings: 2380 },
      { month: 'Dec', demand: 81, postings: 2280 }
    ],
    skillRequirements: [
      { skill: 'Sales Support Operations', percentage: 92, trend: 'stable' },
      { skill: 'Customer Relationship Management', percentage: 88, trend: 'stable' },
      { skill: 'Sales Enablement Tools', percentage: 85, trend: 'rising' },
      { skill: 'Business Development Support', percentage: 82, trend: 'rising' },
      { skill: 'Technical Sales Knowledge', percentage: 78, trend: 'rising' },
      { skill: 'Problem-Solving', percentage: 75, trend: 'stable' }
    ],
    competitorHiring: [
      { company: 'Microsoft', hires: 2283, trend: 'up' },
      { company: 'Salesforce', hires: 980, trend: 'stable' },
      { company: 'Google', hires: 720, trend: 'up' },
      { company: 'Amazon', hires: 650, trend: 'stable' },
      { company: 'Oracle', hires: 380, trend: 'stable' }
    ],
    emergingSkills: [
      { skill: 'AI-Assisted Support', heatScore: 85 },
      { skill: 'Digital Transformation Support', heatScore: 82 },
      { skill: 'Partner Channel Support', heatScore: 78 },
      { skill: 'Remote Support Methodologies', heatScore: 75 },
      { skill: 'Customer Success Support', heatScore: 72 }
    ],
    growthRate: 22,
    openPositions: 2283,
    relatedInsights: {
      topSkillsRequested: ['Sales Support', 'CRM', 'Sales Enablement', 'Business Development', 'Technical Sales'],
      internalMatchCount: 10,
      suggestedUpskillingPaths: ['Sales Support Certification', 'CRM Administration', 'Sales Enablement Tools Training']
    }
  },
  'microsoft-sales-excellence-specialist': {
    roleId: 'microsoft-sales-excellence-specialist',
    roleTitle: 'Microsoft Sales Excellence Specialist',
    trendExplanation: {
      summary: 'Sales Excellence Specialists drive sales operations improvement, process optimization, and sales enablement. This emerging role focuses on leveraging CRM tools, sales analytics, and AI/ML to enhance sales performance.',
      marketSignals: [
        '5,000+ Sales Excellence positions at Microsoft',
        'Focus on sales process optimization',
        'Sales analytics and insights becoming critical',
        'AI/ML integration in sales processes growing'
      ],
      topIndustries: ['Enterprise Software', 'Cloud Services', 'Technology', 'Business Solutions', 'Consulting'],
      competitorActions: [
        'Microsoft building sales excellence programs',
        'Salesforce investing in sales operations',
        'Google Cloud developing similar roles',
        'Oracle expanding sales enablement teams'
      ]
    },
    sourceBreakdown: {
      jobPortals: {
        description: 'Tracked Sales Excellence positions across LinkedIn and career portals',
        increase: 25,
        timeframe: 'last 30 days'
      },
      careerPages: {
        description: 'Monitored Microsoft Careers and partner company pages',
        companiesTracked: 60
      },
      industryReports: {
        description: 'Analyzed sales excellence and operations benchmark reports',
        reportsAnalyzed: 8
      },
      competitorAnnouncements: {
        description: 'Tracked sales excellence program announcements',
        announcementsTracked: 18
      }
    },
    demandTrend: [
      { month: 'Jan', demand: 58, postings: 800 },
      { month: 'Feb', demand: 62, postings: 880 },
      { month: 'Mar', demand: 65, postings: 950 },
      { month: 'Apr', demand: 68, postings: 1020 },
      { month: 'May', demand: 72, postings: 1100 },
      { month: 'Jun', demand: 74, postings: 1150 },
      { month: 'Jul', demand: 73, postings: 1120 },
      { month: 'Aug', demand: 76, postings: 1200 },
      { month: 'Sep', demand: 78, postings: 1280 },
      { month: 'Oct', demand: 79, postings: 1320 },
      { month: 'Nov', demand: 78, postings: 1290 },
      { month: 'Dec', demand: 76, postings: 1220 }
    ],
    skillRequirements: [
      { skill: 'Sales Operations', percentage: 95, trend: 'stable' },
      { skill: 'Sales Excellence Programs', percentage: 90, trend: 'rising' },
      { skill: 'CRM Systems (Dynamics 365)', percentage: 88, trend: 'stable' },
      { skill: 'Sales Analytics', percentage: 85, trend: 'rising' },
      { skill: 'Process Optimization', percentage: 82, trend: 'rising' },
      { skill: 'Sales Enablement', percentage: 78, trend: 'rising' }
    ],
    competitorHiring: [
      { company: 'Microsoft', hires: 1155, trend: 'up' },
      { company: 'Salesforce', hires: 520, trend: 'stable' },
      { company: 'Google', hires: 380, trend: 'up' },
      { company: 'Oracle', hires: 280, trend: 'stable' },
      { company: 'SAP', hires: 180, trend: 'stable' }
    ],
    emergingSkills: [
      { skill: 'AI/ML in Sales Processes', heatScore: 90 },
      { skill: 'Sales Automation', heatScore: 86 },
      { skill: 'Data-Driven Decision Making', heatScore: 84 },
      { skill: 'E-commerce Sales Operations', heatScore: 80 },
      { skill: 'Revenue Cycle Management', heatScore: 76 }
    ],
    growthRate: 18,
    openPositions: 1155,
    relatedInsights: {
      topSkillsRequested: ['Sales Operations', 'Sales Excellence', 'CRM', 'Sales Analytics', 'Process Optimization'],
      internalMatchCount: 4,
      suggestedUpskillingPaths: ['Sales Excellence Certification', 'Sales Operations Management', 'Analytics & Insights Training']
    }
  },
  'sr-001': {
    roleId: 'sr-001',
    roleTitle: 'Cloud Sales Representative',
    trendExplanation: {
      summary: 'Cloud Sales Representatives are in surging demand as AWS, Google Cloud, and Microsoft Azure expand their APAC operations. Companies seek professionals who can drive cloud adoption, manage SMB to enterprise accounts, and build customer trust in cloud solutions.',
      marketSignals: [
        'AWS ASEAN Scale initiative driving massive hiring across Malaysia, India, Philippines',
        'Cloud migration projects accelerating post-pandemic digital transformation',
        'SMB market penetration becoming key focus for cloud providers',
        'Growing demand for multi-cloud sales expertise'
      ],
      topIndustries: ['Cloud Services', 'Enterprise Software', 'E-commerce', 'Financial Services', 'Healthcare IT'],
      competitorActions: [
        'Amazon AWS hiring aggressively for India and Malaysia markets',
        'Google Cloud expanding enterprise field sales in Turkey and Taiwan',
        'Microsoft positioning Solution Sales Specialists for Cloud & AI',
        'Salesforce building cloud-native sales teams'
      ]
    },
    sourceBreakdown: {
      jobPortals: {
        description: 'Tracked significant increase in Cloud Sales postings across LinkedIn, Glassdoor, and Indeed',
        increase: 42,
        timeframe: 'last 30 days'
      },
      careerPages: {
        description: 'Monitored career pages of AWS, Google Cloud, Microsoft, and partner companies',
        companiesTracked: 65
      },
      industryReports: {
        description: 'Analyzed Gartner Cloud Market reports and AWS partner announcements',
        reportsAnalyzed: 15
      },
      competitorAnnouncements: {
        description: 'Tracked press releases and earnings calls mentioning cloud sales expansion',
        announcementsTracked: 38
      }
    },
    demandTrend: [
      { month: 'Jan', demand: 72, postings: 3200 },
      { month: 'Feb', demand: 76, postings: 3450 },
      { month: 'Mar', demand: 80, postings: 3680 },
      { month: 'Apr', demand: 84, postings: 3920 },
      { month: 'May', demand: 88, postings: 4180 },
      { month: 'Jun', demand: 90, postings: 4350 },
      { month: 'Jul', demand: 89, postings: 4280 },
      { month: 'Aug', demand: 92, postings: 4520 },
      { month: 'Sep', demand: 94, postings: 4720 },
      { month: 'Oct', demand: 95, postings: 4850 },
      { month: 'Nov', demand: 94, postings: 4780 },
      { month: 'Dec', demand: 92, postings: 4620 }
    ],
    skillRequirements: [
      { skill: 'Cloud Solutions (AWS/Azure/GCP)', percentage: 95, trend: 'rising' },
      { skill: 'Account Management', percentage: 88, trend: 'stable' },
      { skill: 'Customer Trust Building', percentage: 85, trend: 'rising' },
      { skill: 'CRM Tools (Salesforce)', percentage: 82, trend: 'stable' },
      { skill: 'Sales Funnel Management', percentage: 78, trend: 'stable' },
      { skill: 'Partner Collaboration', percentage: 75, trend: 'rising' }
    ],
    competitorHiring: [
      { company: 'Amazon AWS', hires: 285, trend: 'up' },
      { company: 'Microsoft Azure', hires: 245, trend: 'up' },
      { company: 'Google Cloud', hires: 168, trend: 'up' },
      { company: 'Salesforce', hires: 112, trend: 'stable' },
      { company: 'Oracle Cloud', hires: 78, trend: 'stable' }
    ],
    emergingSkills: [
      { skill: 'AI/ML Cloud Solutions', heatScore: 95 },
      { skill: 'Multi-Cloud Strategy', heatScore: 88 },
      { skill: 'Customer Success in Cloud', heatScore: 85 },
      { skill: 'SMB Market Expertise', heatScore: 82 },
      { skill: 'Remote Sales Methodologies', heatScore: 78 }
    ],
    growthRate: 32.5,
    openPositions: 4850,
    relatedInsights: {
      topSkillsRequested: ['Cloud Solutions', 'Account Management', 'Customer Trust Building', 'CRM Tools'],
      internalMatchCount: 8,
      suggestedUpskillingPaths: ['AWS Cloud Practitioner Certification', 'Azure Sales Specialist', 'Cloud Solution Selling']
    }
  },
  'sr-002': {
    roleId: 'sr-002',
    roleTitle: 'Enterprise Field Sales Representative',
    trendExplanation: {
      summary: 'Enterprise Field Sales Representatives are critical for acquiring new logos and managing complex B2B sales cycles. Google Cloud and other tech giants are heavily investing in field sales teams to drive digital transformation initiatives at enterprise scale.',
      marketSignals: [
        'Google Cloud expanding enterprise sales presence in Turkey and EMEA',
        'Companies prioritizing C-suite engagement and executive relationships',
        'Complex buying committees requiring cross-functional sales leadership',
        'Digital transformation initiatives driving enterprise software adoption'
      ],
      topIndustries: ['Cloud Services', 'Enterprise Software', 'Financial Services', 'Manufacturing', 'Healthcare'],
      competitorActions: [
        'Google Cloud hiring Enterprise FSRs for new customer acquisition',
        'Microsoft investing in enterprise account coverage',
        'AWS building strategic account teams globally',
        'Oracle restructuring enterprise sales organization'
      ]
    },
    sourceBreakdown: {
      jobPortals: {
        description: 'Tracked Enterprise FSR postings on Google Careers, LinkedIn, and Glassdoor',
        increase: 34,
        timeframe: 'last 30 days'
      },
      careerPages: {
        description: 'Monitored career pages of top 50 enterprise technology companies',
        companiesTracked: 50
      },
      industryReports: {
        description: 'Analyzed Gartner, Forrester, and IDC reports on enterprise sales trends',
        reportsAnalyzed: 12
      },
      competitorAnnouncements: {
        description: 'Tracked press releases and earnings calls mentioning sales expansion',
        announcementsTracked: 28
      }
    },
    demandTrend: [
      { month: 'Jan', demand: 70, postings: 2600 },
      { month: 'Feb', demand: 74, postings: 2780 },
      { month: 'Mar', demand: 78, postings: 2920 },
      { month: 'Apr', demand: 82, postings: 3080 },
      { month: 'May', demand: 85, postings: 3180 },
      { month: 'Jun', demand: 87, postings: 3280 },
      { month: 'Jul', demand: 86, postings: 3220 },
      { month: 'Aug', demand: 89, postings: 3380 },
      { month: 'Sep', demand: 91, postings: 3480 },
      { month: 'Oct', demand: 92, postings: 3540 },
      { month: 'Nov', demand: 91, postings: 3480 },
      { month: 'Dec', demand: 89, postings: 3380 }
    ],
    skillRequirements: [
      { skill: 'Enterprise Sales', percentage: 95, trend: 'stable' },
      { skill: 'C-Suite Engagement', percentage: 90, trend: 'rising' },
      { skill: 'Cross-functional Leadership', percentage: 88, trend: 'rising' },
      { skill: 'Digital Transformation Consulting', percentage: 85, trend: 'rising' },
      { skill: 'Contract Negotiation', percentage: 82, trend: 'stable' },
      { skill: 'Account Strategy Development', percentage: 78, trend: 'rising' }
    ],
    competitorHiring: [
      { company: 'Google Cloud', hires: 168, trend: 'up' },
      { company: 'Microsoft', hires: 192, trend: 'up' },
      { company: 'Amazon AWS', hires: 145, trend: 'up' },
      { company: 'Salesforce', hires: 98, trend: 'stable' },
      { company: 'Oracle', hires: 72, trend: 'stable' }
    ],
    emergingSkills: [
      { skill: 'AI/ML Sales', heatScore: 92 },
      { skill: 'Value Engineering', heatScore: 88 },
      { skill: 'Migration Business Cases', heatScore: 85 },
      { skill: 'Customer Engineering Collaboration', heatScore: 82 },
      { skill: 'Executive Storytelling', heatScore: 78 }
    ],
    growthRate: 28.4,
    openPositions: 3240,
    relatedInsights: {
      topSkillsRequested: ['Enterprise Sales', 'C-Suite Engagement', 'Cross-functional Leadership', 'Digital Transformation'],
      internalMatchCount: 6,
      suggestedUpskillingPaths: ['Google Cloud Sales Certification', 'Executive Communication Training', 'Enterprise Account Strategy']
    }
  },
  'sr-003': {
    roleId: 'sr-003',
    roleTitle: 'Sales Manager',
    trendExplanation: {
      summary: 'Sales Managers are essential for driving regional sales strategies and leading high-performing teams. Amazon Business and other tech companies are expanding their sales management roles to support B2B growth and enterprise customer acquisition.',
      marketSignals: [
        'Amazon Business hiring Sales Managers for India and APAC expansion',
        'Companies investing in sales operations leadership',
        'Growing need for CXO engagement and enterprise deal navigation',
        'Sales enablement and process optimization becoming key focus areas'
      ],
      topIndustries: ['E-commerce', 'Enterprise Software', 'B2B Marketplace', 'Cloud Services', 'Technology'],
      competitorActions: [
        'Amazon Business scaling Sales Manager hiring in India',
        'Microsoft building regional sales leadership teams',
        'Salesforce investing in sales management capabilities',
        'Adobe expanding enterprise sales management'
      ]
    },
    sourceBreakdown: {
      jobPortals: {
        description: 'Tracked Sales Manager postings on Amazon Careers, LinkedIn, and Indeed',
        increase: 28,
        timeframe: 'last 30 days'
      },
      careerPages: {
        description: 'Monitored career pages of major B2B and enterprise companies',
        companiesTracked: 75
      },
      industryReports: {
        description: 'Analyzed sales leadership benchmark reports from CSO Insights and Gartner',
        reportsAnalyzed: 10
      },
      competitorAnnouncements: {
        description: 'Tracked organizational announcements about sales team expansion',
        announcementsTracked: 32
      }
    },
    demandTrend: [
      { month: 'Jan', demand: 68, postings: 2100 },
      { month: 'Feb', demand: 72, postings: 2280 },
      { month: 'Mar', demand: 75, postings: 2420 },
      { month: 'Apr', demand: 78, postings: 2580 },
      { month: 'May', demand: 82, postings: 2720 },
      { month: 'Jun', demand: 84, postings: 2820 },
      { month: 'Jul', demand: 83, postings: 2780 },
      { month: 'Aug', demand: 86, postings: 2920 },
      { month: 'Sep', demand: 88, postings: 3050 },
      { month: 'Oct', demand: 89, postings: 3120 },
      { month: 'Nov', demand: 88, postings: 3080 },
      { month: 'Dec', demand: 86, postings: 2950 }
    ],
    skillRequirements: [
      { skill: 'Enterprise Sales Experience', percentage: 92, trend: 'stable' },
      { skill: 'CXO/C-Suite Engagement', percentage: 88, trend: 'rising' },
      { skill: 'Sales Partnerships & Alliances', percentage: 85, trend: 'rising' },
      { skill: 'Complex Negotiations', percentage: 82, trend: 'stable' },
      { skill: 'CRM Tools (Salesforce)', percentage: 80, trend: 'stable' },
      { skill: 'Sales Analytics', percentage: 78, trend: 'rising' }
    ],
    competitorHiring: [
      { company: 'Amazon', hires: 185, trend: 'up' },
      { company: 'Microsoft', hires: 168, trend: 'up' },
      { company: 'Google', hires: 142, trend: 'up' },
      { company: 'Salesforce', hires: 95, trend: 'stable' },
      { company: 'Adobe', hires: 68, trend: 'stable' }
    ],
    emergingSkills: [
      { skill: 'Procure-to-Pay Knowledge', heatScore: 90 },
      { skill: 'Sales Automation Tools', heatScore: 86 },
      { skill: 'Pipeline & Lead Sourcing', heatScore: 84 },
      { skill: 'Customer Success Management', heatScore: 80 },
      { skill: 'Implementation Delivery', heatScore: 76 }
    ],
    growthRate: 24.2,
    openPositions: 2680,
    relatedInsights: {
      topSkillsRequested: ['Enterprise Sales', 'CXO Engagement', 'Sales Partnerships', 'CRM Tools'],
      internalMatchCount: 5,
      suggestedUpskillingPaths: ['Sales Leadership Certification', 'Enterprise Deal Navigation', 'CRM Advanced Training']
    }
  },
  'sr-004': {
    roleId: 'sr-004',
    roleTitle: 'Solution Sales Specialist - Cloud & AI',
    trendExplanation: {
      summary: 'Solution Sales Specialists focusing on Cloud & AI are at the forefront of tech sales growth. Microsoft and other cloud providers are heavily investing in specialists who can guide customers through AI adoption and help them achieve strategic goals.',
      marketSignals: [
        'AI growth and disruption creating new sales opportunities',
        'Companies seeking specialists to guide AI customer journeys',
        'Cloud + AI bundled solutions driving premium sales roles',
        'Strategic goal achievement through technology partnership'
      ],
      topIndustries: ['Cloud Services', 'AI/ML Platforms', 'Enterprise Software', 'Data Analytics', 'Cybersecurity'],
      competitorActions: [
        'Microsoft actively hiring Solution Sales Specialists for Cloud & AI',
        'Google Cloud building AI-focused sales teams',
        'AWS expanding AI/ML sales capabilities',
        'Salesforce integrating AI into sales solutions'
      ]
    },
    sourceBreakdown: {
      jobPortals: {
        description: 'Tracked Solution Sales Specialist postings on Glassdoor, LinkedIn, and Microsoft Careers',
        increase: 48,
        timeframe: 'last 30 days'
      },
      careerPages: {
        description: 'Monitored career pages of AI/ML and cloud technology companies',
        companiesTracked: 45
      },
      industryReports: {
        description: 'Analyzed AI adoption reports from McKinsey, Gartner, and industry analysts',
        reportsAnalyzed: 18
      },
      competitorAnnouncements: {
        description: 'Tracked AI product launches and sales team announcements',
        announcementsTracked: 42
      }
    },
    demandTrend: [
      { month: 'Jan', demand: 65, postings: 1450 },
      { month: 'Feb', demand: 70, postings: 1620 },
      { month: 'Mar', demand: 75, postings: 1780 },
      { month: 'Apr', demand: 80, postings: 1920 },
      { month: 'May', demand: 84, postings: 2050 },
      { month: 'Jun', demand: 86, postings: 2150 },
      { month: 'Jul', demand: 85, postings: 2100 },
      { month: 'Aug', demand: 88, postings: 2280 },
      { month: 'Sep', demand: 90, postings: 2420 },
      { month: 'Oct', demand: 91, postings: 2520 },
      { month: 'Nov', demand: 90, postings: 2480 },
      { month: 'Dec', demand: 88, postings: 2350 }
    ],
    skillRequirements: [
      { skill: 'AI/ML Solutions Expertise', percentage: 95, trend: 'rising' },
      { skill: 'Cloud Platform Knowledge', percentage: 92, trend: 'stable' },
      { skill: 'Customer AI Journey Guidance', percentage: 88, trend: 'rising' },
      { skill: 'Strategic Sales Planning', percentage: 85, trend: 'stable' },
      { skill: 'Solution Architecture Understanding', percentage: 82, trend: 'rising' },
      { skill: 'Digital Transformation Consulting', percentage: 78, trend: 'rising' }
    ],
    competitorHiring: [
      { company: 'Microsoft', hires: 225, trend: 'up' },
      { company: 'Google Cloud', hires: 145, trend: 'up' },
      { company: 'Amazon AWS', hires: 132, trend: 'up' },
      { company: 'Salesforce', hires: 78, trend: 'up' },
      { company: 'IBM', hires: 65, trend: 'stable' }
    ],
    emergingSkills: [
      { skill: 'Generative AI Sales', heatScore: 98 },
      { skill: 'AI Ethics & Governance', heatScore: 85 },
      { skill: 'MLOps Understanding', heatScore: 82 },
      { skill: 'AI ROI Calculation', heatScore: 80 },
      { skill: 'Industry-Specific AI Use Cases', heatScore: 78 }
    ],
    growthRate: 35.8,
    openPositions: 2150,
    relatedInsights: {
      topSkillsRequested: ['AI/ML Solutions', 'Cloud Platform Knowledge', 'Customer AI Journey', 'Strategic Sales'],
      internalMatchCount: 4,
      suggestedUpskillingPaths: ['AI Sales Certification', 'Cloud AI Architecture', 'Enterprise AI Strategy']
    }
  },
  'sr-005': {
    roleId: 'sr-005',
    roleTitle: 'Sales Development Representative',
    trendExplanation: {
      summary: 'SDR roles remain in high demand across APAC markets, particularly in Philippines and India. Companies prioritize pipeline generation with emphasis on remote sales methodologies and digital outreach capabilities.',
      marketSignals: [
        'Microsoft listing 1000+ SDR positions in Philippines',
        'Remote-first companies expanding SDR hiring pools',
        'Multi-channel outreach becoming standard requirement',
        'Data-driven prospecting replacing traditional cold calling'
      ],
      topIndustries: ['SaaS', 'Enterprise Software', 'E-commerce', 'FinTech', 'Cloud Services'],
      competitorActions: [
        'Microsoft expanding SDR teams across APAC',
        'Adobe hiring 6000+ sales roles including SDRs in US',
        'Tech companies rebuilding pipelines post-restructuring',
        'Remote SDR teams becoming preferred model'
      ]
    },
    sourceBreakdown: {
      jobPortals: {
        description: 'SDR remains one of the most posted sales roles on LinkedIn and Glassdoor',
        increase: 22,
        timeframe: 'last 30 days'
      },
      careerPages: {
        description: 'Tracked SDR openings across high-growth tech companies',
        companiesTracked: 120
      },
      industryReports: {
        description: 'Analyzed sales development benchmark reports from Bridge Group',
        reportsAnalyzed: 8
      },
      competitorAnnouncements: {
        description: 'Monitored company blogs and LinkedIn posts about SDR team expansion',
        announcementsTracked: 45
      }
    },
    demandTrend: [
      { month: 'Jan', demand: 78, postings: 7200 },
      { month: 'Feb', demand: 80, postings: 7450 },
      { month: 'Mar', demand: 82, postings: 7680 },
      { month: 'Apr', demand: 84, postings: 7920 },
      { month: 'May', demand: 86, postings: 8150 },
      { month: 'Jun', demand: 85, postings: 8050 },
      { month: 'Jul', demand: 83, postings: 7850 },
      { month: 'Aug', demand: 86, postings: 8200 },
      { month: 'Sep', demand: 88, postings: 8450 },
      { month: 'Oct', demand: 89, postings: 8720 },
      { month: 'Nov', demand: 88, postings: 8600 },
      { month: 'Dec', demand: 87, postings: 8400 }
    ],
    skillRequirements: [
      { skill: 'CRM Proficiency', percentage: 92, trend: 'stable' },
      { skill: 'Lead Generation', percentage: 90, trend: 'stable' },
      { skill: 'Cold Outreach', percentage: 88, trend: 'stable' },
      { skill: 'Remote Sales Methodologies', percentage: 85, trend: 'rising' },
      { skill: 'Email Sequencing', percentage: 82, trend: 'rising' },
      { skill: 'Social Selling', percentage: 78, trend: 'rising' }
    ],
    competitorHiring: [
      { company: 'Microsoft', hires: 420, trend: 'up' },
      { company: 'Adobe', hires: 285, trend: 'up' },
      { company: 'Salesforce', hires: 210, trend: 'stable' },
      { company: 'Amazon', hires: 165, trend: 'up' },
      { company: 'Google', hires: 142, trend: 'stable' }
    ],
    emergingSkills: [
      { skill: 'AI-Assisted Prospecting', heatScore: 94 },
      { skill: 'Video Prospecting', heatScore: 88 },
      { skill: 'Intent Data Usage', heatScore: 82 },
      { skill: 'Multi-Channel Sequencing', heatScore: 79 },
      { skill: 'Account-Based Outreach', heatScore: 76 }
    ],
    growthRate: 22.3,
    openPositions: 8920,
    relatedInsights: {
      topSkillsRequested: ['CRM Proficiency', 'Lead Generation', 'Cold Outreach', 'Remote Sales'],
      internalMatchCount: 10,
      suggestedUpskillingPaths: ['SDR Bootcamp', 'Sales Technology Stack Training', 'Digital Prospecting Mastery']
    }
  },
  'sr-006': {
    roleId: 'sr-006',
    roleTitle: 'Sales Operations Analyst',
    trendExplanation: {
      summary: 'Sales Operations roles are growing as companies focus on data-driven decision making and process optimization. AWS and other tech giants are building dedicated Sales Operations teams to drive efficiency.',
      marketSignals: [
        'Companies consolidating go-to-market operations',
        'Increased investment in sales technology stacks',
        'Growing need for revenue forecasting accuracy',
        'Cloud Sales Centers requiring operations leadership'
      ],
      topIndustries: ['Cloud Services', 'Enterprise SaaS', 'E-commerce', 'Technology', 'Financial Services'],
      competitorActions: [
        'AWS building Sales Operations teams in US',
        'Microsoft investing in RevOps capabilities',
        'Salesforce expanding operations analytics',
        'Adobe scaling sales enablement'
      ]
    },
    sourceBreakdown: {
      jobPortals: {
        description: 'Sales Operations postings growing on Glassdoor and LinkedIn',
        increase: 32,
        timeframe: 'last 30 days'
      },
      careerPages: {
        description: 'Tracked Sales Ops openings at Series B+ companies',
        companiesTracked: 85
      },
      industryReports: {
        description: 'Analyzed RevOps benchmark studies from Clari and SalesLoft',
        reportsAnalyzed: 12
      },
      competitorAnnouncements: {
        description: 'Monitored organizational restructuring announcements',
        announcementsTracked: 28
      }
    },
    demandTrend: [
      { month: 'Jan', demand: 65, postings: 1380 },
      { month: 'Feb', demand: 68, postings: 1480 },
      { month: 'Mar', demand: 72, postings: 1590 },
      { month: 'Apr', demand: 76, postings: 1720 },
      { month: 'May', demand: 80, postings: 1850 },
      { month: 'Jun', demand: 82, postings: 1920 },
      { month: 'Jul', demand: 80, postings: 1880 },
      { month: 'Aug', demand: 83, postings: 1980 },
      { month: 'Sep', demand: 85, postings: 2050 },
      { month: 'Oct', demand: 86, postings: 2120 },
      { month: 'Nov', demand: 85, postings: 2080 },
      { month: 'Dec', demand: 83, postings: 1990 }
    ],
    skillRequirements: [
      { skill: 'Sales Analytics', percentage: 94, trend: 'rising' },
      { skill: 'CRM Administration (Salesforce)', percentage: 92, trend: 'stable' },
      { skill: 'Process Optimization', percentage: 88, trend: 'rising' },
      { skill: 'Data Analysis', percentage: 85, trend: 'rising' },
      { skill: 'Sales Enablement', percentage: 80, trend: 'rising' },
      { skill: 'Cross-functional Collaboration', percentage: 75, trend: 'stable' }
    ],
    competitorHiring: [
      { company: 'Amazon AWS', hires: 85, trend: 'up' },
      { company: 'Microsoft', hires: 72, trend: 'up' },
      { company: 'Salesforce', hires: 65, trend: 'up' },
      { company: 'Google', hires: 48, trend: 'stable' },
      { company: 'Adobe', hires: 38, trend: 'stable' }
    ],
    emergingSkills: [
      { skill: 'AI/ML for Forecasting', heatScore: 92 },
      { skill: 'Revenue Intelligence', heatScore: 88 },
      { skill: 'Sales Automation', heatScore: 85 },
      { skill: 'Data Engineering', heatScore: 80 },
      { skill: 'Cloud Sales Analytics', heatScore: 78 }
    ],
    growthRate: 26.8,
    openPositions: 1950,
    relatedInsights: {
      topSkillsRequested: ['Sales Analytics', 'CRM Administration', 'Process Optimization', 'Data Analysis'],
      internalMatchCount: 4,
      suggestedUpskillingPaths: ['Salesforce Admin Certification', 'Revenue Intelligence Training', 'Data Analytics Bootcamp']
    }
  },
  'sr-007': {
    roleId: 'sr-007',
    roleTitle: 'Salesforce Consultant',
    trendExplanation: {
      summary: 'Salesforce Consultants are in steady demand as companies implement digital sales and marketing automation. Consulting firms like Deloitte are expanding their Salesforce practice across APAC markets.',
      marketSignals: [
        'Digital Sales and Marketing Automation adoption accelerating',
        'CRM integration projects driving consultant demand',
        'Sales Cloud, Service Cloud, and Marketing Cloud implementations',
        'Agile delivery methodologies becoming standard'
      ],
      topIndustries: ['Consulting', 'Enterprise Software', 'Financial Services', 'Retail', 'Healthcare'],
      competitorActions: [
        'Deloitte hiring Salesforce Consultants in Malaysia',
        'Accenture expanding Salesforce practice',
        'IBM scaling digital sales consulting',
        'Capgemini building CRM implementation teams'
      ]
    },
    sourceBreakdown: {
      jobPortals: {
        description: 'Salesforce Consultant postings consistent on LinkedIn and consulting career sites',
        increase: 18,
        timeframe: 'last 30 days'
      },
      careerPages: {
        description: 'Tracked Salesforce practice openings at major consulting firms',
        companiesTracked: 35
      },
      industryReports: {
        description: 'Analyzed Salesforce ecosystem reports and partner announcements',
        reportsAnalyzed: 8
      },
      competitorAnnouncements: {
        description: 'Tracked consulting firm capability announcements',
        announcementsTracked: 22
      }
    },
    demandTrend: [
      { month: 'Jan', demand: 72, postings: 1380 },
      { month: 'Feb', demand: 74, postings: 1420 },
      { month: 'Mar', demand: 76, postings: 1480 },
      { month: 'Apr', demand: 78, postings: 1540 },
      { month: 'May', demand: 80, postings: 1620 },
      { month: 'Jun', demand: 81, postings: 1660 },
      { month: 'Jul', demand: 80, postings: 1640 },
      { month: 'Aug', demand: 82, postings: 1720 },
      { month: 'Sep', demand: 83, postings: 1780 },
      { month: 'Oct', demand: 84, postings: 1820 },
      { month: 'Nov', demand: 83, postings: 1780 },
      { month: 'Dec', demand: 81, postings: 1700 }
    ],
    skillRequirements: [
      { skill: 'Salesforce CRM', percentage: 98, trend: 'stable' },
      { skill: 'Apex/VisualForce Development', percentage: 85, trend: 'stable' },
      { skill: 'Digital Sales Automation', percentage: 82, trend: 'rising' },
      { skill: 'Marketing Cloud', percentage: 78, trend: 'rising' },
      { skill: 'Agile Delivery', percentage: 75, trend: 'stable' },
      { skill: 'CRM Integration', percentage: 72, trend: 'rising' }
    ],
    competitorHiring: [
      { company: 'Deloitte', hires: 125, trend: 'up' },
      { company: 'Accenture', hires: 112, trend: 'stable' },
      { company: 'Salesforce', hires: 98, trend: 'stable' },
      { company: 'IBM', hires: 65, trend: 'stable' },
      { company: 'Capgemini', hires: 52, trend: 'stable' }
    ],
    emergingSkills: [
      { skill: 'Salesforce AI (Einstein)', heatScore: 90 },
      { skill: 'Marketing Cloud Automation', heatScore: 86 },
      { skill: 'Commerce Cloud', heatScore: 82 },
      { skill: 'MuleSoft Integration', heatScore: 78 },
      { skill: 'Tableau Analytics', heatScore: 75 }
    ],
    growthRate: 21.5,
    openPositions: 1680,
    relatedInsights: {
      topSkillsRequested: ['Salesforce CRM', 'Apex Development', 'Digital Sales Automation', 'Marketing Cloud'],
      internalMatchCount: 3,
      suggestedUpskillingPaths: ['Salesforce Developer Certification', 'Marketing Cloud Specialist', 'Einstein Analytics']
    }
  },
  'sr-008': {
    roleId: 'sr-008',
    roleTitle: 'Key Account Manager',
    trendExplanation: {
      summary: 'Key Account Managers remain essential for strategic account growth and customer retention. Roles span across APAC markets with focus on B2B enterprise relationships and partner management.',
      marketSignals: [
        'Companies investing in strategic account teams',
        'Customer retention becoming priority in uncertain economy',
        'B2B relationship management gaining importance',
        'Multi-year deal structures requiring dedicated account leaders'
      ],
      topIndustries: ['Enterprise Software', 'Financial Services', 'Manufacturing', 'Telecommunications', 'Healthcare'],
      competitorActions: [
        'Microsoft building Key Account Management teams in Philippines',
        'Tech companies promoting strategic account coverage',
        'Partner-focused account management growing',
        'Customer success integration with account management'
      ]
    },
    sourceBreakdown: {
      jobPortals: {
        description: 'KAM postings steady across LinkedIn and regional job boards',
        increase: 15,
        timeframe: 'last 30 days'
      },
      careerPages: {
        description: 'Tracked KAM openings at enterprise technology companies',
        companiesTracked: 60
      },
      industryReports: {
        description: 'Analyzed strategic account management studies from RAIN Group',
        reportsAnalyzed: 6
      },
      competitorAnnouncements: {
        description: 'Tracked account team restructuring announcements',
        announcementsTracked: 18
      }
    },
    demandTrend: [
      { month: 'Jan', demand: 68, postings: 1920 },
      { month: 'Feb', demand: 70, postings: 2010 },
      { month: 'Mar', demand: 72, postings: 2100 },
      { month: 'Apr', demand: 74, postings: 2180 },
      { month: 'May', demand: 76, postings: 2280 },
      { month: 'Jun', demand: 77, postings: 2320 },
      { month: 'Jul', demand: 76, postings: 2280 },
      { month: 'Aug', demand: 78, postings: 2380 },
      { month: 'Sep', demand: 79, postings: 2450 },
      { month: 'Oct', demand: 80, postings: 2520 },
      { month: 'Nov', demand: 79, postings: 2480 },
      { month: 'Dec', demand: 77, postings: 2380 }
    ],
    skillRequirements: [
      { skill: 'Strategic Account Management', percentage: 95, trend: 'stable' },
      { skill: 'Customer Engagement', percentage: 90, trend: 'stable' },
      { skill: 'B2B Sales', percentage: 88, trend: 'stable' },
      { skill: 'Negotiation', percentage: 85, trend: 'stable' },
      { skill: 'CRM Tools', percentage: 80, trend: 'stable' },
      { skill: 'Executive Relationships', percentage: 78, trend: 'rising' }
    ],
    competitorHiring: [
      { company: 'Microsoft', hires: 148, trend: 'stable' },
      { company: 'Salesforce', hires: 112, trend: 'stable' },
      { company: 'Oracle', hires: 85, trend: 'stable' },
      { company: 'SAP', hires: 72, trend: 'stable' },
      { company: 'IBM', hires: 58, trend: 'down' }
    ],
    emergingSkills: [
      { skill: 'Digital Account Planning', heatScore: 85 },
      { skill: 'Customer Health Analytics', heatScore: 82 },
      { skill: 'Expansion Revenue', heatScore: 80 },
      { skill: 'Partner Ecosystem Management', heatScore: 76 },
      { skill: 'Value-Based Selling', heatScore: 74 }
    ],
    growthRate: 18.4,
    openPositions: 2340,
    relatedInsights: {
      topSkillsRequested: ['Strategic Account Management', 'Customer Engagement', 'B2B Sales', 'Negotiation'],
      internalMatchCount: 6,
      suggestedUpskillingPaths: ['Strategic Account Certification', 'Executive Engagement Training', 'Value Selling Methodology']
    }
  }
};

// Utility functions
export const getInsightByRoleId = (roleId: string): RoleInsight | undefined => {
  return roleInsights[roleId];
};

export const getInsightByRoleTitle = (title: string): RoleInsight | undefined => {
  return Object.values(roleInsights).find(insight => insight.roleTitle === title);
};
