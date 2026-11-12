"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Clock,
  Copy,
  FileDown,
  FileText,
  ImagePlus,
  Mic,
  NotebookPen,
  Pencil,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { ZoneDictee } from "@/components/Dictee";
import { formule, texteBrut } from "@/components/Formule";
import {
  Bouton,
  BoutonIcone,
  Carte,
  Champ,
  EnvoyerAClaude,
  EtatVide,
  PiecesJointes,
  classeSaisie,
  pluriel,
} from "@/components/ui";
import { demandeNote } from "@/lib/contenu";
import { dateLongue } from "@/lib/dates";
import {
  envoyerDocumentNote,
  lienDocumentNote,
  prochainPassage,
  retirerDocumentNote,
  useDemandes,
} from "@/lib/demandes";
import { lienTravail } from "@/lib/liens";
import { encre, pastel, useLuno } from "@/lib/store";
import { useSynchro } from "@/lib/synchro";
import type { DocumentNote, Matiere, NoteMatiere } from "@/lib/types";

/** Mots d'un texte, et durée à l'oral (environ 130 mots par minute). */
function mesure(texte: string) {
  const mots = texteBrut(texte).split(/\s+/).filter(Boolean).length;
  const minutes = mots / 130;
  const oral =
    mots === 0
      ? ""
      : minutes < 1
        ? `${Math.max(10, Math.round((minutes * 60) / 10) * 10)} s à l'oral`
        : `${minutes < 1.75 ? "1" : (Math.round(minutes * 2) / 2).toString().replace(".", ",")} min à l'oral`;
  return { mots, oral };
}

/** Le texte en paragraphes : une ligne vide sépare deux paragraphes. */
const paragraphes = (texte: string) =>
  texte
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const echapper = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Télécharge la note en document Word (.doc) : du HTML que Word, Pages et Google Docs
 * ouvrent directement, avec le titre en tête et un paragraphe par bloc de texte.
 */
