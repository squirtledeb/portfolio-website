"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaMoneyCheckAlt, FaChevronDown } from 'react-icons/fa';

// Sample data (replace with real data later)
const currentProjects = [
  {
    name: "OceanTide Portfolio Website",
    status: "In Progress",
    progress: 70,
    due: "2024-07-10",
  },
];
const pastProjects = [
  {
    name: "Coral Blog Redesign",
    completed: "2024-05-22",
  },
  {
    name: "Wave Animation Demo",
    completed: "2024-04-15",
  },
];
const payments = [
  { date: "2024-06-01", amount: "$500", project: "OceanTide Portfolio Website" },
  { date: "2024-05-22", amount: "$300", project: "Coral Blog Redesign" },
];

// Add the serviceTypes array here for mapping slugs to names
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

// Helper function to get the display name from the slug
const getServiceName = (id: string) => {
  const service = serviceTypes.find(s => s.id === id);
  return service ? service.name : id;
};

const StatusChip = ({ status } : { status: string }) => {
  const statusConfig: { [key: string]: { icon: React.ElementType, label: string, styles: string } } = {
    Pending: { icon: FaHourglassHalf, label: 'Pending', styles: 'bg-yellow-900 text-yellow-300' },
    Accepted: { icon: FaCheckCircle, label: 'In Progress', styles: 'bg-blue-900 text-blue-300' },
    Completed: { icon: FaCheckCircle, label: 'Completed', styles: 'bg-green-900 text-green-300' },
    Declined: { icon: FaTimesCircle, label: 'Declined', styles: 'bg-red-900 text-red-300' },
  };

  const config = statusConfig[status] || { icon: FaHourglassHalf, label: 'Archived', styles: 'bg-gray-700 text-gray-300' };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1.5 ${config.styles}`}>
      <Icon />
      {config.label}
    </span>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication from localStorage
    const user = localStorage.getItem('oceanTideUser');
    if (!user) {
      router.push("/login");
      return;
    }
    // If admin, redirect to admin dashboard
    if (user === 'OceanTide') {
      router.push('/admin/dashboard');
      return;
    }
    setUsername(user);
    setLoading(false);
  }, [router]);

  // Fetch user service requests
  const fetchRequests = async () => {
    try {
      const user = localStorage.getItem('oceanTideUser');
      if (!user) return;
      const res = await fetch(`/api/service-requests?username=${encodeURIComponent(user)}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests || []);
      } else {
        setError(data.error || 'Failed to fetch requests');
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to fetch requests");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-[var(--ocean-light)]">Loading...</div>;
  }

  if (!username) {
    return null; // Will redirect to login
  }

  const allRequests = [...requests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="min-h-screen flex flex-col justify-between ocean-gradient pt-32 pb-0 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--ocean-light)] text-center md:text-left drop-shadow-lg">
            Welcome, <span className="capitalize">{username}</span>!
          </h1>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/dashboard/request-service')}
            className="ocean-button text-lg px-8 py-3 shadow-xl hover:shadow-[0_0_24px_0_#64FFDA80] flex-shrink-0"
          >
            Request a Service
          </motion.button>
        </div>

        <section>
          <h2 className="text-3xl font-bold text-[var(--ocean-light)] mb-6">All My Requests</h2>
              <div className="space-y-4">
            {allRequests.length > 0 ? (
              allRequests.map((req) => (
                <motion.div
                  key={req.id}
                  layout
                  className="bg-[var(--ocean-surface)] rounded-xl shadow-md border border-[var(--ocean-light)]/10 overflow-hidden"
                >
                  <motion.div
                    layout
                    onClick={() => setExpandedRequestId(expandedRequestId === req.id ? null : req.id)}
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-[var(--ocean-deep)]/40 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-lg text-[var(--ocean-light)]">{req.projectName}</h4>
                      <p className="text-sm text-[var(--ocean-accent)] font-semibold">{getServiceName(req.serviceType)}</p>
                      </div>
                    <div className="flex items-center gap-4">
                      <StatusChip status={req.status} />
                      <motion.div 
                        animate={{ rotate: expandedRequestId === req.id ? 180 : 0 }} 
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="text-[var(--ocean-light)]"
                      >
                        <FaChevronDown />
                      </motion.div>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {expandedRequestId === req.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="p-6 border-t border-[var(--ocean-light)]/10"
                      >
                        {/* Detailed content based on status */}
                        <p className="text-sm text-[var(--ocean-text-secondary)] mb-4">{req.description}</p>
                        
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
                          <div><span className="font-semibold text-[var(--ocean-light)]">Timeline:</span> {req.timeline || "N/A"}</div>
                          <div><span className="font-semibold text-[var(--ocean-light)]">Budget:</span> {req.budget ? `$${req.budget}` : "N/A"}</div>
                          <div className="col-span-2 text-xs text-gray-400">Requested on {new Date(req.created_at).toLocaleDateString()}</div>
                        </div>

                        {req.status === 'Accepted' && (
                          <>
                            <div className="w-full mt-4">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-semibold text-[var(--ocean-light)]">Progress</span>
                                <span className="text-sm text-[var(--ocean-accent)] font-bold">{req.progress || 0}%</span>
                            </div>
                              <div className="w-full bg-[var(--ocean-deep)] rounded-full h-3.5 border border-[var(--ocean-light)]/10">
                                <div
                                  className="bg-gradient-to-r from-[var(--ocean-accent)] to-[#64ffda80] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_0_#64FFDA80]"
                                  style={{ width: `${req.progress || 0}%` }}
                                />
                          </div>
                            </div>
                            {(req.invoiceUrls && req.invoiceUrls.length > 0) && (
                              <div className="flex justify-end mt-4">
                                <motion.a
                                  href={req.invoiceUrls[0]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ocean-button-secondary flex items-center gap-2"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <FaMoneyCheckAlt /> View Invoice
                                </motion.a>
                          </div>
                            )}
                          </>
                        )}

                        {/* Placeholder for review form */}
                        {req.status === 'Completed' && (
                           <div className="mt-4 bg-[var(--ocean-surface)]/80 p-4 rounded-xl">
                            <p className="text-center text-[var(--ocean-light)]">Review section coming soon.</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 bg-[var(--ocean-surface)] rounded-xl border border-[var(--ocean-light)]/10">
                <p className="text-[var(--ocean-text-secondary)]">You have no service requests yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
      <footer className="w-full flex justify-center items-center">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide. All rights reserved.
        </span>
      </footer>
    </div>
  );
} 