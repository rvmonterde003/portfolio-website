import "server-only"
import { SERVICE_LABELS, type Service } from "@/lib/booking-contract"
import { getGoogleConfig, isMock, TIMEZONE } from "./booking-config"
import { DAY_MS, manilaDate, manilaMidnight, type BusyInterval } from "./slots"

export class GoogleError extends Error {
  constructor(public readonly status: number) {
    super("Calendar unavailable")
    this.name = "GoogleError"
  }
}

let cachedToken: { value: string; expiresAt: number } | undefined
const mockEvents: BusyInterval[] = []

async function googleFetch(url: string, init: RequestInit, signal?: AbortSignal): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...init, cache: "no-store", redirect: "error",
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(4000)]) : AbortSignal.timeout(4000),
    })
    if (!response.ok) {
      if (response.status === 401) cachedToken = undefined
      throw new GoogleError(response.status)
    }
    return response
  } catch (error) {
    throw error instanceof GoogleError ? error : new GoogleError(503)
  }
}

export async function getAccessToken(signal?: AbortSignal): Promise<string> {
  try {
    if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value
    const config = getGoogleConfig()
    const requestedAt = Date.now()
    const response = await googleFetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "refresh_token", client_id: config.clientId,
        client_secret: config.clientSecret, refresh_token: config.refreshToken,
      }),
    }, signal)
    const data = await response.json()
    if (typeof data.access_token !== "string" || !data.access_token ||
      typeof data.expires_in !== "number" || !Number.isFinite(data.expires_in) || data.expires_in <= 0) {
      throw new GoogleError(502)
    }
    cachedToken = { value: data.access_token, expiresAt: requestedAt + Math.max(0, data.expires_in - 60) * 1000 }
    return cachedToken.value
  } catch (error) {
    throw error instanceof GoogleError ? error : new GoogleError(503)
  }
}

export async function queryBusy(timeMin: string, timeMax: string, signal?: AbortSignal): Promise<BusyInterval[]> {
  if (isMock()) {
    const tomorrow = manilaMidnight(manilaDate(new Date(Date.now() + DAY_MS))).getTime()
    return [
      { start: new Date(tomorrow + 10 * 3_600_000).toISOString(), end: new Date(tomorrow + 11 * 3_600_000).toISOString() },
      { start: new Date(tomorrow + 14 * 3_600_000).toISOString(), end: new Date(tomorrow + 15 * 3_600_000).toISOString() },
      ...mockEvents,
    ].filter((block) => Date.parse(block.start) < Date.parse(timeMax) && Date.parse(block.end) > Date.parse(timeMin))
  }
  try {
    const { calendarId } = getGoogleConfig()
    const token = await getAccessToken(signal)
    const response = await googleFetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ timeMin, timeMax, timeZone: TIMEZONE, items: [{ id: calendarId }] }),
    }, signal)
    const data = await response.json()
    const calendar = data.calendars?.[calendarId]
    if (!calendar || (calendar.errors && (!Array.isArray(calendar.errors) || calendar.errors.length > 0)) ||
      !Array.isArray(calendar.busy)) throw new GoogleError(502)
    const blocks: BusyInterval[] = []
    for (const block of calendar.busy) {
      if (!block || typeof block.start !== "string" || typeof block.end !== "string" ||
        !Number.isFinite(Date.parse(block.start)) || !Number.isFinite(Date.parse(block.end)) ||
        Date.parse(block.start) >= Date.parse(block.end)) throw new GoogleError(502)
      blocks.push({ start: block.start, end: block.end })
    }
    return blocks
  } catch (error) {
    throw error instanceof GoogleError ? error : new GoogleError(503)
  }
}

type EventInput = BusyInterval & { name: string; email: string; note: string; source: string; org: string; service: Service }

export async function insertEvent(input: EventInput, signal?: AbortSignal): Promise<void> {
  if (isMock()) {
    mockEvents.push({ start: input.start, end: input.end })
    return
  }
  try {
    signal?.throwIfAborted()
    const { calendarId } = getGoogleConfig()
    const token = await getAccessToken(signal)
    await googleFetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: "Discovery call with Mel Monterde",
        // The topic comes from the enum lookup only; visitor free text never reaches the invite.
        description: "Booked via monterde website. Google Meet link is attached.\nTopic: " + SERVICE_LABELS[input.service],
        extendedProperties: { private: {
          name: input.name, note: input.note.slice(0, 1000), source: input.source, org: input.org.slice(0, 120), service: input.service,
        } },
        start: { dateTime: input.start, timeZone: TIMEZONE }, end: { dateTime: input.end, timeZone: TIMEZONE },
        attendees: [{ email: input.email }],
        conferenceData: { createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } } },
        guestsCanModify: false, guestsCanInviteOthers: false, transparency: "opaque", reminders: { useDefault: true },
      }),
    }, signal)
  } catch (error) {
    throw error instanceof GoogleError ? error : new GoogleError(503)
  }
}
