# arisan-admin — CLAUDE.md

> Letakkan file ini di root `arisan-admin/CLAUDE.md`.
> Dibaca otomatis oleh Claude Code di setiap sesi admin frontend.
> Update section "Catatan Sesi" setelah setiap sesi selesai.

---

## Stack

- **Framework:** Next.js 15 App Router, TypeScript
- **Styling:** Tailwind CSS (utility classes only — tidak ada custom CSS kecuali terpaksa)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Deploy:** Vercel
- **Auth:** `X-Admin-Secret` header — tidak ada user login, akses internal only
- **API target:** `arisan-api` via `NEXT_PUBLIC_API_URL` atau server-side `API_URL`
- **Dev:** Docker Compose bersama arisan-api (port 3000)

---

## Struktur File

```
app/
├── (admin)/
│   ├── layout.tsx              ← sidebar + header layout
│   ├── page.tsx                ← redirect ke /overview
│   ├── overview/
│   │   └── page.tsx            ← dashboard utama
│   ├── users/
│   │   ├── page.tsx            ← user list + search
│   │   └── [id]/
│   │       └── page.tsx        ← user detail
│   ├── groups/
│   │   ├── page.tsx            ← group list + filter
│   │   └── [id]/
│   │       └── page.tsx        ← group detail
│   ├── otp/
│   │   └── page.tsx            ← OTP monitoring
│   └── system/
│       └── page.tsx            ← system health
├── api/
│   └── proxy/
│       └── [...path]/
│           └── route.ts        ← API proxy (inject X-Admin-Secret server-side)
└── globals.css

components/
├── layout/
│   ├── Sidebar.tsx
│   └── TopBar.tsx
├── ui/
│   ├── StatCard.tsx
│   ├── AlertBanner.tsx
│   ├── DataTable.tsx
│   ├── Pagination.tsx
│   ├── Badge.tsx
│   ├── SkeletonRow.tsx
│   └── ConfirmModal.tsx
└── charts/
    ├── LineChart.tsx
    └── BarChart.tsx

lib/
├── api.ts                      ← fetch wrapper ke /api/proxy/*
└── utils.ts                    ← format phone, rupiah, tanggal
```

---

## Environment Variables

```
# .env.local
ADMIN_SECRET_KEY=           ← secret — server-side only, JANGAN prefix NEXT_PUBLIC_
API_URL=http://api:3001     ← server-side (Docker internal)
NEXT_PUBLIC_APP_NAME=Arisan Admin
```

> **Kritis:** `ADMIN_SECRET_KEY` HANYA boleh dipakai di server-side route (`app/api/proxy/`).
> Jangan pernah expose ke client — tidak ada `NEXT_PUBLIC_ADMIN_SECRET_KEY`.

---

## Pola API Call — WAJIB

Semua fetch dari komponen client harus lewat `/api/proxy/*` (bukan langsung ke arisan-api):

```
Browser → /api/proxy/admin/users → (server inject X-Admin-Secret) → arisan-api/admin/users
```

**`app/api/proxy/[...path]/route.ts`** — proxy server-side:
```typescript
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL!;
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY!;

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const search = req.nextUrl.searchParams.toString();
  const url = `${API_URL}/admin/${path}${search ? `?${search}` : ''}`;

  const res = await fetch(url, {
    headers: { 'X-Admin-Secret': ADMIN_SECRET, 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const body = await req.json();
  const res = await fetch(`${API_URL}/admin/${path}`, {
    method: 'POST',
    headers: { 'X-Admin-Secret': ADMIN_SECRET, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const res = await fetch(`${API_URL}/admin/${path}`, {
    method: 'DELETE',
    headers: { 'X-Admin-Secret': ADMIN_SECRET },
    cache: 'no-store',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
```

**`lib/api.ts`** — fetch wrapper untuk client components:
```typescript
export async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api/proxy/${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Terjadi kesalahan' }));
    throw new Error(err.error ?? 'Request gagal');
  }
  return res.json();
}
```

---

## Design System

### Colors (Tailwind classes)

| Elemen | Class |
|--------|-------|
| Primary | `bg-emerald-500` `text-emerald-500` `border-emerald-500` |
| Primary hover | `hover:bg-emerald-600` |
| Primary light | `bg-emerald-50` `text-emerald-700` |
| Background | `bg-gray-50` (page) `bg-white` (card) |
| Text primary | `text-gray-900` |
| Text secondary | `text-gray-500` |
| Border | `border-gray-200` |
| Error | `bg-red-50` `text-red-600` `border-red-200` |
| Warning | `bg-amber-50` `text-amber-600` `border-amber-200` |
| Success | `bg-emerald-50` `text-emerald-700` |

> Primary color: `#10B981` (emerald-500) — selaras dengan `#00C897` di mobile.

### Komponen Standar

**StatCard:** white card, shadow-sm, rounded-xl, padding 24px. Tampilkan: label + nilai besar + trend opsional.

**DataTable:** header gray-50, row hover gray-50, border-b gray-100, padding cell 12px 16px.

**Badge status:**
- `recruiting`: `bg-blue-100 text-blue-700`
- `active`: `bg-emerald-100 text-emerald-700`
- `completed`: `bg-gray-100 text-gray-600`
- `disbanded`: `bg-red-100 text-red-600`
- `suspended`: `bg-orange-100 text-orange-700`

**Alert threshold:** `bg-red-50 border border-red-200 rounded-lg` — muncul di atas halaman jika ada metric yang melewati batas.

### Layout

- Sidebar: lebar `w-64`, fixed, background white, border-r
- Konten utama: `ml-64`, padding `p-8`
- Header: `h-16`, border-b, flex items-center
- Max content width: `max-w-7xl mx-auto`

---

## Rules Wajib

- **JANGAN** expose `ADMIN_SECRET_KEY` ke client — hanya server-side proxy
- **JANGAN** install dependency baru tanpa konfirmasi
- **JANGAN** fetch langsung ke arisan-api dari browser — selalu lewat `/api/proxy/`
- Semua halaman wajib: **loading skeleton** (bukan blank/spinner penuh layar)
- Semua aksi destruktif (suspend, delete): wajib **ConfirmModal** sebelum eksekusi
- Phone number selalu dalam format masked dari API — jangan unmask di frontend
- Semua label dan teks UI dalam **Bahasa Indonesia**
- Error state: tampilkan pesan + tombol "Coba Lagi"
- Pagination: semua tabel yang bisa panjang wajib pagination

---

## Threshold Alert (tampilkan jika melewati batas)

| Metric | Threshold | Pesan |
|--------|-----------|-------|
| Stream MAU | > 800 | "⚠ Stream.io MAU mendekati limit 1000" |
| Fonnte usage | > 800 | "⚠ Fonnte mendekati limit 1000/bulan" |
| Storage Supabase | > 400 MB | "⚠ Storage database mendekati kapasitas" |
| Error rate API | > 5% | "⚠ Error rate API tinggi, periksa logs" |

---

## Referensi

- API endpoints: `../backend/BE-7-admin.md`
- Progress: `PROGRESS.md`
- Dev guide: `../DEVELOPMENT_GUIDE.md`

---

## Jika Ragu

**STOP dan tanya developer.** Terutama untuk:
- Aksi yang mengubah atau menghapus data user
- Dependency baru
- Perubahan struktur routing

---

## Catatan Sesi

> Claude mengisi bagian ini setelah setiap sesi.

```
[belum ada catatan]
```
