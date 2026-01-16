import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"

// Questa API route gestisce l'upload dei video
// Salva il video come base64 in Supabase

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const { fileName, videoData, videoId } = body

    if (!videoData || !fileName) {
      return NextResponse.json(
        { error: "Dati video mancanti" },
        { status: 400 }
      )
    }

    const estimateBase64Bytes = (base64: string) => {
      const cleaned = base64.split(",")[1] || base64
      const padding = cleaned.endsWith("==") ? 2 : cleaned.endsWith("=") ? 1 : 0
      return Math.floor((cleaned.length * 3) / 4) - padding
    }

    const maxInlineBytes = 6 * 1024 * 1024 // ~6MB
    if (estimateBase64Bytes(videoData) > maxInlineBytes) {
      return NextResponse.json(
        { error: "Video troppo grande. Caricalo manualmente in /public/video e inserisci il percorso." },
        { status: 413 }
      )
    }

    // Salva il video come base64 in Supabase (solo per file piccoli)
    if (supabaseServer) {
      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: `video_${videoId || Date.now()}`,
          value: {
            fileName: fileName,
            videoData: videoData, // Base64
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
        videoUrl: videoData, // Restituisce il base64 per uso immediato
        message: "Video salvato con successo"
      })
    }

    return NextResponse.json(
      { error: "Database non configurato" },
      { status: 500 }
    )
  } catch (error: any) {
    console.error("Error uploading video:", error)
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
