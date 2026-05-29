"use client";

import { Icon } from "@/components/Icon";

interface PaginationProps {
  page: number;
  total: number;
  perPage?: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, total, perPage = 20, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid var(--line)" }}>
      <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>
        {start}–{end} dari {total} data
      </span>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
        >
          <Icon name="chevLeft" size={15} />
          Sebelumnya
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
        >
          Berikutnya
          <Icon name="chevRight" size={15} />
        </button>
      </div>
    </div>
  );
}
