"use client"

import type React from "react"
import Link from "next/link"
import {
  Linkedin,
  Twitter,
  Workflow,
  Cpu,
  Compass,
  Repeat,
  Network,
  ShieldCheck,
  Boxes,
  ArrowRight,
} from "lucide-react"
import RotatingCube from "@/components/rotating-cube"
import { DotSphereSection, DialingPhone, CostMeter } from "@/components/case-studies"
import Navbar from "@/components/navbar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MotionConfig, motion } from "framer-motion"
import { track } from "@vercel/analytics"
import { openBooking } from "@/lib/booking"

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"

const label = "font-atkinson text-xs uppercase tracking-widest font-black"

const outcomes = [
  {
    icon: <Repeat size={22} />,
    title: "Reduce repetitive work",
    desc: "Integrate tools and automate high-friction business processes.",
  },
  {
    icon: <Network size={22} />,
    title: "Connect disconnected systems",
    desc: "Move information reliably between existing platforms and workflows.",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Make AI operational",
    desc: "Design workflows with human oversight, monitoring and maintainability.",
  },
  {
    icon: <Boxes size={22} />,
    title: "Prototype complex ideas",
    desc: "Connect software, sensors, control systems and hardware when needed.",
  },
]

const services = [
  {
    id: "automation",
    icon: <Workflow size={24} />,
    eyebrow: "Core service",
    title: "AI Automation & Systems Integration",
    desc: "Custom AI-assisted workflows, internal tools, CRM and operations integrations, and process automation designed around how your business already runs.",
    items: [
      "Custom AI agents connected to your CRM, inbox, docs and calendar",
      "AI sales call analysis: transcribed, graded against your playbook, rolled into dashboards",
      "Internal tools, data pipelines and dashboards with role-based access",
    ],
    cta: "Discuss an Automation Project",
  },
  {
    id: "robotics",
    icon: <Cpu size={24} />,
    eyebrow: "Software + hardware",
    title: "Physical AI & Robotics Engineering",
    desc: "Prototype and architecture support spanning perception, computer vision, embedded integration and software/hardware systems.",
    items: [
      "Computer vision, sensor fusion and embedded control",
      "Mechanical CAD, 3D-printed parts, wiring and sensor integration",
      "Sketch-to-working-prototype hardware builds",
    ],
    cta: "Discuss a Robotics Project",
  },
  {
    id: "consulting",
    icon: <Compass size={24} />,
    eyebrow: "Advisory",
    title: "Technical Consulting & Product Development",
    desc: "Feasibility, solution architecture, delivery planning, MVP definition, technical leadership and implementation oversight for complex products.",
    items: [
      "Feasibility and solution architecture reviews",
      "MVP definition, scoping and delivery planning",
      "Hands-on AI training so your team can run what gets built",
    ],
    cta: "Talk Through a Technical Challenge",
  },
]

// TODO(owner): confirm each metric's measurement basis (baseline, period, setting) and that the
// project is cleared for publication. Captions below describe the evidence honestly until then.
const caseStudies = [
  {
    context: "QuixyFit Corp. / NoFace",
    title: "Hybrid Leadership Framework",
    challenge:
      "Ship high-quality MVPs quickly across very different domains, from real-time multiplayer games to AI automation, with small teams.",
    role: "Led the engineering teams: scoping, technical direction and delivery.",
    solution:
      "A lean delivery framework pairing small human teams with AI-assisted development and tight weekly scope control.",
    metrics: [
      { value: "10+", label: "MVPs in 10 months" },
      { value: "62–70%", label: "Faster delivery (est.)" },
    ],
    evidence: "Delivery speed figures are self-reported estimates, not client-audited results.",
    visual: <DotSphereSection />,
  },
  {
    context: "Outbound Lead Gen",
    title: "Cost-Efficient Call Engine",
    challenge:
      "High-volume outbound calling where generative AI on every call would make the unit economics unworkable.",
    role: "Designed the call-decision architecture.", // TODO(owner): confirm exact role and permission to publish
    solution:
      "Keyword detection and a finite-state machine (a fixed set of call states with rules for moving between them) instead of a generative model on every turn.",
    metrics: [
      { value: "~$0.02", label: "Cost per call" },
      { value: "<150ms", label: "Decision latency" },
    ],
    evidence: "Internal measurements of the engine, not a client-reported business outcome.",
    visual: <DialingPhone />,
  },
  {
    context: "Eeve + Memograph / AI Dev Tooling",
    title: "AI Memory Management",
    challenge:
      "AI coding agents forget every decision, fix and dead end when a session ends, and burn spend re-learning context.",
    role: "Designed and built both tools; they run my own delivery work.",
    solution:
      "Memograph keeps a running memory of past work across sessions and projects. Eeve plans each job, routes tasks to the cheapest capable model, runs independent pieces in parallel and puts one senior model on review.",
    metrics: [
      { value: "~70%", label: "Lower AI usage cost" },
      { value: "Per task", label: "Cheapest capable model" },
    ],
    evidence: "Internal benchmark on my own development workload.",
    visual: <CostMeter />,
  },
]

