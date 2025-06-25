// components/UserFilters.tsx
'use client';

import { UserRole } from '@/types/user';
import { useState } from 'react';

interface Filters {
  role: UserRole | '';
  search: string;
  sort: string;
  skills: string;
  experience: string;
  education: string;
  industry: string;
  location: string;
}

interface UserFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const UserFilters = ({ filters, setFilters }: UserFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      search: '',
      sort: 'name-asc',
      skills: '',
      experience: '',
      education: '',
      industry: '',
      location: '',
    });
    setShowAdvanced(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            id="role"
            name="role"
            value={filters.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Roles</option>
            <option value="professional">Professionals</option>
            <option value="student">Students</option>
            <option value="company">Companies</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Name, email, title..."
            value={filters.search}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            id="sort"
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            {filters.role === 'professional' && (
              <>
                <option value="experience-asc">Experience (Low to High)</option>
                <option value="experience-desc">Experience (High to Low)</option>
              </>
            )}
            {(filters.role === 'professional' || filters.role === 'student') && (
              <option value="education-desc">Highest Education</option>
            )}
            {filters.role === 'company' && (
              <option value="founded-desc">Newest Companies</option>
            )}
            <option value="recent-desc">Most Recent</option>
          </select>
        </div>
      </div>
      
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 flex items-center"
      >
        {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
        <svg
          className={`ml-1 h-4 w-4 transform ${showAdvanced ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {filters.role === 'professional' && (
            <>
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  placeholder="JavaScript, React, etc."
                  value={filters.skills}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Min Experience (years)</label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  placeholder="5"
                  min="0"
                  value={filters.experience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}
          
          {(filters.role === 'professional' || filters.role === 'student') && (
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <input
                type="text"
                id="education"
                name="education"
                placeholder="Degree or institution"
                value={filters.education}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          
          {filters.role === 'company' && (
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <input
                type="text"
                id="industry"
                name="industry"
                placeholder="Technology, Finance, etc."
                value={filters.industry}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="City or country"
              value={filters.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-4">
        <button
          onClick={clearFilters}
          className="px-4 py-2 mr-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default UserFilters;