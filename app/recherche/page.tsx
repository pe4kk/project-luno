"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  BookOpen,
  CalendarDays,
  FileDown,
  GraduationCap,
  Layers,
  ListTodo,
  ScrollText,
  Search,
  X,
} from "lucide-react";
import { useLuno } from "@/lib/store";
import { simplifier } from "@/lib/contenu";
import { dateLongue } from "@/lib/dates";
import { lienFichier, lienTravail } from "@/lib/liens";
import { LECONS } from "@/contenu/lecons";
import { BoutonIcone, EnTete, classeSaisie, pluriel } from "@/components/ui";
import { formule } from "@/components/Formule";

type Resultat = {
  cle: string;
  titre: string;
  detail: string;
  href: string;
  externe?: boolean;
};
type Groupe = { nom: string; icone: typeof Search; resultats: Resultat[] };

const MAX_PAR_GROUPE = 8;

const classeResultat =
  "block rounded-2xl border border-line bg-surface px-4 py-3 shadow-card transition-colors hover:border-ink/30";

function ContenuResultat({ r }: { r: Resultat }) {
  return (
    <>
      <span className="block text-[15.5px] font-medium leading-snug">
        {formule(r.titre)}
      </span>
      {r.detail && (
        <span className="mt-0.5 line-clamp-2 block text-[13.5px] text-muted">
          {formule(r.detail)}
        </span>
      )}
    </>
  );
}

export default function Recherche() {
  const { matieres, chapitres, dsts, taches } = useLuno();
  const [requete, setRequete] = useState("");
  const mots = simplifier(requete).split(" ").filter(Boolean);

  const groupes = useMemo<Groupe[]>(() => {
    if (mots.length === 0 || mots.join("").length < 2) return [];
    // Un texte correspond s'il contient tous les mots tapés, sans tenir compte des accents.
    const trouve = (...textes: string[]) => {
      const t = simplifier(textes.join(" "));
      return mots.every((m) => t.includes(m));
    };
    const nomMatiere = (id: string) => matieres.find((m) => m.id === id);
    const etiquette = (id: string) => {
      const m = nomMatiere(id);
      return m ? `${m.emoji} ${m.nom}` : "";
    };

    const gChapitres: Resultat[] = [
      ...matieres
        .filter((m) => trouve(m.nom))
        .map((m) => ({
          cle: m.id,
          titre: `${m.emoji} ${m.nom}`,
          detail: "Matière",
          href: lienTravail({ m: m.id }),
        })),
      ...chapitres
        .filter((c) => trouve(c.titre))
        .map((c) => ({
          cle: c.id,
          titre: c.titre,
          detail: etiquette(c.matiereId),
          href: lienTravail({ m: c.matiereId, c: c.id }),
        })),
    ];
    const gCartes: Resultat[] = chapitres.flatMap((c) =>
      c.flashcards
        .filter((f) => trouve(f.recto, f.verso))
        .map((f) => ({
          cle: f.id,
          titre: f.recto,
          detail: f.verso,
          href: lienTravail({ m: c.matiereId, c: c.id, o: "flashcards" }),
        })),
    );
    const gFiches: Resultat[] = chapitres.flatMap((c) =>
      (c.fiche?.sections ?? []).flatMap((sec) =>
        sec.points
          .filter((p) => trouve(p.t))
          .map((p, i) => ({
            cle: `${c.id}-${sec.titre}-${i}`,
            titre: p.t,
            detail: `${c.titre} · ${sec.titre}`,
            href: lienTravail({ m: c.matiereId, c: c.id, o: "fiche" }),
          })),
      ),
    );
    const gDocs: Resultat[] = chapitres.flatMap((c) =>
      c.documents
        .filter((d) => trouve(d.titre, c.titre))
        .map((d) => ({
          cle: d.fichier,
          titre: d.titre,
          detail: `${d.detail ?? "PDF"} · ${etiquette(c.matiereId)}`,
          href: lienFichier(d.fichier),
          externe: true,
        })),
    );
    const gCours: Resultat[] = chapitres
      .filter((c) => c.cours && trouve(c.cours))
      .map((c) => ({
        cle: c.id,
        titre: c.titre,
        detail: `Dans le cours · ${etiquette(c.matiereId)}`,
        href: lienTravail({ m: c.matiereId, c: c.id, o: "cours" }),
      }));
    const gDsts: Resultat[] = dsts
      .filter((d) =>
        trouve(d.titre, nomMatiere(d.matiereId)?.nom ?? "", d.notes),
      )
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({
        cle: d.id,
        titre: `${etiquette(d.matiereId)} · ${d.titre}`,
        detail: dateLongue(d.date) + " " + d.date.slice(0, 4),
        href: "/calendrier",
      }));
    const gTaches: Resultat[] = taches
      .filter((t) => trouve(t.texte))
      .map((t) => ({
        cle: t.id,
        titre: t.texte,
        detail: t.fait ? "Terminée" : "À faire",
        href: "/taches",
      }));
    const gLecons: Resultat[] = LECONS.filter((l) =>
      trouve(
        l.titre,
        l.matiere,
        l.intro,
        ...l.etapes.flatMap((e) => [e.titre, ...e.texte]),
      ),
    ).map((l) => ({
      cle: l.id,
      titre: l.titre,
      detail: `${l.matiere} · ${l.niveau}`,
      href: `/apprendre?l=${l.id}`,
    }));

    return [
      { nom: "Matières et chapitres", icone: BookOpen, resultats: gChapitres },
      { nom: "Flashcards", icone: Layers, resultats: gCartes },
      { nom: "Fiches", icone: ScrollText, resultats: gFiches },
      { nom: "Documents du prof", icone: FileDown, resultats: gDocs },
      { nom: "Cours", icone: BookOpen, resultats: gCours },
      { nom: "DST", icone: CalendarDays, resultats: gDsts },
      { nom: "À faire", icone: ListTodo, resultats: gTaches },
      { nom: "Leçons", icone: GraduationCap, resultats: gLecons },
    ].filter((g) => g.resultats.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requete, matieres, chapitres, dsts, taches]);

  const total = groupes.reduce((n, g) => n + g.resultats.length, 0);
  const assez = mots.join("").length >= 2;

  return (
    <div className="mx-auto max-w-[760px]">
      <EnTete
        titre="Recherche"
        sousTitre="Dans tes matières, flashcards, fiches, documents, DST, tâches et leçons."
      />
      <div className="relative mb-6">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          autoFocus
          type="search"
          enterKeyHint="search"
          aria-label="Rechercher"
          className={
            classeSaisie +
            " !bg-surface !py-3.5 !pl-11 !pr-12 [&::-webkit-search-cancel-button]:hidden"
          }
          placeholder="Ex. Dreyfus, dérivée, syllepse…"
          value={requete}
          onChange={(e) => setRequete(e.target.value)}
        />
        {requete && (
          <BoutonIcone
            label="Effacer la recherche"
            onClick={() => setRequete("")}
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <X size={17} />
          </BoutonIcone>
        )}
      </div>

      {!assez ? (
        <p className="text-[14.5px] text-muted">
          Tape au moins deux lettres. Les accents et les majuscules ne comptent
          pas.
        </p>
      ) : total === 0 ? (
        <p
          role="status"
          className="rounded-2xl border border-dashed border-ink/20 p-6 text-center text-[14.5px] text-muted"
        >
          Aucun résultat pour « {requete.trim()} ». Essaie un mot plus court ou
          un synonyme.
        </p>
      ) : (
        <>
          <p role="status" className="mb-4 text-[13.5px] text-muted">
            {pluriel(total, "résultat")}
          </p>
          <div className="flex flex-col gap-6">
            {groupes.map(({ nom, icone: Icone, resultats }) => (
              <section key={nom}>
                <h2 className="mb-2 flex items-center gap-2 text-[18px]">
                  <Icone size={17} className="text-accent" /> {nom}
                  <span className="font-sans text-[13px] font-medium text-muted">
                    {resultats.length}
                  </span>
                </h2>
                <ul className="flex flex-col gap-2">
                  {resultats.slice(0, MAX_PAR_GROUPE).map((r, i) => (
                    <motion.li
                      key={r.cle}
                      initial={{ opacity: 0, transform: "translate3d(0, 6px, 0)" }}
                      animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
                      transition={{ delay: Math.min(i * 0.02, 0.15) }}
                    >
                      {/* Un PDF est un fichier : lien simple, car Link ajouterait le préfixe du site une seconde fois. */}
                      {r.externe ? (
                        <a
                          href={r.href}
                          target="_blank"
                          rel="noreferrer"
                          className={classeResultat}
                        >
                          <ContenuResultat r={r} />
                        </a>
                      ) : (
                        <Link href={r.href} className={classeResultat}>
                          <ContenuResultat r={r} />
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
                {resultats.length > MAX_PAR_GROUPE && (
                  <p className="mt-2 text-[13px] text-muted">
                    Et {resultats.length - MAX_PAR_GROUPE} de plus : précise ta
                    recherche pour les voir.
                  </p>
                )}
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
