import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"

// Questa API route gestisce l'upload delle immagini hero (cover e profile)
// Salva l'immagine come base64 in Supabase

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const { type, fileName, imageData } = body

    if (!imageData || !fileName || !type) {
      return NextResponse.json(
        { error: "Dati immagine mancanti" },
        { status: 400 }
      )
    }

    if (type !== "cover" && type !== "profile") {
      return NextResponse.json(
        { error: "Tipo non valido. Usa 'cover' o 'profile'" },
        { status: 400 }
      )
    }

    // Salva l'immagine come base64 in Supabase
    if (supabaseServer) {
      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: `hero_${type}_image`,
          value: {
            fileName: fileName,
            imageData: imageData, // Base64
            uploadedAt: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        }, {
          onConflict: "key"
        })

      if (error) {
        console.error("Supabase error:", error)
        return NextResponse.json(
          { error: "Errore nel salvataggio su Supabase" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        imageUrl: imageData, // Restituisce il base64 per uso immediato
        message: "Immagine salvata con successo"
      })
    }

    return NextResponse.json(
      { error: "Database non configurato" },
      { status: 500 }
    )
  } catch (error: any) {
    console.error("Error uploading image:", error)
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Errore durante l'upload" },
      { status: 500 }
    )
  }
}
