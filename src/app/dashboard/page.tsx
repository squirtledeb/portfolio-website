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

const serviceTypes = [
  { id: "web-design", name: "Web Design", description: "Custom website design with modern aesthetics" },
  { id: "web-development", name: "Web Development", description: "Full-stack web application development" },
  { id: "ui-design", name: "UI/UX Design", description: "User interface and experience design" },
  { id: "branding", name: "Branding", description: "Complete brand identity and strategy" },
  { id: "animation", name: "Animation", description: "Motion graphics and interactive animations" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication from localStorage
    const user = localStorage.getItem('oceanTideUser');
    if (!user) {
      router.push("/login");
      return;
    }
    // If admin, redirect to admin dashboard
    if (user === 'OceanTideCo') {
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
  // Show the most recent accepted request as the current project
  const currentProject = acceptedRequests.length ? acceptedRequests[0] : null;
  const pastProjects = [...declinedRequests, ...acceptedRequests.slice(1)]; // All but the most recent accepted

  const progressValue = typeof currentProject?.progress === 'number' ? currentProject.progress : 0;

  return (
    <div className="min-h-screen ocean-gradient pt-32 pb-16 px-4 relative overflow-hidden">
      {/* Animated Background (same as homepage) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
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
                      <td className="text-center py-2 font-medium">{serviceTypes.find(s => s.id === req.serviceType)?.name || req.serviceType}</td>
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
                      {serviceTypes.find(s => s.id === currentProject.serviceType)?.name || currentProject.serviceType}
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
                  {currentProject.invoiceUrl ? (
                    <a
                      href={currentProject.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ocean-button px-8 py-2 text-lg font-bold shadow-lg hover:shadow-[0_0_16px_0_#64FFDA80] focus:ring-2 focus:ring-[var(--ocean-light)]/40"
                    >
                      Pay Now
                    </a>
                  ) : (
                    <button
                      className="ocean-button px-8 py-2 text-lg font-bold shadow-lg opacity-60 cursor-not-allowed"
                      disabled
                      title="Your invoice will be available soon."
                    >
                      Pay Now
                    </button>
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
                      <div className="text-[var(--ocean-text-secondary)] mb-1">Service: {serviceTypes.find(s => s.id === proj.serviceType)?.name || proj.serviceType}</div>
                      <div className={proj.status === 'Declined' ? 'text-red-400 font-semibold flex items-center gap-1' : 'text-green-400 font-semibold flex items-center gap-1'}>
                        {proj.status === 'Declined' ? <FaTimesCircle /> : <FaCheckCircle />} {proj.status}
                      </div>
                      <div className="text-xs text-[var(--ocean-text-secondary)]">Requested: {new Date(proj.created_at).toLocaleString()}</div>
                      <div className="text-xs text-[var(--ocean-text-secondary)]">Description: {proj.description}</div>
                      {proj.timeline && <div className="text-xs text-[var(--ocean-text-secondary)]">Timeline: {proj.timeline}</div>}
                      {proj.budget && <div className="text-xs text-[var(--ocean-text-secondary)]">Budget: {proj.budget}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[var(--ocean-text-secondary)] italic">No past projects yet.</div>
            )}
          </div>
        </section>
        {/* Payments (Optional/Placeholder) */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[var(--ocean-light)] mb-4 flex items-center gap-2">
            <FaMoneyCheckAlt className="inline text-[var(--ocean-accent)]" /> Recent Payments
          </h2>
          <div className="bg-[var(--ocean-surface)] rounded-2xl shadow-lg p-6 border border-[var(--ocean-light)]/10">
            {requests.filter((req: any) => req.paid).length ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[var(--ocean-text-secondary)]">
                    <th className="text-center pb-2">Project</th>
                    <th className="text-center pb-2">Service</th>
                    <th className="text-center pb-2">Amount</th>
                    <th className="text-center pb-2">Paid On</th>
                    <th className="text-center pb-2">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.filter((req: any) => req.paid).sort((a: any, b: any) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()).map((req: any, i: number) => (
                    <tr key={req._id || i} className="border-t border-[var(--ocean-light)]/10 hover:bg-[var(--ocean-deep)]/40 transition">
                      <td className="text-center py-2 font-medium">{req.projectName}</td>
                      <td className="text-center py-2">{serviceTypes.find(s => s.id === req.serviceType)?.name || req.serviceType}</td>
                      <td className="text-center py-2">{req.paymentDetails?.amount?.value ? `$${req.paymentDetails.amount.value}` : (req.paymentDetails?.amount || req.amount || '-')}</td>
                      <td className="text-center py-2 text-xs">{req.paidAt ? new Date(req.paidAt).toLocaleString() : '-'}</td>
                      <td className="text-center py-2">
                        {req.invoiceUrl ? (
                          <a href={req.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--ocean-accent)] underline hover:text-[var(--ocean-light)] text-xs">View Invoice</a>
                        ) : (
                          <span className="text-[var(--ocean-text-secondary)] text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-[var(--ocean-text-secondary)] italic">No payments yet. Paid invoices will appear here.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
} 