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
        
        // Per ogni membro, pulisci i percorsi hardcoded e carica base64 se disponibile
        teamMembers = await Promise.all(
          teamMembers.map(async (member) => {
            // Se l'immagine è un percorso hardcoded (inizia con / ma non è base64) o percorso team che non esiste, pulisci
            if (member.image) {
              // Se è base64 (data:image), mantienilo
              if (member.image.startsWith("data:image")) {
                return member
              }
              // Se è un percorso hardcoded (inizia con /) o percorso team, prova a caricare base64 o pulisci
              if (member.image.startsWith("/")) {
                try {
                  // Prova a caricare il base64 dalla chiave separata
                  const { data: imageData } = await supabaseServer
                    .from("admin_data")
                    .select("value")
                    .eq("key", `chi_siamo_image_${member.id}`)
                    .single()

                  if (imageData?.value?.imageData) {
                    return { ...member, image: imageData.value.imageData }
                  }
                } catch (err) {
                  // Se non trova l'immagine base64, continua a pulire
                  console.log(`No base64 image found for member ${member.id}, cleaning hardcoded path`)
                }
                // Rimuovi il percorso hardcoded (non esiste nel server)
                return { ...member, image: "" }
              }
            }
            // Se l'immagine è vuota, prova comunque a caricare base64 se esiste
            if (!member.image) {
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
                // Nessun base64 disponibile, mantieni vuoto
              }
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
    
    let teamMembers = await request.json()
    
    // Pulisci i percorsi hardcoded prima di salvare - mantieni solo base64 o stringa vuota
    teamMembers = (Array.isArray(teamMembers) ? teamMembers : []).map((member: any) => {
      // Se l'immagine è un percorso hardcoded (inizia con / ma non è base64), rimuovilo
      if (member.image && member.image.startsWith("/") && !member.image.startsWith("data:image")) {
        return { ...member, image: "" }
      }
      return member
    })
    
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




