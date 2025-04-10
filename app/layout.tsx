import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Babe Procia System',
  description: 'A modern point of sale system for Babe Procia',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
