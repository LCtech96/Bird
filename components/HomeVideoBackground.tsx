"use client"

import { useEffect, useState } from "react"

/**
 * Video di sfondo caricato dopo il first paint, così la pagina appare subito.
 */
export function HomeVideoBackground() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const start = () => {
      if (!cancelled) setReady(true)
    }

    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(start, { timeout: 1500 })
    } else {
      timeoutId = setTimeout(start, 400)
    }

    return () => {
      cancelled = true
      if (idleId !== undefined && typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(idleId)
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-background to-background" />
      {ready && (
        <video
          className="absolute inset-0 w-full h-full object-cover scale-105 blur-[3px]"
          src="/videos/home-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        />
      )}
      <div className="absolute inset-0 bg-background/55 dark:bg-background/70" />
    </div>
  )
}
