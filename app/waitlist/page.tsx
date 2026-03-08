import type { Metadata } from "next"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { WaitlistForm } from "./WaitlistForm"

export const metadata: Metadata = {
  title: "Nomadiqe - Waitlist | Ospitalità, Creator, Influencer Travel, Lifestyle, Beauty, Luxury",
  description: "Nomadiqe: piattaforma per ospitalità, host e content creator. Influencer travel, lifestyle, beauty, luxury: collaborazioni, viaggiare gratis, opportunità di lavoro. Host: pubblicità e sponsorizzazioni anche gratuite. B&B, case vacanze, hotel. Iscriviti alla waitlist.",
  keywords: [
    "Nomadiqe",
    "content creator",
    "influencer",
    "influencer travel",
    "influencer lifestyle",
    "influencer beauty",
    "influencer luxury",
    "collaborazioni creator",
    "viaggiare gratis",
    "opportunità di lavoro",
    "host",
    "pubblicità gratuita",
    "sponsorizzazioni",
    "ospitalità",
    "transfer",
    "noleggio auto",
    "pulizie",
    "forniture ingrosso",
    "B&B",
    "case vacanze",
    "ville",
    "hotel",
    "residence",
    "airbnb a basse commissioni",
    "booking a basse commissioni",
    "travel",
    "lifestyle",
    "beauty",
    "luxury",
    "partnership",
    "press trip",
  ],
  openGraph: {
    title: "Nomadiqe - Waitlist | Creator, Influencer, Host, Ospitalità",
    description: "Content creator e influencer travel, lifestyle, beauty, luxury: collaborazioni e viaggi. Host: pubblicità anche gratuita. Iscriviti alla waitlist Nomadiqe.",
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
          Nomadiqe piattaforma settore ospitalità. Servizi transfer, noleggio auto, pulizie professionali, forniture ingrosso per la casa. Soluzioni per B&B, bed and breakfast, case vacanze, ville, hotel, residence, affittacamera. Airbnb e Booking a basse commissioni. Content creator che cercano collaborazioni: Nomadiqe connette creator e influencer. Influencer travel, influencer lifestyle, influencer beauty, influencer luxury possono viaggiare gratis o trovare opportunità di lavoro. Collaborazioni con strutture, soggiorni in cambio di contenuti, press trip, partnership. Gli host che vogliono pubblicità possono riceverla anche gratuitamente tramite collaborazioni con creator e influencer. Influencer marketing per hotel, B&B, case vacanze. Opportunità per content creator, creator travel, lifestyle, beauty, luxury. Property manager, alloggi turistici, strutture ricettive, sponsorizzazioni host, baratto soggiorno, collaborazione influencer hotel.
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Nomadiqe",
            description: "Nomadiqe: piattaforma per ospitalità, host e content creator. Influencer travel, lifestyle, beauty, luxury: collaborazioni, viaggiare gratis, opportunità. Host: pubblicità e sponsorizzazioni anche gratuite. B&B, case vacanze, hotel.",
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
