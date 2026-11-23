'use client';

import { useState, useMemo } from 'react';
import {
  Clock,
  BookOpen,
  Plus,
  Trophy,
  Zap,
  Target,
  ArrowUpRight,
  Search,
} from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { useTheme } from '@/lib/theme';
import { ActivityType, ActivityDetail } from './types';
import { ALL_ACTIVITIES } from './activityData';
import { ActivityHero } from './ActivityHero';
import { ActivityModal } from './ActivityModal';

export default function RecentActivityPage() {
  const { currentAccent } = useTheme();

  // Filters
  const [selectedType, setSelectedType] = useState<ActivityType>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<ActivityDetail | null>(null);

  // Filtered list
  const filteredActivities = useMemo(() => {
    return ALL_ACTIVITIES.filter((item) => {
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (selectedLanguage !== 'all' && item.language.toLowerCase() !== selectedLanguage.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchSub = item.subtitle.toLowerCase().includes(query);
        const matchDeck = item.deckTitle?.toLowerCase().includes(query) || false;
        if (!matchTitle && !matchSub && !matchDeck) return false;
      }
      return true;
    });
  }, [selectedType, selectedLanguage, searchQuery]);

  const totalReviews = ALL_ACTIVITIES.reduce((acc, curr) => acc + (curr.cardsReviewed || 0), 0);
  const totalXp = ALL_ACTIVITIES.reduce((acc, curr) => acc + curr.xpEarned, 0);
  const totalTimeMinutes = ALL_ACTIVITIES.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-[1300px] mx-auto space-y-5 pb-16 transition-colors">
      {/* 1. Header & Summary Stats */}
      <ActivityHero
        totalReviews={totalReviews}
        totalXp={totalXp}
        totalTimeMinutes={totalTimeMinutes}
      />

      {/* 2. Search & Language Filters */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actions, decks, or keywords..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedLanguage('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedLanguage === 'all'
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              All Languages
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('japanese')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedLanguage === 'japanese'
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <FlagIcon code="jp" size="sm" />
              <span>Japanese</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('english')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedLanguage === 'english'
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <FlagIcon code="us" size="sm" />
              <span>English</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('spanish')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedLanguage === 'spanish'
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <FlagIcon code="es" size="sm" />
              <span>Spanish</span>
            </button>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-white/5">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            style={selectedType === 'all' ? { backgroundColor: currentAccent.primary } : undefined}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedType === 'all'
                ? 'text-white shadow-sm'
                : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            All Types ({ALL_ACTIVITIES.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('study')}
            style={selectedType === 'study' ? { backgroundColor: currentAccent.primary } : undefined}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedType === 'study'
                ? 'text-white shadow-sm'
                : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Study Sessions</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('deck')}
            style={selectedType === 'deck' ? { backgroundColor: currentAccent.primary } : undefined}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedType === 'deck'
                ? 'text-white shadow-sm'
                : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Deck Actions</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('achievement')}
            style={selectedType === 'achievement' ? { backgroundColor: currentAccent.primary } : undefined}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedType === 'achievement'
                ? 'text-white shadow-sm'
                : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Achievements</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('mastery')}
            style={selectedType === 'mastery' ? { backgroundColor: currentAccent.primary } : undefined}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedType === 'mastery'
                ? 'text-white shadow-sm'
                : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Mastery Milestones</span>
          </button>
        </div>
      </div>

      {/* 3. Activity Feed List */}
      <div className="space-y-2.5">
        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-2">
            <p className="text-sm text-slate-400">No activity matches your current filters.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedType('all');
                setSelectedLanguage('all');
                setSearchQuery('');
              }}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => setSelectedActivity(act)}
              className="group p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all cursor-pointer flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${act.iconBg}`}>
                  {act.icon}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {act.title}
                    </h3>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-slate-300 font-semibold border border-white/5">
                      <FlagIcon code={act.langCode} size="sm" />
                      <span>{act.language}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {act.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{act.timeAgo}</span>
                    </span>

                    {act.durationMinutes && (
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span>{act.durationMinutes} min drill</span>
                      </span>
                    )}

                    {act.accuracyRate && (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <Target className="w-3 h-3" />
                        <span>{act.accuracyRate}% recall</span>
                      </span>
                    )}

                    <span className="text-amber-400 font-semibold">
                      +{act.xpEarned} XP
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 pt-1">
                <span className="text-[11px] font-medium text-slate-400 hidden sm:inline-block">
                  {act.formattedDate}
                </span>
                <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Event Detail Modal */}
      <ActivityModal
        selectedActivity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        currentAccent={currentAccent}
      />
    </div>
  );
}
