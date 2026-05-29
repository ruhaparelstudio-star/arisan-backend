"use client";

/* ============ Page: Group Monitoring (6.3) ============ */
import { useState } from "react";
import * as D from "@/lib/data";
import type { Group } from "@/lib/data";
import { Icon } from "../Icon";
import { Avatar, StatusBadge, ModeBadge, StatCard, CardHead, Progress, Empty } from "../common";

export function PageGroups({ search }: { search: string }) {
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState<Group | null>(null);
  const [local, setLocal] = useState("");
  const q = (search || local).toLowerCase();

  const filtered = D.groups.filter((g) => {
    if (filter !== "all" && g.status !== filter) return false;
    if (q && !g.name.toLowerCase().includes(q) && !g.ketua.toLowerCase().includes(q)) return false;
    return true;
  });
  const counts: Record<string, number> = {
    all: D.groups.length,
    aktif: D.groups.filter((g) => g.status === "aktif").length,
    selesai: D.groups.filter((g) => g.status === "selesai").length,
    dibubarkan: D.groups.filter((g) => g.status === "dibubarkan").length,
  };
  const totalPot = D.groups.filter((g) => g.status === "aktif").reduce((a, g) => a + g.potTotal, 0);

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <StatCard icon="layers" iconBg="var(--primary-light)" iconColor="var(--primary-dark)" label="Total Grup" value={counts.all} />
        <StatCard icon="checkCircle" iconBg="var(--info-light)" iconColor="var(--info)" label="Grup Aktif" value={counts.aktif} />
        <StatCard icon="money" iconBg="#F3EDFE" iconColor="#8B5CF6" label="Total Pot Berjalan" value={D.rupiah(totalPot)} compact />
        <StatCard icon="flag" iconBg="var(--warning-light)" iconColor="var(--warning)" label="Grup Perlu Ditinjau" value={D.groups.filter((g) => g.flagged).length} />
      </div>

      <div className="card">
        <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", borderBottom: "1px solid var(--line)" }}>
          <div className="chips">
            {([["all", "Semua"], ["aktif", "Aktif"], ["selesai", "Selesai"], ["dibubarkan", "Dibubarkan"]] as [string, string][]).map(([v, l]) => (
              <button key={v} className={"chip" + (filter === v ? " on" : "")} onClick={() => setFilter(v)}>
                {l}
                <span className="ct">{counts[v]}</span>
              </button>
            ))}
          </div>
          <div className="search" style={{ marginLeft: "auto", width: 240 }}>
            <Icon name="search" size={15} color="var(--muted-2)" />
            <input placeholder="Cari grup atau ketua…" value={local} onChange={(e) => setLocal(e.target.value)} />
          </div>
        </div>

        <div className="tbl-wrap card-pad" style={{ paddingTop: 8 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Grup</th><th>Ketua</th><th>Anggota</th><th>Nominal</th><th>Progress periode</th><th>Mulai</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} className="clickable" onClick={() => setDetail(g)}>
                  <td>
                    <div className="cell-main" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      {g.name}
                      {g.flagged && <span className="flag red" title={g.flagReason || undefined}><Icon name="flag" size={11} />Flag</span>}
                    </div>
                    <div className="cell-sub">{g.id} · <ModeBadgeInline mode={g.mode} /></div>
                  </td>
                  <td>
                    <div className="row-id"><Avatar init={g.ketuaInit} color={g.ketuaColor} size={30} fz={11} /><span style={{ fontWeight: 600, fontSize: 12.5 }}>{g.ketua}</span></div>
                  </td>
                  <td><span style={{ fontWeight: 700 }}>{g.members}</span></td>
                  <td style={{ fontWeight: 700 }}>{g.nominalStr}</td>
                  <td style={{ minWidth: 150 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ flex: 1 }}><Progress value={g.currentPeriod} max={g.totalPeriods} /></div>
                      <span className="cell-sub" style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{g.currentPeriod}/{g.totalPeriods}</span>
                    </div>
                  </td>
                  <td className="cell-sub" style={{ fontWeight: 600 }}>{g.startStr}</td>
                  <td><StatusBadge status={g.status} /></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setDetail(g)}><Icon name="chevRight" size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <Empty icon="layers" title="Tidak ada grup" desc="Coba ubah filter status" />}
        </div>
      </div>

      {detail && <GroupDrawer group={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function ModeBadgeInline({ mode }: { mode: string }) {
  const m: Record<string, string> = { random: "Undian acak", manual: "Manual", offline: "Undian offline" };
  return <span style={{ fontWeight: 600 }}>{m[mode]}</span>;
}

function GroupDrawer({ group, onClose }: { group: Group; onClose: () => void }) {
  const members = D.membersOf(group);
  const [tab, setTab] = useState<"members" | "info">("members");
  const paidCount = members.filter((m) => m.payStatus === "lunas").length;
  const lateCount = members.filter((m) => m.payStatus === "terlambat").length;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <Avatar init={group.ketuaInit} color={group.ketuaColor} size={46} fz={16} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
              {group.name}
              {group.flagged && <span className="flag red"><Icon name="flag" size={11} />Flag</span>}
            </div>
            <div className="cell-sub">{group.id} · Ketua {group.ketua}</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="drawer-body">
          {group.flagged && (
            <div className="alert-row crit">
              <div className="alert-ico" style={{ background: "#fff" }}><Icon name="alert" size={18} color="var(--warning)" sw={2} /></div>
              <div className="alert-txt"><div className="t">Grup di-flag otomatis</div><div className="d">{group.flagReason}</div></div>
            </div>
          )}

          {/* quick stats */}
          <div className="grid" style={{ gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
            <div className="card card-pad" style={{ padding: 16 }}>
              <div className="stat-label">Nominal / periode</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{group.nominalStr}</div>
              <div className="cell-sub" style={{ marginTop: 2 }}>Frekuensi {group.freq}</div>
            </div>
            <div className="card card-pad" style={{ padding: 16 }}>
              <div className="stat-label">Total pot grup</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{D.rupiah(group.potTotal)}</div>
              <div className="cell-sub" style={{ marginTop: 2 }}>{group.members} anggota × {group.totalPeriods} periode</div>
            </div>
          </div>

          <div className="card card-pad">
            <CardHead title={"Progress Periode"} right={<span className="badge info">{group.currentPeriod} / {group.totalPeriods}</span>} />
            <Progress value={group.currentPeriod} max={group.totalPeriods} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, gap: 10 }}>
              <PayStat label="Lunas" value={paidCount} color="var(--primary)" />
              <PayStat label="Belum bayar" value={group.members - paidCount - lateCount} color="var(--warning)" />
              <PayStat label="Terlambat" value={lateCount} color="var(--danger)" />
            </div>
          </div>

          {/* tabs */}
          <div className="seg" style={{ alignSelf: "flex-start" }}>
            <button className={tab === "members" ? "on" : ""} onClick={() => setTab("members")}>Anggota &amp; Bayar</button>
            <button className={tab === "info" ? "on" : ""} onClick={() => setTab("info")}>Info Grup</button>
          </div>

          {tab === "members" ? (
            <div className="card card-pad">
              <CardHead title="Status Bayar Periode Aktif" sub="Audit trail konfirmasi" />
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead><tr><th>Anggota</th><th>Giliran</th><th>Status</th><th>Dikonfirmasi</th></tr></thead>
                  <tbody>
                    {members.map((m, i) => (
                      <tr key={i}>
                        <td>
                          <div className="row-id">
                            <Avatar init={m.init} color={m.color} size={30} fz={11} />
                            <div>
                              <div className="cell-main" style={{ fontSize: 12.5, display: "flex", gap: 6, alignItems: "center" }}>
                                {m.name}
                                {m.isKetua && <span className="badge ok" style={{ padding: "1px 7px", fontSize: 10 }}><Icon name="crown" size={10} />Ketua</span>}
                                {m.won && <span title="Sudah menang"><Icon name="check" size={13} color="var(--primary)" /></span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td><span style={{ fontWeight: 700 }}>#{m.giliran}</span></td>
                        <td><StatusBadge status={m.payStatus} /></td>
                        <td className="cell-sub" style={{ fontWeight: 500, fontSize: 11 }}>
                          {m.confirmedAt ? <span>oleh {group.ketua.split(" ")[0]}<br />{m.confirmedAt}</span> : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card card-pad">
              <CardHead title="Detail Grup" />
              <div className="kv"><span className="k"><Icon name="dice" size={15} color="var(--muted)" />Mode undian</span><span className="v"><ModeBadge mode={group.mode} /></span></div>
              <div className="kv"><span className="k"><Icon name="calendar" size={15} color="var(--muted)" />Frekuensi</span><span className="v" style={{ textTransform: "capitalize" }}>{group.freq}</span></div>
              <div className="kv"><span className="k"><Icon name="users" size={15} color="var(--muted)" />Jumlah anggota</span><span className="v">{group.members} orang</span></div>
              <div className="kv"><span className="k"><Icon name="layers" size={15} color="var(--muted)" />Total periode</span><span className="v">{group.totalPeriods}</span></div>
              <div className="kv"><span className="k"><Icon name="swap" size={15} color="var(--muted)" />Swap giliran</span><span className="v" style={{ color: group.swapCount > 5 ? "var(--danger)" : "inherit" }}>{group.swapCount}x {group.swapCount > 5 && "⚠"}</span></div>
              <div className="kv"><span className="k"><Icon name="calendar" size={15} color="var(--muted)" />Tanggal mulai</span><span className="v">{group.startStr}</span></div>
              <div className="kv"><span className="k"><Icon name="dot" size={15} color="var(--muted)" />Status</span><StatusBadge status={group.status} /></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PayStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ flex: 1, textAlign: "center", padding: "10px 6px", background: "var(--canvas)", borderRadius: 11 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div className="scrim-note" style={{ fontWeight: 600 }}>{label}</div>
    </div>
  );
}
