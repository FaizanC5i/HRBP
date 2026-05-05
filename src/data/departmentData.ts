import { Department } from '@/contexts/DepartmentContext';
import { TrendingRole, InDemandSkill, CompetitorHiring, MonthlyTrend } from './marketData';
import { Employee, SkillNeedAnalysis, LearningRecommendation } from './employeeData';

// ============= ENGINEERING DATA =============
export const engineeringRoles: TrendingRole[] = [
  {
    id: 'eng-001',
    title: 'Cloud Solutions Architect',
    demandIndex: 96,
    growthRate: 38.2,
    openPositions: 5420,
    topSkills: ['AWS/Azure/GCP', 'Kubernetes', 'Terraform', 'Microservices'],
    trend: 'up',
    locations: ['United States', 'India', 'Germany', 'Singapore'],
    sources: ['LinkedIn', 'Google Careers', 'Microsoft Careers']
  },
  {
    id: 'eng-002',
    title: 'Machine Learning Engineer',
    demandIndex: 94,
    growthRate: 42.5,
    openPositions: 4280,
    topSkills: ['Python', 'TensorFlow/PyTorch', 'MLOps', 'Deep Learning'],
    trend: 'up',
    locations: ['United States', 'Canada', 'UK', 'India'],
    sources: ['LinkedIn', 'Google Careers', 'Meta Careers']
  },
  {
    id: 'eng-003',
    title: 'DevOps Engineer',
    demandIndex: 91,
    growthRate: 28.4,
    openPositions: 6120,
    topSkills: ['CI/CD', 'Docker', 'Kubernetes', 'Infrastructure as Code'],
    trend: 'up',
    locations: ['India', 'United States', 'Germany', 'Netherlands'],
    sources: ['LinkedIn', 'Glassdoor', 'Indeed']
  },
  {
    id: 'eng-004',
    title: 'Full Stack Developer',
    demandIndex: 89,
    growthRate: 22.8,
    openPositions: 8950,
    topSkills: ['React/Vue', 'Node.js', 'TypeScript', 'PostgreSQL'],
    trend: 'up',
    locations: ['India', 'Philippines', 'Poland', 'Brazil'],
    sources: ['LinkedIn', 'Glassdoor', 'Stack Overflow Jobs']
  },
  {
    id: 'eng-005',
    title: 'Data Engineer',
    demandIndex: 88,
    growthRate: 32.1,
    openPositions: 3850,
    topSkills: ['Apache Spark', 'Data Pipelines', 'SQL', 'Python'],
    trend: 'up',
    locations: ['United States', 'India', 'UK', 'Germany'],
    sources: ['LinkedIn', 'Amazon Careers', 'Glassdoor']
  },
  {
    id: 'eng-006',
    title: 'Site Reliability Engineer',
    demandIndex: 86,
    growthRate: 26.5,
    openPositions: 2180,
    topSkills: ['System Design', 'Monitoring', 'Incident Response', 'Automation'],
    trend: 'up',
    locations: ['United States', 'India', 'Ireland', 'Singapore'],
    sources: ['Google Careers', 'LinkedIn', 'Meta Careers']
  }
];

export const engineeringSkills: InDemandSkill[] = [
  { id: 'esk-001', name: 'Kubernetes & Container Orchestration', demandScore: 95, supplyRatio: 0.48, avgPremium: 32, growthRate: 42.5, category: 'technical' },
  { id: 'esk-002', name: 'Machine Learning & AI', demandScore: 94, supplyRatio: 0.42, avgPremium: 38, growthRate: 48.2, category: 'technical' },
  { id: 'esk-003', name: 'Cloud Architecture (AWS/Azure/GCP)', demandScore: 93, supplyRatio: 0.52, avgPremium: 30, growthRate: 35.8, category: 'technical' },
  { id: 'esk-004', name: 'DevOps & CI/CD', demandScore: 91, supplyRatio: 0.58, avgPremium: 26, growthRate: 28.4, category: 'technical' },
  { id: 'esk-005', name: 'System Design', demandScore: 89, supplyRatio: 0.55, avgPremium: 28, growthRate: 24.6, category: 'technical' },
  { id: 'esk-006', name: 'Python Programming', demandScore: 88, supplyRatio: 0.68, avgPremium: 18, growthRate: 22.1, category: 'technical' },
  { id: 'esk-007', name: 'Data Engineering', demandScore: 87, supplyRatio: 0.50, avgPremium: 28, growthRate: 32.4, category: 'technical' },
  { id: 'esk-008', name: 'Agile/Scrum Methodologies', demandScore: 82, supplyRatio: 0.72, avgPremium: 12, growthRate: 15.2, category: 'soft' }
];

