'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { FaLock, FaHome, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ForbiddenPage() {
  const t = useTranslations('admin');
  const router = useRouter();
  const locale = useLocale();

  const rtlStyles = {
    direction: locale === 'ar' ? 'rtl' : 'ltr',
    textAlign: locale === 'ar' ? 'right' : 'left',
  };

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6 ${rtlStyles}`}
      
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl  overflow-hidden"
      >
        <div className="bg-primary-600 p-6 text-center">
          <div className="flex justify-center">
            <FaLock className="text-white text-6xl animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-white mt-4">403</h1>
          <p className="text-primary-100 mt-2">{t('Forbidden.title')}</p>
        </div>

        <div className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">{t('Forbidden.heading')}</h2>
            <p className="text-gray-600 mt-4">{t('Forbidden.description')}</p>
          </div>

          <div className="mt-8 flex flex-col space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/homePage')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FaHome />
              {t('Forbidden.goHome')}
            </motion.button>

          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 text-center text-gray-500"
      >
      </motion.div>
    </div>
  );
}