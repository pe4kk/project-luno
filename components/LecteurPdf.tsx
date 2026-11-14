"use client";

import { useEffect, useRef, useState, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { create } from "zustand";
import { ExternalLink, Minus, Plus, Share, X } from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";

/**
 * Lecteur de PDF intégré (2026-11-14). Dans l'app installée sur l'écran d'accueil de
 * l'iPhone, un lien vers un PDF du site s'ouvrait dans la fenêtre même de l'app, sans
 * bouton retour : on ne pouvait plus en sortir. Le PDF s'affiche maintenant par-dessus
 * la page (pdf.js), avec un bouton Fermer ; le geste retour du téléphone le ferme aussi.
 */

type PdfOuvert = { url: string; titre: string };
const usePdf = create<{ pdf: PdfOuvert | null; ouvrir: (p: PdfOuvert) => void; fermer: () => void }>((set) => ({
  pdf: null,
  ouvrir: (pdf) => set({ pdf }),
  fermer: () => set({ pdf: null }),
}));

export const ouvrirPdf = (url: string, titre: string) => usePdf.getState().ouvrir({ url, titre });

/** Lien vers un PDF : ouvre le lecteur intégré au lieu de quitter Luno. */
export function LienPdf({
  href,
  titre,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; titre: string }) {
  return (
    <a
      {...props}
      href={href}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        // Ctrl/Cmd + clic garde le comportement d'un lien (nouvel onglet sur ordinateur).
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        ouvrirPdf(href, titre);
      }}
    />
  );
}

const ZOOMS = [1, 1.5, 2, 3];

const enApp = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true);

