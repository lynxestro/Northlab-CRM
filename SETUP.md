# NorthLab CRM — Setup Guide

---

## STEP 1 — Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Name it: `northlab-crm`
4. Set a strong database password (save it)
5. Region: Southeast Asia (Singapore)
6. Wait ~2 mins for it to spin up

---

## STEP 2 — Run SQL Schema

Go to your Supabase project → SQL Editor → New Query → paste this and Run:

```sql
-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL
);

-- Calls table
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  prospect_name TEXT,
  plan TEXT,
  status TEXT,        -- showed | no_show | rescheduled | cancelled | offered | closed
  amount NUMERIC DEFAULT 0,
  payment_type TEXT,  -- pif | installment
  installment_info TEXT
);

-- RLS (Row Level Security)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "own companies" ON companies
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own calls" ON calls
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## STEP 3 — Get Your Keys

In Supabase → Settings → API:
- Copy **Project URL** → paste into index.html where it says `YOUR_SUPABASE_URL`
- Copy **anon public key** → paste where it says `YOUR_SUPABASE_ANON_KEY`

---

## STEP 4 — Create Your Account

In Supabase → Authentication → Users → "Invite user":
- Enter your email
- You'll get a magic link, click it and set your password
- Now you can log in at the dashboard

---

## STEP 5 — Deploy to GitHub Pages

1. Create a new GitHub repo: `northlab-crm` (public)
2. Upload these files:
   - index.html
   - manifest.json
   - icon-192.png  ← generate at https://favicon.io (use letter N, blue bg)
   - icon-512.png  ← same, bigger size
3. Go to repo Settings → Pages → Source: Deploy from branch → main → / (root)
4. Your site will be live at: https://[your-github-username].github.io/northlab-crm

---

## STEP 6 — Point Domain via Cloudflare (optional)

If you want it on northlab.site or dash.northlab.site:

1. In Cloudflare → DNS → Add record:
   - Type: CNAME
   - Name: dash (or @ for root)
   - Target: [your-github-username].github.io
   - Proxy: ON

2. In GitHub repo Settings → Pages → Custom domain:
   - Enter: dash.northlab.site
   - Enable "Enforce HTTPS"

---

## STEP 7 — Install on Phone (PWA)

**iOS (Safari):**
1. Open the site in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap Add

**Android (Chrome):**
1. Open the site in Chrome
2. Tap the 3-dot menu
3. Tap "Add to Home Screen"

---

## Icons

Generate your N icon at https://favicon.io/favicon-generator:
- Text: N
- Background: #0a84ff
- Font: Any bold sans-serif
- Download and rename to icon-192.png and icon-512.png

---

Done. You're live.
