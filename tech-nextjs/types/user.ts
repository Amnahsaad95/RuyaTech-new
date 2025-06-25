export interface Skill {
  name: string;
  experience: string;
}

export interface Course {
  code?: string;
  name: string;
  semester?: string;
  grade?: string;
  year: string;
}

export interface Certificate {
  name: string;
  issuer?: string;
  year: string;
  expires?: number;
}

export interface WorkExperience {
  position: string;
  company: string;
  start_date?: string;
  end_date?: string | null;
  start_year: string;
  end_year?: string | null;
  is_current: boolean;
  description?: string;
}

export interface ProfessionalInfo {
  title: string;
  years_experience: number;
  skills: Skill[];
  languages?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Portfolio {
  title: string;
  description: string;
  url?: string;
}

export interface AcademicInfo {
  institution: string;
  program: string;
  degree_level: string;
  year: string;
}

export interface CareerGoals {
  short_term?: string;
  long_term?: string;
}

export interface CompanyInfo {
  legal_name: string;
  founded_year: number;
  company_size: string;
  industry: string[];
  website: string;
  headquarters: string;
}

export interface OpenPosition {
  title: string;
  department: string;
  location: string;
}

export interface HiringNeeds {
  open_positions?: OpenPosition[];
  hiring_process?: string[];
}

export interface Bio {
  professional_info?: ProfessionalInfo;
  education?: Education[];
  certifications?: Certificate[];
  work_history?: WorkExperience[];
  portfolio?: Portfolio[];
  
  academic_info?: AcademicInfo;
  courses?: Course[];
  skills_learning?: string[];
  interests?: string[];
  career_goals?: CareerGoals;
  
  company_info?: CompanyInfo;
  services?: string[];
  hiring_needs?: HiringNeeds;
  
  summary?: string;
}

export type UserRole = 'professional' | 'student' | 'company'|'admin';

export interface User {
  id?: number |null;
  name: string;
  email: string;
  email_verified_at?: string | null;
  password?: string;
  password_confirmation?: string;
  phone?: string | null;
  profile_image?: string | File | null;
  bio?: Bio | null;
  cv_path?: string |File| null;
  role?: UserRole | null;
  city?: string | null;
  country?: string | null;
  National?: string | null;
  SocialProfile?: string | null;
  mainfield?: string | null;
  isexpert?: boolean | null;
  isjobseek?: boolean | null;
  remember_token?: string | null;
  status?: 'approved' | 'suspended'| 'pending' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface RegistrationFormData extends User {
  currentStep: number;
  totalSteps: number;
  formComplete: boolean;
}
