'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Mountain,
  CheckCircle2,
  Lock,
  Trophy,
  Zap,
} from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { fetchDecks, fetchStats, apiSavePreferences } from '@/lib/api';
import { Deck, Stats } from '@/lib/types';

import { Achievement, ActivityItem, FriendUser, ChatMessage } from './types';
import { DISCOVERABLE_USERS } from './profileData';

import { ProfileEditModal } from './ProfileEditModal';
import { ProfileSearchUserModal, ProfileChatDialog } from './ProfileSearchUserModal';
import { OtherUserProfileView } from './OtherUserProfileView';
import { ProfileHudBanner } from './ProfileHudBanner';
import { LearningStreakHeatmap } from './LearningStreakHeatmap';
import { ProfileProgressTab } from './components/ProfileProgressTab';
import { ProfileActivityTab } from './components/ProfileActivityTab';
import { ProfileFriendsTab } from './components/ProfileFriendsTab';
import { isFakeAvatar } from '@/components/UserAvatar';
import { ProfileDecksTab } from './components/ProfileDecksTab';
import { ProfileAchievementsTab } from './components/ProfileAchievementsTab';
import { useI18n } from '@/lib/i18n';

export default function ProfilePage() {
  const { currentAccent } = useTheme();
  const { t } = useI18n();

  // Friends & Chat State
  const [friendsList, setFriendsList] = useState<FriendUser[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('duocard_friends');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Search User Modal State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Chat with Friend State
  const [activeChatFriend, setActiveChatFriend] = useState<FriendUser | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [chatDraftText, setChatDraftText] = useState('');


  const handleSendMessage = () => {
    if (!activeChatFriend || !chatDraftText.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: chatDraftText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => ({
      ...prev,
      [activeChatFriend.id]: [...(prev[activeChatFriend.id] || []), newMsg],
    }));
    setChatDraftText('');

    // Simulated friendly partner reply after 1s
    const friendId = activeChatFriend.id;
        setTimeout(() => {
      const replies = [
        `Nice! Keep up that fantastic study momentum 🚀`,
        `Got it! Let's hit our daily streak target together 🔥`,
        `Thanks for sharing! Reviewing my cards right now too 📚`,
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setChatMessages((prev) => ({
        ...prev,
        [friendId]: [
          ...(prev[friendId] || []),
          {
            id: `reply-${Date.now()}`,
            sender: 'them',
            text: randomReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
    }, 1200);
  };

  const [selectedViewUser, setSelectedViewUser] = useState<FriendUser | null>(null);

  const handleToggleFollow = (user: FriendUser) => {
    let updated: FriendUser[];
    if (friendsList.some((f) => f.id === user.id)) {
      updated = friendsList.filter((f) => f.id !== user.id);
    } else {
      updated = [...friendsList, { ...user, isFollowing: true }];
    }
    setFriendsList(updated);
    try {
      localStorage.setItem('duocard_friends', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Profile editable info
  const [name, setName] = useState(() => {
    if (typeof window === 'undefined') return '';
    const DUMMY_NAMES = ['Learner', 'Verizon Kert', 'Alex Morgan'];
    const cur = localStorage.getItem('duocard_username');
    if (cur && DUMMY_NAMES.includes(cur)) {
      localStorage.removeItem('duocard_username');
      return '';
    }
    return cur || '';
  });
  const [handle, setHandle] = useState(() => {
    if (typeof window === 'undefined') return '';
    const DUMMY_HANDLES = ['learner', 'verizon'];
    const cur = localStorage.getItem('duocard_handle');
    if (cur && DUMMY_HANDLES.includes(cur.toLowerCase())) {
      localStorage.removeItem('duocard_handle');
      return '';
    }
    return cur || '';
  });
  const [bio, setBio] = useState(() => {
    if (typeof window === 'undefined') return '';
    const DUMMY_BIOS = ['Consistent steps toward fluency.', 'Small steps. Big fluency.'];
    const cur = localStorage.getItem('duocard_bio');
    if (cur && DUMMY_BIOS.includes(cur)) {
      localStorage.removeItem('duocard_bio');
      return '';
    }
    return cur || '';
  });
  const [country, setCountry] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('duocard_country') || '';
  });
  const [joinedDate] = useState('Recently joined');
  const [targetLang, setTargetLang] = useState(() => {
    if (typeof window === 'undefined') return '';
    const saved = localStorage.getItem('duocard_target_lang');
    if (saved && saved.toLowerCase() !== 'japanese') return saved;
    return saved || '';
  });
  const [bannerImage, setBannerImage] = useState(() => {
    if (typeof window === 'undefined') return '/profile/hero-banner.jpg';
    return localStorage.getItem('duocard_banner') || '/profile/hero-banner.jpg';
  });
  const [bannerPosition, setBannerPosition] = useState(() => {
    if (typeof window === 'undefined') return '50% 50%';
    return localStorage.getItem('duocard_banner_position') || '50% 50%';
  });
  const [bannerZoom, setBannerZoom] = useState(() => {
    if (typeof window === 'undefined') return 100;
    return Number(localStorage.getItem('duocard_banner_zoom')) || 100;
  });
  const [avatarImage, setAvatarImage] = useState(() => {
    if (typeof window === 'undefined') return '';
    const saved = localStorage.getItem('duocard_avatar');
    if (saved && !isFakeAvatar(saved)) return saved;
    if (saved && isFakeAvatar(saved)) localStorage.removeItem('duocard_avatar');
    return '';
  });
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);

  // Form draft state for editing modal
  const [draftName, setDraftName] = useState('');
  const [draftHandle, setDraftHandle] = useState('');
  const [draftBio, setDraftBio] = useState('');
  const [draftCountry, setDraftCountry] = useState('');
  const [draftBanner, setDraftBanner] = useState('/profile/hero-banner.jpg');
  const [draftBannerPosition, setDraftBannerPosition] = useState('50% 50%');
  const [draftBannerZoom, setDraftBannerZoom] = useState(100);
  const [draftAvatar, setDraftAvatar] = useState('');
  const [bannerInputMode, setBannerInputMode] = useState<'presets' | 'url' | 'upload'>('presets');

  // Real user dynamic stats - all strictly from actual account activity & backend DB
  const [streakDays, setStreakDays] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('duocard_streak') || '0', 10) || 0;
  });
  const [totalStudyHours, setTotalStudyHours] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return parseFloat(localStorage.getItem('duocard_study_hours') || '0') || 0;
  });
  const [backendReviewLogs, setBackendReviewLogs] = useState<Record<string, number>>({});
  const [cardsLearnedCount, setCardsLearnedCount] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(() => {
    if (typeof window === 'undefined') return 'Beginner';
    return localStorage.getItem('duocard_level') || 'Beginner';
  });
  const [levelProgress, setLevelProgress] = useState(0);

  // Streak tab
  const [streakTab] = useState<'month' | 'year' | 'total'>('year');
  const [yearOffset, setYearOffset] = useState(0);   // 0 = current year
  const [monthOffset] = useState(0);

  // Profile submenu tab
  type ProfileSubmenuTab = 'progress' | 'activity' | 'friends' | 'achievements' | 'decks';
  const [activeSubmenu, setActiveSubmenu] = useState<ProfileSubmenuTab>('progress');

  // Derived navigation labels
  const TODAY = new Date();
  const ACCOUNT_START = new Date('2025-04-01');
  const selectedYear = TODAY.getFullYear() + yearOffset;
  const selectedMonthDate = React.useMemo(
    () => new Date(TODAY.getFullYear(), TODAY.getMonth() + monthOffset, 1),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [monthOffset]
  );
    // Bounds: can't go before account creation or into the future
  const canGoBackYear = selectedYear > ACCOUNT_START.getFullYear();
  const canGoFwdYear = selectedYear < TODAY.getFullYear();
    
  // Tooltip state for hover
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    dateStr: string;
    cards: number;
  }>({ visible: false, x: 0, y: 0, dateStr: '', cards: 0 });

  // Scroll ref for heatmap
  const heatScrollRef = React.useRef<HTMLDivElement>(null);

  // Generate ALL heatmap data from account creation or real study logs
  const allHeatmapCols = React.useMemo(() => {
    const today = new Date();
    // Default account start to beginning of current year or user registration
    const accountStart = new Date(today.getFullYear(), 0, 1);
    const startSunday = new Date(accountStart);
    startSunday.setDate(accountStart.getDate() - accountStart.getDay());
    
    // Check if user has review activity in backend and localStorage
    const studyActivityMap: Record<string, number> = { ...backendReviewLogs };
    try {
      const logs = JSON.parse(localStorage.getItem('duocard_review_logs') || '[]');
      if (Array.isArray(logs)) {
        logs.forEach((item: { date?: string; count?: number }) => {
          if (item.date) {
            studyActivityMap[item.date] = Math.max(studyActivityMap[item.date] || 0, (studyActivityMap[item.date] || 0) + (item.count || 1));
          }
        });
      }
    } catch {
      // ignore
    }

    const raw: { date: Date; cards: number; future: boolean; outOfYear?: boolean }[] = [];
    const cursor = new Date(startSunday);
    while (cursor <= today || raw.length % 7 !== 0) {
      const isFuture = cursor > today;
      const key = cursor.toISOString().split('T')[0];
      const cards = isFuture ? 0 : (studyActivityMap[key] || 0);
      raw.push({ date: new Date(cursor), cards, future: isFuture });
      cursor.setDate(cursor.getDate() + 1);
    }
    const cols: { date: Date; cards: number; future: boolean; outOfYear?: boolean }[][] = [];
    const numWeeks = raw.length / 7;
    for (let w = 0; w < numWeeks; w++) cols.push(raw.slice(w * 7, w * 7 + 7));
    return cols;
  }, [backendReviewLogs]);

  // Yearly heatmap: real blocks
  const yearHeatmapCols = React.useMemo(() => {
    const today = new Date();
    const jan1 = new Date(selectedYear, 0, 1);
    const dec31 = new Date(selectedYear, 11, 31);
    const startDate = new Date(jan1);
    startDate.setDate(jan1.getDate() - jan1.getDay());
    const endDate = new Date(dec31);
    endDate.setDate(dec31.getDate() + (6 - dec31.getDay()));

    const studyActivityMap: Record<string, number> = { ...backendReviewLogs };
    try {
      const logs = JSON.parse(localStorage.getItem('duocard_review_logs') || '[]');
      if (Array.isArray(logs)) {
        logs.forEach((item: { date?: string; count?: number }) => {
          if (item.date) {
            studyActivityMap[item.date] = Math.max(studyActivityMap[item.date] || 0, (studyActivityMap[item.date] || 0) + (item.count || 1));
          }
        });
      }
    } catch {
      // ignore
    }

    const raw: { date: Date; cards: number; future: boolean; outOfYear: boolean }[] = [];
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      const isFuture = cursor > today;
      const outOfYear = cursor.getFullYear() !== selectedYear;
      const key = cursor.toISOString().split('T')[0];
      const cards = (!isFuture && !outOfYear)
        ? (studyActivityMap[key] || 0)
        : 0;
      raw.push({ date: new Date(cursor), cards, future: isFuture, outOfYear });
      cursor.setDate(cursor.getDate() + 1);
    }
    const cols: { date: Date; cards: number; future: boolean; outOfYear: boolean }[][] = [];
    const numWeeks = Math.ceil(raw.length / 7);
    for (let w = 0; w < numWeeks; w++) cols.push(raw.slice(w * 7, w * 7 + 7));
    return cols;
  }, [selectedYear, backendReviewLogs]);

  // Filter columns based on active tab + navigation offset
  const heatmapCols = React.useMemo(() => {
    if (streakTab === 'month') {
      return allHeatmapCols.filter(col => {
        const d = col[0]?.date;
        return d && d.getFullYear() === selectedMonthDate.getFullYear()
          && d.getMonth() === selectedMonthDate.getMonth();
      });
    }
    if (streakTab === 'year') {
      return yearHeatmapCols; // exact 365/366 blocks
    }
    return allHeatmapCols;
  }, [allHeatmapCols, yearHeatmapCols, streakTab, selectedMonthDate]);

  // Compute derived stats from visible heatmap for submenu
  const yearStats = React.useMemo(() => {
    let total = 0, activeDays = 0, bestDay = 0;
    for (const col of heatmapCols) {
      for (const cell of col) {
        if (!cell || (cell as { outOfYear?: boolean }).outOfYear || cell.future) continue;
        total += cell.cards;
        if (cell.cards > 0) activeDays++;
        if (cell.cards > bestDay) bestDay = cell.cards;
      }
    }
    // Most active month name
    const monthTotals: Record<number, number> = {};
    for (const col of heatmapCols) {
      for (const cell of col) {
        if (!cell || (cell as { outOfYear?: boolean }).outOfYear || cell.future || cell.cards === 0) continue;
        const m = cell.date.getMonth();
        monthTotals[m] = (monthTotals[m] ?? 0) + cell.cards;
      }
    }
    const bestMonthIdx = Object.entries(monthTotals).sort((a, b) => b[1] - a[1])[0]?.[0];
    const bestMonth = bestMonthIdx !== undefined
      ? new Date(selectedYear, Number(bestMonthIdx), 1).toLocaleString('default', { month: 'short' })
      : '–';
    return { total, activeDays, bestDay, bestMonth };
  }, [heatmapCols, selectedYear]);

  // Auto-scroll to right when tab or offset changes
  React.useEffect(() => {
    if (heatScrollRef.current) {
      heatScrollRef.current.scrollLeft = heatScrollRef.current.scrollWidth;
    }
  }, [streakTab, yearOffset, monthOffset]);

  // Decks list and backend global stats
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    // 1. Fetch backend database global stats & review logs
    fetchStats()
      .then((statData) => {
        if (statData) {
          if (statData.streakDays !== undefined) {
            setStreakDays(statData.streakDays);
            try {
              localStorage.setItem('duocard_streak', String(statData.streakDays));
            } catch {
              // ignore
            }
          }
          if (statData.totalReviews !== undefined) {
            const calculatedHours = Math.round((statData.totalReviews * 0.05) * 10) / 10;
            setTotalStudyHours((prev) => Math.max(prev, calculatedHours));
          }
          if (Array.isArray(statData.reviewActivity) && statData.reviewActivity.length > 0) {
            const actMap: Record<string, number> = {};
            statData.reviewActivity.forEach((act) => {
              if (act.date) {
                actMap[act.date] = act.count || 1;
              }
            });
            setBackendReviewLogs(actMap);
          }
        }
      })
      .catch((err) => {
        console.warn('Could not fetch backend stats:', err);
      });

    // 2. Fetch all decks
    fetchDecks()
      .then((data) => {
        if (data && data.length > 0) {
          setDecks(data);
          const firstLang = data.find((d) => d.language)?.language;
          if (firstLang) {
            setTargetLang((prev) => {
              if (!prev || prev.toLowerCase() === 'japanese') {
                return firstLang;
              }
              return prev;
            });
          }
          const totalCards = data.reduce((acc, d) => acc + (d.cards?.length || 0), 0);
          setCardsLearnedCount(totalCards);
          const completedCards = data.reduce(
            (acc, d) =>
              acc + (d.cards?.filter((c) => c.status === 'MASTERED' || c.status === 'REVIEW')?.length || 0),
            0
          );
          const masteredTotal = data.reduce(
            (acc, d) => acc + (d.cards?.filter((c) => c.status === 'MASTERED')?.length || 0),
            0
          );

          if (totalCards > 0) {
            const masteryPct = Math.round((masteredTotal / totalCards) * 100);
            setLevelProgress(Math.min(100, Math.round((completedCards / totalCards) * 100)));

            let calculatedLevel = 'Beginner';
            if (masteredTotal >= 80 || (totalCards >= 100 && masteryPct >= 75)) {
              calculatedLevel = 'Advanced';
            } else if (masteredTotal >= 15 || (totalCards >= 15 && masteryPct >= 40) || masteryPct >= 50) {
              calculatedLevel = 'Intermediate';
            }

            setCurrentLevel((prev) => {
              if (calculatedLevel === 'Advanced') return 'Advanced';
              if (calculatedLevel === 'Intermediate' && prev !== 'Advanced') return 'Intermediate';
              return prev || 'Beginner';
            });
          }
        } else {
          setDecks([]);
          setCardsLearnedCount(0);
          setLevelProgress(0);
        }
      })
      .catch(() => {
        setDecks([]);
      });
  }, []);

  // Dynamic real user achievements unlocked strictly according to actual study metrics
  const achievements: Achievement[] = useMemo(() => {
    return [
      {
        id: 'streak',
        title: '7-Day Streak',
        subtitle: streakDays >= 7 ? 'Consistency champion!' : `${streakDays}/7 days`,
        icon: streakDays >= 7 ? <Flame className="w-5 h-5 text-amber-400" /> : <Lock className="w-4 h-4 text-slate-400" />,
        iconBg: streakDays >= 7 ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200/40',
        iconColor: streakDays >= 7 ? 'text-amber-400' : 'text-slate-400',
        unlocked: streakDays >= 7,
      },
      {
        id: 'firstdeck',
        title: 'First Deck',
        subtitle: decks.length > 0 ? `${decks.length} deck${decks.length > 1 ? 's' : ''} in library` : '0/1 decks',
        icon: decks.length > 0 ? <Award className="w-5 h-5 text-yellow-400" /> : <Lock className="w-4 h-4 text-slate-400" />,
        iconBg: decks.length > 0 ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200/40',
        iconColor: decks.length > 0 ? 'text-yellow-400' : 'text-slate-400',
        unlocked: decks.length > 0,
      },
      {
        id: '100cards',
        title: '100 Cards',
        subtitle: cardsLearnedCount >= 100 ? "Vocabulary master" : `${cardsLearnedCount}/100 cards`,
        icon: cardsLearnedCount >= 100 ? <BookOpen className="w-5 h-5 text-cyan-400" /> : <Lock className="w-4 h-4 text-slate-400" />,
        iconBg: cardsLearnedCount >= 100 ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200/40',
        iconColor: cardsLearnedCount >= 100 ? 'text-cyan-400' : 'text-slate-400',
        unlocked: cardsLearnedCount >= 100,
      },
      {
        id: 'dedicated',
        title: 'Dedicated Learner',
        subtitle: totalStudyHours >= 50 ? '50 hours studied' : `${totalStudyHours}/50 hrs`,
        icon: totalStudyHours >= 50 ? <Trophy className="w-5 h-5 text-purple-400" /> : <Lock className="w-4 h-4 text-slate-400" />,
        iconBg: totalStudyHours >= 50 ? 'bg-purple-500/15 text-purple-400 border-purple-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200/40',
        iconColor: totalStudyHours >= 50 ? 'text-purple-400' : 'text-slate-400',
        unlocked: totalStudyHours >= 50,
      },
      {
        id: 'targetLang',
        title: targetLang,
        subtitle: currentLevel,
        icon: <Mountain className="w-5 h-5 text-blue-400" />,
        iconBg: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
        iconColor: 'text-blue-400',
        unlocked: true,
      },
      {
        id: 'mastery',
        title: 'Mastery Progress',
        subtitle: levelProgress > 0 ? `${levelProgress}% completed` : 'Start studying',
        icon: levelProgress > 0 ? <Zap className="w-5 h-5 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-400" />,
        iconBg: levelProgress > 0 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200/40',
        iconColor: levelProgress > 0 ? 'text-emerald-400' : 'text-slate-400',
        unlocked: levelProgress > 0,
      },
    ];
  }, [streakDays, cardsLearnedCount, decks.length, targetLang, currentLevel, totalStudyHours, levelProgress]);

  // Dynamic recent activities strictly from real review logs (both localStorage and backend API stats)
  const recentActivities: ActivityItem[] = useMemo(() => {
    const list: ActivityItem[] = [];

    try {
      const logs = JSON.parse(localStorage.getItem('duocard_review_logs') || '[]');
      if (Array.isArray(logs) && logs.length > 0) {
        logs.slice(-4).reverse().forEach((log: { count?: number; deckTitle?: string; date?: string }, idx: number) => {
          list.push({
            id: `review-local-${idx}`,
            title: `Reviewed ${log.count || 1} card${(log.count || 1) > 1 ? 's' : ''}`,
            subtitle: log.deckTitle || targetLang,
            timeAgo: log.date || 'Recent',
            icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
            iconBg: 'bg-emerald-500/15 border-emerald-500/30',
          });
        });
      }
    } catch {
      // ignore
    }

    // If local storage is empty, populate from backend database reviewActivity
    if (list.length === 0 && Object.keys(backendReviewLogs).length > 0) {
      Object.entries(backendReviewLogs)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .slice(0, 4)
        .forEach(([dateStr, count], idx) => {
          list.push({
            id: `review-backend-${idx}`,
            title: `Reviewed ${count} card${count > 1 ? 's' : ''}`,
            subtitle: targetLang || 'Study Session',
            timeAgo: dateStr,
            icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
            iconBg: 'bg-emerald-500/15 border-emerald-500/30',
          });
        });
    }

    return list;
  }, [targetLang, backendReviewLogs]);


  const openEditModal = () => {
    const DUMMY_NAMES = ['Learner', 'Verizon Kert', 'Alex Morgan'];
    const DUMMY_HANDLES = ['learner', 'verizon'];
    const DUMMY_BIOS = ['Consistent steps toward fluency.', 'Small steps. Big fluency.'];
    setDraftName(DUMMY_NAMES.includes(name) ? '' : name);
    setDraftHandle(DUMMY_HANDLES.includes(handle.toLowerCase()) ? '' : handle);
    setDraftBio(DUMMY_BIOS.includes(bio) ? '' : bio);
    setDraftCountry(country === 'India' && !localStorage.getItem('duocard_country') ? '' : country);
    setDraftBanner(bannerImage);
    setDraftBannerPosition(bannerPosition);
    setDraftBannerZoom(bannerZoom);
    setDraftAvatar(avatarImage);
    setIsEditingModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setName(draftName);
    // Sanitize handle (remove @ and whitespace if user typed it)
    const cleanHandle = draftHandle.replace(/^@+/, '').trim().toLowerCase() || 'zenlearns';
    setHandle(cleanHandle);
    setBio(draftBio);
    setCountry(draftCountry);
    setBannerImage(draftBanner);
    setBannerPosition(draftBannerPosition);
    setBannerZoom(draftBannerZoom);

    // Save to localStorage so it is remembered on refresh!
    localStorage.setItem('duocard_banner', draftBanner);
    localStorage.setItem('duocard_banner_position', draftBannerPosition);
    localStorage.setItem('duocard_banner_zoom', String(draftBannerZoom));
    localStorage.setItem('duocard_username', draftName);
    localStorage.setItem('duocard_user_name', draftName);
    localStorage.setItem('duocard_handle', cleanHandle);
    localStorage.setItem('duocard_bio', draftBio);
    if (draftCountry) {
      localStorage.setItem('duocard_country', draftCountry);
    } else {
      localStorage.removeItem('duocard_country');
    }

    if (draftAvatar && !isFakeAvatar(draftAvatar)) {
      setAvatarImage(draftAvatar);
      localStorage.setItem('duocard_avatar', draftAvatar);
    } else {
      setAvatarImage('');
      localStorage.removeItem('duocard_avatar');
    }

    // Save to backend database
    try {
      const userIdent = localStorage.getItem('duocard_username') || draftName;
      await apiSavePreferences({
        usernameOrEmail: userIdent,
        displayName: draftName,
        handle: cleanHandle,
        avatar: draftAvatar && !isFakeAvatar(draftAvatar) ? draftAvatar : '',
        bio: draftBio,
        country: draftCountry,
        banner: draftBanner,
        bannerPosition: draftBannerPosition,
      });
    } catch (err) {
      console.warn('Backend save preferences notice:', err);
    }

    window.dispatchEvent(new Event('user_profile_updated'));
    setIsEditingModalOpen(false);
  };

  // ═════════════════════════════════════════════════════════
  // OTHER USER FULL PROFILE PAGE VIEW
  // ═════════════════════════════════════════════════════════
  if (selectedViewUser) {
    const isFollowed = friendsList.some((f) => f.id === selectedViewUser.id);
    return (
      <OtherUserProfileView
        selectedViewUser={selectedViewUser}
        onBack={() => setSelectedViewUser(null)}
        isFollowed={isFollowed}
        onToggleFollow={handleToggleFollow}
        onOpenChat={(user) => setActiveChatFriend(user)}
        currentAccent={currentAccent}
        achievements={achievements}
        recentActivities={recentActivities}
      />
    );
  }

  return (
    <div className="min-h-full w-full p-4 sm:p-6 lg:p-8 bg-[#f5f7fb] dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-[1400px] mx-auto space-y-4 pb-12">
      {/* 1. FULL-WIDTH HERO PROFILE HUD BANNER */}
      <ProfileHudBanner
        bannerImage={bannerImage}
        bannerPosition={bannerPosition}
        bannerZoom={bannerZoom}
        avatarImage={avatarImage}
        name={name}
        handle={handle}
        bio={bio}
        joinedDate={joinedDate}
        country={country}
        currentAccent={currentAccent}
        onOpenEditModal={openEditModal}
      />




      {/* 2b. LEARNING STREAK HEATMAP CARD */}
      <LearningStreakHeatmap
        currentAccent={currentAccent}
        streakDays={streakDays}
        totalStudyHours={totalStudyHours}
        yearOffset={yearOffset}
        setYearOffset={setYearOffset}
        selectedYear={selectedYear}
        canGoBackYear={canGoBackYear}
        canGoFwdYear={canGoFwdYear}
        yearStats={yearStats}
        heatmapCols={heatmapCols}
        streakTab={streakTab}
        tooltip={tooltip}
        setTooltip={setTooltip}
      />


      {/* ═════════════════════════════════════════════════════════
          3. SUBMENU NAVIGATION BAR & ACTIVE SECTION VIEW
             Submenu: My Learning Progress, Recent Activity, Friends, Achievements, My Decks
      ═════════════════════════════════════════════════════════ */}
      <div className="space-y-3.5">
        {/* YouTube-Style Submenu Tabs Bar */}
        <div className="border-b border-slate-200 dark:border-white/10 px-1">
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none">
            {[
              { id: 'progress' as const, label: t('myLearningProgress') },
              { id: 'activity' as const, label: t('recentActivity') },
              { id: 'friends' as const, label: t('friends') },
              { id: 'achievements' as const, label: t('achievements') },
              { id: 'decks' as const, label: t('myDecks') },
            ].map((tab) => {
              const isActive = activeSubmenu === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSubmenu(tab.id)}
                  className={`group relative py-3 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-slate-900 dark:text-white font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  {/* YouTube Underline Indicator */}
                  {isActive ? (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                      style={{ backgroundColor: currentAccent.primary }}
                    />
                  ) : (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-transparent group-hover:bg-slate-300 dark:group-hover:bg-white/20 transition-colors" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ──── TAB CONTENT ──── */}

        {/* 1. MY LEARNING PROGRESS */}
        {activeSubmenu === 'progress' && (
          <ProfileProgressTab
            currentAccent={currentAccent}
            targetLang={targetLang}
            currentLevel={currentLevel}
            streakDays={streakDays}
            decks={decks}
          />
        )}

        {/* 2. RECENT ACTIVITY */}
        {activeSubmenu === 'activity' && (
          <ProfileActivityTab recentActivities={recentActivities} currentAccent={currentAccent} />
        )}

        {/* 3. FRIENDS */}
        {activeSubmenu === 'friends' && (
          <ProfileFriendsTab
            friendsList={friendsList}
            currentAccent={currentAccent}
            setIsSearchModalOpen={setIsSearchModalOpen}
            setSelectedViewUser={setSelectedViewUser}
            setActiveChatFriend={setActiveChatFriend}
          />
        )}

        {/* 4. ACHIEVEMENTS */}
        {activeSubmenu === 'achievements' && (
          <ProfileAchievementsTab achievements={achievements} t={t} />
        )}

        {/* 5. MY DECKS (Square Deck Cards) */}
        {activeSubmenu === 'decks' && (
          <ProfileDecksTab
            displayDecks={decks}
            currentAccent={currentAccent}
          />
        )}

        {/* Panoramic Footer Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#161922] dark:bg-[#14161f] border border-white/10 shadow-lg min-h-[105px] flex items-center p-4 sm:p-5">
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40"
            style={{
              backgroundImage: `url('/profile/footer-banner.jpg')`,
              backgroundPosition: 'right 30%',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1017] via-[#0d1017]/85 to-transparent pointer-events-none" />

          <div className="relative z-10 space-y-1.5 max-w-md">
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {t('betterEveryday')}
            </h2>
            <p className="text-[11px] text-slate-300 font-normal">
              {t('betterEverydayDesc')}
            </p>
            <div className="pt-0.5">
              <Link
                href="/explore"
                style={{ backgroundColor: currentAccent.primary }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11px] font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
              >
                <span>{t('exploreDecksBtn')}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <ProfileEditModal
        isOpen={isEditingModalOpen}
        onClose={() => setIsEditingModalOpen(false)}
        draftName={draftName}
        setDraftName={setDraftName}
        draftHandle={draftHandle}
        setDraftHandle={setDraftHandle}
        draftCountry={draftCountry}
        setDraftCountry={setDraftCountry}
        draftBio={draftBio}
        setDraftBio={setDraftBio}
        draftBanner={draftBanner}
        setDraftBanner={setDraftBanner}
        draftBannerPosition={draftBannerPosition}
        setDraftBannerPosition={setDraftBannerPosition}
        draftBannerZoom={draftBannerZoom}
        setDraftBannerZoom={setDraftBannerZoom}
        bannerInputMode={bannerInputMode}
        setBannerInputMode={setBannerInputMode}
        currentAccent={currentAccent}
        onSave={handleSaveProfile}
      />

      {/* SEARCH USERS MODAL */}
      <ProfileSearchUserModal
        isOpen={isSearchModalOpen}
        onClose={() => {
          setIsSearchModalOpen(false);
          setUserSearchQuery('');
        }}
        userSearchQuery={userSearchQuery}
        setUserSearchQuery={setUserSearchQuery}
        friendsList={friendsList}
        discoverableUsers={DISCOVERABLE_USERS}
        onSelectUser={(user) => {
          setIsSearchModalOpen(false);
          setSelectedViewUser(user);
        }}
        onOpenChat={(user) => {
          setIsSearchModalOpen(false);
          setActiveChatFriend(user);
        }}
        onToggleFollow={handleToggleFollow}
      />

      {/* CHAT WITH FRIEND DIALOG */}
      <ProfileChatDialog
        friend={activeChatFriend}
        onClose={() => setActiveChatFriend(null)}
        messages={activeChatFriend ? chatMessages[activeChatFriend.id] || [] : []}
        chatDraftText={chatDraftText}
        setChatDraftText={setChatDraftText}
        onSendMessage={handleSendMessage}
      />
    </div>
    </div>
  );
}
