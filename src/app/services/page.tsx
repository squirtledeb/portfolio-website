"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  FiCode, FiLayout, FiPenTool, FiDatabase, FiTrendingUp, 
  FiMonitor, FiShoppingBag, FiZap, FiTool, FiShield, FiFilm,
  FiServer, FiGlobe, FiSmartphone, FiBox, FiEye, FiHeart, FiX
} from 'react-icons/fi';

const services = [
  {
    category: "Design",
    items: [
      { name: "Web Design", icon: <FiMonitor />, description: "Our Web Design service focuses on creating visually stunning and highly intuitive websites. We blend modern aesthetics with user-centric design principles to build a digital presence that captivates your audience and communicates your brand's message effectively.", price: "$250", sampleImage: "/services/web-design.png" },
      { name: "UI/UX Design", icon: <FiLayout />, description: "We craft seamless user experiences and beautiful user interfaces that are both intuitive and enjoyable. Our process involves in-depth research, wireframing, and prototyping to ensure the final product is perfectly aligned with your users' needs.", price: "$120", sampleImage: "/services/ui-ux.png" },
      { name: "Branding & Logo Design", icon: <FiPenTool />, description: "A strong brand is unforgettable. We develop compelling brand identities, from a memorable logo to a complete style guide, that tell your story and resonate with your target audience.", price: "$80", sampleImage: "/services/branding.png" },
      { name: "Social Media Design", icon: <FiHeart />, description: "Capture attention on social media with stunning visuals. We design cohesive and engaging graphics for your social media profiles, posts, and campaigns to help you grow your online community.", price: "$50/mo", sampleImage: "/services/social-media.png" },
    ],
  },
  {
    category: "Development",
    items: [
      { name: "Web Development", icon: <FiCode />, description: "We build high-performance, scalable, and secure websites using the latest technologies. From custom features to complex integrations, we write clean and efficient code to bring your vision to life.", price: "$350", sampleImage: "/services/web-dev.png" },
      { name: "Landing Pages", icon: <FiBox />, description: "Convert visitors into customers with a high-impact landing page. We design and develop optimized landing pages that are focused on a single goal, driving results for your marketing campaigns.", price: "$100", sampleImage: "/services/landing-page.png" },
      { name: "eCommerce Stores", icon: <FiShoppingBag />, description: "Launch your online store with a powerful and user-friendly eCommerce platform. We build custom online stores that make it easy for you to manage products, process payments, and grow your business.", price: "$450", sampleImage: "/services/ecommerce.png" },
      { name: "No-Code Solutions", icon: <FiZap />, description: "Get your project off the ground quickly and affordably with no-code tools. We specialize in platforms like Webflow and Framer to create professional websites without the need for custom code.", price: "$200", sampleImage: "/services/no-code.png" },
    ],
  },
  {
    category: "Content",
    items: [
      { name: "Content Strategy", icon: <FiTrendingUp />, description: "A solid content strategy is the foundation of digital success. We help you plan, create, and distribute valuable content that attracts your target audience and builds lasting relationships.", price: "$90", sampleImage: "/services/content-strategy.png" },
      { name: "Copywriting", icon: <FiEye />, description: "Words have power. Our copywriting service delivers clear, compelling, and persuasive copy for your website, ads, and marketing materials that connects with your audience and drives action.", price: "Variable", sampleImage: "/services/copywriting.png" },
      { name: "Video Editing", icon: <FiFilm />, description: "Engage your audience with professional video content. We offer editing services for promotional videos, tutorials, social media clips, and more, ensuring your message is delivered with impact.", price: "$30/video", sampleImage: "/services/video-editing.png" },
      { name: "SEO Setup", icon: <FiGlobe />, description: "Get found on Google. We provide foundational SEO services, including keyword research, on-page optimization, and technical setup, to improve your search engine rankings and attract organic traffic.", price: "$80", sampleImage: "/services/seo.png" },
    ],
  },
  {
    category: "Support",
    items: [
      { name: "Maintenance & Support", icon: <FiTool />, description: "Keep your website running smoothly with our ongoing maintenance plans. We handle updates, backups, security checks, and performance monitoring, so you can focus on your business.", price: "$15/mo", sampleImage: "/services/maintenance.png" },
      { name: "Performance Optimization", icon: <FiShield />, description: "A slow website can hurt your business. We analyze and optimize your site's performance, improving loading times, user experience, and search engine rankings.", price: "Variable", sampleImage: "/services/performance.png" },
      { name: "Discord Server Setup", icon: <FiServer />, description: "Build a thriving community with a professionally configured Discord server. We set up roles, channels, bots, and security features to create a welcoming and engaging space for your audience.", price: "$150", sampleImage: "/services/discord.png" },
      { name: "General Consultation", icon: <FiSmartphone />, description: "Have a question or need expert advice? We offer one-on-one consultations to help you with your digital strategy, technical challenges, and creative projects.", price: "$10/hour", sampleImage: "/services/consultation.png" },
    ],
  },
];

