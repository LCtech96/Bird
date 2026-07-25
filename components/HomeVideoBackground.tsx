"use client"

export function HomeVideoBackground() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <video
        className="absolute inset-0 w-full h-full object-cover scale-105 blur-[3px]"
        src="/videos/home-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      {/* Overlay per leggibilità del testo */}
      <div className="absolute inset-0 bg-background/55 dark:bg-background/70" />
    </div>
  )
}
