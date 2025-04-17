import { db } from '@/lib/firebase';
import { doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.ADMIN_API_KEY;

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await deleteDoc(doc(db, 'packages', params.id));
    return NextResponse.json({ message: 'Package deleted' });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: 'Error deleting package' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const packageId = params.id;
  const body = await req.json();

  const ref = doc(db, 'packages', packageId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return NextResponse.json({ error: 'Package not found' }, { status: 404 });
  }

  const {
    title,
    description,
    duration,
    transfers,
    activities,
    stay,
    itenery1,
    itenery2,
    itenery3,
    price,
    imageUrl,
  } = body;

  try {
    await updateDoc(ref, {
      title,
      description,
      duration,
      transfers,
      activities,
      stay,
      itenery1,
      itenery2,
      itenery3,
      price,
      imageUrl,
    });

    return NextResponse.json({ id: packageId, ...body });
  } catch (err) {
    console.error('PUT error:', err);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}
