'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  UserRole,
  Bio,
  ProfessionalInfo,
  Education,
  Certificate,
  WorkExperience,
  Portfolio,
  AcademicInfo,
  Course,
  CareerGoals,
  CompanyInfo,
  HiringNeeds,
  OpenPosition
} from '@/types/user';

// Types for filters
interface ProfessionalFilters {
  isExpert?: boolean;
  isJobSeeking?: boolean;
  minExperience?: number;
  industries?: string[];
  skills?: string[];
}

interface StudentFilters {
  educationLevel?: string[];
  fieldsOfStudy?: string[];
  graduationYearFrom?: number;
  graduationYearTo?: number;
}

interface CompanyFilters {
  companySizes?: string[];
  isHiring?: boolean;
  industries?: string[];
}

interface CommonFilters {
  countries?: string[];
  cities?: string[];
  skills?: string[];
}

interface FilterState {
  searchTerm: string;
  selectedRole: UserRole | 'all';
  professional: ProfessionalFilters;
  student: StudentFilters;
  company: CompanyFilters;
  common: CommonFilters;
}

interface DirectoryContextType {
  // Data
  users: User[];
  filteredUsers: User[];
  
  // Filter state
  filters: FilterState;
  
  // UI state
  currentPage: number;
  usersPerPage: number;
  totalPages: number;
  isFilterSidebarOpen: boolean;
  expandedFilterGroups: Set<string>;
  
  // Actions
  setSearchTerm: (term: string) => void;
  setSelectedRole: (role: UserRole | 'all') => void;
  updateProfessionalFilter: (key: keyof ProfessionalFilters, value: any) => void;
  updateStudentFilter: (key: keyof StudentFilters, value: any) => void;
  updateCompanyFilter: (key: keyof CompanyFilters, value: any) => void;
  updateCommonFilter: (key: keyof CommonFilters, value: any) => void;
  clearFilters: () => void;
  clearRoleFilters: (role: UserRole) => void;
  
  // UI actions
  setCurrentPage: (page: number) => void;
  toggleFilterSidebar: () => void;
  toggleFilterGroup: (groupId: string) => void;
  
  // Utility functions
  getActiveFiltersCount: () => number;
  getFilteredUsersCount: () => number;
}

// Initial filter state
const initialFilterState: FilterState = {
  searchTerm: '',
  selectedRole: 'all',
  professional: {},
  student: {},
  company: {},
  common: {}
};

// Create context
const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined);

