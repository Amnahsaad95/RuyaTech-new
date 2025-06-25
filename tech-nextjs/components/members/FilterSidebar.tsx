'use client';

import { UserRole } from '@/types/user';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface FilterSidebarProps {
  skills: string[];
  filters: {
    role: UserRole;
    skills: string[];
    location: string;
    experienceMin: number | null;
    experienceMax: number | null;
    isJobSeeking: boolean | null;
  };
  onApply: (filters: any) => void;
  onClose: () => void;
}

export default function FilterSidebar({ skills, filters, onApply, onClose }: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState({
    role: filters.role,
    skills: [...filters.skills],
    location: filters.location,
    experienceMin: filters.experienceMin,
    experienceMax: filters.experienceMax,
    isJobSeeking: filters.isJobSeeking,
  });

  const handleRoleChange = (role: UserRole) => {
    setLocalFilters(prev => ({ ...prev, role }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters(prev => ({ ...prev, location: e.target.value }));
  };

  const handleSkillToggle = (skill: string) => {
    setLocalFilters(prev => {
      const skills = [...prev.skills];
      if (skills.includes(skill)) {
        return { ...prev, skills: skills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: [...skills, skill] };
      }
    });
  };

  const handleExperienceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setLocalFilters(prev => ({ ...prev, experienceMin: value }));
  };

  const handleExperienceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setLocalFilters(prev => ({ ...prev, experienceMax: value }));
  };

  const handleJobSeekingChange = (value: boolean | null) => {
    setLocalFilters(prev => ({ ...prev, isJobSeeking: value }));
  };

  const applyFilters = () => {
    onApply(localFilters);
  };

  const resetFilters = () => {
    setLocalFilters({
      role: 'professional',
      skills: [],
      location: '',
      experienceMin: null,
      experienceMax: null,
      isJobSeeking: null,
    });
  };

  return (
    <div className="lg:w-64 bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Filters</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Role Filter */}
        <div>
          <h4 className="font-medium mb-2">User Type</h4>
          <div className="space-y-2">
            <button
              onClick={() => handleRoleChange('professional')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                localFilters.role === 'professional'
                  ? 'bg-blue-100 text-blue-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              Professionals
            </button>
            <button
              onClick={() => handleRoleChange('student')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                localFilters.role === 'student'
                  ? 'bg-blue-100 text-blue-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => handleRoleChange('company')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                localFilters.role === 'company'
                  ? 'bg-blue-100 text-blue-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              Companies
            </button>
          </div>
        </div>
        
        {/* Location Filter */}
        <div>
          <h4 className="font-medium mb-2">Location</h4>
          <input
            type="text"
            value={localFilters.location}
            onChange={handleLocationChange}
            placeholder="City, Country"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Skills Filter */}
        <div>
          <h4 className="font-medium mb-2">Skills</h4>
          <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
            {skills.map(skill => (
              <div
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`px-3 py-1 mb-1 rounded-md cursor-pointer ${
                  localFilters.skills.includes(skill)
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
        
        {/* Experience Filter */}
        <div>
          <h4 className="font-medium mb-2">Experience (years)</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Min</label>
              <input
                type="number"
                min="0"
                value={localFilters.experienceMin || ''}
                onChange={handleExperienceMinChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max</label>
              <input
                type="number"
                min="0"
                value={localFilters.experienceMax || ''}
                onChange={handleExperienceMaxChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        {/* Job Seeking Filter */}
        {localFilters.role !== 'company' && (
          <div>
            <h4 className="font-medium mb-2">Job Seeking</h4>
            <div className="space-y-2">
              <button
                onClick={() => handleJobSeekingChange(null)}
                className={`w-full text-left px-3 py-2 rounded-md ${
                  localFilters.isJobSeeking === null
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleJobSeekingChange(true)}
                className={`w-full text-left px-3 py-2 rounded-md ${
                  localFilters.isJobSeeking === true
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                Actively Looking
              </button>
              <button
                onClick={() => handleJobSeekingChange(false)}
                className={`w-full text-left px-3 py-2 rounded-md ${
                  localFilters.isJobSeeking === false
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                Not Looking
              </button>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={resetFilters}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            onClick={applyFilters}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}