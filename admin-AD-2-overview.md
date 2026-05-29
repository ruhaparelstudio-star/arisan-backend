# AD-2 — Overview Dashboard

> **Prompt pembuka:**
> ```
> Baca CLAUDE.md dan PROGRESS.md sekarang.
> Konfirmasi: AD-1 selesai (semua komponen UI ada)? BE-7 admin routes jalan?
> Scope: app/(admin)/overview/page.tsx + components/charts/*.tsx SAJA.
> Test proxy dulu: GET /api/proxy/stats/overview harus return data.
> ```

---

## Konteks

Halaman pertama yang dilihat setelah buka admin. Memberikan gambaran kesehatan sistem secara sekilas. Data diambil dari dua endpoint: `/admin/stats/overview` dan `/admin/otp-stats`.

---

## Data yang Dibutuhkan

```typescript
// GET /api/proxy/stats/overview
type OverviewData = {
  total_users: number;
  active_groups: number;
  otp_this_month: number;
  push_tokens_registered: number;
  stream_mau?: number;       // dari Stream.io API — bisa null
  fonnte_usage?: number;     // OTP bulan ini
  registrations_7d: Array<{ date: string; count: number }>;
  recent_groups: Array<{ id: string; name: string; status: string; created_at: string; member_count: number }>;
  recent_users: Array<{ id: string; phone: string; name: string | null; created_at: string; group_count: number }>;
};

// GET /api/proxy/otp-stats
type OtpStats = {
  daily: Array<{ date: string; sent: number; failed: number }>;
  rate_limited: Array<{ phone: string; attempt_count: number; window_start: string }>;
};
```

---

## `app/(admin)/overview/page.tsx`

```typescript
'use client';
import { useEffect, useState } from 'react';
import { Users, Layers, MessageSquare, Bell } from 'lucide-react';
import { adminFetch } from '@/lib/api';
import { formatDate, maskPhone } from '@/lib/utils';
import { StatCard } from '@/components/ui/StatCard';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { RegistrationChart } from '@/components/charts/LineChart';
import { OtpChart } from '@/components/charts/BarChart';

// Helper: cek threshold dan buat alert
function buildAlerts(data: OverviewData): Alert[] {
  const alerts: Alert[] = [];
  if ((data.stream_mau ?? 0) > 800)
    alerts.push({ id: 'stream', message: '⚠ Stream.io MAU mendekati limit 1000. Pantau penggunaan.', severity: 'warning' });
  if ((data.fonnte_usage ?? 0) > 800)
    alerts.push({ id: 'fonnte', message: '⚠ Fonnte mendekati limit 1000 OTP/bulan.', severity: 'warning' });
  if ((data.stream_mau ?? 0) > 950)
    alerts.push({ id: 'stream-critical', message: '🚨 Stream.io MAU kritis! Segera hubungi Anthropic/Stream.', severity: 'critical' });
  return alerts;
}

export default function OverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const overview = await adminFetch<OverviewData>('stats/overview');
      setData(overview);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <p className="font-medium">Gagal memuat data: {error}</p>
        <button onClick={fetchData} className="mt-3 text-sm underline">Coba Lagi</button>
      </div>
    );
  }

  const alerts = data ? buildAlerts(data) : [];

  return (
    <div className="space-y-6">
      {/* Alert threshold */}
      <AlertBanner alerts={alerts} />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total User" value={data?.total_users ?? 0} icon={Users} loading={loading} />
        <StatCard label="Grup Aktif" value={data?.active_groups ?? 0} icon={Layers} loading={loading} />
        <StatCard label="OTP Bulan Ini" value={data?.otp_this_month ?? 0} icon={MessageSquare} loading={loading} />
        <StatCard label="Push Token" value={data?.push_tokens_registered ?? 0} icon={Bell} loading={loading} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Registrasi User — 7 Hari Terakhir</h2>
          {loading ? <div className="h-48 bg-gray-100 rounded animate-pulse" /> : (
            <RegistrationChart data={data?.registrations_7d ?? []} />
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">OTP Dikirim — 7 Hari Terakhir</h2>
          {loading ? <div className="h-48 bg-gray-100 rounded animate-pulse" /> : (
            <OtpChart data={data?.registrations_7d ?? []} />
          )}
        </div>
      </div>

      {/* Recent tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">5 Grup Terbaru</h2>
          <DataTable
            loading={loading}
            data={(data?.recent_groups ?? []).slice(0, 5)}
            columns={[
              { key: 'name', label: 'Nama Grup', render: r => <span className="font-medium">{r.name}</span> },
              { key: 'status', label: 'Status', render: r => <Badge status={r.status} /> },
              { key: 'created_at', label: 'Dibuat', render: r => formatDate(r.created_at) },
            ]}
          />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">5 User Terbaru</h2>
          <DataTable
            loading={loading}
            data={(data?.recent_users ?? []).slice(0, 5)}
            columns={[
              { key: 'phone', label: 'Nomor HP', render: r => <span className="font-mono text-sm">{maskPhone(r.phone)}</span> },
              { key: 'group_count', label: 'Grup', render: r => r.group_count },
              { key: 'created_at', label: 'Daftar', render: r => formatDate(r.created_at) },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## `components/charts/LineChart.tsx`

```typescript
'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type DataPoint = { date: string; count: number };

export function RegistrationChart({ data }: { data: DataPoint[] }) {
  const formatted = data.map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={192}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} />
        <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
          labelStyle={{ color: '#111827' }}
        />
        <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="User baru" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## `components/charts/BarChart.tsx`

```typescript
'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type DataPoint = { date: string; sent?: number; failed?: number };

export function OtpChart({ data }: { data: DataPoint[] }) {
  const formatted = data.map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={192}>
      <BarChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} />
        <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="sent" name="Terkirim" fill="#10b981" radius={[3, 3, 0, 0]} />
        <Bar dataKey="failed" name="Gagal" fill="#f87171" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

---

## Checklist

```
[ ] AlertBanner muncul jika stream_mau > 800?
[ ] 4 StatCard semua tampil loading skeleton saat fetching?
[ ] Error state ada tombol "Coba Lagi"?
[ ] Phone di recent_users ditampilkan masked (maskPhone())?
[ ] Charts render tanpa error (recharts 'use client')?
[ ] npm run build berhasil?
```

## Update PROGRESS.md — WAJIB

```
Commit: "feat(ad): overview dashboard + charts + alert threshold"
Update AD-2.
```

**Sesi berikutnya:** `AD-3-users.md`

---
---

