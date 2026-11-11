"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { formule, texteBrut } from "@/components/Formule";
import type { ElementSchema, PointSchema, Schema, TonSchema } from "@/lib/types";

/**
 * Dessine un schéma explicatif décrit en données (`Schema` dans `lib/types.ts`) :
 * vecteurs, positions, trajectoires, repères, annotations. Tout est en SVG, aux
 * couleurs du thème, avec des flèches à pointe ouverte comme celles du texte.
 */

const TONS: Record<TonSchema, string> = {
  encre: "var(--ink)",
  accent: "var(--accent)",
  cuivre: "var(--schema-force)",
  doux: "var(--muted)",
  ok: "var(--ok)",
};
const couleur = (t?: TonSchema) => TONS[t ?? "encre"];

const FLECHE = String.fromCharCode(0x20d7);
const VECTEUR = new RegExp(`([A-Za-z0-9'ᵢₓᵧ₀-₉₊₋ΠΣΔ]+?)${FLECHE}`);
/** Lettres sans jambage montant : la flèche se pose plus bas au-dessus d'elles. */
const BASSES = /^[acemnorsuvwxzᵢₓᵧ₀-₉₊₋]+$/;

/** Pointe ouverte d'une flèche qui arrive en `a` depuis `de`. */
function pointe(de: PointSchema, a: PointSchema, long = 7, ouverture = 0.5) {
  const ang = Math.atan2(a[1] - de[1], a[0] - de[0]);
  const p = (s: number) => [
    a[0] - long * Math.cos(ang + s * ouverture),
    a[1] - long * Math.sin(ang + s * ouverture),
  ];
  const [g, d] = [p(1), p(-1)];
  return `${g[0]},${g[1]} ${a[0]},${a[1]} ${d[0]},${d[1]}`;
}

/** Courbe lisse passant par tous les points (Catmull-Rom). */
function lisse(pts: PointSchema[]) {
  if (pts.length < 3) return `M${pts.map((p) => p.join(",")).join(" L")}`;
  let d = `M${pts[0].join(",")}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1.join(",")} ${c2.join(",")} ${p2.join(",")}`;
  }
  return d;
}

/**
 * Texte d'un schéma : « v⃗₂ » met une flèche au-dessus de v, « v_f » écrit f en indice.
 * La flèche est placée après mesure du texte réellement affiché.
 */
