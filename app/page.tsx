import PortfolioClient from "./PortfolioClient"

const SITE = "https://monterdesystems.xyz"
const address = { "@type": "PostalAddress", addressLocality: "Cebu City", addressCountry: "PH" }

const service = (name: string) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: "Rommel Vincent Monterde",
      alternateName: ["Mel Monterde", "Rommel Monterde"],
      jobTitle: "Robotics & AI Systems Engineer",
      url: SITE,
      image: `${SITE}/images/logo.png`,
      address,
      sameAs: ["https://www.linkedin.com/in/monterderv2001/", "https://x.com/vinxx_mntrd"],
      knowsAbout: [
        "AI agents",
        "Large language models",
        "Computer vision",
        "Robotics",
        "Embedded systems",
        "Mechanical design",
        "Hardware prototyping",
        "Automation",
        "AI training",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE}/#service`,
      name: "Monterde Systems",
      url: SITE,
      provider: { "@id": `${SITE}/#person` },
      areaServed: "Worldwide",
      address,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: [
          "Custom AI Agents for Business",
          "AI Sales Call Analysis",
          "Physical AI & Robotics",
          "Hardware Prototyping Services",
          "Custom Internal Tools & Dashboards",
          "AI Training for Employees",
        ].map(service),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Monterde Systems",
    },
  ],
}

export default function PortfolioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PortfolioClient />
    </>
  )
}
