"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiFileText } from "react-icons/fi";

const portfolioSections = [
  { key: "logofolio", label: "Logofolio" },
  { key: "discord", label: "Discord Profiles" },
  { key: "posters", label: "Posters" },
  { key: "ui", label: "UI" },
  { key: "banners", label: "Banners" },
];

export default function PortfolioClient({ sectionFiles }: { sectionFiles: Record<string, string[]> }) {
  return (
    <div className="relative z-10 flex-grow flex flex-col items-center justify-start px-2 sm:px-4 pt-20 pb-8 w-full max-w-7xl mx-auto min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-[var(--ocean-light)] drop-shadow-lg mb-8 sm:mb-10 text-center"
      >
        My Portfolio
      </motion.h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 w-full">
        {portfolioSections.map((section, idx) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx, duration: 0.6 }}
            className="bg-[rgba(17,34,64,0.92)] border border-[var(--ocean-light)]/20 rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col items-center relative overflow-hidden group hover:shadow-2xl transition-shadow min-h-[320px] w-full"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--ocean-accent)] mb-4 sm:mb-6 tracking-wide flex items-center gap-2 text-center w-full justify-center">
              <FiFileText className="text-[var(--ocean-accent)] text-2xl sm:text-3xl" /> {section.label}
            </h2>
            {sectionFiles[section.key]?.length ? (
              <div className="flex flex-wrap gap-4 sm:gap-8 mt-2 w-full justify-center items-center">
                {sectionFiles[section.key].map((file) => (
                  <div
                    key={file}
                    className="flex flex-col items-center bg-[rgba(17,34,64,0.7)] border border-[var(--ocean-light)]/20 rounded-xl p-3 sm:p-4 text-xs shadow-lg w-full max-w-[95vw] sm:w-[260px] md:w-[320px] min-h-[260px] sm:min-h-[340px] max-h-[420px] hover:border-[var(--ocean-accent)]/60 transition-colors group"
                  >
                    {/* PDF Preview */}
                    <div className="w-full flex items-center justify-center mb-2 sm:mb-3 border border-[var(--ocean-light)]/20 rounded-lg bg-[var(--ocean-deep)] overflow-x-auto" style={{height: '180px', minHeight: '120px', maxHeight: '220px', minWidth: '120px', maxWidth: '100%'}}>
                      <iframe
                        src={`/portfolio/${section.key}/${file}#toolbar=0&navpanes=0&scrollbar=0&view=fitH`}
                        title={file}
                        width="100%"
                        height="180px"
                        className="rounded-lg bg-[var(--ocean-deep)]"
                        style={{ border: 'none', minWidth: '120px', maxWidth: '100%' }}
                        allowFullScreen
                      />
                    </div>
                    <span className="truncate max-w-[180px] sm:max-w-[220px] text-[var(--ocean-light)] text-center font-medium mb-1 text-sm sm:text-base">{file}</span>
                    <a
                      href={`/portfolio/${section.key}/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--ocean-accent)] text-xs sm:text-sm mt-1 font-semibold hover:underline"
                    >
                      View PDF
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full min-h-[80px] sm:min-h-[100px] text-[var(--ocean-text-secondary)] italic opacity-60">
                No PDFs uploaded yet.
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
} 