import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arisan Admin — Dashboard",
  description:
    "Panel kendali Arisan App — pantau user, grup, OTP, dan kesehatan sistem. Phase Awal MVP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
