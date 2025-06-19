"use client";

import React from "react";

export default function ServicesPage() {
  return (
    <div className="min-h-screen ocean-gradient pt-32 pb-16 px-4 relative overflow-hidden">
      {/* Animated Background (same as homepage) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center justify-center h-[60vh]">
        <div className="text-6xl mb-4">🪸</div>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--ocean-light)] mb-4">Services Coming Soon</h1>
        <p className="text-lg text-[var(--ocean-text-secondary)] mb-6">
          I'm crafting a suite of creative services to help your brand make waves. Check back soon to see how OceanTide Co. can help you stand out!
        </p>
        <div className="text-[var(--ocean-light)] font-semibold">The ocean of possibilities is just over the horizon.</div>
      </div>
    </div>
  );
} 