import { useState, useEffect, useCallback } from 'react';

export interface SkillPriorityData {
  skillName: string;
  priorities: ('high' | 'medium' | 'low')[];
  selectedCourses: string[];
  roleId: string;
  roleName: string;
}

export interface ApprovedOpportunity {
  id: string;
  roleId: string;
  roleName: string;
  skillsRequired: string[];
  trendReason: string;
  sourceDataSummary: string;
  dateApproved: string;
  approvedBy: string;
  status: 'pending' | 'approved' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  comments?: string;
  selectedSkills?: string[];
  selectedPrograms?: string[];
  skillPriorities?: SkillPriorityData[];
}

const STORAGE_KEY = 'hrbp-approved-opportunities';

export const useApprovedOpportunities = () => {
  const [opportunities, setOpportunities] = useState<ApprovedOpportunity[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setOpportunities(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored opportunities', e);
      }
    }
  }, []);

  const saveOpportunities = useCallback((newOpportunities: ApprovedOpportunity[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOpportunities));
    setOpportunities(newOpportunities);
  }, []);

  const addOpportunity = useCallback((opportunity: Omit<ApprovedOpportunity, 'id' | 'dateApproved' | 'status'>) => {
    const newOpportunity: ApprovedOpportunity = {
      ...opportunity,
      id: `opp-${Date.now()}`,
      dateApproved: new Date().toISOString(),
      status: 'approved',
    };
    const updated = [...opportunities, newOpportunity];
    saveOpportunities(updated);
    return newOpportunity;
  }, [opportunities, saveOpportunities]);

  const updateOpportunity = useCallback((id: string, updates: Partial<ApprovedOpportunity>) => {
    const updated = opportunities.map(opp => 
      opp.id === id ? { ...opp, ...updates } : opp
    );
    saveOpportunities(updated);
  }, [opportunities, saveOpportunities]);

  const removeOpportunity = useCallback((id: string) => {
    const updated = opportunities.filter(opp => opp.id !== id);
    saveOpportunities(updated);
  }, [opportunities, saveOpportunities]);

  const getOpportunityByRoleId = useCallback((roleId: string) => {
    return opportunities.find(opp => opp.roleId === roleId);
  }, [opportunities]);

  const isRoleApproved = useCallback((roleId: string) => {
    return opportunities.some(opp => opp.roleId === roleId);
  }, [opportunities]);

  return {
    opportunities,
    addOpportunity,
    updateOpportunity,
    removeOpportunity,
    getOpportunityByRoleId,
    isRoleApproved,
  };
};

// Export singleton for use across components
export const getStoredOpportunities = (): ApprovedOpportunity[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }
  return [];
};
