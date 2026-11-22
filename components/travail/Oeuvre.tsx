"use client";

import { useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
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

/** Vrai sur un écran d'au moins 1024 px (le détail d'un logement va alors dans un panneau à droite). */
function useLarge() {
  return useSyncExternalStore(
    (f) => {
      const m = window.matchMedia("(min-width: 1024px)");
      m.addEventListener("change", f);
      return () => m.removeEventListener("change", f);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true,
  );
}

function Immeuble({ ctx }: { ctx: Ctx }) {
  const { o } = ctx;
  const [ch, setCh] = useState(o.luJusqua);
  const large = useLarge();
  // Sur téléphone, rien d'ouvert au départ ; toucher un appartement ouvre une bulle juste
  // sous son étage (demandé : ne plus devoir remonter), le retoucher la referme.
  const [choix, setChoix] = useState<string | null>(null);
  const sel = choix ?? (large ? "4-cour" : null);
  const logement = sel ? o.logements.find((l) => l.id === sel)! : null;
  const resume = o.resumes.find((r) => r.n === ch);
  const lieu = (id: string) => o.logements.find((l) => l.id === id)!;
  const choisir = (id: string) => setChoix((c) => (!large && c === id ? null : id));

  const bulle =
    !large && logement ? (
      <DetailLogement ctx={ctx} l={logement} ch={ch} lieu={lieu} fermer={() => setChoix(null)} bulle />
    ) : null;

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
            vieux Vabre…). Touche un appartement pour voir qui y vit.
          </p>
        </div>
        <Facade ctx={ctx} ch={ch} sel={sel} choisir={choisir} bulle={bulle} />
      </div>

      {large && logement && (
        <div className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={logement.id + ch}
              initial={{ opacity: 0, transform: "translate3d(0, 8px, 0)" }}
              animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <DetailLogement ctx={ctx} l={logement} ch={ch} lieu={lieu} />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

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

/** Motif du papier peint d'une famille, vu par les fenêtres (idée de la maison de poupée). */
function papierPeint(famille: string, c: string): string {
  const fort = `color-mix(in oklab, ${c} 34%, var(--surface))`;
  const doux = `color-mix(in oklab, ${c} 10%, var(--surface))`;
  switch (famille) {
    case "vabre":
      return `repeating-linear-gradient(90deg, ${fort} 0 3px, ${doux} 3px 8px)`;
    case "josserand":
      return `repeating-linear-gradient(45deg, ${fort} 0 4px, ${doux} 4px 8px)`;
    case "campardon":
      return `radial-gradient(${fort} 1.5px, ${doux} 1.7px) 0 0 / 7px 7px`;
    case "duveyrier":
      return `linear-gradient(${fort}, color-mix(in oklab, #d4a24c 22%, var(--surface)))`;
    default:
      return `linear-gradient(${fort}, ${doux})`;
  }
}

/** Couleurs de la façade : pierre, ardoise, fonte, vitre. Elles suivent le thème. */
const PIERRE = "color-mix(in oklab, #e8d9c4 72%, var(--surface))";
const PIERRE_2 = "color-mix(in oklab, #cdb89c 70%, var(--surface))";
const ARDOISE = "color-mix(in oklab, #4f5360 88%, var(--bg))";
const VITRE = "color-mix(in oklab, #9fb4c4 50%, var(--surface))";

/** Fenêtre cintrée : vide, elle montre le ciel ; habitée, le papier peint et l'objet de la famille. */
function Fenetres({ ctx, id, ch, haute = false }: { ctx: Ctx; id: string; ch: number; haute?: boolean }) {
  const gens = habitants(ctx.o, id, ch);
  const l = ctx.o.logements.find((x) => x.id === id);
  const chef = gens[0];
  const ferme = l?.persiennes;
  const fond = ferme
    ? "color-mix(in oklab, var(--ink) 55%, var(--surface))"
    : chef
      ? papierPeint(chef.famille, ctx.couleur(chef))
      : VITRE;
  return (
    <span className="flex gap-1.5" aria-hidden>
      {[0, 1].map((i) => (
        <span
          key={i}
          className={`relative grid w-[26px] place-items-center overflow-hidden rounded-t-[13px] rounded-b-[3px] text-[14px] sm:w-[30px] ${haute ? "h-[36px] sm:h-[40px]" : "h-[31px] sm:h-[34px]"}`}
          style={{ background: fond, border: `2.5px solid ${PIERRE_2}` }}
        >
          {i === 0 && chef && !ferme && l?.objet}
          {/* croisillons */}
          <span className="pointer-events-none absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2" style={{ background: PIERRE_2 }} />
          <span className="pointer-events-none absolute inset-x-0 top-[45%] h-[2px]" style={{ background: PIERRE_2 }} />
        </span>
      ))}
    </span>
  );
}

/** Un appartement de la façade : ses fenêtres et les noms de ses habitants. */
function Appart({
  ctx,
  id,
  ch,
  sel,
  choisir,
  etiquette,
  haute,
}: {
  ctx: Ctx;
  id: string;
  ch: number;
  sel: string | null;
  choisir: (id: string) => void;
  etiquette: string;
  haute?: boolean;
}) {
  const gens = habitants(ctx.o, id, ch).filter((p) => p.importance <= 2);
  const visibles = gens.slice(0, 3);
  const actif = sel === id;
  return (
    <button
      type="button"
      onClick={() => choisir(id)}
      aria-pressed={actif}
      aria-label={`${ctx.o.logements.find((l) => l.id === id)?.nom} : ${gens.map((g) => g.court).join(", ") || "personne"}`}
      className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[11px] px-1 py-1 transition-[background-color,box-shadow] duration-200"
      style={actif ? { background: "color-mix(in oklab, var(--accent) 16%, transparent)", boxShadow: "0 0 0 1.5px var(--accent)" } : undefined}
    >
      <span className="text-[9px] font-semibold uppercase tracking-[0.08em]" style={{ color: "color-mix(in oklab, var(--ink) 62%, transparent)" }}>{etiquette}</span>
      <Fenetres ctx={ctx} id={id} ch={ch} haute={haute} />
      <span className="flex min-h-[17px] flex-wrap justify-center gap-[3px]">
        {visibles.length === 0 ? (
          <span className="text-[10.5px] italic text-muted">{id === "2-rue" ? "volets clos" : "vide"}</span>
        ) : (
          visibles.map((p) => {
            const c = ctx.couleur(p);
            return (
              <span
                key={p.id}
                className="max-w-full truncate rounded-full px-1.5 text-[10.5px] font-semibold leading-[17px] sm:text-[11.5px]"
                style={{ background: pastel(c, 24), color: encre(c, 75) }}
              >
                {p.court}
              </span>
            );
          })
        )}
        {gens.length > visibles.length && <span className="text-[10.5px] font-semibold text-muted">+{gens.length - visibles.length}</span>}
      </span>
    </button>
  );
}

/** L'escalier en zigzag entre la rue et la cour : tapis rouge jusqu'au 3e, toile grise ensuite. */
function Escalier({ tapis }: { tapis: boolean }) {
  return (
    <span className="relative w-[18px] shrink-0 rounded-[4px] sm:w-[22px]" style={{ background: PIERRE_2 }} aria-hidden>
      <svg viewBox="0 0 22 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path
          d="M4 57 L18 39 L4 21 L18 3"
          fill="none"
          stroke={tapis ? "var(--accent)" : "color-mix(in oklab, var(--muted) 70%, var(--surface))"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

/**
 * La façade dessinée (maquette A1 choisie le 2026-11-22) : toit mansardé et lucarnes des
 * bonnes, deux appartements par étage vus par leurs fenêtres (papier peint de la famille,
 * objet qui la résume), escalier en zigzag au milieu, balcon au 1er, soierie et porte
 * cochère en bas. Toucher un appartement ouvre la bulle sous son étage (téléphone).
 */
function Facade({
  ctx,
  ch,
  sel,
  choisir,
  bulle,
}: {
  ctx: Ctx;
  ch: number;
  sel: string | null;
  choisir: (id: string) => void;
  bulle: ReactNode;
}) {
  const sous = (ids: string[]) =>
    sel && ids.includes(sel) && bulle ? (
      <Bulle pointe={ids.length === 2 ? (sel === ids[0] ? "gauche" : "droite") : "milieu"} cle={sel}>
        {bulle}
      </Bulle>
    ) : null;
  const etages = [
    { n: "4e", rue: "4-rue", cour: "4-cour", tapis: false },
    { n: "3e", rue: "3-rue", cour: "3-cour", tapis: true },
    { n: "2e", rue: "2-rue", cour: "2-cour", tapis: true },
    { n: "1er", rue: "1-rue", cour: "1-cour", tapis: true },
  ];
  const bonnes = habitants(ctx.o, "combles", ch).filter((p) => p.importance <= 2);
  const actif = (id: string) =>
    sel === id ? { background: "color-mix(in oklab, var(--accent) 16%, transparent)", boxShadow: "0 0 0 1.5px var(--accent)" } : undefined;

  return (
    <div className="rounded-[22px] border border-line p-3 shadow-card sm:p-4" style={{ background: "linear-gradient(var(--accent-soft), var(--bg))" }}>
      <div className="mx-auto max-w-[460px]">
        {/* Toit mansardé : les lucarnes des chambres de bonnes */}
        <button
          type="button"
          onClick={() => choisir("combles")}
          aria-pressed={sel === "combles"}
          aria-label={`Étage des bonnes : ${bonnes.map((b) => b.court).join(", ")}`}
          className="block w-full"
        >
          <span
            className="flex h-[46px] items-end justify-center gap-2 pb-1.5"
            style={{ background: ARDOISE, clipPath: "polygon(5% 100%, 12% 0, 88% 0, 95% 100%)" }}
          >
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="grid h-[28px] w-[24px] place-items-center rounded-t-[12px] rounded-b-[2px]" style={{ background: PIERRE }}>
                <span className="block h-[15px] w-[12px] rounded-t-[6px] rounded-b-[1px]" style={{ background: "#f0d49a" }} />
              </span>
            ))}
          </span>
          <span className="flex flex-wrap justify-center gap-[3px] rounded-[10px] px-2 py-1.5" style={{ background: PIERRE, ...actif("combles") }}>
            {bonnes.slice(0, 5).map((p) => (
              <span
                key={p.id}
                className="rounded-full px-1.5 text-[10.5px] font-semibold leading-[17px] sm:text-[11.5px]"
                style={{ background: pastel(ctx.couleur(p), 24), color: encre(ctx.couleur(p), 75) }}
              >
                {p.court}
              </span>
            ))}
            {bonnes.length > 5 && <span className="text-[10.5px] font-semibold text-muted">+{bonnes.length - 5}</span>}
          </span>
        </button>
        {sous(["combles"])}

        <div className="px-2" style={{ background: PIERRE, borderLeft: `1px solid ${PIERRE_2}`, borderRight: `1px solid ${PIERRE_2}` }}>
          {etages.map((e) => (
            <div key={e.n}>
              <div className="relative flex items-stretch gap-1.5 py-1" style={{ borderBottom: `2px solid ${PIERRE_2}` }}>
                
                {e.n === "1er" && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-1 bottom-[24px] h-2 opacity-70"
                    style={{
                      borderTop: "2px solid color-mix(in oklab, var(--ink) 80%, transparent)",
                      background: "repeating-linear-gradient(90deg, color-mix(in oklab, var(--ink) 80%, transparent) 0 1.5px, transparent 1.5px 6px)",
                    }}
                  />
                )}
                <Appart ctx={ctx} id={e.rue} ch={ch} sel={sel} choisir={choisir} etiquette={`${e.n} · rue`} haute={e.n === "1er"} />
                <Escalier tapis={e.tapis} />
                <Appart ctx={ctx} id={e.cour} ch={ch} sel={sel} choisir={choisir} etiquette={`${e.n} · cour`} haute={e.n === "1er"} />
              </div>
              {sous([e.rue, e.cour])}
            </div>
          ))}
        </div>

        {/* Rez-de-chaussée : la soierie (avec l'entresol au-dessus) et la porte cochère avec la loge */}
        <div className="grid grid-cols-[1.5fr_0.8fr] gap-2 px-2 pt-1.5" style={{ background: PIERRE_2 }}>
          <div className="min-w-0">
            <span
              aria-hidden
              className="block h-3"
              style={{
                background: "repeating-linear-gradient(90deg, var(--accent) 0 12px, var(--surface) 12px 24px)",
                clipPath: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)",
              }}
            />
            <button
              type="button"
              onClick={() => choisir("rdc")}
              aria-pressed={sel === "rdc"}
              className="block w-full bg-ink py-px text-center font-display text-[10.5px] tracking-[0.14em] text-bg"
            >
              SOIERIES · VABRE
            </button>
            <button
              type="button"
              onClick={() => choisir("entresol")}
              aria-pressed={sel === "entresol"}
              className="grid h-[34px] w-full place-items-center rounded-[2px] text-[10.5px] text-ink"
              style={{
                border: "2px solid color-mix(in oklab, var(--ink) 75%, transparent)",
                borderBottom: 0,
                background: papierPeint("vabre", "#b5573d"),
                ...actif("entresol"),
              }}
            >
              <span className="rounded-full bg-surface/85 px-1.5">
                {habitants(ctx.o, "entresol", ch).length ? `entresol : ${habitants(ctx.o, "entresol", ch).map((p) => p.court).join(", ")}` : "entresol vide"}
              </span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => choisir("loge")}
            aria-pressed={sel === "loge"}
            className="grid h-[52px] place-items-end justify-center rounded-t-[24px] pb-1"
            style={{ background: "color-mix(in oklab, #7a4a33 70%, var(--surface))", ...actif("loge") }}
          >
            <span className="rounded-full bg-surface/85 px-1.5 text-[10.5px] font-semibold text-ink">M. Gourd</span>
          </button>
        </div>
        <span aria-hidden className="block h-2 rounded-b-[6px] bg-muted/35" />
        {sous(["rdc", "entresol", "loge"])}

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[11.5px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-1.5 rounded-full bg-accent" /> tapis rouge jusqu&apos;au 3e
          </span>
          <span>Aux fenêtres : le papier peint de chaque famille</span>
        </div>

        <button
          type="button"
          onClick={() => choisir("dehors")}
          className={`mt-2.5 flex min-h-11 w-full items-center gap-2 rounded-[14px] border border-dashed px-3 text-left text-[13.5px] font-semibold transition-colors ${
            sel === "dehors" ? "border-accent bg-accent-soft text-ink" : "border-line text-muted hover:text-ink"
          }`}
        >
          <MapPin size={16} /> Hors de l&apos;immeuble : Bachelard, Trublot, Mme Hédouin…
        </button>
        {sous(["dehors"])}
      </div>
    </div>
  );
}

/** Bulle ouverte sous une rangée de la façade (téléphone), avec une pointe vers la case touchée. */
function Bulle({ pointe, cle, children }: { pointe: "gauche" | "droite" | "milieu"; cle: string; children: ReactNode }) {
  const x = pointe === "gauche" ? 25 : pointe === "droite" ? 75 : 50;
  return (
    <motion.div
      key={cle}
      initial={{ opacity: 0, transform: "translate3d(0, -6px, 0)" }}
      animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
      transition={{ duration: 0.18 }}
      className="relative my-2.5"
    >
      <span
        aria-hidden
        className="absolute -top-[7px] z-[1] size-3.5 rotate-45 rounded-[3px] border-l border-t border-accent bg-surface"
        style={{ left: `calc(${x}% - 7px)` }}
      />
      {children}
    </motion.div>
  );
}

/** Portrait court d'un habitant, déplié dans la bulle : caractère, liens, ce qu'il fait, fiche complète. */
function MiniFiche({ ctx, p }: { ctx: Ctx; p: Personnage }) {
  const { o } = ctx;
  const c = ctx.couleur(p);
  const liens = liensDe(o, p.id, o.luJusqua).slice(0, 5);
  const faits = p.faits.filter((f) => f.ch <= o.luJusqua);
  return (
    <div className="mx-2 mb-2 space-y-2.5 rounded-[12px] p-3" style={{ background: pastel(c, 10) }}>
      {(p.age || p.metier) && <p className="text-[12.5px] text-muted">{[p.age, p.metier].filter(Boolean).join(" · ")}</p>}
      <ul className="space-y-1">
        {p.traits.slice(0, 3).map((t) => (
          <li key={t} className="flex gap-2 text-[13.5px] leading-snug">
            <span className="mt-[7px] size-1.5 shrink-0 rounded-full" style={{ background: c }} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
      {liens.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12.5px]">
          {liens.map(({ lien, autre }) => (
            <span key={lien.de + lien.a} className="inline-flex items-center gap-1">
              <span className="text-muted">{lien.de === p.id ? `${lien.libelle} de` : "→"}</span>
              <Pastille ctx={ctx} id={autre} petit />
            </span>
          ))}
        </div>
      )}
      {faits.length > 0 && (
        <p className="text-[13px] leading-snug">
          <span className="mr-1.5 rounded-md bg-accent-soft px-1.5 py-0.5 font-display text-[11.5px] text-accent">{ROMAINS[faits.at(-1)!.ch]}</span>
          {faits.at(-1)!.t}
        </p>
      )}
      <button type="button" onClick={() => ctx.ouvrir(p.id)} className="text-[13px] font-semibold text-accent underline-offset-2 hover:underline">
        Toute sa fiche ({faits.length} {faits.length > 1 ? "moments" : "moment"}, citation…)
      </button>
    </div>
  );
}

function DetailLogement({
  ctx,
  l,
  ch,
  lieu,
  fermer,
  bulle = false,
}: {
  ctx: Ctx;
  l: Logement;
  ch: number;
  lieu: (id: string) => Logement;
  fermer?: () => void;
  bulle?: boolean;
}) {
  const { o } = ctx;
  const gens = habitants(o, l.id, ch);
  // Toucher un habitant déplie sa petite fiche dans la bulle (demandé : « une bulle dans la bulle »).
  const [ouvert, setOuvert] = useState<string | null>(null);
  // Ceux qui y ont vécu à un autre moment (avant ou après, jusqu'au chapitre lu).
  const passes = o.personnages.filter(
    (p) => !gens.includes(p) && p.adresses.some((a) => a.lieu === l.id && (a.de ?? 1) <= o.luJusqua),
  );
  return (
    <div className={`rounded-[18px] border bg-surface shadow-card ${bulle ? "border-accent p-4" : "border-line p-5"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="surtitre text-accent">{l.id === "dehors" ? "Ailleurs dans Paris" : `Chapitre ${ROMAINS[ch]}`}</p>
          <h3 className={`mt-1 leading-snug ${bulle ? "text-[19px]" : "text-[22px]"}`}>{l.nom}</h3>
        </div>
        {fermer && (
          <button type="button" onClick={fermer} aria-label="Fermer" className="-mr-1.5 -mt-1 flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:text-ink">
            <X size={17} />
          </button>
        )}
      </div>
      {l.detail && <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{l.detail}</p>}
      {gens.length === 0 ? (
        <p className="mt-4 text-[14px] text-muted">Personne de connu ici à ce moment.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {gens.map((p) => {
            const a = adressesAu(p, ch).find((x) => x.lieu === l.id);
            const c = ctx.couleur(p);
            const deplie = ouvert === p.id;
            return (
              <li key={p.id} className="overflow-hidden rounded-[14px] border transition-colors" style={{ borderColor: deplie ? c : "var(--line)" }}>
                <button
                  type="button"
                  aria-expanded={deplie}
                  onClick={() => setOuvert(deplie ? null : p.id)}
                  className="flex w-full items-start gap-3 p-3 text-left"
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
                  <ChevronDown size={17} className={`mt-1 shrink-0 text-muted transition-transform duration-200 ${deplie ? "rotate-180" : ""}`} />
                </button>
                <div className="repli" data-ouvert={deplie}>
                  <div>
                    <MiniFiche ctx={ctx} p={p} />
                  </div>
                </div>
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
      {l.id !== "dehors" && !bulle && (
        <p className="mt-4 text-[12px] text-muted">
          Touche un appartement de la façade pour voir qui y vit. Touche un habitant pour son portrait.
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
        .filter((f) => f.arbres?.length)
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
          {f.arbres!.map((a, i) => (
            <div key={a.id} className={i > 0 ? "mt-4 border-t border-dashed border-line pt-4" : ""}>
              <Branche ctx={ctx} n={a} couleur={f.couleur} />
            </div>
          ))}
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
                  <span
                    className="absolute left-0 top-1/2 w-4"
                    style={e.pointille ? { borderTop: `1.5px dashed ${trait}` } : { height: 1, background: trait }}
                  />
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
