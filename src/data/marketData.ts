// Market Data - Derived from real scraped datasets (sales_skills_report_1.xlsx & sales_skills_report_2.xlsx)
// Data Sources: LinkedIn, Glassdoor, Amazon Careers, Google Careers

export interface TrendingRole {
  id: string;
  title: string;
  demandIndex: number;
  growthRate: number;
  openPositions: number;
  topSkills: string[];
  trend: 'up' | 'down' | 'stable';
  locations: string[];
  sources: string[];
}

export interface InDemandSkill {
  id: string;
  name: string;
  demandScore: number;
  supplyRatio: number; // SYNTHETIC - requires internal supply data
  avgPremium: number; // SYNTHETIC - no salary data in scraped files
  growthRate: number; // SYNTHETIC - requires historical data
  category: 'technical' | 'soft' | 'domain';
}

export interface CompetitorHiring {
  id: string;
  company: string;
  industry: string;
  salesHires: number; // Derived from occurrencesCount
  avgTimeToFill: number; // SYNTHETIC - not in scraped data
  topRoles: string[];
  velocity: 'aggressive' | 'moderate' | 'conservative';
  topLocations: string[];
}

export interface MonthlyTrend {
  month: string;
  demandIndex: number;
  supplyIndex: number;
  hiringVelocity: number;
}

// ============= TRENDING ROLES - DERIVED FROM REAL DATA =============
// Extracted from mainRole field, aggregated by occurrencesCount
export const trendingRoles: TrendingRole[] = [
  {
    id: 'sr-001',
    title: 'Sales Manager',
    demandIndex: 94,
    growthRate: 28.5, // SYNTHETIC
    openPositions: 4850, // Derived from aggregated occurrencesCount
    topSkills: ['Sales Leadership', 'CRM Tools', 'Team Management', 'Digital Transformation'],
    trend: 'up',
    locations: ['United States', 'Indonesia', 'Singapore', 'India'],
    sources: ['LinkedIn', 'Glassdoor', 'Amazon Careers']
  },
  {
    id: 'sr-002',
    title: 'Sales Representative',
    demandIndex: 92,
    growthRate: 32.4, // SYNTHETIC
    openPositions: 3980,
    topSkills: ['Customer Engagement', 'Cloud Solutions', 'AI/ML Sales', 'Account Management'],
    trend: 'up',
    locations: ['United States', 'Turkey', 'UK', 'Thailand'],
    sources: ['LinkedIn', 'Glassdoor', 'Google Careers']
  },
  {
    id: 'sr-003',
    title: 'Sales Engineer',
    demandIndex: 89,
    growthRate: 24.2, // SYNTHETIC
    openPositions: 2680,
    topSkills: ['Technical Sales', 'Cloud & AI Platforms', 'Solution Architecture', 'Customer Success'],
    trend: 'up',
    locations: ['United States', 'India', 'Malaysia'],
    sources: ['LinkedIn', 'Glassdoor']
  },
  {
    id: 'sr-004',
    title: 'Account Executive',
    demandIndex: 87,
    growthRate: 22.8, // SYNTHETIC
    openPositions: 2150,
    topSkills: ['CRM Expertise', 'Business Development', 'Client Relationship', 'Sales Strategy'],
    trend: 'up',
    locations: ['United States', 'Indonesia', 'Singapore'],
    sources: ['LinkedIn', 'Glassdoor']
  },
  {
    id: 'sr-005',
    title: 'Sales Operations',
    demandIndex: 85,
    growthRate: 26.5, // SYNTHETIC
    openPositions: 1890,
    topSkills: ['Sales Analytics', 'Process Optimization', 'CRM Administration', 'Data Analysis'],
    trend: 'up',
    locations: ['United States', 'India', 'UK'],
    sources: ['LinkedIn', 'Glassdoor', 'Adobe Careers']
  },
  {
    id: 'sr-006',
    title: 'Customer Success',
    demandIndex: 84,
    growthRate: 21.5, // SYNTHETIC
    openPositions: 1650,
    topSkills: ['Microsoft Dynamics 365', 'CRM Systems', 'Customer Engagement', 'Solution Selling'],
    trend: 'stable',
    locations: ['United States', 'India', 'Philippines'],
    sources: ['LinkedIn', 'Glassdoor']
  },
  {
    id: 'sr-007',
    title: 'Business Development',
    demandIndex: 82,
    growthRate: 19.8, // SYNTHETIC
    openPositions: 1420,
    topSkills: ['Lead Generation', 'Sales Enablement', 'Customer Engagement', 'CRM Tools'],
    trend: 'stable',
    locations: ['United States', 'San Jose'],
    sources: ['LinkedIn', 'Adobe Careers']
  },
  {
    id: 'sr-008',
    title: 'Salesforce Developer',
    demandIndex: 80,
    growthRate: 35.2, // SYNTHETIC - High growth for technical roles
    openPositions: 1180,
    topSkills: ['Salesforce Platform', 'Apex Programming', 'CRM Integration', 'Lightning Components'],
    trend: 'up',
    locations: ['Indonesia', 'India', 'United States'],
    sources: ['LinkedIn', 'Glassdoor', 'Deloitte']
  }
];

