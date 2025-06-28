'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faGem, faEnvelope, faMicrochip } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faPinterest } from '@fortawesome/free-brands-svg-icons'
import { useTranslations, useLocale } from 'next-intl';

const Footer = () => {
  const t = useTranslations('home');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const quickLinks = [
    { name: "home", href: "/homePage" },
    { name: "members", href: "/homePage/members" },
    { name: "posts", href: "/homePage/posts" },
    { name: "about", href: "/homePage/aboutus" },
  ];

  return (
    <footer dir={isRTL ? 'rtl' : 'ltr'} className="bg-gradient-to-b from-rose-900 to-rose-950 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-rose-700 rounded-full mix-blend-soft-light filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-10"></div>
      </div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-400/10 to-transparent opacity-30 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand Column */}
          <div>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : 'space-x-3'} mb-6`}>
              <FontAwesomeIcon 
                icon={faMicrochip} 
                className="text-rose-300 text-xl transform hover:rotate-45 transition duration-500" 
              />
              <span className="text-3xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-200 to-amber-200">
                Rüya<span className="font-light">Tech</span>
              </span>
            </div>
            <p className="text-rose-200/80 mb-6 leading-relaxed font-light">
              {t('descriptionFooter')}
            </p>
            <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-5`}>
              <a href="#" className="text-rose-200/60 hover:text-amber-200 transition-all duration-300 transform hover:-translate-y-1">
                <FontAwesomeIcon icon={faInstagram} className="text-xl" />
              </a>
              <a href="#" className="text-rose-200/60 hover:text-amber-200 transition-all duration-300 transform hover:-translate-y-1">
                <FontAwesomeIcon icon={faPinterest} className="text-xl" />
              </a>
              <a href="#" className="text-rose-200/60 hover:text-amber-200 transition-all duration-300 transform hover:-translate-y-1">
                <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-amber-100 font-serif text-lg mb-5 border-b border-rose-700/50 pb-2">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-rose-200/80 hover:text-amber-100 transition flex items-center group font-light"
                  >
                    <span className={`w-2 h-2 bg-amber-200 rounded-full ${isRTL ? 'ml-3' : 'mr-3'} opacity-0 group-hover:opacity-100 transition`}></span>
                    {t(`links.${link.name}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-amber-100 font-serif text-lg mb-5 border-b border-rose-700/50 pb-2">
              {t('stayUpdated')}
            </h3>
            <p className="text-rose-200/80 mb-5 leading-relaxed font-light">
              {t('newsletterDescription')}
            </p>
            <form className="flex flex-col space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder={t('emailPlaceholder')} 
                  className="px-5 py-3 rounded-lg w-full bg-rose-800/40 text-rose-100 placeholder-rose-300/50 focus:outline-none focus:ring-2 focus:ring-amber-200/30 focus:bg-rose-800/60 transition border border-rose-700/50 backdrop-blur-sm"
                />
              </div>
              <button 
                type="submit" 
                className="bg-gradient-to-r from-rose-400/90 to-amber-500/90 hover:from-rose-400 hover:to-amber-500 text-rose-950 px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/20"
              >
                <span>{t('subscribe')}</span>
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className={`border-t border-rose-800/50 pt-8 flex flex-col ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'} justify-between items-center`}>
          <p className="text-rose-300/60 text-sm mb-4 md:mb-0 font-light">
            {t.rich('copyright', {
              year: new Date().getFullYear(),
              heart: () => <FontAwesomeIcon icon={faHeart} className="mx-1 text-rose-400" />
            })}
          </p>
          <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-6`}>
            <a href="#" className="text-rose-300/60 hover:text-amber-200 text-sm transition font-light">
              {t('privacy')}
            </a>
            <a href="#" className="text-rose-300/60 hover:text-amber-200 text-sm transition font-light">
              {t('terms')}
            </a>
            <a href="#" className="text-rose-300/60 hover:text-amber-200 text-sm transition font-light">
              {t('cookies')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;