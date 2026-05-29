# AD-3 — User Management

> **Prompt pembuka:**
> ```
> Baca CLAUDE.md dan PROGRESS.md. Konfirmasi AD-2 + BE-7 users routes selesai.
> Scope: app/(admin)/users/page.tsx + app/(admin)/users/[id]/page.tsx.
> INGAT: semua aksi destruktif (suspend, delete) WAJIB lewat ConfirmModal.
> ```

---

## Konteks

Halaman untuk monitoring dan moderasi user. Operator bisa: lihat semua user (phone masked), suspend/unsuspend, dan hapus akun (anonymize untuk UU PDP). Tidak ada aksi yang bisa dibalik setelah "Hapus Akun".

---

## `app/(admin)/users/page.tsx` — User List

```typescript
'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { adminFetch } from '@/lib/api';
import { formatDate, maskPhone } from '@/lib/utils';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

type User = { id: string; phone: string; name: string | null; created_at: string; group_count: number; deleted_at: string | null };
type Response = { users: User[]; total: number; page: number; limit: number };

const LIMIT = 20;

export default function UsersPage() {
  const router = useRouter();
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [confirm, setConfirm] = useState<{ type: 'suspend' | 'unsuspend' | 'delete'; userId: string; phone: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: String(LIMIT), ...(search && { search }), ...(status && { status }) });
      const res = await adminFetch<Response>(`users?${qs}`);
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleAction() {
    if (!confirm) return;
    setActionLoading(true);
    try {
      if (confirm.type === 'delete') {
        await adminFetch(`users/${confirm.userId}`, { method: 'DELETE' });
      } else {
        await adminFetch(`users/${confirm.userId}/${confirm.type}`, { method: 'POST' });
      }
      setConfirm(null);
      fetchUsers();
    } finally {
      setActionLoading(false);
    }
  }

  const columns = [
    { key: 'phone', label: 'Nomor HP', render: (r: User) => <span className="font-mono text-sm">{maskPhone(r.phone)}</span> },
    { key: 'name', label: 'Nama', render: (r: User) => r.name ?? <span className="text-gray-400 italic">Belum diisi</span> },
    { key: 'created_at', label: 'Tgl Daftar', render: (r: User) => formatDate(r.created_at) },
    { key: 'group_count', label: 'Grup', render: (r: User) => r.group_count },
    { key: 'status', label: 'Status', render: (r: User) => <Badge status={r.deleted_at ? 'suspended' : 'active'} /> },
    {
      key: 'actions', label: '', width: '160px',
      render: (r: User) => (
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          {r.deleted_at ? (
            <button onClick={() => setConfirm({ type: 'unsuspend', userId: r.id, phone: r.phone })}
              className="text-xs text-emerald-600 hover:underline">Unsuspend</button>
          ) : (
            <button onClick={() => setConfirm({ type: 'suspend', userId: r.id, phone: r.phone })}
              className="text-xs text-orange-500 hover:underline">Suspend</button>
          )}
          <button onClick={() => setConfirm({ type: 'delete', userId: r.id, phone: r.phone })}
            className="text-xs text-red-500 hover:underline">Hapus</button>
        </div>
      ),
    },
  ];

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nomor HP..."
            value={searchInput}
            onChange={e => { setSearchInput(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
        >
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="suspended">Suspended</option>
        </select>
        <span className="text-sm text-gray-500 ml-auto">
          {data ? `${data.total} user` : ''}
        </span>
      </div>

      <DataTable
        columns={columns}
        data={data?.users ?? []}
        loading={loading}
        emptyMessage="Tidak ada user ditemukan"
        onRowClick={row => router.push(`/users/${row.id}`)}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmModal
        open={!!confirm}
        title={confirm?.type === 'delete' ? 'Hapus Akun User' : confirm?.type === 'suspend' ? 'Suspend User' : 'Unsuspend User'}
        description={
          confirm?.type === 'delete'
            ? `Hapus akun ${maskPhone(confirm?.phone ?? '')}? Data akan dianonimkan. Aksi ini tidak bisa dibatalkan.`
            : confirm?.type === 'suspend'
            ? `Suspend user ${maskPhone(confirm?.phone ?? '')}? User tidak bisa login sampai di-unsuspend.`
            : `Unsuspend user ${maskPhone(confirm?.phone ?? '')}? User bisa login kembali.`
        }
        confirmLabel={confirm?.type === 'delete' ? 'Ya, Hapus Akun' : confirm?.type === 'suspend' ? 'Ya, Suspend' : 'Ya, Unsuspend'}
        confirmVariant={confirm?.type === 'delete' ? 'danger' : 'primary'}
        loading={actionLoading}
        onConfirm={handleAction}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
```

---

## `app/(admin)/users/[id]/page.tsx` — User Detail

Tampilkan:
- Info user: HP masked, nama, tgl daftar, status
- Flag otomatis (badge merah): jika OTP >3x/jam atau buat >5 grup/hari
- List grup yang diikuti (tabel: nama grup, status, urutan, tgl join)
- OTP delivery history (tabel: waktu, status sent/failed, error jika ada) — 10 terbaru
- Tombol Suspend / Unsuspend (ConfirmModal)
- Tombol Hapus Akun (ConfirmModal — teks lebih keras: "Tidak bisa dibatalkan")

Fetch: `GET /api/proxy/users/[id]`

---

## Checklist

```
[ ] Search: debounce 300ms, tidak hit API setiap keystroke?
[ ] Filter status aktif mengubah query ke API?
[ ] Klik row → navigate ke /users/[id]?
[ ] Suspend/delete: WAJIB lewat ConfirmModal (tidak ada aksi langsung)?
[ ] Phone di SEMUA tempat menggunakan maskPhone()?
[ ] Pagination aktif dan halaman reset ke 1 saat search berubah?
[ ] User detail: flag otomatis tampil jika ada anomali?
```

## Update PROGRESS.md — WAJIB

```
Commit: "feat(ad): user management — list, search, filter, suspend, delete"
Update AD-3.
```

**Sesi berikutnya:** `AD-4-groups.md`

---
---

