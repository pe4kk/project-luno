"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  GitBranch,
  Lock,
  MapPin,
  Quote,
  RotateCcw,
  Search,
  Users,
  X,
} from "lucide-react";
import { formule } from "@/components/Formule";
import { Curseur } from "@/components/Curseur";
import { Bouton, Fenetre, ZoneAction, classeSaisie } from "@/components/ui";
import {
  ROMAINS,
  adressesAu,
  habitants,
  liensDe,
  questionsQuiz,
  type Famille,
  type Logement,
  type Noeud,
  type Oeuvre,
  type Personnage,
  type QuestionQuiz,
} from "@/lib/oeuvre";
import { lienTravail } from "@/lib/liens";
import { encre, pastel } from "@/lib/store";
import type { Matiere } from "@/lib/types";

type Vue = "immeuble" | "familles" | "personnages" | "chapitres" | "quiz";
const VUES: { id: Vue; label: string; Icone: typeof Building2 }[] = [
  { id: "immeuble", label: "Immeuble", Icone: Building2 },
  { id: "familles", label: "Familles", Icone: GitBranch },
  { id: "personnages", label: "Personnages", Icone: Users },
  { id: "chapitres", label: "Chapitres", Icone: BookOpen },
  { id: "quiz", label: "Quiz", Icone: CircleHelp },
];

/** Contexte partagé par les vues : l'œuvre et l'ouverture d'une fiche. */
type Ctx = { o: Oeuvre; ouvrir: (id: string) => void; couleur: (p: Personnage) => string };

/**
 * Une œuvre intégrale (roman) à explorer : l'immeuble étage par étage, les arbres des
 * familles, les fiches des personnages, les résumés des chapitres et un quiz. Rien
 * au-delà du chapitre que l'élève a lu (`luJusqua`).
 */
