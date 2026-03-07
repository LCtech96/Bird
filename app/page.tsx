"use client"

import { HeroSection } from "@/components/HeroSection"
import { Navigation } from "@/components/Navigation"
import { Description } from "@/components/Description"
import { Address } from "@/components/Address"
import { Footer } from "@/components/Footer"
import { LazyMap } from "@/components/LazyMap"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const AIAssistant = dynamic(() => import("@/components/AIAssistant").then((m) => ({ default: m.AIAssistant })), {
  ssr: false,
  loading: () => null,
})

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

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [contentRes, postsRes] = await Promise.all([
          fetch("/api/content", { cache: "no-store" }),
          fetch("/api/posts", { cache: "no-store" }),
        ])
        if (contentRes.ok) {
          const data = await contentRes.json()
          if (data.coverImage) setCoverImage(data.coverImage)
          if (data.profileImage) setProfileImage(data.profileImage)
        }
        if (postsRes.ok) {
          const postsData = await postsRes.json()
          setDailyPosts(postsData.posts || [])
        }
      } catch (error) {
        console.error("Error loading content:", error)
      }
    }
    loadContent()
  }, [])

  return (
    <main className="min-h-screen relative z-10">
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

      {/* Google Maps Section - iframe caricato solo quando in viewport */}
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
              <LazyMap />
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
    </main>
  )
}
