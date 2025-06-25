'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faGlobe, faMicrochip, faSearch, faUser, faSignOutAlt, faCog } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
//import { useRouter } from 'next/navigation'
//import {useTranslations, useLocale} from 'next-intl';
import {Link} from '@/i18n/navigation';

import { useTransition } from 'react';
 // Correct import
import { useTranslations, useLocale } from 'next-intl'
import { Locale, routing, usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";

const Navbar = ({ isLoggedIn = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('home');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const params = useParams();

  // Set document direction based on locale
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    router.push('/admin/login');
  };

  // Function to switch language
  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  // RTL-aware styles
  const rtlStyles = {
    margin: locale === 'ar' ? 'mr-3' : 'ml-3',
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
    textAlign: locale === 'ar' ? 'right' : 'left',
    spaceX: locale === 'ar' ? 'space-x-reverse' : 'space-x-3'
  };

  return (
    <nav dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`bg-gradient-to-r from-rose-800 to-rose-900 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 border-b border-rose-700/50 ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className={`flex justify-between items-center ${rtlStyles.flexDirection}`}>
          {/* Brand Logo */}
          <div className={`flex gap-2 items-center ${rtlStyles.spaceX}`}>
            <FontAwesomeIcon 
              icon={faMicrochip} 
              className="text-amber-200 text-xl transform hover:rotate-45 transition duration-500" 
            />
            <span className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-rose-200">
              {locale === 'ar' ? 'تيك رؤيا' : 'Rüya'}<span className="font-light">{locale === 'ar' ? '' : 'Tech'}</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center gap-4 md:gap-6 ${rtlStyles.spaceX}`}>
            
            
            <div className={`flex gap-4 md:gap-6 ${rtlStyles.spaceX} space-x-2`}>
              <Link 
                href="/homePage" 
                className="relative group text-rose-100 hover:text-amber-200 transition font-light"
              >
                {t('home')}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-200 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/homePage/members" 
                className="relative group text-rose-100 hover:text-amber-200 transition font-light"
              >
                {t('members')}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-200 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/homePage/posts" 
                className="relative group text-rose-100 hover:text-amber-200 transition font-light "
              >
                {t('posts')}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-200 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/homePage/aboutus" 
                className="relative group text-rose-100 hover:text-amber-200 transition font-light"
              >
                {t('about')}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-200 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            
            <div className={`flex gap-4 md:gap-6 items-center ${rtlStyles.spaceX}`}>
              {/* Language Switcher */}
              <div className="relative">
                <button 
                  onClick={switchLanguage}
                  className="px-3 py-1 rounded-md bg-rose-700/40 hover:bg-rose-600/50 transition flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faGlobe} className="text-amber-200" />
                  {locale === 'en' ? 'العربية' : 'English'}
                </button>
              </div>

              {isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 bg-rose-700/40 hover:bg-rose-600/50 px-3 py-2 rounded-md transition"
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className={`absolute ${locale === 'ar' ? 'left-0' : 'right-0'} mt-2 w-48 bg-rose-800 rounded-md shadow-lg py-1 z-50`}>
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 text-sm hover:bg-rose-700 transition flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faCog} />
                        <span>{t('dashboard')}</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-rose-700 transition flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>{t('logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button className="bg-rose-700/40 hover:bg-amber-500/90 px-4 py-2 rounded-md font-light transition border border-rose-600/50 hover:border-amber-400/50 hover:text-rose-950">
                    {t('sign_in')}
                  </button>
                  <button className="bg-gradient-to-r from-amber-400/90 to-rose-400/90 hover:from-amber-400 hover:to-rose-400 px-4 py-2 rounded-md font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/20">
                    {t('join_now')}
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-xl text-rose-200 hover:text-amber-200 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder={t('search_placeholder')} 
                className={`bg-rose-700/40 border border-rose-600/50 rounded-full px-4 py-2 ${locale === 'ar' ? 'pr-10' : 'pl-10'} text-rose-100 placeholder-rose-300/70 focus:outline-none focus:ring-1 focus:ring-amber-200/30 w-full`}
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className={`absolute ${locale === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-rose-300/70`} 
              />
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link 
                href="/homePage" 
                className="text-rose-200 hover:text-amber-200 px-4 py-2 rounded-lg hover:bg-rose-700/40 transition"
              >
                {t('home')}
              </Link>
              <Link 
                href="/homePage/members" 
                className="text-rose-200 hover:text-amber-200 px-4 py-2 rounded-lg hover:bg-rose-700/40 transition"
              >
                {t('members')}
              </Link>
              <Link 
                href="/homePage/posts" 
                className="text-rose-200 hover:text-amber-200 px-4 py-2 rounded-lg hover:bg-rose-700/40 transition"
              >
                {t('posts')}
              </Link>
              <Link 
                href="/homePage/aboutus" 
                className="text-rose-200 hover:text-amber-200 px-4 py-2 rounded-lg hover:bg-rose-700/40 transition"
              >
                {t('about')}
              </Link>
            </div>
            
            {/* Mobile Language Switcher */}
            <div className="pt-2">
              <button 
                onClick={switchLanguage}
                className="w-full py-2 rounded-md bg-rose-700/40 hover:bg-rose-600/50 transition mb-2 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faGlobe} className="text-amber-200" />
                {locale === 'en' ? 'العربية' : 'English'}
              </button>
            </div>

            {isLoggedIn ? (
              <div className="pt-2 space-y-2">
                <Link 
                  href="/dashboard" 
                  className="block w-full text-center py-2 rounded-md bg-rose-700/40 hover:bg-rose-600/50 transition"
                >
                  {t('dashboard')}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full py-2 rounded-md bg-rose-700/40 hover:bg-rose-600/50 transition flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>{t('logout')}</span>
                </button>
              </div>
            ) : (
              <div className={`flex ${rtlStyles.spaceX} pt-2`}>
                <button className="flex-1 bg-rose-700/40 hover:bg-amber-500/90 px-4 py-2 rounded-md font-light transition border border-rose-600/50 hover:border-amber-400/50 hover:text-rose-950">
                  {t('sign_in')}
                </button>
                <button className="flex-1 bg-gradient-to-r from-amber-400/90 to-rose-400/90 hover:from-amber-400 hover:to-rose-400 px-4 py-2 rounded-md font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/20">
                  {t('join_now')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar