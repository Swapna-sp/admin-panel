'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { useAdminAuthGuard } from '@/hooks/useAdminAuthGuard';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


export default function PackagesPage() {
  useAdminAuthGuard();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: '',
    transfers: '',
    activities: '',
    stay: '',
    itenery1: '',
    itenery2: '',
    itenery3: '',
    price: '',
    imageUrl: '',
  });

  const API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY!;
  const router = useRouter();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/packages', {
          headers: { 'x-api-key': API_KEY },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setPackages(data);
          setFilteredPackages(data);
        } else {
          console.error('Invalid data from API:', data);
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
      }
    };

    fetchPackages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading(editingId ? 'Updating package...' : 'Adding package...');

    try {
      const res = await fetch(`/api/packages${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to submit');

      const updatedPackage = await res.json();

      if (editingId) {
        const updatedList = packages.map((pkg) =>
          pkg.id === editingId ? updatedPackage : pkg
        );
        setPackages(updatedList);
        setFilteredPackages(updatedList);
        toast.success('Package updated!', { id: toastId });
      } else {
        setPackages((prev) => [...prev, updatedPackage]);
        setFilteredPackages((prev) => [...prev, updatedPackage]);
        toast.success('Package added!', { id: toastId });
      }

      resetForm();
    } catch (err) {
      toast.error('Something went wrong', { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this package?');
    if (!confirmDelete) return;

    const toastId = toast.loading('Deleting package...');
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
        headers: { 'x-api-key': API_KEY },
      });

      if (!res.ok) throw new Error('Delete failed');

      const updatedList = packages.filter((pkg) => pkg.id !== id);
      setPackages(updatedList);
      setFilteredPackages(updatedList);
      toast.success('Package deleted', { id: toastId });
    } catch (err) {
      toast.error('Failed to delete', { id: toastId });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = packages.filter((pkg) =>
      pkg.title.toLowerCase().includes(query)
    );
    setFilteredPackages(filtered);
  };

  const handleEditPackage = (pkg: any) => {
    setForm({
      title: pkg.title || '',
      description: pkg.description || '',
      duration: pkg.duration || '',
      transfers: pkg.transfers || '',
      activities: pkg.activities || '',
      stay: pkg.stay || '',
      itenery1: pkg.itenery1 || '',
      itenery2: pkg.itenery2 || '',
      itenery3: pkg.itenery3 || '',
      price: pkg.price || '',
      imageUrl: pkg.imageUrl || '', // ✅ use imageUrl here
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      duration: '',
      transfers: '',
      activities: '',
      stay: '',
      itenery1: '',
      itenery2: '',
      itenery3: '',
      price: '',
      imageUrl: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Topbar />

        {/* Search Bar */}
        {/* <div className="p-4">
          <input
            type="text"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={handleSearch}
            className="p-2 border rounded w-full"
          />
     </div> */}
     <div className='px-6 mt-5'>
<div className="flex items-center  rounded-lg p-1 w-full  shadow-md px-2 py-2 border border-gray-200">
  {/* Search Input */}
  <input
    type="text"
    placeholder="Search by title"
    value={searchQuery}
    onChange={handleSearch}
    className="flex-grow text-black px-6 py-2 focus:outline-none"
  />

  {/* Search Button */}
  <button
    type="submit"
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition"
  >
    <svg
      className="w-5 h-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.15 6.15z"
      />
    </svg>
  </button>
</div>
</div>


        {/* Form */}
        {showForm ? (
          <div className="bg-white p-6 rounded-lg shadow-md mx-6 mt-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'title', 'description', 'duration', 'transfers', 'activities', 'stay',
                'itenery1', 'itenery2', 'itenery3', 'price', 'imageUrl'
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field === 'imageUrl' ? 'Image URL' : field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="p-2 border rounded"
                  required
                />
              ))}
              <div className="col-span-full flex justify-between mt-4">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
                  {editingId ? 'Update Package' : 'Add Package'}
                </button>
                <button type="button" onClick={resetForm} className="text-sm text-gray-600 underline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (    
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-6 mt-6">
  <div
    onClick={() => router.push('/packages/packageform')}
    className="cursor-pointer border-dashed border-2 border-gray-300 rounded-lg flex items-center justify-center h-40 shadow-sm hover:shadow-md transition"
  >
    <div className="text-center">
      <div className="text-4xl font-bold text-gray-500">+</div>
      <div className="text-sm font-semibold text-gray-700 mt-2">ADD PACKAGE</div>
    </div>
  </div>
</div>

        )}

        {/* Package Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-6 mt-6">
          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
                <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{pkg.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                  <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <span>{pkg.duration} days</span>
                    <span>${pkg.price}</span>
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => handleEditPackage(pkg)} className="text-sm text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(pkg.id)} className="text-sm text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No packages found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
