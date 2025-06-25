'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string,locale: string) => Promise<void>;
  registerUser: (data: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!token) {
          setLoading(false); // فقط نوقف التحميل بدون رمي خطأ
          return;
        }

        const response = await fetch(`${API_URL}/api/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Invalid token');
        }

        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication check failed:', error);        
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token, router]);

  // Login function
  const login = async (email: string, password: string,locale: string) => {
    setLoading(true);
    localStorage.removeItem('authToken');
    try {
      // Get CSRF cookie first
      await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });

      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw error;
      }

      const userData = await response.json();
      setUser(userData.data.user);

      if (userData.data.access_token) {
        setToken(userData.data.access_token);
        localStorage.setItem('authToken', userData.data.access_token);
      }

      setIsAuthenticated(true);
      router.push('/admin'); // Redirect to home after successful login
    } catch (error) {
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const registerUser = async (data: Partial<User>) => {
    setLoading(true);
    
    try {
      // Get CSRF cookie first
      await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });

      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (value === undefined || value === null) continue;

        if ((key === 'profile_image') && value instanceof File) {
          formData.append('profile_image', value);
        } else if ((key === 'cv_path') && value instanceof File) {
          formData.append('cv_path', value);      
        } else if (key === 'bio') {
          formData.append('bio', JSON.stringify(value));
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }

      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          console.log("Validation Errors:", result.errors);
          for (const key in result.errors) {
            console.log(`${key}: ${result.errors[key][0]}`);
          }
        }
        throw new Error(result.message || 'Registration failed');
      }

      /*setUser(result.user);
      if (result.access_token) {
        setToken(result.access_token);
        localStorage.setItem('authToken', result.access_token);
        setIsAuthenticated(true);
      }*/
     // router.push('/admin'); // Redirect to home after successful registration
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'include',
      });
      
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      router.push('/auth/login'); // Redirect to login after logout
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, token, setUser, login, registerUser, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}