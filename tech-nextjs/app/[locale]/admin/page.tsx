'use client'

import { FaUsers, FaNewspaper, FaAd, FaArrowUp, FaArrowDown, FaEdit, FaGraduationCap, FaBuilding, FaBriefcase } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useAuth } from '@/services/context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useTranslations } from 'next-intl'

interface DashboardStats {
  totalUsers: number
  totalStudents: number
  totalCompanies: number
  totalProfessionals: number
  totalPosts: number
  totalJobs: number
  activeAds: number
  pendingApprovals: number
  userGrowth: number
  postGrowth: number
  jobGrowth: number
  userDistribution: { name: string; value: number }[]
  monthlyActivity: { month: string; users: number; posts: number; jobs: number }[]
  recentPosts: {
    title: string
    author: string
    status: string
    likes: number
    views: number
    created_at: string
  }[]
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()
  const t = useTranslations('admin')
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }
        if (token) headers['Authorization'] = `Bearer ${token}`

        const response = await fetch(`${API_URL}/api/dashboard/stats`, {
          method: 'GET',
          headers,
          credentials: 'include'
        })

        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError('Failed to fetch dashboard data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <div className="p-6 text-center">{t('loading')}</div>
  if (error) return <div className="p-6 text-center text-red-500">{t('errorDash')}</div>
  if (!stats) return <div className="p-6 text-center">{t('noData')}</div>

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('dashboardOverview')}</h1>
        <p className="text-gray-600">{t('dashboardWelcome')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card title={t('totalUsers')} value={stats.totalUsers} growth={stats.userGrowth} icon={<FaUsers />} color="primary" label={t('fromLastMonth')} />
        <Card title={t('students')} value={stats.totalStudents} icon={<FaGraduationCap />} label={t('registeredStudents')} color="blue" />
        <Card title={t('companies')} value={stats.totalCompanies} icon={<FaBuilding />} label={t('registeredCompanies')} color="indigo" />
        <Card title={t('professionals')} value={stats.totalProfessionals} icon={<FaBriefcase />} label={t('registeredProfessionals')} color="purple" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card title={t('totalPosts')} value={stats.totalPosts} growth={stats.postGrowth} icon={<FaNewspaper />} color="green" label={t('fromLastMonth')} />
        <Card title={t('jobListings')} value={stats.totalJobs} growth={stats.jobGrowth} icon={<FaBriefcase />} color="yellow" label={t('fromLastMonth')} />
        <Card title={t('activeAds')} value={stats.activeAds} icon={<FaAd />} label={t('currentlyRunning')} color="red" />
        <Card title={t('pendingApprovals')} value={stats.pendingApprovals} icon={<FaEdit />} label={t('requireAction')} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('userDistribution')}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
               <Pie
                  data={stats.userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                    const x = cx + radius * Math.cos(-midAngle! * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle! * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        fontSize={12}
                        fontWeight="bold"
                      >
                        {`${(percent! * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {stats.userDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('monthlyActivity')}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyActivity} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" name={t('newUsers')} />
                <Bar dataKey="posts" fill="#82ca9d" name={t('postsCreated')} />
                <Bar dataKey="jobs" fill="#ffc658" name={t('jobsPosted')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  )
}

function Card({ title, value, icon, label, growth, color }: any) {
  const growthColor = growth !== undefined ? (growth >= 0 ? 'text-green-500' : 'text-red-500') : 'text-gray-500'
  const IconWrapper = `p-3 rounded-full bg-${color}-50 text-${color}-600`
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value.toLocaleString()}</p>
          {growth !== undefined && (
            <p className={`text-xs mt-1 ${growthColor}`}>
              {growth >= 0 ? <FaArrowUp className="inline mr-1" /> : <FaArrowDown className="inline mr-1" />}
              {Math.abs(growth)}% {label}
            </p>
          )}
          {!growth && label && (
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          )}
        </div>
        <div className={IconWrapper}>{icon}</div>
      </div>
    </div>
  )
}
