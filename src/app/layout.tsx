import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OceanTide Co. | Freelance Creative Services',
  description: 'Premium creative services by OceanTide Co. - Bringing your vision to life with oceanic inspiration.',
  keywords: 'freelance, creative services, web development, design, OceanTide',
  openGraph: {
    title: 'OceanTide Co. | Freelance Creative Services',
    description: 'Premium creative services by OceanTide Co. - Bringing your vision to life with oceanic inspiration.',
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
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
} 