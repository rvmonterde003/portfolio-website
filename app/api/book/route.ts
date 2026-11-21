import disposableDomains from "disposable-email-domains/index.json"
import { bookRequestSchema, type BookResponse, type BookingError, type BookingErrorCode } from "@/lib/booking-contract"
import { BUFFER_MINUTES, isBookingConfigured, isMock, SLOT_MINUTES } from "@/lib/server/booking-config"
import { checkBookingLimits, checkOrigin, checkRateLimit, requestIp, UpstashError, verifyTurnstile, withBookingLock } from "@/lib/server/booking-guard"
import { GoogleError, insertEvent, queryBusy } from "@/lib/server/google-calendar"
import { isSlotValid, overlapsBusy } from "@/lib/server/slots"

export const runtime = "nodejs"
const headers = { "Cache-Control": "no-store" }
const MAX_BODY_BYTES = 16 * 1024
const disposableSet = new Set<string>(disposableDomains)

// Matches the email's domain and every parent domain (sub.mailinator.com -> mailinator.com).
function hasDisposableDomain(email: string): boolean {
  const parts = email.slice(email.lastIndexOf("@") + 1).toLowerCase().split(".")
  for (let index = 0; index < parts.length - 1; index++) {
    if (disposableSet.has(parts.slice(index).join("."))) return true
  }
  return false
}

function failure(code: BookingErrorCode, status: number, error?: unknown): Response {
  const requestId = crypto.randomUUID()
  const kind = error instanceof GoogleError ? `google:${error.status}` : error instanceof UpstashError ? "upstash" : error instanceof Error ? error.name : "unknown"
  console.error(`[book] ${requestId} ${code} ${status} ${kind}`)
  const body: BookingError = { error: code, requestId }
  return Response.json(body, { status, headers })
}

async function readBody(req: Request): Promise<unknown> {
  const length = req.headers.get("content-length")
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)) throw new Error("Invalid body")
  if (!req.body) throw new Error("Invalid body")
  const reader = req.body.getReader()
  let size = 0
  const chunks: Uint8Array[] = []
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_BODY_BYTES) {
        await reader.cancel()
        throw new Error("Invalid body")
      }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)))
}

export async function POST(req: Request): Promise<Response> {
  if (!isMock() && !isBookingConfigured()) return failure("unavailable", 503)
  if (req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return failure("invalid_request", 400)
  if (!checkOrigin(req)) return failure("forbidden", 403)
  try {
    if (!await checkRateLimit(req, "book")) return failure("rate_limited", 429)
    let body: unknown
    try { body = await readBody(req) } catch { return failure("invalid_request", 400) }
    const parsed = bookRequestSchema.safeParse(body)
    if (!parsed.success) return failure("invalid_request", 400)
    const input = parsed.data
    if (input.company !== "") return failure("forbidden", 403)
    if (hasDisposableDomain(input.email)) return failure("forbidden", 403)
    if (!await verifyTurnstile(input.turnstileToken, requestIp(req))) return failure("forbidden", 403)
    if (!isSlotValid(input.start, new Date())) return failure("invalid_request", 400)
    if (!await checkBookingLimits(input.email)) return failure("rate_limited", 429)
    const start = new Date(input.start).toISOString()
    const end = new Date(Date.parse(start) + SLOT_MINUTES * 60_000).toISOString()
    const result = await withBookingLock(async (signal) => {
      if (!isSlotValid(start, new Date())) return "taken" as const
      const busy = await queryBusy(
        new Date(Date.parse(start) - BUFFER_MINUTES * 60_000).toISOString(),
        new Date(Date.parse(end) + BUFFER_MINUTES * 60_000).toISOString(), signal,
      )
      if (overlapsBusy(start, end, busy)) return "taken" as const
      await insertEvent({ ...input, start, end }, signal)
      return "confirmed" as const
    })
    if (result !== "confirmed") return failure("slot_taken", 409)
    const response: BookResponse = { status: "confirmed", start, end }
    return Response.json(response, { headers })
  } catch (error) { return failure("unavailable", 503, error) }
}
