'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { getPublishedAds, getDraftAds, fetchAds, getPendingAds,deleteAd } from '@/services/context/AdsContext';
import { Ad } from '@/types/ad';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useAd } from '@/services/hooks/useAd';

const ITEMS_PER_PAGE = 10;

export default function Ads() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const {  publishAd, unpublishAd, rejectedAd } = useAd(); 
  const [allAds, setAllAds] = useState<Ad[]>([]);
  const [publishedAds, setPublishedAds] = useState<Ad[]>([]);
  const [pendingAds, setPendingAds] = useState<Ad[]>([]);
  const [unpublishedAds, setUnpublishedAds] = useState<Ad[]>([]);
  const [rejectedAds, setRejectedAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'published' | 'unpublished' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const loadAds = useCallback(async () => {
    setLoading(true);
    try {
      const [all] = await Promise.all([fetchAds()]);

      setAllAds(all);
      setPublishedAds(all.filter(ad => ad.status === 'published'));
      setPendingAds(all.filter(ad => ad.status === 'pending'));
      setUnpublishedAds(all.filter(ad => ad.status === 'unpublished'));
      setRejectedAds(all.filter(ad => ad.status === 'rejected'));
      setError(null);
      setCurrentPage(1);
    } catch (err) {
      setError(t('error_loading_Ad'));
      console.error(err);
    } finally {
      setLoading(false);
    }
    }, [t]);

    useEffect(() => {
    loadAds();
    }, [loadAds]);

  const filterAds = (ads: Ad[]) => {
    return ads.filter(ad => 
      ad.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ad.status && t(`status.${ad.status}`).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getCurrentAds = () => {
    let filteredAds: Ad[] = [];
    
    switch (activeTab) {
      case 'all': filteredAds = filterAds(allAds); break;
      case 'pending': filteredAds = filterAds(pendingAds); break;
      case 'published': filteredAds = filterAds(publishedAds); break;
      case 'unpublished': filteredAds = filterAds(unpublishedAds); break;
      case 'rejected': filteredAds = filterAds(rejectedAds); break;
      default: filteredAds = filterAds(allAds);
    }

    const totalPages = Math.ceil(filteredAds.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedAds = filteredAds.slice(startIndex, endIndex);

    return {
      ads: paginatedAds,
      totalPages,
      totalItems: filteredAds.length
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(locale);
  };

  const renderPagination = (totalPages: number) => {
    if (totalPages <= 1) return null;

    return (
      <div className={`flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('pagination.previous')}
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('pagination.next')}
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              {t('pagination.showing', {
                start: (currentPage - 1) * ITEMS_PER_PAGE + 1,
                end: Math.min(currentPage * ITEMS_PER_PAGE, getCurrentAds().totalItems),
                total: getCurrentAds().totalItems
              })}
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">{t('pagination.first')}</span>
                {isRTL ? (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M3.21 14.77a.75.75 0 01.02-1.06L7.168 10 3.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M16.79 5.23a.75.75 0 01-.02 1.06L12.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">{t('pagination.previous')}</span>
                {isRTL ? (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === page
                      ? "bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">{t('pagination.next')}</span>
                {isRTL ? (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">{t('pagination.last')}</span>
                {isRTL ? (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M16.79 5.23a.75.75 0 01-.02 1.06L12.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M3.21 14.77a.75.75 0 01.02-1.06L7.168 10 3.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const renderAdsTable = (ads: Ad[], totalItems: number) => {
    if (ads.length === 0) {
      return (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">{t('no_ads.title')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('no_ads.description')}</p>
          <div className="mt-6">
            <Link
              href="/homePage/ads"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('no_ads.create_button')}
            </Link>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('table.image')}
                </th>
                <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('table.full_name')}
                </th>
                <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('table.url')}
                </th>
                <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('table.location')}
                </th>
                <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('table.status')}
                </th>
                <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('table.start_date')}
                </th>
                <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('table.end_date')}
                </th>
                <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-left' : 'text-right'}`}>
                  {t('table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <img 
                        className="h-10 w-10 rounded object-cover"
                        src={`http://127.0.0.1:8000/storage/${ad.Image}`}
                        alt={ad.FullName || t('table.alt_image')}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ad.FullName || t('table.untitled_ad')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ad.ad_Url || t('table.no_url')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ad.location || t('table.no_location')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        ad.status === 'published' ? 'bg-green-100 text-green-800' :
                        ad.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        ad.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {t(`status_Ad.${ad.status || 'unpublished'}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(ad.start_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(ad.End_date)}
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                    <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} space-x-3`}>
                      {ad.status === 'published' && (
                        <>
                          <button 
                            className="text-yellow-600 hover:text-yellow-900"
                            title={t('actions_Ad.unpublish')}
                            onClick={async () => {
                                      await unpublishAd(ad)
                                      setTimeout(() => {
                                        loadAds(); // silently refresh
                                      }, 1); 
                                    }}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            title={t('actions_Ad.reject')}
                            onClick={async () => {
                                      await rejectedAd(ad)
                                      setTimeout(() => {
                                        loadAds(); // silently refresh
                                      }, 1); 
                                    }}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            title={t('actions_Ad.delete')}
                            onClick={async () => {
                                      await deleteAd(ad.id)
                                      setTimeout(() => {
                                        loadAds(); // silently refresh
                                      }, 1); 
                                    }}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                      
                      {ad.status === 'pending' && (
                        <>
                          <button 
                            className="text-green-600 hover:text-green-900"
                            title={t('actions_Ad.publish')}
                            onClick={async () => {
                                      await publishAd(ad);
                                      setTimeout(() => {
                                        loadAds(); // silently refresh
                                      }, 1); 
                                    }}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            title={t('actions_Ad.reject')}
                            onClick={async () => {
                                      await rejectedAd(ad)
                                      setTimeout(() => {
                                        loadAds(); // silently refresh
                                      }, 1); 
                                    }}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            title={t('actions_Ad.delete')}
                            onClick={async () => {
                                      await deleteAd(ad.id)
                                      setTimeout(() => {
                                        loadAds(); // silently refresh
                                      }, 1); 
                                    }}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                      
                      {ad.status === 'rejected' && (
                        <>
                          <button 
                            className="text-green-600 hover:text-green-900"
                            title={t('actions_Ad.review')}
                            onClick={async () => {
                                      await publishAd(ad)
                                      setTimeout(() => {
                                        loadAds(); // silently refresh
                                      }, 1); 
                                    }}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            title={t('actions_Ad.delete')}
                            onClick={async () => {
                                      await deleteAd(ad.id)
                                      setTimeout(() => {
                                        loadAds(); // silently refresh
                                      }, 1); 
                                    }}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                      
                      {(!ad.status || ad.status === 'unpublished') && (
                        <button 
                          className="text-red-600 hover:text-red-900"
                          title={t('actions_Ad.delete')}
                          onClick={async () => {
                                      await deleteAd(ad.id)
                                      setTimeout(() => {
                                        loadAds(); // silently refresh
                                      }, 1); 
                                    }}
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination(Math.ceil(totalItems / ITEMS_PER_PAGE))}
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" dir={dir}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto" dir={dir}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('error_Ad.title')}</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  const currentAds = getCurrentAds();

  return (
    <div className="p-4 max-w-6xl mx-auto" dir={dir}>
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 `}>
        <h1 className="text-3xl font-bold text-gray-800">{t('title_Ad')}</h1>
        <div className={`flex flex-col sm:flex-row gap-3 w-full md:w-auto ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className="relative flex-grow max-w-md">
            <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t('search_placeholder')}
              className={`block w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Link 
            href="/homePage/ads" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t('create_button')}
          </Link>
        </div>
      </div>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('all');
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t('tabs.all')}
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {allAds.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('pending');
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t('tabs.pending')}
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pendingAds.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('published');
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'published' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t('tabs.published')}
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {publishedAds.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('unpublished');
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'unpublished' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t('tabs.unpublished')}
            <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {unpublishedAds.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('rejected');
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'rejected' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t('tabs.rejected')}
            <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {rejectedAds.length}
            </span>
          </button>
        </nav>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {renderAdsTable(currentAds.ads, currentAds.totalItems)}
      </div>
    </div>
  );
}