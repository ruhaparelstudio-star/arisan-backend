# AD-6 — Deploy & Final Check

> **Prompt pembuka:**
> ```
> Baca CLAUDE.md dan PROGRESS.md.
> Konfirmasi: semua AD-0 sampai AD-5 sudah [x]?
> List semua [!] blocker yang belum selesai sebelum mulai.
> Sesi ini: tidak ada fitur baru — verifikasi, security check, dan deploy.
> ```

---

## Security Verification

```bash
# 1. Build production
npm run build

# 2. KRITIS: pastikan ADMIN_SECRET_KEY tidak bocor ke client bundle
grep -r "ADMIN_SECRET" .next/static/ 2>/dev/null
# Harus tidak ada hasil — jika ada, STOP dan investigasi

# 3. Scan semua komponen client ('use client') untuk pastikan tidak ada import dari env server
grep -r "ADMIN_SECRET\|API_URL" app/ components/ lib/ --include="*.tsx" --include="*.ts" | grep -v "route.ts"
# Hanya boleh ada di app/api/proxy/[...path]/route.ts
```

---

## Final UI Check (di browser)

```
[ ] Overview: 4 stat card load dengan data real
[ ] Overview: chart registrasi user render
[ ] Overview: alert threshold muncul jika kondisi terpenuhi (test dengan mock data)
[ ] Users: search, filter, pagination bekerja
[ ] Users: suspend/unsuspend/delete via ConfirmModal bekerja
[ ] Users: navigate ke detail dan kembali
[ ] Groups: list + filter + detail load
[ ] OTP: quota bar dan grafik render
[ ] System: 3 service status muncul (ok/error)
[ ] System: cron trigger via ConfirmModal bekerja
[ ] Sidebar: active state muncul di route yang benar
[ ] Semua halaman: tidak ada blank state tanpa loading skeleton
```

---

## Deploy ke Vercel

```bash
# 1. Push ke main
git checkout main
git merge develop
git push origin main

# 2. Di Vercel dashboard:
# - Connect repo arisan-admin
# - Set environment variables:
#   ADMIN_SECRET_KEY = [secret]
#   API_URL = https://api.arisanapp.id  (production arisan-api URL)
#   NEXT_PUBLIC_APP_NAME = Arisan Admin

# 3. Deploy otomatis dari push ke main
# 4. Verifikasi:
curl https://admin.arisanapp.id/api/proxy/stats/overview
# Expected: JSON data (bukan 401 atau 503)
```

---

## Update PROGRESS.md — Sesi Terakhir Admin

```
Tandai semua AD-6 yang selesai.
Di "Keputusan Teknis" catat:
- URL admin production
- Tanggal deploy
- Hasil security check (ADMIN_SECRET bocor atau tidak)

Commit: "chore(ad): production deploy + security verification"
Tag: git tag -a ad-v0.1.0 -m "Admin dashboard Phase Awal complete"
Push: git push origin --tags
```

---

*Semua prompt admin selesai: AD-0 → AD-6*
