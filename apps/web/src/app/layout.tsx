import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ScrollProvider } from '@scrollcraft/react';
import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

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
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-zinc-950 min-h-screen antialiased selection:bg-blue-100 selection:text-blue-900 font-sans flex flex-col`}
        suppressHydrationWarning
      >
        <ScrollProvider smooth={true}>
          <main className="relative flex-1 flex flex-col min-h-0">
            {children}
          </main>
        </ScrollProvider>
      </body>
    </html>
  );
}
