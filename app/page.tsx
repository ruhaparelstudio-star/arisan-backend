"use client";

/* ============ App router + auth + global states ============ */
import { useState, useEffect } from "react";
import { Sidebar, Topbar } from "@/components/common";
import {
  ToastHost,
  PageSkeleton,
  LoadingOverlay,
  StatePage,
  ConfirmModal,
} from "@/components/states";
import { toast } from "@/lib/toast";
import { PageLogin } from "@/components/pages/Login";
import { PageOverview } from "@/components/pages/Overview";
import { PageUsers } from "@/components/pages/Users";
import { PageGroups } from "@/components/pages/Groups";
import { PageOtp } from "@/components/pages/Otp";
import { PageHealth } from "@/components/pages/Health";
import { PagePrivacy } from "@/components/pages/Privacy";
import { PageSettings } from "@/components/pages/Settings";

const PAGES = ["overview", "users", "groups", "otp", "health", "privacy", "settings"];

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState("overview");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false); // initial skeleton
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [overlay, setOverlay] = useState<string | null>(null); // full-screen loading preview
  const [errorPage, setErrorPage] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // hydrate auth + page from storage / hash (client only — avoids SSR mismatch)
  useEffect(() => {
    const isAuthed = localStorage.getItem("arisan_auth") === "1";
    const h = location.hash.replace("#", "");
    setAuthed(isAuthed);
    if (PAGES.includes(h)) setPage(h);
    if (isAuthed) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 600);
      setHydrated(true);
      return () => clearTimeout(t);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (authed) location.hash = page;
  }, [page, authed]);

  const go = (p: string) => {
    if (p === page) return;
    setErrorPage(false);
    setSearch("");
    setLoading(true);
    setPage(p);
    setTimeout(() => setLoading(false), 480);
  };

  const doLogin = () => {
    localStorage.setItem("arisan_auth", "1");
    setAuthed(true);
    setLoading(true);
    setTimeout(() => setLoading(false), 650);
  };

  const doLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("arisan_auth");
      setLoggingOut(false);
      setLogoutOpen(false);
      setAuthed(false);
      toast("info", "Berhasil keluar", "Sampai jumpa lagi 👋");
    }, 900);
  };

  const previewLoading = () => {
    setOverlay("Memuat data dashboard…");
    setTimeout(() => setOverlay(null), 2200);
  };

  // Avoid rendering until client hydration resolves auth state
  if (!hydrated) return null;

  if (!authed) {
    return (
      <>
        <PageLogin onDone={doLogin} />
        <ToastHost />
      </>
    );
  }

  const meta = {
    overview: { title: "Overview", crumb: "Overview" },
    users: { title: "User Management", crumb: "User Management" },
    groups: { title: "Group Monitoring", crumb: "Group Monitoring" },
    otp: { title: "OTP Monitor", crumb: "OTP Monitor" },
    health: { title: "System Health", crumb: "System Health" },
    privacy: { title: "Privacy & PDP", crumb: "Privacy & PDP" },
    settings: { title: "Pengaturan", crumb: "Pengaturan" },
  }[page]!;

  return (
    <div className="app">
      <Sidebar page={page} setPage={go} onLogout={() => setLogoutOpen(true)} />
      <div className="main">
        <Topbar title={meta.title} crumb={meta.crumb} search={search} setSearch={setSearch} />
        <div className="content" key={page + (loading ? "-l" : "")}>
          {errorPage ? (
            <StatePage
              kind="offline"
              title="Gagal memuat data"
              desc="Tidak dapat terhubung ke server Arisan. Periksa koneksi internet Anda, lalu coba lagi."
              actionLabel="Coba lagi"
              onAction={() => {
                setErrorPage(false);
                setLoading(true);
                setTimeout(() => setLoading(false), 600);
              }}
              secondaryLabel="Kembali ke Overview"
              onSecondary={() => {
                setErrorPage(false);
                go("overview");
              }}
            />
          ) : loading ? (
            <PageSkeleton />
          ) : (
            <>
              {page === "overview" && <PageOverview setPage={go} />}
              {page === "users" && <PageUsers search={search} />}
              {page === "groups" && <PageGroups search={search} />}
              {page === "otp" && <PageOtp />}
              {page === "health" && <PageHealth />}
              {page === "privacy" && <PagePrivacy />}
              {page === "settings" && (
                <PageSettings
                  onPreviewLoading={previewLoading}
                  onPreviewError={() => {
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
                      setErrorPage(true);
                    }, 700);
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>

      {logoutOpen && (
        <ConfirmModal
          icon="logout"
          iconColor="var(--danger)"
          iconBg="var(--danger-light)"
          title="Keluar dari Admin?"
          desc="Anda perlu memasukkan kode OTP lagi untuk masuk kembali ke dashboard."
          confirmLabel="Ya, keluar"
          confirmClass="btn-danger"
          loading={loggingOut}
          onConfirm={doLogout}
          onClose={() => setLogoutOpen(false)}
        />
      )}

      {loggingOut && !logoutOpen && <LoadingOverlay label="Keluar…" />}
      {overlay && <LoadingOverlay label={overlay} />}
      <ToastHost />
    </div>
  );
}
