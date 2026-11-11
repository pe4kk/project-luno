"use client";

import { useState } from "react";
import { BookMarked, Send } from "lucide-react";
import { formule } from "@/components/Formule";
import { DessinSchema } from "@/components/Schema";
import { Bouton, EtatVide } from "@/components/ui";
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

/** Filtres proposés : « Définitions » d'un côté, tout ce qui s'énonce de l'autre. */
const FILTRES = [
  { id: "tout", label: "Tout" },
  { id: "definition", label: "Définitions" },
  { id: "enonce", label: "Propriétés et lois" },
] as const;

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
  const [filtre, setFiltre] = useState<(typeof FILTRES)[number]["id"]>("tout");
  const toutes = chapitre.definitions ?? [];
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

  const liste = toutes.filter((d) =>
    filtre === "tout" ? true : filtre === "definition" ? d.type === "definition" : d.type !== "definition",
  );
  const nbDef = toutes.filter((d) => d.type === "definition").length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-muted">
          {nbDef} définition{nbDef > 1 ? "s" : ""} et {toutes.length - nbDef} énoncé
          {toutes.length - nbDef > 1 ? "s" : ""}, telles qu&apos;écrites dans le cours.
        </p>
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Afficher">
          {FILTRES.map((f) => (
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
