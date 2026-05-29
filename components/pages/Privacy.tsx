"use client";

/* ============ Privacy & PDP (UU PDP compliance) ============ */
import { useState } from "react";
import type { IconName } from "../Icon";
import { Icon } from "../Icon";
import { StatCard, CardHead, Progress } from "../common";
import { ConfirmModal } from "../states";
import { toast } from "@/lib/toast";

type PdpRequest = {
  id: string;
  type: "hapus" | "ekspor" | "akses" | "koreksi";
  user: string;
  uid: string;
  date: string;
  status: "pending" | "diproses" | "selesai";
  note: string;
};

const PDP_REQUESTS_SEED: PdpRequest[] = [
  { id: "REQ-501", type: "hapus", user: "Joko Susilo", uid: "USR-1008", date: "28 Mei 2026", status: "pending", note: "Minta hapus akun permanen" },
  { id: "REQ-502", type: "ekspor", user: "Maya Sari", uid: "USR-1007", date: "27 Mei 2026", status: "pending", note: "Unduh seluruh data pribadi" },
  { id: "REQ-503", type: "akses", user: "Bayu Aji", uid: "USR-1012", date: "27 Mei 2026", status: "diproses", note: "Lihat data yang disimpan" },
  { id: "REQ-504", type: "koreksi", user: "Sri Wahyuni", uid: "USR-1019", date: "26 Mei 2026", status: "pending", note: "Perbaiki nomor HP" },
  { id: "REQ-505", type: "hapus", user: "Eko Prasetyo", uid: "USR-1014", date: "25 Mei 2026", status: "selesai", note: "Akun di-anonymize" },
];

