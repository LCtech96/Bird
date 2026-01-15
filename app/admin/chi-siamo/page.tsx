"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Trash2, Plus, Eye, EyeOff, Upload } from "lucide-react"
import Image from "next/image"

interface TeamMember {
  id: number
  image: string
  title: string
  description: string
  layout: "left" | "right"
  visible?: boolean
}

export default function AdminChiSiamoPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadTeamMembers()
  }, [])

  const loadTeamMembers = async () => {
    try {
      const response = await fetch("/api/chi-siamo", {
        cache: "no-store"
      })
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data || [])
      }
    } catch (error) {
      console.error("Error loading team members:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      // Pulisci i percorsi hardcoded prima di salvare - mantieni solo base64 o stringa vuota
      const cleanedMembers = teamMembers.map(member => ({
        ...member,
        // Se l'immagine è un percorso hardcoded (inizia con / ma non è base64), rimuovilo
        image: member.image && member.image.startsWith("/") && !member.image.startsWith("data:image") 
          ? "" 
          : member.image
      }))
      
      const response = await fetch("/api/chi-siamo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedMembers),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Modifiche salvate con successo!" })
        setTimeout(() => setMessage(null), 3000)
      } else {
        const error = await response.json()
        setMessage({ type: "error", text: error.error || "Errore nel salvataggio" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Errore nel salvataggio" })
    } finally {
      setSaving(false)
    }
  }

  const updateMember = (index: number, field: keyof TeamMember, value: any) => {
    const updated = [...teamMembers]
    updated[index] = { ...updated[index], [field]: value }
    setTeamMembers(updated)
  }

  const deleteMember = (index: number) => {
    if (confirm("Sei sicuro di voler eliminare questo membro del team?")) {
      const updated = teamMembers.filter((_, i) => i !== index)
      setTeamMembers(updated)
    }
  }

  const toggleVisibility = (index: number) => {
    const updated = [...teamMembers]
    updated[index] = { ...updated[index], visible: !updated[index].visible }
    setTeamMembers(updated)
  }

  const addMember = () => {
    const newMember: TeamMember = {
      id: Date.now(),
      image: "",
      title: "",
      description: "",
      layout: "left",
      visible: true
    }
    setTeamMembers([...teamMembers, newMember])
  }

  // Funzione per ridimensionare e comprimere l'immagine
  const resizeAndCompressImage = (file: File, maxWidth: number = 1200, quality: number = 0.85): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new window.Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Calcola le nuove dimensioni mantenendo l'aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxWidth) {
              width = (width * maxWidth) / height
              height = maxWidth
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Impossibile ottenere il contesto del canvas'))
            return
          }

          // Disegna l'immagine ridimensionata sul canvas
          ctx.drawImage(img, 0, 0, width, height)

          // Converti in base64 con compressione JPEG
          const base64 = canvas.toDataURL('image/jpeg', quality)
          resolve(base64)
        }
        img.onerror = () => reject(new Error('Errore nel caricamento dell\'immagine'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Errore nella lettura del file'))
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verifica che sia un'immagine
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Il file deve essere un&apos;immagine" })
      return
    }

    // Crea un URL temporaneo per l'anteprima immediata
    const previewUrl = URL.createObjectURL(file)
    
    // Aggiorna immediatamente con l'anteprima
    const updated = [...teamMembers]
    updated[index] = { ...updated[index], image: previewUrl }
    setTeamMembers(updated)

    try {
      setMessage({ type: "success", text: "Elaborazione immagine in corso..." })
      
      // Ridimensiona e comprimi l'immagine
      const base64Image = await resizeAndCompressImage(file)
      
      // Genera un nome file univoco per riferimento
      const fileName = `team-${teamMembers[index].id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      
      // Salva i dati dell'immagine in Supabase come base64
      const response = await fetch("/api/upload/chi-siamo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: teamMembers[index].id.toString(),
          fileName: fileName,
          imageData: base64Image, // Sempre base64, mai percorso
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Aggiorna sempre con base64 (mai percorsi hardcoded)
        updated[index] = { ...updated[index], image: data.imageUrl || base64Image }
        setTeamMembers(updated)
        setMessage({ type: "success", text: "Immagine caricata e ottimizzata con successo!" })
        setTimeout(() => setMessage(null), 3000)
      } else {
        // Se l'upload fallisce, usa comunque il base64 direttamente
        updated[index] = { ...updated[index], image: base64Image }
        setTeamMembers(updated)
        setMessage({ 
          type: "success", 
          text: "Immagine ottimizzata e caricata localmente. Ricorda di salvare le modifiche." 
        })
        setTimeout(() => setMessage(null), 5000)
      }
      
      // Rilascia l'URL temporaneo dopo un breve delay
      setTimeout(() => {
        URL.revokeObjectURL(previewUrl)
      }, 500)
    } catch (error) {
      console.error("Error processing image:", error)
      setMessage({ 
        type: "error", 
        text: "Errore durante l&apos;elaborazione dell&apos;immagine. Riprova." 
      })
      setTimeout(() => setMessage(null), 5000)
      // Mantieni il blob URL temporaneo invece di usare un percorso hardcoded
    }
    
    // Reset dell'input file per permettere di ricaricare la stessa immagine
    e.target.value = ""
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
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin")}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-4xl font-bold mb-2">Gestione Chi Siamo</h1>
              <p className="text-muted-foreground">Modifica immagini, titoli e descrizioni dei membri del team</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? "Salvataggio..." : "Salva"}</span>
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-red-500/20 text-red-400 border border-red-500/50"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Add Member Button */}
        <div className="mb-6">
          <button
            onClick={addMember}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Aggiungi Membro</span>
          </button>
        </div>

        {/* Team Members */}
        <div className="space-y-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">Membro #{index + 1}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisibility(index)}
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    title={member.visible !== false ? "Nascondi" : "Mostra"}
                  >
                    {member.visible !== false ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteMember(index)}
                    className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                    title="Elimina"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Immagine</label>
                  <div className="relative aspect-square max-w-xs rounded-lg overflow-hidden border border-border group cursor-pointer">
                    {member.image ? (
                      <>
                        {member.image.startsWith("data:image") ? (
                          // Se è base64, usa img normale
                          <img
                            src={member.image}
                            alt={member.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          // Se è un percorso URL, usa Next.js Image
                          <Image
                            src={member.image}
                            alt={member.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            unoptimized={member.image.startsWith("/")}
                          />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">Clicca per cambiare</span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-sm">Nessuna immagine</span>
                        <span className="text-xs mt-1">Clicca per caricare</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Clicca sull&apos;immagine per caricare un nuovo file. Le immagini vengono automaticamente ridimensionate e ottimizzate.
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {/* Layout */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Layout</label>
                    <select
                      value={member.layout}
                      onChange={(e) => updateMember(index, "layout", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    >
                      <option value="left">Immagine a sinistra</option>
                      <option value="right">Immagine a destra</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Titolo</label>
                    <input
                      type="text"
                      value={member.title}
                      onChange={(e) => updateMember(index, "title", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                      placeholder="Titolo del membro"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Descrizione</label>
                    <textarea
                      value={member.description}
                      onChange={(e) => updateMember(index, "description", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg min-h-[120px]"
                      placeholder="Descrizione del membro"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {teamMembers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nessun membro del team presente. Clicca su &quot;Aggiungi Membro&quot; per iniziare.</p>
          </div>
        )}
      </div>
    </main>
  )
}

