'use client'

import React, { useState } from 'react';
import { UserRole } from '@/types/user';

interface FilterState {
  searchTerm: string;
  role: UserRole | 'all';
  location: string;
  skills: string[];
  mainField: string;
  isJobSeeking: boolean | null;
  isExpert: boolean | null;
  experienceMin: number | null;
  experienceMax: number | null;
  companySize: string | null;
  industry: string[];
  hasOpenPositions: boolean | null;
  educationLevel: string | null;
  institution: string | null;
}

interface TopFilterPanelProps {
  currentUserRole: UserRole;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
}

const TopFilterPanel: React.FC<TopFilterPanelProps> = ({
  currentUserRole,
  filters,
  setFilters,
  resetFilters
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [availableSkills] = useState<string[]>([
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'PHP', 'HTML/CSS',
    'UI/UX Design', 'Product Management', 'Marketing', 'Sales', 'Data Analysis',
    'Machine Learning', 'DevOps', 'Cloud Computing'
  ]);
  
  const [availableIndustries] = useState<string[]>([
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
    'Media', 'Entertainment', 'Consulting', 'Real Estate', 'Transportation'
  ]);
  
  const [availableCompanySizes] = useState<string[]>([
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1001+'
  ]);
  
  const [availableEducationLevels] = useState<string[]>([
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
  
  const handleJobSeekingChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      isJobSeeking: value === 'all' ? null : value === 'true' 
    }));
  };
  
  const handleExpertChange = (value: string) => {
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
  
  const handleCompanySizeChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      companySize: value === 'all' ? null : value 
    }));
  };
  
  const handleEducationLevelChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      educationLevel: value === 'all' ? null : value 
    }));
  };
  
  const handleInstitutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, institution: e.target.value || null }));
  };
  
  const handleOpenPositionsChange = (value: string) => {
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
  
  const toggleFilter = (filterName: string) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };
  
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.role !== 'all') count++;
    if (filters.location) count++;
    if (filters.mainField) count++;
    if (filters.isJobSeeking !== null) count++;
    if (filters.isExpert !== null) count++;
    if (filters.experienceMin !== null || filters.experienceMax !== null) count++;
    if (filters.skills.length > 0) count++;
    if (filters.companySize !== null) count++;
    if (filters.industry.length > 0) count++;
    if (filters.hasOpenPositions !== null) count++;
    if (filters.educationLevel !== null) count++;
    if (filters.institution) count++;
    return count;
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
      {/* Main search bar and filter buttons */}
      <div className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={handleSearchChange}
            placeholder={`Search ${currentUserRole === 'company' ? 'talent' : 'opportunities'}...`}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 justify-end">
          {/* Location filter button */}
          <button
            onClick={() => toggleFilter('location')}
            className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-1 transition-colors ${
              activeFilter === 'location' || filters.location
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Location
            {filters.location && <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>}
          </button>
          
          {/* Role filter button - for company users */}
          {currentUserRole === 'company' && (
            <button
              onClick={() => toggleFilter('role')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-1 transition-colors ${
                activeFilter === 'role' || filters.role !== 'all'
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              User Type
              {filters.role !== 'all' && <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>}
            </button>
          )}
          
          {/* Skills filter button - for company users */}
          {currentUserRole === 'company' && (
            <button
              onClick={() => toggleFilter('skills')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-1 transition-colors ${
                activeFilter === 'skills' || filters.skills.length > 0
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Skills
              {filters.skills.length > 0 && (
                <span className="flex items-center justify-center ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5">
                  {filters.skills.length}
                </span>
              )}
            </button>
          )}
          
          {/* Experience filter button - for company users */}
          {currentUserRole === 'company' && (
            <button
              onClick={() => toggleFilter('experience')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-1 transition-colors ${
                activeFilter === 'experience' || filters.experienceMin !== null || filters.experienceMax !== null
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Experience
              {(filters.experienceMin !== null || filters.experienceMax !== null) && <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>}
            </button>
          )}
          
          {/* Job seeking status filter button - for company users */}
          {currentUserRole === 'company' && (
            <button
              onClick={() => toggleFilter('jobSeeking')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-1 transition-colors ${
                activeFilter === 'jobSeeking' || filters.isJobSeeking !== null
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Job Status
              {filters.isJobSeeking !== null && <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>}
            </button>
          )}
          
          {/* Industry filter button - for professional/student users */}
          {(currentUserRole === 'professional' || currentUserRole === 'student') && (
            <button
              onClick={() => toggleFilter('industry')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-1 transition-colors ${
                activeFilter === 'industry' || filters.industry.length > 0
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Industry
              {filters.industry.length > 0 && (
                <span className="flex items-center justify-center ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5">
                  {filters.industry.length}
                </span>
              )}
            </button>
          )}
          
          {/* Company size filter button - for professional/student users */}
          {(currentUserRole === 'professional' || currentUserRole === 'student') && (
            <button
              onClick={() => toggleFilter('companySize')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-1 transition-colors ${
                activeFilter === 'companySize' || filters.companySize !== null
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Company Size
              {filters.companySize !== null && <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>}
            </button>
          )}
          
          {/* Open positions filter button - for professional/student users */}
          {(currentUserRole === 'professional' || currentUserRole === 'student') && (
            <button
              onClick={() => toggleFilter('openPositions')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-1 transition-colors ${
                activeFilter === 'openPositions' || filters.hasOpenPositions !== null
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Open Positions
              {filters.hasOpenPositions !== null && <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>}
            </button>
          )}
          
          {/* More filters button */}
          <button
            onClick={() => toggleFilter('more')}
            className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-1 transition-colors ${
              activeFilter === 'more'
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            More Filters
          </button>
          
          {/* Reset filters button */}
          {getActiveFilterCount() > 0 && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset ({getActiveFilterCount()})
            </button>
          )}
        </div>
      </div>
      
      {/* Expanded filter panels */}
      {activeFilter && (
        <div className="border-t border-gray-200 p-4 bg-gray-50 animate-fadeIn">
          {/* Location filter panel */}
          {activeFilter === 'location' && (
            <div className="max-w-md mx-auto">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={filters.location}
                onChange={handleLocationChange}
                placeholder="City, Country"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">Enter city or country name</p>
            </div>
          )}
          
          {/* Role filter panel - for company users */}
          {activeFilter === 'role' && currentUserRole === 'company' && (
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Type
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleRoleChange({ target: { value: 'all' } } as React.ChangeEvent<HTMLSelectElement>)}
                  className={`px-4 py-2 rounded-md flex-1 ${
                    filters.role === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => handleRoleChange({ target: { value: 'professional' } } as React.ChangeEvent<HTMLSelectElement>)}
                  className={`px-4 py-2 rounded-md flex-1 ${
                    filters.role === 'professional' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Professional
                </button>
                <button
                  onClick={() => handleRoleChange({ target: { value: 'student' } } as React.ChangeEvent<HTMLSelectElement>)}
                  className={`px-4 py-2 rounded-md flex-1 ${
                    filters.role === 'student' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Student
                </button>
              </div>
            </div>
          )}
          
          {/* Skills filter panel - for company users */}
          {activeFilter === 'skills' && currentUserRole === 'company' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md bg-white">
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
          
          {/* Experience filter panel - for company users */}
          {activeFilter === 'experience' && currentUserRole === 'company' && (
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expMin" className="block text-xs text-gray-500 mb-1">
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
                  <label htmlFor="expMax" className="block text-xs text-gray-500 mb-1">
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
          
          {/* Job seeking status filter panel - for company users */}
          {activeFilter === 'jobSeeking' && currentUserRole === 'company' && (
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Seeking Status
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleJobSeekingChange('all')}
                  className={`px-4 py-2 rounded-md flex-1 ${
                    filters.isJobSeeking === null 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleJobSeekingChange('true')}
                  className={`px-4 py-2 rounded-md flex-1 ${
                    filters.isJobSeeking === true 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Actively Looking
                </button>
                <button
                  onClick={() => handleJobSeekingChange('false')}
                  className={`px-4 py-2 rounded-md flex-1 ${
                    filters.isJobSeeking === false 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Not Looking
                </button>
              </div>
            </div>
          )}
          
          {/* Industry filter panel - for professional/student users */}
          {activeFilter === 'industry' && (currentUserRole === 'professional' || currentUserRole === 'student') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md bg-white">
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
          
          {/* Company size filter panel - for professional/student users */}
          {activeFilter === 'companySize' && (currentUserRole === 'professional' || currentUserRole === 'student') && (
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleCompanySizeChange('all')}
                  className={`px-3 py-2 rounded-md text-sm ${
                    filters.companySize === null 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Sizes
                </button>
                {availableCompanySizes.map(size => (
                  <button
                    key={size}
                    onClick={() => handleCompanySizeChange(size)}
                    className={`px-3 py-2 rounded-md text-sm ${
                      filters.companySize === size 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {size} employees
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Open positions filter panel - for professional/student users */}
          {activeFilter === 'openPositions' && (currentUserRole === 'professional' || currentUserRole === 'student') && (
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Open Positions
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleOpenPositionsChange('all')}
                  className={`px-4 py-2 rounded-md flex-1 ${
                    filters.hasOpenPositions === null 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Companies
                </button>
                <button
                  onClick={() => handleOpenPositionsChange('true')}
                  className={`px-4 py-2 rounded-md flex-1 ${
                    filters.hasOpenPositions === true 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  With Open Positions
                </button>
              </div>
            </div>
          )}
          
          {/* More filters panel */}
          {activeFilter === 'more' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main field filter - for company users */}
              {currentUserRole === 'company' && (
                <div>
                  <label htmlFor="mainField" className="block text-sm font-medium text-gray-700 mb-1">
                    Main Field
                  </label>
                  <input
                    type="text"
                    id="mainField"
                    value={filters.mainField}
                    onChange={handleMainFieldChange}
                    placeholder="e.g. Software Development"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              )}
              
              {/* Expert status filter - for company users */}
              {currentUserRole === 'company' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expert Status
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleExpertChange('all')}
                      className={`px-4 py-2 rounded-md flex-1 ${
                        filters.isExpert === null 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleExpertChange('true')}
                      className={`px-4 py-2 rounded-md flex-1 ${
                        filters.isExpert === true 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Experts Only
                    </button>
                    <button
                      onClick={() => handleExpertChange('false')}
                      className={`px-4 py-2 rounded-md flex-1 ${
                        filters.isExpert === false 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Non-Experts
                    </button>
                  </div>
                </div>
              )}
              
              {/* Education level filter - for company users */}
              {currentUserRole === 'company' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleEducationLevelChange('all')}
                      className={`px-3 py-2 rounded-md text-sm ${
                        filters.educationLevel === null 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      All Levels
                    </button>
                    {availableEducationLevels.map(level => (
                      <button
                        key={level}
                        onClick={() => handleEducationLevelChange(level)}
                        className={`px-3 py-2 rounded-md text-sm ${
                          filters.educationLevel === level 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Institution filter - for company users */}
              {currentUserRole === 'company' && (
                <div>
                  <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    id="institution"
                    value={filters.institution || ''}
                    onChange={handleInstitutionChange}
                    placeholder="e.g. Stanford University"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Active filters display */}
      {getActiveFilterCount() > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-gray-500">Active filters:</span>
          
          {filters.searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Search: {filters.searchTerm}
              <button 
                onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          )}
          
          {filters.role !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {filters.role === 'professional' ? 'Professional' : filters.role === 'student' ? 'Student' : filters.role}
              <button 
                onClick={() => setFilters(prev => ({ ...prev, role: 'all' }))}
                className="ml-1 text-blue-500 hover:text-blue-700"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          )}
          
          {filters.location && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Location: {filters.location}
              <button 
                onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                className="ml-1 text-green-500 hover:text-green-700"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          )}
          
          {/* Add more active filter indicators as needed */}
        </div>
      )}
    </div>
  );
};

export default TopFilterPanel;
