import { useState, useEffect, useCallback } from 'react';

export interface ApprovedTrainingEmployee {
  id: string;
  employeeId: string;
  employeeName: string;
  currentRole: string;
  skillsToTrain: string[];
  certificationName: string;
  certificationCode: string;
  dateApproved: string;
  approvedBy: string;
  status: 'hrbp-approved' | 'business-owner-pending' | 'in-progress' | 'completed';
  priority?: 'high' | 'medium' | 'low';
  roleId?: string;
  roleName?: string;
}

const STORAGE_KEY = 'hrbp-approved-training';

// Microsoft certifications mapping based on skills
export const getMicrosoftCertification = (skills: string[]): { name: string; code: string } => {
  const skillLower = skills.map(s => s.toLowerCase()).join(' ');
  
  if (skillLower.includes('azure') || skillLower.includes('cloud')) {
    return { name: 'Microsoft Azure Fundamentals', code: 'AZ-900' };
  }
  if (skillLower.includes('ai') || skillLower.includes('ml') || skillLower.includes('machine learning')) {
    return { name: 'Azure AI Fundamentals', code: 'AI-900' };
  }
  if (skillLower.includes('data') || skillLower.includes('analytics')) {
    return { name: 'Power BI Data Analyst', code: 'PL-300' };
  }
  if (skillLower.includes('security')) {
    return { name: 'Microsoft 365 Administrator', code: 'MS-102' };
  }
  if (skillLower.includes('dynamics') || skillLower.includes('crm')) {
    return { name: 'Microsoft Dynamics 365 Fundamentals', code: 'MB-910' };
  }
  if (skillLower.includes('devops') || skillLower.includes('ci/cd')) {
    return { name: 'Azure DevOps Engineer Expert', code: 'AZ-400' };
  }
  if (skillLower.includes('developer') || skillLower.includes('development')) {
    return { name: 'Azure Developer Associate', code: 'AZ-204' };
  }
  
  // Default to Azure Fundamentals
  return { name: 'Microsoft Azure Fundamentals', code: 'AZ-900' };
};

export const useApprovedTraining = () => {
  const [approvedTraining, setApprovedTraining] = useState<ApprovedTrainingEmployee[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setApprovedTraining(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored training approvals', e);
      }
    }
  }, []);

  const saveApprovedTraining = useCallback((newApprovals: ApprovedTrainingEmployee[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newApprovals));
    setApprovedTraining(newApprovals);
  }, []);

  const addApprovedTraining = useCallback((employees: {
    employeeId: string;
    employeeName: string;
    currentRole: string;
    skillsToTrain: string[];
    priority?: 'high' | 'medium' | 'low';
    roleId?: string;
    roleName?: string;
  }[]) => {
    const newApprovals = employees.map(emp => {
      const certification = getMicrosoftCertification(emp.skillsToTrain);
      return {
        id: `training-${Date.now()}-${emp.employeeId}`,
        employeeId: emp.employeeId,
        employeeName: emp.employeeName,
        currentRole: emp.currentRole,
        skillsToTrain: emp.skillsToTrain,
        certificationName: certification.name,
        certificationCode: certification.code,
        dateApproved: new Date().toISOString(),
        approvedBy: 'HRBP Admin',
        status: 'hrbp-approved' as const,
        priority: emp.priority,
        roleId: emp.roleId,
        roleName: emp.roleName,
      };
    });
    
    const updated = [...approvedTraining, ...newApprovals];
    saveApprovedTraining(updated);
    return newApprovals;
  }, [approvedTraining, saveApprovedTraining]);

  const updateTrainingStatus = useCallback((id: string, status: ApprovedTrainingEmployee['status']) => {
    const updated = approvedTraining.map(t => 
      t.id === id ? { ...t, status } : t
    );
    saveApprovedTraining(updated);
  }, [approvedTraining, saveApprovedTraining]);

  const removeApprovedTraining = useCallback((id: string) => {
    const updated = approvedTraining.filter(t => t.id !== id);
    saveApprovedTraining(updated);
  }, [approvedTraining, saveApprovedTraining]);

  const clearAllApprovedTraining = useCallback(() => {
    saveApprovedTraining([]);
  }, [saveApprovedTraining]);

  const isEmployeeApproved = useCallback((employeeId: string) => {
    return approvedTraining.some(t => t.employeeId === employeeId);
  }, [approvedTraining]);

  return {
    approvedTraining,
    addApprovedTraining,
    updateTrainingStatus,
    removeApprovedTraining,
    clearAllApprovedTraining,
    isEmployeeApproved,
  };
};
