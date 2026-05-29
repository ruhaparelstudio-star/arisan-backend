"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import type { IconName } from "@/components/Icon";

function Progress({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="prog">
      <span style={{ width: pct + "%", background: "var(--primary)" }}></span>
    </div>
  );
}

const NAV: { id: string; label: string; icon: IconName; href: string }[] = [
  { id: "overview", label: "Overview", icon: "grid", href: "/overview" },
  { id: "users", label: "User Management", icon: "users", href: "/users" },
  { id: "groups", label: "Group Monitoring", icon: "layers", href: "/groups" },
  { id: "otp", label: "OTP Monitor", icon: "message", href: "/otp" },
  { id: "system", label: "System Health", icon: "server", href: "/system" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2" />
            <path
              d="M8 12.5 11 15.5 16.5 9"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <div className="brand-name">Arisan</div>
          <div className="brand-sub">Admin Console</div>
        </div>
      </div>

      <div className="nav-label">Menu Utama</div>
      {NAV.map((n) => {
        const active = pathname === n.href || pathname.startsWith(n.href + "/");
        return (
          <Link
            key={n.id}
            href={n.href}
            className={"nav-item" + (active ? " active" : "")}
            style={{ textDecoration: "none" }}
          >
            <Icon name={n.icon} size={19} />
            {n.label}
          </Link>
        );
      })}

      <div className="sidebar-card">
        <span className="pill">
          <Icon name="sparkle" size={12} />
          Phase Awal · MVP
        </span>
        <h4 style={{ marginTop: 12 }}>Validasi Beta</h4>
        <p>34 dari 50 grup target aktif. Monetisasi belum diaktifkan.</p>
        <Progress value={34} max={50} />
      </div>
    </aside>
  );
}