const process = [
  { step: "01", title: "Discover", desc: "Understand the workflow, users, constraints and success criteria." },
  { step: "02", title: "Scope", desc: "Define an achievable solution, dependencies and measurable acceptance criteria." },
  { step: "03", title: "Build & Integrate", desc: "Develop the right components and connect them to existing systems." },
  {
    step: "04",
    title: "Validate & Handover",
    desc: "Test against requirements, document decisions and agree on ongoing support if needed.",
  },
]

const faqs = [
  {
    q: "What kinds of projects are a good fit?",
    a: "Businesses with costly, repetitive or fragmented workflows that AI and integration can genuinely improve, and product teams that need specialist help with physical AI, robotics architecture or prototypes. If a simpler non-AI fix is the better answer, I'll say so.",
  },
  {
    q: "What happens on the discovery call?",
    a: "A 30-minute conversation about where your team is stuck and what a good outcome looks like. We'll evaluate fit, clarify requirements and talk through practical next steps. No commitment either way.",
  },
  {
    q: "How long does a project take?",
    a: "It depends on scope. Timelines, deliverables and acceptance criteria are agreed in writing after scoping, not promised up front.",
  },
  {
    q: "How do we work together?",
    a: "Remote, with regular demos of working software rather than status decks. Handover includes documentation and training, and you own the code and accounts. Personal data is scrubbed before it reaches an AI model, and access is role-based.",
  },
  {
    q: "Are you available full-time?",
    a: "No. Monterde Systems is founder-led and I take on a limited number of independent projects alongside existing commitments. That keeps every engagement with one accountable technical lead.",
  },
]

