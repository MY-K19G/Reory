'use client';

import React from 'react';
import {
  User,
  Target,
  Sparkles,
  Camera,
  Upload,
  Check,
  AtSign,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Globe,
  Award,
  BookOpen,
} from 'lucide-react';
import { ALL_COUNTRIES } from '@/lib/countries';
import { UserAvatar, PRESET_AVATARS } from '@/components/UserAvatar';
import { PendingAccount } from './types';

interface OnboardingWizardProps {
  onboardingStep: 1 | 2;
  setOnboardingStep: (step: 1 | 2) => void;
  pendingAccount: PendingAccount | null;
  prefDisplayName: string;
  setPrefDisplayName: (v: string) => void;
  prefHandle: string;
  setPrefHandle: (v: string) => void;
  prefHandleError: string;
  isCheckingPrefHandle: boolean;
  setIsCheckingPrefHandle: (v: boolean) => void;
  isPrefHandleAvailable: boolean | null;
  prefAvatar: string;
  setPrefAvatar: (v: string) => void;
  prefAvatarTab: 'notionist' | 'disk';
  setPrefAvatarTab: (v: 'notionist' | 'disk') => void;
  prefFileInputRef: React.RefObject<HTMLInputElement | null>;
  handlePrefDiskUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefTargetLang: string;
  setPrefTargetLang: (v: string) => void;
  prefNativeLang: string;
  setPrefNativeLang: (v: string) => void;
  prefCountry: string;
  setPrefCountry: (v: string) => void;
  prefLevel: string;
  setPrefLevel: (v: string) => void;
  prefDailyGoal: number;
  setPrefDailyGoal: (v: number) => void;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
  isSubmitting: boolean;
  currentAccentPrimary: string;
  onCheckHandle: (handle: string, accountName: string) => Promise<boolean>;
  onSubmitPreferences: (e: React.FormEvent) => void;
}

