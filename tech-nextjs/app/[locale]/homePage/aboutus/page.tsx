'use client'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRocket, faUsers, faGraduationCap, faBuilding, faHandshake, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { faConnectdevelop } from '@fortawesome/free-brands-svg-icons'
import HeroCarousel from '@/components/home/HeroCarousel'
import { useTranslations } from 'next-intl'

const AboutUs = () => {
  const t = useTranslations('home');
  //const reverseLayout = t("reverseLayout") ;
    const [stats, setStats] = useState<{ number: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const features = [
    {
      icon: faUsers,
      title: t("features.professionals.title"),
      description: t("features.professionals.description")
    },
    {
      icon: faGraduationCap,
      title: t("features.students.title"),
      description: t("features.students.description")
    },
    {
      icon: faBuilding,
      title: t("features.companies.title"),
      description: t("features.companies.description")
    },
    {
      icon: faHandshake,
      title: t("features.collaboration.title"),
      description: t("features.collaboration.description")
    }
  ]

  useEffect(() => {
    // Replace with your actual API endpoint
    fetch(`${API_URL}/api/home/stats`)
      .then(res => res.json())
      .then(data => {

        console.log(data);
        const translatedStats = [
          { number: data.totalProfessionals, label: t("stats.professionals") },
          { number: data.totalStudents, label: t("stats.students") },
          { number: data.totalCompanies, label: t("stats.companies") },
          { number: data.totalJobs, label: t("stats.jobs") }
        ];
        setStats(translatedStats);
      })
      .catch(err => {
        console.error('Failed to fetch stats:', err);
      })
      .finally(() => setLoading(false));
  }, [t]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-rose-50" dir={t("dir")}>
      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className={`flex flex-col ${t("dir") === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12`}>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-rose-900 mb-6">
                {t("mission.title")} <span className="text-amber-500">{t("mission.highlight")}</span>
              </h2>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {t("mission.description1")}
              </p>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                {t("mission.description2")}
              </p>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faRocket} className="text-amber-500 text-2xl" />
                <span className="text-rose-800 font-medium">{t("mission.since")}</span>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white p-1 rounded-2xl shadow-xl transform rotate-1 hover:rotate-0 transition duration-500">
                <div className="bg-gradient-to-br from-rose-100 to-amber-50 p-6 rounded-xl">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                      alt={t("imageAlts.team")}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-rose-900/5 to-amber-900/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-rose-900 mb-4">
              {t("features.title")} <span className="text-amber-500">{t("features.highlight")}</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-500 transform hover:-translate-y-2"
              >
                <div className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-rose-500 to-amber-500 rounded-lg flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={feature.icon} className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-rose-900 to-amber-800 text-white">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center text-amber-100">Loading stats...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="p-6">
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-amber-200 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-rose-900 to-amber-800 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-rose-100 mb-8 max-w-2xl mx-auto">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs