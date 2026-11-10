import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Permet d'ajouter le site à l'écran d'accueil du téléphone comme une application.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Luno",
    short_name: "Luno",
    description: "Calendrier des DST, cours, flashcards, fiches et exercices.",
    start_url: "./",
    scope: "./",
    display: "standalone",
    background_color: "#f8f1ee",
    theme_color: "#f8f1ee",
    lang: "fr",
    icons: [
      { src: "icone-192.png", sizes: "192x192", type: "image/png" },
      { src: "icone-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
