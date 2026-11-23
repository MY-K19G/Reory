'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/lib/theme';
import { fetchDecks } from '@/lib/api';
import { AchievementCategory, AchievementDetail } from './types';
import { FULL_ACHIEVEMENTS } from './achievementsData';
import { AchievementHero } from './AchievementHero';
import { AchievementCard } from './AchievementCard';
import { AchievementModal } from './AchievementModal';

export default function AchievementsPage() {
  const { currentAccent } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementDetail | null>(null);

  const [cardsCount, setCardsCount] = useState(0);
  const [decksCount, setDecksCount] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [studyHours, setStudyHours] = useState(0);

  useEffect(() => {
    try {
      const s = localStorage.getItem('duocard_streak');
      if (s) setStreakDays(parseInt(s, 10) || 0);
      const h = localStorage.getItem('duocard_study_hours');
      if (h) setStudyHours(parseFloat(h) || 0);
    } catch {
      // ignore
    }

    fetchDecks()
      .then((data) => {
        if (data && data.length > 0) {
          setDecksCount(data.length);
          const total = data.reduce((acc, d) => acc + (d.cards?.length || 0), 0);
          setCardsCount(total);
        }
      })
      .catch(() => {});
  }, []);

  const dynamicAchievements = useMemo(() => {
    return FULL_ACHIEVEMENTS.map((item) => {
      let progress = 0;
      let unlocked = false;

      if (item.id === 'streak-7') {
        progress = Math.min(7, streakDays);
        unlocked = streakDays >= 7;
      } else if (item.id === 'streak-30') {
        progress = Math.min(30, streakDays);
        unlocked = streakDays >= 30;
      } else if (item.id === 'streak-100') {
        progress = Math.min(100, streakDays);
        unlocked = streakDays >= 100;
      } else if (item.id === 'cards-100') {
        progress = Math.min(100, cardsCount);
        unlocked = cardsCount >= 100;
      } else if (item.id === 'cards-500') {
        progress = Math.min(500, cardsCount);
        unlocked = cardsCount >= 500;
      } else if (item.id === 'cards-1000') {
        progress = Math.min(1000, cardsCount);
        unlocked = cardsCount >= 1000;
      } else if (item.id === 'hours-50') {
        progress = Math.min(50, studyHours);
        unlocked = studyHours >= 50;
      } else if (item.category === 'community') {
        progress = Math.min(item.maxProgress, decksCount);
        unlocked = decksCount >= item.maxProgress;
      } else {
        progress = 0;
        unlocked = false;
      }

      return {
        ...item,
        currentProgress: progress,
        unlocked,
        unlockedAt: unlocked ? 'Earned' : undefined,
      };
    });
  }, [streakDays, cardsCount, studyHours, decksCount]);

  const filteredList = dynamicAchievements.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const unlockedCount = dynamicAchievements.filter((a) => a.unlocked).length;
  const totalCount = dynamicAchievements.length;
  const totalXpEarned = dynamicAchievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);


  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-[1400px] mx-auto space-y-6 pb-20 transition-colors">
      {/* 1. Header with back link & stats banner */}
      <AchievementHero
        unlockedCount={unlockedCount}
        totalCount={totalCount}
        totalXpEarned={totalXpEarned}
        completionPercentage={completionPercentage}
      />

      {/* 2. Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            { id: 'all', label: 'All Achievements', count: FULL_ACHIEVEMENTS.length },
            { id: 'streaks', label: 'Streaks & Consistency', count: FULL_ACHIEVEMENTS.filter((a) => a.category === 'streaks').length },
            { id: 'learning', label: 'Vocabulary & Cards', count: FULL_ACHIEVEMENTS.filter((a) => a.category === 'learning').length },
            { id: 'mastery', label: 'Study Mastery', count: FULL_ACHIEVEMENTS.filter((a) => a.category === 'mastery').length },
            { id: 'community', label: 'Decks & Creation', count: FULL_ACHIEVEMENTS.filter((a) => a.category === 'community').length },
          ] as const
        ).map((tab) => {
          const isSelected = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              style={isSelected ? { backgroundColor: currentAccent.primary } : undefined}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'text-white shadow-md'
                  : 'bg-[#161922] dark:bg-[#14161f] hover:bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Full Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredList.map((item) => (
          <AchievementCard
            key={item.id}
            item={item}
            onClick={() => setSelectedAchievement(item)}
          />
        ))}
      </div>

      {/* 4. Detail Modal */}
      <AchievementModal
        selectedAchievement={selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        currentAccent={currentAccent}
      />
    </div>
  );
}
