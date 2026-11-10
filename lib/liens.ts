/** Adresse d'un écran de l'onglet Travail (matière, chapitre, sous-onglet, révision du jour). */
export function lienTravail(p: { m?: string; c?: string; o?: string; r?: string } = {}): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) if (v) q.set(k, v);
  const s = q.toString();
  return s ? `/travail?${s}` : "/travail";
}
