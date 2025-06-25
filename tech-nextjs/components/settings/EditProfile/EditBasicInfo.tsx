import React from 'react';
import { useTranslation } from 'next-i18next';
import { User } from '@/types/user';

interface EditBasicInfoProps {
  user: User;
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const EditBasicInfo: React.FC<EditBasicInfoProps> = ({ 
  user, 
  onChange,
  errors
}) => {
  const { t } = useTranslation(['profile', 'common']);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        {t('profile:sections.basicInfo')}
      </h3>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.name')}
          </label>
          <input
            type="text"
            id="name"
            value={user.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder={t('profile:placeholders.name')}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.name 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.email')}
          </label>
          <input
            type="email"
            id="email"
            value={user.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder={t('profile:placeholders.email')}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.email 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.phone')}
          </label>
          <input
            type="tel"
            id="phone"
            value={user.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder={t('profile:placeholders.phone')}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.phone 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="mainfield" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.mainField')}
          </label>
          <input
            type="text"
            id="mainfield"
            value={user.mainfield || ''}
            onChange={(e) => onChange('mainfield', e.target.value)}
            placeholder={t('profile:placeholders.mainField')}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.mainfield 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.mainfield && (
            <p className="mt-1 text-sm text-red-600">{errors.mainfield}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
          {t('profile:fields.summary')}
        </label>
        <textarea
          id="summary"
          rows={3}
          value={user.bio?.summary || ''}
          onChange={(e) => {
            const newBio = { ...user.bio, summary: e.target.value };
            onChange('bio', JSON.stringify(newBio));
          }}
          placeholder={t('profile:placeholders.summary')}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.summary 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {errors.summary && (
          <p className="mt-1 text-sm text-red-600">{errors.summary}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.city')}
          </label>
          <input
            type="text"
            id="city"
            value={user.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder={t('profile:placeholders.city')}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.city 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.country')}
          </label>
          <input
            type="text"
            id="country"
            value={user.country || ''}
            onChange={(e) => onChange('country', e.target.value)}
            placeholder={t('profile:placeholders.country')}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.country 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditBasicInfo;
