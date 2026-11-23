'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, AtSign, MapPin, Sparkles, Check, Image as Camera, AlertCircle, Loader2 } from 'lucide-react';
import { ALL_COUNTRIES } from '@/lib/countries';
import { FlagIcon } from '@/components/FlagIcon';
import { UserAvatar, isFakeAvatar, PRESET_AVATARS } from '@/components/UserAvatar';
import { apiCheckHandle, apiSavePreferences } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import { ProfileAvatarPicker } from './ProfileAvatarPicker';

const DUMMY_NAMES = ['Verizon Kert', 'Learner', 'Alex Morgan'];
const DUMMY_HANDLES = ['verizon', 'learner'];
const DUMMY_EMAILS = ['verizon.kert@polyglot.io'];
const DUMMY_BIOS = ['Consistent steps toward fluency.', 'Small steps. Big fluency.'];

function getInitialProfileData(userName: string, userEmail: string) {
  if (typeof window === 'undefined') {
    return { name: userName || '', handle: '', email: userEmail || '', bio: '', country: '', avatar: PRESET_AVATARS[0] };
  }
  try {
    const curName = localStorage.getItem('duocard_username');
    if (curName && DUMMY_NAMES.includes(curName)) localStorage.removeItem('duocard_username');
    const curReoryName = localStorage.getItem('duocard_user_name');
    if (curReoryName && DUMMY_NAMES.includes(curReoryName)) localStorage.removeItem('duocard_user_name');
    const curHandle = localStorage.getItem('duocard_handle');
    if (curHandle && DUMMY_HANDLES.includes(curHandle.toLowerCase())) localStorage.removeItem('duocard_handle');
    const curEmail = localStorage.getItem('duocard_email');
    if (curEmail && DUMMY_EMAILS.includes(curEmail.toLowerCase())) localStorage.removeItem('duocard_email');
    const curBio = localStorage.getItem('duocard_bio');
    if (curBio && DUMMY_BIOS.includes(curBio)) localStorage.removeItem('duocard_bio');

    const savedName = localStorage.getItem('duocard_username') || localStorage.getItem('duocard_user_name');
    const initialName = savedName && !DUMMY_NAMES.includes(savedName) ? savedName : (userName && !DUMMY_NAMES.includes(userName) ? userName : '');

    const savedHandle = localStorage.getItem('duocard_handle');
    const initialHandle = savedHandle && !DUMMY_HANDLES.includes(savedHandle.toLowerCase()) ? savedHandle : '';

    const savedEmail = localStorage.getItem('duocard_email') || localStorage.getItem('duocard_user_email');
    const initialEmail = savedEmail && !DUMMY_EMAILS.includes(savedEmail.toLowerCase()) ? savedEmail : (userEmail && !DUMMY_EMAILS.includes(userEmail.toLowerCase()) ? userEmail : '');

    const savedBio = localStorage.getItem('duocard_bio');
    const initialBio = savedBio && !DUMMY_BIOS.includes(savedBio) ? savedBio : '';

    const savedCountry = localStorage.getItem('duocard_country') || '';

    const savedAvatar = localStorage.getItem('duocard_avatar');
    const initialAvatar = savedAvatar && !isFakeAvatar(savedAvatar) ? savedAvatar : PRESET_AVATARS[0];

    return {
      name: initialName,
      handle: initialHandle,
      email: initialEmail,
      bio: initialBio,
      country: savedCountry,
      avatar: initialAvatar,
    };
  } catch {
    return { name: userName || '', handle: '', email: userEmail || '', bio: '', country: '', avatar: PRESET_AVATARS[0] };
  }
}

