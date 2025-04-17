// app/api/packages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const API_KEY = process.env.ADMIN_API_KEY;

export async function GET(req: NextRequest) {
  const key = req.headers.get('x-api-key');
  if (key !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const snapshot = await getDocs(collection(db, 'packages'));
  const packages = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return NextResponse.json(packages);
}

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-api-key');
  if (key !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { title, description,  duration, transfers, activities, stay, itenery1, itenery2, itenery3, price, imageUrl } = body; 
  const docRef = await addDoc(collection(db, 'packages'), { title, description,  duration, transfers, activities, stay, itenery1, itenery2, itenery3, price, imageUrl});   

  return NextResponse.json({ success: true, id: docRef.id });
}
