import { track } from "@vercel/analytics"

export type BookingIntent = { source: string; service?: string }

const listeners = new Set<(intent: BookingIntent) => void>()
let pending: BookingIntent | undefined

export function subscribeToBooking(listener: (intent: BookingIntent) => void) {
  listeners.add(listener)
  if (pending) {
    const intent = pending
    pending = undefined
    listener(intent)
  }
  return () => { listeners.delete(listener) }
}

export function bookingFallbackUrl(source: string) {
  return `https://calendly.com/rommelvincent2001/30min?utm_source=website&utm_content=${encodeURIComponent(source)}`
}

export function openBooking(source: string, service?: string) {
  track("booking_click", service ? { source, service } : { source })
  if (typeof window === "undefined") return
  const nativeEnabled = process.env.NEXT_PUBLIC_BOOKING_ENABLED === "1" &&
    (Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()) || process.env.NODE_ENV !== "production")
  if (!nativeEnabled) {
    window.open(bookingFallbackUrl(source), "_blank", "noopener,noreferrer")
    return
  }
  const intent = { source, service }
  if (!listeners.size) pending = intent
  else listeners.forEach((listener) => listener(intent))
}
