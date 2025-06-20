"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const serviceTypes = [
  { id: "web-design", name: "Web Design", description: "Custom website design with modern aesthetics" },
  { id: "web-development", name: "Web Development", description: "Full-stack web application development" },
  { id: "ui-ux-design", name: "UI/UX Design", description: "User interface and experience design" },
  { id: "branding", name: "Branding", description: "Complete brand identity and strategy" },
  { id: "animation", name: "Animation", description: "Motion graphics and interactive animations" },
  { id: "landing-page", name: "Landing Page Development", description: "High-converting, responsive landing pages" },
  { id: "ecommerce", name: "eCommerce Development", description: "Online store setup and custom functionality" },
  { id: "no-code", name: "No-Code Development", description: "Webflow, Wix, Framer, or Shopify builds" },
  { id: "maintenance", name: "Maintenance & Support", description: "Ongoing updates, bug fixes, and security" },
  { id: "performance", name: "Performance Optimization", description: "Speed, SEO, and responsive improvements" },
  { id: "logo-design", name: "Logo Design", description: "Custom logos tailored to your brand's identity" },
  { id: "social-media", name: "Social Media Design", description: "Branded posts, stories, banners, and ads" },
  { id: "print-design", name: "Print Design", description: "Posters, business cards, brochures, and flyers" },
  { id: "copywriting", name: "Copywriting", description: "Website copy, product descriptions, and taglines" },
  { id: "content-strategy", name: "Content Strategy", description: "Structuring content for clarity and conversion" },
  { id: "seo-setup", name: "SEO Setup", description: "Basic search engine optimization setup" },
  { id: "discord-server", name: "Discord Server Setup", description: "Custom bots, roles, channels, and automations" },
  { id: "video-editing", name: "Video Editing", description: "Short-form content, reels, or promotional videos" },
];

