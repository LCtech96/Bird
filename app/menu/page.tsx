"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
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
  dishes?: MenuItem[] // Supporto per struttura admin (dishes) e pubblica (items)
}

export default function AsportoPage() {
  const [expanded, setExpanded] = useState<Set<string>>(
    () =>
      new Set([
        "Aperitivi",
        "Antipasti di pesce",
        "Antipasti di carne",
        "Primi",
        "Pizze"
      ])
  )
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMenu()
  }, [])

  const loadMenu = async () => {
    try {
      const response = await fetch("/api/menu", {
        cache: "no-store"
      })
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          // Converti la struttura admin (dishes) alla struttura pubblica (items)
          const convertedCategories = data.map((cat: any) => ({
            title: cat.title,
            items: (cat.dishes || cat.items || []).filter((item: any) => item.visible !== false)
          }))
          setCategories(convertedCategories)
        } else {
          // Fallback: usa i dati della pagina pubblica
          setCategories(menuCategoriesFromPublic.map(cat => ({
            title: cat.title,
            items: cat.dishes.filter(dish => dish.visible !== false)
          })))
        }
      } else {
        // Fallback: usa i dati della pagina pubblica
        setCategories(menuCategoriesFromPublic.map(cat => ({
          title: cat.title,
          items: cat.dishes.filter(dish => dish.visible !== false)
        })))
      }
    } catch (error) {
      console.error("Error loading menu:", error)
      // Fallback: usa i dati della pagina pubblica
      setCategories(menuCategoriesFromPublic.map(cat => ({
        title: cat.title,
        items: cat.dishes.filter(dish => dish.visible !== false)
      })))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">Caricamento menu...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const toggle = (title: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Menù</h1>
            <div className="mt-6 text-lg text-muted-foreground whitespace-pre-line">
              Martedì-Venerdì 19:00-23:00{'\n'}
              Sabato 19:00-23:30{'\n'}
              Domenica 12:30-15:00{'\n'}
              19:00-23:30{'\n'}
              Chiuso Lunedì
            </div>
          </div>

          <div className="space-y-2">
            {categories.map((cat) => {
              const isOpen = expanded.has(cat.title)
              return (
                <div key={cat.title} className="border border-border rounded-lg overflow-hidden bg-card">
                  <button
                    type="button"
                    onClick={() => toggle(cat.title)}
                    className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-accent/50 transition-colors text-left"
                    aria-expanded={isOpen}
                  >
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">{cat.title}</h2>
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
                            {/* Immagine del piatto (se presente) */}
                            {item.image && (
                              <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-border">
                                {item.image.startsWith("data:image") ? (
                                  // Se è base64, usa img normale
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  // Se è un percorso URL, usa Next.js Image
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                    unoptimized={item.image.startsWith("/")}
                                  />
                                )}
                              </div>
                            )}
                            
                            {/* Informazioni del piatto */}
                            <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                              <div className="flex-1">
                                <h3 className="text-base md:text-lg font-semibold">{item.name}</h3>
                                {item.description ? (
                                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                ) : null}
                              </div>
                              {item.price ? (
                                <div className="flex-shrink-0">
                                  <span className="text-base md:text-lg font-bold text-foreground">{item.price}</span>
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
