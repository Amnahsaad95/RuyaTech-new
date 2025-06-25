// src/app/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePost } from '@/services/hooks/usePost';
import ReactEditor from '@/components/Editor';
import { ArrowUpTrayIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLocale, useTranslations } from 'next-intl';

export default function NewPost() {
  const router = useRouter();
  const { post, loading, error, savePost, publishPost } = usePost();
  const t = useTranslations("admin");
  const locale = useLocale();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState('');
  const [imageUrl, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);  
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
  
  const handleChange = (value :string) => {
    setContent(value);
  };

  const handleSaveDraft = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSaveMessage(t("saving"));
    
    try {
      const savedPost = await savePost({
        title,
        content,
        status: 'draft'
      }, locale,imageUrl);
      
      setSaveMessage(t("draft_saved"));
      router.push(`/admin/posts/edit/${savedPost.id}`);
    } catch (err:any) {
      if (err.errors) {
        setFieldErrors(err.errors);
      }
      setSaveMessage(t("save_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSaveMessage(t("publishing"));
    
    try {
      const savedPost = await savePost({
        title,
        content,
        status: 'published'
      },locale, imageUrl);
      
      setSaveMessage(t("published"));
      router.push(`/admin/posts/${savedPost.id}`);
    } catch (err:any) {
      console.log(err.errors);
      if (err.errors) {
        setFieldErrors(err.errors);
      }
      setSaveMessage(t("publish_error"));

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("create_post")}</h1>
          <p className="text-gray-600">{t("start_creating")}</p>
        </div>
        
        {/* Title Input */}
        <div className="mb-8">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            {t("title")}
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder={t("title_placeholder")}
          />
          {fieldErrors.title && (<p className="text-red-500 text-sm">{fieldErrors.title[0]}</p>)}
        </div>
        
        {/* Image Upload */}
        <div className="mb-8">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            {t("featured_image")}
          </label>
          {fieldErrors.image && (<p className="text-red-500 text-sm">{fieldErrors.image[0]}</p>)}
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200">
              <div className="flex flex-col items-center justify-center pt-7">
                <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  {imagePreview ? t("change_image") : t("upload_image")}
                </p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="opacity-0 absolute" 
              />
            </label>
            
          </div>

          {imagePreview && (
            <div className="mt-4 relative group">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full max-h-80 object-contain rounded-lg shadow-sm border border-gray-200" 
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition duration-200 opacity-0 group-hover:opacity-100"
                aria-label={t("remove_image")}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        
        {/* Content Editor */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("content")}
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm ">
            <ReactEditor value={content} onChange={handleChange} />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {t("save_draft")}
            </button>
            
            <button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <EyeIcon className="h-5 w-5" />
              {t("publish")}
            </button>
          </div>
          
          {saveMessage && (
            <div className={`text-sm font-medium ${
              saveMessage.includes('Error') ? 'text-red-500' : 'text-green-500'
            }`}>
              {saveMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}