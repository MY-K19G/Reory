'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { apiDeleteAccount } from '@/lib/api';

interface DeleteAccountModalProps {
  userName: string;
  userEmail: string;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  userName,
  userEmail,
  onClose,
}) => {
  const { t } = useI18n();
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const targetIdentifier = userName?.trim() || userEmail?.trim() || 'Learner';
  const confirmationTarget = targetIdentifier.toLowerCase() === 'learner' ? 'DELETE' : targetIdentifier;

  const isConfirmed =
    confirmInput.trim().toLowerCase() === confirmationTarget.toLowerCase() ||
    confirmInput.trim().toUpperCase() === 'DELETE';

  const handleDelete = async () => {
    if (!isConfirmed || isDeleting) return;

    setIsDeleting(true);
    setErrorMessage('');

    try {
      // 1. Delete account on backend server & database
      await apiDeleteAccount(targetIdentifier);

      // 2. Wipe local storage & session state
      localStorage.clear();
      window.dispatchEvent(new Event('user_profile_updated'));

      // 3. Redirect to home page
      window.location.href = '/';
    } catch (err: any) {
      console.error('Account deletion error:', err);
      // Even if backend had an issue or was offline, offer fallback clean wipe
      setErrorMessage(
        err?.message || 'Failed to delete account on server. Please check your connection and try again.'
      );
      setIsDeleting(false);
    }
  };

  const handleForceLocalWipe = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('user_profile_updated'));
    window.location.href = '/';
  };

  return (
    <div className="space-y-4">
      {/* Danger Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
        </div>
        <div>
          <span className="text-xs font-bold text-rose-400 block">
            {t('irreversibleAccountDeletion')}
          </span>
          <span className="text-[11px] text-rose-300/80 block mt-0.5 leading-relaxed">
            {t('permanentDeleteWarning')}
          </span>
        </div>
      </div>

      {/* Consequences List */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 space-y-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300 block">
          {t('whatGetsDeleted')}
        </span>
        <ul className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 list-disc list-inside">
          <li>{t('deletedItem1')}</li>
          <li>{t('deletedItem2')}</li>
          <li>{t('deletedItem3')}</li>
          <li>{t('deletedItem4')}</li>
        </ul>
      </div>

      {/* Confirmation Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
          {t('toConfirmDeletion')} <code className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[11px] font-bold">{confirmationTarget}</code> {t('orDeleteBelow')}
        </label>
        <input
          type="text"
          value={confirmInput}
          onChange={(e) => setConfirmInput(e.target.value)}
          placeholder={`Type "${confirmationTarget}" to confirm`}
          autoFocus
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2e2e2e] bg-slate-50 dark:bg-[#202020] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-mono"
        />
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs space-y-1.5">
          <p>{errorMessage}</p>
          <button
            type="button"
            onClick={handleForceLocalWipe}
            className="text-[11px] font-bold text-rose-300 underline hover:text-white cursor-pointer"
          >
            Force local data wipe and sign out anyway &rarr;
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="pt-2 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          {t('cancel')}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={!isConfirmed || isDeleting}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Deleting Account...
            </>
          ) : (
            <>
              <Trash2 className="w-3.5 h-3.5" />
              {t('permanentlyDeleteAccount')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
