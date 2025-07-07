"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiUpload, FiLink2, FiTrash2, FiCheck, FiArrowRight, FiFileText, FiCalendar, FiDollarSign, FiMessageSquare } from 'react-icons/fi';

const serviceTypes = [
  { id: "web-design", name: "Web Design", description: "Custom website design with modern aesthetics", icon: "🎨" },
  { id: "web-development", name: "Web Development", description: "Full-stack web application development", icon: "💻" },
  { id: "ui-ux-design", name: "UI/UX Design", description: "User interface and experience design", icon: "✨" },
  { id: "branding", name: "Branding", description: "Complete brand identity and strategy", icon: "🏷️" },
  { id: "animation", name: "Animation", description: "Motion graphics and interactive animations", icon: "🎬" },
  { id: "landing-page", name: "Landing Page Development", description: "High-converting, responsive landing pages", icon: "📄" },
  { id: "ecommerce", name: "eCommerce Development", description: "Online store setup and custom functionality", icon: "🛒" },
  { id: "no-code", name: "No-Code Development", description: "Webflow, Wix, Framer, or Shopify builds", icon: "🔧" },
  { id: "maintenance", name: "Maintenance & Support", description: "Ongoing updates, bug fixes, and security", icon: "🔧" },
  { id: "performance", name: "Performance Optimization", description: "Speed, SEO, and responsive improvements", icon: "⚡" },
  { id: "logo-design", name: "Logo Design", description: "Custom logos tailored to your brand's identity", icon: "🎯" },
  { id: "social-media", name: "Social Media Design", description: "Branded posts, stories, banners, and ads", icon: "📱" },
  { id: "print-design", name: "Print Design", description: "Posters, business cards, brochures, and flyers", icon: "🖨️" },
  { id: "copywriting", name: "Copywriting", description: "Website copy, product descriptions, and taglines", icon: "✍️" },
  { id: "content-strategy", name: "Content Strategy", description: "Structuring content for clarity and conversion", icon: "📊" },
  { id: "seo-setup", name: "SEO Setup", description: "Basic search engine optimization setup", icon: "🔍" },
  { id: "discord-server", name: "Discord Server Setup", description: "Custom bots, roles, channels, and automations", icon: "🎮" },
  { id: "video-editing", name: "Video Editing", description: "Short-form content, reels, or promotional videos", icon: "🎥" },
];

