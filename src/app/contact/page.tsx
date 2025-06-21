"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiMessageSquare, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setStatus('idle');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleDiscordCopy = () => {
    navigator.clipboard.writeText('squirtledeb');
    toast.success('Discord ID Copied!', {
      style: {
        background: 'var(--ocean-surface)',
        color: 'var(--ocean-text)',
        border: '1px solid rgba(var(--ocean-light-rgb), 0.2)',
      },
      iconTheme: {
        primary: 'var(--ocean-light)',
        secondary: 'var(--ocean-deep)',
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleTryAgain = () => {
    setStatus('idle');
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        ease: "easeOut",
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ocean-gradient p-4 relative overflow-hidden">
      <Toaster position="bottom-center" />
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10 animate-wave-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--ocean-deep)]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center"
      >
        {/* Left Side: Info */}
        <div className="text-center md:text-left">
          <motion.div variants={itemVariants} className="inline-block p-4 bg-[var(--ocean-surface)] border border-[var(--ocean-light)]/20 rounded-full mb-4">
            <FiMessageSquare className="text-[var(--ocean-light)] text-3xl" />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-[var(--ocean-light)] mb-4">
            Get in Touch
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-[var(--ocean-text-secondary)] mb-8">
            Have a project in mind, a question, or just want to say hello? Drop a message. I'll get back to you as soon as possible.
          </motion.p>
          <div className="space-y-4">
            <motion.a href="mailto:freelancer.oceantideco@gmail.com" variants={itemVariants} className="flex items-center justify-center md:justify-start gap-4 text-[var(--ocean-text)] hover:text-[var(--ocean-light)] transition-colors">
              <FiMail className="text-xl text-[var(--ocean-light)]" />
              <span>freelancer.oceantideco@gmail.com</span>
            </motion.a>
            <motion.button 
              onClick={handleDiscordCopy}
              variants={itemVariants} 
              className="flex items-center justify-center md:justify-start gap-4 text-[var(--ocean-text)] hover:text-[var(--ocean-light)] transition-colors w-full text-left"
            >
              <FaDiscord className="text-xl text-[var(--ocean-light)]" />
              <span>squirtledeb</span>
            </motion.button>
          </div>
        </div>

        {/* Right Side: Form */}
        <motion.div variants={itemVariants} className="bg-[var(--ocean-surface)] rounded-xl shadow-lg p-8 border border-[var(--ocean-light)]/10 relative overflow-hidden min-h-[440px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {status === 'idle' || status === 'submitting' ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                className="w-full"
              >
                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[var(--ocean-text-secondary)] mb-1">Name</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-[var(--ocean-deep)] text-[var(--ocean-text)] border border-[var(--ocean-light)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)] transition-all" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[var(--ocean-text-secondary)] mb-1">Email</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-[var(--ocean-deep)] text-[var(--ocean-text)] border border-[var(--ocean-light)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)] transition-all" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[var(--ocean-text-secondary)] mb-1">Subject</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-[var(--ocean-deep)] text-[var(--ocean-text)] border border-[var(--ocean-light)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)] transition-all" required />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[var(--ocean-text-secondary)] mb-1">Message</label>
                    <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-[var(--ocean-deep)] text-[var(--ocean-text)] border border-[var(--ocean-light)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--ocean-light)] transition-all" required></textarea>
                  </div>
                  <div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit" 
                      className="ocean-button w-full"
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            ) : status === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center flex flex-col items-center justify-center"
              >
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.2, type: 'spring', stiffness: 200 }}}>
                  <FiCheckCircle className="text-6xl text-[var(--ocean-light)] mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-[var(--ocean-text-secondary)]">Thanks for reaching out. I'll get back to you soon.</p>
              </motion.div>
            ) : ( // status === 'error'
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-center flex flex-col items-center justify-center"
              >
                <FiXCircle className="text-6xl text-[var(--ocean-accent)] mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Oops!</h3>
                <p className="text-[var(--ocean-text-secondary)] mb-6">Something went wrong. Please try again.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTryAgain}
                  className="ocean-button bg-[var(--ocean-accent)] hover:shadow-[var(--ocean-accent)]/20"
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <footer className="w-full flex justify-center items-center absolute bottom-4">
        <span className="text-white text-xs md:text-sm drop-shadow font-medium bg-[#0099ff]/80 px-4 py-2 rounded-full">
          © 2025 OceanTide Co. All rights reserved.
        </span>
      </footer>
    </div>
  );
} 