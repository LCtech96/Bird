import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"

interface Post {
  id: string
  type: "image" | "video"
  mediaUrl: string
  title: string
  description: string
  createdAt: string
}

// GET - Carica i post
export async function GET() {
  try {
    if (supabaseServer) {
      const { data, error } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "daily_posts")
        .single()

      if (!error && data?.value) {
        return NextResponse.json({ posts: data.value || [] })
      }
    }
    
    return NextResponse.json({ posts: [] })
  } catch (error) {
    console.error("Error loading posts:", error)
    return NextResponse.json({ posts: [] })
  }
}

// POST - Salva/aggiorna un post
export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    
    const { post } = await request.json()
    
    if (!post || !post.id || !post.title) {
      return NextResponse.json(
        { error: "Dati post mancanti" },
        { status: 400 }
      )
    }

    if (supabaseServer) {
      // Carica i post esistenti
      const { data: existingData } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "daily_posts")
        .single()

      const existingPosts: Post[] = existingData?.value || []
      
      // Cerca se il post esiste già
      const postIndex = existingPosts.findIndex((p) => p.id === post.id)
      
      let updatedPosts: Post[]
      if (postIndex >= 0) {
        // Aggiorna post esistente
        updatedPosts = [...existingPosts]
        updatedPosts[postIndex] = post
      } else {
        // Aggiungi nuovo post (all'inizio per mostrare i più recenti prima)
        updatedPosts = [post, ...existingPosts]
      }

      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: "daily_posts",
          value: updatedPosts,
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
    
    return NextResponse.json(
      { error: "Database non configurato" },
      { status: 500 }
    )
  } catch (error: any) {
    console.error("Error saving post:", error)
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

// DELETE - Elimina un post
export async function DELETE(request: NextRequest) {
  try {
    await requireAuth()
    
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: "ID post mancante" },
        { status: 400 }
      )
    }

    if (supabaseServer) {
      // Carica i post esistenti
      const { data: existingData } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "daily_posts")
        .single()

      const existingPosts: Post[] = existingData?.value || []
      
      // Rimuovi il post
      const updatedPosts = existingPosts.filter((p) => p.id !== id)

      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: "daily_posts",
          value: updatedPosts,
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
    
    return NextResponse.json(
      { error: "Database non configurato" },
      { status: 500 }
    )
  } catch (error: any) {
    console.error("Error deleting post:", error)
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Errore nell'eliminazione" },
      { status: 500 }
    )
  }
}
