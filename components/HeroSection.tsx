"use client"

import Image from "next/image"

interface HeroSectionProps {
  coverImage: string
  profileImage: string
}

const PLACEHOLDER_COVER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23334155'/%3E%3Cstop offset='100%25' style='stop-color:%231e293b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='1200' height='400'/%3E%3C/svg%3E"
const PLACEHOLDER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23475569' width='100' height='100'/%3E%3C/svg%3E"

export function HeroSection({ coverImage, profileImage }: HeroSectionProps) {
  const cover = coverImage || PLACEHOLDER_COVER
  const profile = profileImage || PLACEHOLDER_AVATAR
  const coverIsData = cover.startsWith("data:")
  const profileIsData = profile.startsWith("data:")

  return (
    <div className="relative w-full">
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <Image
          src={cover}
          alt="Vista del mare e faraglioni"
          fill
          className="object-cover"
          priority
          unoptimized={coverIsData || cover.startsWith("/api/")}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative -mt-20 md:-mt-24 flex justify-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background shadow-lg">
            <Image
              src={profile}
              alt="Bird Restaurant"
              fill
              className="object-cover"
              priority
              unoptimized={profileIsData || profile.startsWith("/api/")}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Bird Restaurant</h1>
      </div>
    </div>
  )
}
