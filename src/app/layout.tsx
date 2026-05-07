import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PIMS Paint Production Tracking",
  description: "Production tracking for paint factory operations",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
