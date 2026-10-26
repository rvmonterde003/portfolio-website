import type { Metadata } from "next"
import PortfolioClient from "./PortfolioClient"

export const metadata: Metadata = {
  title: 'Rommel Vincent "Mel" Monterde | Robotics & AI Systems Engineer',
  description: "I build autonomous systems end to end: AI agents and apps, physical AI and robotics, custom tools, and AI training for teams.",
}

export default function PortfolioPage() {
  return <PortfolioClient />
}
