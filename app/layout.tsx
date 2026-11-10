import type { Metadata, Viewport } from "next";
import "@fontsource-variable/outfit";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/caveat";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f1ee" },
    { media: "(prefers-color-scheme: dark)", color: "#242426" },
  ],
};

export const metadata: Metadata = {
  appleWebApp: { capable: true, title: "Luno", statusBarStyle: "default" },
  title: "Luno",
  description: "Ton espace de travail : calendrier des DST, cours, flashcards, fiches et exercices.",
};

// Applique le thème enregistré avant le premier affichage, pour éviter un flash.
const scriptTheme = `try{var t=localStorage.getItem("luno-theme");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTheme }} />
      </head>
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
