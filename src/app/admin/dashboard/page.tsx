"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaHourglassHalf, FaCheck, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

const serviceTypes = [
  { id: "web-design", name: "Web Design", description: "Custom website design with modern aesthetics" },
  { id: "web-development", name: "Web Development", description: "Full-stack web application development" },
  { id: "ui-design", name: "UI/UX Design", description: "User interface and experience design" },
  { id: "branding", name: "Branding", description: "Complete brand identity and strategy" },
  { id: "animation", name: "Animation", description: "Motion graphics and interactive animations" },
];

const statusOptions = [
  { label: "Pending", color: "bg-yellow-900 text-yellow-300", icon: <FaHourglassHalf /> },
  { label: "Accepted", color: "bg-green-900 text-green-300", icon: <FaCheckCircle /> },
  { label: "Declined", color: "bg-red-900 text-red-300", icon: <FaTimesCircle /> },
  { label: "Completed", color: "bg-blue-900 text-blue-300", icon: <FaCheck /> },
];

export default function AdminDashboardPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [modal, setModal] = useState({ open: false, reqId: null });
  const [invoiceForm, setInvoiceForm] = useState({ email: '', projectName: '', description: '', amount: '' });
  const [manualInvoiceModal, setManualInvoiceModal] = useState({ open: false, reqId: null, invoiceUrl: '' });
  const [pendingProgress, setPendingProgress] = useState<{ [id: string]: number }>({});
  const router = useRouter();

  // Only allow admin user
  useEffect(() => {
    const user = localStorage.getItem('oceanTideUser');
    if (user !== 'OceanTideCo') {
      router.push('/dashboard');
    }
  }, [router]);

  // Fetch all service requests
  const fetchRequests = async () => {
    try {
      console.log('Fetching service requests...');
      const res = await fetch("/api/service-requests");
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      if (data.success) {
        setRequests(data.requests || []);
        console.log('Requests set:', data.requests);
      } else {
        console.error('API returned error:', data.error);
        setError(data.error || 'Failed to fetch requests');
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || "Failed to fetch requests");
      setLoading(false);
    }
  };

  // Fetch all service requests (poll every 5s)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    fetchRequests();
    interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update status
  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/service-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data.success) alert(data.error || "Failed to update status");
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
    setUpdatingId(null);
  }

  return (
    <div className="min-h-screen flex flex-col ocean-gradient pt-32 pb-16 px-4 relative overflow-hidden">
      {/* Animated Background (same as homepage) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--ocean-light)] text-center md:text-left">
            Owner Dashboard
          </h1>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={fetchRequests}
            className="ocean-button text-lg px-6 py-2"
          >
            Refresh Requests
          </motion.button>
        </div>
        {/* Pending Projects */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--ocean-light)] mb-4">Pending Projects</h2>
          {requests.filter(r => r.status === 'Pending').length === 0 ? (
            <div className="text-[var(--ocean-text-secondary)] italic">No pending projects.</div>
          ) : (
            <div className={`grid gap-6 ${requests.filter(r => r.status === 'Pending').length === 1 ? 'grid-cols-1 justify-center' : 'grid-cols-1 md:grid-cols-2'}`}>
              {requests.filter(r => r.status === 'Pending').map((req) => (
                <div key={req._id} className="bg-[var(--ocean-surface)] rounded-2xl shadow-xl flex flex-col p-4 md:p-6 overflow-hidden w-full">
                  {/* Header */}
                  <div className="flex items-center justify-between px-2 md:px-4 pt-2 md:pt-4 pb-2 border-b border-[var(--ocean-light)]/10 bg-[var(--ocean-surface)]">
                    <div>
                      <div className="text-2xl font-extrabold text-[var(--ocean-accent)] leading-tight">{req.projectName}</div>
                      <div className="text-xs text-[var(--ocean-text-secondary)] font-medium">by {req.username}</div>
                    </div>
                    {/* Status Chips */}
                    <div className="flex gap-2 items-center my-1">
                      {statusOptions.map(opt => (
                        <button
                          key={opt.label}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1 shadow-sm border transition-all duration-150
                            ${req.status === opt.label ? `${opt.color} border-white/40 scale-105` : "bg-[var(--ocean-surface)] text-[var(--ocean-text-secondary)] border-[var(--ocean-light)]/10 hover:scale-105 hover:border-white/30"}
                          `}
                          style={{ outline: req.status === opt.label ? "2px solid #64FFDA" : "none" }}
                          onClick={async () => {
                            if (req.status !== opt.label) {
                              if (opt.label === 'Completed') {
                                setUpdatingId(req._id);
                                try {
                                  await fetch(`/api/service-requests/${req._id}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'Completed', progress: 100 }),
                                  });
                                  fetchRequests();
                                } catch (err) {
                                  alert('Failed to update status to Completed');
                                }
                                setUpdatingId(null);
                              } else if (opt.label === 'Declined') {
                                setUpdatingId(req._id);
                                try {
                                  await fetch(`/api/service-requests/${req._id}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'Declined', progress: null }),
                                  });
                                  fetchRequests();
                                } catch (err) {
                                  alert('Failed to update status to Declined');
                                }
                                setUpdatingId(null);
                              } else {
                                await updateStatus(req._id, opt.label);
                                fetchRequests();
                              }
                            }
                          }}
                          disabled={updatingId === req._id}
                          title={opt.label}
                        >
                          {opt.icon} {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="px-2 md:px-4 pt-3 pb-1">
                    <div className="text-base font-bold text-[var(--ocean-light)] flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[var(--ocean-accent)]"></span>
                      {serviceTypes.find(s => s.id === req.serviceType)?.name || req.serviceType}
                    </div>
                  </div>

                  {/* Meta Info Row */}
                  <div className="px-2 md:px-4 py-2 flex flex-col md:flex-row md:items-center md:gap-6 gap-1 text-xs text-[var(--ocean-text-secondary)] border-b border-[var(--ocean-light)]/10">
                    <div>Requested: <span className="font-semibold">{new Date(req.created_at).toLocaleString()}</span></div>
                  </div>

                  {/* Reference Links */}
                  {req.referenceLinks && req.referenceLinks.length > 0 && (
                    <div className="px-2 md:px-4 py-3 border-b border-[var(--ocean-light)]/10 bg-[var(--ocean-surface)]/80">
                      <div className="text-xs text-[var(--ocean-text-secondary)] font-semibold mb-1 flex items-center gap-1">
                        <svg className="w-4 h-4 text-[var(--ocean-accent)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656m-3.656-3.656a4 4 0 015.656 0m-7.778 7.778a6 6 0 018.486 0m-10.607-2.121a8 8 0 0111.314 0" /></svg>
                        Reference Links
                      </div>
                      <ul className="space-y-1">
                        {req.referenceLinks.map((link: string, idx: number) => (
                          <li key={idx}>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--ocean-accent)] underline hover:text-[var(--ocean-light)] text-xs flex items-center gap-1"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-7 7h7m-7 0v-7" /></svg>
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="px-2 md:px-4 py-4 flex flex-wrap gap-3 items-center justify-end bg-[var(--ocean-surface)]">
                    {/* Pending: Remove only */}
                    {req.status === 'Pending' && (
                      <button
                        className="ocean-button bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded"
                        onClick={async () => {
                          if (confirm('Are you sure you want to permanently remove this service request? This cannot be undone.')) {
                            try {
                              const res = await fetch(`/api/service-requests/${req._id}`, { method: 'DELETE' });
                              const data = await res.json();
                              if (data.success) {
                                fetchRequests();
                                alert('✅ Service request removed successfully!');
                              } else {
                                alert('Failed to remove service request: ' + (data.error || 'Unknown error'));
                              }
                            } catch (error) {
                              alert('Failed to remove service request: ' + error);
                            }
                          }
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Accepted Projects */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--ocean-light)] mb-4">Accepted Projects</h2>
          {requests.filter(r => r.status === 'Accepted').length === 0 ? (
            <div className="text-[var(--ocean-text-secondary)] italic">No accepted projects.</div>
          ) : (
            <div className={`grid gap-6 ${requests.filter(r => r.status === 'Accepted').length === 1 ? 'grid-cols-1 justify-center' : 'grid-cols-1 md:grid-cols-2'}`}>
              {requests.filter(r => r.status === 'Accepted').map((req) => (
                <div key={req._id} className="bg-[var(--ocean-surface)] rounded-2xl shadow-xl flex flex-col p-4 md:p-6 overflow-hidden w-full">
                  {/* Header */}
                  <div className="flex items-center justify-between px-2 md:px-4 pt-2 md:pt-4 pb-2 border-b border-[var(--ocean-light)]/10 bg-[var(--ocean-surface)]">
                    <div>
                      <div className="text-2xl font-extrabold text-[var(--ocean-accent)] leading-tight">{req.projectName}</div>
                      <div className="text-xs text-[var(--ocean-text-secondary)] font-medium">by {req.username}</div>
                    </div>
                    {/* Status Chips */}
                    <div className="flex gap-2 items-center my-1">
                      {statusOptions.map(opt => (
                        <button
                          key={opt.label}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1 shadow-sm border transition-all duration-150
                            ${req.status === opt.label ? `${opt.color} border-white/40 scale-105` : "bg-[var(--ocean-surface)] text-[var(--ocean-text-secondary)] border-[var(--ocean-light)]/10 hover:scale-105 hover:border-white/30"}
                          `}
                          style={{ outline: req.status === opt.label ? "2px solid #64FFDA" : "none" }}
                          onClick={async () => {
                            if (req.status !== opt.label) {
                              if (opt.label === 'Completed') {
                                setUpdatingId(req._id);
                                try {
                                  await fetch(`/api/service-requests/${req._id}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'Completed', progress: 100 }),
                                  });
                                  fetchRequests();
                                } catch (err) {
                                  alert('Failed to update status to Completed');
                                }
                                setUpdatingId(null);
                              } else if (opt.label === 'Declined') {
                                setUpdatingId(req._id);
                                try {
                                  await fetch(`/api/service-requests/${req._id}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'Declined', progress: null }),
                                  });
                                  fetchRequests();
                                } catch (err) {
                                  alert('Failed to update status to Declined');
                                }
                                setUpdatingId(null);
                              } else {
                                await updateStatus(req._id, opt.label);
                                fetchRequests();
                              }
                            }
                          }}
                          disabled={updatingId === req._id}
                          title={opt.label}
                        >
                          {opt.icon} {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="px-2 md:px-4 pt-3 pb-1">
                    <div className="text-base font-bold text-[var(--ocean-light)] flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[var(--ocean-accent)]"></span>
                      {serviceTypes.find(s => s.id === req.serviceType)?.name || req.serviceType}
                    </div>
                  </div>

                  {/* Meta Info Row */}
                  <div className="px-2 md:px-4 py-2 flex flex-col md:flex-row md:items-center md:gap-6 gap-1 text-xs text-[var(--ocean-text-secondary)] border-b border-[var(--ocean-light)]/10">
                    <div>Requested: <span className="font-semibold">{new Date(req.created_at).toLocaleString()}</span></div>
                    {req.status === 'Accepted' && (
                      <div className="flex items-center gap-2 mt-1 md:mt-0">
                        <span>Progress:</span>
                        <div className="flex items-center gap-1">
                          <div className="w-28 h-2 bg-[var(--ocean-deep)] rounded-full overflow-hidden">
                            <div className="h-2 rounded-full bg-[var(--ocean-accent)] transition-all" style={{ width: `${req.progress || 0}%` }}></div>
                          </div>
                          <span className="ml-2 text-[var(--ocean-light)] font-bold">{typeof req.progress === 'number' ? req.progress : 0}%</span>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            value={pendingProgress[req._id] ?? (typeof req.progress === 'number' ? req.progress : 0)}
                            onChange={e => {
                              const newValue = Number(e.target.value);
                              if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                                setPendingProgress(prev => ({ ...prev, [req._id]: newValue }));
                              }
                            }}
                            className="ml-2 w-16 px-2 py-1 rounded border border-[var(--ocean-light)]/30 bg-[var(--ocean-deep)] text-[var(--ocean-light)] text-xs text-center focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)]/40"
                          />
                          <button
                            className="ml-1 p-1 rounded bg-green-600 hover:bg-green-700 text-white"
                            onClick={async () => {
                              const newValue = pendingProgress[req._id];
                              if (typeof newValue === 'number' && newValue !== req.progress) {
                                if (window.confirm('Do you want to update the progress?')) {
                                  try {
                                    const res = await fetch(`/api/service-requests/${req._id}`, {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ progress: newValue }),
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                      fetchRequests();
                                    } else {
                                      alert('Failed to update progress: ' + (data.error || 'Unknown error'));
                                    }
                                  } catch (error) {
                                    alert('Failed to update progress: ' + error);
                                  }
                                }
                              }
                            }}
                            title="Update Progress"
                          >
                            <FaCheck size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reference Links */}
                  {req.referenceLinks && req.referenceLinks.length > 0 && (
                    <div className="px-2 md:px-4 py-3 border-b border-[var(--ocean-light)]/10 bg-[var(--ocean-surface)]/80">
                      <div className="text-xs text-[var(--ocean-text-secondary)] font-semibold mb-1 flex items-center gap-1">
                        <svg className="w-4 h-4 text-[var(--ocean-accent)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656m-3.656-3.656a4 4 0 015.656 0m-7.778 7.778a6 6 0 018.486 0m-10.607-2.121a8 8 0 0111.314 0" /></svg>
                        Reference Links
                      </div>
                      <ul className="space-y-1">
                        {req.referenceLinks.map((link: string, idx: number) => (
                          <li key={idx}>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--ocean-accent)] underline hover:text-[var(--ocean-light)] text-xs flex items-center gap-1"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-7 7h7m-7 0v-7" /></svg>
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="px-2 md:px-4 py-4 flex flex-wrap gap-3 items-center justify-end bg-[var(--ocean-surface)]">
                    {/* Pending: Remove only */}
                    {req.status === 'Pending' && (
                      <button
                        className="ocean-button bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded"
                        onClick={async () => {
                          if (confirm('Are you sure you want to permanently remove this service request? This cannot be undone.')) {
                            try {
                              const res = await fetch(`/api/service-requests/${req._id}`, { method: 'DELETE' });
                              const data = await res.json();
                              if (data.success) {
                                fetchRequests();
                                alert('✅ Service request removed successfully!');
                              } else {
                                alert('Failed to remove service request: ' + (data.error || 'Unknown error'));
                              }
                            } catch (error) {
                              alert('Failed to remove service request: ' + error);
                            }
                          }
                        }}
                      >
                        Remove
                      </button>
                    )}
                    {/* Accepted: Invoice actions and Remove */}
                    {req.status === 'Accepted' && (
                      <>
                        {!req.invoiceUrl && (
                          <>
                              <button
                              className="ocean-button bg-blue-700 hover:bg-blue-600 text-white px-4 py-1 rounded opacity-60 cursor-not-allowed"
                                disabled
                                onClick={() => {}}
                              >
                                Create & Send Invoice
                              </button>
                            <button
                              className="ocean-button bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-1 rounded"
                              onClick={() => {
                                setManualInvoiceModal({ open: true, reqId: req._id, invoiceUrl: '' });
                              }}
                            >
                              Add Manual Invoice URL
                            </button>
                          </>
                        )}
                        {req.invoiceUrl && (
                          <>
                          <a
                            href={req.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                              className="ocean-button bg-blue-900 hover:bg-blue-800 text-white px-4 py-1 rounded underline"
                          >
                            View Invoice
                          </a>
                            <button
                              className="ocean-button bg-blue-700 hover:bg-blue-600 text-white px-4 py-1 rounded"
                              onClick={() => {
                                setInvoiceForm({
                                  email: req.email || '',
                                  projectName: req.projectName || '',
                                  description: req.description || '',
                                  amount: '',
                                });
                                setModal({ open: true, reqId: req._id });
                              }}
                            >
                              Send Another Invoice
                            </button>
                            <button
                              className="ocean-button bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-1 rounded"
                              onClick={() => {
                                setManualInvoiceModal({ open: true, reqId: req._id, invoiceUrl: req.invoiceUrl || '' });
                              }}
                            >
                              Update Invoice URL
                            </button>
                            <button
                              className="ocean-button bg-red-700 hover:bg-red-600 text-white px-4 py-1 rounded"
                              onClick={async () => {
                                if (confirm('Are you sure you want to remove this invoice? The client will no longer see the "Pay Now" button.')) {
                                  try {
                                    const res = await fetch(`/api/service-requests/${req._id}`, {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ invoiceUrl: null }),
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                      fetchRequests();
                                      alert('✅ Invoice removed successfully!');
                                    } else {
                                      alert('Failed to remove invoice: ' + (data.error || 'Unknown error'));
                                    }
                                  } catch (error) {
                                    alert('Failed to remove invoice: ' + error);
                                  }
                                }
                              }}
                            >
                              Remove Invoice
                            </button>
                          </>
                        )}
                        <button
                          className="ocean-button bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded"
                          onClick={async () => {
                            if (confirm('Are you sure you want to permanently remove this service request? This cannot be undone.')) {
                              try {
                                const res = await fetch(`/api/service-requests/${req._id}`, { method: 'DELETE' });
                                const data = await res.json();
                                if (data.success) {
                                  fetchRequests();
                                  alert('✅ Service request removed successfully!');
                                } else {
                                  alert('Failed to remove service request: ' + (data.error || 'Unknown error'));
                                }
                              } catch (error) {
                                alert('Failed to remove service request: ' + error);
                              }
                            }
                          }}
                        >
                          Remove
                        </button>
                      </>
                    )}
                    {/* Declined: Remove only */}
                    {req.status === 'Declined' && (
                      <button
                        className="ocean-button bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded"
                        onClick={async () => {
                          if (confirm('Are you sure you want to permanently remove this service request? This cannot be undone.')) {
                            try {
                              const res = await fetch(`/api/service-requests/${req._id}`, { method: 'DELETE' });
                              const data = await res.json();
                              if (data.success) {
                                fetchRequests();
                                alert('✅ Service request removed successfully!');
                              } else {
                                alert('Failed to remove service request: ' + (data.error || 'Unknown error'));
                              }
                            } catch (error) {
                              alert('Failed to remove service request: ' + error);
                            }
                          }
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Declined Projects */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--ocean-light)] mb-4">Declined Projects</h2>
          {requests.filter(r => r.status === 'Declined').length === 0 ? (
            <div className="text-[var(--ocean-text-secondary)] italic">No declined projects.</div>
          ) : (
            <div className={`grid gap-6 ${requests.filter(r => r.status === 'Declined').length === 1 ? 'grid-cols-1 justify-center' : 'grid-cols-1 md:grid-cols-2'}`}>
              {requests.filter(r => r.status === 'Declined').map((req) => (
                <div key={req._id} className="bg-[var(--ocean-surface)] rounded-2xl shadow-xl flex flex-col p-4 md:p-6 overflow-hidden w-full">
                  {/* Header */}
                  <div className="flex items-center justify-between px-2 md:px-4 pt-2 md:pt-4 pb-2 border-b border-[var(--ocean-light)]/10 bg-[var(--ocean-surface)]">
                    <div>
                      <div className="text-2xl font-extrabold text-[var(--ocean-accent)] leading-tight">{req.projectName}</div>
                      <div className="text-xs text-[var(--ocean-text-secondary)] font-medium">by {req.username}</div>
                    </div>
                    {/* Status Chips */}
                    <div className="flex gap-2 items-center my-1">
                      {statusOptions.map(opt => (
                        <button
                          key={opt.label}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1 shadow-sm border transition-all duration-150
                            ${req.status === opt.label ? `${opt.color} border-white/40 scale-105` : "bg-[var(--ocean-surface)] text-[var(--ocean-text-secondary)] border-[var(--ocean-light)]/10 hover:scale-105 hover:border-white/30"}
                          `}
                          style={{ outline: req.status === opt.label ? "2px solid #64FFDA" : "none" }}
                          onClick={async () => {
                            if (req.status !== opt.label) {
                              if (opt.label === 'Completed') {
                                setUpdatingId(req._id);
                                try {
                                  await fetch(`/api/service-requests/${req._id}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'Completed', progress: 100 }),
                                  });
                                  fetchRequests();
                                } catch (err) {
                                  alert('Failed to update status to Completed');
                                }
                                setUpdatingId(null);
                              } else if (opt.label === 'Declined') {
                                setUpdatingId(req._id);
                                try {
                                  await fetch(`/api/service-requests/${req._id}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'Declined', progress: null }),
                                  });
                                  fetchRequests();
                                } catch (err) {
                                  alert('Failed to update status to Declined');
                                }
                                setUpdatingId(null);
                              } else {
                                await updateStatus(req._id, opt.label);
                                fetchRequests();
                              }
                            }
                          }}
                          disabled={updatingId === req._id}
                          title={opt.label}
                        >
                          {opt.icon} {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="px-2 md:px-4 pt-3 pb-1">
                    <div className="text-base font-bold text-[var(--ocean-light)] flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[var(--ocean-accent)]"></span>
                      {serviceTypes.find(s => s.id === req.serviceType)?.name || req.serviceType}
                    </div>
                  </div>

                  {/* Meta Info Row */}
                  <div className="px-2 md:px-4 py-2 flex flex-col md:flex-row md:items-center md:gap-6 gap-1 text-xs text-[var(--ocean-text-secondary)] border-b border-[var(--ocean-light)]/10">
                    <div>Requested: <span className="font-semibold">{new Date(req.created_at).toLocaleString()}</span></div>
                  </div>

                  {/* Reference Links */}
                  {req.referenceLinks && req.referenceLinks.length > 0 && (
                    <div className="px-2 md:px-4 py-3 border-b border-[var(--ocean-light)]/10 bg-[var(--ocean-surface)]/80">
                      <div className="text-xs text-[var(--ocean-text-secondary)] font-semibold mb-1 flex items-center gap-1">
                        <svg className="w-4 h-4 text-[var(--ocean-accent)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656m-3.656-3.656a4 4 0 015.656 0m-7.778 7.778a6 6 0 018.486 0m-10.607-2.121a8 8 0 0111.314 0" /></svg>
                        Reference Links
                      </div>
                      <ul className="space-y-1">
                        {req.referenceLinks.map((link: string, idx: number) => (
                          <li key={idx}>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--ocean-accent)] underline hover:text-[var(--ocean-light)] text-xs flex items-center gap-1"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-7 7h7m-7 0v-7" /></svg>
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="px-2 md:px-4 py-4 flex flex-wrap gap-3 items-center justify-end bg-[var(--ocean-surface)]">
                    {/* Remove only */}
                    <button
                      className="ocean-button bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded"
                      onClick={async () => {
                        if (confirm('Are you sure you want to permanently remove this service request? This cannot be undone.')) {
                          try {
                            const res = await fetch(`/api/service-requests/${req._id}`, { method: 'DELETE' });
                            const data = await res.json();
                            if (data.success) {
                              fetchRequests();
                              alert('✅ Service request removed successfully!');
                            } else {
                              alert('Failed to remove service request: ' + (data.error || 'Unknown error'));
                            }
                          } catch (error) {
                            alert('Failed to remove service request: ' + error);
                          }
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Completed Projects */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-[var(--ocean-light)] mb-4">Completed Projects</h2>
          {requests.filter(r => r.status === 'Completed').length === 0 ? (
            <div className="text-[var(--ocean-text-secondary)] italic">No completed projects.</div>
          ) : (
            <div className={`grid gap-6 ${requests.filter(r => r.status === 'Completed').length === 1 ? 'grid-cols-1 justify-center' : 'grid-cols-1 md:grid-cols-2'}`}>
              {requests.filter(r => r.status === 'Completed').map((req) => (
                <div key={req._id} className="bg-[var(--ocean-surface)] rounded-2xl shadow-xl flex flex-col p-4 md:p-6 overflow-hidden w-full">
                  {/* Header */}
                  <div className="flex items-center justify-between px-2 md:px-4 pt-2 md:pt-4 pb-2 border-b border-[var(--ocean-light)]/10 bg-[var(--ocean-surface)]">
                    <div>
                      <div className="text-2xl font-extrabold text-[var(--ocean-accent)] leading-tight">{req.projectName}</div>
                      <div className="text-xs text-[var(--ocean-text-secondary)] font-medium">by {req.username}</div>
                    </div>
                    {/* Status Chips */}
                    <div className="flex gap-2 items-center my-1">
                      {statusOptions.map(opt => (
                        <button
                          key={opt.label}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1 shadow-sm border transition-all duration-150
                            ${req.status === opt.label ? `${opt.color} border-white/40 scale-105` : "bg-[var(--ocean-surface)] text-[var(--ocean-text-secondary)] border-[var(--ocean-light)]/10 hover:scale-105 hover:border-white/30"}
                          `}
                          style={{ outline: req.status === opt.label ? "2px solid #64FFDA" : "none" }}
                          onClick={async () => {
                            if (req.status !== opt.label) {
                              if (opt.label === 'Completed') {
                                setUpdatingId(req._id);
                                try {
                                  await fetch(`/api/service-requests/${req._id}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'Completed', progress: 100 }),
                                  });
                                  fetchRequests();
                                } catch (err) {
                                  alert('Failed to update status to Completed');
                                }
                                setUpdatingId(null);
                              } else if (opt.label === 'Declined') {
                                setUpdatingId(req._id);
                                try {
                                  await fetch(`/api/service-requests/${req._id}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'Declined', progress: null }),
                                  });
                                  fetchRequests();
                                } catch (err) {
                                  alert('Failed to update status to Declined');
                                }
                                setUpdatingId(null);
                              } else {
                                await updateStatus(req._id, opt.label);
                                fetchRequests();
                              }
                            }
                          }}
                          disabled={updatingId === req._id}
                          title={opt.label}
                        >
                          {opt.icon} {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="px-2 md:px-4 pt-3 pb-1">
                    <div className="text-base font-bold text-[var(--ocean-light)] flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[var(--ocean-accent)]"></span>
                      {serviceTypes.find(s => s.id === req.serviceType)?.name || req.serviceType}
                    </div>
                  </div>

                  {/* Meta Info Row */}
                  <div className="px-2 md:px-4 py-2 flex flex-col md:flex-row md:items-center md:gap-6 gap-1 text-xs text-[var(--ocean-text-secondary)] border-b border-[var(--ocean-light)]/10">
                    <div>Requested: <span className="font-semibold">{new Date(req.created_at).toLocaleString()}</span></div>
                    {req.status === 'Completed' && (
                      <div className="flex items-center gap-2 mt-1 md:mt-0">
                        <span>Progress:</span>
                        <div className="flex items-center gap-1">
                          <div className="w-28 h-2 bg-[var(--ocean-deep)] rounded-full overflow-hidden">
                            <div className="h-2 rounded-full bg-[var(--ocean-accent)] transition-all" style={{ width: '100%' }}></div>
                          </div>
                          <span className="ml-2 text-[var(--ocean-light)] font-bold">100%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reference Links */}
                  {req.referenceLinks && req.referenceLinks.length > 0 && (
                    <div className="px-2 md:px-4 py-3 border-b border-[var(--ocean-light)]/10 bg-[var(--ocean-surface)]/80">
                      <div className="text-xs text-[var(--ocean-text-secondary)] font-semibold mb-1 flex items-center gap-1">
                        <svg className="w-4 h-4 text-[var(--ocean-accent)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656m-3.656-3.656a4 4 0 015.656 0m-7.778 7.778a6 6 0 018.486 0m-10.607-2.121a8 8 0 0111.314 0" /></svg>
                        Reference Links
                      </div>
                      <ul className="space-y-1">
                        {req.referenceLinks.map((link: string, idx: number) => (
                          <li key={idx}>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--ocean-accent)] underline hover:text-[var(--ocean-light)] text-xs flex items-center gap-1"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-7 7h7m-7 0v-7" /></svg>
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="px-2 md:px-4 py-4 flex flex-wrap gap-3 items-center justify-end bg-[var(--ocean-surface)]">
                    {/* Pending: Remove only */}
                    {req.status === 'Pending' && (
                      <button
                        className="ocean-button bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded"
                        onClick={async () => {
                          if (confirm('Are you sure you want to permanently remove this service request? This cannot be undone.')) {
                            try {
                              const res = await fetch(`/api/service-requests/${req._id}`, { method: 'DELETE' });
                              const data = await res.json();
                              if (data.success) {
                                fetchRequests();
                                alert('✅ Service request removed successfully!');
                              } else {
                                alert('Failed to remove service request: ' + (data.error || 'Unknown error'));
                              }
                            } catch (error) {
                              alert('Failed to remove service request: ' + error);
                            }
                          }
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <footer className="w-full flex justify-center items-center mt-8 mb-2">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide Co. All rights reserved.
        </span>
      </footer>

      {/* Modal for invoice confirmation and editing */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[var(--ocean-surface)] border-4 border-red-500 border-[var(--ocean-light)]/30 rounded-lg p-6 w-[90vw] max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-[var(--ocean-accent)] mb-4">Create & Confirm Invoice</h3>
            <div className="space-y-2 mb-4">
              <input
                type="email"
                placeholder="Client Email"
                className="w-full px-2 py-1 rounded border border-[var(--ocean-light)]/30 bg-[var(--ocean-surface)] text-[var(--ocean-light)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)]/40"
                value={invoiceForm.email}
                onChange={e => setInvoiceForm(f => ({ ...f, email: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Project Name"
                className="w-full px-2 py-1 rounded border border-[var(--ocean-light)]/30 bg-[var(--ocean-surface)] text-[var(--ocean-light)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)]/40"
                value={invoiceForm.projectName}
                onChange={e => setInvoiceForm(f => ({ ...f, projectName: e.target.value }))}
              />
              <textarea
                placeholder="Project Description"
                rows={2}
                className="w-full px-2 py-1 rounded border border-[var(--ocean-light)]/30 bg-[var(--ocean-surface)] text-[var(--ocean-light)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)]/40 resize-none"
                value={invoiceForm.description}
                onChange={e => setInvoiceForm(f => ({ ...f, description: e.target.value }))}
              />
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="Amount (USD)"
                className="w-full px-2 py-1 rounded border border-[var(--ocean-light)]/30 bg-[var(--ocean-surface)] text-[var(--ocean-light)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)]/40"
                value={invoiceForm.amount}
                onChange={e => setInvoiceForm(f => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-1 rounded bg-gray-500/30 text-[var(--ocean-light)] hover:bg-gray-500/60"
                onClick={() => setModal({ open: false, reqId: null })}
              >
                Cancel
              </button>
              <button
                className="ocean-button px-4 py-1 font-bold"
                onClick={async () => {
                  const { email, projectName, description, amount } = invoiceForm;
                  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                    alert('Please enter a valid client email.');
                    return;
                  }
                  if (!projectName || projectName.trim() === '') {
                    alert('Please enter a project name.');
                    return;
                  }
                  if (!description || description.trim() === '') {
                    alert('Please enter a project description.');
                    return;
                  }
                  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
                    alert('Please enter a valid amount.');
                    return;
                  }
                  const res = await fetch('/api/paypal-invoice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, projectName, description, amount }),
                  });
                  const data = await res.json();
                  if (data.success && data.invoiceUrl) {
                    await fetch(`/api/service-requests/${modal.reqId}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ invoiceUrl: data.invoiceUrl }),
                    });
                    fetchRequests();
                    setModal({ open: false, reqId: null });
                    alert(`✅ Invoice created and sent successfully!\n\nInvoice ID: ${data.invoiceId}\nStatus: ${data.status}\nInvoice URL: ${data.invoiceUrl}\n\nYou can track this invoice in your PayPal account.`);
                  } else {
                    alert('Failed to create invoice: ' + (data.error || JSON.stringify(data.details) || 'Unknown error'));
                  }
                }}
              >
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for manual invoice URL input */}
      {manualInvoiceModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[var(--ocean-surface)] border border-[var(--ocean-light)]/30 rounded-lg p-6 w-[90vw] max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-[var(--ocean-accent)] mb-4">
              {manualInvoiceModal.invoiceUrl ? 'Update Invoice URL' : 'Add Manual Invoice URL'}
            </h3>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-[var(--ocean-text-secondary)] mb-1 text-sm">PayPal Invoice URL</label>
                <input
                  type="url"
                  placeholder="https://www.paypal.com/invoice/payerView/details/..."
                  className="w-full px-3 py-2 rounded border border-[var(--ocean-light)]/30 bg-[var(--ocean-deep)] text-[var(--ocean-light)] focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)]/40"
                  value={manualInvoiceModal.invoiceUrl}
                  onChange={e => setManualInvoiceModal(f => ({ ...f, invoiceUrl: e.target.value }))}
                />
              </div>
              <div className="text-xs text-[var(--ocean-text-secondary)]">
                <p>• Copy the URL from your PayPal invoice</p>
                <p>• Make sure it's the payer view URL (not the edit URL)</p>
                <p>• For sandbox: use sandbox.paypal.com URLs</p>
                <p>• For production: use paypal.com URLs</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-500/30 text-[var(--ocean-light)] hover:bg-gray-500/60"
                onClick={() => setManualInvoiceModal({ open: false, reqId: null, invoiceUrl: '' })}
              >
                Cancel
              </button>
              <button
                className="ocean-button px-4 py-2 font-bold"
                onClick={async () => {
                  const { invoiceUrl } = manualInvoiceModal;
                  if (!invoiceUrl || !invoiceUrl.trim()) {
                    alert('Please enter a valid invoice URL.');
                    return;
                  }
                  if (!invoiceUrl.includes('paypal.com')) {
                    alert('Please enter a valid PayPal invoice URL.');
                    return;
                  }
                  
                  try {
                    const res = await fetch(`/api/service-requests/${manualInvoiceModal.reqId}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ invoiceUrl: invoiceUrl.trim() }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      fetchRequests();
                      setManualInvoiceModal({ open: false, reqId: null, invoiceUrl: '' });
                      alert('✅ Invoice URL updated successfully!');
                    } else {
                      alert('Failed to update invoice URL: ' + (data.error || 'Unknown error'));
                    }
                  } catch (error) {
                    alert('Failed to update invoice URL: ' + error);
                  }
                }}
              >
                {manualInvoiceModal.invoiceUrl ? 'Update URL' : 'Add URL'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 