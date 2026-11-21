"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { track } from "@vercel/analytics"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { bookingFallbackUrl, type BookingIntent } from "@/lib/booking"
import { bookRequestSchema, type AvailabilityResponse, type BookingError, type BookRequest, type BookResponse, type Slot } from "@/lib/booking-contract"

const label = "font-atkinson text-xs font-bold uppercase tracking-widest"
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
const button = `min-h-11 rounded-sm border border-line/30 px-3 py-2 text-sm hover:bg-ink/10 disabled:cursor-not-allowed disabled:opacity-50 ${focus}`
const input = `w-full min-w-0 rounded-sm border border-line/30 bg-surface px-3 py-2 text-base text-ink ${focus}`
const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
// The server rejects this development token outside its mock mode.
const initialToken = sitekey ? "" : "mock"

type Turnstile = {
  ready: (callback: () => void) => void
  render: (container: HTMLElement, options: {
    sitekey: string; theme: "auto"; size: "flexible"; callback: (token: string) => void
    "expired-callback": () => void; "error-callback": () => void
  }) => string
  remove: (id: string) => void
  reset: (id: string) => void
}

function turnstileApi() {
  return (window as Window & { turnstile?: Turnstile }).turnstile
}

let scriptPromise: Promise<Turnstile> | undefined
function loadTurnstile(): Promise<Turnstile> {
  const existing = turnstileApi()
  if (existing) return new Promise((resolve) => existing.ready(() => resolve(existing)))
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement("script")
    const timeout = window.setTimeout(fail, 15000)
    function fail() {
      window.clearTimeout(timeout)
      script.remove()
      reject(new Error("Verification could not load."))
    }
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    script.async = true
    script.onerror = fail
    script.onload = () => {
      const api = turnstileApi()
      if (!api) return fail()
      api.ready(() => {
        window.clearTimeout(timeout)
        resolve(api)
      })
    }
    document.head.appendChild(script)
  }).catch((error: unknown) => {
    scriptPromise = undefined
    throw error
  })
  return scriptPromise
}

function Verification({ onToken, resetVersion }: { onToken: (token: string) => void; resetVersion: number }) {
  const container = useRef<HTMLDivElement>(null)
  const widget = useRef<{ api: Turnstile; id: string } | null>(null)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!sitekey) return
    let cancelled = false
    onToken("")
    setError(false)
    loadTurnstile().then((api) => {
      if (cancelled || !container.current) return
      const id = api.render(container.current, {
        sitekey, theme: "auto", size: "flexible",
        callback: (token) => { if (!cancelled) { setError(false); onToken(token) } },
        "expired-callback": () => { if (!cancelled) { onToken(""); setError(true) } },
        "error-callback": () => { if (!cancelled) { onToken(""); setError(true) } },
      })
      widget.current = { api, id }
    }).catch(() => { if (!cancelled) setError(true) })
    return () => {
      cancelled = true
      if (widget.current) widget.current.api.remove(widget.current.id)
      widget.current = null
    }
  }, [attempt, onToken])

  useEffect(() => {
    if (!resetVersion || !widget.current) return
    onToken("")
    setError(false)
    widget.current.api.reset(widget.current.id)
  }, [resetVersion, onToken])

  if (!sitekey) return null
  return (
    <div className="space-y-2">
      <p className={label}>Verification</p>
      <div ref={container} className="min-h-16 w-full" />
      {error && <div role="status" className="space-y-2 text-sm">
        <p>Verification expired or could not load. Please retry.</p>
        <button type="button" className={button} onClick={() => setAttempt((value) => value + 1)}>Retry verification</button>
      </div>}
    </div>
  )
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function addDays(date: Date, count: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + count)
  return result
}

