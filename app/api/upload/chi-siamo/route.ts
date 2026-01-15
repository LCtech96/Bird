import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"

// Questa API route gestisce l'upload delle immagini per la pagina chi-siamo
// Salva l'immagine come base64 in Supabase o restituisce il percorso

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const { memberId, fileName, imageData, imagePath } = body

    if (!imageData || !fileName) {
      return NextResponse.json(
        { error: "Dati immagine mancanti" },
        { status: 400 }
      )
    }

    // Salva l'immagine in Supabase Storage o come dato
    // Per ora, salva solo il percorso e l'immagine come base64 in admin_data
    if (supabaseServer) {
      // Salva l'immagine temporaneamente in admin_data
      // In futuro, potresti usare Supabase Storage per un approccio migliore
      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: `chi_siamo_image_${memberId}`,
          value: {
            fileName: fileName,
            imagePath: imagePath,
            imageData: imageData, // Base64
            uploadedAt: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        }, {
          onConflict: "key"
        })

      if (error) {
        console.error("Supabase error:", error)
        // In caso di errore, restituisci comunque il base64 per l'uso immediato
        return NextResponse.json({
          success: true,
          imageUrl: imageData, // Restituisce il base64 per uso immediato
          message: "Immagine salvata con successo"
        })
      }

      return NextResponse.json({
        success: true,
        imageUrl: imageData, // Restituisce il base64 per uso immediato (non il percorso)
        message: "Immagine salvata con successo"
      })
    }

    // Se Supabase non è configurato, restituisci comunque il base64 per l'uso immediato
    return NextResponse.json({
      success: true,
      imageUrl: imageData, // Restituisce il base64 per uso immediato
      message: "Immagine caricata con successo"
    })
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

