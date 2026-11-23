export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export function getCurrentUserIdentifier(): string {
  if (typeof window === 'undefined') return 'default_user';
  let userId = localStorage.getItem('duocard_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('duocard_user_id', userId);
  }
  return userId;
}
