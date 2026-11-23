export interface LanguageItem {
  name: string;
  code: string;
  countryCode: string;
  defaultIcon: string;
}

// 80+ Global Languages supported by Google Gemini & modern language platforms
export const ALL_GEMINI_LANGUAGES: LanguageItem[] = [
  // Major World Languages
  { name: 'English', code: 'en', countryCode: 'gb', defaultIcon: '🇬🇧' },
  { name: 'Spanish', code: 'es', countryCode: 'es', defaultIcon: '🇪🇸' },
  { name: 'Hebrew', code: 'he', countryCode: 'il', defaultIcon: '✡️' },
  { name: 'French', code: 'fr', countryCode: 'fr', defaultIcon: '🇫🇷' },
  { name: 'German', code: 'de', countryCode: 'de', defaultIcon: '🇩🇪' },
  { name: 'Japanese', code: 'ja', countryCode: 'jp', defaultIcon: '🇯🇵' },
  { name: 'Chinese (Simplified)', code: 'zh', countryCode: 'cn', defaultIcon: '🇨🇳' },
  { name: 'Chinese (Traditional)', code: 'zh-tw', countryCode: 'tw', defaultIcon: '🇹🇼' },
  { name: 'Italian', code: 'it', countryCode: 'it', defaultIcon: '🇮🇹' },
  { name: 'Portuguese (Brazil)', code: 'pt-br', countryCode: 'br', defaultIcon: '🇧🇷' },
  { name: 'Portuguese (Portugal)', code: 'pt', countryCode: 'pt', defaultIcon: '🇵🇹' },
  { name: 'Russian', code: 'ru', countryCode: 'ru', defaultIcon: '🇷🇺' },
  { name: 'Korean', code: 'ko', countryCode: 'kr', defaultIcon: '🇰🇷' },
  { name: 'Arabic', code: 'ar', countryCode: 'sa', defaultIcon: '🇸🇦' },
  { name: 'Hindi', code: 'hi', countryCode: 'in', defaultIcon: '🇮🇳' },
  { name: 'Turkish', code: 'tr', countryCode: 'tr', defaultIcon: '🇹🇷' },
  { name: 'Dutch', code: 'nl', countryCode: 'nl', defaultIcon: '🇳🇱' },
  { name: 'Polish', code: 'pl', countryCode: 'pl', defaultIcon: '🇵🇱' },
  { name: 'Swedish', code: 'sv', countryCode: 'se', defaultIcon: '🇸🇪' },
  { name: 'Greek', code: 'el', countryCode: 'gr', defaultIcon: '🇬🇷' },
  { name: 'Vietnamese', code: 'vi', countryCode: 'vn', defaultIcon: '🇻🇳' },
  { name: 'Thai', code: 'th', countryCode: 'th', defaultIcon: '🇹🇭' },
  { name: 'Indonesian', code: 'id', countryCode: 'id', defaultIcon: '🇮🇩' },
  { name: 'Ukrainian', code: 'uk', countryCode: 'ua', defaultIcon: '🇺🇦' },
  { name: 'Czech', code: 'cs', countryCode: 'cz', defaultIcon: '🇨🇿' },
  { name: 'Danish', code: 'da', countryCode: 'dk', defaultIcon: '🇩🇰' },
  { name: 'Finnish', code: 'fi', countryCode: 'fi', defaultIcon: '🇫🇮' },
  { name: 'Norwegian', code: 'no', countryCode: 'no', defaultIcon: '🇳🇴' },
  { name: 'Hungarian', code: 'hu', countryCode: 'hu', defaultIcon: '🇭🇺' },
  { name: 'Romanian', code: 'ro', countryCode: 'ro', defaultIcon: '🇷🇴' },

  // South & Southeast Asian Languages
  { name: 'Bengali', code: 'bn', countryCode: 'bd', defaultIcon: '🇧🇩' },
  { name: 'Tamil', code: 'ta', countryCode: 'in', defaultIcon: '🇮🇳' },
  { name: 'Telugu', code: 'te', countryCode: 'in', defaultIcon: '🇮🇳' },
  { name: 'Marathi', code: 'mr', countryCode: 'in', defaultIcon: '🇮🇳' },
  { name: 'Gujarati', code: 'gu', countryCode: 'in', defaultIcon: '🇮🇳' },
  { name: 'Kannada', code: 'kn', countryCode: 'in', defaultIcon: '🇮🇳' },
  { name: 'Malayalam', code: 'ml', countryCode: 'in', defaultIcon: '🇮🇳' },
  { name: 'Punjabi', code: 'pa', countryCode: 'in', defaultIcon: '🇮🇳' },
  { name: 'Odia', code: 'or', countryCode: 'in', defaultIcon: '🇮🇳' },
  { name: 'Assamese', code: 'as', countryCode: 'in', defaultIcon: '🇮🇳' },
  { name: 'Urdu', code: 'ur', countryCode: 'in', defaultIcon: '🇮🇳' },
  { name: 'Tagalog (Filipino)', code: 'tl', countryCode: 'ph', defaultIcon: '🇵🇭' },
  { name: 'Malay', code: 'ms', countryCode: 'my', defaultIcon: '🇲🇾' },
  { name: 'Burmese (Myanmar)', code: 'my', countryCode: 'mm', defaultIcon: '🇲🇲' },
  { name: 'Khmer (Cambodia)', code: 'km', countryCode: 'kh', defaultIcon: '🇰🇭' },
  { name: 'Lao', code: 'lo', countryCode: 'la', defaultIcon: '🇱🇦' },
  { name: 'Sinhala', code: 'si', countryCode: 'lk', defaultIcon: '🇱🇰' },
  { name: 'Nepali', code: 'ne', countryCode: 'np', defaultIcon: '🇳🇵' },

  // Middle Eastern & Central Asian Languages
  { name: 'Persian (Farsi)', code: 'fa', countryCode: 'ir', defaultIcon: '🇮🇷' },
  { name: 'Azerbaijani', code: 'az', countryCode: 'az', defaultIcon: '🇦🇿' },
  { name: 'Kazakh', code: 'kk', countryCode: 'kz', defaultIcon: '🇰🇿' },
  { name: 'Uzbek', code: 'uz', countryCode: 'uz', defaultIcon: '🇺🇿' },
  { name: 'Georgian', code: 'ka', countryCode: 'ge', defaultIcon: '🇬🇪' },
  { name: 'Armenian', code: 'hy', countryCode: 'am', defaultIcon: '🇦🇲' },
  { name: 'Kurdish', code: 'ku', countryCode: 'iq', defaultIcon: '☀️' },
  { name: 'Pashto', code: 'ps', countryCode: 'af', defaultIcon: '🇦🇫' },

  // European & Celtic Languages
  { name: 'Irish (Gaeilge)', code: 'ga', countryCode: 'ie', defaultIcon: '🇮🇪' },
  { name: 'Scottish Gaelic', code: 'gd', countryCode: 'gb', defaultIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { name: 'Welsh (Cymraeg)', code: 'cy', countryCode: 'gb', defaultIcon: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { name: 'Catalan', code: 'ca', countryCode: 'es', defaultIcon: '🟡' },
  { name: 'Basque (Euskara)', code: 'eu', countryCode: 'es', defaultIcon: '🔴' },
  { name: 'Galician', code: 'gl', countryCode: 'es', defaultIcon: '🔵' },
  { name: 'Icelandic', code: 'is', countryCode: 'is', defaultIcon: '🇮🇸' },
  { name: 'Slovak', code: 'sk', countryCode: 'sk', defaultIcon: '🇸🇰' },
  { name: 'Bulgarian', code: 'bg', countryCode: 'bg', defaultIcon: '🇧🇬' },
  { name: 'Serbian', code: 'sr', countryCode: 'rs', defaultIcon: '🇷🇸' },
  { name: 'Croatian', code: 'hr', countryCode: 'hr', defaultIcon: '🇭🇷' },
  { name: 'Bosnian', code: 'bs', countryCode: 'ba', defaultIcon: '🇧🇦' },
  { name: 'Slovenian', code: 'sl', countryCode: 'si', defaultIcon: '🇸🇮' },
  { name: 'Macedonian', code: 'mk', countryCode: 'mk', defaultIcon: '🇲🇰' },
  { name: 'Albanian', code: 'sq', countryCode: 'al', defaultIcon: '🇦🇱' },
  { name: 'Estonian', code: 'et', countryCode: 'ee', defaultIcon: '🇪🇪' },
  { name: 'Latvian', code: 'lv', countryCode: 'lv', defaultIcon: '🇱🇻' },
  { name: 'Lithuanian', code: 'lt', countryCode: 'lt', defaultIcon: '🇱🇹' },
  { name: 'Maltese', code: 'mt', countryCode: 'mt', defaultIcon: '🇲🇹' },

  // African Languages
  { name: 'Swahili (Kiswahili)', code: 'sw', countryCode: 'ke', defaultIcon: '🇰🇪' },
  { name: 'Amharic (Ethiopia)', code: 'am', countryCode: 'et', defaultIcon: '🇪🇹' },
  { name: 'Yoruba', code: 'yo', countryCode: 'ng', defaultIcon: '🇳🇬' },
  { name: 'Igbo', code: 'ig', countryCode: 'ng', defaultIcon: '🇳🇬' },
  { name: 'Hausa', code: 'ha', countryCode: 'ng', defaultIcon: '🇳🇬' },
  { name: 'Zulu', code: 'zu', countryCode: 'za', defaultIcon: '🇿🇦' },
  { name: 'Xhosa', code: 'xh', countryCode: 'za', defaultIcon: '🇿🇦' },
  { name: 'Afrikaans', code: 'af', countryCode: 'za', defaultIcon: '🇿🇦' },
  { name: 'Somali', code: 'so', countryCode: 'so', defaultIcon: '🇸🇴' },

  // Classical & Auxiliary Languages
  { name: 'Latin', code: 'la', countryCode: 'va', defaultIcon: '🏛️' },
  { name: 'Esperanto', code: 'eo', countryCode: 'eu', defaultIcon: '🟢' },
  { name: 'Sanskrit', code: 'sa', countryCode: 'in', defaultIcon: '🕉️' },
  { name: 'Yiddish', code: 'yi', countryCode: 'il', defaultIcon: '🕎' },
];
