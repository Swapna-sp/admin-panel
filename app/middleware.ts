import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';

export async function middleware(req: Request) {
  const user = getAuth().currentUser;

  // Protect the `/admin` routes
  if (req.url.includes('/admin') && !user) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect to login if not authenticated
  }

  return NextResponse.next();
}
