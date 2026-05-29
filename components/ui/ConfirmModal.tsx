"use client";

import { Icon } from "@/components/Icon";
import type { IconName } from "@/components/Icon";

interface ConfirmModalProps {
  icon?: IconName;
  iconColor?: string;
  iconBg?: string;
  title: string;
  desc: string;
  confirmLabel?: string;
  confirmClass?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  icon,
  iconColor,
  iconBg,
  title,
  desc,
  confirmLabel,
  confirmClass,
  loading,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <div className="overlay center" onClick={loading ? undefined : onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div
              className="stat-ico"
              style={{
                background: iconBg || "var(--danger-light)",
                color: iconColor || "var(--danger)",
                width: 46,
                height: 46,
                flexShrink: 0,
              }}
            >
              <Icon name={icon || "alert"} size={22} sw={2} />
            </div>
            <div>
              <div style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: "-.01em" }}>{title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 5, lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-line" style={{ flex: 1 }} onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button
            className={"btn " + (confirmClass || "btn-danger")}
            style={{ flex: 1 }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && (
              <span
                className="spinner"
                style={{ width: 16, height: 16, borderColor: "rgba(0,0,0,.15)", borderTopColor: "currentColor" }}
              />
            )}
            {confirmLabel || "Konfirmasi"}
          </button>
        </div>
      </div>
    </div>
  );
}
