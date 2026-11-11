"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Pastille qui glisse sous l'onglet actif, fluide sur téléphone.
 *
 * Les animations de mise en page (`layoutId` de motion) sont calculées image par image
 * sur le fil principal : quand la page change d'onglet en même temps, elles saccadent.
 * Ici, on mesure une fois l'ancienne et la nouvelle position, on pose la pastille à sa
 * place finale, et on confie au navigateur l'animation inverse (technique FLIP) en
 * `transform` seulement : elle tourne sur la carte graphique, même si la page travaille.
 *
 * Le conteneur doit être positionné (`relative`) ; l'onglet actif porte `data-actif`.
 */
export function usePastille<C extends HTMLElement = HTMLDivElement>(cle: unknown) {
  // Le conteneur peut apparaître après coup (page affichée après une transition) :
  // une référence-fonction le garde en état pour relancer le placement.
  const [boite, conteneur] = useState<C | null>(null);
  const pastille = useRef<HTMLSpanElement>(null);
  const avant = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const boitePrecedente = useRef<C | null>(null);

  useLayoutEffect(() => {
    const p = pastille.current;
    if (!boite || !p) return;
    // Nouvelle barre d'onglets : on se pose sans glisser depuis l'ancienne.
    if (boitePrecedente.current !== boite) avant.current = null;
    boitePrecedente.current = boite;

    const mesurer = () => {
      const actif = boite.querySelector<HTMLElement>("[data-actif='true']");
      if (!actif) return null;
      const a = actif.getBoundingClientRect();
      const b = boite.getBoundingClientRect();
      return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
    };

    const poser = (r: { x: number; y: number; w: number; h: number }) => {
      p.style.width = `${r.w}px`;
      p.style.height = `${r.h}px`;
      p.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
      p.style.opacity = "1";
    };

    const r = mesurer();
    if (!r) {
      p.style.opacity = "0";
      avant.current = null;
      return;
    }
    const a = avant.current;
    poser(r);
    const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (a && !calme && (a.x !== r.x || a.y !== r.y || a.w !== r.w)) {
      p.animate(
        [
          {
            transform: `translate3d(${a.x}px, ${a.y}px, 0) scale(${a.w / r.w}, ${a.h / r.h})`,
          },
          { transform: `translate3d(${r.x}px, ${r.y}px, 0) scale(1, 1)` },
        ],
        { duration: 380, easing: "cubic-bezier(0.32, 0.72, 0, 1)" },
      );
    }
    avant.current = r;

    // Taille de l'écran, police chargée, libellé qui change : on se recale sans animer.
    const suivre = new ResizeObserver(() => {
      const n = mesurer();
      if (n) {
        poser(n);
        avant.current = n;
      }
    });
    suivre.observe(boite);
    return () => suivre.disconnect();
  }, [cle, boite]);

  return { conteneur, pastille };
}

/** Style de base de la pastille : en haut à gauche du conteneur, déplacée en transform. */
export const classePastille =
  "pointer-events-none absolute left-0 top-0 origin-top-left opacity-0 will-change-transform";
