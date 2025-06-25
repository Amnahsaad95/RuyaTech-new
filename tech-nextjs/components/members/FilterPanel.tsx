'use client';

import React from 'react';
import { UserRole } from '@/types/user';
import { useFilter } from '@/services/context/FiltersContext';

interface FilterPanelProps {
  currentUserRole: UserRole | null;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ currentUserRole }) => {
  const { filters, setFilters, resetFilters } = useFilter();
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [availableSkills, setAvailableSkills] = React.useState<string[]>([
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'PHP', 'HTML/CSS',
    'UI/UX Design', 'Product Management', 'Marketing', 'Sales', 'Data Analysis',
    'Machine Learning', 'DevOps', 'Cloud Computing'
  ]);
  
  const [availableIndustries, setAvailableIndustries] = React.useState<string[]>([
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
    'Media', 'Entertainment', 'Consulting', 'Real Estate', 'Transportation'
  ]);
  
  const [availableCompanySizes, setAvailableCompanySizes] = React.useState<string[]>([
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1001+'
  ]);
  
  const [availableEducationLevels, setAvailableEducationLevels] = React.useState<string[]>([
    'High School', 'Associate\'s', 'Bachelor\'s', 'Master\'s', 'Doctoral', 'Certificate'
  ]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };
  
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ 
      ...prev, 
      role: e.target.value === 'all' ? 'all' : e.target.value as UserRole 
    }));
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, location: e.target.value }));
  };
  
  const handleMainFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, mainField: e.target.value }));
  };
  
  const handleJobSeekingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ 
      ...prev, 
      isJobSeeking: value === 'all' ? null : value === 'true' 
    }));
  };
  
  const handleExpertChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ 
      ...prev, 
      isExpert: value === 'all' ? null : value === 'true' 
    }));
  };
  
  const handleExperienceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setFilters(prev => ({ ...prev, experienceMin: value }));
  };
  
  const handleExperienceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setFilters(prev => ({ ...prev, experienceMax: value }));
  };
  
  const handleCompanySizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ 
      ...prev, 
      companySize: e.target.value === 'all' ? null : e.target.value 
    }));
  };
  
  const handleEducationLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ 
      ...prev, 
      educationLevel: e.target.value === 'all' ? null : e.target.value 
    }));
  };
  
  const handleInstitutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, institution: e.target.value || null }));
  };
  
  const handleOpenPositionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ 
      ...prev, 
      hasOpenPositions: value === 'all' ? null : value === 'true' 
    }));
  };
  
  const handleSkillToggle = (skill: string) => {
    setFilters(prev => {
      const skills = [...prev.skills];
      if (skills.includes(skill)) {
        return { ...prev, skills: skills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: [...skills, skill] };
      }
    });
  };
  
  const handleIndustryToggle = (industry: string) => {
    setFilters(prev => {
      const industries = [...prev.industry];
      if (industries.includes(industry)) {
        return { ...prev, industry: industries.filter(i => i !== industry) };
      } else {
        return { ...prev, industry: [...industries, industry] };
      }
    });
  };
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        <button 
          onClick={toggleExpanded}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-4">
          {/* Search Term - Common for all roles */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={filters.searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name, skills, etc."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          {/* Location - Common for all roles */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={filters.location}
              onChange={handleLocationChange}
              placeholder="City, Country"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          {/* Role Filter - For company users */}
          {currentUserRole === 'company' && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                User Type
              </label>
              <select
                id="role"
                value={filters.role}
                onChange={handleRoleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="professional">Professional</option>
                <option value="student">Student</option>
              </select>
            </div>
          )}
          
          {/* Main Field - For company users */}
          {currentUserRole === 'company' && (
            <div>
              <label htmlFor="mainField" className="block text-sm font-medium text-gray-700">
                Main Field
              </label>
              <input
                type="text"
                id="mainField"
                value={filters.mainField}
                onChange={handleMainFieldChange}
                placeholder="e.g. Software Development"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          )}
          
          {/* Job Seeking Status - For company users */}
          {currentUserRole === 'company' && (
            <div>
              <label htmlFor="jobSeeking" className="block text-sm font-medium text-gray-700">
                Job Seeking Status
              </label>
              <select
                id="jobSeeking"
                value={filters.isJobSeeking === null ? 'all' : filters.isJobSeeking.toString()}
                onChange={handleJobSeekingChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All</option>
                <option value="true">Actively Looking</option>
                <option value="false">Not Looking</option>
              </select>
            </div>
          )}
          
          {/* Expert Status - For company users */}
          {currentUserRole === 'company' && (
            <div>
              <label htmlFor="expert" className="block text-sm font-medium text-gray-700">
                Expert Status
              </label>
              <select
                id="expert"
                value={filters.isExpert === null ? 'all' : filters.isExpert.toString()}
                onChange={handleExpertChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All</option>
                <option value="true">Experts Only</option>
                <option value="false">Non-Experts Only</option>
              </select>
            </div>
          )}
          
          {/* Experience Range - For company users */}
          {currentUserRole === 'company' && filters.role !== 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <label htmlFor="expMin" className="block text-xs text-gray-500">
                    Min
                  </label>
                  <input
                    type="number"
                    id="expMin"
                    min="0"
                    value={filters.experienceMin || ''}
                    onChange={handleExperienceMinChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="expMax" className="block text-xs text-gray-500">
                    Max
                  </label>
                  <input
                    type="number"
                    id="expMax"
                    min="0"
                    value={filters.experienceMax || ''}
                    onChange={handleExperienceMaxChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Education Level - For company users */}
          {currentUserRole === 'company' && (
            <div>
              <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700">
                Education Level
              </label>
              <select
                id="educationLevel"
                value={filters.educationLevel || 'all'}
                onChange={handleEducationLevelChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Levels</option>
                {availableEducationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* Institution - For company users */}
          {currentUserRole === 'company' && (
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                Institution
              </label>
              <input
                type="text"
                id="institution"
                value={filters.institution || ''}
                onChange={handleInstitutionChange}
                placeholder="e.g. Stanford University"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          )}
          
          {/* Skills - For company users */}
          {currentUserRole === 'company' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
                {availableSkills.map(skill => (
                  <div 
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                      filters.skills.includes(skill)
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </div>
                ))}
              </div>
              {filters.skills.length > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  Selected: {filters.skills.join(', ')}
                </div>
              )}
            </div>
          )}
          
          {/* Company Size - For professional/student users */}
          {(currentUserRole === 'professional' || currentUserRole === 'student') && (
            <div>
              <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                Company Size
              </label>
              <select
                id="companySize"
                value={filters.companySize || 'all'}
                onChange={handleCompanySizeChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Sizes</option>
                {availableCompanySizes.map(size => (
                  <option key={size} value={size}>{size} employees</option>
                ))}
              </select>
            </div>
          )}
          
          {/* Industry - For professional/student users */}
          {(currentUserRole === 'professional' || currentUserRole === 'student') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
                {availableIndustries.map(industry => (
                  <div 
                    key={industry}
                    onClick={() => handleIndustryToggle(industry)}
                    className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                      filters.industry.includes(industry)
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {industry}
                  </div>
                ))}
              </div>
              {filters.industry.length > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  Selected: {filters.industry.join(', ')}
                </div>
              )}
            </div>
          )}
          
          {/* Open Positions - For professional/student users */}
          {(currentUserRole === 'professional' || currentUserRole === 'student') && (
            <div>
              <label htmlFor="openPositions" className="block text-sm font-medium text-gray-700">
                Open Positions
              </label>
              <select
                id="openPositions"
                value={filters.hasOpenPositions === null ? 'all' : filters.hasOpenPositions.toString()}
                onChange={handleOpenPositionsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Companies</option>
                <option value="true">With Open Positions Only</option>
              </select>
            </div>
          )}
          
          {/* Reset Filters Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={resetFilters}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
