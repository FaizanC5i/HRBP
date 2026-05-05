// Internal Employee Database - Aligned with scraped market data
// Synthetic employee records for HRBP analysis

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  skills: EmployeeSkill[];
  certifications: string[];
  experienceYears: number;
  performanceScore: number;
  readinessScore: number;
  pastProjects: string[];
  learningProgress: number;
  hireDate: string;
  manager: string;
  potentialLevel: 'high' | 'medium' | 'low';
}

export interface EmployeeSkill {
  name: string;
  score: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface SkillNeedAnalysis {
  skillName: string;
  marketDemand: number;
  internalSupply: number;
  gap: number;
  criticalityLevel: 'critical' | 'high' | 'medium' | 'low';
  employeesWithSkill: number;
  avgProficiency: number;
}

export interface LearningRecommendation {
  employeeId: string;
  employeeName: string;
  currentRole: string;
  recommendationType: 'upskill' | 'reskill';
  targetSkills: string[];
  targetRole?: string;
  skillsets: string[]; // Multiple skillsets from demand sensing
  estimatedDuration: string;
  courses: string[];
  readinessScore: number;
  // New fields for Monitor dashboard
  estimatedCost: string;
  timeRequired: string;
  priority: 'high' | 'medium' | 'low';
  completedCourses: string[];
  neededCourses: string[];
}

// Employee Database - Aligned with scraped skills and roles
export const employees: Employee[] = [
  {
    id: 'EMP001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@company.com',
    role: 'Senior Cloud Sales Representative',
    department: 'Cloud Sales',
    location: 'Bengaluru, India',
    skills: [
      { name: 'Cloud Sales Expertise', score: 88, trend: 'improving' },
      { name: 'CRM Tools (Salesforce)', score: 92, trend: 'stable' },
      { name: 'Customer Engagement Strategies', score: 85, trend: 'improving' },
      { name: 'AI/ML in Sales Processes', score: 68, trend: 'improving' },
      { name: 'B2B Enterprise Sales', score: 82, trend: 'stable' }
    ],
    certifications: ['AWS Cloud Practitioner', 'Salesforce Admin', 'MEDDIC Certified'],
    experienceYears: 7,
    performanceScore: 92,
    readinessScore: 85,
    pastProjects: ['AWS Enterprise Expansion', 'Cloud Migration Sales Q4', 'Strategic Account Growth'],
    learningProgress: 78,
    hireDate: '2018-03-15',
    manager: 'Priya Sharma',
    potentialLevel: 'high'
  },
  {
    id: 'EMP002',
    name: 'Maria Santos',
    email: 'maria.santos@company.com',
    role: 'Sales Development Representative',
    department: 'Inside Sales',
    location: 'Manila, Philippines',
    skills: [
      { name: 'CRM Tools (Salesforce)', score: 85, trend: 'stable' },
      { name: 'Customer Engagement Strategies', score: 78, trend: 'improving' },
      { name: 'Sales Analytics & Data Analysis', score: 62, trend: 'improving' },
      { name: 'Remote/Hybrid Sales Methodologies', score: 88, trend: 'stable' },
      { name: 'Digital Transformation in Sales', score: 55, trend: 'improving' }
    ],
    certifications: ['HubSpot Sales', 'LinkedIn Sales Navigator'],
    experienceYears: 2,
    performanceScore: 85,
    readinessScore: 72,
    pastProjects: ['Lead Gen Campaign APAC', 'Cold Outreach Optimization'],
    learningProgress: 65,
    hireDate: '2022-06-01',
    manager: 'James Chen',
    potentialLevel: 'high'
  },
  {
    id: 'EMP003',
    name: 'Ahmad Hassan',
    email: 'ahmad.hassan@company.com',
    role: 'Enterprise Field Sales Representative',
    department: 'Enterprise Sales',
    location: 'Istanbul, Turkey',
    skills: [
      { name: 'B2B Enterprise Sales', score: 90, trend: 'stable' },
      { name: 'Cross-functional Team Leadership', score: 85, trend: 'improving' },
      { name: 'Customer Engagement Strategies', score: 88, trend: 'stable' },
      { name: 'Cloud Sales Expertise', score: 72, trend: 'improving' },
      { name: 'Digital Transformation in Sales', score: 78, trend: 'improving' }
    ],
    certifications: ['Google Cloud Sales', 'Enterprise Selling Certified'],
    experienceYears: 8,
    performanceScore: 91,
    readinessScore: 88,
    pastProjects: ['EMEA Enterprise Expansion', 'Digital Transformation Initiative', 'C-Suite Engagement Program'],
    learningProgress: 82,
    hireDate: '2017-09-10',
    manager: 'David Kim',
    potentialLevel: 'high'
  },
  {
    id: 'EMP004',
    name: 'Wei Lin',
    email: 'wei.lin@company.com',
    role: 'Sales Manager',
    department: 'Regional Sales',
    location: 'Taipei, Taiwan',
    skills: [
      { name: 'Cross-functional Team Leadership', score: 88, trend: 'stable' },
      { name: 'Sales Analytics & Data Analysis', score: 82, trend: 'improving' },
      { name: 'CRM Tools (Salesforce)', score: 78, trend: 'stable' },
      { name: 'Partner Channel Management', score: 85, trend: 'stable' },
      { name: 'AI/ML in Sales Processes', score: 58, trend: 'improving' }
    ],
    certifications: ['Salesforce Admin', 'Sales Leadership'],
    experienceYears: 6,
    performanceScore: 86,
    readinessScore: 80,
    pastProjects: ['APAC Territory Plan', 'Partner Enablement Program', 'Regional Sales Dashboard'],
    learningProgress: 70,
    hireDate: '2019-02-20',
    manager: 'Jennifer Lee',
    potentialLevel: 'high'
  },
  {
    id: 'EMP005',
    name: 'Nurul Aisyah',
    email: 'nurul.aisyah@company.com',
    role: 'Salesforce Consultant',
    department: 'CRM Solutions',
    location: 'Kuala Lumpur, Malaysia',
    skills: [
      { name: 'CRM Tools (Salesforce)', score: 95, trend: 'stable' },
      { name: 'Digital Transformation in Sales', score: 88, trend: 'improving' },
      { name: 'Sales Analytics & Data Analysis', score: 85, trend: 'stable' },
      { name: 'AI/ML in Sales Processes', score: 72, trend: 'improving' },
      { name: 'Cross-functional Team Leadership', score: 68, trend: 'improving' }
    ],
    certifications: ['Salesforce Developer', 'Apex Certified', 'Agile Scrum Master'],
    experienceYears: 5,
    performanceScore: 94,
    readinessScore: 90,
    pastProjects: ['CRM Integration Project', 'Sales Automation Implementation', 'Marketing Cloud Setup'],
    learningProgress: 88,
    hireDate: '2020-04-15',
    manager: 'Michael Torres',
    potentialLevel: 'high'
  },
  {
    id: 'EMP006',
    name: 'Carlos Rivera',
    email: 'carlos.rivera@company.com',
    role: 'Solution Sales Specialist',
    department: 'Cloud & AI Sales',
    location: 'Barcelona, Spain',
    skills: [
      { name: 'AI/ML in Sales Processes', score: 82, trend: 'improving' },
      { name: 'Cloud Sales Expertise', score: 78, trend: 'improving' },
      { name: 'Customer Engagement Strategies', score: 85, trend: 'stable' },
      { name: 'B2B Enterprise Sales', score: 75, trend: 'stable' },
      { name: 'Digital Transformation in Sales', score: 80, trend: 'improving' }
    ],
    certifications: ['Azure Solutions Architect', 'AI Sales Specialist'],
    experienceYears: 4,
    performanceScore: 88,
    readinessScore: 82,
    pastProjects: ['AI Solutions Sales Campaign', 'Cloud Migration Consulting', 'EMEA Expansion'],
    learningProgress: 75,
    hireDate: '2021-01-10',
    manager: 'Anna Schmidt',
    potentialLevel: 'high'
  },
  {
    id: 'EMP007',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Sales Operations Analyst',
    department: 'Sales Operations',
    location: 'Boston, USA',
    skills: [
      { name: 'Sales Analytics & Data Analysis', score: 92, trend: 'stable' },
      { name: 'CRM Tools (Salesforce)', score: 90, trend: 'stable' },
      { name: 'Digital Transformation in Sales', score: 75, trend: 'improving' },
      { name: 'Cross-functional Team Leadership', score: 68, trend: 'improving' },
      { name: 'AI/ML in Sales Processes', score: 62, trend: 'improving' }
    ],
    certifications: ['Salesforce Admin', 'Tableau Certified', 'Excel Expert'],
    experienceYears: 4,
    performanceScore: 90,
    readinessScore: 85,
    pastProjects: ['Sales Dashboard Implementation', 'Pipeline Analytics', 'Commission Automation'],
    learningProgress: 80,
    hireDate: '2020-08-15',
    manager: 'Kevin Wright',
    potentialLevel: 'high'
  },
  {
    id: 'EMP008',
    name: 'Arjun Patel',
    email: 'arjun.patel@company.com',
    role: 'Key Account Manager',
    department: 'Strategic Accounts',
    location: 'Gujarat, India',
    skills: [
      { name: 'B2B Enterprise Sales', score: 92, trend: 'stable' },
      { name: 'Customer Engagement Strategies', score: 90, trend: 'stable' },
      { name: 'Partner Channel Management', score: 88, trend: 'stable' },
      { name: 'Cloud Sales Expertise', score: 70, trend: 'improving' },
      { name: 'CRM Tools (Salesforce)', score: 82, trend: 'stable' }
    ],
    certifications: ['MEDDIC Master', 'Executive Selling', 'Challenger Sale'],
    experienceYears: 10,
    performanceScore: 95,
    readinessScore: 92,
    pastProjects: ['Fortune 500 Account Expansion', 'Multi-Year Deal Structure', 'Strategic Partnership Program'],
    learningProgress: 72,
    hireDate: '2015-04-20',
    manager: 'Priya Sharma',
    potentialLevel: 'high'
  },
  {
    id: 'EMP009',
    name: 'Lisa Martinez',
    email: 'lisa.martinez@company.com',
    role: 'Cloud Sales Representative',
    department: 'Cloud Sales',
    location: 'Austin, USA',
    skills: [
      { name: 'Cloud Sales Expertise', score: 78, trend: 'improving' },
      { name: 'Customer Engagement Strategies', score: 82, trend: 'stable' },
      { name: 'CRM Tools (Salesforce)', score: 75, trend: 'improving' },
      { name: 'Remote/Hybrid Sales Methodologies', score: 88, trend: 'stable' },
      { name: 'AI/ML in Sales Processes', score: 52, trend: 'improving' }
    ],
    certifications: ['AWS Solutions Architect', 'Salesforce User'],
    experienceYears: 3,
    performanceScore: 82,
    readinessScore: 75,
    pastProjects: ['SMB Cloud Adoption', 'Partner Co-Sell Program'],
    learningProgress: 68,
    hireDate: '2022-03-01',
    manager: 'Kevin Wright',
    potentialLevel: 'medium'
  },
  {
    id: 'EMP010',
    name: 'Kenji Tanaka',
    email: 'kenji.tanaka@company.com',
    role: 'Sales Development Representative',
    department: 'Inside Sales',
    location: 'Singapore',
    skills: [
      { name: 'CRM Tools (Salesforce)', score: 82, trend: 'stable' },
      { name: 'Customer Engagement Strategies', score: 72, trend: 'improving' },
      { name: 'Remote/Hybrid Sales Methodologies', score: 85, trend: 'stable' },
      { name: 'Sales Analytics & Data Analysis', score: 55, trend: 'improving' },
      { name: 'Cloud Sales Expertise', score: 48, trend: 'improving' }
    ],
    certifications: ['Outreach Certified', 'ZoomInfo Certified'],
    experienceYears: 1,
    performanceScore: 78,
    readinessScore: 65,
    pastProjects: ['APAC Lead Gen Campaign', 'LinkedIn Outreach Strategy'],
    learningProgress: 62,
    hireDate: '2023-06-15',
    manager: 'James Chen',
    potentialLevel: 'high'
  },
  {
    id: 'EMP011',
    name: 'Emily Zhang',
    email: 'emily.zhang@company.com',
    role: 'Digital Sales Specialist',
    department: 'Digital Sales',
    location: 'Seattle, USA',
    skills: [
      { name: 'Digital Transformation in Sales', score: 90, trend: 'stable' },
      { name: 'AI/ML in Sales Processes', score: 85, trend: 'improving' },
      { name: 'CRM Tools (Salesforce)', score: 88, trend: 'stable' },
      { name: 'Sales Analytics & Data Analysis', score: 82, trend: 'improving' },
      { name: 'Customer Engagement Strategies', score: 78, trend: 'stable' }
    ],
    certifications: ['Adobe Experience Cloud', 'Google Analytics', 'Digital Marketing Certified'],
    experienceYears: 5,
    performanceScore: 89,
    readinessScore: 86,
    pastProjects: ['Digital Sales Transformation', 'E-commerce Integration', 'Marketing Automation'],
    learningProgress: 85,
    hireDate: '2019-11-05',
    manager: 'Jennifer Lee',
    potentialLevel: 'high'
  },
  {
    id: 'EMP012',
    name: 'Miguel Santos',
    email: 'miguel.santos@company.com',
    role: 'Partner Channel Manager',
    department: 'Partner Sales',
    location: 'Mexico City, Mexico',
    skills: [
      { name: 'Partner Channel Management', score: 92, trend: 'stable' },
      { name: 'B2B Enterprise Sales', score: 78, trend: 'stable' },
      { name: 'Cross-functional Team Leadership', score: 85, trend: 'improving' },
      { name: 'Customer Engagement Strategies', score: 80, trend: 'stable' },
      { name: 'CRM Tools (Salesforce)', score: 72, trend: 'improving' }
    ],
    certifications: ['Partner Management', 'Channel Sales Certified'],
    experienceYears: 6,
    performanceScore: 84,
    readinessScore: 78,
    pastProjects: ['LATAM Partner Enablement', 'Channel Revenue Growth', 'Co-Sell Program'],
    learningProgress: 70,
    hireDate: '2019-03-01',
    manager: 'Anna Schmidt',
    potentialLevel: 'medium'
  }
];

// Skill Need Analysis - Aligned with scraped market skills
export const skillNeedAnalysis: SkillNeedAnalysis[] = [
  {
    skillName: 'AI/ML in Sales Processes',
    marketDemand: 92,
    internalSupply: 65,
    gap: 27,
    criticalityLevel: 'critical',
    employeesWithSkill: 12,
    avgProficiency: 65
  },
  {
    skillName: 'Cloud Sales Expertise',
    marketDemand: 94,
    internalSupply: 72,
    gap: 22,
    criticalityLevel: 'critical',
    employeesWithSkill: 12,
    avgProficiency: 72
  },
  {
    skillName: 'Digital Transformation in Sales',
    marketDemand: 89,
    internalSupply: 74,
    gap: 15,
    criticalityLevel: 'high',
    employeesWithSkill: 12,
    avgProficiency: 74
  },
  {
    skillName: 'CRM Tools (Salesforce)',
    marketDemand: 91,
    internalSupply: 84,
    gap: 7,
    criticalityLevel: 'low',
    employeesWithSkill: 12,
    avgProficiency: 84
  },
  {
    skillName: 'Sales Analytics & Data Analysis',
    marketDemand: 86,
    internalSupply: 73,
    gap: 13,
    criticalityLevel: 'high',
    employeesWithSkill: 12,
    avgProficiency: 73
  },
  {
    skillName: 'Cross-functional Team Leadership',
    marketDemand: 84,
    internalSupply: 76,
    gap: 8,
    criticalityLevel: 'medium',
    employeesWithSkill: 12,
    avgProficiency: 76
  }
];

// Learning Recommendations - Aligned with Demand Sensing roles
export const learningRecommendations: LearningRecommendation[] = [
  {
    employeeId: 'EMP002',
    employeeName: 'Maria Santos',
    currentRole: 'Sales Representative',
    recommendationType: 'upskill',
    targetSkills: ['AI/ML in Sales Processes', 'Cloud Sales Expertise'],
    targetRole: 'Microsoft Sales Specialist',
    skillsets: ['Microsoft Sales Specialist', 'Microsoft Sales Development Specialist'],
    estimatedDuration: '6 months',
    courses: ['AI for Sales Professionals', 'Cloud Solutions Fundamentals', 'Enterprise Sales Methodology'],
    readinessScore: 72,
    estimatedCost: '4,500',
    timeRequired: '120 hours',
    priority: 'high',
    completedCourses: ['Salesforce Basics', 'Sales Communication'],
    neededCourses: ['AI for Sales Professionals', 'Cloud Solutions Fundamentals', 'Enterprise Sales Methodology']
  },
  {
    employeeId: 'EMP004',
    employeeName: 'Wei Lin',
    currentRole: 'Sales Manager',
    recommendationType: 'upskill',
    targetSkills: ['AI/ML in Sales Processes', 'Digital Transformation in Sales'],
    skillsets: ['Microsoft Sales Excellence Specialist', 'Microsoft Sales Manager'],
    estimatedDuration: '4 months',
    courses: ['AI-Powered Sales Analytics', 'Digital Transformation Leadership', 'Advanced CRM Integration'],
    readinessScore: 80,
    estimatedCost: '3,200',
    timeRequired: '80 hours',
    priority: 'high',
    completedCourses: ['Sales Leadership 101', 'CRM Advanced'],
    neededCourses: ['AI-Powered Sales Analytics', 'Digital Transformation Leadership']
  },
  {
    employeeId: 'EMP009',
    employeeName: 'Lisa Martinez',
    currentRole: 'Sales Representative',
    recommendationType: 'upskill',
    targetSkills: ['AI/ML in Sales Processes', 'Digital Transformation in Sales'],
    targetRole: 'Microsoft Sales Development Specialist',
    skillsets: ['Microsoft Sales Development Specialist', 'Microsoft Sales Specialist'],
    estimatedDuration: '5 months',
    courses: ['AI Sales Certification', 'Digital Sales Mastery', 'Cloud Migration Consulting'],
    readinessScore: 75,
    estimatedCost: '3,800',
    timeRequired: '100 hours',
    priority: 'medium',
    completedCourses: ['Customer Engagement Essentials'],
    neededCourses: ['AI Sales Certification', 'Digital Sales Mastery', 'Cloud Migration Consulting']
  },
  {
    employeeId: 'EMP010',
    employeeName: 'Kenji Tanaka',
    currentRole: 'Microsoft Sales Development Specialist',
    recommendationType: 'upskill',
    targetSkills: ['Cloud Sales Expertise', 'Sales Analytics & Data Analysis'],
    targetRole: 'Microsoft Sales Specialist',
    skillsets: ['Microsoft Sales Specialist', 'Cloud Solutions Sales'],
    estimatedDuration: '8 months',
    courses: ['AWS/Azure Sales Training', 'Data-Driven Selling', 'Pipeline Analytics Fundamentals'],
    readinessScore: 65,
    estimatedCost: '5,200',
    timeRequired: '160 hours',
    priority: 'high',
    completedCourses: ['Sales Prospecting 101'],
    neededCourses: ['AWS/Azure Sales Training', 'Data-Driven Selling', 'Pipeline Analytics Fundamentals']
  },
  {
    employeeId: 'EMP012',
    employeeName: 'Miguel Santos',
    currentRole: 'Microsoft Sales Support',
    recommendationType: 'reskill',
    targetSkills: ['Cloud Sales Expertise', 'AI/ML in Sales Processes'],
    targetRole: 'Microsoft Technical Sales',
    skillsets: ['Microsoft Technical Sales', 'Cloud Partner Sales'],
    estimatedDuration: '6 months',
    courses: ['Cloud Partner Enablement', 'AI Solutions for Partners', 'Strategic Alliance Management'],
    readinessScore: 78,
    estimatedCost: '4,800',
    timeRequired: '140 hours',
    priority: 'high',
    completedCourses: ['Partner Sales Fundamentals', 'Technical Documentation'],
    neededCourses: ['Cloud Partner Enablement', 'AI Solutions for Partners', 'Strategic Alliance Management']
  },
  {
    employeeId: 'EMP007',
    employeeName: 'Sarah Johnson',
    currentRole: 'Sales Operations',
    recommendationType: 'upskill',
    targetSkills: ['AI/ML in Sales Processes', 'Cross-functional Team Leadership'],
    targetRole: 'Microsoft Sales Excellence Specialist',
    skillsets: ['Microsoft Sales Excellence Specialist', 'Sales Operations Manager'],
    estimatedDuration: '5 months',
    courses: ['AI/ML for RevOps', 'Leadership for Operations', 'Advanced Forecasting with AI'],
    readinessScore: 85,
    estimatedCost: '3,500',
    timeRequired: '90 hours',
    priority: 'low',
    completedCourses: ['Sales Analytics Basics', 'Excel for Sales', 'Process Optimization'],
    neededCourses: ['AI/ML for RevOps', 'Leadership for Operations']
  },
  {
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    currentRole: 'Senior Cloud Sales Representative',
    recommendationType: 'upskill',
    targetSkills: ['AI/ML in Sales Processes', 'Digital Transformation in Sales'],
    targetRole: 'AI Solutions Sales Lead',
    skillsets: ['AI Solutions Sales Lead', 'Cloud & AI Platform Sales'],
    estimatedDuration: '3 months',
    courses: ['AI Sales Leadership', 'Enterprise AI Solutions', 'Advanced Cloud Architecture'],
    readinessScore: 85,
    estimatedCost: '2,800',
    timeRequired: '60 hours',
    priority: 'medium',
    completedCourses: ['Cloud Sales Mastery', 'Enterprise Selling', 'Salesforce CRM Advanced'],
    neededCourses: ['AI Sales Leadership', 'Enterprise AI Solutions']
  },
  {
    employeeId: 'EMP003',
    employeeName: 'Ahmad Hassan',
    currentRole: 'Enterprise Field Sales Representative',
    recommendationType: 'upskill',
    targetSkills: ['Cloud Sales Expertise', 'AI/ML in Sales Processes'],
    targetRole: 'Enterprise Solutions Architect',
    skillsets: ['Enterprise Solutions Architect', 'Strategic Account Executive'],
    estimatedDuration: '4 months',
    courses: ['Cloud Architecture for Sales', 'AI-Powered Enterprise Sales', 'Strategic Account Planning'],
    readinessScore: 88,
    estimatedCost: '3,600',
    timeRequired: '85 hours',
    priority: 'high',
    completedCourses: ['B2B Sales Excellence', 'Customer Engagement Pro'],
    neededCourses: ['Cloud Architecture for Sales', 'AI-Powered Enterprise Sales', 'Strategic Account Planning']
  },
  {
    employeeId: 'EMP005',
    employeeName: 'Nurul Aisyah',
    currentRole: 'Salesforce Consultant',
    recommendationType: 'reskill',
    targetSkills: ['AI/ML in Sales Processes', 'Cross-functional Team Leadership'],
    targetRole: 'AI CRM Solutions Lead',
    skillsets: ['AI CRM Solutions Lead', 'Sales Technology Architect'],
    estimatedDuration: '5 months',
    courses: ['AI Integration for CRM', 'Team Leadership Essentials', 'Sales Technology Architecture'],
    readinessScore: 90,
    estimatedCost: '4,200',
    timeRequired: '110 hours',
    priority: 'high',
    completedCourses: ['Salesforce Developer Certification', 'Apex Programming', 'CRM Administration'],
    neededCourses: ['AI Integration for CRM', 'Team Leadership Essentials']
  },
  {
    employeeId: 'EMP006',
    employeeName: 'Carlos Rivera',
    currentRole: 'Solution Sales Specialist',
    recommendationType: 'upskill',
    targetSkills: ['B2B Enterprise Sales', 'Partner Channel Management'],
    targetRole: 'Enterprise Partner Solutions Manager',
    skillsets: ['Enterprise Partner Solutions Manager', 'Channel Sales Manager'],
    estimatedDuration: '4 months',
    courses: ['Enterprise Selling Mastery', 'Partner Ecosystem Development', 'Strategic Partnerships'],
    readinessScore: 82,
    estimatedCost: '3,400',
    timeRequired: '95 hours',
    priority: 'medium',
    completedCourses: ['Azure Solutions Basics', 'AI Sales Fundamentals'],
    neededCourses: ['Enterprise Selling Mastery', 'Partner Ecosystem Development', 'Strategic Partnerships']
  },
  {
    employeeId: 'EMP008',
    employeeName: 'Arjun Patel',
    currentRole: 'Key Account Manager',
    recommendationType: 'reskill',
    targetSkills: ['Cloud Sales Expertise', 'Digital Transformation in Sales'],
    targetRole: 'Strategic Cloud Accounts Director',
    skillsets: ['Strategic Cloud Accounts Director', 'Customer Success Account Manager'],
    estimatedDuration: '3 months',
    courses: ['Cloud Strategy for Executives', 'Digital Transformation Consulting', 'C-Suite Engagement'],
    readinessScore: 92,
    estimatedCost: '2,500',
    timeRequired: '50 hours',
    priority: 'low',
    completedCourses: ['Executive Selling', 'Strategic Account Management', 'Partnership Development', 'Negotiation Mastery'],
    neededCourses: ['Cloud Strategy for Executives']
  },
  {
    employeeId: 'EMP011',
    employeeName: 'Emily Zhang',
    currentRole: 'Digital Sales Specialist',
    recommendationType: 'reskill',
    targetSkills: ['Cross-functional Team Leadership', 'Partner Channel Management'],
    targetRole: 'Digital Partner Solutions Manager',
    skillsets: ['Digital Partner Solutions Manager', 'Services Sales Manager'],
    estimatedDuration: '6 months',
    courses: ['Leadership Fundamentals', 'Partner Enablement Strategy', 'Digital Ecosystem Management'],
    readinessScore: 86,
    estimatedCost: '4,600',
    timeRequired: '130 hours',
    priority: 'high',
    completedCourses: ['Digital Marketing for Sales', 'AI Tools Basics'],
    neededCourses: ['Leadership Fundamentals', 'Partner Enablement Strategy', 'Digital Ecosystem Management']
  },
  {
    employeeId: 'EMP013',
    employeeName: 'Fatima Al-Rashid',
    currentRole: 'Inside Sales Representative',
    recommendationType: 'upskill',
    targetSkills: ['Cloud Sales Expertise', 'Customer Engagement Strategies'],
    targetRole: 'Cloud Solutions Consultant',
    skillsets: ['Cloud Solutions Consultant', 'Microsoft Sales Specialist'],
    estimatedDuration: '7 months',
    courses: ['Cloud Fundamentals', 'Customer Success Management', 'Solution Selling'],
    readinessScore: 68,
    estimatedCost: '5,100',
    timeRequired: '150 hours',
    priority: 'medium',
    completedCourses: ['Inside Sales Techniques'],
    neededCourses: ['Cloud Fundamentals', 'Customer Success Management', 'Solution Selling']
  },
  {
    employeeId: 'EMP014',
    employeeName: 'Thomas Weber',
    currentRole: 'Sales Development Representative',
    recommendationType: 'reskill',
    targetSkills: ['AI/ML in Sales Processes', 'Sales Analytics & Data Analysis'],
    targetRole: 'AI Sales Operations Analyst',
    skillsets: ['AI Sales Operations Analyst', 'Sales Analytics Specialist'],
    estimatedDuration: '5 months',
    courses: ['AI for RevOps', 'Sales Analytics Mastery', 'Pipeline Intelligence'],
    readinessScore: 74,
    estimatedCost: '3,900',
    timeRequired: '105 hours',
    priority: 'high',
    completedCourses: ['SDR Bootcamp', 'Outreach Strategies'],
    neededCourses: ['AI for RevOps', 'Sales Analytics Mastery', 'Pipeline Intelligence']
  },
  {
    employeeId: 'EMP015',
    employeeName: 'Priya Venkatesh',
    currentRole: 'Regional Sales Manager',
    recommendationType: 'upskill',
    targetSkills: ['Digital Transformation in Sales', 'AI/ML in Sales Processes'],
    targetRole: 'Digital Sales Transformation Lead',
    skillsets: ['Digital Sales Transformation Lead', 'Senior Sales Director'],
    estimatedDuration: '4 months',
    courses: ['Digital Leadership', 'AI-Powered Sales Management', 'Change Management'],
    readinessScore: 82,
    estimatedCost: '3,200',
    timeRequired: '80 hours',
    priority: 'high',
    completedCourses: ['Sales Management Excellence', 'Team Building'],
    neededCourses: ['Digital Leadership', 'AI-Powered Sales Management', 'Change Management']
  },
  {
    employeeId: 'EMP016',
    employeeName: 'John O\'Connor',
    currentRole: 'Technical Sales Engineer',
    recommendationType: 'reskill',
    targetSkills: ['Cloud Sales Expertise', 'B2B Enterprise Sales'],
    targetRole: 'Cloud Solutions Architect',
    skillsets: ['Cloud Solutions Architect', 'Cloud & AI Platform Sales Manager'],
    estimatedDuration: '6 months',
    courses: ['Azure Solutions Architecture', 'Enterprise Cloud Sales', 'Technical Pre-Sales'],
    readinessScore: 79,
    estimatedCost: '4,400',
    timeRequired: '120 hours',
    priority: 'high',
    completedCourses: ['Technical Sales Fundamentals', 'Product Demo Skills'],
    neededCourses: ['Azure Solutions Architecture', 'Enterprise Cloud Sales', 'Technical Pre-Sales']
  },
  {
    employeeId: 'EMP017',
    employeeName: 'Mei Lin Wong',
    currentRole: 'Sales Coordinator',
    recommendationType: 'reskill',
    targetSkills: ['Sales Analytics & Data Analysis', 'CRM Tools (Salesforce)'],
    targetRole: 'Sales Operations Analyst',
    skillsets: ['Sales Operations Analyst', 'Business Program Manager'],
    estimatedDuration: '5 months',
    courses: ['Salesforce Administration', 'Data Analytics for Sales', 'Process Optimization'],
    readinessScore: 71,
    estimatedCost: '3,700',
    timeRequired: '100 hours',
    priority: 'medium',
    completedCourses: ['Sales Coordination Basics', 'Excel for Business'],
    neededCourses: ['Salesforce Administration', 'Data Analytics for Sales', 'Process Optimization']
  },
  {
    employeeId: 'EMP018',
    employeeName: 'David Okonkwo',
    currentRole: 'Channel Sales Representative',
    recommendationType: 'upskill',
    targetSkills: ['Partner Channel Management', 'Cloud Sales Expertise'],
    targetRole: 'Partner Solutions Manager',
    skillsets: ['Partner Solutions Manager', 'Consulting Account Executive'],
    estimatedDuration: '4 months',
    courses: ['Partner Ecosystem Management', 'Cloud Partner Enablement', 'Alliance Building'],
    readinessScore: 76,
    estimatedCost: '3,100',
    timeRequired: '85 hours',
    priority: 'low',
    completedCourses: ['Channel Sales Basics', 'Partner Communication', 'Relationship Building'],
    neededCourses: ['Partner Ecosystem Management', 'Cloud Partner Enablement']
  },
  {
    employeeId: 'EMP019',
    employeeName: 'Isabella Rossi',
    currentRole: 'Account Executive',
    recommendationType: 'upskill',
    targetSkills: ['AI/ML in Sales Processes', 'Customer Engagement Strategies'],
    targetRole: 'AI-Enabled Account Manager',
    skillsets: ['AI-Enabled Account Manager', 'Senior Account Executive'],
    estimatedDuration: '5 months',
    courses: ['AI Sales Tools Mastery', 'Strategic Customer Engagement', 'Predictive Sales Analytics'],
    readinessScore: 80,
    estimatedCost: '3,600',
    timeRequired: '95 hours',
    priority: 'high',
    completedCourses: ['Account Management Pro', 'Negotiation Skills'],
    neededCourses: ['AI Sales Tools Mastery', 'Strategic Customer Engagement', 'Predictive Sales Analytics']
  },
  {
    employeeId: 'EMP020',
    employeeName: 'Hiroshi Yamamoto',
    currentRole: 'Sales Training Coordinator',
    recommendationType: 'reskill',
    targetSkills: ['Digital Transformation in Sales', 'AI/ML in Sales Processes'],
    targetRole: 'Sales Enablement Technology Manager',
    skillsets: ['Sales Enablement Technology Manager', 'Sales Operations Strategy Lead'],
    estimatedDuration: '6 months',
    courses: ['Sales Enablement Platforms', 'AI for Learning & Development', 'Digital Training Design'],
    readinessScore: 73,
    estimatedCost: '4,900',
    timeRequired: '135 hours',
    priority: 'high',
    completedCourses: ['Training Design Basics', 'Presentation Skills'],
    neededCourses: ['Sales Enablement Platforms', 'AI for Learning & Development', 'Digital Training Design']
  }
];

// Training Metrics
export interface TrainingMetrics {
  totalEnrolled: number;
  completionRate: number;
  avgSkillUplift: number;
  coursesSatisfaction: number;
  topPerformingCourses: { name: string; completion: number; uplift: number }[];
}

export const trainingMetrics: TrainingMetrics = {
  totalEnrolled: 168,
  completionRate: 82,
  avgSkillUplift: 21.5,
  coursesSatisfaction: 4.4,
  topPerformingCourses: [
    { name: 'AI for Sales Professionals', completion: 94, uplift: 32 },
    { name: 'Cloud Solutions Fundamentals', completion: 91, uplift: 28 },
    { name: 'Salesforce Advanced', completion: 88, uplift: 24 },
    { name: 'Digital Transformation in Sales', completion: 85, uplift: 26 },
    { name: 'Enterprise Sales Methodology', completion: 82, uplift: 22 }
  ]
};

// Business Impact Metrics
export interface BusinessImpact {
  metric: string;
  before: number;
  after: number;
  improvement: number;
  unit: string;
}

export const businessImpactMetrics: BusinessImpact[] = [
  { metric: 'Quota Attainment', before: 72, after: 88, improvement: 22, unit: '%' },
  { metric: 'Win Rate', before: 24, after: 34, improvement: 42, unit: '%' },
  { metric: 'Average Deal Size', before: 45000, after: 62000, improvement: 38, unit: '$' },
  { metric: 'Sales Cycle Length', before: 68, after: 48, improvement: 29, unit: 'days' },
  { metric: 'Pipeline Coverage', before: 2.8, after: 3.8, improvement: 36, unit: 'x' },
  { metric: 'Customer Retention', before: 82, after: 92, improvement: 12, unit: '%' }
];
