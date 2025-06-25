'use client';

import { useEffect, useState, useMemo } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import UserCard from '@/components/register/UserCard';
import { User } from '@/types/user';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

type FilterState = {
  search: string;
  role: User['role'] | '';
  location: string;
  mainfield: string;
  title: string;
  education: string;
  skills: string[];
  university: string;
  interests: string[];
  services: string[];
  industry: string[];
  department: string;
  hiring: boolean;
  experienceMin: number | '';
};

const ITEMS_PER_PAGE = 12;

export default function UsersPage() {
  const t = useTranslations('home');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>([]);
  const [suggestionInput, setSuggestionInput] = useState('');
  const [suggestionType, setSuggestionType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    role: '',
    location: '',
    mainfield: '',
    title: '',
    education: '',
    skills: [],
    university: '',
    interests: [],
    services: [],
    industry: [],
    department: '',
    hiring: false,
    experienceMin: ''
  });

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/all-members');
        const data = await response.json();
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(t('error_fetching'));
        setLoading(false);
      }
    };
    fetchUsers();
  }, [t]);

  // Generate all filter suggestions
  const allSuggestions = useMemo(() => {
    const suggestionSet = new Set<string>();
    
    users.forEach((user: User) => {
      suggestionSet.add(user.name);
      if (user.city) suggestionSet.add(user.city);
      if (user.country) suggestionSet.add(user.country);
      
      // Professional suggestions
      if (user.bio?.professional_info?.title) {
        suggestionSet.add(user.bio.professional_info.title);
      }
      user.bio?.professional_info?.skills?.forEach(skill => {
        suggestionSet.add(skill.name);
      });
      
      // Student suggestions
      if (user.bio?.academic_info?.institution) {
        suggestionSet.add(user.bio.academic_info.institution);
      }
      user.bio?.skills_learning?.forEach(skill => {
        if (skill) suggestionSet.add(skill);
      });
      user.bio?.interests?.forEach(interest => {
        if (interest) suggestionSet.add(interest);
      });
      
      // Company suggestions
      user.bio?.company_info?.industry?.forEach(industry => {
        if (industry) suggestionSet.add(industry);
      });
      user.bio?.services?.forEach(service => {
        if (service) suggestionSet.add(service);
      });
      user.bio?.hiring_needs?.open_positions?.forEach(pos => {
        if (pos.department) suggestionSet.add(pos.department);
      });
    });
    
    return Array.from(suggestionSet).filter(Boolean);
  }, [users]);

  // Filter users based on current filters
  const filteredUsers = useMemo(() => {
    let result = [...users];
    
    // General filters
    if (filters.search) {
      const keyword = filters.search.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword) ||
        u.bio?.summary?.toLowerCase().includes(keyword) ||
        u.bio?.professional_info?.skills?.some(s => s.name.toLowerCase().includes(keyword)) ||
        u.bio?.skills_learning?.some(s => s.toLowerCase().includes(keyword)) ||
        u.bio?.interests?.some(i => i.toLowerCase().includes(keyword)) ||
        u.bio?.company_info?.industry?.some(i => i.toLowerCase().includes(keyword)) ||
        u.bio?.services?.some(s => typeof s === 'string' && s.toLowerCase().includes(keyword))
      );
    }
    
    if (filters.role) {
      result = result.filter(u => u.role === filters.role);
    }
    
    if (filters.location) {
      result = result.filter(u => 
        u.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        u.country?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Role-specific filters
    if (filters.role === 'professional') {
      if (filters.title) {
        result = result.filter(u => 
          u.bio?.professional_info?.title?.toLowerCase().includes(filters.title.toLowerCase())
        );
      }
      
      if (filters.mainfield) {
        result = result.filter(u => 
          u.mainfield?.toLowerCase().includes(filters.mainfield.toLowerCase())
        );
      }
      
      if (filters.skills.length > 0) {
        result = result.filter(u =>
          filters.skills.every(filterSkill =>
            u.bio?.professional_info?.skills?.some(userSkill =>
              userSkill.name.toLowerCase().includes(filterSkill.toLowerCase())
            )
          )
        );
      }
      
      if (filters.experienceMin !== '') {
        const minExp = Number(filters.experienceMin);
        result = result.filter(u =>
          (u.bio?.professional_info?.years_experience || 0) >= minExp
        );
      }
    } 
    else if (filters.role === 'student') {
      if (filters.university) {
        result = result.filter(u => 
          u.bio?.academic_info?.institution?.toLowerCase().includes(filters.university.toLowerCase())
        );
      }
      
      if (filters.skills.length > 0) {
        result = result.filter(u =>
          filters.skills.every(filterSkill =>
            u.bio?.skills_learning?.some(userSkill =>
              userSkill.toLowerCase().includes(filterSkill.toLowerCase())
            )
          )
        );
      }
      
      if (filters.interests.length > 0) {
        result = result.filter(u =>
          filters.interests.every(filterInterest =>
            u.bio?.interests?.some(userInterest =>
              userInterest.toLowerCase().includes(filterInterest.toLowerCase())
            )
          )
        );
      }
    } 
    else if (filters.role === 'company') {
      if (filters.services.length > 0) {
        result = result.filter(u =>
          filters.services.every(filterService =>
            u.bio?.services?.some(service =>
              service.toLowerCase().includes(filterService.toLowerCase())
            )
          )
        );
      }
      
      if (filters.industry.length > 0) {
        result = result.filter(u =>
          filters.industry.every(filterIndustry =>
            u.bio?.company_info?.industry?.some(industry =>
              industry.toLowerCase().includes(filterIndustry.toLowerCase())
            )
          )
        );
      }
      
      if (filters.department) {
        result = result.filter(u =>
          u.bio?.hiring_needs?.open_positions?.some(pos =>
            pos.department.toLowerCase().includes(filters.department.toLowerCase())
        ));
      }
      
      if (filters.hiring) {
        result = result.filter(u => 
          u.bio?.hiring_needs?.open_positions?.length
        );
      }
    }
    
    return result;
  }, [users, filters]);

  // Pagination logic
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle showing suggestions for a specific filter field
  const showSuggestions = (field: string, value: string) => {
    setSuggestionInput(value);
    setSuggestionType(field);
    
    const filtered = allSuggestions
      .filter(opt => typeof opt === 'string' && opt.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 8);
    
    setActiveSuggestions(filtered);
  };

  // Apply a suggestion to the appropriate filter
  const applySuggestion = (value: string) => {
    if (!suggestionType) return;
    
    setFilters(prev => {
      if (['skills', 'interests', 'services', 'industry'].includes(suggestionType)) {
        const currentValues = prev[suggestionType as keyof FilterState] as string[];
        if (!currentValues.includes(value)) {
          return { ...prev, [suggestionType]: [...currentValues, value] };
        }
        return prev;
      } else {
        return { ...prev, [suggestionType]: value };
      }
    });
    
    setSuggestionType(null);
    setActiveSuggestions([]);
    setSuggestionInput('');
  };

  // Remove a tag from an array filter
  const removeTag = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter(v => v !== value)
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: '',
      role: '',
      location: '',
      mainfield: '',
      title: '',
      education: '',
      skills: [],
      university: '',
      interests: [],
      services: [],
      industry: [],
      department: '',
      hiring: false,
      experienceMin: ''
    });
    setCurrentPage(1);
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const visiblePages = () => {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }

      return pages;
    };

    return (
      <div className={`flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {t('pagination.previous')}
          </button>
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {t('pagination.next')}
          </button>
        </div>

        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              {t('pagination.showing', {
                start: (currentPage - 1) * ITEMS_PER_PAGE + 1,
                end: Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length),
                total: filteredUsers.length
              })}
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <span className="sr-only">{t('pagination.first')}</span>
                {isRTL ? (
                  <ChevronDownIcon className="h-5 w-5 transform rotate-90" aria-hidden="true" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 transform -rotate-90" aria-hidden="true" />
                )}
              </button>
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <span className="sr-only">{t('pagination.previous')}</span>
                {isRTL ? (
                  <ChevronDownIcon className="h-5 w-5 transform rotate-90" aria-hidden="true" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 transform -rotate-90" aria-hidden="true" />
                )}
              </button>

              {visiblePages().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  } ${typeof page !== 'number' ? 'pointer-events-none' : ''}`}
                  disabled={typeof page !== 'number'}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <span className="sr-only">{t('pagination.next')}</span>
                {isRTL ? (
                  <ChevronDownIcon className="h-5 w-5 transform -rotate-90" aria-hidden="true" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 transform rotate-90" aria-hidden="true" />
                )}
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <span className="sr-only">{t('pagination.last')}</span>
                {isRTL ? (
                  <ChevronDownIcon className="h-5 w-5 transform -rotate-90" aria-hidden="true" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 transform rotate-90" aria-hidden="true" />
                )}
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir={dir}>
      {/* Header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title_member')}</h1>
          <p className="text-gray-600 mt-1">
            {t('results_count', { count: filteredUsers.length })}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${showFilters ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {showFilters ? (
              <>
                <XMarkIcon className="h-5 w-5" />
                {t('hide_filters')}
              </>
            ) : (
              <>
                <FunnelIcon className="h-5 w-5" />
                {t('show_filters')}
              </>
            )}
          </button>
          
          {Object.values(filters).some(val => 
            (Array.isArray(val) && val.length > 0) || 
            (typeof val === 'string' && val !== '') ||
            (typeof val === 'number' && !isNaN(val)) ||
            (typeof val === 'boolean' && val)
          ) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              <XMarkIcon className="h-5 w-5" />
              {t('clear_all')}
            </button>
          )}
        </div>
      </div>

      {/* Active filters display */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.role && (
          <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {t('filters.role')}: {t(`roles.${filters.role}`)}
            <button 
              onClick={() => setFilters({...filters, role: ''})}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {filters.search && (
          <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            {t('filters.search')}: "{filters.search}"
            <button 
              onClick={() => setFilters({...filters, search: ''})}
              className="ml-2 text-purple-600 hover:text-purple-800"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {filters.location && (
          <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            {t('filters.location')}: {filters.location}
            <button 
              onClick={() => setFilters({...filters, location: ''})}
              className="ml-2 text-green-600 hover:text-green-800"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {filters.skills.map((skill, i) => (
          <div key={i} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {t('filters.skill')}: {skill}
            <button 
              onClick={() => removeTag('skills', skill)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        
        {filters.interests.map((interest, i) => (
          <div key={i} className="flex items-center bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
            {t('filters.interest')}: {interest}
            <button 
              onClick={() => removeTag('interests', interest)}
              className="ml-2 text-pink-600 hover:text-pink-800"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        
        {filters.services.map((service, i) => (
          <div key={i} className="flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
            {t('filters.service')}: {service}
            <button 
              onClick={() => removeTag('services', service)}
              className="ml-2 text-amber-600 hover:text-amber-800"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        
        {filters.industry.map((industry, i) => (
          <div key={i} className="flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
            {t('filters.industry')}: {industry}
            <button 
              onClick={() => removeTag('industry', industry)}
              className="ml-2 text-emerald-600 hover:text-emerald-800"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        
        {filters.hiring && (
          <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
            {t('filters.hiring')}
            <button 
              onClick={() => setFilters({...filters, hiring: false})}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Search input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.search')}</label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => {
                    setFilters({...filters, search: e.target.value});
                    showSuggestions('search', e.target.value);
                  }}
                  className={`block w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder={t('filters.search_placeholder')}
                />
              </div>
            </div>
            
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.role')}</label>
              <select
                value={filters.role!}
                onChange={(e) => setFilters({...filters, role: e.target.value as User['role'] | ''})}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
              >
                <option value="">{t('filters.all_roles')}</option>
                <option value="professional">{t('roles.professional')}</option>
                <option value="student">{t('roles.student')}</option>
                <option value="company">{t('roles.company')}</option>
              </select>
            </div>
            
            {/* Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.location')}</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => {
                  setFilters({...filters, location: e.target.value});
                  showSuggestions('location', e.target.value);
                }}
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('filters.location_placeholder')}
              />
            </div>
            
            {/* Role-specific filters */}
            {filters.role === 'professional' && (
              <>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.job_title')}</label>
                  <input
                    type="text"
                    value={filters.title}
                    onChange={(e) => {
                      setFilters({...filters, title: e.target.value});
                      showSuggestions('title', e.target.value);
                    }}
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t('filters.job_title_placeholder')}
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.main_field')}</label>
                  <input
                    type="text"
                    value={filters.mainfield}
                    onChange={(e) => {
                      setFilters({...filters, mainfield: e.target.value});
                      showSuggestions('mainfield', e.target.value);
                    }}
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t('filters.main_field_placeholder')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.min_experience')}</label>
                  <input
                    type="number"
                    min="0"
                    value={filters.experienceMin || ''}
                    onChange={(e) => setFilters({...filters, experienceMin: e.target.value ? parseInt(e.target.value) : ''})}
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t('filters.min_experience_placeholder')}
                  />
                </div>
                
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.skills')}</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {filters.skills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                        <button 
                          onClick={() => removeTag('skills', skill)}
                          className="ml-1.5 text-blue-600 hover:text-blue-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={suggestionType === 'skills' ? suggestionInput : ''}
                      onChange={(e) => {
                        setSuggestionInput(e.target.value);
                        showSuggestions('skills', e.target.value);
                      }}
                      onFocus={() => {
                        setSuggestionType('skills');
                        showSuggestions('skills', '');
                      }}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={t('filters.add_skills')}
                    />
                    {suggestionType === 'skills' && activeSuggestions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                        {activeSuggestions.map((suggestion, i) => (
                          <div
                            key={i}
                            onClick={() => applySuggestion(suggestion)}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                          >
                            {suggestion}
                            {filters.skills.includes(suggestion) && (
                              <CheckIcon className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {filters.role === 'student' && (
              <>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.university')}</label>
                  <input
                    type="text"
                    value={filters.university}
                    onChange={(e) => {
                      setFilters({...filters, university: e.target.value});
                      showSuggestions('university', e.target.value);
                    }}
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t('filters.university_placeholder')}
                  />
                </div>
                
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.skills_learning')}</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {filters.skills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                        <button 
                          onClick={() => removeTag('skills', skill)}
                          className="ml-1.5 text-purple-600 hover:text-purple-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={suggestionType === 'skills' ? suggestionInput : ''}
                      onChange={(e) => {
                        setSuggestionInput(e.target.value);
                        showSuggestions('skills', e.target.value);
                      }}
                      onFocus={() => {
                        setSuggestionType('skills');
                        showSuggestions('skills', '');
                      }}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={t('filters.add_skills')}
                    />
                    {suggestionType === 'skills' && activeSuggestions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                        {activeSuggestions.map((suggestion, i) => (
                          <div
                            key={i}
                            onClick={() => applySuggestion(suggestion)}
                            className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center justify-between"
                          >
                            {suggestion}
                            {filters.skills.includes(suggestion) && (
                              <CheckIcon className="h-4 w-4 text-purple-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.interests')}</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {filters.interests.map((interest, i) => (
                      <span key={i} className="inline-flex items-center bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                        {interest}
                        <button 
                          onClick={() => removeTag('interests', interest)}
                          className="ml-1.5 text-pink-600 hover:text-pink-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={suggestionType === 'interests' ? suggestionInput : ''}
                      onChange={(e) => {
                        setSuggestionInput(e.target.value);
                        showSuggestions('interests', e.target.value);
                      }}
                      onFocus={() => {
                        setSuggestionType('interests');
                        showSuggestions('interests', '');
                      }}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={t('filters.add_interests')}
                    />
                    {suggestionType === 'interests' && activeSuggestions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                        {activeSuggestions.map((suggestion, i) => (
                          <div
                            key={i}
                            onClick={() => applySuggestion(suggestion)}
                            className="px-4 py-2 hover:bg-pink-50 cursor-pointer flex items-center justify-between"
                          >
                            {suggestion}
                            {filters.interests.includes(suggestion) && (
                              <CheckIcon className="h-4 w-4 text-pink-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {filters.role === 'company' && (
              <>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.department')}</label>
                  <input
                    type="text"
                    value={filters.department}
                    onChange={(e) => {
                      setFilters({...filters, department: e.target.value});
                      showSuggestions('department', e.target.value);
                    }}
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t('filters.department_placeholder')}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    id="hiring-filter"
                    type="checkbox"
                    checked={filters.hiring}
                    onChange={(e) => setFilters({...filters, hiring: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hiring-filter" className="ml-2 block text-sm text-gray-700">
                    {t('filters.currently_hiring')}
                  </label>
                </div>
                
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.services')}</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {filters.services.map((service, i) => (
                      <span key={i} className="inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                        {service}
                        <button 
                          onClick={() => removeTag('services', service)}
                          className="ml-1.5 text-amber-600 hover:text-amber-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={suggestionType === 'services' ? suggestionInput : ''}
                      onChange={(e) => {
                        setSuggestionInput(e.target.value);
                        showSuggestions('services', e.target.value);
                      }}
                      onFocus={() => {
                        setSuggestionType('services');
                        showSuggestions('services', '');
                      }}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={t('filters.add_services')}
                    />
                    {suggestionType === 'services' && activeSuggestions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                        {activeSuggestions.map((suggestion, i) => (
                          <div
                            key={i}
                            onClick={() => applySuggestion(suggestion)}
                            className="px-4 py-2 hover:bg-amber-50 cursor-pointer flex items-center justify-between"
                          >
                            {suggestion}
                            {filters.services.includes(suggestion) && (
                              <CheckIcon className="h-4 w-4 text-amber-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.industries')}</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {filters.industry.map((industry, i) => (
                      <span key={i} className="inline-flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                        {industry}
                        <button 
                          onClick={() => removeTag('industry', industry)}
                          className="ml-1.5 text-emerald-600 hover:text-emerald-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={suggestionType === 'industry' ? suggestionInput : ''}
                      onChange={(e) => {
                        setSuggestionInput(e.target.value);
                        showSuggestions('industry', e.target.value);
                      }}
                      onFocus={() => {
                        setSuggestionType('industry');
                        showSuggestions('industry', '');
                      }}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={t('filters.add_industries')}
                    />
                    {suggestionType === 'industry' && activeSuggestions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                        {activeSuggestions.map((suggestion, i) => (
                          <div
                            key={i}
                            onClick={() => applySuggestion(suggestion)}
                            className="px-4 py-2 hover:bg-emerald-50 cursor-pointer flex items-center justify-between"
                          >
                            {suggestion}
                            {filters.industry.includes(suggestion) && (
                              <CheckIcon className="h-4 w-4 text-emerald-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredUsers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">{t('empty_state.title')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('empty_state.description')}</p>
          <div className="mt-6">
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('empty_state.reset_button')}
            </button>
          </div>
        </div>
      )}

      {/* Results grid */}
      {!loading && !error && filteredUsers.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
}