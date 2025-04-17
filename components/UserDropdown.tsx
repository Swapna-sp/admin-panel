'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';


import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user?.email) {
        setUserEmail(user.email);
      } else {
        // optional redirect on logout
        // router.push('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // ✅ use imported `auth`
      console.log('User signed out');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <img
          src="/avatar.png"
          alt="User Avatar"
          className="w-10 h-10 rounded-full bg-black"
        />
        <span className="text-sm font-medium text-black">{userEmail}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
