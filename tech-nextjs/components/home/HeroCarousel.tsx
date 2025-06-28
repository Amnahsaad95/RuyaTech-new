'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ApiError } from 'next/dist/server/api-utils'
import { Setting } from '@/types/setting'

interface Slide {
  title: string
  description: string
  image: string
  cta: string
}

interface Settings1{
  intro_image_1?: string
  intro_image_2?: string
  intro_image_3?: string
  intro_title_1?: string
  intro_title_1_Ar?: string
  intro_text_1?: string
  intro_text_1_Ar?: string
  intro_title_2?: string
  intro_title_2_Ar?: string
  intro_text_2?: string
  intro_text_2_Ar?: string
  intro_title_3?: string
  intro_title_3_Ar?: string
  intro_text_3?: string
  intro_text_3_Ar?: string
}

const HeroSection = () => {
  const pathname = usePathname()
  const currentLang = pathname.startsWith('/ar') ? 'ar' : 'en'
  const [settings, setSettings] = useState<Setting | null>(null)
  const [loading, setLoading] = useState(true)

  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  // Default slides (fallback if API data not available)
  const defaultSlides: Slide[] = [
    {
      title: "Launch Your Tech Career",
      description: "Connect with top companies and land your dream job in tech with our AI-powered matching system.",
      image: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      cta: currentLang === 'en' ? "Find Jobs" : "ابحث عن وظائف"
    },
    {
      title: "Build Your Network",
      description: "Join 50,000+ tech professionals sharing knowledge, opportunities, and collaborations.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      cta: currentLang === 'en' ? "Connect Now" : "تواصل الآن"
    },
    {
      title: "Learn & Grow",
      description: "Access exclusive courses, mentorship programs, and tech resources to accelerate your growth.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      cta: currentLang === 'en' ? "Start Learning" : "ابدأ التعلم"
    }
  ]

  const [slides, setSlides] = useState<Slide[]>(defaultSlides)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/settings`)
        if (!response.ok) {
          throw new Error('Failed to fetch settings')
        }
        const data = await response.json()
        setSettings(data)
        
        // Create slides from API data if available
        if (data.intro_title_1) {
          const apiSlides = [
            {
              title: currentLang === 'en' ? data.intro_title_1 : data.intro_title_1_Ar || data.intro_title_1,
              description: currentLang === 'en' ? data.intro_text_1 : data.intro_text_1_Ar || data.intro_text_1,
              image: data.intro_image_1 ? `${API_URL}/storage/${data.intro_image_1}` : '/Carousel/4.avif',
              cta: currentLang === 'en' ? "Learn More" : "المزيد"
            },
            {
              title: currentLang === 'en' ? data.intro_title_2 : data.intro_title_2_Ar || data.intro_title_2,
              description: currentLang === 'en' ? data.intro_text_2 : data.intro_text_2_Ar || data.intro_text_2,
              image: data.intro_image_2 ? `${API_URL}/storage/${data.intro_image_2}` : '/Carousel/2.avif',
              cta: currentLang === 'en' ? "Add Ads" : "اضافة اعلان"
            },
            {
              title: currentLang === 'en' ? data.intro_title_3 : data.intro_title_3_Ar || data.intro_title_3,
              description: currentLang === 'en' ? data.intro_text_3 : data.intro_text_3_Ar || data.intro_text_3,
              image: data.intro_image_3 ? `${API_URL}/storage/${data.intro_image_3}` : '/Carousel/3.avif',
              cta: currentLang === 'en' ? "Get Started" : "ابدأ الآن"
            }
          ]
          setSlides(apiSlides)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        toast.error('Failed to load hero content')
        setSlides(defaultSlides) // Fallback to default slides
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [currentLang])

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(interval)
  }, [currentSlide])

  const nextSlide = () => {
    setTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
      setTransitioning(false)
    }, 500)
  }

  const prevSlide = () => {
    setTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
      setTransitioning(false)
    }, 500)
  }

  if (loading) {
    return (
      <section className="relative h-screen max-h-[800px] bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </section>
    )
  }

  return (
    <section className="relative h-screen max-h-[800px] text-white overflow-hidden" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 to-rose-700/90 z-10"></div>
          <img 
            src={slide.image} 
            alt="" 
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>
      ))}

      {/* Grainy Overlay */}
      <div className="absolute inset-0 opacity-10 z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute top-20 -right-20 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 h-full flex items-center relative z-20">
        <div className={`max-w-2xl transition-all duration-700 ${transitioning ? (currentLang === 'ar' ? '-translate-x-10' : 'translate-x-10') + ' opacity-0' : 'translate-x-0 opacity-100'}`}>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {slides[currentSlide].title} <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-teal-300">
              {currentLang === 'en'
                            ? `at ${settings?.site_name}`
                            : `في ${settings?.site_name_Ar}`}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-rose-100 mb-8 leading-relaxed">
            {slides[currentSlide].description}
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-amber-400 hover:bg-amber-500 text-rose-900 px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/30 text-lg flex items-center">
              {slides[currentSlide].cta}
              <FontAwesomeIcon 
                icon={faArrowRight} 
                className={currentLang === 'ar' ? 'mr-2 rotate-180' : 'ml-2'} 
              />
            </button>
            <button className="bg-transparent hover:bg-rose-800/30 border-2 border-amber-300 text-amber-300 px-8 py-4 rounded-lg font-medium transition-all duration-300 text-lg">
              {currentLang === 'en' ? 'Explore Features' : 'استكشف الميزات'}
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setTransitioning(true)
              setTimeout(() => {
                setCurrentSlide(index)
                setTransitioning(false)
              }, 500)
            }}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-amber-400 w-6' : 'bg-white/50'}`}
            aria-label={currentLang === 'en' ? `Go to slide ${index + 1}` : `انتقل إلى الشريحة ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className={`absolute ${currentLang === 'ar' ? 'right-6' : 'left-6'} top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300`}
        aria-label={currentLang === 'en' ? 'Previous slide' : 'الشريحة السابقة'}
      >
        <FontAwesomeIcon 
          icon={currentLang === 'ar' ? faArrowRight : faArrowLeft} 
          className="text-white text-xl" 
        />
      </button>
      <button 
        onClick={nextSlide}
        className={`absolute ${currentLang === 'ar' ? 'left-6' : 'right-6'} top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300`}
        aria-label={currentLang === 'en' ? 'Next slide' : 'الشريحة التالية'}
      >
        <FontAwesomeIcon 
          icon={currentLang === 'ar' ? faArrowLeft : faArrowRight} 
          className="text-white text-xl" 
        />
      </button>
    </section>
  )
}

export default HeroSection