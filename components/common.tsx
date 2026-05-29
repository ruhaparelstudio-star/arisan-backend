"use client";

/* ============ Shared UI components ============ */
import { useState, useRef, useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import * as D from "@/lib/data";

/* ---------- Avatar with initials ---------- */
export function Avatar({
  init,
  color,
  size = 36,
  fz,
}: {
  init: string;
  color: string;
  size?: number;
  fz?: number;
}) {
  return (
    <span
      className="av-init"
      style={{ width: size, height: size, background: color, fontSize: fz || size * 0.36 }}
    >
      {init}
    </span>
  );
}

/* ---------- Status badge helpers ---------- */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    active: ["ok", "Aktif"],
    aktif: ["ok", "Aktif"],
    suspended: ["danger", "Suspended"],
    selesai: ["info", "Selesai"],
    dibubarkan: ["neutral", "Dibubarkan"],
    lunas: ["ok", "Lunas"],
    belum_bayar: ["warn", "Belum bayar"],
    terlambat: ["danger", "Terlambat"],
    sent: ["ok", "Terkirim"],
    failed: ["danger", "Gagal"],
  };
  const [cls, label] = map[status] || ["neutral", status];
  return (
    <span className={"badge " + cls}>
      <span className="bdot"></span>
      {label}
    </span>
  );
}

export function ModeBadge({ mode }: { mode: string }) {
  const map: Record<string, [string, string]> = {
    random: ["info", "Undian acak"],
    manual: ["neutral", "Manual"],
    offline: ["warn", "Undian offline"],
  };
  const [cls, label] = map[mode] || ["neutral", mode];
  return <span className={"badge " + cls}>{label}</span>;
}

/* ---------- Stat card ---------- */
export function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  delta,
  deltaDir,
  suffix,
  spark,
  compact,
}: {
  icon: IconName;
  iconBg: string;
  iconColor: string;
  label: string;
  value: ReactNode;
  delta?: number;
  deltaDir?: "up" | "down" | "flat";
  suffix?: string;
  spark?: number[];
  compact?: boolean;
}) {
  return (
    <div className="stat fade-in">
      <div className="stat-top">
        <div className="stat-ico" style={{ background: iconBg, color: iconColor }}>
          <Icon name={icon} size={21} sw={2} />
        </div>
        {spark && <MiniSpark data={spark} color={iconColor} />}
      </div>
      <div className="stat-label">{label}</div>
      <div className={"stat-value" + (compact ? " compact" : "")}>
        {value}
        {suffix && (
          <span style={{ fontSize: 16, color: "var(--muted)", fontWeight: 700 }}>{suffix}</span>
        )}
      </div>
      {delta != null && (
        <div className="stat-foot">
          <span className={"delta " + (deltaDir || "up")}>
            <Icon name={deltaDir === "down" ? "arrowDown" : "arrowUp"} size={11} sw={2.6} />
            {delta}%
          </span>
          <span style={{ color: "var(--muted)" }}>vs bulan lalu</span>
        </div>
      )}
    </div>
  );
}

/* ---------- Mini sparkline ---------- */
export function MiniSpark({
  data,
  color = "#00C897",
  w = 64,
  h = 30,
}: {
  data: number[];
  color?: string;
  w?: number;
  h?: number;
}) {
  const max = Math.max(...data),
    min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => [
    (i / (data.length - 1)) * w,
    h - ((d - min) / range) * (h - 4) - 2,
  ]);
  const path = pts
    .map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1))
    .join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={color} />
    </svg>
  );
}

