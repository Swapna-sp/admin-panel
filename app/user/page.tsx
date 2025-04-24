'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
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
  const [isLoading, setIsLoading] = useState(true);
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
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No authenticated user");
  
      const idToken = await currentUser.getIdToken();
  
      const response = await fetch("https://api-5oz2r3w4ya-uc.a.run.app/getTravelSearches", {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
  
      const data = await response.json();
      if (Array.isArray(data)) {
        setTravelData(data);
      } else {
        console.error("Expected an array but got:", data);
        setTravelData([]);
      }
    } catch (error) {
      console.error("Failed to fetch travel data:", error);
      setTravelData([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatTimestamp = (timestamp: any) => {
    const date = timestamp?.seconds ? new Date(timestamp.seconds * 1000) : null;
    return date ? date.toLocaleString() : "N/A";
  };

  if (user === null) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <Topbar />
        <h2 className="text-2xl font-bold mb-6 text-gray-800 px-6 mt-5">User Travel Submissions</h2>
        <div className="px-6">
          <div className="overflow-x-auto bg-white shadow-md rounded-xl">
            <table className="min-w-full table-auto text-sm text-gray-700">
              <thead className="bg-gray-200 text-gray-800 text-sm">
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
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : travelData.length > 0 ? (
                  travelData.map((data, index) => (
                    <tr key={data.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100 transition"}>
                      <td className="px-6 py-4">{data.email}</td>
                      <td className="px-6 py-4">{data.pax}</td>
                      <td className="px-6 py-4">{data.phone}</td>
                      <td className="px-6 py-4">{data.rooms}</td>
                      <td className="px-6 py-4">{data.search}</td>
                      <td className="px-6 py-4">{formatTimestamp(data.timestamp)}</td>
                      <td className="px-6 py-4">{data.travelDate}</td>
                      <td className="px-6 py-4">{data.type}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No data available
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






