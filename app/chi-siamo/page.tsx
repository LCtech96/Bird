"use client"

import { useRef, useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { ArrowLeft, Facebook, Instagram, Volume2, VolumeX } from "lucide-react"

/** Aggiungi qui i nuovi video (file in public/videos/) */
const CHI_SIAMO_VIDEOS = [
  { id: "1", src: "/videos/chi-siamo-1.mp4" },
] as const

const INSTAGRAM_URL = "https://www.instagram.com/birdgardenterrasini"
const FACEBOOK_URL = "https://www.facebook.com/search/top?q=Bird%20Garden%20Terrasini"

function ReelCard({ src, index }: { src: string; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <article
      className="relative shrink-0 w-[78vw] max-w-[320px] sm:w-[280px] snap-center"
      style={{ scrollSnapAlign: "center" }}
    >
      <div className="relative aspect-[9/16] rounded-[1.75rem] overflow-hidden bg-black shadow-[0_12px_40px_rgba(0,0,0,0.28)] ring-1 ring-white/10">
        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload={index === 0 ? "auto" : "metadata"}
          aria-label={`Video Chi Siamo ${index + 1}`}
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
        {/* Intro — max 2 righe di senso + CTA social */}
        <header className="px-5 max-w-lg mx-auto text-center mb-8 md:mb-12">
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

        {/* Reel strip — stile Instagram / iOS */}
        <section className="relative" aria-label="Video dello staff">
          <div
            className="flex gap-4 overflow-x-auto px-[11vw] sm:px-8 md:justify-center md:px-6 pb-4 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {CHI_SIAMO_VIDEOS.map((video, index) => (
              <ReelCard key={video.id} src={video.src} index={index} />
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground md:hidden">
            {CHI_SIAMO_VIDEOS.length > 1 ? "Scorri per vedere gli altri video" : null}
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
