import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface PasswordChangeFormProps {
  userId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ 
  userId,
  onSuccess,
  onCancel
}) => {
  const { t } = useTranslation(['common', 'users']);
    const router = useParams();
    const rawLocale = router?.locale;
    const locale = Array.isArray(rawLocale) ? rawLocale[0] : rawLocale ?? 'en';
    const isRTL = locale === 'ar';
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | 'veryStrong' | ''>('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Calculate password strength for new password
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
    
    // Check password match when confirm password is changed
    if (name === 'confirmPassword' && formData.newPassword !== value) {
      setErrors(prev => ({ 
        ...prev, 
        confirmPassword: t('password:validation.passwordMatch') 
      }));
    } else if (name === 'confirmPassword') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };
  
  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength('');
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Set strength category
    if (strength <= 2) {
      setPasswordStrength('weak');
    } else if (strength <= 4) {
      setPasswordStrength('medium');
    } else if (strength <= 5) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('veryStrong');
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Check required fields
    if (!formData.currentPassword) {
      newErrors.currentPassword = t('password:validation.required');
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = t('password:validation.required');
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = t('password:validation.minLength', { count: 8 });
    } else if (passwordStrength === 'weak') {
      newErrors.newPassword = t('password:validation.passwordStrength');
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('password:validation.required');
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('password:validation.passwordMatch');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be an API call to your backend
      // const response = await fetch(`/api/users/${userId}/password`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     currentPassword: formData.currentPassword,
      //     newPassword: formData.newPassword,
      //   }),
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to update password');
      // }
      
      // Mock successful API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccessMessage(t('password:passwordUpdated'));
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error:any) {
      console.error('Error updating password:', error);
      setErrorMessage(t('password:errorUpdating'));
      
      // Handle specific errors
      if (error.message === 'Current password is incorrect') {
        setErrors(prev => ({ 
          ...prev, 
          currentPassword: t('password:validation.incorrectPassword') 
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      case 'veryStrong': return 'bg-green-600';
      default: return 'bg-gray-300';
    }
  };
  
  return (
    <div className={`max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {t('password:title')}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              {t('password:currentPassword')}
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder={t('password:placeholders.currentPassword')}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.currentPassword 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              {t('password:newPassword')}
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder={t('password:placeholders.newPassword')}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.newPassword 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
            
            {/* Password strength indicator */}
            {formData.newPassword && (
              <div className="mt-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`} 
                    style={{ 
                      width: passwordStrength === 'weak' ? '25%' : 
                             passwordStrength === 'medium' ? '50%' : 
                             passwordStrength === 'strong' ? '75%' : 
                             passwordStrength === 'veryStrong' ? '100%' : '0%' 
                    }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  {passwordStrength && t(`password:strength.${passwordStrength}`)}
                </p>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              {t('password:confirmPassword')}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t('password:placeholders.confirmPassword')}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.confirmPassword 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
          
          {/* Password tips */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              {t('password:tips.title')}
            </h4>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>{t('password:tips.minLength')}</li>
              <li>{t('password:tips.uppercase')}</li>
              <li>{t('password:tips.lowercase')}</li>
              <li>{t('password:tips.numbers')}</li>
              <li>{t('password:tips.special')}</li>
              <li>{t('password:tips.noPersonal')}</li>
            </ul>
          </div>
          
          <div className="flex justify-end space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('password:cancel')}
              </button>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('common:loading')}
                </span>
              ) : t('password:updatePassword')}
            </button>
          </div>
        </div>
      </form>
      
      {/* Back to profile link */}
      {!onCancel && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <Link href={`/users/${userId}`} className="text-sm text-blue-600 hover:text-blue-800">
            ← {t('password:backToProfile')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default PasswordChangeForm;
