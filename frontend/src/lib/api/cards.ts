import { Card, WordDetails } from '../types';
import { API_BASE_URL } from './client';

export async function fetchStudyQueue(deckId: string | number): Promise<Card[]> {
  const res = await fetch(`${API_BASE_URL}/decks/${deckId}/study`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch study queue');
  return res.json();
}

export async function submitCardReview(cardId: number, grade: number): Promise<Card> {
  const res = await fetch(`${API_BASE_URL}/cards/${cardId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grade }),
  });
  if (!res.ok) throw new Error('Failed to submit review');
  return res.json();
}

export async function fetchWordDetailsFromBackend(
  deckId: number | string,
  word: string,
  targetLang: string,
  nativeLang: string
): Promise<WordDetails | null> {
  const url = `${API_BASE_URL}/decks/${deckId}/words/${encodeURIComponent(word)}/details?target=${encodeURIComponent(targetLang)}&native=${encodeURIComponent(nativeLang)}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('Backend word details fetch failed:', e);
    return null;
  }
}

export async function addCardToDeck(deckId: number | string, card: Partial<Card>): Promise<Card> {
  const res = await fetch(`${API_BASE_URL}/decks/${deckId}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  });
  if (!res.ok) throw new Error('Failed to add card');
  return res.json();
}

export async function deleteCard(cardId: number | string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete card');
}

export async function updateCard(cardId: number | string, card: Partial<Card>): Promise<Card> {
  const res = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  });
  if (!res.ok) throw new Error('Failed to update card');
  return res.json();
}

export async function updateCardImageByWord(word: string, imageUrl: string): Promise<{ updatedCount: number; word: string; imageUrl: string }> {
  const res = await fetch(`${API_BASE_URL}/cards/by-word/image`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word, imageUrl }),
  });
  if (!res.ok) throw new Error('Failed to update card image');
  return res.json();
}
