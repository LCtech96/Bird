"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, ChevronUp, Search, X, Volume2, VolumeX } from "lucide-react"
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

const SEARCH_SYNONYMS: Record<string, string[]> = {
  pasta: [
    "spaghetti",
    "pennette",
    "farfalle",
    "farfallette",
    "risotto",
    "carbonara",
    "scoglio",
    "vongole",
    "primi",
  ],
  primo: ["primi", "pasta", "spaghetti", "pennette", "farfalle", "farfallette", "risotto"],
  primi: ["pasta", "spaghetti", "pennette", "farfalle", "farfallette", "risotto"],
  pizza: ["pizze", "margherita", "calzone", "sfincionella", "pizza pane", "schiacciate"],
  pizze: ["pizza", "margherita", "calzone"],
  pesce: ["mare", "cozze", "vongole", "gamberi", "polpo", "polipo", "salmone", "tonno", "scoglio"],
  carne: ["filetto", "manzo", "prosciutto", "salsiccia", "pollo", "ragù", "tartare"],
  dolce: ["dessert", "tiramisu", "gelato", "torta", "frutta"],
  dolci: ["dessert", "tiramisu", "gelato", "torta"],
  vino: ["prosecco", "birra", "digestivi", "spritz", "aperitivi"],
  birra: ["birre", "spina", "forst"],
  spritz: ["aperol", "campari", "hugo", "italicus", "sarti", "mandarita"],
}

function tokenMatchesWord(word: string, token: string): boolean {
  if (!word || !token) return false
  if (word === token) return true
  if (token.length >= 3 && word.includes(token)) return true
  if (word.length >= 4 && token.length >= 4 && token.includes(word)) return true
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
    const obs = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { threshold: 0.35 })
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
    <div ref={wrapRef} className="flex-shrink-0 w-[148px] sm:w-[168px]">
      <div className="relative w-full aspect-[9/16] rounded-[18px] overflow-hidden bg-neutral-900 shadow-sm ring-1 ring-black/5">
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
          className="absolute bottom-2.5 right-2.5 h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-[2px]"
          aria-label={muted ? "Attiva audio" : "Disattiva audio"}
        >
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  )
}

export default function MenuPage() {
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
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-background dark:text-foreground">
      <Navigation />

      <div className="mx-auto w-full max-w-xl px-4 pt-6 pb-8 md:pt-24 md:pb-12">
        <header className="text-center mb-7 md:mb-9">
          <h1 className="text-[2rem] md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-foreground">
            Menù
          </h1>
          <div className="mt-3 text-[15px] md:text-base leading-relaxed text-neutral-500 dark:text-muted-foreground whitespace-pre-line">
            Martedì-Venerdì 19:00-23:00{"\n"}
            Sabato 19:00-23:30{"\n"}
            Domenica 12:30-15:00{"\n"}
            19:00-23:30{"\n"}
            Chiuso Lunedì
          </div>
        </header>

        {/* Video in alto */}
        <div className="mb-7 -mx-4 px-4">
          <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none">
            {MENU_REELS.map((src) => (
              <div key={src} className="snap-start">
                <MenuReel src={src} />
              </div>
            ))}
          </div>
        </div>

        {/* Barra di ricerca */}
        <div className="mb-6 sticky top-3 md:top-20 z-20">
          <div className="relative bg-white/95 dark:bg-background/95 backdrop-blur-md border border-neutral-200 dark:border-border rounded-full shadow-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-neutral-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca piatto, ingrediente o categoria (es. vongole, pizza, pesce...)"
              className="w-full pl-11 pr-11 py-3.5 bg-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-300/60 text-[15px] placeholder:text-neutral-400"
              aria-label="Cerca nel menù"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-accent"
                aria-label="Pulisci ricerca"
              >
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            ) : null}
          </div>
          {query.trim() ? (
            <p className="mt-2 text-sm text-neutral-500 dark:text-muted-foreground text-center">
              {totalResults === 0
                ? "Nessun piatto trovato — prova un altro termine"
                : `${totalResults} piatt${totalResults === 1 ? "o" : "i"} trovat${totalResults === 1 ? "o" : "i"}`}
            </p>
          ) : null}
        </div>

        <div className="space-y-2.5">
          {filtered.map((cat) => {
            const isOpen = expanded.has(cat.title) || !!query.trim()
            return (
              <div
                key={cat.title}
                className="border border-neutral-200 dark:border-border rounded-xl overflow-hidden bg-white dark:bg-card"
              >
                <button
                  type="button"
                  onClick={() => toggle(cat.title)}
                  className="w-full flex items-center justify-between px-4 py-4 md:px-5 md:py-5 hover:bg-neutral-50 dark:hover:bg-accent/50 transition-colors text-left"
                  aria-expanded={isOpen}
                >
                  <h2 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-foreground">
                    {cat.title}
                    {query.trim() ? (
                      <span className="ml-2 text-sm font-normal text-neutral-400">({cat.items.length})</span>
                    ) : null}
                  </h2>
                  <div className="flex-shrink-0 ml-3 text-neutral-400">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen ? (
                  <div className="border-t border-neutral-200 dark:border-border px-4 py-3 md:px-5 md:py-4">
                    <div className="space-y-4">
                      {cat.items.map((item, idx) => (
                        <div
                          key={`${cat.title}-${idx}`}
                          className="flex flex-col sm:flex-row gap-3 py-1"
                        >
                          {item.image && !item.image.startsWith("data:") ? (
                            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-neutral-200 dark:border-border">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                                unoptimized={item.image.startsWith("/")}
                              />
                            </div>
                          ) : null}

                          <div className="flex-1 flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-[15px] md:text-base font-semibold text-neutral-900 dark:text-foreground">
                                {item.name}
                              </h3>
                              {item.description ? (
                                <p className="text-sm text-neutral-500 dark:text-muted-foreground mt-0.5 leading-snug">
                                  {item.description}
                                </p>
                              ) : null}
                            </div>
                            {item.price ? (
                              <div className="flex-shrink-0 pt-0.5">
                                <span className="text-[15px] md:text-base font-bold text-neutral-900 dark:text-foreground whitespace-nowrap">
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
      </div>

      <Footer />
    </main>
  )
}
