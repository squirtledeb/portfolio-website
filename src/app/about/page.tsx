"use client";

import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen ocean-gradient pt-32 pb-16 px-4 relative overflow-hidden">
      {/* Animated Background (same as homepage) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--ocean-light)] mb-6">About OceanTide Co.</h1>
        <p className="text-lg text-[var(--ocean-text-secondary)] mb-10">
          OceanTide Co. is a freelance creative brand inspired by the beauty, depth, and movement of the ocean. I blend modern design, immersive visuals, and smooth animations to help brands and creators make waves online.
        </p>
        <div className="bg-[var(--ocean-surface)] rounded-xl shadow-lg p-8 border border-[var(--ocean-light)]/10 mb-8">
          <h2 className="text-2xl font-semibold text-[var(--ocean-light)] mb-2">My Journey</h2>
          <p className="text-[var(--ocean-text)]">
            From sketching sea creatures as a kid to building digital experiences as an adult, my creative journey has always been guided by the ocean's flow. I believe in the power of design to tell stories, evoke emotion, and connect people—just like the tides connect every shore.
          </p>
        </div>
        <div className="bg-[var(--ocean-surface)] rounded-xl shadow-lg p-8 border border-[var(--ocean-light)]/10">
          <h2 className="text-2xl font-semibold text-[var(--ocean-light)] mb-2">Mission & Values</h2>
          <ul className="text-[var(--ocean-text)] text-left mx-auto max-w-xl list-disc list-inside space-y-2">
            <li>Creativity that flows and adapts, like water</li>
            <li>Honest, transparent communication</li>
            <li>Premium, detail-oriented design</li>
            <li>Empowering clients to stand out in a crowded digital sea</li>
            <li>Respect for nature, diversity, and the creative process</li>
          </ul>
        </div>
        <div className="mt-10 text-[var(--ocean-text-secondary)] italic">
          "Let's create something unforgettable—together, we'll ride the tide of innovation."
        </div>
      </div>
    </div>
  );
} 