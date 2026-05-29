"use client";

import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

const PAGE_META: Record<string, { title: string; crumb: string }> = {
  "/overview": { title: "Overview", crumb: "Overview" },
  "/users": { title: "User Management", crumb: "User Management" },
  "/groups": { title: "Group Monitoring", crumb: "Group Monitoring" },
  "/otp": { title: "OTP Monitor", crumb: "OTP Monitor" },
  "/system": { title: "System Health", crumb: "System Health" },
};

function getMetaForPath(pathname: string) {
  for (const [key, meta] of Object.entries(PAGE_META)) {
    if (pathname === key || pathname.startsWith(key + "/")) return meta;
  }
  return { title: "Admin", crumb: "Dashboard" };
}

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const meta = getMetaForPath(pathname);

  return (
    <header className="topbar">
      <div>
        <div className="page-title">{meta.title}</div>
        <div className="breadcrumb">
          Admin <span style={{ margin: "0 5px" }}>/</span> <b>{meta.crumb}</b>
        </div>
      </div>

      <button
        className="btn btn-ghost btn-sm"
        style={{ marginLeft: "auto" }}
        onClick={() => router.refresh()}
        title="Refresh data"
      >
        <Icon name="refresh" size={15} />
        Refresh
      </button>

      <div className="profile">
        <span
          className="av-init"
          style={{
            width: 38,
            height: 38,
            background: "linear-gradient(135deg,#0F1F1A,#15302a)",
            fontSize: 13,
          }}
        >
          AO
        </span>
        <div className="profile-meta">
          <div className="nm">App Owner</div>
          <div className="rl">Super Admin</div>
        </div>
      </div>
    </header>
  );
}
