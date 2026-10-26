import type React from "react"
import type { Metadata } from "next"
import { Atkinson_Hyperlegible, Outfit, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"

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
  metadataBase: new URL("https://monterdesystems.xyz"),
  title: {
    default: `Rommel "Mel" Monterde | AI Agents & Robotics Engineer`,
    template: `%s | Mel Monterde`,
  },
  description: `Custom AI agents, AI sales call analysis, physical AI and hardware prototyping, built end to end by Rommel "Mel" Monterde, robotics & AI engineer in Cebu, Philippines.`,
  keywords: [
    "custom AI agents for business",
    "AI agent developer",
    "AI sales call analysis",
    "physical AI and robotics",
    "robotics prototyping services",
    "hardware prototyping services",
    "embedded systems engineer",
    "AI training for employees",
    "AI automation consultant",
    "AI developer Philippines",
    "Rommel Vincent Monterde",
    "Mel Monterde",
  ],
  authors: [{ name: "Rommel Vincent Monterde", url: "https://monterdesystems.xyz" }],
  creator: "Rommel Vincent Monterde",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Monterde Systems",
    locale: "en_US",
    title: `Rommel "Mel" Monterde | AI Agents & Robotics Engineer`,
    description: `Custom AI agents, AI sales call analysis, physical AI and hardware prototyping, built end to end by Rommel "Mel" Monterde, robotics & AI engineer in Cebu, Philippines.`,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@vinxx_mntrd",
    title: `Rommel "Mel" Monterde | AI Agents & Robotics Engineer`,
    description: `Custom AI agents, AI sales call analysis, physical AI and hardware prototyping, built end to end by Rommel "Mel" Monterde, robotics & AI engineer in Cebu, Philippines.`,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script src="https://elfsightcdn.com/platform.js" async></script>
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
        <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
      </head>
      <body
        className={`${atkinson.variable} ${outfit.variable} ${geistMono.variable} font-sans antialiased bg-surface text-ink`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
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
