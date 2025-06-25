'use client';

import { UserRole } from '@/types/user';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ActiveFiltersProps {
  role: UserRole;
  skills: string[];
  location: string;
  searchTerm: string;
  experienceMin: number | null;
  experienceMax: number | null;
  isJobSeeking: boolean | null;
  onRemoveFilter: (type: string, value?: string) => void;
}

export default function ActiveFilters({
  role,
  skills,
  location,
  searchTerm,
  experienceMin,
  experienceMax,
  isJobSeeking,
  onRemoveFilter
}: ActiveFiltersProps) {
  const getRoleColor = () => {
    switch (role) {
      case 'professional':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-pink-100 text-pink-800';
      case 'company':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'professional':
        return 'Professionals';
      case 'student':
        return 'Students';
      case 'company':
        return 'Companies';
      default:
        return '';
    }
  };

  const hasFilters = () => {
    return role !== 'professional' || 
           skills.length > 0 || 
           location || 
           searchTerm || 
           experienceMin !== null || 
           experienceMax !== null || 
           isJobSeeking !== null;
  };

  if (!hasFilters()) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {role !== 'professional' && (
        <div className={`${getRoleColor()} px-3 py-1 rounded-full text-sm flex items-center gap-1`}>
          <span>{getRoleLabel()}</span>
          <button 
            onClick={() => onRemoveFilter('role')}
            className="hover:opacity-70"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {searchTerm && (
        <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <span>Search: {searchTerm}</span>
          <button 
            onClick={() => onRemoveFilter('searchTerm')}
            className="hover:opacity-70"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {skills.map(skill => (
        <div key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <span>{skill}</span>
          <button 
            onClick={() => onRemoveFilter('skill', skill)}
            className="hover:opacity-70"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
      
      {location && (
        <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <span>Location: {location}</span>
          <button 
            onClick={() => onRemoveFilter('location')}
            className="hover:opacity-70"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {(experienceMin !== null || experienceMax !== null) && (
        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <span>
            Experience: {experienceMin !== null ? `${experienceMin}+` : ''}
            {experienceMin !== null && experienceMax !== null ? '-' : ''}
            {experienceMax !== null ? `${experienceMax}` : ''} years
          </span>
          <button 
            onClick={() => onRemoveFilter('experience')}
            className="hover:opacity-70"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {isJobSeeking !== null && (
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <span>
            {isJobSeeking ? 'Actively Looking' : 'Not Looking'}
          </span>
          <button 
            onClick={() => onRemoveFilter('jobSeeking')}
            className="hover:opacity-70"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}