export function PagePrivacy() {
  const [reqs, setReqs] = useState<PdpRequest[]>(PDP_REQUESTS_SEED);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<PdpRequest | null>(null);

  const pending = reqs.filter((r) => r.status === "pending").length;

  const typeMeta: Record<string, { label: string; ico: IconName; cls: string }> = {
    hapus: { label: "Hapus akun", ico: "trash", cls: "danger" },
    ekspor: { label: "Ekspor data", ico: "download", cls: "info" },
    akses: { label: "Akses data", ico: "eye", cls: "neutral" },
    koreksi: { label: "Koreksi data", ico: "refresh", cls: "warn" },
  };
  const statusMeta: Record<string, [string, string]> = {
    pending: ["warn", "Menunggu"],
    diproses: ["info", "Diproses"],
    selesai: ["ok", "Selesai"],
  };

  const process = (r: PdpRequest) => {
    setConfirm(null);
    setBusy(r.id);
    toast("loading", "Memproses permintaan…", r.id);
    setTimeout(() => {
      setBusy(null);
      setReqs((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: "selesai" } : x)));
      toast(
        "success",
        "Permintaan diselesaikan",
        r.type === "hapus" ? "Akun " + r.user + " telah di-anonymize sesuai UU PDP" : "Data " + r.user + " telah diproses",
      );
    }, 1500);
  };

  const retention: { ico: IconName; label: string; val: string; desc: string }[] = [
    { ico: "message", label: "Log OTP & verifikasi", val: "90 hari", desc: "Dihapus otomatis via pg_cron" },
    { ico: "inbox", label: "Riwayat chat grup", val: "12 bulan", desc: "Disimpan di Stream.io" },
    { ico: "user", label: "Data akun & profil", val: "Sampai dihapus", desc: "Anonymize saat permintaan PDP" },
    { ico: "money", label: "Riwayat transaksi arisan", val: "5 tahun", desc: "Kewajiban pencatatan" },
  ];
  const consents = [
    { label: "Syarat & Ketentuan", rate: 100, sub: "327 dari 327 user" },
    { label: "Kebijakan Privasi", rate: 100, sub: "327 dari 327 user" },
    { label: "Notifikasi WhatsApp", rate: 86, sub: "281 dari 327 user" },
    { label: "Berbagi data analitik", rate: 64, sub: "209 dari 327 user" },
  ];
  const anonLog = [
    { user: "Eko Prasetyo", uid: "USR-1014", when: "25 Mei 2026, 14:02", by: "App Owner" },
    { user: "Rina (dihapus)", uid: "USR-0997", when: "18 Mei 2026, 09:41", by: "App Owner" },
    { user: "Anonim #8821", uid: "USR-0981", when: "11 Mei 2026, 16:20", by: "Sistem (auto)" },
  ];

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <StatCard icon="inbox" iconBg="var(--warning-light)" iconColor="var(--warning)" label="Permintaan Subjek Data" value={pending} suffix=" menunggu" />
        <StatCard icon="trash" iconBg="var(--danger-light)" iconColor="var(--danger)" label="Akun Di-anonymize" value={12} />
        <StatCard icon="shield" iconBg="var(--primary-light)" iconColor="var(--primary-dark)" label="Consent Rate (Privasi)" value="100" suffix="%" />
        <StatCard icon="clock" iconBg="var(--info-light)" iconColor="var(--info)" label="SLA Penyelesaian" value="≤ 3" suffix=" hari" />
      </div>

      {/* Data subject requests */}
      <div className="card">
        <div className="card-pad" style={{ borderBottom: "1px solid var(--line)" }}>
          <CardHead
            title="Permintaan Subjek Data (DSR)"
            sub="Hak akses, koreksi, hapus & portabilitas data — UU No. 27/2022 (PDP)"
            right={<span className={"badge " + (pending ? "warn" : "ok")}><span className="bdot"></span>{pending} perlu tindakan</span>}
          />
        </div>
        <div className="tbl-wrap card-pad" style={{ paddingTop: 8 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th><th>Jenis Permintaan</th><th>User</th><th>Tanggal</th><th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reqs.map((r) => {
                const tm = typeMeta[r.type];
                const sm = statusMeta[r.status];
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{r.id}</td>
                    <td>
                      <span className={"badge " + tm.cls}><Icon name={tm.ico} size={12} />{tm.label}</span>
                      <div className="cell-sub" style={{ marginTop: 4 }}>{r.note}</div>
                    </td>
                    <td>
                      <div className="cell-main" style={{ fontSize: 12.5 }}>{r.user}</div>
                      <div className="cell-sub">{r.uid}</div>
                    </td>
                    <td className="cell-sub" style={{ fontWeight: 600 }}>{r.date}</td>
                    <td><span className={"badge " + sm[0]}><span className="bdot"></span>{sm[1]}</span></td>
                    <td style={{ textAlign: "right" }}>
                      {r.status === "selesai" ? (
                        <span className="cell-sub" style={{ fontWeight: 600 }}>
                          <Icon name="check" size={14} color="var(--primary)" /> Selesai
                        </span>
                      ) : (
                        <button
                          className={"btn btn-sm " + (r.type === "hapus" ? "btn-danger" : "btn-primary")}
                          disabled={busy === r.id}
                          onClick={() => (r.type === "hapus" ? setConfirm(r) : process(r))}
                        >
                          {busy === r.id ? (
                            <span className="spinner" style={{ width: 14, height: 14, borderColor: "rgba(0,0,0,.15)", borderTopColor: "currentColor" }}></span>
                          ) : (
                            <Icon name={tm.ico} size={14} />
                          )}
                          {r.type === "hapus" ? "Anonymize" : "Proses"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Retention */}
        <div className="card card-pad">
          <CardHead title="Kebijakan Retensi Data" sub="Berapa lama setiap jenis data disimpan" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {retention.map((r) => (
              <div key={r.label} className="qlink" style={{ cursor: "default" }}>
                <div className="ico" style={{ background: "var(--canvas)", color: "var(--primary-dark)" }}><Icon name={r.ico} size={16} /></div>
                <div style={{ flex: 1 }}>
                  <div className="nm">{r.label}</div>
                  <div className="st">{r.desc}</div>
                </div>
                <span className="badge neutral">{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Consent */}
        <div className="card card-pad">
          <CardHead title="Persetujuan (Consent)" sub="Tingkat penerimaan per kebijakan" />
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 4 }}>
            {consents.map((c) => (
              <div key={c.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{c.label}</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: c.rate >= 90 ? "var(--primary-dark)" : "var(--ink-2)" }}>{c.rate}%</span>
                </div>
                <Progress value={c.rate} color={c.rate >= 90 ? "var(--primary)" : c.rate >= 70 ? "var(--info)" : "var(--warning)"} />
                <div className="cell-sub" style={{ marginTop: 6 }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anonymization audit log */}
      <div className="card card-pad">
        <CardHead
          title="Log Anonimisasi & Penghapusan"
          sub="Audit trail — siapa menghapus/anonymize data dan kapan"
          right={<button className="btn btn-line btn-sm"><Icon name="download" size={14} />Ekspor log</button>}
        />
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>User</th><th>ID</th><th>Waktu</th><th>Dilakukan oleh</th><th>Status</th></tr></thead>
            <tbody>
              {anonLog.map((a, i) => (
                <tr key={i}>
                  <td className="cell-main" style={{ fontSize: 12.5 }}>{a.user}</td>
                  <td className="cell-sub" style={{ fontWeight: 600 }}>{a.uid}</td>
                  <td className="cell-sub" style={{ fontWeight: 600 }}>{a.when}</td>
                  <td><span className="badge neutral"><Icon name="user" size={11} />{a.by}</span></td>
                  <td><span className="badge ok"><span className="bdot"></span>Ter-anonim</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {confirm && (
        <ConfirmModal
          icon="trash"
          title="Anonymize akun permanen?"
          desc={"Data pribadi " + confirm.user + " (" + confirm.uid + ") akan dianonimkan: nama diganti, nomor HP di-hash, foto dihapus. Tindakan ini sesuai UU PDP dan tidak dapat dibatalkan."}
          confirmLabel="Ya, anonymize"
          confirmClass="btn-danger"
          onConfirm={() => process(confirm)}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
