"use client";

/* ============ Page: OTP Monitor (6.4) ============ */
import * as D from "@/lib/data";
import { Icon } from "../Icon";
import { StatCard, CardHead, Progress, BarChart, Donut } from "../common";

export function PageOtp() {
  const h = D.health;
  const pct = Math.round((h.fonnteMonth / h.fonnteMax) * 100);
  const otpToday = D.otp7[D.otp7.length - 1];
  const limited = D.otpRateLimited;

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Quota banner */}
      <div
        className="card card-pad"
        style={{
          background: pct > 80 ? "linear-gradient(110deg,#FFFBF3,#fff)" : "#fff",
          borderColor: pct > 80 ? "#F8E3BC" : "var(--line)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
          <div className="stat-ico" style={{ background: "var(--warning-light)", color: "var(--warning)", width: 46, height: 46 }}>
            <Icon name="message" size={22} sw={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Kuota OTP Fonnte — Bulan Ini</div>
            <div className="cell-sub">Mei 2026 · WhatsApp OTP via Fonnte</div>
          </div>
          {pct > 80 && <span className="badge warn"><Icon name="alert" size={12} />Mendekati limit</span>}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.02em" }}>
              {h.fonnteMonth}
              <span style={{ fontSize: 17, color: "var(--muted)", fontWeight: 700 }}> / {h.fonnteMax}</span>
            </div>
            <div className="scrim-note" style={{ fontWeight: 600 }}>{h.fonnteMax - h.fonnteMonth} pesan tersisa</div>
          </div>
        </div>
        <Progress value={h.fonnteMonth} max={h.fonnteMax} color="auto" />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span className="scrim-note">{pct}% terpakai</span>
          <span className="scrim-note">Alert otomatis aktif di &gt; 800 pesan · upgrade plan disarankan</span>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <StatCard icon="message" iconBg="var(--primary-light)" iconColor="var(--primary-dark)" label="OTP Terkirim Hari Ini" value={otpToday} delta={5.1} deltaDir="up" />
        <StatCard icon="calendar" iconBg="var(--info-light)" iconColor="var(--info)" label="OTP Bulan Ini" value={h.fonnteMonth} delta={18.6} deltaDir="up" />
        <StatCard icon="ban" iconBg="var(--danger-light)" iconColor="var(--danger)" label="Nomor Kena Rate Limit" value={limited.length} suffix=" nomor" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <div className="card card-pad">
          <CardHead
            title="OTP Terkirim per Hari"
            sub="7 hari terakhir"
            right={
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="badge ok"><span className="bdot"></span>delivery rate 96.2%</span>
              </div>
            }
          />
          <BarChart data={D.otp7} labels={D.dayLabels7} height={210} valueFmt={(v) => v + " OTP"} />
        </div>
        <div className="card card-pad" style={{ display: "flex", flexDirection: "column" }}>
          <CardHead title="Status Pengiriman" sub="Rasio sukses Fonnte" />
          <div style={{ display: "flex", justifyContent: "center", padding: "14px 0" }}>
            <Donut value={96.2} max={100} size={160} stroke={17} centerVal="96.2%" label="delivery rate" />
          </div>
          <div style={{ marginTop: "auto" }}>
            <div className="kv">
              <span className="k"><span className="bdot" style={{ background: "var(--primary)", width: 8, height: 8, borderRadius: 4, display: "inline-block" }}></span>Terkirim</span>
              <span className="v">810</span>
            </div>
            <div className="kv">
              <span className="k"><span style={{ background: "var(--danger)", width: 8, height: 8, borderRadius: 4, display: "inline-block" }}></span>Gagal (timeout/error)</span>
              <span className="v">32</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-pad" style={{ borderBottom: "1px solid var(--line)" }}>
          <CardHead title="Nomor Kena Rate Limit" sub="Maksimal 5 request OTP per jam per nomor" />
        </div>
        <div className="tbl-wrap card-pad" style={{ paddingTop: 8 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Nomor HP</th><th>Jumlah Attempt</th><th>Percobaan Terakhir</th><th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {limited.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{r.phone}</td>
                  <td><span style={{ fontWeight: 700, color: r.attempts > 7 ? "var(--danger)" : "var(--ink)" }}>{r.attempts}x</span></td>
                  <td className="cell-sub" style={{ fontWeight: 600 }}>{r.lastTry}</td>
                  <td>
                    {r.blocked ? (
                      <span className="badge danger"><span className="bdot"></span>Diblokir</span>
                    ) : (
                      <span className="badge warn"><span className="bdot"></span>Rate limited</span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      <button className="btn btn-line btn-sm"><Icon name="refresh" size={14} />Reset</button>
                      {!r.blocked && <button className="btn btn-danger btn-sm"><Icon name="ban" size={14} />Blokir</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
