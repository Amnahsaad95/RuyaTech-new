'use client'

import React from 'react';
import { User } from '@/types/user';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const ReviewStep: React.FC<{
  userData: User;
  updateUserData: (data: Partial<User>) => void;
  errors: Record<string, string>;
}> = ({ userData, updateUserData, errors }) => {
  const t = useTranslations('auth');
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const renderField = (label: string, value: string | number | boolean | null | undefined, index: number) => {
    let displayValue = value;
    
    if (value === null || value === undefined || value === '') {
      displayValue = t('not_provided');
    } else if (typeof value === 'boolean') {
      displayValue = value ? t('yes') : t('no');
    }
    
    return (
      <motion.div 
        key={index}
        whileHover={{ x: 5 }}
        className="group"
      >
        <dt className="text-sm font-medium text-gray-500 group-hover:text-rose-600 transition-colors">
          {label}
        </dt>
        <dd className="mt-1 text-sm font-semibold text-gray-900">
          {displayValue}
        </dd>
      </motion.div>
    );
  };

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
          {t('review.title')}
        </motion.h2>
        <p className="text-lg text-rose-600">
          {t('review.subtitle')}
        </p>
      </div>

      {/* Notification */}
      <motion.div 
        className="bg-rose-50 p-4 rounded-lg border border-rose-200 "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg className="h-5 w-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-rose-800">
              {t('review.notification')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div 
        className="bg-white  overflow-hidden rounded-2xl border border-rose-100"
        whileHover={{ y: -2 }}
      >
        {/* Basic Information */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-200">
          <h3 className="text-xl font-semibold text-rose-900">{t('review.basic_info')}</h3>
        </div>
        <div className="px-6 py-5 border-b border-rose-100">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: t('fields.name'), value: userData.name },
              { label: t('fields.email'), value: userData.email },
              { label: t('fields.phone'), value: userData.phone },
              { label: t('fields.role'), value: userData.role ? t(`roles.${userData.role}.title`) : '' }
            ].map((item, index) => renderField(item.label, item.value, index))}
          </dl>
        </div>

        {/* Location Information */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-200">
          <h3 className="text-xl font-semibold text-rose-900">{t('review.location_info')}</h3>
        </div>
        <div className="px-6 py-5 border-b border-rose-100">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: t('fields.country'), value: userData.country },
              { label: t('fields.city'), value: userData.city },
              { label: t('fields.nationality'), value: userData.National },
              { label: t('fields.main_field'), value: userData.mainfield }
            ].map((item, index) => renderField(item.label, item.value, index))}
          </dl>
        </div>

        {/* Role-specific sections */}
        {userData.role === 'professional' && userData.bio?.professional_info && (
          <>
            <div className="px-6 py-5 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-200">
              <h3 className="text-xl font-semibold text-rose-900">{t('review.professional_info')}</h3>
            </div>
            <div className="px-6 py-5 border-b border-rose-100">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <motion.div whileHover={{ x: 5 }}>
                  <dt className="text-sm font-medium text-gray-500">{t('fields.title')}</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">
                    {userData.bio.professional_info.title || t('not_provided')}
                  </dd>
                </motion.div>
                <motion.div whileHover={{ x: 5 }}>
                  <dt className="text-sm font-medium text-gray-500">{t('fields.years_experience')}</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">
                    {userData.bio.professional_info.years_experience || t('not_provided')}
                  </dd>
                </motion.div>
                <motion.div 
                  className="sm:col-span-2"
                  whileHover={{ x: 5 }}
                >
                  <dt className="text-sm font-medium text-gray-500">{t('fields.skills')}</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {userData.bio.professional_info.skills?.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {userData.bio.professional_info.skills.map((skill, index) => (
                          <li key={index} className="font-medium">
                            <span className="font-semibold">{skill.name}</span> - {skill.experience}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="italic text-gray-500">{t('not_provided')}</span>
                    )}
                  </dd>
                </motion.div>
              </dl>
            </div>
          </>
        )}

        {userData.role === 'student' && userData.bio?.academic_info && (
          <>
            <div className="px-6 py-5 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-200">
              <h3 className="text-xl font-semibold text-rose-900">{t('review.academic_info')}</h3>
            </div>
            <div className="px-6 py-5 border-b border-rose-100">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {[
                  { label: t('fields.institution'), value: userData.bio.academic_info.institution },
                  { label: t('fields.program'), value: userData.bio.academic_info.program },
                  { label: t('fields.degree_level'), value: userData.bio.academic_info.degree_level },
                  { label: t('fields.year'), value: userData.bio.academic_info.year }
                ].map((item, index) => renderField(item.label, item.value, index))}
              </dl>
            </div>
          </>
        )}

        {userData.role === 'company' && userData.bio?.company_info && (
          <>
            <div className="px-6 py-5 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-200">
              <h3 className="text-xl font-semibold text-rose-900">{t('review.company_info')}</h3>
            </div>
            <div className="px-6 py-5 border-b border-rose-100">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {[
                  { label: t('fields.legal_name'), value: userData.bio.company_info.legal_name },
                  { label: t('fields.founded_year'), value: userData.bio.company_info.founded_year },
                  { label: t('fields.company_size'), value: userData.bio.company_info.company_size },
                  { label: t('fields.website'), value: userData.bio.company_info.website },
                  { label: t('fields.headquarters'), value: userData.bio.company_info.headquarters }
                ].map((item, index) => renderField(item.label, item.value, index))}
                <motion.div 
                  className="sm:col-span-2"
                  whileHover={{ x: 5 }}
                >
                  <dt className="text-sm font-medium text-gray-500">{t('fields.industry')}</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">
                    {userData.bio.company_info.industry?.length > 0 ? (
                      userData.bio.company_info.industry.join(', ')
                    ) : (
                      <span className="italic text-gray-500">{t('not_provided')}</span>
                    )}
                  </dd>
                </motion.div>
              </dl>
            </div>
          </>
        )}

        {/* Additional Information */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-200">
          <h3 className="text-xl font-semibold text-rose-900">{t('review.additional_info')}</h3>
        </div>
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: t('fields.expert_status'), value: userData.isexpert },
              { label: t('fields.job_seeking_status'), value: userData.isjobseek ? t('actively_looking') : t('not_looking') },
              { label: t('fields.social_profile'), value: userData.SocialProfile },
              { label: t('fields.cv_resume'), value: userData.cv_path ? t('uploaded') : t('not_uploaded') }
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ x: 5 }}
              >
                <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                <dd className={`mt-1 text-sm font-semibold ${
                  item.value === t('not_provided') || 
                  item.value === t('not_uploaded') ? 
                  'text-gray-500' : 'text-gray-900'
                }`}>
                  {item.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div 
        className="mt-6 p-4 bg-rose-50 rounded-lg shadow-inner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-rose-800">
          {t('review.terms_notice')}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ReviewStep;