"use client"

import { HeroSection } from "@/components/HeroSection"
import { Navigation } from "@/components/Navigation"
import { Description } from "@/components/Description"
import { Address } from "@/components/Address"
import { Footer } from "@/components/Footer"
import { AIAssistant } from "@/components/AIAssistant"
import { HomeVideoBackground } from "@/components/HomeVideoBackground"
import { useEffect, useState } from "react"

interface DailyPost {
  id: string
  type: "image" | "video"
  mediaUrl: string
  title: string
  description: string
  createdAt: string
}

export default function Home() {
  const [coverImage, setCoverImage] = useState<string>("")
  const [profileImage, setProfileImage] = useState<string>("")
  const [dailyPosts, setDailyPosts] = useState<DailyPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("/api/content", {
          cache: "no-store"
        })
        if (response.ok) {
          const data = await response.json()
          if (data.coverImage) setCoverImage(data.coverImage)
          if (data.profileImage) setProfileImage(data.profileImage)
        }
        const postsResponse = await fetch("/api/posts", { cache: "no-store" })
        if (postsResponse.ok) {
          const postsData = await postsResponse.json()
          setDailyPosts(postsData.posts || [])
        }
      } catch (error) {
        console.error("Error loading content:", error)
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen relative">
        <HomeVideoBackground />
        <div className="relative z-10">
          <Navigation />
          <div className="container mx-auto px-4 py-24 md:py-32">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-muted-foreground">Caricamento...</p>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative">
      <HomeVideoBackground />
      <div className="relative z-10">
      <Navigation />
      
      {/* Hero Section with Cover and Profile */}
      <div className="pt-0 md:pt-16">
        <HeroSection coverImage={coverImage} profileImage={profileImage} />
      </div>

      {/* Post del Giorno - sotto il nome del ristorante */}
      {dailyPosts.length > 0 && (
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {dailyPosts.map((post) => (
              <div key={post.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
                {post.type === "image" ? (
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <video
                    src={post.mediaUrl}
                    className="w-full aspect-video object-cover"
                    controls
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-playfair), serif" }}>
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                      {post.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Google Maps Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <section className="mb-12">
            <div className="text-center mb-12 md:mb-16">
              <h2 
                className="text-4xl md:text-6xl font-bold mb-4 tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Come raggiungerci
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
            </div>
            <div className="w-full">
              <a
                href="https://maps.app.goo.gl/NutthoLknzXXb6ot6?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group cursor-pointer"
                aria-label="Apri la posizione su Google Maps"
              >
                <div className="relative w-full aspect-video bg-muted">
                  <iframe
                    src="https://maps.google.com/maps?q=Lungomare+Peppino+Impastato+N1,+Terrasini+Favarotta,+Italy,+90049&hl=it&z=15&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>
              </a>
              <p className="text-center text-muted-foreground mt-4 text-sm md:text-base">
                Clicca sulla mappa per aprire Google Maps
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Description Section */}
      <Description />

      {/* Address Section */}
      <Address />

      {/* Footer */}
      <Footer />

      {/* AI Assistant */}
      <AIAssistant />
      </div>
    </main>
  )
}
