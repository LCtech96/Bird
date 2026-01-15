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

-- 3. Verifica i risultati finali
SELECT key, 
       CASE 
         WHEN jsonb_typeof(value::jsonb) = 'array' THEN 
           jsonb_pretty(
             jsonb_agg(
               jsonb_build_object(
                 'id', elem->>'id',
                 'title', elem->>'title',
                 'image', CASE 
                   WHEN elem->>'image' LIKE 'data:image%' THEN '[BASE64]' 
                   WHEN elem->>'image' = '' THEN '[VUOTO]'
                   ELSE elem->>'image'
                 END
               )
             )
           )
         ELSE jsonb_pretty(value::jsonb)
       END as content_preview
FROM admin_data
CROSS JOIN LATERAL (
  CASE 
    WHEN jsonb_typeof(value::jsonb) = 'array' THEN jsonb_array_elements(value::jsonb)
    ELSE jsonb_array_elements(value::jsonb->'members')
  END
) AS elem(elem)
WHERE key = 'chi_siamo'
GROUP BY key, value;
