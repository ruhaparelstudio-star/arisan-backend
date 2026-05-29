# arisan-admin — Progress Tracker (Frontend Admin)

> Update setiap akhir sesi. Dibaca Claude Code di awal setiap sesi.
> Format: `[ ]` belum · `[~]` in progress · `[x]` selesai · `[!]` blocker

---

## Koordinasi dengan Backend

> Admin frontend bergantung pada admin routes di arisan-api.
> Pastikan BE-7 sudah selesai sebelum mulai AD-2 ke atas.

| Admin Sesi | Butuh Backend |
|------------|---------------|
| AD-0 Setup | BE-0 (Docker, health) |
| AD-1 Layout | BE-7 (GET /admin/stats/overview) |
| AD-2 Overview | BE-7 (overview, otp-stats) |
| AD-3 Users | BE-7 (users CRUD) |
| AD-4 Groups | BE-7 (groups endpoints) |
| AD-5 OTP & System | BE-7 (otp-stats, system-health, cron trigger) |
| AD-6 Deploy | BE-8 (production deploy) |

---

## Status Keseluruhan

| Sesi | Feature | Status |
|------|---------|--------|
| AD-0 | Setup Scaffold | `[x]` |
| AD-1 | Layout & Navigasi | `[ ]` |
| AD-2 | Overview Dashboard | `[ ]` |
| AD-3 | User Management | `[ ]` |
| AD-4 | Group Monitoring | `[ ]` |
| AD-5 | OTP Monitor & System Health | `[ ]` |
| AD-6 | Deploy & Beta Prep | `[ ]` |

---

## AD-0 — Setup Scaffold

```
[x] Next.js 15 project (App Router, TypeScript)
[x] Install Tailwind CSS + konfigurasi
[x] Install: recharts, lucide-react
[x] Buat .env.local dengan semua variable
[x] app/api/proxy/[...path]/route.ts — API proxy server-side
[x] lib/api.ts — adminFetch wrapper
[x] lib/utils.ts — formatPhone, formatRupiah, formatDate
[x] Dockerfile + .dockerignore
[x] docker-compose.yml (bersama arisan-api)
[x] CLAUDE.md di root repo
[x] PROGRESS.md di root repo
[x] GitHub Actions: ci.yml
[ ] Verifikasi: docker-compose up → http://localhost:3000 jalan
[ ] Test proxy: GET /api/proxy/stats/overview → forward ke arisan-api
```

**Catatan:**
> Sesi AD-0 selesai 2026-05-29. Next.js 15.5.18, React 19, Tailwind CSS 3.4.19, recharts 3.8.1, lucide-react 1.17.0. Project sudah ada di arisan_app/backend (bukan di ~/projects/arisan-admin baru). API proxy server-side di app/api/proxy/[...path]/route.ts siap — ADMIN_SECRET_KEY tidak pernah ke client. Docker + CI sudah ada.

---

## AD-1 — Layout & Navigasi

```
[ ] app/(admin)/layout.tsx — sidebar + topbar shell
[ ] components/layout/Sidebar.tsx
    [ ] Logo + nama app di atas
    [ ] Nav items: Overview, Users, Groups, OTP Monitor, System
    [ ] Active state per route (warna emerald)
    [ ] Collapsed state opsional
[ ] components/layout/TopBar.tsx
    [ ] Judul halaman (dinamis per route)
    [ ] Tombol refresh (trigger re-fetch manual)
[ ] components/ui/StatCard.tsx
[ ] components/ui/Badge.tsx
[ ] components/ui/AlertBanner.tsx
[ ] components/ui/DataTable.tsx
[ ] components/ui/Pagination.tsx
[ ] components/ui/SkeletonRow.tsx
[ ] components/ui/ConfirmModal.tsx
[ ] Routing: semua halaman redirect dengan benar dari sidebar
```

**Catatan:**
> _(isi setelah sesi)_

---

## AD-2 — Overview Dashboard

