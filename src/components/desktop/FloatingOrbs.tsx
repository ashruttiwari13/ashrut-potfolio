'use client';

import React from 'react';

export const FloatingOrbs: React.FC = () => {
  return (
    <>
      {/* Dynamic Background Gradient adapting to theme */}
      <div 
        className="fixed inset-0 pointer-events-none -z-20 bg-[var(--bg-light)] transition-colors duration-300"
        aria-hidden="true"
      />

      {/* Floating Animated Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        <div 
          className="absolute rounded-full opacity-60 animate-float-slow transition-opacity"
          style={{
            width: '240px',
            height: '240px',
            top: '8%',
            left: '-40px',
            background: 'radial-gradient(circle at 30% 30%, var(--accent-pink), var(--accent-mint))',
          }}
        />
        <div 
          className="absolute rounded-full opacity-60 animate-float-medium transition-opacity"
          style={{
            width: '340px',
            height: '340px',
            bottom: '-80px',
            right: '-60px',
            background: 'radial-gradient(circle at 35% 35%, var(--accent-lavender), var(--accent-peach))',
            animationDuration: '18s',
          }}
        />
        <div 
          className="absolute rounded-full opacity-50 animate-float-fast transition-opacity"
          style={{
            width: '180px',
            height: '180px',
            top: '48%',
            left: '68%',
            background: 'radial-gradient(circle at 30% 30%, var(--accent-mint), var(--accent-yellow))',
            animationDuration: '12s',
          }}
        />
        <div 
          className="absolute rounded-full opacity-50 animate-float-medium transition-opacity"
          style={{
            width: '130px',
            height: '130px',
            bottom: '22%',
            left: '12%',
            background: 'radial-gradient(circle at 30% 30%, var(--accent-peach), var(--accent-pink))',
            animationDuration: '15s',
          }}
        />
        <div 
          className="absolute rounded-full opacity-40 animate-float-slow transition-opacity"
          style={{
            width: '280px',
            height: '280px',
            top: '55%',
            left: '32%',
            background: 'radial-gradient(circle at 40% 40%, var(--accent-lavender), var(--accent-sky))',
            animationDuration: '22s',
          }}
        />
      </div>

      {/* Subtle Retro Pixel Grid */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 pixel-pattern opacity-20"
        aria-hidden="true"
      />
    </>
  );
};
