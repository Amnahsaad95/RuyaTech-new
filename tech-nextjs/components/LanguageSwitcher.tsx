import React from 'react';
import {useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const LanguageSwitcher: React.FC = () => {
  const params = useParams();
  const rawLocale = params?.locale;
  const locale = Array.isArray(rawLocale) ? rawLocale[0] : rawLocale ?? 'en';
  const { t } = useTranslation('common');

  const router = useRouter();
  const pathname = usePathname();
  
  const changeLanguage = (newLocale: string) => {
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
     router.push(`/${newLocale}${pathname}`);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          id="language-menu"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {locale === 'ar' ? t('common.arabic') : t('common.english')}
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
        <div className="py-1" role="none">
          <button
            onClick={() => changeLanguage('en')}
            className={`${locale === 'en' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
            role="menuitem"
          >
            {t('common.english')}
          </button>
          <button
            onClick={() => changeLanguage('ar')}
            className={`${locale === 'ar' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
            role="menuitem"
          >
            {t('common.arabic')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
