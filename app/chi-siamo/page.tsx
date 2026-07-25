"use client"

import { useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { ArrowLeft, Facebook, Instagram, Volume2, VolumeX } from "lucide-react"

const SUPABASE_VIDEO_BASE =
  "https://cgrygpojgnkcdpbwligf.supabase.co/storage/v1/object/public/chi-siamo-videos"

/** 21 reel ospitati su Supabase Storage (non nel deploy Vercel) */
const CHI_SIAMO_VIDEOS = Array.from({ length: 21 }, (_, i) => ({
  id: String(i + 1),
  src: `${SUPABASE_VIDEO_BASE}/chi-siamo-${i + 1}.mp4`,
}))

const INSTAGRAM_URL = "https://www.instagram.com/birdgardenterrasini"
const FACEBOOK_URL = "https://www.facebook.com/search/top?q=Bird%20Garden%20Terrasini"

function ReelCard({ src, index }: { src: string; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const cardRef = useRef<HTMLElement>(null)
  const [muted, setMuted] = useState(true)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => setInView(!!e?.isIntersecting),
      { threshold: 0.55 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (inView) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [inView])

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <article
      ref={cardRef}
      className="relative shrink-0 w-[78vw] max-w-[320px] sm:w-[280px] snap-center"
      style={{ scrollSnapAlign: "center" }}
    >
      <div className="relative aspect-[9/16] rounded-[1.75rem] overflow-hidden bg-black shadow-[0_12px_40px_rgba(0,0,0,0.28)] ring-1 ring-white/10">
        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload={index < 2 ? "metadata" : "none"}
          aria-label={`Video virale ${index + 1}`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
        <button
          type="button"
          onClick={toggleMute}
          className="absolute bottom-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md active:scale-95 transition-transform"
          aria-label={muted ? "Attiva audio" : "Disattiva audio"}
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>
    </article>
  )
}

export default function ChiSiamoPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-8 md:pt-28 md:pb-16">
        <header className="px-5 max-w-lg mx-auto text-center mb-8 md:mb-10">
          <h1
            className="text-[2rem] leading-tight md:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Chi Siamo
          </h1>
          <p className="text-[15px] md:text-base text-muted-foreground leading-snug mb-6">
            Passione in cucina, ironia in sala e voglia di mettersi sempre in gioco.
            Seguici su Instagram e Facebook e supporta il Bird.
          </p>

          <div className="flex items-center justify-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] shadow-md active:scale-[0.98] transition-transform"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-[#1877F2] shadow-md active:scale-[0.98] transition-transform"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </a>
          </div>
        </header>

        <section className="relative" aria-label="I nostri video più virali">
          <h2
            className="px-5 text-center text-xl md:text-2xl font-semibold tracking-tight mb-5 md:mb-6"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            I nostri video più virali
          </h2>

          <div className="flex gap-4 overflow-x-auto px-[11vw] sm:px-8 md:px-10 pb-4 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CHI_SIAMO_VIDEOS.map((video, index) => (
              <ReelCard key={video.id} src={video.src} index={index} />
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Scorri per vedere gli altri video
          </p>
        </section>

        <div className="mt-12 md:mt-16 text-center px-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Torna alla home</span>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
