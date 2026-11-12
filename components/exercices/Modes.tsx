"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Calculator, ChevronRight, PenLine } from "lucide-react";
import { formule } from "@/components/Formule";
import { Emoji } from "@/components/Emoji";
import { EtatVide, pluriel } from "@/components/ui";
import { encre, useLuno } from "@/lib/store";
import type { Calcul, Chapitre, Probleme } from "@/lib/types";
import { LecteurProbleme } from "./Probleme";
import { LecteurCalcul } from "./Calcul";

/** Liste des éléments (problèmes ou calculs) rangés par chapitre. */
function ParChapitre<T extends { id: string; titre: string }>({
  liste,
  choisir,
  detail,
}: {
  liste: { chapitre: Chapitre; elements: T[] }[];
  choisir: (e: T, c: Chapitre) => void;
  detail: (e: T) => ReactNode;
}) {
  const matieres = useLuno((s) => s.matieres);
  return (
    <div className="flex flex-col gap-6">
      {liste.map(({ chapitre, elements }) => {
        const m = matieres.find((x) => x.id === chapitre.matiereId);
        return (
          <section key={chapitre.id}>
            <p className="mb-2 text-[13px] font-semibold" style={{ color: encre(m?.couleur ?? "#888") }}>
              <Emoji e={m?.emoji} /> {m?.nom} · <span className="text-ink">{chapitre.titre}</span>
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {elements.map((e, i) => (
                <motion.button
                  key={e.id}
                  initial={{ opacity: 0, transform: "translate3d(0, 10px, 0)" }}
                  animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => choisir(e, chapitre)}
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-left shadow-card transition-colors duration-200 hover:border-ink/25"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-semibold leading-snug">{e.titre}</span>
                    <span className="mt-1 block text-[14px] leading-loose text-muted">{detail(e)}</span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5" />
                </motion.button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/** Mode A : problèmes rédigés étape par étape, avec le barème du prof. */
export function ModeProblemes({ entete }: { entete: ReactNode }) {
  const chapitres = useLuno((s) => s.chapitres);
  const [choix, setChoix] = useState<{ p: Probleme; c: Chapitre } | null>(null);
  if (choix)
    return <LecteurProbleme key={choix.p.id} probleme={choix.p} matiereId={choix.c.matiereId} quitter={() => setChoix(null)} />;
  const liste = chapitres
    .filter((c) => c.problemes?.length)
    .map((c) => ({ chapitre: c, elements: c.problemes! }));
  return (
    <div>
      {entete}
      <p className="mb-4 max-w-[640px] text-[14.5px] text-muted">
        Une situation réelle, à rédiger comme sur ta copie : données, bilan des forces, loi, expression
        littérale, A.N., conclusion. À chaque étape, tu compares avec ce que ton prof attend et tu coches.
      </p>
      {liste.length === 0 ? (
        <EtatVide icone={<PenLine size={26} />} titre="Pas encore de problème" texte="Ils arrivent avec les chapitres publiés." />
      ) : (
        <ParChapitre
          liste={liste}
          choisir={(p, c) => setChoix({ p, c })}
          detail={(p) =>
            `${pluriel(p.etapes.length, "étape")} · ${String(p.etapes.reduce((t, e) => t + (e.points ?? 1), 0)).replace(".", ",")} pts${p.duree ? ` · ${p.duree}` : ""}`
          }
        />
      )}
    </div>
  );
}

/** Mode C : calculs à valeurs changeantes, vérifiés (valeur, unité, chiffres significatifs). */
export function ModeCalculs({ entete }: { entete: ReactNode }) {
  const chapitres = useLuno((s) => s.chapitres);
  const [choix, setChoix] = useState<Calcul | null>(null);
  if (choix) return <LecteurCalcul key={choix.id} calcul={choix} quitter={() => setChoix(null)} />;
  const liste = chapitres
    .filter((c) => c.calculs?.length)
    .map((c) => ({ chapitre: c, elements: c.calculs! }));
  return (
    <div>
      {entete}
      <p className="mb-4 max-w-[640px] text-[14.5px] text-muted">
        La même situation avec de nouveaux nombres à chaque fois. Luno vérifie ta valeur, ton unité et tes
        chiffres significatifs.
      </p>
      {liste.length === 0 ? (
        <EtatVide icone={<Calculator size={26} />} titre="Pas encore de calcul" texte="Ils arrivent avec les chapitres publiés." />
      ) : (
        <ParChapitre liste={liste} choisir={(c) => setChoix(c)} detail={(c) => formule(c.litterale)} />
      )}
    </div>
  );
}
