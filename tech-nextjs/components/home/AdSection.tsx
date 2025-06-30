'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Ad } from '@/types/ad';
import { useAd } from '@/services/hooks/useAd';

export default function AdSection({ data }: { data: Ad[] }) {
  const t = useTranslations('home');
  
  const locale = useLocale(); 
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { increaseView } = useAd();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!data || data.length === 0) {
    return <div className="text-center py-8">{t('noAdsAvailable')}</div>;
  }

  const ads = data.filter((ad:Ad) => ad.status=='published');

  // Auto-rotate ads
  useEffect(() => {
    if (ads.length <= 1) return;

    //console.log(ads);
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [ads.length]);

  if (isLoading) {
    return <div className="text-center py-8">{t('loadingAds')}</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{t('error')}: {error}</div>;
  }

  const currentAd = ads[currentAdIndex];


  return (
    <div className="max-w-4xl mx-auto my-8 rounded-xl overflow-hidden shadow-lg" >
      <div className="relative h-96 w-full">
        {/* Ad Image */}
        <img
          src={`${API_URL}/storage/${currentAd.Image}`}
          alt={currentAd.FullName}
          className="object-cover w-full h-full"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent text-white p-6" ></div>
        
        {/* Ad Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className={`flex justify-between items-start ${dir ? 'flex-row-reverse' : ''}`}>
            <div className={dir ? 'text-right' : 'text-left'}>
              <p className="text-sm opacity-90">
                {t('sponsoredBy')}: {currentAd.FullName}
              </p>
            </div>
            <div className={`flex items-center ${dir ? 'space-x-reverse space-x-2' : 'space-x-2'} bg-black/30 px-3 py-1 rounded-full`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="text-xs">
                {currentAd.hit?.toLocaleString()} {t('views')}
              </span>
            </div>
          </div>
          
          <a
            href={currentAd.ad_Url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => increaseView(currentAd)}
            className={`mt-4 inline-flex items-center px-4 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-100 transition-colors ${dir ? 'flex-row-reverse' : ''}`}
          >
            {t('visitWebsite')}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${dir ? 'mr-1 rotate-180' : 'ml-1'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
        
        {/* Navigation Dots */}
        {ads.length > 1 && (
          <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex ${dir ? 'flex-row-reverse space-x-reverse' : ''} space-x-2`}>
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentAdIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={t('goToAd', { number: index + 1 })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}