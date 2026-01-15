"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Upload, Plus, Trash2, Edit2, X } from "lucide-react"
import Link from "next/link"

interface Post {
  id: string
  type: "image" | "video"
  mediaUrl: string
  title: string
  description: string
  createdAt: string
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (file: File, type: "image" | "video", callback: (base64: string) => void) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Media = reader.result as string
      callback(base64Media)
    }
    reader.onerror = () => {
      setMessage("Errore durante la lettura del file")
      setTimeout(() => setMessage(""), 3000)
    }
    reader.readAsDataURL(file)
  }

  const savePost = async (post: Post) => {
    setSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post })
      })

      if (response.ok) {
        setMessage("Post salvato con successo!")
        setTimeout(() => setMessage(""), 3000)
        setShowForm(false)
        setEditingPost(null)
        loadPosts()
      } else {
        setMessage("Errore nel salvataggio")
      }
    } catch (error) {
      setMessage("Errore nel salvataggio")
    } finally {
      setSaving(false)
    }
  }

  const deletePost = async (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo post?")) {
      try {
        const response = await fetch("/api/posts", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        })

        if (response.ok) {
          setMessage("Post eliminato con successo")
          setTimeout(() => setMessage(""), 2000)
          loadPosts()
        } else {
          setMessage("Errore nell'eliminazione")
        }
      } catch (error) {
        console.error("Error deleting post:", error)
        setMessage("Errore nell'eliminazione")
      }
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const mediaFile = formData.get("media") as File
    const type = formData.get("type") as "image" | "video"

    if (!mediaFile || !title) {
      setMessage("Titolo e media sono obbligatori")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    handleFileUpload(mediaFile, type, (base64Media) => {
      const post: Post = editingPost || {
        id: Date.now().toString(),
        type,
        mediaUrl: "",
        title: "",
        description: "",
        createdAt: new Date().toISOString()
      }

      const updatedPost: Post = {
        ...post,
        type,
        mediaUrl: base64Media,
        title,
        description,
        createdAt: post.createdAt || new Date().toISOString()
      }

      savePost(updatedPost)
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Caricamento...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Torna al pannello</span>
            </Link>
            <h1 className="text-4xl font-bold mb-2">Post del Giorno</h1>
            <p className="text-muted-foreground">Crea e gestisci i post del giorno con foto o video</p>
          </div>
          <button
            onClick={() => {
              setEditingPost(null)
              setShowForm(true)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuovo Post</span>
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes("successo") ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
          }`}>
            {message}
          </div>
        )}

        {/* Form per creare/modificare post */}
        {showForm && (
          <div className="mb-8 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{editingPost ? "Modifica Post" : "Nuovo Post"}</h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingPost(null)
                }}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Tipo Media</label>
                <select
                  name="type"
                  defaultValue={editingPost?.type || "image"}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  required
                >
                  <option value="image">Foto</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Media (Foto o Video)</label>
                <input
                  type="file"
                  name="media"
                  accept="image/*,video/*"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  required={!editingPost}
                />
                {editingPost?.mediaUrl && (
                  <div className="mt-2">
                    {editingPost.type === "image" ? (
                      <img src={editingPost.mediaUrl} alt="Preview" className="max-w-xs rounded-lg" />
                    ) : (
                      <video src={editingPost.mediaUrl} className="max-w-xs rounded-lg" controls />
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Titolo *</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingPost?.title || ""}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  required
                  placeholder="Titolo del post"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Descrizione</label>
                <textarea
                  name="description"
                  defaultValue={editingPost?.description || ""}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg min-h-[100px]"
                  placeholder="Descrizione del post"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Salvataggio..." : "Salva"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingPost(null)
                  }}
                  className="px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista dei post */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground">Nessun post presente. Clicca su &quot;Nuovo Post&quot; per crearne uno.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-card border border-border rounded-xl p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {post.type === "image" ? (
                      <img
                        src={post.mediaUrl}
                        alt={post.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={post.mediaUrl}
                        className="w-32 h-32 object-cover rounded-lg"
                        controls
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    {post.description && (
                      <p className="text-muted-foreground mb-2">{post.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Creato il: {new Date(post.createdAt).toLocaleDateString("it-IT")}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => {
                        setEditingPost(post)
                        setShowForm(true)
                      }}
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                      title="Modifica"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                      title="Elimina"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