// Provider component
export const DirectoryProvider: React.FC<{ children: React.ReactNode; users: User[] }> = ({
  children,
  users
}) => {
  // State
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [expandedFilterGroups, setExpandedFilterGroups] = useState<Set<string>>(
    new Set(['professionalExpertise', 'commonSkills'])
  );

  const usersPerPage = 12;

  // Filter users based on current filters
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(user => {
        const searchFields = [
          user.name,
          user.bio?.summary,
          user.city,
          user.country,
          user.mainfield,
          ...(user.bio?.professional_info?.skills?.map(skill => skill.name) || []),
          ...(user.bio?.skills_learning || []),
          ...(user.bio?.services || [])
        ].filter(Boolean).map(f => f?.toLowerCase());

        return searchFields.some(field => field?.includes(searchLower));
      });
    }

    // Role filter
    if (filters.selectedRole !== 'all') {
      result = result.filter(user => user.role === filters.selectedRole);
    }

    // Professional filters
    if (filters.selectedRole === 'professional' || filters.selectedRole === 'all') {
      const profFilters = filters.professional;
      
      if (profFilters.isExpert !== undefined) {
        result = result.filter(user => 
          user.role === 'professional' && 
          user.isexpert === profFilters.isExpert
        );
      }
      
      if (profFilters.isJobSeeking !== undefined) {
        result = result.filter(user => 
          user.role === 'professional' && 
          user.isjobseek === profFilters.isJobSeeking
        );
      }
      
      if (profFilters.minExperience !== undefined && user.bio?.professional_info) {
        result = result.filter(user => 
          user.role === 'professional' && 
          (user.bio?.professional_info?.years_experience || 0) >= profFilters.minExperience!
        );
      }
      
      if (profFilters.industries && profFilters.industries.length > 0) {
        result = result.filter(user => 
          user.role === 'professional' && 
          user.mainfield &&
          profFilters.industries.some(industry => 
            user.mainfield.toLowerCase().includes(industry.toLowerCase())
          )
        );
      }
      
      if (profFilters.skills && profFilters.skills.length > 0 && user.bio?.professional_info) {
        result = result.filter(user => 
          user.role === 'professional' && 
          profFilters.skills.some(skill => 
            user.bio?.professional_info?.skills.some(userSkill => 
              userSkill.name.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }
    }

    // Student filters
    if (filters.selectedRole === 'student' || filters.selectedRole === 'all') {
      const studentFilters = filters.student;
      
      if (studentFilters.educationLevel && studentFilters.educationLevel.length > 0) {
        result = result.filter(user => 
          user.role === 'student' && 
          user.bio?.academic_info?.degree_level &&
          studentFilters.educationLevel.includes(user.bio.academic_info.degree_level)
        );
      }
      
      if (studentFilters.fieldsOfStudy && studentFilters.fieldsOfStudy.length > 0) {
        result = result.filter(user => 
          user.role === 'student' && 
          user.bio?.academic_info?.program &&
          studentFilters.fieldsOfStudy.some(field => 
            user.bio.academic_info.program.toLowerCase().includes(field.toLowerCase())
          )
        );
      }
      
      if (studentFilters.graduationYearFrom !== undefined) {
        result = result.filter(user => 
          user.role === 'student' && 
          user.bio?.academic_info?.year &&
          parseInt(user.bio.academic_info.year) >= studentFilters.graduationYearFrom!
        );
      }
      
      if (studentFilters.graduationYearTo !== undefined) {
        result = result.filter(user => 
          user.role === 'student' && 
          user.bio?.academic_info?.year &&
          parseInt(user.bio.academic_info.year) <= studentFilters.graduationYearTo!
        );
      }
    }

    // Company filters
    if (filters.selectedRole === 'company' || filters.selectedRole === 'all') {
      const companyFilters = filters.company;
      
      if (companyFilters.companySizes && companyFilters.companySizes.length > 0) {
        result = result.filter(user => 
          user.role === 'company' && 
          user.bio?.company_info?.company_size &&
          companyFilters.companySizes.includes(user.bio.company_info.company_size)
        );
      }
      
      if (companyFilters.isHiring !== undefined) {
        result = result.filter(user => 
          user.role === 'company' && 
          user.bio?.hiring_needs?.open_positions &&
          user.bio.hiring_needs.open_positions.length > 0 === companyFilters.isHiring
        );
      }
      
      if (companyFilters.industries && companyFilters.industries.length > 0) {
        result = result.filter(user => 
          user.role === 'company' && 
          user.bio?.company_info?.industry &&
          companyFilters.industries.some(industry => 
            user.bio.company_info.industry.includes(industry)
          )
        );
      }
    }

    // Common filters
    const commonFilters = filters.common;
    
    if (commonFilters.countries && commonFilters.countries.length > 0) {
      result = result.filter(user => 
        user.country && commonFilters.countries.includes(user.country)
      );
    }
    
    if (commonFilters.cities && commonFilters.cities.length > 0) {
      result = result.filter(user => 
        user.city && commonFilters.cities.includes(user.city)
      );
    }
    
    if (commonFilters.skills && commonFilters.skills.length > 0) {
      result = result.filter(user => {
        const userSkills = [
          ...(user.bio?.professional_info?.skills?.map(s => s.name) || []),
          ...(user.bio?.skills_learning || [])
        ];
        return commonFilters.skills.some(skill => 
          userSkills.some(userSkill => 
            userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
      });
    }

    return result;
  }, [users, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Action functions
  const setSearchTerm = (term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  };

  const setSelectedRole = (role: UserRole | 'all') => {
    setFilters(prev => ({ ...prev, selectedRole: role }));
  };

  const updateProfessionalFilter = (key: keyof ProfessionalFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      professional: { ...prev.professional, [key]: value }
    }));
  };

  const updateStudentFilter = (key: keyof StudentFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      student: { ...prev.student, [key]: value }
    }));
  };

  const updateCompanyFilter = (key: keyof CompanyFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      company: { ...prev.company, [key]: value }
    }));
  };

  const updateCommonFilter = (key: keyof CommonFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      common: { ...prev.common, [key]: value }
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilterState);
  };

  const clearRoleFilters = (role: UserRole) => {
    setFilters(prev => ({
      ...prev,
      [role]: {}
    }));
  };

  const toggleFilterSidebar = () => {
    setIsFilterSidebarOpen(prev => !prev);
  };

  const toggleFilterGroup = (groupId: string) => {
    setExpandedFilterGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    
    if (filters.searchTerm) count++;
    if (filters.selectedRole !== 'all') count++;
    
    // Count professional filters
    Object.values(filters.professional).forEach(value => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) count++;
        else if (!Array.isArray(value)) count++;
      }
    });
    
    // Count student filters
    Object.values(filters.student).forEach(value => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) count++;
        else if (!Array.isArray(value)) count++;
      }
    });
    
    // Count company filters
    Object.values(filters.company).forEach(value => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) count++;
        else if (!Array.isArray(value)) count++;
      }
    });
    
    // Count common filters
    Object.values(filters.common).forEach(value => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) count++;
        else if (!Array.isArray(value)) count++;
      }
    });
    
    return count;
  };

  const getFilteredUsersCount = () => filteredUsers.length;

  const contextValue: DirectoryContextType = {
    // Data
    users,
    filteredUsers,
    
    // Filter state
    filters,
    
    // UI state
    currentPage,
    usersPerPage,
    totalPages,
    isFilterSidebarOpen,
    expandedFilterGroups,
    
    // Actions
    setSearchTerm,
    setSelectedRole,
    updateProfessionalFilter,
    updateStudentFilter,
    updateCompanyFilter,
    updateCommonFilter,
    clearFilters,
    clearRoleFilters,
    
    // UI actions
    setCurrentPage,
    toggleFilterSidebar,
    toggleFilterGroup,
    
    // Utility functions
    getActiveFiltersCount,
    getFilteredUsersCount
  };

  return (
    <DirectoryContext.Provider value={contextValue}>
      {children}
    </DirectoryContext.Provider>
  );
};

// Hook to use the context
export const useDirectory = () => {
  const context = useContext(DirectoryContext);
  if (context === undefined) {
    throw new Error('useDirectory must be used within a DirectoryProvider');
  }
  return context;
};