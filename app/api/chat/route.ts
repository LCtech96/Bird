import { NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.GROQ_API_KEY || process.env.groq_api_key || ""

// Funzione per generare il menù completo in formato testo
type MenuDish = {
  name: string
  description?: string
  price: string
  visible?: boolean
}

type MenuCategory = {
  title: string
  dishes: MenuDish[]
}

async function generateMenuText(): Promise<string> {
  // 1) Carica menu salvato (Supabase) se presente
  let menuCategories: MenuCategory[] = []

  try {
    const { supabaseServer } = await import("@/lib/supabase-server")
    const supabase = supabaseServer
    if (supabase) {
      const { data, error } = await supabase
        .from("admin_data")
        .select("value")
        .eq("key", "menu")
        .single()

      if (!error && data?.value && Array.isArray(data.value)) {
        menuCategories = data.value as MenuCategory[]
      }
    }
  } catch (error) {
    console.error("Error loading menu from Supabase:", error)
  }

  // 2) Fallback: menu “hardcoded” nel progetto (usato anche come conoscenza AI)
  if (!Array.isArray(menuCategories) || menuCategories.length === 0) {
    const { defaultMenuCategories } = await import("@/lib/menu-data-default")
    menuCategories = defaultMenuCategories as MenuCategory[]
  }

  // 3) Filtra piatti non visibili
  const filtered = menuCategories.map((category) => ({
    ...category,
    dishes: Array.isArray(category.dishes)
      ? category.dishes.filter((dish) => dish?.visible !== false)
      : [],
  }))

  // 4) Serializza in testo per il prompt AI - versione compatta (solo nomi e prezzi per risparmiare token)
  let menuText = "\nMENÙ DEL BIRD RESTAURANT:\n\n"
  for (const category of filtered) {
    menuText += `${category.title}:\n`
    for (const dish of category.dishes) {
      // Solo nome e prezzo per risparmiare token (max 100 caratteri per piatto)
      menuText += `• ${dish.name} - ${dish.price}\n`
    }
    menuText += "\n"
  }

  return menuText
}

const BASE_SYSTEM_PROMPT = `Assistente AI Bird Restaurant (pesce, Terrasini).

REGOLE:
1. Solo domande su Bird Restaurant.
2. Max 2-3 frasi per risposta.
3. Piatto = nome + prezzo.
4. Max 1 emoji.
5. IMPORTANTE: Rispondi SEMPRE nella stessa lingua usata dal cliente. Se scrivono in inglese, rispondi in inglese. Se scrivono in italiano, rispondi in italiano. Se scrivono in francese, rispondi in francese, ecc.
6. Usa "siamo aperti/chiusi" (non "siete") - quando rispondi in italiano.

INFO: Bird Restaurant | Pesce siciliano | Via Libertà, 169, 90049 Terrasini PA | Ristorante/Asporto/Terrazza`

// Funzione per caricare la conoscenza AI dall'admin
async function loadAIKnowledge() {
  try {
    // Prova a caricare da Supabase
    const { supabaseServer } = await import("@/lib/supabase-server")
    const supabase = supabaseServer
    if (supabase) {
      const { data, error } = await supabase
        .from("admin_data")
        .select("value")
        .eq("key", "ai_knowledge")
        .single()

      if (!error && data && data.value) {
        return data.value
      }
    }
    
    // Fallback: restituisci dati di default
    return {
      openingHours: "07:00 - 01:00",
      closingDays: [],
      holidays: [],
      events: [],
      additionalInfo: ""
    }
  } catch (error) {
    console.error("Error loading AI knowledge:", error)
    return {
      openingHours: "07:00 - 01:00",
      closingDays: [],
      holidays: [],
      events: [],
      additionalInfo: ""
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      )
    }

    if (!API_KEY || API_KEY.trim() === "") {
      console.error("Groq API key is missing or empty")
      return NextResponse.json(
        { error: "Groq API key is not configured" },
        { status: 500 }
      )
    }

    // Verifica che la chiave API abbia il formato corretto (inizia con gsk_)
    if (!API_KEY.startsWith("gsk_")) {
      console.error("Groq API key format is invalid")
      return NextResponse.json(
        { error: "Groq API key format is invalid" },
        { status: 500 }
      )
    }

    // Carica la conoscenza AI dall'admin
    const aiKnowledge = await loadAIKnowledge()

    // Ottieni data e ora corrente (fuso orario italiano)
    const now = new Date()
    const italianTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Rome" }))
    const currentDate = italianTime.toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
    const currentTime = italianTime.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit"
    })

    console.log("API Key present:", !!API_KEY)
    console.log("API Key length:", API_KEY?.length || 0)
    console.log("API Key starts with gsk_:", API_KEY?.startsWith("gsk_") || false)

    // Genera il menù (versione compatta)
    const menuText = await generateMenuText()
    console.log("Menu text generated, length:", menuText.length)
    
    // Controlla se il messaggio richiede informazioni sul menu
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === "user").slice(-1)[0]?.content?.toLowerCase() || ""
    const needsMenuInfo = lastUserMessage.includes("menu") || 
                          lastUserMessage.includes("piatto") || 
                          lastUserMessage.includes("cosa avete") || 
                          lastUserMessage.includes("prezzo") || 
                          lastUserMessage.includes("costi") ||
                          lastUserMessage.includes("cosa c'è")
    
    // Costruisci il system prompt con le informazioni dall'admin
    let knowledgeInfo = `Orari: ${aiKnowledge.openingHours}`
    
    if (aiKnowledge.closingDays && aiKnowledge.closingDays.length > 0) {
      knowledgeInfo += ` | Chiuso: ${aiKnowledge.closingDays.join(", ")}`
    }
    
    if (aiKnowledge.holidays && aiKnowledge.holidays.length > 0) {
      const holidaysText = aiKnowledge.holidays
        .map((h: { date: string; description: string }) => `${h.date}`)
        .join(", ")
      knowledgeInfo += ` | Festività: ${holidaysText}`
    }
    
    if (aiKnowledge.events && aiKnowledge.events.length > 0) {
      const eventsText = aiKnowledge.events
        .map((e: { date: string; description: string }) => `${e.date}`)
        .join(", ")
      knowledgeInfo += ` | Eventi: ${eventsText}`
    }
    
    // Costruisci il prompt finale - include menu solo se necessario
    let systemPromptWithTime = `${BASE_SYSTEM_PROMPT}

INFO ADMIN: ${knowledgeInfo}
Data/ora: ${currentDate}, ${currentTime} (Italia)

REGOLE:
- Risposte BREVISSIME (2-3 frasi max)
- Nome + prezzo quando menzioni piatti
- Usa "siamo aperti/chiusi" (non "siete") - quando rispondi in italiano
- LINGUA: Rispondi SEMPRE nella stessa lingua del messaggio del cliente (italiano, inglese, francese, spagnolo, tedesco, ecc.)`

    // Aggiungi menu solo se necessario per risparmiare token
    // Limita la lunghezza del menu a max 1500 caratteri
    if (needsMenuInfo) {
      if (menuText.length > 1500) {
        // Tronca il menu mantenendo le prime categorie
        const truncated = menuText.substring(0, 1500)
        const lastCategory = truncated.lastIndexOf('\n\n')
        systemPromptWithTime += `\n\nMENÙ:\n${truncated.substring(0, lastCategory > 0 ? lastCategory : 1500)}\n...`
      } else {
        systemPromptWithTime += `\n\nMENÙ:\n${menuText}`
      }
    }

    // Costruisci i messaggi per Groq
    // Filtra i messaggi escludendo il messaggio di benvenuto iniziale
    const filteredMessages = messages.filter((msg: { role: string; content: string }) => {
      return !(msg.role === "assistant" && msg.content.includes("Ciao! 👋"))
    })

    // Converti i messaggi nel formato Groq
    // Usa un messaggio system separato invece di includerlo nel primo messaggio user per risparmiare token
    const groqMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = []
    
    // Aggiungi system prompt come messaggio separato (più efficiente)
    groqMessages.push({
      role: "system",
      content: systemPromptWithTime
    })
    
    // Aggiungi i messaggi della conversazione
    filteredMessages.forEach((msg: { role: string; content: string }) => {
      groqMessages.push({
        role: (msg.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: msg.content,
      })
    })

    console.log("Preparing Groq API call...")
    console.log("Messages count:", groqMessages.length)
    console.log("First message preview:", groqMessages[0]?.content?.substring(0, 100))

    // Usa fetch diretto invece della SDK per maggiore affidabilità su Vercel
    // Aggiungi retry con backoff esponenziale per errori 429 (rate limit)
    let completion
    const maxRetries = 3
    let retryCount = 0
    
    while (retryCount <= maxRetries) {
      try {
        console.log(`Calling Groq API via REST... (attempt ${retryCount + 1}/${maxRetries + 1})`)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 secondi timeout
        
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: groqMessages,
            temperature: 0.6,
            max_tokens: 200,
          }),
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        
        if (response.status === 429 && retryCount < maxRetries) {
          // Rate limit: aspetta con backoff esponenziale
          const retryAfter = response.headers.get("Retry-After")
          const waitTime = retryAfter 
            ? parseInt(retryAfter) * 1000 
            : Math.min(1000 * Math.pow(2, retryCount), 10000) // Max 10 secondi
          
          console.log(`Rate limit hit. Waiting ${waitTime}ms before retry ${retryCount + 1}...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          retryCount++
          continue
        }
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error("Groq API HTTP Error:", response.status, errorText)
          throw new Error(`Groq API error: ${response.status} - ${errorText}`)
        }
        
        completion = await response.json()
        console.log("Groq API call successful")
        break // Successo, esci dal loop
      } catch (fetchError: any) {
        if (fetchError.name === "AbortError") {
          throw new Error("Timeout: il servizio ha impiegato troppo tempo a rispondere")
        }
        
        // Se non è un errore 429 o abbiamo esaurito i retry, rilancia
        if (retryCount >= maxRetries) {
          throw fetchError
        }
        
        // Se è un errore di rete, prova a fare retry
        if (fetchError.message?.includes("fetch failed") || fetchError.message?.includes("ECONNREFUSED")) {
          const waitTime = Math.min(1000 * Math.pow(2, retryCount), 5000)
          console.log(`Network error. Retrying in ${waitTime}ms...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          retryCount++
          continue
        }
        
        throw fetchError
      }
    }
    
    // Verifica che completion sia stato definito
    if (!completion) {
      throw new Error("Impossibile completare la richiesta dopo tutti i tentativi")
    }
    
    // Se arriviamo qui, la chiamata è andata a buon fine
    const text = completion.choices[0]?.message?.content || "Mi dispiace, non sono riuscito a generare una risposta."

    const lastMessage = messages[messages.length - 1]
    
    // Controlla se c'è interesse per prenotazioni
    const hasBookingInterest = 
      lastMessage?.content?.toLowerCase().includes("prenot") ||
      lastMessage?.content?.toLowerCase().includes("tavolo") ||
      lastMessage?.content?.toLowerCase().includes("disponibil") ||
      text.toLowerCase().includes("prenot") ||
      text.toLowerCase().includes("tavolo")

    return NextResponse.json({
      message: text,
      hasBookingInterest,
    })
  } catch (error: any) {
    console.error("AI Chat Error:", error)
    console.error("Error details:", JSON.stringify(error, null, 2))
    
    // Determina il messaggio di errore appropriato
    let errorMessage = "Errore nella comunicazione con l'AI"
    
    if (error.message) {
      if (error.message.includes("Chiave API")) {
        errorMessage = "Problema con la configurazione della chiave API"
      } else if (error.message.includes("Timeout") || error.message.includes("timeout")) {
        errorMessage = "Timeout: il servizio ha impiegato troppo tempo a rispondere"
      } else if (error.message.includes("connessione") || error.message.includes("Connection")) {
        errorMessage = "Errore di connessione. Riprova tra qualche momento."
      } else if (error.message.includes("Troppe richieste")) {
        errorMessage = "Troppe richieste. Riprova tra qualche momento."
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message || "Errore sconosciuto",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

