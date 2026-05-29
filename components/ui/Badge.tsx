export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    active: ["ok", "Aktif"],
    aktif: ["ok", "Aktif"],
    recruiting: ["info", "Rekrutmen"],
    completed: ["neutral", "Selesai"],
    selesai: ["neutral", "Selesai"],
    disbanded: ["danger", "Dibubarkan"],
    dibubarkan: ["neutral", "Dibubarkan"],
    suspended: ["danger", "Suspended"],
    lunas: ["ok", "Lunas"],
    belum_bayar: ["warn", "Belum bayar"],
    terlambat: ["danger", "Terlambat"],
    sent: ["ok", "Terkirim"],
    failed: ["danger", "Gagal"],
  };
  const [cls, label] = map[status] || ["neutral", status];
  return (
    <span className={"badge " + cls}>
      <span className="bdot" />
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
