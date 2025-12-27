import type React from "react"
import type { Metadata } from "next"
import { Atkinson_Hyperlegible, Outfit, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Script from "next/script"

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Rommel Vincent Monterde | Solutions Architect",
  description: "Solutions Architect specializing in Web & Automation Systems.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script src="https://elfsightcdn.com/platform.js" async></script>
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
        <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
      </head>
      <body
        className={`${atkinson.variable} ${outfit.variable} ${geistMono.variable} font-sans antialiased bg-[#e4e4e4] text-[#1e1e1e]`}
      >
        {children}
        <Analytics />
        <Script id="calendly-init" strategy="afterInteractive">
          {`
            window.onload = function() {
              Calendly.initBadgeWidget({
                url: 'https://calendly.com/rommelvincent2001/30min',
                text: 'Schedule time with me',
                color: '#000000',
                textColor: '#ffffff',
                branding: true
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