export default function RequestServicePage() {
  const [formData, setFormData] = useState<{
    serviceType: string;
    projectName: string;
    description: string;
    timeline: string;
    budgetMin: string;
    budgetMax: string;
    additionalNotes: string;
    samples: FileList | null;
    referenceLinks: string[];
  }>(
    {
    serviceType: "",
    projectName: "",
    description: "",
    timeline: "",
    budgetMin: "",
    budgetMax: "",
    additionalNotes: "",
      samples: null,
      referenceLinks: [],
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [newLink, setNewLink] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate form completion percentage
  const completionPercentage = () => {
    const fields = ['serviceType', 'projectName', 'description'];
    const completed = fields.filter(field => formData[field as keyof typeof formData] && formData[field as keyof typeof formData] !== '').length;
    return Math.round((completed / fields.length) * 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Only allow numbers and at most one decimal for budgetMin and budgetMax
    if (name === 'budgetMin' || name === 'budgetMax') {
      // Remove all non-digit and non-dot characters, allow only one dot
      let sanitized = value.replace(/[^\d.]/g, '');
      const parts = sanitized.split('.');
      if (parts.length > 2) {
        sanitized = parts[0] + '.' + parts.slice(1).join('');
      }
      setFormData(prev => ({ ...prev, [name]: sanitized }));
    } else {
    setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Get username from localStorage
    const username = localStorage.getItem('oceanTideUser') || "";
    
    try {
      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, ...formData }),
      });
      const data = await res.json();
      setLoading(false);
      
      if (!data.success) {
        setError(data.error || 'Failed to submit request.');
      } else {
        setSuccess(true);
        setTimeout(() => {
        router.push("/dashboard");
        }, 2000);
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to submit request.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = e.dataTransfer.files;
      if (files.length > 5) {
        alert('You can upload a maximum of 5 files.');
        return;
      }
      setFormData(prev => ({ ...prev, samples: files }));
    }
  };

  // Success animation
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center ocean-gradient">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="w-24 h-24 bg-[var(--ocean-accent)] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiCheck className="text-white text-4xl" />
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Request Submitted!
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-[var(--ocean-light)] text-lg"
          >
            Redirecting to dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-start px-4 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, var(--ocean-deep), var(--ocean-surface))' }}>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mt-8 mb-6"
      >
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[var(--ocean-light)] text-sm font-medium">Form Progress</span>
            <span className="text-[var(--ocean-accent)] text-sm font-bold">{completionPercentage()}%</span>
          </div>
          <div className="w-full bg-[rgba(17,34,64,0.5)] rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage()}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-r from-[var(--ocean-accent)] to-[var(--ocean-light)] h-2 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 flex-1 flex justify-center w-full"
      >
        <form
          onSubmit={handleSubmit}
          className="relative min-h-[600px] w-full max-w-5xl bg-[rgba(17,34,64,0.8)] backdrop-blur-2xl border border-[var(--ocean-light)]/30 shadow-2xl rounded-3xl px-8 py-8 flex flex-col"
          style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'visible' }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
            <h1 className="text-3xl font-bold text-white mb-2">Request a Project</h1>
            <p className="text-[var(--ocean-light)]">Tell us about your vision and we'll bring it to life</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-lg font-semibold bg-red-500 text-white shadow hover:bg-red-600 transition-colors text-sm"
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg font-semibold bg-[var(--ocean-accent)] text-white shadow hover:bg-[var(--ocean-light)] transition-colors text-sm"
              >
                Submit Request
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 w-full h-full">
            {/* Left column: Project details */}
            <div className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/20 border border-red-500/30 text-red-400 text-center mb-4 p-3 rounded-xl"
                >
                  {error}
                </motion.div>
              )}

          {/* Service Type Dropdown */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-3 group"
              >
                <label className="flex items-center gap-2 text-[var(--ocean-text-secondary)] font-semibold text-base mb-2"><FiFileText className="inline" /> Service Type <span className="text-[var(--ocean-accent)]">*</span></label>
                <div className="relative">
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    required
                        className="w-full px-4 py-3 rounded-xl bg-[rgba(10,25,47,0.9)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-accent)] focus:ring-2 focus:ring-[var(--ocean-accent)]/40 transition-all outline-none appearance-none font-medium shadow-lg text-sm pr-10"
                  >
                    <option value="">Select a service</option>
                    {serviceTypes.map(service => (
                      <option key={service.id} value={service.id} className="bg-[var(--ocean-surface)] text-[var(--ocean-text)]">
                            {service.icon} {service.name} — {service.description}
                      </option>
                    ))}
                  </select>
                      <motion.span
                        animate={{ rotate: formData.serviceType ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="pointer-events-none absolute right-4 top-1/4 -translate-y-1/4 flex items-center justify-center h-6"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <polygon points="10,14 16,7 4,7" fill="var(--ocean-accent)" />
                        </svg>
                      </motion.span>
                </div>
              </motion.div>

          {/* Project Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-3 group relative"
              >
                <label className="flex items-center gap-2 text-[var(--ocean-text-secondary)] font-semibold text-base mb-2"><FiFileText className="inline" /> Project Name <span className="text-[var(--ocean-accent)]">*</span></label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                      className="peer w-full px-4 py-2 rounded-xl bg-[rgba(10,25,47,0.9)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-accent)] focus:ring-2 focus:ring-[var(--ocean-accent)]/40 transition-all outline-none font-medium shadow-lg placeholder-transparent text-sm pr-10"
                  placeholder="Enter your project name"
                />
              </motion.div>

          {/* Project Description */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mb-3 group relative"
              >
                <label className="flex items-center gap-2 text-[var(--ocean-text-secondary)] font-semibold text-base mb-2"><FiMessageSquare className="inline" /> Project Description <span className="text-[var(--ocean-accent)]">*</span></label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                      rows={3}
                      className="peer w-full px-4 py-2 rounded-xl bg-[rgba(10,25,47,0.9)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-accent)] focus:ring-2 focus:ring-[var(--ocean-accent)]/40 transition-all outline-none font-medium shadow-lg placeholder-transparent text-sm resize-none pr-10"
                  placeholder="Describe your project requirements"
                />
              </motion.div>

              {/* Timeline and Budget Row */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3"
              >
          {/* Timeline */}
                <div className="group relative">
                  <label className="flex items-center gap-2 text-[var(--ocean-text-secondary)] font-semibold text-base mb-2"><FiCalendar className="inline" /> Timeline</label>
                  <input
                    type="text"
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="peer w-full px-4 py-3 rounded-xl bg-[rgba(10,25,47,0.9)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-accent)] focus:ring-2 focus:ring-[var(--ocean-accent)]/40 transition-all outline-none font-medium shadow-lg placeholder-transparent text-sm pr-10"
                          placeholder="e.g., 2 weeks, 1 month"
                        />
                </div>

          {/* Budget Range */}
                <div className="group relative">
                  <label className="flex items-center gap-2 text-[var(--ocean-text-secondary)] font-semibold text-base mb-2"><FiDollarSign className="inline" /> Budget Range <span className="text-[var(--ocean-accent)]">*</span></label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      id="budgetMin"
                      name="budgetMin"
                      value={formData.budgetMin}
                      onChange={handleChange}
                      required
                      className="peer w-full px-4 py-3 pr-10 rounded-xl bg-[rgba(10,25,47,0.9)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-accent)] focus:ring-2 focus:ring-[var(--ocean-accent)]/40 transition-all outline-none font-medium shadow-lg placeholder-transparent text-sm appearance-none custom-number-input"
                      placeholder="Min"
                    />
                    <span className="flex items-center px-2 text-[var(--ocean-text-secondary)] font-semibold">to</span>
                  <input
                      type="number"
                      min="0"
                      step="any"
                      id="budgetMax"
                      name="budgetMax"
                      value={formData.budgetMax}
                    onChange={handleChange}
                      required
                      className="peer w-full px-4 py-3 pr-10 rounded-xl bg-[rgba(10,25,47,0.9)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-accent)] focus:ring-2 focus:ring-[var(--ocean-accent)]/40 transition-all outline-none font-medium shadow-lg placeholder-transparent text-sm appearance-none custom-number-input"
                      placeholder="Max"
                  />
                  </div>
                </div>
              </motion.div>

          {/* Additional Notes */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-[var(--ocean-text-secondary)] font-semibold text-base mb-2"><FiMessageSquare className="inline" /> Additional Notes</label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-[rgba(10,25,47,0.9)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-accent)] focus:ring-2 focus:ring-[var(--ocean-accent)]/40 transition-all outline-none font-medium shadow-lg text-sm resize-none"
                    placeholder="Any additional information you'd like to share"
                  />
                </div>
            </div>
            {/* Right column: References */}
            <div className="relative flex flex-col">
              {/* Samples or References */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mb-6"
              >
                <label className="flex items-center gap-2 text-[var(--ocean-text-secondary)] font-semibold text-base mb-2">Samples or References</label>
                
                {/* File Upload Dropzone */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex flex-col items-center justify-center w-full min-h-[140px] bg-[rgba(17,34,64,0.5)] border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer mb-4 ${
                    dragActive 
                      ? 'border-[var(--ocean-accent)] bg-[var(--ocean-accent)]/10' 
                      : 'border-[var(--ocean-light)]/30 hover:border-[var(--ocean-accent)]/60 hover:bg-[var(--ocean-light)]/10'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <motion.div
                    animate={{ scale: dragActive ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiUpload className="text-4xl text-[var(--ocean-accent)] mb-3" />
                  </motion.div>
                  <span className="text-[var(--ocean-light)] font-medium text-sm mb-1">
                    {dragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
                  </span>
                  <span className="text-[var(--ocean-text-secondary)] text-xs">
                    Max 5 files • Images, videos, documents
                  </span>
                  <span className="absolute top-3 right-3 bg-[var(--ocean-accent)]/20 text-[var(--ocean-accent)] text-xs font-bold px-3 py-1 rounded-full">
                    {formData.samples ? `${formData.samples.length}/5` : '0/5'}
                  </span>
              <input
                type="file"
                id="samples"
                name="samples"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.7z,.txt,.csv,.json,.xml,.mp4,.mov,.avi,.webm,.mkv"
                    className="hidden"
                    ref={fileInputRef}
                onChange={e => {
                  const files = e.target.files;
                  if (files && files.length > 5) {
                    alert('You can upload a maximum of 5 files.');
                    return;
                  }
                  setFormData(prev => ({ ...prev, samples: files }));
                }}
                disabled={formData.samples !== null && formData.samples.length >= 5}
              />
                </motion.div>

              {/* File Previews */}
                <AnimatePresence>
              {formData.samples && formData.samples.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-3"
                    >
                  {Array.from(formData.samples).map((file, idx) => {
                    if (!(file instanceof File)) return null;
                    return (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative flex flex-col items-center bg-[rgba(17,34,64,0.7)] border border-[var(--ocean-light)]/20 rounded-xl p-3 text-xs shadow-lg min-w-[90px] max-w-[110px]"
                          >
                        {file.type.startsWith('image/') ? (
                              <img src={URL.createObjectURL(file)} alt={file.name} className="w-14 h-14 object-cover rounded-lg mb-2" />
                        ) : file.type.startsWith('video/') ? (
                              <video src={URL.createObjectURL(file)} className="w-14 h-14 object-cover rounded-lg mb-2" />
                            ) : (
                              <span className="w-14 h-14 flex items-center justify-center bg-[var(--ocean-deep)] rounded-lg mb-2 text-2xl">📄</span>
                            )}
                          <span className="truncate max-w-[70px] text-[var(--ocean-light)] text-center">{file.name}</span>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.2, color: '#f87171' }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                            onClick={() => {
                              if (!formData.samples) return;
                              const arr = Array.from(formData.samples);
                              arr.splice(idx, 1);
                              const dt = new DataTransfer();
                              arr.forEach(f => dt.items.add(f));
                              setFormData(prev => ({ ...prev, samples: dt.files.length ? dt.files : null }));
                            }}
                            title="Remove file"
                          >
                            <FiTrash2 size={12} />
                          </motion.button>
                        </motion.div>
                    );
                  })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reference Links Section */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                  <span className="text-[var(--ocean-text-secondary)] font-semibold text-base">Reference Links</span>
                    <span className="bg-[var(--ocean-accent)]/20 text-[var(--ocean-accent)] text-xs font-bold px-2 py-1 rounded-full">
                      {formData.referenceLinks.length}/3
                    </span>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 text-xs px-3 py-2 rounded-xl bg-[var(--ocean-accent)] text-white font-bold shadow-lg ml-auto hover:bg-[var(--ocean-light)] transition-colors"
                      onClick={() => setShowLinkInput(true)}
                      disabled={formData.referenceLinks.length >= 3 || showLinkInput}
                    >
                      <FiPlus /> Add Link
                    </motion.button>
                  </div>

                  {/* Animated Input for New Link */}
                  <AnimatePresence>
                    {showLinkInput && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="flex items-center gap-2 mb-3"
                      >
                      <input
                        type="url"
                          className="flex-1 px-4 py-3 rounded-xl bg-[rgba(10,25,47,0.9)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-accent)] focus:ring-2 focus:ring-[var(--ocean-accent)]/40 transition-all outline-none font-medium shadow-lg text-sm pr-10"
                          placeholder="Paste reference link (URL)"
                          value={newLink}
                          onChange={e => setNewLink(e.target.value)}
                          autoFocus
                        />
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-[var(--ocean-accent)] text-white rounded-lg px-4 py-3 font-bold shadow-lg hover:bg-[var(--ocean-light)] transition-colors"
                          onClick={() => {
                            if (newLink.trim() && formData.referenceLinks.length < 3) {
                              setFormData(prev => ({ ...prev, referenceLinks: [...prev.referenceLinks, newLink.trim()] }));
                              setNewLink('');
                              setShowLinkInput(false);
                            }
                          }}
                          disabled={!newLink.trim()}
                        >
                          Add
                        </motion.button>
                        <motion.button
                        type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-red-400 text-white rounded-lg px-4 py-3 font-bold shadow-lg hover:bg-red-500 transition-colors"
                        onClick={() => {
                            setShowLinkInput(false);
                            setNewLink('');
                          }}
                        >
                          Cancel
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reference Link Cards */}
                  <AnimatePresence>
                    {formData.referenceLinks.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-wrap gap-3"
                      >
                        {formData.referenceLinks.map((link, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative flex items-center gap-2 bg-[rgba(17,34,64,0.7)] border border-[var(--ocean-light)]/20 rounded-xl px-4 py-3 text-xs text-[var(--ocean-light)] shadow-lg min-w-[200px] max-w-[280px]"
                          >
                            <FiLink2 className="text-[var(--ocean-accent)] text-lg" />
                            <a href={link} target="_blank" rel="noopener noreferrer" className="truncate underline hover:text-[var(--ocean-accent)] transition-colors max-w-[180px]">{link}</a>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.2, color: '#f87171' }}
                              whileTap={{ scale: 0.9 }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                              onClick={() => setFormData(prev => ({ ...prev, referenceLinks: prev.referenceLinks.filter((_, i) => i !== idx) }))}
                              title="Remove link"
                            >
                              <FiTrash2 size={12} />
                            </motion.button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
              </motion.div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 