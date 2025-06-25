
import { useState, useEffect } from 'react';
import { Ad } from '@/types/ad';
import { fetchAd, createAd, updateAd, publishAd as apiPublishAd, unpublishAd as apiUnpublishAd ,rejectedAd as apiRejectedAd,increaseView as apiIncreaseView} from '@/services/context/AdsContext';

import { useAuth } from '../context/AuthContext';

interface UseAdProps {
  adId?: string;
}

export const useAd = ({ adId }: UseAdProps = {}) => {
  const { token } = useAuth();

  const [ad, setAd] = useState<Ad | null>(null);
  const [imageUrl, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAd = async () => {
      if (!adId) {
        // New ad
        setAd({
            id:'',
            FullName: '',
            ad_Url: '',
            Image : '',
            location :'',
            status: 'draft' ,
            start_date: '',
            End_date: '',
            hit:0,
        });
        return;
      }
      
      setLoading(true);
      try {
        const fetchedAd = await fetchAd(adId);
        setAd(fetchedAd);
        setError(null);
      } catch (err) {
        setError('Error loading ads');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAd();
  }, [adId]);

  const saveAd = async (data: Partial<Ad> ,locale:string, imageUrl? : File) => {
    setLoading(true);
    try {
      let updatedAd;
      
      if (data?.id) {
        // Update existing ads
        if (!token) {
          throw new Error("Authentication token is required.");
        }

        updatedAd = await updateAd(data.id, {
          ...data
        },token);
      } else {
          // Create new ads
        updatedAd= await createAd({
          FullName: data.FullName || '',
          ad_Url: data.ad_Url || '',
           hit:0,         
          location : data.location || '',
          start_date : data.start_date || '',                
          End_date : data.End_date || '',
          
        },locale ,imageUrl);
      }
      
      setAd(updatedAd);
      return updatedAd;
    } catch (err) {
      setError('Error saving ads');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publishAd = async (ad:Ad) => {
    if (!ad?.id) return;
    
    setLoading(true);
    try {
      if (!token) {
          throw new Error("Authentication token is required.");
        }
      const updatedAd = await apiPublishAd(ad,token);
      setAd(updatedAd);
      return updatedAd;
    } catch (err) {
      setError('Error publishing ad');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unpublishAd = async (ad:Ad) => {
    if (!ad?.id) return;
    
    setLoading(true);
    try {
      if (!token) {
          throw new Error("Authentication token is required.");
        }
      const updatedAd = await apiUnpublishAd(ad,token);
      setAd(updatedAd);
      return updatedAd;
    } catch (err) {
      setError('Error unpublishing ad');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectedAd = async (ad:Ad) => {
    if (!ad?.id) return;
    
    setLoading(true);
    try {
      if (!token) {
          throw new Error("Authentication token is required.");
        }
      const updatedAd = await apiRejectedAd(ad,token);
      setAd(updatedAd);
      return updatedAd;
    } catch (err) {
      setError('Error unpublishing ad');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const increaseView = async (ad:Ad) => {
    if (!ad?.id) return;
    
    setLoading(true);
    try {
      if (!token) {
          throw new Error("Authentication token is required.");
        }
      const updatedAd = await apiIncreaseView(ad,token);
      setAd(updatedAd);
      return updatedAd;
    } catch (err) {
      setError('Error unpublishing ad');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    ad,
    loading,
    error,
    saveAd,
    publishAd,
    unpublishAd,
    increaseView,
    rejectedAd
  };
};
