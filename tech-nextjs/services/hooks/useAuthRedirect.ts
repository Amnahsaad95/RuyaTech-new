// hooks/useAuthRedirect.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/services/context/AuthContext';

export const useAuthRedirect = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login'); 
    }
  }, [user, loading, router]);
};