export const engineeringCompetitors: CompetitorHiring[] = [
  { id: 'ech-001', company: 'Google', industry: 'Tech', salesHires: 1850, avgTimeToFill: 48, topRoles: ['Software Engineer', 'ML Engineer', 'SRE'], velocity: 'aggressive', topLocations: ['United States', 'India', 'UK'] },
  { id: 'ech-002', company: 'Meta', industry: 'Tech', salesHires: 1420, avgTimeToFill: 42, topRoles: ['Full Stack Developer', 'Data Engineer', 'Infrastructure Engineer'], velocity: 'aggressive', topLocations: ['United States', 'UK', 'Singapore'] },
  { id: 'ech-003', company: 'Amazon', industry: 'Tech/E-commerce', salesHires: 2850, avgTimeToFill: 38, topRoles: ['Cloud Engineer', 'DevOps Engineer', 'Software Developer'], velocity: 'aggressive', topLocations: ['United States', 'India', 'Germany'] },
  { id: 'ech-004', company: 'Microsoft', industry: 'Enterprise Software', salesHires: 2120, avgTimeToFill: 45, topRoles: ['Azure Engineer', 'Software Engineer', 'Data Scientist'], velocity: 'aggressive', topLocations: ['United States', 'India', 'Ireland'] }
];

// ============= MARKETING DATA =============
export const marketingRoles: TrendingRole[] = [
  {
    id: 'mkt-001',
    title: 'Growth Marketing Manager',
    demandIndex: 92,
    growthRate: 34.5,
    openPositions: 3280,
    topSkills: ['Growth Hacking', 'A/B Testing', 'SEO/SEM', 'Analytics'],
    trend: 'up',
    locations: ['United States', 'UK', 'Germany', 'Australia'],
    sources: ['LinkedIn', 'Glassdoor', 'Indeed']
  },
  {
    id: 'mkt-002',
    title: 'Digital Marketing Specialist',
    demandIndex: 89,
    growthRate: 26.8,
    openPositions: 5420,
    topSkills: ['Social Media Marketing', 'Content Strategy', 'PPC', 'Marketing Automation'],
    trend: 'up',
    locations: ['India', 'Philippines', 'United States', 'UK'],
    sources: ['LinkedIn', 'Glassdoor', 'Indeed']
  },
  {
    id: 'mkt-003',
    title: 'Product Marketing Manager',
    demandIndex: 88,
    growthRate: 28.2,
    openPositions: 2150,
    topSkills: ['Go-to-Market Strategy', 'Competitive Analysis', 'Messaging', 'Sales Enablement'],
    trend: 'up',
    locations: ['United States', 'UK', 'Germany', 'Singapore'],
    sources: ['LinkedIn', 'Glassdoor', 'AngelList']
  },
  {
    id: 'mkt-004',
    title: 'Content Marketing Manager',
    demandIndex: 85,
    growthRate: 22.4,
    openPositions: 2890,
    topSkills: ['Content Strategy', 'SEO', 'Copywriting', 'Brand Storytelling'],
    trend: 'up',
    locations: ['United States', 'India', 'UK', 'Canada'],
    sources: ['LinkedIn', 'Indeed', 'Glassdoor']
  },
  {
    id: 'mkt-005',
    title: 'Marketing Analytics Manager',
    demandIndex: 86,
    growthRate: 30.5,
    openPositions: 1680,
    topSkills: ['Data Analysis', 'Google Analytics', 'SQL', 'Attribution Modeling'],
    trend: 'up',
    locations: ['United States', 'UK', 'Germany', 'India'],
    sources: ['LinkedIn', 'Glassdoor', 'Indeed']
  }
];

