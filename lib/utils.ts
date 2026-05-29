export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 6) return phone;
  const last4 = phone.slice(-4);
  return `+62 8xx-xxxx-${last4}`;
}

export function formatFrekuensi(f: string): string {
  const map: Record<string, string> = {
    weekly: 'Mingguan',
    biweekly: 'Dua Mingguan',
    monthly: 'Bulanan',
  };
  return map[f] ?? f;
}

export function formatModeUndian(m: string): string {
  const map: Record<string, string> = {
    fixed: 'Urutan Tetap',
    random: 'Undian Random',
    manual: 'Input Manual',
  };
  return map[m] ?? m;
}
