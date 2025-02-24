import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'pyq-ai',
  description: 'Solve your questions with pyq-ai',
  generator: 'pyq-ai',
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
