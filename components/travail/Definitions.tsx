"use client";

import { useState } from "react";
import { BookMarked, Send } from "lucide-react";
import { formule } from "@/components/Formule";
import { DessinSchema } from "@/components/Schema";
import { Bouton, EtatVide, pluriel } from "@/components/ui";
import { encre, pastel } from "@/lib/store";
import type { Chapitre, DefinitionCours, Matiere } from "@/lib/types";

const NOMS: Record<DefinitionCours["type"], string> = {
  definition: "Définition",
  propriete: "Propriété",
  theoreme: "Théorème",
  formule: "Formule",
  loi: "Loi",
  methode: "Méthode",
};

/**
 * Filtres : définitions, formules (et lois qui s'écrivent en formule), propriétés.
 * Demandé le 2026-11-14 : « il faut pouvoir trier les formules à part des définitions ».
 * Les méthodes ne vont pas dans Déf (elles sont dans la fiche).
 */
const FILTRES = [
  { id: "tout", label: "Tout" },
  { id: "definition", label: "Définitions" },
  { id: "formule", label: "Formules et lois" },
  { id: "propriete", label: "Propriétés" },
] as const;
type Filtre = (typeof FILTRES)[number]["id"];
const famille = (t: DefinitionCours["type"]): Filtre =>
  t === "definition" ? "definition" : t === "formule" || t === "loi" ? "formule" : "propriete";

/**
 * Onglet « Déf » d'un chapitre : les définitions et propriétés recopiées telles que le
 * prof les a écrites, dans des encadrés comme sur le polycopié. À apprendre mot pour mot.
 */
export function OngletDefinitions({
  chapitre,
  matiere,
  envoyer,
}: {
  chapitre: Chapitre;
  matiere: Matiere;
  envoyer: () => void;
}) {
  const [filtre, setFiltre] = useState<Filtre>("tout");
  const toutes = (chapitre.definitions ?? []).filter((d) => d.type !== "methode");
  const foncee = encre(matiere.couleur);

  if (toutes.length === 0) {
    return (
      <EtatVide
        icone={<BookMarked size={26} />}
        titre="Pas encore de définitions"
        texte="Claude recopie les définitions et les propriétés de ton cours, telles que ton prof les a écrites, pour que tu les apprennes mot pour mot."
        action={
          <Bouton onClick={envoyer}>
            <Send size={16} /> Envoyer le cours à Claude
          </Bouton>
        }
      />
    );
  }

  const liste = toutes.filter((d) => filtre === "tout" || famille(d.type) === filtre);
  const nb = (f: Filtre) => toutes.filter((d) => famille(d.type) === f).length;
  const resume = [
    pluriel(nb("definition"), "définition"),
    pluriel(nb("formule"), "formule ou loi", "formules ou lois"),
    pluriel(nb("propriete"), "propriété"),
  ].filter((x) => !x.startsWith("0 "));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-muted">
          {resume.join(" · ")}, telles qu&apos;écrites dans le cours.
        </p>
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Afficher">
          {FILTRES.filter((f) => f.id === "tout" || nb(f.id) > 0).map((f) => (
            <button
              key={f.id}
              role="radio"
              aria-checked={filtre === f.id}
              onClick={() => setFiltre(f.id)}
              className={`min-h-9 rounded-full px-3.5 text-[13.5px] font-semibold transition-colors duration-200 ${
                filtre === f.id ? "bg-ink text-bg" : "bg-ink/5 text-muted hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <ol className="grid gap-3 lg:grid-cols-2">
        {liste.map((d, i) => (
          <li
            key={`${d.terme}-${i}`}
            className="flex flex-col rounded-[18px] border border-line bg-surface p-5 shadow-card"
            style={{ borderLeft: `4px solid ${d.type === "definition" ? matiere.couleur : "var(--copper)"}` }}
          >
            <p
              className="surtitre"
              style={{ color: d.type === "definition" ? foncee : "var(--copper)" }}
            >
              {NOMS[d.type]}
            </p>
            <p className="mt-1 font-display text-[19px] leading-snug">{formule(d.terme)}</p>
            <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed">{formule(d.texte)}</p>
            {d.precision && (
              <p
                className="mt-3 rounded-xl px-3.5 py-2 text-[14px] leading-snug"
                style={{ background: pastel(matiere.couleur, 10) }}
              >
                {formule(d.precision)}
              </p>
            )}
            {d.schema && <DessinSchema schema={d.schema} className="mt-3" />}
          </li>
        ))}
      </ol>
    </div>
  );
}