export default function RequestServicePage() {
  const [formData, setFormData] = useState<{
    serviceType: string;
    projectName: string;
    description: string;
    timeline: string;
    budget: string;
    additionalNotes: string;
    samples: FileList | null;
    referenceLinks: string[];
  }>(
    {
    serviceType: "",
    projectName: "",
    description: "",
    timeline: "",
    budget: "",
    additionalNotes: "",
      samples: null,
      referenceLinks: [],
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Get username from localStorage
    const username = localStorage.getItem('oceanTideUser') || "";
    // Save to MongoDB via API
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
        router.push("/dashboard");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to submit request.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ocean-gradient px-4 relative overflow-hidden">
      {/* Animated Background (same as homepage) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center w-full">
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col w-full max-w-xl bg-[rgba(17,34,64,0.92)] backdrop-blur-xl border border-[var(--ocean-light)]/30 shadow-2xl rounded-3xl px-6 py-4"
          style={{ maxHeight: 'calc(100vh - 80px)', overflow: 'visible' }}
        >
          <div className="overflow-y-auto flex-1 px-0 pt-0 pb-2" style={{ maxHeight: '70vh' }}>
          {error && <div className="text-red-400 text-center mb-2">{error}</div>}
          {/* Service Type Dropdown */}
          <div>
            <label htmlFor="serviceType" className="block text-[var(--ocean-text-secondary)] mb-1 font-semibold text-base">
              Service Type <span className="text-[var(--ocean-accent)]">*</span>
            </label>
            <div className="relative">
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl bg-[rgba(10,25,47,0.85)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-light)] focus:ring-2 focus:ring-[var(--ocean-light)]/40 transition-all outline-none appearance-none font-medium shadow-md text-sm"
              >
                <option value="">Select a service</option>
                {serviceTypes.map(service => (
                  <option key={service.id} value={service.id} className="bg-[var(--ocean-surface)] text-[var(--ocean-text)]">
                    {service.name} — {service.description}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ocean-light)] text-lg">▼</span>
            </div>
          </div>
          {/* Project Name */}
          <div>
            <label htmlFor="projectName" className="block text-[var(--ocean-text-secondary)] mb-1 font-semibold text-base">
              Project Name <span className="text-[var(--ocean-accent)]">*</span>
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-xl bg-[rgba(10,25,47,0.85)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-light)] focus:ring-2 focus:ring-[var(--ocean-light)]/40 transition-all outline-none font-medium shadow-md placeholder:text-[var(--ocean-text-secondary)] text-sm"
              placeholder="Enter your project name"
            />
          </div>
          {/* Project Description */}
          <div>
            <label htmlFor="description" className="block text-[var(--ocean-text-secondary)] mb-1 font-semibold text-base">
              Project Description <span className="text-[var(--ocean-accent)]">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-[rgba(10,25,47,0.85)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-light)] focus:ring-2 focus:ring-[var(--ocean-light)]/40 transition-all outline-none font-medium shadow-md placeholder:text-[var(--ocean-text-secondary)] text-sm resize-none"
              placeholder="Describe your project requirements"
            />
          </div>
          {/* Timeline */}
          <div>
            <label htmlFor="timeline" className="block text-[var(--ocean-text-secondary)] mb-1 font-semibold text-base">
              Expected Timeline
            </label>
            <input
              type="text"
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-[rgba(10,25,47,0.85)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-light)] focus:ring-2 focus:ring-[var(--ocean-light)]/40 transition-all outline-none font-medium shadow-md placeholder:text-[var(--ocean-text-secondary)] text-sm"
              placeholder="e.g., 2 weeks, 1 month, etc."
            />
          </div>
          {/* Budget */}
          <div>
            <label htmlFor="budget" className="block text-[var(--ocean-text-secondary)] mb-1 font-semibold text-base">
              Budget Range
            </label>
            <input
              type="text"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-[rgba(10,25,47,0.85)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-light)] focus:ring-2 focus:ring-[var(--ocean-light)]/40 transition-all outline-none font-medium shadow-md placeholder:text-[var(--ocean-text-secondary)] text-sm"
              placeholder="e.g., $1000-$2000"
            />
          </div>
          {/* Additional Notes */}
          <div>
            <label htmlFor="additionalNotes" className="block text-[var(--ocean-text-secondary)] mb-1 font-semibold text-base">
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-[rgba(10,25,47,0.85)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-light)] focus:ring-2 focus:ring-[var(--ocean-light)]/40 transition-all outline-none font-medium shadow-md placeholder:text-[var(--ocean-text-secondary)] text-sm resize-none"
              placeholder="Any additional information you'd like to share"
            />
          </div>
            {/* Samples or References */}
            <div>
              <label className="block text-[var(--ocean-text-secondary)] mb-1 font-semibold text-base">
                Samples or References
              </label>
              {/* File Uploads (max 5) */}
              <input
                type="file"
                id="samples"
                name="samples"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.7z,.txt,.csv,.json,.xml,.mp4,.mov,.avi,.webm,.mkv"
                className="w-full px-3 py-2 rounded-xl bg-[rgba(10,25,47,0.85)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-light)] focus:ring-2 focus:ring-[var(--ocean-light)]/40 transition-all outline-none font-medium shadow-md text-sm"
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
              {/* File Previews */}
              {formData.samples && formData.samples.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.from(formData.samples).map((file, idx) => {
                    if (!(file instanceof File)) return null;
                    return (
                      <div key={idx} className="flex flex-col items-center bg-[var(--ocean-surface)] rounded-lg p-2 text-xs">
                        {file.type.startsWith('image/') ? (
                          <img src={URL.createObjectURL(file)} alt={file.name} className="w-12 h-12 object-cover rounded mb-1" />
                        ) : file.type.startsWith('video/') ? (
                          <video src={URL.createObjectURL(file)} className="w-12 h-12 object-cover rounded mb-1" />
                        ) : (
                          <span className="w-12 h-12 flex items-center justify-center bg-[var(--ocean-deep)] rounded mb-1">📄</span>
                        )}
                        <span className="truncate max-w-[60px]">{file.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* Reference Links (max 3) */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--ocean-text-secondary)] text-sm font-semibold">Reference Links</span>
                  <button
                    type="button"
                    className="text-xs px-2 py-1 rounded bg-[var(--ocean-light)] text-[var(--ocean-deep)] font-bold disabled:opacity-50"
                    onClick={() => {
                      if (formData.referenceLinks.length < 3) {
                        setFormData(prev => ({ ...prev, referenceLinks: [...prev.referenceLinks, ''] }));
                      }
                    }}
                    disabled={formData.referenceLinks.length >= 3}
                  >
                    + Add Link
                  </button>
                </div>
                {formData.referenceLinks.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder={`Reference Link #${idx + 1}`}
                      className="w-full px-3 py-2 rounded-xl bg-[rgba(10,25,47,0.85)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-light)] focus:ring-2 focus:ring-[var(--ocean-light)]/40 transition-all outline-none font-medium shadow-md text-sm"
                      value={link}
                      onChange={e => {
                        const newLinks = [...formData.referenceLinks];
                        newLinks[idx] = e.target.value;
                        setFormData(prev => ({ ...prev, referenceLinks: newLinks }));
                      }}
                    />
                    <button
                      type="button"
                      className="text-red-400 text-xs font-bold px-2 py-1 rounded hover:bg-red-400 hover:text-[var(--ocean-deep)]"
                      onClick={() => {
                        const newLinks = [...formData.referenceLinks];
                        newLinks.splice(idx, 1);
                        setFormData(prev => ({ ...prev, referenceLinks: newLinks }));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Sticky Button Bar (already styled) remains outside the scrollable div */}
          <div className="flex justify-center gap-4 py-4 sticky bottom-0 bg-[var(--ocean-surface)] z-10 border-t border-[var(--ocean-light)]/20 rounded-b-2xl" style={{marginLeft: '-1.5rem', marginRight: '-1.5rem'}}>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 rounded-xl border-2 border-[var(--ocean-light)] text-[var(--ocean-light)] hover:bg-[var(--ocean-light)] hover:text-[var(--ocean-deep)] transition-colors duration-300 font-semibold shadow-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ocean-button px-8 py-2 text-lg font-bold shadow-lg hover:shadow-[0_0_16px_0_#64FFDA80] focus:ring-2 focus:ring-[var(--ocean-light)]/40"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
      <footer className="w-full flex justify-center items-center mt-0 mb-2 z-20 sticky bottom-0">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide Co. All rights reserved.
        </span>
      </footer>
    </div>
  );
} 