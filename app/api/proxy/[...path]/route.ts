import { NextRequest, NextResponse } from 'next/server';

function getConfig() {
  const API_URL = process.env.API_URL;
  const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY;
  if (!API_URL || !ADMIN_SECRET) {
    throw new Error('API_URL dan ADMIN_SECRET_KEY wajib diisi di .env.local');
  }
  return { API_URL, ADMIN_SECRET };
}

function buildHeaders() {
  const { ADMIN_SECRET } = getConfig();
  return {
    'X-Admin-Secret': ADMIN_SECRET,
    'Content-Type': 'application/json',
  };
}

function buildUpstreamUrl(params: { path: string[] }, searchParams: URLSearchParams): string {
  const { API_URL } = getConfig();
  const path = params.path.join('/');
  const qs = searchParams.toString();
  return `${API_URL}/admin/${path}${qs ? `?${qs}` : ''}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const p = await params;
  const url = buildUpstreamUrl(p, req.nextUrl.searchParams);
  try {
    const res = await fetch(url, { headers: buildHeaders(), cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Gagal menghubungi server API' }, { status: 503 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const p = await params;
  const url = buildUpstreamUrl(p, new URLSearchParams());
  try {
    const body = await req.json().catch(() => ({}));
    const res = await fetch(url, { method: 'POST', headers: buildHeaders(), body: JSON.stringify(body), cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Gagal menghubungi server API' }, { status: 503 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const p = await params;
  const url = buildUpstreamUrl(p, new URLSearchParams());
  try {
    const res = await fetch(url, { method: 'DELETE', headers: buildHeaders(), cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Gagal menghubungi server API' }, { status: 503 });
  }
}
