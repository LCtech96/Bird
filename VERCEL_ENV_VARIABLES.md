# Variabili d'Ambiente per Vercel - Bird Ristorante

## Istruzioni

1. Vai su [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleziona il progetto **Bird** (o il nome del tuo progetto)
3. Vai su **Settings** → **Environment Variables**
4. Aggiungi le seguenti variabili per **Production**, **Preview** e **Development**:

---

## Variabili da Aggiungere

### Supabase Configuration

```
NEXT_PUBLIC_SUPABASE_URL
[Inserisci qui l'URL del tuo progetto Supabase]
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
[Inserisci qui la chiave anon di Supabase]
```

```
SUPABASE_SERVICE_ROLE_KEY
[Inserisci qui la service_role key di Supabase - TENERLA SEGRETA!]
```

### Groq API Configuration

```
GROQ_API_KEY
[Inserisci qui la tua Groq API Key - TENERLA SEGRETA!]
```

---

## Note Importanti

⚠️ **SICUREZZA:**
- La `SUPABASE_SERVICE_ROLE_KEY` bypassa tutte le policy RLS - **NON condividerla mai pubblicamente**
- La `GROQ_API_KEY` è sensibile - **NON committarla nel repository**
- Queste variabili sono già configurate come gitignored in `.gitignore`

✅ **Dopo aver aggiunto le variabili:**
1. Vai su **Deployments**
2. Trova l'ultimo deploy
3. Clicca sui tre puntini (⋯) → **Redeploy**
4. Oppure fai un nuovo commit per triggerare un nuovo deploy

---

## Verifica

Dopo il deploy, verifica che:
- ✅ L'admin può accedere con `birdgardenterrasini@icloud.com` / `password123456789Bird`
- ✅ L'AI Assistant funziona e usa solo le informazioni dalla pagina "Conoscenza AI"
- ✅ Le prenotazioni vengono salvate correttamente
