export interface PexelsPhoto {
  id: number;
  url: string;
  photographer: string;
  photographer_url?: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

export function getPexelsApiKey(): string {
  if (typeof window !== 'undefined') {
    const localKey = localStorage.getItem('duocard_pexels_key');
    if (localKey && localKey.trim()) return localKey.trim();
  }
  return '';
}

export async function fetchPexelsPhotos(
  query: string,
  customKey?: string,
  count: number = 3
): Promise<PexelsPhoto[]> {
  const apiKey = customKey || getPexelsApiKey();
  const trimmed = query.trim();
  if (!apiKey || !trimmed) return [];

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(trimmed)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!res.ok) {
      console.warn('Pexels API request failed:', res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    return data.photos || [];
  } catch (err) {
    console.warn('Pexels API error:', err);
    return [];
  }
}

export async function fetchPexelsPhotoById(
  id: number | string,
  customKey?: string
): Promise<PexelsPhoto | null> {
  const apiKey = customKey || getPexelsApiKey();
  if (!apiKey || !id) return null;

  try {
    const res = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!res.ok) {
      console.warn('Pexels API single photo fetch failed:', res.status, res.statusText);
      return null;
    }

    const data: PexelsPhoto = await res.json();
    return data || null;
  } catch (err) {
    console.warn('Pexels API photo error:', err);
    return null;
  }
}
