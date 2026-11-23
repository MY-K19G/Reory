'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faGraduationCap,
  faBrain,
  faLightbulb,
  faPenNib,
  faComments,
  faBullseye,
  faStar,
  faFire,
  faBolt,
  faPlane,
  faMapMarkedAlt,
  faGlobeAmericas,
  faLandmark,
  faUmbrellaBeach,
  faMountain,
  faCampground,
  faCoffee,
  faUtensils,
  faPizzaSlice,
  faWineGlassAlt,
  faBeer,
  faAppleAlt,
  faBriefcase,
  faHeart,
  faMusic,
  faFilm,
  faTrophy,
  faCat,
  faDog,
  faStethoscope,
  faLanguage,
  faCompass,
  faRocket,
  faCrown,
  faMedal,
  faFlag,
  faHeadphones,
  faMicrophone,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

export interface FontAwesomeOption {
  id: string;
  name: string;
  category: string;
  icon: IconDefinition;
}

export const FA_ICON_LIST: FontAwesomeOption[] = [
  // Education & Language
  { id: 'faLanguage', name: 'Languages / Translation', category: 'Education', icon: faLanguage },
  { id: 'faBook', name: 'Books / Study', category: 'Education', icon: faBook },
  { id: 'faGraduationCap', name: 'Graduation / Academy', category: 'Education', icon: faGraduationCap },
  { id: 'faBrain', name: 'Brain / Memory', category: 'Education', icon: faBrain },
  { id: 'faLightbulb', name: 'Idea / Inspiration', category: 'Education', icon: faLightbulb },
  { id: 'faPenNib', name: 'Writing / Vocabulary', category: 'Education', icon: faPenNib },
  { id: 'faComments', name: 'Conversation / Dialogue', category: 'Education', icon: faComments },
  { id: 'faHeadphones', name: 'Listening / Audio', category: 'Education', icon: faHeadphones },
  { id: 'faMicrophone', name: 'Speaking / Practice', category: 'Education', icon: faMicrophone },
  { id: 'faBullseye', name: 'Target / Goal', category: 'Education', icon: faBullseye },
  { id: 'faStar', name: 'Star / Mastery', category: 'Education', icon: faStar },
  { id: 'faFire', name: 'Fire / Daily Streak', category: 'Education', icon: faFire },
  { id: 'faBolt', name: 'Lightning / Speed Quiz', category: 'Education', icon: faBolt },
  { id: 'faRocket', name: 'Rocket / Boost', category: 'Education', icon: faRocket },
  { id: 'faTrophy', name: 'Trophy / Achievement', category: 'Education', icon: faTrophy },
  { id: 'faCrown', name: 'Crown / Premium', category: 'Education', icon: faCrown },
  { id: 'faMedal', name: 'Medal / Badge', category: 'Education', icon: faMedal },

  // Travel & Geography
  { id: 'faPlane', name: 'Airplane / Travel', category: 'Travel', icon: faPlane },
  { id: 'faGlobeAmericas', name: 'World Globe', category: 'Travel', icon: faGlobeAmericas },
  { id: 'faMapMarkedAlt', name: 'Map / Exploration', category: 'Travel', icon: faMapMarkedAlt },
  { id: 'faCompass', name: 'Compass / Direction', category: 'Travel', icon: faCompass },
  { id: 'faLandmark', name: 'Landmark / Culture', category: 'Travel', icon: faLandmark },
  { id: 'faMountain', name: 'Mountain / Adventure', category: 'Travel', icon: faMountain },
  { id: 'faUmbrellaBeach', name: 'Beach / Vacation', category: 'Travel', icon: faUmbrellaBeach },
  { id: 'faCampground', name: 'Campground / Outdoors', category: 'Travel', icon: faCampground },
  { id: 'faFlag', name: 'Flag / Nation', category: 'Travel', icon: faFlag },

  // Food & Dining
  { id: 'faCoffee', name: 'Coffee / Cafe Culture', category: 'Food', icon: faCoffee },
  { id: 'faUtensils', name: 'Dining / Restaurant', category: 'Food', icon: faUtensils },
  { id: 'faPizzaSlice', name: 'Pizza / Casual Food', category: 'Food', icon: faPizzaSlice },
  { id: 'faAppleAlt', name: 'Apple / Fresh Market', category: 'Food', icon: faAppleAlt },
  { id: 'faWineGlassAlt', name: 'Wine / Evening', category: 'Food', icon: faWineGlassAlt },
  { id: 'faBeer', name: 'Beer / Pub & Social', category: 'Food', icon: faBeer },

  // Lifestyle & Profession
  { id: 'faBriefcase', name: 'Briefcase / Business', category: 'Lifestyle', icon: faBriefcase },
  { id: 'faHeart', name: 'Heart / Romance', category: 'Lifestyle', icon: faHeart },
  { id: 'faMusic', name: 'Music / Songs', category: 'Lifestyle', icon: faMusic },
  { id: 'faFilm', name: 'Cinema / Movies', category: 'Lifestyle', icon: faFilm },
  { id: 'faStethoscope', name: 'Medical / Healthcare', category: 'Lifestyle', icon: faStethoscope },
  { id: 'faCat', name: 'Cat / Animals', category: 'Lifestyle', icon: faCat },
  { id: 'faDog', name: 'Dog / Pets', category: 'Lifestyle', icon: faDog },
];

export function getFontAwesomeIconById(id: string): IconDefinition {
  const match = FA_ICON_LIST.find((i) => i.id === id);
  return match ? match.icon : faBook;
}

interface FontAwesomePickerProps {
  value: string; // The icon id e.g. 'faLanguage' or 'faBook'
  onChange: (iconId: string) => void;
  className?: string;
}

export function FontAwesomePicker({ value, onChange, className = '' }: FontAwesomePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentIcon = FA_ICON_LIST.find((i) => i.id === value) || FA_ICON_LIST[0];

  const filteredIcons = FA_ICON_LIST.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`space-y-2 relative ${className}`} ref={pickerRef}>
      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
        <span>Deck Icon (FontAwesome / Vector)</span>
        <span className="text-[10px] text-cyan-400 font-medium">Click to select &amp; search</span>
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white flex items-center justify-between hover:border-cyan-400/50 transition-all cursor-pointer shadow-inner"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <FontAwesomeIcon icon={currentIcon.icon} className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-200 font-semibold">{currentIcon.name}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown with Search & FontAwesome Vector Icons Grid */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 rounded-2xl bg-slate-900/95 border border-white/10 backdrop-blur-xl shadow-2xl p-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons (e.g. language, travel, coffee, brain)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          {/* Grid of FontAwesome Vector Icons */}
          <div className="max-h-60 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            <div className="grid grid-cols-6 gap-2">
              {filteredIcons.map((item) => {
                const isSelected = item.id === currentIcon.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    title={item.name}
                    onClick={() => {
                      onChange(item.id);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-transparent hover:scale-105'
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                  </button>
                );
              })}
            </div>

            {filteredIcons.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching FontAwesome icon found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
