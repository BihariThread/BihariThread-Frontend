import type { Metadata } from 'next'
import { Poppins, Montserrat } from 'next/font/google'

import './globals.css'
import { Toaster } from 'sonner'


const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-montserrat'
})

export const metadata: Metadata = {
  title: 'BihariThread - Premium Fashion & Culture',
  description: 'Rooted in Bihar. Worn Everywhere. Discover authentic Bihari-inspired fashion with premium quality and cultural pride.',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  openGraph: {
    title: 'BihariThread - Premium Fashion & Culture',
    description: 'Rooted in Bihar. Worn Everywhere.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <body className="font-poppins antialiased bg-background text-foreground">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
