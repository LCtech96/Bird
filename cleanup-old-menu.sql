-- Script SQL per rimuovere il vecchio menu dal database Supabase
-- Esegui questa query nella SQL Editor di Supabase per rimuovere tutti i vecchi piatti

-- Rimuovi il vecchio menu dal database
-- Il nuovo menu verrà caricato automaticamente da menu-data-default.ts quando l'admin salva
DELETE FROM admin_data WHERE key = 'menu';

-- Verifica che il menu sia stato rimosso
SELECT key, updated_at 
FROM admin_data 
WHERE key = 'menu';

-- Dopo aver eseguito questa query, vai su /admin/menu e salva il menu
-- Il menu nuovo verrà caricato automaticamente da menu-data-from-public.ts