export default function PortfolioClient() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <section className="relative min-h-[100svh] flex items-center bg-surface text-ink pt-28 pb-16 lg:pt-20 lg:pb-0 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="z-10"
            >
              <p className={`${label} opacity-50 mb-6`}>AI Automation · Systems Engineering · Robotics</p>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-6 text-pretty">
                AI systems built around real business problems.
              </h1>
              <p className="text-lg md:text-2xl font-light tracking-tight opacity-70 font-sans max-w-xl">
                I help businesses turn complex workflows and technical challenges into practical AI-powered
                systems, from automation and integrations to physical AI prototypes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <button
                  type="button"
                  onClick={() => {
                    track("hero_cta_click", { cta: "book" })
                    openBooking("hero")
                  }}
                  className={`px-7 py-4 bg-ink text-surface ${label} hover:opacity-90 transition-opacity rounded-sm cursor-pointer ${focusRing}`}
                >
                  Book a Discovery Call
                </button>
                <Link
                  href="#case-studies"
                  onClick={() => track("hero_cta_click", { cta: "work" })}
                  className={`px-7 py-4 border border-line/20 ${label} hover:bg-ink hover:text-surface transition-colors rounded-sm text-center ${focusRing}`}
                >
                  Explore Selected Work
                </Link>
              </div>
              <p className={`${label} opacity-40 mt-8 !font-bold !text-[11px]`}>
                Founder-led delivery · AI consulting · Software + hardware integration
              </p>
              <div className="flex items-center gap-3 mt-6">
                <span className="text-sm opacity-60 mr-1">Rommel &ldquo;Mel&rdquo; Monterde · Cebu, Philippines</span>
                {[
                  {
                    href: "https://www.linkedin.com/in/monterderv2001/",
                    label: "Mel Monterde on LinkedIn",
                    icon: <Linkedin size={16} />,
                  },
                  {
                    href: "https://x.com/vinxx_mntrd",
                    label: "Mel Monterde on X",
                    icon: <Twitter size={16} />,
                  },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={`p-2.5 border border-line/15 hover:bg-ink hover:text-surface transition-all rounded-full flex items-center justify-center ${focusRing}`}
                  >
                    {link.icon}
                  </Link>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="relative h-[320px] lg:h-[600px] flex items-center justify-center"
              aria-hidden="true"
            >
              <RotatingCube />
            </motion.div>
          </div>
        </section>

        {/* Outcomes Section */}
        <section id="outcomes" className="bg-surface-contrast text-ink-contrast py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <motion.div variants={fadeInUp} className="lg:col-span-5">
                <h2 className="text-4xl font-bold tracking-tighter mb-6 text-ink-contrast text-pretty">
                  Less manual work. Better systems. Clearer decisions.
                </h2>
                <p className="text-lg font-light leading-relaxed opacity-80">
                  Whether your team is buried in repetitive processes or building a complex new product, the
                  starting point is the same: understand the constraint, pick the right technology, and ship
                  something useful.
                </p>
              </motion.div>
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink-contrast/10 border border-ink-contrast/10">
                {outcomes.map((o) => (
                  <motion.div key={o.title} variants={fadeInUp} className="p-8 bg-surface-contrast">
                    <div className="mb-5 opacity-50">{o.icon}</div>
                    <h3 className="text-lg font-bold tracking-tight mb-2">{o.title}</h3>
                    <p className="text-sm leading-relaxed opacity-60">{o.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-28 px-6 bg-surface-contrast text-ink-contrast border-t border-ink-contrast/10">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold tracking-tighter mb-16 text-ink-contrast"
            >
              SERVICES
            </motion.h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-ink-contrast/10 border border-ink-contrast/10"
            >
              {services.map((service, i) => (
                <motion.div key={service.id} variants={fadeInUp} className={i === 0 ? "lg:col-span-2" : ""}>
                  <ServiceCard {...service} featured={i === 0} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Case Studies */}
        <section id="case-studies" className="py-28 px-6 bg-surface-alt dark:bg-surface text-ink">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold tracking-tighter mb-20"
            >
              SELECTED WORK
            </motion.h2>

            <div className="space-y-32">
              {caseStudies.map((cs, i) => (
                <motion.article
                  key={cs.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={staggerContainer}
                  onViewportEnter={() => track("case_study_open", { study: cs.title })}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                >
                  <motion.div variants={fadeInUp} className={i % 2 === 1 ? "lg:order-2" : ""}>
                    <p className={`${label} !tracking-[0.2em] opacity-40 mb-4`}>{cs.context}</p>
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tighter mb-8">{cs.title}</h3>
                    <dl className="space-y-5 text-sm leading-relaxed mb-8">
                      {[
                        ["Challenge", cs.challenge],
                        ["My role", cs.role],
                        ["Solution", cs.solution],
                      ].map(([term, detail]) => (
                        <div key={term} className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-4">
                          <dt className={`${label} !text-[11px] opacity-40 pt-0.5`}>{term}</dt>
                          <dd className="opacity-75">{detail}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="grid grid-cols-2 gap-4">
                      {cs.metrics.map((m) => (
                        <div key={m.label} className="p-4 border border-line/15 rounded-sm">
                          <div className="text-2xl font-black">{m.value}</div>
                          <div className="text-[10px] font-atkinson uppercase tracking-widest opacity-50">{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs opacity-50 mt-3">{cs.evidence}</p>
                    <button
                      type="button"
                      onClick={() => openBooking("case_study", cs.title)}
                      className={`mt-8 inline-flex items-center gap-2 ${label} hover:opacity-60 transition-opacity cursor-pointer ${focusRing}`}
                    >
                      Discuss a Similar Challenge <ArrowRight size={14} />
                    </button>
                  </motion.div>
                  <motion.div
                    variants={fadeInUp}
                    className={`h-[320px] md:h-[400px] border border-line/10 rounded-sm overflow-hidden bg-surface/30 dark:bg-surface-alt/60 ${
                      i % 2 === 1 ? "lg:order-1" : ""
                    }`}
                    aria-hidden="true"
                  >
                    {cs.visual}
                  </motion.div>
                </motion.article>
              ))}
            </div>

            <div className="mt-28 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-line/10 pt-10">
              <p className="text-xl font-light opacity-70">Got a similar problem in your business?</p>
              <button
                type="button"
                onClick={() => openBooking("after_work")}
                className={`px-7 py-4 bg-ink text-surface ${label} hover:opacity-90 transition-opacity rounded-sm cursor-pointer ${focusRing}`}
              >
                Book a Discovery Call
              </button>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-28 px-6 bg-surface-contrast text-ink-contrast">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold tracking-tighter mb-16 text-ink-contrast text-pretty"
            >
              A clear path from problem to deployment.
            </motion.h2>
            <motion.ol
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-contrast/10 border border-ink-contrast/10"
            >
              {process.map((p) => (
                <motion.li key={p.step} variants={fadeInUp} className="p-8 bg-surface-contrast">
                  <div className="text-4xl font-black opacity-20 mb-6">{p.step}</div>
                  <h3 className="text-lg font-bold tracking-tight mb-2">{p.title}</h3>
                  <p className="text-sm leading-relaxed opacity-60">{p.desc}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-surface-contrast text-ink-contrast py-28 px-6 border-t border-ink-contrast/10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16"
            >
              <motion.div variants={fadeInUp} className="lg:col-span-4">
                <h2 className="text-4xl font-bold tracking-tighter mb-8 text-ink-contrast">ABOUT</h2>
                <p className="text-xl font-light leading-relaxed opacity-80">
                  I work across technical architecture, AI implementation, project delivery and hardware/software
                  integration. My focus is turning ambiguous problems into reliable systems with clear business or
                  product outcomes.
                </p>
                <p className="text-sm font-light leading-relaxed opacity-60 mt-6">
                  Based in Cebu, Philippines. Working with founders and engineering teams in the US and worldwide.
                </p>
                <Link
                  href="https://www.linkedin.com/in/monterderv2001/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 inline-flex items-center gap-2 ${label} hover:opacity-60 transition-opacity ${focusRing}`}
                >
                  Full professional profile <ArrowRight size={14} />
                </Link>
              </motion.div>

              <div className="lg:col-span-8">
                <motion.h3 variants={fadeInUp} className={`${label} opacity-40 mb-2`}>
                  Experience
                </motion.h3>
                <motion.p variants={fadeInUp} className="text-xs opacity-50 mb-10">
                  Current employment, shown as background. These are not Monterde Systems client engagements.
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <motion.div variants={fadeInUp} className="space-y-6">
                    <div>
                      <h4 className="text-3xl font-bold tracking-tighter text-ink-contrast">Action Drone USA</h4>
                      <p className={`${label} opacity-60 mt-2`}>Founding Engineer · Lead Robotics &amp; AI Architect</p>
                    </div>
                    <p className="text-sm leading-relaxed opacity-70">
                      I own the AI drone program&apos;s architecture across mechanical, electronics and software, from
                      airframe and flight hardware to the onboard AI that lets it sense, decide and act.
                    </p>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="space-y-6">
                    <div>
                      <h4 className="text-3xl font-bold tracking-tighter text-ink-contrast">Prime AI</h4>
                      <p className={`${label} opacity-60 mt-2`}>Pod Lead · Technical Consultant</p>
                    </div>
                    <p className="text-sm leading-relaxed opacity-70">
                      I lead a delivery pod building custom AI platforms for founder-led businesses on fixed 6-week
                      scopes. The job isn&apos;t shipping the project, it&apos;s moving the business: I scope each build
                      around the outcome it has to drive, like more booked calls, faster sales ramp or hours handed
                      back to the team, and measure it against that once it&apos;s live.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-28 px-6 bg-surface-alt dark:bg-surface text-ink">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold tracking-tighter mb-12"
            >
              ENGAGEMENT FIT
            </motion.h2>
            <Accordion type="single" collapsible className="border-t border-line/10">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`} className="border-line/10">
                  <AccordionTrigger className="text-base md:text-lg font-bold tracking-tight py-6 hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed opacity-70 pb-6">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-28 px-6 bg-surface dark:bg-surface-alt text-ink">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-7xl mx-auto flex flex-col items-center text-center"
          >
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-10 max-w-4xl text-pretty">
              Have a workflow or product challenge worth solving?
            </h2>
            <p className="text-lg md:text-xl font-light opacity-60 mb-10 max-w-2xl">
              Share what you&apos;re building or where your team is getting stuck. An initial conversation is for
              evaluating fit, clarifying requirements and discussing practical next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-16">
              <button
                type="button"
                onClick={() => openBooking("contact")}
                className={`px-8 py-4 bg-ink text-surface ${label} hover:opacity-90 transition-opacity rounded-sm cursor-pointer ${focusRing}`}
              >
                Book a Discovery Call
              </button>
              <Link
                href="#project-brief"
                className={`px-8 py-4 border border-line/20 ${label} hover:bg-ink hover:text-surface transition-colors rounded-sm ${focusRing}`}
              >
                Send a Project Brief
              </Link>
            </div>
            <div id="project-brief" className="w-full max-w-2xl scroll-mt-28">
              <p className="text-sm opacity-60 mb-6">
                Include your business type, current process, desired outcome, timeline and approximate budget if
                available.
              </p>
              <div className="elfsight-app-62167af8-ce02-462f-82a8-df7b61938922" data-elfsight-app-lazy></div>
              <p className="text-xs opacity-40 mt-6">
                Details you send are used only to reply to your inquiry and are never sold or shared.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-24 bg-surface-contrast dark:bg-surface text-ink-contrast flex flex-col items-center justify-center relative overflow-hidden">
          <div className="max-w-7xl mx-auto w-full text-center z-10 flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-5xl md:text-8xl font-black tracking-tighter leading-tight mb-16 pt-16"
            >
              DISCOVER. <br /> SCOPE. <br /> BUILD. <br /> HAND OVER.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl mt-12 pt-12 border-t border-ink-contrast/10">
              <nav aria-label="Footer" className="flex flex-col gap-4 text-left">
                <h2 className={`${label} opacity-40`}>Quick Links</h2>
                <div className="flex flex-col gap-2 font-atkinson text-sm uppercase tracking-widest font-bold">
                  {[
                    ["Services", "#services"],
                    ["Work", "#case-studies"],
                    ["Process", "#process"],
                    ["About", "#about"],
                    ["Contact", "#contact"],
                  ].map(([name, href]) => (
                    <Link key={href} href={href} className={`hover:opacity-50 transition-opacity w-fit ${focusRing}`}>
                      {name}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="flex flex-col gap-4 text-left">
                <h2 className={`${label} opacity-40`}>Services</h2>
                <div className="flex flex-col gap-2 font-atkinson text-sm uppercase tracking-widest font-bold">
                  <span className="opacity-70">AI Automation &amp; Integration</span>
                  <span className="opacity-70">Physical AI &amp; Robotics</span>
                  <span className="opacity-70">Technical Consulting</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-left md:text-right">
                <h2 className={`${label} opacity-40`}>Socials</h2>
                <div className="flex flex-col gap-2 font-atkinson text-sm uppercase tracking-widest font-bold items-start md:items-end">
                  <Link
                    href="https://www.linkedin.com/in/monterderv2001/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hover:opacity-50 transition-opacity flex items-center gap-2 ${focusRing}`}
                  >
                    <Linkedin size={14} /> LinkedIn
                  </Link>
                  <Link
                    href="https://x.com/vinxx_mntrd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hover:opacity-50 transition-opacity flex items-center gap-2 ${focusRing}`}
                  >
                    <Twitter size={14} /> Twitter
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-24 text-[10px] font-atkinson font-black uppercase tracking-[0.3em] opacity-40">
              © 2026 MONTERDE SYSTEMS · ROMMEL VINCENT MONTERDE · ALL RIGHTS RESERVED
            </div>
          </div>

          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.03, 0.05, 0.03],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none"
          />
        </footer>
      </main>
    </MotionConfig>
  )
}

function ServiceCard({
  id,
  icon,
  eyebrow,
  title,
  desc,
  items,
  cta,
  featured,
}: {
  id: string
  icon: React.ReactNode
  eyebrow: string
  title: string
  desc: string
  items: string[]
  cta: string
  featured: boolean
}) {
  return (
    <div
      className={`h-full p-8 md:p-10 flex flex-col border border-ink-contrast/5 ${
        featured ? "bg-ink-contrast text-surface-contrast" : "bg-black/20"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className={featured ? "opacity-90" : "opacity-50"}>{icon}</div>
        <span className={`${label} !text-[10px] opacity-60`}>{eyebrow}</span>
      </div>
      <div className={featured ? "lg:grid lg:grid-cols-2 lg:gap-12" : ""}>
        <div>
          <h3 className={`${featured ? "text-2xl md:text-3xl" : "text-xl"} font-bold tracking-tight mb-4`}>{title}</h3>
          <p className="text-sm leading-relaxed opacity-70 mb-6">{desc}</p>
        </div>
        <ul className="space-y-3 text-sm mb-8">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 w-1.5 h-1.5 shrink-0 bg-current opacity-60" />
              <span className="opacity-80">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => {
          track("service_cta_click", { service: id })
          openBooking(`service_${id}`, id)
        }}
        className={`mt-auto self-start inline-flex items-center gap-2 ${label} hover:opacity-60 transition-opacity cursor-pointer ${focusRing}`}
      >
        {cta} <ArrowRight size={14} />
      </button>
    </div>
  )
}
