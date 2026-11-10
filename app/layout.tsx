import type { Metadata } from "next";
import "@fontsource-variable/geist";
import "@fontsource-variable/bricolage-grotesque";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Luno",
  description: "Ton espace de travail : calendrier des DST, cours, flashcards, fiches et exercices.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
