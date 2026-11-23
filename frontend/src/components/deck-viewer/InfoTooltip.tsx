'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface InfoTooltipProps {
  title: string;
  description: string;
  howToAchieve?: string;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  title,
  description,
  howToAchieve,
  className = '',
}) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        aria-label={`Info: ${title}`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 p-3.5 bg-white/95 dark:bg-[#181818]/95 backdrop-blur-md text-slate-800 dark:text-white rounded-2xl shadow-xl border border-slate-200/80 dark:border-white/10 text-left animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
        >
          <div className="font-bold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-1.5">
            <span>{title}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 mb-2">
            {description}
          </p>
          {howToAchieve && (
            <div className="pt-2 border-t border-slate-100 dark:border-white/10">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider mb-0.5">
                {t('howToAchieveOrImprove')}
              </span>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {howToAchieve}
              </p>
            </div>
          )}
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-200 dark:border-t-white/10" />
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-[#181818]" />
        </div>
      )}
    </div>
  );
};
