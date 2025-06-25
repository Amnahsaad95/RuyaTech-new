'use client';

import { useState } from 'react';
import { useAuth } from '@/services/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const t = useTranslations('auth');
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password,locale);
      router.push('/admin');
    } catch (err: any) {
      const code = err.code;

      if (err.errors) {
        setFieldErrors(err.errors);
      } else if (code === 'EMAIL_NOT_APPROVED') {
        setError(t('not_approved'));
      } else if (code === 'EMAIL_REJECTED') {
        setError(t('rejected_account'));
      } else if (code === 'EMAIL_SUSPENDED') {
        setError(t('suspended_account'));
      } else {
        setError(t('login_failed'));
      }
      setLoading(false);
    }

  };

  if (isAuthenticated) {
    router.push('/admin');
    return null;
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-rose-600 py-6 px-8 text-center">
          <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
          <p className="text-rose-100 mt-2">{t('subtitle')}</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-rose-100 text-rose-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-rose-800">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-rose-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                required
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm">{fieldErrors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-rose-800">
                {t('password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-rose-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                required
              />
               {fieldErrors.password && (
                    <p className="text-red-500 text-sm">{fieldErrors.password[0]}</p>
                  )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-rose-800">
                  {t('remember')}
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-rose-600 hover:text-rose-500">
                  {t('forgot')}
                </Link>
              </div>
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
                    {t('signing')}
                  </span>
                ) : t('signin')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-rose-800">
                  {t('no_account')}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/auth/register"
                className="w-full flex justify-center py-2 px-4 border border-rose-300 rounded-md shadow-sm text-sm font-medium text-rose-700 bg-white hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                {t('create_account')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
