"use client";

import { useEffect, useRef, useState, type TextareaHTMLAttributes } from "react";
import { Mic, Square } from "lucide-react";

/**
 * Dictée vocale avec la reconnaissance de la voix du navigateur (Safari, Chrome, Edge) :
 * gratuite, sans clé, en français. Là où elle manque (Firefox, certaines apps installées
 * sur l'écran d'accueil), on rappelle le micro du clavier du téléphone.
 */

type Resultat = { isFinal: boolean; 0: { transcript: string } };
type Evenement = { resultIndex: number; results: ArrayLike<Resultat> };
type Reconnaissance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: Evenement) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type Constructeur = new () => Reconnaissance;

const constructeur = (): Constructeur | null => {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: Constructeur; webkitSpeechRecognition?: Constructeur };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

/** Ajoute un morceau dicté à la fin d'un texte, avec l'espace et la majuscule qu'il faut. */
function coller(texte: string, morceau: string) {
  const m = morceau.trim();
  if (!m) return texte;
  const fin = texte.trimEnd();
  const debutPhrase = !fin || /[.!?\n]$/.test(fin);
  const mot = debutPhrase ? m[0].toUpperCase() + m.slice(1) : m;
  if (!texte) return mot;
  return texte + (/\s$/.test(texte) ? "" : " ") + mot;
}

export function useDictee(ajouter: (morceau: string) => void) {
  const [ecoute, setEcoute] = useState(false);
  const [provisoire, setProvisoire] = useState("");
  const [souci, setSouci] = useState("");
  const reco = useRef<Reconnaissance | null>(null);
  const rappel = useRef(ajouter);
  useEffect(() => {
    rappel.current = ajouter;
  });
  useEffect(() => () => reco.current?.stop(), []);

  const arreter = () => reco.current?.stop();

  const demarrer = () => {
    const C = constructeur();
    if (!C) {
      setSouci("Dictée indisponible ici : touche le micro 🎤 du clavier de ton téléphone.");
      return;
    }
    const r = new C();
    r.lang = "fr-FR";
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e) => {
      let attente = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const x = e.results[i];
        if (x.isFinal) rappel.current(x[0].transcript);
        else attente += x[0].transcript;
      }
      setProvisoire(attente);
    };
    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed")
        setSouci("Micro refusé : autorise-le dans les réglages, ou utilise le micro 🎤 du clavier.");
      else if (e.error === "no-speech") setSouci("Je n'ai rien entendu. Réessaie en parlant plus près.");
      else if (e.error !== "aborted") setSouci("La dictée s'est arrêtée. Réessaie, ou utilise le micro 🎤 du clavier.");
    };
    r.onend = () => {
      setEcoute(false);
      setProvisoire("");
      reco.current = null;
    };
    try {
      r.start();
      reco.current = r;
      setSouci("");
      setEcoute(true);
    } catch {
      setSouci("Dictée indisponible ici : touche le micro 🎤 du clavier de ton téléphone.");
    }
  };

  return { ecoute, provisoire, souci, basculer: () => (ecoute ? arreter() : demarrer()) };
}

/** Bouton micro : touche pour dicter, touche encore pour arrêter. */
export function BoutonDictee({
  ecoute,
  basculer,
  className = "",
}: {
  ecoute: boolean;
  basculer: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={basculer}
      aria-pressed={ecoute}
      aria-label={ecoute ? "Arrêter la dictée" : "Dicter à la voix"}
      title={ecoute ? "Arrêter la dictée" : "Dicter à la voix"}
      className={`relative flex size-10 items-center justify-center rounded-full transition-colors duration-200 ${
        ecoute ? "bg-accent text-on-accent" : "bg-ink/5 text-muted hover:bg-ink/10 hover:text-ink"
      } ${className}`}
    >
      {ecoute && <span aria-hidden className="dictee-onde absolute inset-0 rounded-full bg-accent" />}
      <span className="relative">{ecoute ? <Square size={14} fill="currentColor" /> : <Mic size={18} />}</span>
    </button>
  );
}

/**
 * Zone de texte avec un bouton micro dans le coin : ce que l'on dit s'ajoute à la fin.
 * Mêmes propriétés qu'un `<textarea>`, mais `changer` reçoit directement le texte.
 */
export function ZoneDictee({
  value,
  changer,
  className = "",
  ...props
}: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> & {
  value: string;
  changer: (v: string) => void;
}) {
  const valeur = useRef(value);
  useEffect(() => {
    valeur.current = value;
  });
  const { ecoute, provisoire, souci, basculer } = useDictee((m) => {
    valeur.current = coller(valeur.current, m);
    changer(valeur.current);
  });
  return (
    <div>
      <div className="relative">
        <textarea {...props} value={value} onChange={(e) => changer(e.target.value)} className={`${className} pr-14`} />
        <span className="absolute bottom-2 right-2">
          <BoutonDictee ecoute={ecoute} basculer={basculer} />
        </span>
      </div>
      {(ecoute || souci) && (
        <p className={`mt-1.5 text-[13px] ${souci ? "text-bad" : "text-accent"}`} role="status" aria-live="polite">
          {souci || (provisoire ? `« ${provisoire} »` : "Je t'écoute… parle, puis touche ■ pour arrêter.")}
        </p>
      )}
    </div>
  );
}
