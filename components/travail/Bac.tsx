"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, BookOpen, Check, ChevronRight, Eye, EyeOff, Mic, RotateCcw } from "lucide-react";
import { formule } from "@/components/Formule";
import { Bouton, pluriel } from "@/components/ui";
import { PROGRAMME_BAC, TEXTES_BAC } from "@/contenu/bac-francais";
import {
  GENRES_BAC,
  ORAL_BAC,
  categoriesDe,
  estTexte,
  type AnnotationBac,
  type CategorieBac,
  type PassageBac,
  type TexteBac,
} from "@/lib/bac";
import { lienTravail } from "@/lib/liens";
import { encre, pastel, useLuno } from "@/lib/store";
import type { Matiere } from "@/lib/types";

/** Fond d'un passage surligné : la couleur de la catégorie, fondue dans la carte. */
const fond = (couleur: string, pct = 34) => `color-mix(in oklab, ${couleur} ${pct}%, var(--surface))`;

type Vue = "annote" | "fiche" | "recite";
const VUES: { id: Vue; label: string }[] = [
  { id: "annote", label: "Texte annoté" },
  { id: "fiche", label: "Fiche" },
  { id: "recite", label: "Je récite" },
];

/**
 * Onglet « Bac » de la matière Français : les seize textes de l'oral classés par genre,
 * puis, pour un texte, le texte annoté, la fiche et l'entraînement « Je récite ».
 */
export function VueBac({ matiere, texteId, vue }: { matiere: Matiere; texteId: string | null; vue: string | null }) {
  const texte = TEXTES_BAC.find((t) => t.id === texteId);
  return texte ? (
    <VueTexte matiere={matiere} texte={texte} vue={VUES.some((v) => v.id === vue) ? (vue as Vue) : "annote"} />
  ) : (
    <Descriptif matiere={matiere} />
  );
}

