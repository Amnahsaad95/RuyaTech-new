'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchPost, updatePost, deletePost } from '@/services/context/PostsContext';
import Link from 'next/link';
import React from 'react';
import ReactEditor from '@/components/Editor';
import { HeartIcon, TrashIcon, EyeIcon, PencilIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { Post } from "@/types/post";
import { usePost } from '@/services/hooks/usePost';
import { useLocale, useTranslations } from 'next-intl';

export default function PostEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const t = useTranslations('admin');
  const locale=useLocale();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'comments'>('edit');  
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});
  const { savePost } = usePost();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const fetchedPost = await fetchPost(id);
        setPost(fetchedPost);
        setError(null);
        if (fetchedPost.image_path) {
          setImagePreview(`${process.env.NEXT_PUBLIC_API_URL}/storage/${fetchedPost.image_path}`);
        }
      } catch (err) {
        setError(t('error_loading'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    
    setIsSaving(true);
    try {
      const savedPost = await savePost(post,locale);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 8000);
    } catch (err:any) {
      if (err.errors) {
        setFieldErrors(err.errors);
      }
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPost(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleChangeContent = (value: string) => {
    setPost(prev => prev ? { ...prev, content: value } : null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setPost(prev => prev ? { ...prev, image_path: file } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm(t('confirm_delete_comment'))) {
      try {
        await deletePost(commentId);
        setPost(prev => prev ? { 
          ...prev, 
          comments: prev.comments?.filter(c => c.id !== commentId) || [] 
        } : null);
      } catch (err) {
        console.error('Error deleting comment:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm" role="alert">
          <p className="font-bold">{error ? t('error') : t('not_found')}</p>
          <p>{error || t('not_found_message')}</p>
          <button
            onClick={() => router.back()}
            className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
          >
            {t('go_back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">{t('edit_post')}</h1>
            <p className="text-gray-600 mt-1">
              {t('last_updated')}: {new Date(post.updated_at || post.created_at || '').toLocaleString()}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/homePage/posts/${post.id}`}
              className="inline-flex items-center px-4 py-2 border gap-2 border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <EyeIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              {t('view_post')}
            </Link>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-sm" role="alert">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{t('save_success')}</span>
            </div>
          </div>
        )}
        

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('edit')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'edit' 
                  ? 'border-gray-500 text-gray-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <PencilIcon className="h-5 w-5 inline mr-2" />
              {t('edit_tab')}
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'comments' 
                  ? 'border-gray-500 text-gray-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ChatBubbleOvalLeftIcon className="h-5 w-5 inline mr-2" />
              {t('comments_tab')} ({post.comments?.length || 0})
            </button>
          </nav>
        </div>

        {/* Edit Tab */}
        {activeTab === 'edit' && (
          <div className="bg-white shadow-lg overflow-hidden sm:rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-6 divide-y divide-gray-200">
              <div className="px-6 py-5 sm:p-6">
                <div className="space-y-6">
                  {/* Post Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">{t('views')}</p>
                      <p className="text-2xl font-bold text-gray-800">{post.hit || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">{t('comments')}</p>
                      <p className="text-2xl font-bold text-gray-800">{post.comments?.length || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">{t('created')}</p>
                      <p className="text-sm text-gray-800">
                        {new Date(post.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      {t('title')}
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={post.title}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    />
                    
                    {fieldErrors.title && (<p className="text-red-500 text-sm">{fieldErrors.title[0]}</p>)}
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      {t('status')}
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={post.status}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                    >
                      <option value="draft">{t('status_draft')}</option>
                      <option value="published">{t('status_published')}</option>
                    </select>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                      {t('featured_image')}
                    </label>
                    
                      {fieldErrors.image_path && (<p className="text-red-500 text-sm">{fieldErrors.image_path[0]}</p>)}  
                     
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-600
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-gray-100 file:text-gray-700
                          hover:file:bg-gray-200"
                      />
                    </div>
                    {(imagePreview || post.image_path) && (
                      <div className="mt-4">
                        <div className="relative h-64 w-full rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={imagePreview ? imagePreview : `${process.env.NEXT_PUBLIC_API_URL}/storage/${post.image_path}`}
                            alt={t('image_alt')}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('content')}
                    </label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <ReactEditor value={post.content} onChange={handleChangeContent} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 text-right sm:px-6 space-x-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('saving')}
                    </>
                  ) : (
                    t('save_changes')
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="bg-white shadow-lg overflow-hidden sm:rounded-xl">
            <div className="px-6 py-5 sm:p-6">
              {post.comments && post.comments.length > 0 ? (
                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                            {comment.user?.name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{comment.user?.name || t('anonymous')}</h4>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.created_at || '').toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(comment.id!)}
                          className="text-gray-500 hover:text-gray-700"
                          title={t('delete_comment')}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-3 pl-13">
                        <p className="text-gray-700">{comment.content}</p>
                        
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ChatBubbleOvalLeftIcon className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-800">{t('no_comments')}</h3>
                  <p className="mt-1 text-gray-600">{t('no_comments_message')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}