import { User } from '@/types/user'
import { useAuth } from './AuthContext';

// API functions for user operations

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const fetchMembers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}/api/all-members`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error:${response.status}`);
    }

    const data = await response.json();
    //console.log(data);
    return data.users;
    
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUser = async (id: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};



export const updateUser = async (id: number, user: Partial<User>, token: string,imageUrl? : File , cvFile? : File): Promise<User> => {
  try {

    const formData = new FormData();

    console.log(user);
    for (const [key, value] of Object.entries(user)) {
      if (value === undefined || value === null) continue;

      if (key === 'profile_image' && value instanceof File) {
        formData.append('profile_image', value);
      } else if (key === 'cv_path' && value instanceof File) {
        console.log('yes');
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
   // console.log(formData.get('cv_path'))

    const headers: Record<string, string> = { };
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

    const response = await fetch(`${API_URL}/api/profile/${id}`, {
      method: 'POST', 
      headers,
      body: formData, 
    });

    const result = await response.json();

    if (!response.ok) {
      if (result.errors) {
        for (const key in result.errors) {
          console.log(`${key}: ${result.errors[key][0]}`);
        }
      }
      throw new Error(`Error: ${response.status}`);
    }
    console.log(result);

    return result;
  } catch (error) {
    console.error(`Error updating user ${user.id}:`, error);
    throw error;
  }
};


export const deleteUser = async (id: number): Promise<User> => {
  try {
    const headers: Record<string, string> = {'Content-Type': 'application/json', };
      // Add authorization header if token exists
      if (localStorage.getItem('authToken')) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
      }
    const response = await fetch(`${API_URL}/api/profile/${id}`, {
      method: 'DELETE',
      headers ,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

export const approvedUser = async (user: User ,token: string): Promise<User> => {
  user.status = 'approved';
  return updateUser(user.id!,{status : 'approved'},token);
};

export const suspendedhUser = async (user: User ,token: string): Promise<User> => {
  user.status = 'suspended';
  return updateUser(user.id!, { status: 'suspended' },token);
};
export const rejectedUser = async (user: User ,token: string): Promise<User> => {
  user.status = 'rejected';
  return updateUser(user.id!, { status: 'rejected' },token);
};

export const getSuspendedUsers = async (): Promise<User[]> => {
  const users = await fetchMembers();
  return users.filter(p => p.status === 'suspended');
};

export const getApprovedUsers = async (): Promise<User[]> => {
  const users = await fetchMembers();
  return users.filter(p => p.status === 'approved');
};

export const getPendingUsers = async (): Promise<User[]> => {
  const users = await fetchMembers();
  return users.filter(p => p.status === 'pending');
};