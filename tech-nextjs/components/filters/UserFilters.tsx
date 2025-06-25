// components/UserFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter,usePathname, useSearchParams } from 'next/navigation';
import { AcademicCapIcon, BriefcaseIcon, BuildingOfficeIcon, FunnelIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';


type FilterParams = {
  role?: 'professional' | 'student' | 'company' | 'all';
  search?: string;
  location?: string;
  mainfield?: string;
  title?: string;
  min_experience?: number;
  skills?: string[];
  university?: string;
  interests?: string[];
  learning?: string[];
  industry?: string[];
  hiring?: boolean;
  services?: string[];
};

export default function UserFilters({
  onFilterChange,
  initialFilters,
}: {
  onFilterChange: (filters: FilterParams) => void;
  initialFilters: FilterParams;
}) {
  const [filters, setFilters] = useState<FilterParams>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // When filters change, notify parent and update URL
  const updateFilters = (newFilters: Partial<FilterParams>) => {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    onFilterChange(merged);

    const params = new URLSearchParams();
    Object.entries(merged).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === null) return;
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    setFilters({});
    onFilterChange({});
    router.push(pathname);
  };

  useEffect(() => {
    onFilterChange(filters);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-card p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filter Members</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {isExpanded ? (
              <>
                <XMarkIcon className="h-4 w-4 mr-1" />
                Hide Filters
              </>
            ) : (
              <>
                <FunnelIcon className="h-4 w-4 mr-1" />
                Show Filters
              </>
            )}
          </button>
          <button 
            onClick={resetFilters}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Search and Role Filter (always visible) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search by name, skills, etc."
            value={filters.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>
        <div>
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filters.role || 'all'}
            onChange={(e) => updateFilters({ role: e.target.value as any })}
          >
            <option value="all">All Roles</option>
            <option value="professional">Professionals</option>
            <option value="student">Students</option>
            <option value="company">Companies</option>
          </select>
        </div>
      </div>

      {/* Location Filter (always visible) */}
      <div className="mb-4">
        <input
          type="text"
          className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Filter by location (city or country)"
          value={filters.location || ''}
          onChange={(e) => updateFilters({ location: e.target.value })}
        />
      </div>

      {/* Advanced Filters (collapsible) */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-4">
          {/* Professional Filters */}
          {filters.role === 'professional' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Field</label>
                <input
                  type="text"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g. Software Development"
                  value={filters.mainfield || ''}
                  onChange={(e) => updateFilters({ mainfield: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                <input
                  type="text"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g. Senior Developer"
                  value={filters.title || ''}
                  onChange={(e) => updateFilters({ title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Experience (years)</label>
                <input
                  type="number"
                  min="0"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.min_experience || ''}
                  onChange={(e) => updateFilters({ min_experience: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <input
                  type="text"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Type skill and press enter"
                  value={filters.skills?.join(', ') || ''}
                  onChange={(e) => {
                    const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                    updateFilters({ skills });
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">Separate multiple skills with commas</p>
              </div>
            </div>
          )}

          {/* Student Filters */}
          {filters.role === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <input
                  type="text"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g. Harvard University"
                  value={filters.university || ''}
                  onChange={(e) => updateFilters({ university: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Field</label>
                <input
                  type="text"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g. Computer Science"
                  value={filters.mainfield || ''}
                  onChange={(e) => updateFilters({ mainfield: e.target.value })}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Learning</label>
                <input
                  type="text"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Type skill and press enter"
                  value={filters.learning?.join(', ') || ''}
                  onChange={(e) => {
                    const learning = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                    updateFilters({ learning });
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">Separate multiple skills with commas</p>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                <input
                  type="text"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Type interests and press enter"
                  value={filters.interests?.join(', ') || ''}
                  onChange={(e) => {
                    const interests = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                    updateFilters({ interests });
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">Separate multiple interests with commas</p>
              </div>
            </div>
          )}

          {/* Company Filters */}
          {filters.role === 'company' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  type="text"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g. Technology, Finance"
                  value={filters.industry?.join(', ') || ''}
                  onChange={(e) => {
                    const industry = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                    updateFilters({ industry });
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">Separate multiple industries with commas</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                <input
                  type="text"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g. Consulting, Development"
                  value={filters.services?.join(', ') || ''}
                  onChange={(e) => {
                    const services = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                    updateFilters({ services });
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">Separate multiple services with commas</p>
              </div>
              <div className="flex items-end">
                <div className="flex items-center">
                  <input
                    id="hiring-filter"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={filters.hiring || false}
                    onChange={(e) => updateFilters({ hiring: e.target.checked })}
                  />
                  <label htmlFor="hiring-filter" className="ml-2 block text-sm text-gray-700">
                    Currently Hiring
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}