export const marketingSkills: InDemandSkill[] = [
  { id: 'msk-001', name: 'Marketing Automation (HubSpot/Marketo)', demandScore: 92, supplyRatio: 0.55, avgPremium: 24, growthRate: 32.5, category: 'technical' },
  { id: 'msk-002', name: 'SEO/SEM Strategy', demandScore: 90, supplyRatio: 0.62, avgPremium: 20, growthRate: 26.8, category: 'technical' },
  { id: 'msk-003', name: 'Data-Driven Marketing', demandScore: 89, supplyRatio: 0.48, avgPremium: 28, growthRate: 35.2, category: 'technical' },
  { id: 'msk-004', name: 'Content Strategy', demandScore: 87, supplyRatio: 0.65, avgPremium: 18, growthRate: 22.4, category: 'soft' },
  { id: 'msk-005', name: 'Social Media Marketing', demandScore: 85, supplyRatio: 0.72, avgPremium: 14, growthRate: 18.6, category: 'domain' },
  { id: 'msk-006', name: 'Brand Management', demandScore: 84, supplyRatio: 0.68, avgPremium: 16, growthRate: 15.8, category: 'soft' },
  { id: 'msk-007', name: 'Performance Marketing', demandScore: 88, supplyRatio: 0.52, avgPremium: 26, growthRate: 30.2, category: 'domain' }
];

export const marketingCompetitors: CompetitorHiring[] = [
  { id: 'mch-001', company: 'HubSpot', industry: 'Marketing Tech', salesHires: 420, avgTimeToFill: 42, topRoles: ['Growth Marketer', 'Content Strategist', 'Product Marketing Manager'], velocity: 'aggressive', topLocations: ['United States', 'Ireland', 'UK'] },
  { id: 'mch-002', company: 'Salesforce', industry: 'CRM/Marketing', salesHires: 580, avgTimeToFill: 45, topRoles: ['Digital Marketing Manager', 'Marketing Ops', 'Brand Manager'], velocity: 'moderate', topLocations: ['United States', 'UK', 'India'] },
  { id: 'mch-003', company: 'Adobe', industry: 'Digital Experience', salesHires: 485, avgTimeToFill: 44, topRoles: ['Marketing Analytics Manager', 'Content Marketing Lead', 'Demand Gen Manager'], velocity: 'moderate', topLocations: ['United States', 'India', 'Germany'] }
];

// ============= FINANCE DATA =============
export const financeRoles: TrendingRole[] = [
  {
    id: 'fin-001',
    title: 'Financial Analyst',
    demandIndex: 88,
    growthRate: 24.5,
    openPositions: 4280,
    topSkills: ['Financial Modeling', 'Excel/Power BI', 'FP&A', 'Data Analysis'],
    trend: 'up',
    locations: ['United States', 'UK', 'Singapore', 'India'],
    sources: ['LinkedIn', 'Glassdoor', 'Indeed']
  },
  {
    id: 'fin-002',
    title: 'FP&A Manager',
    demandIndex: 86,
    growthRate: 22.8,
    openPositions: 1850,
    topSkills: ['Budgeting', 'Forecasting', 'Strategic Planning', 'ERP Systems'],
    trend: 'up',
    locations: ['United States', 'UK', 'Germany', 'Singapore'],
    sources: ['LinkedIn', 'Glassdoor', 'Robert Half']
  },
  {
    id: 'fin-003',
    title: 'Risk Analyst',
    demandIndex: 84,
    growthRate: 28.2,
    openPositions: 2420,
    topSkills: ['Risk Assessment', 'Regulatory Compliance', 'Statistical Analysis', 'Python/R'],
    trend: 'up',
    locations: ['United States', 'UK', 'Singapore', 'Hong Kong'],
    sources: ['LinkedIn', 'eFinancialCareers', 'Glassdoor']
  },
  {
    id: 'fin-004',
    title: 'Treasury Analyst',
    demandIndex: 82,
    growthRate: 18.5,
    openPositions: 1280,
    topSkills: ['Cash Management', 'Liquidity Planning', 'FX Management', 'Banking Relations'],
    trend: 'stable',
    locations: ['United States', 'UK', 'Netherlands', 'Singapore'],
    sources: ['LinkedIn', 'Glassdoor', 'Indeed']
  },
  {
    id: 'fin-005',
    title: 'Data Analytics - Finance',
    demandIndex: 90,
    growthRate: 35.2,
    openPositions: 2180,
    topSkills: ['SQL', 'Python', 'Tableau/Power BI', 'Financial Data Analysis'],
    trend: 'up',
    locations: ['United States', 'India', 'UK', 'Germany'],
    sources: ['LinkedIn', 'Glassdoor', 'Indeed']
  }
];

