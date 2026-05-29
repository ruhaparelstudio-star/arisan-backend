"use client";

/* ============ Page: User Management (6.2) ============ */
import { useState } from "react";
import * as D from "@/lib/data";
import type { User } from "@/lib/data";
import { Icon } from "../Icon";
import { Avatar, StatusBadge, StatCard, CardHead, Empty } from "../common";

export function PageUsers({ search }: { search: string }) {
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState<User | null>(null);
  const [local, setLocal] = useState("");
  const q = (search || local).toLowerCase();

  const filtered = D.users.filter((u) => {
    if (filter === "active" && u.status !== "active") return false;
    if (filter === "suspended" && u.status !== "suspended") return false;
    if (filter === "flagged" && !u.flagged) return false;
    if (q && !u.name.toLowerCase().includes(q) && !u.phone.includes(q) && !u.id.toLowerCase().includes(q)) return false;
    return true;
  });

  const counts: Record<string, number> = {
    all: D.users.length,
    active: D.users.filter((u) => u.status === "active").length,
    suspended: D.users.filter((u) => u.status === "suspended").length,
    flagged: D.users.filter((u) => u.flagged).length,
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* mini stats */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <StatCard icon="users" iconBg="var(--primary-light)" iconColor="var(--primary-dark)" label="Total User Terdaftar" value={counts.all} />
        <StatCard icon="checkCircle" iconBg="var(--info-light)" iconColor="var(--info)" label="User Aktif" value={counts.active} />
        <StatCard icon="ban" iconBg="var(--danger-light)" iconColor="var(--danger)" label="Suspended" value={counts.suspended} />
        <StatCard icon="flag" iconBg="var(--warning-light)" iconColor="var(--warning)" label="Perlu Ditinjau (flag)" value={counts.flagged} />
      </div>

      <div className="card">
        <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", borderBottom: "1px solid var(--line)" }}>
          <div className="chips">
            {([["all", "Semua"], ["active", "Aktif"], ["suspended", "Suspended"], ["flagged", "Perlu ditinjau"]] as [string, string][]).map(([v, l]) => (
              <button key={v} className={"chip" + (filter === v ? " on" : "")} onClick={() => setFilter(v)}>
                {l}
                <span className="ct">{counts[v]}</span>
              </button>
            ))}
          </div>
          <div className="search" style={{ marginLeft: "auto", width: 240 }}>
            <Icon name="search" size={15} color="var(--muted-2)" />
            <input placeholder="Cari nama atau nomor…" value={local} onChange={(e) => setLocal(e.target.value)} />
          </div>
          <button className="btn btn-line btn-sm"><Icon name="download" size={15} />Export</button>
        </div>

        <div className="tbl-wrap card-pad" style={{ paddingTop: 8 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>User</th><th>Nomor HP</th><th>Kota</th><th>Daftar</th><th>Grup</th><th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="clickable" onClick={() => setDetail(u)}>
                  <td>
                    <div className="row-id">
                      <Avatar init={u.initials} color={u.avColor} size={36} />
                      <div>
                        <div className="cell-main" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          {u.name}
                          {u.flagged && (
                            <span className="flag" title={u.flagReason || undefined}>
                              <Icon name="flag" size={11} />Flag
                            </span>
                          )}
                        </div>
                        <div className="cell-sub">{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", color: "var(--ink-2)" }}>{u.phoneMasked}</td>
                  <td className="cell-sub" style={{ fontWeight: 600 }}>{u.city}</td>
                  <td className="cell-sub" style={{ fontWeight: 600 }}>{u.registerStr}</td>
                  <td><span style={{ fontWeight: 700 }}>{u.groups}</span> <span className="cell-sub">grup</span></td>
                  <td><StatusBadge status={u.status} /></td>
                  <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                    <button className="btn btn-ghost btn-sm btn-icon" title="Lihat detail" onClick={() => setDetail(u)}>
                      <Icon name="eye" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <Empty icon="users" title="Tidak ada user" desc="Coba ubah filter atau kata kunci pencarian" />}
        </div>
        <div className="card-pad" style={{ borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="scrim-note">Menampilkan {filtered.length} dari {counts.all} user</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-line btn-sm btn-icon"><Icon name="chevLeft" size={15} /></button>
            <button className="btn btn-primary btn-sm" style={{ minWidth: 34 }}>1</button>
            <button className="btn btn-line btn-sm" style={{ minWidth: 34 }}>2</button>
            <button className="btn btn-line btn-sm btn-icon"><Icon name="chevRight" size={15} /></button>
          </div>
        </div>
      </div>

      {detail && <UserDrawer user={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function UserDrawer({ user, onClose }: { user: User; onClose: () => void }) {
  const otp = D.otpHistoryOf(user);
  const joined = D.groups.filter((_, i) => (user.id.charCodeAt(6) + i) % 3 === 0).slice(0, user.groups || 1);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <Avatar init={user.initials} color={user.avColor} size={46} fz={17} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
              {user.name}
              {user.flagged && <span className="flag"><Icon name="flag" size={11} />Flag</span>}
            </div>
            <div className="cell-sub">{user.id} · Aktif {user.lastActive}</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="drawer-body">
          {user.flagged && (
            <div className="alert-row crit" style={{ background: "var(--danger-light)" }}>
              <div className="alert-ico" style={{ background: "#fff" }}><Icon name="alert" size={18} color="var(--danger)" sw={2} /></div>
              <div className="alert-txt">
                <div className="t" style={{ color: "#B91C1C" }}>Aktivitas mencurigakan terdeteksi</div>
                <div className="d">{user.flagReason}</div>
              </div>
            </div>
          )}

          <div className="card card-pad">
            <CardHead title="Informasi User" right={<StatusBadge status={user.status} />} />
            <div className="kv"><span className="k"><Icon name="phone" size={15} color="var(--muted)" />Nomor HP</span><span className="v" style={{ fontVariantNumeric: "tabular-nums" }}>{user.phoneMasked}</span></div>
            <div className="kv"><span className="k"><Icon name="mapPin" size={15} color="var(--muted)" />Kota</span><span className="v">{user.city}</span></div>
            <div className="kv"><span className="k"><Icon name="calendar" size={15} color="var(--muted)" />Tanggal Register</span><span className="v">{user.registerStr}</span></div>
            <div className="kv"><span className="k"><Icon name="layers" size={15} color="var(--muted)" />Jumlah Grup</span><span className="v">{user.groups} grup</span></div>
            <div className="kv"><span className="k"><Icon name="message" size={15} color="var(--muted)" />OTP Request Hari Ini</span><span className="v" style={{ color: user.otpToday > 3 ? "var(--danger)" : "inherit" }}>{user.otpToday}x {user.otpToday > 3 && "⚠"}</span></div>
          </div>

          <div className="card card-pad">
            <CardHead title="Grup yang Diikuti" sub={joined.length + " grup"} />
            {joined.length ? (
              joined.map((g) => (
                <div key={g.id} className="kv">
                  <span className="k"><Avatar init={g.ketuaInit} color={g.ketuaColor} size={28} />{g.name}</span>
                  <StatusBadge status={g.status} />
                </div>
              ))
            ) : (
              <Empty icon="layers" title="Belum ikut grup" />
            )}
          </div>

          <div className="card card-pad">
            <CardHead title="Histori OTP Request" sub="6 permintaan terakhir" />
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>Waktu</th><th>Channel</th><th>Status</th></tr></thead>
                <tbody>
                  {otp.map((r, i) => (
                    <tr key={i}>
                      <td className="cell-sub" style={{ fontWeight: 600 }}>{r.time}</td>
                      <td><span className="badge ok" style={{ background: "#E7F9EE", color: "#16A34A" }}><Icon name="message" size={12} />{r.channel}</span></td>
                      <td><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {user.status === "active" ? (
              <button className="btn btn-danger" style={{ flex: 1 }}><Icon name="pause" size={16} />Suspend User</button>
            ) : (
              <button className="btn btn-primary" style={{ flex: 1 }}><Icon name="play" size={16} />Unsuspend</button>
            )}
            <button className="btn btn-line" title="Hapus / anonymize akun (UU PDP)"><Icon name="trash" size={16} color="var(--danger)" /></button>
          </div>
          <div className="scrim-note" style={{ textAlign: "center" }}>
            Hapus akun = anonymize data sesuai UU PDP (nama diganti, HP di-hash)
          </div>
        </div>
      </div>
    </div>
  );
}
