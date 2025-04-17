'use client';

import { LogOut } from 'lucide-react';
import UserDropdown from './UserDropdown';

export default function Topbar() {
  return (
    <header className="w-full bg-white border-b px-6 h-20 w-100 flex items-center justify-between">
    <h2 className="text-3xl font-bold mb-2 text-gray-500">Welcome, Admin!</h2>
      
      {/* <button className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700">
        <LogOut className="w-5 h-5" />
        Logout
      </button> */}
      <UserDropdown />
    </header>
  );
}
