'use client'

import React, { useEffect, useState } from 'react';
import { FORM_STEPS, TOTAL_STEPS } from '@/utils/formUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUser,  faBullseye,  faPen,  faPlus,  faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


interface FormProgressProps {
  currentStep: number;
  isStepValid: boolean[];
}

const FormProgress: React.FC<FormProgressProps> = ({ currentStep, isStepValid }) => {
  const [pulseIndex, setPulseIndex] = useState(-1);
  const t = useTranslations('auth');
  const locale=useLocale();
  
  const steps = [
    { name: t('steps.basic_info'), step: FORM_STEPS.BASIC_INFO, icon: faUser },
    { name: t('steps.role_selection'), step: FORM_STEPS.ROLE_SELECTION, icon: faBullseye },
    { name: t('steps.role_details'), step: FORM_STEPS.ROLE_SPECIFIC_INFO, icon: faPen },
    { name: t('steps.additional_info'), step: FORM_STEPS.ADDITIONAL_INFO, icon: faPlus },
    { name: t('steps.review'), step: FORM_STEPS.REVIEW, icon: faMagnifyingGlass }
  ];
  // Pulse animation for current step
  useEffect(() => {
    setPulseIndex(currentStep - 1);
    const timer = setTimeout(() => setPulseIndex(-1), 1500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="w-full py-6 px-4 rounded-lg">
      {/* Step indicators */}
      <div className="flex justify-between relative mb-4">
        {steps.map((step, index) => (
          <div key={step.step} className="flex flex-col items-center relative z-10">
            <motion.div
              className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${isStepValid[index] ? 'border-rose-500 bg-rose-100' : currentStep > step.step ? 'border-rose-300' : currentStep === step.step ? 'border-rose-600 bg-white' : 'border-gray-300 bg-white'} ${pulseIndex === index ? 'ring-4 ring-rose-200' : ''} transition-all duration-300`}
              whileHover={{ scale: 1.1 }}
            >
              <span className={`text-lg ${currentStep === step.step ? 'text-rose-700' : isStepValid[index] ? 'text-rose-600' : 'text-gray-500'}`}>
                <FontAwesomeIcon icon={step.icon} className="text-rose-600" />
              </span>
            </motion.div>
            <span className={`mt-2 text-xs font-medium text-center ${currentStep === step.step ? 'text-rose-800 font-bold' : isStepValid[index] ? 'text-rose-700' : 'text-gray-500'}`}>
              {step.name}
            </span>
          </div>
        ))}
        {/* Progress line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 z-0">
          <motion.div
            className={`absolute top-0  h-full bg-rose-500 ${(locale == 'ar') ? 'right-0' : 'left-0'}`}
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}%`,
              transition: { duration: 0.8, ease: "easeOut" }
            }}
          />
        </div>
      </div>

      {/* Step counter with animation */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-rose-200">
          <motion.span 
            key={currentStep}
            className="text-lg font-bold bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent"
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            {currentStep}
          </motion.span>
          <span className="mx-2 text-rose-300">/</span>
          <span className="text-rose-500">{TOTAL_STEPS}</span>
          <span className="ml-2 text-sm text-rose-600">{t('steps_completed')}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default FormProgress;