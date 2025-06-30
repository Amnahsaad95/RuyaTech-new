'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faGem, faEnvelope, faMicrochip } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faPinterest, faLinkedin, faTwitter, faGithub, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/services/context/AuthContext';
import { useEffect, useState } from 'react';

const Footer = () => {
  const { setting } = useAuth();
  const t = useTranslations('home');
  const locale = useLocale();
  const isRTL = locale === 'ar';
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

  const quickLinks = [
    { name: "home", href: "/homePage" },
    { name: "members", href: "/homePage/members" },
    { name: "posts", href: "/homePage/posts" },
    { name: "about", href: "/homePage/aboutus" },
  ];

  const socialLinks = [
    { icon: faInstagram, href: setting?.instagram_url || "#" },
    { icon: faWhatsapp, href: setting?.whatsapp_number || "#" },
    { icon: faFacebook, href: setting?.facebook_url || "#" },
    { icon: faEnvelope, href: `mailto: ${setting?.sitemail}` },
  ];

  return (
    <footer dir={isRTL ? 'rtl' : 'ltr'} className="bg-gradient-to-b from-rose-900 to-rose-950 text-white pt-20 pb-10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-rose-700 rounded-full mix-blend-soft-light filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-10"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-10"></div>
      </div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-400/10 to-transparent opacity-30 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : 'space-x-3'} mb-6 gap-2`}>
              <FontAwesomeIcon 
                icon={faMicrochip} 
                className="text-amber-200 text-xl transform hover:rotate-45 transition duration-500" 
              />
              {(locale === 'ar' ? setting?.site_name_Ar : setting?.site_name) && (
                 <span className="text-3xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-rose-200"
                    lang={locale === 'ar' ? 'ar' : 'en'}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {locale === 'ar' ? setting?.site_name_Ar: setting?.site_name}
                    </span>
            )}
            </div>
            <p className="text-rose-200/80 mb-6 leading-relaxed font-light">
              {locale =='ar'? setting?.siteDescriptionAr :setting?.siteDescription}
            </p> 
            <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-4 gap-2`}>
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-200/60 hover:text-amber-200 transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 space-y-3 gap-2"
                >
                  <FontAwesomeIcon icon={social.icon} className="text-xl" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-amber-100 font-serif text-lg mb-5 border-b border-rose-700/50 pb-2">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-3 gap-2">
              {quickLinks.map((link, index) => (
                <li key={index} className="space-y-3 gap-2">
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
          
          {/* Contact Info */}
          <div>
            <h3 className="text-amber-100 font-serif text-lg mb-5 border-b border-rose-700/50 pb-2">
              {t('contactUs')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-amber-200 mt-1 mr-3" />
                <a href={`mailto:${setting?.sitemail || 'info@example.com'}`} className="text-rose-200/80 hover:text-amber-100 transition font-light">
                  {setting?.sitemail || 'info@example.com'}
                </a>
              </li>
              {setting?.whatsapp_number && (
                <li className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faGem} className="text-amber-200 mr-3" />
                  <span className="text-rose-200/80 font-light">{setting.whatsapp_number}</span>
                </li>
              )}
              {setting?.site_location && (
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faHeart} className="text-amber-200 mt-1 mr-3" />
                  <span className="text-rose-200/80 font-light">
                    { setting.site_location}
                  </span>
                </li>
              )}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-amber-100 font-serif text-lg mb-5 border-b border-rose-700/50 pb-2">
              {t('newsletter')}
            </h3>
            <p className="text-rose-200/80 mb-4 leading-relaxed font-light">
              {t('newsletterDescription')}
            </p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder={t('yourEmail')}
                className="bg-rose-800/40 border border-rose-700/50 rounded-lg px-4 py-3 text-white placeholder-rose-300/70 focus:outline-none focus:ring-1 focus:ring-amber-200/30"
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-amber-400/90 to-rose-400/90 hover:from-amber-400 hover:to-rose-400 px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/20"
              >
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className={`border-t border-rose-800/50 pt-8 flex flex-col ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'} justify-between items-center`}>
          <p className="text-rose-300/60 text-sm font-light mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {locale === 'ar' ? setting?.site_name_Ar || 'رؤيا تك' : setting?.site_name || 'RüyaTech'}. {t('allRightsReserved')}
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