export const financeSkills: InDemandSkill[] = [
  { id: 'fsk-001', name: 'Financial Modeling', demandScore: 91, supplyRatio: 0.58, avgPremium: 24, growthRate: 26.5, category: 'technical' },
  { id: 'fsk-002', name: 'Data Analytics (SQL/Python)', demandScore: 90, supplyRatio: 0.48, avgPremium: 28, growthRate: 35.2, category: 'technical' },
  { id: 'fsk-003', name: 'FP&A', demandScore: 88, supplyRatio: 0.62, avgPremium: 22, growthRate: 24.8, category: 'domain' },
  { id: 'fsk-004', name: 'Risk Management', demandScore: 86, supplyRatio: 0.55, avgPremium: 26, growthRate: 28.2, category: 'domain' },
  { id: 'fsk-005', name: 'ERP Systems (SAP/Oracle)', demandScore: 84, supplyRatio: 0.65, avgPremium: 18, growthRate: 18.5, category: 'technical' },
  { id: 'fsk-006', name: 'Business Intelligence Tools', demandScore: 87, supplyRatio: 0.52, avgPremium: 24, growthRate: 30.4, category: 'technical' }
];

export const financeCompetitors: CompetitorHiring[] = [
  { id: 'fch-001', company: 'JPMorgan Chase', industry: 'Banking', salesHires: 1850, avgTimeToFill: 52, topRoles: ['Financial Analyst', 'Risk Analyst', 'Data Analyst'], velocity: 'aggressive', topLocations: ['United States', 'UK', 'India'] },
  { id: 'fch-002', company: 'Goldman Sachs', industry: 'Investment Banking', salesHires: 980, avgTimeToFill: 55, topRoles: ['FP&A Manager', 'Treasury Analyst', 'Quantitative Analyst'], velocity: 'moderate', topLocations: ['United States', 'UK', 'Singapore'] },
  { id: 'fch-003', company: 'Deloitte', industry: 'Consulting', salesHires: 1420, avgTimeToFill: 48, topRoles: ['Financial Consultant', 'Risk Advisory', 'Finance Transformation'], velocity: 'aggressive', topLocations: ['United States', 'UK', 'India'] }
];