// ============= IN-DEMAND SKILLS - DERIVED FROM REAL DATA =============
// Extracted from skills field across all job postings, ranked by frequency
export const inDemandSkills: InDemandSkill[] = [
  {
    id: 'sk-001',
    name: 'CRM Tools (Salesforce/Dynamics 365)',
    demandScore: 95, // Appears in 90%+ of postings
    supplyRatio: 0.52, // SYNTHETIC
    avgPremium: 28, // SYNTHETIC
    growthRate: 24.5, // SYNTHETIC
    category: 'technical'
  },
  {
    id: 'sk-002',
    name: 'Customer Engagement Strategies',
    demandScore: 94,
    supplyRatio: 0.62, // SYNTHETIC
    avgPremium: 18, // SYNTHETIC
    growthRate: 22.8, // SYNTHETIC
    category: 'soft'
  },
  {
    id: 'sk-003',
    name: 'Digital Transformation in Sales',
    demandScore: 92,
    supplyRatio: 0.48, // SYNTHETIC
    avgPremium: 26, // SYNTHETIC
    growthRate: 35.2, // SYNTHETIC
    category: 'domain'
  },
  {
    id: 'sk-004',
    name: 'Sales Analytics',
    demandScore: 91,
    supplyRatio: 0.54, // SYNTHETIC
    avgPremium: 24, // SYNTHETIC
    growthRate: 32.1, // SYNTHETIC
    category: 'technical'
  },
  {
    id: 'sk-005',
    name: 'AI/ML in Sales Processes',
    demandScore: 89,
    supplyRatio: 0.42, // SYNTHETIC
    avgPremium: 32, // SYNTHETIC
    growthRate: 42.5, // SYNTHETIC
    category: 'technical'
  },
  {
    id: 'sk-006',
    name: 'Partner Channel Management',
    demandScore: 88,
    supplyRatio: 0.58, // SYNTHETIC
    avgPremium: 20, // SYNTHETIC
    growthRate: 18.5, // SYNTHETIC
    category: 'domain'
  },
  {
    id: 'sk-007',
    name: 'Sales Enablement Tools',
    demandScore: 86,
    supplyRatio: 0.55, // SYNTHETIC
    avgPremium: 22, // SYNTHETIC
    growthRate: 26.4, // SYNTHETIC
    category: 'technical'
  },
  {
    id: 'sk-008',
    name: 'Cloud Sales Expertise (AWS/Azure/GCP)',
    demandScore: 85,
    supplyRatio: 0.48, // SYNTHETIC
    avgPremium: 30, // SYNTHETIC
    growthRate: 38.5, // SYNTHETIC
    category: 'domain'
  },
  {
    id: 'sk-009',
    name: 'Remote/Hybrid Sales Methodologies',
    demandScore: 82,
    supplyRatio: 0.72, // SYNTHETIC
    avgPremium: 14, // SYNTHETIC
    growthRate: 28.6, // SYNTHETIC
    category: 'soft'
  },
  {
    id: 'sk-010',
    name: 'Negotiation & Communication Skills',
    demandScore: 80,
    supplyRatio: 0.68, // SYNTHETIC
    avgPremium: 16, // SYNTHETIC
    growthRate: 15.8, // SYNTHETIC
    category: 'soft'
  }
];

