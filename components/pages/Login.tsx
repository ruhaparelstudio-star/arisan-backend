"use client";

/* ============ Login (phone → OTP) with loading + error + success ============ */
import { useState, useRef, useEffect } from "react";
import type { IconName } from "../Icon";
import { Icon } from "../Icon";
import { Field } from "../states";
import { toast } from "@/lib/toast";

export function PageLogin({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("812 3456 7890");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [err, setErr] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const boxRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const sendOtp = () => {
    if (!phone.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStep("otp");
      setResendIn(30);
      toast("success", "Kode OTP terkirim", "Cek WhatsApp di +62 " + phone);
      setTimeout(() => boxRefs.current[0]?.focus(), 100);
    }, 1300);
  };

  const onOtpChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    setErr(false);
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) boxRefs.current[i + 1]?.focus();
  };
  const onOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) boxRefs.current[i - 1]?.focus();
  };
  const onPaste = (e: React.ClipboardEvent) => {
    const d = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6).split("");
    if (d.length) {
      e.preventDefault();
      const n = ["", "", "", "", "", ""];
      d.forEach((c, i) => (n[i] = c));
      setOtp(n);
      boxRefs.current[Math.min(d.length, 5)]?.focus();
    }
  };

  const verify = () => {
    const code = otp.join("");
    if (code.length < 6) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      if (code === "123456") {
        toast("success", "Berhasil masuk", "Selamat datang kembali, App Owner");
        onDone();
      } else {
        setErr(true);
        toast("error", "Kode OTP salah", "Periksa kembali atau minta kode baru");
      }
    }, 1200);
  };

  const feats: [IconName, string][] = [
    ["users", "Kelola user & grup arisan"],
    ["shield", "Monitoring kepatuhan UU PDP"],
    ["activity", "Pantau kuota & kesehatan sistem"],
  ];

  return (
    <div className="auth">
      {/* Brand side */}
      <div className="auth-side">
        <div className="brand" style={{ padding: 0, color: "#fff" }}>
          <div className="brand-mark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2" />
              <path d="M8 12.5 11 15.5 16.5 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="brand-name" style={{ color: "#fff" }}>Arisan</div>
            <div className="brand-sub" style={{ color: "rgba(255,255,255,.55)" }}>Admin Console</div>
          </div>
        </div>
        <div style={{ margin: "auto 0", position: "relative" }}>
          <span className="badge" style={{ background: "rgba(0,200,151,.16)", color: "var(--primary)", marginBottom: 20 }}>
            <Icon name="sparkle" size={12} />Phase Awal · MVP
          </span>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.15, marginBottom: 14 }}>
            Panel kendali<br />untuk aplikasi arisan Anda.
          </h1>
          <p style={{ fontSize: 14.5, color: "rgba(255,255,255,.6)", lineHeight: 1.6, maxWidth: 380, marginBottom: 36 }}>
            Pantau pertumbuhan user, awasi grup, kelola OTP, dan jaga kesehatan sistem — semua dalam satu dashboard.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {feats.map(([ic, t]) => (
              <div className="auth-feat" key={t}>
                <div className="fi"><Icon name={ic} size={19} color="var(--primary)" /></div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,.88)" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", fontWeight: 500, position: "relative" }}>© 2026 Arisan App · v1.3</div>
      </div>

      {/* Form side */}
      <div className="auth-form-wrap">
        <div className="auth-form fade-in" key={step}>
          {step === "phone" ? (
            <>
              <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: "-.02em" }}>Masuk ke Admin</div>
              <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "6px 0 28px", lineHeight: 1.5 }}>
                Masukkan nomor WhatsApp admin untuk menerima kode OTP.
              </p>
              <Field label="Nomor WhatsApp" hint="Hanya nomor admin terdaftar yang dapat masuk.">
                <div className="input-group">
                  <span className="prefix">+62</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="812 3456 7890"
                    onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                    inputMode="numeric"
                  />
                </div>
              </Field>
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 22, padding: "13px" }} onClick={sendOtp} disabled={sending}>
                {sending ? (
                  <><span className="spinner" style={{ width: 17, height: 17 }}></span>Mengirim OTP…</>
                ) : (
                  <>Kirim Kode OTP<Icon name="chevRight" size={16} /></>
                )}
              </button>
              <div style={{ textAlign: "center", marginTop: 22, fontSize: 12, color: "var(--muted-2)", fontWeight: 500 }}>
                Dilindungi rate-limit · maks 5 permintaan / jam
              </div>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" style={{ marginBottom: 18 }} onClick={() => { setStep("phone"); setOtp(["", "", "", "", "", ""]); setErr(false); }}>
                <Icon name="chevLeft" size={15} />Ganti nomor
              </button>
              <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: "-.02em" }}>Verifikasi OTP</div>
              <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "6px 0 26px", lineHeight: 1.5 }}>
                Kami kirim 6 digit kode ke WhatsApp <b style={{ color: "var(--ink)" }}>+62 {phone}</b>
              </p>
              <div className="otp-row" onPaste={onPaste}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { boxRefs.current[i] = el; }}
                    className={"otp-box" + (err ? " err" : d ? " filled" : "")}
                    value={d}
                    maxLength={1}
                    inputMode="numeric"
                    onChange={(e) => onOtpChange(i, e.target.value)}
                    onKeyDown={(e) => onOtpKey(i, e)}
                  />
                ))}
              </div>
              {err && (
                <div className="inline-err" style={{ marginTop: 12 }}>
                  <Icon name="xCircle" size={15} />Kode salah. Coba lagi atau kirim ulang.
                </div>
              )}
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 22, padding: "13px" }} onClick={verify} disabled={verifying || otp.join("").length < 6}>
                {verifying ? (
                  <><span className="spinner" style={{ width: 17, height: 17 }}></span>Memverifikasi…</>
                ) : (
                  <>Verifikasi &amp; Masuk<Icon name="check" size={16} /></>
                )}
              </button>
              <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>
                Tidak terima kode?{" "}
                {resendIn > 0 ? (
                  <span style={{ fontWeight: 700, color: "var(--ink-2)" }}>Kirim ulang dalam {resendIn}s</span>
                ) : (
                  <button onClick={sendOtp} style={{ fontWeight: 700, color: "var(--primary-dark)" }}>Kirim ulang</button>
                )}
              </div>
              <div style={{ marginTop: 26, padding: "11px 14px", background: "var(--info-light)", borderRadius: 11, fontSize: 12, color: "#2563EB", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="sparkle" size={14} />Demo: gunakan kode <b style={{ letterSpacing: ".1em" }}>123456</b> untuk masuk
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
