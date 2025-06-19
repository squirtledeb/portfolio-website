"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (name.length <= 2) return email;
  return name[0] + "*".repeat(Math.max(0, name.length - 5)) + name.slice(-4) + "@" + domain;
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email"|"confirm"|"otp"|"success">("email");
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setMaskedEmail(maskEmail(email));
      setStep("confirm");
    } else {
      setError(data.error || "Email not found.");
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, confirm: true }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setStep("otp");
      setMessage("An OTP has been sent to your email.");
    } else {
      setError(data.error || "Failed to send OTP.");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    // Verify OTP
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!data.success) {
      setLoading(false);
      setError(data.error || "Invalid OTP.");
      return;
    }
    // Set new password
    const res2 = await fetch("/api/auth/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    const data2 = await res2.json();
    setLoading(false);
    if (data2.success) {
      setStep("success");
      setMessage("Your password has been reset. You can now log in.");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setError(data2.error || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen ocean-gradient pt-32 pb-16 px-4 flex items-center justify-center">
      <div className="relative z-10 w-full max-w-md bg-[var(--ocean-surface)] rounded-2xl shadow-2xl p-10 border border-[var(--ocean-light)]/10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[var(--ocean-light)] mb-6">Forgot Password</h1>
        {step === "email" && (
          <form className="w-full flex flex-col gap-6" onSubmit={handleEmailSubmit}>
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-[var(--ocean-deep)] text-[var(--ocean-text)] border border-[var(--ocean-light)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)]"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button className="ocean-button w-full mt-2" disabled={loading}>{loading ? "Checking..." : "Next"}</button>
          </form>
        )}
        {step === "confirm" && (
          <div className="w-full flex flex-col gap-6 items-center">
            <div className="text-[var(--ocean-light)] text-center mb-4">Confirm the following email id:</div>
            <div className="text-lg font-bold text-[var(--ocean-accent)] mb-4">{maskedEmail}</div>
            <button className="ocean-button w-full" onClick={handleConfirm} disabled={loading}>{loading ? "Sending OTP..." : "Confirm"}</button>
          </div>
        )}
        {step === "otp" && (
          <form className="w-full flex flex-col gap-6" onSubmit={handleOtpSubmit}>
            <div className="text-[var(--ocean-light)] text-center mb-2">An OTP has been sent to your email.</div>
            <input
              type="text"
              required
              maxLength={4}
              minLength={4}
              pattern="[0-9]{4}"
              placeholder="Enter 4-digit OTP"
              className="w-full px-4 py-2 rounded-lg bg-[var(--ocean-deep)] text-[var(--ocean-text)] border border-[var(--ocean-light)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)]"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
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
    </div>
  );
} 