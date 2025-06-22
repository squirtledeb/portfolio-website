'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import WaveAnimation from '@/components/WaveAnimation';
import Link from 'next/link';

export default function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the hero section
      gsap.from('.hero-content', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
      });

      // Animate the wave
      gsap.to('.wave', {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen ocean-gradient">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
        </div>

        {/* Hero Content */}
        <div className="hero-content relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            OceanTide
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-[var(--ocean-text-secondary)] mb-8"
          >
            Reliability. Consistency. Results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/portfolio">
              <button className="ocean-button mr-4">
                View Projects
              </button>
            </Link>
            <Link href="/contact">
              <button className="px-6 py-3 rounded-lg border-2 border-[var(--ocean-light)] text-[var(--ocean-light)] 
                             font-semibold transition-all duration-300 hover:bg-[var(--ocean-light)] 
                             hover:text-[var(--ocean-deep)]">
                Contact Me
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Animated Wave */}
        <WaveAnimation />
      </section>
    </div>
  );
} 