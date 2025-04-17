// hooks/useAdminAuthGuard.ts
'use client';

import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function useAdminAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login'); // 🔁 Redirect to login if not logged in
      }
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);
}
