import type { Metadata } from "next"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { WaitlistForm } from "./WaitlistForm"

export const metadata: Metadata = {
  title: "Nomadiqe - Waitlist | Piattaforma per Ospitalità, B&B, Case Vacanze, Hotel",
  description: "Nomadiqe è la piattaforma per il settore ospitalità: gestione prenotazioni, transfer, noleggio auto, pulizie, forniture ingrosso. Per B&B, case vacanze, ville, hotel, residence, affittacamera. Airbnb e Booking a basse commissioni. Iscriviti alla waitlist.",
  keywords: [
    "Nomadiqe",
    "ospitalità",
    "transfer",
    "noleggio auto",
    "pulizie",
    "forniture ingrosso",
    "casa",
    "B&B",
    "bed and breakfast",
    "case vacanze",
    "ville",
    "hotel",
    "residence",
    "affittacamera",
    "airbnb a basse commissioni",
    "booking a basse commissioni",
    "prenotazioni",
    "turismo",
    "alloggi",
  ],
  openGraph: {
    title: "Nomadiqe - Waitlist | Ospitalità, B&B, Case Vacanze",
    description: "La piattaforma Nomadiqe per il settore ospitalità. Transfer, noleggio, pulizie, forniture. Iscriviti alla waitlist.",
  },
  alternates: { canonical: "/waitlist" },
}

export default function WaitlistPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Nomadiqe
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            La piattaforma per chi opera nell&apos;ospitalità. Iscriviti alla waitlist per restare aggiornato.
          </p>
          <WaitlistForm />
        </div>
      </div>
      <Footer />

      {/* Contenuto solo per SEO: non visibile in pagina, ma indicizzabile dai motori di ricerca */}
      <section
        className="absolute w-px h-px overflow-hidden -left-[9999px] top-0"
        aria-hidden="true"
      >
        <p>
          Nomadiqe piattaforma settore ospitalità. Servizi transfer, noleggio auto, pulizie professionali, forniture ingrosso per la casa. Soluzioni per B&B, bed and breakfast, case vacanze, ville, hotel, residence, affittacamera. Prenotazioni con Airbnb a basse commissioni, Booking a basse commissioni. Gestione alloggi turistici, strutture ricettive, appartamenti vacanza, agriturismi, dimore storiche. Nomadiqe per operatori turismo, property manager, host. Servizi trasferimenti aeroporto, autonoleggio, housekeeping, forniture per strutture ricettive. Piattaforma prenotazioni alternative a basso costo, commissioni ridotte per B&B e case vacanze.
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Nomadiqe",
            description: "Piattaforma per il settore ospitalità: B&B, case vacanze, hotel, residence, transfer, noleggio auto, pulizie, forniture. Prenotazioni a basse commissioni.",
            url: "https://birdterrasini.com/waitlist",
            publisher: {
              "@type": "Organization",
              name: "Nomadiqe",
            },
          }),
        }}
      />
    </main>
  )
}
