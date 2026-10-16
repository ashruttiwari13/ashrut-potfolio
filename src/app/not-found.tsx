import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { FloatingOrbs } from '@/components/desktop/FloatingOrbs';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-pastel-bg text-pastel-dark flex items-center justify-center p-4 relative">
      <FloatingOrbs />

      <div className="retro-window max-w-md w-full bg-[#fffcf3] p-6 text-center space-y-4 relative z-10 animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-2xl bg-pastel-pink border-2 border-pastel-dark mx-auto flex items-center justify-center shadow-retro-sm">
          <Gamepad2 size={32} className="text-pastel-dark" />
        </div>

        <div className="space-y-1">
          <span className="text-3xl font-extrabold text-pastel-dark">404</span>
          <h2 className="text-lg font-extrabold text-pastel-dark">Window Not Found</h2>
          <p className="text-xs text-pastel-soft">
            The page, project, or level you are looking for has floated out of the desktop viewport.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="retro-btn retro-btn-mint text-xs px-4 py-2"
          >
            <ArrowLeft size={14} />
            <span>Return to Desktop</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
