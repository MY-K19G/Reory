'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Zap, CheckCircle2, RotateCcw } from 'lucide-react';
import { AccentOption } from '@/lib/theme';

interface ProgressSidebarProps {
  averageRetention: number;
  currentAccent: AccentOption;
}

export const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  averageRetention,
  currentAccent,
}) => {
  return (
    <div className="lg:col-span-4 space-y-5">
      {/* Card 1: Key Performance Metrics */}
      <div className="rounded-3xl bg-[#161922] dark:bg-[#14161f] border border-white/10 p-5 sm:p-6 shadow-lg space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
          Key Metrics
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Longest Streak</div>
                <div className="text-[10px] text-slate-400">Personal Best</div>
              </div>
            </div>
            <span className="text-sm font-black text-white">18 days</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Review Speed</div>
                <div className="text-[10px] text-slate-400">Seconds per Card</div>
              </div>
            </div>
            <span className="text-sm font-black text-white">3.4s</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Retention Score</div>
                <div className="text-[10px] text-slate-400">First-time correct</div>
              </div>
            </div>
            <span className="text-sm font-black text-emerald-400">{averageRetention}%</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Due for Review</div>
                <div className="text-[10px] text-slate-400">Ready today</div>
              </div>
            </div>
            <span className="text-sm font-black text-white">38 cards</span>
          </div>
        </div>

        {/* Quick Practice Button */}
        <div className="pt-2">
          <Link
            href="/my-cards"
            style={{ backgroundColor: currentAccent.primary }}
            className="w-full py-2.5 rounded-full text-white text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <PlayIcon className="w-3.5 h-3.5 fill-white" />
            <span>Practice Due Cards</span>
          </Link>
        </div>
      </div>

      {/* Card 2: CEFR Level Journey */}
      <div className="rounded-3xl bg-[#161922] dark:bg-[#14161f] border border-white/10 p-5 sm:p-6 shadow-lg space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
          Fluency Scale Roadmap
        </h2>

        <div className="space-y-3">
          {[
            { level: 'A1 - Beginner', status: 'Completed', color: 'text-emerald-400', pct: 100 },
            { level: 'A2 - Elementary', status: 'Completed', color: 'text-emerald-400', pct: 100 },
            { level: 'B1 - Intermediate', status: 'In Progress (68%)', color: 'text-cyan-400', pct: 68 },
            { level: 'B2 - Upper Intermediate', status: 'Locked', color: 'text-slate-500', pct: 0 },
            { level: 'C1 - Advanced', status: 'Locked', color: 'text-slate-500', pct: 0 },
          ].map((lvl, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white">{lvl.level}</span>
                <span className={`text-[10px] ${lvl.color}`}>{lvl.status}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${lvl.pct}%`,
                    backgroundColor: lvl.pct === 100 ? '#10b981' : currentAccent.primary,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
