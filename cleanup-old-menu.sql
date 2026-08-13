-- Pulisce il menu salvato in admin_data così la pagina /menu
-- usa i dati sincronizzati dal PDF ufficiale (menu-data-default.ts).
-- Dopo il deploy, se serve, rieseguire in Supabase SQL Editor.

DELETE FROM admin_data WHERE key = 'menu';
