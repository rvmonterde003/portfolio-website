import "server-only"
import { createHash } from "node:crypto"
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"
import { getAllowedOrigins, getRedisConfig, getTurnstileSecret, isMock } from "./booking-config"

let redis: Redis | undefined
let limiters: Record<"availability" | "book", Ratelimit> | undefined
let mockLocked = false

function getRedis(): Redis {
  redis ??= new Redis({
    ...getRedisConfig(), retry: false, enableTelemetry: false,
    signal: () => AbortSignal.timeout(3000),
  })
  return redis
}

export function checkOrigin(req: Request): boolean {
  const origin = req.headers.get("origin")
  if (!origin) return false
  return getAllowedOrigins().includes(origin) || (isMock() && origin === "http://localhost:3000")
}

export function requestIp(req: Request): string {
  return req.headers.get("x-real-ip")?.trim() || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
}

export async function checkRateLimit(req: Request, kind: "availability" | "book"): Promise<boolean> {
  if (isMock()) return true
  limiters ??= {
    availability: new Ratelimit({ redis: getRedis(), limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "booking:availability", analytics: false, timeout: 3000 }),
    book: new Ratelimit({ redis: getRedis(), limiter: Ratelimit.slidingWindow(5, "10 m"), prefix: "booking:book", analytics: false, timeout: 3000 }),
  }
  const key = createHash("sha256").update(requestIp(req)).digest("hex")
  const result = await limiters[kind].limit(key)
  // The SDK permits requests on its own timeout; explicitly fail closed instead.
  if (result.reason === "timeout") throw new Error("Booking guard unavailable")
  await result.pending
  return result.success
}

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (isMock()) return true
  if (!token) return false
  const body = new URLSearchParams({ secret: getTurnstileSecret(), response: token })
  if (ip !== "unknown") body.set("remoteip", ip)
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST", body, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(4000),
  })
  if (!response.ok) throw new Error("Booking guard unavailable")
  const data = await response.json()
  return data.success === true && typeof data.hostname === "string" &&
    getAllowedOrigins().some((origin) => new URL(origin).hostname === data.hostname)
}

export async function withBookingLock<T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T | "busy"> {
  // Start the deadline before SET, leaving five seconds of the lease unused.
  // Every Google request inside the callback must use this cancellation signal.
  const signal = AbortSignal.timeout(15_000)
  if (isMock()) {
    if (mockLocked) return "busy"
    mockLocked = true
    try { return await fn(signal) } finally { mockLocked = false }
  }
  const client = getRedis()
  const value = crypto.randomUUID()
  if (await client.set("booking:lock", value, { nx: true, px: 20_000 }) !== "OK") return "busy"
  try {
    signal.throwIfAborted()
    return await fn(signal)
  } finally {
    // Atomic ownership check: an expired lease must never delete its successor.
    await client.eval(
      "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
      ["booking:lock"], [value],
    )
  }
}