function Descriptif({ matiere }: { matiere: Matiere }) {
  const chapitres = useLuno((s) => s.chapitres);
  const foncee = encre(matiere.couleur);
  const prets = TEXTES_BAC.length;
  return (
    <div className="mx-auto max-w-[860px]">
      <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="surtitre" style={{ color: foncee }}>
              Oral · {ORAL_BAC.periode}
            </p>
            <h2 className="mt-1 text-[24px]">
              {pluriel(prets, "texte prêt", "textes prêts")} sur {ORAL_BAC.textes}
            </h2>
          </div>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent">
            coefficient {ORAL_BAC.coefficient}
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-accent-soft">
          <div className="copper-bg h-full rounded-full" style={{ width: `${Math.max(3, (prets / ORAL_BAC.textes) * 100)}%` }} />
        </div>
        <ul className="mt-4 grid grid-cols-5 gap-1.5">
          {ORAL_BAC.parties.map((p) => (
            <li key={p.nom} className="rounded-xl border border-line px-1 py-2 text-center">
              <span className="block font-display text-[15px] leading-tight sm:text-[17px]">{p.valeur}</span>
              <span className="block text-[10.5px] leading-tight text-muted sm:text-[12px]">{p.nom}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          L&apos;examinateur choisit un de tes {ORAL_BAC.textes} textes. 20 minutes d&apos;oral : lecture,
          explication linéaire et grammaire (12 min), puis l&apos;œuvre que tu as choisie (8 min). Écrit le{" "}
          {ORAL_BAC.ecrit}.
        </p>
      </div>

      {PROGRAMME_BAC.map((g) => {
        const genre = GENRES_BAC[g.genre];
        const nb = g.places.filter(estTexte).length;
        const chapitre = g.oeuvre?.chapitrePublie
          ? chapitres.find((c) => c.publieId === g.oeuvre!.chapitrePublie)
          : undefined;
        return (
          <section key={g.genre} className="mt-6">
            <div className="mb-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="text-[20px]">{genre.emoji}</span>
              <h3 className="text-[21px]">{genre.nom}</h3>
              <span className="text-[13px] text-muted">{nb} / 4</span>
              <span className="ml-auto flex gap-1" aria-label={`Code couleur : ${genre.categories.map((c) => c.nom).join(", ")}`}>
                {genre.categories.map((c) => (
                  <span key={c.id} title={c.nom} className="size-3 rounded-full" style={{ background: c.couleur }} />
                ))}
              </span>
            </div>
            {g.oeuvre ? (
              <div className="rounded-[18px] border border-line bg-surface px-5 pb-1.5 pt-4 shadow-card">
                <p className="font-display text-[18px] leading-snug">
                  {g.oeuvre.auteur}, <i>{g.oeuvre.titre}</i>
                </p>
                <p className="mt-0.5 text-[13px] text-muted">
                  Parcours : {g.oeuvre.parcours}
                  {chapitre && (
                    <>
                      {" · "}
                      <Link
                        href={lienTravail({ m: chapitre.matiereId, c: chapitre.id, o: "fiche" })}
                        className="font-semibold text-accent underline-offset-2 hover:underline"
                      >
                        Fiche de l&apos;œuvre
                      </Link>
                    </>
                  )}
                </p>
                <ol className="mt-3">
                  {g.places.map((p, i) => {
                    const numero = (
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-[10px] text-[13.5px] font-semibold"
                        style={{ background: pastel(matiere.couleur, 16), color: foncee }}
                      >
                        {i + 1}
                      </span>
                    );
                    return (
                      <li key={p.titre} className="border-t border-line">
                        {estTexte(p) ? (
                          <Link
                            href={lienTravail({ m: matiere.id, o: "bac", t: p.id })}
                            scroll={false}
                            className="group flex min-h-14 items-center gap-3 py-2.5"
                          >
                            {numero}
                            <span className="min-w-0 flex-1">
                              <span className="block text-[15.5px] font-medium leading-snug">{p.titre}</span>
                              <span className="block text-[12.5px] text-muted">
                                {p.parcours ? `${p.auteur} · parcours` : "Texte annoté · fiche · je récite"}
                              </span>
                            </span>
                            <span className="rounded-full px-2 py-0.5 text-[11.5px] font-semibold text-ok" style={{ background: "color-mix(in oklab, var(--ok) 15%, var(--surface))" }}>
                              prêt
                            </span>
                            <ChevronRight size={17} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        ) : (
                          <div className="flex min-h-14 items-center gap-3 py-2.5">
                            {numero}
                            <span className="min-w-0 flex-1">
                              <span className="block text-[15px] font-medium leading-snug text-muted">{p.titre}</span>
                              <span className="block text-[12.5px] text-muted">
                                {p.parcours ? "Parcours · " : ""}
                                {p.attente}
                              </span>
                            </span>
                            <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11.5px] font-semibold text-muted">à venir</span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            ) : (
              <p className="rounded-[18px] border border-dashed border-line px-5 py-4 text-[14px] text-muted">
                Œuvre pas encore commencée. Envoie le texte et l&apos;explication de ton prof dans le chat : ils
                arrivent ici.
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}

/** Une ligne découpée en morceaux : texte simple, ou passage annoté. */
type Morceau = { t: string; n?: number };

/**
 * Retrouve dans les lignes d'un passage les extraits annotés. Chaque annotation est
 * placée une fois, à sa première occurrence ; deux extraits ne se chevauchent pas.
 */
function decouper(passage: PassageBac, premier: number): Morceau[][] {
  const restants = passage.annotations.map((a, i) => ({ a, n: premier + i }));
  return passage.lignes.map((ligne) => {
    const trouves: { debut: number; fin: number; n: number }[] = [];
    for (const r of [...restants]) {
      const debut = ligne.indexOf(r.a.extrait);
      if (debut < 0) continue;
      const fin = debut + r.a.extrait.length;
      if (trouves.some((x) => debut < x.fin && fin > x.debut)) continue;
      trouves.push({ debut, fin, n: r.n });
      restants.splice(restants.indexOf(r), 1);
    }
    trouves.sort((x, y) => x.debut - y.debut);
    const morceaux: Morceau[] = [];
    let curseur = 0;
    for (const x of trouves) {
      if (x.debut > curseur) morceaux.push({ t: ligne.slice(curseur, x.debut) });
      morceaux.push({ t: ligne.slice(x.debut, x.fin), n: x.n });
      curseur = x.fin;
    }
    if (curseur < ligne.length) morceaux.push({ t: ligne.slice(curseur) });
    return morceaux;
  });
}

/** Numérote les annotations d'un bout à l'autre du texte et découpe les lignes. */
function numeroter(texte: TexteBac) {
  let n = 1;
  return texte.mouvements.map((m) => ({
    titre: m.titre,
    passages: m.passages.map((brut) => {
      // Les remarques sont numérotées dans l'ordre où leurs passages apparaissent.
      const place = (a: AnnotationBac) => {
        const l = brut.lignes.findIndex((x) => x.includes(a.extrait));
        return (l < 0 ? 999 : l) * 1000 + (l < 0 ? 0 : brut.lignes[l].indexOf(a.extrait));
      };
      const p = { ...brut, annotations: [...brut.annotations].sort((a, b) => place(a) - place(b)) };
      const premier = n;
      n += p.annotations.length;
      return { passage: p, premier, lignes: decouper(p, premier) };
    }),
  }));
}

function VueTexte({ matiere, texte, vue }: { matiere: Matiere; texte: TexteBac; vue: Vue }) {
  const router = useRouter();
  const foncee = encre(matiere.couleur);
  const genre = GENRES_BAC[texte.genre];
  const aller = (v: Vue) =>
    router.replace(lienTravail({ m: matiere.id, o: "bac", t: texte.id, v: v === "annote" ? undefined : v }), {
      scroll: false,
    });

  return (
    <div>
      <Link
        href={lienTravail({ m: matiere.id, o: "bac" })}
        scroll={false}
        className="-ml-1 mb-2 inline-flex min-h-11 items-center gap-1.5 px-1 text-[14px] font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> Bac · {genre.nom}
      </Link>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <p className="surtitre" style={{ color: foncee }}>
            {genre.nom} · {texte.auteur}
          </p>
          <h2 className="mt-1 text-[28px] leading-tight sm:text-[36px]">{texte.titre}</h2>
          <p className="mt-0.5 text-[13.5px] text-muted">{[texte.date, texte.forme].filter(Boolean).join(" · ")}</p>
        </div>
        <div role="tablist" aria-label="Affichage du texte" className="inline-flex max-w-full rounded-full border border-line bg-surface p-1 shadow-card">
          {VUES.map((v) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={vue === v.id}
              onClick={() => aller(v.id)}
              className={`min-h-10 whitespace-nowrap rounded-full px-3.5 text-[14px] font-semibold transition-colors duration-200 sm:px-4 ${
                vue === v.id ? "bg-ink text-bg" : "text-muted hover:text-ink"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={vue}
          initial={{ opacity: 0, transform: "translate3d(0, 10px, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {vue === "annote" && <TexteAnnote texte={texte} foncee={foncee} />}
          {vue === "fiche" && <FicheTexte texte={texte} matiere={matiere} />}
          {vue === "recite" && <JeRecite texte={texte} matiere={matiere} versFiche={() => aller("annote")} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Legende({ categories, className = "" }: { categories: CategorieBac[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Code couleur">
      {categories.map((c) => (
        <li key={c.id} className="rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ background: fond(c.couleur, 38) }}>
          {c.nom}
        </li>
      ))}
    </ul>
  );
}

function Note({
  a,
  n,
  couleur,
  categorie,
  actif,
  carte = false,
}: {
  a: AnnotationBac;
  n: number;
  couleur: string;
  categorie: string;
  actif?: boolean;
  carte?: boolean;
}) {
  return (
    <div
      id={carte ? undefined : `note-${n}`}
      className={`border-l-4 py-1.5 pl-3 text-[14px] leading-relaxed transition-colors duration-300 ${
        carte ? "rounded-r-2xl border border-l-4 border-line bg-surface px-4 py-3 shadow-card" : "rounded-r-lg"
      }`}
      style={{ borderLeftColor: couleur, background: actif && !carte ? fond(couleur, 14) : undefined }}
    >
      {carte && (
        <p className="surtitre mb-1" style={{ color: `color-mix(in oklab, ${couleur} 70%, var(--mix-fg))` }}>
          {categorie}
        </p>
      )}
      <p>
        <span className="font-semibold">
          {n} · {a.titre}
        </span>{" "}
        : {formule(a.texte)}
      </p>
      {a.retenir && <p className="font-hand mt-0.5 text-[19px] leading-snug text-accent">→ {a.retenir}</p>}
    </div>
  );
}

function TexteAnnote({ texte, foncee }: { texte: TexteBac; foncee: string }) {
  const categories = categoriesDe(texte);
  const couleur = (cat: string) => categories.find((c) => c.id === cat)?.couleur ?? "var(--copper)";
  const nomCat = (cat: string) => categories.find((c) => c.id === cat)?.nom ?? "";
  const [visibles, setVisibles] = useState(true);
  const [choisi, setChoisi] = useState<number | null>(null);

  const blocs = useMemo(() => numeroter(texte), [texte]);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-line bg-surface px-4 py-2.5 shadow-card">
        <Legende categories={categories} className={visibles ? "" : "opacity-40"} />
        <button
          onClick={() => {
            setVisibles((v) => !v);
            setChoisi(null);
          }}
          aria-pressed={visibles}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-semibold text-muted transition-colors hover:bg-ink/5 hover:text-ink"
        >
          {visibles ? <EyeOff size={15} /> : <Eye size={15} />}
          {visibles ? "Cacher les annotations" : "Afficher les annotations"}
        </button>
      </div>
      {visibles && (
        <p className="mb-1 text-[12.5px] text-muted lg:hidden">Touche un passage en couleur pour lire la remarque.</p>
      )}

      {blocs.map((m, i) => (
        <section key={m.titre}>
          <h3 className="surtitre mb-1 mt-5 flex items-center gap-2.5" style={{ color: foncee }}>
            <span className="min-w-0 leading-snug sm:shrink-0">
              Mouvement {["I", "II", "III", "IV"][i]} · {m.titre}
            </span>
            <span className="hidden h-px min-w-6 flex-1 bg-line sm:block" />
          </h3>
          {m.passages.map(({ passage, premier, lignes }, j) => {
            const ouverte =
              choisi !== null && choisi >= premier && choisi < premier + passage.annotations.length
                ? passage.annotations[choisi - premier]
                : null;
            return (
              <div
                key={j}
                className={`grid gap-x-9 border-t border-line py-3.5 first:border-t-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] ${
                  i === 0 && j === 0 ? "border-t-0" : ""
                }`}
              >
                <div
                  className={`font-display text-[16.5px] leading-[1.85] sm:text-[18px] ${
                    passage.nonEtudie ? "italic opacity-45" : ""
                  } ${passage.chapeau ? "text-center lg:text-left" : ""}`}
                >
                  {lignes.map((ligne, k) => (
                    <p key={k} className={passage.chapeau && k === 0 ? "text-[20px] sm:text-[22px]" : passage.chapeau ? "text-[14.5px] italic" : ""}>
                      {ligne.map((mo, x) => {
                        if (mo.n === undefined || !visibles) return <Fragment key={x}>{mo.t}</Fragment>;
                        const a = passage.annotations[mo.n - premier];
                        const c = couleur(a.cat);
                        return (
                          <Fragment key={x}>
                            <button
                              onClick={() => {
                                setChoisi(choisi === mo.n ? null : mo.n!);
                                const grand = window.matchMedia("(min-width: 1024px)").matches;
                                const cible = grand ? `note-${mo.n}` : "note-ouverte";
                                // Sur téléphone, la remarque s'ouvre sous la strophe : on la fait
                                // remonter au-dessus de la barre d'onglets.
                                setTimeout(
                                  () => document.getElementById(cible)?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
                                  grand ? 0 : 60,
                                );
                              }}
                              aria-label={`${a.extrait} : ${a.titre}`}
                              className="rounded-[5px] px-[3px] py-px text-left transition-shadow"
                              style={{
                                background: fond(c),
                                boxShadow: choisi === mo.n ? `0 0 0 2px ${c}` : undefined,
                                font: "inherit",
                              }}
                            >
                              {mo.t}
                            </button>
                            <sup
                              aria-hidden
                              className="ml-0.5 inline-flex size-[16px] items-center justify-center rounded-full bg-ink align-super font-sans text-[10px] font-semibold not-italic text-bg"
                            >
                              {mo.n}
                            </sup>
                          </Fragment>
                        );
                      })}
                    </p>
                  ))}
                  {passage.nonEtudie && j > 0 && !m.passages[j - 1].passage.nonEtudie && (
                    <p className="font-sans text-[12px] not-italic">Strophes à lire, mais pas à expliquer.</p>
                  )}
                </div>

                {/* Ordinateur : toutes les remarques dans la marge. */}
                <div className="hidden flex-col gap-1.5 lg:flex">
                  {visibles &&
                    passage.annotations.map((a, k) => (
                      <Note key={k} a={a} n={premier + k} couleur={couleur(a.cat)} categorie={nomCat(a.cat)} actif={choisi === premier + k} />
                    ))}
                </div>
                {/* Téléphone : la remarque du passage touché, sous la strophe. */}
                {ouverte && visibles && (
                  <motion.div
                    key={choisi}
                    initial={{ opacity: 0, transform: "translate3d(0, -6px, 0)" }}
                    animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
                    id="note-ouverte"
                    className="mt-2.5 scroll-mb-28 lg:hidden"
                  >
                    <Note a={ouverte} n={choisi!} couleur={couleur(ouverte.cat)} categorie={nomCat(ouverte.cat)} carte />
                  </motion.div>
                )}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

function FicheTexte({ texte, matiere }: { texte: TexteBac; matiere: Matiere }) {
  const foncee = encre(matiere.couleur);
  const categories = categoriesDe(texte);
  const puces = (points: string[]) => (
    <ul className="flex flex-col gap-1.5">
      {points.map((p, i) => (
        <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed">
          <span className="mt-[10px] size-1.5 shrink-0 rounded-full" style={{ background: matiere.couleur }} />
          <span className="min-w-0">{formule(p)}</span>
        </li>
      ))}
    </ul>
  );
  const titre = (t: string) => (
    <h3 className="mb-2 mt-6 font-display text-[20px]" style={{ color: foncee }}>
      {t}
    </h3>
  );
  return (
    <div className="mx-auto max-w-[820px] rounded-[22px] border border-line bg-surface px-5 pb-7 pt-5 shadow-card sm:px-9 sm:pt-7">
      <div className="rounded-2xl px-4 py-3" style={{ background: pastel(matiere.couleur, 13) }}>
        <p className="surtitre" style={{ color: foncee }}>
          Problématique
        </p>
        <p className="mt-1 text-[15.5px] leading-relaxed">{texte.problematique}</p>
      </div>

      {texte.lecture && (
        <p className="mt-4 flex gap-2.5 text-[14px] leading-relaxed text-muted">
          <Mic size={16} className="mt-1 shrink-0" />
          <span>
            <span className="font-semibold text-ink">Lecture (2 points).</span> {texte.lecture}
          </span>
        </p>
      )}

      {titre("Introduction")}
      {puces(texte.introduction)}

      <div className="mt-5 rounded-2xl border border-line px-4 py-3">
        <p className="surtitre text-muted">Annonce du plan</p>
        <ol className="mt-1.5 flex flex-col gap-1 text-[15px]">
          {texte.mouvements.map((m, i) => (
            <li key={m.titre}>
              <span className="font-semibold">{["I", "II", "III", "IV"][i]}.</span> {m.titre}
            </li>
          ))}
        </ol>
      </div>

      {texte.mouvements.map((m, i) => (
        <section key={m.titre}>
          {titre(`${["I", "II", "III", "IV"][i]}. ${m.titre}`)}
          {puces(m.fiche)}
          <p className="surtitre mb-1.5 mt-4 text-muted">Citations et procédés à placer</p>
          <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {m.passages
              .flatMap((p) => p.annotations)
              .filter((a) => a.cat === "figure" || a.cat === "vers")
              .map((a, k) => (
                <li key={k} className="flex items-baseline gap-2 text-[14px] leading-snug">
                  <span
                    className="relative top-[1px] size-2.5 shrink-0 rounded-full"
                    style={{ background: categories.find((c) => c.id === a.cat)?.couleur }}
                  />
                  <span className="min-w-0">
                    <i className="font-display">« {a.extrait} »</i> : {a.titre.toLowerCase()}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      ))}

      {titre("Conclusion")}
      {puces(texte.conclusion)}

      {titre("Question de grammaire")}
      {texte.grammaire ? (
        <div className="text-[15px] leading-relaxed">
          <p className="font-semibold">{formule(texte.grammaire.question)}</p>
          <p className="mt-1">{formule(texte.grammaire.reponse)}</p>
        </div>
      ) : (
        <p className="text-[14px] text-muted">
          Ton prof n&apos;en a pas encore donné pour ce texte. Envoie-la dans le chat quand tu l&apos;auras.
        </p>
      )}
      <Legende categories={categories} className="mt-6 border-t border-line pt-4" />
    </div>
  );
}

/** L'explication cachée : on la dit de tête, passage par passage, puis on coche. */
function JeRecite({ texte, matiere, versFiche }: { texte: TexteBac; matiere: Matiere; versFiche: () => void }) {
  const foncee = encre(matiere.couleur);
  const categories = categoriesDe(texte);
  const etapes = useMemo(
    () =>
      texte.mouvements.flatMap((m, i) =>
        m.passages.filter((p) => !p.nonEtudie && p.annotations.length > 0).map((p) => ({ p, mouvement: `${["I", "II", "III", "IV"][i]} · ${m.titre}` })),
      ),
    [texte],
  );
  const [rang, setRang] = useState(0);
  const [montre, setMontre] = useState(false);
  const [coches, setCoches] = useState<Set<number>>(new Set());
  const [bilan, setBilan] = useState({ dites: 0, total: 0 });
  const etape = etapes[rang];

  const recommencer = () => {
    setRang(0);
    setMontre(false);
    setCoches(new Set());
    setBilan({ dites: 0, total: 0 });
  };

  if (!etape) {
    const pct = bilan.total ? Math.round((bilan.dites / bilan.total) * 100) : 0;
    return (
      <div className="mx-auto max-w-[560px] rounded-[22px] border border-line bg-surface p-7 text-center shadow-card">
        <p className="font-display text-[26px]">Texte terminé</p>
        <p className="mt-1 text-[15px] text-muted">
          Tu as pensé à dire {bilan.dites} idées sur {bilan.total} ({pct} %).
        </p>
        <p className="font-hand mt-2 text-[22px] text-accent">
          {pct >= 80 ? "Tu tiens ton explication." : pct >= 50 ? "Encore un passage et ce sera solide." : "Relis le texte annoté, puis recommence."}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Bouton variante="contour" onClick={versFiche}>
            <BookOpen size={16} /> Texte annoté
          </Bouton>
          <Bouton onClick={recommencer}>
            <RotateCcw size={16} /> Recommencer
          </Bouton>
        </div>
      </div>
    );
  }

  const { p } = etape;
  return (
    <div className="mx-auto max-w-[640px]">
      <p className="surtitre" style={{ color: foncee }}>
        Passage {rang + 1} sur {etapes.length} · {etape.mouvement}
      </p>
      <div className="mb-3 mt-2 h-1.5 overflow-hidden rounded-full bg-accent-soft">
        <div className="copper-bg h-full rounded-full transition-[width] duration-300" style={{ width: `${(rang / etapes.length) * 100}%` }} />
      </div>
      <div
        className={`rounded-[18px] border border-line bg-surface px-5 py-4 font-display text-[17px] leading-[1.75] shadow-card ${p.chapeau ? "text-center" : ""}`}
        style={{ borderTop: `4px solid ${matiere.couleur}` }}
      >
        {p.lignes.map((l, i) => (
          <p key={i} className={p.chapeau && i > 0 ? "text-[14.5px] italic" : ""}>
            {l}
          </p>
        ))}
      </div>

      {!montre ? (
        <>
          <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
            Explique ce passage à voix haute, comme devant l&apos;examinateur : les procédés, puis ce qu&apos;ils
            montrent. {pluriel(p.annotations.length, "idée")} à retrouver.
          </p>
          <Bouton className="mt-3 w-full" onClick={() => setMontre(true)}>
            <Eye size={16} /> J&apos;ai fini : voir ce qu&apos;il fallait dire
          </Bouton>
        </>
      ) : (
        <>
          <p className="mb-1.5 mt-4 text-[14px] text-muted">Coche ce que tu as pensé à dire :</p>
          <ul className="rounded-[18px] border border-line bg-surface px-4 py-1.5 shadow-card">
            {p.annotations.map((a, i) => {
              const coche = coches.has(i);
              const c = categories.find((x) => x.id === a.cat)?.couleur ?? "var(--copper)";
              return (
                <li key={i} className="border-t border-line first:border-t-0">
                  <button
                    role="checkbox"
                    aria-checked={coche}
                    onClick={() =>
                      setCoches((s) => {
                        const n = new Set(s);
                        if (n.has(i)) n.delete(i);
                        else n.add(i);
                        return n;
                      })
                    }
                    className="flex w-full items-start gap-3 py-2.5 text-left"
                  >
                    <span
                      className={`mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-[7px] border-2 transition-colors ${
                        coche ? "border-ok bg-ok text-bg" : "border-line"
                      }`}
                    >
                      {coche && <Check size={14} strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 text-[14.5px] leading-relaxed">
                      <span className="rounded-[5px] px-1 font-display" style={{ background: fond(c) }}>
                        {a.extrait}
                      </span>{" "}
                      <span className="font-semibold">{a.titre}</span> : {formule(a.texte)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <Bouton
            className="mt-3 w-full"
            onClick={() => {
              setBilan((b) => ({ dites: b.dites + coches.size, total: b.total + p.annotations.length }));
              setCoches(new Set());
              setMontre(false);
              setRang((r) => r + 1);
            }}
          >
            {rang + 1 < etapes.length ? "Passage suivant" : "Voir mon bilan"} · {coches.size}/{p.annotations.length}
          </Bouton>
        </>
      )}
    </div>
  );
}
