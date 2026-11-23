export interface QuizSessionRecord {
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSeconds: number;
  completedAt: string;
}

export interface DeckQuizStats {
  deckId: string | number;
  totalAttempts: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  bestScore: number;
  bestAccuracy: number;
  totalTimeSeconds: number;
  lastPlayedAt: string;
  lastQuiz?: QuizSessionRecord;
  history?: QuizSessionRecord[];
}

const STORAGE_PREFIX = 'duocard_quiz_stats_';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export function getDeckQuizStats(deckId: string | number): DeckQuizStats | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${deckId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function fetchDeckQuizStatsFromApi(deckId: string | number): Promise<DeckQuizStats | null> {
  const numericId = typeof deckId === 'string' ? parseInt(deckId, 10) : deckId;
  if (!numericId || isNaN(numericId)) {
    return getDeckQuizStats(deckId);
  }

  try {
    const res = await fetch(`${API_BASE}/decks/${numericId}/quiz/stats`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.totalAttempts > 0) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(`${STORAGE_PREFIX}${deckId}`, JSON.stringify(data));
          } catch {}
        }
        return data as DeckQuizStats;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch quiz stats from backend API, using cached stats:', err);
  }

  return getDeckQuizStats(deckId);
}

export async function recordQuizCompletion(
  deckId: string | number,
  score: number,
  totalQuestions: number,
  timeSeconds: number = 0
): Promise<DeckQuizStats> {
  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const now = new Date().toISOString();
  const sessionRecord: QuizSessionRecord = {
    score,
    totalQuestions,
    accuracy,
    timeSeconds,
    completedAt: now,
  };

  let localUpdated: DeckQuizStats;
  try {
    const existing = getDeckQuizStats(deckId);
    const prevHistory = existing?.history || (existing?.lastQuiz ? [existing.lastQuiz] : []);
    const updatedHistory = [sessionRecord, ...prevHistory].slice(0, 10);

    localUpdated = existing
      ? {
          deckId,
          totalAttempts: existing.totalAttempts + 1,
          totalQuestionsAnswered: existing.totalQuestionsAnswered + totalQuestions,
          totalCorrect: existing.totalCorrect + score,
          bestScore: Math.max(existing.bestScore, score),
          bestAccuracy: Math.max(existing.bestAccuracy, accuracy),
          totalTimeSeconds: (existing.totalTimeSeconds || 0) + timeSeconds,
          lastPlayedAt: now,
          lastQuiz: sessionRecord,
          history: updatedHistory,
        }
      : {
          deckId,
          totalAttempts: 1,
          totalQuestionsAnswered: totalQuestions,
          totalCorrect: score,
          bestScore: score,
          bestAccuracy: accuracy,
          totalTimeSeconds: timeSeconds,
          lastPlayedAt: now,
          lastQuiz: sessionRecord,
          history: [sessionRecord],
        };

    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_PREFIX}${deckId}`, JSON.stringify(localUpdated));
      window.dispatchEvent(new Event('duocard_quiz_stats_updated'));
    }
  } catch (e) {
    localUpdated = {
      deckId,
      totalAttempts: 1,
      totalQuestionsAnswered: totalQuestions,
      totalCorrect: score,
      bestScore: score,
      bestAccuracy: accuracy,
      totalTimeSeconds: timeSeconds,
      lastPlayedAt: now,
      lastQuiz: sessionRecord,
      history: [sessionRecord],
    };
  }

  // Persist directly to backend database
  const numericId = typeof deckId === 'string' ? parseInt(deckId, 10) : deckId;
  if (numericId && !isNaN(numericId)) {
    try {
      const res = await fetch(`${API_BASE}/decks/${numericId}/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, totalQuestions, timeSeconds }),
      });
      if (res.ok) {
        const serverStats = await res.json();
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(`${STORAGE_PREFIX}${deckId}`, JSON.stringify(serverStats));
            window.dispatchEvent(new Event('duocard_quiz_stats_updated'));
          } catch {}
        }
        return serverStats as DeckQuizStats;
      }
    } catch (err) {
      console.warn('Could not post quiz record to backend API, saved locally:', err);
    }
  }

  return localUpdated;
}