/** Monté une fois, dans AppShell. */
export function LecteurPdf() {
  const { pdf, fermer } = usePdf();
  const historique = useRef(false);

  // Le retour du téléphone (ou du navigateur) ferme le lecteur au lieu de quitter la page.
  useEffect(() => {
    if (!pdf) return;
    history.pushState({ ...(history.state ?? {}), lecteurPdf: true }, "");
    historique.current = true;
    const retour = () => {
      historique.current = false;
      fermer();
    };
    window.addEventListener("popstate", retour);
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("popstate", retour);
      document.body.style.overflow = avant;
    };
  }, [pdf, fermer]);

  const quitter = () => {
    if (historique.current) {
      historique.current = false;
      history.back();
    }
    fermer();
  };

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {pdf && (
        <motion.div
          key={pdf.url}
          role="dialog"
          aria-modal="true"
          aria-label={pdf.titre}
          initial={{ opacity: 0, transform: "translate3d(0, 24px, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
          exit={{ opacity: 0, transform: "translate3d(0, 24px, 0)" }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] flex flex-col bg-bg"
          onKeyDown={(e) => e.key === "Escape" && quitter()}
        >
          <Vue pdf={pdf} quitter={quitter} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Vue({ pdf, quitter }: { pdf: PdfOuvert; quitter: () => void }) {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [tailles, setTailles] = useState<{ l: number; h: number }[]>([]);
  const [erreur, setErreur] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [largeur, setLargeur] = useState(0);
  const zone = useRef<HTMLDivElement>(null);
  const fermerBouton = useRef<HTMLButtonElement>(null);

  useEffect(() => fermerBouton.current?.focus({ preventScroll: true }), []);

  useEffect(() => {
    let annule = false;
    let charge: PDFDocumentProxy | null = null;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/pdf.worker.min.mjs`;
        charge = await pdfjs.getDocument({ url: pdf.url }).promise;
        const t: { l: number; h: number }[] = [];
        for (let i = 1; i <= charge.numPages; i++) {
          const v = (await charge.getPage(i)).getViewport({ scale: 1 });
          t.push({ l: v.width, h: v.height });
        }
        if (annule) return;
        setTailles(t);
        setDoc(charge);
      } catch {
        if (!annule) setErreur(true);
      }
    })();
    return () => {
      annule = true;
      void charge?.destroy();
    };
  }, [pdf.url]);

  // Largeur disponible : les pages la remplissent (jusqu'à 900 px), multipliée par le zoom.
  useEffect(() => {
    const el = zone.current;
    if (!el) return;
    const mesurer = () => setLargeur(Math.min(el.clientWidth - 24, 900));
    mesurer();
    const ro = new ResizeObserver(mesurer);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const partager = async () => {
    try {
      const blob = await (await fetch(pdf.url)).blob();
      const fichier = new File([blob], `${pdf.titre.replace(/[\\/:*?"<>|]/g, "-")}.pdf`, { type: "application/pdf" });
      if (navigator.canShare?.({ files: [fichier] })) await navigator.share({ files: [fichier], title: pdf.titre });
      else window.open(pdf.url, "_blank", "noreferrer");
    } catch {
      /* partage annulé */
    }
  };

  const l = largeur * ZOOMS[zoom];
  return (
    <>
      <div className="flex shrink-0 items-center gap-1.5 border-b border-line bg-surface px-2 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] shadow-card">
        <button
          ref={fermerBouton}
          onClick={quitter}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[10px] bg-ink px-3.5 text-[14.5px] font-semibold text-bg"
        >
          <X size={18} /> Fermer
        </button>
        <p className="min-w-0 flex-1 truncate px-1.5 text-[14.5px] font-semibold max-[359px]:invisible">
          {pdf.titre}
          {tailles.length > 0 && (
            <span className="block text-[12px] font-normal text-muted">
              {tailles.length} page{tailles.length > 1 ? "s" : ""}
            </span>
          )}
        </p>
        <button
          onClick={() => setZoom((z) => Math.max(0, z - 1))}
          aria-label="Dézoomer"
          className="inline-flex size-11 items-center justify-center rounded-[10px] text-muted hover:bg-ink/5"
        >
          <Minus size={18} />
        </button>
        <span className="w-10 text-center text-[13px] font-semibold tabular-nums text-muted max-[359px]:hidden">
          {Math.round(ZOOMS[zoom] * 100)} %
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))}
          aria-label="Zoomer"
          className="inline-flex size-11 items-center justify-center rounded-[10px] text-muted hover:bg-ink/5"
        >
          <Plus size={18} />
        </button>
        {enApp() ? (
          <button
            onClick={partager}
            aria-label="Enregistrer ou partager"
            title="Enregistrer ou partager"
            className="inline-flex size-11 items-center justify-center rounded-[10px] text-muted hover:bg-ink/5"
          >
            <Share size={18} />
          </button>
        ) : (
          <a
            href={pdf.url}
            target="_blank"
            rel="noreferrer"
            aria-label="Ouvrir dans un onglet"
            title="Ouvrir dans un onglet"
            className="hidden size-11 items-center justify-center rounded-[10px] text-muted hover:bg-ink/5 sm:inline-flex"
          >
            <ExternalLink size={18} />
          </a>
        )}
      </div>
      <div ref={zone} className="flex-1 overflow-auto overscroll-contain bg-ink/5 py-3" data-defile>
        {erreur ? (
          <div className="mx-auto max-w-[420px] px-4 pt-10 text-center">
            <p className="text-[15px] font-semibold">Impossible d&apos;afficher ce PDF ici.</p>
            <a href={pdf.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-[14.5px] font-semibold text-accent">
              L&apos;ouvrir à part
            </a>
          </div>
        ) : !doc || !largeur ? (
          <p className="pt-10 text-center text-[14px] text-muted" role="status">
            Ouverture du PDF…
          </p>
        ) : (
          <div className="flex flex-col gap-3 px-3" style={{ width: l + 24, minWidth: "100%", alignItems: zoom ? "flex-start" : "center" }}>
            {tailles.map((t, i) => (
              <Page key={`${i}-${l}`} doc={doc} numero={i + 1} largeur={l} ratio={t.h / t.l} racine={zone} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/** Une page, dessinée seulement quand elle approche de l'écran. */
function Page({
  doc,
  numero,
  largeur,
  ratio,
  racine,
}: {
  doc: PDFDocumentProxy;
  numero: number;
  largeur: number;
  ratio: number;
  racine: React.RefObject<HTMLDivElement | null>;
}) {
  const toile = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(numero <= 2);

  useEffect(() => {
    const el = toile.current;
    if (!el || visible) return;
    const io = new IntersectionObserver((e) => e[0].isIntersecting && setVisible(true), {
      root: racine.current,
      rootMargin: "800px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [visible, racine]);

  useEffect(() => {
    if (!visible) return;
    let tache: { cancel: () => void } | null = null;
    let annule = false;
    (async () => {
      const page = await doc.getPage(numero);
      const el = toile.current;
      if (annule || !el) return;
      const base = page.getViewport({ scale: 1 });
      // Netteté : la densité de l'écran, sans dépasser ~4 000 px de large.
      const dpr = Math.min(window.devicePixelRatio || 1, 2, 4000 / largeur);
      const vue = page.getViewport({ scale: (largeur / base.width) * dpr });
      el.width = Math.floor(vue.width);
      el.height = Math.floor(vue.height);
      const t = page.render({ canvas: el, viewport: vue });
      tache = t;
      await t.promise.catch(() => {});
    })();
    return () => {
      annule = true;
      tache?.cancel();
    };
  }, [visible, doc, numero, largeur]);

  return (
    <canvas
      ref={toile}
      aria-label={`Page ${numero}`}
      className="block shrink-0 rounded-md bg-surface shadow-card"
      style={{ width: largeur, height: largeur * ratio, background: "#fff" }}
    />
  );
}
