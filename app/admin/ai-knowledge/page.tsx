"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, Trash2, X } from "lucide-react"
import Link from "next/link"

interface AIKnowledge {
  openingHours: string
  closingDays: string[]
  holidays: Array<{ date: string; description: string }>
  events: Array<{ date: string; description: string }>
  additionalInfo: string
}

export default function AdminAIKnowledgePage() {
  const [knowledge, setKnowledge] = useState<AIKnowledge>({
    openingHours: "07:00 - 01:00",
    closingDays: [],
    holidays: [],
    events: [],
    additionalInfo: ""
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [showClosingDayModal, setShowClosingDayModal] = useState(false)
  const [showHolidayModal, setShowHolidayModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [newClosingDay, setNewClosingDay] = useState("")
  const [newHoliday, setNewHoliday] = useState({ date: "", description: "" })
  const [newEvent, setNewEvent] = useState({ date: "", description: "" })
  const router = useRouter()

  useEffect(() => {
    loadKnowledge()
  }, [])

  const loadKnowledge = async () => {
    try {
      const response = await fetch("/api/ai-knowledge")
      if (response.ok) {
        const data = await response.json()
        setKnowledge(data)
      }
    } catch (error) {
      console.error("Error loading knowledge:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveKnowledge = async () => {
    setSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/ai-knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(knowledge),
      })

      if (response.ok) {
        setMessage("Conoscenza AI salvata con successo!")
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

  const handleAddClosingDay = () => {
    if (newClosingDay.trim()) {
      setKnowledge({
        ...knowledge,
        closingDays: [...knowledge.closingDays, newClosingDay.trim()]
      })
      setNewClosingDay("")
      setShowClosingDayModal(false)
    }
  }

  const handleAddHoliday = () => {
    if (newHoliday.date && newHoliday.description.trim()) {
      setKnowledge({
        ...knowledge,
        holidays: [...knowledge.holidays, { ...newHoliday, description: newHoliday.description.trim() }]
      })
      setNewHoliday({ date: "", description: "" })
      setShowHolidayModal(false)
    }
  }

  const handleAddEvent = () => {
    if (newEvent.date && newEvent.description.trim()) {
      setKnowledge({
        ...knowledge,
        events: [...knowledge.events, { ...newEvent, description: newEvent.description.trim() }]
      })
      setNewEvent({ date: "", description: "" })
      setShowEventModal(false)
    }
  }

  const addHoliday = () => {
    setShowHolidayModal(true)
  }

  const removeHoliday = (index: number) => {
    const newHolidays = knowledge.holidays.filter((_, i) => i !== index)
    setKnowledge({ ...knowledge, holidays: newHolidays })
  }

  const updateHoliday = (index: number, field: "date" | "description", value: string) => {
    const newHolidays = [...knowledge.holidays]
    newHolidays[index] = { ...newHolidays[index], [field]: value }
    setKnowledge({ ...knowledge, holidays: newHolidays })
  }

  const addEvent = () => {
    setShowEventModal(true)
  }

  const removeEvent = (index: number) => {
    const newEvents = knowledge.events.filter((_, i) => i !== index)
    setKnowledge({ ...knowledge, events: newEvents })
  }

  const updateEvent = (index: number, field: "date" | "description", value: string) => {
    const newEvents = [...knowledge.events]
    newEvents[index] = { ...newEvents[index], [field]: value }
    setKnowledge({ ...knowledge, events: newEvents })
  }

  const addClosingDay = () => {
    setShowClosingDayModal(true)
  }

  const removeClosingDay = (index: number) => {
    const newClosingDays = knowledge.closingDays.filter((_, i) => i !== index)
    setKnowledge({ ...knowledge, closingDays: newClosingDays })
  }

  const updateClosingDay = (index: number, value: string) => {
    const newClosingDays = [...knowledge.closingDays]
    newClosingDays[index] = value
    setKnowledge({ ...knowledge, closingDays: newClosingDays })
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Torna al pannello</span>
            </Link>
            <h1 className="text-4xl font-bold mb-2">Conoscenza AI</h1>
            <p className="text-muted-foreground">Aggiorna orari, festività, eventi e informazioni per l&apos;assistente AI</p>
          </div>
          <button
            onClick={saveKnowledge}
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

        <div className="space-y-6">
          {/* Orari di apertura */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Orari di Apertura</h2>
            <input
              type="text"
              value={knowledge.openingHours}
              onChange={(e) => setKnowledge({ ...knowledge, openingHours: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg"
              placeholder="07:00 - 01:00"
            />
          </div>

          {/* Giorni di chiusura */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Giorni di Chiusura</h2>
              <button
                onClick={addClosingDay}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi</span>
              </button>
            </div>
            <div className="space-y-2">
              {knowledge.closingDays.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nessun giorno di chiusura aggiunto</p>
              ) : (
                knowledge.closingDays.map((day, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={day}
                      onChange={(e) => updateClosingDay(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg"
                      placeholder="Es: Lunedì"
                    />
                    <button
                      onClick={() => removeClosingDay(index)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Festività */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Festività</h2>
              <button
                onClick={addHoliday}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi</span>
              </button>
            </div>
            <div className="space-y-4">
              {knowledge.holidays.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nessuna festività aggiunta</p>
              ) : (
                knowledge.holidays.map((holiday, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="date"
                      value={holiday.date}
                      onChange={(e) => updateHoliday(index, "date", e.target.value)}
                      className="px-4 py-2 bg-background border border-border rounded-lg"
                    />
                    <input
                      type="text"
                      value={holiday.description}
                      onChange={(e) => updateHoliday(index, "description", e.target.value)}
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg"
                      placeholder="Descrizione festività"
                    />
                    <button
                      onClick={() => removeHoliday(index)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Eventi */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Eventi Speciali</h2>
              <button
                onClick={addEvent}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi</span>
              </button>
            </div>
            <div className="space-y-4">
              {knowledge.events.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nessun evento speciale aggiunto</p>
              ) : (
                knowledge.events.map((event, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="date"
                      value={event.date}
                      onChange={(e) => updateEvent(index, "date", e.target.value)}
                      className="px-4 py-2 bg-background border border-border rounded-lg"
                    />
                    <input
                      type="text"
                      value={event.description}
                      onChange={(e) => updateEvent(index, "description", e.target.value)}
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg"
                      placeholder="Descrizione evento"
                    />
                    <button
                      onClick={() => removeEvent(index)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Informazioni aggiuntive */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Informazioni Aggiuntive</h2>
            <textarea
              value={knowledge.additionalInfo}
              onChange={(e) => setKnowledge({ ...knowledge, additionalInfo: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg min-h-[200px]"
              placeholder="Aggiungi altre informazioni che l'AI dovrebbe conoscere..."
            />
          </div>
        </div>
      </div>

      {/* Modal Giorni di Chiusura */}
      {showClosingDayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Aggiungi Giorno di Chiusura</h2>
              <button
                onClick={() => {
                  setShowClosingDayModal(false)
                  setNewClosingDay("")
                }}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Giorno</label>
                <input
                  type="text"
                  value={newClosingDay}
                  onChange={(e) => setNewClosingDay(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  placeholder="Es: Lunedì, Martedì, ecc."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddClosingDay()
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowClosingDayModal(false)
                    setNewClosingDay("")
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleAddClosingDay}
                  disabled={!newClosingDay.trim()}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Aggiungi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Festività */}
      {showHolidayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Aggiungi Festività</h2>
              <button
                onClick={() => {
                  setShowHolidayModal(false)
                  setNewHoliday({ date: "", description: "" })
                }}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Data</label>
                <input
                  type="date"
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrizione</label>
                <input
                  type="text"
                  value={newHoliday.description}
                  onChange={(e) => setNewHoliday({ ...newHoliday, description: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  placeholder="Es: Natale, Capodanno, ecc."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newHoliday.date && newHoliday.description.trim()) {
                      handleAddHoliday()
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowHolidayModal(false)
                    setNewHoliday({ date: "", description: "" })
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleAddHoliday}
                  disabled={!newHoliday.date || !newHoliday.description.trim()}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Aggiungi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eventi Speciali */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Aggiungi Evento Speciale</h2>
              <button
                onClick={() => {
                  setShowEventModal(false)
                  setNewEvent({ date: "", description: "" })
                }}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Data</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrizione</label>
                <input
                  type="text"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  placeholder="Es: Serata speciale, Evento live, ecc."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newEvent.date && newEvent.description.trim()) {
                      handleAddEvent()
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowEventModal(false)
                    setNewEvent({ date: "", description: "" })
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleAddEvent}
                  disabled={!newEvent.date || !newEvent.description.trim()}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Aggiungi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

