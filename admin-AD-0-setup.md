# AD-0 — Setup Scaffold Admin Frontend

> **Prompt pembuka:**
> ```
> Baca CLAUDE.md dan PROGRESS.md sekarang.
> Konfirmasi: BE-0 backend sudah selesai? (docker-compose + arisan-api jalan?)
> Semua task AD-0 masih [ ]?
> Scope sesi ini: scaffold + infrastruktur saja. Belum ada halaman bisnis.
> Jangan mulai coding sebelum konfirmasi ini selesai.
> ```

---

## Konteks

Sesi ini membangun fondasi `arisan-admin`. Tidak ada halaman bisnis — hanya project setup, API proxy, utilitas, dan Docker. Semua sesi berikutnya bergantung pada output sesi ini.

**Repo:** `~/projects/arisan-admin`
**Port dev:** 3000 (via Docker Compose bersama arisan-api di 3001)

---

## Rules Sesi Ini

- `ADMIN_SECRET_KEY` **HANYA** boleh ada di server-side (`app/api/proxy/`) — tidak pernah ke client
- Tidak ada halaman UI dulu — hanya infrastruktur
- Dependency yang diizinkan sesi ini: tailwindcss, recharts, lucide-react

---

## Step 1 — Init Project

```bash
cd ~/projects
npx create-next-app@latest arisan-admin \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir no \
  --import-alias "@/*"
cd arisan-admin
npm install recharts lucide-react
```

---

## Step 2 — Struktur Folder

```bash
mkdir -p app/api/proxy app/"(admin)"/overview \
  app/"(admin)"/users app/"(admin)"/groups \
  app/"(admin)"/otp app/"(admin)"/system \
  components/layout components/ui components/charts \
  lib
```

---

## Step 3 — Environment Variables

**`.env.local`:**
```
# Server-side only — JANGAN prefix NEXT_PUBLIC_
ADMIN_SECRET_KEY=
API_URL=http://api:3001

# Client-safe
NEXT_PUBLIC_APP_NAME=Arisan Admin
```

**`.env.example`:**
```
ADMIN_SECRET_KEY=
API_URL=http://api:3001
NEXT_PUBLIC_APP_NAME=Arisan Admin
```

Pastikan `.env.local` ada di `.gitignore`.

---

## Step 4 — API Proxy (Server-Side)

Ini adalah file paling kritis. `ADMIN_SECRET_KEY` diinjeksi di sini — tidak pernah dikirim ke browser.

