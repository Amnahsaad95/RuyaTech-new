'use client'

import React from 'react';
import { User, ProfessionalInfo, Skill, Education, WorkExperience, Portfolio } from '@/types/user';
import { getBioTemplate } from '@/utils/formUtils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const ProfessionalFormStep: React.FC<{
  userData: User;
  updateUserData: (data: Partial<User>) => void;
  errors: Record<string, string>;
}> = ({ userData, updateUserData, errors }) => {
  const t = useTranslations('auth.professional');
  
  // Initialize bio if it doesn't exist
  React.useEffect(() => {
    if (!userData.bio && userData.role === 'professional') {
      updateUserData({ bio: getBioTemplate('professional') });
    }
  }, [userData.bio, userData.role, updateUserData]);

  const professionalInfo = userData.bio?.professional_info as ProfessionalInfo;
  
  // Skills management
  const [newSkill, setNewSkill] = React.useState<Partial<Skill>>({ name: '', experience: '' });
  
  const addSkill = () => {
    if (!newSkill.name || !newSkill.experience) return;
    
    const updatedSkills = [...(professionalInfo?.skills || []), newSkill as Skill];
    updateUserData({
      bio: {
        ...userData.bio,
        professional_info: {
          ...professionalInfo,
          skills: updatedSkills
        }
      }
    });
    setNewSkill({ name: '', experience: '' });
  };
  
  const removeSkill = (index: number) => {
    const updatedSkills = [...professionalInfo.skills];
    updatedSkills.splice(index, 1);
    updateUserData({
      bio: {
        ...userData.bio,
        professional_info: {
          ...professionalInfo,
          skills: updatedSkills
        }
      }
    });
  };
  
  // Education management
  const [newEducation, setNewEducation] = React.useState<Partial<Education>>({ 
    degree: '', 
    institution: '', 
    year: new Date().getFullYear() 
  });
  
  const addEducation = () => {
    if (!newEducation.degree || !newEducation.institution) return;
    
    const updatedEducation = [...(userData.bio?.education || []), newEducation as Education];
    updateUserData({
      bio: {
        ...userData.bio,
        education: updatedEducation
      }
    });
    setNewEducation({ degree: '', institution: '', year: new Date().getFullYear() });
  };
  
  const removeEducation = (index: number) => {
    const updatedEducation = [...(userData.bio?.education || [])];
    updatedEducation.splice(index, 1);
    updateUserData({
      bio: {
        ...userData.bio,
        education: updatedEducation
      }
    });
  };

  // Work experience management
  const [newWork, setNewWork] = React.useState<Partial<WorkExperience>>({
    position: '',
    company: '',
    start_year: '',
    end_year: '',
    is_current: false,
    description: ''
  });
  
  const addWorkExperience = () => {
    if (!newWork.position || !newWork.company || !newWork.start_year) return;
    
    const updatedWork = [...(userData.bio?.work_history || []), newWork as WorkExperience];
    updateUserData({
      bio: {
        ...userData.bio,
        work_history: updatedWork
      }
    });
    setNewWork({
      position: '',
      company: '',
      start_year: '',
      end_year: '',
      is_current: false,
      description: ''
    });
  };
  
  const removeWorkExperience = (index: number) => {
    const updatedWork = [...(userData.bio?.work_history || [])];
    updatedWork.splice(index, 1);
    updateUserData({
      bio: {
        ...userData.bio,
        work_history: updatedWork
      }
    });
  };

  // Portfolio management
  const [newPortfolio, setNewPortfolio] = React.useState<Partial<Portfolio>>({
    title: '',
    description: '',
    url: '',
  });
  
  const addPortfolio = () => {
    if (!newPortfolio.title || !newPortfolio.description || !newPortfolio.url) return;
    
    const updatedPortfolio = [...(userData.bio?.portfolio || []), newPortfolio as Portfolio];
    updateUserData({
      bio: {
        ...userData.bio,
        portfolio: updatedPortfolio
      }
    });
    setNewPortfolio({
      title: '',
      description: '',
      url: ''
    });
  };
  
  const removePortfolio = (index: number) => {
    const updatedPortfolio = [...(userData.bio?.portfolio || [])];
    updatedPortfolio.splice(index, 1);
    updateUserData({
      bio: {
        ...userData.bio,
        portfolio: updatedPortfolio
      }
    });
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

      {/* Basic Information */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">👔</span> {t('basic_info.title')}
        </h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('basic_info.professional_title')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={professionalInfo?.title || ''}
              onChange={(e) => updateUserData({
                bio: {
                  ...userData.bio,
                  professional_info: {
                    ...professionalInfo,
                    title: e.target.value
                  }
                }
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.title ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
              placeholder={t('basic_info.title_placeholder')}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-rose-600">{errors.title}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('basic_info.years_experience')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={professionalInfo?.years_experience || 0}
              onChange={(e) => updateUserData({
                bio: {
                  ...userData.bio,
                  professional_info: {
                    ...professionalInfo,
                    years_experience: parseInt(e.target.value)
                  }
                }
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.years_experience ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
            />
            {errors.years_experience && (
              <p className="mt-1 text-sm text-rose-600">{errors.years_experience}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Skills Section */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">🛠️</span> {t('skills.title')}
        </h3>
        
        <div className="mb-4">
          {professionalInfo?.skills?.length ? (
            <div className="space-y-2">
              {professionalInfo.skills.map((skill, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-3 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <div>
                    <span className="font-medium text-rose-800">{skill.name}</span>
                    <span className="ml-2 text-sm text-rose-600">{skill.experience}</span>
                  </div>
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-rose-400 hover:text-rose-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-rose-400">{t('skills.empty')}</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-rose-700 mb-1">{t('skills.name')}</label>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
              placeholder={t('skills.name_placeholder')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">{t('skills.experience')}</label>
            <select
              value={newSkill.experience}
              onChange={(e) => setNewSkill({ ...newSkill, experience: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
            >
              <option value="">{t('skills.select_level')}</option>
              <option value="Beginner">{t('skills.beginner')}</option>
              <option value="Intermediate">{t('skills.intermediate')}</option>
              <option value="Advanced">{t('skills.advanced')}</option>
              <option value="Expert">{t('skills.expert')}</option>
            </select>
          </div>
        </div>
        
        <motion.button
          onClick={addSkill}
          disabled={!newSkill.name || !newSkill.experience}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full py-2 px-4 bg-rose-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-rose-700 transition-colors"
        >
          {t('skills.add_button')}
        </motion.button>
      </motion.div>

      {/* Education Section */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">🎓</span> {t('education.title')}
        </h3>
        
        <div className="mb-4">
          {userData.bio?.education?.length ? (
            <div className="space-y-2">
              {userData.bio.education.map((edu, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-3 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <div>
                    <span className="font-medium text-rose-800">{edu.degree}</span>
                    <span className="ml-2 text-sm text-rose-600">{edu.institution}, {edu.year}</span>
                  </div>
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-rose-400 hover:text-rose-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-rose-400">{t('education.empty')}</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">{t('education.degree')}</label>
            <input
              type="text"
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
              placeholder={t('education.degree_placeholder')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">{t('education.institution')}</label>
            <input
              type="text"
              value={newEducation.institution}
              onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
              placeholder={t('education.institution_placeholder')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">{t('education.year')}</label>
            <input
              type="number"
              value={newEducation.year}
              onChange={(e) => setNewEducation({ ...newEducation, year: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
              placeholder={t('education.year_placeholder')}
            />
          </div>
        </div>
        
        <motion.button
          onClick={addEducation}
          disabled={!newEducation.degree || !newEducation.institution}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full py-2 px-4 bg-rose-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-rose-700 transition-colors"
        >
          {t('education.add_button')}
        </motion.button>
      </motion.div>

      {/* Work Experience Section */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">💼</span> {t('work_experience.title')}
        </h3>
        
        <div className="mb-4">
          {userData.bio?.work_history?.length ? (
            <div className="space-y-2">
              {userData.bio.work_history.map((work, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-3 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <div>
                    <span className="font-medium text-rose-800">{work.position}</span>
                    <span className="ml-2 text-sm text-rose-600">
                      {work.company}, {work.start_year} - {work.is_current ? t('work_experience.present') : work.end_year}
                    </span>
                  </div>
                  <button
                    onClick={() => removeWorkExperience(index)}
                    className="text-rose-400 hover:text-rose-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-rose-400">{t('work_experience.empty')}</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">{t('work_experience.position')}</label>
            <input
              type="text"
              value={newWork.position}
              onChange={(e) => setNewWork({ ...newWork, position: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
              placeholder={t('work_experience.position_placeholder')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">{t('work_experience.company')}</label>
            <input
              type="text"
              value={newWork.company}
              onChange={(e) => setNewWork({ ...newWork, company: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
              placeholder={t('work_experience.company_placeholder')}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 mt-3">
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">{t('work_experience.start_year')}</label>
            <input
              type="text"
              value={newWork.start_year}
              onChange={(e) => setNewWork({ ...newWork, start_year: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
              placeholder={t('work_experience.year_placeholder')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">{t('work_experience.end_year')}</label>
            <input
              type="text"
              value={newWork.end_year ?? ''}
              onChange={(e) => setNewWork({ ...newWork, end_year: e.target.value })}
              disabled={newWork.is_current}
              className={`w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all ${
                newWork.is_current ? 'bg-rose-50' : ''
              }`}
              placeholder={t('work_experience.year_placeholder')}
            />
          </div>
          
          <div className="flex items-center mt-6">
            <input
              id="is_current"
              type="checkbox"
              checked={newWork.is_current}
              onChange={(e) => setNewWork({ 
                ...newWork, 
                is_current: e.target.checked, 
                end_year: e.target.checked ? '' : newWork.end_year 
              })}
              className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-rose-300 rounded transition-all"
            />
            <label htmlFor="is_current" className="ml-2 block text-sm text-rose-700">
              {t('work_experience.current_position')}
            </label>
          </div>
        </div>
        
        <div className="mt-3">
          <label className="block text-sm font-medium text-rose-700 mb-1">{t('work_experience.description')}</label>
          <textarea
            rows={3}
            value={newWork.description}
            onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
            placeholder={t('work_experience.description_placeholder')}
          />
        </div>
        
        <motion.button
          onClick={addWorkExperience}
          disabled={!newWork.position || !newWork.company || !newWork.start_year}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full py-2 px-4 bg-rose-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-rose-700 transition-colors"
        >
          {t('work_experience.add_button')}
        </motion.button>
      </motion.div>

      {/* Portfolio Section */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">📁</span> {t('portfolio.title')}
        </h3>
        
        <div className="mb-4">
          {userData.bio?.portfolio?.length ? (
            <div className="space-y-2">
              {userData.bio.portfolio.map((portfolio, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-3 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <div>
                    <span className="font-medium text-rose-800">{portfolio.title}</span>
                    <span className="ml-2 text-sm text-rose-600">
                      {portfolio.url}
                    </span>
                  </div>
                  <button
                    onClick={() => removePortfolio(index)}
                    className="text-rose-400 hover:text-rose-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-rose-400">{t('portfolio.empty')}</p>
            </div>
          )}
        </div>
        
        <div className="mt-3">
          <label className="block text-sm font-medium text-rose-700 mb-1">{t('portfolio.title_label')}</label>
          <input
            type="text"
            value={newPortfolio.title}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
            placeholder={t('portfolio.title_placeholder')}
          />
        </div>
        
        <div className="mt-3">
          <label className="block text-sm font-medium text-rose-700 mb-1">{t('portfolio.url')}</label>
          <input
            type="text"
            value={newPortfolio.url}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, url: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
            placeholder={t('portfolio.url_placeholder')}
          />
        </div>
        
        <div className="mt-3">
          <label className="block text-sm font-medium text-rose-700 mb-1">{t('portfolio.description')}</label>
          <textarea
            rows={3}
            value={newPortfolio.description}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
            placeholder={t('portfolio.description_placeholder')}
          />
        </div>
        
        <motion.button
          onClick={addPortfolio}
          disabled={!newPortfolio.title || !newPortfolio.url || !newPortfolio.description}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full py-2 px-4 bg-rose-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-rose-700 transition-colors"
        >
          {t('portfolio.add_button')}
        </motion.button>
      </motion.div>

      {/* Professional Summary */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">📝</span> {t('summary.title')}
        </h3>
        
        <textarea
          rows={4}
          value={userData.bio?.summary || ''}
          onChange={(e) => updateUserData({
            bio: {
              ...userData.bio,
              summary: e.target.value
            }
          })}
          className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
          placeholder={t('summary.placeholder')}
        />
      </motion.div>
    </motion.div>
  );
};

export default ProfessionalFormStep;