import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Analisa Trading Forex Gold (XAU/USD)',
  description: 'Analisis teknikal real-time untuk trading Forex Gold dengan indikator dan sinyal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
