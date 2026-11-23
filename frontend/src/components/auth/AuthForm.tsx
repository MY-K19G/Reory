'use client';

import React from 'react';
import {
  LogIn,
  UserPlus,
  ArrowRight,
  Key,
  ArrowLeft,
  Loader2,
  Check,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { AuthMode } from './types';

interface AuthFormProps {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  inputName: string;
  setInputName: (v: string) => void;
  inputEmail: string;
  setInputEmail: (v: string) => void;
  inputPassword: string;
  setInputPassword: (v: string) => void;
  inputConfirmPassword: string;
  setInputConfirmPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
  successMessage: string;
  setSuccessMessage: (msg: string) => void;
  isSubmitting: boolean;
  currentAccentPrimary: string;
  onSubmit: (e: React.FormEvent) => void;
}

export function AuthForm({
  authMode,
  setAuthMode,
  inputName,
  setInputName,
  inputEmail,
  setInputEmail,
  inputPassword,
  setInputPassword,
  inputConfirmPassword,
  setInputConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage,
  isSubmitting,
  currentAccentPrimary,
  onSubmit,
}: AuthFormProps) {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div
          className="w-13 h-13 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-black/5 dark:ring-white/5"
          style={{ backgroundColor: currentAccentPrimary }}
        >
          R
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {authMode === 'login'
              ? 'Welcome Back'
              : authMode === 'signup'
                ? 'Create an Account'
                : 'Reset Password'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs mx-auto">
            {authMode === 'login'
              ? 'Log in to access your cards, collections & study progress.'
              : authMode === 'signup'
                ? 'Sign up to create custom flashcards and track spaced repetition.'
                : 'Enter your registered username or email to set a new password.'}
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs (Log In vs Sign Up vs Forgot) */}
      {authMode !== 'forgot' ? (
        <div className="p-1 rounded-2xl bg-slate-100 dark:bg-[#202020] border border-slate-200/60 dark:border-white/5 flex gap-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'login'
                ? 'bg-white dark:bg-[#2c2c2c] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'signup'
                ? 'bg-white dark:bg-[#2c2c2c] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setAuthMode('login');
            setErrorMessage('');
            setSuccessMessage('');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Log In</span>
        </button>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs font-medium text-rose-600 dark:text-rose-400">
          {errorMessage}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-3.5">
        {authMode === 'forgot' ? (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Registered Username or Email
            </label>
            <input
              type="text"
              required
              value={inputEmail || inputName}
              onChange={(e) => {
                setInputEmail(e.target.value);
                setInputName(e.target.value);
              }}
              placeholder="e.g. username or alex@example.com"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2e2e2e] bg-slate-50 dark:bg-[#202020] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {authMode === 'signup' ? 'Username' : 'Username or Email'}
            </label>
            <input
              type="text"
              required
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder={authMode === 'signup' ? 'e.g. username' : 'e.g. username or email'}
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2e2e2e] bg-slate-50 dark:bg-[#202020] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
            />
          </div>
        )}

        {authMode === 'signup' && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              required
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2e2e2e] bg-slate-50 dark:bg-[#202020] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
            />
          </div>
        )}

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {authMode === 'forgot' ? 'New Password' : 'Password'}
            </label>
            {authMode === 'login' && (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('forgot');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-[11px] font-semibold text-accent-primary hover:underline cursor-pointer"
                style={{ color: currentAccentPrimary }}
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required={authMode === 'forgot'}
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-[#2e2e2e] bg-slate-50 dark:bg-[#202020] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer transition-colors"
              aria-label={showPassword ? 'Hide password' : 'View password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {(authMode === 'signup' || authMode === 'forgot') && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Confirm {authMode === 'forgot' ? 'New ' : ''}Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required={authMode === 'forgot'}
                value={inputConfirmPassword}
                onChange={(e) => setInputConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-[#2e2e2e] bg-slate-50 dark:bg-[#202020] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'View password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          style={{ backgroundColor: currentAccentPrimary }}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : authMode === 'signup' ? (
            <>
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Next: Select Preferences</span>
            </>
          ) : authMode === 'forgot' ? (
            <>
              <Key className="w-4 h-4 stroke-[2.5]" />
              <span>Reset Password</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 stroke-[2.5]" />
              <span>Log In to Continue</span>
            </>
          )}
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {/* Quick toggle link */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        {authMode === 'login' ? (
          <span>
            Don&apos;t have an account yet?{' '}
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="font-bold underline hover:opacity-80 cursor-pointer"
              style={{ color: currentAccentPrimary }}
            >
              Sign Up
            </button>
          </span>
        ) : authMode === 'signup' ? (
          <span>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="font-bold underline hover:opacity-80 cursor-pointer"
              style={{ color: currentAccentPrimary }}
            >
              Log In
            </button>
          </span>
        ) : null}
      </div>

      {/* Quick Features reminder */}
      <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-1.5">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Smart spaced repetition memory &amp; study system</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Personalized vocabulary decks &amp; community collections</span>
        </div>
      </div>
    </>
  );
}
