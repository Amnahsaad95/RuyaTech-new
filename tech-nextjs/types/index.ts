// TypeScript interfaces for the Professional Directory

export type UserRole = 'professional' | 'student' | 'company';

export interface Skill {
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
  field?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  expires?: number;
}

export interface ProfessionalInfo {
  title: string;
  yearsExperience: number;
  skills: Skill[];
  education: Education[];
  workHistory: WorkExperience[];
  certifications: Certification[];
  isExpert: boolean;
  isJobSeeking: boolean;
  portfolio?: string[];
}

export interface StudentInfo {
  institution: string;
  program: string;
  degreeLevel: 'undergraduate' | 'master' | 'phd';
  year: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate';
  graduationYear: number;
  fieldOfStudy: string;
  courses: string[];
  skillsLearning: string[];
  interests: string[];
  careerGoals: {
    shortTerm: string;
    longTerm: string;
  };
}

export interface CompanyInfo {
  legalName: string;
  foundedYear: number;
  companySize: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  industry: string[];
  website: string;
  headquarters: string;
  services: string[];
  fundingStage: 'bootstrapped' | 'seed' | 'series-a' | 'series-b' | 'public';
  hiringNeeds: {
    isHiring: boolean;
    openPositions: {
      title: string;
      department: string;
      location: string;
      type: 'tech' | 'non-tech';
    }[];
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
  role: UserRole;
  city?: string;
  country?: string;
  mainField?: string;
  summary?: string;
  socialProfile?: string;
  isAvailableForWork: boolean;
  isOpenToFreelance: boolean;
  joinedDate: string;
  
  // Role-specific information
  professionalInfo?: ProfessionalInfo;
  studentInfo?: StudentInfo;
  companyInfo?: CompanyInfo;
}

// Filter interfaces
export interface ProfessionalFilters {
  isExpert?: boolean;
  isJobSeeking?: boolean;
  minExperience?: number;
  industries?: string[];
  skills?: string[];
}

export interface StudentFilters {
  educationLevel?: string[];
  fieldsOfStudy?: string[];
  graduationYearFrom?: number;
  graduationYearTo?: number;
  skills?: string[];
}

export interface CompanyFilters {
  companySizes?: string[];
  isHiring?: boolean;
  hiringTechRoles?: boolean;
  hiringNonTechRoles?: boolean;
  fundingStages?: string[];
  industries?: string[];
}

export interface CommonFilters {
  skills?: string[];
  countries?: string[];
  cities?: string[];
  isAvailableForWork?: boolean;
  isOpenToFreelance?: boolean;
}

export interface FilterState {
  searchTerm: string;
  selectedRole: UserRole | 'all';
  professional: ProfessionalFilters;
  student: StudentFilters;
  company: CompanyFilters;
  common: CommonFilters;
}

// Context interfaces
export interface DirectoryContextType {
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

// Component prop interfaces
export interface FilterGroupProps {
  title: string;
  groupId: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: (groupId: string) => void;
}

export interface UserCardProps {
  user: User;
  onClick?: (user: User) => void;
}

export interface SkillPillProps {
  skill: string;
  isSelected?: boolean;
  onClick?: (skill: string) => void;
  variant?: 'default' | 'selected' | 'professional' | 'student' | 'company';
}

export interface FilterTagProps {
  label: string;
  onRemove: () => void;
  variant?: 'default' | 'professional' | 'student' | 'company';
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
}

// Search and filter utility types
export type SortOption = 'relevance' | 'name' | 'joinedDate' | 'experience';
export type SortDirection = 'asc' | 'desc';

export interface SearchOptions {
  sortBy: SortOption;
  sortDirection: SortDirection;
  includeInactive?: boolean;
}

// API response types (for future backend integration)
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface UserSearchResponse extends ApiResponse<User[]> {
  filters?: {
    availableSkills: string[];
    availableCountries: string[];
    availableCities: string[];
    availableIndustries: string[];
  };
}

