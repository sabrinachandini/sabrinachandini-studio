import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'sabrina_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function getAdminCredentials() {
  const password = process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME || 'admin';

  if (!password) {
    return null; // Fail closed if not configured
  }

  return { username, password };
}

export async function verifyAdminPassword(inputPassword: string): Promise<boolean> {
  const credentials = getAdminCredentials();
  if (!credentials) {
    return false;
  }
  return inputPassword === credentials.password;
}

export async function createAdminSession(): Promise<string> {
  const token = crypto.randomUUID();
  const expires = Date.now() + SESSION_DURATION;
  return `${token}:${expires}`;
}

export async function isValidSession(session: string | undefined): Promise<boolean> {
  if (!session) return false;

  const [, expiresStr] = session.split(':');
  const expires = parseInt(expiresStr, 10);

  if (isNaN(expires) || Date.now() > expires) {
    return false;
  }

  return true;
}

export async function getAdminSession(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return isValidSession(session);
}

export { ADMIN_COOKIE_NAME };
