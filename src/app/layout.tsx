import NProgressProvider from '@/components/providers/progress-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
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
  description: 'Digital Twin'
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
