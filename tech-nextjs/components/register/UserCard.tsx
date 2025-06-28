'use client'

import React from 'react';
import { User } from '@/types/user';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGraduationCap, faBuilding ,faSearch, faCertificate, faUserTie, faMedal } from '@fortawesome/free-solid-svg-icons'


interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const t = useTranslations('home');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getSummary = () => user.bio?.summary || t('noSummary');
  const getProfileImage = () => 
    user.profile_image && typeof user.profile_image === 'string' 
      ? `${API_URL}/storage/${user.profile_image}`
      : '/default-avatar.png';

  const roleConfig = {
  professional: {
    bg: 'bg-gradient-to-r from-rose-600 to-rose-700',
    text: 'text-rose-50',
    accent: 'text-rose-300',
    tags: 'bg-rose-100 text-rose-800',
    icon: 'fa-briefcase',
    button: 'bg-rose-600 hover:bg-rose-700'
  },
  student: {
    bg: 'bg-gradient-to-r from-amber-500 to-amber-600', 
    text: 'text-amber-50',
    accent: 'text-amber-300',
    tags: 'bg-amber-100 text-amber-800',
    icon: 'fa-graduation-cap',
    button: 'bg-amber-600 hover:bg-amber-700'
  },
  company: {
    bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
    text: 'text-orange-50',
    accent: 'text-orange-300',
    tags: 'bg-orange-100 text-orange-800',
    icon: 'fa-building',
    button: 'bg-orange-600 hover:bg-orange-700'
  },
  default: {
    bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
    text: 'text-gray-50',
    accent: 'text-gray-400',
    tags: 'bg-gray-100 text-gray-800',
    icon: 'fa-user',
    button: 'bg-gray-600 hover:bg-gray-700'
  }
}

  const { bg, text, accent, tags, icon } = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.default;

  return (
    <div className="flex flex-col h-full rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
      {/* Header Section */}
      <div className={`${bg} p-4 ${text}`}>
        <div className="flex items-start justify-between">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-sm bg-white flex items-center justify-center">
              {user.profile_image ? (
                <img 
                  src={getProfileImage()}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                 <FontAwesomeIcon
                    icon={
                      user.role === 'student'
                        ? faGraduationCap
                        : user.role === 'professional'
                        ? faUser
                        : user.role === 'company'
                        ? faBuilding
                        : faUser
                    }
                    className="text-gray-500 w-6 h-6"
                  />
              )}
            </div>
            {Boolean(user.isexpert) && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 text-white rounded-full shadow-sm flex items-center justify-center">
                <FontAwesomeIcon icon={faMedal} className="text-xs" />
              </div>

            )}
          </div>

          {/* Role Badge */}
          <span className={`px-2.5 py-1 text-xs rounded-full bg-orange-200  backdrop-blur-sm ${text} font-medium`}>
            {t(`roles.${user.role}`)}
          </span>
        </div>

        {/* Name and Title */}
        <div className="mt-4 space-y-1">
          <h3 className="font-bold text-lg leading-tight">{user.name}</h3>
          <p className="text-sm opacity-90 leading-tight">
            {user.mainfield || user.bio?.professional_info?.title}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-grow p-4 bg-white">
        {/* Location and Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <i className={`fas fa-map-marker-alt mr-2 ${accent}`}></i>
            <span>
              {[user.city, user.country].filter(Boolean).join(', ')}
            </span>
          </div>
          {Boolean(user.isjobseek) &&(
            <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full">
              <FontAwesomeIcon icon={faSearch} className="mr-1" />
              {t('seeking')}
            </span>
          )}
        </div>

        {/* Summary */}
        <div className="mb-4">
          <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
            {getSummary()}
          </p>
        </div>

        {/* Role-Specific Details */}
        <div className="space-y-3">
          {/* Professional Experience */}
          {user.role === 'professional' && user.bio?.professional_info && (
            <div className="flex items-center text-sm text-gray-600">
              <i className={`fas ${icon} mr-2 ${accent}`}></i>
              <span>
                {t('professional.yearsExperience', { 
                  years: user.bio.professional_info.years_experience 
                })}
              </span>
            </div>
          )}

          {/* Student Education */}
          {user.role === 'student' && user.bio?.academic_info && (
            <div className="flex items-center text-sm text-gray-600">
              <i className={`fas ${icon} mr-2 ${accent}`}></i>
              <span>
                {user.bio.academic_info.institution} • {user.bio.academic_info.year}
              </span>
            </div>
          )}

          {/* Company Info */}
          {user.role === 'company' && user.bio?.company_info && (
            <div className="flex items-center text-sm text-gray-600">
              <i className={`fas ${icon} mr-2 ${accent}`}></i>
              <span>
                {t('company.companySize', { 
                  size: user.bio.company_info.company_size 
                })}
              </span>
            </div>
          )}

          {/* Skills/Positions */}
          {(user.bio?.professional_info?.skills || 
            user.bio?.skills_learning || 
            user.bio?.hiring_needs?.open_positions) && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {user.role === 'professional' ? t('professional.topSkills') :
                 user.role === 'student' ? t('student.topSkills') :
                 t('company.openPositions')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(user.role === 'professional' ? 
                  user.bio?.professional_info?.skills.slice(0, 3) :
                  user.role === 'student' ?
                  user.bio?.skills_learning?.slice(0, 3) :
                  user.bio?.hiring_needs?.open_positions?.slice(0, 3))?.map((item, index) => {
    
    // استخلاص النص الآمن للعرض
    const label =
      typeof item === 'string' ? item :
      'name' in item ? item.name :
      'title' in item ? item.title :
      ''; // fallback

    return (
      <span key={index} className={`px-2.5 py-1 text-xs rounded-full ${tags}`}>
        {label}
      </span>
    );
  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between space-x-3">
          <Link
            href={`/homePage/members/${user.id}`}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium text-center ${bg} ${text} hover:opacity-90 transition-opacity`}
          >
            {t('viewProfile')}
          </Link>
          <button className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium text-center border ${text} ${bg} bg-opacity-0 hover:bg-opacity-10 transition-colors`}>
            {user.role === 'company' ? t('contact') : t('message')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;