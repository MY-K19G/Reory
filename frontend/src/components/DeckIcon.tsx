'use client';

import { FlagIcon } from './FlagIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getFontAwesomeIconById } from './FontAwesomePicker';

interface DeckIconProps {
  icon: string;
  className?: string;
}

export function emojiToCountryCode(emoji: string): string | null {
  if (!emoji) return null;
  const codePoints = [...emoji].map((c) => c.codePointAt(0) || 0);
  if (
    codePoints.length === 2 &&
    codePoints[0] >= 0x1F1E6 &&
    codePoints[0] <= 0x1F1FF &&
    codePoints[1] >= 0x1F1E6 &&
    codePoints[1] <= 0x1F1FF
  ) {
    return String.fromCharCode(
      codePoints[0] - 0x1F1E6 + 65,
      codePoints[1] - 0x1F1E6 + 65
    ).toLowerCase();
  }
  return null;
}

export function DeckIcon({ icon, className = '' }: DeckIconProps) {
  if (!icon) return <span className={className}>📚</span>;

  // If the icon is a FontAwesome ID (starts with 'fa')
  if (icon.startsWith('fa')) {
    const faDef = getFontAwesomeIconById(icon);
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        <FontAwesomeIcon icon={faDef} />
      </span>
    );
  }

  // If it's a regional country flag emoji, render via FlagIcon image for Windows compatibility
  const countryCode = emojiToCountryCode(icon);
  if (countryCode) {
    return <FlagIcon code={countryCode} size="md" className={className} />;
  }

  // Otherwise render standard text or emoji string
  return <span className={className}>{icon}</span>;
}

