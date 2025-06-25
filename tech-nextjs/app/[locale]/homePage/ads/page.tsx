'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAd } from '@/services/hooks/useAd';
import { useLocale, useTranslations } from 'next-intl';

export default function AddNewAd() {
  const router = useRouter();
  const t = useTranslations('home');
  const locale = useLocale();
  const { ad, loading, error, saveAd } = useAd();

  const [FullName, setFullName] = useState('');
  const [ad_Url, setAdUrl] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [start_date, setStartDate] = useState<string>('');
  const [End_date, setEndDate] = useState<string>('');
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSaveMessage(t('savingStatus_Ads.saving'));
    
    try {
      const savedAd = await saveAd({
        FullName,location,ad_Url,
        End_date,
        start_date,
      }, locale,image);
      
      
      setSuccessMessage(t('savingStatus_Ads.saved'));
      setFullName('');
      
      setImagePreview('');
      setLocation('');
      setAdUrl('');
      setStartDate('');
      setEndDate('');
    } catch (err:any) {
      if (err.errors) {
        setFieldErrors(err.errors);
      } 
      setSaveMessage(t('savingStatus_Ads.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8" >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">{t('titleAds')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('subtitleAds')}</p>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{saveMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 divide-y divide-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="FullName" className="block text-sm font-medium text-gray-700">
                    {t('form.fullName.label')} *
                  </label>
                  <input
                    type="text"
                    id="FullName"
                    name="FullName"
                    value={FullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t('form.fullName.placeholder')}
                  />
                  {fieldErrors.FullName && (<p className="text-red-500 text-sm">{fieldErrors.FullName[0]}</p>)}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('form.image.label')} *
                  </label>
                  {fieldErrors.image && (<p className="text-red-500 text-sm">{fieldErrors.image[0]}</p>)}
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <>
                        <div className="relative">
                          <img src={imagePreview} alt={t('form.image.previewAlt')} className="mx-auto h-48 object-contain rounded-md" />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-0 right-0 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          
                        </div>
                        </>
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="Image"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>{t('form.image.uploadText')}</span>
                              <input
                                id="Image"
                                name="Image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                                className="sr-only"
                              />
                              
                            </label>
                            <p className="pl-1">{t('form.image.dragText')}</p>
                          </div>
                          <p className="text-xs text-gray-500">{t('form.image.fileTypes')}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ad URL */}
                <div>
                  <label htmlFor="ad_Url" className="block text-sm font-medium text-gray-700">
                    {t('form.url.label')} *
                  </label>
                  <input
                    type="url"
                    id="ad_Url"
                    name="ad_Url"
                    value={ad_Url}
                    onChange={(e) => setAdUrl(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t('form.url.placeholder')}
                  />
                  {fieldErrors.location && (
                    <p className="text-red-500 text-sm">{fieldErrors.location[0]}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    {t('form.location.label')}
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t('form.location.placeholder')}
                  />
                  {fieldErrors.ad_Url && (
                    <p className="text-red-500 text-sm">{fieldErrors.ad_Url[0]}</p>
                  )}
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                      {t('form.startDate.label')} *
                    </label>
                    <input
                      type="date"
                      id="start_date"
                      name="start_date"
                      value={start_date}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {fieldErrors.start_date && (
                    <p className="text-red-500 text-sm">{fieldErrors.start_date[0]}</p>
                  )}
                  </div>
                  <div>
                    <label htmlFor="End_date" className="block text-sm font-medium text-gray-700">
                      {t('form.endDate.label')} *
                    </label>
                    <input
                      type="date"
                      id="End_date"
                      name="End_date"
                      value={End_date}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {fieldErrors.End_date && (
                    <p className="text-red-500 text-sm">{fieldErrors.End_date[0]}</p>
                  )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-4 bg-gray-50 text-right space-x-2 sm:px-6 ">
              <button
                type="button"
                onClick={() => router.back()}
                className="mr-3 inline-flex gap-2 items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('buttons.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('buttons.creating')}
                  </>
                ) : (
                  t('buttons.create')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}