interface ProfileModalProps {
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  onClose,
}) => {
  const { t } = useI18n();
  const [initialData] = useState(() => getInitialProfileData(userName, userEmail));

  const [name, setName] = useState(initialData.name);
  const [handle, setHandle] = useState(initialData.handle);
  const [handleError, setHandleError] = useState('');
  const [isCheckingHandle, setIsCheckingHandle] = useState(false);
  const [isHandleAvailable, setIsHandleAvailable] = useState<boolean | null>(null);
  const [email, setEmail] = useState(initialData.email);
  const [bio, setBio] = useState(initialData.bio);
  const [country, setCountry] = useState(initialData.country);
  const [avatar, setAvatar] = useState(initialData.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(true);
  const [avatarTab, setAvatarTab] = useState<'notionist' | 'disk' | 'url'>('notionist');
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Real-time handle verification against database
  useEffect(() => {
    const timer = setTimeout(async () => {
      const clean = handle.replace(/^@/, '').trim();
      if (!clean) {
        setHandleError('');
        setIsHandleAvailable(null);
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(clean)) {
        setHandleError('Handle can only contain letters, numbers, and underscores');
        setIsHandleAvailable(false);
        return;
      }

      setIsCheckingHandle(true);
      const currentIdentifier = localStorage.getItem('duocard_username') || userName || '';
      try {
        const res = await apiCheckHandle(clean, currentIdentifier);
        if (!res.available) {
          setHandleError(res.error || `Handle @${clean} is already taken in the database.`);
          setIsHandleAvailable(false);
        } else {
          setHandleError('');
          setIsHandleAvailable(true);
        }
      } catch {
        setHandleError('');
        setIsHandleAvailable(true);
      } finally {
        setIsCheckingHandle(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [handle, userName]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Display name is required.');
      return;
    }
    if (email.trim() && !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const cleanHandle = handle.trim().replace(/^@/, '');
    if (cleanHandle) {
      if (!/^[a-zA-Z0-9_]+$/.test(cleanHandle)) {
        setHandleError('Handle can only contain letters, numbers, and underscores');
        return;
      }
      if (handleError) {
        setErrorMsg(handleError);
        return;
      }

      setIsSubmitting(true);
      const currentIdentifier = localStorage.getItem('duocard_username') || userName || '';
      try {
        const check = await apiCheckHandle(cleanHandle, currentIdentifier);
        if (!check.available) {
          const msg = check.error || `Handle @${cleanHandle} is already taken in the database.`;
          setHandleError(msg);
          setIsHandleAvailable(false);
          setIsSubmitting(false);
          return;
        }
      } catch {
        // network issue, proceed
      }
    }

    try {
      setIsSubmitting(true);
      const candidateAvatar = (customAvatarUrl.trim() || avatar).trim();
      const finalAvatar = isFakeAvatar(candidateAvatar) ? '' : candidateAvatar;
      const currentIdentifier = localStorage.getItem('duocard_username') || userName || '';

      // Save preferences & handle to backend database
      try {
        await apiSavePreferences({
          usernameOrEmail: currentIdentifier,
          displayName: name.trim(),
          handle: cleanHandle,
          avatar: finalAvatar,
          country: country || undefined,
          bio: bio.trim() || undefined,
        });
      } catch (backendErr) {
        console.warn('Backend save notice:', backendErr);
      }

      localStorage.setItem('duocard_username', name.trim());
      localStorage.setItem('duocard_user_name', name.trim());
      localStorage.setItem('duocard_handle', cleanHandle);
      localStorage.setItem('duocard_email', email.trim());
      localStorage.setItem('duocard_user_email', email.trim());
      localStorage.setItem('duocard_bio', bio.trim());
      if (country) {
        localStorage.setItem('duocard_country', country);
      } else {
        localStorage.removeItem('duocard_country');
      }
      if (finalAvatar) {
        localStorage.setItem('duocard_avatar', finalAvatar);
      } else {
        localStorage.removeItem('duocard_avatar');
      }

      setUserName(name.trim());
      setUserEmail(email.trim());
      setIsSaved(true);
      setErrorMsg('');

      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 900);
    } catch {
      setErrorMsg('Failed to save profile changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCountryItem = country
    ? ALL_COUNTRIES.find((c) => c.name.toLowerCase() === country.toLowerCase())
    : null;

  return (
    <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Toast message if saved */}
      {isSaved && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          {t('profileUpdated')}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Profile Header & Avatar Card */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/5 flex items-center gap-4">
        <div className="relative group shrink-0">
          <UserAvatar
            avatar={customAvatarUrl.trim() || avatar}
            name={name}
            size="2xl"
            shape="rounded"
            className="w-14 h-14 ring-2 ring-cyan-500/30 shadow-md"
          />
          <button
            type="button"
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center hover:bg-cyan-400 shadow cursor-pointer transition-transform group-hover:scale-110"
            title="Change Avatar"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`text-sm font-bold truncate ${name ? 'text-slate-900 dark:text-white' : 'text-slate-400 italic'}`}>
              {name || 'Your Name'}
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {t('activeLearner')}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate">
            {handle ? `@${handle.replace(/^@/, '')}` : '@username'}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
            {selectedCountryItem ? (
              <>
                <FlagIcon code={selectedCountryItem.code} size="sm" />
                <span>{country}</span>
              </>
            ) : (
              <span className="text-slate-500 italic">{t('noCountrySelected')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Picker Drawer with Notionists Style and From Disk Options */}
      {showAvatarPicker && (
        <ProfileAvatarPicker
          avatar={avatar}
          setAvatar={setAvatar}
          customAvatarUrl={customAvatarUrl}
          setCustomAvatarUrl={setCustomAvatarUrl}
          avatarTab={avatarTab}
          setAvatarTab={setAvatarTab}
          setErrorMsg={setErrorMsg}
        />
      )}

      {/* Full Name & Username inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            {t('displayName')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('enterYourName')}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <AtSign className="w-3.5 h-3.5 text-cyan-400" />
              {t('handle')}
            </label>
            {isCheckingHandle ? (
              <span className="text-[10px] text-cyan-500 font-semibold flex items-center gap-1 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> {t('checking')}
              </span>
            ) : isHandleAvailable === true && !handleError ? (
              <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> {t('available')}
              </span>
            ) : null}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">@</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/^@/, ''))}
              placeholder="username"
              className={`w-full pl-7 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border text-xs font-semibold text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all ${
                handleError
                  ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                  : isHandleAvailable === true
                  ? 'border-emerald-500/60 focus:border-emerald-500'
                  : 'border-slate-200 dark:border-white/10 focus:border-cyan-400'
              }`}
            />
            {handleError && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500" title={handleError}>
                <AlertCircle className="w-4 h-4" />
              </span>
            )}
          </div>
          {handleError && (
            <p className="text-[11px] font-semibold text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1 animate-in fade-in">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {handleError}
            </p>
          )}
        </div>
      </div>

      {/* Email address */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-indigo-400" />
          {t('emailAddress')}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400 placeholder:text-slate-400 dark:placeholder:text-slate-600"
        />
      </div>

      {/* Country Selection */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          {t('countryLocation')}
        </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
        >
          <option value="" className="dark:bg-[#1f1f1f] text-slate-400">
            Select a country...
          </option>
          {ALL_COUNTRIES.map((c) => (
            <option key={c.code} value={c.name} className="dark:bg-[#1f1f1f] text-slate-900 dark:text-white">
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bio text area */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t('bioAndGoals')}
          </label>
          <span className="text-[10px] text-slate-400">{bio.length}/140</span>
        </div>
        <textarea
          rows={2}
          maxLength={140}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={t('bioPlaceholder')}
          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
        />
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-white/5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          {t('cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isCheckingHandle || !!handleError}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 shadow-md shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {t('saving')}
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              {t('saveChanges')}
            </>
          )}
        </button>
      </div>
    </form>
  );
};
