import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);

  return NextResponse.redirect(new URL('/admin', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
