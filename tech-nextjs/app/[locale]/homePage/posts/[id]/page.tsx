'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Post } from '@/types/post';
import { useAuth } from '@/services/context/AuthContext';
import Link from 'next/link';
import { ChatBubbleOvalLeftIcon, PaperAirplaneIcon, EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { usePost } from '@/services/hooks/usePost';
import { useLocale, useTranslations } from 'next-intl';

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, isAuthenticated, user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);  
  const { saveComment, increasseHit } = usePost();
  const t = useTranslations('home');
  const locale = useLocale();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Check if current user is admin or post author
  const canEditPost = () => {
    if (!post || !user) return false;
    return user.role === 'admin' || user.id === post.user_id;
  };

  // Fetch post data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const postResponse = await fetch(`${API_URL}/api/posts/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!postResponse.ok) throw new Error('Failed to fetch post');
        
        const postData = await postResponse.json();
        setPost(postData);
        increasseHit(postData,locale);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !isAuthenticated || !post) return;
    
    try {
      setCommentLoading(true);
      const savedComment = await saveComment({
        content: newComment,
        status: 'published',
        parent_id: post.id,
      },locale);

      setPost(prev => ({
        ...prev!,
        comments: [savedComment, ...(prev?.comments || [])]
      }));
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full border border-amber-100">
          <h2 className="text-2xl font-bold text-amber-700 mb-4">{t('errorTitle')}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/homePage/posts" 
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:from-amber-700 hover:to-amber-900 transition-all shadow-md"
          >
            {t('backToPosts')}
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full border border-amber-100">
          <h2 className="text-2xl font-bold text-amber-700 mb-4">{t('notFoundTitle')}</h2>
          <p className="text-gray-600 mb-6">{t('notFoundMessage')}</p>
          <Link 
            href="/homePage/posts" 
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:from-amber-700 hover:to-amber-900 transition-all shadow-md"
          >
            {t('backToPosts')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Luxe Header with Glass Effect */}
      <header className=" text-orange-600 py-12  backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-3 font-serif tracking-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm md:text-base">
            
            {/* Author */}
            <span className="flex items-center gap-1 bg-yellow-200 px-3 py-1 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {post.user?.name || t('unknownAuthor')}
            </span>

            {/* Date */}
            <span className="flex items-center gap-1 bg-yellow-200 px-3 py-1 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {new Date(post.created_at || '').toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>

            {/* Views */}
            <span className="flex items-center gap-1 bg-yellow-200 px-3 py-1 rounded-full">
              <EyeIcon className="w-4 h-4" />
              {post.hit} {t('views')}
            </span>

            {/* Edit Button (conditionally rendered) */}
            {canEditPost() && (
              <Link
                href={`/admin/posts/edit/${post.id}`}
                className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded-full transition-colors"
              >
                <PencilSquareIcon className="w-4 h-4" />
                {t('edit')}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Post Content */}
          <article className="flex-1">
            {/* Featured Image */}
            {post.image_path && (
              <div className="mb-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90">
                <img 
                  src={`${API_URL}/storage/${post.image_path}`}
                  alt={post.title}
                  className="w-full h-auto max-h-[32rem] object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="prose prose-lg max-w-none text-gray-700 bg-white/90 p-8 rounded-xl shadow-sm border border-amber-100/50 backdrop-blur-sm">
              <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {/* Author Card */}
            {post.user && (
              <div className="bg-white/90 p-6 rounded-xl shadow-lg border border-amber-100/50 backdrop-blur-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center text-amber-700 text-2xl font-bold shadow-inner">
                    {post.user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{post.user.name}</h3>
                    <p className="text-amber-500 text-sm">{t('author')}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{post.user.mainfield || t('noBio')}"</p>
              </div>
            )}

            {/* Stats Card */}
            <div className="bg-white/90 p-6 rounded-xl shadow-lg border border-amber-100/50 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-4 text-amber-700 border-b pb-2 border-amber-100/50">{t('postStats')}</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex gap-1 items-center">
                    <EyeIcon className="w-5 h-5 mr-2 text-amber-500" />
                    {t('views')}
                  </span>
                  <span className="font-medium bg-amber-50/70 px-3 py-1 rounded-full text-amber-700">{post.hit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex  gap-1 items-center">
                    <ChatBubbleOvalLeftIcon className="w-5 h-5 mr-2 text-amber-500" />
                    {t('comments')}
                  </span>
                  <span className="font-medium bg-amber-50/70 px-3 py-1 rounded-full text-amber-700">{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Back to Posts */}
            <Link 
              href="/homePage/posts"
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:from-amber-700 hover:to-amber-900 transition-all shadow-lg"
            >
              ← {t('backToPosts')}
            </Link>
          </aside>
        </div>

        {/* Comments Section */}
        <section className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white/90 rounded-xl shadow-lg overflow-hidden border border-amber-100/50 backdrop-blur-sm">
            <div className="p-6 border-b border-amber-100/50">
              <h2 className="text-2xl font-bold text-amber-800 flex items-center font-serif">
                <ChatBubbleOvalLeftIcon className="w-6 h-6 mr-2 text-amber-600" />
                {t('discussion')} ({post.comments?.length || 0})
              </h2>
            </div>
            
            {/* Comment Form */}
            {isAuthenticated && (
              <div className="p-6 border-b border-amber-100/30 bg-amber-50/50">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center text-amber-700 font-bold shadow-inner">
                      {user?.name?.charAt(0) || 'Y'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all bg-white/90"
                      rows={3}
                      placeholder={t('commentPlaceholder')}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || commentLoading}
                        className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                          newComment.trim() ? 
                            'bg-gradient-to-r from-amber-600 to-amber-800 text-white hover:from-amber-700 hover:to-amber-900 shadow-lg' : 
                            'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {commentLoading ? (
                          <>
                            <span className="animate-spin">↻</span>
                            <span>{t('posting')}...</span>
                          </>
                        ) : (
                          <>
                            <PaperAirplaneIcon className="w-4 h-4" />
                            <span>{t('postComment')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="divide-y divide-amber-100/30">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="p-6 hover:bg-amber-50/30 transition-colors">
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-600 font-bold shadow-inner">
                          {comment.user?.name?.charAt(0) || 'A'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-800">{comment.user?.name || t('anonymous')}</h4>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.created_at || new Date().toISOString())}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <ChatBubbleOvalLeftIcon className="w-12 h-12 mx-auto text-amber-200 mb-4" />
                  <h4 className="text-lg font-medium text-gray-600">{t('noCommentsTitle')}</h4>
                  <p className="text-gray-500 mt-1">
                    {isAuthenticated ? t('firstCommentPrompt') : t('signInToComment')}
                  </p>
                </div>
              )}
            </div>

            {/* Login Prompt */}
            {!isAuthenticated && (
              <div className="p-6 bg-gradient-to-r from-amber-50/50 to-amber-100/50 text-center">
                <h4 className="text-xl font-semibold text-amber-800 mb-2">{t('joinConversation')}</h4>
                <p className="text-amber-600 mb-6">{t('loginPrompt')}</p>
                <div className="flex justify-center space-x-4">
                  <Link
                    href="/login"
                    className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:from-amber-700 hover:to-amber-900 transition-all shadow-lg"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-white transition-colors"
                  >
                    {t('register')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}