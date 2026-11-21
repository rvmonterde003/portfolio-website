import { SLOT_MINUTES, type Slot } from "../booking-contract"

export { SLOT_MINUTES }
export const TIMEZONE = "Asia/Manila"
export const WORKING_DAYS = [1, 2, 3, 4, 5] as const
export const WORK_START_HOUR = 9
export const WORK_END_HOUR = 17
export const BUFFER_MINUTES = 15
export const MIN_NOTICE_HOURS = 24
export const MAX_DAYS_AHEAD = 30

export type BusyInterval = { start: string; end: string }
const MINUTE = 60_000
export const DAY_MS = 24 * 60 * MINUTE
// Manila is UTC+08:00 year-round; shifted UTC fields are local calendar fields.
const MANILA_OFFSET = 8 * 60 * MINUTE
export function manilaDate(date: Date): string {
  return new Date(date.getTime() + MANILA_OFFSET).toISOString().slice(0, 10)
}

export function manilaMidnight(date: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return new Date(NaN)
  const result = new Date(`${date}T00:00:00+08:00`)
  // Reject rollover dates, such as February 31, which Date silently normalizes.
  return Number.isFinite(result.getTime()) && manilaDate(result) === date ? result : new Date(NaN)
}

export function isSlotValid(start: string, now: Date = new Date()): boolean {
  const timestamp = Date.parse(start)
  if (!Number.isFinite(timestamp) || !Number.isFinite(now.getTime())) return false
  if (timestamp < now.getTime() + MIN_NOTICE_HOURS * 60 * MINUTE) return false
  if (timestamp > now.getTime() + MAX_DAYS_AHEAD * DAY_MS) return false
  const local = new Date(timestamp + MANILA_OFFSET)
  const minutes = local.getUTCHours() * 60 + local.getUTCMinutes()
  return (
    WORKING_DAYS.some((day) => day === local.getUTCDay()) &&
    local.getUTCSeconds() === 0 && local.getUTCMilliseconds() === 0 &&
    minutes >= WORK_START_HOUR * 60 &&
    minutes + SLOT_MINUTES <= WORK_END_HOUR * 60 &&
    (minutes - WORK_START_HOUR * 60) % SLOT_MINUTES === 0
  )
}

export function overlapsBusy(start: string, end: string, busy: BusyInterval[]): boolean {
  const from = Date.parse(start)
  const to = Date.parse(end)
  const buffer = BUFFER_MINUTES * MINUTE
  return busy.some((block) => {
    const busyStart = Date.parse(block.start)
    const busyEnd = Date.parse(block.end)
    // Invalid upstream intervals must never turn into free time.
    return !Number.isFinite(busyStart) || !Number.isFinite(busyEnd) || busyEnd <= busyStart ||
      (from < busyEnd + buffer && to > busyStart - buffer)
  })
}

export function buildSlots(fromDate: string, days: number, busy: BusyInterval[], now: Date = new Date()): Slot[] {
  const first = manilaMidnight(fromDate).getTime()
  if (!Number.isFinite(first) || !Number.isInteger(days) || days < 1) return []
  const slots: Slot[] = []
  const horizon = now.getTime() + MAX_DAYS_AHEAD * DAY_MS
  const rangeEnd = Math.min(first + days * DAY_MS, horizon + 1)
  // Skip old dates without changing the requested date range.
  const firstDay = Math.max(first, manilaMidnight(manilaDate(now)).getTime())
  for (let day = firstDay; day < rangeEnd; day += DAY_MS) {
    for (let minute = WORK_START_HOUR * 60; minute + SLOT_MINUTES <= WORK_END_HOUR * 60; minute += SLOT_MINUTES) {
      const start = new Date(day + minute * MINUTE).toISOString()
      const end = new Date(day + (minute + SLOT_MINUTES) * MINUTE).toISOString()
      if (isSlotValid(start, now) && !overlapsBusy(start, end, busy)) slots.push({ start, end })
    }
  }
  return slots
}
