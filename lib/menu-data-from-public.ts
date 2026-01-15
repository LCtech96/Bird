// Dati del menu dalla pagina pubblica convertiti per l'admin
// Questi sono i dati presenti nella pagina /menu

import { Category, Dish } from "./menu-data-default"

// Converti i dati dalla pagina pubblica (items) alla struttura admin (dishes)
export const menuCategoriesFromPublic: Category[] = [
  {
    title: "Piatto del giorno",
    dishes: [
      { name: "Per il piatto del giorno chiedere al maître di sala", description: "For the dish of the day ask the maître hall", price: "", visible: true }
    ]
  },
  {
    title: "Spritz",
    dishes: [
      { name: "Aperol Spritz", description: "Aperol, Prosecco, soda", price: "€ 8,00", visible: true },
      { name: "Campari Spritz", description: "Campari, Prosecco, soda", price: "€ 8,00", visible: true },
      { name: "Hugo Spritz", description: "Prosecco, St. Germain, soda", price: "€ 9,00", visible: true },
      { name: "Italicus Spritz", description: "Prosecco, Italicus Bergomotto", price: "€ 9,00", visible: true },
      { name: "Sarti Spritz", description: "Sarti, Prosecco, soda", price: "€ 9,00", visible: true }
    ]
  },
  {
    title: "Aperitivi",
    dishes: [
      { name: "Sambitter", description: "Bitter analcolico", price: "€ 5,00", visible: true },
      { name: "Martini", description: "Bianco-Rosso-Dry", price: "€ 6,00", visible: true },
      { name: "Americano", description: "Bitter Campari, Martini Rosso", price: "€ 7,00", visible: true },
      { name: "Negroni", description: "Bitter Campari, Martini Rosso, Gin", price: "€ 7,00", visible: true },
      { name: "Cocktail Martini", description: "Gin, Martini dry", price: "€ 8,00", visible: true },
      { name: "Gin Tonic", description: "Gin, Acqua Tonica", price: "€ 7,00", visible: true },
      { name: "Gin Lemon", description: "Gin, Lemonsoda", price: "€ 7,00", visible: true },
      { name: "Vodka Tonic", description: "Vodka, Acqua tonica", price: "€ 7,00", visible: true },
      { name: "Cuba Libre", description: "Rum, CocaCola, Limone", price: "€ 7,00", visible: true },
      { name: "Ricard-Pernod", description: "Ricard-Pernod, Acqua", price: "€ 6,00", visible: true }
    ]
  },
  {
    title: "Antipasti di pesce",
    dishes: [
      { name: "Cozze scoppiate", description: "Cozze", price: "€ 12,00", visible: true },
      { name: "Zuppa di cozze", description: "Cozze, aglio, olio d'oliva, peperoncino, salsa, prezzemolo", price: "€ 12,00", visible: true },
      { name: "Cocktail di gamberi*", description: "Gamberi, lattuga, salsa rosa", price: "€ 15,00", visible: true },
      { name: "Insalata di mare*", description: "Polpo, cozze, gamberi*, calamaro o totano, prezzemolo, olio, limone", price: "€ 15,00", visible: true },
      { name: "Delizia mediterranea", description: "Insalata di mare, salmone, cocktail di gamberi, marlin affumicato, prezzemolo", price: "€ 18,00", visible: true },
      { name: "Gamberi marinati* (8 pz.)", description: "Gamberi rossi, limone, olio d'oliva, peperoncino, prezzemolo", price: "€ 20,00", visible: true },
      { name: "Ostriche (cad.)", description: "Oyster", price: "€ 4,00", visible: true }
    ]
  },
  {
    title: "Antipasti di carne",
    dishes: [
      { name: "Bruschette al pomodoro", description: "Pane tostato, pomodoro, aglio, olio d'oliva, basilico", price: "€ 6,00", visible: true },
      { name: "Misto Caldo Fritto", description: "Patatine, panelle, arancinetta, crocchette di patate", price: "€ 6,00", visible: true },
      { name: "Patate Fritte*", description: "Patate", price: "€ 4,00", visible: true },
      { name: "Caprese", description: "Prosciutto crudo, mozzarella di bufala, pomodorini, basilico, olio d'oliva", price: "€ 12,00", visible: true },
      { name: "Carpaccio di bresaola", description: "Bresaola, rucola, scaglie di grana, olio d'oliva, limone", price: "€ 11,00", visible: true },
      { name: "Tartare di filetto", description: "Filetto tritato, rucola, cipolla rossa, frutto del cappero, glassa di aceto balsamico, olio d'oliva, limone", price: "€ 20,00", visible: true }
    ]
  },
  {
    title: "Primi",
    dishes: [
      { name: "Spaghetti alle vongole", description: "Vongole, aglio, olio d'oliva, peperoncino, vino bianco, prezzemolo", price: "€ 22,00", visible: true },
      { name: "Spaghetti allo scoglio", description: "Cozze, vongole, gamberi*, aglio, olio d'oliva, peperoncino, vino bianco, prezzemolo", price: "€ 16,00", visible: true },
      { name: "Farfalle al salmone", description: "Salmone, salsa di pomodoro, panna, burro, cipolla, brandy", price: "€ 12,00", visible: true },
      { name: "Risotto alla marinara", description: "Cozze, vongole, gamberi*, aglio, olio d'oliva, vino bianco, salsa di pomodoro, prezzemolo", price: "€ 16,00", visible: true },
      { name: "Risotto al gambero con crema di zucca", description: "Gamberi*, crema di zucca, cipolla, panna, olio d'oliva, pepe", price: "€ 15,00", visible: true },
      { name: "Pennette Bird", description: "Gamberi*, pesto genovese, rucola, zucchine, salsa di pomodoro, panna, aglio, olio d'oliva, prezzemolo", price: "€ 15,00", visible: true },
      { name: "Pennette alla francescana", description: "Ragù di carne, prosciutto cotto, funghi freschi, panna, olio d'oliva, prezzemolo", price: "€ 13,00", visible: true },
      { name: "Spaghetti alla carbonara", description: "Pancetta, tuorlo d'uovo, burro", price: "€ 14,00", visible: true }
    ]
  },
  {
    title: "Secondi di pesce",
    dishes: [
      { name: "Pesce fresco", description: "Prezzo al Kg.", price: "€ 60,00 / Kg", visible: true },
      { name: "Pesce fresco in umido", description: "Prezzo al Kg.", price: "€ 60,00 / Kg", visible: true },
      { name: "Frittura mista fresca", description: "Prezzo al Kg.", price: "€ 50,00 / Kg", visible: true },
      { name: "Totano fresco alla griglia", description: "Prezzo al Kg.", price: "€ 45,00 / Kg", visible: true },
      { name: "Totano fresco fritto", description: "Prezzo al Kg.", price: "€ 45,00 / Kg", visible: true },
      { name: "Calamaro* alla griglia", description: "Grilled squid", price: "€ 18,00", visible: true },
      { name: "Frittura mista*", description: "Calamari, gamberi", price: "€ 20,00", visible: true },
      { name: "Frittura di calamaretti*", description: "Fried small squid", price: "€ 13,00", visible: true },
      { name: "Pesce spada alla griglia*", description: "Prezzo al Kg.", price: "€ 45,00 / Kg", visible: true },
      { name: "Gamberoni alla griglia*", description: "Grilled prawns", price: "€ 35,00", visible: true },
      { name: "Grigliata mista di pesce*", description: "(Pesce spada, calamaro, gamberoni 2 pz.)", price: "€ 25,00", visible: true }
    ]
  },
  {
    title: "Secondi di carne",
    dishes: [
      { name: "Bistecca alla griglia", description: "Prezzo al Kg.", price: "€ 45,00 / Kg", visible: true },
      { name: "Tagliata di Angus Irlandese con rucola e grana", description: "Prezzo al Kg.", price: "€ 50,00 / Kg", visible: true },
      { name: "Filetto alla griglia", description: "Prezzo al Kg.", price: "€ 70,00 / Kg", visible: true },
      { name: "Grigliata mista di carne", description: "Salsiccia, involtini, coscia di pollo, puntine di maiale", price: "€ 18,00", visible: true },
      { name: "Involtini di carne", description: "Prosciutto cotto, formaggio, pomodoro, mollica", price: "€ 12,00", visible: true },
      { name: "Coscia di pollo alla piastra", description: "Grilled chicken leg", price: "€ 12,00", visible: true },
      { name: "Hamburger* 220 gr.", description: "Hamburger 220g, panino 130g, insalata, pomodoro, patate dippers, anelli di cipolla", price: "€ 13,00", visible: true },
      { name: "Cheeseburger con Bacon Special 220 gr.", description: "Hamburger 220g, panino 130g, cheddar, bacon, insalata, pomodoro, patate dippers, anelli di cipolla", price: "€ 15,00", visible: true }
    ]
  },
  {
    title: "Contorni",
    dishes: [
      { name: "Patate* fritte", description: "French fries", price: "€ 4,00", visible: true },
      { name: "Patate* fritte Dippers", description: "Dippers french fries", price: "€ 5,00", visible: true },
      { name: "Patate al forno", description: "Baked potatoes", price: "€ 6,00", visible: true },
      { name: "Verdure grigliate", description: "Grilled vegetables", price: "€ 7,00", visible: true },
      { name: "Spinaci al burro", description: "Buttered spinach", price: "€ 5,00", visible: true },
      { name: "Insalata verde", description: "Green salad", price: "€ 4,00", visible: true },
      { name: "Insalata contadina", description: "Pomodoro, cipolla, acciughe, olive, origano", price: "€ 6,00", visible: true },
      { name: "Insalata mista", description: "Pomodoro, lattuga iceberg, radicchio, mais", price: "€ 6,00", visible: true }
    ]
  },
  {
    title: "Insalatone",
    dishes: [
      { name: "Insalata Bird", description: "Lattuga iceberg, cuori di carciofi, gamberetti*, mais, scaglie di grana padano", price: "€ 12,00", visible: true },
      { name: "Insalata Capricciosa", description: "Lattuga iceberg, cuori di palma, radicchio, mais, rucola, pomodoro, carote", price: "€ 9,00", visible: true },
      { name: "Insalata Tottosole", description: "Bresaola, mozzarella di bufala, cuori di palma, radicchio, carote, scaglie di grana padano, funghi freschi", price: "€ 13,00", visible: true },
      { name: "Caesar Salad", description: "Pollo grigliato, lattuga, radicchio, carote, mais, salsa caesar", price: "€ 12,00", visible: true }
    ]
  },
  {
    title: "Pizze Gourmet",
    dishes: [
      { name: "Pistacchiosa", description: "Stracciatella, mortadella, crema di pistacchio, pomodorini rossi e gialli, olio d'oliva, origano", price: "€ 14,00", visible: true },
      { name: "Trentina", description: "Mozzarella di bufala, speck, gorgonzola, noci, olio d'oliva, origano", price: "€ 14,00", visible: true },
      { name: "Pantesca", description: "Mozzarella di bufala, capperi, cipolla, pomodorino giallo, acciughe, olio d'oliva, origano", price: "€ 13,00", visible: true },
      { name: "Datterino", description: "Mozzarella di bufala, pomodorino giallo, pomodoro secco, prosciutto crudo, olio d'oliva, origano", price: "€ 13,00", visible: true }
    ]
  },
  {
    title: "Pizza della settimana",
    dishes: [
      { name: "Vellutata di radicchio, bufala in cottura, speck e grana", description: "", price: "", visible: true }
    ]
  },
  {
    title: "Pizze",
    dishes: [
      { name: "Margherita", description: "Salsa di pomodoro, mozzarella, olio d'oliva, origano", price: "€ 6,50", visible: true },
      { name: "Bufala", description: "Salsa di pomodoro, mozzarella di bufala, olio d'oliva, origano", price: "€ 8,50", visible: true },
      { name: "Napoli", description: "Salsa di pomodoro, mozzarella, acciughe, olio d'oliva, origano", price: "€ 6,50", visible: true },
      { name: "Romana", description: "Salsa di pomodoro, mozzarella, prosciutto cotto, olio d'oliva, origano", price: "€ 7,50", visible: true },
      { name: "Quattro gusti", description: "Salsa di pomodoro, mozzarella, prosciutto cotto, carciofi, olio d'oliva, origano", price: "€ 8,00", visible: true },
      { name: "Capricciosa", description: "Salsa di pomodoro, mozzarella, prosciutto cotto, carciofi, funghi freschi, würstel, olio d'oliva, origano", price: "€ 9,00", visible: true },
      { name: "Diavola", description: "Salsa di pomodoro, mozzarella, salamino piccante, olio d'oliva, origano", price: "€ 7,50", visible: true },
      { name: "Crudo", description: "Salsa di pomodoro, mozzarella, prosciutto crudo, olio d'oliva, origano", price: "€ 8,50", visible: true },
      { name: "Sfincionella", description: "Salsa di pomodoro, acciughe, cipolla, caciocavallo, pangrattato, olio d'oliva, origano", price: "€ 7,50", visible: true },
      { name: "Gustosa", description: "Salsa di pomodoro, mozzarella di bufala, scamorza affumicata, speck, rucola, olio d'oliva, origano", price: "€ 10,00", visible: true },
      { name: "Ciliegina", description: "Salsa di pomodoro, mozzarella, funghi freschi, zucchine, caciocavallo, pomodorini", price: "€ 9,00", visible: true },
      { name: "Prataiola", description: "Salsa di pomodoro, prosciutto crudo, spinaci*, funghi freschi, olio d'oliva, origano", price: "€ 9,50", visible: true },
      { name: "Calzone", description: "Salsa di pomodoro, mozzarella, prosciutto cotto, olio d'oliva, origano", price: "€ 7,50", visible: true },
      { name: "Enzo", description: "Salsa di pomodoro, grana padano infornato, olio d'oliva, origano", price: "€ 6,50", visible: true },
      { name: "Bird", description: "Salsa di pomodoro, mozzarella di bufala, prosciutto crudo, grana padano, pomodorini, rucola, olio d'oliva, origano", price: "€ 12,50", visible: true },
      { name: "Chicken BBQ", description: "Salsa di pomodoro, mozzarella, pollo fritto, patate fritte, salsa barbecue", price: "€ 11,00", visible: true },
      { name: "Ida", description: "Salsa di pomodoro, mozzarella, mozzarella di bufala, speck, olio d'oliva, origano", price: "€ 10,00", visible: true },
      { name: "Patatosa", description: "Salsa di pomodoro, mozzarella, patate fritte, würstel, olio d'oliva, origano", price: "€ 8,00", visible: true },
      { name: "Vegetariana", description: "Salsa di pomodoro, mozzarella, spinaci*, melanzane, peperoni, zucchine, olio d'oliva, origano", price: "€ 9,00", visible: true },
      { name: "Parmigiana", description: "Salsa di pomodoro, mozzarella, melanzane, grana padano, olio d'oliva, origano", price: "€ 8,00", visible: true },
      { name: "Salsiccia & Funghi", description: "Salsa di pomodoro, salsiccia, mozzarella, funghi freschi, olio d'oliva, origano", price: "€ 8,50", visible: true },
      { name: "Porcini", description: "Salsa di pomodoro, mozzarella, funghi porcini, olio d'oliva, origano", price: "€ 10,00", visible: true },
      { name: "Campagnola", description: "Salsa di pomodoro, mozzarella, prosciutto crudo, salsiccia, cipolla, peperoni, funghi freschi, olio d'oliva, origano", price: "€ 11,00", visible: true },
      { name: "Salmone", description: "Salsa di pomodoro, mozzarella, salmone a fette, olio d'oliva, origano", price: "€ 12,00", visible: true },
      { name: "Sindaco", description: "Salsa di pomodoro, caciocavallo, olio d'oliva, origano", price: "€ 7,00", visible: true },
      { name: "Marinara", description: "Salsa di pomodoro, acciughe, olio d'oliva, aglio, origano", price: "€ 6,50", visible: true },
      { name: "Tonno", description: "Salsa di pomodoro, mozzarella, tonno, cipolla, olio d'oliva, origano", price: "€ 9,00", visible: true }
    ]
  },
  {
    title: "Pizze bianche",
    dishes: [
      { name: "Biancaneve", description: "Mozzarella, olio d'oliva, origano", price: "€ 6,00", visible: true },
      { name: "Friarielli", description: "Mozzarella, salsiccia, friarielli, olio d'oliva, origano", price: "€ 9,00", visible: true },
      { name: "Bolognese", description: "Mozzarella, mortadella, granella di pistacchio, olio d'oliva, origano", price: "€ 9,00", visible: true },
      { name: "Bresaola", description: "Mozzarella di bufala, bresaola, grana padano, rucola, olio d'oliva, origano", price: "€ 12,50", visible: true },
      { name: "Quattro formaggi", description: "Mozzarella, emmental, gorgonzola, caciocavallo, olio d'oliva, origano", price: "€ 9,00", visible: true },
      { name: "Deliziosa", description: "Mozzarella, mozzarella di bufala, philadelphia, speck infornato, granella di pistacchio, olio d'oliva", price: "€ 11,50", visible: true }
    ]
  },
  {
    title: "Covaccini (condimenti crudi)",
    dishes: [
      { name: "Campana", description: "Mozzarella di bufala, prosciutto crudo, grana padano, rucola, olio d'oliva, origano", price: "€ 11,00", visible: true },
      { name: "Caprese", description: "Mozzarella di bufala, pomodoro a fette, basilico, olio d'oliva, origano", price: "€ 9,00", visible: true },
      { name: "Norvegese", description: "Salmone affumicato, rucola, olio d'oliva", price: "€ 11,00", visible: true },
      { name: "Piemontese", description: "Bresaola, grana padano, rucola, olio d'oliva", price: "€ 11,00", visible: true },
      { name: "Pizza pane al limone", description: "Limone, grana padano, pangrattato, olio, sale, pepe", price: "€ 6,00", visible: true }
    ]
  },
  {
    title: "Schiacciate",
    dishes: [
      { name: "Siciliana", description: "Mozzarella, prosciutto cotto, pomodoro a fette, acciughe, olio d'oliva, origano", price: "€ 7,50", visible: true },
      { name: "Bird", description: "Mozzarella di bufala, prosciutto crudo, grana padano, pomodorini, rucola, olio d'oliva, origano", price: "€ 11,00", visible: true },
      { name: "Contadina", description: "Mozzarella, salsiccia, melanzane, emmental, olio d'oliva, origano", price: "€ 8,00", visible: true },
      { name: "Gustosità", description: "Mozzarella di bufala, scamorza affumicata, speck, olio d'oliva, origano", price: "€ 10,00", visible: true },
      { name: "Greca", description: "Mozzarella, prosciutto cotto, melanzane, caciocavallo, olio d'oliva, origano", price: "€ 8,50", visible: true },
      { name: "Deliziosa", description: "Mozzarella, mozzarella di bufala, philadelphia, speck infornato, granella di pistacchio, olio d'oliva", price: "€ 11,50", visible: true },
      { name: "Pane cunsatu", description: "Caciocavallo, pomodoro a fette, acciughe, olio d'oliva, origano", price: "€ 7,00", visible: true }
    ]
  },
  {
    title: "Dessert",
    dishes: [
      { name: "Parfait di mandorle", description: "Almond parfait", price: "€ 6,00", visible: true },
      { name: "Cheescake", description: "", price: "€ 6,00", visible: true },
      { name: "Tiramisù (semifreddo)", description: "", price: "€ 5,00", visible: true },
      { name: "Cassattelle di ricotta fritte (1 pz.)", description: "Fried ricotta cassatelle (1 pcs)", price: "€ 1,50", visible: true },
      { name: "Soufflé al cioccolato", description: "Chocolate souffle", price: "€ 5,00", visible: true },
      { name: "Tartufo bianco o nero", description: "White or black truffle", price: "€ 5,00", visible: true },
      { name: "Sorbetto al limone", description: "", price: "€ 5,00", visible: true }
    ]
  },
  {
    title: "Frutta",
    dishes: [
      { name: "Ananas", description: "Pineapple", price: "€ 5,00", visible: true },
      { name: "Cantalupo", description: "Cantaloupe", price: "€ 5,00", visible: true },
      { name: "Melone bianco", description: "White melon", price: "€ 5,00", visible: true },
      { name: "Frutta mista", description: "Mixed fruit", price: "€ 7,00", visible: true },
      { name: "Frutta di stagione", description: "Seasonal fruit", price: "€ 5,00", visible: true }
    ]
  },
  {
    title: "Digestivi - Caffè",
    dishes: [
      { name: "Caffè espresso", description: "", price: "€ 1,50", visible: true },
      { name: "Caffè decaffeinato", description: "", price: "€ 2,00", visible: true },
      { name: "Caffè americano", description: "", price: "€ 2,50", visible: true },
      { name: "Limoncello", description: "", price: "€ 4,00", visible: true },
      { name: "Amaro", description: "", price: "€ 5,00", visible: true }
    ]
  },
  {
    title: "Bibite",
    dishes: [
      { name: "Acqua Minerale (100 cl)", description: "Mineral water 1 lt", price: "€ 2,50", visible: true },
      { name: "CocaCola (33 cl)", description: "", price: "€ 2,50", visible: true },
      { name: "CocaCola Zero (33 cl)", description: "", price: "€ 2,50", visible: true },
      { name: "Sprite (33 cl)", description: "", price: "€ 2,50", visible: true },
      { name: "Fanta (33 cl)", description: "", price: "€ 2,50", visible: true },
      { name: "Lemonsoda (33 cl)", description: "", price: "€ 2,50", visible: true },
      { name: "Chinotto (33 cl)", description: "", price: "€ 2,50", visible: true },
      { name: "Acqua Tonica (33 cl)", description: "", price: "€ 2,50", visible: true },
      { name: "The Pesca-Limone (33 cl)", description: "", price: "€ 3,00", visible: true },
      { name: "Succo di frutta", description: "", price: "€ 3,00", visible: true },
      { name: "Red Bull", description: "", price: "€ 5,00", visible: true }
    ]
  },
  {
    title: "Birre alla spina",
    dishes: [
      { name: "Moretti Bionda", description: "0,2 lt € 3,50 • 0,4 lt € 6,00 • 1 lt € 12,00", price: "", visible: true },
      { name: "Moretti Rossa", description: "0,2 lt € 4,00 • 0,4 lt € 7,00 • 1 lt € 14,00", price: "", visible: true }
    ]
  },
  {
    title: "Birre in bottiglia",
    dishes: [
      { name: "Heineken (33 cl)", description: "Tipo: Lager • Alcol: 5%", price: "€ 3,50", visible: true },
      { name: "Heineken 0.0 (33 cl)", description: "Tipo: Lager • Alcol: 0%", price: "€ 3,50", visible: true },
      { name: "Paulaner Weissbier (50 cl)", description: "Tipo: Bianca • Alcol: 5,3%", price: "€ 6,00", visible: true },
      { name: "Moretti Zero (33 cl)", description: "Tipo: Radler • Alcol: 0%", price: "€ 3,50", visible: true },
      { name: "Corona (33 cl)", description: "Tipo: Lager • Alcol: 4,5%", price: "€ 4,50", visible: true },
      { name: "Ceres (33 cl)", description: "Tipo: Strong Ale • Alcol: 7,7%", price: "€ 4,50", visible: true },
      { name: "Tennent's (33 cl)", description: "Tipo: Super Strong Lager • Alcol: 9%", price: "€ 4,50", visible: true },
      { name: "Peroni Gluten Free (33 cl)", description: "Tipo: Lager senza glutine • Alcol: 4,7%", price: "€ 3,50", visible: true },
      { name: "Nastro Azzurro (50 cl)", description: "Tipo: Lager • Alcol: 5,2%", price: "€ 5,00", visible: true },
      { name: "Messina ai Cristalli di Sale (50 cl)", description: "Tipo: Lager non filtrata • Alcol: 5%", price: "€ 6,00", visible: true },
      { name: "Leffe Blond (75 cl)", description: "Tipo: Ale • Alcol: 6,6%", price: "€ 12,00", visible: true },
      { name: "Leffe Radieuse (75 cl)", description: "Tipo: Ale • Alcol: 8,2%", price: "€ 12,00", visible: true }
    ]
  },
  {
    title: "Fuori menù",
    dishes: [
      { name: "Stinco di maiale con patate alla tedesca e crauti", description: "", price: "", visible: true },
      { name: "Ravioli ripieni di gamberi e zucchine con ragù di ricciola", description: "", price: "", visible: true },
      { name: "Carciofo ripieno di salsa sfinzione su fonduta di formaggi", description: "", price: "", visible: true },
      { name: "Moffoletta con porchetta", description: "", price: "", visible: true }
    ]
  }
]
