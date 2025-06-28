import { User, UserRole, Bio } from '@/types/user';

export const FORM_STEPS = {
  BASIC_INFO: 1,
  ROLE_SELECTION: 2,
  ROLE_SPECIFIC_INFO: 3,
  ADDITIONAL_INFO: 4,
  REVIEW: 5,
  ERROR:6
};

export const TOTAL_STEPS = Object.keys(FORM_STEPS).length;

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const validateRequiredFields = (data: any, fields: string[]): boolean => {
  return fields.every(field => {
    if (typeof data[field] === 'string') {
      return data[field].trim() !== '';
    }
    return data[field] !== undefined && data[field] !== null;
  });
};

export const getRequiredFieldsByRole = (role: UserRole): string[] => {
  const commonFields = ['name', 'email', 'password', 'password_confirmation'];
  
  switch (role) {
    case 'professional':
      return [...commonFields, 'phone', 'city', 'country', 'mainfield'];
    case 'student':
      return [...commonFields, 'phone', 'city', 'country'];
    case 'company':
      return [...commonFields, 'phone', 'city', 'country', 'mainfield'];
    default:
      return commonFields;
  }
};

export const getBioTemplate = (role: UserRole): Bio => {
  switch (role) {
    case 'professional':
      return {
        professional_info: {
          title: '',
          years_experience: 0,
          skills: [],
          languages: []
        },
        education: [],
        certifications: [],
        work_history: [],
        portfolio: [],
        summary: ''
      };
    case 'student':
      return {
        academic_info: {
          institution: '',
          program: '',
          degree_level: '',
          year: ''
        },
        courses: [],
        skills_learning: [],
        interests: [],
        career_goals: {
          short_term: '',
          long_term: ''
        },
        summary: ''
      };
    case 'company':
      return {
        company_info: {
          legal_name: '',
          founded_year: new Date().getFullYear(),
          company_size: '',
          industry: [],
          website: '',
          headquarters: ''
        },
        services: [],
        hiring_needs: {
          open_positions: [],
          hiring_process: []
        },
        summary: ''
      };
    default:
      return {};
  }
};

export const isStepComplete = (user: User, step: number): boolean => {
  switch (step) {
    case FORM_STEPS.BASIC_INFO:
          
        return (
            validateRequiredFields(user, ['name', 'email', 'password', 'password_confirmation']) &&
            !!user.email && validateEmail(user.email) &&
            !!user.password && validatePassword(user.password) &&
            !!user.password_confirmation && validatePasswordMatch(user.password, user.password_confirmation)
          );
    
    case FORM_STEPS.ROLE_SELECTION:
      return user.role !== null && user.role !== undefined;
    
    case FORM_STEPS.ROLE_SPECIFIC_INFO:
      if (!user.role || !user.bio) return false;
      
      switch (user.role) {
        case 'professional':
          return user.bio.professional_info !== undefined &&
            validateRequiredFields(user.bio.professional_info, ['title', 'years_experience']) &&
            (user.bio.professional_info.skills?.length > 0);
        
        case 'student':
          return user.bio.academic_info !== undefined &&
            validateRequiredFields(user.bio.academic_info, ['institution', 'program', 'degree_level', 'year']);
        
        case 'company':
          return user.bio.company_info !== undefined &&
            validateRequiredFields(user.bio.company_info, ['legal_name', 'founded_year', 'company_size']) &&
            (user.bio.company_info.industry?.length > 0);
        
        default:
          return false;
      }
    
    case FORM_STEPS.ADDITIONAL_INFO:
      return validateRequiredFields(user, ['city', 'country']);
    
    default:
      return true;
  }
};

export const prepareFormDataForSubmission = (user: User): any => {
  // Create a deep copy to avoid modifying the original
  const formData = JSON.parse(JSON.stringify(user));
  
  // Remove confirmation field as it's not needed for backend
  delete formData.password_confirmation;
  
  // Handle file objects if present
  if (formData.profile_image instanceof File) {
    // In a real implementation, you would handle file upload separately
    // For now, we'll just note that it's a file object
    formData.profile_image = 'FILE_OBJECT_TO_BE_UPLOADED';
  }
  
  return formData;
};
