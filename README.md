# Arisan Admin — Dashboard

Admin Dashboard untuk **Arisan App** (Phase Awal / MVP). Implementasi dari design
handoff Claude Design — direkonstruksi pixel-perfect ke **Next.js 15 + TypeScript**.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Styling:** CSS design system (`app/globals.css`) — palet mint `#00C897` sesuai PRD §14.1
- **Charts:** SVG kustom (area, bar, donut, sparkline) — tanpa dependency eksternal
- **Icons:** komponen SVG line-icon sendiri (`components/Icon.tsx`)

## Halaman

| Halaman | File | PRD |
|---------|------|-----|
| Login (nomor → OTP 6 digit) | `components/pages/Login.tsx` | F01 |
| Overview | `components/pages/Overview.tsx` | §6.1 |
| User Management (+ drawer detail) | `components/pages/Users.tsx` | §6.2 |
| Group Monitoring (+ drill-down) | `components/pages/Groups.tsx` | §6.3 |
| OTP Monitor | `components/pages/Otp.tsx` | §6.4 |
| System Health | `components/pages/Health.tsx` | §6.5 |
| Privacy & PDP (DSR, retensi, consent, audit log) | `components/pages/Privacy.tsx` | §9.4 |
| Pengaturan (profil, ambang alert, notifikasi, integrasi, status UI) | `components/pages/Settings.tsx` | — |

Plus: logout (modal konfirmasi), skeleton loading saat pindah halaman, toast
(sukses/error/info), loading overlay penuh, dan halaman error penuh. Auth disimpan
di `localStorage` (demo OTP: **`123456`**).

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:3000
```

Build & Docker:

```bash
npm run build
docker build -t arisan-admin . && docker run -p 3000:3000 arisan-admin
```

## Catatan scope

Dashboard ini adalah rekonstruksi dari **design prototype**, jadi datanya **mock**
(`lib/data.ts`) — data realistis Indonesia, sama persis dengan prototype. Integrasi
ke `arisan-api` lewat `app/api/proxy/*` (lihat `CLAUDE.md` & `admin-AD-0-setup.md`)
adalah langkah berikutnya: ganti pemanggilan `lib/data.ts` dengan `adminFetch()`.
`.env.example` sudah menyiapkan `ADMIN_SECRET_KEY` & `API_URL` untuk tahap itu.
# arisan-backend
