/* ============================================================
   Arisan Admin — Mock Data (Bahasa Indonesia, realistic)
   Ported from the design prototype (js/data.js).
   ============================================================ */

export const rupiah = (n: number): string => "Rp " + n.toLocaleString("id-ID");

// ---- avatar palette (initials) ----
const avColors = [
  "#00C897",
  "#3B82F6",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#0EA5E9",
];
const avColor = (s: string): string =>
  avColors[(s.charCodeAt(0) + s.charCodeAt(s.length - 1)) % avColors.length];
const initials = (name: string): string =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

// ---- USERS ----
const userNames = [
  "Siti Nurhaliza",
  "Budi Santoso",
  "Dewi Lestari",
  "Agus Wijaya",
  "Rina Marlina",
  "Andi Pratama",
  "Maya Sari",
  "Joko Susilo",
  "Putri Ayu",
  "Hendra Gunawan",
  "Lilis Suryani",
  "Bayu Aji",
  "Nadia Rahma",
  "Eko Prasetyo",
  "Wati Handayani",
  "Rizki Ramadhan",
  "Fitri Anggraini",
  "Dimas Permana",
  "Sri Wahyuni",
  "Taufik Hidayat",
  "Indah Permatasari",
  "Yusuf Maulana",
  "Citra Kirana",
  "Bambang Sutejo",
  "Ratna Dewi",
];
const cities = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Semarang",
  "Medan",
  "Bekasi",
  "Depok",
  "Tangerang",
  "Makassar",
];

function maskPhone(p: string): string {
  return p.slice(0, 4) + "****" + p.slice(-3);
}

export type User = {
  id: string;
  name: string;
  phone: string;
  phoneMasked: string;
  city: string;
  groups: number;
  register: Date;
  registerStr: string;
  status: "active" | "suspended";
  flagged: boolean;
  flagReason: string | null;
  otpToday: number;
  lastActive: string;
  avColor: string;
  initials: string;
};

export const users: User[] = userNames.map((name, i) => {
  const phone = "+62812" + String(34560000 + i * 13717).slice(0, 8);
  const groups = (i * 7 + 3) % 4; // 0-3 groups
  const flagged = i === 5 || i === 14; // OTP abuse / many groups
  const suspended = i === 8 || i === 19;
  const daysAgo = (i * 3 + 1) % 58;
  const d = new Date(2026, 4, 28 - daysAgo);
  return {
    id: "USR-" + String(1001 + i),
    name,
    phone,
    phoneMasked: maskPhone(phone),
    city: cities[i % cities.length],
    groups: suspended ? Math.max(1, groups) : groups,
    register: d,
    registerStr: d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    status: suspended ? "suspended" : "active",
    flagged,
    flagReason:
      i === 5
        ? "OTP request 6x dalam 1 jam"
        : i === 14
          ? "Buat 6 grup dalam sehari"
          : null,
    otpToday: i === 5 ? 6 : i % 3,
    lastActive: [
      "2 menit lalu",
      "14 menit lalu",
      "1 jam lalu",
      "3 jam lalu",
      "Kemarin",
      "2 hari lalu",
    ][i % 6],
    avColor: avColor(name),
    initials: initials(name),
  };
});

// ---- GROUPS ----
type GroupStatus = "aktif" | "selesai" | "dibubarkan";
type UndianMode = "random" | "manual" | "offline";

const groupDefs: [
  string,
  string,
  number,
  number,
  string,
  GroupStatus,
  UndianMode,
][] = [
  ["Arisan RT 04 Melati", "Siti Nurhaliza", 18, 500000, "bulanan", "aktif", "random"],
  ["Arisan Kantor Marketing", "Budi Santoso", 12, 1000000, "bulanan", "aktif", "manual"],
  ["Arisan Ibu-Ibu PKK", "Dewi Lestari", 24, 250000, "mingguan", "aktif", "offline"],
  ["Arisan Keluarga Besar", "Agus Wijaya", 15, 2000000, "bulanan", "aktif", "random"],
  ["Arisan Geng Kuliah", "Rina Marlina", 8, 300000, "2 minggu", "aktif", "random"],
  ["Arisan Komplek Griya Asri", "Andi Pratama", 32, 750000, "bulanan", "aktif", "manual"],
  ["Arisan Motor Trail", "Joko Susilo", 10, 12000000, "bulanan", "aktif", "offline"],
  ["Arisan Pengajian Al-Ikhlas", "Maya Sari", 20, 150000, "mingguan", "aktif", "random"],
  ["Arisan Alumni SMA 3", "Hendra Gunawan", 16, 500000, "bulanan", "selesai", "random"],
  ["Arisan Warung Kopi", "Bayu Aji", 9, 200000, "mingguan", "aktif", "manual"],
  ["Arisan Dharma Wanita", "Sri Wahyuni", 22, 400000, "bulanan", "aktif", "offline"],
  ["Arisan Futsal Senin", "Eko Prasetyo", 14, 100000, "mingguan", "aktif", "random"],
  ["Arisan Sekolah Anak", "Fitri Anggraini", 11, 350000, "bulanan", "dibubarkan", "random"],
  ["Arisan Pedagang Pasar", "Taufik Hidayat", 28, 600000, "mingguan", "aktif", "manual"],
  ["Arisan Reuni 2010", "Citra Kirana", 13, 1500000, "bulanan", "selesai", "offline"],
];

