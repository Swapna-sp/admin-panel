'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Sidebar from '@/components/Sidebar';
import Topbar from "@/components/Topbar";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">

     <Sidebar />
      {/* Main Dashboard Content */}
      <main className="flex-1 flex flex-col">
        <Topbar />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 mt-5">
          <div className="p-6 rounded-xl shadow bg-indigo-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-indigo-600">--</p>
          </div>
          <div className="bg-indigo-100 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Submissions</h3>
            <p className="text-3xl font-bold text-indigo-600">--</p>
          </div>
          <div className="bg-indigo-100 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Trips</h3>
            <p className="text-3xl font-bold text-indigo-600">--</p>
          </div>
        </div>
      </main>
    </div>
  );
}