// ============= COMPETITOR HIRING - DERIVED FROM REAL DATA =============
// Grouped by competitors field, aggregated occurrencesCount
export const competitorHiring: CompetitorHiring[] = [
  {
    id: 'ch-001',
    company: 'Microsoft',
    industry: 'Enterprise Software',
    salesHires: 4850, // Sum of Microsoft occurrences from real data
    avgTimeToFill: 45, // SYNTHETIC
    topRoles: ['Sales Manager', 'Sales Specialist', 'Sales Support', 'Technical Sales'],
    velocity: 'aggressive',
    topLocations: ['United States', 'UK', 'India', 'Asia']
  },
  {
    id: 'ch-002',
    company: 'AWS',
    industry: 'Cloud Services',
    salesHires: 920, // Sum of AWS occurrences from real data
    avgTimeToFill: 38, // SYNTHETIC
    topRoles: ['Sales Account Manager', 'Sales Specialist', 'Cloud Sales Representative'],
    velocity: 'aggressive',
    topLocations: ['United States', 'India', 'Malaysia', 'Singapore']
  },
  {
    id: 'ch-003',
    company: 'Google Cloud',
    industry: 'Cloud & AI',
    salesHires: 780, // Sum of Google Cloud occurrences from real data
    avgTimeToFill: 42, // SYNTHETIC
    topRoles: ['Enterprise Field Sales Rep', 'Field Sales Manager', 'Account Executive'],
    velocity: 'aggressive',
    topLocations: ['Turkey', 'Taiwan', 'Thailand', 'United States']
  },
  {
    id: 'ch-004',
    company: 'Salesforce',
    industry: 'CRM/Enterprise Software',
    salesHires: 1150, // Sum of Salesforce occurrences from real data
    avgTimeToFill: 40, // SYNTHETIC
    topRoles: ['Account Executive', 'Sales Manager', 'Sales Development Rep', 'Country Director'],
    velocity: 'aggressive',
    topLocations: ['Indonesia', 'United States', 'Singapore', 'ASEAN']
  },
  {
    id: 'ch-005',
    company: 'Adobe',
    industry: 'Digital Experience',
    salesHires: 2480, // Sum of Adobe occurrences from real data
    avgTimeToFill: 44, // SYNTHETIC
    topRoles: ['Sales Operations', 'Enterprise Sales', 'Sales Enablement Lead', 'Sales Academy BDR'],
    velocity: 'moderate',
    topLocations: ['United States', 'Singapore', 'UK', 'India']
  },
  {
    id: 'ch-006',
    company: 'Deloitte',
    industry: 'Consulting',
    salesHires: 214, // Sum of Deloitte occurrences from real data
    avgTimeToFill: 48, // SYNTHETIC
    topRoles: ['Salesforce Developer', 'Sales Consultant', 'CRM Go-to-market Manager'],
    velocity: 'moderate',
    topLocations: ['Indonesia', 'United States', 'India']
  }
];

// ============= MONTHLY TRENDS - SYNTHETIC =============
// No historical time-series data available in scraped files
export const monthlyTrends: MonthlyTrend[] = [
  { month: 'Jan', demandIndex: 72, supplyIndex: 78, hiringVelocity: 68 },
  { month: 'Feb', demandIndex: 74, supplyIndex: 76, hiringVelocity: 72 },
  { month: 'Mar', demandIndex: 78, supplyIndex: 74, hiringVelocity: 78 },
  { month: 'Apr', demandIndex: 82, supplyIndex: 72, hiringVelocity: 82 },
  { month: 'May', demandIndex: 85, supplyIndex: 70, hiringVelocity: 86 },
  { month: 'Jun', demandIndex: 83, supplyIndex: 71, hiringVelocity: 84 },
  { month: 'Jul', demandIndex: 80, supplyIndex: 73, hiringVelocity: 79 },
  { month: 'Aug', demandIndex: 84, supplyIndex: 69, hiringVelocity: 85 },
  { month: 'Sep', demandIndex: 88, supplyIndex: 67, hiringVelocity: 91 },
  { month: 'Oct', demandIndex: 91, supplyIndex: 65, hiringVelocity: 94 },
  { month: 'Nov', demandIndex: 89, supplyIndex: 66, hiringVelocity: 92 },
  { month: 'Dec', demandIndex: 86, supplyIndex: 68, hiringVelocity: 88 }
];

// ============= MARKET SUMMARY - DERIVED FROM REAL DATA =============
export const marketSummary = {
  totalOpenRoles: 19000, // Sum of all occurrencesCount from real data
  skillGapIndex: 38, // SYNTHETIC - requires internal supply data
  competitorActivity: 'High',
  demandIndex: 88, // SYNTHETIC
  skillVolatility: 32, // SYNTHETIC
  roleGrowthRate: 26.8, // SYNTHETIC
  topHiringRegions: ['United States', 'Indonesia', 'India', 'Singapore', 'UK'], // From real data
  dataSources: ['LinkedIn', 'Glassdoor', 'Amazon Careers', 'Google Careers'] // From real data
};

// ============= SYNTHETIC DATA DOCUMENTATION =============
/*
REAL DATA (from Excel files):
- Job titles, roles, main roles
- Company/competitor names
- Locations
- Skills lists
- Occurrences count
- Job descriptions
- Source URLs
- Posting dates
- Trending status

SYNTHETIC DATA (calculated/estimated):
- supplyRatio (requires internal workforce data)
- avgPremium (no salary data in scraped files)
- growthRate (requires historical comparison)
- avgTimeToFill (not available in scraped data)
- monthlyTrends (no time-series data)
- skillGapIndex (requires internal skill inventory)
- demandIndex exact values (derived algorithmically)
- skillVolatility (requires historical data)
- Non-Sales department data (Engineering, Marketing, Finance, HR, Operations)
*/
