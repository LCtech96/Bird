"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import Image from "next/image"
import { menuCategoriesFromPublic } from "@/lib/menu-data-from-public"

type MenuItem = {
  name: string
  description?: string
  price?: string
  image?: string
  visible?: boolean
}

type MenuCategory = {
  title: string
  items: MenuItem[]
  dishes?: MenuItem[] // Supporto per struttura admin (dishes) e pubblica (items)
}

export default function AsportoPage() {
  const [expanded, setExpanded] = useState<Set<string>>(
    () =>
      new Set([
        "Aperitivi",
        "Antipasti di pesce",
        "Antipasti di carne",
        "Primi",
        "Pizze"
      ])
  )
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMenu()
  }, [])

  const loadMenu = async () => {
    try {
      const response = await fetch("/api/menu", {
        cache: "no-store"
      })
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          // Converti la struttura admin (dishes) alla struttura pubblica (items)
          const convertedCategories = data.map((cat: any) => ({
            title: cat.title,
            items: (cat.dishes || cat.items || []).filter((item: any) => item.visible !== false)
          }))
          setCategories(convertedCategories)
        } else {
          // Fallback: usa i dati della pagina pubblica
          setCategories(menuCategoriesFromPublic.map(cat => ({
            title: cat.title,
            items: cat.dishes.filter(dish => dish.visible !== false)
          })))
        }
      } else {
        // Fallback: usa i dati della pagina pubblica
        setCategories(menuCategoriesFromPublic.map(cat => ({
          title: cat.title,
          items: cat.dishes.filter(dish => dish.visible !== false)
        })))
      }
    } catch (error) {
      console.error("Error loading menu:", error)
      // Fallback: usa i dati della pagina pubblica
      setCategories(menuCategoriesFromPublic.map(cat => ({
        title: cat.title,
        items: cat.dishes.filter(dish => dish.visible !== false)
      })))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">Caricamento menu...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }
      {
        title: "Aperitivi",
        items: [
          { name: "Sambitter", description: "Bitter analcolico", price: "€ 5,00" },
          { name: "Martini", description: "Bianco-Rosso-Dry", price: "€ 6,00" },
          { name: "Americano", description: "Bitter Campari, Martini Rosso", price: "€ 7,00" },
          { name: "Negroni", description: "Bitter Campari, Martini Rosso, Gin", price: "€ 7,00" },
          { name: "Cocktail Martini", description: "Gin, Martini dry", price: "€ 8,00" },
          { name: "Gin Tonic", description: "Gin, Acqua Tonica", price: "€ 7,00" },
          { name: "Gin Lemon", description: "Gin, Lemonsoda", price: "€ 7,00" },
          { name: "Vodka Tonic", description: "Vodka, Acqua tonica", price: "€ 7,00" },
          { name: "Cuba Libre", description: "Rum, CocaCola, Limone", price: "€ 7,00" },
          { name: "Ricard-Pernod", description: "Ricard-Pernod, Acqua", price: "€ 6,00" }
        ]
      },
      {
        title: "Antipasti di pesce",
        items: [
          { name: "Cozze scoppiate", description: "Cozze", price: "€ 12,00" },
          { name: "Zuppa di cozze", description: "Cozze, aglio, olio d'oliva, peperoncino, salsa, prezzemolo", price: "€ 12,00" },
          { name: "Cocktail di gamberi*", description: "Gamberi, lattuga, salsa rosa", price: "€ 15,00" },
          { name: "Insalata di mare*", description: "Polpo, cozze, gamberi*, calamaro o totano, prezzemolo, olio, limone", price: "€ 15,00" },
          { name: "Delizia mediterranea", description: "Insalata di mare, salmone, cocktail di gamberi, marlin affumicato, prezzemolo", price: "€ 18,00" },
          { name: "Gamberi marinati* (8 pz.)", description: "Gamberi rossi, limone, olio d'oliva, peperoncino, prezzemolo", price: "€ 20,00" },
          { name: "Ostriche (cad.)", description: "Oyster", price: "€ 4,00" }
        ]
      },
      {
        title: "Antipasti di carne",
        items: [
          { name: "Bruschette al pomodoro", description: "Pane tostato, pomodoro, aglio, olio d'oliva, basilico", price: "€ 6,00" },
          { name: "Misto Caldo Fritto", description: "Patatine, panelle, arancinetta, crocchette di patate", price: "€ 6,00" },
          { name: "Patate Fritte*", description: "Patate", price: "€ 4,00" },
          { name: "Caprese", description: "Prosciutto crudo, mozzarella di bufala, pomodorini, basilico, olio d'oliva", price: "€ 12,00" },
          { name: "Carpaccio di bresaola", description: "Bresaola, rucola, scaglie di grana, olio d'oliva, limone", price: "€ 11,00" },
          { name: "Tartare di filetto", description: "Filetto tritato, rucola, cipolla rossa, frutto del cappero, glassa di aceto balsamico, olio d'oliva, limone", price: "€ 20,00" }
        ]
      },
      {
        title: "Primi",
        items: [
          { name: "Spaghetti alle vongole", description: "Vongole, aglio, olio d'oliva, peperoncino, vino bianco, prezzemolo", price: "€ 22,00" },
          { name: "Spaghetti allo scoglio", description: "Cozze, vongole, gamberi*, aglio, olio d'oliva, peperoncino, vino bianco, prezzemolo", price: "€ 16,00" },
          { name: "Farfalle al salmone", description: "Salmone, salsa di pomodoro, panna, burro, cipolla, brandy", price: "€ 12,00" },
          { name: "Risotto alla marinara", description: "Cozze, vongole, gamberi*, aglio, olio d'oliva, vino bianco, salsa di pomodoro, prezzemolo", price: "€ 16,00" },
          { name: "Risotto al gambero con crema di zucca", description: "Gamberi*, crema di zucca, cipolla, panna, olio d'oliva, pepe", price: "€ 15,00" },
          { name: "Pennette Bird", description: "Gamberi*, pesto genovese, rucola, zucchine, salsa di pomodoro, panna, aglio, olio d'oliva, prezzemolo", price: "€ 15,00" },
          { name: "Pennette alla francescana", description: "Ragù di carne, prosciutto cotto, funghi freschi, panna, olio d'oliva, prezzemolo", price: "€ 13,00" },
          { name: "Spaghetti alla carbonara", description: "Pancetta, tuorlo d'uovo, burro", price: "€ 14,00" }
        ]
      },
      {
        title: "Secondi di pesce",
        items: [
          { name: "Pesce fresco", description: "Prezzo al Kg.", price: "€ 60,00 / Kg" },
          { name: "Pesce fresco in umido", description: "Prezzo al Kg.", price: "€ 60,00 / Kg" },
          { name: "Frittura mista fresca", description: "Prezzo al Kg.", price: "€ 50,00 / Kg" },
          { name: "Totano fresco alla griglia", description: "Prezzo al Kg.", price: "€ 45,00 / Kg" },
          { name: "Totano fresco fritto", description: "Prezzo al Kg.", price: "€ 45,00 / Kg" },
          { name: "Calamaro* alla griglia", description: "Grilled squid", price: "€ 18,00" },
          { name: "Frittura mista*", description: "Calamari, gamberi", price: "€ 20,00" },
          { name: "Frittura di calamaretti*", description: "Fried small squid", price: "€ 13,00" },
          { name: "Pesce spada alla griglia*", description: "Prezzo al Kg.", price: "€ 45,00 / Kg" },
          { name: "Gamberoni alla griglia*", description: "Grilled prawns", price: "€ 35,00" },
          { name: "Grigliata mista di pesce*", description: "(Pesce spada, calamaro, gamberoni 2 pz.)", price: "€ 25,00" }
        ]
      },
      {
        title: "Secondi di carne",
        items: [
          { name: "Bistecca alla griglia", description: "Prezzo al Kg.", price: "€ 45,00 / Kg" },
          { name: "Tagliata di Angus Irlandese con rucola e grana", description: "Prezzo al Kg.", price: "€ 50,00 / Kg" },
          { name: "Filetto alla griglia", description: "Prezzo al Kg.", price: "€ 70,00 / Kg" },
          { name: "Grigliata mista di carne", description: "Salsiccia, involtini, coscia di pollo, puntine di maiale", price: "€ 18,00" },
          { name: "Involtini di carne", description: "Prosciutto cotto, formaggio, pomodoro, mollica", price: "€ 12,00" },
          { name: "Coscia di pollo alla piastra", description: "Grilled chicken leg", price: "€ 12,00" },
          { name: "Hamburger* 220 gr.", description: "Hamburger 220g, panino 130g, insalata, pomodoro, patate dippers, anelli di cipolla", price: "€ 13,00" },
          { name: "Cheeseburger con Bacon Special 220 gr.", description: "Hamburger 220g, panino 130g, cheddar, bacon, insalata, pomodoro, patate dippers, anelli di cipolla", price: "€ 15,00" }
        ]
      },
      {
        title: "Contorni",
        items: [
          { name: "Patate* fritte", description: "French fries", price: "€ 4,00" },
          { name: "Patate* fritte Dippers", description: "Dippers french fries", price: "€ 5,00" },
          { name: "Patate al forno", description: "Baked potatoes", price: "€ 6,00" },
          { name: "Verdure grigliate", description: "Grilled vegetables", price: "€ 7,00" },
          { name: "Spinaci al burro", description: "Buttered spinach", price: "€ 5,00" },
          { name: "Insalata verde", description: "Green salad", price: "€ 4,00" },
          { name: "Insalata contadina", description: "Pomodoro, cipolla, acciughe, olive, origano", price: "€ 6,00" },
          { name: "Insalata mista", description: "Pomodoro, lattuga iceberg, radicchio, mais", price: "€ 6,00" }
        ]
      },
      {
        title: "Insalatone",
        items: [
          { name: "Insalata Bird", description: "Lattuga iceberg, cuori di carciofi, gamberetti*, mais, scaglie di grana padano", price: "€ 12,00" },
          { name: "Insalata Capricciosa", description: "Lattuga iceberg, cuori di palma, radicchio, mais, rucola, pomodoro, carote", price: "€ 9,00" },
          { name: "Insalata Tottosole", description: "Bresaola, mozzarella di bufala, cuori di palma, radicchio, carote, scaglie di grana padano, funghi freschi", price: "€ 13,00" },
          { name: "Caesar Salad", description: "Pollo grigliato, lattuga, radicchio, carote, mais, salsa caesar", price: "€ 12,00" }
        ]
      },
      {
        title: "Pizze Gourmet",
        items: [
          { name: "Pistacchiosa", description: "Stracciatella, mortadella, crema di pistacchio, pomodorini rossi e gialli, olio d'oliva, origano", price: "€ 14,00" },
          { name: "Trentina", description: "Mozzarella di bufala, speck, gorgonzola, noci, olio d'oliva, origano", price: "€ 14,00" },
          { name: "Pantesca", description: "Mozzarella di bufala, capperi, cipolla, pomodorino giallo, acciughe, olio d'oliva, origano", price: "€ 13,00" },
          { name: "Datterino", description: "Mozzarella di bufala, pomodorino giallo, pomodoro secco, prosciutto crudo, olio d'oliva, origano", price: "€ 13,00" }
        ]
      },
      { title: "Pizza della settimana", items: [{ name: "Vellutata di radicchio, bufala in cottura, speck e grana" }] },
      {
        title: "Pizze",
        items: [
          { name: "Margherita", description: "Salsa di pomodoro, mozzarella, olio d'oliva, origano", price: "€ 6,50" },
          { name: "Bufala", description: "Salsa di pomodoro, mozzarella di bufala, olio d'oliva, origano", price: "€ 8,50" },
          { name: "Napoli", description: "Salsa di pomodoro, mozzarella, acciughe, olio d'oliva, origano", price: "€ 6,50" },
          { name: "Romana", description: "Salsa di pomodoro, mozzarella, prosciutto cotto, olio d'oliva, origano", price: "€ 7,50" },
          { name: "Quattro gusti", description: "Salsa di pomodoro, mozzarella, prosciutto cotto, carciofi, olio d'oliva, origano", price: "€ 8,00" },
          { name: "Capricciosa", description: "Salsa di pomodoro, mozzarella, prosciutto cotto, carciofi, funghi freschi, würstel, olio d'oliva, origano", price: "€ 9,00" },
          { name: "Diavola", description: "Salsa di pomodoro, mozzarella, salamino piccante, olio d'oliva, origano", price: "€ 7,50" },
          { name: "Crudo", description: "Salsa di pomodoro, mozzarella, prosciutto crudo, olio d'oliva, origano", price: "€ 8,50" },
          { name: "Sfincionella", description: "Salsa di pomodoro, acciughe, cipolla, caciocavallo, pangrattato, olio d'oliva, origano", price: "€ 7,50" },
          { name: "Gustosa", description: "Salsa di pomodoro, mozzarella di bufala, scamorza affumicata, speck, rucola, olio d'oliva, origano", price: "€ 10,00" },
          { name: "Ciliegina", description: "Salsa di pomodoro, mozzarella, funghi freschi, zucchine, caciocavallo, pomodorini", price: "€ 9,00" },
          { name: "Prataiola", description: "Salsa di pomodoro, prosciutto crudo, spinaci*, funghi freschi, olio d'oliva, origano", price: "€ 9,50" },
          { name: "Calzone", description: "Salsa di pomodoro, mozzarella, prosciutto cotto, olio d'oliva, origano", price: "€ 7,50" },
          { name: "Enzo", description: "Salsa di pomodoro, grana padano infornato, olio d'oliva, origano", price: "€ 6,50" },
          { name: "Bird", description: "Salsa di pomodoro, mozzarella di bufala, prosciutto crudo, grana padano, pomodorini, rucola, olio d'oliva, origano", price: "€ 12,50" },
          { name: "Chicken BBQ", description: "Salsa di pomodoro, mozzarella, pollo fritto, patate fritte, salsa barbecue", price: "€ 11,00" },
          { name: "Ida", description: "Salsa di pomodoro, mozzarella, mozzarella di bufala, speck, olio d'oliva, origano", price: "€ 10,00" },
          { name: "Patatosa", description: "Salsa di pomodoro, mozzarella, patate fritte, würstel, olio d'oliva, origano", price: "€ 8,00" },
          { name: "Vegetariana", description: "Salsa di pomodoro, mozzarella, spinaci*, melanzane, peperoni, zucchine, olio d'oliva, origano", price: "€ 9,00" },
          { name: "Parmigiana", description: "Salsa di pomodoro, mozzarella, melanzane, grana padano, olio d'oliva, origano", price: "€ 8,00" },
          { name: "Salsiccia & Funghi", description: "Salsa di pomodoro, salsiccia, mozzarella, funghi freschi, olio d'oliva, origano", price: "€ 8,50" },
          { name: "Porcini", description: "Salsa di pomodoro, mozzarella, funghi porcini, olio d'oliva, origano", price: "€ 10,00" },
          { name: "Campagnola", description: "Salsa di pomodoro, mozzarella, prosciutto crudo, salsiccia, cipolla, peperoni, funghi freschi, olio d'oliva, origano", price: "€ 11,00" },
          { name: "Salmone", description: "Salsa di pomodoro, mozzarella, salmone a fette, olio d'oliva, origano", price: "€ 12,00" },
          { name: "Sindaco", description: "Salsa di pomodoro, caciocavallo, olio d'oliva, origano", price: "€ 7,00" },
          { name: "Marinara", description: "Salsa di pomodoro, acciughe, olio d'oliva, aglio, origano", price: "€ 6,50" },
          { name: "Tonno", description: "Salsa di pomodoro, mozzarella, tonno, cipolla, olio d'oliva, origano", price: "€ 9,00" }
        ]
      },
      {
        title: "Pizze bianche",
        items: [
          { name: "Biancaneve", description: "Mozzarella, olio d'oliva, origano", price: "€ 6,00" },
          { name: "Friarielli", description: "Mozzarella, salsiccia, friarielli, olio d'oliva, origano", price: "€ 9,00" },
          { name: "Bolognese", description: "Mozzarella, mortadella, granella di pistacchio, olio d'oliva, origano", price: "€ 9,00" },
          { name: "Bresaola", description: "Mozzarella di bufala, bresaola, grana padano, rucola, olio d'oliva, origano", price: "€ 12,50" },
          { name: "Quattro formaggi", description: "Mozzarella, emmental, gorgonzola, caciocavallo, olio d'oliva, origano", price: "€ 9,00" },
          { name: "Deliziosa", description: "Mozzarella, mozzarella di bufala, philadelphia, speck infornato, granella di pistacchio, olio d'oliva", price: "€ 11,50" }
        ]
      },
      {
        title: "Covaccini (condimenti crudi)",
        items: [
          { name: "Campana", description: "Mozzarella di bufala, prosciutto crudo, grana padano, rucola, olio d'oliva, origano", price: "€ 11,00" },
          { name: "Caprese", description: "Mozzarella di bufala, pomodoro a fette, basilico, olio d'oliva, origano", price: "€ 9,00" },
          { name: "Norvegese", description: "Salmone affumicato, rucola, olio d'oliva", price: "€ 11,00" },
          { name: "Piemontese", description: "Bresaola, grana padano, rucola, olio d'oliva", price: "€ 11,00" },
          { name: "Pizza pane al limone", description: "Limone, grana padano, pangrattato, olio, sale, pepe", price: "€ 6,00" }
        ]
      },
      {
        title: "Schiacciate",
        items: [
          { name: "Siciliana", description: "Mozzarella, prosciutto cotto, pomodoro a fette, acciughe, olio d'oliva, origano", price: "€ 7,50" },
          { name: "Bird", description: "Mozzarella di bufala, prosciutto crudo, grana padano, pomodorini, rucola, olio d'oliva, origano", price: "€ 11,00" },
          { name: "Contadina", description: "Mozzarella, salsiccia, melanzane, emmental, olio d'oliva, origano", price: "€ 8,00" },
          { name: "Gustosità", description: "Mozzarella di bufala, scamorza affumicata, speck, olio d'oliva, origano", price: "€ 10,00" },
          { name: "Greca", description: "Mozzarella, prosciutto cotto, melanzane, caciocavallo, olio d'oliva, origano", price: "€ 8,50" },
          { name: "Deliziosa", description: "Mozzarella, mozzarella di bufala, philadelphia, speck infornato, granella di pistacchio, olio d'oliva", price: "€ 11,50" },
          { name: "Pane cunsatu", description: "Caciocavallo, pomodoro a fette, acciughe, olio d'oliva, origano", price: "€ 7,00" }
        ]
      },
      {
        title: "Dessert",
        items: [
          { name: "Parfait di mandorle", description: "Almond parfait", price: "€ 6,00" },
          { name: "Cheescake", price: "€ 6,00" },
          { name: "Tiramisù (semifreddo)", price: "€ 5,00" },
          { name: "Cassattelle di ricotta fritte (1 pz.)", description: "Fried ricotta cassatelle (1 pcs)", price: "€ 1,50" },
          { name: "Soufflé al cioccolato", description: "Chocolate souffle", price: "€ 5,00" },
          { name: "Tartufo bianco o nero", description: "White or black truffle", price: "€ 5,00" },
          { name: "Sorbetto al limone", price: "€ 5,00" }
        ]
      },
      {
        title: "Frutta",
        items: [
          { name: "Ananas", description: "Pineapple", price: "€ 5,00" },
          { name: "Cantalupo", description: "Cantaloupe", price: "€ 5,00" },
          { name: "Melone bianco", description: "White melon", price: "€ 5,00" },
          { name: "Frutta mista", description: "Mixed fruit", price: "€ 7,00" },
          { name: "Frutta di stagione", description: "Seasonal fruit", price: "€ 5,00" }
        ]
      },
      {
        title: "Digestivi - Caffè",
        items: [
          { name: "Caffè espresso", price: "€ 1,50" },
          { name: "Caffè decaffeinato", price: "€ 2,00" },
          { name: "Caffè americano", price: "€ 2,50" },
          { name: "Limoncello", price: "€ 4,00" },
          { name: "Amaro", price: "€ 5,00" }
        ]
      },
      {
        title: "Bibite",
        items: [
          { name: "Acqua Minerale (100 cl)", description: "Mineral water 1 lt", price: "€ 2,50" },
          { name: "CocaCola (33 cl)", price: "€ 2,50" },
          { name: "CocaCola Zero (33 cl)", price: "€ 2,50" },
          { name: "Sprite (33 cl)", price: "€ 2,50" },
          { name: "Fanta (33 cl)", price: "€ 2,50" },
          { name: "Lemonsoda (33 cl)", price: "€ 2,50" },
          { name: "Chinotto (33 cl)", price: "€ 2,50" },
          { name: "Acqua Tonica (33 cl)", price: "€ 2,50" },
          { name: "The Pesca-Limone (33 cl)", price: "€ 3,00" },
          { name: "Succo di frutta", price: "€ 3,00" },
          { name: "Red Bull", price: "€ 5,00" }
        ]
      },
      {
        title: "Birre alla spina",
        items: [
          { name: "Moretti Bionda", description: "0,2 lt € 3,50 • 0,4 lt € 6,00 • 1 lt € 12,00" },
          { name: "Moretti Rossa", description: "0,2 lt € 4,00 • 0,4 lt € 7,00 • 1 lt € 14,00" }
        ]
      },
      {
        title: "Birre in bottiglia",
        items: [
          { name: "Heineken (33 cl)", description: "Tipo: Lager • Alcol: 5%", price: "€ 3,50" },
          { name: "Heineken 0.0 (33 cl)", description: "Tipo: Lager • Alcol: 0%", price: "€ 3,50" },
          { name: "Paulaner Weissbier (50 cl)", description: "Tipo: Bianca • Alcol: 5,3%", price: "€ 6,00" },
          { name: "Moretti Zero (33 cl)", description: "Tipo: Radler • Alcol: 0%", price: "€ 3,50" },
          { name: "Corona (33 cl)", description: "Tipo: Lager • Alcol: 4,5%", price: "€ 4,50" },
          { name: "Ceres (33 cl)", description: "Tipo: Strong Ale • Alcol: 7,7%", price: "€ 4,50" },
          { name: "Tennent's (33 cl)", description: "Tipo: Super Strong Lager • Alcol: 9%", price: "€ 4,50" },
          { name: "Peroni Gluten Free (33 cl)", description: "Tipo: Lager senza glutine • Alcol: 4,7%", price: "€ 3,50" },
          { name: "Nastro Azzurro (50 cl)", description: "Tipo: Lager • Alcol: 5,2%", price: "€ 5,00" },
          { name: "Messina ai Cristalli di Sale (50 cl)", description: "Tipo: Lager non filtrata • Alcol: 5%", price: "€ 6,00" },
          { name: "Leffe Blond (75 cl)", description: "Tipo: Ale • Alcol: 6,6%", price: "€ 12,00" },
          { name: "Leffe Radieuse (75 cl)", description: "Tipo: Ale • Alcol: 8,2%", price: "€ 12,00" }
        ]
      },
      {
        title: "Fuori menù",
        items: [
          { name: "Stinco di maiale con patate alla tedesca e crauti" },
          { name: "Ravioli ripieni di gamberi e zucchine con ragù di ricciola" },
          { name: "Carciofo ripieno di salsa sfinzione su fonduta di formaggi" },
          { name: "Moffoletta con porchetta" }
        ]
      }
    ],
    []
  )

  const toggle = (title: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Menù</h1>
            <div className="mt-6 text-lg text-muted-foreground whitespace-pre-line">
              Lunedì-Venerdì 18:30 23:30{'\n'}
              Sabato 18:30 00:00{'\n'}
              Domenica 12:30 15:00{'\n'}
              18:30 23:30
            </div>
          </div>

          <div className="space-y-2">
            {categories.map((cat) => {
              const isOpen = expanded.has(cat.title)
              return (
                <div key={cat.title} className="border border-border rounded-lg overflow-hidden bg-card">
                  <button
                    type="button"
                    onClick={() => toggle(cat.title)}
                    className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-accent/50 transition-colors text-left"
                    aria-expanded={isOpen}
                  >
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">{cat.title}</h2>
                    <div className="flex-shrink-0 ml-4 text-muted-foreground">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen ? (
                    <div className="border-t border-border p-4 md:p-6">
                      <div className="space-y-4">
                        {cat.items.map((item, idx) => (
                          <div
                            key={`${cat.title}-${idx}`}
                            className="flex flex-col md:flex-row gap-4 p-3 rounded-lg hover:bg-accent/30 transition-colors"
                          >
                            {/* Immagine del piatto (se presente) */}
                            {item.image && (
                              <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-border">
                                {item.image.startsWith("data:image") ? (
                                  // Se è base64, usa img normale
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  // Se è un percorso URL, usa Next.js Image
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                    unoptimized={item.image.startsWith("/")}
                                  />
                                )}
                              </div>
                            )}
                            
                            {/* Informazioni del piatto */}
                            <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                              <div className="flex-1">
                                <h3 className="text-base md:text-lg font-semibold">{item.name}</h3>
                                {item.description ? (
                                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                ) : null}
                              </div>
                              {item.price ? (
                                <div className="flex-shrink-0">
                                  <span className="text-base md:text-lg font-bold text-foreground">{item.price}</span>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Torna alla home</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
