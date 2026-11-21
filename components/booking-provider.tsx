"use client"

import { useEffect, useRef, useState } from "react"
import { subscribeToBooking, type BookingIntent } from "@/lib/booking"
import { BookingModal } from "@/components/booking-modal"

export function BookingProvider() {
  const [request, setRequest] = useState<(BookingIntent & { id: number }) | null>(null)
  const [open, setOpen] = useState(false)
  const sequence = useRef(0)
  const trigger = useRef<HTMLElement | null>(null)

  useEffect(() => subscribeToBooking((intent) => {
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setRequest({ ...intent, id: ++sequence.current })
    setOpen(true)
  }), [])

  if (!request) return null
  return (
    <BookingModal
      key={request.id}
      source={request.source}
      service={request.service}
      open={open}
      onOpenChange={setOpen}
      onCloseAutoFocus={(event) => {
        event.preventDefault()
        trigger.current?.focus()
      }}
    />
  )
}
