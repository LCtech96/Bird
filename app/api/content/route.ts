import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"

// Video di default dalla home page
const DEFAULT_VIDEOS = [
  {
    id: "i",
    src: "/video/i.mp4",
    title: "Tramonto sul mare",
    description: "Lasciatevi incantare dai tramonti mozzafiato che ogni sera colorano il cielo sopra il mare di Terrasini. Un momento magico che rende ogni cena al Bird Restaurant un'esperienza indimenticabile, dove la natura si fonde con l'eccellenza culinaria.",
    visible: true
  },
  {
    id: "ii",
    src: "/video/ii.mp4",
    title: "Il sole che si tuffa nel mare",
    description: "Il sole che si tuffa nel mare cristallino crea uno spettacolo unico che solo la Sicilia può offrire. Sulla nostra terrazza affacciata sul mare, potete ammirare questi momenti di pura bellezza mentre gustate i nostri piatti di pesce freschissimo.",
    visible: true
  },
  {
    id: "d",
    src: "/video/d.mp4",
    title: "I nostri spaghetti alle vongole",
    description: "Spaghetti perfettamente al dente con vongole veraci freschissime, aglio, prezzemolo e un tocco di vino bianco. Un classico della cucina siciliana che celebra il sapore autentico del mare, preparato con la passione e l'esperienza che solo la tradizione può offrire.",
    visible: true
  },
  {
    id: "f",
    src: "/video/f.mp4",
    title: "Le nostre busiate con gambero",
    description: "La pasta tipica siciliana incontra i gamberi freschissimi del nostro mare. Le busiate, avvolte a mano secondo l'antica tradizione, si sposano perfettamente con il sapore delicato e intenso dei gamberi, creando un piatto che è poesia in ogni boccone.",
    visible: true
  },
  {
    id: "g",
    src: "/video/g.mp4",
    title: "Le nostre linguine all'astice",
    description: "Linguine di grano duro con astice fresco appena pescato, pomodorini pachino e basilico siciliano. Un piatto di lusso che esalta la dolcezza dell'astice e la ricchezza del mare, servito con eleganza e raffinatezza.",
    visible: true
  },
  {
    id: "w",
    src: "/video/w.mp4",
    title: "Il nostro pescato fresco",
    description: "Ogni mattina i nostri pescatori locali portano il pesce più fresco del mare di Terrasini. Branzini, orate, triglie e pesce spada vengono selezionati con cura per garantire la massima qualità e freschezza in ogni nostro piatto.",
    visible: true
  },
  {
    id: "e",
    src: "/video/e.mp4",
    title: "Il nostro pescato fresco",
    description: "La tradizione della pesca siciliana si unisce all'arte culinaria. Il nostro pescato del giorno viene preparato rispettando i sapori autentici del mare, con tecniche che esaltano la naturale bontà di ogni ingrediente.",
    visible: true
  },
  {
    id: "u",
    src: "/video/u.mp4",
    title: "I nostri crudi di mare",
    description: "Una selezione raffinata di crudi di pesce freschissimo: pesce spada, tonno, gamberi e ricci di mare. Ogni boccone è un'esplosione di sapori puri e autentici, accompagnati da olio extravergine siciliano e limone dell'isola.",
    visible: true
  }
]

const DEFAULT_EDITABLE_IMAGES: Array<{ id: string; src: string; title: string; description: string; visible: boolean }> = []

const DEFAULT_HOME_IMAGES: Array<{ id: string; src: string; title: string; description: string; visible: boolean }> = []

const DEFAULT_CONTENT = {
  coverImage: "",
  profileImage: "",
  videos: DEFAULT_VIDEOS,
  images: [],
  editableImages: [],
  homeImages: DEFAULT_HOME_IMAGES
}

// GET - Carica i contenuti
export async function GET() {
  try {
    let content = { ...DEFAULT_CONTENT }
    
    // Carica cover e profile images da Supabase
    if (supabaseServer) {
      // Carica cover image
      const { data: coverData } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "hero_cover_image")
        .single()
      
      if (coverData?.value?.imageData) {
        content.coverImage = coverData.value.imageData
      }
      
      // Carica profile image
      const { data: profileData } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "hero_profile_image")
        .single()
      
      if (profileData?.value?.imageData) {
        content.profileImage = profileData.value.imageData
      }
      
      // Carica altri contenuti
      const { data, error } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "content")
        .single()

      if (!error && data?.value) {
        // Merge con cover e profile images
        content = {
          ...data.value,
          coverImage: content.coverImage || data.value.coverImage || "",
          profileImage: content.profileImage || data.value.profileImage || ""
        }
      }
    }
    
    return NextResponse.json(content)
  } catch (error) {
    console.error("Error loading content:", error)
    return NextResponse.json(DEFAULT_CONTENT)
  }
}

// POST - Salva i contenuti
export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    
    const content = await request.json()
    
    // Salva su Supabase
    if (supabaseServer) {
      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: "content",
          value: content,
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
    console.error("Error saving content:", error)
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
