"use client";

/* ============ Page: System Health (6.5) ============ */
import * as D from "@/lib/data";
import { Icon } from "../Icon";
import type { IconName } from "../Icon";
import { CardHead, Donut } from "../common";

export function PageHealth() {
  const h = D.health;

  const gauges: { label: string; value: number; max: number; unit: string; icon: IconName; color: string; warn: number }[] = [
    { label: "Supabase Storage", value: h.supabaseStorage, max: h.supabaseStorageMax, unit: "MB", icon: "db", color: "#3ECF8E", warn: 400 },
    { label: "Stream.io MAU", value: h.streamMau, max: h.streamMauMax || 1000, unit: "", icon: "message", color: "#005FFF", warn: 800 },
    { label: "Fonnte OTP", value: h.fonnteMonth, max: h.fonnteMax, unit: "", icon: "zap", color: "#25D366", warn: 800 },
    { label: "DB Connections", value: h.supabaseConn, max: h.supabaseConnMax, unit: "", icon: "server", color: "#8B5CF6", warn: 48 },
  ];

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* top KPIs */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Donut value={h.apiUptime} max={100} size={90} stroke={11} centerVal={h.apiUptime + "%"} />
          <div>
            <div className="stat-label">API Uptime</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>30 hari terakhir</div>
            <div className="badge ok" style={{ marginTop: 6 }}><span className="bdot"></span>Operational</div>
          </div>
        </div>
        <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="stat-ico" style={{ width: 52, height: 52, background: "var(--primary-light)", color: "var(--primary-dark)" }}>
            <Icon name="gauge" size={26} sw={2} />
          </div>
          <div>
            <div className="stat-label">Rata-rata Response</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{h.apiResp}<span style={{ fontSize: 15, color: "var(--muted)" }}> ms</span></div>
            <div className="delta up" style={{ marginTop: 4 }}><Icon name="arrowDown" size={11} sw={2.6} />12ms lebih cepat</div>
          </div>
        </div>
        <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="stat-ico" style={{ width: 52, height: 52, background: h.apiErrRate > 5 ? "var(--danger-light)" : "var(--primary-light)", color: h.apiErrRate > 5 ? "var(--danger)" : "var(--primary-dark)" }}>
            <Icon name="activity" size={26} sw={2} />
          </div>
          <div>
            <div className="stat-label">API Error Rate</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{h.apiErrRate}<span style={{ fontSize: 15, color: "var(--muted)" }}> %</span></div>
            <div className="scrim-note" style={{ fontWeight: 600, marginTop: 4 }}>ambang alert: 5%</div>
          </div>
        </div>
      </div>

      {/* External service quotas */}
      <div className="card card-pad">
        <CardHead title="Kuota Layanan Eksternal" sub="Pemantauan limit free-tier — penting untuk Phase Awal" />
        <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {gauges.map((g) => {
            const pct = Math.round((g.value / g.max) * 100);
            const isWarn = g.value >= g.warn;
            return (
              <div key={g.label} style={{ textAlign: "center", padding: "8px 4px" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                  <Donut value={g.value} max={g.max} size={132} stroke={14} color={isWarn ? "var(--warning)" : g.color} centerVal={pct + "%"} label={g.value.toLocaleString("id-ID") + (g.unit ? " " + g.unit : "")} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{g.label}</div>
                <div className="scrim-note" style={{ fontWeight: 600, marginTop: 2 }}>limit {g.max.toLocaleString("id-ID")}{g.unit ? " " + g.unit : ""}</div>
                {isWarn && <span className="badge warn" style={{ marginTop: 8 }}><Icon name="alert" size={11} />Mendekati limit</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Services status + endpoints */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
        <div className="card card-pad">
          <CardHead title="Status Layanan" sub="Realtime" right={<span className="badge ok"><span className="live-dot green"></span>Semua online</span>} />
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {D.services.map((s) => (
              <div key={s.name} className="qlink" style={{ cursor: "default" }}>
                <div className="ico" style={{ background: s.color + "1A", color: s.color }}>{s.short}</div>
                <div style={{ flex: 1 }}>
                  <div className="nm">{s.name}</div>
                  <div className="st">{s.desc}</div>
                </div>
                <span className={"live-dot " + s.status}></span>
                <span className="cell-sub" style={{ fontWeight: 700, textTransform: "capitalize", color: s.status === "green" ? "var(--primary-dark)" : "#B45309" }}>
                  {s.status === "green" ? "OK" : "Watch"}
                </span>
              </div>
            ))}
          </div>
          <div className="divider" style={{ margin: "14px 0" }}></div>
          <div className="kv"><span className="k"><Icon name="clock" size={15} color="var(--muted)" />pg_cron scheduler</span><span className="badge ok"><span className="bdot"></span>Berjalan</span></div>
          <div className="kv"><span className="k"><Icon name="refresh" size={15} color="var(--muted)" />Auto-undian terjadwal</span><span className="v">Setiap 00:00 WIB</span></div>
        </div>

        <div className="card card-pad">
          <CardHead title="Performa Endpoint API" sub="Response time & error rate per endpoint" right={<button className="btn btn-line btn-sm"><Icon name="refresh" size={14} />Refresh</button>} />
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Endpoint</th><th>Avg Response</th><th>Error Rate</th><th>Status</th></tr></thead>
              <tbody>
                {D.endpoints.map((e, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, fontWeight: 600 }}>{e.path}</td>
                    <td><span style={{ fontWeight: 700, color: e.resp > 1000 ? "var(--warning)" : "var(--ink)" }}>{e.resp} ms</span></td>
                    <td><span style={{ fontWeight: 700, color: e.err > 1 ? "var(--warning)" : "var(--primary-dark)" }}>{e.err}%</span></td>
                    <td><span className={"live-dot " + e.status} style={{ display: "inline-block" }}></span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="alert-row" style={{ background: "var(--warning-light)", marginTop: 14 }}>
            <div className="alert-ico" style={{ background: "#fff" }}><Icon name="alert" size={17} color="var(--warning)" sw={2} /></div>
            <div className="alert-txt">
              <div className="t">send-otp lebih lambat dari biasanya</div>
              <div className="d">Rata-rata 2.34s — kemungkinan latensi Fonnte. Pantau jika &gt; 3s.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
