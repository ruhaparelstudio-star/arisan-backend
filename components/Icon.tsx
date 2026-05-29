import type { CSSProperties, ReactNode } from "react";

/* Icon set — stroke line icons, 1.8 default. Usage: <Icon name="users" size={18} /> */
export type IconName =
  | "grid" | "users" | "layers" | "message" | "activity" | "shield" | "server"
  | "settings" | "bell" | "search" | "chevDown" | "chevRight" | "chevLeft"
  | "arrowUp" | "arrowDown" | "trendUp" | "user" | "phone" | "mapPin" | "calendar"
  | "clock" | "check" | "checkCircle" | "x" | "xCircle" | "alert" | "ban" | "trash"
  | "pause" | "play" | "refresh" | "external" | "db" | "zap" | "money" | "crown"
  | "dice" | "swap" | "filter" | "download" | "eye" | "plus" | "logout" | "sparkle"
  | "dot" | "gauge" | "flag" | "inbox" | "wifi";

type IconProps = {
  name: IconName | string;
  size?: number;
  sw?: number;
  color?: string;
  style?: CSSProperties;
  className?: string;
};

export function Icon({ name, size = 18, sw = 1.8, color, style, className }: IconProps) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color || "currentColor",
    strokeWidth: sw,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style,
    className,
  };
  const paths: Record<string, ReactNode> = {
    grid: (<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>),
    users: (<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
    layers: (<><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>),
    message: (<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>),
    activity: (<><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>),
    shield: (<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></>),
    server: (<><rect x="2" y="3" width="20" height="8" rx="2" /><rect x="2" y="13" width="20" height="8" rx="2" /><path d="M6 7h.01M6 17h.01" /></>),
    settings: (<><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" /><circle cx="12" cy="12" r="3" /></>),
    bell: (<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>),
    search: (<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>),
    chevDown: (<><path d="m6 9 6 6 6-6" /></>),
    chevRight: (<><path d="m9 18 6-6-6-6" /></>),
    chevLeft: (<><path d="m15 18-6-6 6-6" /></>),
    arrowUp: (<><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></>),
    arrowDown: (<><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></>),
    trendUp: (<><path d="M16 7h6v6" /><path d="m22 7-8.5 8.5-5-5L2 17" /></>),
    user: (<><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></>),
    phone: (<><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></>),
    mapPin: (<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>),
    calendar: (<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>),
    clock: (<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>),
    check: (<><path d="M20 6 9 17l-5-5" /></>),
    checkCircle: (<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></>),
    x: (<><path d="M18 6 6 18M6 6l12 12" /></>),
    xCircle: (<><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></>),
    alert: (<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4M12 17h.01" /></>),
    ban: (<><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></>),
    trash: (<><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>),
    pause: (<><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></>),
    play: (<><polygon points="6 3 20 12 6 21 6 3" /></>),
    refresh: (<><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></>),
    external: (<><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>),
    db: (<><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" /></>),
    zap: (<><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></>),
    money: (<><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 12h.01M18 12h.01" /></>),
    crown: (<><path d="M2 18h20M3 7l4 5 5-7 5 7 4-5-2 11H5L3 7Z" /></>),
    dice: (<><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" /><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /></>),
    swap: (<><path d="M16 3h5v5" /><path d="M21 3 9 15" /><path d="M8 21H3v-5" /><path d="m3 21 6-6" /></>),
    filter: (<><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></>),
    download: (<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></>),
    eye: (<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>),
    plus: (<><path d="M12 5v14M5 12h14" /></>),
    logout: (<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>),
    sparkle: (<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></>),
    dot: (<><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" /></>),
    gauge: (<><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></>),
    flag: (<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><path d="M4 22v-7" /></>),
    inbox: (<><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>),
    wifi: (<><path d="M5 13a10 10 0 0 1 14 0" /><path d="M8.5 16.5a5 5 0 0 1 7 0" /><path d="M2 8.82a15 15 0 0 1 20 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></>),
  };
  return <svg {...p}>{paths[name] || paths.dot}</svg>;
}
