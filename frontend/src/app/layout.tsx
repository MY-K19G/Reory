import type { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';
import { I18nProvider } from '@/lib/i18n';
import { ThemeProvider } from '@/lib/theme';
import { AuthProvider } from '@/lib/auth';
import { StorageMigrator } from '@/components/StorageMigrator';
import './globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const metadata: Metadata = {
  title: 'Reory - Vocabulary & Flashcard Learning Platform',
  description: 'Master vocabulary with smart spaced repetition and AI — all in one place.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[#0f0f0f] dark:bg-[#0f0f0f] text-slate-100 flex flex-col">
        <StorageMigrator />
        <I18nProvider>
          <ThemeProvider>
            <AuthProvider>
              {/* App Main Layout: Fixed height viewport, sticky/fixed sidebar, scrollable main content */}
              <div className="flex h-screen w-full overflow-hidden bg-[#f5f7fb] dark:bg-[#0f0f0f]">
                <Sidebar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden w-full flex flex-col bg-[#f5f7fb] dark:bg-[#0f0f0f]">
                  {children}
                </main>
              </div>
            </AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
