-- Query SQL per pulire i riferimenti alle vecchie immagini hardcoded
-- Esegui questa query nella SQL Editor di Supabase per rimuovere i dati delle immagini che non esistono più

-- Rimuovi le immagini modificabili hardcoded dal contenuto se esistono
UPDATE admin_data
SET value = jsonb_set(
  value::jsonb,
  '{editableImages}',
  '[]'::jsonb,
  true
)
WHERE key = 'content'
  AND value::jsonb ? 'editableImages'
  AND jsonb_array_length(value::jsonb->'editableImages') > 0;

-- Rimuovi eventuali chiavi di immagini hardcoded (se esistono come chiavi separate)
DELETE FROM admin_data
WHERE key IN (
  'image_k',
  'image_kj', 
  'image_kkk',
  'image_cop',
  'image_ddd',
  'image_dfg',
  'image_3',
  'image_9'
);

-- Verifica i risultati
SELECT key, 
       CASE 
         WHEN key = 'content' THEN jsonb_pretty(value::jsonb)
         ELSE value::text
       END as content_preview
FROM admin_data
WHERE key = 'content'
ORDER BY updated_at DESC
LIMIT 1;
