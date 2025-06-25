'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faMicrochip } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/services/context/AuthContext';
import { useTranslations } from 'next-intl';
import { useLocale } from "next-intl";
import { 
  FaTachometerAlt, 
  FaNewspaper, 
  FaUsers, 
  FaAd, 
  FaCog, 
  FaSignOutAlt, 
  FaSearch, 
  FaEnvelope, 
  FaBell, 
  FaUser,
  FaBars, 
  FaPlusCircle, 
  FaUserPlus, 
  FaChartLine 
} from 'react-icons/fa';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin');

  const rtlStyles = {
    margin: locale === 'ar' ? 'mr-3' : 'ml-3',
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
    textAlign: locale === 'ar' ? 'right' : 'left',
    spaceX: locale === 'ar' ? 'space-x-reverse' : 'space-x-3'
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login'); 
    }
  }, [loading, user]);

  if (loading || !user) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Skeleton Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-gradient-to-b from-primary-800 to-primary-900">
            <div className="h-16 bg-primary-900 animate-pulse"></div>
            <div className="p-8 space-y-6">
              <div className="h-24 rounded-full bg-primary-700 animate-pulse"></div>
              <div className="h-4 bg-primary-700 rounded animate-pulse"></div>
              <div className="h-3 bg-primary-700 rounded animate-pulse"></div>
            </div>
            <div className="px-4 py-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-primary-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Skeleton Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="h-16 bg-white border-b border-gray-200 animate-pulse"></div>
          <main className="flex-1 p-6 space-y-6">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-1/3"></div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      {/* Mobile sidebar */}
      <div className={`md:hidden ${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-40`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex flex-col w-80 max-w-xs h-full bg-gradient-to-b from-primary-800 to-primary-900">
          <div className="flex items-center justify-center h-16 px-4 bg-primary-900">
            <span className="text-white text-xl font-bold">{t('adminPanel')}</span>
          </div>
          <div className={`flex gap-2 items-center ${rtlStyles.spaceX}`}>
            <FontAwesomeIcon 
              icon={faMicrochip} 
              className="text-amber-200 text-xl transform hover:rotate-45 transition duration-500" 
            />
            <span className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-rose-200">
              {locale === 'ar' ? 'تيك رؤيا' : 'Rüya'}<span className="font-light">{locale === 'ar' ? '' : 'Tech'}</span>
            </span>
          </div>
          <MobileSidebarContent currentPath={pathname} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gradient-to-b from-primary-800 to-primary-900">
          <div className="flex items-center justify-center h-16 px-4 gap-2 bg-primary-900">
            <span className="text-white text-xl font-bold gap-2">
              <FontAwesomeIcon 
              icon={faMicrochip} 
              className="text-xl transform hover:rotate-45 gap-2 transition duration-500" 
            />
            {locale === 'ar' ? 'تيك رؤيا' : 'Rüya'}{locale === 'ar' ? '' : 'Tech'}
            </span>
          </div>
          <DesktopSidebarContent currentPath={pathname} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
          <button 
            className="md:hidden text-gray-500 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars className="text-xl" />
          </button>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input 
                type="text" 
                className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-primary-300 focus:ring-0" 
                placeholder={t('searchPlaceholder')}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none relative">
              <FaEnvelope className="text-lg" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none relative">
              <FaBell className="text-lg" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-yellow-500"></span>
            </button>
            <div className="relative">
              <button className="flex items-center focus:outline-none">
                <img 
                  className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm" 
                  src={user.profile_image 
                    ? `http://localhost:8000/storage/${user.profile_image}`
                    : '/images/default-avatar.jpg'}
                  alt={t('userProfileAlt')}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/default-avatar.jpg';
                  }}
                />
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

