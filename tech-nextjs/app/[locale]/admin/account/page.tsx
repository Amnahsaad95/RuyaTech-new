'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import ImageUpload from '@/components/posts/ImageUpload';

export default function AccountPage() {
  const { user, isAuthenticated, loading , token} = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    mainfield: '',
    bio: '',
    country: '',
    city: '',
    National: '',
    SocialProfile: '',
    isexpert: false,
    isjobseek : false,
    role: '',
    password: '',
    password_confirmation: '',
  });
  
  const [profileImage, setProfileImage] = useState<File | null | undefined>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string |null>(null);
  const [cvFile, setCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Load user data when available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        mainfield: user.mainfield || '',
        bio: user.bio || '',
        country: user.country || '',
        city: user.city || '',
        National: user.national || '',
        SocialProfile: user.social_profile || '',
        isexpert: user.isexpert || false,
        isjobseek: user.isjobseek || false,
        role: user.role || '',
        password: '',
        password_confirmation: '',
      });
    }
  }, [user]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login?redirect=account');
    }
  }, [isAuthenticated, loading, router]);
  
  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  
  
  const handleProfileImageChange = (file :any) => {
    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };
  
  const handleProfileImageRemove = () => {
    setProfileImage(null);
  };
  const handleCvChange = (e :any) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Create FormData for file uploads
      const data = new FormData();
      data .append('profile', JSON.stringify(formData));
     

      
      
      // Add files if selected
      if (profileImage) {
        data.append('profile_image', profileImage);
      }
      
      if (cvFile) {
        data.append('cv_path', cvFile);
      }
      console.log(formData.city);

      const headers: Record<string, string> = { };
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      // Send update request
      const response = await fetch('http://localhost:8000/api/profile', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: data,
      });
      
      if (!response.ok) {
         const errorData = await response.json();
        console.log(errorData.error);
        throw new Error('Failed to update profile');
      }
      
      const result = await response.json();

      console.log(result);
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        password: '',
        password_confirmation: ''
      }));
      
    } catch (error : any) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred while updating your profile'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Account Settings</h1>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="mainfield" className="block text-sm font-medium text-gray-700 mb-1">Main Field</label>
              <input
                type="text"
                id="mainfield"
                name="mainfield"
                value={formData.mainfield}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Web Development, Data Science, Design"
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Developer, Designer, Manager"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
              <ImageUpload onImageSelected={handleProfileImageChange} onImageRemoved={handleProfileImageRemove} previewUrl ={profileImagePreview}/>
              {user?.profile_image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Current image:</p>
                  <img 
                    src={`http://localhost:8000/storage/${user.profile_image}`} 
                    alt="Profile" 
                    className="mt-1 h-20 w-20 object-cover rounded-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Location Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Location Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="national" className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <input
                type="text"
                id="national"
                name="national"
                value={formData.National}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Professional Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Professional Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isexpert"
                name="isexpert"
                checked={formData.isexpert}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isexpert" className="ml-2 block text-sm text-gray-700">
                I am an expert in my field
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isjobseek"
                name="isjobseek"
                checked={formData.isjobseek}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isjobseek" className="ml-2 block text-sm text-gray-700">
                I am currently seeking a job
              </label>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1">CV / Resume</label>
              <input
                type="file"
                id="cv"
                name="cv"
                onChange={handleCvChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept=".pdf,.doc,.docx"
              />
              {user?.cv && (
                <div className="mt-2">
                  <a 
                    href={`http://localhost:8000/storage/${user.cv}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View current CV
                  </a>
                </div>
              )}
              <p className="mt-1 text-sm text-gray-500">Accepted formats: PDF, DOC, DOCX (max 5MB)</p>
            </div>
          </div>
        </div>
        
        {/* Social Profiles */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Social Profiles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.SocialProfile}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            
          </div>
        </div>
        
        {/* Password Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Change Password</h2>
          <p className="text-sm text-gray-500 mb-4">Leave blank if you don't want to change your password</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                minLength={8}
              />
            </div>
            
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                minLength={8}
              />
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
