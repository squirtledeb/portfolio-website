"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const reviews = [
  {
    username: "Alex M.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    details: "Absolutely stunning work! The oceanic theme brought my brand to life. Highly recommended for creative projects.",
    role: "Startup Founder",
  },
];

const flipSoundUrl = "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae4c3.mp3"; // Free flip sound

const ReviewCard = ({ review }: { review: typeof reviews[0] }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="relative w-full h-64 cursor-pointer perspective"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      tabIndex={0}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
    >
      <motion.div
        className="absolute inset-0 w-full h-full [transform-style:preserve-3d] transition-transform duration-250 ease-in-out"
        animate={{ rotateY: flipped ? 180 : 0 }}
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-[var(--ocean-deep)] rounded-xl shadow-lg border border-[var(--ocean-light)]/10 backface-hidden px-6">
          <div className="flex items-center gap-4 mb-2">
            <img src={review.avatar} alt={review.username} className="w-16 h-16 rounded-full border-2 border-[var(--ocean-light)] shadow" />
            <div className="flex flex-col items-start">
              <div className="font-bold text-[var(--ocean-light)] text-lg">{review.username}</div>
              <div className="text-xs text-[var(--ocean-text-secondary)]">{review.role}</div>
              <div className="flex gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-500"}>★</span>
                ))}
              </div>
            </div>
          </div>
          <div className="text-[var(--ocean-text-secondary)] text-xs">Hover to read more</div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--ocean-surface)] rounded-xl shadow-lg border border-[var(--ocean-light)]/10 [transform:rotateY(180deg)] backface-hidden p-6">
          <div className="text-[var(--ocean-light)] font-semibold mb-2">{review.username}</div>
          <div className="text-[var(--ocean-text-secondary)] text-xs mb-4">{review.role}</div>
          <div className="text-[var(--ocean-text)] italic">{review.details}</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ReviewsPage() {
  // Always show 6 cards (1 review + 5 empty)
  const totalCards = 6;
  const emptyCards = totalCards - reviews.length;
  const quirkyMessages = [
    "This spot is waiting for your review! 🌊",
    "Not enough clients yet, but the tide is rising… 🐚",
    "Your feedback could make waves here! 🐠",
    "Be the first to leave a splash! 🦑",
    "Future client stories will surface here! 🐬",
  ];
  return (
    <div className="min-h-screen flex flex-col ocean-gradient pt-32 pb-16 px-4 relative overflow-hidden">
      {/* Animated Background (same as homepage) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto flex-1">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--ocean-light)] mb-4">Client Reviews</h1>
          <p className="text-[var(--ocean-text-secondary)]">See what people are saying about OceanTide Co.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {reviews.map((review, idx) => (
            <ReviewCard key={idx} review={review} />
          ))}
          {Array.from({ length: emptyCards }).map((_, idx) => (
            <div
              key={idx + reviews.length}
              className="flex flex-col items-center justify-center h-64 bg-[var(--ocean-surface)] border-2 border-dashed border-[var(--ocean-light)]/30 rounded-xl text-center text-[var(--ocean-text-secondary)] px-6 shadow-inner"
            >
              <div className="text-4xl mb-2">🌊</div>
              <div className="font-semibold mb-1 min-h-[56px] flex flex-col justify-center items-center">
                {quirkyMessages[idx]}
              </div>
              <div className="text-xs">Maybe your review will be here soon!</div>
            </div>
          ))}
        </div>
      </div>
      <footer className="w-full flex justify-center items-center mt-8 mb-2">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide Co. All rights reserved.
        </span>
      </footer>
    </div>
  );
} 