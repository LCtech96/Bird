-- Query SQL per inserire le credenziali admin per Bird Ristorante
-- Esegui questa query nella SQL Editor di Supabase
-- Progetto ID: cgrygpojgnkcdpbwligf

-- Inserisci o aggiorna le credenziali admin
INSERT INTO admin_data (key, value, updated_at)
VALUES (
  'admin_credentials',
  '{
    "email": "birdgardenterrasini@icloud.com",
    "password": "password123456789Bird"
  }'::jsonb,
  NOW()
)
ON CONFLICT (key) 
DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- Inizializza la conoscenza AI con valori di default (se non esiste già)
INSERT INTO admin_data (key, value, updated_at)
VALUES (
  'ai_knowledge',
  '{
    "openingHours": "07:00 - 01:00",
    "closingDays": [],
    "holidays": [],
    "events": [],
    "additionalInfo": ""
  }'::jsonb,
  NOW()
)
ON CONFLICT (key) 
DO NOTHING;

-- Verifica che le credenziali siano state inserite correttamente
SELECT key, value, updated_at 
FROM admin_data 
WHERE key IN ('admin_credentials', 'ai_knowledge')
ORDER BY key;
