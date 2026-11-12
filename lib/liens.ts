/** Adresse d'un écran de l'onglet Travail (matière, chapitre, sous-onglet, révision du jour). */
export function lienTravail(
  p: { m?: string; c?: string; o?: string; r?: string; n?: string } = {},
): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) if (v) q.set(k, v);
  const s = q.toString();
  return s ? `/travail?${s}` : "/travail";
}

/** Adresse d'un fichier de `public/` (PDF), avec le préfixe du site sur GitHub Pages. */
export function lienFichier(fichier: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${fichier.replace(/^\//, "")}`;
}
