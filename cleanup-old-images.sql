-- Query SQL completa per pulire TUTTI i riferimenti alle vecchie immagini hardcoded
-- Esegui questa query nella SQL Editor di Supabase per rimuovere tutti i dati delle immagini hardcoded

-- 1. Rimuovi le immagini modificabili hardcoded (editableImages)
UPDATE admin_data
SET value = jsonb_set(
  value::jsonb,
  '{editableImages}',
  '[]'::jsonb,
  true
)
WHERE key = 'content'
  AND value::jsonb ? 'editableImages';

-- 2. Rimuovi coverImage hardcoded (se contiene percorso file invece di base64)
UPDATE admin_data
SET value = jsonb_set(
  value::jsonb,
  '{coverImage}',
  '""'::jsonb,
  true
)
WHERE key = 'content'
  AND value::jsonb->>'coverImage' IS NOT NULL
  AND (value::jsonb->>'coverImage' LIKE '/%.png' OR value::jsonb->>'coverImage' LIKE '/%.jpg' OR value::jsonb->>'coverImage' LIKE '/%.jpeg');

-- 3. Rimuovi profileImage hardcoded (se contiene percorso file invece di base64)
UPDATE admin_data
SET value = jsonb_set(
  value::jsonb,
  '{profileImage}',
  '""'::jsonb,
  true
)
WHERE key = 'content'
  AND value::jsonb->>'profileImage' IS NOT NULL
  AND (value::jsonb->>'profileImage' LIKE '/%.png' OR value::jsonb->>'profileImage' LIKE '/%.jpg' OR value::jsonb->>'profileImage' LIKE '/%.jpeg');

-- 4. Rimuovi TUTTE le homeImages hardcoded (svuota l'array)
UPDATE admin_data
SET value = jsonb_set(
  value::jsonb,
  '{homeImages}',
  '[]'::jsonb,
  true
)
WHERE key = 'content'
  AND value::jsonb ? 'homeImages';

-- 5. Rimuovi eventuali chiavi di immagini hardcoded (se esistono come chiavi separate)
DELETE FROM admin_data
WHERE key IN (
  'image_k',
  'image_kj', 
  'image_kkk',
  'image_cop',
  'image_ddd',
  'image_dfg',
  'image_3',
  'image_9',
  'image_dg',
  'image_q',
  'image_4',
  'image_l',
  'image_profile',
  'image_cover'
);

-- Verifica i risultati finali
SELECT key, 
       CASE 
         WHEN key = 'content' THEN jsonb_pretty(value::jsonb)
         ELSE value::text
       END as content_preview
FROM admin_data
WHERE key = 'content'
ORDER BY updated_at DESC
LIMIT 1;
