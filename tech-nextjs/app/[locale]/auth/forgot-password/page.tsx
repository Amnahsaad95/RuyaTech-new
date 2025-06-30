'use client'

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const router = useRouter();
  const t = useTranslations('auth.forgetPass');

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setResetLink(data.reset_url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('errors.resetFailed'));
      }

      setMessage(t('success.resetLinkSent'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

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
              <label htmlFor="email" className="block text-sm font-medium text-rose-800">
                {t('form.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-rose-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                required
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('buttons.sending')}
                  </span>
                ) : t('buttons.sendResetLink')}
              </button>
            </div>

            {resetLink && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                <strong>{t('resetLink.label')}: </strong> 
                <a href={resetLink} className="text-blue-500">{t('resetLink.clickHere')}</a>
              </div>
            )}
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