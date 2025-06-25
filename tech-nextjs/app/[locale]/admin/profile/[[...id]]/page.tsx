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
          const response = await fetch(`http://127.0.0.1:8000/api/members/${id}`, {
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
                      src={previewImage || (`http://127.0.0.1:8000/storage/${user.profile_image}`)}
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
                    src={`http://127.0.0.1:8000/storage/${user.profile_image}`}
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
                    {editing && (
                      <button
                        type="button"
                        onClick={() => addArrayItem('professional_info', { title: '', years_experience: 0, skills: [] })}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {t("addInfo")}
                      </button>
                    )}
                  </div>

                  {/* ... rest of the professional section with translations ... */}
                </div>

                {/* ... other professional sections with translations ... */}
              </>
            )}

            {/* Student-Specific Fields */}
            {user.role === 'student' && (
              <>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{t("academicInfo")}</h2>
                  </div>
                  {/* ... rest of the student section with translations ... */}
                </div>
                {/* ... other student sections with translations ... */}
              </>
            )}

            {/* Company-Specific Fields */}
            {user.role === 'company' && (
              <>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("companyInfo")}</h2>
                  {/* ... rest of the company section with translations ... */}
                </div>
                {/* ... other company sections with translations ... */}
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