function nextWeekdays() {
  const result: Date[] = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  while (result.length < 14) {
    if (cursor.getDay() !== 0 && cursor.getDay() !== 6) result.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return result
}

class ApiError extends Error {
  constructor(readonly status: number, readonly detail?: BookingError) { super("Booking request failed") }
}

async function responseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const detail = await response.json().catch(() => undefined) as BookingError | undefined
    throw new ApiError(response.status, detail)
  }
  return response.json() as Promise<T>
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 429) return "Too many requests. Please try again later."
    if (error.status === 503) return "Booking is temporarily unavailable. You can use the booking link below."
    if (error.status === 403) return "Verification failed. Complete verification again, then retry."
    if (error.status === 400) return "Please check your details and try again."
  }
  return "Could not connect. Please retry."
}

type Props = BookingIntent & {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCloseAutoFocus: (event: Event) => void
}

export function BookingModal({ source, service, open, onOpenChange, onCloseAutoFocus }: Props) {
  const mobile = useIsMobile()
  const id = useId()
  const [days] = useState(nextWeekdays)
  const [timezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [day, setDay] = useState(() => dateKey(days[0]))
  const [slots, setSlots] = useState<Slot[]>([])
  const [ownerTimezone, setOwnerTimezone] = useState("")
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<unknown>(null)
  const [refresh, setRefresh] = useState(0)
  const [selected, setSelected] = useState<Slot | null>(null)
  const [step, setStep] = useState<"time" | "form" | "done">("time")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [note, setNote] = useState("")
  const [company, setCompany] = useState("")
  const [token, setToken] = useState(initialToken)
  const [resetVersion, setResetVersion] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [fallback, setFallback] = useState(false)
  const [confirmedEmail, setConfirmedEmail] = useState("")
  const submission = useRef(false)
  const completed = useRef(false)
  const formHeading = useRef<HTMLHeadingElement>(null)
  const successHeading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (open && sitekey) void loadTurnstile().catch(() => { /* The form offers a retry. */ })
  }, [open])

  useEffect(() => {
    if (step === "form") formHeading.current?.focus()
    if (step === "done") successHeading.current?.focus()
  }, [step])

  useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    setLoading(true)
    setFetchError(null)
    // Pad UTC bounds by a day to cover owner/visitor timezone differences.
    // Each request stays within the contract's seven-day limit.
    const first = new Date(days[0])
    first.setUTCDate(first.getUTCDate() - 1)
    const last = addDays(days[days.length - 1], 2)
    const windows: string[] = []
    for (const cursor = new Date(first); cursor <= last; cursor.setUTCDate(cursor.getUTCDate() + 7)) {
      windows.push(cursor.toISOString().slice(0, 10))
    }
    Promise.all(windows.map(async (from) => {
      const response = await fetch(`/api/availability?from=${from}&days=7`, { signal: controller.signal, cache: "no-store" })
      return responseJson<AvailabilityResponse>(response)
    })).then((results) => {
      if (controller.signal.aborted) return
      const unique = new Map(results.flatMap((result) => result.slots).map((slot) => [slot.start, slot]))
      setSlots([...unique.values()].filter((slot) => Date.parse(slot.start) > Date.now()).sort((a, b) => Date.parse(a.start) - Date.parse(b.start)))
      setOwnerTimezone(results[0].timezone)
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setFetchError(error)
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [open, days, refresh])

  const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", timeZone: timezone })
  const fullDate = new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeZone: timezone })
  const daySlots = slots.filter((slot) => dateKey(new Date(slot.start)) === day)
  const selectedDate = days.find((date) => dateKey(date) === day) ?? days[0]
  const week = Math.floor((Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) - Date.UTC(days[0].getFullYear(), days[0].getMonth(), days[0].getDate())) / (7 * 86400000))
  const weekStart = addDays(days[0], week * 7)
  const weekEnd = addDays(weekStart, 7)
  const weekDays = days.filter((date) => date >= weekStart && date < weekEnd)
  const weekHasSlots = slots.some((slot) => weekDays.some((date) => dateKey(date) === dateKey(new Date(slot.start))))
  const nextWeekDay = days.find((date) => date >= weekEnd)

  function retryAvailability() {
    setLoading(true)
    setFetchError(null)
    setRefresh((value) => value + 1)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selected || !token || submission.current || completed.current) return
    const request: BookRequest = { start: selected.start, name, email, note, source, ...(service ? { service } : {}), turnstileToken: token, company }
    const parsed = bookRequestSchema.safeParse(request)
    if (!parsed.success) {
      setMessage("Please check your name, email, and note, then try again.")
      return
    }
    submission.current = true
    setSubmitting(true)
    setMessage("")
    setFallback(false)
    try {
      const response = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) })
      const result = await responseJson<BookResponse>(response)
      if (result.status !== "confirmed") throw new Error("Unexpected booking response")
      setConfirmedEmail(parsed.data.email)
      setStep("done")
      if (!completed.current) {
        completed.current = true
        track("booking_completed", service ? { source, service } : { source })
      }
    } catch (error: unknown) {
      if (sitekey) { setToken(""); setResetVersion((value) => value + 1) }
      if (error instanceof ApiError && error.status === 409) {
        setMessage("That time was just taken. Choose another time; your details are saved.")
        setSelected(null)
        setStep("time")
        retryAvailability()
      } else {
        setMessage(errorMessage(error))
        setFallback(error instanceof ApiError && error.status === 503)
      }
    } finally {
      submission.current = false
      setSubmitting(false)
    }
  }

  const fallbackLink = <a href={bookingFallbackUrl(source)} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center ${button}`}>Use the alternative booking page</a>
  const Title = mobile ? DrawerTitle : DialogTitle
  const Description = mobile ? DrawerDescription : DialogDescription
  const content = <>
    <div className="space-y-2 pr-8">
      <p className={label}>Let&apos;s talk</p>
      <Title className="text-2xl font-bold tracking-tight text-ink">Book a discovery call</Title>
      <Description className="text-sm text-ink-muted">30 minutes to talk through your project.{service ? ` Topic: ${service}.` : ""}</Description>
    </div>
    <div aria-live="polite" aria-atomic="true" role="status" className="text-sm">
      {message && <p className="rounded-sm border border-line/30 p-3">{message}</p>}
      {submitting && <p>Sending your invitation…</p>}
      {step === "done" && <p className="sr-only">Invite sent to {confirmedEmail} with a Google Meet link.</p>}
    </div>
    {fallback && fallbackLink}
    {step === "time" && <div className="space-y-5">
      <fieldset>
        <legend className={`${label} mb-3`}>1. Pick a day</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {days.map((date) => <button key={dateKey(date)} type="button" aria-pressed={day === dateKey(date)} aria-label={fullDate.format(date)} onClick={() => { setDay(dateKey(date)); setSelected(null) }} className={`${button} ${day === dateKey(date) ? "bg-ink text-surface hover:bg-ink/90" : ""}`}>
            <span className="block text-xs">{date.toLocaleDateString(undefined, { weekday: "short" })}</span>
            <span className="block font-semibold">{date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
          </button>)}
        </div>
      </fieldset>
      <section aria-labelledby={`${id}-times`} aria-busy={loading} className="space-y-3">
        <h3 id={`${id}-times`} className={label}>2. Pick a time</h3>
        <p className="break-words text-sm text-ink-muted">Your timezone: {timezone}<br />{ownerTimezone && `Host timezone: ${ownerTimezone}`}</p>
        {loading ? <div role="status">
          <span className="sr-only">Loading available times</span>
          <div className="grid grid-cols-2 gap-2" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-11 animate-pulse rounded-sm bg-ink/10 motion-reduce:animate-none" />)}</div>
        </div> : fetchError ? <div role="status" className="space-y-3 text-sm">
          <p>{errorMessage(fetchError)}</p>
          <button type="button" className={button} onClick={retryAvailability}>Retry availability</button>
          {fetchError instanceof ApiError && fetchError.status === 503 && <div>{fallbackLink}</div>}
        </div> : !weekHasSlots ? <div role="status" className="space-y-3">
          <p>No open times this week</p>
          {nextWeekDay ? <button type="button" className={button} onClick={() => setDay(dateKey(nextWeekDay))}>Next week</button> : <p className="text-sm text-ink-muted">No later times in the next 14 weekdays. Please check back soon.</p>}
        </div> : !daySlots.length ? <p role="status" className="text-sm text-ink-muted">No open times on this day. Choose another day.</p> : <div className="grid grid-cols-2 gap-2">
          {daySlots.map((slot) => <button type="button" key={slot.start} className={button} onClick={() => { setSelected(slot); setStep("form") }}>
            {timeFormat.format(new Date(slot.start))} – {timeFormat.format(new Date(slot.end))}
          </button>)}
        </div>}
      </section>
    </div>}
    {step === "form" && selected && <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2 border-b border-line/20 pb-4">
        <h3 ref={formHeading} tabIndex={-1} className={`${label} outline-none`}>3. Your details</h3>
        <p className="text-sm">{fullDate.format(new Date(selected.start))}<br />{timeFormat.format(new Date(selected.start))} – {timeFormat.format(new Date(selected.end))} ({timezone})</p>
        <p className="text-xs text-ink-muted">Host timezone: {ownerTimezone}</p>
        <button type="button" disabled={submitting} className={button} onClick={() => { setStep("time"); setToken(initialToken) }}>Change time</button>
      </div>
      <fieldset disabled={submitting} className="min-w-0 space-y-4">
        <legend className="sr-only">Contact details</legend>
        <div className="space-y-2"><label htmlFor={`${id}-name`} className={label}>Name</label><input id={`${id}-name`} name="name" autoComplete="name" required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className={input} /></div>
        <div className="space-y-2"><label htmlFor={`${id}-email`} className={label}>Email</label><input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className={input} /></div>
        <div className="space-y-2"><label htmlFor={`${id}-note`} className={label}>Note (optional)</label><textarea id={`${id}-note`} name="note" rows={3} maxLength={2000} value={note} onChange={(event) => setNote(event.target.value)} className={`${input} resize-y`} /></div>
        <div aria-hidden="true" className="fixed -left-[10000px] top-0 h-px w-px overflow-hidden"><label htmlFor={`${id}-company`}>Company</label><input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" maxLength={200} value={company} onChange={(event) => setCompany(event.target.value)} /></div>
      </fieldset>
      <Verification onToken={setToken} resetVersion={resetVersion} />
      <button type="submit" disabled={submitting || !token} className={`${button} ${label} w-full bg-ink text-surface hover:bg-ink/90`}>{submitting ? "Booking…" : "Confirm booking"}</button>
      {sitekey && !token && <p className="text-sm text-ink-muted" role="status">Complete verification to confirm your booking.</p>}
    </form>}
    {step === "done" && <div className="space-y-4 py-4">
      <h3 ref={successHeading} tabIndex={-1} className="text-2xl font-bold outline-none">You&apos;re booked.</h3>
      <p className="break-words">Invite sent to {confirmedEmail} with a Google Meet link.</p>
      {selected && <p className="text-sm text-ink-muted">{fullDate.format(new Date(selected.start))}, {timeFormat.format(new Date(selected.start))} ({timezone})</p>}
      <button type="button" className={button} onClick={() => onOpenChange(false)}>Done</button>
    </div>}
  </>

  if (mobile) return <Drawer open={open} onOpenChange={onOpenChange} autoFocus>
    <DrawerContent onCloseAutoFocus={onCloseAutoFocus} className="border-line/30 bg-surface text-ink">
      <DrawerClose className={`absolute right-4 top-3 min-h-11 px-2 text-sm ${focus}`} aria-label="Close booking">Close</DrawerClose>
      <div className="min-h-0 overflow-y-auto overscroll-contain px-4 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="space-y-4">{content}</div>
      </div>
    </DrawerContent>
  </Drawer>
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent onCloseAutoFocus={onCloseAutoFocus} className="max-h-[90dvh] overflow-y-auto rounded-sm border-line/30 bg-surface text-ink sm:max-w-xl">{content}</DialogContent>
  </Dialog>
}
