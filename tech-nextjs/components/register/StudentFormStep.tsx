'use client'

import React from 'react';
import { User, AcademicInfo, Course } from '@/types/user';
import { getBioTemplate } from '@/utils/formUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

const StudentFormStep: React.FC<{
  userData: User;
  updateUserData: (data: Partial<User>) => void;
  errors: Record<string, string>;
}> = ({ userData, updateUserData, errors }) => {
  const t = useTranslations('auth.student');
  
  // Initialize bio if it doesn't exist
  React.useEffect(() => {
    if (!userData.bio && userData.role === 'student') {
      updateUserData({ bio: getBioTemplate('student') });
    }
  }, [userData.bio, userData.role, updateUserData]);

  const academicInfo = userData.bio?.academic_info as AcademicInfo;
  
  // Course management
  const [newCourse, setNewCourse] = React.useState<Partial<Course>>({
    code: '',
    name: '',
    semester: '',
    grade: '',
    year: ''
  });
  
  const addCourse = () => {
    if (!newCourse.name || !newCourse.year) return;
    
    const updatedCourses = [...(userData.bio?.courses || []), newCourse as Course];
    updateUserData({
      bio: {
        ...userData.bio,
        courses: updatedCourses
      }
    });
    setNewCourse({
      code: '',
      name: '',
      semester: '',
      grade: '',
      year: ''
    });
  };
  
  const removeCourse = (index: number) => {
    const updatedCourses = [...(userData.bio?.courses || [])];
    updatedCourses.splice(index, 1);
    updateUserData({
      bio: {
        ...userData.bio,
        courses: updatedCourses
      }
    });
  };

  // Skills management
  const [newSkill, setNewSkill] = React.useState('');
  
  const addSkill = () => {
    if (!newSkill) return;
    
    const updatedSkills = [...(userData.bio?.skills_learning || []), newSkill];
    updateUserData({
      bio: {
        ...userData.bio,
        skills_learning: updatedSkills
      }
    });
    setNewSkill('');
  };
  
  const removeSkill = (index: number) => {
    const updatedSkills = [...(userData.bio?.skills_learning || [])];
    updatedSkills.splice(index, 1);
    updateUserData({
      bio: {
        ...userData.bio,
        skills_learning: updatedSkills
      }
    });
  };

  // Interests management
  const [newInterest, setNewInterest] = React.useState('');
  
  const addInterest = () => {
    if (!newInterest) return;
    
    const updatedInterests = [...(userData.bio?.interests || []), newInterest];
    updateUserData({
      bio: {
        ...userData.bio,
        interests: updatedInterests
      }
    });
    setNewInterest('');
  };
  
  const removeInterest = (index: number) => {
    const updatedInterests = [...(userData.bio?.interests || [])];
    updatedInterests.splice(index, 1);
    updateUserData({
      bio: {
        ...userData.bio,
        interests: updatedInterests
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

      {/* Academic Information */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">🎓</span> {t('academic_info.title')}
        </h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('academic_info.institution')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={academicInfo?.institution || ''}
              onChange={(e) => updateUserData({
                bio: {
                  ...userData.bio,
                  academic_info: {
                    ...academicInfo,
                    institution: e.target.value
                  }
                }
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.institution ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
              placeholder={t('academic_info.institution_placeholder')}
            />
            {errors.institution && (
              <p className="mt-1 text-sm text-rose-600">{errors.institution}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('academic_info.program')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={academicInfo?.program || ''}
              onChange={(e) => updateUserData({
                bio: {
                  ...userData.bio,
                  academic_info: {
                    ...academicInfo,
                    program: e.target.value
                  }
                }
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.program ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
              placeholder={t('academic_info.program_placeholder')}
            />
            {errors.program && (
              <p className="mt-1 text-sm text-rose-600">{errors.program}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('academic_info.degree_level')} <span className="text-rose-500">*</span>
            </label>
            <select
              value={academicInfo?.degree_level || ''}
              onChange={(e) => updateUserData({
                bio: {
                  ...userData.bio,
                  academic_info: {
                    ...academicInfo,
                    degree_level: e.target.value
                  }
                }
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.degree_level ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
            >
              <option value="">{t('academic_info.select_degree')}</option>
              <option value="Associate's">{t('academic_info.associate')}</option>
              <option value="Bachelor's">{t('academic_info.bachelor')}</option>
              <option value="Master's">{t('academic_info.master')}</option>
              <option value="Doctoral">{t('academic_info.doctoral')}</option>
              <option value="Certificate">{t('academic_info.certificate')}</option>
            </select>
            {errors.degree_level && (
              <p className="mt-1 text-sm text-rose-600">{errors.degree_level}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('academic_info.year')} <span className="text-rose-500">*</span>
            </label>
            <select
              value={academicInfo?.year || ''}
              onChange={(e) => updateUserData({
                bio: {
                  ...userData.bio,
                  academic_info: {
                    ...academicInfo,
                    year: e.target.value
                  }
                }
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.year ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
            >
              <option value="">{t('academic_info.select_year')}</option>
              <option value="freshman">{t('academic_info.freshman')}</option>
              <option value="sophomore">{t('academic_info.sophomore')}</option>
              <option value="junior">{t('academic_info.junior')}</option>
              <option value="senior">{t('academic_info.senior')}</option>
              <option value="graduate">{t('academic_info.graduate')}</option>
            </select>
            {errors.year && (
              <p className="mt-1 text-sm text-rose-600">{errors.year}</p>
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
          {userData.bio?.skills_learning?.length ? (
            <div className="flex flex-wrap gap-2">
              {userData.bio.skills_learning.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center bg-rose-100 text-rose-800 rounded-full px-3 py-1 text-sm"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    className="ml-1.5 text-rose-600 hover:text-rose-800 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
        
        <div className="flex">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1 px-4 py-2 rounded-l-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
            placeholder={t('skills.placeholder')}
          />
          <motion.button
            onClick={addSkill}
            disabled={!newSkill}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-rose-600 text-white rounded-r-lg font-medium disabled:opacity-50 hover:bg-rose-700 transition-colors"
          >
            {t('skills.add_button')}
          </motion.button>
        </div>
      </motion.div>

      {/* Interests Section */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">🌟</span> {t('interests.title')}
        </h3>
        
        <div className="mb-4">
          {userData.bio?.interests?.length ? (
            <div className="flex flex-wrap gap-2">
              {userData.bio.interests.map((interest, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center bg-rose-100 text-rose-800 rounded-full px-3 py-1 text-sm"
                >
                  {interest}
                  <button
                    onClick={() => removeInterest(index)}
                    className="ml-1.5 text-rose-600 hover:text-rose-800 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-rose-400">{t('interests.empty')}</p>
            </div>
          )}
        </div>
        
        <div className="flex">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            className="flex-1 px-4 py-2 rounded-l-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
            placeholder={t('interests.placeholder')}
          />
          <motion.button
            onClick={addInterest}
            disabled={!newInterest}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-rose-600 text-white rounded-r-lg font-medium disabled:opacity-50 hover:bg-rose-700 transition-colors"
          >
            {t('interests.add_button')}
          </motion.button>
        </div>
      </motion.div>

      

      {/* Summary */}
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

export default StudentFormStep;