// ============= HR DATA =============
export const hrRoles: TrendingRole[] = [
  {
    id: 'hr-001',
    title: 'HR Business Partner',
    demandIndex: 87,
    growthRate: 22.5,
    openPositions: 3180,
    topSkills: ['Strategic HR', 'Workforce Planning', 'Employee Relations', 'Change Management'],
    trend: 'up',
    locations: ['United States', 'UK', 'Germany', 'India'],
    sources: ['LinkedIn', 'Glassdoor', 'Indeed']
  },
  {
    id: 'hr-002',
    title: 'Talent Acquisition Specialist',
    demandIndex: 85,
    growthRate: 18.8,
    openPositions: 4520,
    topSkills: ['Sourcing', 'ATS Systems', 'Interviewing', 'Employer Branding'],
    trend: 'up',
    locations: ['India', 'Philippines', 'United States', 'UK'],
    sources: ['LinkedIn', 'Glassdoor', 'Indeed']
  },
  {
    id: 'hr-003',
    title: 'People Analytics Manager',
    demandIndex: 90,
    growthRate: 38.5,
    openPositions: 1280,
    topSkills: ['HR Analytics', 'Data Visualization', 'Statistical Analysis', 'Predictive Modeling'],
    trend: 'up',
    locations: ['United States', 'UK', 'Germany', 'Singapore'],
    sources: ['LinkedIn', 'Glassdoor', 'SHRM']
  },
  {
    id: 'hr-004',
    title: 'Learning & Development Manager',
    demandIndex: 84,
    growthRate: 24.2,
    openPositions: 1850,
    topSkills: ['Training Design', 'LMS Administration', 'Leadership Development', 'Performance Management'],
    trend: 'up',
    locations: ['United States', 'India', 'UK', 'Australia'],
    sources: ['LinkedIn', 'Indeed', 'Glassdoor']
  },
  {
    id: 'hr-005',
    title: 'Compensation & Benefits Analyst',
    demandIndex: 82,
    growthRate: 20.5,
    openPositions: 1420,
    topSkills: ['Compensation Analysis', 'Benefits Administration', 'Market Benchmarking', 'HRIS'],
    trend: 'stable',
    locations: ['United States', 'UK', 'Germany', 'India'],
    sources: ['LinkedIn', 'Glassdoor', 'WorldatWork']
  }
];

export const hrSkills: InDemandSkill[] = [
  { id: 'hsk-001', name: 'People Analytics', demandScore: 92, supplyRatio: 0.42, avgPremium: 32, growthRate: 42.5, category: 'technical' },
  { id: 'hsk-002', name: 'HR Technology (HRIS/ATS)', demandScore: 88, supplyRatio: 0.55, avgPremium: 22, growthRate: 28.4, category: 'technical' },
  { id: 'hsk-003', name: 'Change Management', demandScore: 87, supplyRatio: 0.58, avgPremium: 24, growthRate: 26.8, category: 'soft' },
  { id: 'hsk-004', name: 'Workforce Planning', demandScore: 86, supplyRatio: 0.52, avgPremium: 26, growthRate: 28.2, category: 'domain' },
  { id: 'hsk-005', name: 'Employee Experience Design', demandScore: 85, supplyRatio: 0.48, avgPremium: 28, growthRate: 32.5, category: 'soft' },
  { id: 'hsk-006', name: 'DEI Strategy', demandScore: 84, supplyRatio: 0.45, avgPremium: 26, growthRate: 35.2, category: 'domain' }
];

export const hrCompetitors: CompetitorHiring[] = [
  { id: 'hch-001', company: 'Workday', industry: 'HR Tech', salesHires: 380, avgTimeToFill: 45, topRoles: ['HRBP', 'People Analytics', 'Talent Acquisition'], velocity: 'aggressive', topLocations: ['United States', 'UK', 'Ireland'] },
  { id: 'hch-002', company: 'LinkedIn', industry: 'Tech/Social', salesHires: 420, avgTimeToFill: 42, topRoles: ['Talent Partner', 'L&D Manager', 'HR Business Partner'], velocity: 'aggressive', topLocations: ['United States', 'India', 'Ireland'] },
  { id: 'hch-003', company: 'Mercer', industry: 'HR Consulting', salesHires: 520, avgTimeToFill: 48, topRoles: ['Compensation Analyst', 'HR Consultant', 'Benefits Specialist'], velocity: 'moderate', topLocations: ['United States', 'UK', 'Singapore'] }
];