export function OnboardingWizard({
  onboardingStep,
  setOnboardingStep,
  pendingAccount,
  prefDisplayName,
  setPrefDisplayName,
  prefHandle,
  setPrefHandle,
  prefHandleError,
  isCheckingPrefHandle,
  setIsCheckingPrefHandle,
  isPrefHandleAvailable,
  prefAvatar,
  setPrefAvatar,
  prefAvatarTab,
  setPrefAvatarTab,
  prefFileInputRef,
  handlePrefDiskUpload,
  prefTargetLang,
  setPrefTargetLang,
  prefNativeLang,
  setPrefNativeLang,
  prefCountry,
  setPrefCountry,
  prefLevel,
  setPrefLevel,
  prefDailyGoal,
  setPrefDailyGoal,
  errorMessage,
  setErrorMessage,
  isSubmitting,
  currentAccentPrimary,
  onCheckHandle,
  onSubmitPreferences,
}: OnboardingWizardProps) {
  return (
    <div className="space-y-3.5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-1">
        <div
          className="w-10 h-10 mx-auto rounded-2xl flex items-center justify-center text-white font-black text-base shadow-md ring-4 ring-black/5 dark:ring-white/5 transition-transform"
          style={{ backgroundColor: currentAccentPrimary }}
        >
          {onboardingStep === 1 ? <User className="w-5 h-5" /> : <Target className="w-5 h-5" />}
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {onboardingStep === 1
            ? `Welcome, ${prefDisplayName || pendingAccount?.displayName || 'Learner'}!`
            : 'Choose Languages & Goals'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {onboardingStep === 1
            ? 'Step 1 of 2: Pick your avatar and set your username.'
            : 'Step 2 of 2: Select your study languages, level, and daily target.'}
        </p>
      </div>

      {/* Step Navigation Pill Indicator */}
      <div className="flex items-center justify-center gap-2 pt-0.5 pb-0.5">
        <button
          type="button"
          onClick={() => setOnboardingStep(1)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            onboardingStep === 1
              ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-xs'
              : 'bg-slate-100 text-slate-600 dark:bg-[#202020] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#282828]'
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
              onboardingStep === 1
                ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black font-extrabold'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            1
          </span>
          <span>1. Choose Profile</span>
        </button>

        <div className="w-4 h-0.5 bg-slate-200 dark:bg-[#333]" />

        <button
          type="button"
          onClick={() => {
            if (!prefDisplayName.trim()) {
              setErrorMessage('Please enter your display name first.');
              return;
            }
            setErrorMessage('');
            setOnboardingStep(2);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            onboardingStep === 2
              ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-xs'
              : 'bg-slate-100 text-slate-600 dark:bg-[#202020] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#282828]'
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
              onboardingStep === 2
                ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black font-extrabold'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            2
          </span>
          <span>2. Languages &amp; Goals</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold text-center animate-shake">
          {errorMessage}
        </div>
      )}

      {/* STEP 1: CHOOSE PROFILE */}
      {onboardingStep === 1 ? (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-[#2a2a2a] space-y-3">
            {/* Selected Avatar Preview */}
            <div className="flex flex-col items-center justify-center gap-1.5 pt-0.5">
              <div className="relative">
                <UserAvatar
                  avatar={prefAvatar}
                  name={prefDisplayName || pendingAccount?.displayName || 'Learner'}
                  size="xl"
                  shape="rounded"
                  className="w-16 h-16 ring-3 ring-accent-primary/40 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent-primary text-white flex items-center justify-center shadow-xs">
                  <Camera className="w-2.5 h-2.5" />
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                  {prefDisplayName || 'Your Name'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  @{prefHandle || 'username'}
                </span>
              </div>
            </div>

            {/* Avatar Selection: Notionists vs From Disk */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 dark:bg-black/30 rounded-lg text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPrefAvatarTab('notionist')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                      prefAvatarTab === 'notionist'
                        ? 'bg-white dark:bg-[#252525] text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-accent-primary" />
                    <span>Notionists</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrefAvatarTab('disk')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                      prefAvatarTab === 'disk'
                        ? 'bg-white dark:bg-[#252525] text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Upload className="w-3 h-3 text-emerald-500" />
                    <span>From Disk</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-400">
                  {prefAvatarTab === 'notionist' ? 'Illustrations' : 'Local file'}
                </span>
              </div>

              {prefAvatarTab === 'notionist' ? (
                <div className="max-h-28 sm:max-h-32 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden grid grid-cols-6 sm:grid-cols-8 gap-1.5 p-1.5 rounded-xl bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-[#262626]">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrefAvatar(url)}
                      className={`aspect-square rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer ring-offset-1 dark:ring-offset-[#121212] ${
                        prefAvatar === url
                          ? 'ring-2 ring-accent-primary scale-105 shadow-sm'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input
                    ref={prefFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePrefDiskUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => prefFileInputRef.current?.click()}
                    className="p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-accent-primary bg-white/60 dark:bg-black/30 hover:bg-accent-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 text-center group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Click to choose image from disk
                    </span>
                    <span className="text-[10px] text-slate-400">
                      PNG, JPG, SVG, WebP (max 5MB)
                    </span>
                  </div>

                  {prefAvatar.startsWith('data:image/') && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                      <span className="text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Custom image loaded from disk
                      </span>
                      <button
                        type="button"
                        onClick={() => setPrefAvatar(PRESET_AVATARS[0])}
                        className="text-[11px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
                      >
                        Reset to Notionist
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Display Name & Handle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-accent-primary" />
                  <span>Display Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={prefDisplayName}
                  onChange={(e) => setPrefDisplayName(e.target.value)}
                  placeholder="e.g. Janet"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#2e2e2e] bg-white dark:bg-[#121212] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all font-medium"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <AtSign className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Handle</span>
                  </label>
                  {isCheckingPrefHandle ? (
                    <span className="text-[10px] text-cyan-500 font-semibold flex items-center gap-1 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> Checking...
                    </span>
                  ) : isPrefHandleAvailable === true && !prefHandleError ? (
                    <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Available
                    </span>
                  ) : null}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">@</span>
                  <input
                    type="text"
                    required
                    value={prefHandle}
                    onChange={(e) => setPrefHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                    placeholder="username"
                    className={`w-full pl-7 pr-8 py-2.5 rounded-xl border bg-white dark:bg-[#121212] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all font-mono ${
                      prefHandleError
                        ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                        : isPrefHandleAvailable === true
                          ? 'border-emerald-500/60 focus:border-emerald-500'
                          : 'border-slate-200 dark:border-[#2e2e2e] focus:ring-2 focus:ring-accent-primary'
                    }`}
                  />
                  {prefHandleError && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500" title={prefHandleError}>
                      <AlertCircle className="w-4 h-4" />
                    </span>
                  )}
                </div>
                {prefHandleError && (
                  <p className="text-[11px] font-semibold text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1 animate-in fade-in">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {prefHandleError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Next Step Button */}
          <button
            type="button"
            disabled={isCheckingPrefHandle || !!prefHandleError}
            onClick={async () => {
              if (!prefDisplayName.trim()) {
                setErrorMessage('Please enter a display name before proceeding.');
                return;
              }
              const clean = prefHandle.replace(/^@/, '').trim();
              if (clean) {
                setIsCheckingPrefHandle(true);
                try {
                  const ok = await onCheckHandle(clean, pendingAccount?.username || '');
                  if (!ok) return;
                } finally {
                  setIsCheckingPrefHandle(false);
                }
              }
              setErrorMessage('');
              setOnboardingStep(2);
            }}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
            style={{ backgroundColor: currentAccentPrimary }}
          >
            {isCheckingPrefHandle ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying handle...</span>
              </>
            ) : (
              <>
                <span>Next: Choose Languages &amp; Goals</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      ) : (
        /* STEP 2: CHOOSE LANGUAGES & OTHER OPTIONS */
        <form onSubmit={onSubmitPreferences} className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Language to Learn */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-accent-primary" />
                <span>Language to Learn</span>
              </label>
              <select
                value={prefTargetLang}
                onChange={(e) => setPrefTargetLang(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#2e2e2e] bg-slate-50 dark:bg-[#202020] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-primary cursor-pointer"
              >
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
                <option value="English">English</option>
                <option value="Italian">Italian</option>
                <option value="Russian">Russian</option>
              </select>
            </div>

            {/* Native Language */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>Native Language</span>
              </label>
              <select
                value={prefNativeLang}
                onChange={(e) => setPrefNativeLang(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#2e2e2e] bg-slate-50 dark:bg-[#202020] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-primary cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Arabic">Arabic</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Current Proficiency */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Current Level</span>
              </label>
              <select
                value={prefLevel}
                onChange={(e) => setPrefLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#2e2e2e] bg-slate-50 dark:bg-[#202020] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-primary cursor-pointer"
              >
                <option value="Beginner">Beginner (Starting fresh)</option>
                <option value="Elementary">Elementary (A1 - A2)</option>
                <option value="Intermediate">Intermediate (B1 - B2)</option>
                <option value="Advanced">Advanced (C1 - Fluent)</option>
              </select>
            </div>

            {/* Location / Country */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                <span>Country</span>
              </label>
              <select
                value={prefCountry}
                onChange={(e) => setPrefCountry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#2e2e2e] bg-slate-50 dark:bg-[#202020] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-primary cursor-pointer"
              >
                {ALL_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Daily Goal Cards */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-accent-primary" />
                <span>Daily Study Goal</span>
              </label>
              <span className="text-xs font-black text-accent-primary">
                {prefDailyGoal} cards/day
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 30].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setPrefDailyGoal(goal)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    prefDailyGoal === goal
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white shadow-xs'
                      : 'bg-slate-50 dark:bg-[#202020] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#2e2e2e] hover:border-slate-400'
                  }`}
                >
                  {goal} cards
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                setErrorMessage('');
                setOnboardingStep(1);
              }}
              className="px-4 py-3.5 rounded-xl font-bold text-xs sm:text-sm border border-slate-200 dark:border-[#2e2e2e] hover:bg-slate-100 dark:hover:bg-[#222] text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              style={{ backgroundColor: currentAccentPrimary }}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Complete Profile &amp; Start Learning</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