export function VueOeuvre({
  matiere,
  oeuvre: o,
  vue: vueBrute,
  perso,
}: {
  matiere: Matiere;
  oeuvre: Oeuvre;
  vue: string | null;
  perso: string | null;
}) {
  const router = useRouter();
  const vue: Vue = VUES.some((v) => v.id === vueBrute) ? (vueBrute as Vue) : "immeuble";
  const foncee = encre(matiere.couleur);
  // Une fiche ouverte depuis l'écran ajoute une entrée d'historique : le geste retour la ferme.
  const ouverteIci = useRef(false);

  const lien = (v: Vue, p?: string | null) =>
    lienTravail({ m: matiere.id, o: "bac", t: o.id, v: v === "immeuble" ? undefined : v, p: p ?? undefined });
  const aller = (v: Vue) => router.replace(lien(v), { scroll: false });
  const ouvrir = (id: string) => {
    if (perso) router.replace(lien(vue, id), { scroll: false });
    else {
      ouverteIci.current = true;
      router.push(lien(vue, id), { scroll: false });
    }
  };
  const fermer = () => {
    if (ouverteIci.current) {
      ouverteIci.current = false;
      router.back();
    } else router.replace(lien(vue), { scroll: false });
  };

  const couleurs = useMemo(() => new Map(o.familles.map((f) => [f.id, f.couleur])), [o]);
  const ctx: Ctx = { o, ouvrir, couleur: (p) => couleurs.get(p.famille) ?? "#8a8a8f" };
  const fiche = o.personnages.find((p) => p.id === perso);

  return (
    <div>
      <Link
        href={lienTravail({ m: matiere.id, o: "bac" })}
        scroll={false}
        className="-ml-1 mb-2 inline-flex min-h-11 items-center gap-1.5 px-1 text-[14px] font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> Bac · Le roman
      </Link>
      <div className="mb-4">
        <p className="surtitre" style={{ color: foncee }}>
          Œuvre intégrale · {o.auteur} · {o.date}
        </p>
        <h2 className="mt-1 text-[30px] leading-tight sm:text-[38px]">{o.titre}</h2>
        <p className="mt-1 max-w-[720px] text-[14px] leading-relaxed text-muted">{o.presentation}</p>
        {o.luJusqua < o.chapitres && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-[12.5px] font-medium text-ink">
            <Lock size={13} /> Rien après le chapitre {ROMAINS[o.luJusqua]} : la fin est cachée tant que tu ne l&apos;as pas lue
          </p>
        )}
      </div>

      <div role="tablist" aria-label="Explorer l'œuvre" className="mb-5 grid grid-cols-5 gap-1 rounded-[18px] border border-line bg-surface p-1 shadow-card">
        {VUES.map(({ id, label, Icone }) => (
          <button
            key={id}
            role="tab"
            aria-selected={vue === id}
            onClick={() => aller(id)}
            className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 rounded-[14px] px-0.5 text-[11px] font-semibold transition-colors duration-200 min-[400px]:text-[12px] sm:flex-row sm:gap-1.5 sm:text-[14px] ${
              vue === id ? "bg-ink text-bg" : "text-muted hover:text-ink"
            }`}
          >
            <Icone size={17} className="shrink-0" />
            <span className="max-w-full truncate">
              {id === "personnages" ? (
                <>
                  <span className="max-[479px]:hidden">{label}</span>
                  <span className="min-[480px]:hidden">Persos</span>
                </>
              ) : (
                label
              )}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={vue}
          initial={{ opacity: 0, transform: "translate3d(0, 10px, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {vue === "immeuble" && <Immeuble ctx={ctx} />}
          {vue === "familles" && <Familles ctx={ctx} />}
          {vue === "personnages" && <Personnages ctx={ctx} />}
          {vue === "chapitres" && <Chapitres ctx={ctx} />}
          {vue === "quiz" && <Quiz ctx={ctx} />}
        </motion.div>
      </AnimatePresence>

      <Fenetre ouverte={!!fiche} fermer={fermer} titre={fiche?.nom ?? ""}>
        {fiche && <FichePersonnage ctx={ctx} p={fiche} />}
      </Fenetre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Petits éléments communs
// ---------------------------------------------------------------------------

/** Étiquette d'un personnage, à la couleur de sa famille ; ouvre sa fiche. */
function Pastille({ ctx, id, petit = false }: { ctx: Ctx; id: string; petit?: boolean }) {
  const p = ctx.o.personnages.find((x) => x.id === id);
  if (!p) return null;
  const c = ctx.couleur(p);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        ctx.ouvrir(p.id);
      }}
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full font-medium transition-transform active:scale-95 ${
        petit ? "min-h-7 px-2 text-[12px]" : "min-h-9 px-2.5 text-[13.5px]"
      }`}
      style={{ background: pastel(c, 20), color: encre(c, 75) }}
    >
      <span className="size-2 shrink-0 rounded-full" style={{ background: c }} />
      <span className="truncate">{p.court}</span>
    </button>
  );
}

const nomChapitre = (n: number) => `chap. ${ROMAINS[n]}`;

function periode(de?: number, a?: number, max = 99): string {
  if (de && a) return de === a ? `au ${nomChapitre(de)}` : `du ${nomChapitre(de)} au ${nomChapitre(a)}`;
  if (de) return `à partir du ${nomChapitre(de)}`;
  if (a && a < max) return `jusqu’au ${nomChapitre(a)}`;
  return "";
}

// ---------------------------------------------------------------------------
// L'immeuble
// ---------------------------------------------------------------------------

function Immeuble({ ctx }: { ctx: Ctx }) {
  const { o } = ctx;
  const [ch, setCh] = useState(o.luJusqua);
  const [sel, setSel] = useState<string>("4-cour");
  const logement = o.logements.find((l) => l.id === sel)!;
  const resume = o.resumes.find((r) => r.n === ch);
  const lieu = (id: string) => o.logements.find((l) => l.id === id)!;

  const detail = useRef<HTMLDivElement>(null);
  const choisir = (id: string) => {
    setSel(id);
    // Sur téléphone, le détail est sous la façade : on le montre.
    if (window.innerWidth < 1024)
      requestAnimationFrame(() => detail.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:items-start">
      <div className="min-w-0">
        <div className="mb-4 rounded-[18px] border border-line bg-surface p-4 shadow-card">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-display text-[19px]">Au chapitre {ROMAINS[ch]}</p>
            <p className="truncate text-[12.5px] text-muted">{resume?.titre}</p>
          </div>
          <Curseur
            className="mt-2"
            min={1}
            max={o.luJusqua}
            value={ch}
            onChange={setCh}
            label="Chapitre"
            valueText={`Chapitre ${ROMAINS[ch]}`}
          />
          <p className="mt-1 text-[12.5px] leading-snug text-muted">
            Fais glisser : les habitants changent au fil du roman (mariage de Berthe, Gasparine qui s&apos;installe, mort du
            vieux Vabre…).
          </p>
        </div>
        <Facade ctx={ctx} ch={ch} sel={sel} choisir={choisir} />
      </div>

      <div ref={detail} className="scroll-mt-24 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={sel + ch}
            initial={{ opacity: 0, transform: "translate3d(0, 8px, 0)" }}
            animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            <DetailLogement ctx={ctx} l={logement} ch={ch} lieu={lieu} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="min-w-0 rounded-[18px] border border-line bg-surface p-5 shadow-card lg:col-start-1">
        <p className="surtitre text-accent">Le décor</p>
        <ul className="mt-2 space-y-2.5">
          {o.decor.map((d) => (
            <li key={d} className="flex gap-2.5 text-[14.5px] leading-relaxed">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>{formule(d)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** La façade en coupe : deux appartements par étage, l'escalier au milieu. */
function Facade({ ctx, ch, sel, choisir }: { ctx: Ctx; ch: number; sel: string; choisir: (id: string) => void }) {
  const etages: { n: string; rue: string; cour: string; tapis: boolean }[] = [
    { n: "4e", rue: "4-rue", cour: "4-cour", tapis: false },
    { n: "3e", rue: "3-rue", cour: "3-cour", tapis: true },
    { n: "2e", rue: "2-rue", cour: "2-cour", tapis: true },
    { n: "1er", rue: "1-rue", cour: "1-cour", tapis: true },
  ];
  return (
    <div className="rounded-[22px] border border-line bg-surface p-3 shadow-card sm:p-4">
      <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted sm:text-[12px]">
        <span className="w-7 shrink-0 sm:w-9" />
        <span className="flex-1 text-center">Sur la rue</span>
        <span className="w-5 shrink-0 sm:w-7" />
        <span className="flex-1 text-center">Sur la cour</span>
      </div>

      {/* Toit et étage des bonnes */}
      <div className="flex items-stretch gap-1.5 sm:gap-2">
        <span className="flex w-7 shrink-0 items-center justify-center font-display text-[13px] text-muted sm:w-9">5e</span>
        <Case ctx={ctx} id="combles" ch={ch} sel={sel} choisir={choisir} toit />
      </div>

      {etages.map((e) => (
        <div key={e.n} className="mt-1.5 flex items-stretch gap-1.5 sm:mt-2 sm:gap-2">
          <span className="flex w-7 shrink-0 items-center justify-center font-display text-[13px] text-muted sm:w-9">{e.n}</span>
          <Case ctx={ctx} id={e.rue} ch={ch} sel={sel} choisir={choisir} />
          <Escalier tapis={e.tapis} label={e.tapis ? "tapis rouge" : "toile grise"} />
          <Case ctx={ctx} id={e.cour} ch={ch} sel={sel} choisir={choisir} />
        </div>
      ))}

      <div className="mt-1.5 flex items-stretch gap-1.5 sm:mt-2 sm:gap-2">
        <span className="flex w-7 shrink-0 items-center justify-center text-center font-display text-[11px] leading-tight text-muted sm:w-9">
          Entre-sol
        </span>
        <Case ctx={ctx} id="entresol" ch={ch} sel={sel} choisir={choisir} />
      </div>
      <div className="mt-1.5 flex items-stretch gap-1.5 border-t-4 pt-1.5 sm:mt-2 sm:gap-2 sm:pt-2" style={{ borderColor: "var(--ink)" }}>
        <span className="flex w-7 shrink-0 items-center justify-center font-display text-[12px] text-muted sm:w-9">RDC</span>
        <Case ctx={ctx} id="rdc" ch={ch} sel={sel} choisir={choisir} />
        <Escalier tapis label="vestibule" />
        <Case ctx={ctx} id="loge" ch={ch} sel={sel} choisir={choisir} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[11.5px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-1.5 rounded-full bg-accent" /> grand escalier, tapis rouge
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-1.5 rounded-full" style={{ background: "color-mix(in oklab, var(--muted) 45%, var(--surface))" }} /> toile
          grise après le 3e
        </span>
      </div>

      <button
        type="button"
        onClick={() => choisir("dehors")}
        className={`mt-3 flex min-h-12 w-full items-center gap-2 rounded-[14px] border border-dashed px-3 text-left text-[13.5px] font-semibold transition-colors ${
          sel === "dehors" ? "border-accent bg-accent-soft text-ink" : "border-line text-muted hover:text-ink"
        }`}
      >
        <MapPin size={16} /> Hors de l&apos;immeuble : Bachelard, Trublot, Mme Hédouin…
      </button>
    </div>
  );
}

/** La cage d'escalier entre les deux appartements : tapis rouge jusqu'au 3e, toile grise ensuite. */
function Escalier({ tapis, label }: { tapis: boolean; label?: string }) {
  return (
    <div className="relative flex w-5 shrink-0 justify-center sm:w-7" aria-hidden>
      <span
        className="h-full w-1.5 rounded-full sm:w-2"
        style={{ background: tapis ? "var(--accent)" : "color-mix(in oklab, var(--muted) 45%, var(--surface))" }}
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}

/** Ce qu'on écrit dans une case sans habitant connu. */
const VIDES: Record<string, string> = { rdc: "la soierie d’Auguste", entresol: "vide depuis le mariage d’Auguste" };

/** Un appartement de la façade : ses habitants au chapitre choisi. */
function Case({
  ctx,
  id,
  ch,
  sel,
  choisir,
  toit = false,
}: {
  ctx: Ctx;
  id: string;
  ch: number;
  sel: string;
  choisir: (id: string) => void;
  toit?: boolean;
}) {
  const gens = habitants(ctx.o, id, ch).filter((p) => p.importance <= 2);
  const actif = sel === id;
  const vide = gens.length === 0;
  const visibles = gens.slice(0, toit ? 6 : 3);
  return (
    <button
      type="button"
      onClick={() => choisir(id)}
      aria-pressed={actif}
      aria-label={`${ctx.o.logements.find((l) => l.id === id)?.nom} : ${gens.map((g) => g.court).join(", ") || "personne"}`}
      className={`min-h-[64px] min-w-0 flex-1 rounded-[12px] border p-1.5 text-left transition-[background-color,border-color,box-shadow] duration-200 sm:min-h-[76px] sm:p-2 ${
        toit ? "rounded-t-[26px]" : ""
      } ${actif ? "border-accent shadow-[0_0_0_2px_var(--accent)]" : "border-line hover:border-accent/50"}`}
      style={{ background: actif ? "var(--accent-soft)" : vide ? "transparent" : "color-mix(in oklab, var(--bg) 70%, var(--surface))" }}
    >
      {vide ? (
        <span className="block text-[11.5px] italic text-muted">{VIDES[id] ?? "—"}</span>
      ) : (
        <span className="flex flex-wrap gap-1">
          {visibles.map((p) => {
            const c = ctx.couleur(p);
            return (
              <span
                key={p.id}
                className="inline-flex max-w-full items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-tight sm:text-[12.5px]"
                style={{ background: pastel(c, 22), color: encre(c, 75) }}
              >
                <span className="truncate">{p.court}</span>
              </span>
            );
          })}
          {gens.length > visibles.length && (
            <span className="px-1 text-[11px] font-semibold text-muted">+{gens.length - visibles.length}</span>
          )}
        </span>
      )}
    </button>
  );
}

function DetailLogement({ ctx, l, ch, lieu }: { ctx: Ctx; l: Logement; ch: number; lieu: (id: string) => Logement }) {
  const { o } = ctx;
  const gens = habitants(o, l.id, ch);
  // Ceux qui y ont vécu à un autre moment (avant ou après, jusqu'au chapitre lu).
  const passes = o.personnages.filter(
    (p) => !gens.includes(p) && p.adresses.some((a) => a.lieu === l.id && (a.de ?? 1) <= o.luJusqua),
  );
  return (
    <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
      <p className="surtitre text-accent">{l.id === "dehors" ? "Ailleurs dans Paris" : `Chapitre ${ROMAINS[ch]}`}</p>
      <h3 className="mt-1 text-[22px] leading-snug">{l.nom}</h3>
      {l.detail && <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{l.detail}</p>}
      {gens.length === 0 ? (
        <p className="mt-4 text-[14px] text-muted">Personne de connu ici à ce moment.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {gens.map((p) => {
            const a = adressesAu(p, ch).find((x) => x.lieu === l.id);
            const c = ctx.couleur(p);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => ctx.ouvrir(p.id)}
                  className="flex w-full items-start gap-3 rounded-[14px] border border-line p-3 text-left transition-colors hover:border-accent/60"
                >
                  <span className="mt-1.5 size-2.5 shrink-0 rounded-full" style={{ background: c }} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold leading-snug">{p.nom}</span>
                    <span className="block text-[13px] leading-snug text-muted">{p.role}</span>
                    {(a?.note || p.ailleurs) && (
                      <span className="mt-1 block text-[12.5px] italic leading-snug" style={{ color: encre(c, 70) }}>
                        {a?.note ?? p.ailleurs}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {passes.length > 0 && (
        <div className="mt-4 border-t border-line pt-3">
          <p className="text-[12.5px] font-semibold text-muted">À un autre moment du roman</p>
          <ul className="mt-1.5 space-y-1.5">
            {passes.map((p) => {
              const a = p.adresses.find((x) => x.lieu === l.id)!;
              return (
                <li key={p.id} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px]">
                  <Pastille ctx={ctx} id={p.id} petit />
                  <span className="text-muted">{periode(a.de, a.a, o.luJusqua)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {l.id !== "dehors" && (
        <p className="mt-4 text-[12px] text-muted">
          Touche un appartement de la façade pour voir qui y vit. Touche un nom pour sa fiche.
        </p>
      )}
      {l.id === "dehors" && <span className="sr-only">{lieu("dehors").nom}</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Les familles
// ---------------------------------------------------------------------------

function Familles({ ctx }: { ctx: Ctx }) {
  const { o } = ctx;
  const liaisons = o.liens.filter((l) => l.type === "liaison" && (l.ch ?? 1) <= o.luJusqua);
  const service = o.liens.filter((l) => l.type === "travail" && (l.ch ?? 1) <= o.luJusqua);
  return (
    <div className="space-y-5">
      {o.familles
        .filter((f) => f.arbre)
        .map((f) => (
          <ArbreFamille key={f.id} ctx={ctx} f={f} />
        ))}

      <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
        <p className="surtitre text-accent">Hors mariage</p>
        <h3 className="mt-1 text-[21px]">Amants et maîtresses</h3>
        <p className="mt-1 text-[13.5px] text-muted">
          Le cœur du roman : derrière les portes d&apos;acajou, presque chaque ménage a sa liaison.
        </p>
        <ul className="mt-3 divide-y divide-line">
          {liaisons.map((l) => (
            <LigneLien key={l.de + l.a} ctx={ctx} de={l.de} a={l.a} libelle={l.libelle} ch={l.ch} />
          ))}
        </ul>
      </div>

      <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
        <p className="surtitre text-accent">Le service</p>
        <h3 className="mt-1 text-[21px]">Qui sert qui</h3>
        <ul className="mt-3 divide-y divide-line">
          {service.map((l) => (
            <LigneLien key={l.de + l.a} ctx={ctx} de={l.de} a={l.a} libelle={l.libelle} ch={l.ch} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function LigneLien({ ctx, de, a, libelle, ch }: { ctx: Ctx; de: string; a: string; libelle: string; ch?: number }) {
  return (
    <li className="flex flex-wrap items-center gap-x-2 gap-y-1 py-2 text-[13.5px]">
      <Pastille ctx={ctx} id={de} petit />
      <span className="text-muted">{libelle} de</span>
      <Pastille ctx={ctx} id={a} petit />
      {ch && ch > 1 && <span className="ml-auto text-[12px] text-muted">dès le {nomChapitre(ch)}</span>}
    </li>
  );
}

function ArbreFamille({ ctx, f }: { ctx: Ctx; f: Famille }) {
  return (
    <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center gap-2">
        <span className="size-3 rounded-full" style={{ background: f.couleur }} />
        <h3 className="text-[21px]">{f.nom}</h3>
      </div>
      <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{f.resume}</p>
      {/* L'arbre défile dans sa carte : jamais la page entière (sinon le téléphone dézoome). */}
      <div className="-mx-5 mt-4 overflow-x-auto px-5 pb-2" data-defile>
        <div className="w-max">
          <Branche ctx={ctx} n={f.arbre!} couleur={f.couleur} />
        </div>
      </div>
    </div>
  );
}

/** Un nœud et ses enfants à droite, reliés par des traits (arbre horizontal). */
function Branche({ ctx, n, couleur }: { ctx: Ctx; n: Noeud; couleur: string }) {
  const trait = "color-mix(in oklab, var(--muted) 45%, var(--surface))";
  return (
    <div className="flex items-center">
      <NoeudCarte ctx={ctx} n={n} couleur={couleur} />
      {n.enfants && n.enfants.length > 0 && (
        <>
          <span className="h-px w-4 shrink-0" style={{ background: trait }} />
          <div className="flex flex-col">
            {n.enfants.map((e, i) => {
              const premier = i === 0;
              const dernier = i === n.enfants!.length - 1;
              return (
                <div key={e.id} className="relative flex items-center py-1 pl-4">
                  {/* Trait vertical : moitié haute sauf pour le premier, moitié basse sauf pour le dernier. */}
                  {!premier && <span className="absolute left-0 top-0 h-1/2 w-px" style={{ background: trait }} />}
                  {!dernier && <span className="absolute bottom-0 left-0 h-1/2 w-px" style={{ background: trait }} />}
                  <span className="absolute left-0 top-1/2 h-px w-4" style={{ background: trait }} />
                  <Branche ctx={ctx} n={e} couleur={couleur} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function NoeudCarte({ ctx, n, couleur }: { ctx: Ctx; n: Noeud; couleur: string }) {
  const p = ctx.o.personnages.find((x) => x.id === n.id);
  const conjoint = n.conjoint ? ctx.o.personnages.find((x) => x.id === n.conjoint) : undefined;
  if (!p) return null;
  return (
    <div className="w-[118px] shrink-0 rounded-[14px] border p-2 sm:w-[170px]" style={{ borderColor: pastel(couleur, 55), background: pastel(couleur, 10) }}>
      <button type="button" onClick={() => ctx.ouvrir(p.id)} className="block w-full text-left">
        <span className="block text-[14px] font-semibold leading-tight">{p.court}</span>
        {n.note && <span className="block text-[11.5px] leading-tight text-muted">{n.note}</span>}
      </button>
      {conjoint && (
        <button
          type="button"
          onClick={() => ctx.ouvrir(conjoint.id)}
          className="mt-1.5 flex w-full items-center gap-1 border-t pt-1.5 text-left text-[12.5px] leading-tight"
          style={{ borderColor: pastel(couleur, 40) }}
        >
          <span className="text-muted">∞</span>
          <span className="font-medium" style={{ color: encre(ctx.couleur(conjoint), 75) }}>
            {conjoint.court}
          </span>
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Les personnages
// ---------------------------------------------------------------------------

function sansAccents(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function Personnages({ ctx }: { ctx: Ctx }) {
  const { o } = ctx;
  const [niveau, setNiveau] = useState<1 | 2 | 3>(2);
  const [q, setQ] = useState("");
  const recherche = sansAccents(q.trim());
  const liste = o.personnages.filter(
    (p) =>
      (recherche ? true : p.importance <= niveau) &&
      (!recherche || sansAccents(`${p.nom} ${p.role} ${p.metier ?? ""}`).includes(recherche)),
  );
  const nb = (n: number) => o.personnages.filter((p) => p.importance <= n).length;
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div role="tablist" aria-label="Personnages à afficher" className="inline-flex rounded-full border border-line bg-surface p-1 shadow-card">
          {(
            [
              [1, "L’essentiel"],
              [2, "À connaître"],
              [3, "Tous"],
            ] as const
          ).map(([n, label]) => (
            <button
              key={n}
              role="tab"
              aria-selected={niveau === n}
              onClick={() => setNiveau(n)}
              className={`min-h-9 whitespace-nowrap rounded-full px-3 text-[13px] font-semibold transition-colors ${
                niveau === n ? "bg-ink text-bg" : "text-muted hover:text-ink"
              }`}
            >
              {label} <span className="opacity-70">{nb(n)}</span>
            </button>
          ))}
        </div>
        <label className="relative min-w-[180px] flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Chercher un nom, un métier…"
            className={`${classeSaisie} pl-9`}
            aria-label="Chercher un personnage"
          />
        </label>
      </div>

      {o.familles.map((f) => {
        const membres = liste.filter((p) => p.famille === f.id);
        if (membres.length === 0) return null;
        return (
          <section key={f.id} className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ background: f.couleur }} />
              <h3 className="text-[18px]">{f.nom}</h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {membres.map((p) => {
                const l = o.logements.find((x) => x.id === adressesAu(p, o.luJusqua).at(-1)?.lieu);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => ctx.ouvrir(p.id)}
                    className="rounded-[14px] border border-line bg-surface p-3 text-left shadow-card transition-colors hover:border-accent/60"
                  >
                    <span className="block text-[15px] font-semibold leading-snug">{p.nom}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">{p.role}</span>
                    {l && l.id !== "dehors" && (
                      <span className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium" style={{ color: encre(f.couleur, 70) }}>
                        <Building2 size={12} /> {l.nom}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
      {liste.length === 0 && <p className="text-[14px] text-muted">Personne ne correspond à « {q} ».</p>}
    </div>
  );
}

function FichePersonnage({ ctx, p }: { ctx: Ctx; p: Personnage }) {
  const { o } = ctx;
  const c = ctx.couleur(p);
  const famille = o.familles.find((f) => f.id === p.famille);
  const liens = liensDe(o, p.id, o.luJusqua);
  const faits = p.faits.filter((f) => f.ch <= o.luJusqua);
  const adresses = p.adresses.filter((a) => (a.de ?? 1) <= o.luJusqua);
  return (
    <div className="space-y-4">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ background: pastel(c, 22), color: encre(c, 75) }}>
          <span className="size-2 rounded-full" style={{ background: c }} />
          {famille?.nom}
        </span>
        <p className="mt-2 text-[15.5px] leading-relaxed">{p.role}.</p>
        {(p.age || p.metier) && (
          <p className="mt-1 text-[13px] text-muted">{[p.age, p.metier].filter(Boolean).join(" · ")}</p>
        )}
      </div>

      <div>
        <p className="surtitre text-accent">Où le trouver</p>
        <ul className="mt-1.5 space-y-1">
          {adresses.map((a, i) => {
            const l = o.logements.find((x) => x.id === a.lieu);
            return (
              <li key={i} className="flex gap-2 text-[14px] leading-snug">
                <Building2 size={15} className="mt-0.5 shrink-0 text-muted" />
                <span>
                  {a.lieu === "dehors" ? p.ailleurs ?? "Hors de l’immeuble" : l?.nom}
                  {periode(a.de, a.a, o.luJusqua) && <span className="text-muted"> · {periode(a.de, a.a, o.luJusqua)}</span>}
                  {a.note && <span className="block text-[12.5px] italic text-muted">{a.note}</span>}
                </span>
              </li>
            );
          })}
          {adresses.length === 0 && p.ailleurs && <li className="text-[14px] text-muted">{p.ailleurs}</li>}
        </ul>
      </div>

      {liens.length > 0 && (
        <div>
          <p className="surtitre text-accent">Ses liens</p>
          <ul className="mt-1.5 space-y-1.5">
            {liens.map(({ lien, autre }) => (
              <li key={lien.de + lien.a} className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13.5px]">
                {lien.de === p.id ? (
                  <>
                    <span className="text-muted">{lien.libelle.charAt(0).toUpperCase() + lien.libelle.slice(1)} de</span>
                    <Pastille ctx={ctx} id={autre} petit />
                  </>
                ) : (
                  <>
                    <Pastille ctx={ctx} id={autre} petit />
                    <span className="text-muted">est {lien.libelle}</span>
                  </>
                )}
                {lien.type === "liaison" && <span className="text-[11.5px] font-semibold text-accent">liaison</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="surtitre text-accent">Son caractère</p>
        <ul className="mt-1.5 space-y-1.5">
          {p.traits.map((t) => (
            <li key={t} className="flex gap-2 text-[14px] leading-snug">
              <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: c }} />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {faits.length > 0 && (
        <div>
          <p className="surtitre text-accent">Ce qu&apos;il fait</p>
          <ol className="mt-1.5 space-y-2">
            {faits.map((f) => (
              <li key={f.ch + f.t} className="flex gap-2.5 text-[14px] leading-snug">
                <span className="mt-0.5 w-9 shrink-0 rounded-md bg-accent-soft py-0.5 text-center font-display text-[12px] text-accent">
                  {ROMAINS[f.ch]}
                </span>
                <span>{f.t}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {p.citation && p.citation.ch <= o.luJusqua && (
        <figure className="rounded-[14px] p-3.5" style={{ background: pastel(c, 12) }}>
          <Quote size={16} className="text-muted" />
          <blockquote className="mt-1 font-display text-[17px] italic leading-snug">« {p.citation.texte} »</blockquote>
          <figcaption className="mt-1 text-[12.5px] text-muted">
            Chapitre {ROMAINS[p.citation.ch]}
            {p.citation.contexte ? `, ${p.citation.contexte}` : ""}
          </figcaption>
        </figure>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Les chapitres
// ---------------------------------------------------------------------------

function Chapitres({ ctx }: { ctx: Ctx }) {
  const { o } = ctx;
  const [ouvert, setOuvert] = useState<number | null>(null);
  return (
    <div className="mx-auto max-w-[820px]">
      <ol className="space-y-2">
        {o.resumes.map((r) => {
          const actif = ouvert === r.n;
          return (
            <li key={r.n} className="rounded-[18px] border border-line bg-surface shadow-card">
              <button
                type="button"
                aria-expanded={actif}
                onClick={() => setOuvert(actif ? null : r.n)}
                className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-accent-soft font-display text-[15px] text-accent">
                  {ROMAINS[r.n]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15.5px] font-semibold leading-snug">{r.titre}</span>
                  <span className="block text-[12.5px] text-muted">{r.moment}</span>
                </span>
                <ChevronDown size={18} className={`shrink-0 text-muted transition-transform duration-200 ${actif ? "rotate-180" : ""}`} />
              </button>
              <div className="repli" data-ouvert={actif}>
                <div>
                  <div className="px-4 pb-4">
                    <ul className="space-y-2">
                      {r.resume.map((t) => (
                        <li key={t} className="flex gap-2.5 text-[14.5px] leading-relaxed">
                          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{formule(t)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {r.personnages.map((id) => (
                        <Pastille key={id} ctx={ctx} id={id} petit />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
        {Array.from({ length: o.chapitres - o.luJusqua }, (_, i) => o.luJusqua + i + 1).map((n) => (
          <li key={n} className="flex min-h-14 items-center gap-3 rounded-[18px] border border-dashed border-line px-4 py-3 text-muted">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-ink/5">
              <Lock size={15} />
            </span>
            <span className="text-[14px]">
              Chapitre {ROMAINS[n]} : caché tant que tu ne l&apos;as pas lu. Dis à Claude quand tu as fini le livre.
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Le quiz « Qui est-ce ? »
// ---------------------------------------------------------------------------

const PAR_MANCHE = 12;

function Quiz({ ctx }: { ctx: Ctx }) {
  const { o } = ctx;
  const [niveau, setNiveau] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<QuestionQuiz[] | null>(null);
  const [i, setI] = useState(0);
  const [choisi, setChoisi] = useState<number | null>(null);
  const [score, setScore] = useState({ justes: 0, total: 0 });
  const [ratees, setRatees] = useState<QuestionQuiz[]>([]);

  const commencer = (n = niveau) => {
    const toutes = questionsQuiz(o, n, Date.now());
    // Varier les types : on prend à tour de rôle « qui », « où », « lien », « citation ».
    const parType = new Map<string, QuestionQuiz[]>();
    for (const q of toutes) parType.set(q.type, [...(parType.get(q.type) ?? []), q]);
    const ordre = ["ou", "qui", "lien", "ou", "citation", "qui", "lien"];
    const pris: QuestionQuiz[] = [];
    for (let k = 0; pris.length < PAR_MANCHE && k < 200; k++) {
      const q = parType.get(ordre[k % ordre.length])?.shift();
      if (q && !pris.some((x) => x.question === q.question)) pris.push(q);
    }
    setFile(pris);
    setI(0);
    setChoisi(null);
    setScore({ justes: 0, total: 0 });
    setRatees([]);
  };

  if (!file) {
    return (
      <div className="mx-auto max-w-[620px] rounded-[18px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <p className="surtitre text-accent">Qui est-ce ?</p>
        <h3 className="mt-1 text-[24px]">Teste-toi sur les personnages</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">
          {PAR_MANCHE} questions en QCM, comme à l&apos;éval : qui habite où, qui est parent de qui, qui a dit quoi, de qui
          parle-t-on. Une question ratée revient plus loin.
        </p>
        <div className="mt-4 grid gap-2">
          {(
            [
              [1, "L’essentiel", "Les personnages indispensables"],
              [2, "À connaître", "Avec les personnages secondaires"],
              [3, "Tout le monde", "Jusqu’aux bonnes et aux locataires de passage"],
            ] as const
          ).map(([n, titre, detail]) => (
            <button
              key={n}
              type="button"
              onClick={() => setNiveau(n)}
              aria-pressed={niveau === n}
              className={`flex min-h-14 items-center gap-3 rounded-[14px] border px-4 py-2.5 text-left transition-colors ${
                niveau === n ? "border-accent bg-accent-soft" : "border-line hover:border-accent/50"
              }`}
            >
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${niveau === n ? "border-accent bg-accent" : "border-line"}`}>
                {niveau === n && <Check size={12} className="text-on-accent" strokeWidth={3} />}
              </span>
              <span>
                <span className="block text-[15px] font-semibold">{titre}</span>
                <span className="block text-[12.5px] text-muted">{detail}</span>
              </span>
            </button>
          ))}
        </div>
        <ZoneAction cle="quiz-debut" className="mt-5">
          <Bouton onClick={() => commencer()} className="w-full sm:w-auto">
            Commencer
          </Bouton>
        </ZoneAction>
      </div>
    );
  }

  if (i >= file.length) {
    const pct = score.total ? Math.round((score.justes / score.total) * 100) : 0;
    return (
      <div className="mx-auto max-w-[620px] rounded-[18px] border border-line bg-surface p-5 text-center shadow-card sm:p-6">
        <p className="surtitre text-accent">Bilan</p>
        <p className="mt-2 font-display text-[44px] leading-none">
          {score.justes}
          <span className="text-[22px] text-muted"> / {score.total}</span>
        </p>
        <p className="mt-2 text-[14.5px] text-muted">
          {pct >= 85 ? "Tu connais la maison par cœur." : pct >= 60 ? "Bien : relis les fiches des personnages ratés." : "Repasse par l’immeuble et les familles, puis recommence."}
        </p>
        {ratees.length > 0 && (
          <div className="mt-4 text-left">
            <p className="text-[13px] font-semibold text-muted">À revoir</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {[...new Set(ratees.map((q) => q.personnage))].map((id) => (
                <Pastille key={id} ctx={ctx} id={id} petit />
              ))}
            </div>
          </div>
        )}
        <ZoneAction cle="quiz-fin" className="mt-5 flex flex-wrap justify-center gap-2">
          <Bouton onClick={() => commencer()}>
            <RotateCcw size={16} /> Nouvelle manche
          </Bouton>
          <Bouton variante="contour" onClick={() => setFile(null)}>
            Changer de niveau
          </Bouton>
        </ZoneAction>
      </div>
    );
  }

  const q = file[i];
  const repondu = choisi !== null;
  const juste = choisi === q.bonne;
  const repondre = (k: number) => {
    if (repondu) return;
    setChoisi(k);
    setScore((s) => ({ justes: s.justes + (k === q.bonne ? 1 : 0), total: s.total + 1 }));
    if (k !== q.bonne) {
      setRatees((r) => [...r, q]);
      // La question ratée revient trois questions plus loin, une seule fois.
      if (!file.slice(i + 1).includes(q)) {
        const f = [...file];
        f.splice(Math.min(i + 4, f.length), 0, q);
        setFile(f);
      }
    }
  };
  const suivante = () => {
    setChoisi(null);
    setI(i + 1);
  };

  return (
    <div className="mx-auto max-w-[620px]">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-accent-soft">
          <div className="copper-bg h-full rounded-full transition-[width] duration-300" style={{ width: `${(i / file.length) * 100}%` }} />
        </div>
        <span className="text-[12.5px] font-semibold text-muted">
          {i + 1} / {file.length}
        </span>
        <button type="button" onClick={() => setFile(null)} aria-label="Arrêter le quiz" className="flex size-9 items-center justify-center rounded-full text-muted hover:text-ink">
          <X size={17} />
        </button>
      </div>
      <div className="rounded-[18px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <p className="surtitre text-accent">{q.consigne}</p>
        <p className={`mt-2 leading-snug ${q.type === "citation" ? "font-display text-[20px] italic" : "text-[17px] font-medium"}`}>{q.question}</p>
        <div className="mt-4 grid gap-2">
          {q.choix.map((c, k) => {
            const etat = !repondu ? "" : k === q.bonne ? "juste" : k === choisi ? "faux" : "neutre";
            return (
              <button
                key={c + k}
                type="button"
                onClick={() => repondre(k)}
                disabled={repondu}
                className={`flex min-h-12 items-center gap-3 rounded-[14px] border px-4 py-2.5 text-left text-[15px] transition-colors ${
                  etat === "juste"
                    ? "border-ok bg-[color-mix(in_oklab,var(--ok)_14%,var(--surface))]"
                    : etat === "faux"
                      ? "border-bad bg-[color-mix(in_oklab,var(--bad)_12%,var(--surface))]"
                      : etat === "neutre"
                        ? "border-line opacity-60"
                        : "border-line hover:border-accent/60"
                }`}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line text-[12px] font-semibold text-muted">
                  {String.fromCharCode(65 + k)}
                </span>
                <span>{c}</span>
              </button>
            );
          })}
        </div>
        {repondu && (
          <div className="mt-4 rounded-[14px] bg-accent-soft p-3.5">
            <p className={`text-[14px] font-semibold ${juste ? "text-ok" : "text-bad"}`}>{juste ? "Juste !" : "Raté"}</p>
            <p className="mt-0.5 text-[14px] leading-relaxed">{q.explication}</p>
            <button type="button" onClick={() => ctx.ouvrir(q.personnage)} className="mt-1.5 text-[13.5px] font-semibold text-accent underline-offset-2 hover:underline">
              Voir sa fiche
            </button>
          </div>
        )}
      </div>
      {repondu && (
        <ZoneAction cle={i} className="mt-4 flex justify-end">
          <Bouton onClick={suivante}>{i + 1 >= file.length ? "Voir le bilan" : "Suivante"}</Bouton>
        </ZoneAction>
      )}
    </div>
  );
}