// ============= OPERATIONS DATA =============
export const operationsRoles: TrendingRole[] = [
  {
    id: 'ops-001',
    title: 'Supply Chain Manager',
    demandIndex: 89,
    growthRate: 26.8,
    openPositions: 3420,
    topSkills: ['Supply Chain Optimization', 'Inventory Management', 'Vendor Management', 'ERP Systems'],
    trend: 'up',
    locations: ['United States', 'Germany', 'China', 'India'],
    sources: ['LinkedIn', 'Glassdoor', 'Indeed']
  },
  {
    id: 'ops-002',
    title: 'Operations Analyst',
    demandIndex: 86,
    growthRate: 24.5,
    openPositions: 4180,
    topSkills: ['Process Optimization', 'Data Analysis', 'Six Sigma', 'Project Management'],
    trend: 'up',
    locations: ['India', 'United States', 'Philippines', 'UK'],
    sources: ['LinkedIn', 'Glassdoor', 'Indeed']
  },
  {
    id: 'ops-003',
    title: 'Project Manager',
    demandIndex: 87,
    growthRate: 22.2,
    openPositions: 6850,
    topSkills: ['Project Planning', 'Stakeholder Management', 'Agile/Scrum', 'Risk Management'],
    trend: 'up',
    locations: ['United States', 'India', 'UK', 'Germany'],
    sources: ['LinkedIn', 'PMI', 'Indeed']
  },
  {
    id: 'ops-004',
    title: 'Business Process Manager',
    demandIndex: 84,
    growthRate: 28.5,
    openPositions: 2180,
    topSkills: ['Process Mapping', 'Automation', 'Lean Six Sigma', 'Change Management'],
    trend: 'up',
    locations: ['United States', 'UK', 'Germany', 'India'],
    sources: ['LinkedIn', 'Glassdoor', 'Indeed']
  },
  {
    id: 'ops-005',
    title: 'Quality Assurance Manager',
    demandIndex: 82,
    growthRate: 18.5,
    openPositions: 1920,
    topSkills: ['Quality Systems', 'ISO Standards', 'Audit Management', 'Continuous Improvement'],
    trend: 'stable',
    locations: ['Germany', 'United States', 'China', 'India'],
    sources: ['LinkedIn', 'Glassdoor', 'Indeed']
  }
];

export const operationsSkills: InDemandSkill[] = [
  { id: 'osk-001', name: 'Supply Chain Analytics', demandScore: 90, supplyRatio: 0.48, avgPremium: 28, growthRate: 32.5, category: 'technical' },
  { id: 'osk-002', name: 'Process Automation (RPA)', demandScore: 89, supplyRatio: 0.45, avgPremium: 30, growthRate: 38.2, category: 'technical' },
  { id: 'osk-003', name: 'Lean Six Sigma', demandScore: 87, supplyRatio: 0.62, avgPremium: 22, growthRate: 22.4, category: 'domain' },
  { id: 'osk-004', name: 'Project Management (PMP/Agile)', demandScore: 86, supplyRatio: 0.68, avgPremium: 18, growthRate: 18.5, category: 'domain' },
  { id: 'osk-005', name: 'ERP Systems (SAP/Oracle)', demandScore: 85, supplyRatio: 0.58, avgPremium: 24, growthRate: 20.8, category: 'technical' },
  { id: 'osk-006', name: 'Data-Driven Decision Making', demandScore: 88, supplyRatio: 0.52, avgPremium: 26, growthRate: 28.6, category: 'soft' }
];

export const operationsCompetitors: CompetitorHiring[] = [
  { id: 'och-001', company: 'Amazon', industry: 'E-commerce/Logistics', salesHires: 3850, avgTimeToFill: 35, topRoles: ['Operations Manager', 'Supply Chain Analyst', 'Process Engineer'], velocity: 'aggressive', topLocations: ['United States', 'Germany', 'India'] },
  { id: 'och-002', company: 'FedEx', industry: 'Logistics', salesHires: 1280, avgTimeToFill: 40, topRoles: ['Operations Analyst', 'Logistics Manager', 'Quality Manager'], velocity: 'moderate', topLocations: ['United States', 'Germany', 'China'] },
  { id: 'och-003', company: 'McKinsey', industry: 'Consulting', salesHires: 680, avgTimeToFill: 55, topRoles: ['Operations Consultant', 'Supply Chain Expert', 'Process Excellence'], velocity: 'moderate', topLocations: ['United States', 'UK', 'Germany'] }
];

