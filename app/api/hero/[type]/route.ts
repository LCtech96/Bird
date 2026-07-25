import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

/**
 * Serve cover/profile come file immagine (non base64 nel JSON).
 */
export async function GET(
  _request: NextRequest,
  context: { params: { type: string } }
) {
  try {
    const { type } = context.params
    if (type !== "cover" && type !== "profile") {
      return NextResponse.json({ error: "Tipo non valido" }, { status: 400 })
    }

    if (!supabaseServer) {
      return new NextResponse(null, { status: 404 })
    }

    const key = `hero_${type}_image`
    const { data, error } = await supabaseServer
      .from("admin_data")
      .select("value")
      .eq("key", key)
      .single()

    let imageData: string | undefined = data?.value?.imageData

    if (error || !imageData) {
      const { data: contentData } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "content")
        .single()
      const field = type === "cover" ? "coverImage" : "profileImage"
      imageData = contentData?.value?.[field]
    }

    if (!imageData || typeof imageData !== "string") {
      return new NextResponse(null, { status: 404 })
    }

    let mime = "image/jpeg"
    let b64 = imageData
    const match = imageData.match(/^data:([^;]+);base64,([\s\S]+)$/)
    if (match) {
      mime = match[1] || mime
      b64 = match[2]
    }

    const buffer = Buffer.from(b64, "base64")
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Content-Length": String(buffer.length),
      },
    })
  } catch (e) {
    console.error("Error serving hero image:", e)
    return new NextResponse(null, { status: 500 })
  }
}
