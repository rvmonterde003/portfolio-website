import type { Metadata } from "next"
import PortfolioClient from "./PortfolioClient"

export const metadata: Metadata = {
  title: "Rommel Vincent Monterde | Solutions Architect",
}

export default function PortfolioPage() {
  return <PortfolioClient />
}
