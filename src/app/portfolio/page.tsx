import React from "react";
import { motion } from "framer-motion";
import { FiUpload, FiFileText } from "react-icons/fi";
import fs from "fs";
import path from "path";
import dynamic from "next/dynamic";
import PortfolioClient from "./PortfolioClient";

const portfolioSections = [
  { key: "logofolio", label: "Logofolio" },
  { key: "discord", label: "Discord Profiles" },
  { key: "posters", label: "Posters" },
  { key: "ui", label: "UI" },
  { key: "banners", label: "Banners" },
];

export default async function PortfolioPage() {
  const baseDir = path.join(process.cwd(), "public", "portfolio");
  const sectionFiles: Record<string, string[]> = {};
  for (const section of portfolioSections) {
    const dir = path.join(baseDir, section.key);
    let files: string[] = [];
    try {
      files = fs.readdirSync(dir).filter(f => f.endsWith(".pdf"));
    } catch {}
    sectionFiles[section.key] = files;
  }
  return (
    <div className="ocean-gradient min-h-screen flex flex-col">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>
      <PortfolioClient sectionFiles={sectionFiles} />
      <footer className="w-full text-center py-4 z-20">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide. All rights reserved.
        </span>
      </footer>
    </div>
  );
} 