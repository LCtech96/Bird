"use client"

import { useState } from "react"
import { Facebook, MessageCircle, X } from "lucide-react"

export function Footer() {
  const [showDisclaimer, setShowDisclaimer] = useState<string | null>(null)

  const handleClick = (platform: string) => {
    setShowDisclaimer(platform)
    setTimeout(() => setShowDisclaimer(null), 3000)
  }

  return (
    <>
      <footer className="bg-white dark:bg-background border-t border-neutral-200 dark:border-border py-8 pb-24 md:pb-8">
        <div className="mx-auto w-full max-w-xl px-4">
          <div className="flex flex-col items-center justify-center gap-3 mb-6">
            <button
              onClick={() => handleClick("facebook")}
              className="flex w-full max-w-xs items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1877F2] text-white hover:bg-[#166FE5] transition-colors"
            >
              <Facebook className="w-5 h-5" />
              <span>Facebook</span>
            </button>
            <a
              href="https://wa.me/393203754312"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full max-w-xs items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white hover:bg-[#1EBE57] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
          </div>
          <div className="text-center mt-6 pt-5 border-t border-neutral-200 dark:border-border">
            <p className="text-sm md:text-base text-neutral-600 dark:text-muted-foreground" style={{ fontFamily: 'var(--font-montserrat)' }}>
              Creato da{" "}
              <a
                href="https://www.facevoice.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 dark:text-foreground hover:underline font-bold transition-colors"
              >
                facevoice.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

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

