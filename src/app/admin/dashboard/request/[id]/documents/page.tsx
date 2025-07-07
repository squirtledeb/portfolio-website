"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface RequestDetails {
  projectName: string;
  referenceLinks?: string[];
}

const isImageUrl = (url: string) => {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(url);
};

export default function DocumentsPage() {
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
    return <div className="min-h-screen ocean-gradient flex items-center justify-center text-white">Loading Documents...</div>;
  }

  if (error) {
    return <div className="min-h-screen ocean-gradient flex items-center justify-center text-red-400">Error: {error}</div>;
  }
  
  const documents = request?.referenceLinks?.filter(isImageUrl) || [];

  return (
    <div className="min-h-screen ocean-gradient pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <button onClick={() => router.back()} className="text-[var(--ocean-accent)] hover:text-cyan-300 mb-4">&larr; Back to Details</button>
          <h1 className="text-4xl font-bold text-white">Documents for {request?.projectName}</h1>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {documents.length > 0 ? (
            documents.map((docUrl, index) => (
              <a key={index} href={docUrl} target="_blank" rel="noopener noreferrer" className="text-center group">
                <div className="relative aspect-square bg-[var(--ocean-surface)] rounded-lg overflow-hidden flex items-center justify-center border border-[var(--ocean-light)]/10 group-hover:border-[var(--ocean-accent)] transition p-2">
                  <img src={docUrl} alt={`Document ${index + 1}`} className="object-contain max-h-full max-w-full"/>
                </div>
                <p className="text-white text-sm mt-2 truncate" title={docUrl.split('/').pop()}>{docUrl.split('/').pop()}</p>
              </a>
            ))
          ) : (
            <p className="text-gray-400 italic col-span-full">No documents found.</p>
          )}
        </div>
      </div>
    </div>
  );
} 