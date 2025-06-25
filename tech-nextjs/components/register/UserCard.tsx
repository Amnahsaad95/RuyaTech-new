'use client'

import React from 'react';
import { User } from '@/types/user';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const t = useTranslations('home');

  const getSummary = () => {
    if (!user.bio) return t('noSummary');
    return user.bio.summary || t('noSummary');
  };

  const getProfileImage = () => {
    if (user.profile_image) {
      return typeof user.profile_image === 'string' 
        ? `http://127.0.0.1:8000/storage/${user.profile_image}` 
        : '/default-avatar.png';
    }
    return '/default-avatar.png';
  };

  const getRoleColor = () => {
    switch(user.role) {
      case 'professional':
        return 'bg-indigo-100 text-indigo-800';
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'company':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300" 
         data-role={user.role?.toLowerCase()} 
         data-expert={user.isexpert?.toString()} 
         data-jobseek={user.isjobseek?.toString()}>
      <div className="p-6">
        <div className="flex items-start mb-4">
           <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md mr-4 group-hover:shadow-lg transition-shadow">
              <img 
                src={getProfileImage()} 
                alt={`${user.name}'s profile`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.png';
                }}
              />
            </div>
            {user.isexpert && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                {user.mainfield && (
                  <p className="text-indigo-600 font-medium">{user.mainfield}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor()}`}>
                  {user.role ? t(`roles.${user.role.toLowerCase()}`) : t('roles.user')}
                </span>
                {user.isjobseek && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    {t('seeking')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {(user.city || user.country) && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>{user.city}{user.city && user.country ? ', ' : ''}{user.country}</span>
          </div>
        )}
        
        <div className="summary-container mb-4 cursor-pointer" onClick={(e) => e.currentTarget.classList.toggle('summary-expanded')}>
          <p className="text-gray-600">{getSummary()}</p>
        </div>

        {user.role === 'student' && user.bio?.academic_info && (
          <>
            {user.bio?.skills_learning && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('student.topSkills')}</h4>
                <div className="flex flex-wrap gap-2">
                  {user.bio.skills_learning.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              {user.bio?.academic_info && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-xs text-gray-500">{user.bio.academic_info.year}</span>
                </div>
              )}
            </div>
          </>
        )}

        {user.role === 'professional' && user.bio?.professional_info && (
          <>
            {user.bio?.professional_info && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('professional.topSkills')}</h4>
                <div className="flex flex-wrap gap-2">
                  {user.bio?.professional_info.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              {user.bio?.professional_info && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-xs text-gray-500">
                    {t('professional.yearsExperience', { years: user.bio.professional_info.years_experience })}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {user.role === 'company' && user.bio?.company_info && (
          <>
            {user.bio?.company_info && user.bio?.hiring_needs && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('company.openPositions')}</h4>
                <div className="flex flex-wrap gap-2">
                  {user.bio?.hiring_needs?.open_positions?.map((position, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                      {position.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              {user.bio?.company_info && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-xs text-gray-500">
                    {t('company.companySize', { size: user.bio.company_info.company_size })}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        <Link
          href={`/homePage/members/hh/${user.id}`}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
        >
          {t('viewProfile')}
          <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </Link>
      </div>
      
      <style jsx>{`
        .summary-container {
          height: 3.6em;
          overflow: hidden;
          position: relative;
        }
        .summary-container::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1.2em;
          background: linear-gradient(to bottom, rgba(255,255,255,0), white);
        }
        .summary-expanded {
          height: auto;
          overflow-y: auto;
          max-height: 200px;
        }
        .summary-expanded::after {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default UserCard;