"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Curseur à crans, fluide : le bouton suit le doigt en continu, la valeur entière change
 * dès qu'on passe à mi-chemin d'un cran, et au lâcher il glisse jusqu'au cran le plus
 * proche. Le clavier avance d'un cran à la fois. Le fond se remplit en même temps.
 */
export function Curseur({
  min,
  max,
  value,
  onChange,
  label,
  valueText,
  reperes = false,
  disabled = false,
  className = "",
}: {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  label: string;
  valueText?: string;
  /** Affiche un petit repère sous chaque cran (pour peu de crans). */
  reperes?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const [pos, setPos] = useState(value);
  const glisse = useRef(false);
  const anim = useRef(0);
  const posRef = useRef(value);

  const poser = (p: number) => {
    posRef.current = p;
    setPos(p);
  };

  // Glisse en douceur jusqu'à une position (fin de geste, clavier, valeur changée ailleurs).
  const allerA = (cible: number) => {
    cancelAnimationFrame(anim.current);
    const depart = posRef.current;
    if (Math.abs(depart - cible) < 0.001) return poser(cible);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return poser(cible);
    const t0 = performance.now();
    const duree = 220;
    const pas = (t: number) => {
      const k = Math.min(1, (t - t0) / duree);
      const e = 1 - (1 - k) ** 3;
      poser(depart + (cible - depart) * e);
      if (k < 1) anim.current = requestAnimationFrame(pas);
    };
    anim.current = requestAnimationFrame(pas);
  };

  // La valeur a changé hors du curseur (autre appareil, autre chapitre) : on y va.
  useEffect(() => {
    if (!glisse.current && Math.round(posRef.current) !== value) allerA(value);
    // allerA ne dépend que de refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => () => cancelAnimationFrame(anim.current), []);

  const fin = () => {
    glisse.current = false;
    allerA(Math.round(posRef.current));
  };

  const etendue = Math.max(1, max - min);
  const fill = ((pos - min) / etendue) * 100;

  return (
    <div className={className}>
      <input
        type="range"
        min={min}
        max={max}
        step={0.001}
        value={pos}
        disabled={disabled}
        aria-label={label}
        aria-valuenow={value}
        aria-valuetext={valueText ?? String(value)}
        onPointerDown={() => {
          cancelAnimationFrame(anim.current);
          glisse.current = true;
        }}
        onPointerUp={fin}
        onPointerCancel={fin}
        onBlur={() => glisse.current && fin()}
        onChange={(e) => {
          const p = e.target.valueAsNumber;
          // Un clic sur la piste sans glisser : on va au cran visé en douceur.
          if (!glisse.current) {
            const cible = Math.round(p);
            if (cible !== value) onChange(cible);
            return allerA(cible);
          }
          poser(p);
          const entier = Math.round(p);
          if (entier !== value) onChange(entier);
        }}
        onKeyDown={(e) => {
          const pas =
            e.key === "ArrowRight" || e.key === "ArrowUp"
              ? 1
              : e.key === "ArrowLeft" || e.key === "ArrowDown"
                ? -1
                : e.key === "Home"
                  ? min - value
                  : e.key === "End"
                    ? max - value
                    : 0;
          if (!pas) return;
          e.preventDefault();
          const cible = Math.min(max, Math.max(min, value + pas));
          if (cible !== value) onChange(cible);
          allerA(cible);
        }}
        className="luno-range"
        style={{ "--fill": `${fill}%` } as CSSProperties}
      />
      {reperes && max - min <= 10 && (
        <div className="luno-reperes" aria-hidden>
          {Array.from({ length: max - min + 1 }, (_, i) => (
            <span key={i} data-actif={min + i <= value} />
          ))}
        </div>
      )}
    </div>
  );
}
