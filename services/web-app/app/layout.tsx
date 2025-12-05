import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import BottomNav from '@/components/BottomNav'
import { HalloweenProvider } from '@/components/HalloweenContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Veris - Truth Matters',
  description: 'AI-powered fact-checking platform',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <HalloweenProvider>
          <div className="flex min-h-screen bg-white">
            <Sidebar />
            <main className="flex-1 pb-20 md:pb-0 overflow-y-auto md:ml-[244px]">
              {children}
            </main>
          </div>
          <BottomNav />
        </HalloweenProvider>
      </body>
    </html>
  )
}
