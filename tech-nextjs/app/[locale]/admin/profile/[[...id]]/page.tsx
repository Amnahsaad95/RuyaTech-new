'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { User, UserRole, Bio, Skill, Course, Certificate, WorkExperience, ProfessionalInfo, Education, Portfolio, AcademicInfo, CareerGoals, CompanyInfo, OpenPosition, HiringNeeds } from '@/types/user';
import { useAuth } from '@/services/context/AuthContext';
import { useUser } from '@/services/hooks/useUser';
import { useTranslations } from 'next-intl';

export default function UserProfilePage({ params }: { params: Promise<{ id?: string }> }) {
  const { id } = React.use(params);
  const t = useTranslations("admin.userProfile");
  
  const [user, setUser] = useState<Partial<User>>({});
  const [originalUser, setOriginalUser] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [cvPath, setCvPath] = useState<string | null>(null);
   const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth(); 
  const { member, saveUser, approvedUser, suspendedUser, rejectedUser } = useUser();

  const isCurrentUserProfile = !id || (isAuthenticated && id === currentUser?.id?.toString());

    
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          // No ID parameter - use the current user from context
          if (currentUser) {
            setUser(currentUser);
            setOriginalUser(currentUser);
          } else {
            throw new Error('No user logged in');
          }
        } else {
          // ID parameter provided - fetch user from API
          const response = await fetch(`${API_URL}/api/members/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch user');
          }
          
          const data = await response.json();
          setUser(data);
          setOriginalUser(data);
          setIsAdmin(true);
          console.log(data);
        }
      } catch (error) {
        console.error('Error:', error);
        router.push('/auth/login'); // Redirect to login or error page
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser, router]);

  // Disable editing if viewing another user's profile
  useEffect(() => {
    if (!isCurrentUserProfile) {
      setEditing(false);
    }
  }, [isCurrentUserProfile]);

  const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;

      setUser(prev => {
        if (!prev) return prev;

        const newUser = { ...prev };

        // التعامل مع bio
        if (name.startsWith('bio.')) {
          const path = name.replace('bio.', '');
          const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');

          let bio = { ...(newUser.bio || {}) };
          let current: any = bio;

          for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current)) {
              current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
            } else {
              current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
            }
            current = current[key];
          }

          current[keys[keys.length - 1]] = value;

          newUser.bio = bio;
          return newUser;
        }

        // الحقول العادية
        if (name in newUser) {
          return {
            ...newUser,
            [name]: value,
          };
        }

        return prev;
      });
    };

  const handleInputChange1 = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      
      setUser(prev => {
        if (!prev) return prev;
        
        // Handle bio fields
        if (name.startsWith('bio.')) {
          const bioField = name.split('.')[1] as keyof Bio;
          return {
            ...prev,
            bio: {
              ...prev.bio,
              [bioField]: value
            }
          };
        }
        
        // Handle top-level fields
        if (name in prev) {
          return {
            ...prev,
            [name]: value
          };
        }
        console.log(user['bio']);
        
        return prev;
      });
    };

  const handleArrayChange1 = (arrayName: string, index: number, field: string, value: string) => {
    setUser(prev => {
      const newUser = { ...prev! };
      const array = [...newUser.bio![arrayName as keyof Bio] as any[]];
      array[index] = { ...array[index], [field]: value };
      newUser.bio = { ...newUser.bio!, [arrayName]: array };
      return newUser;
    });
  };

  const handleArrayChange = (
    path: string, 
    index: number, 
    field: string, 
    value: string
  ) => {
    setUser(prev => {
      const newUser = { ...prev! };
      const bio = { ...(newUser.bio || {}) };

      const keys = path.split('.');
      const lastKey = keys.pop()!;

      let pointer: any = bio;
      for (const key of keys) {
        if (!pointer[key]) pointer[key] = {};
        pointer[key] = { ...pointer[key] };
        pointer = pointer[key];
      }

      const array = [...(pointer[lastKey] || [])];
      if (typeof array[index] === 'string') {
        array[index] = value;
      } else if (typeof array[index] === 'object') {
        array[index] = { ...array[index], [field]: value };
      }
      pointer[lastKey] = array;

      newUser.bio = bio;
      return newUser;
    });
  };


  const addArrayItem1 = (arrayName: string, template: any) => {
    setUser(prev => {
      const newUser = { ...prev! };
      const array = [...(newUser.bio?.[arrayName as keyof Bio] as any[] || []), template];
      newUser.bio = { ...newUser.bio!, [arrayName]: array };
      return newUser;
    });
  };

  const addArrayItem = (path: string, template: any) => {
    setUser(prev => {
      const newUser = { ...prev! };
      const bio = { ...(newUser.bio || {}) };

      const keys = path.split('.');
      const lastKey = keys.pop()!;

      let pointer: any = bio;
      for (const key of keys) {
        if (!pointer[key]) pointer[key] = {};
        pointer[key] = { ...pointer[key] };
        pointer = pointer[key];
      }

      const array = [...(pointer[lastKey] || []), template];
      pointer[lastKey] = array;

      newUser.bio = bio;
      return newUser;
    });
  };


  const removeArrayItem1 = (arrayName: string, index: number) => {
    setUser(prev => {
      const newUser = { ...prev! };
      const array = [...(newUser.bio?.[arrayName as keyof Bio] as any[] || [])];
      array.splice(index, 1);
      newUser.bio = { ...newUser.bio!, [arrayName]: array };
      return newUser;
    });
  };

  const removeArrayItem = (path: string, index: number) => {
    setUser(prev => {
      const newUser = { ...prev! };
      const bio = { ...(newUser.bio || {}) };

      const keys = path.split('.');
      const lastKey = keys.pop()!;

      let pointer: any = bio;
      for (const key of keys) {
        if (!pointer[key]) pointer[key] = {};
        pointer[key] = { ...pointer[key] };
        pointer = pointer[key];
      }

      const array = [...(pointer[lastKey] || [])];
      array.splice(index, 1);
      pointer[lastKey] = array;

      newUser.bio = bio;
      return newUser;
    });
  };


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUser(prev => ({ ...prev, profile_image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const getChangedFields = (original: Partial<User>, updated: Partial<User>) => {
    const changed: Partial<User> = {};

    for (const key in updated) {
      const typedKey = key as keyof User;
      if (updated[typedKey] !== original[typedKey]) {
        changed[typedKey] = updated[typedKey] as any;
      }
    }

    return changed;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
   // console.log(user);
    //if (!isCurrentUserProfile || !user) return;
    
    try {

      const changedFields = getChangedFields(originalUser, user);

  // console.log(changedFields['bio']);

    if (Object.keys(changedFields).length === 0) {
      console.log('لا يوجد تغييرات');
      return;
    }

      const savedUser = await saveUser({ id: user.id, ...changedFields });

      if (savedUser) {
        setUser(savedUser);
        setOriginalUser(savedUser);
      }
       setPreviewImage('');
            console.log(savedUser);
      setEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">{t("userNotFound")}</h1>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            {t("goBack")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {editing ? t("editProfile") : t("userProfile")}
          </h1>
          {successMessage && (
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}
          <div className="flex space-x-4">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                {t("editProfile")}
              </button>
            ) : (
              <>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  {t("saveChanges")}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  {t("cancel")}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Basic Info Section */}
          <div className="p-6 border-b border-yellow-200">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                {editing ? (
                  <>
                    <img 
                      src={previewImage || (`${API_URL}/storage/${user.profile_image}`)}
                      alt={t("profileImageAlt")} 
                      className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                    />
                    <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition">
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </label>
                  </>
                ) : (
                  <img 
                    src={`${API_URL}/storage/${user.profile_image}`}
                    alt={t("profileImageAlt")} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                  />
                )}
              </div>
              
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">{t("fullName")}</label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="mt-1 text-lg font-semibold text-gray-900">{user.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">{t("email")}</label>
                    {editing ? (
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">{t("phone")}</label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={user.phone || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="mt-1 text-lg text-gray-900">{user.phone || t("notProvided")}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">{t("role")}</label>
                    {editing ? (
                      <select
                        name="role"
                        value={user.role || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="professional">{t("professional")}</option>
                        <option value="student">{t("student")}</option>
                        <option value="company">{t("company")}</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-lg text-gray-900 capitalize">{t(user.role || "")}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">{t("location")}</label>
                    {editing ? (
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          name="city"
                          value={user.city || ''}
                          onChange={handleInputChange}
                          placeholder={t("city")}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          name="country"
                          value={user.country || ''}
                          onChange={handleInputChange}
                          placeholder={t("country")}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    ) : (
                      <p className="mt-1 text-lg text-gray-900">
                        {[user.city, user.country].filter(Boolean).join(', ') || t("notProvided")}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">{t("status")}</label>
                    {editing && isAdmin ? (
                      <select
                        name="status"
                        value={user.status || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">{t("selectStatus")}</option>
                        <option value="approved">{t("approved")}</option>
                        <option value="rejected">{t("rejected")}</option>
                        <option value="suspended">{t("suspended")}</option>
                      </select>
                    ) : (
                      <p className={`mt-1 text-lg font-semibold ${
                        user.status === 'approved' ? 'text-green-600' : 
                        user.status === 'pending' ? 'text-yellow-600' : 
                        user.status === 'rejected' ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {t(user.status || "").toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Role-Specific Sections */}
          <div className="p-6 space-y-8">
            {/* Summary Section (All Roles) */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("summary")}</h2>
              {editing ? (
                <textarea
                  name="bio.summary"
                  value={user.bio?.summary || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={t("summaryPlaceholder")}
                />
              ) : (
                <p className="text-gray-700">{user.bio?.summary || t("noSummary")}</p>
              )}
            </div>

            {/* Professional-Specific Fields */}
              {user.role === 'professional' && (
                <>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{t("professionalInfo")}</h2>
                      
                    </div>

                    {user.bio?.professional_info ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500">{t("title")}</label>
                            {editing ? (
                              <input
                                type="text"
                                name="bio.professional_info.title"
                                value={user.bio.professional_info.title || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            ) : (
                              <p className="mt-1 text-gray-700">{user.bio.professional_info.title || t("notProvided")}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">{t("yearsExperience")}</label>
                            {editing ? (
                              <input
                                type="number"
                                name="bio.professional_info.years_experience"
                                value={user.bio.professional_info.years_experience || 0}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            ) : (
                              <p className="mt-1 text-gray-700">{user.bio.professional_info.years_experience || 0} {t("years")}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500">{t("skills")}</label>
                          {editing ? (
                            <div className="space-y-2">
                              {user.bio.professional_info.skills?.map((skill, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={skill.name}
                                    onChange={(e) => handleArrayChange('professional_info.skills', index, 'name', e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder={t("skillName")}
                                  />
                                  <input
                                    type="text"
                                    value={skill.experience}
                                    onChange={(e) => handleArrayChange('professional_info.skills', index, 'experience', e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder={t("experienceLevel")}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeArrayItem('professional_info.skills', index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    {t("remove")}
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addArrayItem('professional_info.skills', { name: '', experience: '' })}
                                className="mt-2 text-indigo-600 hover:text-indigo-800"
                              >
                                {t("addSkill")}
                              </button>
                            </div>
                          ) : (
                            <div className="mt-1 flex flex-wrap gap-2">
                              {user.bio.professional_info.skills?.length ? (
                                user.bio.professional_info.skills.map((skill, index) => (
                                  <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                    {skill.name} ({skill.experience})
                                  </span>
                                ))
                              ) : (
                                <p className="text-gray-500">{t("noSkills")}</p>
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500">{t("languages")}</label>
                          {editing ? (
                            <div className="space-y-2">
                              {user.bio.professional_info.languages?.map((language, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={language}
                                    onChange={(e) => handleArrayChange('professional_info.languages', index, '', e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder={t("language")}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeArrayItem('professional_info.languages', index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    {t("remove")}
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addArrayItem('professional_info.languages', '')}
                                className="mt-2 text-indigo-600 hover:text-indigo-800"
                              >
                                {t("addLanguage")}
                              </button>
                            </div>
                          ) : (
                            <div className="mt-1 flex flex-wrap gap-2">
                              {user.bio.professional_info.languages?.length ? (
                                user.bio.professional_info.languages.map((language, index) => (
                                  <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                    {language}
                                  </span>
                                ))
                              ) : (
                                <p className="text-gray-500">{t("noLanguages")}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">{t("noProfessionalInfo")}</p>
                    )}
                  </div>

                  {/* Education Section */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{t("education")}</h2>
                      {editing && (
                        <button
                          type="button"
                          onClick={() => addArrayItem('education', { degree: '', institution: '', year: 0 })}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {t("addEducation")}
                        </button>
                      )}
                    </div>

                    {user.bio?.education?.length ? (
                      <div className="space-y-4">
                        {user.bio.education.map((edu, index) => (
                          <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                            {editing ? (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("degree")}</label>
                                  <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("institution")}</label>
                                  <input
                                    type="text"
                                    value={edu.institution}
                                    onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("year")}</label>
                                  <input
                                    type="number"
                                    value={edu.year}
                                    onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div className="col-span-full flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => removeArrayItem('education', index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    {t("remove")}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                                <p className="text-gray-600">{edu.institution}</p>
                                <p className="text-sm text-gray-500">{edu.year}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">{t("noEducation")}</p>
                    )}
                  </div>

                  {/* Certifications Section */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{t("certifications")}</h2>
                      {editing && (
                        <button
                          type="button"
                          onClick={() => addArrayItem('certifications', { name: '', issuer: '', year: '', expires: undefined })}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {t("addCertification")}
                        </button>
                      )}
                    </div>

                    {user.bio?.certifications?.length ? (
                      <div className="space-y-4">
                        {user.bio.certifications.map((cert, index) => (
                          <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                            {editing ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("certificationName")}</label>
                                  <input
                                    type="text"
                                    value={cert.name}
                                    onChange={(e) => handleArrayChange('certifications', index, 'name', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("issuer")}</label>
                                  <input
                                    type="text"
                                    value={cert.issuer || ''}
                                    onChange={(e) => handleArrayChange('certifications', index, 'issuer', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("yearObtained")}</label>
                                  <input
                                    type="text"
                                    value={cert.year}
                                    onChange={(e) => handleArrayChange('certifications', index, 'year', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("expiresIn")}</label>
                                  <input
                                    type="number"
                                    value={cert.expires || ''}
                                    onChange={(e) => handleArrayChange('certifications', index, 'expires', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder={t("years")}
                                  />
                                </div>
                                <div className="col-span-full flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => removeArrayItem('certifications', index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    {t("remove")}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h3 className="font-medium text-gray-900">{cert.name}</h3>
                                <p className="text-gray-600">{cert.issuer || t("issuerNotSpecified")}</p>
                                <p className="text-sm text-gray-500">
                                  {t("year")}: {cert.year}
                                  {cert.expires && ` | ${t("expiresIn")} ${cert.expires} ${t("years")}`}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">{t("noCertifications")}</p>
                    )}
                  </div>

                  {/* Work Experience Section */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{t("workExperience")}</h2>
                      {editing && (
                        <button
                          type="button"
                          onClick={() => addArrayItem('work_history', { 
                            position: '', 
                            company: '', 
                            start_year: '', 
                            end_year: null, 
                            is_current: false 
                          })}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {t("addExperience")}
                        </button>
                      )}
                    </div>

                    {user.bio?.work_history?.length ? (
                      <div className="space-y-4">
                        {user.bio.work_history.map((exp, index) => (
                          <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                            {editing ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("position")}</label>
                                  <input
                                    type="text"
                                    value={exp.position}
                                    onChange={(e) => handleArrayChange('work_history', index, 'position', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("company")}</label>
                                  <input
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) => handleArrayChange('work_history', index, 'company', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("startYear")}</label>
                                  <input
                                    type="text"
                                    value={exp.start_year}
                                    onChange={(e) => handleArrayChange('work_history', index, 'start_year', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("endYear")}</label>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={exp.end_year || ''}
                                      onChange={(e) => handleArrayChange('work_history', index, 'end_year', e.target.value)}
                                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                      disabled={exp.is_current}
                                    />
                                    <div className="flex items-center">
                                      <input
                                        type="checkbox"
                                        id={`current-${index}`}
                                        checked={exp.is_current}
                                        onChange={(e) => handleArrayChange('work_history', index, 'is_current', e.target.checked.toString())}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                      />
                                      <label htmlFor={`current-${index}`} className="ml-2 block text-sm text-gray-700">
                                        {t("current")}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-span-full">
                                  <label className="block text-sm font-medium text-gray-500">{t("description")}</label>
                                  <textarea
                                    value={exp.description || ''}
                                    onChange={(e) => handleArrayChange('work_history', index, 'description', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div className="col-span-full flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => removeArrayItem('work_history', index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    {t("remove")}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h3 className="font-medium text-gray-900">{exp.position}</h3>
                                <p className="text-gray-600">{exp.company}</p>
                                <p className="text-sm text-gray-500">
                                  {exp.start_year} - {exp.is_current ? t("present") : exp.end_year}
                                </p>
                                {exp.description && (
                                  <p className="mt-2 text-gray-700">{exp.description}</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">{t("noWorkExperience")}</p>
                    )}
                  </div>

                  {/* Portfolio Section */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{t("portfolio")}</h2>
                      {editing && (
                        <button
                          type="button"
                          onClick={() => addArrayItem('portfolio', { title: '', description: '', url: '' })}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {t("addProject")}
                        </button>
                      )}
                    </div>

                    {user.bio?.portfolio?.length ? (
                      <div className="space-y-4">
                        {user.bio.portfolio.map((project, index) => (
                          <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                            {editing ? (
                              <div className="grid grid-cols-1 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("title")}</label>
                                  <input
                                    type="text"
                                    value={project.title}
                                    onChange={(e) => handleArrayChange('portfolio', index, 'title', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("description")}</label>
                                  <textarea
                                    value={project.description}
                                    onChange={(e) => handleArrayChange('portfolio', index, 'description', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("url")}</label>
                                  <input
                                    type="url"
                                    value={project.url || ''}
                                    onChange={(e) => handleArrayChange('portfolio', index, 'url', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder={t("optional")}
                                  />
                                </div>
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => removeArrayItem('portfolio', index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    {t("remove")}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h3 className="font-medium text-gray-900">{project.title}</h3>
                                <p className="text-gray-700">{project.description}</p>
                                {project.url && (
                                  <a 
                                    href={project.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-block text-indigo-600 hover:text-indigo-800"
                                  >
                                    {t("viewProject")}
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">{t("noPortfolioItems")}</p>
                    )}
                  </div>
                </>
              )}


           {/* Student-Specific Fields */}
              {user.role === 'student' && (
                <>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{t("academicInfo")}</h2>
                      
                    </div>

                    {user.bio?.academic_info ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">{t("institution")}</label>
                          {editing ? (
                            <input
                              type="text"
                              name="bio.academic_info.institution"
                              value={user.bio.academic_info.institution || ''}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-700">{user.bio.academic_info.institution || t("notProvided")}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">{t("program")}</label>
                          {editing ? (
                            <input
                              type="text"
                              name="bio.academic_info.program"
                              value={user.bio.academic_info.program || ''}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-700">{user.bio.academic_info.program || t("notProvided")}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">{t("degreeLevel")}</label>
                          {editing ? (
                            <select
                              name="bio.academic_info.degree_level"
                              value={user.bio.academic_info.degree_level || ''}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">{t("selectDegree")}</option>
                              <option value="bachelor">{t("bachelor")}</option>
                              <option value="master">{t("master")}</option>
                              <option value="phd">{t("phd")}</option>
                              <option value="diploma">{t("diploma")}</option>
                              <option value="other">{t("other")}</option>
                            </select>
                          ) : (
                            <p className="mt-1 text-gray-700">{user.bio.academic_info.degree_level || t("notProvided")}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">{t("year")}</label>
                          {editing ? (
                            <input
                              type="text"
                              name="bio.academic_info.year"
                              value={user.bio.academic_info.year || ''}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-700">{user.bio.academic_info.year || t("notProvided")}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">{t("noAcademicInfo")}</p>
                    )}
                  </div>

                  {/* Courses Section */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{t("courses")}</h2>
                      {editing && (
                        <button
                          type="button"
                          onClick={() => addArrayItem('courses', { 
                            name: '', 
                            code: '', 
                            semester: '', 
                            grade: '', 
                            year: '' 
                          })}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {t("addCourse")}
                        </button>
                      )}
                    </div>

                    {user.bio?.courses?.length ? (
                      <div className="space-y-4">
                        {user.bio.courses.map((course, index) => (
                          <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                            {editing ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("courseName")}</label>
                                  <input
                                    type="text"
                                    value={course.name}
                                    onChange={(e) => handleArrayChange('courses', index, 'name', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("courseCode")}</label>
                                  <input
                                    type="text"
                                    value={course.code || ''}
                                    onChange={(e) => handleArrayChange('courses', index, 'code', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("semester")}</label>
                                  <input
                                    type="text"
                                    value={course.semester || ''}
                                    onChange={(e) => handleArrayChange('courses', index, 'semester', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("grade")}</label>
                                  <input
                                    type="text"
                                    value={course.grade || ''}
                                    onChange={(e) => handleArrayChange('courses', index, 'grade', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-500">{t("year")}</label>
                                  <input
                                    type="text"
                                    value={course.year}
                                    onChange={(e) => handleArrayChange('courses', index, 'year', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                <div className="col-span-full flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => removeArrayItem('courses', index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    {t("remove")}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {course.code ? `${course.code}: ` : ''}{course.name}
                                </h3>
                                <p className="text-gray-600">
                                  {course.semester && `${t("semester")}: ${course.semester} | `}
                                  {course.grade && `${t("grade")}: ${course.grade} | `}
                                  {t("year")}: {course.year}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">{t("noCourses")}</p>
                    )}
                  </div>

                  {/* Skills Learning Section */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{t("skillsLearning")}</h2>
                      {editing && (
                        <button
                          type="button"
                          onClick={() => addArrayItem('skills_learning', '')}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {t("addSkill")}
                        </button>
                      )}
                    </div>

                    {user.bio?.skills_learning?.length ? (
                      <div>
                        {editing ? (
                          <div className="space-y-2">
                            {user.bio.skills_learning.map((skill, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={skill}
                                  onChange={(e) => handleArrayChange('skills_learning', index, '', e.target.value)}
                                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('skills_learning', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  {t("remove")}
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {user.bio.skills_learning.map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">{t("noSkillsLearning")}</p>
                    )}
                  </div>

                  {/* Interests Section */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{t("interests")}</h2>
                      {editing && (
                        <button
                          type="button"
                          onClick={() => addArrayItem('interests', '')}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {t("addInterest")}
                        </button>
                      )}
                    </div>

                    {user.bio?.interests?.length ? (
                      <div>
                        {editing ? (
                          <div className="space-y-2">
                            {user.bio.interests.map((interest, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={interest}
                                  onChange={(e) => handleArrayChange('interests', index, '', e.target.value)}
                                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('interests', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  {t("remove")}
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {user.bio.interests.map((interest, index) => (
                              <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                {interest}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">{t("noInterests")}</p>
                    )}
                  </div>

                  {/* Career Goals Section */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("careerGoals")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">{t("shortTermGoals")}</label>
                        {editing ? (
                          <textarea
                            name="bio.career_goals.short_term"
                            value={user.bio?.career_goals?.short_term || ''}
                            onChange={handleInputChange}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={t("shortTermGoalsPlaceholder")}
                          />
                        ) : (
                          <p className="mt-1 text-gray-700">
                            {user.bio?.career_goals?.short_term || t("noShortTermGoals")}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">{t("longTermGoals")}</label>
                        {editing ? (
                          <textarea
                            name="bio.career_goals.long_term"
                            value={user.bio?.career_goals?.long_term || ''}
                            onChange={handleInputChange}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={t("longTermGoalsPlaceholder")}
                          />
                        ) : (
                          <p className="mt-1 text-gray-700">
                            {user.bio?.career_goals?.long_term || t("noLongTermGoals")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

            {/* Company-Specific Fields */}
              {user.role === 'company' && (
                <>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("companyInfo")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">{t("legalName")}</label>
                        {editing ? (
                          <input
                            type="text"
                            name="bio.company_info.legal_name"
                            value={user.bio?.company_info?.legal_name || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-700">{user.bio?.company_info?.legal_name || t("notProvided")}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">{t("foundedYear")}</label>
                        {editing ? (
                          <input
                            type="number"
                            name="bio.company_info.founded_year"
                            value={user.bio?.company_info?.founded_year || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-700">{user.bio?.company_info?.founded_year || t("notProvided")}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">{t("companySize")}</label>
                        {editing ? (
                          <select
                            name="bio.company_info.company_size"
                            value={user.bio?.company_info?.company_size || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">{t("selectSize")}</option>
                            <option value="1-10">1-10 {t("employees")}</option>
                            <option value="11-50">11-50 {t("employees")}</option>
                            <option value="51-200">51-200 {t("employees")}</option>
                            <option value="201-500">201-500 {t("employees")}</option>
                            <option value="501-1000">501-1000 {t("employees")}</option>
                            <option value="1000+">1000+ {t("employees")}</option>
                          </select>
                        ) : (
                          <p className="mt-1 text-gray-700">{user.bio?.company_info?.company_size || t("notProvided")}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">{t("industry")}</label>
                        {editing ? (
                          <div className="space-y-2">
                            {user.bio?.company_info?.industry?.map((industry, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={industry}
                                  onChange={(e) => handleArrayChange('company_info.industry', index, '', e.target.value)}
                                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('company_info.industry', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  {t("remove")}
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addArrayItem('company_info.industry', '')}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              {t("addIndustry")}
                            </button>
                          </div>
                        ) : (
                          <div className="mt-1 flex flex-wrap gap-2">
                            {user.bio?.company_info?.industry?.length ? (
                              user.bio.company_info.industry.map((industry, index) => (
                                <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                  {industry}
                                </span>
                              ))
                            ) : (
                              <p className="text-gray-500">{t("noIndustries")}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">{t("website")}</label>
                        {editing ? (
                          <input
                            type="url"
                            name="bio.company_info.website"
                            value={user.bio?.company_info?.website || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-700">
                            {user.bio?.company_info?.website ? (
                              <a href={user.bio.company_info.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                                {user.bio.company_info.website}
                              </a>
                            ) : (
                              t("notProvided")
                            )}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">{t("headquarters")}</label>
                        {editing ? (
                          <input
                            type="text"
                            name="bio.company_info.headquarters"
                            value={user.bio?.company_info?.headquarters || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-700">{user.bio?.company_info?.headquarters || t("notProvided")}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Services Section */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{t("services")}</h2>
                      {editing && (
                        <button
                          type="button"
                          onClick={() => addArrayItem('services', '')}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {t("addService")}
                        </button>
                      )}
                    </div>

                    {user.bio?.services?.length ? (
                      <div>
                        {editing ? (
                          <div className="space-y-2">
                            {user.bio.services.map((service, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={service}
                                  onChange={(e) => handleArrayChange('services', index, '', e.target.value)}
                                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('services', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  {t("remove")}
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {user.bio.services.map((service, index) => (
                              <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                {service}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">{t("noServices")}</p>
                    )}
                  </div>

                  {/* Hiring Needs Section */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("hiringNeeds")}</h2>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">{t("openPositions")}</h3>
                      <div className="flex justify-between items-center mb-4">
                        {editing && (
                          <button
                            type="button"
                            onClick={() => addArrayItem('hiring_needs.open_positions', { 
                              title: '', 
                              department: '', 
                              location: '' 
                            })}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            {t("addPosition")}
                          </button>
                        )}
                      </div>

                      {user.bio?.hiring_needs?.open_positions?.length ? (
                        <div className="space-y-4">
                          {user.bio.hiring_needs.open_positions.map((position, index) => (
                            <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                              {editing ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-500">{t("positionTitle")}</label>
                                    <input
                                      type="text"
                                      value={position.title}
                                      onChange={(e) => handleArrayChange('hiring_needs.open_positions', index, 'title', e.target.value)}
                                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-500">{t("department")}</label>
                                    <input
                                      type="text"
                                      value={position.department}
                                      onChange={(e) => handleArrayChange('hiring_needs.open_positions', index, 'department', e.target.value)}
                                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-500">{t("location")}</label>
                                    <input
                                      type="text"
                                      value={position.location}
                                      onChange={(e) => handleArrayChange('hiring_needs.open_positions', index, 'location', e.target.value)}
                                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                  </div>
                                  <div className="col-span-full flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => removeArrayItem('hiring_needs.open_positions', index)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      {t("remove")}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <h3 className="font-medium text-gray-900">{position.title}</h3>
                                  <p className="text-gray-600">
                                    {position.department} | {position.location}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">{t("noOpenPositions")}</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">{t("hiringProcess")}</h3>
                      {editing ? (
                        <div className="space-y-2">
                          {user.bio?.hiring_needs?.hiring_process?.map((step, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={step}
                                onChange={(e) => handleArrayChange('hiring_needs.hiring_process', index, '', e.target.value)}
                                className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              />
                              <button
                                type="button"
                                onClick={() => removeArrayItem('hiring_needs.hiring_process', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                {t("remove")}
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addArrayItem('hiring_needs.hiring_process', '')}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            {t("addStep")}
                          </button>
                        </div>
                      ) : (
                        <div>
                          {user.bio?.hiring_needs?.hiring_process?.length ? (
                            <ol className="list-decimal pl-5 space-y-2">
                              {user.bio.hiring_needs.hiring_process.map((step, index) => (
                                <li key={index} className="text-gray-700">
                                  {step}
                                </li>
                              ))}
                            </ol>
                          ) : (
                            <p className="text-gray-500">{t("noHiringProcess")}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

            {/* CV Section */}
            {(user.role === 'professional' || user.role === 'student') && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("cvResume")}</h2>
                {editing ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      {user.cv_path ? (
                        <a 
                          href={user.cv_path as string} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {t("viewCurrentCv")}
                        </a>
                      ) : (
                        <p className="text-gray-500">{t("noCvUploaded")}</p>
                      )}
                      <label className="cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span>{t("uploadNewCv")}</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setUser(prev => ({ ...prev, cv_path: file }));
                            }
                          }}
                          accept=".pdf,.doc,.docx"
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">{t("acceptedFormats")}</p>
                  </div>
                ) : user.cv_path ? (
                  <a 
                    href={user.cv_path as string} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {t("downloadCv")}
                  </a>
                ) : (
                  <p className="text-gray-500">{t("noCvUploaded")}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};