// ============= DEPARTMENT DATA MAPPING =============
import { trendingRoles, inDemandSkills, competitorHiring, monthlyTrends, marketSummary } from './marketData';
import { employees, skillNeedAnalysis, learningRecommendations, trainingMetrics, businessImpactMetrics } from './employeeData';

// Monthly trends per department (variations)
const generateMonthlyTrends = (baseMultiplier: number): MonthlyTrend[] => [
  { month: 'Jan', demandIndex: Math.round(72 * baseMultiplier), supplyIndex: Math.round(78 / baseMultiplier), hiringVelocity: Math.round(68 * baseMultiplier) },
  { month: 'Feb', demandIndex: Math.round(74 * baseMultiplier), supplyIndex: Math.round(76 / baseMultiplier), hiringVelocity: Math.round(72 * baseMultiplier) },
  { month: 'Mar', demandIndex: Math.round(78 * baseMultiplier), supplyIndex: Math.round(74 / baseMultiplier), hiringVelocity: Math.round(78 * baseMultiplier) },
  { month: 'Apr', demandIndex: Math.round(82 * baseMultiplier), supplyIndex: Math.round(72 / baseMultiplier), hiringVelocity: Math.round(82 * baseMultiplier) },
  { month: 'May', demandIndex: Math.round(85 * baseMultiplier), supplyIndex: Math.round(70 / baseMultiplier), hiringVelocity: Math.round(86 * baseMultiplier) },
  { month: 'Jun', demandIndex: Math.round(83 * baseMultiplier), supplyIndex: Math.round(71 / baseMultiplier), hiringVelocity: Math.round(84 * baseMultiplier) },
  { month: 'Jul', demandIndex: Math.round(80 * baseMultiplier), supplyIndex: Math.round(73 / baseMultiplier), hiringVelocity: Math.round(79 * baseMultiplier) },
  { month: 'Aug', demandIndex: Math.round(84 * baseMultiplier), supplyIndex: Math.round(69 / baseMultiplier), hiringVelocity: Math.round(85 * baseMultiplier) },
  { month: 'Sep', demandIndex: Math.round(88 * baseMultiplier), supplyIndex: Math.round(67 / baseMultiplier), hiringVelocity: Math.round(91 * baseMultiplier) },
  { month: 'Oct', demandIndex: Math.round(91 * baseMultiplier), supplyIndex: Math.round(65 / baseMultiplier), hiringVelocity: Math.round(94 * baseMultiplier) },
  { month: 'Nov', demandIndex: Math.round(89 * baseMultiplier), supplyIndex: Math.round(66 / baseMultiplier), hiringVelocity: Math.round(92 * baseMultiplier) },
  { month: 'Dec', demandIndex: Math.round(86 * baseMultiplier), supplyIndex: Math.round(68 / baseMultiplier), hiringVelocity: Math.round(88 * baseMultiplier) }
];

