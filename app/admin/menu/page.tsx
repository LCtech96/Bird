"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, Save, Upload, X, Search, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { menuCategoriesFromPublic } from "@/lib/menu-data-from-public"
import { ImageCropper } from "@/components/ImageCropper"

interface Dish {
  name: string
  description: string
  price: string
  image?: string
  visible?: boolean
}

interface Category {
  title: string
  dishes: Dish[]
}

export default function AdminAsportoPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [allCategories, setAllCategories] = useState<Category[]>([]) // Mantiene tutti i dati originali
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [croppingImage, setCroppingImage] = useState<{ image: string; categoryIndex: number; dishIndex: number } | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    loadMenu()
  }, [])

  const loadMenu = async () => {
    try {
      const response = await fetch("/api/menu", { cache: "no-store" })
      if (response.ok) {
        const data = await response.json()
        // Usa i dati salvati dal DB (stesso ordine e immagini della pagina pubblica)
        if (Array.isArray(data) && data.length > 0) {
          setAllCategories(data)
          setCategories(data)
          setExpandedCategories(new Set(data.map((c: Category) => c.title)))
        } else {
          setAllCategories(menuCategoriesFromPublic)
          setCategories(menuCategoriesFromPublic)
          setExpandedCategories(new Set(menuCategoriesFromPublic.map(c => c.title)))
        }
      } else {
        setAllCategories(menuCategoriesFromPublic)
        setCategories(menuCategoriesFromPublic)
        setExpandedCategories(new Set(menuCategoriesFromPublic.map(c => c.title)))
      }
    } catch (error) {
      console.error("Error loading menu:", error)
      setAllCategories(menuCategoriesFromPublic)
      setCategories(menuCategoriesFromPublic)
      setExpandedCategories(new Set(menuCategoriesFromPublic.map(c => c.title)))
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  // Funzione per filtrare le categorie e i piatti in base alla ricerca
  const filterCategories = (query: string) => {
    if (!query.trim()) {
      setCategories(allCategories)
      return
    }

    const searchLower = query.toLowerCase().trim()
    const filtered: Category[] = []

    allCategories.forEach((category) => {
      const categoryTitleLower = category.title.toLowerCase()
      
      // Controlla se la query corrisponde al titolo della categoria
      const matchesCategory = categoryTitleLower.includes(searchLower)
      
      // Filtra i piatti che corrispondono alla query
      const filteredDishes = category.dishes.filter((dish) => {
        const dishNameLower = dish.name.toLowerCase()
        return dishNameLower.includes(searchLower)
      })

      // Se la categoria corrisponde O se ci sono piatti che corrispondono
      if (matchesCategory || filteredDishes.length > 0) {
        filtered.push({
          ...category,
          // Se la query corrisponde alla categoria, mostra tutti i piatti
          // Altrimenti mostra solo i piatti filtrati
          dishes: matchesCategory ? category.dishes : filteredDishes
        })
      }
    })

    setCategories(filtered)
  }

  // Aggiorna il filtro quando cambia la query di ricerca
  useEffect(() => {
    filterCategories(searchQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const saveMenu = async () => {
    setSaving(true)
    setMessage("")
    try {
      // Pulisci i dati prima di salvare: rimuovi blob URLs e percorsi temporanei
      const cleanedCategories = categories.map(category => ({
        ...category,
        dishes: category.dishes.map(dish => {
          // Se l'immagine è un blob URL o un percorso temporaneo che inizia con /dish-, rimuovila
          // Mantieni solo immagini base64 o percorsi validi
          let cleanedImage = dish.image
          if (dish.image) {
            if (dish.image.startsWith('blob:')) {
              // Rimuovi blob URLs - non possono essere salvati
              cleanedImage = undefined
            } else if (dish.image.startsWith('/dish-') && dish.image.includes('-')) {
              // Rimuovi percorsi temporanei generati automaticamente
              cleanedImage = undefined
            }
            // Mantieni solo base64 o percorsi validi che iniziano con / e non sono temporanei
          }
          return {
            ...dish,
            image: cleanedImage
          }
        })
      }))

      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedCategories),
      })

      if (response.ok) {
        // Aggiorna lo stato locale con i dati puliti
        setAllCategories(cleanedCategories)
        setCategories(cleanedCategories)
        setMessage("Menu salvato con successo!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Errore nel salvataggio")
      }
    } catch (error) {
      setMessage("Errore nel salvataggio")
    } finally {
      setSaving(false)
    }
  }

  const updateDish = (categoryIndex: number, dishIndex: number, field: keyof Dish, value: string | boolean) => {
    const newCategories = [...categories]
    const newAllCategories = [...allCategories]
    
    // Trova l'indice originale della categoria in allCategories
    const categoryTitle = newCategories[categoryIndex].title
    const originalCategoryIndex = newAllCategories.findIndex(cat => cat.title === categoryTitle)
    
    if (originalCategoryIndex !== -1) {
      // Trova l'indice originale del piatto
      const dishName = newCategories[categoryIndex].dishes[dishIndex].name
      const originalDishIndex = newAllCategories[originalCategoryIndex].dishes.findIndex(
        d => d.name === dishName
      )
      
      if (originalDishIndex !== -1) {
        // Aggiorna anche in allCategories
        newAllCategories[originalCategoryIndex].dishes[originalDishIndex] = {
          ...newAllCategories[originalCategoryIndex].dishes[originalDishIndex],
          [field]: value,
        }
      }
    }
    
    // Aggiorna in categories
    newCategories[categoryIndex].dishes[dishIndex] = {
      ...newCategories[categoryIndex].dishes[dishIndex],
      [field]: value,
    }
    
    setAllCategories(newAllCategories)
    setCategories(newCategories)
  }

  const addDish = (categoryIndex: number) => {
    const newCategories = [...categories]
    const newAllCategories = [...allCategories]
    
    const newDish = {
      name: "Nuovo Piatto",
      description: "",
      price: "€0.00",
      visible: true,
    }
    
    newCategories[categoryIndex].dishes.push(newDish)
    
    // Trova e aggiorna anche in allCategories
    const categoryTitle = newCategories[categoryIndex].title
    const originalCategoryIndex = newAllCategories.findIndex(cat => cat.title === categoryTitle)
    if (originalCategoryIndex !== -1) {
      newAllCategories[originalCategoryIndex].dishes.push(newDish)
    }
    
    setAllCategories(newAllCategories)
    setCategories(newCategories)
  }

  const removeDish = (categoryIndex: number, dishIndex: number) => {
    if (confirm("Vuoi rimuovere questo piatto?")) {
      const newCategories = [...categories]
      const newAllCategories = [...allCategories]
      
      const dishName = newCategories[categoryIndex].dishes[dishIndex].name
      newCategories[categoryIndex].dishes.splice(dishIndex, 1)
      
      // Rimuovi anche da allCategories
      const categoryTitle = newCategories[categoryIndex].title
      const originalCategoryIndex = newAllCategories.findIndex(cat => cat.title === categoryTitle)
      if (originalCategoryIndex !== -1) {
        const originalDishIndex = newAllCategories[originalCategoryIndex].dishes.findIndex(
          d => d.name === dishName
        )
        if (originalDishIndex !== -1) {
          newAllCategories[originalCategoryIndex].dishes.splice(originalDishIndex, 1)
        }
      }
      
      setAllCategories(newAllCategories)
      setCategories(newCategories)
    }
  }

  const removeCategory = (categoryIndex: number) => {
    if (confirm("Vuoi rimuovere questa categoria e tutti i suoi piatti?")) {
      const categoryTitle = categories[categoryIndex].title
      const newCategories = categories.filter((_, index) => index !== categoryIndex)
      const newAllCategories = allCategories.filter(cat => cat.title !== categoryTitle)
      setAllCategories(newAllCategories)
      setCategories(newCategories)
    }
  }

  const toggleVisibility = (categoryIndex: number, dishIndex: number) => {
    const newCategories = [...categories]
    const newAllCategories = [...allCategories]
    
    const dish = newCategories[categoryIndex].dishes[dishIndex]
    dish.visible = !dish.visible
    
    // Aggiorna anche in allCategories
    const categoryTitle = newCategories[categoryIndex].title
    const originalCategoryIndex = newAllCategories.findIndex(cat => cat.title === categoryTitle)
    if (originalCategoryIndex !== -1) {
      const dishName = dish.name
      const originalDishIndex = newAllCategories[originalCategoryIndex].dishes.findIndex(
        d => d.name === dishName
      )
      if (originalDishIndex !== -1) {
        newAllCategories[originalCategoryIndex].dishes[originalDishIndex].visible = dish.visible
      }
    }
    
    setAllCategories(newAllCategories)
    setCategories(newCategories)
  }

  const handleImageUpload = async (categoryIndex: number, dishIndex: number, file: File) => {
    // Verifica che sia un'immagine
    if (!file.type.startsWith("image/")) {
      setMessage("Il file deve essere un'immagine")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    // Verifica la dimensione del file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("L'immagine deve essere inferiore a 5MB")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    // Leggi il file e mostra il cropper
    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string
        // Mostra il cropper con l'immagine caricata
        setCroppingImage({
          image: imageDataUrl,
          categoryIndex,
          dishIndex
        })
      }
      reader.onerror = () => {
        setMessage("Errore durante la lettura del file")
        setTimeout(() => setMessage(""), 5000)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error reading image:", error)
      setMessage("Errore durante la lettura del file")
      setTimeout(() => setMessage(""), 5000)
    }
  }

  const handleCropComplete = (croppedImage: string) => {
    if (!croppingImage) return

    const { categoryIndex, dishIndex } = croppingImage
    
    // Salva l'immagine ritagliata
    updateDish(categoryIndex, dishIndex, "image", croppedImage)
    setMessage("Immagine ritagliata e caricata con successo!")
    setTimeout(() => setMessage(""), 3000)
    
    // Chiudi il cropper
    setCroppingImage(null)
  }

  const handleCropCancel = () => {
    setCroppingImage(null)
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
            <h1 className="text-4xl font-bold mb-2">Gestione Menù</h1>
            <p className="text-muted-foreground">Modifica piatti, prezzi, descrizioni e immagini</p>
          </div>
          <button
            onClick={saveMenu}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Salvataggio..." : "Salva"}</span>
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes("successo") ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
          }`}>
            {message}
          </div>
        )}

        {/* Barra di ricerca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca per categoria (es. 'primi di pesce') o nome piatto (es. 'spaghetti')..."
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-accent rounded"
                title="Pulisci ricerca"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-muted-foreground">
              {categories.length === 0 
                ? "Nessun risultato trovato" 
                : categories.length === 1 && categories[0].dishes.length === 1
                ? `1 risultato trovato`
                : `${categories.reduce((acc, cat) => acc + cat.dishes.length, 0)} risultati trovati`}
            </p>
          )}
        </div>

        <div className="space-y-8">
          {categories.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-muted-foreground mb-4">Nessuna categoria presente. Aggiungi la prima categoria per iniziare.</p>
              <button
                onClick={() => {
                  setCategories([{ title: "Nuova Categoria", dishes: [] }])
                }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Aggiungi Prima Categoria
              </button>
            </div>
          )}
          {categories.map((category, categoryIndex) => {
            const isExpanded = expandedCategories.has(category.title)
            return (
            <div key={category.title + categoryIndex} className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Intestazione macrocategoria (click per aprire/chiudere) */}
              <div className="flex items-center gap-2 p-4">
                <button
                  type="button"
                  onClick={() => toggleCategory(category.title)}
                  className="flex-1 flex items-center justify-between hover:bg-accent/50 rounded-lg transition-colors text-left min-w-0"
                  aria-expanded={isExpanded}
                >
                  <input
                    type="text"
                    value={category.title}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const newCategories = [...categories]
                      const newAllCategories = [...allCategories]
                      const oldTitle = newCategories[categoryIndex].title
                      newCategories[categoryIndex].title = e.target.value
                      const originalCategoryIndex = newAllCategories.findIndex(cat => cat.title === oldTitle)
                      if (originalCategoryIndex !== -1) {
                        newAllCategories[originalCategoryIndex].title = e.target.value
                      }
                      setAllCategories(newAllCategories)
                      setCategories(newCategories)
                      setExpandedCategories(prev => {
                        const next = new Set(prev)
                        next.delete(oldTitle)
                        next.add(e.target.value)
                        return next
                      })
                    }}
                    className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 flex-1 min-w-0 py-1"
                  />
                  <span className="flex-shrink-0 text-muted-foreground ml-2">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); removeCategory(categoryIndex) }}
                  className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors flex-shrink-0"
                  title="Rimuovi categoria"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Piatti (visibili quando la categoria è aperta) */}
              {isExpanded && (
              <div className="border-t border-border p-4 md:p-6 space-y-4">
                {category.dishes.map((dish, dishIndex) => (
                  <div
                    key={dishIndex}
                    className={`p-4 rounded-lg border ${
                      dish.visible !== false ? "border-border" : "border-destructive/50 bg-destructive/5"
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Immagine */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Immagine</label>
                        <label className="relative block w-full aspect-square max-w-[120px] rounded-lg border border-border bg-muted/50 overflow-hidden cursor-pointer group">
                          {dish.image && (dish.image.startsWith("data:image") || dish.image.startsWith("blob:")) ? (
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                const el = e.target as HTMLImageElement
                                el.style.display = "none"
                                const ph = el.nextElementSibling
                                if (ph) (ph as HTMLElement).style.display = "flex"
                              }}
                            />
                          ) : dish.image ? (
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                const el = e.target as HTMLImageElement
                                el.style.display = "none"
                                const ph = el.nextElementSibling
                                if (ph) (ph as HTMLElement).style.display = "flex"
                              }}
                            />
                          ) : null}
                          <div
                            className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-1 bg-muted/50 rounded-lg"
                            style={{ display: dish.image ? "none" : "flex" }}
                          >
                            <Upload className="w-6 h-6" />
                            <span className="text-xs">Carica</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(categoryIndex, dishIndex, file)
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </label>
                      </div>

                      {/* Nome */}
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium mb-2">Nome</label>
                        <input
                          type="text"
                          value={dish.name}
                          onChange={(e) => updateDish(categoryIndex, dishIndex, "name", e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                        />
                      </div>

                      {/* Descrizione */}
                      <div className="md:col-span-4">
                        <label className="block text-sm font-medium mb-2">Descrizione</label>
                        <input
                          type="text"
                          value={dish.description}
                          onChange={(e) => updateDish(categoryIndex, dishIndex, "description", e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                        />
                      </div>

                      {/* Prezzo */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Prezzo</label>
                        <input
                          type="text"
                          value={dish.price}
                          onChange={(e) => updateDish(categoryIndex, dishIndex, "price", e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                          placeholder="€0.00"
                        />
                      </div>

                      {/* Azioni */}
                      <div className="md:col-span-1 flex items-end gap-2">
                        <button
                          onClick={() => toggleVisibility(categoryIndex, dishIndex)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title={dish.visible !== false ? "Nascondi" : "Mostra"}
                        >
                          {dish.visible !== false ? (
                            <Eye className="w-5 h-5" />
                          ) : (
                            <EyeOff className="w-5 h-5 text-destructive" />
                          )}
                        </button>
                <button
                  onClick={() => removeDish(categoryIndex, dishIndex)}
                  className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                  title="Rimuovi"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => addDish(categoryIndex)}
                  className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:bg-accent/50 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Aggiungi Piatto</span>
                </button>
              </div>
              )}
            </div>
          )
          })}
          
          {!searchQuery && (
            <button
              onClick={() => {
                const newCategory = { title: "Nuova Categoria", dishes: [] }
                setAllCategories([...allCategories, newCategory])
                setCategories([...categories, newCategory])
              }}
              className="w-full py-4 border-2 border-dashed border-border rounded-xl hover:bg-accent/50 transition-colors flex items-center justify-center gap-2 text-lg"
            >
              <Plus className="w-6 h-6" />
              <span>Aggiungi Categoria</span>
            </button>
          )}
        </div>
      </div>

      {/* Image Cropper Modal */}
      {croppingImage && (
        <ImageCropper
          image={croppingImage.image}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={1} // Quadrato per le immagini dei piatti
          cropShape="rect"
        />
      )}
    </main>
  )
}

