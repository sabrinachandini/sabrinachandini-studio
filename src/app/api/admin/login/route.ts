import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createAdminSession, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const isValid = await verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const session = await createAdminSession();
    const cookieStore = await cookies();

    cookieStore.set(ADMIN_COOKIE_NAME, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
