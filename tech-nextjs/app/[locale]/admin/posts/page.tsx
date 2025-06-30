'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getPublishedPosts, getDraftPosts, fetchPosts, getPendingPosts, deletePost } from '@/services/context/PostsContext';
import { Post } from '@/types/post';
import { usePost } from '@/services/hooks/usePost';
import { EyeIcon, EyeSlashIcon, EllipsisVerticalIcon, TrashIcon, PencilSquareIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/services/context/AuthContext';

const ITEMS_PER_PAGE = 10;
 const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Dashboard() {
  const { post, savePost, publishPost, unpublishPost, rejectedPost } = usePost();
  const router = useRouter();
  const t = useTranslations('admin');
  const locale = useLocale();
  
    const { user } = useAuth();

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<Post[]>([]);
  const [unpulishedPosts, setUnpulishedPosts] = useState<Post[]>([]);
  const [draftPosts, setDraftPosts] = useState<Post[]>([]);
  const [rejectedPosts, setRejectedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'unpublished' | 'published' | 'drafts' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const [showColumns, setShowColumns] = useState({
    userName: true,
    title: true,
    image: true,
    status: true,
    hits: true,
    likes: true,
    comments: true
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const deleteConfirmRef = useRef<HTMLDivElement>(null);

  // Close delete confirmation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteConfirmRef.current && !deleteConfirmRef.current.contains(event.target as Node)) {
        setShowDeleteConfirm(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      if (!user) return; // تأكد من أن المستخدم محمّل

      setLoading(true);
      try {
        const [all] = await Promise.all([
          fetchPosts(), // احصل على كل المنشورات
        ]);

        // فلترة حسب الدور
        const filteredPosts = user.role === 'admin'
          ? all
          : all.filter(post => post.user_id === user.id); // غير admin يرى فقط منشوراته

        setAllPosts(filteredPosts);

        // التصنيف حسب الحالة
        setPublishedPosts(filteredPosts.filter(post => post.status === 'published'));
        setDraftPosts(filteredPosts.filter(post => post.status === 'draft'));
        setUnpulishedPosts(filteredPosts.filter(post => post.status === 'unpublished'));
        setRejectedPosts(filteredPosts.filter(post => post.status === 'rejected'));

        setError(null);
        setCurrentPage(1);
      } catch (err) {
        setError(t('error_loading_posts'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadPosts();
    }
  }, [t, user]);


  const filterPosts = (posts: Post[]) => {
    return posts.filter(post => 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.status && post.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getCurrentPosts = () => {
    let filteredPosts: Post[] = [];
    
    switch (activeTab) {
      case 'all': filteredPosts = filterPosts(allPosts); break;
      case 'unpublished': filteredPosts = filterPosts(unpulishedPosts); break;
      case 'published': filteredPosts = filterPosts(publishedPosts); break;
      case 'drafts': filteredPosts = filterPosts(draftPosts); break;
      case 'rejected': filteredPosts = filterPosts(rejectedPosts); break;
      default: filteredPosts = filterPosts(allPosts);
    }

    const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      totalPages,
      totalItems: filteredPosts.length
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const toggleSelectAll = () => {
    if (selectedPosts.length === getCurrentPosts().posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(getCurrentPosts().posts.map(post => post.id?.toString() ?? ""));
    }
  };

  const toggleSelectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId) 
        : [...prev, postId]
    );
  };

  const handleBulkAction = (action: string) => {
    // Implement bulk actions
    setSelectedPosts([]);
  };

  const renderPagination = (totalPages: number) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('previous')}
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('next')}
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              {t('showing_results', {
                start: (currentPage - 1) * ITEMS_PER_PAGE + 1,
                end: Math.min(currentPage * ITEMS_PER_PAGE, getCurrentPosts().totalItems),
                total: getCurrentPosts().totalItems
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
                <span className="sr-only">{t('first')}</span>
                <ChevronUpDownIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">{t('previous')}</span>
                <ChevronUpDownIcon className="h-5 w-5" />
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
                <span className="sr-only">{t('next')}</span>
                <ChevronUpDownIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">{t('last')}</span>
                <ChevronUpDownIcon className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const renderPostsTable = (posts: Post[], totalItems: number) => {
    if (posts.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <EyeSlashIcon className="h-full w-full" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">{t('no_posts_found')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('try_changing_search')}</p>
          <div className="mt-6">
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5" />
              {t('new_post')}
            </Link>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="bg-blue-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm text-gray-700">
                {t('selected_count', { count: selectedPosts.length })}
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleBulkAction('publish')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <EyeIcon className="-ml-1 mr-1 h-4 w-4" />
                {t('publish')}
              </button>
              <button
                onClick={() => handleBulkAction('unpublish')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <EyeSlashIcon className="-ml-1 mr-1 h-4 w-4" />
                {t('unpublish')}
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="-ml-1 mr-1 h-4 w-4" />
                {t('delete')}
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="relative w-12 px-6 py-3">
                  #
                </th>
                {showColumns.image && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('image')}
                  </th>
                )}
                {showColumns.userName && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('user')}
                  </th>
                )}
                {showColumns.title && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('title')}
                  </th>
                )}    
                {showColumns.status && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('status')}
                  </th>
                )}
                {showColumns.hits && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('hits')}
                  </th>
                )}
                {showColumns.likes && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('likes')}
                  </th>
                )}
                {showColumns.comments && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('comments')}
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.id}
                  </td>
                  
                  {showColumns.image && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.image_path ? (
                        <img 
                          src={`${API_URL}/storage/${post.image_path}`}
                          alt="Post" 
                          className="h-14 w-14 rounded object-cover" 
                        />
                      ) : (
                        <div className="h-14 w-14 rounded bg-gray-200 flex items-center justify-center">
                          <FontAwesomeIcon icon={faImage} className="text-gray-400 text-xl" />
                        </div>
                      )}
                    </td>
                  )}
                  {showColumns.userName && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.user?.name || '-'}</div>
                    </td>
                  )}
                  {showColumns.title && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {post.title || t('untitled_post')}
                      </div>
                    </td>
                  )}
                  {showColumns.status && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          post.status === 'published' ? 'bg-green-100 text-green-800' :
                          post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          post.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {post.status ? t(post.status) : t('draft')}
                      </span>
                    </td>
                  )}
                  {showColumns.hits && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.hit || 0}</div>
                    </td>
                  )}
                  {showColumns.likes && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.like || 0}</div>
                    </td>
                  )}
                  {showColumns.comments && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.comments?.length || 0}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link 
                        href={`/homePage/posts/${post.id ?? ''}`}
                        className="text-blue-600 hover:text-blue-900"
                        title={t('view')}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      
                      <Link 
                        href={`/admin/posts/edit/${post.id}`}
                        className="text-gray-600 hover:text-gray-900"
                        title={t('edit')}
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Link>
                      
                      {post.status === 'published' ? (
                        <>
                          <button
                            onClick={() => {unpublishPost(post,locale);router.refresh();}}
                            className="text-yellow-600 hover:text-yellow-900"
                            title={t('unpublish')}
                          >
                            <EyeSlashIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              rejectedPost(post,locale); 
                              router.refresh();
                            }}
                            className="text-red-600 hover:text-red-900"
                            title={t('rejected')}
                          >
                            <ExclamationTriangleIcon className="h-5 w-5" />
                          </button>
                        </>
                      ) : (post.status === 'draft' || post.status === 'unpublished') ? (
                        <button
                          onClick={() => {publishPost(post,locale);router.refresh();}}
                          className="text-green-600 hover:text-green-900"
                          title={t('publish')}
                        >
                          <svg className="h-5 w-5 hover:text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                      ) : null}
                      
                      <div className="relative">
                        <button
                          onClick={() => {
                                  deletePost(post.id!);
                                  router.refresh();
                                }}
                          className="text-red-600 hover:text-red-900"
                          title={t('delete')}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                       
                          
                      </div>
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('error')}!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  const currentPosts = getCurrentPosts();

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">{t('posts_dashboard')}</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t('search_posts')}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="relative">
              <button
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setColumnsDropdownOpen(!columnsDropdownOpen)}
              >
                {t('columns')}
                <ChevronUpDownIcon className="-mr-1 ml-2 h-5 w-5" />
              </button>

              {columnsDropdownOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    {Object.entries(showColumns).map(([key, value]) => (
                      <button
                        key={key}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => {
                          setShowColumns(prev => ({
                            ...prev,
                            [key]: !prev[key as keyof typeof showColumns]
                          }));
                          //setColumnsDropdownOpen(false);
                        }}
                      >
                        {value ? (
                          <CheckIcon className="mr-3 h-5 w-5 text-green-500" />
                        ) : (
                          <span className="mr-3 h-5 w-5" />
                        )}
                        {t(`column_${key}`)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          <Link 
            href="/admin/posts/new" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <PencilSquareIcon className="w-5 h-5" />
            {t('create_new_post')}
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
            {t('all_posts')}
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {allPosts.length}
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
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {unpulishedPosts.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('published');
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'published' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t('published')}
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {publishedPosts.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('drafts');
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'drafts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t('drafts')}
            <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {draftPosts.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('rejected');
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'rejected' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t('rejected')}
            <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {rejectedPosts.length}
            </span>
          </button>
        </nav>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {renderPostsTable(currentPosts.posts, currentPosts.totalItems)}
      </div>
    </div>
  );
}