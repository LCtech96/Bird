"use client"

import { useEffect, useRef, useState } from "react"

const MAP_EMBED_URL = "https://maps.google.com/maps?q=Lungomare+Peppino+Impastato+N1,+Terrasini+Favarotta,+Italy,+90049&hl=it&z=15&output=embed"
const MAP_LINK = "https://maps.app.goo.gl/NutthoLknzXXb6ot6?g_st=ic"

export function LazyMap() {
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true)
      },
      { rootMargin: "100px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="w-full">
      <a
        href={MAP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group cursor-pointer"
        aria-label="Apri la posizione su Google Maps"
      >
        <div className="relative w-full aspect-video bg-muted">
          {visible ? (
            <iframe
              src={MAP_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full pointer-events-none"
              title="Mappa Bird Restaurant"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              Caricamento mappa...
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
        </div>
      </a>
      <p className="text-center text-muted-foreground mt-4 text-sm md:text-base">
        Clicca sulla mappa per aprire Google Maps
      </p>
    </div>
  )
}
