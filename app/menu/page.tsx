"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Search, X, Volume2, VolumeX } from "lucide-react"
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

/** Pagine del PDF ufficiale (1–45), identiche al file qrcodekit. */
const MENU_PDF_PAGES = Array.from({ length: 45 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0")
  return {
    page: i + 1,
    src: `/menu-pdf/page-${n}.jpg`,
  }
})

/**
 * Indice testo → pagine PDF per far funzionare la ricerca
 * sulle pagine grafiche ufficiali.
 */
const PAGE_SEARCH_INDEX: { page: number; text: string }[] = [
  { page: 1, text: "copertina bird garden terrasini menù ristorante pizzeria" },
  { page: 2, text: "piatto del giorno maître di sala" },
  { page: 3, text: "aperitivi sambitter martini americano negroni cocktail gin tonic lemon vodka cuba libre ricard pernod" },
  { page: 4, text: "spritz aperol campari hugo italicus sarti mandarita" },
  { page: 5, text: "antipasti di pesce cozze zuppa cocktail gamberi insalata mare delizia mediterranea ostriche" },
  { page: 6, text: "antipasti di carne bruschette antipasto caldo fritto patate caprese tartare manzo" },
  { page: 7, text: "primi spaghetti vongole scoglio farfallette salmone risotto marinara gambero zucca pennette bird francescana carbonara" },
  { page: 8, text: "secondi di pesce fresco umido frittura totano calamaro calamaretti pesce spada gamberoni grigliata" },
  { page: 9, text: "secondi di carne bistecca tagliata manzo filetto grigliata involtini pollo hamburger cheeseburger bacon" },
  { page: 10, text: "contorni patate verdure spinaci insalata contadina mista insalatone bird capricciosa tuttosole caesar" },
  { page: 11, text: "pizze gourmet pistacchiosa trentina pantesca datterino" },
  { page: 12, text: "pizze margherita bufala napoli romana quattro gusti capricciosa diavola crudo sfincionella gustosità ciliegina prataiola calzone enzo" },
  { page: 13, text: "pizze bird chicken bbq ida patatosa vegetariana parmigiana salsiccia funghi porcini campagnola salmone sindaco marinara tonno" },
  { page: 14, text: "pizze bianche biancaneve friarielli bolognese quattro formaggi deliziosa pizza pane campana caprese norvegese limone" },
  { page: 15, text: "schiacciate siciliana bird contadina gustosità greca deliziosa pani cunsatu integrale senza glutine" },
  { page: 16, text: "dessert parfait cheescake tiramisù cassatelle soufflé tartufo sorbetto frutta ananas cantalupo melone digestivi caffè limoncello amaro" },
  { page: 17, text: "bibite acqua naturale frizzante cocacola sprite fanta lemonsoda chinotto tonica succo red bull" },
  { page: 18, text: "birre alla spina forst bionda rossa" },
  { page: 19, text: "birre bottiglia heineken paulaner moretti corona ceres tennent peroni nastro azzurro" },
  { page: 20, text: "birre leffe blond radieuse messina cristalli sale" },
  { page: 21, text: "citazioni vino" },
  { page: 22, text: "vini bianchi white wines" },
  { page: 23, text: "donnafugata damarino sur sur anthilia ben rye" },
  { page: 24, text: "duca di salaparuta lavico bianco sentiero del vento kados" },
  { page: 25, text: "angimbé insolia lucido shamaris" },
  { page: 26, text: "donnafugata opera unica contessa entellina chardonnay" },
  { page: 27, text: "tasca regaleali leone cavallo delle fate nozze d'oro merano sauvignon muller pinot gewurztraminer" },
  { page: 28, text: "rose wines sparkling wine vini rosati spumanti" },
  { page: 29, text: "charme milazzo bianco di nera rosè di rosa" },
  { page: 30, text: "donnafugata lumera gorghi tondi babbio lavico rosa" },
  { page: 31, text: "franciacorta bellavista ferrari" },
  { page: 32, text: "veuve clicquot moet chandon champagne" },
  { page: 33, text: "vini rossi red wines" },
  { page: 34, text: "conti d'almerita la monaca regaleali lamuri vigna san francesco rosso del conte" },
  { page: 35, text: "corvo florio passo delle mule gorghi tondi meridiano spassoso sorelle sala coste preola" },
  { page: 36, text: "controdanza cerasuolo vittoria la segreta frappato plumbago" },
  { page: 37, text: "lavico rosso aut sicilia barbera dolcetto" },
  { page: 38, text: "merlot benuara disueri sagana noa" },
  { page: 39, text: "sedara sul vulcano sherazade floramundi" },
  { page: 40, text: "amarone passera scopaiola piro piro" },
  { page: 41, text: "magnum cusumano benuara tasca la monaca" },
  { page: 42, text: "whisky bourbon johnnie walker ballantine jack daniel jim beam four roses" },
  { page: 43, text: "gin tanqueray hendrick malfy gordon bombay sapphire" },
  { page: 44, text: "vodka moskovskaya belvedere grey goose beluga" },
  { page: 45, text: "allergeni glutine latte uova soia sesamo crostacei molluschi" },
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
  pasta: ["spaghetti", "pennette", "farfalle", "farfallette", "risotto", "carbonara", "scoglio", "vongole", "primi"],
  primo: ["primi", "pasta", "spaghetti", "pennette", "farfalle", "farfallette", "risotto"],
  primi: ["pasta", "spaghetti", "pennette", "farfalle", "farfallette", "risotto"],
  pizza: ["pizze", "margherita", "calzone", "sfincionella", "pizza pane", "schiacciate"],
  pizze: ["pizza", "margherita", "calzone"],
  pesce: ["mare", "cozze", "vongole", "gamberi", "polpo", "polipo", "salmone", "tonno", "scoglio"],
  carne: ["filetto", "manzo", "prosciutto", "salsiccia", "pollo", "ragù", "tartare"],
  dolce: ["dessert", "tiramisu", "gelato", "torta", "frutta"],
  dolci: ["dessert", "tiramisu", "gelato", "torta"],
  vino: ["vini", "prosecco", "birra", "digestivi", "spritz", "aperitivi", "champagne"],
  vini: ["vino", "bianchi", "rossi", "donnafugata", "tasca"],
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

function pageMatches(pageText: string, query: string): boolean {
  const q = normalize(query)
  if (!q) return true
  const queryTokens = q.split(" ").filter((t) => t.length > 1)
  if (queryTokens.length === 0) return true
  const blob = normalize(pageText)
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

  const filteredDishes = useMemo(() => {
    const q = query.trim()
    if (!q) return []
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => dishMatches(item, cat.title, q)),
      }))
      .filter((cat) => cat.items.length > 0)
  }, [categories, query])

  const visiblePages = useMemo(() => {
    const q = query.trim()
    if (!q) return MENU_PDF_PAGES
    const matched = new Set(
      PAGE_SEARCH_INDEX.filter((p) => pageMatches(p.text, q)).map((p) => p.page)
    )
    // anche pagine collegate ai piatti trovati via titolo categoria
    for (const cat of filteredDishes) {
      const hit = PAGE_SEARCH_INDEX.find((p) =>
        normalize(p.text).includes(normalize(cat.title).split(" ")[0] || "")
      )
      if (hit) matched.add(hit.page)
    }
    return MENU_PDF_PAGES.filter((p) => matched.has(p.page))
  }, [query, filteredDishes])

  const totalDishResults = filteredDishes.reduce((acc, c) => acc + c.items.length, 0)
  const isSearching = !!query.trim()

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-neutral-900 dark:bg-background dark:text-foreground">
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
          <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
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
          {isSearching ? (
            <p className="mt-2 text-sm text-neutral-500 dark:text-muted-foreground text-center">
              {visiblePages.length === 0 && totalDishResults === 0
                ? "Nessun risultato — prova un altro termine"
                : `${visiblePages.length} pagin${visiblePages.length === 1 ? "a" : "e"}${
                    totalDishResults
                      ? ` · ${totalDishResults} piatt${totalDishResults === 1 ? "o" : "i"}`
                      : ""
                  }`}
            </p>
          ) : null}
        </div>

        {/* Risultati testuali durante la ricerca */}
        {isSearching && totalDishResults > 0 ? (
          <div className="mb-6 space-y-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-border dark:bg-card">
            {filteredDishes.map((cat) => (
              <div key={cat.title}>
                <h2 className="text-sm font-semibold text-neutral-500 mb-2">{cat.title}</h2>
                <ul className="space-y-2">
                  {cat.items.map((item, idx) => (
                    <li key={`${cat.title}-${idx}`} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold">{item.name}</p>
                        {item.description ? (
                          <p className="text-sm text-neutral-500 leading-snug">{item.description}</p>
                        ) : null}
                      </div>
                      {item.price ? (
                        <span className="flex-shrink-0 text-[15px] font-bold whitespace-nowrap">{item.price}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        {/* Pagine grafiche del PDF ufficiale — identiche al link */}
        <div className="space-y-4 md:space-y-5">
          {visiblePages.map((page) => (
            <article
              key={page.page}
              id={`menu-page-${page.page}`}
              className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5"
            >
              <Image
                src={page.src}
                alt={`Menù Bird Garden — pagina ${page.page}`}
                width={1788}
                height={2529}
                className="w-full h-auto block"
                sizes="(max-width: 640px) 100vw, 576px"
                priority={page.page <= 2}
                quality={85}
              />
            </article>
          ))}
        </div>

        {!isSearching ? (
          <p className="mt-6 text-center text-xs text-neutral-400">
            Menù ufficiale Bird Garden · {MENU_PDF_PAGES.length} pagine
          </p>
        ) : null}
      </div>

      <Footer />
    </main>
  )
}