function Etiquette({
  en,
  t,
  ton,
  taille = 13,
  ancre = "middle",
  main = false,
}: {
  en: PointSchema;
  t: string;
  ton?: TonSchema;
  taille?: number;
  ancre?: "start" | "middle" | "end";
  main?: boolean;
}) {
  const ref = useRef<SVGTextElement>(null);
  const traits = useRef<(SVGPathElement | null)[]>([]);

  // Morceaux : texte, base de vecteur, indice « _ ».
  const morceaux: { s: string; vec?: boolean; indice?: boolean }[] = [];
  let reste = t;
  while (reste) {
    const v = VECTEUR.exec(reste);
    const i = reste.search(/_\S+/);
    if (v && (i < 0 || v.index <= i)) {
      if (v.index) morceaux.push({ s: reste.slice(0, v.index) });
      // Le Δ, le Σ ou le Π devant le vecteur restent hors de la flèche.
      const base = v[1].replace(/^[ΔΣ]/, "");
      if (base !== v[1]) morceaux.push({ s: v[1][0] });
      morceaux.push({ s: base, vec: true });
      reste = reste.slice(v.index + v[0].length);
    } else if (i >= 0) {
      if (i) morceaux.push({ s: reste.slice(0, i) });
      const m = reste.slice(i).match(/^_(\S+)/)!;
      morceaux.push({ s: m[1], indice: true });
      reste = reste.slice(i + m[0].length);
    } else {
      morceaux.push({ s: reste });
      reste = "";
    }
  }
  const texte = morceaux.map((m) => m.s).join("");

  const fs = main ? taille * 1.35 : taille;

  // Les flèches sont posées sur le texte réellement affiché, une fois mesuré
  // (et de nouveau quand les polices ont fini de charger).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !morceaux.some((m) => m.vec)) return;
    const poser = () => {
      let pos = 0;
      let k = 0;
      try {
        for (const m of morceaux) {
          const n = [...m.s].length;
          if (m.vec) {
            const x1 = el.getStartPositionOfChar(pos).x + fs * 0.04;
            const x2 = el.getEndPositionOfChar(pos + n - 1).x + fs * 0.04;
            const y = en[1] - fs * (BASSES.test(m.s) ? 0.78 : 0.98);
            traits.current[k++]?.setAttribute(
              "d",
              `M${x1},${y} L${x2},${y} M${pointe([x1, y], [x2, y], fs * 0.24, 0.62).replace(/ /g, " L").replace(/^/, "")}`,
            );
          }
          pos += n;
        }
      } catch {
        // Texte pas encore affiché : la flèche sera posée au prochain essai.
      }
    };
    poser();
    let actif = true;
    document.fonts?.ready.then(() => actif && poser());
    return () => {
      actif = false;
    };
    // `texte` résume les morceaux ; la mesure ne dépend que de lui et de la position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texte, fs, ancre, en[0], en[1]]);

  const fill = couleur(ton);
  let dansIndice = false;
  const tspans: ReactNode[] = morceaux.map((m, i) => {
    const debut = m.indice && !dansIndice;
    const finIndice = !m.indice && dansIndice;
    dansIndice = !!m.indice;
    return (
      <tspan
        key={i}
        dy={debut ? fs * 0.28 : finIndice ? -fs * 0.28 : undefined}
        fontSize={m.indice ? fs * 0.72 : undefined}
      >
        {m.s}
      </tspan>
    );
  });

  return (
    <g>
      <text
        ref={ref}
        x={en[0]}
        y={en[1]}
        textAnchor={ancre}
        fontSize={fs}
        fill={fill}
        className={main ? "font-hand" : "font-sans"}
        fontWeight={500}
      >
        {tspans}
      </text>
      {morceaux
        .filter((m) => m.vec)
        .map((_, i) => (
          <path
            key={i}
            ref={(p) => {
              traits.current[i] = p;
            }}
            stroke={fill}
            fill="none"
            strokeWidth={fs * 0.075}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
    </g>
  );
}

function milieuDecale(de: PointSchema, a: PointSchema, d = 11): PointSchema {
  const [dx, dy] = [a[0] - de[0], a[1] - de[1]];
  const l = Math.hypot(dx, dy) || 1;
  // À gauche du sens de la flèche (vers le haut pour une flèche vers la droite).
  return [(de[0] + a[0]) / 2 + (dy / l) * d, (de[1] + a[1]) / 2 - (dx / l) * d + 4];
}

function Element({ e }: { e: ElementSchema }) {
  switch (e.f) {
    case "fleche": {
      const c = couleur(e.ton ?? "accent");
      return (
        <g>
          <g stroke={c} fill="none" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <line
              x1={e.de[0]}
              y1={e.de[1]}
              x2={e.a[0]}
              y2={e.a[1]}
              strokeDasharray={e.pointille ? "4 4" : undefined}
            />
            <polyline points={pointe(e.de, e.a)} />
          </g>
          {e.nom && <Etiquette en={e.pos ?? milieuDecale(e.de, e.a)} t={e.nom} ton={e.ton ?? "accent"} />}
        </g>
      );
    }
    case "point": {
      const c = couleur(e.ton);
      const [x, y] = e.en;
      return (
        <g>
          {e.forme === "croix" ? (
            <g stroke={c} strokeWidth={1.4} strokeLinecap="round">
              <line x1={x - 3} y1={y - 3} x2={x + 3} y2={y + 3} />
              <line x1={x - 3} y1={y + 3} x2={x + 3} y2={y - 3} />
            </g>
          ) : (
            <circle cx={x} cy={y} r={2.6} fill={c} />
          )}
          {e.nom && <Etiquette en={e.pos ?? [x, y - 9]} t={e.nom} ton={e.ton} taille={12} />}
        </g>
      );
    }
    case "trait": {
      const c = couleur(e.ton ?? "doux");
      const d = e.courbe
        ? lisse(e.points)
        : `M${e.points.map((p) => p.join(",")).join(" L")}${e.ferme ? " Z" : ""}`;
      return (
        <path
          d={d}
          fill={e.plein ? c : "none"}
          fillOpacity={e.plein ? 0.14 : undefined}
          stroke={c}
          strokeWidth={e.fin ? 0.9 : 1.3}
          strokeDasharray={e.pointille ? "3 4" : undefined}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    }
    case "cercle": {
      const c = couleur(e.ton ?? "doux");
      return (
        <circle
          cx={e.centre[0]}
          cy={e.centre[1]}
          r={e.r}
          fill={e.plein ? c : "none"}
          fillOpacity={e.plein ? 0.16 : undefined}
          stroke={c}
          strokeWidth={1.3}
          strokeDasharray={e.pointille ? "3 4" : undefined}
        />
      );
    }
    case "rect": {
      const c = couleur(e.ton ?? "doux");
      const [x, y] = [Math.min(e.de[0], e.a[0]), Math.min(e.de[1], e.a[1])];
      return (
        <rect
          x={x}
          y={y}
          width={Math.abs(e.a[0] - e.de[0])}
          height={Math.abs(e.a[1] - e.de[1])}
          rx={e.arrondi ?? 4}
          fill={e.plein ? c : "none"}
          fillOpacity={e.plein ? 0.16 : undefined}
          stroke={c}
          strokeWidth={1.3}
        />
      );
    }
    case "texte":
      return <Etiquette en={e.en} t={e.t} ton={e.ton ?? (e.main ? "accent" : "doux")} taille={e.taille} ancre={e.ancre} main={e.main} />;
    case "axes": {
      const [x, y] = e.origine;
      const c = couleur("doux");
      return (
        <g>
          <g stroke={c} fill="none" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
            <line x1={x} y1={y} x2={x + e.x} y2={y} />
            <polyline points={pointe([x, y], [x + e.x, y], 6)} />
            <line x1={x} y1={y} x2={x} y2={y - e.y} />
            <polyline points={pointe([x, y], [x, y - e.y], 6)} />
          </g>
          <Etiquette en={[x - 7, y + 13]} t={e.o ?? "O"} ton="doux" taille={12} />
          <Etiquette en={[x + e.x - 2, y + 15]} t={e.noms?.[0] ?? "x"} ton="doux" taille={12} />
          <Etiquette en={[x - 7, y - e.y + 8]} t={e.noms?.[1] ?? "y"} ton="doux" taille={12} ancre="end" />
        </g>
      );
    }
    case "sol": {
      const c = couleur("doux");
      const [dx, dy] = [e.a[0] - e.de[0], e.a[1] - e.de[1]];
      const l = Math.hypot(dx, dy);
      const n = Math.max(2, Math.floor(l / 9));
      return (
        <g stroke={c} strokeWidth={1.1} strokeLinecap="round">
          <line x1={e.de[0]} y1={e.de[1]} x2={e.a[0]} y2={e.a[1]} />
          {Array.from({ length: n }, (_, i) => {
            const t = (i + 0.5) / n;
            const [x, y] = [e.de[0] + dx * t, e.de[1] + dy * t];
            return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 6} strokeWidth={0.8} />;
          })}
        </g>
      );
    }
    case "ressort": {
      const c = couleur(e.ton ?? "doux");
      const spires = e.spires ?? 7;
      const [dx, dy] = [e.a[0] - e.de[0], e.a[1] - e.de[1]];
      const l = Math.hypot(dx, dy) || 1;
      const [nx, ny] = [-dy / l, dx / l];
      const pts: string[] = [e.de.join(",")];
      const marge = 0.08;
      for (let i = 0; i <= spires * 2; i++) {
        const t = marge + ((1 - 2 * marge) * i) / (spires * 2);
        const s = i === 0 || i === spires * 2 ? 0 : i % 2 ? 6 : -6;
        pts.push(`${e.de[0] + dx * t + nx * s},${e.de[1] + dy * t + ny * s}`);
      }
      pts.push(e.a.join(","));
      return <polyline points={pts.join(" ")} fill="none" stroke={c} strokeWidth={1.3} strokeLinejoin="round" />;
    }
  }
}

/** Description en texte d'un schéma, pour les lecteurs d'écran. */
function description(s: Schema) {
  if (s.legende) return texteBrut(s.legende);
  const noms = s.elements
    .map((e) => ("nom" in e && e.nom ? e.nom : e.f === "texte" ? e.t : ""))
    .filter(Boolean);
  return `Schéma : ${texteBrut(noms.join(", "))}`;
}

/**
 * Un schéma dans son cadre. `dansBouton` le construit en `span` (une carte de révision
 * est un bouton, qui ne peut pas contenir de `figure`).
 */
export function DessinSchema({
  schema,
  className = "",
  dansBouton = false,
  hauteurMax,
}: {
  schema: Schema;
  className?: string;
  dansBouton?: boolean;
  /** Hauteur maximale du dessin, en px (il garde ses proportions). */
  hauteurMax?: number;
}) {
  const Cadre = dansBouton ? "span" : "figure";
  const Legende = dansBouton ? "span" : "figcaption";
  return (
    <Cadre className={`schema block ${className}`}>
      <svg
        viewBox={`0 0 ${schema.l} ${schema.h}`}
        role="img"
        aria-label={description(schema)}
        className="block h-auto w-full overflow-visible"
        style={{
          maxWidth: hauteurMax
            ? Math.min(schema.l * 1.5, (hauteurMax * schema.l) / schema.h)
            : schema.l * 1.5,
        }}
      >
        {schema.elements.map((e, i) => (
          <Element key={i} e={e} />
        ))}
      </svg>
      {schema.legende && (
        <Legende className="mt-2 block text-center text-[13px] leading-snug text-muted">
          {formule(schema.legende)}
        </Legende>
      )}
    </Cadre>
  );
}
