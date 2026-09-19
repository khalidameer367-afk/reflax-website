# Reflax — Website (Next.js + Supabase)

Yeh reflax.org jaisi website hai, Next.js mein bani hui, Vercel py deploy
karne ke liye ready. Isme 3 cheezein kaam kar rahi hain:

1. **Website** — Home, About Us, Hire Freelancers (category-wise), Services
   (3 sub-pages), Businesses, Profiles, Register.
2. **Database** — Supabase (freelancers, businesses, profiles teeno tables).
3. **Email** — aapke Gmail se automatic emails (naya submission → aapko
   email, approve hone par applicant ko email).

Neeche step-by-step sab kuch likha hai — koi bhi step skip na karain.

---

## Step 1 — Supabase account banayen (free)

1. https://supabase.com py jayen → sign up karain (GitHub ya email se).
2. **New Project** banayen. Naam kuch bhi de dain (e.g. `reflax`), password
   set karain (ye database password hai, isay yaad rakhen), region
   `Singapore` ya jo aapke qareeb ho select kar lain.
3. Project ban jane ke baad, left sidebar mein **SQL Editor** py jayen.
4. Is project ke andar `supabase-schema.sql` file hai — us ki poori content
   copy karain aur SQL Editor mein paste kar ke **Run** dabayen. Isse teeno
   tables (`freelancers`, `businesses`, `profiles`) aur unki security
   policies ban jayen gi.
5. Ab left sidebar mein **Project Settings → API** py jayen. Wahan se 3
   cheezein copy kar lain:
   - **Project URL** → yeh `NEXT_PUBLIC_SUPABASE_URL` hai
   - **anon public key** → yeh `NEXT_PUBLIC_SUPABASE_ANON_KEY` hai
   - **service_role key** (⚠️ ye secret hai, kabhi public na karein) → yeh
     `SUPABASE_SERVICE_ROLE_KEY` hai

---

## Step 2 — Gmail se email bhejne ke liye "App Password" banayen

Apne normal Gmail password se email nahi bhej sakte — Google ek alag "App
Password" deta hai jo sirf isi kaam ke liye hota hai.

1. https://myaccount.google.com/security py jayen.
2. **2-Step Verification** on karain (agar pehle se on nahi hai — yeh App
   Password ke liye zaroori hai).
3. Us ke baad https://myaccount.google.com/apppasswords py jayen.
4. Koi bhi naam likh kar (e.g. "Reflax Website") **Create** dabayen.
5. Google aapko 16 letters ka password dikhaye ga (jaise `abcd efgh ijkl
   mnop`) — yeh copy kar lain, ye hi `GMAIL_APP_PASSWORD` hai (spaces hata
   kar ya lagaye rakh kar dono chalega).

---

## Step 3 — Environment variables set karain

Project ke root mein `.env.local.example` file hai. Usi ki copy bana kar
naam `.env.local` rakh dain aur apni values daal dain:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

GMAIL_USER=youraddress@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
ADMIN_EMAIL=youraddress@gmail.com

ADMIN_PASSWORD=choose-a-strong-password
```

`ADMIN_PASSWORD` wo password hai jo aap khud rakhain ge `/admin` panel mein
login karne ke liye — isay strong rakhain kyunke isi se aap freelancers aur
businesses approve karain ge.

---

## Step 4 — Local par test karain (optional lekin recommended)

Terminal mein project folder ke andar:

```bash
npm install
npm run dev
```

Phir browser mein `http://localhost:3000` khol kar dekh lain sab kuch theek
chal raha hai. `/admin` py ja kar apna `ADMIN_PASSWORD` daal kar login test
kar lain.

---

## Step 5 — GitHub par push karain

```bash
git init
git add .
git commit -m "Reflax website"
```

Phir GitHub par ek naya (empty) repository banayen aur usay push kar dain:

```bash
git remote add origin https://github.com/your-username/reflax-website.git
git branch -M main
git push -u origin main
```

---

## Step 6 — Vercel par deploy karain

