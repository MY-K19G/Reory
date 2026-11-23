'use client';

import { useState, useEffect, useRef } from 'react';
import { WordDetails } from '@/lib/types';
import { speakWord, updateCardImageByWord } from '@/lib/api';
import { ALL_GEMINI_LANGUAGES } from '@/lib/languages';
import { useI18n } from '@/lib/i18n';
import { ChevronDown, Shuffle, Sparkles, BookOpen } from 'lucide-react';
import { WordHeroCard } from './word-breakdown/WordHeroCard';
import { WordDetailsAccordion } from './word-breakdown/WordDetailsAccordion';
import { WordQuizSection } from './word-breakdown/WordQuizSection';
import { QuickNavSidebar } from './word-breakdown/QuickNavSidebar';
import { WordImageViewerModal } from './word-breakdown/WordImageViewerModal';
import { WordNoteModal } from './word-breakdown/WordNoteModal';
import { ChangeWordImageModal } from './word-breakdown/ChangeWordImageModal';

interface WordTreeBreakdownProps {
  details: WordDetails;
  targetLanguage: string;
  nativeLanguage: string;
  isWordOfTheDay?: boolean;
  onSave?: () => void;
  saving?: boolean;
  onBackToSearch?: () => void;
  onSelectLanguage?: (lang: string) => void;
  showActionButtons?: boolean;
  cardId?: number | string;
  onImageUpdated?: (newImageUrl: string) => void;
}

