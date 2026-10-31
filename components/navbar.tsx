"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Sun, Moon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { openBooking } from "@/lib/booking"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? resolvedTheme === "dark" : true
  const toggleTheme = () => setTheme(isDark ? "light" : "dark")
  const toggleLabel = mounted
    ? isDark
      ? "Switch to light mode"
      : "Switch to dark mode"
    : "Toggle theme"

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Work", href: "#case-studies" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-surface/40 text-ink border-b border-line/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Monterde Logo" width={32} height={32} className="dark:invert" />
          <span className="font-atkinson text-sm uppercase tracking-widest font-bold hidden sm:inline">monterde</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-atkinson text-sm uppercase tracking-widest font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:opacity-50 transition-opacity rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {link.name}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => openBooking("nav")}
            className="px-4 py-2 bg-ink text-surface rounded-sm hover:opacity-90 transition-opacity font-atkinson text-xs uppercase tracking-widest font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface cursor-pointer"
          >
            Book a Call
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={toggleLabel}
            className="p-2 border border-line/15 hover:bg-ink hover:text-surface transition-colors rounded-sm flex items-center justify-center cursor-pointer"
          >
            {mounted ? isDark ? <Sun size={16} /> : <Moon size={16} /> : <span className="w-4 h-4 block" />}
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={toggleLabel}
            className="p-2 border border-line/15 hover:bg-ink hover:text-surface transition-colors rounded-sm flex items-center justify-center cursor-pointer"
          >
            {mounted ? isDark ? <Sun size={18} /> : <Moon size={18} /> : <span className="w-[18px] h-[18px] block" />}
          </button>
          <button
            type="button"
            className="p-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-20 left-0 w-full backdrop-blur-2xl bg-surface/95 text-ink border-b border-line/10 shadow-xl"
          >
            <div className="flex flex-col p-8 gap-8 font-atkinson text-sm uppercase tracking-widest font-bold">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="hover:opacity-50 transition-opacity border-b border-line/10 pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  {link.name}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  openBooking("nav_mobile")
                }}
                className="w-full px-4 py-3 bg-ink text-surface rounded-sm hover:opacity-90 transition-opacity font-atkinson text-xs uppercase tracking-widest font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface cursor-pointer"
              >
                Book a Discovery Call
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={toggleLabel}
                className="flex items-center justify-between hover:opacity-50 transition-opacity text-left uppercase tracking-widest cursor-pointer"
              >
                <span>{mounted ? (isDark ? "Light Mode" : "Dark Mode") : "Theme"}</span>
                {mounted ? isDark ? <Sun size={18} /> : <Moon size={18} /> : <span className="w-[18px] h-[18px] block" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
