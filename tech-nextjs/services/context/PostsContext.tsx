import { Post } from '@/types/post'
import { useAuth } from './AuthContext';

// API functions for post operations

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error:${response.status}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const fetchPost = async (id: string): Promise<Post> => {
  try {
    const response = await fetch(`${API_URL}/api/posts/${id}`, {
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
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

export const createPost = async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'> ,token: string,locale: string, imageUrl ?:File): Promise<Post> => {

  try {

    const headers: Record<string, string> = {
      'Accept-Language': locale,
      'Accept': 'application/json',
    };
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log(token);
      }

      const data = new FormData();
      data.append('title', post.title);
      data.append('content', post.content);
      
      data.append('parent_id', post.parent_id?.toString()??"" );
      data.append('status', post.status!);

      
      if (imageUrl) {
        data.append('image', imageUrl);
      }


      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: data,
      });

      const result =await response.json();  

    if (!response.ok) {
      console.log(result);
      throw result;
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const updatePost = async ( id:number,post: Partial<Post>,token: string,locale: string): Promise<Post> => {
  try {

    const formData = new FormData();
    console.log(post);

    for (const [key, value] of Object.entries(post)) {
      if (value === undefined || value === null) continue;

      if (key === 'image_path') {
          if (value instanceof File) {
            formData.append('image_path', value);
          }
          continue;
        } else {
        formData.append(key, String(value));
      }
    }

    const headers: Record<string, string> = {
      'Accept-Language': locale,
    };
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }



    const response = await fetch(`${API_URL}/api/posts/${id}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    
    const result = await response.json();    

    if (!response.ok) {
      throw result;
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (id: number): Promise<Post> => {
  try {

    const headers: Record<string, string> = {'Content-Type': 'application/json',};
      // Add authorization header if token exists
      if (localStorage.getItem('authToken')) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
      }

    const response = await fetch(`${API_URL}/api/posts/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
};

export const publishPost = async (post: Post ,token: string,locale: string): Promise<Post> => {
  post.status = 'published';
  return updatePost(post.id!,{status : 'published'},token,locale);
};

export const unpublishPost = async (post: Post ,token: string,locale: string): Promise<Post> => {
  post.status = 'unpublished';
  return updatePost(post.id!, { status: 'unpublished' },token,locale);
};
export const rejectedPost = async (post: Post ,token: string,locale: string): Promise<Post> => {
  post.status = 'rejected';
  return updatePost(post.id!, { status: 'rejected' },token,locale);
};

export const increasseHit = async (post: Post ,token: string,locale: string): Promise<Post> => {
  post.hit=post.hit+1;
  return updatePost(post.id!, { hit: post.hit+1 },token,locale);
};
export const likePost = async (post: Post ,token: string,locale: string): Promise<Post> => {
  post.hit=post.hit+1;
  return updatePost(post.id!, { hit: post.hit+1 },token,locale);
};

export const getPublishedPosts = async (): Promise<Post[]> => {
  const posts = await fetchPosts();
  return posts.filter(p => p.status === 'published');
};

export const getDraftPosts = async (): Promise<Post[]> => {
  const posts = await fetchPosts();
  return posts.filter(p => p.status === 'draft');
};

export const getPendingPosts = async (): Promise<Post[]> => {
  const posts = await fetchPosts();
  return posts.filter(p => p.status === 'pending');
};