function DesktopSidebarContent({ currentPath }: { currentPath: string }) {
  const { user, logout } = useAuth();
  const t = useTranslations('admin');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <>
      <div className="flex flex-col items-center py-8 border-b border-primary-700">
        <div className="relative">
          <img 
            className="h-20 w-20 rounded-full border-4 border-secondary-500 object-cover shadow-md"
            src={user?.profile_image 
              ? `http://localhost:8000/storage/${user.profile_image}`
              : '/images/default-avatar.jpg'}
            alt={t('adminProfileAlt')}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/default-avatar.jpg';
            }}
          />
          <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-500 ring-2 ring-white"></span>
        </div>
        <h3 className="mt-4 text-lg font-medium text-white">{user?.name}</h3>
        <p className="text-sm text-primary-200 capitalize">{user?.role}</p>
      </div>
      <div className="flex gap-4 md:gap-6 flex-col flex-grow px-4 py-4 overflow-y-auto space-x-2">
        <nav className="flex-1 space-y-2 gap-4 md:gap-6">
          <NavLink 
            href="/admin" 
            icon={
              <span className="flex items-center gap-2">
                <FaTachometerAlt />
              </span>
            }
            active={isActive('/admin')}
            text={t('dashboard')}
          />
          <NavLink 
            href="/admin/posts" 
            icon={
              <span className="flex items-center gap-2">
                <FaNewspaper />
              </span>
            }
            active={isActive('/admin/posts')}
            text={t('posts')}
          />
          <NavLink 
            href="/admin/members" 
            icon={
              <span className="flex items-center gap-2">
                <FaUsers />
              </span>
            }
            active={isActive('/admin/members')}
            text={t('members')}
          />
          <NavLink 
            href="/admin/ads" 
            icon={
              <span className="flex items-center gap-2">
                <FaAd />
              </span>
            }
            active={isActive('/admin/ads')}
            text={t('ads')}
          />
          <NavLink 
            href="/admin/profile" 
            icon={
              <span className="flex items-center gap-2">
                <FaUser />
              </span>
            }
            active={isActive('/admin/profile')}
            text={t('profile')}
          />
          <NavLink 
            href="/admin/settings" 
            icon={
              <span className="flex items-center gap-2">
                <FaCog />
              </span>
            }
            active={isActive('/admin/settings')}
            text={t('settings')}
          />
        </nav>

        <div className="mt-auto mb-4 px-4 gap-4 md:gap-6">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 gap-2 md:gap-4 text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 rounded-lg transition duration-150"
          >
            <FaSignOutAlt  />
            {t('logout')}
          </button>
        </div>
      </div>
    </>
  );
}

function MobileSidebarContent({ currentPath }: { currentPath: string }) {
  const { user, logout } = useAuth();
  const t = useTranslations('admin');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <>
      <div className="flex flex-col items-center py-8 border-b border-primary-700">
        <div className="relative">
          <img 
            className="h-20 w-20 rounded-full border-4 border-secondary-500 object-cover shadow-md"
            src={user?.profile_image 
              ? `http://localhost:8000/storage/${user.profile_image}`
              : '/images/default-avatar.jpg'}
            alt={t('adminProfileAlt')}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/default-avatar.jpg';
            }}
          />
          <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-500 ring-2 ring-white"></span>
        </div>
        <h3 className="mt-4 text-lg font-medium text-white">{user?.name}</h3>
        <p className="text-sm text-primary-200 capitalize">{user?.role}</p>
      </div>
      <div className="flex gap-4 md:gap-6 flex-col flex-grow px-4 py-4 overflow-y-auto">
        <nav className="flex-1 space-y-2 gap-4 md:gap-6">
            <NavLink 
              href="/admin" 
              icon={
                <span className="flex items-center gap-2">
                  <FaTachometerAlt />
                </span>
              }
              active={isActive('/admin')}
              text={t('dashboard')}
            />
            <NavLink 
              href="/admin/posts" 
              icon={
                <span className="flex items-center gap-2">
                  <FaNewspaper />
                </span>
              }
              active={isActive('/admin/posts')}
              text={t('posts')}
            />
            <NavLink 
              href="/admin/members" 
              icon={
                <span className="flex items-center gap-2">
                  <FaUsers />
                </span>
              }
              active={isActive('/admin/members')}
              text={t('members')}
            />
            <NavLink 
              href="/admin/ads" 
              icon={
                <span className="flex items-center gap-2">
                  <FaAd />
                </span>
              }
              active={isActive('/admin/ads')}
              text={t('ads')}
            />
            <NavLink 
              href="/admin/settings" 
              icon={
                <span className="flex items-center gap-2">
                  <FaCog />
                </span>
              }
              active={isActive('/admin/settings')}
              text={t('settings')}
            />
          </nav>

        <div className="mt-auto mb-4 px-4">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 gap-4 md:gap-6 text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 rounded-lg transition duration-150"
          >
            <FaSignOutAlt className="gap-4 md:gap-6" />
            {t('logout')}
          </button>
        </div>
      </div>
    </>
  );
}

function NavLink({ href, icon, active, text }: { 
  href: string, 
  icon: React.ReactNode, 
  active: boolean, 
  text: string 
}) {
  return (
    <a 
      href={href}
      className={`flex gap-2 items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        active 
          ? 'text-white bg-primary-700' 
          : 'text-primary-200 hover:text-white hover:bg-primary-700'
      }`}
    >
      {icon}
      {text}
    </a>
  );
}