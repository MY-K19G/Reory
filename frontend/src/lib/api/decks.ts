import { Deck, Stats } from '../types';
import { API_BASE_URL } from './client';

export async function fetchDecks(author?: string): Promise<Deck[]> {
  try {
    const url = author && author.trim()
      ? `${API_BASE_URL}/decks?author=${encodeURIComponent(author.replace(/^@+/, '').trim())}`
      : `${API_BASE_URL}/decks`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('Backend /decks unreachable, returning empty list:', err);
    return [];
  }
}

export async function fetchDeckById(idOrSlug: string | number): Promise<Deck> {
  const str = String(idOrSlug).trim();
  // If it's a numeric ID, fetch directly
  if (/^\d+$/.test(str)) {
    const res = await fetch(`${API_BASE_URL}/decks/${str}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch deck');
    return res.json();
  }

  // Otherwise treat as slug lookup
  const res = await fetch(`${API_BASE_URL}/decks/by-slug?slug=${encodeURIComponent(str)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch deck by slug');
  return res.json();
}

export async function fetchDeckByAuthorAndSlug(author: string, slug: string): Promise<Deck> {
  const cleanAuthor = author.replace(/^@+/, '').trim();
  const res = await fetch(`${API_BASE_URL}/decks/@${encodeURIComponent(cleanAuthor)}/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch deck @${cleanAuthor}/${slug}`);
  return res.json();
}

export async function createDeck(deck: Partial<Deck>): Promise<Deck> {
  const res = await fetch(`${API_BASE_URL}/decks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deck),
  });
  if (!res.ok) throw new Error('Failed to create deck');
  return res.json();
}

export async function updateDeck(id: number | string, deck: Partial<Deck>): Promise<Deck> {
  const res = await fetch(`${API_BASE_URL}/decks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deck),
  });
  if (!res.ok) throw new Error('Failed to update deck');
  return res.json();
}

export async function deleteDeck(id: number | string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/decks/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete deck');
}

export async function forkDeck(id: number | string, author?: string): Promise<Deck> {
  const url = author && author.trim()
    ? `${API_BASE_URL}/decks/${id}/fork?author=${encodeURIComponent(author.replace(/^@+/, '').trim())}`
    : `${API_BASE_URL}/decks/${id}/fork`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fork deck');
  return res.json();
}

export async function cloneDeck(id: number | string, author?: string): Promise<Deck> {
  const url = author && author.trim()
    ? `${API_BASE_URL}/decks/${id}/clone?author=${encodeURIComponent(author.replace(/^@+/, '').trim())}`
    : `${API_BASE_URL}/decks/${id}/clone`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to clone deck');
  return res.json();
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE_URL}/stats`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch statistics');
  return res.json();
}
