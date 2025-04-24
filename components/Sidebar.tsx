'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Package, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { href: '/user', label: 'Leads', icon: <Users size={20} /> },
    { href: '/packages', label: 'Packages', icon: <Package size={20} /> },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 min-h-screen bg-[#08082c]  text-white border-r border-gray-200 shadow-md px-6 py-8 overflow-y-scroll">
    <div className="flex items-center gap-3 mb-8">
      <img src="/farefirst-blue.png" alt="FareFirst Logo" className="h-10 w-40 object-contain" />
      {/* <h1 className="text-2xl font-bold italic text-indigo-600">FareFirst</h1> */}
    </div>
    <nav className="space-y-3">
      {links.map(({ href, label, icon }) => (
        <Link
          key={label}
          href={href}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
            ${isActive(href)
              ? 'bg-indigo-100 text-black font-semibold'
              : 'text-white hover:bg-gray-100 hover:text-black'}
          `}
        >
          {icon}
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  </aside>
  
  );
}
