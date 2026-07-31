import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "PUBG Esports - Tournament Management System & Live Leaderboards",
  description: "Official PUBG Esports Tournament Management Website featuring real-time live standings, automated placement point calculations, season management, and team match breakdowns.",
  keywords: ["PUBG", "PUBG Esports", "Leaderboard", "Tournament Management", "WWCD", "Next.js", "Supabase"],
  authors: [{ name: "PUBG Esports Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-pubg-dark text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
