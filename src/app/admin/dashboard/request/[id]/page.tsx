"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaExternalLinkAlt, FaInfoCircle, FaProjectDiagram, FaUser, FaCalendarAlt, FaDollarSign, FaFileAlt, FaFolder, FaFileInvoiceDollar } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';

interface RequestDetails {
  _id: string;
  projectName: string;
  serviceType: string;
  status: string;
  username: string;
  description: string;
  timeline: string;
  budget: string;
  referenceLinks?: string[];
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

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | React.ReactNode }) => (
  <div className="flex items-start gap-4">
    <div className="text-red-400 mt-1">{icon}</div>
    <div>
      <p className="font-semibold text-gray-400 text-sm">{label}</p>
      <p className="text-white">{value}</p>
    </div>
  </div>
);

export default function RequestDetailPage() {
  const { id } = useParams();
  const [request, setRequest] = useState<RequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchRequest = async () => {
        try {
          const res = await fetch(`/api/service-requests/${id}`);
          const data = await res.json();
          if (data.success) {
            setRequest(data.request);
          } else {
            setError(data.error || 'Failed to fetch request details.');
          }
        } catch (err: any) {
          setError(err.message || 'An error occurred.');
        } finally {
          setLoading(false);
        }
      };
      fetchRequest();
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen ocean-gradient flex items-center justify-center text-white">Loading...</div>;
  }

  if (error || !request) {
    return <div className="min-h-screen ocean-gradient flex items-center justify-center text-red-400">Error: {error || 'Request not found.'}</div>;
  }

  return (
    <div className="min-h-screen ocean-gradient pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-cyan-400 drop-shadow-lg">{request.projectName}</h1>
          <p className="text-xl text-red-500 font-semibold mt-2">{getServiceName(request.serviceType)}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-[var(--ocean-light)] mb-6 flex items-center gap-3">
              <FaInfoCircle /> Project Details
            </h2>
            <div className="bg-[var(--ocean-surface)] rounded-2xl shadow-xl p-6 border border-white/20 space-y-4 max-w-2xl">
              <DetailItem icon={<FaUser />} label="Client" value={request.username} />
              <DetailItem icon={<FaCalendarAlt />} label="Requested On" value={new Date(request.created_at).toLocaleDateString()} />
              <DetailItem icon={<FaDollarSign />} label="Budget" value={request.budget ? `$${request.budget}` : 'Not specified'} />
              <DetailItem icon={<FaProjectDiagram />} label="Timeline" value={request.timeline || 'Not specified'} />
              <DetailItem 
                icon={<FaFileAlt />} 
                label="Description" 
                value={<p className="whitespace-pre-wrap">{request.description || 'No description provided.'}</p>} 
              />
            </div>
          </div>

          {/* Right Column: References */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold text-[var(--ocean-light)] mb-6 flex items-center gap-3">
              <FaExternalLinkAlt /> References
            </h2>
            <div className="space-y-4 mb-10">
              <Link href={`/admin/dashboard/request/${id}/documents`} passHref>
                <div className="bg-[var(--ocean-surface)] rounded-xl border border-white/20 p-4 flex items-center gap-4 text-white hover:bg-[var(--ocean-deep)]/60 transition-colors cursor-pointer shadow-xl">
                  <FaFolder className="text-yellow-400 text-3xl" />
                  <span className="font-semibold">Documents</span>
                </div>
              </Link>
              <Link href={`/admin/dashboard/request/${id}/links`} passHref>
                <div className="bg-[var(--ocean-surface)] rounded-xl border border-white/20 p-4 flex items-center gap-4 text-white hover:bg-[var(--ocean-deep)]/60 transition-colors cursor-pointer shadow-xl">
                  <FaFolder className="text-blue-400 text-3xl" />
                  <span className="font-semibold">Links</span>
                </div>
              </Link>
            </div>
            <h2 className="text-3xl font-bold text-[var(--ocean-light)] mb-6 flex items-center gap-3">
              <FiSettings className="text-[var(--ocean-light)]" /> Project Control
            </h2>
            <button
              className="w-full flex items-center gap-4 bg-[var(--ocean-surface)] border border-white/20 rounded-xl p-4 text-white font-semibold shadow-xl hover:bg-[var(--ocean-deep)]/60 transition-colors mb-8"
              onClick={() => alert('Invoice creation coming soon!')}
            >
              <FaFileInvoiceDollar className="text-green-400 text-2xl" />
              <span>Create New Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 