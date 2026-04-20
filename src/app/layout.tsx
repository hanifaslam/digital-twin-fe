import NProgressProvider from '@/components/providers/progress-provider'
import { PwaProvider } from '@/components/providers/pwa-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Digital Twin',
  description: 'Digital Twin - Smart Building Management System',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Digital Twin'
  }
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NProgressProvider>
          <PwaProvider />
          <QueryProvider>{children}</QueryProvider>
          <Toaster
            position="top-center"
            expand={false}
            visibleToasts={1}
            richColors={false}
            closeButton={true}
            toastOptions={{
              duration: 4000
            }}
          />
        </NProgressProvider>
      </body>
    </html>
  )
}
