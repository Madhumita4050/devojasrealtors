# 🔌 Backend Connection Notes — DEVOJAS REALTORS

Ye file bataata hai ki backend connect karne ke liye kya-kya **naya add** kiya gaya hai. **Koi existing file/feature delete ya replace nahi hua** — sab kuch additive hai.

---

## ✅ Naye Files (Pehle Nahi The)
```
src/services/authService.js    → Login/Signup backend se connect karta hai
src/components/AuthModal.jsx   → Login/Signup popup (Enquiry modal jaisa design)
.env.example                    → Backend URL yaha set karna hai
```

## ✏️ Update Hui Files (Sirf Zaroori Hissa, Baaki Same)
```
src/services/projectService.js  → Ab live backend se plot data laata hai
                                    (available/sold/booked) — lekin components
                                    ko same data-shape milta hai jaisa pehle
                                    dummy data se milta tha, koi component
                                    change nahi hua
src/services/enquiryService.js  → Sirf endpoint URL fix hua (/public/enquiries)
src/components/Navbar.jsx        → Sirf "Login / Signup" button add hua
                                    (desktop + mobile). Existing "Enquiry Now"
                                    button, modal, design — sab waisa hi hai
```

---

## 🚀 Setup — Backend Se Connect Karne Ke Liye

### 1. `.env` File Banao
```bash
cp .env.example .env
```

### 2. Backend URL Daalo
`.env` file kholo aur backend ka URL set karo:
```
VITE_API_BASE_URL=http://localhost:5000/api
```
(Agar backend kisi live server pe hai jaise Render, to wahi URL + `/api` daalna — jaise `https://devojas-backend.onrender.com/api`)

### 3. Backend Chalao
Backend (Admin Panel project) ko alag se `npm run dev` se chalao — usi backend se ye website connect hogi.

### 4. Frontend Chalao
```bash
npm install
npm run dev
```

---

## 🔗 Kaun Sa Endpoint Kya Karta Hai

| Frontend Feature | Backend Endpoint |
|---|---|
| Plot listing (Available/Sold/Booked) | `GET /api/public/plots` |
| Single plot detail | `GET /api/public/plots/:id` |
| Enquiry/Callback form | `POST /api/public/enquiries` |
| Login | `POST /api/auth/login` |
| Signup | `POST /api/auth/register` |

Ye saare endpoints **bina kisi login/token ke** kaam karte hain (public), sirf Login/Signup apna token generate karta hai jo browser me save hota hai.

---

## 📊 Status Naming — Kaise Match Hota Hai

Backend database me status **lowercase** store hota hai, frontend UI **capitalized words** expect karta hai — `projectService.js` automatically convert kar deta hai:

```
Backend           →   Frontend Display
'available'        →   'Available'
'sold'              →   'Sold'
'under_negotiation' →   'Booked'
```

Jab Admin Panel se koi plot "Sold" mark hota hai, **turant** website pe (page refresh/next visit pe) "Sold" dikhega — same database use ho raha hai, koi manual sync nahi karna.

---

## ⚠️ Ek Zaroori Baat — "Single Township" Model

Aapka business **ek hi jagah/township** hai (multiple projects nahi), isliye `projectService.js` ek **hi merged "project"** return karta hai — marketing content (naam, tagline, description, landmarks, features) local `projectsData.js` se aata hai (jaisa tha), lekin **plot inventory (status, price, list)** live backend se aata hai.

Agar business grow kare aur **multiple townships** chahiye ho future me, to backend me bhi "Project" grouping add karni hogi — abhi ke liye single-location setup hai.

---

## 🔐 Single Sign-On (SSO) — Admin/Associate/Accounts Ke Liye

Jab koi **Admin, Associate, ya Accounts** role wala user website (`public-website`) ke Login form se login karta hai, wo automatically **Admin Panel** (`localhost:5173`) pe redirect ho jayega — **bina dubara login kiye**. Ye isliye kyunki in roles ka **poora dashboard sirf Admin Panel project me hai**, website me nahi.

**Client** role wale users website pe hi rehte hain (unka koi separate dashboard abhi website me nahi hai — sirf naam navbar me dikhta hai).

### Kaise Kaam Karta Hai
```
User website pe Login form bharta hai
        ↓
Backend check karta hai role
        ↓
Agar role = admin/associate/accounts:
   → Automatically redirect: localhost:5173/?ssoToken=xxxxx
   → Admin Panel is token ko pick karke automatically login kar deta hai
   → User ko dubara password nahi dalna padta
        ↓
Agar role = client:
   → Website pe hi rehta hai, navbar me naam dikhta hai
```

### Setup Ke Liye Zaroori
`public-website/.env` file me ye bhi set hona chahiye:
```
VITE_ADMIN_PANEL_URL=http://localhost:5173
```
(Agar Admin Panel kisi aur URL/port pe deploy ho, to yahi update karna)

---



1. Backend + is frontend ko dono ek sath chalao
2. Website pe "Login / Signup" try karo → naya client account banega (Admin Panel ke Users me bhi dikhega)
3. Admin Panel se ek plot add karo, "Available" status do → website ke Plot Inventory me dikhega
4. Admin Panel se usi plot ko "Sold" kar do → website pe refresh karne pe "Sold" dikhega
5. Website ke "Enquiry Now" form se ek enquiry submit karo → Admin Panel ke "Website Enquiries" page pe dikhegi
