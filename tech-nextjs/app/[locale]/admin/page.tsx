'use client'

import { FaUsers, FaNewspaper, FaAd, FaDollarSign, FaArrowUp, FaArrowDown, FaUserPlus, FaEdit, FaChartLine, FaPlusCircle, FaGraduationCap, FaBuilding, FaBriefcase } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useAuth } from '@/services/context/AuthContext'

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
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {token} = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
          // Add authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch('http://127.0.0.1:8000/api/dashboard/stats', {
        method: 'GET',
        headers,
        credentials: 'include',
      });

        // Replace with your actual API endpoint
        const data = await response.json();
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

  if (loading) return <div className="p-6 text-center">Loading dashboard...</div>
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>
  if (!stats) return <div className="p-6 text-center">No data available</div>

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back, Admin! Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalUsers.toLocaleString()}</p>
              <p className={`text-xs mt-1 ${stats.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.userGrowth >= 0 ? <FaArrowUp className="inline mr-1" /> : <FaArrowDown className="inline mr-1" />}
                {Math.abs(stats.userGrowth)}% from last month
              </p>
            </div>
            <div className="p-3 rounded-full bg-primary-50 text-primary-600">
              <FaUsers className="text-xl" />
            </div>
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Students</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalStudents.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Registered students</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <FaGraduationCap className="text-xl" />
            </div>
          </div>
        </div>

        {/* Total Companies */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Companies</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalCompanies.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Registered companies</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
              <FaBuilding className="text-xl" />
            </div>
          </div>
        </div>

        {/* Total Professionals */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Professionals</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalProfessionals.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Registered professionals</p>
            </div>
            <div className="p-3 rounded-full bg-purple-50 text-purple-600">
              <FaBriefcase className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Second Row of Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Posts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Posts</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalPosts.toLocaleString()}</p>
              <p className={`text-xs mt-1 ${stats.postGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.postGrowth >= 0 ? <FaArrowUp className="inline mr-1" /> : <FaArrowDown className="inline mr-1" />}
                {Math.abs(stats.postGrowth)}% from last month
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <FaNewspaper className="text-xl" />
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Job Listings</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalJobs.toLocaleString()}</p>
              <p className={`text-xs mt-1 ${stats.jobGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.jobGrowth >= 0 ? <FaArrowUp className="inline mr-1" /> : <FaArrowDown className="inline mr-1" />}
                {Math.abs(stats.jobGrowth)}% from last month
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
              <FaBriefcase className="text-xl" />
            </div>
          </div>
        </div>

        {/* Active Ads */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Ads</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.activeAds}</p>
              <p className="text-xs text-gray-500 mt-1">Currently running</p>
            </div>
            <div className="p-3 rounded-full bg-red-50 text-red-600">
              <FaAd className="text-xl" />
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.pendingApprovals}</p>
              <p className="text-xs text-gray-500 mt-1">Require action</p>
            </div>
            <div className="p-3 rounded-full bg-orange-50 text-orange-600">
              <FaEdit className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            <a href="#" className="text-sm text-primary-600 hover:text-primary-800">View All</a>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <FaUserPlus />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">New professional registered</p>
                <p className="text-sm text-gray-500">Ahmed Mohamed just signed up as a professional</p>
                <p className="text-xs text-gray-400 mt-1">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <FaEdit />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">New job posted</p>
                <p className="text-sm text-gray-500">"Senior Frontend Developer at TechSolutions"</p>
                <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <FaAd />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">New ad campaign</p>
                <p className="text-sm text-gray-500">Career Fair 2023 launched</p>
                <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="#" className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition">
              <FaPlusCircle className="text-2xl mb-2" />
              <span className="text-sm font-medium">New Post</span>
            </a>
            <a href="#" className="flex flex-col items-center justify-center p-4 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition">
              <FaUserPlus className="text-2xl mb-2" />
              <span className="text-sm font-medium">Add User</span>
            </a>
            <a href="#" className="flex flex-col items-center justify-center p-4 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition">
              <FaAd className="text-2xl mb-2" />
              <span className="text-sm font-medium">Create Ad</span>
            </a>
            <a href="#" className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition">
              <FaChartLine className="text-2xl mb-2" />
              <span className="text-sm font-medium">Reports</span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}