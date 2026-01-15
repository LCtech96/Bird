"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Trash2, Save, MessageSquare } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AIKnowledge {
  openingHours: string
  closingDays: string[]
  holidays: Array<{ date: string; description: string }>
  events: Array<{ date: string; description: string }>
  additionalInfo: string
}

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

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Ciao! 👋 Sono l'assistente del Ristorante Barinello. Come posso aiutarti oggi?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasBookingInterest, setHasBookingInterest] = useState(false)
  const [aiKnowledge, setAiKnowledge] = useState<AIKnowledge>({
    openingHours: "07:00 - 01:00",
    closingDays: [],
    holidays: [],
    events: [],
    additionalInfo: ""
  })
  const [menuCategories, setMenuCategories] = useState<Category[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Carica le informazioni dall'admin e il menu al mount
  useEffect(() => {
    const loadData = async () => {
      // Carica AI Knowledge
      try {
        const response = await fetch("/api/ai-knowledge")
        if (response.ok) {
          const data = await response.json()
          setAiKnowledge(data)
        }
      } catch (error) {
        console.error("Error loading AI knowledge:", error)
      }

      // Carica Menu
      try {
        const menuResponse = await fetch("/api/menu")
        if (menuResponse.ok) {
          const menuData = await menuResponse.json()
          if (menuData && Array.isArray(menuData) && menuData.length > 0) {
            setMenuCategories(menuData)
          } else {
            // Usa dati di default se non ci sono dati salvati
            const { defaultMenuCategories } = await import("@/lib/menu-data-default")
            setMenuCategories(defaultMenuCategories)
          }
        } else {
          // Usa dati di default in caso di errore
          const { defaultMenuCategories } = await import("@/lib/menu-data-default")
          setMenuCategories(defaultMenuCategories)
        }
      } catch (error) {
        console.error("Error loading menu:", error)
        // Usa dati di default in caso di errore
        const { defaultMenuCategories } = await import("@/lib/menu-data-default")
        setMenuCategories(defaultMenuCategories)
      }
    }
    loadData()
  }, [])

  // Funzione per trovare una categoria nel menu
  const findCategory = (searchTerms: string[]): Category | null => {
    for (const category of menuCategories) {
      const categoryTitle = category.title.toLowerCase()
      if (searchTerms.some(term => categoryTitle.includes(term))) {
        return category
      }
    }
    return null
  }

  // Funzione per formattare una lista di piatti
  const formatDishesList = (dishes: Dish[]): string => {
    return dishes
      .filter(dish => dish.visible !== false)
      .map(dish => {
        let dishText = `• ${dish.name}`
        if (dish.description) {
          dishText += ` - ${dish.description}`
        }
        dishText += ` | ${dish.price}`
        return dishText
      })
      .join("\n")
  }

  // Funzione per generare risposte hardcoded
  const getHardcodedResponse = (userMessage: string, knowledge: AIKnowledge, menu: Category[]): { message: string; hasBookingInterest: boolean } => {
    const message = userMessage.toLowerCase().trim()
    
    // Saluti
    if (message.match(/^(ciao|salve|buongiorno|buonasera|buon pomeriggio|hey|hi)$/)) {
      return {
        message: "Ciao! 👋 Benvenuto al Ristorante Barinello. Come posso aiutarti?",
        hasBookingInterest: false
      }
    }
    
    // Orari
    if (message.includes("orari") || message.includes("orario") || message.includes("aperto") || message.includes("chiuso") || message.includes("siete aperti") || message.includes("aprite") || message.includes("chiudete")) {
      const openingHours = knowledge.openingHours || "07:00 - 01:00"
      const now = new Date()
      const hour = now.getHours()
      const minute = now.getMinutes()
      const currentTime = hour * 60 + minute
      
      // Parse orari (formato: "07:00 - 01:00" o simile)
      const [openTime, closeTime] = openingHours.split(" - ").map(time => {
        const [h, m] = time.split(":").map(Number)
        return h * 60 + (m || 0)
      })
      
      // Se l'orario di chiusura è minore di quello di apertura, significa che chiude il giorno dopo
      const isOpen = closeTime < openTime 
        ? (currentTime >= openTime || currentTime < closeTime)
        : (currentTime >= openTime && currentTime < closeTime)
      
      // Verifica giorni di chiusura
      const today = now.toLocaleDateString("it-IT", { weekday: "long" }).toLowerCase()
      const isClosingDay = knowledge.closingDays?.some(day => day.toLowerCase() === today)
      
      // Verifica festività (formato: "DD/MM" o "DD-MM" o "YYYY-MM-DD")
      const todayStr = now.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" })
      const todayFullStr = now.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })
      const isHoliday = knowledge.holidays?.some(h => {
        const holidayDate = h.date.replace(/-/g, "/")
        return holidayDate.includes(todayStr) || holidayDate === todayFullStr
      })
      
      // Verifica eventi speciali
      const hasEvent = knowledge.events?.some(e => {
        const eventDate = e.date.replace(/-/g, "/")
        return eventDate.includes(todayStr) || eventDate === todayFullStr
      })
      const todayEvent = knowledge.events?.find(e => {
        const eventDate = e.date.replace(/-/g, "/")
        return eventDate.includes(todayStr) || eventDate === todayFullStr
      })
      
      let statusMessage = ""
      if (isClosingDay || isHoliday) {
        const reason = isClosingDay ? "giorno di chiusura settimanale" : "festività"
        statusMessage = `Oggi siamo chiusi (${reason}). `
      } else if (isOpen) {
        statusMessage = "Siamo aperti! 🕐 "
      } else {
        statusMessage = "Al momento siamo chiusi. "
      }
      
      const hoursMessage = `Siamo aperti dalle ${openingHours.split(" - ")[0]} alle ${openingHours.split(" - ")[1]} del mattino successivo.`
      
      let eventMessage = ""
      if (hasEvent && todayEvent) {
        eventMessage = `\n\n📅 Evento di oggi: ${todayEvent.description}`
      }
      
      return {
        message: statusMessage + hoursMessage + eventMessage,
        hasBookingInterest: false
      }
    }
    
    // Chiusura cucina
    if (message.includes("cucina") && (message.includes("chiude") || message.includes("chiusura") || message.includes("orario"))) {
      // Cerca informazioni sulla cucina nelle informazioni aggiuntive
      if (knowledge.additionalInfo && knowledge.additionalInfo.toLowerCase().includes("cucina")) {
        // Estrai la parte relativa alla cucina dalle informazioni aggiuntive
        const additionalInfoLower = knowledge.additionalInfo.toLowerCase()
        const cucinaIndex = additionalInfoLower.indexOf("cucina")
        if (cucinaIndex !== -1) {
          // Prova a estrarre una frase completa che contiene "cucina"
          const start = Math.max(0, cucinaIndex - 50)
          const end = Math.min(knowledge.additionalInfo.length, cucinaIndex + 200)
          const cucinaInfo = knowledge.additionalInfo.substring(start, end)
          
          // Se contiene informazioni sulla cucina, usale
          if (cucinaInfo.length > 20) {
            return {
              message: cucinaInfo.trim(),
              hasBookingInterest: false
            }
          }
        }
      }
      
      // Default: determina stagione e rispondi di conseguenza
      const now = new Date()
      const month = now.getMonth() + 1 // 1-12
      // Estate: giugno, luglio, agosto, settembre (6-9)
      // Inverno: ottobre, novembre, dicembre, gennaio, febbraio, marzo, aprile, maggio (10-12, 1-5)
      const isSummer = month >= 6 && month <= 9
      
      if (isSummer) {
        return {
          message: "La cucina chiude fino alla chiusura del ristorante (01:00 del mattino successivo) durante il periodo estivo. 🍽️",
          hasBookingInterest: false
        }
      } else {
        return {
          message: "La cucina chiude intorno alle 23:00 durante il periodo invernale. 🍽️",
          hasBookingInterest: false
        }
      }
    }
    
    // Che giorno è oggi
    if (message.includes("giorno") && (message.includes("oggi") || message.includes("è") || message.includes("sono"))) {
      const now = new Date()
      const date = now.toLocaleDateString("it-IT", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
      return {
        message: `Oggi è ${date}. 📅`,
        hasBookingInterest: false
      }
    }
    
    // Che ore sono
    if (message.includes("ore") && (message.includes("sono") || message.includes("è"))) {
      const now = new Date()
      const time = now.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
      return {
        message: `Sono le ${time}. 🕐`,
        hasBookingInterest: false
      }
    }
    
    // Data e ora insieme
    if (message.includes("data") && message.includes("ora") || (message.includes("quando") && message.includes("ora"))) {
      const now = new Date()
      const date = now.toLocaleDateString("it-IT", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
      const time = now.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
      return {
        message: `Oggi è ${date}, sono le ${time}. 📅🕐`,
        hasBookingInterest: false
      }
    }
    
    // Prenotazioni
    if (message.includes("prenot") || message.includes("tavolo") || message.includes("disponibil") || message.includes("posto")) {
      return {
        message: "Per prenotare un tavolo, puoi contattarci via WhatsApp! 📱 Ti risponderemo il prima possibile.",
        hasBookingInterest: true
      }
    }
    
    // Primi piatti
    if (message.includes("primi") && (message.includes("avete") || message.includes("avete") || message.includes("c'è") || message.includes("avete") || message.includes("list"))) {
      const primiMare = findCategory(["primi", "mare"])
      const primiCarne = findCategory(["primi", "carne"])
      
      let response = "Ecco i nostri primi piatti:\n\n"
      
      if (primiMare && primiMare.dishes.length > 0) {
        response += `🍝 PRIMI PIATTI DI MARE:\n${formatDishesList(primiMare.dishes)}\n\n`
      }
      
      if (primiCarne && primiCarne.dishes.length > 0) {
        response += `🍝 PRIMI PIATTI DI CARNE:\n${formatDishesList(primiCarne.dishes)}`
      }
      
      return {
        message: response.trim(),
        hasBookingInterest: false
      }
    }
    
    // Secondi piatti
    if (message.includes("secondi") && (message.includes("avete") || message.includes("c'è") || message.includes("list"))) {
      const secondiMare = findCategory(["secondi", "mare"])
      const secondiCarne = findCategory(["secondi", "carne"])
      
      let response = "Ecco i nostri secondi piatti:\n\n"
      
      if (secondiMare && secondiMare.dishes.length > 0) {
        response += `🐟 SECONDI PIATTI DI MARE:\n${formatDishesList(secondiMare.dishes)}\n\n`
      }
      
      if (secondiCarne && secondiCarne.dishes.length > 0) {
        response += `🥩 SECONDI PIATTI DI CARNE:\n${formatDishesList(secondiCarne.dishes)}`
      }
      
      return {
        message: response.trim(),
        hasBookingInterest: false
      }
    }
    
    // Antipasti
    if (message.includes("antipast") && (message.includes("avete") || message.includes("c'è") || message.includes("list"))) {
      const antipastiMare = findCategory(["antipast", "mare"])
      const antipastiCarne = findCategory(["antipast", "carne"])
      
      let response = "Ecco i nostri antipasti:\n\n"
      
      if (antipastiMare && antipastiMare.dishes.length > 0) {
        response += `🐟 ANTIPASTI DI MARE:\n${formatDishesList(antipastiMare.dishes)}\n\n`
      }
      
      if (antipastiCarne && antipastiCarne.dishes.length > 0) {
        response += `🥩 ANTIPASTI DI CARNE:\n${formatDishesList(antipastiCarne.dishes)}`
      }
      
      return {
        message: response.trim(),
        hasBookingInterest: false
      }
    }
    
    // Dolci
    if (message.includes("dolc") && (message.includes("avete") || message.includes("c'è") || message.includes("list"))) {
      const dolci = findCategory(["dolc"])
      
      if (dolci && dolci.dishes.length > 0) {
        return {
          message: `🍰 I NOSTRI DOLCI:\n${formatDishesList(dolci.dishes)}`,
          hasBookingInterest: false
        }
      }
    }
    
    // Contorni
    if (message.includes("contorn") && (message.includes("avete") || message.includes("c'è") || message.includes("list"))) {
      const contorni = findCategory(["contorn"])
      
      if (contorni && contorni.dishes.length > 0) {
        return {
          message: `🥗 I NOSTRI CONTORNI:\n${formatDishesList(contorni.dishes)}`,
          hasBookingInterest: false
        }
      }
    }
    
    // Birre
    if (message.includes("birr") && (message.includes("avete") || message.includes("c'è") || message.includes("list"))) {
      const birre = findCategory(["birr"])
      
      if (birre && birre.dishes.length > 0) {
        return {
          message: `🍺 LE NOSTRE BIRRE:\n${formatDishesList(birre.dishes)}`,
          hasBookingInterest: false
        }
      }
    }
    
    // Vini
    if (message.includes("vin") && (message.includes("avete") || message.includes("c'è") || message.includes("list"))) {
      const viniBianchi = findCategory(["vini", "bianch"])
      const viniRossi = findCategory(["vini", "ross"])
      const viniFrizzanti = findCategory(["frizzant"]) || findCategory(["spumant"])
      
      let response = "Ecco i nostri vini:\n\n"
      
      if (viniBianchi && viniBianchi.dishes.length > 0) {
        response += `🍷 VINI BIANCHI:\n${formatDishesList(viniBianchi.dishes)}\n\n`
      }
      
      if (viniRossi && viniRossi.dishes.length > 0) {
        response += `🍷 VINI ROSSI:\n${formatDishesList(viniRossi.dishes)}\n\n`
      }
      
      if (viniFrizzanti && viniFrizzanti.dishes.length > 0) {
        response += `🥂 VINI FRIZZANTI E SPUMANTI:\n${formatDishesList(viniFrizzanti.dishes)}`
      }
      
      return {
        message: response.trim(),
        hasBookingInterest: false
      }
    }
    
    // Bibite
    if ((message.includes("bibite") || message.includes("bevande")) && (message.includes("avete") || message.includes("c'è") || message.includes("list"))) {
      const bibite = findCategory(["bibit"])
      
      if (bibite && bibite.dishes.length > 0) {
        return {
          message: `🥤 LE NOSTRE BIBITE:\n${formatDishesList(bibite.dishes)}`,
          hasBookingInterest: false
        }
      }
    }
    
    // Caffetteria
    if ((message.includes("caff") || message.includes("caffetteria")) && (message.includes("avete") || message.includes("c'è") || message.includes("list"))) {
      const caffetteria = findCategory(["caffetteria"])
      
      if (caffetteria && caffetteria.dishes.length > 0) {
        return {
          message: `☕ CAFFETTERIA:\n${formatDishesList(caffetteria.dishes)}`,
          hasBookingInterest: false
        }
      }
    }
    
    // Menu generale
    if (message.includes("menu") || message.includes("piatti") || message.includes("cosa avete") || message.includes("cosa c'è")) {
      return {
        message: "Abbiamo un'ampia selezione di piatti di pesce freschissimo! 🐟 Puoi vedere il menu completo nella sezione 'Asporto' del sito. Specialità: antipasti di mare, primi piatti, grigliate e molto altro!",
        hasBookingInterest: false
      }
    }
    
    // Prezzi
    if (message.includes("prezzo") || message.includes("quanto costa") || message.includes("costi")) {
      return {
        message: "I prezzi variano a seconda del piatto. Puoi vedere tutti i prezzi nel menu nella sezione 'Asporto'. I nostri antipasti partono da €10, i primi da €14 e i secondi da €12.",
        hasBookingInterest: false
      }
    }
    
    // Posizione/Indirizzo
    if (message.includes("dove") || message.includes("indirizzo") || message.includes("posizione") || message.includes("ubicazione") || message.includes("come arrivare")) {
      return {
        message: "Ci troviamo a Terrasini, in Lungomare Peppino Impastato N1, Terrasini Favarotta. 🗺️ Siamo affacciati sul mare con una bellissima terrazza!",
        hasBookingInterest: false
      }
    }
    
    // Specialità
    if (message.includes("specialità") || message.includes("tipico") || message.includes("famoso") || message.includes("consigli")) {
      return {
        message: "Le nostre specialità sono i piatti di pesce freschissimo del Mediterraneo! 🐟 Ti consiglio: Polipetti Murati (€16), Tagliolino Ricci e Gambero (€26), Grigliata Mista di Pesce (€35 per 2 persone).",
        hasBookingInterest: false
      }
    }
    
    // Asporto
    if (message.includes("asporto") || message.includes("take away") || message.includes("portare via")) {
      return {
        message: "Sì, facciamo asporto! 🍱 Puoi vedere il menu completo nella sezione 'Asporto' del sito e ordinarci via WhatsApp.",
        hasBookingInterest: false
      }
    }
    
    // Contatti
    if (message.includes("telefono") || message.includes("numero") || message.includes("contatto") || message.includes("chiamare")) {
      return {
        message: "Puoi contattarci via WhatsApp al numero +39 320 727 9857. 📱 Siamo sempre disponibili per rispondere alle tue domande!",
        hasBookingInterest: false
      }
    }
    
    // Grazie
    if (message.includes("grazie") || message.includes("grazie mille") || message.includes("perfetto")) {
      return {
        message: "Prego! 😊 Se hai altre domande, sono qui per aiutarti!",
        hasBookingInterest: false
      }
    }
    
    // Controlla se ci sono informazioni aggiuntive dall'admin che potrebbero rispondere
    if (knowledge.additionalInfo && knowledge.additionalInfo.trim()) {
      // Se il messaggio contiene parole chiave che potrebbero essere nelle info aggiuntive
      const additionalInfoLower = knowledge.additionalInfo.toLowerCase()
      const messageWords = message.split(/\s+/)
      const hasMatchingKeywords = messageWords.some(word => 
        word.length > 3 && additionalInfoLower.includes(word)
      )
      
      if (hasMatchingKeywords) {
        return {
          message: knowledge.additionalInfo,
          hasBookingInterest: false
        }
      }
    }
    
    // Default - risposta generica
    let defaultMessage = "Grazie per la tua domanda! 😊 Posso aiutarti con informazioni su orari, menu, prenotazioni e posizione. Cosa vorresti sapere?"
    
    // Aggiungi informazioni aggiuntive se disponibili
    if (knowledge.additionalInfo && knowledge.additionalInfo.trim()) {
      defaultMessage += `\n\n${knowledge.additionalInfo}`
    }
    
    return {
      message: defaultMessage,
      hasBookingInterest: false
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)
    setHasBookingInterest(false)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.error || "Errore nella risposta")
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
      setHasBookingInterest(data.hasBookingInterest || false)
    } catch (error: any) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Mi dispiace, c'è stato un errore. ${error.message || "Riprova più tardi."} 😔`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    if (confirm("Vuoi cancellare tutta la conversazione?")) {
      setMessages([
        {
          role: "assistant",
          content: "Ciao! 👋 Sono l'assistente del Ristorante Barinello. Come posso aiutarti oggi?",
        },
      ])
      setHasBookingInterest(false)
    }
  }

  const handleSave = () => {
    const conversation = messages
      .map((msg) => `${msg.role === "user" ? "Cliente" : "Assistente"}: ${msg.content}`)
      .join("\n\n")
    
    const blob = new Blob([conversation], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-barinello-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateWhatsAppSummary = () => {
    const summary = messages
      .filter((msg) => msg.role === "user" || msg.content.toLowerCase().includes("prenot") || msg.content.toLowerCase().includes("tavolo"))
      .map((msg) => `${msg.role === "user" ? "Cliente" : "Assistente"}: ${msg.content}`)
      .join("\n\n")
    
    return `*Nuova richiesta da Assistente AI Barinello*\n\n${summary}`
  }

  const handleWhatsApp = () => {
    const summary = generateWhatsAppSummary()
    const phoneNumber = "393207279857"
    const encodedMessage = encodeURIComponent(summary)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        style={{ backgroundColor: "#FF7F7F", color: "white" }}
        aria-label="Apri assistente AI"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <span className="text-sm md:text-base font-bold">AI</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-32 md:bottom-6 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[calc(100vw-3rem)] md:max-w-2xl h-[600px] md:h-[calc(100vh-8rem)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-semibold">Assistente Barinello</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="p-1.5 rounded hover:bg-primary/80 transition-colors"
                aria-label="Salva chat"
                title="Salva chat"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                className="p-1.5 rounded hover:bg-primary/80 transition-colors"
                aria-label="Cancella chat"
                title="Cancella chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded hover:bg-primary/80 transition-colors"
                aria-label="Chiudi chat"
                title="Chiudi chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Button (if booking interest) */}
          {hasBookingInterest && (
            <div className="px-4 py-2 border-t border-border">
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Contatta via WhatsApp</span>
              </button>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Scrivi un messaggio..."
                className="flex-1 px-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

