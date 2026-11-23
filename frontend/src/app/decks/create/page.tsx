'use client';

import { Suspense } from 'react';
import { useTheme } from '@/lib/theme';
import { fetchPexelsPhotos } from '@/lib/pexelsService';
import { LanguageSelectorStep } from './LanguageSelectorStep';
import { DeckDetailsStep } from './DeckDetailsStep';
import { DeckCoverStep } from './DeckCoverStep';
import { DeckVisibilityStep } from './DeckVisibilityStep';
import { DeckCreateHero } from './DeckCreateHero';
import { useCreateDeckForm } from './hooks/useCreateDeckForm';

function CreateDeckContent() {
  const { currentAccent } = useTheme();
  const form = useCreateDeckForm();

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 bg-[#f5f7fb] dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HERO BANNER */}
        <DeckCreateHero />

        {/* STEP 1: Choose Languages */}
        <LanguageSelectorStep
          targetLang={form.targetLang}
          nativeLang={form.nativeLang}
          targetDropdownOpen={form.targetDropdownOpen}
          setTargetDropdownOpen={form.setTargetDropdownOpen}
          nativeDropdownOpen={form.nativeDropdownOpen}
          setNativeDropdownOpen={form.setNativeDropdownOpen}
          targetSearch={form.targetSearch}
          setTargetSearch={form.setTargetSearch}
          nativeSearch={form.nativeSearch}
          setNativeSearch={form.setNativeSearch}
          targetDropdownRef={form.targetDropdownRef}
          nativeDropdownRef={form.nativeDropdownRef}
          filteredTargetLangs={form.filteredTargetLangs}
          filteredNativeLangs={form.filteredNativeLangs}
          handleSelectTargetLang={form.handleSelectTargetLang}
          handleSelectNativeLang={form.handleSelectNativeLang}
          handleSwapLanguages={form.handleSwapLanguages}
          languageError={form.languageError}
        />

        {/* STEP 2: Deck Details */}
        <DeckDetailsStep
          deckName={form.deckName}
          setDeckName={form.setDeckName}
          deckIcon={form.deckIcon}
          setDeckIcon={form.setDeckIcon}
          isDeckIconPickerOpen={form.isDeckIconPickerOpen}
          setIsDeckIconPickerOpen={form.setIsDeckIconPickerOpen}
          deckIconSearch={form.deckIconSearch}
          setDeckIconSearch={form.setDeckIconSearch}
          deckIconTab={form.deckIconTab}
          setDeckIconTab={form.setDeckIconTab}
          hoveredDeckEmoji={form.hoveredDeckEmoji}
          setHoveredDeckEmoji={form.setHoveredDeckEmoji}
          deckIconPickerRef={form.deckIconPickerRef}
          deckChipsScrollRef={form.deckChipsScrollRef}
          description={form.description}
          setDescription={form.setDescription}
          selectedCategory={form.selectedCategory}
          setSelectedCategory={form.setSelectedCategory}
          customCategories={form.customCategories}
          isAddingCustomCategory={form.isAddingCustomCategory}
          setIsAddingCustomCategory={form.setIsAddingCustomCategory}
          customCategoryInput={form.customCategoryInput}
          setCustomCategoryInput={form.setCustomCategoryInput}
          selectedCategoryIcon={form.selectedCategoryIcon}
          setSelectedCategoryIcon={form.setSelectedCategoryIcon}
          isIconPickerOpen={form.isIconPickerOpen}
          setIsIconPickerOpen={form.setIsIconPickerOpen}
          iconSearch={form.iconSearch}
          setIconSearch={form.setIconSearch}
          iconifyIcons={form.iconifyIcons}
          isIconifyLoading={form.isIconifyLoading}
          iconPickerRef={form.iconPickerRef}
          handleAddCustomCategory={form.handleAddCustomCategory}
          handleDeleteCustomCategory={form.handleDeleteCustomCategory}
          tags={form.tags}
          setTags={form.setTags}
          tagInput={form.tagInput}
          setTagInput={form.setTagInput}
          currentAccent={currentAccent}
        />

        {/* STEP 3: Deck Cover Image */}
        <DeckCoverStep
          coverMode={form.coverMode}
          setCoverMode={form.setCoverMode}
          coverBannerRef={form.coverBannerRef}
          setIsDraggingCover={form.setIsDraggingCover}
          coverDragStartRef={form.coverDragStartRef}
          coverPosX={form.coverPosX}
          coverPosY={form.coverPosY}
          setCoverPosX={form.setCoverPosX}
          setCoverPosY={form.setCoverPosY}
          coverZoom={form.coverZoom}
          setCoverZoom={form.setCoverZoom}
          isDraggingCover={form.isDraggingCover}
          effectiveCoverUrl={form.effectiveCoverUrl}
          aiDerivedTopic={form.aiDerivedTopic}
          targetLangName={form.targetLang.name}
          isSearchingCovers={form.isSearchingCovers}
          deckName={form.deckName}
          description={form.description}
          suggestedCovers={form.suggestedCovers}
          setSelectedCoverImage={form.setSelectedCoverImage}
          coverSearchQuery={form.coverSearchQuery}
          setCoverSearchQuery={form.setCoverSearchQuery}
          handleSearchManualCovers={form.handleSearchManualCovers}
          isSearchingManual={form.isSearchingManual}
          searchResults={form.searchResults}
          customCoverInput={form.customCoverInput}
          setCustomCoverInput={form.setCustomCoverInput}
          onRefreshAutoCover={async () => {
            const derived = form.deriveCoverSearchTerms();
            try {
              const photos = await fetchPexelsPhotos(`${derived} landscape`, undefined, 8);
              if (photos && photos.length > 0) {
                const randIdx = Math.floor(Math.random() * photos.length);
                const chosen = photos[randIdx];
                const newUrl = chosen.src.large2x || chosen.src.large || chosen.src.medium;
                form.setSelectedCoverImage(newUrl);
                form.setSuggestedCovers(
                  photos.map((p) => ({
                    id: `pexels-${p.id}`,
                    url: p.src.large2x || p.src.large || p.src.medium,
                    title: p.alt || derived,
                    photographer: p.photographer,
                  }))
                );
              }
            } catch (err) {
              console.warn('Refresh auto cover note:', err);
            }
          }}
        />

        {/* STEP 4: Visibility & Actions */}
        <DeckVisibilityStep
          visibility={form.visibility}
          setVisibility={form.setVisibility}
          saving={form.saving}
          isEditing={form.isEditing}
          onCancel={() => form.router.push('/my-cards')}
          onSubmit={form.handleCreateDeck}
        />
      </div>
    </div>
  );
}

export default function CreateDeckPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <CreateDeckContent />
    </Suspense>
  );
}
