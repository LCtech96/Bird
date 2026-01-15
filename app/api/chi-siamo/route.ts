import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"

// Dati di default (senza immagini hardcoded)
const DEFAULT_TEAM_MEMBERS = [
  {
    id: 1,
    image: "",
    title: "Il nostro servizio",
    description: "Con attenzione ai dettagli e un sorriso sempre pronto, si prende cura di ogni ospite con dedizione e professionalità. La sua presenza discreta ma attenta rende ogni momento della cena piacevole e rilassante, creando un'atmosfera accogliente che fa sentire tutti come a casa.",
    layout: "left" // left = immagine a sinistra, right = immagine a destra
  },
  {
    id: 2,
    image: "",
    title: "Barman",
    description: "Maestro delle bevande e creatore di momenti speciali, trasforma ogni drink in un'esperienza unica. Con passione e creatività, prepara cocktail raffinati e seleziona i migliori vini per accompagnare i nostri piatti. La sua competenza e il suo entusiasmo rendono ogni aperitivo o dopo cena un momento da ricordare.",
    layout: "right"
  },
  {
    id: 3,
    image: "",
    title: "Il Titolare",
    description: "Cuore e anima del Bird Restaurant, guida con passione e dedizione ogni aspetto della nostra cucina. Con anni di esperienza e un amore profondo per la tradizione siciliana, seleziona personalmente ogni ingrediente e supervisiona ogni piatto che esce dalla nostra cucina. La sua visione e il suo impegno rendono il Bird Restaurant un luogo dove tradizione e innovazione si incontrano per creare esperienze culinarie indimenticabili.",
    layout: "left"
  }
]

// GET - Carica i membri del team
export async function GET() {
  try {
    // Prova a caricare da Supabase
    if (supabaseServer) {
      const { data, error } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "chi_siamo")
        .single()

      if (!error && data && data.value) {
        let teamMembers = data.value as Array<{ id: number; image?: string; [key: string]: any }>
        
        // Per ogni membro, se l'immagine è un percorso hardcoded (non base64), prova a caricare il base64 dalla chiave separata
        teamMembers = await Promise.all(
          teamMembers.map(async (member) => {
            // Se l'immagine è un percorso hardcoded (inizia con /) o è vuota, prova a caricare il base64
            if (!member.image || (member.image.startsWith("/") && !member.image.startsWith("/api"))) {
              try {
                const { data: imageData } = await supabaseServer
                  .from("admin_data")
                  .select("value")
                  .eq("key", `chi_siamo_image_${member.id}`)
                  .single()

                if (imageData?.value?.imageData) {
                  return { ...member, image: imageData.value.imageData }
                }
              } catch (err) {
                // Se non trova l'immagine base64, usa stringa vuota invece del percorso hardcoded
                console.log(`No base64 image found for member ${member.id}`)
              }
              // Se non trova il base64, rimuovi il percorso hardcoded
              return { ...member, image: "" }
            }
            return member
          })
        )
        
        return NextResponse.json(teamMembers)
      }
    }
    
    // Fallback: restituisci dati di default (senza immagini hardcoded)
    return NextResponse.json(DEFAULT_TEAM_MEMBERS)
  } catch (error) {
    console.error("Error loading chi siamo:", error)
    return NextResponse.json(DEFAULT_TEAM_MEMBERS)
  }
}

// POST - Salva i membri del team
export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    
    const teamMembers = await request.json()
    
    // Salva su Supabase
    if (supabaseServer) {
      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: "chi_siamo",
          value: teamMembers,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "key"
        })

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      return NextResponse.json({ success: true })
    }
    
    // Se Supabase non è configurato, restituisci errore
    return NextResponse.json(
      { error: "Database non configurato. Configura Supabase per salvare i dati." },
      { status: 500 }
    )
  } catch (error: any) {
    console.error("Error saving chi siamo:", error)
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Errore nel salvataggio" },
      { status: 500 }
    )
  }
}