/* ---------- Area chart (mint gradient) ---------- */
export function AreaChart({
  data,
  labels,
  height = 200,
  color = "#00C897",
  valueFmt,
  showDots = false,
}: {
  data: number[];
  labels?: (string | number)[];
  height?: number;
  color?: string;
  valueFmt?: (v: number, i: number) => ReactNode;
  showDots?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const ro = new ResizeObserver((es) => setW(es[0].contentRect.width));
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const padL = 8,
    padR = 8,
    padT = 14,
    padB = 26;
  const W = w,
    H = height;
  const max = Math.max(...data) * 1.15,
    min = 0;
  const range = max - min || 1;
  const n = data.length;
  const x = (i: number) => padL + (i / (n - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - min) / range) * (H - padT - padB);
  const linePts = data.map((d, i) => [x(i), y(d)]);
  const line = linePts
    .map((p, i) => {
      if (i === 0) return `M ${p[0]} ${p[1]}`;
      const prev = linePts[i - 1];
      const cx = (prev[0] + p[0]) / 2;
      return `C ${cx} ${prev[1]}, ${cx} ${p[1]}, ${p[0]} ${p[1]}`;
    })
    .join(" ");
  const area = line + ` L ${x(n - 1)} ${H - padB} L ${x(0)} ${H - padB} Z`;
  const gid = "ag" + color.replace("#", "");
  const [hover, setHover] = useState<number | null>(null);
  const step = Math.ceil(n / 12);
  return (
    <div ref={ref} style={{ width: "100%", position: "relative" }}>
      <svg width={W} height={H} style={{ display: "block" }} onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.26" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((g, i) => (
          <line
            key={i}
            x1={padL}
            x2={W - padR}
            y1={padT + g * (H - padT - padB)}
            y2={padT + g * (H - padT - padB)}
            stroke="#EEF2F1"
            strokeWidth="1"
            strokeDasharray="4 5"
          />
        ))}
        <path d={area} fill={`url(#${gid})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        {showDots &&
          linePts.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="2.4" fill="#fff" stroke={color} strokeWidth="2" />
          ))}
        {labels &&
          labels.map(
            (l, i) =>
              (i % step === 0 || i === n - 1) && (
                <text key={i} x={x(i)} y={H - 7} textAnchor="middle" fontSize="10.5" fill="#A3ADA9" fontWeight="600">
                  {l}
                </text>
              ),
          )}
        {hover != null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H - padB} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <circle cx={x(hover)} cy={y(data[hover])} r="4.5" fill="#fff" stroke={color} strokeWidth="2.5" />
          </g>
        )}
        {data.map((d, i) => (
          <rect
            key={i}
            x={x(i) - W / n / 2}
            y={0}
            width={W / n}
            height={H}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>
      {hover != null && (
        <div
          style={{
            position: "absolute",
            left: Math.min(Math.max(x(hover), 40), W - 40),
            top: y(data[hover]) - 44,
            transform: "translateX(-50%)",
            background: "var(--ink)",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: 8,
            fontSize: 11.5,
            fontWeight: 700,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            boxShadow: "var(--shadow)",
          }}
        >
          {valueFmt ? valueFmt(data[hover], hover) : data[hover]}
        </div>
      )}
    </div>
  );
}

/* ---------- Bar chart ---------- */
export function BarChart({
  data,
  labels,
  height = 200,
  color = "#00C897",
  valueFmt,
}: {
  data: number[];
  labels?: (string | number)[];
  height?: number;
  color?: string;
  valueFmt?: (v: number, i: number) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const ro = new ResizeObserver((es) => setW(es[0].contentRect.width));
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const padT = 14,
    padB = 26;
  const max = Math.max(...data) * 1.15 || 1;
  const n = data.length;
  const gap = 10;
  const bw = Math.max(8, (w - gap * (n - 1)) / n);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div ref={ref} style={{ width: "100%", position: "relative" }}>
      <svg width={w} height={height} style={{ display: "block" }} onMouseLeave={() => setHover(null)}>
        {[0.25, 0.5, 0.75, 1].map((g, i) => (
          <line
            key={i}
            x1={0}
            x2={w}
            y1={padT + g * (height - padT - padB)}
            y2={padT + g * (height - padT - padB)}
            stroke="#EEF2F1"
            strokeWidth="1"
            strokeDasharray="4 5"
          />
        ))}
        {data.map((d, i) => {
          const bh = (d / max) * (height - padT - padB);
          const bx = i * (bw + gap);
          const by = height - padB - bh;
          const on = hover === i;
          return (
            <g key={i} onMouseEnter={() => setHover(i)}>
              <rect x={bx} y={padT} width={bw} height={height - padT - padB} fill="transparent" />
              <rect x={bx} y={by} width={bw} height={bh} rx={Math.min(6, bw / 2)} fill={on ? "var(--primary-dark)" : color} opacity={on ? 1 : 0.85} />
              {labels && (
                <text x={bx + bw / 2} y={height - 7} textAnchor="middle" fontSize="10.5" fill="#A3ADA9" fontWeight="600">
                  {labels[i]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hover != null && (
        <div
          style={{
            position: "absolute",
            left: hover * (bw + gap) + bw / 2,
            top: height - padB - (data[hover] / max) * (height - padT - padB) - 38,
            transform: "translateX(-50%)",
            background: "var(--ink)",
            color: "#fff",
            padding: "5px 9px",
            borderRadius: 8,
            fontSize: 11.5,
            fontWeight: 700,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {valueFmt ? valueFmt(data[hover], hover) : data[hover]}
        </div>
      )}
    </div>
  );
}

/* ---------- Donut / ring ---------- */
export function Donut({
  value,
  max = 100,
  size = 150,
  stroke = 16,
  color = "#00C897",
  track = "#EEF2F1",
  label,
  centerVal,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  label?: ReactNode;
  centerVal?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  return (
    <div className="donut-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="donut-center">
        <div className="v">{centerVal != null ? centerVal : Math.round(pct * 100) + "%"}</div>
        {label && <div className="l">{label}</div>}
      </div>
    </div>
  );
}

/* ---------- Progress bar ---------- */
export function Progress({
  value,
  max = 100,
  color = "var(--primary)",
}: {
  value: number;
  max?: number;
  color?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  let c = color;
  if (color === "auto") c = pct > 85 ? "var(--danger)" : pct > 70 ? "var(--warning)" : "var(--primary)";
  return (
    <div className="prog">
      <span style={{ width: pct + "%", background: c }}></span>
    </div>
  );
}

/* ---------- Sidebar ---------- */
export function Sidebar({
  page,
  setPage,
  onLogout,
}: {
  page: string;
  setPage: (p: string) => void;
  onLogout: () => void;
}) {
  const flaggedUsers = D.users.filter((u) => u.flagged).length;
  const flaggedGroups = D.groups.filter((g) => g.flagged).length;
  const nav: { id: string; label: string; icon: IconName; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: "grid" },
    { id: "users", label: "User Management", icon: "users", badge: flaggedUsers },
    { id: "groups", label: "Group Monitoring", icon: "layers", badge: flaggedGroups },
    { id: "otp", label: "OTP Monitor", icon: "message" },
    { id: "health", label: "System Health", icon: "server" },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2" />
            <path d="M8 12.5 11 15.5 16.5 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="brand-name">Arisan</div>
          <div className="brand-sub">Admin Console</div>
        </div>
      </div>

      <div className="nav-label">Menu Utama</div>
      {nav.map((n) => (
        <button key={n.id} className={"nav-item" + (page === n.id ? " active" : "")} onClick={() => setPage(n.id)}>
          <Icon name={n.icon} size={19} />
          {n.label}
          {n.badge != null && n.badge > 0 && <span className="nav-badge">{n.badge}</span>}
        </button>
      ))}

      <div className="nav-label">Lainnya</div>
      <button className={"nav-item" + (page === "privacy" ? " active" : "")} onClick={() => setPage("privacy")}>
        <Icon name="shield" size={19} />
        Privacy &amp; PDP
        <span className="nav-badge" style={{ background: page === "privacy" ? "rgba(255,255,255,.25)" : "var(--warning)" }}>
          3
        </span>
      </button>
      <button className={"nav-item" + (page === "settings" ? " active" : "")} onClick={() => setPage("settings")}>
        <Icon name="settings" size={19} />
        Pengaturan
      </button>
      <button className="nav-item" onClick={onLogout} style={{ color: "var(--danger)" }}>
        <Icon name="logout" size={19} color="var(--danger)" />
        Keluar
      </button>

      <div className="sidebar-card">
        <span className="pill">
          <Icon name="sparkle" size={12} />
          Phase Awal · MVP
        </span>
        <h4 style={{ marginTop: 12 }}>Validasi Beta</h4>
        <p>34 dari 50 grup target aktif. Monetisasi belum diaktifkan.</p>
        <Progress value={34} max={50} color="var(--primary)" />
      </div>
    </aside>
  );
}

/* ---------- Topbar ---------- */
export function Topbar({
  title,
  crumb,
  search,
  setSearch,
}: {
  title: string;
  crumb: string;
  search: string;
  setSearch: (s: string) => void;
}) {
  return (
    <header className="topbar">
      <div>
        <div className="page-title">{title}</div>
        <div className="breadcrumb">
          Admin <span style={{ margin: "0 5px" }}>/</span> <b>{crumb}</b>
        </div>
      </div>
      <div className="search">
        <Icon name="search" size={16} color="var(--muted-2)" />
        <input placeholder="Cari user, grup, nomor…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <button className="icon-btn">
        <Icon name="bell" size={19} color="var(--ink-2)" />
        <span className="dot"></span>
      </button>
      <button className="icon-btn">
        <Icon name="settings" size={19} color="var(--ink-2)" />
      </button>
      <div className="profile">
        <Avatar init="AO" color="linear-gradient(135deg,#0F1F1A,#15302a)" size={38} />
        <div className="profile-meta">
          <div className="nm">App Owner</div>
          <div className="rl">Super Admin</div>
        </div>
        <Icon name="chevDown" size={15} color="var(--muted)" />
      </div>
    </header>
  );
}

/* ---------- Card head ---------- */
export function CardHead({
  title,
  sub,
  right,
}: {
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="card-head">
      <div>
        <h3>{title}</h3>
        {sub && (
          <div className="sub" style={{ marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
      {right && <div style={{ marginLeft: "auto" }}>{right}</div>}
    </div>
  );
}

/* ---------- Segmented ---------- */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { v: T; l: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.v} className={value === o.v ? "on" : ""} onClick={() => onChange(o.v)}>
          {o.l}
        </button>
      ))}
    </div>
  );
}

/* ---------- Empty state ---------- */
export function Empty({
  icon,
  title,
  desc,
}: {
  icon?: IconName;
  title: string;
  desc?: string;
}) {
  return (
    <div className="empty">
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "var(--canvas)",
          display: "grid",
          placeItems: "center",
          margin: "0 auto 14px",
        }}
      >
        <Icon name={icon || "inbox"} size={26} color="var(--muted-2)" />
      </div>
      <div style={{ fontWeight: 700, color: "var(--ink-2)", fontSize: 14 }}>{title}</div>
      {desc && <div style={{ fontSize: 12.5, marginTop: 4 }}>{desc}</div>}
    </div>
  );
}
