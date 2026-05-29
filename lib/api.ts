export async function adminFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`/api/proxy/${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Terjadi kesalahan' }));
    throw new Error(err.error ?? 'Request gagal');
  }
  return res.json();
}
