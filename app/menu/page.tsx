"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, Search, X, Volume2, VolumeX, Instagram } from "lucide-react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import Image from "next/image"
import { menuCategoriesFromPublic } from "@/lib/menu-data-from-public"

type MenuItem = {
  name: string
  description?: string
  price?: string
  image?: string
  visible?: boolean
}

type MenuCategory = {
  title: string
  items: MenuItem[]
}

const SUPABASE_MENU_VIDEOS =
  "https://cgrygpojgnkcdpbwligf.supabase.co/storage/v1/object/public/menu-videos"

const MENU_REELS: string[] = [
  `${SUPABASE_MENU_VIDEOS}/menu-1.mp4`,
  `${SUPABASE_MENU_VIDEOS}/menu-2.mp4`,
  `${SUPABASE_MENU_VIDEOS}/menu-3.mp4`,
  `${SUPABASE_MENU_VIDEOS}/menu-4.mp4`,
  `${SUPABASE_MENU_VIDEOS}/menu-5.mp4`,
]

const INSTAGRAM_POST = "https://www.instagram.com/p/DXPfboiMOa0/"

const INITIAL_CATEGORIES: MenuCategory[] = menuCategoriesFromPublic.map((cat) => ({
  title: cat.title,
  items: cat.dishes.filter((d) => d.visible !== false),
}))

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 99
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

/** Espansioni per termini generici (es. "pasta" → formati pasta) */
const SEARCH_SYNONYMS: Record<string, string[]> = {
  pasta: [
    "spaghetti",
    "pennette",
    "farfalle",
    "risotto",
    "carbonara",
    "scoglio",
    "vongole",
    "primi",
  ],
  primo: ["primi", "pasta", "spaghetti", "pennette", "farfalle", "risotto"],
  primi: ["pasta", "spaghetti", "pennette", "farfalle", "risotto"],
  pizza: ["pizze", "margherita", "calzone", "sfincionella", "covaccini", "schiacciate"],
  pizze: ["pizza", "margherita", "calzone"],
  pesce: ["mare", "cozze", "vongole", "gamberi", "polpo", "salmone", "tonno", "scoglio"],
  carne: ["filetto", "bresaola", "prosciutto", "salsiccia", "pollo", "ragù"],
  dolce: ["dessert", "tiramisu", "gelato", "torta", "frutta"],
  dolci: ["dessert", "tiramisu", "gelato", "torta"],
  vino: ["prosecco", "birra", "digestivi", "spritz", "aperitivi"],
  birra: ["birre", "spina"],
}

/** Match token↔parola: substring solo se abbastanza lungo; typo solo su parole simili */
function tokenMatchesWord(word: string, token: string): boolean {
  if (!word || !token) return false
  if (word === token) return true
  // substring: la parola contiene il token (min 3 char) oppure viceversa solo se entrambi lunghi
  if (token.length >= 3 && word.includes(token)) return true
  if (word.length >= 4 && token.length >= 4 && token.includes(word)) return true
  // typo: lunghezze vicine, max 1–2 errori, token abbastanza lungo
  if (Math.abs(word.length - token.length) > 2) return false
  if (token.length < 4) return false
  const maxErr = token.length <= 5 ? 1 : 2
  return editDistance(word, token) <= maxErr
}

function tokenMatchesHaystack(haystack: string, token: string): boolean {
  if (haystack.includes(token)) return true
  const words = haystack.split(" ").filter((w) => w.length > 1)
  return words.some((word) => tokenMatchesWord(word, token))
}

function dishMatches(item: MenuItem, categoryTitle: string, query: string): boolean {
  const q = normalize(query)
  if (!q) return true
  const queryTokens = q.split(" ").filter((t) => t.length > 1)
  if (queryTokens.length === 0) return true

  const blob = normalize(`${categoryTitle} ${item.name} ${item.description || ""}`)

  // Ogni parola cercata deve matchare (AND); i sinonimi di quella parola sono in OR
  return queryTokens.every((token) => {
    const variants = [token, ...(SEARCH_SYNONYMS[token] || []).map(normalize)]
    return variants.some((variant) => tokenMatchesHaystack(blob, variant))
  })
}

