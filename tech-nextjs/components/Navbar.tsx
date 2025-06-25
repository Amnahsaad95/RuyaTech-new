import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { User } from '../../types/user';

interface NavbarProps {
  currentUser?: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const { t } = useTranslation('common');
  
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                {t('appName')}
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/users" 
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                {t('users')}
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {currentUser ? (
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <Link href="/settings" className="text-gray-500 hover:text-gray-700 mr-4">
                    {t('settings')}
                  </Link>
                  
                  <div className="flex items-center">
                    {currentUser.profile_image && typeof currentUser.profile_image === 'string' && (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={currentUser.profile_image}
                        alt={currentUser.name}
                      />
                    )}
                    <span className="ml-2 text-sm font-medium text-gray-700">{currentUser.name}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Link 
                  href="/login" 
                  className="text-gray-500 hover:text-gray-700 mr-4"
                >
                  {t('login')}
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
