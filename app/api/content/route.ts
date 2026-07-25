import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"

const DEFAULT_CONTENT = {
  coverImage: "",
  profileImage: ""
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
        // Merge con cover e profile images, mantenendo solo coverImage e profileImage
        content = {
          coverImage: content.coverImage || data.value.coverImage || "",
          profileImage: content.profileImage || data.value.profileImage || ""
        }
      }
    }
    
    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
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
