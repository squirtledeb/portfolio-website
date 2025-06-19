'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check login state from localStorage
  useEffect(() => {
    const user = localStorage.getItem('oceanTideUser');
    if (user) {
      setLoggedIn(true);
      setUsername(user);
    } else {
      setLoggedIn(false);
      setUsername(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('oceanTideUser');
    setLoggedIn(false);
    setUsername(null);
    router.push('/');
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Contact', href: '/contact' },
  ];

  // Hide navbar on the request service page
  if (pathname === '/dashboard/request-service') {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[var(--ocean-deep)]/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0"
          >
            <span className="text-[var(--ocean-light)] text-xl font-bold">OceanTide</span>
          </motion.div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item, index) =>
                ['Reviews', 'Home', 'About', 'Services', 'Portfolio', 'Contact'].includes(item.label) ? (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="text-[var(--ocean-text)] hover:text-[var(--ocean-light)] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ) : null
              )}
            </div>
          </div>

          {/* Dynamic Login/Logout/Dashboard button */}
          {!loggedIn && (
            <Link
              href="/login"
              className="ml-4 text-[var(--ocean-text)] hover:text-[var(--ocean-light)] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
            >
              Login
            </Link>
          )}
          {loggedIn && (pathname === '/dashboard' || pathname === '/admin/dashboard') && (
            <button
              onClick={handleLogout}
              className="ml-4 text-[var(--ocean-text)] hover:text-[var(--ocean-light)] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
            >
              Logout
            </button>
          )}
          {loggedIn && pathname !== '/dashboard' && pathname !== '/admin/dashboard' && (
            <button
              onClick={() => router.push(username === 'OceanTideCo' ? '/admin/dashboard' : `/dashboard?username=${encodeURIComponent(username ?? '')}`)}
              className="ml-4 text-[var(--ocean-text)] hover:text-[var(--ocean-light)] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
            >
              Go to My Dashboard
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation; 