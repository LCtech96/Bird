"use client"

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export default function MenuPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Il Nostro Menù</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12">
            Scopri la nostra selezione di piatti di pesce freschissimi, preparati con ingredienti 
            del territorio siciliano e serviti con passione e dedizione.
          </p>
          
          <a
            href="https://amavery.com/menu/barinello/206-23/?vm=T"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold shadow-lg"
          >
            <span>Apri Menù</span>
            <ExternalLink className="w-5 h-5" />
          </a>
          
          <div className="mt-8">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Torna alla home
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  )
}

