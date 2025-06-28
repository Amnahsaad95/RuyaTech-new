'use client'

import React, { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import { FORM_STEPS, TOTAL_STEPS, isStepComplete, getBioTemplate, validateEmail, validatePassword, validatePasswordMatch, validateRequiredFields, getRequiredFieldsByRole } from '@/utils/formUtils';
import FormProgress from './FormProgress';
import FormNavigation from './FormNavigation';
import BasicInfoStep from './BasicInfoStep';
import RoleSelectionStep from './RoleSelectionStep';
import ProfessionalFormStep from './ProfessionalFormStep';
import StudentFormStep from './StudentFormStep';
import CompanyFormStep from './CompanyFormStep';
import AdditionalInfoStep from './AdditionalInfoStep';
import ReviewStep from './ReviewStep';
import ErrorStep from './ErrorStep';
import { useAuth } from '@/services/context/AuthContext';
import { useLocale, useTranslations } from 'next-intl';

const RegistrationForm: React.FC = () => {
  const { registerUser } = useAuth();
  const t = useTranslations('auth');
  const locale = useLocale();
  const [userData, setUserData] = useState<User>({
    id: undefined,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: null,
    profile_image: null,
    bio: null,
    cv_path: null,
    role: null,
    city: null,
    country: null,
    National: null,
    SocialProfile: null,
    mainfield: null,
    isexpert: false,
    isjobseek: false,
  });
  
  const [currentStep, setCurrentStep] = useState(FORM_STEPS.BASIC_INFO);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isStepValid, setIsStepValid] = useState<boolean[]>(Array(TOTAL_STEPS).fill(false));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});
  
  const updateUserData = (data: Partial<User>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };
  
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case FORM_STEPS.BASIC_INFO:
        if (!userData.name) {
          newErrors.name = t('errors.name_required');
        }
        
        if (!userData.email) {
          newErrors.email = t('errors.email_required');
        } else if (!validateEmail(userData.email)) {
          newErrors.email = t('errors.invalid_email');
        }
        
        if (!userData.password) {
          newErrors.password = t('errors.password_required');
        } else if (!validatePassword(userData.password)) {
          newErrors.password = t('errors.password_requirements');
        }
        
        if (!userData.password_confirmation) {
          newErrors.password_confirmation = t('errors.confirm_password');
        } else if (!validatePasswordMatch(userData.password!, userData.password_confirmation)) {
          newErrors.password_confirmation = t('errors.password_mismatch');
        }
        break;
      
      case FORM_STEPS.ROLE_SELECTION:
        if (!userData.role) {
          newErrors.role = t('errors.role_required');
        }
        break;
      
      case FORM_STEPS.ROLE_SPECIFIC_INFO:
        if (!userData.bio) {
          newErrors.bio = t('errors.role_info_required');
          break;
        }
        
        if (userData.role === 'professional') {
          const professionalInfo = userData.bio.professional_info;
          if (!professionalInfo) {
            newErrors.professional_info = t('errors.professional_info_required');
          } else {
            if (!professionalInfo.title) {
              newErrors.title = t('errors.title_required');
            }
            if (!professionalInfo.skills || professionalInfo.skills.length === 0) {
              newErrors.skills = t('errors.skills_required');
            }
          }
        } else if (userData.role === 'student') {
          const academicInfo = userData.bio.academic_info;
          if (!academicInfo) {
            newErrors.academic_info = t('errors.academic_info_required');
          } else {
            if (!academicInfo.institution) {
              newErrors.institution = t('errors.institution_required');
            }
            if (!academicInfo.program) {
              newErrors.program = t('errors.program_required');
            }
            if (!academicInfo.degree_level) {
              newErrors.degree_level = t('errors.degree_required');
            }
            if (!academicInfo.year) {
              newErrors.year = t('errors.year_required');
            }
          }
        } else if (userData.role === 'company') {
          const companyInfo = userData.bio.company_info;
          if (!companyInfo) {
            newErrors.company_info = t('errors.company_info_required');
          } else {
            if (!companyInfo.legal_name) {
              newErrors.legal_name = t('errors.company_name_required');
            }
            if (!companyInfo.company_size) {
              newErrors.company_size = t('errors.company_size_required');
            }
            if (!companyInfo.industry || companyInfo.industry.length === 0) {
              newErrors.industry = t('errors.industry_required');
            }
            if (!companyInfo.website) {
              newErrors.website = t('errors.website_required');
            }
            if (!companyInfo.headquarters) {
              newErrors.headquarters = t('errors.headquarters_required');
            }
          }
        }
        break;
      
      case FORM_STEPS.ADDITIONAL_INFO:
        if (!userData.country) {
          newErrors.country = t('errors.country_required');
        }
        if (!userData.city) {
          newErrors.city = t('errors.city_required');
        }
        if ((userData.role === 'professional' || userData.role === 'company') && !userData.mainfield) {
          newErrors.mainfield = t('errors.field_required');
        }
        if ((userData.role === 'professional' || userData.role === 'student') && !userData.profile_image) {
          newErrors.profile_image = t('errors.image_required');
        }
        if ((userData.role === 'professional' || userData.role === 'student') && !userData.cv_path) {
          newErrors.cv_path = t('errors.cv_required');
        }
        break;
      
      case FORM_STEPS.REVIEW:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    const isValid = validateStep(currentStep);
    
    if (isValid) {
      const newIsStepValid = [...isStepValid];
      newIsStepValid[currentStep - 1] = true;
      setIsStepValid(newIsStepValid);
      
      if (currentStep === FORM_STEPS.REVIEW) {
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSubmit = async () => {
    

    try {
      setIsSubmitting(true);
      await registerUser(userData,locale);
      setIsSubmitted(true);
    } catch (err: any) {
      const code = err.code;

      console.log(err);
      if (err.errors) {
        setFieldErrors(err.errors);
      }
      setCurrentStep(prev => prev + 1);
      setIsSubmitting(false);
      setIsSubmitted(false);
    }
    
    
  };
  
  useEffect(() => {
    if (userData.role && !userData.bio) {
      updateUserData({ bio: getBioTemplate(userData.role) });
    }
  }, [userData.role]);
  
  const renderStep = () => {
    switch (currentStep) {
      case FORM_STEPS.BASIC_INFO:
        return <BasicInfoStep userData={userData} updateUserData={updateUserData} errors={errors} />;
      case FORM_STEPS.ROLE_SELECTION:
        return <RoleSelectionStep userData={userData} updateUserData={updateUserData} errors={errors} />;
      case FORM_STEPS.ROLE_SPECIFIC_INFO:
        if (userData.role === 'professional') {
          return <ProfessionalFormStep userData={userData} updateUserData={updateUserData} errors={errors} />;
        } else if (userData.role === 'student') {
          return <StudentFormStep userData={userData} updateUserData={updateUserData} errors={errors} />;
        } else if (userData.role === 'company') {
          return <CompanyFormStep userData={userData} updateUserData={updateUserData} errors={errors} />;
        }
        return null;
      case FORM_STEPS.ADDITIONAL_INFO:
        return <AdditionalInfoStep userData={userData} updateUserData={updateUserData} errors={errors} />;
      case FORM_STEPS.REVIEW:
        return <ReviewStep userData={userData} updateUserData={updateUserData} errors={errors} />;
      case FORM_STEPS.ERROR:
        return <ErrorStep userData={userData}  errors={fieldErrors} />;
      default:
        return null;
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-100">
          <svg className="h-6 w-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-3 text-lg font-medium text-rose-800">{t('registration_success')}</h2>
        <p className="mt-2 text-sm text-rose-600">
          {t('registration_pending')}
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            {t('return_home')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <FormProgress currentStep={currentStep} isStepValid={isStepValid} />
      
      <div className="bg-white p-6 rounded-lg  border border-rose-100">
        <form>
          {renderStep()}
          
          <FormNavigation
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isNextDisabled={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;