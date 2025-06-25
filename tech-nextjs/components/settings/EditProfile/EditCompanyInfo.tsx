import React from 'react';
import { useTranslation } from 'next-i18next';
import { User } from '@/types/user';

interface EditCompanyInfoProps {
  user: User;
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const EditCompanyInfo: React.FC<EditCompanyInfoProps> = ({ 
  user, 
  onChange,
  errors
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const [industries, setIndustries] = React.useState<string[]>(
    user.bio?.company_info?.industry || []
  );
  const [newIndustry, setNewIndustry] = React.useState('');
  
  // Update parent component when industries change
  React.useEffect(() => {
    if (user.bio && user.role === 'company') {
      const newBio = { 
        ...user.bio, 
        company_info: {
          ...user.bio.company_info,
          industry: industries
        }
      };
      onChange('bio', JSON.stringify(newBio));
    }
  }, [industries]);
  
  const handleAddIndustry = () => {
    if (newIndustry.trim()) {
      setIndustries([...industries, newIndustry.trim()]);
      setNewIndustry('');
    }
  };
  
  const handleRemoveIndustry = (index: number) => {
    const newIndustries = [...industries];
    newIndustries.splice(index, 1);
    setIndustries(newIndustries);
  };
  
  const handleCompanyInfoChange = (field: string, value: any) => {
    if (user.bio && user.role === 'company') {
      const newBio = { 
        ...user.bio, 
        company_info: {
          ...user.bio.company_info,
          [field]: value
        }
      };
      onChange('bio', JSON.stringify(newBio));
    }
  };
  
  if (user.role !== 'company') {
    return null;
  }
  
  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-lg font-medium text-gray-900">
        {t('profile:sections.companyInfo')}
      </h3>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.companyName')}
          </label>
          <input
            type="text"
            id="companyName"
            value={user.bio?.company_info?.legal_name || ''}
            onChange={(e) => handleCompanyInfoChange('legal_name', e.target.value)}
            placeholder={t('profile:placeholders.companyName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.foundedYear')}
          </label>
          <input
            type="number"
            id="foundedYear"
            min="1900"
            max={new Date().getFullYear()}
            value={user.bio?.company_info?.founded_year || ''}
            onChange={(e) => handleCompanyInfoChange('founded_year', parseInt(e.target.value) || '')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.companySize')}
          </label>
          <select
            id="companySize"
            value={user.bio?.company_info?.company_size || ''}
            onChange={(e) => handleCompanyInfoChange('company_size', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select company size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1001+">1001+ employees</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.website')}
          </label>
          <input
            type="url"
            id="website"
            value={user.bio?.company_info?.website || ''}
            onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
            placeholder={t('profile:placeholders.website')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="headquarters" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.headquarters')}
          </label>
          <input
            type="text"
            id="headquarters"
            value={user.bio?.company_info?.headquarters || ''}
            onChange={(e) => handleCompanyInfoChange('headquarters', e.target.value)}
            placeholder={t('profile:placeholders.headquarters')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      {/* Industry section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('profile:fields.industry')}
        </label>
        
        <div className="mb-4">
          {industries.map((industry, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md mb-2">
              <div>
                <span className="font-medium">{industry}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveIndustry(index)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <label htmlFor="newIndustry" className="block text-sm font-medium text-gray-700">
              {t('common:add')} {t('profile:fields.industry')}
            </label>
            <input
              type="text"
              id="newIndustry"
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <button
            type="button"
            onClick={handleAddIndustry}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('common:add')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyInfo;