```
[ ] app/(admin)/overview/page.tsx
    [ ] 4 StatCard: Total User, Grup Aktif, OTP Bulan Ini, Push Token Terdaftar
    [ ] AlertBanner threshold: Stream MAU, Fonnte, Storage, Error rate
    [ ] Grafik registrasi user 7 hari (recharts LineChart)
    [ ] Grafik OTP per hari 7 hari (recharts BarChart)
    [ ] Tabel 5 grup terbaru
    [ ] Tabel 5 user terbaru
    [ ] Semua loading skeleton aktif
    [ ] Tombol refresh manual
[ ] components/charts/LineChart.tsx
[ ] components/charts/BarChart.tsx
[ ] Auto-refresh setiap 5 menit (opsional, konfirmasi dulu)
```

**Catatan:**
> _(isi setelah sesi)_

---

## AD-3 — User Management

```
[ ] app/(admin)/users/page.tsx
    [ ] Tabel: nama, HP masked, tgl daftar, jumlah grup, status
    [ ] Search bar (debounce 300ms)
    [ ] Filter status: semua / aktif / suspended
    [ ] Pagination (20 per halaman)
    [ ] Aksi per baris: Detail, Suspend/Unsuspend, Hapus
    [ ] Loading skeleton (5 row)
    [ ] Empty state
[ ] app/(admin)/users/[id]/page.tsx
    [ ] Info user (HP masked, nama, tgl daftar)
    [ ] List grup yang diikuti + status per grup
    [ ] OTP delivery history (10 terbaru)
    [ ] Tombol Suspend / Unsuspend
    [ ] Tombol Hapus Akun (ConfirmModal — "Aksi ini tidak bisa dibatalkan")
    [ ] Badge flag otomatis (OTP >3x/jam, buat >5 grup/hari)
[ ] ConfirmModal reusable untuk suspend dan delete
```

**Catatan:**
> _(isi setelah sesi)_

---

## AD-4 — Group Monitoring

```
[ ] app/(admin)/groups/page.tsx
    [ ] Tabel: nama grup, ketua (HP masked), anggota, periode, status
    [ ] Filter status: semua / recruiting / active / completed / disbanded
    [ ] Pagination (20 per halaman)
    [ ] Search by nama grup
    [ ] Loading skeleton
[ ] app/(admin)/groups/[id]/page.tsx
    [ ] Info grup (nama, nominal, frekuensi, mode undian, status)
    [ ] List anggota + urutan + status bayar periode aktif
    [ ] Histori periode (accordion)
    [ ] Activity log terbaru (10 item)
    [ ] Badge flag: nominal >10jt, anggota >30
```

**Catatan:**
> _(isi setelah sesi)_

---

## AD-5 — OTP Monitor & System Health

```
[ ] app/(admin)/otp/page.tsx
    [ ] Progress bar quota Fonnte (usage/1000)
    [ ] Grafik OTP per hari 30 hari (recharts BarChart)
    [ ] Tabel nomor kena rate limit (HP masked, jumlah attempt, waktu reset)
    [ ] Tombol "Reset Rate Limit" per nomor (ConfirmModal)
[ ] app/(admin)/system/page.tsx
    [ ] Status card per service: Supabase · Hono API · Stream.io
    [ ] Indikator: hijau (ok) / merah (error) / abu (checking)
    [ ] Auto-refresh setiap 30 detik
    [ ] Tombol "Refresh Status" manual
    [ ] Section Manual Cron Trigger:
        [ ] Tombol: "Jalankan Payment Reminder"
        [ ] Tombol: "Jalankan Pelaksanaan Reminder"
        [ ] Tombol: "Mark Late Payments"
        [ ] Semua dengan ConfirmModal + loading state + hasil response
    [ ] Tombol "Verifikasi pg_cron" — cek apakah aktif
```

**Catatan:**
> _(isi setelah sesi)_

---

## AD-6 — Deploy & Final

```
[ ] Verifikasi: semua halaman load tanpa error di browser
[ ] Test proxy: ADMIN_SECRET_KEY tidak pernah muncul di response browser
[ ] Test: semua aksi konfirmasi (suspend, delete) bekerja
[ ] Test: threshold alert muncul saat nilai melewati batas
[ ] Deploy ke Vercel:
    [ ] Set environment variables di Vercel dashboard
    [ ] Verifikasi: admin.arisanapp.id/overview load dengan data real
[ ] Dokumentasi: URL admin dicatat di PROGRESS.md
```

**Catatan:**
> _(isi setelah sesi)_

---

## Keputusan Teknis

```
[isi setelah setiap sesi]
```

## Blocker Aktif

```
(kosong)
```
