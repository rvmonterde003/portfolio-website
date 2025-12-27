"use client"

import type React from "react"
import Link from "next/link"
import { Linkedin, Twitter, ArrowUpRight, Cpu, Layout, Bot, Workflow, PenTool, Database } from "lucide-react"
import RotatingCube from "@/components/rotating-cube"
import { DotSphereSection, DialingPhone, PixelCharacter } from "@/components/case-studies"
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

const CASE_STUDY_LINKS = {
  HYBRID_LEADERSHIP:
    "https://www.notion.so/Frameworks-I-Use-to-Deliver-High-Quality-and-Efficient-Software-Architecture-2c4ffcaadedf804095a9c8d0a36bcc95?source=copy_link",
  CALL_ENGINE:
    "https://www.notion.so/Lightweight-AI-Dialer-A-Cost-Efficient-Keyword-Driven-Call-Engine-2c4ffcaadedf80f999f4f64fe8d06ed4?source=copy_link",
  GAME_FITNESS: "https://www.notion.so/Case-Study-Fun-Before-Fit-2c4ffcaadedf80b29f4bddc6377a9668?source=copy_link",
}

export default function PortfolioClient() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-[#e4e4e4] pt-32 pb-20 lg:pt-20 lg:pb-0 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="z-10"
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6 text-pretty">
              ROMMEL <br /> VINCENT <br /> MONTERDE
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-tight opacity-70 font-sans max-w-md">
              Solutions Architect · Web & Automation Systems
            </p>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex gap-4 mt-12">
              {[
                {
                  href: "https://www.linkedin.com/in/monterderv2001/",
                  icon: <Linkedin size={20} />,
                },
                {
                  href: "https://x.com/vinxx_mntrd",
                  icon: <Twitter size={20} />,
                },
                {
                  href: "https://www.upwork.com/freelancers/~01916695fddcbb8731",
                  icon: <ArrowUpRight size={20} />,
                },
              ].map((link, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Link
                    href={link.href}
                    target="_blank"
                    className="p-3 border border-black/10 hover:bg-black hover:text-white transition-all rounded-full flex items-center justify-center"
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
      <section id="about" className="bg-[#1e1e1e] text-[#e4e4e4] py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-16"
          >
            <motion.div variants={fadeInUp} className="lg:col-span-4">
              <h2 className="text-4xl font-bold tracking-tighter mb-8 text-[#e4e4e4]">ABOUT</h2>
              <p className="text-xl font-light leading-relaxed opacity-80">
                Delivers fast, scalable MVPs across game development, AI, automation, and real-time systems. I turn
                ideas into working products efficiently, with measurable results.
              </p>
            </motion.div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div variants={fadeInUp} className="space-y-6">
                <h3 className="font-atkinson text-xs uppercase tracking-widest font-black opacity-40">The Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "n8n",
                    "Make",
                    "Twilio",
                    "Freeswitch",
                    "Python",
                    "JSON",
                    "Supabase",
                    "AWS",
                    "Vercel",
                    "Node.js",
                    "React.js",
                    "Express.js",
                    "Next.js",
                    "C++",
                    "Unity",
                    "Figma",
                    "Blender",
                    "Photoshop",
                    "Illustrator",
                  ].map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 bg-[#e4e4e4] text-[#1e1e1e] font-atkinson text-xs font-bold uppercase hover:bg-[#1e1e1e] hover:text-[#e4e4e4] hover:outline hover:outline-1 hover:outline-[#e4e4e4] transition-all cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-6">
                <h3 className="font-atkinson text-xs uppercase tracking-widest font-black opacity-40">The Approach</h3>
                <p className="text-sm leading-relaxed opacity-70">
                  I lead through Agile-Lean hybrid methodology with servant leadership, combining Feature-Driven
                  Development with XP's collaborative iteration cycles. I provide technical vision through flowcharts
                  and core architecture while empowering team members as equals.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 bg-[#1e1e1e] text-[#e4e4e4]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tighter mb-16 text-[#e4e4e4]"
          >
            SERVICES
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10"
          >
            {[
              {
                icon: <Layout size={24} />,
                title: "POS Systems",
                desc: "Full-stack point-of-sale solutions tailored for retail and hospitality.",
              },
              {
                icon: <Cpu size={24} />,
                title: "Embedded Systems",
                desc: "Hardware-software integration for real-time monitoring and control.",
              },
              {
                icon: <Workflow size={24} />,
                title: "Proposal Automation",
                desc: "Streamlining complex business proposals with intelligent workflows.",
              },
              {
                icon: <Bot size={24} />,
                title: "AI Automation",
                desc: "Deploying custom AI agents and NLP models for business efficiency.",
              },
              {
                icon: <Database size={24} />,
                title: "Workflow Automation",
                desc: "Connecting disparate tools via n8n and custom API middleware.",
              },
              {
                icon: <PenTool size={24} />,
                title: "Design & Illustration",
                desc: "Product design and technical illustration using modern creative tools.",
              },
            ].map((service, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tighter mb-24"
          >
            CASE STUDIES
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
                <Link
                  href={CASE_STUDY_LINKS.HYBRID_LEADERSHIP}
                  target="_blank"
                  className="inline-flex items-center gap-2 mb-8 px-6 py-3 border border-black font-atkinson text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  View Case Study <ArrowUpRight size={14} />
                </Link>
                <ul className="space-y-3 text-sm font-bold font-atkinson uppercase tracking-tight">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black" /> 10+ MVPs in 10 months
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black" /> 62-70% faster delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black" /> 60-70% cost reduction
                  </li>
                </ul>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="order-1 lg:order-2 h-[400px] border border-black/5 rounded-sm overflow-hidden bg-[#e4e4e4]/30"
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
                className="h-[400px] border border-black/5 rounded-sm overflow-hidden bg-[#e4e4e4]/30"
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
                <Link
                  href={CASE_STUDY_LINKS.CALL_ENGINE}
                  target="_blank"
                  className="inline-flex items-center gap-2 mb-8 px-6 py-3 border border-black font-atkinson text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  View Case Study <ArrowUpRight size={14} />
                </Link>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-black/10 rounded-sm">
                    <div className="text-2xl font-black">$0.02</div>
                    <div className="text-[10px] font-atkinson uppercase tracking-widest opacity-40">Cost per call</div>
                  </div>
                  <div className="p-4 border border-black/10 rounded-sm">
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
                  Motion Prototyping
                </h3>
                <h4 className="text-4xl font-bold tracking-tighter mb-6">Game-First Fitness</h4>
                <p className="text-sm leading-relaxed opacity-70 mb-8">
                  Reversing traditional fitness app design—prioritizing gameplay over workouts—using MediaPipe pose
                  detection and Unity for hardware-free motion gaming.
                </p>
                <Link
                  href={CASE_STUDY_LINKS.GAME_FITNESS}
                  target="_blank"
                  className="inline-flex items-center gap-2 mb-8 px-6 py-3 border border-black font-atkinson text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  View Case Study <ArrowUpRight size={14} />
                </Link>
                <div className="flex flex-wrap gap-2">
                  {["MediaPipe", "Unity", "Motion Tracking"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 border border-black/20 text-[10px] font-atkinson font-bold uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="order-1 lg:order-2 h-[400px] border border-black/5 rounded-sm overflow-hidden bg-[#e4e4e4]/30"
              >
                <PixelCharacter />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-[#e4e4e4] text-[#1e1e1e]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-7xl mx-auto flex flex-col items-center text-center"
        >
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12">LET&apos;S CHAT.</h2>
          <p className="text-xl font-light opacity-60 mb-16 max-w-2xl">
            Currently open for architecture consulting and high-velocity MVP builds.
          </p>
          <div className="w-full max-w-2xl mb-12">
            <div className="elfsight-app-62167af8-ce02-462f-82a8-df7b61938922" data-elfsight-app-lazy></div>
          </div>
          <button
            onClick={() => (window as any).Calendly?.showPopupWidget("https://calendly.com/rommelvincent2001/30min")}
            className="px-8 py-4 bg-[#1e1e1e] text-[#e4e4e4] font-atkinson font-black uppercase tracking-widest hover:bg-black transition-colors rounded-sm"
          >
            Book a Call
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="min-h-screen px-6 py-20 bg-[#1e1e1e] text-[#e4e4e4] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full text-center z-10 flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-black tracking-tighter leading-tight mb-20 pt-32"
          >
            IDENTIFY. <br /> SIMPLIFY. <br /> OPTIMIZE. <br /> BUILD.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl mt-12 pt-12 border-t border-white/10">
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
                  Case Studies
                </Link>
                <Link href="#contact" className="hover:opacity-50 transition-opacity">
                  Contact
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-left">
              <h3 className="font-atkinson text-xs uppercase tracking-widest font-black opacity-40">Services</h3>
              <div className="flex flex-col gap-2 font-atkinson text-sm uppercase tracking-widest font-bold">
                <span className="opacity-70">POS Systems</span>
                <span className="opacity-70">Embedded Systems</span>
                <span className="opacity-70">AI Automation</span>
                <span className="opacity-70">Workflow Automation</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-left md:text-right">
              <h3 className="font-atkinson text-xs uppercase tracking-widest font-black opacity-40">Socials</h3>
              <div className="flex flex-col gap-2 font-atkinson text-sm uppercase tracking-widest font-bold items-start md:items-end">
                <Link
                  href="https://www.linkedin.com/in/monterderv2001/"
                  target="_blank"
                  className="hover:opacity-50 transition-opacity flex items-center gap-2"
                >
                  <Linkedin size={14} /> LinkedIn
                </Link>
                <Link
                  href="https://x.com/vinxx_mntrd"
                  target="_blank"
                  className="hover:opacity-50 transition-opacity flex items-center gap-2"
                >
                  <Twitter size={14} /> Twitter
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-32 text-[10px] font-atkinson font-black uppercase tracking-[0.3em] opacity-40">
            © 2025 MONTERDE · ROMMEL VINCENT · ALL RIGHTS RESERVED
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
    <div className="p-10 bg-black/20 group hover:bg-[#e4e4e4] hover:text-[#1e1e1e] transition-all duration-500 border border-white/5">
      <div className="mb-8 opacity-40 group-hover:opacity-100 transition-opacity">{icon}</div>
      <h3 className="text-xl font-bold tracking-tight mb-4">{title}</h3>
      <p className="text-sm leading-relaxed opacity-60 group-hover:opacity-80">{desc}</p>
    </div>
  )
}
