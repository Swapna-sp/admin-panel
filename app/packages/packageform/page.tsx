'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAdminAuthGuard } from '@/hooks/useAdminAuthGuard';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function PackageFormPage() {
  useAdminAuthGuard();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  const API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY!;

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

  useEffect(() => {
    if (!id) return;

    const fetchPackage = async () => {
      try {
        const res = await fetch(`/api/packages/${id}`, {
          headers: { 'x-api-key': API_KEY },
        });
        const data = await res.json();

        setForm({
          title: data.title || '',
          description: data.description || '',
          duration: data.duration || '',
          transfers: data.transfers || '',
          activities: data.activities || '',
          stay: data.stay || '',
          itenery1: data.itenery1 || '',
          itenery2: data.itenery2 || '',
          itenery3: data.itenery3 || '',
          price: data.price || '',
          imageUrl: data.imageUrl || '',
        });
      } catch (error) {
        console.error('Failed to fetch package', error);
      }
    };

    fetchPackage();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading(id ? 'Updating package...' : 'Adding package...');

    try {
      const res = await fetch(`/api/packages${id ? `/${id}` : ''}`, {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Submit failed');

      toast.success(id ? 'Package updated!' : 'Package added!', { id: toastId });
      router.push('/packages');
    } catch (error) {
      toast.error('Error saving package', { id: toastId });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1">
        <Topbar />
        <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">{id ? 'Edit Package' : 'Add Package'}</h2>
         <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {[
    { name: 'title', label: 'Title' },
    { name: 'description', label: 'Description' },
    { name: 'duration', label: 'Duration (in days)' },
    { name: 'transfers', label: 'Transfers' },
    { name: 'activities', label: 'Activities' },
    { name: 'stay', label: 'Stay' },
    { name: 'itenery1', label: 'Itinerary Day 1' },
    { name: 'itenery2', label: 'Itinerary Day 2' },
    { name: 'itenery3', label: 'Itinerary Day 3' },
    { name: 'price', label: 'Price ($)' },
    { name: 'imageUrl', label: 'Image URL' }
  ].map(({ name, label }) => (
    <div key={name} className="flex flex-col">
      <label htmlFor={name} className="mb-1 font-medium text-sm text-gray-700">
        {label}
      </label>
      <input
        id={name}
        type="text"
        value={form[name as keyof typeof form]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="p-2 border rounded"
        required
      />
    </div>
  ))}

  <div className="col-span-full flex justify-between mt-4">
    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
      {id ? 'Update Package' : 'Add Package'}
    </button>
    <button
      type="button"
      onClick={() => router.push('/packages')}
      className="text-gray-600 underline"
    >
      Cancel
    </button>
  </div>
</form>

        </div>
      </main>
    </div>
  );
}
