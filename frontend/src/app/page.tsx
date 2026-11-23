'use client';

import { useEffect, useState, Suspense } from 'react';
import { fetchDecks, fetchStats } from '@/lib/api';
import { Deck, Stats } from '@/lib/types';
import { DashboardView } from '@/components/DashboardView';

function HomeContent() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDecks(), fetchStats()])
      .then(([decksData, statsData]) => {
        setDecks(decksData);
        setStats(statsData);
      })
      .catch((err) => console.error('Error fetching data:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 min-h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-[#f5f7fb] dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-[1440px] w-full mx-auto flex-1">
        <DashboardView decks={decks} stats={stats} loading={loading} />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading home...</div>}>
      <HomeContent />
    </Suspense>
  );
}

