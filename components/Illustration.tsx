"use client";

import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { lienFichier } from "@/lib/liens";
import { Fenetre } from "@/components/ui";
import type { ImageCours } from "@/lib/types";

/**
 * Image d'un cours (carte, gravure) : vignette arrondie avec sa légende, qui s'ouvre en
 * grand au toucher pour lire les détails.
 */
export function Illustration({ image, className = "" }: { image: ImageCours; className?: string }) {
  const [grand, setGrand] = useState(false);
  const src = lienFichier(image.fichier);
  return (
    // Une image en hauteur (sceau, gravure) ne prend pas tout l'écran du téléphone.
    <figure className={className} style={image.ratio && image.ratio < 1 ? { maxWidth: Math.round(340 * image.ratio) } : undefined}>
      <button
        type="button"
        onClick={() => setGrand(true)}
        aria-label={`Agrandir : ${image.alt}`}
        className="group relative block w-full overflow-hidden rounded-2xl border border-line bg-bg"
        style={image.ratio ? { aspectRatio: String(image.ratio) } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={image.alt} loading="lazy" className="size-full object-cover" />
        <span className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full bg-surface/90 text-ink opacity-80 shadow-card transition-opacity group-hover:opacity-100">
          <Maximize2 size={15} />
        </span>
      </button>
      {image.legende && (
        <figcaption className="mt-1.5 text-[12.5px] leading-snug text-muted">{image.legende}</figcaption>
      )}
      <Fenetre ouverte={grand} fermer={() => setGrand(false)} titre={image.legende ?? image.alt}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={image.alt} className="w-full rounded-xl" />
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-10 items-center gap-1.5 text-[14px] font-semibold text-accent"
        >
          Ouvrir en plein écran pour zoomer
        </a>
      </Fenetre>
    </figure>
  );
}
