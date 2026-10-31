import { track } from "@vercel/analytics"

export const BOOKING_URL = "https://calendly.com/rommelvincent2001/30min"

// Opens the Calendly popup; falls back to a new tab if the widget script hasn't loaded.
// `source` tags where the click came from (utm_content in Calendly, plus a Vercel event).
export function openBooking(source: string, service?: string) {
  track("booking_click", service ? { source, service } : { source })
  const url = `${BOOKING_URL}?utm_source=website&utm_content=${encodeURIComponent(source)}`
  const calendly = (window as any).Calendly
  if (calendly?.showPopupWidget) calendly.showPopupWidget(url)
  else window.open(url, "_blank", "noopener,noreferrer")
}
