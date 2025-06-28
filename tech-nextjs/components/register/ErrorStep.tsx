'use client'

import React from 'react';
import { User } from '@/types/user';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const ErrorStep: React.FC<{
  userData: User;
  errors: { [key: string]: string[] };
}> = ({ userData, errors }) => {
  const t = useTranslations('auth');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.h2 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-rose-900 mb-3"
        >
          {t('error.title')}
        </motion.h2>
        <p className="text-lg text-rose-600">
          {t('error.subtitle')}
        </p>
      </div>

      {/* Error Notification */}
      <motion.div 
        className="bg-rose-100 p-6 rounded-lg border border-rose-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-10 w-10 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-rose-900 mb-2">
              {t('error.notification_title')}
            </h3>
            <p className="text-rose-800">
              {t('error.notification_message')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Error Details */}
      <motion.div 
        className="bg-white overflow-hidden rounded-2xl border border-rose-200"
        whileHover={{ y: -2 }}
      >
        <div className="px-6 py-5 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-200">
          <h3 className="text-xl font-semibold text-rose-900">{t('error.details_title')}</h3>
        </div>
        
        <div className="px-6 py-5">
          <ul className="space-y-4">
            {Object.entries(errors).map(([field, error], index) => (
              <motion.li 
                key={index}
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start"
              >
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-rose-700">
                    {error}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      
    </motion.div>
  );
};

export default ErrorStep;