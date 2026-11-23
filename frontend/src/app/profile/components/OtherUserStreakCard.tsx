'use client';

import React, { useState, useMemo } from 'react';
import { Flame, Layers, TrendingUp, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { AccentOption } from '@/lib/theme';
import { FriendUser } from '../types';

interface OtherUserStreakCardProps {
  selectedViewUser: FriendUser;
  currentAccent: AccentOption;
}

export const OtherUserStreakCard: React.FC<OtherUserStreakCardProps> = ({
  selectedViewUser,
  currentAccent,
}) => {
  const [yearOffset, setYearOffset] = useState<number>(0);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    dateStr: string;
    cards: number;
  }>({ visible: false, x: 0, y: 0, dateStr: '', cards: 0 });

  const TODAY = new Date();
  const selectedYear = TODAY.getFullYear() + yearOffset;
  const canGoBackYear = selectedYear > 2024;
  const canGoFwdYear = selectedYear < TODAY.getFullYear();

  // Generate heatmap cols for this user
  const heatmapCols = useMemo(() => {
    const today = new Date();
    const jan1 = new Date(selectedYear, 0, 1);
    const dec31 = new Date(selectedYear, 11, 31);
    const startDate = new Date(jan1);
    startDate.setDate(jan1.getDate() - jan1.getDay());
    const endDate = new Date(dec31);
    endDate.setDate(dec31.getDate() + (6 - dec31.getDay()));

    const raw: { date: Date; cards: number; future: boolean; outOfYear: boolean }[] = [];
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      const isFuture = cursor > today;
      const outOfYear = cursor.getFullYear() !== selectedYear;
      const seed = (cursor.getDate() * 7 + cursor.getMonth() * 31 + cursor.getFullYear()) % 100;
      const cards = !isFuture && !outOfYear && seed > 35 ? Math.floor((seed / 100) * 72) + 1 : 0;
      raw.push({ date: new Date(cursor), cards, future: isFuture, outOfYear });
      cursor.setDate(cursor.getDate() + 1);
    }
    const cols: { date: Date; cards: number; future: boolean; outOfYear: boolean }[][] = [];
    const numWeeks = Math.ceil(raw.length / 7);
    for (let w = 0; w < numWeeks; w++) cols.push(raw.slice(w * 7, w * 7 + 7));
    return cols;
  }, [selectedYear]);

  const yearStats = useMemo(() => {
    let total = 0,
      activeDays = 0,
      bestDay = 0;
    for (const col of heatmapCols) {
      for (const cell of col) {
        if (!cell || (cell as { outOfYear?: boolean }).outOfYear || cell.future) continue;
        total += cell.cards;
        if (cell.cards > 0) activeDays++;
        if (cell.cards > bestDay) bestDay = cell.cards;
      }
    }
    const monthTotals: Record<number, number> = {};
    for (const col of heatmapCols) {
      for (const cell of col) {
        if (!cell || (cell as { outOfYear?: boolean }).outOfYear || cell.future || cell.cards === 0) continue;
        const m = cell.date.getMonth();
        monthTotals[m] = (monthTotals[m] ?? 0) + cell.cards;
      }
    }
    const bestMonthIdx = Object.entries(monthTotals).sort((a, b) => b[1] - a[1])[0]?.[0];
    const bestMonth =
      bestMonthIdx !== undefined
        ? new Date(selectedYear, Number(bestMonthIdx), 1).toLocaleString('default', { month: 'short' })
        : '–';
    return { total, activeDays, bestDay, bestMonth };
  }, [heatmapCols, selectedYear]);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-white/10 p-4 sm:p-5 shadow-lg transition-colors space-y-3 relative">
      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 pointer-events-none px-2.5 py-1.5 rounded-xl bg-slate-900/95 dark:bg-[#0a0c12]/95 border border-white/10 shadow-xl backdrop-blur-sm"
          style={{ left: tooltip.x + 12, top: tooltip.y - 42 }}
        >
          <div className="text-[11px] font-bold text-white leading-none">{tooltip.dateStr}</div>
          <div
            className="text-[10px] mt-0.5 font-semibold"
            style={{ color: tooltip.cards > 0 ? currentAccent.primary : '#64748b' }}
          >
            {tooltip.cards > 0 ? `${tooltip.cards} cards learned` : 'No activity'}
          </div>
        </div>
      )}

      {/* Row 1: Title + stat pills */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-between">
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: currentAccent.primary }}
          >
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white leading-none">Learning Streak</h2>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">Cards learned per day · 2025 – today</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[
            { icon: <Flame className="w-3 h-3" />, value: selectedViewUser.streak, label: 'Streak', color: '#f59e0b' },
            {
              icon: <Layers className="w-3 h-3" />,
              value: `${selectedViewUser.cardsLearned ? Math.round(selectedViewUser.cardsLearned / 4) : 210}`,
              label: 'Monthly',
              color: currentAccent.primary,
            },
            {
              icon: <TrendingUp className="w-3 h-3" />,
              value: `${selectedViewUser.cardsLearned || 840}`,
              label: 'Mastered',
              color: '#10b981',
            },
            {
              icon: <Clock className="w-3 h-3" />,
              value: `${selectedViewUser.level || 'Intermediate'}`,
              label: 'Level',
              color: '#8b5cf6',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/8 rounded-xl px-2.5 py-1.5"
            >
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: s.color }}
              >
                {s.icon}
              </div>
              <div className="leading-none">
                <span className="text-xs font-black text-slate-900 dark:text-white">{s.value}</span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 ml-1">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 1b: Submenu navigation strip */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setYearOffset((o) => o - 1)}
              disabled={!canGoBackYear}
              className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-black text-slate-900 dark:text-white min-w-[40px] text-center tracking-tight">
              {selectedYear}
            </span>
            <button
              type="button"
              onClick={() => setYearOffset((o) => o + 1)}
              disabled={!canGoFwdYear}
              className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="w-px h-4 bg-slate-200 dark:bg-white/10 shrink-0" />
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            Jan {selectedYear} – Dec {selectedYear}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="font-black text-slate-700 dark:text-slate-300">{yearStats.total.toLocaleString()}</span>
            <span>cards total</span>
          </div>
          <div className="w-px h-3 bg-slate-200 dark:bg-white/10" />
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="font-black text-slate-700 dark:text-slate-300">{yearStats.activeDays}</span>
            <span>active days</span>
          </div>
          <div className="w-px h-3 bg-slate-200 dark:bg-white/10" />
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="font-black text-slate-700 dark:text-slate-300">{yearStats.bestDay}</span>
            <span>best day</span>
          </div>
          <div className="w-px h-3 bg-slate-200 dark:bg-white/10" />
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="font-black" style={{ color: currentAccent.primary }}>
              {yearStats.bestMonth}
            </span>
            <span>most active</span>
          </div>
        </div>
      </div>

      {/* Row 2: Full-width Heatmap */}
      {heatmapCols.length > 0 && (
        <div className="flex gap-2 w-full">
          <div className="flex flex-col shrink-0" style={{ gap: '3px', paddingTop: '17px' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div
                key={d}
                className={`h-[16px] flex items-center text-[8px] font-semibold text-slate-400 dark:text-slate-500 leading-none pr-1.5 whitespace-nowrap ${
                  i % 2 === 0 ? '' : 'opacity-0'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="flex-1 min-w-0">
            <div
              className="h-[14px] mb-[3px] relative"
              style={{ display: 'grid', gridTemplateColumns: `repeat(${heatmapCols.length}, 1fr)`, gap: '3px' }}
            >
              {heatmapCols.map((col, wi) => {
                const firstDay = col[0]?.date;
                const showLabel = firstDay && (wi === 0 || firstDay.getDate() <= 7);
                return (
                  <div key={wi} className="relative overflow-visible">
                    {showLabel && (
                      <span className="absolute left-0 text-[8px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap leading-none top-0">
                        {firstDay.toLocaleString('default', { month: 'short' })}
                        {wi === 0 || firstDay.getMonth() === 0
                          ? ` '${firstDay.getFullYear().toString().slice(2)}`
                          : ''}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              style={{ display: 'grid', gridTemplateColumns: `repeat(${heatmapCols.length}, 1fr)`, gap: '3px' }}
            >
              {heatmapCols.map((col, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: '3px' }}>
                  {col.map((cell, di) => {
                    if (!cell) {
                      return <div key={di} className="h-[16px] rounded-[3px] opacity-0" />;
                    }
                    if ((cell as { outOfYear?: boolean }).outOfYear) {
                      return <div key={di} className="h-[16px] rounded-[3px] opacity-0" />;
                    }
                    if (cell.future) {
                      return (
                        <div
                          key={di}
                          className="h-[16px] rounded-[3px] bg-slate-100/60 dark:bg-white/[0.03]"
                        />
                      );
                    }
                    const intensity =
                      cell.cards === 0
                        ? 0
                        : cell.cards < 10
                        ? 1
                        : cell.cards < 25
                        ? 2
                        : cell.cards < 50
                        ? 3
                        : 4;
                    const bgStyle =
                      intensity === 0
                        ? undefined
                        : {
                            backgroundColor:
                              intensity === 1
                                ? `${currentAccent.primary}2e`
                                : intensity === 2
                                ? `${currentAccent.primary}60`
                                : intensity === 3
                                ? `${currentAccent.primary}90`
                                : currentAccent.primary,
                          };
                    const dateStr = cell.date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                    return (
                      <div
                        key={di}
                        className={`h-[16px] rounded-[3px] cursor-pointer transition-all hover:scale-110 hover:z-10 hover:brightness-125 ${
                          intensity === 0 ? 'bg-slate-100 dark:bg-white/[0.06]' : ''
                        }`}
                        style={bgStyle}
                        onMouseEnter={(e) =>
                          setTooltip({
                            visible: true,
                            x: e.clientX,
                            y: e.clientY,
                            dateStr,
                            cards: cell.cards,
                          })
                        }
                        onMouseMove={(e) =>
                          setTooltip((prev) => ({
                            ...prev,
                            x: e.clientX,
                            y: e.clientY,
                          }))
                        }
                        onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
          {heatmapCols.length} weeks · Jan {selectedYear} – Dec {selectedYear}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <div
              key={lvl}
              className={`w-3 h-3 rounded-[3px] ${lvl === 0 ? 'bg-slate-100 dark:bg-white/[0.06]' : ''}`}
              style={
                lvl > 0
                  ? {
                      backgroundColor:
                        lvl === 1
                          ? `${currentAccent.primary}2e`
                          : lvl === 2
                          ? `${currentAccent.primary}60`
                          : lvl === 3
                          ? `${currentAccent.primary}90`
                          : currentAccent.primary,
                    }
                  : undefined
              }
            />
          ))}
          <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">More</span>
        </div>
      </div>
    </div>
  );
};
