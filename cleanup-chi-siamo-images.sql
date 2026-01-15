-- Query SQL per pulire i percorsi hardcoded dei membri staff in chi-siamo
-- Esegui questa query nella SQL Editor di Supabase per rimuovere tutti i percorsi hardcoded

-- 1. Pulisci tutti i percorsi hardcoded (iniziano con /) sostituendoli con stringa vuota
UPDATE admin_data
SET value = jsonb_set(
  value::jsonb,
  '{members}',
  (
    SELECT jsonb_agg(
      CASE 
        WHEN elem->>'image' LIKE '/%' AND elem->>'image' NOT LIKE 'data:image%' THEN
          jsonb_set(elem, '{image}', '""'::jsonb)
        ELSE elem
      END
    )
    FROM jsonb_array_elements(value::jsonb->'members') AS elem
  ),
  true
)
WHERE key = 'chi_siamo'
  AND value::jsonb ? 'members'
  AND jsonb_typeof(value::jsonb->'members') = 'array';

-- 2. Se la struttura è diversa (array di oggetti direttamente), pulisci anche lì
UPDATE admin_data
SET value = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'image' LIKE '/%' AND elem->>'image' NOT LIKE 'data:image%' THEN
        jsonb_set(elem, '{image}', '""'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(value::jsonb) AS elem
)
WHERE key = 'chi_siamo'
  AND jsonb_typeof(value::jsonb) = 'array';

-- 3. Verifica i risultati finali (verifica semplice)
SELECT key, 
       jsonb_pretty(value::jsonb) as content_preview
FROM admin_data
WHERE key = 'chi_siamo'
ORDER BY updated_at DESC
LIMIT 1;
