"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const placeholderReviews = [
    {
      author: "This spot is waiting for your review! 🌊",
      title: "Maybe your review will be here soon!",
      rating: 0,
      content: "",
      avatar: "/wave-logo.svg",
    },
    {
      author: "Not enough clients yet, but the tide is rising... 🐚",
      title: "Maybe your review will be here soon!",
      rating: 0,
      content: "",
      avatar: "/wave-logo.svg",
    },
    {
      author: "Your feedback could make waves here! 🐠",
      title: "Maybe your review will be here soon!",
      rating: 0,
      content: "",
      avatar: "/wave-logo.svg",
    },
    {
      author: "Be the first to leave a splash! 🐙",
      title: "Maybe your review will be here soon!",
      rating: 0,
      content: "",
      avatar: "/wave-logo.svg",
    },
    {
      author: "Future client stories will surface here! 🐬",
      title: "Maybe your review will be here soon!",
      rating: 0,
      content: "",
      avatar: "/wave-logo.svg",
    },
    {
      author: "Maybe your review will be here soon!",
      title: "",
      rating: 0,
      content: "",
      avatar: "/wave-logo.svg",
    },
];

const serviceTypes = [
  { id: "web-design", name: "Web Design" },
  { id: "web-development", name: "Web Development" },
  { id: "ui-ux-design", name: "UI/UX Design" },
  { id: "branding", name: "Branding" },
  { id: "animation", name: "Animation" },
  { id: "landing-page", name: "Landing Page Development" },
  { id: "ecommerce-dev", name: "eCommerce Development" },
  { id: "no-code-dev", name: "No-Code Development" },
  { id: "maintenance", name: "Maintenance & Support" },
  { id: "performance-opt", name: "Performance Optimization" },
  { id: "logo-design", name: "Logo Design" },
  { id: "social-media-design", name: "Social Media Design" },
  { id: "print-design", name: "Print Design" },
  { id: "copywriting", name: "Copywriting" },
  { id: "content-strategy", name: "Content Strategy" },
  { id: "seo-setup", name: "SEO Setup" },
  { id: "discord-server", name: "Discord Server Setup" },
  { id: "video-editing", name: "Video Editing" }
];

const getServiceName = (id: string) => {
  const service = serviceTypes.find(s => s.id === id);
  return service ? service.name : id;
};

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [[page, direction], setPage] = useState([0, 0]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const reviewsPerPage = 3;
  const realCount = reviews.length;
  let displayReviews = [...reviews];

  // Only add placeholders once we know the real review count
  if (!loading) {
    const remainder = realCount % reviewsPerPage;
    if (remainder !== 0 || realCount === 0) {
      const placeholdersNeeded = realCount === 0 ? reviewsPerPage : reviewsPerPage - remainder;
      for (let i = 0; i < placeholdersNeeded; i++) {
        displayReviews.push(placeholderReviews[i % placeholderReviews.length]);
      }
    }
  }

  const pageCount = Math.ceil(displayReviews.length / reviewsPerPage) || 1;
  const canNavigate = pageCount > 1;

  const paginate = (newDirection: number) => {
    if (canNavigate) {
      setPage([page + newDirection, newDirection]);
    }
  };

  const currentPage = (page % pageCount + pageCount) % pageCount;
  const currentReviews = displayReviews.slice(currentPage * reviewsPerPage, currentPage * reviewsPerPage + reviewsPerPage);

  return (
    <div className="h-screen flex flex-col items-center justify-center ocean-gradient p-4 relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center z-10 relative mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--ocean-light)] drop-shadow-lg">
            Client Reviews
          </h1>
          <p className="mt-2 text-lg text-[var(--ocean-text-secondary)]">
            See what people are saying about OceanTide Co.
          </p>
        </motion.div>
        
        <div className="relative w-full flex items-center justify-center" style={{ height: '320px' }}>
          {canNavigate && (
            <button onClick={() => paginate(-1)} className="absolute -left-4 md:-left-12 z-20 bg-[var(--ocean-surface)]/50 rounded-full p-2 hover:bg-[var(--ocean-light)]/20 transition-colors">
              <FiChevronLeft className="text-white text-2xl" />
            </button>
          )}

          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute w-full grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {currentReviews.map((review, index) => (
                review.rating > 0 ? (
                  <div
                    key={index}
                    className="relative w-full h-72 cursor-pointer group perspective group-hover:z-10"
                    tabIndex={0}
                  >
                    <div className="absolute inset-0 w-full h-full [transform-style:preserve-3d] transition-transform duration-500 ease-in-out flip-inner">
                      {/* Front */}
                      <div className="absolute inset-0 flex flex-col justify-center items-center bg-[var(--ocean-surface)] rounded-2xl shadow-lg border border-[var(--ocean-light)]/20 backface-hidden p-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-[var(--ocean-accent)] flex items-center justify-center text-3xl font-bold text-white ring-4 ring-[var(--ocean-accent)]/30">
                              {review.username.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-500"}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.965a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.372 2.448a1 1 0 00-.364 1.118l1.287 3.965c.3.921-.755 1.688-1.539 1.118l-3.372-2.448a1 1 0 00-1.176 0l-3.372 2.448c-.783.57-1.838-.197-1.539-1.118l1.287-3.965a1 1 0 00-.364-1.118L2.34 9.392c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69L9.049 2.927z" />
                              </svg>
                            ))}
                          </div>
                          <p className="mt-2 text-lg font-semibold text-[var(--ocean-light)]">{review.username}</p>
                          <p className="text-sm text-[var(--ocean-text-secondary)] italic">{getServiceName(review.serviceType)}</p>
                        </div>
                      </div>
                      {/* Back */}
                      <div className="absolute inset-0 flex flex-col bg-[var(--ocean-surface)] rounded-2xl shadow-lg border border-[var(--ocean-light)]/20 [transform:rotateY(180deg)] backface-hidden p-6">
                        <div className="flex-grow overflow-y-auto pr-2">
                          <p className="text-sm text-left text-[var(--ocean-text-secondary)] italic break-words">"{review.review}"</p>
                        </div>
                        <p className="flex-shrink-0 text-lg text-center font-bold text-[var(--ocean-light)] mt-auto pt-4">{review.title}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative w-full h-72 bg-[var(--ocean-surface)] rounded-2xl shadow-lg border border-[var(--ocean-light)]/20 p-6 flex flex-col items-center justify-center"
                    style={{ borderStyle: 'dashed' }}
                  >
                    <div className="flex flex-col items-center text-center w-full h-full justify-center">
                      <div className="w-16 h-16 rounded-full bg-[var(--ocean-light)]/20 flex items-center justify-center mb-4">
                        <span className="text-3xl">🌊</span>
                      </div>
                      <div className="min-h-12 flex items-center justify-center w-full">
                        <p className="text-xl font-bold text-[var(--ocean-light)] text-center w-full">{review.author}</p>
                      </div>
                      <p className="text-base text-[var(--ocean-text-secondary)] text-center w-full">{review.title}</p>
                    </div>
                  </motion.div>
                )
              ))}
            </motion.div>
          </AnimatePresence>

          {canNavigate && (
            <button onClick={() => paginate(1)} className="absolute -right-4 md:-right-12 z-20 bg-[var(--ocean-surface)]/50 rounded-full p-2 hover:bg-[var(--ocean-light)]/20 transition-colors">
              <FiChevronRight className="text-white text-2xl" />
            </button>
          )}
        </div>
      </div>
      <footer className="w-full flex justify-center items-center absolute bottom-4">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide Co. All rights reserved.
        </span>
      </footer>
    </div>
  );
} 