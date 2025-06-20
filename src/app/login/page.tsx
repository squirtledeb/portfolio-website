"use client";
export const dynamic = "force-dynamic";

import React, { Suspense, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

// A new component that uses the searchParams hook
function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Prefill username from query string if present
  const searchParams = useSearchParams();
  React.useEffect(() => {
    const prefill = searchParams.get("username");
    if (prefill) setUsername(prefill);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      setLoading(false);
      
      if (data.success) {
        // Store user in localStorage (consistent with the rest of the app)
        localStorage.setItem('oceanTideUser', username);
        if (data.email) localStorage.setItem('oceanTideEmail', data.email);
        setMessage(`Welcome, ${username}!`);
        setError(null);
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Login failed.");
    }
  };

  return (
    <>
      <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col items-start w-full">
          <label htmlFor="username" className="text-[var(--ocean-text-secondary)] mb-1 text-sm">Username</label>
          <input
            id="username"
            type="text"
            required
            autoComplete="username"
            className="w-full px-4 py-2 rounded-lg bg-[var(--ocean-deep)] text-[var(--ocean-text)] border border-[var(--ocean-light)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)]"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start w-full">
          <label htmlFor="password" className="text-[var(--ocean-text-secondary)] mb-1 text-sm">Password</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full px-4 py-2 rounded-lg bg-[var(--ocean-deep)] text-[var(--ocean-text)] border border-[var(--ocean-light)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)]"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="ocean-button w-full mt-2"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </motion.button>
      </form>
      {message && <div className="mt-4 text-green-400 text-sm">{message}</div>}
      {error && <div className="mt-4 text-red-400 text-sm">{error}</div>}
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col ocean-gradient pt-32 pb-16 px-4 relative overflow-hidden">
      {/* Animated Background (same as homepage) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-[var(--ocean-surface)] rounded-2xl shadow-2xl p-10 border border-[var(--ocean-light)]/10 flex flex-col items-center mx-auto flex-1"
      >
        <div className="mb-4">
          <svg width="48" height="48" viewBox="0 0 1322.32 1280.19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#78e0d1" d="M442.97,366.46c31.85-28.67,62.95-51.57,67.87-55.2,14.47-10.66,37.82-27.76,70.26-46.9,33.55-19.79,62.15-33.3,75.88-39.08,53.27-22.43,149.39-52.18,267.2-40.76,10.51,1.02,86.83,8.93,138.58,38.95,24.35,14.12,55.58,40.28,71.9,58.93h0c31.09,35.53,39.06,47.73,42.08,46.14,2.82-1.49.95-11.93.03-16.73-4.33-22.65-13.63-39.68-19.74-50.36-7.47-13.04-14.01-24.46-25.3-40.17-16.16-22.49-30.64-37.9-44.37-52.41-10.84-11.46-22.18-23.37-38.68-37.58-4.46-3.84-21.17-18.07-48.74-36.41,0,0-41.32-27.48-82.17-46.4-192.91-89.35-379.53-27.81-379.53-27.81-16.29,5.45-103.96,35.82-187.88,113.65-45.36,42.07-74.4,83.88-89.04,106.92-29.33,46.15-44.12,84.93-47.81,94.88-8.31,22.4-12.95,40.16-19.4,64.91,0,0-6,23.03-10.99,56.64-5.05,34.07-2.34,38.03-.06,39.26,7.2,3.9,17.38-15.98,48.56-30.67,11.96-5.64,22.44-8.35,41.63-13.32,20.29-5.26,34.04-7.03,37.23-7.42,3.81-.47,7.66-.86,14.55-1.55,20.13-2.02,21.08-1.63,28.98-2.8,13.89-2.06,20.83-3.09,27.33-7.69,2.81-1.98,3.94-3.4,13.27-14.9,5.19-6.4,10.32-12.86,15.6-19.19,5.28-6.34,13.57-15.64,32.76-32.91Z"/>
            <path fill="#6fcfc5" d="M490.99,439.57c-6.3-12.96,37.35-46.35,60.69-64.01,61.81-46.78,116.03-72.7,127.58-78.15,0,0,79.66-37.56,187.51-54.04,9.27-1.42,25.45-3.57,26.6,0,1.38,4.28-19.98,13.38-36.58,23.28-49.51,29.54-73.53,76.34-80.64,90.62-5.88,11.8-26.09,53.58-24.11,108.08,1.33,36.49,11.7,53.73,3.33,59.86-15.33,11.23-49.05-47.39-126.32-66.67-61.17-15.27-100.64-14.8-100.64-14.8-20.13.24-34.24,2.36-37.41-4.16Z"/>
            <path fill="#5da1ae" d="M113.62,636.79c-21.38,6.05-41.92,13.51-41.92,13.51-23.42,8.51-45.52,18.05-45.52,18.05-20.51,8.86-25.31,11.91-26.08,10.8-2.52-3.62,43.79-41.38,79.59-66.47,24.25-17,52.07-36.34,92.64-55.89,14.57-7.02,57.05-26.73,116.14-41.43,14.7-3.66,60.81-14.56,123.34-17.94,44.55-2.41,105.7-5.25,180.47,13.62,70.78,17.86,121.77,47.11,156.75,67.5,41.17,24,40.71,29.32,117.39,77.15,67.07,41.83,90.65,52.25,108.83,59.24,50.11,19.27,90.5,24.58,104.7,26.17,17.27,1.94,48.68,5.27,89.54,0,21.93-2.83,57.75-7.75,97.81-27.55,29.13-14.4,45.76-29.38,48.22-26.58,3.09,3.51-20.33,30.37-42.71,51.38,0,0-43.41,40.75-91.44,64.75-77.24,38.6-224.72,54.15-370.06,0-70.2-26.16-65.32-40.79-194.24-96.43-63.28-27.31-99.14-42.79-152.91-57.86h0c-21.99-7.86-52.77-17.33-90.41-24.09-16.37-2.94-80.61-13.73-163.32-5.61-50.74,4.98-87.36,15.01-96.82,17.68Z"/>
            <path fill="#1e6880" d="M310.16,678.1c5.81.22,10.45.39,15.83.73,9.81.62,16.92,1.47,27.5,2.75,12.22,1.48,18.33,2.22,24.81,3.58,3.53.74,8.56,1.9,20.37,5.45,16.32,4.9,28.69,9.3,31.46,10.29,19.99,7.13,34.57,12.8,64.32,24.33,28.36,10.99,27.17,10.46,29.7,11.5,23.09,9.5,51.22,22.94,106.52,49.42,88.73,42.49,84.25,41.74,108.72,51.98,70.21,29.39,119.8,40.87,131.78,43.56,42.78,9.61,74.25,12.37,84.56,13.18,31.12,2.44,53.02,4.17,82.36,0,33.25-4.72,51.27-13.49,53.81-8.79,4.13,7.65-39.37,38.52-51.61,47.22-28.65,20.34-62.1,43.78-113.11,64.79-13.09,5.39-56.66,22.71-118.6,32.95-44.74,7.4-130.97,20.71-236.11-7.69-15.64-4.23-91.66-25.65-170.22-82.36-8.39-6.06-42.81-31.29-81.27-71.38-10.67-11.12-32.6-34.81-56.26-68.09-5.56-7.82-21.7-30.92-36.87-63.85-20.72-44.96-14.48-53.67-12.32-55.98.58-.62,1.29-1.1,1.29-1.1s2.25-1.72,5.19-2.63c6.57-2.03,65.63-.46,71.17-.33,1.97.05,8.17.16,16.97.49Z"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[var(--ocean-light)] mb-2">Welcome Back</h1>
        <p className="text-[var(--ocean-text-secondary)] mb-8">Sign in to your OceanTide account</p>
        
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 text-xs text-[var(--ocean-text-secondary)] flex flex-col items-center">
          <span>
            First time client? <Link href="/signup" className="text-[var(--ocean-light)] underline">Sign up now</Link>
            <span className="mx-2">|</span>
            <a href="/forgot-password" className="text-[var(--ocean-accent)] underline hover:text-[var(--ocean-light)] transition-colors">Forgot password?</a>
          </span>
        </div>
      </motion.div>
      <footer className="w-full flex justify-center items-center mt-8 mb-2">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide Co. All rights reserved.
        </span>
      </footer>
    </div>
  );
} 