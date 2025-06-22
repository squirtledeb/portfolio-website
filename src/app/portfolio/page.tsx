"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PortfolioPage() {
  return (
    <div className="ocean-gradient min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>
      
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--ocean-light)] drop-shadow-lg">
              Coming Soon
            </h1>
            <p className="mt-4 text-xl text-[var(--ocean-text-secondary)]">
              My portfolio is currently under construction. Check back soon!
            </p>
        </motion.div>
      </div>

      <footer className="w-full text-center py-4 z-20">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide. All rights reserved.
        </span>
      </footer>
    </div>
  );
} 