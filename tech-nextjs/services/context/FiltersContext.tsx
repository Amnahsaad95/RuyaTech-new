
import React from 'react';
import { UserRole } from '@/types/user';

export interface FilterState {
  searchTerm: string;
  role: UserRole | 'all';
  location: string;
  skills: string[];
  mainField: string;
  isJobSeeking: boolean | null;
  isExpert: boolean | null;
  experienceMin: number | null;
  experienceMax: number | null;
  
  // Company specific filters
  companySize: string | null;
  industry: string[];
  hasOpenPositions: boolean | null;
  
  // Education filters
  educationLevel: string | null;
  institution: string | null;
}

export const initialFilterState: FilterState = {
  searchTerm: '',
  role: 'all',
  location: '',
  skills: [],
  mainField: '',
  isJobSeeking: null,
  isExpert: null,
  experienceMin: null,
  experienceMax: null,
  companySize: null,
  industry: [],
  hasOpenPositions: null,
  educationLevel: '',
  institution: null
};

export interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  currentUserRole: UserRole | null;
  setCurrentUserRole: (role: UserRole | null) => void;
}

export const FilterContext = React.createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [filters, setFilters] = React.useState<FilterState>(initialFilterState);
  const [currentUserRole, setCurrentUserRole] = React.useState<UserRole | null>(null);
  
  const resetFilters = () => {
    setFilters(initialFilterState);
  };
  
  return (
    <FilterContext.Provider value={{ 
      filters, 
      setFilters, 
      resetFilters,
      currentUserRole,
      setCurrentUserRole
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = React.useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
