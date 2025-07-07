"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaLink } from 'react-icons/fa';

interface RequestDetails {
  projectName: string;
  referenceLinks?: string[];
}

const isImageUrl = (url: string) => {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(url);
};

export default function LinksPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<RequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/service-requests/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setRequest(data.request);
          } else {
            setError(data.error || 'Request not found.');
          }
          setLoading(false);
        }).catch(err => {
          setError(err.message || 'An error occurred.');
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen ocean-gradient flex items-center justify-center text-white">Loading Links...</div>;
  }

  if (error) {
    return <div className="min-h-screen ocean-gradient flex items-center justify-center text-red-400">Error: {error}</div>;
  }
  
  const links = request?.referenceLinks?.filter(link => !isImageUrl(link)) || [];

  return (
    <div className="min-h-screen ocean-gradient pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <button onClick={() => router.back()} className="text-[var(--ocean-accent)] hover:text-cyan-300 mb-4">&larr; Back to Details</button>
          <h1 className="text-4xl font-bold text-white">Links for {request?.projectName}</h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.length > 0 ? (
            links.map((linkUrl, index) => (
              <a 
                key={index} 
                href={linkUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[var(--ocean-surface)] rounded-lg p-4 flex items-center gap-4 text-white hover:bg-[var(--ocean-deep)]/60 transition-colors border border-[var(--ocean-light)]/10"
              >
                <FaLink className="text-[var(--ocean-accent)] flex-shrink-0" />
                <span className="truncate" title={linkUrl}>{linkUrl}</span>
              </a>
            ))
          ) : (
            <p className="text-gray-400 italic col-span-full">No links found.</p>
          )}
        </div>
      </div>
    </div>
  );
} 