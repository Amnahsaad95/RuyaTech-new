'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post } from '@/types/post';
import { useAuth } from '@/services/context/AuthContext';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<string>('newest');
  const { token } = useAuth();
  const t = useTranslations('home');
  const locale = useLocale(); 
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Highlight matching search terms in text
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const regex = new RegExp(`(${highlight})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-rose-200">{part}</mark> : part
    );
  };

  // Fetch posts from Laravel API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error(t('fetchError'));
        
        const data = await response.json();
        setPosts(data.filter((post: Post) => post.status === 'published'));
        setFilteredPosts(posts);
      } catch (error) {
        console.error(t('fetchError'), error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token, t]);

  // Filter and sort posts
  useEffect(() => {
    let results = [...posts];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||        
        post.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    results.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'oldest':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case 'most-liked':
          return (b.like || 0) - (a.like || 0);
        case 'most-viewed':
          return (b.hit || 0) - (a.hit || 0);
        default:
          return 0;
      }
    });
    
    setFilteredPosts(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, sortOption, posts]);

  function stripHtml(html: string) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  // Pagination controls
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Header */}
      <header className=" text-orange-600 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">{t('header.title')}</h1>
          <p className="text-orange-300 mt-2">{t('header.subtitle')}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-rose-800 mb-1">
                {t('filtersPost.search')}
              </label>
              <input
                type="text"
                id="search"
                placeholder={t('filtersPost.searchPlaceholder')}
                className="w-full px-4 py-2 border border-rose-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort Filter */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-rose-800 mb-1">
                {t('filtersPost.sortBy')}
              </label>
              <select
                id="sort"
                className="w-full px-4 py-2 border border-rose-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">{t('sortOptions.newest')}</option>
                <option value="oldest">{t('sortOptions.oldest')}</option>
                <option value="most-viewed">{t('sortOptions.mostViewed')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h3 className="text-xl text-rose-800">{t('noPosts.title')}</h3>
            <p className="text-gray-600 mt-2">
              {searchTerm ? t('noPosts.searchResults', { searchTerm }) : t('noPosts.adjustFilters')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Post Image */}
                  {post.image_path && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={`${API_URL}/storage/${post.image_path}`}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="p-6">
                    {/* Status Badge */}
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' :
                      post.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {t(`status.${post.status}`)}
                    </span>

                    <h2 className="text-xl font-bold text-rose-800 mb-2">
                      {highlightText(post.title, searchTerm)}
                    </h2>
                    
                    <div className="text-gray-600 mb-4 line-clamp-3">
                      {highlightText(stripHtml(post.content), searchTerm)}
                    </div>

                    {/* Post Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 mr-1 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {post.hit || 0}
                      </span>
                    </div>

                    {/* Author and Date */}
                    <div className="flex items-center justify-between pt-3 border-t border-rose-100">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
                          {post.user?.name?.charAt(0) || '?'}
                        </div>
                        <span className="ml-2 text-sm text-gray-700">
                          {highlightText(post.user?.name || t('anonymous'), searchTerm)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(post.created_at || '').toLocaleDateString(locale || 'en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* View Button */}
                    <Link 
                      href={`/homePage/posts/${post.id}`}
                      className="mt-4 inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-800 text-white rounded-lg hover:from-rose-700 hover:to-rose-900 transition-colors shadow-md"
                    >
                      {t('viewPost')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-rose-300 rounded-lg text-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('pagination.previous')}
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 rounded-lg ${currentPage === number 
                      ? 'bg-rose-600 text-white' 
                      : 'border border-rose-300 text-rose-700'}`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-rose-300 rounded-lg text-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('pagination.next')}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}