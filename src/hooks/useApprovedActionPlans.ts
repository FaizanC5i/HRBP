import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

export interface ApprovedActionPlan {
  id: string;
  opportunityTitle: string;
  selectedSkills: string[];
  selectedRoles: string[];
  selectedActions: string[];
  priority: string;
  dateApproved: string;
  status: 'tracking' | 'not-tracking' | 'in-progress' | 'completed';
  estimatedBudget?: string;
  timeline?: string;
  businessJustification?: string;
  expectedOutcome?: string;
}

const STORAGE_KEY = 'hrbp-approved-action-plans';
const SESSION_KEY = 'hrbp-session-action-plans';

// Create a simple event system for cross-component updates
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

const getSessionPlans = (): ApprovedActionPlan[] => {
  const sessionData = sessionStorage.getItem(SESSION_KEY);
  if (sessionData) {
    try {
      return JSON.parse(sessionData);
    } catch (e) {
      return [];
    }
  }
  return [];
};

const saveSessionPlans = (plans: ApprovedActionPlan[]) => {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(plans));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  notifyListeners();
};

export const useApprovedActionPlans = () => {
  const [actionPlans, setActionPlans] = useState<ApprovedActionPlan[]>(getSessionPlans);

  // Subscribe to changes from other components
  useEffect(() => {
    const handleUpdate = () => {
      setActionPlans(getSessionPlans());
    };
    
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const addActionPlan = useCallback((plan: Omit<ApprovedActionPlan, 'id' | 'dateApproved' | 'status'>) => {
    const currentPlans = getSessionPlans(); // Always get latest from storage
    const newPlan: ApprovedActionPlan = {
      ...plan,
      id: `ap-${Date.now()}`,
      dateApproved: new Date().toISOString(),
      status: 'tracking', // Initially set to tracking
    };
    const updated = [...currentPlans, newPlan];
    saveSessionPlans(updated);
    return newPlan;
  }, []);

  const updateActionPlanStatus = useCallback((id: string, status: ApprovedActionPlan['status']) => {
    const currentPlans = getSessionPlans();
    const updated = currentPlans.map(plan => 
      plan.id === id ? { ...plan, status } : plan
    );
    saveSessionPlans(updated);
  }, []);

  const removeActionPlan = useCallback((id: string) => {
    const currentPlans = getSessionPlans();
    const updated = currentPlans.filter(plan => plan.id !== id);
    saveSessionPlans(updated);
  }, []);

  const clearAllPlans = useCallback(() => {
    saveSessionPlans([]);
  }, []);

  // Get all unique approved skills across all action plans
  const getApprovedSkills = useCallback(() => {
    const allSkills = actionPlans.flatMap(plan => plan.selectedSkills);
    return [...new Set(allSkills)];
  }, [actionPlans]);

  // Get all unique approved roles across all action plans
  const getApprovedRoles = useCallback(() => {
    const allRoles = actionPlans.flatMap(plan => plan.selectedRoles);
    return [...new Set(allRoles)];
  }, [actionPlans]);

  return {
    actionPlans,
    addActionPlan,
    updateActionPlanStatus,
    removeActionPlan,
    clearAllPlans,
    getApprovedSkills,
    getApprovedRoles,
  };
};

// Export singleton for use across components
export const getStoredActionPlans = (): ApprovedActionPlan[] => {
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

export const getApprovedSkillsStatic = (): string[] => {
  const plans = getStoredActionPlans();
  const allSkills = plans.flatMap(plan => plan.selectedSkills);
  return [...new Set(allSkills)];
};

export const getApprovedRolesStatic = (): string[] => {
  const plans = getStoredActionPlans();
  const allRoles = plans.flatMap(plan => plan.selectedRoles);
  return [...new Set(allRoles)];
};
