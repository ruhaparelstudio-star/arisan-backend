"use client";

/* ============ UI States: toasts, skeletons, spinner, overlay, error/success states, form bits ============ */
import { useState, useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import type { ToastDetail } from "@/lib/toast";

/* ---- Toast host ---- */
export function ToastHost() {
  const [items, setItems] = useState<ToastDetail[]>([]);
  useEffect(() => {
    const onToast = (e: Event) => {
      const t = (e as CustomEvent<ToastDetail>).detail;
      setItems((prev) => [...prev, t]);
      if (t.type !== "loading") {
        setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== t.id)), 3600);
      }
    };
    window.addEventListener("arisan-toast", onToast);
    return () => window.removeEventListener("arisan-toast", onToast);
  }, []);
  const cfg: Record<string, { ico: IconName | null; c: string; bg: string }> = {
    success: { ico: "checkCircle", c: "var(--primary-dark)", bg: "var(--primary-light)" },
    error: { ico: "xCircle", c: "var(--danger)", bg: "var(--danger-light)" },
    info: { ico: "bell", c: "var(--info)", bg: "var(--info-light)" },
    loading: { ico: null, c: "var(--primary)", bg: "var(--primary-light)" },
  };
  return (
    <div className="toast-host">
      {items.map((t) => {
        const c = cfg[t.type] || cfg.info;
        return (
          <div className="toast" key={t.id}>
            <div className="tico" style={{ background: c.bg, color: c.c }}>
              {t.type === "loading" ? (
                <span className="spinner dark" style={{ width: 18, height: 18 }}></span>
              ) : (
                <Icon name={c.ico as IconName} size={19} sw={2} />
              )}
            </div>
            <div style={{ flex: 1, paddingTop: 1 }}>
              <div className="ttitle">{t.title}</div>
              {t.msg && <div className="tmsg">{t.msg}</div>}
            </div>
            {t.type !== "loading" && <span className="tbar run" style={{ background: c.c }}></span>}
          </div>
        );
      })}
    </div>
  );
}

/* ---- Skeleton primitives ---- */
export function Sk({
  w,
  h = 14,
  r = 8,
  style,
}: {
  w?: number | string;
  h?: number;
  r?: number;
  style?: CSSProperties;
}) {
  return <div className="sk" style={{ width: w || "100%", height: h, borderRadius: r, ...style }}></div>;
}

export function StatSkeleton() {
  return (
    <div className="stat">
      <div className="stat-top">
        <Sk w={42} h={42} r={12} />
        <Sk w={64} h={28} />
      </div>
      <Sk w="55%" h={11} style={{ marginBottom: 12 }} />
      <Sk w="45%" h={28} style={{ marginBottom: 12 }} />
      <Sk w="70%" h={12} />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {[0, 1, 2, 3].map((i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
      <div className="card card-pad">
        <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
          <Sk w={44} h={44} r={12} />
          <div style={{ flex: 1 }}>
            <Sk w="30%" h={15} style={{ marginBottom: 8 }} />
            <Sk w="20%" h={11} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Sk w={36} h={36} r={18} />
              <div style={{ flex: 1 }}>
                <Sk w={`${60 - i * 6}%`} h={13} style={{ marginBottom: 7 }} />
                <Sk w="28%" h={10} />
              </div>
              <Sk w={90} h={26} r={20} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Loading overlay (full screen) ---- */
export function LoadingOverlay({ label }: { label?: string }) {
  return (
    <div className="load-overlay">
      <div className="load-card">
        <span className="spinner lg dark"></span>
        <div style={{ fontWeight: 700, color: "var(--ink-2)", fontSize: 14 }}>{label || "Memuat…"}</div>
      </div>
    </div>
  );
}

/* ---- Full-page error / success states ---- */
export function StatePage({
  kind,
  title,
  desc,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: {
  kind: "error" | "warn" | "success" | "offline";
  title: string;
  desc: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  const map: Record<string, { ico: IconName; c: string; bg: string }> = {
    error: { ico: "xCircle", c: "var(--danger)", bg: "var(--danger-light)" },
    warn: { ico: "alert", c: "var(--warning)", bg: "var(--warning-light)" },
    success: { ico: "checkCircle", c: "var(--primary-dark)", bg: "var(--primary-light)" },
    offline: { ico: "wifi", c: "var(--danger)", bg: "var(--danger-light)" },
  };
  const c = map[kind] || map.error;
  return (
    <div className="statepage fade-in">
      <div style={{ maxWidth: 420 }}>
        <div className="state-ico" style={{ background: c.bg, color: c.c }}>
          <Icon name={c.ico} size={40} sw={1.8} />
        </div>
        <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.55, marginBottom: 24 }}>{desc}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {secondaryLabel && (
            <button className="btn btn-line" onClick={onSecondary}>
              {secondaryLabel}
            </button>
          )}
          {actionLabel && (
            <button className="btn btn-primary" onClick={onAction}>
              <Icon name="refresh" size={16} />
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Form bits ---- */
export function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return <button className={"switch" + (on ? " on" : "")} onClick={() => onChange(!on)} aria-pressed={on}></button>;
}

export function Field({
  label,
  hint,
  children,
}: {
  label?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

/* ---- Confirm modal ---- */
export function ConfirmModal({
  icon,
  iconColor,
  iconBg,
  title,
  desc,
  confirmLabel,
  confirmClass,
  onConfirm,
  onClose,
  loading,
}: {
  icon?: IconName;
  iconColor?: string;
  iconBg?: string;
  title: string;
  desc: string;
  confirmLabel?: string;
  confirmClass?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}) {
  return (
    <div className="overlay center" onClick={loading ? undefined : onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div
              className="stat-ico"
              style={{
                background: iconBg || "var(--danger-light)",
                color: iconColor || "var(--danger)",
                width: 46,
                height: 46,
                flexShrink: 0,
              }}
            >
              <Icon name={icon || "alert"} size={22} sw={2} />
            </div>
            <div>
              <div style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: "-.01em" }}>{title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 5, lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-line" style={{ flex: 1 }} onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button
            className={"btn " + (confirmClass || "btn-danger")}
            style={{ flex: 1 }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span
                className="spinner"
                style={{ width: 16, height: 16, borderColor: "rgba(0,0,0,.15)", borderTopColor: "currentColor" }}
              ></span>
            ) : null}
            {confirmLabel || "Konfirmasi"}
          </button>
        </div>
      </div>
    </div>
  );
}
