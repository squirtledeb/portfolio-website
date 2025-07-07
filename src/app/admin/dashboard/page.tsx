"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaHourglassHalf, FaCheckCircle, FaProjectDiagram, FaFileInvoiceDollar, FaTasks, FaTimesCircle } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

interface Request {
  _id: string;
  projectName: string;
  serviceType: string;
  status: string;
  username: string;
  created_at: string;
}

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

const getServiceName = (id: string) => {
  const service = serviceTypes.find(s => s.id === id);
  return service ? service.name : id;
};

const statusIcons = [
  { key: 'Pending', icon: <FaHourglassHalf size={16} />, color: 'text-yellow-400' },
  { key: 'Accepted', icon: <FaTasks size={16} />, color: 'text-blue-400' },
  { key: 'Declined', icon: <FaTimesCircle size={16} />, color: 'text-red-400' },
  { key: 'Completed', icon: <FaCheckCircle size={16} />, color: 'text-green-400' },
];

const RequestCard = ({ request, onStatusChange }: { request: Request, onStatusChange: (id: string, newStatus: string) => void }) => {
  const [updating, setUpdating] = useState(false);

  const handleStatusIconClick = async (e: React.MouseEvent, newStatus: string) => {
    e.stopPropagation();
    if (newStatus === request.status) return;
    setUpdating(true);
    await onStatusChange(request._id, newStatus);
    setUpdating(false);
  };

  return (
    <div
      className="bg-[var(--ocean-surface)] rounded-lg shadow-md p-3 pr-6 border cursor-default border-[var(--ocean-light)]/10 w-full max-w-full relative group flex flex-col"
    >
      {/* Top Row: Project Name + Status Icons */}
      <div className="flex items-start gap-3 w-full mb-1">
        <h4 className="font-bold text-base text-cyan-400 flex-1 break-words pr-2">{request.projectName}</h4>
        <div className="flex gap-3 pl-1 z-10">
          {statusIcons.map(({ key, icon, color }) => (
            <button
              key={key}
              disabled={updating || key === request.status}
              onClick={e => handleStatusIconClick(e, key)}
              className={`w-7 h-7 flex items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-200
                ${key === request.status
                  ? `${color} bg-[var(--ocean-deep)] border-[var(--ocean-light)] shadow-lg shadow-[var(--ocean-light)] scale-125 animate-pulse`
                  : 'bg-[var(--ocean-surface)] border-transparent opacity-60 hover:scale-110 hover:opacity-100'}
              `}
              style={{ boxShadow: key === request.status ? '0 0 8px 2px var(--ocean-light)' : undefined }}
              title={key}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-red-500 font-semibold">{getServiceName(request.serviceType)}</p>
      <div className="text-xs text-gray-300 mt-2 space-y-0.5">
        <p><span className="font-semibold text-gray-400">Client: </span>{request.username}</p>
        <p><span className="font-semibold text-gray-400">Requested: </span>{new Date(request.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

const Section = ({ title, icon, count, children }: { title: string, icon: React.ReactNode, count: number, children: React.ReactNode }) => (
  <section>
    <div className="flex items-center gap-3 mb-6">
      {icon}
      <h2 className="text-3xl font-bold text-[var(--ocean-light)]">{title}</h2>
      <span className="bg-[var(--ocean-accent)] text-black text-sm font-bold px-3 py-1 rounded-full">{count}</span>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </section>
);

const sidebarItems = [
  { key: 'pending', icon: <FaHourglassHalf className="text-yellow-400 text-2xl" />, label: 'Pending' },
  { key: 'active', icon: <FaTasks className="text-blue-400 text-2xl" />, label: 'Active' },
  { key: 'declined', icon: <FaTimesCircle className="text-red-400 text-2xl" />, label: 'Declined' },
  { key: 'completed', icon: <FaCheckCircle className="text-green-400 text-2xl" />, label: 'Completed' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('pending');

  useEffect(() => {
    const user = localStorage.getItem('oceanTideUser');
    if (user !== 'OceanTide') {
      router.push("/login");
      return;
    }

  const fetchRequests = async () => {
    try {
        const res = await fetch('/api/service-requests');
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests || []);
      } else {
        setError(data.error || 'Failed to fetch requests');
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch requests");
      } finally {
      setLoading(false);
    }
  };

    fetchRequests();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-[var(--ocean-light)]">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-400">Error: {error}</div>;
  }

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const activeRequests = requests.filter(r => r.status === 'Accepted');
  const completedRequests = requests.filter(r => r.status === 'Completed');
  const declinedRequests = requests.filter(r => r.status === 'Declined');

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch(`/api/service-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setRequests(prev => prev.map(req => req._id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <div className="min-h-screen ocean-gradient flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-20 md:w-24 bg-[var(--ocean-deep)] flex flex-col items-center py-8 z-20 shadow-xl border-r border-[var(--ocean-surface)]">
        <div className="flex flex-col gap-6 w-full items-center mt-4 md:mt-16">
          {sidebarItems.map(item => (
                        <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-16 md:w-20 flex flex-col items-center justify-center group focus:outline-none ${activeSection === item.key ? 'bg-[var(--ocean-surface)] rounded-xl shadow-lg' : ''} py-3 transition-all`}
              title={item.label}
            >
              {item.icon}
              <span className={`mt-2 text-xs font-semibold text-center truncate w-full ${activeSection === item.key ? 'text-[var(--ocean-light)]' : 'text-[var(--ocean-text-secondary)]'}`}>{item.label}</span>
                        </button>
                      ))}
                    </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 ml-20 md:ml-24 relative z-10 max-w-7xl mx-auto w-full pt-28 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
          {activeSection === 'pending' && (
            <Section 
              title="Pending Requests" 
              icon={<FaHourglassHalf className="text-yellow-400 text-3xl" />} 
              count={pendingRequests.length}
            >
              {pendingRequests.map(req => <RequestCard key={req._id} request={req} onStatusChange={handleStatusChange} />)}
            </Section>
          )}
          {activeSection === 'active' && (
            <Section 
              title="Active Projects" 
              icon={<FaTasks className="text-blue-400 text-3xl" />} 
              count={activeRequests.length}
            >
              {activeRequests.map(req => <RequestCard key={req._id} request={req} onStatusChange={handleStatusChange} />)}
            </Section>
          )}
          {activeSection === 'declined' && (
            <Section 
              title="Declined Projects" 
              icon={<FaTimesCircle className="text-red-400 text-3xl" />} 
              count={declinedRequests.length}
            >
              {declinedRequests.map(req => <RequestCard key={req._id} request={req} onStatusChange={handleStatusChange} />)}
            </Section>
          )}
          {activeSection === 'completed' && (
            <Section 
              title="Completed Projects" 
              icon={<FaCheckCircle className="text-green-400 text-3xl" />} 
              count={completedRequests.length}
            >
              {completedRequests.map(req => <RequestCard key={req._id} request={req} onStatusChange={handleStatusChange} />)}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
} 