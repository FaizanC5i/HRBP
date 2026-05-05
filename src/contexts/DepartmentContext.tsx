import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Department = 'Sales' | 'Engineering' | 'Marketing' | 'Finance' | 'HR' | 'Operations';

interface DepartmentContextType {
  selectedDepartment: Department;
  setSelectedDepartment: (department: Department) => void;
  departments: Department[];
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export const departments: Department[] = ['Sales', 'Engineering', 'Marketing', 'Finance', 'HR', 'Operations'];

export const DepartmentProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('Sales');

  return (
    <DepartmentContext.Provider value={{ selectedDepartment, setSelectedDepartment, departments }}>
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartment = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartment must be used within a DepartmentProvider');
  }
  return context;
};