export type Group = {
  id: string;
  name: string;
  ketua: string;
  ketuaColor: string;
  ketuaInit: string;
  members: number;
  nominal: number;
  nominalStr: string;
  freq: string;
  status: GroupStatus;
  mode: UndianMode;
  totalPeriods: number;
  currentPeriod: number;
  paid: number;
  progress: number;
  payProgress: number;
  start: Date;
  startStr: string;
  swapCount: number;
  flagged: boolean;
  flagReason: string | null;
  potTotal: number;
};

export const groups: Group[] = groupDefs.map((g, i) => {
  const [name, ketua, members, nominal, freq, status, mode] = g;
  const totalPeriods = members;
  const currentPeriod =
    status === "selesai"
      ? members
      : status === "dibubarkan"
        ? Math.ceil(members * 0.4)
        : Math.min(members, ((i * 3 + 2) % members) + 1);
  const paid =
    status === "aktif"
      ? Math.max(0, members - ((i * 5 + 3) % (members - 2 || 1)))
      : members;
  const startDaysAgo = (i * 11 + 20) % 120;
  const sd = new Date(2026, 4, 28 - startDaysAgo);
  const swapCount = i === 6 ? 6 : i % 3;
  const flagged = nominal > 10000000 || members > 30 || swapCount > 5;
  let flagReason: string | null = null;
  if (nominal > 10000000) flagReason = "Nominal > Rp 10 juta";
  else if (members > 30) flagReason = "Anggota > 30 orang";
  else if (swapCount > 5) flagReason = "Swap giliran > 5 dalam 1 periode";
  const ketuaU = users.find((u) => u.name === ketua) || users[0];
  return {
    id: "GRP-" + String(2001 + i),
    name,
    ketua,
    ketuaColor: ketuaU.avColor,
    ketuaInit: ketuaU.initials,
    members,
    nominal,
    nominalStr: rupiah(nominal),
    freq,
    status,
    mode,
    totalPeriods,
    currentPeriod,
    paid,
    progress: Math.round((currentPeriod / totalPeriods) * 100),
    payProgress: Math.round((paid / members) * 100),
    start: sd,
    startStr: sd.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    swapCount,
    flagged,
    flagReason,
    potTotal: nominal * members,
  };
});

// ---- members of a group (for drill-down) ----
export type Member = {
  name: string;
  isKetua: boolean;
  init: string;
  color: string;
  giliran: number;
  won: boolean;
  payStatus: "lunas" | "belum_bayar" | "terlambat";
  confirmedBy: string | null;
  confirmedAt: string | null;
  swaps: number;
};

export function membersOf(group: Group): Member[] {
  const pool = userNames.slice(0, group.members);
  return pool.map((name, i) => {
    const won = i < group.currentPeriod - 1;
    const isKetua = name === group.ketua;
    let payStatus: Member["payStatus"] = "lunas";
    if (group.status === "aktif") {
      if (i >= group.paid)
        payStatus = i === group.members - 1 ? "terlambat" : "belum_bayar";
    }
    return {
      name,
      isKetua,
      init: initials(name),
      color: avColor(name),
      giliran: i + 1,
      won,
      payStatus,
      confirmedBy: payStatus === "lunas" ? group.ketua : null,
      confirmedAt: payStatus === "lunas" ? "24 Mei 2026, 09:1" + (i % 6) : null,
      swaps: i === 2 ? 1 : 0,
    };
  });
}

// ---- OTP request history for a user ----
export type OtpRow = {
  time: string;
  channel: string;
  status: "sent" | "failed";
  code: string;
};

