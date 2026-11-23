export interface PendingAccount {
  username: string;
  email: string;
  displayName: string;
}

export type AuthMode = 'login' | 'signup' | 'forgot' | 'onboarding';
