"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Menu, ShoppingBag, Calendar, Moon, Sun, X, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [showDisclaimer, setShowDisclaimer] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Evita hydration mismatch aspettando che il componente sia montato
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = (item: string) => {
    if (item === "menu") {
      router.push("/menu")
    } else if (item === "booking") {
      router.push("/booking")
    } else if (item === "chi-siamo") {
      router.push("/chi-siamo")
    } else {
      setShowDisclaimer(item)
      setTimeout(() => setShowDisclaimer(null), 3000)
    }
  }

  const navItems = [
    { id: "menu", label: "Menù", icon: Menu },
    { id: "booking", label: "Booking", icon: Calendar },
    { id: "chi-siamo", label: "Chi siamo", icon: Users },
  ]

  return (
    <>
      {/* Desktop Navigation - Top */}
      <nav className={cn("hidden md:flex fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border", className)}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom */}
      <nav className={cn("md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-background/95 backdrop-blur-md border-t border-neutral-200 dark:border-border", className)}>
        <div className="flex items-center justify-around px-2 py-2.5">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-accent transition-colors min-w-[64px]"
              >
                <Icon className="w-5 h-5 text-neutral-800 dark:text-foreground" />
                <span className="text-[11px] text-neutral-700 dark:text-foreground">{item.label}</span>
              </button>
            )
          })}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-accent transition-colors min-w-[64px]"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-neutral-800" />}
            <span className="text-[11px] text-neutral-700 dark:text-foreground">Tema</span>
          </button>
        </div>
      </nav>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-lg p-6 mx-4 max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Avviso</h3>
              <button
                onClick={() => setShowDisclaimer(null)}
                className="p-1 rounded hover:bg-accent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-muted-foreground">Aggiorneremo presto questa funzione</p>
          </div>
        </div>
      )}
    </>
  )
}

