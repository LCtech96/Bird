-- Script SQL completo per configurare il database Bird Ristorante
-- Esegui questo script nella SQL Editor di Supabase
-- Progetto ID: cgrygpojgnkcdpbwligf

-- ============================================
-- 1. CREAZIONE TABELLE
-- ============================================

-- Tabella per i dati admin (menu, ai_knowledge, content, admin_credentials)
CREATE TABLE IF NOT EXISTS admin_data (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabella per le prenotazioni
CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  guests TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CREAZIONE INDICI
-- ============================================

CREATE INDEX IF NOT EXISTS idx_admin_data_key ON admin_data(key);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Rimuovi le policy esistenti se presenti (per evitare conflitti)
DROP POLICY IF EXISTS "Public read access for admin_data" ON admin_data;
DROP POLICY IF EXISTS "Public insert access for bookings" ON bookings;
DROP POLICY IF EXISTS "Admin write access for admin_data" ON admin_data;
DROP POLICY IF EXISTS "Admin read access for bookings" ON bookings;

-- Abilita RLS
ALTER TABLE admin_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy per admin_data: lettura pubblica
CREATE POLICY "Public read access for admin_data" 
ON admin_data
FOR SELECT 
USING (true);

-- Policy per admin_data: scrittura consentita (le API routes usano service_role key)
-- NOTA: Le API routes usano SUPABASE_SERVICE_ROLE_KEY che bypassa RLS
CREATE POLICY "Admin write access for admin_data" 
ON admin_data
FOR ALL
USING (true)
WITH CHECK (true);

-- Policy per bookings: inserimento pubblico
CREATE POLICY "Public insert access for bookings" 
ON bookings
FOR INSERT 
WITH CHECK (true);

-- Policy per bookings: lettura admin (le API routes usano service_role key)
CREATE POLICY "Admin read access for bookings" 
ON bookings
FOR SELECT 
USING (true);

-- ============================================
-- 4. INSERIMENTO CREDENZIALI ADMIN
-- ============================================

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

-- ============================================
-- 5. INIZIALIZZAZIONE CONOSCENZA AI
-- ============================================

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

-- ============================================
-- 6. VERIFICA
-- ============================================

-- Verifica che le credenziali siano state inserite correttamente
SELECT key, value, updated_at 
FROM admin_data 
WHERE key IN ('admin_credentials', 'ai_knowledge')
ORDER BY key;

-- Verifica che le tabelle esistano
SELECT 
  table_name,
  (SELECT COUNT(*) FROM admin_data) as admin_data_count,
  (SELECT COUNT(*) FROM bookings) as bookings_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('admin_data', 'bookings');
