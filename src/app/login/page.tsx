"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
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
    <div className="min-h-screen ocean-gradient pt-32 pb-16 px-4 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background (same as homepage) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-[var(--ocean-surface)] rounded-2xl shadow-2xl p-10 border border-[var(--ocean-light)]/10 flex flex-col items-center"
      >
        <div className="text-5xl mb-4">🌊</div>
        <h1 className="text-3xl font-bold text-[var(--ocean-light)] mb-2">Welcome Back</h1>
        <p className="text-[var(--ocean-text-secondary)] mb-8">Sign in to your OceanTide account</p>
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
        <div className="mt-6 text-xs text-[var(--ocean-text-secondary)] flex flex-col items-center">
          <span>
            First time client? <Link href="/signup" className="text-[var(--ocean-light)] underline">Sign up now</Link>
            <span className="mx-2">|</span>
            <a href="/forgot-password" className="text-[var(--ocean-accent)] underline hover:text-[var(--ocean-light)] transition-colors">Forgot password?</a>
          </span>
        </div>
      </motion.div>
    </div>
  );
} 