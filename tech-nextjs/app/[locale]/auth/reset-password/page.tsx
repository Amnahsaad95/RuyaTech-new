'use client'

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { validatePassword, validatePasswordMatch } from '@/utils/formUtils';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const t = useTranslations('auth.resetPass');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setErrors({});

    // Validate inputs
    const newErrors: Record<string, string> = {};
    
    if (!password) {
      newErrors.password = t('errors.passwordRequired');
    } else if (!validatePassword(password)) {
      newErrors.password = t('errors.passwordRequirements');
    }
    
    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = t('errors.confirmPasswordRequired');
    } else if (!validatePasswordMatch(password, passwordConfirmation)) {
      newErrors.passwordConfirmation = t('errors.passwordsDontMatch');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          email,
          password,
          password_confirmation: passwordConfirmation
        }),
      });

      const data = await response.json();

      if (response.status === 422) {
        // Handle validation errors from server
        const serverErrors: Record<string, string> = {};
        for (const key in data.errors) {
          serverErrors[key] = data.errors[key][0];
        }
        setErrors(serverErrors);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || t('errors.resetFailed'));
      }

      setMessage(data.message || t('success.passwordReset'));
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 10000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-rose-600 py-6 px-8 text-center">
            <h1 className="text-3xl font-bold text-white">{t('invalidLink.title')}</h1>
          </div>
          <div className="p-8 text-center">
            <p className="text-gray-700 mb-4">{t('invalidLink.description')}</p>
            <a href="/forgot-password" className="text-rose-600 hover:text-rose-500 font-medium">
              {t('invalidLink.requestNewLink')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-rose-600 py-6 px-8 text-center">
          <h1 className="text-3xl font-bold text-white">{t('resetPassword.title')}</h1>
          <p className="text-rose-100 mt-2">{t('resetPassword.subtitle')}</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-rose-100 text-rose-700 rounded-md">
              {error}
            </div>
          )}
          
          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-rose-800">
                {t('form.newPasswordLabel')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-rose-300'
                } rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500`}
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {t('form.passwordRequirements')}
              </p>
            </div>
            
            <div>
              <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-rose-800">
                {t('form.confirmPasswordLabel')}
              </label>
              <input
                id="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.passwordConfirmation ? 'border-red-300' : 'border-rose-300'
                } rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500`}
                required
              />
              {errors.passwordConfirmation && (
                <p className="mt-1 text-sm text-red-600">{errors.passwordConfirmation}</p>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('buttons.resetting')}
                  </span>
                ) : (
                  t('buttons.resetPassword')
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/auth/login" className="text-sm font-medium text-rose-600 hover:text-rose-500">
              {t('links.backToLogin')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}