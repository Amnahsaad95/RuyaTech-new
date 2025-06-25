'use client'

import { useAuth } from '@/services/context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">SocialMedia</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hello, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
