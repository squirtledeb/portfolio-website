"use client";

import React from "react";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen flex flex-col ocean-gradient pt-32 pb-16 px-4 relative overflow-hidden">
      {/* Animated Background (same as homepage) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center justify-center h-[60vh] flex-1">
        <div className="text-6xl mb-4">🌊</div>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--ocean-light)] mb-4">Portfolio Coming Soon</h1>
        <p className="text-lg text-[var(--ocean-text-secondary)] mb-6">
          I'm working on something amazing! Soon you'll be able to dive into a showcase of my best ocean-inspired projects and creative work.
        </p>
        <div className="text-[var(--ocean-light)] font-semibold">Stay tuned for the tide to bring in new creations!</div>
      </div>
      <footer className="w-full flex justify-center items-center mt-8 mb-2">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide Co. All rights reserved.
        </span>
      </footer>
    </div>
  );
} 