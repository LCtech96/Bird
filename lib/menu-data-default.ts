// Dati di default del menu - condivisi tra pagina asporto e admin

export interface Dish {
  name: string
  description: string
  price: string
  image?: string
  visible?: boolean
}

export interface Category {
  title: string
  dishes: Dish[]
}

export const defaultMenuCategories: Category[] = [
  {
    title: "Antipasti di Mare",
    dishes: [
      { name: "Polipetti Murati", description: "Polipetti marinati con olio, limone e prezzemolo", price: "€16.00", visible: true },
      { name: "Ostrica", description: "Ostriche freschissime del giorno", price: "€4.00", visible: true },
      { name: "Insalata di Mare", description: "Polpo, Calamari, Cozze, Vongole, Carote, Sedano", price: "€15.00", visible: true },
      { name: "Caponata di Pesce Spada", description: "Pesce spada, Melanzane, Sedano, Olive, Capperi", price: "€14.00", visible: true },
      { name: "Cocktail di Gamberi", description: "Gamberi, Lattuga, Salsa cocktail", price: "€14.00", visible: true },
      { name: "Gamberi Marinati", description: "Gamberi, Olio, Limone", price: "€14.00", visible: true },
      { name: "Pepata di Cozze", description: "Cozze fresche con pepe nero e vino bianco", price: "€12.00", visible: true },
      { name: "Plateau Frutti di Mare (per 2 persone)", description: "Ostriche, Vongole, Scampi, Sashimi di Salmone, Pesce del Giorno, Caviale 10 gr", price: "€55.00", visible: true },
      { name: "Degustazione Barinello", description: "Selezione speciale del nostro chef", price: "€20.00", visible: true },
      { name: "Souté di Vongole", description: "Vongole fresche in padella con aglio e prezzemolo", price: "€18.00", visible: true },
      { name: "Antipasto di Mare", description: "Selezione di crudi, gamberi, polpo e cozze", price: "€18.00", visible: true },
      { name: "Carpaccio di Pesce Spada", description: "Pesce spada fresco con olio extravergine e limone", price: "€15.00", visible: true },
      { name: "Insalata di Polpo", description: "Polpo bollito con patate, olive e prezzemolo", price: "€12.00", visible: true },
      { name: "Cozze alla Marinara", description: "Cozze fresche con pomodoro, aglio e prezzemolo", price: "€10.00", visible: true },
      { name: "Gamberi in Guazzetto", description: "Gamberi freschi in salsa di pomodoro e vino bianco", price: "€14.00", visible: true }
    ]
  },
  {
    title: "Antipasti di Carne",
    dishes: [
      { name: "Songino, Crudo e Burrata", description: "Songino fresco, prosciutto crudo e burrata cremosa", price: "€12.00", visible: true },
      { name: "Bruschetta Pomodoro", description: "Pane tostato con pomodoro fresco, aglio e basilico", price: "€7.00", visible: true },
      { name: "Misto Caldo", description: "Patatine, Panelle, Crocché", price: "€8.00", visible: true },
      { name: "Tagliere Salumi e Formaggi", description: "Selezione di salumi e formaggi siciliani", price: "€14.00", visible: true }
    ]
  },
  {
    title: "Primi Piatti di Mare",
    dishes: [
      { name: "Tagliolino Ricci e Gambero", description: "Tagliolino fresco con ricci di mare e gamberi", price: "€26.00", visible: true },
      { name: "Spaghetti con Ricci", description: "Spaghetti con ricci di mare freschissimi", price: "€30.00", visible: true },
      { name: "Tagliolino con Gambero", description: "Gambero, Pomodorino, Granello di pistacchio, Lime", price: "€20.00", visible: true },
      { name: "Ravioli di Cernia", description: "Cozze, Vongole, Gambero, Pomodorino", price: "€22.00", visible: true },
      { name: "Spaghetti Cozze e Vongole", description: "Spaghetti con cozze e vongole fresche", price: "€18.00", visible: true },
      { name: "Farfalle al Salmone", description: "Farfalle con salmone fresco e panna", price: "€15.00", visible: true },
      { name: "Tagliolino Gambero e Vongole", description: "Tagliolino, Gambero, Vongole e pistacchio", price: "€22.00", visible: true },
      { name: "Calamarata", description: "Polpetti, Calamari, Pomodorini", price: "€20.00", visible: true },
      { name: "Spaghetti con Vongole", description: "Spaghetti con vongole veraci, aglio, prezzemolo e vino bianco", price: "€18.00", visible: true },
      { name: "Spaghetti Cozze", description: "Cozze, Pomodorini", price: "€16.00", visible: true },
      { name: "Spaghetti con Ragù di Polpo", description: "Spaghetti con ragù di polpo e pomodoro", price: "€18.00", visible: true },
      { name: "Linguine all'Astice", description: "Linguine con astice fresco, pomodorini e basilico", price: "€22.00", visible: true },
      { name: "Risotto ai Frutti di Mare", description: "Risotto cremoso con frutti di mare freschi", price: "€18.00", visible: true },
      { name: "Pasta con Sarde", description: "Pasta tradizionale siciliana con sarde, finocchietto e pinoli", price: "€14.00", visible: true },
      { name: "Bucatini alle Cicale", description: "Bucatini con cicale di mare, pomodorini e prezzemolo", price: "€19.00", visible: true }
    ]
  },
  {
    title: "Primi Piatti di Carne",
    dishes: [
      { name: "Spaghetti alla Norma", description: "Salsa di pomodoro, Melanzane fritte, Ricotta salata", price: "€12.00", visible: true },
      { name: "Spaghetti alla Carbonara", description: "Guanciale, Uova, Pecorino, Pepe", price: "€14.00", visible: true },
      { name: "Paccheri Crema di Funghi, Noci e Guanciale", description: "Paccheri con crema di funghi, noci e guanciale croccante", price: "€15.00", visible: true }
    ]
  },
  {
    title: "Secondi Piatti di Mare",
    dishes: [
      { name: "Polpo Grill con Purea di Patate", description: "Polpo grigliato con purea di patate cremosa", price: "€15.00", visible: true },
      { name: "Frittura di Cappuccetti", description: "Frittura di piccoli pesci freschi", price: "€18.00", visible: true },
      { name: "Pesce Spada Grigliato", description: "Trancio di pesce spada fresco grigliato", price: "€16.00", visible: true },
      { name: "Calamaro Grigliato", description: "Calamaro fresco grigliato con limone", price: "€16.00", visible: true },
      { name: "Grigliata Mista di Pesce (per 2 persone)", description: "Pesce spada, Calamaro grigliato, 2 p. Gamberi", price: "€35.00", visible: true },
      { name: "Frittura di Pesce", description: "Calamaro, Gambero, Latterino", price: "€18.00", visible: true },
      { name: "Gamberi Grill", description: "Gamberi", price: "€16.00", visible: true },
      { name: "Branzino al Sale", description: "Branzino intero cotto al sale grosso con contorno", price: "€22.00", visible: true },
      { name: "Orata al Forno", description: "Orata fresca al forno con patate e pomodorini", price: "€20.00", visible: true },
      { name: "Calamari Ripieni", description: "Calamari ripieni con pangrattato, aglio, prezzemolo e uova", price: "€16.00", visible: true },
      { name: "Tonno alla Siciliana", description: "Trancio di tonno fresco con cipolla, capperi e olive", price: "€23.00", visible: true }
    ]
  },
  {
    title: "Secondi Piatti di Carne",
    dishes: [
      { name: "Fetta di Arrosto Panato", description: "Fetta di arrosto panato e croccante", price: "€12.00", visible: true },
      { name: "Tomahawk", description: "Bistecca Tomahawk di prima qualità", price: "€5.00", visible: true },
      { name: "Angus", description: "Bistecca Angus (per etto)", price: "€9.00", visible: true },
      { name: "Grigliata Mista", description: "Grigliata mista di carni", price: "€20.00", visible: true },
      { name: "Stinco di Maiale con Patate al Forno", description: "Stinco di maiale con patate al forno", price: "€18.00", visible: true },
      { name: "Pollo Grigliato o Panato", description: "Pollo grigliato o panato a scelta", price: "€10.00", visible: true }
    ]
  },
  {
    title: "Contorni",
    dishes: [
      { name: "Insalata Verde", description: "Insalata verde fresca", price: "€3.00", visible: true },
      { name: "Insalata Mista", description: "Insalata fresca di stagione", price: "€4.00", visible: true },
      { name: "Patate al Forno", description: "Patate al forno con rosmarino", price: "€5.00", visible: true },
      { name: "Patate Fritte", description: "Patate fritte croccanti", price: "€5.00", visible: true },
      { name: "Verdure Grigliate", description: "Melanzane, zucchine e peperoni grigliati", price: "€5.00", visible: true },
      { name: "Coperto", description: "Coperto per persona", price: "€2.50", visible: true }
    ]
  },
  {
    title: "Dolci",
    dishes: [
      { name: "Sorbetto al Limoncello", description: "Sorbetto fresco al limoncello", price: "€6.00", visible: true },
      { name: "Flute Frutti di Bosco", description: "Flute con frutti di bosco freschi", price: "€6.00", visible: true },
      { name: "Tiramisù", description: "Tiramisù fatto in casa", price: "€6.00", visible: true },
      { name: "Cassatina", description: "Piccola cassata siciliana", price: "€4.00", visible: true },
      { name: "Cannolo Scomposto", description: "Cannolo in versione moderna e scomposta", price: "€5.00", visible: true },
      { name: "Cheesecake", description: "Cheesecake al Nutella o pistacchio", price: "€6.00", visible: true },
      { name: "Cannolo", description: "Cannolo tradizionale con ricotta fresca", price: "€4.00", visible: true },
      { name: "Crepes Nutella", description: "Crepes calde con Nutella", price: "€5.00", visible: true },
      { name: "Tortino Cuore Caldo", description: "Tortino al cioccolato o pistacchio", price: "€6.00", visible: true },
      { name: "Cannolo Siciliano", description: "Cannolo con ricotta fresca e cioccolato", price: "€6.00", visible: true },
      { name: "Cassata Siciliana", description: "Cassata tradizionale con ricotta e canditi", price: "€7.00", visible: true },
      { name: "Granita", description: "Granita al limone, mandorla o caffè", price: "€5.00", visible: true }
    ]
  },
  {
    title: "Birre",
    dishes: [
      { name: "Heineken", description: "33 cl", price: "€4.00", visible: true },
      { name: "Beck's", description: "33 cl", price: "€4.00", visible: true },
      { name: "Ceres", description: "", price: "€5.00", visible: true },
      { name: "Tennent's", description: "33 cl", price: "€5.00", visible: true },
      { name: "Nastro Azzurro", description: "33 cl", price: "€4.00", visible: true },
      { name: "Nastro Azzurro 0.0", description: "33 cl", price: "€4.00", visible: true },
      { name: "Corona", description: "33 cl", price: "€5.00", visible: true },
      { name: "Daura Gluten Free", description: "", price: "€5.00", visible: true },
      { name: "Paulaner", description: "50 cl", price: "€6.00", visible: true },
      { name: "Ichnusa", description: "33 cl", price: "€5.00", visible: true },
      { name: "Messina", description: "33 cl", price: "€5.00", visible: true },
      { name: "Leffe", description: "33 cl", price: "€5.00", visible: true },
      { name: "Leffe Rossa", description: "33 cl", price: "€5.00", visible: true }
    ]
  },
  {
    title: "Vini Bianchi",
    dishes: [
      { name: "Rosa dei Venti (Gorghi Tondi) Nerello Mascalese", description: "", price: "€24.00", visible: true },
      { name: "Kheire (Gorghi Tondi) Grillo Riserva 2023", description: "", price: "€50.00", visible: true },
      { name: "Marameo (Gorghi Tondi) Blend Biologico", description: "", price: "€28.00", visible: true },
      { name: "Coste a Preola (Gorghi Tondi) Grillo", description: "", price: "€24.00", visible: true },
      { name: "Tenuta Regaleali Leone", description: "", price: "€35.00", visible: true },
      { name: "Maria Costanza", description: "", price: "€38.00", visible: true },
      { name: "Grillo (Cantina Musita)", description: "", price: "€22.00", visible: true },
      { name: "Chardonnay (Cantina Musita)", description: "", price: "€22.00", visible: true },
      { name: "Catarratto Pinot Grigio (Cantina Musita)", description: "", price: "€22.00", visible: true },
      { name: "Organicus Catarratto (Cantina Musita)", description: "", price: "€28.00", visible: true },
      { name: "Organicus Zibibbo (Cantina Musita)", description: "", price: "€28.00", visible: true },
      { name: "Passo Calcara (Cantina Musita)", description: "", price: "€30.00", visible: true },
      { name: "Reggiterre (Cantina Musita)", description: "", price: "€25.00", visible: true },
      { name: "Organicus Grillo (Cantina Musita)", description: "", price: "€28.00", visible: true }
    ]
  },
  {
    title: "Vini Frizzanti e Spumanti",
    dishes: [
      { name: "Charme", description: "", price: "€30.00", visible: true },
      { name: "Acqua Marina", description: "", price: "€22.00", visible: true },
      { name: "Coppola Anymus", description: "", price: "€25.00", visible: true },
      { name: "Acqua Marina Rosé", description: "", price: "€22.00", visible: true },
      { name: "Col Sandaco Rosé", description: "", price: "€30.00", visible: true },
      { name: "Col Sandaco Brut", description: "", price: "€20.00", visible: true },
      { name: "Metodo Ancestrale \"Barinello\"", description: "", price: "€35.00", visible: true }
    ]
  },
  {
    title: "Vini Rossi",
    dishes: [
      { name: "Coste a Preola (Gorghi Tondi) Nero d'Avola", description: "", price: "€24.00", visible: true },
      { name: "Meridiano (Gorghi Tondi) Syrah", description: "", price: "€24.00", visible: true },
      { name: "Frappato Organicus", description: "", price: "€28.00", visible: true },
      { name: "Reggiterre", description: "", price: "€25.00", visible: true },
      { name: "Col Sandago Camoi", description: "", price: "€38.00", visible: true },
      { name: "Maria Costanza", description: "", price: "€40.00", visible: true }
    ]
  },
  {
    title: "Bibite",
    dishes: [
      { name: "Acqua", description: "50 cl", price: "€1.50", visible: true },
      { name: "Acqua", description: "1 lt", price: "€3.00", visible: true },
      { name: "Coca Cola", description: "33 cl", price: "€2.50", visible: true },
      { name: "Coca Cola Zero", description: "33 cl", price: "€2.50", visible: true },
      { name: "Fanta", description: "33 cl", price: "€2.50", visible: true },
      { name: "Sprite", description: "33 cl", price: "€2.50", visible: true },
      { name: "Chinotto", description: "33 cl", price: "€2.50", visible: true },
      { name: "Thé Pesca / Limone", description: "", price: "€2.50", visible: true },
      { name: "Schweppes Lemon / Tonic", description: "", price: "€2.50", visible: true },
      { name: "Fever-Tree", description: "Mediterranean, Indian, Fever-Tree Ginger Beer, Fever-Tree Pink Grapefruit", price: "€3.00", visible: true }
    ]
  },
  {
    title: "Caffetteria",
    dishes: [
      { name: "Caffè", description: "", price: "€1.50", visible: true },
      { name: "Caffè Doppio", description: "", price: "€3.00", visible: true },
      { name: "Caffè Macchiato", description: "", price: "€1.50", visible: true },
      { name: "Caffè Americano", description: "", price: "€2.50", visible: true },
      { name: "Decaffeinato", description: "", price: "€1.80", visible: true },
      { name: "Cappuccino", description: "", price: "€2.50", visible: true },
      { name: "Cappuccino di Soia", description: "", price: "€2.80", visible: true },
      { name: "Cappuccino senza Lattosio", description: "", price: "€2.80", visible: true },
      { name: "Macchiatone", description: "", price: "€2.00", visible: true },
      { name: "Latte Bianco", description: "", price: "€1.80", visible: true },
      { name: "Latte Macchiato", description: "", price: "€2.50", visible: true },
      { name: "Thé Caldo", description: "", price: "€3.50", visible: true },
      { name: "Tisane", description: "", price: "€3.50", visible: true },
      { name: "Infusi", description: "", price: "€3.50", visible: true },
      { name: "Succo di Frutta", description: "", price: "€2.50", visible: true },
      { name: "Succo di Melograno", description: "", price: "€3.00", visible: true },
      { name: "Succo al Mirtillo", description: "", price: "€3.00", visible: true },
      { name: "Ginseng piccolo", description: "", price: "€1.80", visible: true },
      { name: "Ginseng grande", description: "", price: "€2.50", visible: true },
      { name: "Cremino", description: "", price: "€4.00", visible: true },
      { name: "Cornetto", description: "", price: "€1.50", visible: true },
      { name: "Cornetto Special", description: "", price: "€1.80", visible: true },
      { name: "Mignon Dolce / Salato", description: "", price: "€1.00", visible: true },
      { name: "Rosticceria", description: "", price: "€2.00", visible: true },
      { name: "Rosticceria Special", description: "", price: "€2.50", visible: true }
    ]
  },
  {
    title: "Drink List",
    dishes: [
      { name: "MILLER'S", description: "Gin Martin Miller's, Tonica, Fragole, Bacche di ginepro, Pepe nero in grani", price: "€12.00", visible: true },
      { name: "NEGRONI DEL CAPITANO", description: "Bitter Bianco Luxardo, Vermouth Rosso, Mezcal 100% Agave, Liquore al caffè, Orange Twist", price: "€9.00", visible: true },
      { name: "PALOMA", description: "Tequila Espolon 100% Agave, Succo di limone, Lime, Soda al Pompelmo rosa, Sale", price: "€9.00", visible: true },
      { name: "TOMMY'S MEZCAL MARGARITA", description: "Mezcal 100% Agave, Succo di limone, Lime, Sciroppo, Sale", price: "€9.00", visible: true },
      { name: "BASIL SMASH", description: "Gin, succo di limone, zucchero di canna liquido, basilico fresco shakerato e filtrato", price: "€8.00", visible: true },
      { name: "VODKA SOUR AL MARACUJA", description: "Vodka, Succo di limone, Zucchero di canna liquido, Purea di Maracuja, Menta", price: "€8.00", visible: true }
    ]
  },
  {
    title: "Cocktail",
    dishes: [
      { name: "BARINELLO", description: "Ventuno, Prosecco, Soda", price: "€8.00", visible: true },
      { name: "SPRITZ", description: "Aperol, Prosecco, Soda", price: "€8.00", visible: true },
      { name: "MOSCOW MULE", description: "Vodka, Ginger Beer, Lime", price: "€8.00", visible: true },
      { name: "LONDON MULE", description: "Gin, Ginger Beer, Lime", price: "€8.00", visible: true },
      { name: "NEGRONI", description: "Gin, Bitter Campari, Martini", price: "€8.00", visible: true },
      { name: "GIN TONIC", description: "Gin, Tonica", price: "€8.00", visible: true },
      { name: "GIN LEMON", description: "Gin, Limoncello", price: "€8.00", visible: true },
      { name: "GIN FIZZ", description: "Gin, Succo di Lime, Zucchero liquido, Tonica", price: "€8.00", visible: true },
      { name: "VODKA FIZZ", description: "Vodka, Succo di Lime, Zucchero liquido, Tonica", price: "€8.00", visible: true },
      { name: "NEGROSKI", description: "Vodka, Bitter Campari, Martini Rosso", price: "€8.00", visible: true },
      { name: "NEGRONI SBAGLIATO", description: "Bitter Campari, Martini Rosso, Prosecco", price: "€8.00", visible: true },
      { name: "LONG ISLAND", description: "Vodka, Gin, Rum, Triple sec, Sweet&Sour, Coca-Cola", price: "€8.00", visible: true },
      { name: "CUBA LIBRE", description: "Rum, Sweet&Sour, Coca-Cola", price: "€8.00", visible: true },
      { name: "COCKTAIL MARTINI", description: "Gin, Martini Dry", price: "€8.00", visible: true },
      { name: "MANHATTAN", description: "Whisky, Martini Rosso, Angostura", price: "€8.00", visible: true },
      { name: "AMERICANO", description: "Bitter Campari, Martini Rosso, Angostura", price: "€8.00", visible: true },
      { name: "COSMOPOLITAN", description: "Vodka, Triple sec, Succo di Mirtillo, Lime", price: "€8.00", visible: true },
      { name: "MARGARITA", description: "Tequila, Triple sec, Succo di Lime", price: "€8.00", visible: true },
      { name: "HUGO", description: "St. Germain, Prosecco, Soda", price: "€10.00", visible: true },
      { name: "TEQUILA SUNRISE", description: "Tequila, Succo di Arancia, Granatina", price: "€8.00", visible: true },
      { name: "DAIQUIRI", description: "Rum Bianco, Lime, Zucchero liquido", price: "€8.00", visible: true },
      { name: "BELLINI", description: "Prosecco, Purea di Pesca", price: "€8.00", visible: true },
      { name: "ROSSINI", description: "Prosecco, Purea di Fragole", price: "€8.00", visible: true },
      { name: "PIÑA COLADA", description: "Rum Chiaro, Latte di Cocco, Succo di Ananas", price: "€8.00", visible: true },
      { name: "SEX ON THE BEACH", description: "Vodka, Liquore alla Pesca, Succo di Mirtillo, Arancia", price: "€8.00", visible: true },
      { name: "JAPAN ICE TEA", description: "Vodka, Gin, Rum, Midori, Sweet&Sour, Limonata", price: "€8.00", visible: true },
      { name: "BLOODY MARY", description: "Vodka, Succo di Pomodoro, Lime, Worcestershire, Sale, Pepe, Sedano", price: "€8.00", visible: true }
    ]
  },
  {
    title: "Muddled Cocktails",
    dishes: [
      { name: "CAIPIRINHA", description: "Cachaça, Lime, Zucchero di canna", price: "€10.00", visible: true },
      { name: "CAIPIROSKA", description: "Vodka, Lime, Zucchero di canna", price: "€10.00", visible: true },
      { name: "MOJITO", description: "Rum cubano bianco, Lime, Zucchero di canna", price: "€10.00", visible: true },
      { name: "CAIPIRISSIMA", description: "Rum Bianco, Lime, Zucchero di canna", price: "€10.00", visible: true },
      { name: "CUBA LIBRE PESTATO", description: "Rum cubano Ambrato, Lime, Zucchero di canna, Coca Cola", price: "€10.00", visible: true }
    ]
  },
  {
    title: "Frozen",
    dishes: [
      { name: "MARGARITA FROZEN", description: "Tequila, Succo di Lime, Cointreau", price: "€10.00", visible: true },
      { name: "PIÑA COLADA FROZEN", description: "Rum Bianco, Latte di Cocco, Succo di ananas", price: "€10.00", visible: true },
      { name: "DAIQUIRI FROZEN", description: "Rum Bianco, Succo di Lime", price: "€10.00", visible: true },
      { name: "DAIQUIRI STRAWBERRY FROZEN", description: "Rum Bianco, Lime, Sciroppo alla Fragola", price: "€10.00", visible: true }
    ]
  },
  {
    title: "Non-Alcoholic drinks",
    dishes: [
      { name: "EXOTIC", description: "Succo di arancia, Succo di ananas, Sciroppo di Papaya", price: "€6.00 / €8.00", visible: true },
      { name: "FRUIT", description: "Succo di arancia, Succo di ananas, Sciroppo alla Fragola", price: "€6.00 / €8.00", visible: true },
      { name: "VIRGIN MOJITO", description: "Succo, Menta, Succo di lime, Zucchero bianco", price: "€6.00 / €8.00", visible: true },
      { name: "VIRGIN PINA COLADA", description: "Latte di Cocco, Succo di ananas", price: "€6.00 / €8.00", visible: true },
      { name: "VIRGIN BLOODY MARY", description: "Succo di pomodoro, Succo di lime, Sale, Pepe, Worcestershire, Tabasco", price: "€6.00 / €8.00", visible: true },
      { name: "ORANGE", description: "Succo di arancia, Granatina, Limonata", price: "€6.00 / €8.00", visible: true }
    ]
  },
  {
    title: "Gin",
    dishes: [
      { name: "ROKU", description: "", price: "€15.00", visible: true },
      { name: "SAKURAD", description: "", price: "€15.00", visible: true },
      { name: "PALMA", description: "", price: "€16.00", visible: true },
      { name: "MALPY LIMONE", description: "", price: "€12.00", visible: true },
      { name: "MALPY ORIGINALE", description: "", price: "€12.00", visible: true },
      { name: "MALPY ARANCIA", description: "", price: "€12.00", visible: true },
      { name: "TANQUERAY", description: "", price: "€8.00", visible: true },
      { name: "TANQUERAY 0.0", description: "", price: "€8.00", visible: true },
      { name: "TANQUERAY TEN", description: "", price: "€12.00", visible: true },
      { name: "BOMBAY", description: "", price: "€9.00", visible: true },
      { name: "GIN MARE", description: "", price: "€12.00", visible: true },
      { name: "HENDRICKS", description: "", price: "€12.00", visible: true },
      { name: "MALPY POMPELMO ROSA", description: "", price: "€12.00", visible: true },
      { name: "NORDES", description: "", price: "€12.00", visible: true },
      { name: "DOLCE VITA", description: "", price: "€12.00", visible: true },
      { name: "PORTOFINO", description: "", price: "€16.00", visible: true },
      { name: "MARTIN MILLERS", description: "", price: "€10.00", visible: true }
    ]
  },
  {
    title: "Vodka",
    dishes: [
      { name: "SMIRNOFF", description: "", price: "€8.00", visible: true },
      { name: "MOSCOVSKAYA", description: "", price: "€8.00", visible: true },
      { name: "BELVEDERE", description: "", price: "€12.00", visible: true },
      { name: "GREY GOOSE", description: "", price: "€12.00", visible: true },
      { name: "BELUGA", description: "", price: "€14.00", visible: true }
    ]
  },
  {
    title: "Rum",
    dishes: [
      { name: "JACAPA 23", description: "", price: "€12.00", visible: true },
      { name: "DIPLOMATICO", description: "", price: "€10.00", visible: true },
      { name: "DON PAPA", description: "", price: "€12.00", visible: true },
      { name: "ANNIVERSARIO", description: "", price: "€8.00", visible: true },
      { name: "LEGENDARIO", description: "", price: "€8.00", visible: true },
      { name: "CAPTAIN MORGAN BIANCO", description: "", price: "€8.00", visible: true },
      { name: "CAPTAIN MORGAN SCURO", description: "", price: "€8.00", visible: true }
    ]
  },
  {
    title: "Bitters",
    dishes: [
      { name: "JAGERMEISTER", description: "", price: "€5.00", visible: true },
      { name: "AVERNA", description: "", price: "€5.00", visible: true },
      { name: "MONTE POLIZO", description: "", price: "€5.00", visible: true },
      { name: "MONTENEGRO", description: "", price: "€5.00", visible: true },
      { name: "AMARO AMARA", description: "", price: "€5.00", visible: true },
      { name: "UNICUM", description: "", price: "€5.00", visible: true },
      { name: "PETRUS", description: "", price: "€5.00", visible: true },
      { name: "AMARO DEL CAPO", description: "", price: "€5.00", visible: true },
      { name: "FERNET", description: "", price: "€5.00", visible: true }
    ]
  },
  {
    title: "Liqueurs",
    dishes: [
      { name: "ZIBIBBO", description: "", price: "€5.00", visible: true },
      { name: "MARSALA", description: "", price: "€5.00", visible: true },
      { name: "DISARONNO", description: "", price: "€5.00", visible: true },
      { name: "LIMONCELLO", description: "", price: "€5.00", visible: true },
      { name: "SAMBUCA", description: "", price: "€5.00", visible: true },
      { name: "MALIBU", description: "", price: "€5.00", visible: true },
      { name: "COINTREAU", description: "", price: "€5.00", visible: true },
      { name: "BAYLES", description: "", price: "€5.00", visible: true },
      { name: "KAHLUA", description: "", price: "€5.00", visible: true },
      { name: "PASSOA", description: "", price: "€5.00", visible: true },
      { name: "MARTINI BIANCO", description: "", price: "€5.00", visible: true },
      { name: "MARTINI ROSSO", description: "", price: "€5.00", visible: true },
      { name: "CAMPARI", description: "", price: "€5.00", visible: true }
    ]
  },
  {
    title: "Whisky",
    dishes: [
      { name: "JACK DANIEL'S", description: "", price: "€6.00", visible: true },
      { name: "JACK DANIEL'S HONEY", description: "", price: "€6.00", visible: true },
      { name: "JACK DANIEL'S FIRE", description: "", price: "€2.00", visible: true },
      { name: "FIREBALL", description: "", price: "€6.00", visible: true },
      { name: "JAMESON IRISH", description: "", price: "€6.00", visible: true },
      { name: "RED LABEL", description: "", price: "€6.00", visible: true },
      { name: "BALLANTINE'S", description: "", price: "€6.00", visible: true },
      { name: "SOUTHERN COMFORT", description: "", price: "€6.00", visible: true },
      { name: "TALISKER 10 anni", description: "", price: "€12.00", visible: true },
      { name: "OBAN 14 anni", description: "", price: "€14.00", visible: true },
      { name: "LAGAVULIN 16 anni", description: "", price: "€14.00", visible: true },
      { name: "BULLEIT", description: "", price: "€8.00", visible: true }
    ]
  },
  {
    title: "Grappa",
    dishes: [
      { name: "903 BIANCA", description: "", price: "€5.00", visible: true },
      { name: "903 BARRIQUE", description: "", price: "€5.00", visible: true },
      { name: "OF BARRIQUE", description: "", price: "€8.00", visible: true }
    ]
  },
  {
    title: "Champagne",
    dishes: [
      { name: "MARTIN ORSYN", description: "", price: "€55.00", visible: true },
      { name: "FERRARI", description: "", price: "€60.00", visible: true },
      { name: "BERLUCCHI", description: "", price: "€60.00", visible: true },
      { name: "VEUVE CLICQUOT", description: "", price: "€100.00", visible: true },
      { name: "MOËT & CHANDON", description: "", price: "€100.00", visible: true },
      { name: "CÀ DEL BOSCO", description: "", price: "€80.00", visible: true }
    ]
  },
  {
    title: "Tequila",
    dishes: [
      { name: "Tequila", description: "Selezione disponibile", price: "Su richiesta", visible: true }
    ]
  }
]


