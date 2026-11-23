import { API_BASE_URL } from './client';

export async function apiSignUp(payload: {
  username: string;
  email: string;
  password?: string;
  displayName?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to sign up');
  }
  return data;
}

export async function apiLogin(payload: { usernameOrEmail: string; password?: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Invalid credentials');
  }
  return data;
}

export async function apiForgotPassword(payload: { emailOrUsername: string; newPassword: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to reset password');
  }
  return data;
}

export async function apiCheckHandle(
  handle: string,
  currentUsername?: string
): Promise<{ available: boolean; error?: string; message?: string }> {
  try {
    const cleanHandle = handle.replace(/^@/, '').trim();
    if (!cleanHandle) {
      return { available: false, error: 'Handle cannot be empty' };
    }
    const url = `${API_BASE_URL}/auth/check-handle?handle=${encodeURIComponent(cleanHandle)}${
      currentUsername ? `&currentUsername=${encodeURIComponent(currentUsername)}` : ''
    }`;
    const res = await fetch(url);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { available: false, error: data.error || 'Handle check failed' };
    }
    return data;
  } catch (err) {
    console.warn('Handle check offline fallback:', err);
    return { available: true };
  }
}

export async function apiSavePreferences(payload: {
  usernameOrEmail: string;
  handle?: string;
  targetLang?: string;
  nativeLang?: string;
  country?: string;
  level?: string;
  dailyGoalCards?: number;
  bio?: string;
  displayName?: string;
  avatar?: string;
  banner?: string;
  bannerPosition?: string;
  favoriteDecks?: string;
  archivedDecks?: string;
  cardDetailSettings?: string;
  themeMode?: string;
  accentColor?: string;
  appLanguage?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/preferences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save preferences');
  }
  return data;
}

export const savePreferences = apiSavePreferences;

export async function apiDeleteAccount(usernameOrEmail: string) {
  const res = await fetch(`${API_BASE_URL}/auth/delete-account`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete account');
  }
  return data;
}
