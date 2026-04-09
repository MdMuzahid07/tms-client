import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '../provider/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'TMS | Task Management System',
    template: '%s | TMS',
  },
  description: 'A modern, role-based task management system with audit logging.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