function telechargerWord(n: NoteMatiere, matiere: string) {
  const corps = paragraphes(n.texte)
    .map((p) => `<p>${echapper(texteBrut(p)).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${echapper(n.titre || "Note")}</title><style>body{font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.5}h1{font-size:18pt}p.sous{color:#777;font-size:10pt}</style></head><body><h1>${echapper(n.titre || "Note")}</h1><p class="sous">${echapper(matiere)}</p>${corps}</body></html>`;
  const url = URL.createObjectURL(new Blob(["﻿", html], { type: "application/msword" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(n.titre || "Note").replace(/[\\/:*?"<>|]+/g, " ").trim() || "Note"}.doc`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Onglet « Notes » d'une matière : des textes libres (exposé, oral, notes de cours…),
 * écrits, dictés ou tapés par Claude à partir de photos, avec leurs documents joints.
 */
export function VueNotes({ matiere, noteId }: { matiere: Matiere; noteId: string | null }) {
  const notes = useLuno((s) => s.notes);
  const note = notes.find((n) => n.id === noteId && n.matiereId === matiere.id);
  return note ? <VueNote matiere={matiere} note={note} /> : <ListeNotes matiere={matiere} />;
}

function ListeNotes({ matiere }: { matiere: Matiere }) {
  const s = useLuno();
  const router = useRouter();
  const notes = s.notes
    .filter((n) => n.matiereId === matiere.id)
    .sort((a, b) => b.modifie - a.modifie);
  const enCours = useDemandes((x) => x.liste).filter(
    (d) => d.type === "cours" && d.meta.note && d.meta.matiere === matiere.nom && d.statut !== "prete",
  );
  const [precision, setPrecision] = useState("");
  const [pieces, setPieces] = useState<File[]>([]);
  const [envoi, setEnvoi] = useState(false);
  const foncee = encre(matiere.couleur);

  const ouvrir = (id: string, nouvelle = false) =>
    router.replace(lienTravail({ m: matiere.id, o: "notes", n: id }) + (nouvelle ? "&e=1" : ""), {
      scroll: false,
    });

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="surtitre" style={{ color: foncee }}>
              Exposés, oraux, notes de cours
            </p>
            <h2 className="mt-1 text-[24px]">Mes notes en {matiere.nom}</h2>
            <p className="mt-0.5 text-[14px] text-muted">
              {notes.length ? pluriel(notes.length, "note") : "Rien pour l'instant."}
            </p>
          </div>
          <Bouton variante="contour" onClick={() => ouvrir(s.ajouterNote(matiere.id), true)}>
            <Plus size={16} /> Nouvelle note
          </Bouton>
        </div>

        {enCours.map((d) => (
          <p
            key={d.id}
            className={`mb-3 flex items-start gap-2 rounded-2xl border border-dashed border-line px-4 py-3 text-[14px] ${
              d.statut === "erreur" ? "text-bad" : "text-muted"
            }`}
          >
            <Clock size={16} className="mt-0.5 shrink-0" />
            {d.statut === "erreur"
              ? `Claude n'a pas pu taper ton texte${d.erreur ? ` : ${d.erreur}` : ""}`
              : `Texte envoyé (${pluriel(d.meta.images?.length ?? 0, "photo")}) : Claude passe ${prochainPassage()} pour le taper.`}
          </p>
        ))}

        {notes.length === 0 ? (
          <EtatVide
            icone={<NotebookPen size={26} />}
            titre="Pas encore de note"
            texte="Écris ou dicte un texte (un exposé, un oral, des notes prises en classe), ou envoie la photo d'une feuille manuscrite : Claude la tape pour toi."
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {notes.map((n, i) => {
              const { mots, oral } = mesure(n.texte);
              return (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, transform: "translate3d(0, 10px, 0)" }}
                  animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
                  transition={{ delay: Math.min(i, 6) * 0.03 }}
                  className="min-w-0"
                >
                  <button
                    onClick={() => ouvrir(n.id)}
                    className="flex h-full w-full flex-col rounded-[18px] border border-line bg-surface p-5 text-left shadow-card transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/25"
                  >
                    <span className="font-display text-[19px] leading-snug">
                      {n.titre ? formule(n.titre) : <span className="text-muted">Sans titre</span>}
                    </span>
                    <span className="mt-1 text-[12.5px] text-muted">
                      {[
                        dateLongue(n.date),
                        mots ? pluriel(mots, "mot") : "",
                        oral,
                        n.documents.length ? pluriel(n.documents.length, "document") : "",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                    {n.texte.trim() && (
                      <span className="mt-2.5 line-clamp-3 text-[14.5px] leading-relaxed text-ink/75">
                        {texteBrut(n.texte)}
                      </span>
                    )}
                  </button>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>

      <Carte className="h-fit lg:sticky lg:top-24">
        <h3 className="text-[19px]">Faire taper une feuille</h3>
        <p className="mt-1 text-[14px] text-muted">
          Prends en photo ton texte écrit à la main : Claude le tape, sans rien changer, et il
          arrive ici en nouvelle note.
        </p>
        <PiecesJointes fichiers={pieces} setFichiers={setPieces} className="mt-3" />
        <Champ label="Ce que tu veux préciser (facultatif)">
          <ZoneDictee
            rows={2}
            className={classeSaisie + " mt-0"}
            placeholder="Ex. Texte de mon oral d'EMC, corrige juste l'orthographe."
            value={precision}
            changer={setPrecision}
          />
        </Champ>
        <Bouton className="mt-3 w-full" onClick={() => setEnvoi(true)}>
          <Send size={16} /> Envoyer à Claude
        </Bouton>
      </Carte>

      <EnvoyerAClaude
        ouverte={envoi}
        fermer={() => {
          setEnvoi(false);
          setPrecision("");
        }}
        titre="Faire taper une feuille"
        objet={`Texte à taper : ${matiere.nom}`}
        texte={demandeNote(matiere.nom, precision)}
        resultat="ton texte tapé"
        demande={{ type: "cours", meta: { matiere: matiere.nom, note: true } }}
        pieces={pieces}
        setPieces={setPieces}
      />
    </div>
  );
}

function VueNote({ matiere, note }: { matiere: Matiere; note: NoteMatiere }) {
  const s = useLuno();
  const router = useRouter();
  const vide = !note.texte.trim() && !note.titre.trim();
  const [edition, setEdition] = useState(
    () => vide || (typeof window !== "undefined" && new URLSearchParams(location.search).has("e")),
  );
  const [copie, setCopie] = useState(false);
  const foncee = encre(matiere.couleur);
  const { mots, oral } = mesure(note.texte);
  const retour = () => router.replace(lienTravail({ m: matiere.id, o: "notes" }), { scroll: false });

  // Une note créée puis laissée vide ne reste pas dans la liste.
  const noteRef = useRef(note);
  useEffect(() => {
    noteRef.current = note;
  });
  useEffect(
    () => () => {
      const n = noteRef.current;
      if (!n.titre.trim() && !n.texte.trim() && n.documents.length === 0) {
        useLuno.setState((x) => ({ notes: x.notes.filter((y) => y.id !== n.id) }));
      }
    },
    [],
  );

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(
        [note.titre, texteBrut(note.texte)].filter((x) => x.trim()).join("\n\n"),
      );
      setCopie(true);
      setTimeout(() => setCopie(false), 2200);
    } catch {}
  };

  return (
    <div className="mx-auto max-w-[860px]">
      <button
        onClick={retour}
        className="-ml-1 mb-3 inline-flex min-h-11 items-center gap-1.5 px-1 text-[14px] font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> Toutes les notes
      </button>

      <div className="rounded-[22px] border border-line bg-surface shadow-card">
        <div
          className="flex flex-wrap items-center justify-between gap-2 rounded-t-[22px] border-b border-line px-4 py-2.5 sm:px-6"
          style={{ background: pastel(matiere.couleur, 10) }}
        >
          <div role="tablist" aria-label="Affichage de la note" className="inline-flex rounded-full bg-surface p-0.5 shadow-card">
            {[
              { id: false, label: "Lire", icone: <BookOpen size={15} /> },
              { id: true, label: "Modifier", icone: <Pencil size={15} /> },
            ].map((o) => (
              <button
                key={o.label}
                role="tab"
                aria-selected={edition === o.id}
                onClick={() => setEdition(o.id)}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-semibold transition-colors duration-200 ${
                  edition === o.id ? "bg-ink text-bg" : "text-muted hover:text-ink"
                }`}
              >
                {o.icone}
                {o.label}
              </button>
            ))}
          </div>
          <div className="flex items-center">
            <BoutonIcone label={copie ? "Copié" : "Copier le texte"} onClick={() => void copier()}>
              {copie ? <Check size={17} className="text-ok" /> : <Copy size={17} />}
            </BoutonIcone>
            <BoutonIcone label="Télécharger pour Word" onClick={() => telechargerWord(note, matiere.nom)}>
              <FileDown size={17} />
            </BoutonIcone>
            <BoutonIcone
              label="Supprimer la note"
              className="hover:!text-bad"
              onClick={() => {
                s.supprimerNote(note.id);
                retour();
              }}
            >
              <Trash2 size={17} />
            </BoutonIcone>
          </div>
        </div>

        <div className="px-5 pb-7 pt-5 sm:px-10 sm:pt-8">
          {edition ? (
            <>
              <textarea
                aria-label="Titre de la note"
                autoFocus={vide}
                rows={note.titre.length > 22 ? 2 : 1}
                className="w-full resize-none bg-transparent font-display text-[26px] leading-tight outline-none [field-sizing:content] placeholder:text-muted/60 sm:text-[32px]"
                placeholder="Titre de la note"
                value={note.titre}
                onChange={(e) => s.modifierNote(note.id, { titre: e.target.value.replace(/\n/g, " ") })}
              />
              <p className="mb-4 mt-1 flex flex-wrap items-center gap-x-2 text-[12.5px] text-muted">
                <span>{matiere.nom}</span>
                <span aria-hidden>·</span>
                <span>Enregistré automatiquement</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <Mic size={12} /> dicte au micro
                </span>
              </p>
              <ZoneDictee
                aria-label="Texte de la note"
                rows={Math.max(12, note.texte.split("\n").length + Math.ceil(note.texte.length / 38) + 2)}
                className={classeSaisie + " !bg-bg/40 text-[16px] leading-relaxed"}
                placeholder={"Écris ou dicte ton texte.\n\nLaisse une ligne vide entre deux paragraphes."}
                value={note.texte}
                changer={(texte) => s.modifierNote(note.id, { texte })}
              />
            </>
          ) : (
            <article>
              <h2 className="font-display text-[26px] leading-tight sm:text-[32px]">
                {note.titre ? formule(note.titre) : <span className="text-muted">Sans titre</span>}
              </h2>
              <p className="mt-1 text-[12.5px] text-muted">
                {[matiere.nom, dateLongue(note.date), mots ? pluriel(mots, "mot") : "", oral]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <div className="mt-5 flex flex-col gap-4 text-[17px] leading-[1.75] sm:text-[18px]">
                {paragraphes(note.texte).length ? (
                  paragraphes(note.texte).map((p, i) => (
                    <p key={i} className="whitespace-pre-line">
                      {formule(p)}
                    </p>
                  ))
                ) : (
                  <p className="text-muted">
                    Note vide.{" "}
                    <button className="font-semibold text-accent underline-offset-2 hover:underline" onClick={() => setEdition(true)}>
                      Écrire le texte
                    </button>
                  </p>
                )}
              </div>
            </article>
          )}
        </div>
      </div>

      <Documents note={note} couleur={foncee} />
    </div>
  );
}

/** Photos et PDF joints à une note, rangés dans le stockage privé du compte. */
function Documents({ note, couleur }: { note: NoteMatiere; couleur: string }) {
  const s = useLuno();
  const connecte = useSynchro((x) => x.session !== null);
  const [liens, setLiens] = useState<Record<string, string>>({});
  const [envoi, setEnvoi] = useState("");
  const [souci, setSouci] = useState(false);
  const fichier = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!connecte) return;
    let annule = false;
    for (const d of note.documents) {
      if (liens[d.chemin]) continue;
      void lienDocumentNote(d.chemin).then((u) => {
        if (u && !annule) setLiens((l) => ({ ...l, [d.chemin]: u }));
      });
    }
    return () => {
      annule = true;
    };
  }, [connecte, note.documents, liens]);

  const ajouter = async (liste: FileList | null) => {
    const ok = [...(liste ?? [])].filter(
      (f) => f.type.startsWith("image/") || f.type === "application/pdf",
    );
    if (!ok.length) return;
    setSouci(false);
    const nouveaux: DocumentNote[] = [];
    try {
      for (const [i, f] of ok.entries()) {
        setEnvoi(`Envoi ${i + 1}/${ok.length}…`);
        nouveaux.push(await envoyerDocumentNote(note.id, f));
      }
    } catch {
      setSouci(true);
    }
    const actuelle = useLuno.getState().notes.find((n) => n.id === note.id);
    if (nouveaux.length && actuelle)
      s.modifierNote(note.id, { documents: [...actuelle.documents, ...nouveaux] });
    setEnvoi("");
  };

  return (
    <section className="mt-5 rounded-[22px] border border-line bg-surface p-5 shadow-card sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="surtitre" style={{ color: couleur }}>
            Documents
          </p>
          <p className="mt-0.5 text-[14px] text-muted">
            {note.documents.length
              ? pluriel(note.documents.length, "document joint", "documents joints")
              : "Photos de ta feuille, affiche, PDF du prof…"}
          </p>
        </div>
        {connecte && (
          <>
            <input
              ref={fichier}
              type="file"
              accept="image/*,application/pdf"
              multiple
              hidden
              onChange={(e) => {
                void ajouter(e.target.files);
                e.target.value = "";
              }}
            />
            <Bouton variante="contour" disabled={Boolean(envoi)} onClick={() => fichier.current?.click()}>
              <ImagePlus size={16} /> {envoi || "Photo ou PDF"}
            </Bouton>
          </>
        )}
      </div>
      {!connecte && (
        <p className="mt-3 text-[13.5px] text-muted">
          Connecte-toi dans « Mes données » (la roue dentée) pour joindre des documents : ils sont
          rangés dans ton compte, sur tous tes appareils.
        </p>
      )}
      {souci && (
        <p className="mt-3 text-[13.5px] text-bad" role="alert">
          L&apos;envoi a échoué. Vérifie ta connexion et réessaie.
        </p>
      )}
      {note.documents.length > 0 && (
        <ul className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {note.documents.map((d) => (
            <li
              key={d.chemin}
              className="relative aspect-[3/4] overflow-hidden rounded-xl border border-line bg-bg"
            >
              <a
                href={liens[d.chemin] ?? undefined}
                target="_blank"
                rel="noreferrer"
                aria-label={`Ouvrir ${d.nom}`}
                className="block size-full"
              >
                {d.type === "image" && liens[d.chemin] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={liens[d.chemin]} alt={d.nom} className="size-full object-cover" />
                ) : (
                  <span className="flex size-full flex-col items-center justify-center gap-1.5 p-2 text-center">
                    <FileText size={22} className="text-accent" />
                    <span className="line-clamp-3 break-all text-[11px] leading-tight text-muted">{d.nom}</span>
                  </span>
                )}
              </a>
              <button
                type="button"
                onClick={() => {
                  s.modifierNote(note.id, {
                    documents: note.documents.filter((x) => x.chemin !== d.chemin),
                  });
                  void retirerDocumentNote(d.chemin);
                }}
                aria-label={`Retirer ${d.nom}`}
                className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-surface/90 text-ink shadow-card"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
