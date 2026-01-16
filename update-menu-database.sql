-- Script SQL per aggiornare il menu nel database Supabase
-- Rimuove tutti i vecchi piatti e inserisce solo il menu nuovo

-- Prima rimuovi il menu esistente
DELETE FROM admin_data WHERE key = 'menu';

-- Poi inserisci il nuovo menu (i dati verranno inseriti tramite l'admin panel o l'API)
-- Questo script serve solo per pulire i vecchi dati
-- Il nuovo menu verrà caricato automaticamente da menu-data-default.ts quando l'admin salva
