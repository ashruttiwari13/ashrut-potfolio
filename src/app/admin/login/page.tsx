'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { loginAdminAction } from '../actions';
import { FloatingOrbs } from '@/components/desktop/FloatingOrbs';

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await loginAdminAction(passcode);
      if (res.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(res.error || 'Authentication rejected');
      }
    } catch {
      setError('Unable to authenticate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-pastel-bg text-pastel-dark flex items-center justify-center p-4 relative">
      <FloatingOrbs />

      <div className="retro-window max-w-sm w-full bg-[#fffcf3] p-6 space-y-4 relative z-10 animate-in zoom-in-95">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-pastel-peach border-2 border-pastel-dark mx-auto flex items-center justify-center shadow-retro-sm">
            <ShieldCheck size={28} className="text-pastel-dark" />
          </div>
          <h1 className="text-xl font-extrabold text-pastel-dark">
            Portfolio Administration
          </h1>
          <p className="text-xs text-pastel-soft">
            Secure manager for projects, skills, and client inquiries.
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-100 border border-rose-400 rounded-xl text-xs font-semibold text-rose-800 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="admin-passcode" className="block text-xs font-bold text-pastel-dark mb-1">
              Administrator Passcode
            </label>
            <div className="relative">
              <KeyRound size={15} className="absolute left-3 top-2.5 text-pastel-dark/60" />
              <input
                id="admin-passcode"
                type="password"
                required
                autoFocus
                placeholder="Enter passcode from .env.local"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink shadow-sm"
              />
            </div>
            <p className="text-[10px] text-pastel-soft mt-1">
              Local default: configured in <code className="bg-pastel-warm px-1 rounded">.env.local</code> as <code className="bg-pastel-warm px-1 rounded">ADMIN_SECRET_KEY</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full retro-btn retro-btn-primary py-2.5 text-xs font-extrabold"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Lock size={13} />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-pastel-dark/15">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-pastel-soft hover:text-pastel-dark"
          >
            <ArrowLeft size={13} />
            <span>Return to Portfolio Desktop</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
