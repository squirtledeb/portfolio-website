"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (name.length <= 2) return email;
  return name[0] + "*".repeat(Math.max(0, name.length - 5)) + name.slice(-4) + "@" + domain;
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'username'|'confirm'|'reset'|'success'>('username');
  const [username, setUsername] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [realEmail, setRealEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success && data.maskedEmail && data.realEmail) {
      setMaskedEmail(data.maskedEmail);
      setRealEmail(data.realEmail);
      setStep("confirm");
    } else {
      setError(data.error || "Username not found.");
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (confirmEmail.trim().toLowerCase() !== realEmail.trim().toLowerCase()) {
      setError("Email does not match. Please try again.");
      return;
    }
    setStep("reset");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/auth/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, newPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setStep("success");
      setMessage("Your password has been reset. You can now log in.");
      setTimeout(() => router.push(`/login?username=${encodeURIComponent(username)}`), 2000);
    } else {
      setError(data.error || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col ocean-gradient pt-32 pb-16 px-4 items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>
      <div className="relative z-10 w-full max-w-md bg-[var(--ocean-surface)] rounded-2xl shadow-2xl p-10 border border-[var(--ocean-light)]/10 flex flex-col items-center flex-1">
        <h1 className="text-3xl font-bold text-[var(--ocean-light)] mb-6">Forgot Password</h1>
        {step === "username" && (
          <form className="w-full flex flex-col gap-6" onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              required
              placeholder="Enter your username"
              className="w-full px-4 py-2 rounded-lg bg-[var(--ocean-deep)] text-[var(--ocean-text)] border border-[var(--ocean-light)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)]"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <button className="ocean-button w-full mt-2" disabled={loading}>{loading ? "Checking..." : "Next"}</button>
          </form>
        )}
        {step === "confirm" && (
          <form className="w-full flex flex-col gap-6 items-center" onSubmit={handleConfirm}>
            <div className="text-[var(--ocean-light)] text-center mb-2">Please confirm your email id:</div>
            <div className="text-lg font-bold text-[var(--ocean-accent)] mb-2">{maskedEmail}</div>
            <input
              type="email"
              required
              placeholder="Enter your full email address"
              className="w-full px-4 py-2 rounded-lg bg-[var(--ocean-deep)] text-[var(--ocean-text)] border border-[var(--ocean-light)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)]"
              value={confirmEmail}
              onChange={e => setConfirmEmail(e.target.value)}
            />
            <button className="ocean-button w-full mt-2" disabled={loading}>{loading ? "Checking..." : "Confirm"}</button>
          </form>
        )}
        {step === "reset" && (
          <form className="w-full flex flex-col gap-6" onSubmit={handleResetPassword}>
            <input
              type="password"
              required
              placeholder="Enter new password"
              className="w-full px-4 py-2 rounded-lg bg-[var(--ocean-deep)] text-[var(--ocean-text)] border border-[var(--ocean-light)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)]"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <button className="ocean-button w-full mt-2" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</button>
          </form>
        )}
        {step === "success" && (
          <div className="text-green-400 text-center font-semibold">{message}</div>
        )}
        {error && <div className="mt-4 text-red-400 text-sm text-center">{error}</div>}
        {message && step !== "success" && <div className="mt-4 text-green-400 text-sm text-center">{message}</div>}
      </div>
      <footer className="w-full flex justify-center items-center mt-8 mb-2">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide Co. All rights reserved.
        </span>
      </footer>
    </div>
  );
} 