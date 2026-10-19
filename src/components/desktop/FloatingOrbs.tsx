'use client';

import React from 'react';

export const FloatingOrbs: React.FC = () => {
  return (
    <>
      {/* Background Gradient */}
      <div 
        className="fixed inset-0 pointer-events-none -z-20 bg-gradient-to-br from-[#fff5e6] via-[#ffe8d4] to-[#ffdec4]"
        aria-hidden="true"
      />

      {/* Floating Animated Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        <div 
          className="absolute rounded-full opacity-60 animate-float-slow"
          style={{
            width: '240px',
            height: '240px',
            top: '8%',
            left: '-40px',
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 182, 193, 0.45), rgba(192, 240, 221, 0.2))',
          }}
        />
        <div 
          className="absolute rounded-full opacity-60 animate-float-medium"
          style={{
            width: '340px',
            height: '340px',
            bottom: '-80px',
            right: '-60px',
            background: 'radial-gradient(circle at 35% 35%, rgba(226, 209, 255, 0.5), rgba(255, 218, 185, 0.3))',
            animationDuration: '18s',
          }}
        />
        <div 
          className="absolute rounded-full opacity-50 animate-float-fast"
          style={{
            width: '180px',
            height: '180px',
            top: '48%',
            left: '68%',
            background: 'radial-gradient(circle at 30% 30%, rgba(192, 240, 221, 0.45), rgba(255, 249, 231, 0.2))',
            animationDuration: '12s',
          }}
        />
        <div 
          className="absolute rounded-full opacity-50 animate-float-medium"
          style={{
            width: '130px',
            height: '130px',
            bottom: '22%',
            left: '12%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 218, 185, 0.5), rgba(255, 182, 193, 0.2))',
            animationDuration: '15s',
          }}
        />
        <div 
          className="absolute rounded-full opacity-40 animate-float-slow"
          style={{
            width: '280px',
            height: '280px',
            top: '55%',
            left: '32%',
            background: 'radial-gradient(circle at 40% 40%, rgba(226, 209, 255, 0.4), rgba(160, 212, 255, 0.25))',
            animationDuration: '22s',
          }}
        />
      </div>

      {/* Subtle Retro Pixel Grid */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 pixel-pattern opacity-15"
        aria-hidden="true"
      />
    </>
  );
};