**`app/api/proxy/[...path]/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY;

if (!API_URL || !ADMIN_SECRET) {
  throw new Error('API_URL dan ADMIN_SECRET_KEY wajib diisi di .env.local');
}

function buildHeaders() {
  return {
    'X-Admin-Secret': ADMIN_SECRET!,
    'Content-Type': 'application/json',
  };
}

function buildUpstreamUrl(params: { path: string[] }, searchParams: URLSearchParams): string {
  const path = params.path.join('/');
  const qs = searchParams.toString();
  return `${API_URL}/admin/${path}${qs ? `?${qs}` : ''}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const p = await params;
  const url = buildUpstreamUrl(p, req.nextUrl.searchParams);
  try {
    const res = await fetch(url, { headers: buildHeaders(), cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Gagal menghubungi server API' }, { status: 503 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const p = await params;
  const url = buildUpstreamUrl(p, new URLSearchParams());
  try {
    const body = await req.json().catch(() => ({}));
    const res = await fetch(url, { method: 'POST', headers: buildHeaders(), body: JSON.stringify(body), cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Gagal menghubungi server API' }, { status: 503 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const p = await params;
  const url = buildUpstreamUrl(p, new URLSearchParams());
  try {
    const res = await fetch(url, { method: 'DELETE', headers: buildHeaders(), cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Gagal menghubungi server API' }, { status: 503 });
  }
}
```

---

## Step 5 — Fetch Wrapper & Utilitas

**`lib/api.ts`:**
```typescript
export async function adminFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
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

**`lib/utils.ts`:**
```typescript
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

export function maskPhone(phone: string): string {
  // Input: +6281234567890 → Output: +62 8xx-xxxx-7890
  if (!phone || phone.length < 6) return phone;
  const last4 = phone.slice(-4);
  return `+62 8xx-xxxx-${last4}`;
}

export function formatFrekuensi(f: string): string {
  const map: Record<string, string> = {
    weekly: 'Mingguan',
    biweekly: 'Dua Mingguan',
    monthly: 'Bulanan',
  };
  return map[f] ?? f;
}

export function formatModeUndian(m: string): string {
  const map: Record<string, string> = {
    fixed: 'Urutan Tetap',
    random: 'Undian Random',
    manual: 'Input Manual',
  };
  return map[m] ?? m;
}
```

---

## Step 6 — Tailwind Config

Verifikasi `tailwind.config.ts` sudah include semua path:
```typescript
content: [
  './app/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './lib/**/*.{ts,tsx}',
],
```

---

## Step 7 — Docker

**`Dockerfile`:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

**`next.config.ts`** — tambahkan:
```typescript
const nextConfig = {
  output: 'standalone',
};
export default nextConfig;
```

**`docker-compose.yml`** (di folder arisan-admin, include kedua service):
```yaml
version: '3.8'
services:
  api:
    build:
      context: ../arisan-api
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    env_file:
      - ../arisan-api/.env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  admin:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    environment:
      - API_URL=http://api:3001
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped
```

---

## Step 8 — App Shell (Placeholder)

**`app/(admin)/layout.tsx`** — placeholder shell (diisi penuh di AD-1):
```typescript
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar placeholder — diisi AD-1 */}
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
          <p className="text-sm text-gray-400">Sidebar (AD-1)</p>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**`app/(admin)/overview/page.tsx`** — placeholder:
```typescript
export default function OverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
      <p className="text-gray-500 mt-2">Dashboard dibangun di sesi AD-2.</p>
    </div>
  );
}
```

**`app/page.tsx`** — redirect ke overview:
```typescript
import { redirect } from 'next/navigation';
export default function Home() {
  redirect('/overview');
}
```

---

## Step 9 — GitHub Actions

**`.github/workflows/ci.yml`:**
```yaml
name: CI
on:
  push:
    branches: ["**"]
  pull_request:
    branches: [main, develop]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - name: No ADMIN_SECRET in client bundle
        run: |
          if grep -r "ADMIN_SECRET_KEY" .next/static/ 2>/dev/null; then
            echo "ERROR: ADMIN_SECRET_KEY bocor ke client bundle!"
            exit 1
          fi
```

---

## Verifikasi Akhir

```bash
# 1. Jalankan via Docker Compose
docker-compose up --build

# 2. Cek admin
curl http://localhost:3000
# Expected: HTML halaman Next.js

# 3. Test proxy (arisan-api harus jalan)
curl http://localhost:3000/api/proxy/stats/overview
# Expected: JSON dari arisan-api (atau 503 jika arisan-api belum ada datanya)

# 4. Verifikasi secret tidak bocor
curl http://localhost:3000/api/proxy/stats/overview -v 2>&1 | grep -i "admin-secret"
# Expected: tidak ada hasil — secret tidak pernah ke browser
```

---

## Update PROGRESS.md — WAJIB

```
Setelah semua step selesai:
1. Buka PROGRESS.md
2. Tandai semua task AD-0 yang selesai dengan [x]
3. Di "Keputusan Teknis", catat versi Next.js dan Tailwind yang terinstall
4. Commit: "chore(ad): initial admin scaffold + API proxy"
5. Push ke feature/ad-w01-setup → PR ke develop
```

---

**Sesi berikutnya:** `AD-1-layout.md`
