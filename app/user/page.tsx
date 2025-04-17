'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";



interface TravelData {
  id: string;
  email: string;
  pax: string;
  phone: string;
  rooms: string;
  search: string;
  timestamp: any;
  travelDate: string;
  type: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [travelData, setTravelData] = useState<TravelData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchTravelData();
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTravelData = async () => {
    const snapshot = await getDocs(collection(db, "travelSearches"));
    const data: TravelData[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as TravelData[];

    setTravelData(data);
  };

  const formatTimestamp = (timestamp: any) => {
    const date = timestamp?.seconds ? new Date(timestamp.seconds * 1000) : null;
    return date ? date.toLocaleString() : "N/A";
  };

  if (user === null) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col ">
        <Topbar />
        <h2 className="text-2xl font-bold mb-6 text-gray-800 px-6 mt-5">User Travel Submissions</h2>
        <div className="px-6">
        
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full table-auto text-sm text-gray-700">
            <thead className="bg-gray-200 text-gray-800  text-sm">
              <tr>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Pax</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-left">Rooms</th>
                <th className="px-6 py-4 text-left">Search</th>
                <th className="px-6 py-4 text-left">Submitted At</th>
                <th className="px-6 py-4 text-left">Travel Date</th>
                <th className="px-6 py-4 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {travelData.map((data, index) => (
                <tr
                  key={data.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100 transition"}
                >
                  <td className="px-6 py-4">{data.email}</td>
                  <td className="px-6 py-4">{data.pax}</td>
                  <td className="px-6 py-4">{data.phone}</td>
                  <td className="px-6 py-4">{data.rooms}</td>
                  <td className="px-6 py-4">{data.search}</td>
                  <td className="px-6 py-4">{formatTimestamp(data.timestamp)}</td>
                  <td className="px-6 py-4">{data.travelDate}</td>
                  <td className="px-6 py-4">{data.type}</td>
                </tr>
              ))}
              {travelData.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
            Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      </main>
    </div>
  );
}