export function WordTreeBreakdown({
  details,
  targetLanguage,
  nativeLanguage,
  isWordOfTheDay,
  onSave,
  saving,
  onBackToSearch,
  showActionButtons = false,
  cardId,
  onImageUpdated,
}: WordTreeBreakdownProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'meaning' | 'examples' | 'grammar' | 'more'>('meaning');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [topMoreOpen, setTopMoreOpen] = useState(false);
  const [sideMoreOpen, setSideMoreOpen] = useState(false);
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isChangeImageModalOpen, setIsChangeImageModalOpen] = useState(false);
  const [customHeroImage, setCustomHeroImage] = useState<string>('');

  useEffect(() => {
    // If inside a deck with a cardId, check card-specific image override first
    if (cardId) {
      const cardSpecificImg = typeof window !== 'undefined' ? localStorage.getItem(`duocard_card_img_${cardId}`) : null;
      if (cardSpecificImg) {
        setCustomHeroImage(cardSpecificImg);
        return;
      }
    }

    // Next check draft search/word image override from localStorage
    if (typeof window !== 'undefined' && details?.word) {
      const draftImg =
        localStorage.getItem(`duocard_draft_image_${details.word.toLowerCase()}`) ||
        localStorage.getItem(`duocard_word_image_${details.word.toLowerCase()}`);
      if (draftImg) {
        setCustomHeroImage(draftImg);
        return;
      }
    }

    // Then check if the details already come from the database or API card
    const dbImage = details?.pexelsPhotos?.[0]?.src || details?.images?.[0];
    if (dbImage) {
      setCustomHeroImage(dbImage);
      return;
    }

    setCustomHeroImage('');
  }, [cardId, details?.word, details?.pexelsPhotos, details?.images]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [deckDropdownOpen, setDeckDropdownOpen] = useState(false);
  const [prevWord, setPrevWord] = useState(details.word);
  if (prevWord !== details.word) {
    setPrevWord(details.word);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setIsSaved(false);
  }
  const [cardNote, setCardNote] = useState(() => {
    if (typeof window !== 'undefined' && details?.word) {
      return localStorage.getItem(`duocard_word_note_${details.word.toLowerCase()}`) || '';
    }
    return '';
  });
  const deckDropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown container refs for outside-click detection
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const sideMoreDropdownRef = useRef<HTMLDivElement>(null);
  const actionsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (moreDropdownRef.current && !moreDropdownRef.current.contains(target)) {
        setTopMoreOpen(false);
      }

      if (sideMoreDropdownRef.current && !sideMoreDropdownRef.current.contains(target)) {
        setSideMoreOpen(false);
      }

      if (actionsDropdownRef.current && !actionsDropdownRef.current.contains(target)) {
        setActionsDropdownOpen(false);
      }

      if (deckDropdownRef.current && !deckDropdownRef.current.contains(target)) {
        setDeckDropdownOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setTopMoreOpen(false);
        setSideMoreOpen(false);
        setActionsDropdownOpen(false);
        setDeckDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Close image viewer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageViewerOpen(false);
      }
    };
    if (isImageViewerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageViewerOpen]);

  // Container ref to find nearest scrollable parent (e.g. inside WordIntelligenceModal or main page)
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to find the active scrollable ancestor
  const getScrollContainer = () => {
    let el = containerRef.current?.parentElement;
    while (el) {
      const overflowY = window.getComputedStyle(el).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') {
        return el;
      }
      el = el.parentElement;
    }
    return document.querySelector('main') || null;
  };

  // Monitor scroll position on the actual scrollable container (modal body or page)
  useEffect(() => {
    const scrollContainer = getScrollContainer();
    const handleScroll = () => {
      const scrollPos = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      setIsScrolled(scrollPos > 180);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Accordion toggle states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    simpleMeaning: true,
    translation: true,
    exampleSentences: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const scrollToSection = (sectionId: string, tab: 'meaning' | 'examples' | 'grammar' | 'more') => {
    setActiveTab(tab);
    setTopMoreOpen(false);
    setSideMoreOpen(false);

    // If section was collapsed, ensure it's open
    if (sectionId === 'section-meaning') {
      setOpenSections((prev) => ({ ...prev, simpleMeaning: true, translation: true }));
    } else if (sectionId === 'section-examples') {
      setOpenSections((prev) => ({ ...prev, exampleSentences: true }));
    }

    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const scrollToTop = () => {
    const scrollContainer = getScrollContainer();
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Scroll spy: update activeTab when user scrolls through sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === 'section-meaning' || id === 'section-translation') {
              setActiveTab('meaning');
            } else if (id === 'section-examples') {
              setActiveTab('examples');
            } else if (id === 'section-grammar') {
              setActiveTab('grammar');
            } else if (
              id === 'section-more' ||
              id === 'section-synonyms' ||
              id === 'section-ai-explanation' ||
              id === 'section-quiz'
            ) {
              setActiveTab('more');
            }
          }
        });
      },
      { rootMargin: '-20% 0px -50% 0px', threshold: 0.1 }
    );

    const sections = ['section-meaning', 'section-examples', 'section-grammar', 'section-more'];
    sections.forEach((s) => {
      const el = document.getElementById(s);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [details.word]);

  const targetLangObj = ALL_GEMINI_LANGUAGES.find(
    (l) => l.name.toLowerCase() === targetLanguage.toLowerCase()
  );
  const nativeLangObj = ALL_GEMINI_LANGUAGES.find(
    (l) => l.name.toLowerCase() === nativeLanguage.toLowerCase()
  );

  const handlePronounce = (text?: string, langCode?: string) => {
    speakWord(text || details.word, langCode || targetLangObj?.code || 'en');
  };

  const handleCopyWord = () => {
    navigator.clipboard.writeText(details.word);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `"${details.word}" (${details.pronunciation || ''}): ${details.simpleMeaning || details.meaning}`
    );
    setShared(true);
    setTimeout(() => setShared(false), 1800);
  };

  // Dynamic translation derived directly from word intelligence & selected native language
  const currentTranslation = {
    main: details.translation || details.simpleMeaning || details.meaning || details.word,
    sub:
      details.simpleMeaning && details.simpleMeaning !== details.translation
        ? details.simpleMeaning
        : details.pronunciation || '',
    country: nativeLangObj?.countryCode || 'UN',
  };

  const heroImage =
    customHeroImage ||
    details.pexelsPhotos?.[0]?.src ||
    details.images?.[0] ||
    '/serenity-card.jpg';

  const handleSelectNewImage = async (newImageUrl: string) => {
    setCustomHeroImage(newImageUrl);
    if (onImageUpdated) {
      onImageUpdated(newImageUrl);
    }

    if (details) {
      details.images = [newImageUrl, ...(details.images || [])];
      if (details.pexelsPhotos && details.pexelsPhotos.length > 0) {
        details.pexelsPhotos = [
          { ...details.pexelsPhotos[0], src: newImageUrl },
          ...details.pexelsPhotos.slice(1),
        ];
      }
    }

    if (cardId) {
      // 1. Specific to this saved deck card
      if (typeof window !== 'undefined') {
        localStorage.setItem(`duocard_card_img_${cardId}`, newImageUrl);
      }
      try {
        const { updateCard } = await import('@/lib/api');
        await updateCard(cardId, { imageUrl: newImageUrl });
      } catch (err) {
        console.warn('Could not update card in database:', err);
      }
    } else {
      // 2. Draft for /decks/new search preview and saving to deck
      if (typeof window !== 'undefined' && details?.word) {
        const wordKey = details.word.toLowerCase();
        localStorage.setItem(`duocard_draft_image_${wordKey}`, newImageUrl);
        localStorage.setItem(`duocard_word_image_${wordKey}`, newImageUrl);
      }
    }
  };

  const handleResetImage = async () => {
    setCustomHeroImage('');

    if (cardId) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`duocard_card_img_${cardId}`);
      }
      try {
        const { updateCard } = await import('@/lib/api');
        const defaultFallback = details.pexelsPhotos?.[0]?.src || details.images?.[0] || '';
        await updateCard(cardId, { imageUrl: defaultFallback });
        if (onImageUpdated) onImageUpdated(defaultFallback);
      } catch (err) {
        console.warn('Could not reset card image in database:', err);
      }
    } else {
      if (typeof window !== 'undefined' && details?.word) {
        const wordKey = details.word.toLowerCase();
        localStorage.removeItem(`duocard_draft_image_${wordKey}`);
        localStorage.removeItem(`duocard_word_image_${wordKey}`);
      }
      const defaultFallback = details.pexelsPhotos?.[0]?.src || details.images?.[0] || '';
      if (onImageUpdated) {
        onImageUpdated(defaultFallback);
      }
    }
  };

  const defaultBaseImage = details.pexelsPhotos?.[0]?.src || details.images?.[0] || '';
  const hasCustomImage = Boolean(customHeroImage && defaultBaseImage && customHeroImage !== defaultBaseImage);

  return (
    <div ref={containerRef} className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* 1. HERO WORD CARD */}
      <WordHeroCard
        details={details}
        targetLanguage={targetLanguage}
        isWordOfTheDay={isWordOfTheDay}
        heroImage={heroImage}
        isSaved={isSaved}
        saving={saving}
        copied={copied}
        shared={shared}
        deckDropdownOpen={deckDropdownOpen}
        actionsDropdownOpen={actionsDropdownOpen}
        deckDropdownRef={deckDropdownRef}
        actionsDropdownRef={actionsDropdownRef}
        onPronounce={handlePronounce}
        onSave={() => {
          if (onSave) onSave();
          setIsSaved(true);
        }}
        onShare={handleShare}
        onCopyWord={handleCopyWord}
        onToggleDeckDropdown={() => setDeckDropdownOpen(!deckDropdownOpen)}
        onToggleActionsDropdown={() => setActionsDropdownOpen(!actionsDropdownOpen)}
        onOpenNoteModal={() => {
          setDeckDropdownOpen(false);
          setIsNoteModalOpen(true);
        }}
        onOpenImageViewer={() => setIsImageViewerOpen(true)}
        onBackToSearch={onBackToSearch}
        onToggleBookmark={() => {
          if (onSave) onSave();
          setIsSaved(!isSaved);
        }}
        showActionButtons={showActionButtons}
        onChangeImage={() => setIsChangeImageModalOpen(true)}
        onResetImage={handleResetImage}
        hasCustomImage={hasCustomImage}
      />

      {/* 2. TAB NAVIGATION BAR */}
      <div className="flex items-center gap-1 sm:gap-2 px-1 py-1.5 transition-all">
        <button
          type="button"
          onClick={() => scrollToSection('section-meaning', 'meaning')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'meaning'
              ? 'bg-accent-primary/15 dark:bg-[#272727] text-accent-primary dark:text-white shadow-2xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
          }`}
        >
          {t('meaning')}
        </button>

        <button
          type="button"
          onClick={() => scrollToSection('section-examples', 'examples')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'examples'
              ? 'bg-accent-primary/15 dark:bg-[#272727] text-accent-primary dark:text-white shadow-2xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
          }`}
        >
          {t('examples')}
        </button>

        <button
          type="button"
          onClick={() => scrollToSection('section-grammar', 'grammar')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'grammar'
              ? 'bg-accent-primary/15 dark:bg-[#272727] text-accent-primary dark:text-white shadow-2xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
          }`}
        >
          {t('grammar')}
        </button>

        {/* More dropdown */}
        <div className="relative" ref={moreDropdownRef}>
          <button
            type="button"
            onClick={() => setTopMoreOpen(!topMoreOpen)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'more'
                ? 'bg-accent-primary/15 dark:bg-[#272727] text-accent-primary dark:text-white shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <span>{t('more')}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {topMoreOpen && (
            <div className="absolute left-0 mt-1.5 w-48 bg-white dark:bg-[#282828] rounded-2xl shadow-xl border border-slate-100 dark:border-[#383838] py-1.5 z-30 animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={() => scrollToSection('section-synonyms', 'more')}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5 text-indigo-500 dark:text-[#f59e7e]" />
                Synonyms & Antonyms
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('section-ai-explanation', 'more')}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                AI Deep Explanation
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('section-quiz', 'more')}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                Spaced Repetition Quiz
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. SIDEBAR QUICK NAVIGATION */}
      <QuickNavSidebar
        isScrolled={isScrolled}
        activeTab={activeTab}
        sideMoreOpen={sideMoreOpen}
        sideMoreDropdownRef={sideMoreDropdownRef}
        onToggleSideMore={() => {
          setSideMoreOpen(!sideMoreOpen);
          setTopMoreOpen(false);
        }}
        onScrollToSection={scrollToSection}
        onScrollToTop={scrollToTop}
      />

      {/* 4. STACKED ACCORDION CARDS */}
      <WordDetailsAccordion
        details={details}
        targetLanguage={targetLanguage}
        nativeLangCode={nativeLangObj?.code || 'en'}
        openSections={openSections}
        currentTranslation={currentTranslation}
        onToggleSection={toggleSection}
        onPronounce={handlePronounce}
      />

      {/* 5. MEMORY QUIZ CHECKPOINT */}
      {details.quiz && (
        <WordQuizSection
          quiz={details.quiz}
          selectedOption={selectedQuizOption}
          quizSubmitted={quizSubmitted}
          onSelectOption={(opt) => {
            setSelectedQuizOption(opt);
            setQuizSubmitted(true);
          }}
          onResetQuiz={() => {
            setSelectedQuizOption(null);
            setQuizSubmitted(false);
          }}
        />
      )}

      {/* 6. FULLSCREEN LIGHTBOX MODAL */}
      <WordImageViewerModal
        isOpen={isImageViewerOpen}
        imageSrc={heroImage}
        word={details.word}
        caption={details.pexelsPhotos?.[0]?.alt}
        photographer={details.pexelsPhotos?.[0]?.photographer}
        photographerUrl={details.pexelsPhotos?.[0]?.photographerUrl}
        isSaved={isSaved}
        onClose={() => setIsImageViewerOpen(false)}
        onToggleSave={() => {
          if (onSave) onSave();
          setIsSaved(!isSaved);
        }}
      />

      {/* 7. NOTE CREATION MODAL */}
      <WordNoteModal
        isOpen={isNoteModalOpen}
        word={details.word}
        note={cardNote}
        onChangeNote={setCardNote}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={() => {
          if (details?.word) {
            localStorage.setItem(`duocard_word_note_${details.word.toLowerCase()}`, cardNote);
          }
          setIsNoteModalOpen(false);
          if (onSave) onSave();
        }}
      />

      {/* 8. CHANGE CONTEXTUAL IMAGE MODAL */}
      <ChangeWordImageModal
        isOpen={isChangeImageModalOpen}
        onClose={() => setIsChangeImageModalOpen(false)}
        word={details.word}
        currentImage={heroImage}
        onSelectImage={handleSelectNewImage}
        onResetImage={handleResetImage}
        hasCustomImage={hasCustomImage}
      />
    </div>
  );
}
