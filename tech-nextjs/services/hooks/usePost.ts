
import { useState, useEffect } from 'react';
import { Post } from '@/types/post';
import { fetchPost, createPost, updatePost, publishPost as apiPublishPost, unpublishPost as apiUnpublishPost ,rejectedPost as apiRejectedPost ,increasseHit as apiIncreasseHit,likePost as apiLikePost} from '@/services/context/PostsContext';

import { useAuth } from '../context/AuthContext';

interface UsePostProps {
  postId?: string;
}

export const usePost = ({ postId }: UsePostProps = {}) => {
  const { token ,user} = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [imageUrl, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) {
        // New post
        setPost({
          id: null,
          title: '',
          content: '',
          image_path : '',
          parent_id : null,
          hit : 0,
          like :0 ,
          status: 'draft',
          created_at: '',
          updated_at: ''
        });
        return;
      }
      
      setLoading(true);
      try {
        const fetchedPost = await fetchPost(postId);
        setPost(fetchedPost);
        setError(null);
      } catch (err) {
        setError('Error loading post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  const savePost = async (data: Partial<Post> ,locale:string,imageUrl? : File) => {
    setLoading(true);
    try {
      let updatedPost;
      
      if (data?.id) {
        if (!token) {
          throw new Error("Authentication token is required.");
        }
        // Update existing post
        updatedPost = await updatePost(data.id, {
          ...data
        },token,locale);

      } else {
          if (!token) {
              throw new Error("Authentication token is required.");
            }
        // Create new post
        updatedPost = await createPost({
          title: data.title || '',
          content: data.content || '',
          parent_id :data.parent_id || null,
          like: data.like || 0,
          hit: data.hit || 0,
          status: data.status || 'draft'
        },token ,locale,imageUrl);
      }
      
      setPost(updatedPost);

      return updatedPost;
    } catch (err) {
      setError('Error saving post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveComment = async (data: Partial<Post> ,locale:string,imageUrl? : File) => {
    setLoading(true);
    try {
      let updatedPost;
      
      if (data?.id) {
        if (!token) {
          throw new Error("Authentication token is required.");
        }
        // Update existing post
        updatedPost = await updatePost(data.id, {
          ...data
        },token,locale);

      } else {
          if (!token) {
              throw new Error("Authentication token is required.");
            }
        // Create new post
        updatedPost = await createPost({
          title: data.title || '',
          content: data.content || '',
          parent_id :data.parent_id || null,
          like: data.like || 0,
          hit: data.hit || 0,
          status: data.status || 'draft'
        },token,locale ,imageUrl);
      }
      
      setPost(updatedPost);

      return updatedPost;
    } catch (err : any) {
      setError('Error saving post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publishPost = async (post:Post,locale:string) => {
    if (!post.id) return;
    
    setLoading(true);
    try {
      if (!token) {
          throw new Error("Authentication token is required.");
        }
      const updatedPost = await apiPublishPost(post,token,locale);
      setPost(updatedPost);
      return updatedPost;
    } catch (err) {
      setError('Error publishing post');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

 

  const increasseHit = async (post:Post,locale:string) => {
    if (!post.id) return;
    
    setLoading(true);
    try {
      if (!token) {
          throw new Error("Authentication token is required.");
        }
      const updatedPost = await apiIncreasseHit(post,token,locale);
      setPost(updatedPost);
      return updatedPost;
    } catch (err) {
      setError('Error publishing post');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unpublishPost = async (post:Post,locale:string) => {
    
    setLoading(true);
    try {
      if (!token) {
          throw new Error("Authentication token is required.");
        }
      const updatedPost = await apiUnpublishPost(post,token,locale);
      setPost(updatedPost);
      return updatedPost;
    } catch (err) {
      setError('Error unpublishing post');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectedPost = async (post:Post,locale:string) => {
    
    setLoading(true);
    try {
      if (!token) {
          throw new Error("Authentication token is required.");
        }
      const updatedPost = await apiRejectedPost(post,token,locale);
      setPost(updatedPost);
      return updatedPost;
    } catch (err) {
      setError('Error rejected post');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    post,
    loading,
    error,
    savePost,
    publishPost,
    unpublishPost,
    rejectedPost,
    increasseHit,
    saveComment
  };
};
