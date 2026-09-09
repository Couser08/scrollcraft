import type { Metadata } from 'next';
import { ScrollProvider } from '@scrollcraft/react';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'ScrollCraft — High-Performance React & Next.js Scroll Engine',
  description:
    'Game-dev optimized scroll animations, pinning, and micro-interactions for React and Next.js App Router.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0c] text-white min-h-screen antialiased selection:bg-blue-600/30">
        <ScrollProvider smooth={{ damping: 0.08, mass: 1 }}>
          <Navbar />
          <main className="relative flex flex-col min-h-screen pt-12">
            {children}
          </main>
          <Footer />
        </ScrollProvider>
      </body>
    </html>
  );
}
