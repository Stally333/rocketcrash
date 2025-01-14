import './globals.css'
import React from 'react'
import { Poppins } from 'next/font/google'
import Header from '../components/Header/Header'
import { GameProvider } from '@/contexts/GameContext'

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <GameProvider>
          <Header />
          {children}
        </GameProvider>
      </body>
    </html>
  )
} 