import { Category } from '../types';
import { API_BASE_URL, getCurrentUserIdentifier } from './client';

export async function fetchUserCategories(user?: string): Promise<Category[]> {
  const userId = user || getCurrentUserIdentifier();
  try {
    const res = await fetch(`${API_BASE_URL}/categories?user=${encodeURIComponent(userId)}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('Backend /categories unreachable, returning empty list:', err);
    return [];
  }
}

export async function saveUserCategory(name: string, icon: string, user?: string): Promise<Category> {
  const userId = user || getCurrentUserIdentifier();
  const res = await fetch(`${API_BASE_URL}/categories?user=${encodeURIComponent(userId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, icon, userIdentifier: userId }),
  });
  if (!res.ok) throw new Error('Failed to save category');
  return res.json();
}

export async function deleteUserCategory(name: string, user?: string): Promise<void> {
  const userId = user || getCurrentUserIdentifier();
  const res = await fetch(`${API_BASE_URL}/categories?name=${encodeURIComponent(name)}&user=${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete category');
}
