"use client";

import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col ocean-gradient pt-32 pb-16 px-4 relative overflow-hidden">
      {/* Animated Background (same as homepage) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center flex-1">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--ocean-light)] mb-6">About OceanTide</h1>
        <div className="bg-[var(--ocean-surface)] rounded-xl shadow-lg p-8 border border-[var(--ocean-light)]/10 mb-8">
          <h2 className="text-2xl font-semibold text-[var(--ocean-light)] mb-2">About Me</h2>
          <p className="text-[var(--ocean-text)]">
            Hey! I'm Naman, the creator behind OceanTide — a freelance brand built on passion, purpose, and a whole lot of determination. I just completed the International Baccalaureate Diploma Programme (IBDP), one of the most rigorous academic programs in the world. Through it, I've learned how to handle pressure, meet deadlines, and think creatively — all skills I now bring into my freelance work.<br /><br />
            Freelancing isn't just a side hustle for me — it's a stepping stone toward a bigger dream. I aim to pursue a degree in Marine Biology in Australia, and every project I take on helps bring me one step closer to that goal.
          </p>
        </div>
        <div className="bg-[var(--ocean-surface)] rounded-xl shadow-lg p-8 border border-[var(--ocean-light)]/10">
          <h2 className="text-2xl font-semibold text-[var(--ocean-light)] mb-2">Mission & Values</h2>
          <ol className="text-[var(--ocean-text)] text-left mx-auto max-w-xl list-decimal list-inside space-y-4">
            <li>
              <b>Purpose-Driven Work</b><br />
              Every project matters — not just for my clients, but for my future. I pour my heart into every task, knowing that it supports my journey toward studying marine life and protecting the ocean.
            </li>
            <li>
              <b>Curiosity &amp; Creativity</b><br />
              Inspired by the natural world, I approach every design, code, or edit with curiosity and a creative eye — always looking for ways to make your ideas stand out.
            </li>
            <li>
              <b>Honesty &amp; Transparency</b><br />
              I believe in clear communication, realistic timelines, and being upfront. Trust is the tide that keeps all things afloat.
            </li>
            <li>
              <b>Client-Centric Service</b><br />
              Your vision is my priority. I work closely with you to understand your goals and bring them to life with care and attention to detail.
            </li>
            <li>
              <b>Organization &amp; Reliability</b><br />
              With a background in the IBDP, I've learned to juggle complex workloads, meet deadlines, and stay organized under pressure. You can count on clear communication, timely updates, and smooth project management every step of the way.
            </li>
          </ol>
        </div>
        <div className="mt-10 text-[var(--ocean-text-secondary)] italic">
          "Clear goals. Clean work. Real results."
        </div>
      </div>
      <footer className="w-full flex justify-center items-center mt-8 mb-2">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide. All rights reserved.
        </span>
      </footer>
    </div>
  );
} 