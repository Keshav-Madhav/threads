import React from 'react'
import { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import "../globals.css"

export const metadata: Metadata = {
  title: "Threads",
  description: "A threads clone built with Next.js and clerk.",
};


type Props = {
  children: React.ReactNode
}

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({children}: Props) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

export default RootLayout