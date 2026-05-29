"use client";

/* ============ Page: Overview (6.1) ============ */
import { useState } from "react";
import * as D from "@/lib/data";
import { Icon } from "../Icon";
import {
  Avatar,
  StatusBadge,
  StatCard,
  AreaChart,
  Donut,
  CardHead,
  Segmented,
} from "../common";

export function PageOverview({ setPage }: { setPage: (p: string) => void }) {
  const o = D.overview;
  const [range, setRange] = useState<"7" | "30">("30");
  const regData = range === "7" ? D.reg7 : D.reg30;
  const regLabels = range === "7" ? D.dayLabels7 : D.dayLabels30;
  const recentGroups = D.groups.slice(0, 5);
  const recentUsers = [...D.users].sort((a, b) => +b.register - +a.register).slice(0, 5);
  const crit = D.alerts.filter((a) => a.level === "crit");

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Stat cards */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <StatCard icon="users" iconBg="var(--primary-light)" iconColor="var(--primary-dark)" label="Total User" value={o.totalUsers} delta={o.totalUsersDelta} deltaDir="up" spark={[18, 22, 20, 26, 24, 30, 33]} />
        <StatCard icon="layers" iconBg="var(--info-light)" iconColor="var(--info)" label="Grup Aktif" value={o.activeGroups} delta={o.activeGroupsDelta} deltaDir="up" spark={[26, 28, 27, 30, 31, 33, 34]} />
        <StatCard icon="activity" iconBg="#F3EDFE" iconColor="#8B5CF6" label="MAU Hari Ini" value={o.mauToday} delta={o.mauTodayDelta} deltaDir="up" spark={[180, 195, 188, 210, 205, 214, 218]} />
        <StatCard icon="message" iconBg="var(--warning-light)" iconColor="var(--warning)" label="OTP Bulan Ini" value={o.otpMonth} suffix={" / " + o.otpQuota} delta={o.otpMonthDelta} deltaDir="up" spark={[420, 510, 590, 650, 720, 790, 842]} />
      </div>

      {/* Alerts */}
      <div className="card card-pad">
        <CardHead
          title="Alert Sistem Otomatis"
          sub={crit.length + " peringatan aktif memerlukan perhatian"}
          right={
            <span className={"badge " + (crit.length ? "warn" : "ok")}>
              <span className="bdot"></span>
              {crit.length} aktif · {D.alerts.length - crit.length} normal
            </span>
          }
        />
        <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {D.alerts.map((a) => (
            <div key={a.id} className={"alert-row " + (a.level === "crit" ? "crit" : "okrow")}>
              <div className="alert-ico" style={{ background: "#fff" }}>
                <Icon name={a.level === "crit" ? "alert" : "checkCircle"} size={19} color={a.level === "crit" ? "var(--warning)" : "var(--primary)"} sw={2} />
              </div>
              <div className="alert-txt">
                <div className="t">{a.title}</div>
                <div className="d">{a.desc}</div>
              </div>
              <span className={"badge " + (a.level === "crit" ? "warn" : "ok")} style={{ fontVariantNumeric: "tabular-nums" }}>
                {a.metric}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Registration chart + donut split */}
      <div className="grid" style={{ gridTemplateColumns: "1.7fr 1fr" }}>
        <div className="card card-pad">
          <CardHead
            title="Registrasi User"
            sub="Pendaftaran baru per hari"
            right={<Segmented options={[{ v: "7", l: "7 Hari" }, { v: "30", l: "30 Hari" }]} value={range} onChange={setRange} />}
          />
          <div style={{ display: "flex", gap: 22, marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em" }}>{regData.reduce((a, b) => a + b, 0)}</div>
              <div className="scrim-note">total {range} hari</div>
            </div>
            <div style={{ borderLeft: "1px solid var(--line)", paddingLeft: 22 }}>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em" }}>{Math.round(regData.reduce((a, b) => a + b, 0) / regData.length)}</div>
              <div className="scrim-note">rata-rata / hari</div>
            </div>
          </div>
          <AreaChart data={regData} labels={regLabels} height={210} valueFmt={(v) => v + " user baru"} showDots={range === "7"} />
        </div>

        <div className="card card-pad" style={{ display: "flex", flexDirection: "column" }}>
          <CardHead title="Progress Validasi" sub="Target Phase Awal" />
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 16px" }}>
            <Donut value={o.activeGroups} max={50} size={172} stroke={18} centerVal={o.activeGroups} label="dari 50 grup" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: "auto" }}>
            <div className="kv">
              <span className="k"><Icon name="users" size={15} color="var(--primary)" />User aktif (MAU)</span>
              <span className="v">218 / 50 ✓</span>
            </div>
            <div className="kv">
              <span className="k"><Icon name="layers" size={15} color="var(--info)" />Grup aktif</span>
              <span className="v">34 / 50</span>
            </div>
            <div className="kv">
              <span className="k"><Icon name="trendUp" size={15} color="#8B5CF6" />Retention D30</span>
              <span className="v">63%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent groups + users */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card card-pad">
          <CardHead title="5 Grup Terbaru" right={<button className="btn btn-ghost btn-sm" onClick={() => setPage("groups")}>Lihat semua<Icon name="chevRight" size={14} /></button>} />
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Grup</th><th>Anggota</th><th>Nominal</th><th>Status</th></tr></thead>
              <tbody>
                {recentGroups.map((g) => (
                  <tr key={g.id} className="clickable" onClick={() => setPage("groups")}>
                    <td>
                      <div className="row-id">
                        <Avatar init={g.ketuaInit} color={g.ketuaColor} size={34} />
                        <div>
                          <div className="cell-main">{g.name}</div>
                          <div className="cell-sub">Ketua: {g.ketua}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 700 }}>{g.members}</span></td>
                    <td style={{ fontWeight: 700 }}>{g.nominalStr}</td>
                    <td><StatusBadge status={g.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card card-pad">
          <CardHead title="5 User Terbaru" right={<button className="btn btn-ghost btn-sm" onClick={() => setPage("users")}>Lihat semua<Icon name="chevRight" size={14} /></button>} />
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Nama</th><th>Kota</th><th>Daftar</th><th>Status</th></tr></thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.id} className="clickable" onClick={() => setPage("users")}>
                    <td>
                      <div className="row-id">
                        <Avatar init={u.initials} color={u.avColor} size={34} />
                        <div>
                          <div className="cell-main">{u.name}</div>
                          <div className="cell-sub">{u.phoneMasked}</div>
                        </div>
                      </div>
                    </td>
                    <td className="cell-sub" style={{ fontWeight: 600 }}>{u.city}</td>
                    <td className="cell-sub" style={{ fontWeight: 600 }}>{u.registerStr}</td>
                    <td><StatusBadge status={u.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
