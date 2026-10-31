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
    default: "Monterde Systems | AI Automation & Systems Engineering",
    template: "%s | Monterde Systems",
  },
  description:
    "Founder-led AI automation, systems integration, technical consulting, and robotics engineering for businesses building practical, reliable solutions.",
  keywords: [
    "AI automation consultant",
    "AI workflow automation",
    "AI systems integration",
    "custom AI agents for business",
    "AI sales call analysis",
    "technical consulting",
    "AI solution architecture",
    "physical AI and robotics",
    "hardware prototyping services",
    "embedded systems engineer",
    "AI developer Philippines",
    "Monterde Systems",
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
    title: "Monterde Systems | AI Automation & Systems Engineering",
    description:
      "Founder-led AI automation, systems integration, technical consulting, and robotics engineering for businesses building practical, reliable solutions.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@vinxx_mntrd",
    title: "Monterde Systems | AI Automation & Systems Engineering",
    description:
      "Founder-led AI automation, systems integration, technical consulting, and robotics engineering for businesses building practical, reliable solutions.",
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
