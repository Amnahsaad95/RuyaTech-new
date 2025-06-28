'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars, faGlobe, faMicrochip, faSearch, 
  faUser, faSignOutAlt, faCog, faTimes, 
  faSpinner, faUserTie, faGraduationCap, faBuilding
} from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, useTransition } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { useAuth } from '@/services/context/AuthContext'
import { User } from '@/types/user'
import { Post } from '@/types/post'

const SearchDialog = ({ locale }: { locale: string }) => {
  const t = useTranslations('home')
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { user, loading } = useAuth();
  const [results, setResults] = useState<{
    users: User[],
    posts: Post[],
    isLoading: boolean
  }>({
    users: [],
    posts: [],
    isLoading: false
  })

  // Debounced search effect
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults({ users: [], posts: [], isLoading: false })
      return
    }

    const controller = new AbortController()
    const signal = controller.signal

    const searchTimeout = setTimeout(() => {
      setResults(prev => ({ ...prev, isLoading: true }))
      
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(query)}`, { signal })
        .then(res => res.json())
        .then(data => {
          setResults({
            users: data.users || [],
            posts: data.posts || [],
            isLoading: false
          })
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.error('Search error:', err)
            setResults(prev => ({ ...prev, isLoading: false }))
          }
        })
    }, 300)

    return () => {
      clearTimeout(searchTimeout)
      controller.abort()
    }
  }, [query])

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'professional': return faUserTie
      case 'student': return faGraduationCap
      case 'company': return faBuilding
      default: return faUser
    }
  }

  function stripHtml(html: string) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center ${locale === 'ar' ? 'ml-3' : 'mr-3'} text-rose-200 hover:text-amber-200 transition`}
        aria-label={t('search')}
      >
        <FontAwesomeIcon icon={faSearch} className="text-lg" />
      </button>

      {/* Search modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col">
          <div 
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative z-10 bg-white w-full max-w-4xl mx-auto mt-4 rounded-t-lg shadow-2xl">
            <div className="sticky top-0 bg-white px-6 pt-4 pb-3 border-b border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{t('search')}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  aria-label={t('close')}
                >
                  <FontAwesomeIcon icon={faTimes} className="text-lg" />
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-lg"
                  autoFocus
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[80vh]">
              {results.isLoading ? (
                <div className="flex justify-center py-8">
                  <FontAwesomeIcon 
                    icon={faSpinner} 
                    className="animate-spin text-rose-500 text-2xl" 
                  />
                </div>
              ) : (
                <div className="px-6 py-4">
                  {results.users.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('members')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {results.users.map(user => (
                          <Link
                            key={user.id}
                            href={`/homePage/members/${user.id}`}
                            className="flex items-center p-4 rounded-xl hover:bg-rose-50 transition group border border-gray-100"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
                                {user.profile_image ? (
                                  <img 
                                    src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${user.profile_image}`}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none'
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                                <FontAwesomeIcon 
                                  icon={getRoleIcon(user.role!)} 
                                  className={`text-xs ${
                                    user.role === 'professional' ? 'text-blue-500' :
                                    user.role === 'student' ? 'text-amber-500' :
                                    user.role === 'company' ? 'text-purple-500' : 'text-gray-500'
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">{user.name}</p>
                              <p className="text-sm text-gray-500 truncate">
                                {user.mainfield || user.bio?.professional_info?.title || t(`roles.${user.role}`)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.posts.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('posts')}</h4>
                      <div className="space-y-4">
                        {results.posts.map(post => (
                          <Link
                            key={post.id}
                            href={`/homePage/posts/${post.id}`}
                            className="block p-5 rounded-xl border border-gray-200 hover:border-rose-200 hover:bg-rose-50 transition shadow-sm"
                            onClick={() => setIsOpen(false)}
                          >
                            <h5 className="font-medium text-gray-900 line-clamp-1">{post.title}</h5>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{stripHtml(post.content)}</p>
                            <div className="flex items-center mt-3 text-xs text-gray-400">
                              <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden mr-2">
                                {post.user?.profile_image ? (
                                  <img 
                                    src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${post.user.profile_image}`}
                                    alt={post.user.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    {post.user?.name?.charAt(0).toUpperCase() || 'A'}
                                  </div>
                                )}
                              </div>
                              <span>{post.user?.name || 'Anonymous'}</span>
                              <span className="mx-2">•</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {!results.isLoading && results.users.length === 0 && results.posts.length === 0 && query.trim().length > 0 && (
                    <div className="text-center py-10 text-gray-500 text-lg">
                      {t('no_results_found')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const Navbar = () => {
  const { isAuthenticated, setting } = useAuth()
  const t = useTranslations('home')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    }
  }, [locale, mounted])

  if (!mounted) return null

  const handleLogout = () => {
    setIsProfileMenuOpen(false)
    router.push('/admin/login')
  }

  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en'
    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
  }

  const rtlStyles = {
    margin: locale === 'ar' ? 'mr-3' : 'ml-3',
    flexDirection: locale === 'ar' ? 'row-reverse' : 'row',
    textAlign: locale === 'ar' ? 'right' : 'left',
    spaceX: locale === 'ar' ? 'space-x-reverse' : 'space-x-3'
  }

  return (
    <nav
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`bg-gradient-to-r from-rose-800 to-rose-900 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 border-b border-rose-700/50 ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className={`flex justify-between items-center ${rtlStyles.flexDirection}`}>
          {/* Brand Logo */}
          <div className={`flex gap-2 items-center ${rtlStyles.spaceX}`}>
            <FontAwesomeIcon 
              icon={faMicrochip} 
              className="text-amber-200 text-xl transform hover:rotate-45 transition duration-500" 
            />
            <span
              className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-rose-200"
              lang={locale === 'ar' ? 'ar' : 'en'}
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
            >
              {locale === 'ar' ? setting?.site_name_Ar : setting?.site_name}
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center gap-4 md:gap-6 ${rtlStyles.spaceX}`}>
            <div className={`flex gap-4 md:gap-6 ${rtlStyles.spaceX}`}>
              <Link href="/homePage" className="text-rose-100 hover:text-amber-200 transition font-light">{t('home')}</Link>
              <Link href="/homePage/members" className="text-rose-100 hover:text-amber-200 transition font-light">{t('members')}</Link>
              <Link href="/homePage/posts" className="text-rose-100 hover:text-amber-200 transition font-light">{t('posts')}</Link>
              <Link href="/homePage/aboutus" className="text-rose-100 hover:text-amber-200 transition font-light">{t('about')}</Link>
            </div>
            
            <div className={`flex gap-4 md:gap-6 items-center ${rtlStyles.spaceX}`}>
              {/* Search Button */}
              <SearchDialog locale={locale} />

              {/* Language Switcher */}
              <button 
                onClick={switchLanguage}
                className="px-3 py-1 rounded-md bg-rose-700/40 hover:bg-rose-600/50 transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faGlobe} className="text-amber-200" />
                {locale === 'en' ? 'العربية' : 'English'}
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 bg-rose-700/40 hover:bg-rose-600/50 px-3 py-2 rounded-md transition"
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className={`absolute ${locale === 'ar' ? 'left-0' : 'right-0'} mt-2 w-48 bg-rose-800 rounded-md shadow-lg py-1 z-50`}>
                      <Link 
                        href="/admin" 
                        className="block px-4 py-2 text-sm hover:bg-rose-700 transition flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faCog} />
                        <span>{t('dashboard')}</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-rose-700 transition flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>{t('logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="bg-rose-700/40 hover:bg-amber-500/90 px-4 py-2 rounded-md font-light transition border border-rose-600/50 hover:border-amber-400/50 hover:text-rose-950">{t('sign_in')}</Link>
                  <Link href="/register" className="bg-gradient-to-r from-amber-400/90 to-rose-400/90 hover:from-amber-400 hover:to-rose-400 px-4 py-2 rounded-md font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/20">{t('join_now')}</Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-xl text-rose-200 hover:text-amber-200 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder={t('search_placeholder')} 
                className={`bg-rose-700/40 border border-rose-600/50 rounded-full px-4 py-2 ${locale === 'ar' ? 'pr-10' : 'pl-10'} text-black placeholder-rose-300/70 focus:outline-none focus:ring-1 focus:ring-amber-200/30 w-full`}
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className={`absolute ${locale === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-rose-300/70`} 
              />
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link href="/homePage" className="text-rose-200 hover:text-amber-200 px-4 py-2 rounded-lg hover:bg-rose-700/40 transition">{t('home')}</Link>
              <Link href="/homePage/members" className="text-rose-200 hover:text-amber-200 px-4 py-2 rounded-lg hover:bg-rose-700/40 transition">{t('members')}</Link>
              <Link href="/homePage/posts" className="text-rose-200 hover:text-amber-200 px-4 py-2 rounded-lg hover:bg-rose-700/40 transition">{t('posts')}</Link>
              <Link href="/homePage/aboutus" className="text-rose-200 hover:text-amber-200 px-4 py-2 rounded-lg hover:bg-rose-700/40 transition">{t('about')}</Link>
            </div>
            
            {/* Mobile Language Switcher */}
            <div className="pt-2">
              <button 
                onClick={switchLanguage}
                className="w-full py-2 rounded-md bg-rose-700/40 hover:bg-rose-600/50 transition mb-2 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faGlobe} className="text-amber-200" />
                {locale === 'en' ? 'العربية' : 'English'}
              </button>
            </div>

            {isAuthenticated ? (
              <div className="pt-2 space-y-2">
                <Link 
                  href="/dashboard" 
                  className="block w-full text-center py-2 rounded-md bg-rose-700/40 hover:bg-rose-600/50 transition"
                >
                  {t('dashboard')}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full py-2 rounded-md bg-rose-700/40 hover:bg-rose-600/50 transition flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>{t('logout')}</span>
                </button>
              </div>
            ) : (
              <div className={`flex ${rtlStyles.spaceX} pt-2`}>
                <Link href="/login" className="flex-1 bg-rose-700/40 hover:bg-amber-500/90 px-4 py-2 rounded-md font-light transition border border-rose-600/50 hover:border-amber-400/50 hover:text-rose-950 text-center">{t('sign_in')}</Link>
                <Link href="/register" className="flex-1 bg-gradient-to-r from-amber-400/90 to-rose-400/90 hover:from-amber-400 hover:to-rose-400 px-4 py-2 rounded-md font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/20 text-center">{t('join_now')}</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
