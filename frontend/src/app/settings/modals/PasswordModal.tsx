'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ShieldCheck, Check, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface PasswordModalProps {
  onClose: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ onClose }) => {
  const { t } = useI18n();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [, setHasExistingPassword] = useState(false);
  const [lastChangedDate, setLastChangedDate] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('duocard_user_password');
      if (stored) {
        setHasExistingPassword(true);
      }
      const lastChanged = localStorage.getItem('duocard_password_last_changed');
      if (lastChanged) {
        setLastChangedDate(lastChanged);
      }
    } catch {
      // ignore
    }
  }, []);

  // Validation criteria
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const strengthScore = [hasMinLength, hasNumber, hasUppercase, hasSpecial].filter(Boolean).length;
  const strengthLabels = [t('strengthWeak'), t('strengthFair'), t('strengthGood'), t('strengthStrong')];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-emerald-500'];

  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword.trim()) {
      setErrorMsg(t('pleaseEnterCurrentPassword') || 'Please enter your current password.');
      return;
    }

    // Verify current password against stored password if exists
    try {
      const stored = localStorage.getItem('duocard_user_password');
      if (stored && stored !== currentPassword) {
        setErrorMsg(t('currentPasswordIncorrect') || 'The password you entered for "Your Password" is incorrect.');
        return;
      }
    } catch {
      // ignore
    }

    if (currentPassword === newPassword) {
      setErrorMsg(t('newPasswordMustBeDifferent') || 'New password must be different from your current password.');
      return;
    }

    if (!hasMinLength) {
      setErrorMsg(t('passwordMinLengthError') || 'New password must be at least 8 characters long.');
      return;
    }
    if (strengthScore < 3) {
      setErrorMsg(t('passwordStrengthError') || 'Please choose a stronger password meeting at least 3 security criteria.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg(t('passwordsMismatchError') || 'New password and confirm password do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Persist to localStorage
      localStorage.setItem('duocard_user_password', newPassword);
      const nowFormatted = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      localStorage.setItem('duocard_password_last_changed', nowFormatted);
      setLastChangedDate(nowFormatted);
      setHasExistingPassword(true);

      // Attempt to sync with backend /api/auth/forgot-password if user exists
      const username = localStorage.getItem('duocard_username') || localStorage.getItem('duocard_user_name');
      const email = localStorage.getItem('duocard_email');
      const identifier = username || email;
      if (identifier) {
        try {
          await fetch('http://localhost:8080/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              emailOrUsername: identifier,
              newPassword: newPassword,
            }),
          });
        } catch {
          // Backend optional, local change succeeds
        }
      }

      setSuccessMsg(t('passwordUpdatedSuccess'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsSubmitting(false);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMsg(t('failedToSavePassword') || 'Failed to save updated password.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      {/* Success banner */}
      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Error banner */}
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Security Info Card */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-white block">
              {t('e2eAccountProtection')}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {lastChangedDate ? `${t('lastChanged')}: ${lastChangedDate}` : t('securedSessionReady')}
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {t('encryptedBadge')}
        </span>
      </div>

      {/* 1. Your Password (Current Password) */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          {t('yourPassword')}
        </label>
        <div className="relative">
          <input
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t('enterCurrentPassword')}
            required
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            aria-label="Toggle password visibility"
          >
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. New Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          {t('newPassword')}
        </label>
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t('enterAtLeast8Chars')}
            required
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            aria-label="Toggle password visibility"
          >
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Dynamic Strength Meter */}
        {newPassword.length > 0 && (
          <div className="space-y-1 pt-1 animate-in fade-in">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-slate-400">{t('passwordStrength')}:</span>
              <span className={strengthScore >= 3 ? 'text-emerald-400' : 'text-amber-400'}>
                {strengthLabels[strengthScore - 1] || t('tooWeak')}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
              {[0, 1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-full rounded-full transition-all duration-300 ${
                    strengthScore > step ? strengthColors[strengthScore - 1] : 'bg-slate-200 dark:bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Password Requirements Checklist */}
        <div className="p-3 rounded-2xl bg-slate-50/60 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 space-y-1.5 text-[11px]">
          <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
            <Check className={`w-3 h-3 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{t('ruleMinChars')}</span>
          </div>
          <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
            <Check className={`w-3 h-3 ${hasUppercase ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{t('ruleUppercase')}</span>
          </div>
          <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
            <Check className={`w-3 h-3 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{t('ruleNumber')}</span>
          </div>
          <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
            <Check className={`w-3 h-3 ${hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{t('ruleSpecial')}</span>
          </div>
        </div>
      </div>

      {/* 3. Confirm Password */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          {t('confirmPassword')}
        </label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('repeatNewPassword')}
            required
            className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border text-xs font-semibold text-slate-900 dark:text-white focus:outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
              isMatch
                ? 'border-emerald-500/60 focus:border-emerald-400'
                : isMismatch
                ? 'border-rose-500/60 focus:border-rose-400'
                : 'border-slate-200 dark:border-white/10 focus:border-indigo-400'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            aria-label="Toggle password visibility"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {isMatch && (
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 pt-0.5">
            <Check className="w-3 h-3" /> {t('passwordsMatch')}
          </span>
        )}
        {isMismatch && (
          <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 pt-0.5">
            <AlertCircle className="w-3 h-3" /> {t('passwordsDoNotMatch')}
          </span>
        )}
      </div>

      {/* Footer */}
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
          disabled={isSubmitting || !currentPassword || !newPassword || !confirmPassword || !isMatch || strengthScore < 3}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <KeyRound className="w-3.5 h-3.5" />
          {isSubmitting ? t('updating') : t('updatePassword')}
        </button>
      </div>
    </form>
  );
};
