# AD-1 — Layout & Komponen UI

> **Prompt pembuka:**
> ```
> Baca CLAUDE.md dan PROGRESS.md sekarang.
> Konfirmasi: AD-0 selesai? (docker-compose up jalan di port 3000?)
> Scope sesi ini: layout shell + semua komponen UI reusable.
> Belum ada data fetching — semua komponen pakai props/dummy data dulu.
> Jangan sentuh file di luar components/ dan app/(admin)/layout.tsx.
> ```

---

## Konteks

Sesi ini membangun semua "bata" UI yang dipakai di halaman AD-2 sampai AD-5. Selesaikan sesi ini dulu sebelum mulai halaman bisnis apapun.

---

## `app/(admin)/layout.tsx` — Shell Lengkap

```typescript
'use client';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

const PAGE_TITLES: Record<string, string> = {
  '/overview': 'Overview',
  '/users': 'Manajemen User',
  '/groups': 'Monitoring Grup',
  '/otp': 'OTP Monitor',
  '/system': 'System Health',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const baseRoute = '/' + pathname.split('/')[1];
  const title = PAGE_TITLES[baseRoute] ?? 'Arisan Admin';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentPath={pathname} />
      <div className="flex-1 flex flex-col ml-64">
        <TopBar title={title} />
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## `components/layout/Sidebar.tsx`

```typescript
'use client';
import Link from 'next/link';
import { LayoutDashboard, Users, Layers, MessageSquare, Activity } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/users', label: 'Manajemen User', icon: Users },
  { href: '/groups', label: 'Monitoring Grup', icon: Layers },
  { href: '/otp', label: 'OTP Monitor', icon: MessageSquare },
  { href: '/system', label: 'System Health', icon: Activity },
];

export function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 fixed top-0 left-0 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">Arisan Admin</p>
          <p className="text-xs text-gray-400">Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = currentPath.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-emerald-600' : 'text-gray-400'} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">Arisan App Phase Awal</p>
      </div>
    </aside>
  );
}
```

---

## `components/layout/TopBar.tsx`

```typescript
'use client';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TopBar({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <button
        onClick={() => router.refresh()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <RefreshCw size={16} />
        Refresh
      </button>
    </header>
  );
}
```

---

## `components/ui/StatCard.tsx`

```typescript
import { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: { value: number; label: string };  // opsional — tampilkan +12% dari bulan lalu
  loading?: boolean;
};

export function StatCard({ label, value, icon: Icon, iconColor = 'text-emerald-600', trend, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
        <div className="h-8 bg-gray-200 rounded w-16" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {trend && (
        <p className={`text-xs mt-1 ${trend.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  );
}
```

---

## `components/ui/AlertBanner.tsx`

```typescript
import { AlertTriangle } from 'lucide-react';

type Alert = {
  id: string;
  message: string;
  severity: 'warning' | 'critical';
};

export function AlertBanner({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return null;

  return (
    <div className="space-y-2 mb-6">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm ${
            alert.severity === 'critical'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}
        >
          <AlertTriangle size={16} className="shrink-0" />
          {alert.message}
        </div>
      ))}
    </div>
  );
}
```

---

## `components/ui/Badge.tsx`

```typescript
const BADGE_STYLES: Record<string, string> = {
  recruiting: 'bg-blue-100 text-blue-700',
  active: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-600',
  disbanded: 'bg-red-100 text-red-600',
  suspended: 'bg-orange-100 text-orange-700',
  sent: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-600',
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  late: 'bg-red-100 text-red-600',
};

const BADGE_LABELS: Record<string, string> = {
  recruiting: 'Rekrutmen',
  active: 'Aktif',
  completed: 'Selesai',
  disbanded: 'Dibubarkan',
  suspended: 'Suspended',
  sent: 'Terkirim',
  failed: 'Gagal',
  pending: 'Belum Bayar',
  confirmed: 'Lunas',
  late: 'Terlambat',
};

export function Badge({ status }: { status: string }) {
  const style = BADGE_STYLES[status] ?? 'bg-gray-100 text-gray-600';
  const label = BADGE_LABELS[status] ?? status;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
```

---

## `components/ui/DataTable.tsx`

```typescript
type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  width?: string;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
};

export function DataTable<T extends { id: string }>({ columns, data, loading, emptyMessage = 'Tidak ada data', onRowClick }: Props<T>) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map(col => (
              <th key={col.key} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide" style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(row => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-gray-700">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
```

---

## `components/ui/Pagination.tsx`

```typescript
type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
      <p>Halaman {page} dari {totalPages}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
```

---

## `components/ui/ConfirmModal.tsx`

```typescript
'use client';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open, title, description, confirmLabel = 'Ya, Lanjutkan',
  confirmVariant = 'danger', loading, onConfirm, onCancel,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50" disabled={loading}>
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded-lg text-white font-medium disabled:opacity-60 ${
              confirmVariant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            {loading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Checklist Anti-Hallucination

```
[ ] Sidebar: semua 5 nav item terdaftar dan link benar?
[ ] ADMIN_SECRET_KEY tidak ada di komponen client manapun?
[ ] StatCard: ada loading skeleton state?
[ ] DataTable: ada loading, empty, dan data state?
[ ] ConfirmModal: ada backdrop click untuk tutup?
[ ] Badge: semua status dari PRD terdaftar (recruiting, active, completed, disbanded)?
[ ] Build berhasil: npm run build tidak error?
```

## Update PROGRESS.md — WAJIB

```
Tandai semua AD-1 yang selesai.
Commit: "feat(ad): layout + sidebar + semua komponen UI reusable"
Push ke feature/ad-w02-layout → PR ke develop
```

**Sesi berikutnya:** `AD-2-overview.md`
