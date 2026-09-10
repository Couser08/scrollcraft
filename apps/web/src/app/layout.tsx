import type { Metadata } from 'next';
import { ScrollProvider } from '@scrollcraft/react';
import { HeaderNav } from '@/components/layout/header-nav';
import { ModernFooter } from '@/components/layout/modern-footer';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'ScrollCraft — Animate on Scroll, Beautifully',
  description:
    'ScrollCraft makes it easy to create smooth, performant and stunning scroll-based animations — without the complexity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="bg-white text-zinc-950 min-h-screen antialiased selection:bg-blue-100 selection:text-blue-900 font-sans flex flex-col"
        suppressHydrationWarning
      >
        <ScrollProvider smooth={true}>
          <HeaderNav />
          <main className="relative flex-1 flex flex-col min-h-0">
            {children}
          </main>
          <ModernFooter />
        </ScrollProvider>
      </body>
    </html>
  );
}
