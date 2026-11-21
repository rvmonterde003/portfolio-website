import { availabilityQuerySchema, type AvailabilityResponse, type BookingError, type BookingErrorCode } from "@/lib/booking-contract"
import { BUFFER_MINUTES, isBookingConfigured, isMock, MAX_DAYS_AHEAD, SLOT_MINUTES, TIMEZONE } from "@/lib/server/booking-config"
import { checkRateLimit } from "@/lib/server/booking-guard"
import { queryBusy } from "@/lib/server/google-calendar"
import { buildSlots, DAY_MS, manilaDate, manilaMidnight } from "@/lib/server/slots"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const headers = { "Cache-Control": "no-store" }

function failure(error: BookingErrorCode, status: number): Response {
  const body: BookingError = { error, requestId: crypto.randomUUID() }
  return Response.json(body, { status, headers })
}

export async function GET(req: Request): Promise<Response> {
  if (!isMock() && !isBookingConfigured()) return failure("unavailable", 503)
  try {
    if (!await checkRateLimit(req, "availability")) return failure("rate_limited", 429)
    const params = new URL(req.url).searchParams
    const parsed = availabilityQuerySchema.safeParse({ from: params.get("from"), days: params.get("days") ?? undefined })
    if (!parsed.success) return failure("invalid_request", 400)
    const { from, days } = parsed.data
    const requestedStart = manilaMidnight(from).getTime()
    if (!Number.isFinite(requestedStart)) return failure("invalid_request", 400)
    const now = new Date()
    const first = Math.max(requestedStart, manilaMidnight(manilaDate(now)).getTime())
    const last = Math.min(requestedStart + days * DAY_MS, now.getTime() + MAX_DAYS_AHEAD * DAY_MS + SLOT_MINUTES * 60_000)
    let slots: AvailabilityResponse["slots"] = []
    if (first < last) {
      const busy = await queryBusy(new Date(first - BUFFER_MINUTES * 60_000).toISOString(), new Date(last + BUFFER_MINUTES * 60_000).toISOString())
      slots = buildSlots(from, days, busy, now)
    }
    const body: AvailabilityResponse = { timezone: TIMEZONE, slots }
    return Response.json(body, { headers })
  } catch { return failure("unavailable", 503) }
}
