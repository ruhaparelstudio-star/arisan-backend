# AD-5 — OTP Monitor & System Health

> **Prompt pembuka:**
> ```
> Baca CLAUDE.md dan PROGRESS.md. Konfirmasi AD-4 + BE-7 otp-stats + system-health selesai.
> Scope: app/(admin)/otp/page.tsx + app/(admin)/system/page.tsx.
> System Health: auto-refresh setiap 30 detik — konfirmasi dulu sebelum implement.
> ```

---

## `app/(admin)/otp/page.tsx` — OTP Monitor

Fetch: `GET /api/proxy/otp-stats`

**Section: Quota Fonnte**
```typescript
// Progress bar visual
const usagePercent = (fonnte_usage / 1000) * 100;
// Warna: < 70% → emerald, 70-85% → amber, > 85% → red
```
Tampilkan: `[usage] / 1000 OTP bulan ini · [persen]%`

**Section: Grafik OTP 30 Hari**
Gunakan `OtpChart` dari AD-2 tapi dengan data 30 hari. Bar hijau = terkirim, merah = gagal.

**Section: Nomor Kena Rate Limit**
Tabel: HP masked · jumlah percobaan · waktu window mulai · tombol "Reset Rate Limit"

Reset rate limit: `POST /api/proxy/otp-stats/reset-rate-limit` dengan body `{ phone }`
Tampilkan ConfirmModal sebelum reset.

---

## `app/(admin)/system/page.tsx` — System Health

```typescript
'use client';
import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { adminFetch } from '@/lib/api';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

type HealthData = {
  supabase: 'ok' | 'error';
  api: 'ok' | 'error';
  stream: 'ok' | 'error';
  checked_at: string;
};

type CronType = 'payment-reminder' | 'pelaksanaan-reminder' | 'mark-late';

const SERVICES = [
  { key: 'supabase', label: 'Supabase Database' },
  { key: 'api', label: 'Hono API' },
  { key: 'stream', label: 'Stream.io Chat' },
] as const;

const CRON_JOBS: { type: CronType; label: string; description: string }[] = [
  { type: 'payment-reminder', label: 'Payment Reminder', description: 'Kirim notifikasi pengingat bayar ke anggota yang belum bayar.' },
  { type: 'pelaksanaan-reminder', label: 'Pelaksanaan Reminder', description: 'Kirim notifikasi H-7 sebelum pelaksanaan arisan.' },
  { type: 'mark-late', label: 'Mark Late Payments', description: 'Tandai pembayaran yang melewati jatuh tempo sebagai terlambat.' },
];

export default function SystemPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cronConfirm, setCronConfirm] = useState<CronType | null>(null);
  const [cronLoading, setCronLoading] = useState(false);
  const [cronResult, setCronResult] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<HealthData>('system-health');
      setHealth(data);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh setiap 30 detik
  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30_000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  async function triggerCron() {
    if (!cronConfirm) return;
    setCronLoading(true);
    setCronResult(null);
    try {
      const result = await adminFetch<{ message: string }>(`cron/trigger/${cronConfirm}`, { method: 'POST' });
      setCronResult(`✓ ${result.message}`);
    } catch (e) {
      setCronResult(`✗ Error: ${(e as Error).message}`);
    } finally {
      setCronLoading(false);
      setCronConfirm(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Service Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Status Service</h2>
          <button onClick={fetchHealth} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {health?.checked_at ? `Terakhir: ${new Date(health.checked_at).toLocaleTimeString('id-ID')}` : 'Refresh'}
          </button>
        </div>
        <div className="space-y-3">
          {SERVICES.map(({ key, label }) => {
            const status = health?.[key as keyof HealthData];
            return (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{label}</span>
                {loading ? (
                  <Loader2 size={18} className="animate-spin text-gray-300" />
                ) : status === 'ok' ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 text-sm">
                    <CheckCircle2 size={18} />
                    <span>Aktif</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-red-500 text-sm">
                    <XCircle size={18} />
                    <span>Error</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Cron Trigger */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Manual Cron Trigger</h2>
        <p className="text-sm text-gray-500 mb-4">Jalankan cron job secara manual untuk testing. Gunakan dengan hati-hati — akan mengirim notifikasi ke user sungguhan.</p>
        <div className="space-y-3">
          {CRON_JOBS.map(job => (
            <div key={job.type} className="flex items-center justify-between py-3 border border-gray-200 rounded-lg px-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{job.label}</p>
                <p className="text-xs text-gray-500">{job.description}</p>
              </div>
              <button
                onClick={() => { setCronResult(null); setCronConfirm(job.type); }}
                className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                Jalankan
              </button>
            </div>
          ))}
        </div>
        {cronResult && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${cronResult.startsWith('✓') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
            {cronResult}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!cronConfirm}
        title={`Jalankan ${CRON_JOBS.find(j => j.type === cronConfirm)?.label ?? ''}`}
        description={`${CRON_JOBS.find(j => j.type === cronConfirm)?.description ?? ''} Notifikasi akan dikirim ke user sungguhan.`}
        confirmLabel="Ya, Jalankan"
        confirmVariant="primary"
        loading={cronLoading}
        onConfirm={triggerCron}
        onCancel={() => setCronConfirm(null)}
      />
    </div>
  );
}
```

---

## Checklist

```
[ ] Progress bar Fonnte: warna berubah sesuai persentase?
[ ] Grafik OTP 30 hari render tanpa error?
[ ] Reset rate limit: lewat ConfirmModal?
[ ] System health: auto-refresh 30 detik aktif?
[ ] Cron trigger: WAJIB lewat ConfirmModal dengan deskripsi akibat?
[ ] Hasil cron trigger ditampilkan (sukses/gagal)?
[ ] Tidak ada ADMIN_SECRET_KEY di bundle client?
```

## Update PROGRESS.md — WAJIB

```
Commit: "feat(ad): OTP monitor + system health + cron trigger"
Update AD-5.
```

**Sesi berikutnya:** `AD-6-deploy.md`

---
---

