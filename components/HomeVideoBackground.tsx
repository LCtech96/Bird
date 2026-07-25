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
    // Dopo idle / un frame: priorità al testo e alla UI
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 })
      return () => {
        cancelled = true
        window.cancelIdleCallback(id)
      }
    }
    const t = window.setTimeout(start, 400)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Gradiente subito (first paint) */}
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
