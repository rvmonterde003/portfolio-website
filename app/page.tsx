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
      jobTitle: "AI Systems Engineer & Technical Consultant",
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
        "Workflow automation",
        "Systems integration",
        "Solution architecture",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE}/#service`,
      name: "Monterde Systems",
      description:
        "Founder-led AI automation, systems integration, technical consulting, and robotics engineering for businesses building practical, reliable solutions.",
      url: SITE,
      provider: { "@id": `${SITE}/#person` },
      areaServed: "Worldwide",
      address,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: [
          "AI Automation & Systems Integration",
          "Physical AI & Robotics Engineering",
          "Technical Consulting & Product Development",
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
