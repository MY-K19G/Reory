import { useState } from 'react';

interface FlagProps {
  code: string; // ISO 2-letter country code e.g. 'tr', 'nl', 'pl', 'se', 'gr', 'il', 'es', etc.
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function FlagIcon({ code, className = '', size = 'md' }: FlagProps) {
  const [hasError, setHasError] = useState(false);
  const c = (code || 'un').toLowerCase().trim();

  // Normalize language codes to country flag codes
  const normalizedCountryMap: Record<string, string> = {
    he: 'il',
    en: 'gb',
    ja: 'jp',
    ko: 'kr',
    zh: 'cn',
    hi: 'in',
    bn: 'in',
    ta: 'in',
    te: 'in',
    mr: 'in',
    gu: 'in',
    kn: 'in',
    ml: 'in',
    pa: 'in',
    or: 'in',
    ar: 'sa',
    da: 'dk',
    el: 'gr',
    cs: 'cz',
    sv: 'se',
    fa: 'ir',
    uk: 'ua',
    vi: 'vn',
    ur: 'pk',
    sw: 'ke',
    ms: 'my',
    tl: 'ph',
    eo: 'un',
    la: 'va',
  };

  const finalCode = normalizedCountryMap[c] || c;

  const sizeClasses = {
    sm: 'w-4 h-3',
    md: 'w-6 h-4',
    lg: 'w-8 h-6',
    xl: 'w-10 h-7',
  };

  if (hasError) {
    return (
      <span
        className={`${sizeClasses[size]} inline-flex items-center justify-center font-bold text-[9px] bg-slate-800 text-slate-300 rounded border border-white/20 uppercase shrink-0 ${className}`}
      >
        {finalCode.slice(0, 2)}
      </span>
    );
  }

  // Vector SVG from high-speed CDN with embedded fallback
  return (
    <img
      src={`https://flagcdn.com/w40/${finalCode}.png`}
      srcSet={`https://flagcdn.com/w80/${finalCode}.png 2x`}
      width={24}
      height={16}
      alt={finalCode}
      onError={() => setHasError(true)}
      className={`${sizeClasses[size]} object-cover inline-block rounded-[2px] shadow-sm shrink-0 border border-white/10 ${className}`}
    />
  );
}
