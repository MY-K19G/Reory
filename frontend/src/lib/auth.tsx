'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useTheme } from '@/lib/theme';
import {
  apiSignUp,
  apiLogin,
  apiForgotPassword,
  apiSavePreferences,
  apiCheckHandle,
} from '@/lib/api';
import { isFakeAvatar, PRESET_AVATARS } from '@/components/UserAvatar';
import { AuthForm } from '@/components/auth/AuthForm';
import { OnboardingWizard } from '@/components/auth/OnboardingWizard';
import { AuthMode, PendingAccount } from '@/components/auth/types';

export { PRESET_AVATARS };

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  userAvatar: string;
  login: (name: string, email?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userName: 'Learner',
  userAvatar: '',
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userName, setUserName] = useState('Learner');
  const [userAvatar, setUserAvatar] = useState('');

  // Auth Mode: 'login' | 'signup' | 'forgot' | 'onboarding'
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Form Fields for Login / Sign Up
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputConfirmPassword, setInputConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Onboarding Preferences Fields
  const [prefTargetLang, setPrefTargetLang] = useState('Japanese');
  const [prefNativeLang, setPrefNativeLang] = useState('English');
  const [prefCountry, setPrefCountry] = useState('India');
  const [prefLevel, setPrefLevel] = useState('Beginner');
  const [prefDailyGoal, setPrefDailyGoal] = useState<number>(10);
  const [prefBio] = useState('');
  const [prefDisplayName, setPrefDisplayName] = useState('');
  const [prefHandle, setPrefHandle] = useState('');
  const [prefHandleError, setPrefHandleError] = useState('');
  const [isCheckingPrefHandle, setIsCheckingPrefHandle] = useState(false);
  const [isPrefHandleAvailable, setIsPrefHandleAvailable] = useState<boolean | null>(null);
  const [prefAvatar, setPrefAvatar] = useState(PRESET_AVATARS[0]);
  const [pendingAccount, setPendingAccount] = useState<PendingAccount | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);
  const [prefAvatarTab, setPrefAvatarTab] = useState<'notionist' | 'disk'>('notionist');
  const prefFileInputRef = useRef<HTMLInputElement>(null);

  // Debounced real-time handle verification against DB
  useEffect(() => {
    const clean = prefHandle.replace(/^@/, '').trim();
    if (!clean) {
      const timer = setTimeout(() => {
        setPrefHandleError('');
        setIsPrefHandleAvailable(null);
      }, 0);
      return () => clearTimeout(timer);
    }

    if (!/^[a-zA-Z0-9_]+$/.test(clean)) {
      const timer = setTimeout(() => {
        setPrefHandleError('Handle can only contain letters, numbers, and underscores');
        setIsPrefHandleAvailable(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(async () => {
      setIsCheckingPrefHandle(true);
      try {
        const res = await apiCheckHandle(clean, pendingAccount?.username || inputName || '');
        if (!res.available) {
          setPrefHandleError(res.error || `Handle @${clean} is already taken in the database.`);
          setIsPrefHandleAvailable(false);
        } else {
          setPrefHandleError('');
          setIsPrefHandleAvailable(true);
        }
      } catch {
        setPrefHandleError('');
        setIsPrefHandleAvailable(true);
      } finally {
        setIsCheckingPrefHandle(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [prefHandle, pendingAccount, inputName]);

  const handlePrefDiskUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setPrefAvatar(base64);
        setErrorMessage('');
      }
    };
    reader.readAsDataURL(file);
  };

  const { currentAccent } = useTheme();

  const syncState = () => {
    if (typeof window === 'undefined') return;
    const storedLogin = localStorage.getItem('duocard_is_logged_in');
    const storedName =
      localStorage.getItem('duocard_username') || localStorage.getItem('duocard_user_name') || 'Learner';
    const rawAvatar = localStorage.getItem('duocard_avatar');
    const storedAvatar = rawAvatar && !isFakeAvatar(rawAvatar) ? rawAvatar : '';
    if (rawAvatar && isFakeAvatar(rawAvatar)) {
      localStorage.removeItem('duocard_avatar');
    }

    setIsLoggedIn(storedLogin === 'true');
    setUserName(storedName);
    setUserAvatar(storedAvatar);
  };

  useEffect(() => {
    const initTimer = setTimeout(syncState, 0);
    window.addEventListener('storage', syncState);
    window.addEventListener('user_profile_updated', syncState);
    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('storage', syncState);
      window.removeEventListener('user_profile_updated', syncState);
    };
  }, []);

  const login = (name: string, email?: string) => {
    const formatted = name.trim() || 'Learner';
    localStorage.setItem('duocard_is_logged_in', 'true');
    localStorage.setItem('duocard_username', formatted);
    localStorage.setItem('duocard_user_name', formatted);
    if (email) {
      localStorage.setItem('duocard_user_email', email);
      localStorage.setItem('duocard_email', email);
    }
    setIsLoggedIn(true);
    setUserName(formatted);
    window.dispatchEvent(new Event('user_profile_updated'));
  };

  const logout = () => {
    localStorage.setItem('duocard_is_logged_in', 'false');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('user_profile_updated'));
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const account = pendingAccount || { username: inputName, email: inputEmail, displayName: inputName };
    const finalDisplayName = prefDisplayName.trim() || account.displayName || account.username;
    const finalHandle = (prefHandle.trim() || account.username).toLowerCase().replace(/\s+/g, '_').replace(/^@/, '');
    const finalAvatar = prefAvatar && !isFakeAvatar(prefAvatar) ? prefAvatar.trim() : '';
    const finalBio = prefBio.trim() || `Learning ${prefTargetLang} step by step.`;

    try {
      await apiSavePreferences({
        usernameOrEmail: account.username,
        targetLang: prefTargetLang,
        nativeLang: prefNativeLang,
        country: prefCountry,
        level: prefLevel,
        dailyGoalCards: prefDailyGoal,
        bio: finalBio,
        displayName: finalDisplayName,
        avatar: finalAvatar,
        handle: finalHandle,
      });
    } catch (err) {
      console.warn('Backend save preferences notice:', err);
    }

    localStorage.setItem('duocard_username', finalDisplayName);
    localStorage.setItem('duocard_user_name', finalDisplayName);
    localStorage.setItem('duocard_handle', finalHandle);
    if (finalAvatar) {
      localStorage.setItem('duocard_avatar', finalAvatar);
    } else {
      localStorage.removeItem('duocard_avatar');
    }
    localStorage.setItem('duocard_email', account.email);
    localStorage.setItem('duocard_user_email', account.email);
    localStorage.setItem('duocard_country', prefCountry);
    localStorage.setItem('duocard_bio', finalBio);
    localStorage.setItem('duocard_target_lang', prefTargetLang);
    localStorage.setItem('duocard_native_lang', prefNativeLang);
    localStorage.setItem('duocard_level', prefLevel);
    localStorage.setItem('duocard_daily_goal', String(prefDailyGoal));

    login(finalDisplayName, account.email);
    setUserAvatar(finalAvatar);
    setIsSubmitting(false);
  };

  const handleCheckHandle = async (clean: string, accountName: string): Promise<boolean> => {
    try {
      const res = await apiCheckHandle(clean, accountName || inputName || '');
      if (!res.available) {
        const err = res.error || `Handle @${clean} is already taken in the database.`;
        setPrefHandleError(err);
        setErrorMessage(err);
        return false;
      }
      return true;
    } catch {
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (authMode === 'signup') {
      if (!inputName.trim()) {
        setErrorMessage('Please enter your username.');
        return;
      }
      if (!inputEmail.trim()) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (inputPassword && inputConfirmPassword && inputPassword !== inputConfirmPassword) {
        setErrorMessage('Passwords do not match. Please re-check.');
        return;
      }

      setIsSubmitting(true);
      try {
        const cleanName = inputName.trim();
        const formatted = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

        await apiSignUp({
          username: cleanName,
          email: inputEmail.trim(),
          password: inputPassword,
          displayName: formatted,
        });

        setPendingAccount({
          username: cleanName,
          email: inputEmail.trim(),
          displayName: formatted,
        });
        setPrefDisplayName(formatted);
        setPrefHandle(cleanName.toLowerCase().replace(/\s+/g, '_'));
        setPrefAvatar(PRESET_AVATARS[0]);
        setOnboardingStep(1);
        setAuthMode('onboarding');
      } catch (err: unknown) {
        console.warn('Backend signup error:', err);
        const errMsg = err instanceof Error ? err.message : '';
        if (errMsg && !errMsg.includes('fetch')) {
          setErrorMessage(errMsg);
        } else {
          const cleanName = inputName.trim();
          const formatted = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
          setPendingAccount({
            username: cleanName,
            email: inputEmail.trim(),
            displayName: formatted,
          });
          setPrefDisplayName(formatted);
          setPrefHandle(cleanName.toLowerCase().replace(/\s+/g, '_'));
          setPrefAvatar(PRESET_AVATARS[0]);
          setOnboardingStep(1);
          setAuthMode('onboarding');
        }
      } finally {
        setIsSubmitting(false);
      }
    } else if (authMode === 'forgot') {
      if (!inputEmail.trim() && !inputName.trim()) {
        setErrorMessage('Please enter your username or email address.');
        return;
      }
      if (!inputPassword.trim()) {
        setErrorMessage('Please enter your new password.');
        return;
      }
      if (inputConfirmPassword && inputPassword !== inputConfirmPassword) {
        setErrorMessage('New passwords do not match.');
        return;
      }

      setIsSubmitting(true);
      try {
        const identifier = (inputEmail || inputName).trim();
        await apiForgotPassword({
          emailOrUsername: identifier,
          newPassword: inputPassword.trim(),
        });
        setSuccessMessage('Password reset successfully! You can now log in with your new password.');
        setTimeout(() => {
          setAuthMode('login');
          setSuccessMessage('Password changed! Please log in.');
          setInputPassword('');
          setInputConfirmPassword('');
        }, 1500);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Failed to reset password. Please check your username or email.';
        setErrorMessage(errMsg);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(true);
      try {
        const identifier = inputName.trim();
        const res = await apiLogin({
          usernameOrEmail: identifier,
          password: inputPassword,
        });
        const nameToUse = res.displayName || res.username || identifier;
        const formatted = nameToUse.charAt(0).toUpperCase() + nameToUse.slice(1);

        if (res.targetLang) localStorage.setItem('duocard_target_lang', res.targetLang);
        if (res.nativeLang) localStorage.setItem('duocard_native_lang', res.nativeLang);
        if (res.country) localStorage.setItem('duocard_country', res.country);
        if (res.level) localStorage.setItem('duocard_level', res.level);
        if (res.dailyGoalCards) localStorage.setItem('duocard_daily_goal', String(res.dailyGoalCards));
        if (res.bio) localStorage.setItem('duocard_bio', res.bio);
        if (res.favoriteDecks) localStorage.setItem('duocard_favorite_decks', res.favoriteDecks);
        if (res.archivedDecks) localStorage.setItem('duocard_archived_decks', res.archivedDecks);
        if (res.cardDetailSettings) localStorage.setItem('duocard_card_detail_settings', res.cardDetailSettings);
        if (res.themeMode) localStorage.setItem('duocard_theme_mode', res.themeMode);
        if (res.accentColor) localStorage.setItem('duocard_accent_color', res.accentColor);
        if (res.appLanguage) localStorage.setItem('duocard_app_language', res.appLanguage);

        login(formatted, res.email);
      } catch (err: unknown) {
        console.warn('Backend login error:', err);
        const errMsg = err instanceof Error ? err.message : 'Invalid username or password. Please try again.';
        setErrorMessage(errMsg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // While hydrating/checking localStorage, avoid flashing
  if (isLoggedIn === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f5f7fb] dark:bg-[#0f0f0f]">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg animate-pulse"
            style={{ backgroundColor: currentAccent?.primary || '#ea7a54' }}
          >
            R
          </div>
          <div className="text-xs text-slate-400 font-medium">Loading session...</div>
        </div>
      </div>
    );
  }

  // If not logged in, enforce the authentication & preferences screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#f5f7fb] dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
        {/* Ambient decorative glow */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: currentAccent?.primary || '#ea7a54' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: '#6366f1' }}
        />

        <div className="relative w-full max-w-lg bg-white dark:bg-[#161616] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden p-5 sm:p-6 space-y-3.5 max-h-[96vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {authMode === 'onboarding' ? (
            <OnboardingWizard
              onboardingStep={onboardingStep}
              setOnboardingStep={setOnboardingStep}
              pendingAccount={pendingAccount}
              prefDisplayName={prefDisplayName}
              setPrefDisplayName={setPrefDisplayName}
              prefHandle={prefHandle}
              setPrefHandle={setPrefHandle}
              prefHandleError={prefHandleError}
              isCheckingPrefHandle={isCheckingPrefHandle}
              setIsCheckingPrefHandle={setIsCheckingPrefHandle}
              isPrefHandleAvailable={isPrefHandleAvailable}
              prefAvatar={prefAvatar}
              setPrefAvatar={setPrefAvatar}
              prefAvatarTab={prefAvatarTab}
              setPrefAvatarTab={setPrefAvatarTab}
              prefFileInputRef={prefFileInputRef}
              handlePrefDiskUpload={handlePrefDiskUpload}
              prefTargetLang={prefTargetLang}
              setPrefTargetLang={setPrefTargetLang}
              prefNativeLang={prefNativeLang}
              setPrefNativeLang={setPrefNativeLang}
              prefCountry={prefCountry}
              setPrefCountry={setPrefCountry}
              prefLevel={prefLevel}
              setPrefLevel={setPrefLevel}
              prefDailyGoal={prefDailyGoal}
              setPrefDailyGoal={setPrefDailyGoal}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              isSubmitting={isSubmitting}
              currentAccentPrimary={currentAccent?.primary || '#ea7a54'}
              onCheckHandle={handleCheckHandle}
              onSubmitPreferences={handlePreferencesSubmit}
            />
          ) : (
            <AuthForm
              authMode={authMode}
              setAuthMode={setAuthMode}
              inputName={inputName}
              setInputName={setInputName}
              inputEmail={inputEmail}
              setInputEmail={setInputEmail}
              inputPassword={inputPassword}
              setInputPassword={setInputPassword}
              inputConfirmPassword={inputConfirmPassword}
              setInputConfirmPassword={setInputConfirmPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              successMessage={successMessage}
              setSuccessMessage={setSuccessMessage}
              isSubmitting={isSubmitting}
              currentAccentPrimary={currentAccent?.primary || '#ea7a54'}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, userAvatar, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
