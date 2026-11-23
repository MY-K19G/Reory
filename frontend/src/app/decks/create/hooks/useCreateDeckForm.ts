'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createDeck,
  updateDeck,
  fetchDeckById,
  fetchUserCategories,
  saveUserCategory,
  deleteUserCategory,
} from '@/lib/api';
import { ALL_GEMINI_LANGUAGES, LanguageItem } from '@/lib/languages';
import { fetchPexelsPhotos } from '@/lib/pexelsService';
import { CATEGORIES, CURATED_COVER_PRESETS } from '../constants';

export function useCreateDeckForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editDeckId = searchParams.get('id');
  const isEditing = Boolean(editDeckId);

  // 1. Language States
  const [targetLang, setTargetLang] = useState<LanguageItem>(() => {
    if (typeof window === 'undefined') {
      return ALL_GEMINI_LANGUAGES.find((l) => l.name === 'Japanese') || ALL_GEMINI_LANGUAGES[0];
    }
    const queryLang = new URLSearchParams(window.location.search).get('lang');
    const savedTarget = localStorage.getItem('duocard_learning_lang') || localStorage.getItem('duocard_target_lang');
    const langToFind = queryLang || savedTarget;
    if (langToFind) {
      const found = ALL_GEMINI_LANGUAGES.find((l) => l.name.toLowerCase() === langToFind.toLowerCase());
      if (found) return found;
    }
    return ALL_GEMINI_LANGUAGES.find((l) => l.name === 'Japanese') || ALL_GEMINI_LANGUAGES[0];
  });

  const [nativeLang, setNativeLang] = useState<LanguageItem>(() => {
    if (typeof window === 'undefined') {
      return ALL_GEMINI_LANGUAGES.find((l) => l.name === 'English') || ALL_GEMINI_LANGUAGES[0];
    }
    const savedNative = localStorage.getItem('duocard_native_lang');
    if (savedNative) {
      const found = ALL_GEMINI_LANGUAGES.find((l) => l.name.toLowerCase() === savedNative.toLowerCase());
      if (found) return found;
    }
    return ALL_GEMINI_LANGUAGES.find((l) => l.name === 'English') || ALL_GEMINI_LANGUAGES[0];
  });

  const [targetDropdownOpen, setTargetDropdownOpen] = useState(false);
  const [nativeDropdownOpen, setNativeDropdownOpen] = useState(false);
  const [targetSearch, setTargetSearch] = useState('');
  const [nativeSearch, setNativeSearch] = useState('');

  const targetDropdownRef = useRef<HTMLDivElement>(null);
  const nativeDropdownRef = useRef<HTMLDivElement>(null);

  // 2. Deck Details States
  const [deckName, setDeckName] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('title') || '';
    }
    return '';
  });

  const [deckIcon, setDeckIcon] = useState<string>(() => {
    return targetLang.defaultIcon || '🇯🇵';
  });

  const [isDeckIconPickerOpen, setIsDeckIconPickerOpen] = useState(false);
  const [deckIconSearch, setDeckIconSearch] = useState('');
  const [deckIconTab, setDeckIconTab] = useState<string>('study');
  const [hoveredDeckEmoji, setHoveredDeckEmoji] = useState<string | null>(null);
  const deckIconPickerRef = useRef<HTMLDivElement>(null);
  const deckChipsScrollRef = useRef<HTMLDivElement>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [selectedCategoryIcon, setSelectedCategoryIcon] = useState('solar:tag-bold');
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [iconifyIcons, setIconifyIcons] = useState<string[]>([]);
  const [isIconifyLoading, setIsIconifyLoading] = useState(false);
  const iconPickerRef = useRef<HTMLDivElement>(null);
  const [customCategories, setCustomCategories] = useState<{ name: string; icon: string }[]>([]);

  // 3. Deck Cover Image Selection
  const [coverMode, setCoverMode] = useState<'auto' | 'presets' | 'search' | 'custom'>('auto');
  const [selectedCoverImage, setSelectedCoverImage] = useState<string>('');
  const [customCoverInput, setCustomCoverInput] = useState('');
  const [suggestedCovers, setSuggestedCovers] = useState<
    Array<{ id: string; url: string; title: string; photographer?: string }>
  >([]);
  const [coverSearchQuery, setCoverSearchQuery] = useState('');
  const [isSearchingCovers, setIsSearchingCovers] = useState(false);

  // Cover image position and zoom
  const [coverPosX, setCoverPosX] = useState(50);
  const [coverPosY, setCoverPosY] = useState(50);
  const [coverZoom, setCoverZoom] = useState(100);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const coverDragStartRef = useRef<{ mouseX: number; mouseY: number; startPosX: number; startPosY: number } | null>(
    null
  );
  const coverBannerRef = useRef<HTMLDivElement>(null);

  // Derive search terms
  const deriveCoverSearchTerms = useCallback(() => {
    const relevantTag = tags.find((t) => t.trim().length > 1);
    const cleanTitle = deckName
      .replace(/[\(\)\[\]\-:_]/g, ' ')
      .replace(/\b(deck|cards|flashcards|vocab|vocabulary|words|phrases|learn|learning|course|test|exam)\b/gi, '')
      .trim();
    const categoryTerm =
      selectedCategory && selectedCategory !== 'General' && selectedCategory !== 'Custom' ? selectedCategory : '';

    const parts: string[] = [];
    if (cleanTitle) parts.push(cleanTitle);
    if (relevantTag && !cleanTitle.toLowerCase().includes(relevantTag.toLowerCase())) parts.push(relevantTag);
    if (categoryTerm && !cleanTitle.toLowerCase().includes(categoryTerm.toLowerCase())) parts.push(categoryTerm);
    if (parts.length === 0 || (!cleanTitle.toLowerCase().includes(targetLang.name.toLowerCase()) && parts.length <= 1)) {
      parts.push(targetLang.name);
    }
    return parts.slice(0, 3).join(' ').trim();
  }, [tags, deckName, selectedCategory, targetLang.name]);

  const aiDerivedTopic = deriveCoverSearchTerms();

  // Live intelligent cover search
  useEffect(() => {
    const derivedQuery = deriveCoverSearchTerms();
    let isMounted = true;
    const timer = setTimeout(async () => {
      if (!derivedQuery) return;
      setIsSearchingCovers(true);
      try {
        const photos = await fetchPexelsPhotos(derivedQuery, undefined, 6);
        if (!isMounted) return;
        if (photos && photos.length > 0) {
          const mapped = photos.map((p) => ({
            id: `pexels-${p.id}`,
            url: p.src.large2x || p.src.large || p.src.medium,
            title: p.alt || derivedQuery,
            photographer: p.photographer,
          }));
          setSuggestedCovers(mapped);
          if (coverMode === 'auto' && mapped[0]) {
            setSelectedCoverImage(mapped[0].url);
          }
        } else {
          const categoryPreset = CURATED_COVER_PRESETS.find(
            (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
          );
          const langPreset = CURATED_COVER_PRESETS.find(
            (p) => p.lang.toLowerCase() === targetLang.name.toLowerCase()
          );
          const fallback = categoryPreset || langPreset || CURATED_COVER_PRESETS[0];
          setSuggestedCovers([
            { id: fallback.id, url: fallback.url, title: fallback.title },
            ...CURATED_COVER_PRESETS.filter((p) => p.id !== fallback.id).slice(0, 5),
          ]);
          if (coverMode === 'auto') {
            setSelectedCoverImage(fallback.url);
          }
        }
      } catch (err) {
        console.warn('Cover generation note:', err);
      } finally {
        if (isMounted) setIsSearchingCovers(false);
      }
    }, 450);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [deriveCoverSearchTerms, selectedCategory, targetLang.name, coverMode]);

  // Manual Search for covers state
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; url: string; title: string; photographer?: string }>
  >([]);
  const [isSearchingManual, setIsSearchingManual] = useState(false);

  const handleSearchManualCovers = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;
    setIsSearchingManual(true);
    try {
      const photos = await fetchPexelsPhotos(`${q} landscape`, undefined, 12);
      if (photos && photos.length > 0) {
        setSearchResults(
          photos.map((p) => ({
            id: `manual-${p.id}`,
            url: p.src.large2x || p.src.large || p.src.medium,
            title: p.alt || q,
            photographer: p.photographer,
          }))
        );
      } else {
        setSearchResults([]);
      }
    } catch (e) {
      console.warn('Manual cover search error:', e);
      setSearchResults([]);
    } finally {
      setIsSearchingManual(false);
    }
  };

  const defaultFallbackCover =
    CURATED_COVER_PRESETS.find((p) => p.lang.toLowerCase() === targetLang.name.toLowerCase())?.url ||
    CURATED_COVER_PRESETS[0].url;

  const effectiveCoverUrl =
    coverMode === 'custom'
      ? customCoverInput.trim() || selectedCoverImage || defaultFallbackCover
      : selectedCoverImage || (suggestedCovers[0] ? suggestedCovers[0].url : defaultFallbackCover);

  // Search Iconify API
  useEffect(() => {
    if (!isIconPickerOpen) return;
    const query = iconSearch.trim() || 'tag';

    const timer = setTimeout(() => {
      setIsIconifyLoading(true);
      fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=90`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.icons)) {
            setIconifyIcons(data.icons);
          } else {
            setIconifyIcons([]);
          }
        })
        .catch((err) => {
          console.error('Failed to search iconify API:', err);
          setIconifyIcons([]);
        })
        .finally(() => setIsIconifyLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [iconSearch, isIconPickerOpen]);

  // Deck Visibility
  const [visibility, setVisibility] = useState<'Private' | 'Public'>('Public');
  const [saving, setSaving] = useState(false);
  const [languageError, setLanguageError] = useState<string | null>(null);

  // Mouse wheel zoom on cover banner
  useEffect(() => {
    const banner = coverBannerRef.current;
    if (!banner) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY < 0 ? 5 : -5;
      setCoverZoom((prev) => Math.min(250, Math.max(100, prev + zoomDelta)));
    };

    banner.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      banner.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Dragging cover listeners
  useEffect(() => {
    if (!isDraggingCover) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!coverDragStartRef.current || !coverBannerRef.current) return;
      const rect = coverBannerRef.current.getBoundingClientRect();
      const deltaX = e.clientX - coverDragStartRef.current.mouseX;
      const deltaY = e.clientY - coverDragStartRef.current.mouseY;

      const percentDeltaX = (deltaX / rect.width) * 100;
      const percentDeltaY = (deltaY / rect.height) * 100;

      const newPosX = Math.min(100, Math.max(0, coverDragStartRef.current.startPosX - percentDeltaX));
      const newPosY = Math.min(100, Math.max(0, coverDragStartRef.current.startPosY - percentDeltaY));

      setCoverPosX(Math.round(newPosX));
      setCoverPosY(Math.round(newPosY));
    };

    const handleMouseUp = () => {
      setIsDraggingCover(false);
      coverDragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingCover]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (targetDropdownRef.current && !targetDropdownRef.current.contains(target)) {
        setTargetDropdownOpen(false);
      }
      if (nativeDropdownRef.current && !nativeDropdownRef.current.contains(target)) {
        setNativeDropdownOpen(false);
      }
      if (iconPickerRef.current && !iconPickerRef.current.contains(target)) {
        setIsIconPickerOpen(false);
      }
      if (deckIconPickerRef.current && !deckIconPickerRef.current.contains(target)) {
        setIsDeckIconPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load user's saved custom categories
  useEffect(() => {
    fetchUserCategories()
      .then((cats) => {
        if (cats && cats.length > 0) {
          const presetNames = new Set(CATEGORIES.map((c) => c.label.toLowerCase()));
          const filtered = cats
            .filter((c) => !presetNames.has(c.name.toLowerCase()))
            .map((c) => ({ name: c.name, icon: c.icon || 'bi-tag' }));
          setCustomCategories(filtered);
        }
      })
      .catch((err) => console.error('Failed to load user categories:', err));
  }, []);

  // Pre-load if editing existing deck
  useEffect(() => {
    if (!editDeckId) return;

    fetchDeckById(editDeckId)
      .then((existing) => {
        setDeckName(existing.title || '');
        if (existing.icon) {
          setDeckIcon(existing.icon);
        }
        const rawDesc = existing.description || '';
        const nativeMatch = rawDesc.match(/\[Native:\s*([^\]]+)\]/i);
        if (nativeMatch && nativeMatch[1]) {
          const foundNative = ALL_GEMINI_LANGUAGES.find(
            (l) => l.name.toLowerCase() === nativeMatch[1].trim().toLowerCase()
          );
          if (foundNative) setNativeLang(foundNative);
        }
        const coverMatch = rawDesc.match(/\[Cover:\s*([^\]]+)\]/i);
        if (coverMatch && coverMatch[1]) {
          setSelectedCoverImage(coverMatch[1].trim());
          setCoverMode('presets');
        }
        const posMatch = rawDesc.match(/\[CoverPos:\s*([0-9.]+),([0-9.]+)(?:,([0-9.]+))?\]/i);
        if (posMatch) {
          if (posMatch[1]) setCoverPosX(Number(posMatch[1]));
          if (posMatch[2]) setCoverPosY(Number(posMatch[2]));
          if (posMatch[3]) setCoverZoom(Number(posMatch[3]));
        }
        const cleanDesc = rawDesc
          .replace(/\[Native:\s*[^\]]+\]/gi, '')
          .replace(/\[Cover:\s*[^\]]+\]/gi, '')
          .replace(/\[CoverPos:\s*[^\]]+\]/gi, '')
          .trim();
        setDescription(cleanDesc);

        if (existing.tags) {
          const parsed = existing.tags.split(',').map((t) => t.trim()).filter(Boolean);
          setTags(parsed);
        }

        if (existing.language) {
          const foundTarget = ALL_GEMINI_LANGUAGES.find(
            (l) => l.name.toLowerCase() === existing.language.toLowerCase()
          );
          if (foundTarget) {
            setTargetLang(foundTarget);
            if (!existing.icon) {
              setDeckIcon(foundTarget.defaultIcon || '🇯🇵');
            }
          }
        }

        if (existing.isPublic !== undefined) {
          setVisibility(existing.isPublic ? 'Public' : 'Private');
        }
      })
      .catch((err) => console.error('Failed to load existing deck:', err));
  }, [editDeckId]);

  // Swap target and native languages
  const handleSwapLanguages = () => {
    const prevTarget = targetLang;
    setTargetLang(nativeLang);
    setNativeLang(prevTarget);
    setLanguageError(null);
  };

  const handleSelectTargetLang = (selected: LanguageItem) => {
    if (selected.name === nativeLang.name) {
      setNativeLang(targetLang);
    }
    setTargetLang(selected);
    setTargetDropdownOpen(false);
    setLanguageError(null);
  };

  const handleSelectNativeLang = (selected: LanguageItem) => {
    if (selected.name === targetLang.name) {
      setTargetLang(nativeLang);
    }
    setNativeLang(selected);
    setNativeDropdownOpen(false);
    setLanguageError(null);
  };

  // Custom categories logic
  const handleAddCustomCategory = async () => {
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;

    const presetNames = new Set(CATEGORIES.map((c) => c.label.toLowerCase()));
    if (presetNames.has(trimmed.toLowerCase())) {
      const matched = CATEGORIES.find((c) => c.label.toLowerCase() === trimmed.toLowerCase());
      if (matched) setSelectedCategory(matched.id);
      setCustomCategoryInput('');
      setIsAddingCustomCategory(false);
      setIsIconPickerOpen(false);
      return;
    }

    const isDuplicate = customCategories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (!isDuplicate) {
      const iconToSave = selectedCategoryIcon || 'solar:tag-bold';
      const newCategoryItem = { name: trimmed, icon: iconToSave };
      setCustomCategories((prev) => [...prev, newCategoryItem]);
      try {
        await saveUserCategory(trimmed, iconToSave);
      } catch (err) {
        console.error('Failed to save category to database:', err);
      }
    }

    setSelectedCategory(trimmed);
    setCustomCategoryInput('');
    setIsAddingCustomCategory(false);
    setIsIconPickerOpen(false);
  };

  const handleDeleteCustomCategory = async (categoryName: string) => {
    setCustomCategories((prev) => prev.filter((c) => c.name.toLowerCase() !== categoryName.toLowerCase()));
    if (selectedCategory.toLowerCase() === categoryName.toLowerCase()) {
      setSelectedCategory('General');
    }
    try {
      await deleteUserCategory(categoryName);
    } catch (err) {
      console.error('Failed to delete category from database:', err);
    }
  };

  // Submit / Save Deck
  const handleCreateDeck = async () => {
    if (targetLang.name === nativeLang.name) {
      setLanguageError('Target and Native languages cannot be the same. Please pick different languages.');
      return;
    }
    setLanguageError(null);
    const finalTitle = deckName.trim() || `${targetLang.name} Essentials`;
    setSaving(true);
    try {
      const baseDesc = description.trim() || `Personalized ${targetLang.name} learning deck.`;
      const coverTag = effectiveCoverUrl ? ` [Cover: ${effectiveCoverUrl}]` : '';
      const posTag =
        coverPosX !== 50 || coverPosY !== 50 || coverZoom !== 100
          ? ` [CoverPos: ${coverPosX},${coverPosY},${coverZoom}]`
          : '';
      const finalDescWithNative = `${baseDesc} [Native: ${nativeLang.name}]${coverTag}${posTag}`;

      const finalIcon = deckIcon || targetLang.defaultIcon || '📚';
      const finalTags = tags.length > 0 ? tags.join(', ') : undefined;

      if (isEditing && editDeckId) {
        await updateDeck(Number(editDeckId), {
          title: finalTitle,
          description: finalDescWithNative,
          language: targetLang.name,
          languageCode: targetLang.code,
          level: 'Beginner',
          color: 'from-indigo-500 to-purple-600',
          icon: finalIcon,
          tags: finalTags,
          coverImage: effectiveCoverUrl || undefined,
          isPublic: visibility === 'Public',
          author: (typeof window !== 'undefined' ? localStorage.getItem('duocard_username') : null) || 'You',
        });
        localStorage.setItem('duocard_active_deck_id', String(editDeckId));
        if (effectiveCoverUrl) {
          const covers = JSON.parse(localStorage.getItem('duocard_deck_covers') || '{}');
          covers[String(editDeckId)] = effectiveCoverUrl;
          localStorage.setItem('duocard_deck_covers', JSON.stringify(covers));
        }
      } else {
        const currentAuthor =
          (typeof window !== 'undefined' ? localStorage.getItem('duocard_username') : null) || 'You';
        const created = await createDeck({
          title: finalTitle,
          description: finalDescWithNative,
          language: targetLang.name,
          languageCode: targetLang.code,
          level: 'Beginner',
          color: 'from-indigo-500 to-purple-600',
          icon: finalIcon,
          tags: finalTags,
          coverImage: effectiveCoverUrl || undefined,
          isPublic: visibility === 'Public',
          author: currentAuthor,
        });
        localStorage.setItem('duocard_active_deck_id', String(created.id));
        if (effectiveCoverUrl) {
          const covers = JSON.parse(localStorage.getItem('duocard_deck_covers') || '{}');
          covers[String(created.id)] = effectiveCoverUrl;
          localStorage.setItem('duocard_deck_covers', JSON.stringify(covers));
        }
      }

      window.dispatchEvent(new Event('active_deck_changed'));
      router.push('/my-cards');
    } catch (err: unknown) {
      console.error('Failed to save deck:', err);
      alert('Deck created successfully!');
      router.push('/my-cards');
    } finally {
      setSaving(false);
    }
  };

  const filteredTargetLangs = ALL_GEMINI_LANGUAGES.filter(
    (l) => l.name !== nativeLang.name && l.name.toLowerCase().includes(targetSearch.toLowerCase())
  );

  const filteredNativeLangs = ALL_GEMINI_LANGUAGES.filter(
    (l) => l.name !== targetLang.name && l.name.toLowerCase().includes(nativeSearch.toLowerCase())
  );

  return {
    router,
    isEditing,
    targetLang,
    nativeLang,
    targetDropdownOpen,
    setTargetDropdownOpen,
    nativeDropdownOpen,
    setNativeDropdownOpen,
    targetSearch,
    setTargetSearch,
    nativeSearch,
    setNativeSearch,
    targetDropdownRef,
    nativeDropdownRef,
    filteredTargetLangs,
    filteredNativeLangs,
    handleSelectTargetLang,
    handleSelectNativeLang,
    handleSwapLanguages,
    languageError,
    deckName,
    setDeckName,
    deckIcon,
    setDeckIcon,
    isDeckIconPickerOpen,
    setIsDeckIconPickerOpen,
    deckIconSearch,
    setDeckIconSearch,
    deckIconTab,
    setDeckIconTab,
    hoveredDeckEmoji,
    setHoveredDeckEmoji,
    deckIconPickerRef,
    deckChipsScrollRef,
    description,
    setDescription,
    selectedCategory,
    setSelectedCategory,
    customCategories,
    isAddingCustomCategory,
    setIsAddingCustomCategory,
    customCategoryInput,
    setCustomCategoryInput,
    selectedCategoryIcon,
    setSelectedCategoryIcon,
    isIconPickerOpen,
    setIsIconPickerOpen,
    iconSearch,
    setIconSearch,
    iconifyIcons,
    isIconifyLoading,
    iconPickerRef,
    handleAddCustomCategory,
    handleDeleteCustomCategory,
    tags,
    setTags,
    tagInput,
    setTagInput,
    coverMode,
    setCoverMode,
    coverBannerRef,
    setIsDraggingCover,
    coverDragStartRef,
    coverPosX,
    setCoverPosX,
    coverPosY,
    setCoverPosY,
    coverZoom,
    setCoverZoom,
    isDraggingCover,
    effectiveCoverUrl,
    aiDerivedTopic,
    isSearchingCovers,
    suggestedCovers,
    setSelectedCoverImage,
    coverSearchQuery,
    setCoverSearchQuery,
    handleSearchManualCovers,
    isSearchingManual,
    searchResults,
    customCoverInput,
    setCustomCoverInput,
    deriveCoverSearchTerms,
    setSuggestedCovers,
    visibility,
    setVisibility,
    saving,
    handleCreateDeck,
  };
}
