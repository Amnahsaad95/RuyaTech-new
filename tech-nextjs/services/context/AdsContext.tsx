import { Ad } from '@/types/ad'
import { useAuth } from './AuthContext';


// API functions for ad operations
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAds = async (): Promise<Ad[]> => {
  try {
    const response = await fetch(`${API_URL}/api/ads`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error:${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched result:', data);

    return data.data;
    
  } catch (error) {
    console.error('Error fetching ads:', error);
    throw error;
  }
};

export const fetchAd = async (id: string): Promise<Ad> => {
  try {
    const response = await fetch(`${API_URL}/api/ads/${id}`, {
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
    console.error(`Error fetching ad ${id}:`, error);
    throw error;
  }
};

export const createAd = async (ad: Omit<Ad, 'id' | 'createdAt' | 'updatedAt'>  ,locale: string, imageUrl ?:File): Promise<Ad> => {

  try {

    
      const data = new FormData();
      data.append('FullName', ad.FullName);
      data.append('ad_Url', ad.ad_Url);
      data.append('location', ad.location);
      data.append('start_date', ad.start_date);      
      data.append('End_date', ad.End_date);

      if (imageUrl) {
        data.append('image', imageUrl);
      }

      const headers: Record<string, string> = {
      'Accept-Language': locale,
     };

      const response = await fetch(`${API_URL}/api/ads`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: data,
      });


    if (!response.ok) {
       const error = await response.json();
      throw error;
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateAd = async (id: string, ad: Partial<Ad>,token: string): Promise<Ad> => {
  try {
    console.log(token);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      
    const response = await fetch(`${API_URL}/api/ads/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(ad),
    });

    if (!response.ok) {
      const error = await response.json();
        console.log(error);
        throw error;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating ad ${id}:`, error);
    throw error;
  }
};

export const deleteAd = async (id: string): Promise<Ad> => {
  try {
    const headers: Record<string, string> = {'Content-Type': 'application/json',};
      // Add authorization header if token exists
      if (localStorage.getItem('authToken')) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
      }

    const response = await fetch(`${API_URL}/api/ads/${id}`, {
      method: 'DELETE',
      headers,
    });


    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting ad ${id}:`, error);
    throw error;
  }
};

export const publishAd = async (ad: Ad,token: string): Promise<Ad> => {
  ad.status = 'published';
  return updateAd(ad.id, { status: 'published' },token);
};

export const rejectedAd = async (ad: Ad,token: string): Promise<Ad> => {
  ad.status = 'rejected';
  return updateAd(ad.id, { status: 'rejected' },token);
};

export const unpublishAd = async (ad: Ad,token: string): Promise<Ad> => {
  ad.status = 'unpublished';
  return updateAd(ad.id, { status: 'unpublished' },token);
};
export const increaseView = async (ad: Ad ,token: string): Promise<Ad> => {
  ad.hit = ad.hit +1;
  return updateAd(ad.id , { hit : ad.hit},token);
};

export const getPublishedAds = async (): Promise<Ad[]> => {
  const ads = await fetchAds();
  return ads.filter(ad => ad.status === 'published');
};

export const getDraftAds = async (): Promise<Ad[]> => {
  const ads = await fetchAds();
  return ads.filter(ad => ad.status === 'draft');
};

export const getPendingAds = async (): Promise<Ad[]> => {
  const ads = await fetchAds();
  return ads.filter(ad => ad.status === 'pending');
};

