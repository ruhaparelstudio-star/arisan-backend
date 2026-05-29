/* Global toast bus — fire from anywhere, ToastHost listens via window events. */
export type ToastType = "success" | "error" | "info" | "loading";

export type ToastDetail = {
  type: ToastType;
  title: string;
  msg?: string;
  id: string;
};

export function toast(type: ToastType, title: string, msg?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToastDetail>("arisan-toast", {
      detail: { type, title, msg, id: Math.random().toString(36).slice(2) },
    }),
  );
}
