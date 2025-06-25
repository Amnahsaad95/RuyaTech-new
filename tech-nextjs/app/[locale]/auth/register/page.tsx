'use client'

import React from 'react';
import RegistrationForm from '@/components/register/RegistrationForm';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function RegisterPage() {

  const t = useTranslations('auth');

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
       <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">

        <div className="bg-red-600 py-6 px-8 text-center">
          <h1 className="text-3xl font-bold text-white">{t('register_title')}</h1>
          <p className="text-rose-100 mt-2">{t('register_subtitle')}</p>
        </div>

        <div className="p-8">
          <RegistrationForm />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-rose-800">
                  {t('have_account')}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/auth/login"
                className="w-full flex justify-center py-2 px-4 border border-rose-300 rounded-md shadow-sm text-sm font-medium text-rose-700 bg-white hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                {t('sign_in')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}