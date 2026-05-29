import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";
import type { IconName } from "@/components/Icon";

function MiniSpark({ data, color = "#00C897" }: { data: number[]; color?: string }) {
  const w = 64, h = 30;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => [
    (i / (data.length - 1)) * w,
    h - ((d - min) / range) * (h - 4) - 2,
  ]);
  const path = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={color} />
    </svg>
  );
}

export interface StatCardProps {
  icon: IconName;
  iconBg: string;
  iconColor: string;
  label: string;
  value: ReactNode;
  delta?: number;
  deltaDir?: "up" | "down" | "flat";
  suffix?: string;
  spark?: number[];
}

export function StatCard({ icon, iconBg, iconColor, label, value, delta, deltaDir, suffix, spark }: StatCardProps) {
  return (
    <div className="stat fade-in">
      <div className="stat-top">
        <div className="stat-ico" style={{ background: iconBg, color: iconColor }}>
          <Icon name={icon} size={21} sw={2} />
        </div>
        {spark && <MiniSpark data={spark} color={iconColor} />}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {suffix && <span style={{ fontSize: 16, color: "var(--muted)", fontWeight: 700 }}>{suffix}</span>}
      </div>
      {delta != null && (
        <div className="stat-foot">
          <span className={"delta " + (deltaDir || "up")}>
            <Icon name={deltaDir === "down" ? "arrowDown" : "arrowUp"} size={11} sw={2.6} />
            {delta}%
          </span>
          <span style={{ color: "var(--muted)" }}>vs bulan lalu</span>
        </div>
      )}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="stat">
      <div className="stat-top">
        <div className="sk" style={{ width: 42, height: 42, borderRadius: 12 }} />
        <div className="sk" style={{ width: 64, height: 28 }} />
      </div>
      <div className="sk" style={{ width: "55%", height: 11, marginBottom: 12 }} />
      <div className="sk" style={{ width: "45%", height: 28, marginBottom: 12 }} />
      <div className="sk" style={{ width: "70%", height: 12 }} />
    </div>
  );
}
