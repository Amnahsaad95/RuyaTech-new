'use client'

import React from 'react';
import { User } from '@/types/user';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const AdditionalInfoStep: React.FC<{
  userData: User;
  updateUserData: (data: Partial<User>) => void;
  errors: Record<string, string>;
}> = ({ userData, updateUserData, errors }) => {
  const t = useTranslations('auth.additional_info');

  // File upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateUserData({ profile_image: e.target.files[0] });
    }
  };

  const handleCVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateUserData({ cv_path: e.target.files[0] });
    }
  };

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
          {t('title')}
        </motion.h2>
        <p className="text-rose-600">
          {t('subtitle')}
        </p>
      </div>

      {/* Location Fields */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">📍</span> {t('location.title')}
        </h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('location.country')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={userData.country || ''}
              onChange={(e) => updateUserData({ country: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.country ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
              placeholder={t('location.country_placeholder')}
              required
            />
            {errors.country && <p className="mt-1 text-sm text-rose-600">{errors.country}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('location.city')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={userData.city || ''}
              onChange={(e) => updateUserData({ city: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.city ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
              placeholder={t('location.city_placeholder')}
              required
            />
            {errors.city && <p className="mt-1 text-sm text-rose-600">{errors.city}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('location.nationality')}
            </label>
            <input
              type="text"
              value={userData.National || ''}
              onChange={(e) => updateUserData({ National: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
              placeholder={t('location.nationality_placeholder')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('location.main_field')} {userData.role === 'professional' || userData.role === 'company' ? <span className="text-rose-500">*</span> : ''}
            </label>
            <input
              type="text"
              value={userData.mainfield || ''}
              onChange={(e) => updateUserData({ mainfield: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.mainfield ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
              placeholder={t('location.main_field_placeholder')}
            />
            {errors.mainfield && <p className="mt-1 text-sm text-rose-600">{errors.mainfield}</p>}
          </div>
        </div>
      </motion.div>

      {/* Social Profile */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">🌐</span> {t('social.title')}
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">
            {t('social.profile_url')}
          </label>
          <input
            type="url"
            value={userData.SocialProfile || ''}
            onChange={(e) => updateUserData({ SocialProfile: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
            placeholder={t('social.profile_url_placeholder')}
          />
        </div>
      </motion.div>

      {/* Profile Image */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">📸</span> {t('profile_image.title')}
        </h3>
        
        <div className="flex items-center">
          <div className="relative">
            {userData.profile_image ? (
              <div className="h-16 w-16 rounded-full overflow-hidden bg-rose-100 border-2 border-white shadow-sm">
                {typeof userData.profile_image === 'string' ? (
                  <img 
                    src={userData.profile_image} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-rose-600">
                     <img 
                      src={URL.createObjectURL(userData.profile_image)} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full overflow-hidden bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-rose-400">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            
            {userData.profile_image && (
              <motion.button
                onClick={() => updateUserData({ profile_image: null })}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-1 shadow-sm"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </div>
          
          <div className="ml-4">
            <label
              htmlFor="profile_image_upload"
              className="inline-flex items-center px-4 py-2 bg-white border border-rose-200 rounded-lg shadow-sm text-sm font-medium text-rose-700 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 cursor-pointer transition-all"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {userData.profile_image ? t('profile_image.change') : t('profile_image.upload')}
            </label>
            <input
              id="profile_image_upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
          </div>
        </div>
        
            {errors.profile_image && <p className="mt-1 text-sm text-rose-600">{errors.profile_image}</p>}
      </motion.div>
      {userData.role !== 'company' &&(
      <>
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">📄</span> {t('cv.title')}
        </h3>
        
        <div className="flex items-center">
          {userData.cv_path ? (
            <div className="flex items-center bg-rose-50 px-4 py-3 rounded-lg border border-rose-200 flex-1">
              <svg className="h-5 w-5 text-rose-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-rose-800 truncate">{typeof userData.cv_path === 'string' ? userData.cv_path : userData.cv_path?.name}</span>
              <button
                onClick={() => updateUserData({ cv_path: null })}
                className="ml-3 text-rose-500 hover:text-rose-700 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label
              htmlFor="cv_upload"
              className="inline-flex items-center px-4 py-3 bg-white border border-rose-200 rounded-lg shadow-sm text-sm font-medium text-rose-700 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 cursor-pointer transition-all flex-1"
            >
              <svg className="h-5 w-5 mr-2 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {t('cv.upload')}
            </label>
          )}
          <input
            id="cv_upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleCVChange}
            className="sr-only"
          />
        </div>
        {errors.cv_path && <p className="mt-1 text-sm text-rose-600">{errors.cv_path}</p>}
        <p className="mt-2 text-xs text-rose-600">{t('cv.file_types')}</p>
      </motion.div>
      
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">⚙️</span> {t('preferences.title')}
        </h3>
        
        <div className="space-y-4">
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-start"
          >
            <div className="flex items-center h-5">
              <input
                id="isexpert"
                type="checkbox"
                checked={userData.isexpert || false}
                onChange={(e) => updateUserData({ isexpert: e.target.checked })}
                className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-rose-300 rounded transition-all"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="isexpert" className="block text-sm font-medium text-rose-700">
                {t('preferences.expert_label')}
              </label>
              <p className="text-sm text-rose-600">
                {t('preferences.expert_description')}
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-start"
          >
            <div className="flex items-center h-5">
              <input
                id="isjobseek"
                type="checkbox"
                checked={userData.isjobseek || false}
                onChange={(e) => updateUserData({ isjobseek: e.target.checked })}
                className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-rose-300 rounded transition-all"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="isjobseek" className="block text-sm font-medium text-rose-700">
                {t('preferences.job_seek_label')}
              </label>
              <p className="text-sm text-rose-600">
                {t('preferences.job_seek_description')}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
      </>
      )
      }
    </motion.div>
 
  );
};

export default AdditionalInfoStep;