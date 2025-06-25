'use client'

import React from 'react';
import { User, UserRole } from '@/types/user';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface RoleSelectionStepProps {
  userData: User;
  updateUserData: (data: Partial<User>) => void;
  errors: Record<string, string>;
}

const RoleSelectionStep: React.FC<RoleSelectionStepProps> = ({ userData, updateUserData, errors }) => {
  const t = useTranslations('auth');
  
  const roles: { id: UserRole; title: string; description: string; icon: string }[] = [
    {
      id: 'professional',
      title: t('roles.professional.title'),
      description: t('roles.professional.description'),
      icon: '💼'
    },
    {
      id: 'student',
      title: t('roles.student.title'),
      description: t('roles.student.description'),
      icon: '🎓'
    },
    {
      id: 'company',
      title: t('roles.company.title'),
      description: t('roles.company.description'),
      icon: '🏢'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 px-4"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-rose-800 mb-2">
          {t('role_selection.title')}
        </h2>
        <p className="text-rose-600">
          {t('role_selection.subtitle')}
        </p>
      </motion.div>
      
      {/* Role cards */}
      <motion.div 
        className="grid gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {roles.map((role) => {
          const isSelected = userData.role === role.id;
          
          return (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => updateUserData({ role: role.id })}
              className={`relative rounded-lg p-5 cursor-pointer transition-all duration-300 overflow-hidden border ${
                isSelected 
                  ? 'border-rose-500 bg-rose-50 shadow-md'
                  : 'border-rose-200 hover:border-rose-300 bg-white'
              }`}
            >
              {/* Selected indicator */}
              {isSelected && (
                <motion.div 
                  className="absolute top-0 right-0 bg-rose-600 text-white px-2 py-1 text-xs font-medium rounded-bl-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {t('role_selection.selected')}
                </motion.div>
              )}
              
              <div className="flex items-start">
                {/* Animated icon */}
                <motion.div
                  className={`text-3xl p-3 rounded-full mr-4 ${
                    isSelected 
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-rose-50 text-rose-500'
                  }`}
                  animate={{
                    rotate: isSelected ? [0, 10, -10, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {role.icon}
                </motion.div>
                
                <div className="flex-1">
                  <div className="flex items-center">
                    <input
                      id={`role-${role.id}`}
                      name="role"
                      type="radio"
                      checked={isSelected}
                      onChange={() => {}}
                      className="hidden"
                    />
                    <motion.label 
                      htmlFor={`role-${role.id}`}
                      className={`block text-lg font-bold ${
                        isSelected ? 'text-rose-700' : 'text-rose-800'
                      }`}
                      animate={{
                        x: isSelected ? [0, 5, 0] : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {role.title}
                    </motion.label>
                  </div>
                  <motion.p 
                    className={`mt-1 text-sm ${
                      isSelected ? 'text-rose-700' : 'text-rose-600'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {role.description}
                  </motion.p>
                </div>
              </div>
              
              {/* Glow effect for selected card */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    boxShadow: '0 0 15px 3px rgba(225, 29, 72, 0.15)'
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Error message with animation */}
      <AnimatePresence>
        {errors.role && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 p-3 bg-rose-50 border-l-4 border-rose-500 rounded-r-lg"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-rose-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-rose-800">{errors.role}</h3>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RoleSelectionStep;