type ServiceItem = {
  name: string;
  icon: JSX.Element;
  description: string;
  price: string;
  sampleImage: string;
};

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <div className="min-h-screen ocean-gradient pt-28 pb-20 px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--ocean-light)] drop-shadow-lg">
            Our Services
          </h1>
          <p className="mt-2 text-lg text-[var(--ocean-text-secondary)]">
            Creative solutions provided by us for every need.
          </p>
        </motion.div>

        {/* Services Sections */}
        <motion.div
          className="w-full space-y-12"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.4 } }
          }}
        >
          {services.map((category) => (
            <motion.section 
              key={category.category}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="w-full"
            >
              <h2 className="text-3xl font-bold text-center text-[var(--ocean-light)] mb-8">
                {category.category}
              </h2>
              <motion.div
                className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
              >
                {category.items.map((item) => (
                  <motion.div
                    key={item.name}
                    layoutId={`card-container-${item.name}`}
                    onClick={() => setSelectedService(item)}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -8,
                      boxShadow: "0px 10px 25px rgba(100, 255, 218, 0.2)",
                      borderColor: "rgba(100, 255, 218, 0.5)",
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    className="bg-[var(--ocean-surface)] rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-[var(--ocean-light)]/10 cursor-pointer h-full"
                  >
                    <motion.div layoutId={`card-icon-${item.name}`} className="text-4xl text-[var(--ocean-light)] mb-2 flex items-center justify-center">
                      {item.icon}
                    </motion.div>
                    <div className="h-14 mt-auto flex items-center justify-center">
                      <motion.h3 layoutId={`card-title-${item.name}`} className="text-lg font-bold text-[var(--ocean-text)]">
                        {item.name}
                      </motion.h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          ))}
        </motion.div>
      </div>
      
      <AnimatePresence>
        {selectedService && (
          <motion.div
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`card-container-${selectedService.name}`}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-[var(--ocean-surface)] rounded-2xl shadow-lg border border-[var(--ocean-light)]/20 flex flex-col md:flex-row overflow-hidden"
            >
              <div className="w-full md:w-1/2 p-8 flex flex-col">
                <motion.div layoutId={`card-icon-${selectedService.name}`} className="text-5xl text-[var(--ocean-light)] mb-4">
                  {selectedService.icon}
                </motion.div>
                <motion.h3 layoutId={`card-title-${selectedService.name}`} className="text-3xl font-bold text-white mb-4">
                  {selectedService.name}
                </motion.h3>
                <motion.p 
                  className="text-[var(--ocean-text-secondary)] mb-4 flex-grow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                >
                  {selectedService.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                >
                  <p className="text-2xl font-bold text-[var(--ocean-light)]">{selectedService.price}</p>
                  <p className="text-sm text-[var(--ocean-text-secondary)] italic mt-1">*All prices are estimates and may vary based on project scope.</p>
                </motion.div>
              </div>
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-700">
                <motion.img 
                  src={selectedService.sampleImage} 
                  alt={`${selectedService.name} Sample`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.4 } }}
                />
              </div>
              <motion.button 
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
              >
                <FiX size={24} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="w-full flex justify-center items-center mt-20">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide Co. All rights reserved.
        </span>
      </footer>
    </div>
  );
} 