'use client'

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/post';

export default function PostsSection({ data }: { data: Post[] }) {
  const t = useTranslations('home');
  const router = useRouter();
  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({});
  const posts = data;

  const locale = useLocale(); // 'ar' أو 'en' مثلاً
const langDir = locale === 'ar' ? 'rtl' : 'ltr';

  function formatDate(dateString?: string) {
    if (!dateString) return t('unknownDate');
    
    
    // Arabic uses different date formatting
    if (locale === 'ar') {
      return new Intl.DateTimeFormat('ar-EG', {
        month: 'short',
        day: 'numeric'
      }).format(new Date(dateString));
    }
    
    return new Date(dateString).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric'
    });
  }

  const toggleExpandPost = (postId: number) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  if (!posts.length) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">{t('noPosts.title')}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-100 text-primary-600 rounded-full mb-4">
            {t('communityDiscussions')}
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.rich('latestPosts', {
              highlight: (chunks) => <span className="text-primary-600">{chunks}</span>
            })}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('discoverDiscussions')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div 
              key={post.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              dir={langDir}
            >
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={`http://127.0.0.1:8000/storage/${post.image_path}`}
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  width={400}
                  height={250}
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded">
                    {formatDate(post.created_at)} 
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className={`flex items-center mb-4 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    <img 
                      src={`http://127.0.0.1:8000/storage/${post.user?.profile_image}`}
                      alt={post.user?.name} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                      width={40}
                      height={40}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-avatar.jpg';
                      }}
                    />
                  </div>
                  <div className={locale === 'ar' ? 'mr-3' : 'ml-3'}>
                    <p className="text-sm font-medium text-gray-900">{post.user?.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                  </div>
                </div>
                
                <h3 className={`font-bold text-xl mb-3 text-gray-900 line-clamp-2 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                  {post.title}
                </h3>
                
                <div className="mb-4">
                  <div 
                    className={`text-gray-600 ${expandedPosts[post.id!] ? '' : 'line-clamp-3'} ${locale === 'ar' ? 'text-right' : 'text-left'}`} 
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                  />
                </div>
                
                <div className={`flex items-center justify-between border-t border-gray-100 pt-4 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="flex items-center text-gray-500 hover:text-primary-600 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className={locale === 'ar' ? 'mr-1' : 'ml-1'}>
                      {t('commentsCount', { count: post.comments_count ?? 0 })}
                    </span>
                  </div>
                  <a 
                    href={`/homePage/posts/${post.id}`} 
                    className="text-primary-600 hover:text-primary-800 font-medium text-sm transition"
                  >
                    {t('viewPost')}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <a 
            href="/homePage/posts" 
            className="relative inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 font-medium rounded-full group overflow-hidden hover:text-white"
          >
            <span className="absolute left-0 w-full h-0 transition-all bg-primary-600 opacity-100 group-hover:h-full group-hover:top-0 duration-400 ease"></span>
            <span className="relative group-hover:text-white transition-colors duration-200">
              {t('viewAllPosts')}
             
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}