1. https://vercel.com py jayen, GitHub se sign up/login karain.
2. **Add New → Project** → apni GitHub repository select karain.
3. Deploy hone se pehle **Environment Variables** section mein jayen aur
   `.env.local` wali saari 7 values yahan bhi add kar dain (same names,
   same values).
4. **Deploy** dabayen. 2-3 minute mein aapki website live ho jaye gi, ek
   `.vercel.app` link mil jaye ga.
5. Apna custom domain (`reflax.org`) lagane ke liye: Vercel project ke
   **Settings → Domains** mein ja kar domain add karain, phir jahan se
   domain khareeda hai (GoDaddy, Namecheap, wagera) wahan DNS records
   Vercel ki instructions ke mutabiq update kar dain.

---

## Zaroori: Freelancer Login System Ke Liye Extra Supabase Setup

Ab freelancers apna email+password account bana kar khud apni profile
edit/delete kar sakte hain. Isay chalane ke liye 2 cheezein karni hain:

**1 — Naya SQL chalayen**

`supabase-migration-freelancer-accounts.sql` file ki poori content copy
kar ke Supabase SQL Editor mein paste kar ke Run kar dain.

**2 — Email confirmation OFF karain (zaroori)**

Taake account banate hi user turant login ho jaye (bina email verify
kiye), ye setting off karni hai:

1. Supabase dashboard → left sidebar → **Authentication**
2. **Providers** (ya "Sign In / Providers") → **Email**
3. **"Confirm email"** ka toggle **OFF** kar dain
4. Save kar dain

Agar ye ON rahega, to naya account banate waqt user ko email confirm
karna parega, aur profile turant publish nahi hogi (dashboard py "check
your email" jaisa message aayega).

---

## Naya Freelancer System Kaise Kaam Karta Hai

- **`/register`** — naya freelancer email+password se account banata hai
  aur sath hi profile bhi fill karta hai → profile turant live ho jati
  hai aur wo apne dashboard py chala jata hai
- **`/login`** — jo pehle se account bana chuke hain, wo yahan se login
  karte hain
- **`/dashboard`** — login hone ke baad, yahan se woh apni profile edit
  ya poori tarah delete kar sakte hain (koi admin approval nahi chahiye)
- **`/admin`** — aap (site owner) ab bhi kisi bhi freelancer ki profile
  dekh, edit, ya delete kar sakte hain — oversight ke liye, freelancer
  system se independent

**Business registration:**
`/businesses` py form fill → same tarha pending → email → admin approve →
email to business → `/businesses` directory py show.

**Profiles (entrepreneurs):**
Ye section forms se nahi bharta — sirf aap khud `/admin` py login kar ke
"Profiles" tab se manually add karte hain, aur wo turant `/profiles` py
show ho jata hai (koi approval step nahi, kyunke ye aap khud add kar rahe
hain).

---

## Categories

Filhal ye categories set hain (Hire Freelancers mein): SEO, WordPress
Development, Google Ads (PPC), Social Media Marketing, Content Writing,
Graphic Design, Video Editing, Web Development, App Development, Virtual
Assistance, Accounting & Finance, Sales & Business Development.

Inko change karne ke liye `src/lib/types.ts` file mein `CATEGORIES` array
edit kar dain.

---

## Files ka structure

```
src/
  app/
    page.tsx                     → Homepage
    about-us/                    → About page
    hire-freelancers/            → Category grid + [category] + [category]/[id]
    services/                    → 3 service pages
    businesses/                  → Business directory + registration form
    profiles/                    → Entrepreneur profiles
    register/                    → Freelancer registration form
    admin/                       → Admin panel (login + approve/reject + add profiles)
    api/                         → Backend routes (freelancers, businesses, admin)
  components/                    → Header, Footer, forms, admin panel UI
  lib/
    supabase.ts                  → Database connection
    mailer.ts                    → Gmail email sending
    types.ts                     → Shared types + categories list
supabase-schema.sql              → Run this once in Supabase SQL Editor
.env.local.example               → Copy to .env.local and fill in
```