export const getDepartmentData = (department: Department) => {
  switch (department) {
    case 'Engineering':
      return {
        trendingRoles: engineeringRoles,
        inDemandSkills: engineeringSkills,
        competitorHiring: engineeringCompetitors,
        monthlyTrends: generateMonthlyTrends(1.05),
        marketSummary: {
          totalOpenRoles: 32450,
          skillGapIndex: 42,
          competitorActivity: 'Very High' as const,
          demandIndex: 92,
          skillVolatility: 38,
          roleGrowthRate: 32.4,
          topHiringRegions: ['United States', 'India', 'Germany', 'UK'],
          dataSources: ['LinkedIn', 'GitHub Jobs', 'Google Careers', 'Stack Overflow']
        },
        employees: employees.slice(0, 8),
        skillNeedAnalysis: skillNeedAnalysis,
        learningRecommendations: learningRecommendations.slice(0, 4),
        trainingMetrics,
        businessImpactMetrics
      };
    case 'Marketing':
      return {
        trendingRoles: marketingRoles,
        inDemandSkills: marketingSkills,
        competitorHiring: marketingCompetitors,
        monthlyTrends: generateMonthlyTrends(0.95),
        marketSummary: {
          totalOpenRoles: 18920,
          skillGapIndex: 35,
          competitorActivity: 'High' as const,
          demandIndex: 86,
          skillVolatility: 28,
          roleGrowthRate: 26.5,
          topHiringRegions: ['United States', 'UK', 'India', 'Germany'],
          dataSources: ['LinkedIn', 'Glassdoor', 'Indeed', 'Marketing Week']
        },
        employees: employees.slice(2, 10),
        skillNeedAnalysis: skillNeedAnalysis,
        learningRecommendations: learningRecommendations.slice(1, 5),
        trainingMetrics,
        businessImpactMetrics
      };
    case 'Finance':
      return {
        trendingRoles: financeRoles,
        inDemandSkills: financeSkills,
        competitorHiring: financeCompetitors,
        monthlyTrends: generateMonthlyTrends(0.92),
        marketSummary: {
          totalOpenRoles: 15680,
          skillGapIndex: 32,
          competitorActivity: 'Moderate' as const,
          demandIndex: 84,
          skillVolatility: 24,
          roleGrowthRate: 24.2,
          topHiringRegions: ['United States', 'UK', 'Singapore', 'Hong Kong'],
          dataSources: ['LinkedIn', 'eFinancialCareers', 'Glassdoor', 'Robert Half']
        },
        employees: employees.slice(4, 12),
        skillNeedAnalysis: skillNeedAnalysis,
        learningRecommendations: learningRecommendations.slice(2, 6),
        trainingMetrics,
        businessImpactMetrics
      };
    case 'HR':
      return {
        trendingRoles: hrRoles,
        inDemandSkills: hrSkills,
        competitorHiring: hrCompetitors,
        monthlyTrends: generateMonthlyTrends(0.88),
        marketSummary: {
          totalOpenRoles: 12450,
          skillGapIndex: 38,
          competitorActivity: 'Moderate' as const,
          demandIndex: 82,
          skillVolatility: 30,
          roleGrowthRate: 22.8,
          topHiringRegions: ['United States', 'India', 'UK', 'Germany'],
          dataSources: ['LinkedIn', 'SHRM', 'Glassdoor', 'Indeed']
        },
        employees: employees.slice(0, 10),
        skillNeedAnalysis: skillNeedAnalysis,
        learningRecommendations: learningRecommendations,
        trainingMetrics,
        businessImpactMetrics
      };
    case 'Operations':
      return {
        trendingRoles: operationsRoles,
        inDemandSkills: operationsSkills,
        competitorHiring: operationsCompetitors,
        monthlyTrends: generateMonthlyTrends(0.94),
        marketSummary: {
          totalOpenRoles: 22180,
          skillGapIndex: 34,
          competitorActivity: 'High' as const,
          demandIndex: 85,
          skillVolatility: 26,
          roleGrowthRate: 24.8,
          topHiringRegions: ['United States', 'Germany', 'India', 'China'],
          dataSources: ['LinkedIn', 'Glassdoor', 'Indeed', 'Supply Chain Dive']
        },
        employees: employees.slice(3, 11),
        skillNeedAnalysis: skillNeedAnalysis,
        learningRecommendations: learningRecommendations.slice(0, 5),
        trainingMetrics,
        businessImpactMetrics
      };
    case 'Sales':
    default:
      return {
        trendingRoles,
        inDemandSkills,
        competitorHiring,
        monthlyTrends,
        marketSummary,
        employees,
        skillNeedAnalysis,
        learningRecommendations,
        trainingMetrics,
        businessImpactMetrics
      };
  }
};
