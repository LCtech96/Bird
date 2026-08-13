import { NextRequest, NextResponse } from "next/server"
import { requireAuth, isAuthenticated } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"
import { defaultMenuCategories, MENU_PDF_SYNC_AT } from "@/lib/menu-data-default"

// GET - Carica il menu
export async function GET() {
  try {
    let menu = defaultMenuCategories

    if (supabaseServer) {
      const { data, error } = await supabaseServer
        .from("admin_data")
        .select("value, updated_at")
        .eq("key", "menu")
        .single()

      // Usa il DB solo se aggiornato dopo il sync del PDF ufficiale; altrimenti i default
      const dbUpdatedAt = data?.updated_at ? new Date(data.updated_at).getTime() : 0
      const pdfSyncAt = new Date(MENU_PDF_SYNC_AT).getTime()
      if (
        !error &&
        data &&
        data.value &&
        Array.isArray(data.value) &&
        data.value.length > 0 &&
        dbUpdatedAt > pdfSyncAt
      ) {
        menu = data.value
      }
    }

    const admin = await isAuthenticated()

    // Pubblico: niente base64 (payload leggero). Admin: menu completo.
    const payload = admin
      ? menu
      : menu.map((cat: any) => ({
          title: cat.title,
          dishes: (cat.dishes || cat.items || []).map((dish: any) => {
            const { image, ...rest } = dish
            const lightImage =
              image && typeof image === "string" && !image.startsWith("data:")
                ? image
                : undefined
            return { ...rest, ...(lightImage ? { image: lightImage } : {}) }
          }),
        }))

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": admin
          ? "private, no-store"
          : "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Error loading menu:", error)
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
