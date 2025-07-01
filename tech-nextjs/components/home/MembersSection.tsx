'use client'

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import{User } from '@/types/user'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUser, faUserGraduate, faUserTie } from '@fortawesome/free-solid-svg-icons';


export default function MembersSection({ data }: { data: User[] }) {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const members=data;
  console.log(data);
  const t = useTranslations('home');
 const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (loading) {
    return (
      <div className="bg-amber-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600 mb-4"></div>
          <p className="text-amber-800">Loading members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-amber-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 bg-amber-100 inline-block px-4 py-2 rounded-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3 text-amber-900">
            {t('title')}
          </h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto mb-4"></div>
          <p className="text-amber-800 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        
        {members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map(member => (
              <div 
                key={member.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-28 flex items-center justify-center relative">
                  <div className="absolute -bottom-12">
                    <div className="relative">
                      {member.profile_image ? (
                          <img
                            src={`${API_URL}/storage/${member.profile_image}`}
                            alt={member.name}
                            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
                            width={96}
                            height={96}
                            
                          />
                        ) : <div
                          id={`icon-${member.id}`}
                          className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center shadow-md text-3xl text-gray-500"
                          style={{ display: member.profile_image ? 'none' : 'flex' }}
                        >
                          {member.role === 'student' && <FontAwesomeIcon icon={faUserGraduate} />}
                          {member.role === 'professional' && <FontAwesomeIcon icon={faUserTie} />}
                          {member.role === 'company' && <FontAwesomeIcon icon={faBuilding} />}
                          {!member.role && <FontAwesomeIcon icon={faUser} />}
                        </div>}

                        

                      {Boolean(member.isexpert) && (
                        <div className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-16 pb-6 px-5 text-center">
                  <h3 className="font-bold text-xl text-amber-900 mb-1">{member.name}</h3>
                  <p className="text-amber-700 text-sm font-medium">{member.role}</p>
                  <div className="flex items-center justify-center mt-2 text-amber-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs">{member.country}</span>
                  </div>
                  {member.mainfield && (
                    <div className="mt-4">
                      <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {member.mainfield}
                      </span>
                    </div>
                  )}
                  <div className="mt-6 flex justify-center space-x-3">
                    <button className="text-amber-600 hover:text-amber-800 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </button>
                    <button className="text-amber-600 hover:text-amber-800 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-amber-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-xl font-medium text-amber-800 mb-2">No Members Found</h3>
            <p className="text-amber-600 max-w-md mx-auto">We couldn't find any members at the moment. Please check back later.</p>
          </div>
        )}
        
        <div className="text-center mt-14">
          <a href='/homePage/members' className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            Explore All Members
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}