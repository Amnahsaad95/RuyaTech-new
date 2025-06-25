'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Setting } from '@/types/setting'
import { useAuth } from '@/services/context/AuthContext'
import { useLocale, useTranslations } from 'next-intl'

type FormData = Omit<Setting, 'id'>

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [currentLang, setCurrentLang] = useState('en')
  const [formDataState, setFormDataState] = useState<Record<string, File | null>>({})
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set())

  const router = useRouter();
   const locale = useLocale();
  const { token } = useAuth()
  const t = useTranslations('admin.siteSettings')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        const response = await fetch('http://127.0.0.1:8000/api/settings', {
          method: 'GET',
          headers,
          credentials: 'include',
        })
        if (!response.ok) {
          throw new Error('Failed to fetch settings')
        }
        const data = await response.json()
        setSettings(data)
        reset(data)
      } catch (error) {
        console.error('Error fetching settings:', error)
        toast.error('Failed to load settings')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [reset, token])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()

      modifiedFields.forEach(field => {
        if (field in data && data[field] !== null && data[field] !== undefined) {
          formData.append(field, data[field].toString())
        }
      })

      for (const [key, file] of Object.entries(formDataState)) {
        if (file) {
          formData.append(key, file)
          modifiedFields.add(key)
        }
      }

      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('http://127.0.0.1:8000/api/settings', {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        const result = await response.json()
        console.error('Failed to update settings:', result)
        throw new Error('Failed to update settings')
      }

      const updatedSettings = await response.json()
      setSettings(updatedSettings)
      setModifiedFields(new Set())
      toast.success('Settings updated successfully!')
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormDataState(prev => ({
        ...prev,
        [field]: file,
      }))
    }
  }

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setModifiedFields(prev => new Set(prev).add(field))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const dir = (locale === "ar" ? "rtl" : "ltr")

  return (
    <div className={`min-h-screen bg-gray-50 ${dir === 'rtl' ? 'text-right' : 'text-left'}`} dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">{t('title')}</h1>
              
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {(['general', 'social', 'intro'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t(`tabs.${tab}`)}
                </button>
              ))}
            </nav>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {t('general.title')}
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="site_name" className="block text-sm font-medium text-gray-700">
                      {t('general.siteNameEn')}
                    </label>
                    <input
                      type="text"
                      id="site_name"
                      {...register('site_name', { required: t('validation.siteNameRequired') })}
                      onChange={handleInputChange('site_name')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.site_name && (
                      <p className="mt-2 text-sm text-red-600">{errors.site_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="site_name_Ar" className="block text-sm font-medium text-gray-700">
                      {t('general.siteNameAr')}
                    </label>
                    <input
                      type="text"
                      id="site_name_Ar"
                      {...register('site_name_Ar', { required: t('validation.siteNameArRequired') })}
                      onChange={handleInputChange('site_name_Ar')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      dir="rtl"
                    />
                    {errors.site_name_Ar && (
                      <p className="mt-2 text-sm text-red-600">{errors.site_name_Ar.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                      {t('general.siteDescriptionEn')}
                    </label>
                    <textarea
                      id="siteDescription"
                      {...register('siteDescription')}
                      onChange={handleInputChange('siteDescription')}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="siteDescriptionAr" className="block text-sm font-medium text-gray-700">
                      {t('general.siteDescriptionAr')}
                    </label>
                    <textarea
                      id="siteDescriptionAr"
                      {...register('siteDescriptionAr')}
                      onChange={handleInputChange('siteDescriptionAr')}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('general.siteIcon')}
                    </label>
                    <div className="mt-1 flex items-center">
                      {formDataState.site_icon ? (
                        <img
                          src={URL.createObjectURL(formDataState.site_icon)}
                          alt="Site Icon"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : settings?.site_icon ? (
                        <img
                          src={`http://127.0.0.1:8000/storage/${settings.site_icon}`}
                          alt="Site Icon"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <label className="ml-4 cursor-pointer gap-2">
                        <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          {t('general.change')}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={e => handleImageUpload(e, 'site_icon')}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('general.siteLogo')}
                    </label>
                    <div className="mt-1 flex items-center">
                      {formDataState.site_logo ? (
                        <img
                          src={URL.createObjectURL(formDataState.site_logo)}
                          alt="Site Logo"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : settings?.site_logo ? (
                        <img
                          src={`http://127.0.0.1:8000/storage/${settings.site_logo}`}
                          alt="Site Logo"
                          className="h-12 object-cover"
                        />
                      ) : (
                        <div className="h-12 w-32 bg-gray-200 flex items-center justify-center">
                          <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <label className="ml-4 cursor-pointer">
                        <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          {t('general.change')}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={e => handleImageUpload(e, 'site_logo')}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="site_location" className="block text-sm font-medium text-gray-700">
                    {t('general.location')}
                  </label>
                  <input
                    type="text"
                    id="site_location"
                    {...register('site_location')}
                    onChange={handleInputChange('site_location')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {t('social.title')}
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="facebook_url" className="block text-sm font-medium text-gray-700">
                      {t('social.facebook')}
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        https://
                      </span>
                      <input
                        type="text"
                        id="facebook_url"
                        {...register('facebook_url')}
                        onChange={handleInputChange('facebook_url')}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="facebook.com/yourpage"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-700">
                      {t('social.instagram')}
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        https://
                      </span>
                      <input
                        type="text"
                        id="instagram_url"
                        {...register('instagram_url')}
                        onChange={handleInputChange('instagram_url')}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="instagram.com/yourpage"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sitemail" className="block text-sm font-medium text-gray-700">
                      {t('social.email')}
                    </label>
                    <input
                      type="email"
                      id="sitemail"
                      {...register('sitemail')}
                      onChange={handleInputChange('sitemail')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="contact@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700">
                      {t('social.whatsapp')}
                    </label>
                    <input
                      type="text"
                      id="whatsapp_number"
                      {...register('whatsapp_number')}
                      onChange={handleInputChange('whatsapp_number')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'intro' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {t('intro.title')}
                </h2>

                {[1, 2, 3].map(num => (
                  <div key={num} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-gray-800 mb-3">
                      {t('intro.section', { num })}
                    </h3>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`intro_title_${num}`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t('intro.titleEn')}
                        </label>
                        <input
                          type="text"
                          id={`intro_title_${num}`}
                          {...register(`intro_title_${num}` as keyof FormData)}
                          onChange={handleInputChange(`intro_title_${num}`)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <br/>
                      <div>
                        <label
                          htmlFor={`intro_image_${num}`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t('intro.image')}
                        </label>
                        <div className="mt-1">
                          {formDataState[`intro_image_${num}`] ? (
                            <img
                              src={URL.createObjectURL(formDataState[`intro_image_${num}`]!)}
                              alt={`Intro ${num}`}
                              className="h-32 w-full object-cover rounded-md"
                            />
                          ) : settings?.[`intro_image_${num}` as keyof Setting] ? (
                            <img
                              src={`http://127.0.0.1:8000/storage/${settings[`intro_image_${num}` as keyof Setting] as string}`}
                              alt={`Intro ${num}`}
                              className="h-32 w-full object-cover rounded-md"
                            />
                          ) : (
                            <div className="h-32 w-full bg-gray-200 rounded-md flex items-center justify-center">
                              <svg
                                className="h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                          <label className="mt-2 cursor-pointer block">
                            <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              {t('intro.changeImage')}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={e => handleImageUpload(e, `intro_image_${num}` as keyof FormData)}
                            />
                          </label>
                        </div>
                      </div>

                      
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor={`intro_text_${num}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t('intro.textEn')}
                      </label>
                      <textarea
                        id={`intro_text_${num}`}
                        {...register(`intro_text_${num}` as keyof FormData)}
                        onChange={handleInputChange(`intro_text_${num}`)}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
                      <div>
                        <label
                          htmlFor={`intro_title_${num}_Ar`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t('intro.titleAr')}
                        </label>
                        <input
                          type="text"
                          id={`intro_title_${num}_Ar`}
                          {...register(`intro_title_${num}_Ar` as keyof FormData)}
                          onChange={handleInputChange(`intro_title_${num}_Ar`)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          dir="rtl"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor={`intro_text_${num}_Ar`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t('intro.textAr')}
                      </label>
                      <textarea
                        id={`intro_text_${num}_Ar`}
                        {...register(`intro_text_${num}_Ar` as keyof FormData)}
                        onChange={handleInputChange(`intro_text_${num}_Ar`)}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        dir="rtl"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 border-t border-gray-200 pt-5">
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('buttons.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t('buttons.saving')}
                    </>
                  ) : (
                    t('buttons.save')
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}