// Shared request/response contract for native booking. Safe for client and server: no secrets here.
import { z } from "zod"

export const SLOT_MINUTES = 30

// GET /api/availability?from=YYYY-MM-DD&days=1..7
export const availabilityQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  days: z.coerce.number().int().min(1).max(7).default(7),
})

export type Slot = { start: string; end: string } // ISO 8601 UTC

export type AvailabilityResponse = {
  timezone: string // owner timezone, e.g. "Asia/Manila"
  slots: Slot[]
}

// POST /api/book
export const bookRequestSchema = z
  .object({
    start: z.string().datetime({ offset: true }),
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(254),
    note: z.string().trim().max(2000).optional().default(""),
    source: z.string().trim().min(1).max(40).regex(/^[a-z0-9_]+$/),
    service: z.string().trim().max(80).optional(),
    turnstileToken: z.string().max(4096),
    company: z.string().max(200).optional().default(""), // honeypot: must be empty
  })
  .strict()

export type BookRequest = z.input<typeof bookRequestSchema>

export type BookResponse = { status: "confirmed"; start: string; end: string }

export type BookingErrorCode =
  | "invalid_request" // 400
  | "forbidden" // 403: bad origin, failed Turnstile, honeypot
  | "slot_taken" // 409
  | "rate_limited" // 429
  | "unavailable" // 503: booking disabled, Google/Upstash failure

export type BookingError = { error: BookingErrorCode; requestId: string }
