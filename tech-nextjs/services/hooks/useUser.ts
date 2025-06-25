
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { fetchUser, updateUser, approvedUser as apiApproveUser, suspendedhUser as apiSuspendedUser ,rejectedUser as apiRejectedUser } from '@/services/context/UsersContext';

import { useAuth } from '../context/AuthContext';

interface UseUserProps {
  userId?: string;
}

export const useUser = ({ userId }: UseUserProps = {}) => {
  const { token } = useAuth();

  const [member, setmember] = useState<User | null>(null);
  const [imageUrl, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        // New user
        setmember({
          id: null,
          name: '',
          email: '',
          profile_image : '',
          phone : '',
          role : 'student',
          country :'' ,
          city:'',
          National: '',          
          mainfield:'',
          SocialProfile: '',
          isexpert :false,
          isjobseek : false,
          created_at: '',
          updated_at: ''
        });
        return;
      }
      
      setLoading(true);
      try {
        const fetchedUser = await fetchUser(userId);
        setmember(fetchedUser);
        setError(null);
      } catch (err) {
        setError('Error loading user');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  const saveUser = async (data: Partial<User> ,imageUrl? : File , cvFile? : File) => {
    setLoading(true);
    try {
      let updatedUser;
      
      if (data?.id) {
        if (!token) {
          throw new Error("Authentication token is required.");
        }
        // Update existing user
        updatedUser = await updateUser(data.id, {
          ...data
        },token,imageUrl,cvFile);

      } else {
          if (!token) {
              throw new Error("Authentication token is required.");
            }
        // Create new user
       /* updatedUser = await createUser({
          title: data.title || '',
          content: data.content || '',
          parent_id :data.parent_id || null,
          like: data.like || 0,
          hit: data.hit || 0,
          status: data.status || 'draft'
        },token ,imageUrl);*/
      }
      
      setmember(updatedUser ??  null);
      return updatedUser;
    } catch (err) {
      setError('Error saving user');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approvedUser = async (user:User) => {
    if (!user.id) return;
    
    setLoading(true);
    try {
      if (!token) {
          throw new Error("Authentication token is required.");
        }
      const updatedUser = await apiApproveUser(user,token);
      setmember(updatedUser);
      return updatedUser;
    } catch (err) {
      setError('Error approved user');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const suspendedUser = async (user:User) => {
    
    setLoading(true);
    try {
      if (!token) {
          throw new Error("Authentication token is required.");
        }
      const updatedUser = await apiSuspendedUser(user,token);
      setmember(updatedUser);
      return updatedUser;
    } catch (err) {
      setError('Error suspended user');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectedUser = async (user:User) => {
    
    setLoading(true);
    try {
      if (!token) {
          throw new Error("Authentication token is required.");
        }
      const updatedUser = await apiRejectedUser(user,token);
      setmember(updatedUser);
      return updatedUser;
    } catch (err) {
      setError('Error rejected user');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    member,
    loading,
    error,
    saveUser,
    approvedUser,
    suspendedUser,
    rejectedUser
  };
};
