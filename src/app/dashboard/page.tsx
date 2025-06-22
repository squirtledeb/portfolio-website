"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaMoneyCheckAlt } from 'react-icons/fa';

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

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reviewRatings, setReviewRatings] = useState<Record<string, number>>({});
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editReviewData, setEditReviewData] = useState<{ rating: number; review: string; title: string } | null>(null);

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

  // Split requests by status
  const pendingRequests = requests.filter((req: any) => req.status === 'Pending');
  const acceptedRequests = requests.filter((req: any) => req.status === 'Accepted');
  const declinedRequests = requests.filter((req: any) => req.status === 'Declined');
  const completedRequests = requests.filter((req: any) => req.status === 'Completed');
  // Show the most recent accepted request as the current project
  const currentProject = acceptedRequests.length ? acceptedRequests[0] : null;
  // Past projects: all completed, all declined, and all but the most recent accepted
  const pastProjects = [
    ...completedRequests,
    ...declinedRequests,
    ...acceptedRequests.slice(1)
  ];

  const progressValue = typeof currentProject?.progress === 'number' ? currentProject.progress : 0;

  // Add onChange handler for editing review data
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'title' | 'review') => {
    setEditReviewData(data => data ? { ...data, [field]: e.target.value } : data);
  };

  return (
    <div className="min-h-screen flex flex-col ocean-gradient pt-32 pb-16 px-4 relative overflow-hidden">
      {/* Animated Background (same as homepage) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto space-y-12 flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--ocean-light)] text-center md:text-left drop-shadow-lg">
            Welcome, <span className="capitalize">{username}</span>!
          </h1>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/dashboard/request-service')}
            className="ocean-button text-lg px-8 py-3 md:ml-8 shadow-xl hover:shadow-[0_0_24px_0_#64FFDA80]"
          >
            Buy New Service
          </motion.button>
        </div>
        {/* Services Under Review */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[var(--ocean-light)] mb-4 flex items-center gap-2">
            <FaHourglassHalf className="inline text-[var(--ocean-accent)]" /> Services Under Review
          </h2>
          <div className="bg-[var(--ocean-surface)] rounded-2xl shadow-lg p-6 border border-[var(--ocean-light)]/10">
            {pendingRequests.length ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[var(--ocean-text-secondary)]">
                    <th className="text-center pb-2">Service</th>
                    <th className="text-center pb-2">Project Name</th>
                    <th className="text-center pb-2">Status</th>
                    <th className="text-center pb-2">Requested</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((req: any, i: number) => (
                    <tr key={req.id || i} className="border-t border-[var(--ocean-light)]/10 hover:bg-[var(--ocean-deep)]/40 transition">
                      <td className="text-center py-2 font-medium">{getServiceName(req.serviceType)}</td>
                      <td className="text-center py-2">{req.projectName}</td>
                      <td className="text-center py-2">
                        <div className="flex justify-center items-center h-full">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-900 text-yellow-300 gap-1">
                            <FaHourglassHalf /> {req.status}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-2 text-xs">{new Date(req.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-[var(--ocean-text-secondary)] italic">No service requests under review.</div>
            )}
          </div>
        </section>
        {/* Current Project */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-400 mb-4 flex items-center gap-2">
            <FaCheckCircle className="inline" /> Current Project
          </h2>
          <div className="bg-[var(--ocean-surface)] rounded-2xl shadow-lg p-6 border border-[var(--ocean-light)]/10">
            {currentProject ? (
              <div className="bg-gradient-to-br from-[var(--ocean-surface)] to-[var(--ocean-deep)] rounded-3xl shadow-2xl p-8 border border-[var(--ocean-light)]/20 flex flex-col md:flex-row md:items-center md:justify-between gap-8 hover:scale-[1.01] transition-transform">
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-extrabold text-[var(--ocean-light)] truncate">{currentProject.projectName}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--ocean-accent)]/10 text-[var(--ocean-accent)] border border-[var(--ocean-accent)]/30 ml-2">
                      {getServiceName(currentProject.serviceType)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaCheckCircle className="text-green-400" />
                    <span className="text-green-400 font-bold text-lg">Accepted</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-4">
                    <div className="text-xs text-[var(--ocean-text-secondary)]">
                      <span className="font-semibold text-[var(--ocean-light)]">Requested:</span> {new Date(currentProject.created_at).toLocaleString()}
                    </div>
                    {currentProject.timeline && (
                      <div className="text-xs text-[var(--ocean-text-secondary)]">
                        <span className="font-semibold text-[var(--ocean-light)]">Timeline:</span> {currentProject.timeline}
                      </div>
                    )}
                    <div className="text-xs text-[var(--ocean-text-secondary)] col-span-1 md:col-span-2 border-t border-[var(--ocean-light)]/10 pt-2 mt-2">
                      <span className="font-semibold text-[var(--ocean-light)]">Description:</span> {currentProject.description}
                    </div>
                    {currentProject.budget && (
                      <div className="text-xs text-[var(--ocean-text-secondary)]">
                        <span className="font-semibold text-[var(--ocean-light)]">Budget:</span> {currentProject.budget}
                      </div>
                    )}
                  </div>
                  <div className="mt-6 w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold text-[var(--ocean-light)]">Progress</span>
                      <span className="text-xs text-[var(--ocean-text-secondary)]">{progressValue}%</span>
                    </div>
                    <div className="w-full bg-[var(--ocean-deep)] rounded-full h-3">
                      <div
                        className="bg-[var(--ocean-light)] h-3 rounded-full transition-all duration-500 shadow-[0_0_8px_0_#64FFDA80]"
                        style={{ width: `${progressValue}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-8 flex-shrink-0 flex items-start justify-end w-full md:w-auto">
                  {(currentProject.invoiceUrls && currentProject.invoiceUrls.length > 0) ? (
                    <div className="flex flex-col gap-2">
                      {currentProject.invoiceUrls.map((url: string, idx: number) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="ocean-button px-8 py-2 text-lg font-bold shadow-lg hover:shadow-[0_0_16px_0_#64FFDA80] focus:ring-2 focus:ring-[var(--ocean-light)]/40">Pay Invoice #{idx + 1}</a>
                      ))}
                    </div>
                  ) : currentProject.invoiceUrl ? (
                    <a href={currentProject.invoiceUrl} target="_blank" rel="noopener noreferrer" className="ocean-button px-8 py-2 text-lg font-bold shadow-lg hover:shadow-[0_0_16px_0_#64FFDA80] focus:ring-2 focus:ring-[var(--ocean-light)]/40">Pay Now</a>
                  ) : (
                    <button className="ocean-button px-8 py-2 text-lg font-bold shadow-lg opacity-60 cursor-not-allowed" disabled title="Your invoice will be available soon.">Pay Now</button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-[var(--ocean-text-secondary)] italic">No current project. Once a request is accepted, it will appear here.</div>
            )}
          </div>
        </section>
        {/* Past Projects */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[var(--ocean-light)] mb-4 flex items-center gap-2">
            <FaTimesCircle className="inline text-red-400" /> Past Projects
          </h2>
          <div className="bg-[var(--ocean-surface)] rounded-2xl shadow-lg p-6 border border-[var(--ocean-light)]/10">
            {pastProjects.length ? (
              <div className="space-y-4">
                {pastProjects.map((proj: any, idx: number) => (
                  <div key={proj.id || idx} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--ocean-light)]/10 pb-4 last:border-b-0 last:pb-0">
                    <div>
                      <div className="text-lg font-bold text-[var(--ocean-light)] mb-1">{proj.projectName}</div>
                      <div className="text-[var(--ocean-text-secondary)] mb-1">Service: {getServiceName(proj.serviceType)}</div>
                      <div className={proj.status === 'Declined' ? 'text-red-400 font-semibold flex items-center gap-1' : 'text-green-400 font-semibold flex items-center gap-1'}>
                        {proj.status === 'Declined' ? <FaTimesCircle /> : <FaCheckCircle />} {proj.status}
                      </div>
                      <div className="text-xs text-[var(--ocean-text-secondary)]">Requested: {new Date(proj.created_at).toLocaleString()}</div>
                      <div className="text-xs text-[var(--ocean-text-secondary)]">Description: {proj.description}</div>
                      {proj.timeline && <div className="text-xs text-[var(--ocean-text-secondary)]">Timeline: {proj.timeline}</div>}
                      {proj.budget && <div className="text-xs text-[var(--ocean-text-secondary)]">Budget: {proj.budget}</div>}
                    </div>
                    {proj.status === 'Completed' && !proj.reviewed && (
                      <form className="mt-4 bg-[var(--ocean-surface)]/80 p-4 rounded-xl flex flex-col gap-2" onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const rating = reviewRatings[proj._id] || 0;
                        const review = (form.elements.namedItem('review') as HTMLInputElement).value.trim();
                        const title = (form.elements.namedItem('title') as HTMLInputElement).value.trim();
                        if (!rating || rating < 1 || rating > 5) return alert('Please select a rating (1-5 stars).');
                        if (review.length < 10) return alert('Review must be at least 10 characters.');
                        if (!title) return alert('Please enter a title.');
                        // Post review to API
                        const res = await fetch('/api/reviews', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            username,
                            projectName: proj.projectName,
                            serviceType: proj.serviceType,
                            rating,
                            review,
                            title,
                            avatar: `/api/avatar/${username.charAt(0).toUpperCase()}`
                          })
                        });
                        if (res.ok) {
                          // Mark project as reviewed in backend and save the review to the project
                          await fetch(`/api/service-requests/${proj._id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              reviewed: true,
                              review: { rating, review, title } // Save review to project
                            })
                          });
                          window.location.reload();
                        } else {
                          alert('Failed to submit review.');
                        }
                      }}>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[var(--ocean-accent)] flex items-center justify-center text-xl font-bold text-white">
                            {username.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[var(--ocean-light)] font-semibold">Leave a Review</span>
                        </div>
                        <div className="flex gap-2 my-2">
                          {[1,2,3,4,5].map(star => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewRatings(r => ({ ...r, [proj._id]: star }))}
                              className="focus:outline-none"
                              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            >
                              <span className={`text-2xl ${reviewRatings[proj._id] >= star ? 'text-yellow-400' : 'text-gray-500'}`}>★</span>
                            </button>
                          ))}
                        </div>
                        <input type="hidden" name="rating" value={reviewRatings[proj._id] || 0} />
                        <input name="review" className="w-full px-3 py-2 rounded-xl bg-[rgba(10,25,47,0.85)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-light)] focus:ring-2 focus:ring-[var(--ocean-light)]/40 transition-all outline-none font-medium shadow-md placeholder:text-[var(--ocean-text-secondary)] text-sm" placeholder="Your review here..." minLength={10} required />
                        <input name="title" className="w-full px-3 py-2 rounded-xl bg-[rgba(10,25,47,0.85)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-light)] focus:ring-2 focus:ring-[var(--ocean-light)]/40 transition-all outline-none font-medium shadow-md placeholder:text-[var(--ocean-text-secondary)] text-sm" placeholder="Title: eg: Streamer" required />
                        <button type="submit" className="ocean-button px-6 py-2 mt-2">Submit Review</button>
                      </form>
                    )}
                    {proj.status === 'Completed' && proj.reviewed && proj.review && (
                      editingReviewId === proj._id && editReviewData ? (
                        // EDITING VIEW
                        <form 
                          className="mt-4 bg-[var(--ocean-surface)]/90 p-6 rounded-xl flex flex-col items-center gap-4 shadow-md w-full"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const { rating, review, title } = editReviewData;
                            if (!rating || rating < 1 || rating > 5) return alert('Please select a rating (1-5 stars).');
                            if (review.length < 10) return alert('Review must be at least 10 characters.');
                            if (!title) return alert('Please enter a title.');
                            await fetch(`/api/service-requests/${proj._id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ review: { rating, review, title } })
                            });
                            await fetch('/api/reviews', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ username, projectName: proj.projectName, rating, review, title })
                            });
                            setEditingReviewId(null);
                            setEditReviewData(null);
                            window.location.reload();
                          }}
                        >
                          <div className="flex flex-col items-center gap-2 w-full">
                            <div className="w-14 h-14 rounded-full bg-[var(--ocean-accent)] flex items-center justify-center text-2xl font-bold text-white ring-4 ring-[var(--ocean-accent)]/30 mb-1">
                              {username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[var(--ocean-light)] font-bold text-lg">Edit Your Review</span>
                          </div>
                          <div className="flex gap-1 my-1">
                            {[1,2,3,4,5].map(star => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setEditReviewData(data => data ? { ...data, rating: star } : data)}
                                className="focus:outline-none"
                                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                              >
                                <span className={`text-2xl ${editReviewData.rating >= star ? 'text-yellow-400' : 'text-gray-500'}`}>★</span>
                              </button>
                            ))}
                          </div>
                          <input 
                            name="title" 
                            value={editReviewData.title} 
                            onChange={(e) => setEditReviewData(data => data ? { ...data, title: e.target.value } : data)}
                            className="w-full text-center px-4 py-3 rounded-lg bg-[var(--ocean-deep)] text-[var(--ocean-light)] text-base font-bold border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-light)] focus:ring-2 focus:ring-[var(--ocean-light)]/40 transition-all outline-none shadow-md" 
                            placeholder="Title: eg: Streamer"
                            required 
                          />
                          <textarea 
                            name="review" 
                            value={editReviewData.review} 
                            onChange={(e) => setEditReviewData(data => data ? { ...data, review: e.target.value } : data)}
                            className="w-full text-center px-4 py-3 rounded-lg bg-[var(--ocean-deep)] text-[var(--ocean-text)] border-2 border-[var(--ocean-light)]/20 focus:border-[var(--ocean-light)] focus:ring-2 focus:ring-[var(--ocean-light)]/40 transition-all outline-none shadow-md" 
                            rows={3} 
                            minLength={10} 
                            required 
                          />
                          <div className="flex gap-4 w-full mt-2">
                            <button type="submit" className="flex-1 ocean-button py-3 text-lg">Save Changes</button>
                            <button type="button" className="flex-1 ocean-button py-3 text-lg bg-[var(--ocean-accent)] text-white" onClick={() => { setEditingReviewId(null); setEditReviewData(null); }}>Cancel</button>
                          </div>
                        </form>
                      ) : (
                        // STATIC DISPLAY VIEW
                        <div className="mt-4 bg-[var(--ocean-surface)]/80 p-6 rounded-xl flex flex-col items-center gap-4 shadow-md">
                          <div className="flex flex-col items-center gap-2 w-full">
                            <div className="w-14 h-14 rounded-full bg-[var(--ocean-accent)] flex items-center justify-center text-2xl font-bold text-white ring-4 ring-[var(--ocean-accent)]/30 mb-1">
                              {username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[var(--ocean-light)] font-bold text-lg">Your Review</span>
                          </div>
                          <div className="flex gap-1 my-1">
                            {[1,2,3,4,5].map(star => (
                              <span key={star} className={`text-2xl ${proj.review.rating >= star ? 'text-yellow-400' : 'text-gray-500'}`}>★</span>
                            ))}
                          </div>
                          <div className="font-bold text-[var(--ocean-light)] text-base mb-1">{proj.review.title}</div>
                          <div className="text-[var(--ocean-text)] text-center mb-2 w-full break-words">{proj.review.review}</div>
                          <button
                            type="button"
                            className="border border-[var(--ocean-light)] text-[var(--ocean-light)] rounded-lg px-6 py-2 mt-2 hover:bg-[var(--ocean-light)]/10 transition-colors text-base font-semibold"
                            onClick={() => {
                              setEditingReviewId(proj._id);
                              setEditReviewData({ rating: proj.review.rating, review: proj.review.review, title: proj.review.title });
                            }}
                          >
                            Edit Review
                          </button>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[var(--ocean-text-secondary)] italic">No past projects yet.</div>
            )}
          </div>
        </section>
      </div>
      <footer className="w-full flex justify-center items-center mt-8 mb-2">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide. All rights reserved.
        </span>
      </footer>
    </div>
  );
} 