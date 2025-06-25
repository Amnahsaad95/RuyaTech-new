'use client'

import React from 'react';
import { User } from '@/types/user';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const BasicInfoStep: React.FC<{
  userData: User;
  updateUserData: (data: Partial<User>) => void;
  errors: Record<string, string>;
}> = ({ userData, updateUserData, errors }) => {
  const t = useTranslations('auth');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.h2 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-2xl font-bold text-rose-800 mb-2"
        >
          {t('basic_info.title')}
        </motion.h2>
        <p className="text-rose-600">
          {t('basic_info.subtitle')}
        </p>
      </div>

      {/* Form Fields */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <div className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('basic_info.full_name')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={userData.name || ''}
              onChange={(e) => updateUserData({ name: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
              placeholder={t('basic_info.name_placeholder')}
              required
            />
            {errors.name && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-rose-600"
              >
                {errors.name}
              </motion.p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('basic_info.email')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={userData.email || ''}
              onChange={(e) => updateUserData({ email: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.email ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
              placeholder={t('basic_info.email_placeholder')}
              required
            />
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-rose-600"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('basic_info.phone')}
            </label>
            <input
              type="tel"
              value={userData.phone || ''}
              onChange={(e) => updateUserData({ phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
              placeholder={t('basic_info.phone_placeholder')}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('basic_info.password')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              value={userData.password || ''}
              onChange={(e) => updateUserData({ password: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.password ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
              required
            />
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-rose-600"
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('basic_info.confirm_password')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              value={userData.password_confirmation || ''}
              onChange={(e) => updateUserData({ password_confirmation: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.password_confirmation ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
              required
            />
            {errors.password_confirmation && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-rose-600"
              >
                {errors.password_confirmation}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default BasicInfoStep;