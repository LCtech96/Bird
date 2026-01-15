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

  // 4) Serializza in testo per il prompt AI
  let menuText = "\nMENÙ COMPLETO DEL RISTORANTE BARINELLO:\n\n"
  for (const category of filtered) {
    menuText += `=== ${category.title} ===\n`
    for (const dish of category.dishes) {
      menuText += `• ${dish.name}`
      if (dish.description) menuText += ` - ${dish.description}`
      menuText += ` | ${dish.price}\n`
    }
    menuText += "\n"
  }

  return menuText
}

const BASE_SYSTEM_PROMPT = `Sei l'Assistente AI del Ristorante Barinello, ristorante di pesce a Terrasini, Sicilia.

IDENTITÀ:
- Sei l'Assistente di Barinello, NON un cliente
- Rappresenti il Ristorante Barinello
- NON chiedere mai "siete aperti?" o "siamo aperti?" - sei l'assistente del ristorante, quindi usa "siamo aperti" o "siamo chiusi"
- Rispondi SOLO quando i clienti ti chiedono informazioni

REGOLE FONDAMENTALI:
1. Rispondi SOLO a domande sul Ristorante Barinello. Per altre richieste, rispondi educatamente che puoi aiutare solo con Barinello.
2. Risposte BREVISSIME: massimo 2-3 frasi. Essere conciso è prioritario.
3. Quando menzioni un piatto, includi sempre nome e prezzo.
4. Usa max 1 emoji per messaggio.
5. Linguaggio amichevole ma professionale.
6. Rispondi sempre in italiano.
7. NON fare domande ai clienti su orari o disponibilità - sei l'assistente, quindi conosci già queste informazioni e le fornisci quando richieste.

INFORMAZIONI RISTORANTE:
- Nome: Ristorante Barinello
- Tipo: Cucina di pesce tradizionale siciliana
- Location: Lungomare Peppino Impastato N1, Terrasini Favarotta, Italy, 90049
- Servizi: Ristorante, Asporto, Terrazza affacciata sul mare`

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

    // Genera il menù completo
    const menuText = await generateMenuText()
    console.log("Menu text generated, length:", menuText.length)
    
    // Costruisci il system prompt con le informazioni dall'admin
    let knowledgeInfo = `- Orari: ${aiKnowledge.openingHours}\n`
    
    if (aiKnowledge.closingDays && aiKnowledge.closingDays.length > 0) {
      knowledgeInfo += `- Giorni di chiusura: ${aiKnowledge.closingDays.join(", ")}\n`
    }
    
    if (aiKnowledge.holidays && aiKnowledge.holidays.length > 0) {
      const holidaysText = aiKnowledge.holidays
        .map((h: { date: string; description: string }) => `${h.date}: ${h.description}`)
        .join(", ")
      knowledgeInfo += `- Festività: ${holidaysText}\n`
    }
    
    if (aiKnowledge.events && aiKnowledge.events.length > 0) {
      const eventsText = aiKnowledge.events
        .map((e: { date: string; description: string }) => `${e.date}: ${e.description}`)
        .join(", ")
      knowledgeInfo += `- Eventi speciali: ${eventsText}\n`
    }
    
    if (aiKnowledge.additionalInfo) {
      knowledgeInfo += `- Informazioni aggiuntive: ${aiKnowledge.additionalInfo}\n`
    }
    
    // Costruisci il prompt finale con tutte le informazioni
    const systemPromptWithTime = `${BASE_SYSTEM_PROMPT}

INFORMAZIONI AGGIORNATE DAL ADMIN:
${knowledgeInfo}

MENÙ COMPLETO:
${menuText}

ISTRUZIONI FINALI:
- Sei l'Assistente di Barinello, NON un cliente. Usa "siamo aperti/chiusi" non "siete aperti"
- NON chiedere mai ai clienti "siete aperti?" - sei l'assistente, quindi conosci già gli orari
- Rispondi SOLO quando i clienti ti chiedono informazioni (orari, menu, prenotazioni, ecc.)
- Risposte BREVISSIME (max 2-3 frasi)
- Quando menzioni un piatto: nome + prezzo
- Usa le informazioni dalla sezione "INFORMAZIONI AGGIORNATE DAL ADMIN" sopra per rispondere alle domande
- Data/ora attuale: ${currentDate}, ${currentTime} (Italia). Usa SOLO per verificare se il ristorante è attualmente aperto quando i clienti lo chiedono.
- Se un cliente chiede se siete aperti: rispondi "Sì, siamo aperti" o "No, siamo chiusi" in base agli orari e alla data/ora attuale, senza chiedere nulla in cambio`

    // Costruisci i messaggi per Groq
    // Filtra i messaggi escludendo il messaggio di benvenuto iniziale
    const filteredMessages = messages.filter((msg: { role: string; content: string }) => {
      return !(msg.role === "assistant" && msg.content.includes("Ciao! 👋"))
    })

    // Converti i messaggi nel formato Groq
    const groqMessages = filteredMessages.map((msg: { role: string; content: string }, index: number) => {
      // Se è il primo messaggio user, aggiungi il system prompt con data/ora
      if (index === 0 && msg.role === "user") {
        return {
          role: "user" as const,
          content: `${systemPromptWithTime}\n\nDomanda del cliente: ${msg.content}`,
        }
      }
      return {
        role: (msg.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: msg.content,
      }
    })

    // Se non ci sono messaggi dopo il filtro, crea un messaggio iniziale
    if (groqMessages.length === 0) {
      groqMessages.push({
        role: "user" as const,
        content: systemPromptWithTime,
      })
    }

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

