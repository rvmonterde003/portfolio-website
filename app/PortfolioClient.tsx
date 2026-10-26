"use client"

import type React from "react"
import Link from "next/link"
import { Linkedin, Twitter, Cpu, Brain, Megaphone, BarChart3, Briefcase, Users } from "lucide-react"
import RotatingCube from "@/components/rotating-cube"
import { DotSphereSection, DialingPhone, CostMeter } from "@/components/case-studies"
import Navbar from "@/components/navbar"
import { motion } from "framer-motion"

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

export default function PortfolioClient() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-surface text-ink pt-32 pb-20 lg:pt-20 lg:pb-0 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="z-10"
          >
            <p className="font-atkinson text-xs uppercase tracking-widest font-black opacity-50 mb-6">
              Robotics &amp; AI Systems Engineer · Cebu, Philippines
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6 text-pretty">
              ROMMEL <br /> VINCENT <br /> MONTERDE
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-tight opacity-70 font-sans max-w-md">
              I build AI agents, robots and the tools that run them.
            </p>
            <p className="text-xl md:text-2xl font-light tracking-tight opacity-70 font-sans max-w-md">
              From CAD and circuits to production AI. One engineer, end to end.
            </p>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex gap-4 mt-12">
              {[
                {
                  href: "https://www.linkedin.com/in/monterderv2001/",
                  label: "Mel Monterde on LinkedIn",
                  icon: <Linkedin size={20} />,
                },
                {
                  href: "https://x.com/vinxx_mntrd",
                  label: "Mel Monterde on X",
                  icon: <Twitter size={20} />,
                },
              ].map((link, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="p-3 border border-line/15 hover:bg-ink hover:text-surface transition-all rounded-full flex items-center justify-center"
                  >
                    {link.icon}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="relative h-[400px] lg:h-[600px] flex items-center justify-center"
          >
            <RotatingCube />
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-surface-contrast text-ink-contrast py-32 px-6">
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
                Most teams hire four people to ship one autonomous system: a mechanical designer, an electronics
                engineer, an AI developer and someone to build the internal tools. I&apos;m all four. I design the
                hardware, build the AI, make the tools around it, and train your team to run it.
              </p>
              <p className="text-sm font-light leading-relaxed opacity-60 mt-6">
                Based in Cebu, Philippines. Working with founders and engineering teams in the US and worldwide.
              </p>
            </motion.div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div variants={fadeInUp} className="space-y-6">
                <h3 className="font-atkinson text-xs uppercase tracking-widest font-black opacity-40">The Stack</h3>
                <blockquote className="text-2xl leading-relaxed italic bg-ink-contrast text-surface-contrast px-4 py-2 inline-block">
                  &ldquo;The only stack that matters is the one that solves the problem.&rdquo;
                </blockquote>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-6">
                <h3 className="font-atkinson text-xs uppercase tracking-widest font-black opacity-40">How I Work</h3>
                <p className="text-sm leading-relaxed opacity-70">
                  Fixed scope, fixed timeline. Week 0 is access and setup, then a demo every week, then
                  handover with docs and training. You own the code and the accounts from day one. Security is built
                  in: personal data is scrubbed before it reaches an AI model, access is role-based, and every feature
                  is reviewed before release.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-6">
                <h3 className="font-atkinson text-xs uppercase tracking-widest font-black opacity-40">Now</h3>
                <p className="text-sm leading-relaxed opacity-70">
                  Founding Engineer, Lead Robotics &amp; AI Architect at Klick Drone — I own the AI drone program&apos;s
                  architecture across mechanical, electronics and software.
                </p>
                <p className="text-sm leading-relaxed opacity-70">
                  Pod Lead &amp; Technical Lead at Prime AI — I lead a delivery pod building custom AI platforms for
                  founder-led businesses on fixed 6-week scopes.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 bg-surface-contrast text-ink-contrast">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tighter mb-16 text-ink-contrast"
          >
            WHAT I BUILD
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-contrast/10 border border-ink-contrast/10 items-stretch auto-rows-fr"
          >
            {[
              {
                icon: <Brain size={24} />,
                title: "Custom AI Agents for Business",
                desc: "AI agents that plug into your CRM, inbox, docs and calendar and do real work, not demos.",
              },
              {
                icon: <BarChart3 size={24} />,
                title: "AI Sales Call Analysis",
                desc: "Every sales call transcribed, graded against your playbook and rolled into CRM dashboards, so coaching runs on what actually happened.",
              },
              {
                icon: <Cpu size={24} />,
                title: "Physical AI & Robotics",
                desc: "Computer vision, sensor fusion and embedded control for robots that sense, decide and act in the real world.",
              },
              {
                icon: <Briefcase size={24} />,
                title: "Hardware Prototyping Services",
                desc: "Mechanical CAD, 3D-printed parts, wiring and sensor integration, from sketch to a working prototype.",
              },
              {
                icon: <Megaphone size={24} />,
                title: "Custom Internal Tools & Dashboards",
                desc: "Admin panels, data pipelines and dashboards your team actually opens every day, with role-based access built in.",
              },
              {
                icon: <Users size={24} />,
                title: "AI Training for Employees",
                desc: 'Hands-on workshops that take your team from "we tried ChatGPT" to running AI in daily work, on your own tools.',
              },
            ].map((service, i) => (
              <motion.div key={i} variants={fadeInUp} className="h-full">
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="py-32 px-6 bg-surface-alt dark:bg-surface text-ink">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tighter mb-24"
          >
            SELECTED WORK
          </motion.h2>

          <div className="space-y-48">
            {/* Case Study 1 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
            >
              <motion.div variants={fadeInUp} className="order-2 lg:order-1">
                <h3 className="text-xs font-atkinson font-black tracking-[0.2em] uppercase opacity-40 mb-4">
                  QuixyFit Corp. / NoFace
                </h3>
                <h4 className="text-4xl font-bold tracking-tighter mb-6">Hybrid Leadership Framework</h4>
                <p className="text-sm leading-relaxed opacity-70 mb-8">
                  Leading small engineering teams to deliver high-quality MVPs rapidly across radically different
                  domains—from real-time multiplayer games to AI automation systems.
                </p>
                <ul className="space-y-3 text-sm font-bold font-atkinson uppercase tracking-tight">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-ink" /> 10+ MVPs in 10 months
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-ink" /> 62-70% faster delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-ink" /> 60-70% cost reduction
                  </li>
                </ul>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="order-1 lg:order-2 h-[400px] border border-line/10 rounded-sm overflow-hidden bg-surface/30 dark:bg-surface-alt/60"
              >
                <DotSphereSection />
              </motion.div>
            </motion.div>

            {/* Case Study 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
            >
              <motion.div
                variants={fadeInUp}
                className="h-[400px] border border-line/10 rounded-sm overflow-hidden bg-surface/30 dark:bg-surface-alt/60"
              >
                <DialingPhone />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h3 className="text-xs font-atkinson font-black tracking-[0.2em] uppercase opacity-40 mb-4">
                  Outbound Lead Gen
                </h3>
                <h4 className="text-4xl font-bold tracking-tighter mb-6">Cost-Efficient Call Engine</h4>
                <p className="text-sm leading-relaxed opacity-70 mb-8">
                  A telecom-grade solution for high-volume outbound calls using keyword detection and FSM architecture
                  instead of expensive generative AI.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-line/15 rounded-sm">
                    <div className="text-2xl font-black">$0.02</div>
                    <div className="text-[10px] font-atkinson uppercase tracking-widest opacity-40">Cost per call</div>
                  </div>
                  <div className="p-4 border border-line/15 rounded-sm">
                    <div className="text-2xl font-black">&lt;150ms</div>
                    <div className="text-[10px] font-atkinson uppercase tracking-widest opacity-40">
                      Decision Latency
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Case Study 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
            >
              <motion.div variants={fadeInUp} className="order-2 lg:order-1">
                <h3 className="text-xs font-atkinson font-black tracking-[0.2em] uppercase opacity-40 mb-4">
                  Eeve + Memograph / AI Dev Tooling
                </h3>
                <h4 className="text-4xl font-bold tracking-tighter mb-6">AI Memory Management</h4>
                <p className="text-sm leading-relaxed opacity-70 mb-8">
                  AI coding agents burn most of their budget relearning what they already knew: re-reading files,
                  re-asking for context, using a top-tier model for routine work. I built my own tooling to stop that.
                  Memograph gives agents a lasting memory of past work, graphify turns the codebase into a map they can
                  look up instead of re-read, and Eeve sends each task to the right model and runs independent work in
                  parallel.
                </p>
                <ul className="space-y-3 text-sm font-bold font-atkinson uppercase tracking-tight">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-ink" /> ~70% usage cost reduction
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-ink" /> Context carries over between sessions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-ink" /> Parallel agents, one reviewer
                  </li>
                </ul>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="order-1 lg:order-2 h-[400px] border border-line/10 rounded-sm overflow-hidden bg-surface/30 dark:bg-surface-alt/60"
              >
                <CostMeter />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-surface dark:bg-surface-alt text-ink">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-7xl mx-auto flex flex-col items-center text-center"
        >
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12">BUILD IT ONCE.</h2>
          <p className="text-xl font-light opacity-60 mb-16 max-w-2xl">
            Got a process that should run itself, or a robot that should exist? Send the brief below or book a
            30-minute call. Software, hardware, or both.
          </p>
          <div className="w-full max-w-2xl mb-12">
            <div className="elfsight-app-62167af8-ce02-462f-82a8-df7b61938922" data-elfsight-app-lazy></div>
          </div>
          <button
            onClick={() => (window as any).Calendly?.showPopupWidget("https://calendly.com/rommelvincent2001/30min")}
            className="px-8 py-4 bg-ink text-surface font-atkinson font-black uppercase tracking-widest hover:opacity-90 transition-colors rounded-sm"
          >
            Book a 30-Min Call
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="min-h-screen px-6 py-20 bg-surface-contrast dark:bg-surface text-ink-contrast flex flex-col items-center justify-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full text-center z-10 flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-black tracking-tighter leading-tight mb-20 pt-32"
          >
            SCOPE. <br /> BUILD. <br /> SHIP. <br /> TRAIN.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl mt-12 pt-12 border-t border-ink-contrast/10">
            <div className="flex flex-col gap-4 text-left">
              <h3 className="font-atkinson text-xs uppercase tracking-widest font-black opacity-40">Quick Links</h3>
              <div className="flex flex-col gap-2 font-atkinson text-sm uppercase tracking-widest font-bold">
                <Link href="#about" className="hover:opacity-50 transition-opacity">
                  About
                </Link>
                <Link href="#services" className="hover:opacity-50 transition-opacity">
                  Services
                </Link>
                <Link href="#case-studies" className="hover:opacity-50 transition-opacity">
                  Work
                </Link>
                <Link href="#contact" className="hover:opacity-50 transition-opacity">
                  Contact
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-left">
              <h3 className="font-atkinson text-xs uppercase tracking-widest font-black opacity-40">Services</h3>
              <div className="flex flex-col gap-2 font-atkinson text-sm uppercase tracking-widest font-bold">
                <span className="opacity-70">Custom AI Agents</span>
                <span className="opacity-70">AI Sales Call Analysis</span>
                <span className="opacity-70">Physical AI &amp; Robotics</span>
                <span className="opacity-70">Hardware Prototyping</span>
                <span className="opacity-70">Internal Tools &amp; Dashboards</span>
                <span className="opacity-70">AI Training for Employees</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-left md:text-right">
              <h3 className="font-atkinson text-xs uppercase tracking-widest font-black opacity-40">Socials</h3>
              <div className="flex flex-col gap-2 font-atkinson text-sm uppercase tracking-widest font-bold items-start md:items-end">
                <Link
                  href="https://www.linkedin.com/in/monterderv2001/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-50 transition-opacity flex items-center gap-2"
                >
                  <Linkedin size={14} /> LinkedIn
                </Link>
                <Link
                  href="https://x.com/vinxx_mntrd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-50 transition-opacity flex items-center gap-2"
                >
                  <Twitter size={14} /> Twitter
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-32 text-[10px] font-atkinson font-black uppercase tracking-[0.3em] opacity-40">
            © 2026 MONTERDE · ROMMEL VINCENT · ALL RIGHTS RESERVED
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
  )
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="h-full min-h-full p-10 bg-black/20 group hover:bg-ink-contrast hover:text-surface-contrast transition-all duration-500 border border-ink-contrast/5 flex flex-col">
      <div className="mb-8 opacity-40 group-hover:opacity-100 transition-opacity">{icon}</div>
      <h3 className="text-xl font-bold tracking-tight mb-4">{title}</h3>
      <p className="text-sm leading-relaxed opacity-60 group-hover:opacity-80">{desc}</p>
    </div>
  )
}
