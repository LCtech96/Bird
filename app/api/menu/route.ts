import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"
import { defaultMenuCategories } from "@/lib/menu-data-default"

// GET - Carica il menu
export async function GET() {
  try {
    // Prova a caricare da Supabase
    if (supabaseServer) {
      const { data, error } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "menu")
        .single()

      if (!error && data && data.value && Array.isArray(data.value) && data.value.length > 0) {
        // Restituisci solo i dati salvati (non fare merge con default per evitare vecchi piatti)
        return NextResponse.json(data.value)
      }
    }
    
    // Fallback: restituisci i dati di default con tutte le categorie
    return NextResponse.json(defaultMenuCategories)
  } catch (error) {
    console.error("Error loading menu:", error)
    // In caso di errore, restituisci i dati di default
    return NextResponse.json(defaultMenuCategories)
  }
}

// POST - Salva il menu
export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    
    const menu = await request.json()
    
    // Salva su Supabase
    if (supabaseServer) {
      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: "menu",
          value: menu,
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
    console.error("Error saving menu:", error)
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
