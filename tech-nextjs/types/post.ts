import { User } from './user';

export interface Post {
  id: number| null;
  title: string;
  content: string;
  user_id?: number;
  parent_id: number | null;
  image_path?: string |File| null;
  status?: 'draft' | 'published'| 'unpublished' | 'pending' | 'rejected';
  like: number;
  hit: number;
  created_at?: string;
  updated_at?: string;
  user?: User;
  comments?: Post[];
  isLikedByCurrentUser?: boolean;
  comments_count? :number|null
}

export interface PostFormData {
  title: string;
  content: string;
  image?: File | null;
  parent_id?: number | null;
}

export interface PostFilters {
  search?: string;
  sortBy?: 'newest' | 'popular' | 'mostCommented';
  page: number;
  limit: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}
