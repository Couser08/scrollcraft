import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-0">
        
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500" />
            <span className="text-xl font-bold text-white tracking-tight">ScrollCraft</span>
          </Link>
          <p className="text-sm text-zinc-500">
            The declarative React scroll engine.
          </p>
        </div>

        <div className="flex gap-8 text-sm font-medium text-zinc-400">
          <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
            GitHub
          </a>
          <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
            Twitter
          </a>
        </div>
        
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
        <span>&copy; {new Date().getFullYear()} ScrollCraft. Built with <span className="text-red-500">&hearts;</span> for the web.</span>
        <span>Make the web move.</span>
      </div>
    </footer>
  );
}
