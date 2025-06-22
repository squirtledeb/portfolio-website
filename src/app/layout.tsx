import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://oceantideco.onrender.com'),
  title: 'OceanTide | Freelance Creative Services',
  description: 'Premium creative services by OceanTide - Bringing your vision to life with oceanic inspiration.',
  keywords: 'freelance, creative services, web development, design, OceanTide',
  openGraph: {
    title: 'OceanTide | Freelance Creative Services',
    description: 'Premium creative services by OceanTide - Bringing your vision to life with oceanic inspiration.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen pb-0">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
} 