export function otpHistoryOf(_user: User): OtpRow[] {
  const rows: OtpRow[] = [];
  const now = new Date(2026, 4, 28, 14, 30).getTime();
  for (let i = 0; i < 6; i++) {
    const t = new Date(now - i * (1000 * 60 * 60 * 4 + i * 900000));
    const failed = i === 2;
    rows.push({
      time: t.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      channel: "WhatsApp",
      status: failed ? "failed" : "sent",
      code: failed ? "FONNTE_TIMEOUT" : "delivered",
    });
  }
  return rows;
}

// ---- Charts ----
// registration per day (30 days) + 7 day slice
export const reg30 = [
  4, 6, 5, 8, 7, 9, 11, 8, 6, 9, 12, 10, 7, 9, 13, 11, 14, 10, 8, 12, 15, 13, 9,
  11, 16, 14, 12, 15, 18, 16,
];
export const reg7 = reg30.slice(-7);
export const dayLabels30 = Array.from({ length: 30 }, (_, i) => i + 1);
export const dayLabels7 = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

// OTP per day (7d)
export const otp7 = [38, 42, 35, 51, 47, 29, 44];
export const otpRateLimited = [
  { phone: "+62813****921", attempts: 8, lastTry: "28 Mei, 11:20", blocked: false },
  { phone: "+62856****447", attempts: 6, lastTry: "28 Mei, 09:54", blocked: false },
  { phone: "+62821****013", attempts: 12, lastTry: "27 Mei, 22:11", blocked: true },
  { phone: "+62877****658", attempts: 5, lastTry: "27 Mei, 18:03", blocked: false },
];

// ---- Overview stats ----
export const overview = {
  totalUsers: 327,
  totalUsersDelta: 12.4,
  activeGroups: 34,
  activeGroupsDelta: 8.0,
  mauToday: 218,
  mauTodayDelta: 4.2,
  otpMonth: 842,
  otpMonthDelta: 18.6,
  otpQuota: 1000,
};

// ---- Alerts ----
export const alerts = [
  {
    id: "stream",
    level: "crit",
    title: "Stream.io MAU mendekati limit",
    desc: "814 / 1.000 MAU bulan ini — siapkan migration plan",
    metric: "814/1000",
  },
  {
    id: "fonnte",
    level: "crit",
    title: "Kuota OTP Fonnte > 800",
    desc: "842 / 1.000 pesan terkirim bulan ini",
    metric: "842/1000",
  },
  {
    id: "storage",
    level: "ok",
    title: "Supabase storage aman",
    desc: "384 MB / 500 MB terpakai",
    metric: "384/500",
  },
  {
    id: "error",
    level: "ok",
    title: "API error rate normal",
    desc: "1.2% — di bawah ambang 5%",
    metric: "1.2%",
  },
];

// ---- System health ----
export const health = {
  supabaseStorage: 384,
  supabaseStorageMax: 500,
  supabaseConn: 23,
  supabaseConnMax: 60,
  streamMau: 814,
  streamMauMax: 1000,
  fonnteMonth: 842,
  fonnteMax: 1000,
  apiUptime: 99.94,
  apiResp: 142,
  apiErrRate: 1.2,
  pgCron: true,
};
export const endpoints = [
  { path: "POST /api/auth/verify-otp", resp: 186, err: 0.4, status: "green" },
  { path: "POST /api/auth/send-otp", resp: 2340, err: 2.1, status: "amber" },
  { path: "GET /api/groups/:id", resp: 98, err: 0.1, status: "green" },
  { path: "POST /api/payments/.../confirm", resp: 124, err: 0.0, status: "green" },
  { path: "POST /api/groups/:id/undian", resp: 312, err: 0.6, status: "green" },
  { path: "POST /api/swaps/:id/approve", resp: 110, err: 0.2, status: "green" },
];
export const services = [
  { name: "Supabase", desc: "PostgreSQL · ap-southeast-1", status: "green", short: "SB", color: "#3ECF8E" },
  { name: "Hono API", desc: "DigitalOcean App Platform", status: "green", short: "HN", color: "#FF5C13" },
  { name: "Stream.io", desc: "Group chat · 814 MAU", status: "amber", short: "ST", color: "#005FFF" },
  { name: "Fonnte", desc: "WhatsApp OTP · 842/1000", status: "amber", short: "FN", color: "#25D366" },
  { name: "Firebase Crashlytics", desc: "Crash rate 0.4%", status: "green", short: "FB", color: "#FFA000" },
  { name: "Expo Push", desc: "Push notification", status: "green", short: "EX", color: "#000020" },
];
