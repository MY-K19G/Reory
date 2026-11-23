'use client';

import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';
import { useTheme } from '@/lib/theme';
import { DETAILED_LANGUAGES, WEEKLY_STUDY_DATA } from './progressData';
import { ProgressHero } from './ProgressHero';
import { ProgressSidebar } from './ProgressSidebar';

export default function LearningProgressPage() {
  const { currentAccent } = useTheme();

  const [activeLangTab, setActiveLangTab] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('week');

  const totalCardsAll = DETAILED_LANGUAGES.reduce((acc, l) => acc + l.totalCards, 0);
  const learnedCardsAll = DETAILED_LANGUAGES.reduce((acc, l) => acc + l.learnedCards, 0);
  const totalHoursAll = Math.round(DETAILED_LANGUAGES.reduce((acc, l) => acc + l.studyTimeHours, 0) * 10) / 10;
  const overallPercentage = Math.round((learnedCardsAll / totalCardsAll) * 100);
  const averageRetention = Math.round(
    DETAILED_LANGUAGES.reduce((acc, l) => acc + l.retentionRate, 0) / DETAILED_LANGUAGES.length
  );

  const selectedLang =
    activeLangTab === 'all'
      ? null
      : DETAILED_LANGUAGES.find((l) => l.id === activeLangTab) || DETAILED_LANGUAGES[0];

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-[1400px] mx-auto space-y-6 pb-20 transition-colors">
      {/* 1. Header & Hero Progress Overview Banner */}
      <ProgressHero
        overallPercentage={overallPercentage}
        averageRetention={averageRetention}
        totalHoursAll={totalHoursAll}
        currentAccent={currentAccent}
      />

      {/* 2. Language Switcher Tabs & Time Range */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveLangTab('all')}
            style={activeLangTab === 'all' ? { backgroundColor: currentAccent.primary } : undefined}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeLangTab === 'all'
                ? 'text-white shadow-md'
                : 'bg-[#161922] dark:bg-[#14161f] hover:bg-white/5 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            <span>All Languages</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeLangTab === 'all' ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-400'
              }`}
            >
              {DETAILED_LANGUAGES.length}
            </span>
          </button>

          {DETAILED_LANGUAGES.map((l) => {
            const isSelected = activeLangTab === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setActiveLangTab(l.id)}
                style={isSelected ? { backgroundColor: currentAccent.primary } : undefined}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'text-white shadow-md'
                    : 'bg-[#161922] dark:bg-[#14161f] hover:bg-white/5 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                <FlagIcon code={l.flagCode} size="sm" />
                <span>{l.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {Math.round((l.learnedCards / l.totalCards) * 100)}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Time Frame Filter Pill Group */}
        <div className="flex items-center gap-1 bg-[#161922] dark:bg-[#14161f] border border-white/10 p-1 rounded-full self-start sm:self-auto shrink-0">
          {(['week', 'month', 'year', 'all'] as const).map((r) => {
            const isR = selectedTimeRange === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedTimeRange(r)}
                style={isR ? { backgroundColor: currentAccent.primary } : undefined}
                className={`px-3 py-1 text-[11px] font-semibold rounded-full capitalize transition-all cursor-pointer ${
                  isR ? 'text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'all' ? 'All Time' : `This ${r}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols): Deep dive cards, charts & category breakdown */}
        <div className="lg:col-span-8 space-y-5">
          {/* Card: Vocabulary Mastery & Donut Progression */}
          <div className="rounded-3xl bg-[#161922] dark:bg-[#14161f] border border-white/10 p-6 sm:p-7 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {selectedLang ? `${selectedLang.name} Vocabulary Mastery` : 'Comprehensive Mastery Breakdown'}
                </h2>
                <p className="text-xs text-slate-400">
                  {selectedLang
                    ? `Current Level: ${selectedLang.level} • ${selectedLang.learnedCards} of ${selectedLang.totalCards} cards mastered`
                    : `${learnedCardsAll} of ${totalCardsAll} total vocabulary cards mastered across all decks`}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Steady Growth
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
              {/* Radial Donut Progress Ring */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-3">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800/90"
                      strokeWidth="3.2"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      stroke={currentAccent.primary}
                      strokeWidth="3.4"
                      strokeDasharray={`${
                        selectedLang
                          ? Math.round((selectedLang.learnedCards / selectedLang.totalCards) * 100)
                          : overallPercentage
                      }, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-white">
                      {selectedLang
                        ? Math.round((selectedLang.learnedCards / selectedLang.totalCards) * 100)
                        : overallPercentage}
                      %
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 leading-tight">
                      Mastered
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-category or all languages bars */}
              <div className="md:col-span-8 space-y-4">
                {selectedLang ? (
                  selectedLang.categories.map((cat, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-white">{cat.name}</span>
                        <div className="flex items-center gap-3 text-slate-400">
                          <span className="font-bold text-white">{cat.progress}%</span>
                          <span className="text-[11px] font-mono">{cat.cards} cards</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${cat.progress}%`,
                            backgroundColor: idx === 0 ? currentAccent.primary : idx === 1 ? '#8b5cf6' : idx === 2 ? '#3b82f6' : '#06b6d4',
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  DETAILED_LANGUAGES.map((l) => {
                    const percent = Math.round((l.learnedCards / l.totalCards) * 100);
                    return (
                      <div key={l.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <FlagIcon code={l.flagCode} size="sm" />
                            <span className="text-white font-bold">{l.name}</span>
                            <span className="text-[10px] text-slate-500 font-normal">({l.level})</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-400">
                            <span className="font-bold text-white">{percent}%</span>
                            <span className="text-[11px] font-mono">
                              {l.learnedCards}/{l.totalCards} cards
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: l.id === 'ja' ? currentAccent.primary : l.id === 'en' ? '#3b82f6' : '#10b981',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Card: Weekly Review Velocity & Daily Card Load */}
          <div className="rounded-3xl bg-[#161922] dark:bg-[#14161f] border border-white/10 p-6 sm:p-7 shadow-lg space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>Weekly Study Velocity</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Total cards drilled and average session retention across past 7 days
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentAccent.primary }} />
                  <span>Card Count</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>High Accuracy (90%+)</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Visualization */}
            <div className="pt-4">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44">
                {WEEKLY_STUDY_DATA.map((item, idx) => {
                  const heightPercent = Math.round((item.cards / 100) * 100);
                  const isPeak = item.cards >= 90;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.cards}
                      </span>
                      <div className="w-full max-w-[36px] bg-slate-800/80 rounded-xl overflow-hidden flex flex-col justify-end p-1 transition-all group-hover:scale-105">
                        <div
                          className="w-full rounded-lg transition-all duration-500"
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: isPeak ? currentAccent.primary : '#3b82f6',
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card: Spaced Repetition Memory Stages (SRS) */}
          <div className="rounded-3xl bg-[#161922] dark:bg-[#14161f] border border-white/10 p-6 sm:p-7 shadow-lg space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Spaced Repetition Stages (SRS)
            </h2>
            <p className="text-xs text-slate-400">
              Cards categorized by memory strength and review intervals.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-[11px] font-bold text-rose-400 block">Learning (Stage 1)</span>
                <div className="text-xl font-black text-white">142 cards</div>
                <div className="w-full bg-slate-800 rounded-full h-1">
                  <div className="bg-rose-500 h-1 rounded-full" style={{ width: '25%' }} />
                </div>
                <span className="text-[10px] text-slate-500">Review interval: &lt; 24 hrs</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 block">Young (Stage 2)</span>
                <div className="text-xl font-black text-white">315 cards</div>
                <div className="w-full bg-slate-800 rounded-full h-1">
                  <div className="bg-amber-500 h-1 rounded-full" style={{ width: '45%' }} />
                </div>
                <span className="text-[10px] text-slate-500">Review interval: 3 - 7 days</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-[11px] font-bold text-indigo-400 block">Mature (Stage 3)</span>
                <div className="text-xl font-black text-white">460 cards</div>
                <div className="w-full bg-slate-800 rounded-full h-1">
                  <div className="bg-indigo-500 h-1 rounded-full" style={{ width: '65%' }} />
                </div>
                <span className="text-[10px] text-slate-500">Review interval: 2 - 4 wks</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-[11px] font-bold text-emerald-400 block">Permanent (Stage 4)</span>
                <div className="text-xl font-black text-white">331 cards</div>
                <div className="w-full bg-slate-800 rounded-full h-1">
                  <div className="bg-emerald-500 h-1 rounded-full" style={{ width: '85%' }} />
                </div>
                <span className="text-[10px] text-slate-500">Review interval: 3+ months</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Metrics and CEFR roadmap */}
        <ProgressSidebar
          averageRetention={averageRetention}
          currentAccent={currentAccent}
        />
      </div>
    </div>
  );
}
