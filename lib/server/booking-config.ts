import "server-only"

// Keep calendar rules pure so they can also be checked without a Next.js runtime.
export {
  TIMEZONE, WORKING_DAYS, WORK_START_HOUR, WORK_END_HOUR, SLOT_MINUTES,
  BUFFER_MINUTES, MIN_NOTICE_HOURS, MAX_DAYS_AHEAD,
} from "./slots"

function required(value: string | undefined): string {
  if (!value?.trim()) throw new Error("Booking configuration unavailable")
  return value.trim()
}

export function getGoogleConfig() {
  return {
    clientId: required(process.env.GOOGLE_CLIENT_ID),
    clientSecret: required(process.env.GOOGLE_CLIENT_SECRET),
    refreshToken: required(process.env.GOOGLE_REFRESH_TOKEN),
    calendarId: process.env.GOOGLE_CALENDAR_ID?.trim() || "primary",
  }
}

export function getRedisConfig() {
  return {
    url: required(process.env.UPSTASH_REDIS_REST_URL),
    token: required(process.env.UPSTASH_REDIS_REST_TOKEN),
  }
}

export function getTurnstileSecret(): string {
  return required(process.env.TURNSTILE_SECRET_KEY)
}

export function getAllowedOrigins(): string[] {
  return (process.env.BOOKING_ALLOWED_ORIGINS || "").split(",").map((origin) => origin.trim()).filter((origin) => {
    try {
      const url = new URL(origin)
      return ["https:", "http:"].includes(url.protocol) && url.origin === origin
    } catch { return false }
  })
}

export function isBookingConfigured(): boolean {
  try {
    getGoogleConfig()
    getRedisConfig()
    getTurnstileSecret()
    return getAllowedOrigins().length > 0
  } catch { return false }
}

export function isMock(): boolean {
  return process.env.BOOKING_MOCK === "1" && process.env.NODE_ENV !== "production"
}