function MenuReel({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [muted, setMuted] = useState(true)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => setInView(!!e?.isIntersecting),
      { threshold: 0.35 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (inView) v.play().catch(() => {})
    else v.pause()
  }, [inView])

  return (
    <div ref={wrapRef} className="flex-shrink-0 w-[160px] sm:w-[180px]">
      <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-lg ring-1 ring-border">
        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="none"
          aria-label="Video dal menù Bird"
        />
        <button
          type="button"
          onClick={() => {
            const v = videoRef.current
            if (!v) return
            v.muted = !v.muted
            setMuted(v.muted)
          }}
          className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-black/45 text-white flex items-center justify-center"
          aria-label={muted ? "Attiva audio" : "Disattiva audio"}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

export default function AsportoPage() {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const [categories, setCategories] = useState<MenuCategory[]>(INITIAL_CATEGORIES)
  const [query, setQuery] = useState("")

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const response = await fetch("/api/menu")
        if (!response.ok || cancelled) return
        const data = await response.json()
        if (!Array.isArray(data) || data.length === 0 || cancelled) return
        setCategories(
          data.map((cat: any) => ({
            title: cat.title,
            items: (cat.dishes || cat.items || []).filter((item: any) => item.visible !== false),
          }))
        )
      } catch (error) {
        console.error("Error loading menu:", error)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return categories
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => dishMatches(item, cat.title, q)),
      }))
      .filter((cat) => cat.items.length > 0)
  }, [categories, query])

  // Con ricerca attiva: apri tutte le categorie con risultati
  useEffect(() => {
    if (!query.trim()) return
    setExpanded(new Set(filtered.map((c) => c.title)))
  }, [query, filtered])

  const toggle = (title: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  const totalResults = filtered.reduce((acc, c) => acc + c.items.length, 0)

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Menù</h1>
            <div className="mt-4 text-base md:text-lg text-muted-foreground whitespace-pre-line">
              Martedì-Venerdì 19:00-23:00{"\n"}
              Sabato 19:00-23:30{"\n"}
              Domenica 12:30-15:00{"\n"}
              19:00-23:30{"\n"}
              Chiuso Lunedì
            </div>
          </div>

          {/* Video in alto */}
          <div className="mb-8 -mx-4 px-4">
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
              {MENU_REELS.map((src) => (
                <div key={src} className="snap-start">
                  <MenuReel src={src} />
                </div>
              ))}
            </div>
          </div>

          {/* Barra di ricerca */}
          <div className="mb-6 sticky top-16 md:top-20 z-20">
            <div className="relative bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca piatto, ingrediente o categoria (es. vongole, pizza, pesce...)"
                className="w-full pl-12 pr-12 py-3.5 bg-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-base"
                aria-label="Cerca nel menù"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-accent"
                  aria-label="Pulisci ricerca"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              ) : null}
            </div>
            {query.trim() ? (
              <p className="mt-2 text-sm text-muted-foreground text-center">
                {totalResults === 0
                  ? "Nessun piatto trovato — prova un altro termine"
                  : `${totalResults} piatt${totalResults === 1 ? "o" : "i"} trovat${totalResults === 1 ? "o" : "i"}`}
              </p>
            ) : null}
          </div>

          {/* Instagram highlight */}
          <a
            href={INSTAGRAM_POST}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium hover:bg-accent/50 transition-colors"
          >
            <Instagram className="w-4 h-4" />
            Guarda il post Instagram del Bird
          </a>

          <div className="space-y-2">
            {filtered.map((cat) => {
              const isOpen = expanded.has(cat.title) || !!query.trim()
              return (
                <div key={cat.title} className="border border-border rounded-lg overflow-hidden bg-card">
                  <button
                    type="button"
                    onClick={() => toggle(cat.title)}
                    className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-accent/50 transition-colors text-left"
                    aria-expanded={isOpen}
                  >
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">
                      {cat.title}
                      {query.trim() ? (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          ({cat.items.length})
                        </span>
                      ) : null}
                    </h2>
                    <div className="flex-shrink-0 ml-4 text-muted-foreground">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen ? (
                    <div className="border-t border-border p-4 md:p-6">
                      <div className="space-y-4">
                        {cat.items.map((item, idx) => (
                          <div
                            key={`${cat.title}-${idx}`}
                            className="flex flex-col md:flex-row gap-4 p-3 rounded-lg hover:bg-accent/30 transition-colors"
                          >
                            {item.image && !item.image.startsWith("data:") ? (
                              <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-border">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={128}
                                  height={128}
                                  className="w-full h-full object-cover"
                                  unoptimized={item.image.startsWith("/")}
                                />
                              </div>
                            ) : null}

                            <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                              <div className="flex-1">
                                <h3 className="text-base md:text-lg font-semibold">{item.name}</h3>
                                {item.description ? (
                                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                ) : null}
                              </div>
                              {item.price ? (
                                <div className="flex-shrink-0">
                                  <span className="text-base md:text-lg font-bold text-foreground">
                                    {item.price}
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Torna alla home</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
