'use client';

import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { User, UserRole } from '@/types/user';
import { useEffect, useState } from 'react';
import { 
  AcademicCapIcon, 
  BriefcaseIcon, 
  BuildingOfficeIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  LinkIcon, 
  MapPinIcon, 
  CalendarIcon, 
  CheckBadgeIcon,
  UserIcon,
  ChartBarIcon,
  CodeBracketIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  BuildingLibraryIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

interface Params {
  id: string;
}

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('home');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/members/${id}`);
        if (!response.ok) {
          if (response.status === 404) return notFound();
          throw new Error(t('fetchError'));
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('unknownError'));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, t]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  if (!user) return notFound();

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {user.role === 'professional' && <ProfessionalProfile user={user} t={t} />}
        {user.role === 'student' && <StudentProfile user={user} t={t} />}
        {user.role === 'company' && <CompanyProfile user={user} t={t} />}
      </motion.div>
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="max-w-6xl mx-auto space-y-8">
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8 animate-pulse">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-32 h-32 rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="flex gap-4">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="h-5 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-md p-6 h-64 animate-pulse"></div>
      ))}
    </div>
  </div>
);

// Error Display Component
const ErrorDisplay = ({ error }: { error: string }) => {
  const t = useTranslations('UserProfile');
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-red-800">{t('errorTitleProfile')}</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional Profile Component
const ProfessionalProfile = ({ user, t }: { user: User, t: any }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-rose-700 to-rose-900 rounded-xl shadow-xl overflow-hidden"
      >
        <div className="p-8 text-white">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative">
              <img 
                src={user.profile_image ? `http://127.0.0.1:8000/storage/${user.profile_image}` : '/default-avatar.png'} 
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-amber-500 p-2 rounded-full text-white shadow-md">
                <BriefcaseIcon className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <h2 className="text-xl font-medium mt-1 text-rose-100">
                {user.bio?.professional_info?.title || t('professional.defaultTitle')}
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4 text-rose-100">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{user.city}, {user.country}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>{user.bio?.professional_info?.years_experience || '0'} {t('professional.yearsExperience')}</span>
                </div>
                {user.isexpert && (
                  <div className="flex items-center bg-amber-500 px-3 py-1 rounded-full">
                    <CheckBadgeIcon className="h-5 w-5 mr-1" />
                    <span>{t('verifiedExpert')}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button className="px-6 py-2 bg-white text-rose-700 rounded-lg font-medium hover:bg-rose-50 transition-colors">
                {t('contact')}
              </button>
              {user.cv_path && (
                <a 
                  href={`http://127.0.0.1:8000/storage/${user.cv_path}`} 
                  className="px-6 py-2 border border-white text-white rounded-lg font-medium hover:bg-rose-800 transition-colors text-center"
                  download
                >
                  {t('downloadCV')}
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-rose-900/20 p-1 max-w-2xl mx-auto">
          {[t('tabs.overview'), t('tabs.experience'), t('tabs.education'), t('tabs.portfolio')].map((tab, idx) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  'w-full py-3 text-sm font-medium rounded-lg',
                  'focus:outline-none focus:ring-2 focus:ring-rose-500',
                  selected
                    ? 'bg-white shadow text-rose-700'
                    : 'text-rose-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {/* Overview Tab */}
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Summary Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-2"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <UserIcon className="h-6 w-6 text-rose-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">{t('professional.summaryTitle')}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {user.bio?.summary || t('noSummary')}
                  </p>
                </div>
              </motion.div>

              {/* Contact Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <EnvelopeIcon className="h-6 w-6 text-rose-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">{t('contactInfo')}</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <EnvelopeIcon className="h-5 w-5 text-rose-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">{t('email')}</h4>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                    </div>
                    {user.phone && (
                      <div className="flex items-start">
                        <PhoneIcon className="h-5 w-5 text-rose-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">{t('phone')}</h4>
                          <p className="text-gray-900">{user.phone}</p>
                        </div>
                      </div>
                    )}
                    {user.SocialProfile && (
                      <div className="flex items-start">
                        <LinkIcon className="h-5 w-5 text-rose-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">LinkedIn</h4>
                          <a href={user.SocialProfile} className="text-rose-600 hover:underline">{t('viewProfile')}</a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Skills Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-3"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <CodeBracketIcon className="h-6 w-6 text-rose-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">{t('professional.skillsTitle')}</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {user.bio?.professional_info?.skills?.map((skill, index) => (
                      <div 
                        key={index} 
                        className="bg-rose-50 text-rose-800 px-4 py-2 rounded-full flex items-center border border-rose-100"
                      >
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-xs ml-2 text-rose-600 bg-rose-100 px-2 py-1 rounded-full">
                          {skill.experience}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </Tab.Panel>

          {/* Experience Tab */}
          <Tab.Panel>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <BriefcaseIcon className="h-6 w-6 text-rose-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">{t('professional.experienceTitle')}</h3>
                </div>
                <div className="space-y-8">
                  {user.bio?.work_history?.length ? (
                    user.bio.work_history.map((exp, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex group"
                      >
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                            <BriefcaseIcon className="h-5 w-5" />
                          </div>
                          {user.bio && user.bio.work_history  && index !== user.bio.work_history.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-8 group-last:pb-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <h4 className="text-lg font-bold text-gray-900">{exp.position}</h4>
                            <div className="text-gray-500 text-sm mt-1 sm:mt-0">
                              {exp.start_year} - {exp.end_year || t('present')}
                            </div>
                          </div>
                          <div className="text-rose-600 font-medium mt-1">{exp.company}</div>
                          {exp.description && (
                            <p className="text-gray-700 mt-3 leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {t('professional.noExperience')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* Education Tab */}
          <Tab.Panel>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <AcademicCapIcon className="h-6 w-6 text-rose-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">{t('educationTitle')}</h3>
                </div>
                <div className="space-y-8">
                  {user.bio?.education?.length ? (
                    user.bio.education.map((edu, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex group"
                      >
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                            <BuildingLibraryIcon className="h-5 w-5" />
                          </div>
                          {user.bio && user.bio.education && index !== user.bio.education.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-8 group-last:pb-0">
                          <h4 className="text-lg font-bold text-gray-900">{edu.degree}</h4>
                          <div className="text-rose-600 font-medium mt-1">{edu.institution}</div>
                          <div className="text-gray-500 text-sm mt-1">{edu.year}</div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {t('noEducation')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* Portfolio Tab */}
          <Tab.Panel>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <DocumentTextIcon className="h-6 w-6 text-rose-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">{t('portfolioTitle')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.bio?.portfolio?.length ? (
                    user.bio.portfolio.map((project, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="bg-gray-100 h-48 flex items-center justify-center">
                          <DocumentTextIcon className="h-16 w-16 text-gray-400" />
                        </div>
                        <div className="p-6">
                          <h4 className="text-lg font-bold text-gray-900">{project.title}</h4>
                          <p className="text-gray-700 mt-2">{project.description}</p>
                          {project.url && (
                            <a 
                              href={project.url} 
                              className="inline-flex items-center mt-4 text-rose-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <LinkIcon className="h-4 w-4 mr-1" />
                              {t('viewProject')}
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      {t('noPortfolio')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

// Student Profile Component
const StudentProfile = ({ user, t }: { user: User, t: any }) => {
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden"
      >
        <div className="p-8 text-white">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative">
              <img 
                src={user.profile_image ? `http://127.0.0.1:8000/storage/${user.profile_image}` : '/default-avatar.png'} 
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-amber-500 p-2 rounded-full text-white shadow-md">
                <AcademicCapIcon className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <h2 className="text-xl font-medium mt-1 text-purple-100">
                {user.bio?.academic_info?.degree_level || ''} {t('student.role')}
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4 text-purple-100">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{user.city}, {user.country}</span>
                </div>
                <div className="flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  <span>{user.bio?.academic_info?.institution || t('student.noInstitution')}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>{t('student.classOf')} {user.bio?.academic_info?.year || '----'}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                {t('contact')}
              </button>
              {user.cv_path && (
                <a 
                  href={`http://127.0.0.1:8000/storage/${user.cv_path}`} 
                  className="px-6 py-2 border border-white text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-center"
                  download
                >
                  {t('downloadCV')}
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-2"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <UserIcon className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">{t('aboutMe')}</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {user.bio?.summary || t('noSummary')}
            </p>
          </div>
        </motion.div>

        {/* Contact Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <EnvelopeIcon className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">{t('contactInfo')}</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <EnvelopeIcon className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t('email')}</h4>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-start">
                  <PhoneIcon className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">{t('phone')}</h4>
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                </div>
              )}
              {user.SocialProfile && (
                <div className="flex items-start">
                  <LinkIcon className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">LinkedIn</h4>
                    <a href={user.SocialProfile} className="text-purple-600 hover:underline">{t('viewProfile')}</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Education Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <AcademicCapIcon className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">{t('educationTitle')}</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <BuildingLibraryIcon className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t('student.institution')}</h4>
                  <p className="text-gray-900">{user.bio?.academic_info?.institution || t('student.noInstitution')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <BookOpenIcon className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t('student.program')}</h4>
                  <p className="text-gray-900">{user.bio?.academic_info?.program || t('student.noProgram')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <ClipboardDocumentIcon className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t('student.degreeLevel')}</h4>
                  <p className="text-gray-900">{user.bio?.academic_info?.degree_level || t('student.noDegree')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <CalendarIcon className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t('student.graduationYear')}</h4>
                  <p className="text-gray-900">{user.bio?.academic_info?.year || '----'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Courses Card */}
        {user.bio?.courses && user.bio.courses.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-2"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <BookOpenIcon className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">{t('student.coursework')}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.bio.courses.map((course, index) => (
                  <div key={index} className="border border-purple-100 rounded-lg p-4 hover:bg-purple-50 transition-colors">
                    <h4 className="font-medium text-gray-900">{course.name}</h4>
                    {course.code && <div className="text-xs text-gray-500 mt-1">{course.code}</div>}
                    {course.grade && (
                      <div className="mt-2 flex items-center">
                        <span className="text-sm font-medium text-purple-600">{t('student.grade')}: {course.grade}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Skills Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <LightBulbIcon className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">{t('skills')}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.bio?.skills_learning?.length ? (
                user.bio.skills_learning.map((skill, index) => (
                  <div 
                    key={index} 
                    className="bg-purple-50 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">{t('noSkills')}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Projects Card */}
        {user.bio?.portfolio && user.bio.portfolio.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-3"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <DocumentTextIcon className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">{t('projects')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.bio.portfolio.map((project, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="bg-gray-100 h-48 flex items-center justify-center">
                      <DocumentTextIcon className="h-16 w-16 text-gray-400" />
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-900">{project.title}</h4>
                      <p className="text-gray-700 mt-2 text-sm">{project.description}</p>
                      {project.url && (
                        <a 
                          href={project.url} 
                          className="inline-flex items-center mt-4 text-purple-600 hover:underline text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkIcon className="h-4 w-4 mr-1" />
                          {t('viewProject')}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Company Profile Component
const CompanyProfile = ({ user, t }: { user: User, t: any }) => {
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl shadow-xl overflow-hidden"
      >
        <div className="p-8 text-white">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative">
              <img 
                src={user.profile_image ? `http://127.0.0.1:8000/storage/${user.profile_image}` : '/default-company.png'} 
                alt={user.name}
                className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg bg-white p-2"
              />
              <div className="absolute -bottom-2 -right-2 bg-rose-500 p-2 rounded-full text-white shadow-md">
                <BuildingOfficeIcon className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user.bio?.company_info?.legal_name || user.name}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4 text-amber-100">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{user.bio?.company_info?.headquarters || `${user.city}, ${user.country}`}</span>
                </div>
                <div className="flex items-center">
                  <BriefcaseIcon className="h-5 w-5 mr-2" />
                  <span>{user.bio?.company_info?.company_size || t('company.noSize')}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>{t('company.founded')} {user.bio?.company_info?.founded_year || '----'}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button className="px-6 py-2 bg-white text-amber-600 rounded-lg font-medium hover:bg-amber-50 transition-colors">
                {t('contact')}
              </button>
              {user.bio?.company_info?.website && (
                <a 
                  href={user.bio.company_info.website} 
                  className="px-6 py-2 border border-white text-white rounded-lg font-medium hover:bg-amber-700 transition-colors text-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('visitWebsite')}
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-2"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <BuildingOfficeIcon className="h-6 w-6 text-amber-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">{t('company.aboutUs')}</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {user.bio?.summary || t('company.noDescription')}
            </p>
          </div>
        </motion.div>

        {/* Contact Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <EnvelopeIcon className="h-6 w-6 text-amber-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">{t('contactInfo')}</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <EnvelopeIcon className="h-5 w-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t('email')}</h4>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-start">
                  <PhoneIcon className="h-5 w-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">{t('phone')}</h4>
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                </div>
              )}
              {user.bio?.company_info?.website && (
                <div className="flex items-start">
                  <LinkIcon className="h-5 w-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">{t('website')}</h4>
                    <a href={user.bio.company_info.website} className="text-amber-600 hover:underline">{t('visitWebsite')}</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Industries Card */}
        {user.bio?.company_info?.industry && user.bio.company_info.industry.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <ChartBarIcon className="h-6 w-6 text-amber-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">{t('company.industries')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.bio.company_info.industry.map((industry, index) => (
                  <div 
                    key={index} 
                    className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {industry}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Services Card */}
        {user.bio?.services && user.bio.services.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-2"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <WrenchScrewdriverIcon className="h-6 w-6 text-amber-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">{t('company.services')}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.bio.services.map((service, index) => (
                  <div 
                    key={index} 
                    className="border-l-4 border-amber-500 bg-amber-50 rounded-r-lg p-4"
                  >
                    <h4 className="font-medium text-gray-900">{service}</h4>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Hiring Needs Card */}
        {user.bio?.hiring_needs && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-3"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <ClipboardDocumentIcon className="h-6 w-6 text-amber-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">{t('company.hiringInfo')}</h3>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 bg-amber-50 border-b border-amber-100">
                  <h4 className="font-medium text-amber-800">{t('company.openPositions')}</h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {user.bio.hiring_needs.open_positions?.length ? (
                    user.bio.hiring_needs.open_positions.map((position, index) => (
                      <div key={index} className="p-4 hover:bg-amber-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-gray-900">{position.title}</h5>
                            <div className="text-sm text-gray-600 mt-1">{position.department}</div>
                          </div>
                          <div className="flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>{position.location}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      {t('company.noOpenPositions')}
                    </div>
                  )}
                </div>
              </div>

              {user.bio.hiring_needs.hiring_process && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">{t('company.hiringProcess')}</h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {user.bio.hiring_needs.hiring_process.map((step, index) => (
                      <div 
                        key={index} 
                        className="flex-1 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-amber-100 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <h5 className="font-medium text-gray-900">{step}</h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;