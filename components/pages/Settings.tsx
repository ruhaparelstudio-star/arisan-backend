"use client";

/* ============ Pengaturan (Settings) + state previews ============ */
import { useState } from "react";
import type { IconName } from "../Icon";
import { Icon } from "../Icon";
import { Avatar, CardHead } from "../common";
import { Field, Switch } from "../states";
import { toast } from "@/lib/toast";
import * as D from "@/lib/data";

export function PageSettings({
  onPreviewLoading,
  onPreviewError,
}: {
  onPreviewLoading: () => void;
  onPreviewError: () => void;
}) {
  const [tab, setTab] = useState("umum");
  const [saving, setSaving] = useState(false);

  // editable thresholds
  const [th, setTh] = useState({ streamMau: 800, fonnte: 800, storage: 400, errRate: 5 });
  const [notif, setNotif] = useState<Record<string, boolean>>({ email: true, wa: true, push: false, weekly: true });
  const [profile, setProfile] = useState({ name: "App Owner", email: "owner@arisanapp.id", phone: "812 3456 7890" });

  const save = () => {
    setSaving(true);
    toast("loading", "Menyimpan perubahan…");
    setTimeout(() => {
      setSaving(false);
      toast("success", "Pengaturan disimpan", "Perubahan langsung berlaku");
    }, 1400);
  };

  const integrations = D.services;

  const tabs = [
    { v: "umum", l: "Umum & Profil" },
    { v: "alert", l: "Ambang Alert" },
    { v: "notif", l: "Notifikasi" },
    { v: "integrasi", l: "Integrasi" },
    { v: "states", l: "Status UI" },
  ];

  const notifRows: [string, IconName, string, string][] = [
    ["email", "bell", "Email", "Kirim alert ke "],
    ["wa", "message", "WhatsApp", "Notifikasi langsung via WhatsApp admin"],
    ["push", "zap", "Push notification", "Lewat aplikasi mobile admin"],
    ["weekly", "calendar", "Ringkasan mingguan", "Laporan metrik tiap Senin pagi"],
  ];

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="seg" style={{ alignSelf: "flex-start", flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button key={t.v} className={tab === t.v ? "on" : ""} onClick={() => setTab(t.v)}>
            {t.l}
          </button>
        ))}
      </div>

      {tab === "umum" && (
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
          <div className="card card-pad">
            <CardHead title="Profil Admin" sub="Identitas akun super admin" />
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <Avatar init="AO" color="linear-gradient(135deg,#0F1F1A,#15302a)" size={56} fz={20} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{profile.name}</div>
                <div className="cell-sub">Super Admin · akses penuh</div>
              </div>
              <button className="btn btn-line btn-sm" style={{ marginLeft: "auto" }}>Ganti foto</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Nama"><input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></Field>
              <Field label="Email"><input className="input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></Field>
              <Field label="Nomor WhatsApp">
                <div className="input-group"><span className="prefix">+62</span><input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
              </Field>
            </div>
          </div>
          <div className="card card-pad">
            <CardHead title="Keamanan" sub="Login & akses" />
            <div className="kv"><span className="k"><Icon name="shield" size={15} color="var(--muted)" />Metode login</span><span className="v">OTP WhatsApp</span></div>
            <div className="kv"><span className="k"><Icon name="clock" size={15} color="var(--muted)" />Sesi berakhir</span><span className="v">Setelah 7 hari</span></div>
            <div className="kv"><span className="k"><Icon name="ban" size={15} color="var(--muted)" />Rate limit OTP</span><span className="v">5 / jam</span></div>
            <div className="kv"><span className="k"><Icon name="users" size={15} color="var(--muted)" />Admin terdaftar</span><span className="v">1 akun</span></div>
            <button className="btn btn-line" style={{ width: "100%", marginTop: 16 }}><Icon name="plus" size={15} />Tambah admin</button>
          </div>
        </div>
      )}

      {tab === "alert" && (
        <div className="card card-pad">
          <CardHead title="Ambang Batas Alert Otomatis" sub="Sistem akan mengirim peringatan saat metrik melewati nilai berikut" />
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <ThresholdRow icon="message" iconC="#005FFF" label="Stream.io MAU" desc="Limit free-tier 1.000 MAU" value={th.streamMau} max={1000} unit="" onChange={(v) => setTh({ ...th, streamMau: v })} />
            <ThresholdRow icon="zap" iconC="#25D366" label="Kuota OTP Fonnte" desc="Limit 1.000 pesan / bulan" value={th.fonnte} max={1000} unit="" onChange={(v) => setTh({ ...th, fonnte: v })} />
            <ThresholdRow icon="db" iconC="#3ECF8E" label="Storage Supabase" desc="Limit 500 MB" value={th.storage} max={500} unit=" MB" onChange={(v) => setTh({ ...th, storage: v })} />
            <ThresholdRow icon="activity" iconC="var(--danger)" label="API Error Rate" desc="Ambang sehat di bawah 5%" value={th.errRate} max={20} unit=" %" onChange={(v) => setTh({ ...th, errRate: v })} />
          </div>
          <div className="divider" style={{ margin: "20px 0 16px" }}></div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setTh({ streamMau: 800, fonnte: 800, storage: 400, errRate: 5 })}>Reset default</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? <><span className="spinner" style={{ width: 16, height: 16 }}></span>Menyimpan…</> : <><Icon name="check" size={16} />Simpan ambang</>}
            </button>
          </div>
        </div>
      )}

      {tab === "notif" && (
        <div className="card card-pad" style={{ maxWidth: 640 }}>
          <CardHead title="Preferensi Notifikasi" sub="Pilih cara menerima peringatan sistem" />
          {notifRows.map(([k, ic, label, desc]) => (
            <div key={k} className="kv" style={{ padding: "15px 0" }}>
              <span className="k" style={{ gap: 12 }}>
                <span className="stat-ico" style={{ width: 38, height: 38, background: "var(--canvas)", color: "var(--primary-dark)" }}><Icon name={ic} size={17} /></span>
                <span>
                  <span style={{ display: "block", fontWeight: 700, color: "var(--ink)", fontSize: 13.5 }}>{label}</span>
                  <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{desc}{k === "email" ? profile.email : ""}</span>
                </span>
              </span>
              <Switch on={notif[k]} onChange={(v) => { setNotif({ ...notif, [k]: v }); toast("success", label + (v ? " diaktifkan" : " dimatikan")); }} />
            </div>
          ))}
        </div>
      )}

      {tab === "integrasi" && (
        <div className="card card-pad">
          <CardHead title="Integrasi Layanan" sub="Status koneksi layanan pihak ketiga" right={<button className="btn btn-line btn-sm"><Icon name="refresh" size={14} />Tes koneksi</button>} />
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {integrations.map((s) => (
              <div key={s.name} className="qlink" style={{ cursor: "default", alignItems: "flex-start" }}>
                <div className="ico" style={{ background: s.color + "1A", color: s.color }}>{s.short}</div>
                <div style={{ flex: 1 }}>
                  <div className="nm" style={{ display: "flex", alignItems: "center", gap: 7 }}>{s.name}<span className={"live-dot " + s.status}></span></div>
                  <div className="st">{s.desc}</div>
                  <div style={{ marginTop: 7, fontSize: 11, fontFamily: "ui-monospace,monospace", color: "var(--muted)", background: "var(--canvas)", padding: "4px 8px", borderRadius: 7, display: "inline-block" }}>
                    api_key: ••••••••{s.short}9f
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm btn-icon"><Icon name="settings" size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "states" && (
        <div className="card card-pad" style={{ maxWidth: 720 }}>
          <CardHead title="Status & Umpan Balik UI" sub="Pratinjau seluruh state sistem — loading, sukses, error" />
          <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            <StateDemo ico="checkCircle" c="var(--primary-dark)" bg="var(--primary-light)" title="Sukses" desc="Notifikasi konfirmasi hijau" btn="Tampilkan sukses" onClick={() => toast("success", "Berhasil disimpan", "Aksi kamu telah dijalankan")} />
            <StateDemo ico="xCircle" c="var(--danger)" bg="var(--danger-light)" title="Error" desc="Notifikasi & halaman gagal" btn="Tampilkan error" onClick={() => toast("error", "Terjadi kesalahan", "Tidak dapat menghubungi server")} />
            <StateDemo ico="bell" c="var(--info)" bg="var(--info-light)" title="Info" desc="Notifikasi informatif biru" btn="Tampilkan info" onClick={() => toast("info", "Sinkronisasi berjalan", "Data diperbarui di latar belakang")} />
          </div>
          <div className="divider" style={{ margin: "18px 0" }}></div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn-line" onClick={onPreviewLoading}><span className="spinner dark" style={{ width: 15, height: 15 }}></span>Pratinjau Loading penuh</button>
            <button className="btn btn-line" onClick={onPreviewError}><Icon name="wifi" size={16} color="var(--danger)" />Pratinjau halaman Error</button>
          </div>
          <div className="scrim-note" style={{ marginTop: 14 }}>Skeleton loading juga muncul otomatis tiap kali berpindah halaman.</div>
        </div>
      )}
    </div>
  );
}

function ThresholdRow({
  icon,
  iconC,
  label,
  desc,
  value,
  max,
  unit,
  onChange,
}: {
  icon: IconName;
  iconC: string;
  label: string;
  desc: string;
  value: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: 13 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
        <span className="stat-ico" style={{ width: 36, height: 36, background: "var(--canvas)", color: iconC }}><Icon name={icon} size={17} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5 }}>{label}</div>
          <div className="cell-sub">{desc}</div>
        </div>
        <span style={{ fontWeight: 800, fontSize: 17, fontVariantNumeric: "tabular-nums" }}>{value.toLocaleString("id-ID")}{unit}</span>
      </div>
      <input type="range" min={0} max={max} value={value} onChange={(e) => onChange(+e.target.value)} style={{ width: "100%", accentColor: "var(--primary)" }} />
      <div className="scrim-note" style={{ textAlign: "right", marginTop: 2 }}>alert pada {pct}% kapasitas</div>
    </div>
  );
}

function StateDemo({
  ico,
  c,
  bg,
  title,
  desc,
  btn,
  onClick,
}: {
  ico: IconName;
  c: string;
  bg: string;
  title: string;
  desc: string;
  btn: string;
  onClick: () => void;
}) {
  return (
    <div style={{ padding: 18, border: "1px solid var(--line)", borderRadius: 13, textAlign: "center" }}>
      <div className="stat-ico" style={{ width: 46, height: 46, background: bg, color: c, margin: "0 auto 12px" }}><Icon name={ico} size={22} sw={2} /></div>
      <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
      <div className="cell-sub" style={{ margin: "4px 0 14px" }}>{desc}</div>
      <button className="btn btn-ghost btn-sm" style={{ width: "100%" }} onClick={onClick}>{btn}</button>
    </div>
  );
}
