# AD-4 — Group Monitoring

> **Prompt pembuka:**
> ```
> Baca CLAUDE.md dan PROGRESS.md. Konfirmasi AD-3 + BE-7 groups routes selesai.
> Scope: app/(admin)/groups/page.tsx + app/(admin)/groups/[id]/page.tsx.
> Ini halaman read-only — tidak ada aksi destruktif pada grup.
> ```

---

## `app/(admin)/groups/page.tsx` — Group List

Sama dengan pola UsersPage. Fetch: `GET /api/proxy/groups?page=&status=&search=`

Kolom tabel:
- Nama Grup
- Ketua (phone masked)
- Anggota (count/jumlah_periode, misal "5/10")
- Nominal (formatRupiah)
- Status (Badge)
- Tgl Dibuat

Filter: status (semua/recruiting/active/completed/disbanded). Search by nama grup.
Klik row → navigate ke `/groups/[id]`.

Flag visual di baris: badge kuning jika nominal > 10 juta, atau badge merah jika anggota > 30.

---

## `app/(admin)/groups/[id]/page.tsx` — Group Detail

Fetch: `GET /api/proxy/groups/[id]`

Tampilkan dalam beberapa section:

**Section: Info Grup**
- Nama, status (Badge), nominal (formatRupiah), frekuensi (formatFrekuensi), mode undian (formatModeUndian)
- Ketua: HP masked
- Tgl dibuat

**Section: Anggota (tabel)**
Kolom: urutan · nama/HP masked · tgl join · status bayar periode aktif

**Section: Progress Periode**
Tabel semua periode: periode ke · tanggal pelaksanaan · jatuh tempo · status · jumlah yang bayar/total

**Section: Activity Log (10 terbaru)**
List: `[tanggal] · [aktor HP masked] — [deskripsi aksi]`

---

## Checklist

```
[ ] Tidak ada aksi destruktif di halaman grup?
[ ] Phone di semua tempat menggunakan maskPhone()?
[ ] Flag nominal >10jt dan anggota >30 tampil sebagai badge?
[ ] Pagination aktif di group list?
[ ] Group detail: semua section ada loading skeleton?
```

## Update PROGRESS.md — WAJIB

```
Commit: "feat(ad): group monitoring — list + detail + activity log"
Update AD-4.
```

**Sesi berikutnya:** `AD-5-otp-system.md`

---
---

