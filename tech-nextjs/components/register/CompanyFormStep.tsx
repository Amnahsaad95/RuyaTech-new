'use client'

import React from 'react';
import { User, CompanyInfo, OpenPosition } from '@/types/user';
import { getBioTemplate } from '@/utils/formUtils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const CompanyFormStep: React.FC<{
  userData: User;
  updateUserData: (data: Partial<User>) => void;
  errors: Record<string, string>;
}> = ({ userData, updateUserData, errors }) => {
  const t = useTranslations('auth.company');
  
  // Initialize bio if it doesn't exist
  React.useEffect(() => {
    if (!userData.bio && userData.role === 'company') {
      updateUserData({ bio: getBioTemplate('company') });
    }
  }, [userData.bio, userData.role, updateUserData]);

  const companyInfo = userData.bio?.company_info as CompanyInfo;
  
  // Industry management
  const [newIndustry, setNewIndustry] = React.useState('');
  
  const addIndustry = () => {
    if (!newIndustry) return;
    
    const updatedIndustries = [...(companyInfo?.industry || []), newIndustry];
    updateUserData({
      bio: {
        ...userData.bio,
        company_info: {
          ...companyInfo,
          industry: updatedIndustries
        }
      }
    });
    setNewIndustry('');
  };
  
  const removeIndustry = (index: number) => {
    const updatedIndustries = [...companyInfo.industry];
    updatedIndustries.splice(index, 1);
    updateUserData({
      bio: {
        ...userData.bio,
        company_info: {
          ...companyInfo,
          industry: updatedIndustries
        }
      }
    });
  };

  // Services management
  const [newService, setNewService] = React.useState('');
  
  const addService = () => {
    if (!newService) return;
    
    const updatedServices = [...(userData.bio?.services || []), newService];
    updateUserData({
      bio: {
        ...userData.bio,
        services: updatedServices
      }
    });
    setNewService('');
  };
  
  const removeService = (index: number) => {
    const updatedServices = [...(userData.bio?.services || [])];
    updatedServices.splice(index, 1);
    updateUserData({
      bio: {
        ...userData.bio,
        services: updatedServices
      }
    });
  };

  // Open positions management
  const [newPosition, setNewPosition] = React.useState<Partial<OpenPosition>>({
    title: '',
    department: '',
    location: ''
  });
  
  const addPosition = () => {
    if (!newPosition.title || !newPosition.department || !newPosition.location) return;
    
    const updatedPositions = [...(userData.bio?.hiring_needs?.open_positions || []), newPosition as OpenPosition];
    updateUserData({
      bio: {
        ...userData.bio,
        hiring_needs: {
          ...userData.bio?.hiring_needs,
          open_positions: updatedPositions
        }
      }
    });
    setNewPosition({
      title: '',
      department: '',
      location: ''
    });
  };
  
  const removePosition = (index: number) => {
    const updatedPositions = [...(userData.bio?.hiring_needs?.open_positions || [])];
    updatedPositions.splice(index, 1);
    updateUserData({
      bio: {
        ...userData.bio,
        hiring_needs: {
          ...userData.bio?.hiring_needs,
          open_positions: updatedPositions
        }
      }
    });
  };

  // Hiring process management
  const [newProcess, setNewProcess] = React.useState('');
  
  const addProcess = () => {
    if (!newProcess) return;
    
    const updatedProcess = [...(userData.bio?.hiring_needs?.hiring_process || []), newProcess];
    updateUserData({
      bio: {
        ...userData.bio,
        hiring_needs: {
          ...userData.bio?.hiring_needs,
          hiring_process: updatedProcess
        }
      }
    });
    setNewProcess('');
  };
  
  const removeProcess = (index: number) => {
    const updatedProcess = [...(userData.bio?.hiring_needs?.hiring_process || [])];
    updatedProcess.splice(index, 1);
    updateUserData({
      bio: {
        ...userData.bio,
        hiring_needs: {
          ...userData.bio?.hiring_needs,
          hiring_process: updatedProcess
        }
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

      {/* Company Details */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">🏢</span> {t('details.title')}
        </h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('details.legal_name')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={companyInfo?.legal_name || ''}
              onChange={(e) => updateUserData({
                bio: {
                  ...userData.bio,
                  company_info: {
                    ...companyInfo,
                    legal_name: e.target.value
                  }
                }
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.legal_name ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
              placeholder={t('details.legal_name_placeholder')}
            />
            {errors.legal_name && <p className="mt-1 text-sm text-rose-600">{errors.legal_name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('details.founded_year')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={companyInfo?.founded_year || new Date().getFullYear()}
              onChange={(e) => updateUserData({
                bio: {
                  ...userData.bio,
                  company_info: {
                    ...companyInfo,
                    founded_year: parseInt(e.target.value)
                  }
                }
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.founded_year ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
            />
            {errors.founded_year && <p className="mt-1 text-sm text-rose-600">{errors.founded_year}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('details.company_size')} <span className="text-rose-500">*</span>
            </label>
            <select
              value={companyInfo?.company_size || ''}
              onChange={(e) => updateUserData({
                bio: {
                  ...userData.bio,
                  company_info: {
                    ...companyInfo,
                    company_size: e.target.value
                  }
                }
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.company_size ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
            >
              <option value="">{t('details.select_size')}</option>
              <option value="1-10">{t('details.size_1_10')}</option>
              <option value="11-50">{t('details.size_11_50')}</option>
              <option value="51-200">{t('details.size_51_200')}</option>
              <option value="201-500">{t('details.size_201_500')}</option>
              <option value="501-1000">{t('details.size_501_1000')}</option>
              <option value="1001+">{t('details.size_1001_plus')}</option>
            </select>
            {errors.company_size && <p className="mt-1 text-sm text-rose-600">{errors.company_size}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('details.website')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              value={companyInfo?.website || ''}
              onChange={(e) => updateUserData({
                bio: {
                  ...userData.bio,
                  company_info: {
                    ...companyInfo,
                    website: e.target.value
                  }
                }
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.website ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
              placeholder={t('details.website_placeholder')}
            />
            {errors.website && <p className="mt-1 text-sm text-rose-600">{errors.website}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-rose-700 mb-1">
              {t('details.headquarters')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={companyInfo?.headquarters || ''}
              onChange={(e) => updateUserData({
                bio: {
                  ...userData.bio,
                  company_info: {
                    ...companyInfo,
                    headquarters: e.target.value
                  }
                }
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.headquarters ? 'border-rose-300' : 'border-rose-200'
              } focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all`}
              placeholder={t('details.headquarters_placeholder')}
            />
            {errors.headquarters && <p className="mt-1 text-sm text-rose-600">{errors.headquarters}</p>}
          </div>
        </div>
      </motion.div>

      {/* Industry Section */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">🏭</span> {t('industry.title')}
        </h3>
        
        <div className="mb-4">
          {companyInfo?.industry?.length ? (
            <div className="flex flex-wrap gap-2">
              {companyInfo.industry.map((industry, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center bg-rose-100 text-rose-800 rounded-full px-3 py-1 text-sm"
                >
                  {industry}
                  <button
                    onClick={() => removeIndustry(index)}
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
              <p className="text-rose-400">{t('industry.empty')}</p>
            </div>
          )}
        </div>
        
        <div className="flex">
          <input
            type="text"
            value={newIndustry}
            onChange={(e) => setNewIndustry(e.target.value)}
            className="flex-1 px-4 py-2 rounded-l-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
            placeholder={t('industry.placeholder')}
          />
          <motion.button
            onClick={addIndustry}
            disabled={!newIndustry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-rose-600 text-white rounded-r-lg font-medium disabled:opacity-50 hover:bg-rose-700 transition-colors"
          >
            {t('industry.add_button')}
          </motion.button>
        </div>
      </motion.div>

      {/* Services Section */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">🛠️</span> {t('services.title')}
        </h3>
        
        <div className="mb-4">
          {userData.bio?.services?.length ? (
            <div className="flex flex-wrap gap-2">
              {userData.bio.services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center bg-rose-100 text-rose-800 rounded-full px-3 py-1 text-sm"
                >
                  {service}
                  <button
                    onClick={() => removeService(index)}
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
              <p className="text-rose-400">{t('services.empty')}</p>
            </div>
          )}
        </div>
        
        <div className="flex">
          <input
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            className="flex-1 px-4 py-2 rounded-l-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
            placeholder={t('services.placeholder')}
          />
          <motion.button
            onClick={addService}
            disabled={!newService}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-rose-600 text-white rounded-r-lg font-medium disabled:opacity-50 hover:bg-rose-700 transition-colors"
          >
            {t('services.add_button')}
          </motion.button>
        </div>
      </motion.div>

      {/* Hiring Needs */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border border-rose-100"
        whileHover={{ y: -2 }}
      >
        <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center">
          <span className="mr-2">💼</span> {t('hiring_needs.title')}
        </h3>
        
        {/* Open Positions */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-rose-800 mb-3">{t('hiring_needs.open_positions.title')}</h4>
          
          <div className="mb-4">
            {userData.bio?.hiring_needs?.open_positions?.length ? (
              <div className="space-y-2">
                {userData.bio.hiring_needs.open_positions.map((position, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-3 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-rose-800">{position.title}</span>
                      <span className="ml-2 text-sm text-rose-600">{position.department}, {position.location}</span>
                    </div>
                    <button
                      onClick={() => removePosition(index)}
                      className="text-rose-500 hover:text-rose-700 transition-colors"
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
                <p className="text-rose-400">{t('hiring_needs.open_positions.empty')}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">{t('hiring_needs.open_positions.title_label')}</label>
              <input
                type="text"
                value={newPosition.title}
                onChange={(e) => setNewPosition({ ...newPosition, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
                placeholder={t('hiring_needs.open_positions.title_placeholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">{t('hiring_needs.open_positions.department')}</label>
              <input
                type="text"
                value={newPosition.department}
                onChange={(e) => setNewPosition({ ...newPosition, department: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
                placeholder={t('hiring_needs.open_positions.department_placeholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">{t('hiring_needs.open_positions.location')}</label>
              <input
                type="text"
                value={newPosition.location}
                onChange={(e) => setNewPosition({ ...newPosition, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
                placeholder={t('hiring_needs.open_positions.location_placeholder')}
              />
            </div>
          </div>
          
          <motion.button
            onClick={addPosition}
            disabled={!newPosition.title || !newPosition.department || !newPosition.location}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full py-2 px-4 bg-rose-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-rose-700 transition-colors"
          >
            {t('hiring_needs.open_positions.add_button')}
          </motion.button>
        </div>
        
        {/* Hiring Process */}
        <div>
          <h4 className="text-md font-medium text-rose-800 mb-3">{t('hiring_needs.hiring_process.title')}</h4>
          
          <div className="mb-4">
            {userData.bio?.hiring_needs?.hiring_process?.length ? (
              <div className="flex flex-wrap gap-2">
                {userData.bio.hiring_needs.hiring_process.map((process, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center bg-rose-100 text-rose-800 rounded-full px-3 py-1 text-sm"
                  >
                    {process}
                    <button
                      onClick={() => removeProcess(index)}
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
                <p className="text-rose-400">{t('hiring_needs.hiring_process.empty')}</p>
              </div>
            )}
          </div>
          
          <div className="flex">
            <input
              type="text"
              value={newProcess}
              onChange={(e) => setNewProcess(e.target.value)}
              className="flex-1 px-4 py-2 rounded-l-lg border border-rose-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all"
              placeholder={t('hiring_needs.hiring_process.placeholder')}
            />
            <motion.button
              onClick={addProcess}
              disabled={!newProcess}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-rose-600 text-white rounded-r-lg font-medium disabled:opacity-50 hover:bg-rose-700 transition-colors"
            >
              {t('hiring_needs.hiring_process.add_button')}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Company Summary */}
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

export default CompanyFormStep;