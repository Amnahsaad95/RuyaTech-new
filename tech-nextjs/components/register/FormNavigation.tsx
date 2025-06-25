'use client'

import React from 'react';
import { User, UserRole } from '@/types/user';
import { useTranslations } from 'next-intl';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isNextDisabled: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isNextDisabled
}) => {
  const t = useTranslations('auth');

  return (
    <div className="flex justify-between mt-8 pt-5 border-t border-rose-200">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200
          ${currentStep === 1 
            ? 'text-rose-300 bg-rose-50 cursor-not-allowed' 
            : 'text-rose-700 bg-white border border-rose-300 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500'}`}
      >
        {t('previous')}
      </button>
      
      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
        className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200
          ${isNextDisabled 
            ? 'bg-rose-300 text-white cursor-not-allowed' 
            : 'bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500'}`}
      >
        {currentStep === totalSteps ? t('submit') : t('next')}
      </button>
    </div>
  );
};

export default FormNavigation;