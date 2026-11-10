"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Check, GraduationCap, RotateCcw } from "lucide-react";
import { genererParcours, repondreTuteur, MODE_IA, type EtapeParcours } from "@/lib/ai";
import { BadgeDemo, Bouton, Carte, Chargement, EnTete, classeSaisie } from "@/components/ui";

const SUGGESTIONS = [
  "Les suites arithmétiques",
  "La photosynthèse",
  "Le subjonctif en espagnol",
  "La Révolution française",
  "Les forces et le mouvement",
  "L'argumentation au bac de français",
];
const NIVEAUX = ["Seconde", "Première", "Terminale"];

type Message = { de: "moi" | "tuteur"; texte: string };

export default function Apprendre() {
  const [sujet, setSujet] = useState("");
  const [niveau, setNiveau] = useState("Première");
  const [parcours, setParcours] = useState<EtapeParcours[] | null>(null);
  const [chargement, setChargement] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [saisie, setSaisie] = useState("");
  const [ecrit, setEcrit] = useState(false);
  const fin = useRef<HTMLDivElement>(null);
  const tours = messages.filter((m) => m.de === "moi").length;
  const etape = parcours ? Math.min(tours, parcours.length - 1) : 0;

  useEffect(() => {
    fin.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, ecrit]);

  const demarrer = async (s: string) => {
    if (!s.trim()) return;
    setSujet(s.trim());
    setChargement(true);
    setParcours(await genererParcours(s.trim()));
    setMessages([
      {
        de: "tuteur",
        texte: `C'est parti pour « ${s.trim()} », niveau ${niveau}. Pour commencer : qu'est-ce que tu sais déjà sur ce sujet ?`,
      },
    ]);
    setChargement(false);
  };

  const envoyer = async () => {
    const texte = saisie.trim();
    if (!texte || ecrit) return;
    setSaisie("");
    setMessages((m) => [...m, { de: "moi", texte }]);
    setEcrit(true);
    const reponse = await repondreTuteur(sujet, tours);
    setMessages((m) => [...m, { de: "tuteur", texte: reponse }]);
    setEcrit(false);
  };

  if (chargement) return <Chargement texte="Préparation de ton parcours…" />;

  if (!parcours) {
    return (
      <div>
        <EnTete titre="Apprendre" sousTitre="Choisis un sujet : un tuteur te l'explique pas à pas, à ton rythme." />
        <Carte className="mx-auto max-w-[680px] !p-8">
          <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <GraduationCap size={28} />
          </div>
          <h2 className="text-[26px] font-bold">Qu&apos;est-ce que tu veux apprendre ?</h2>
          <form
            className="mt-5 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              demarrer(sujet);
            }}
          >
            <input
              autoFocus
              className={classeSaisie + " !py-3.5 !text-[16px]"}
              placeholder="Ex. Les suites arithmétiques"
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
            />
            <Bouton type="submit" disabled={!sujet.trim()} className="shrink-0">
              Commencer
            </Bouton>
          </form>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[13px] font-semibold text-muted">Niveau</span>
            {NIVEAUX.map((n) => (
              <button
                key={n}
                onClick={() => setNiveau(n)}
                className={`rounded-full px-3 py-1 text-[13.5px] font-semibold transition-colors ${
                  niveau === n ? "bg-ink text-bg" : "bg-ink/5 text-muted hover:bg-ink/10"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mb-2.5 mt-7 text-[13px] font-semibold text-muted">Idées</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={s}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                whileHover={{ y: -2 }}
                onClick={() => demarrer(s)}
                className="rounded-full border border-line bg-bg/60 px-3.5 py-1.5 text-[14px] font-medium transition-colors hover:border-accent hover:text-accent"
              >
                {s}
              </motion.button>
            ))}
          </div>
        </Carte>
      </div>
    );
  }

  return (
    <div>
      <EnTete
        titre={sujet}
        sousTitre={`Niveau ${niveau}`}
        action={
          <Bouton
            variante="contour"
            onClick={() => {
              setParcours(null);
              setMessages([]);
              setSujet("");
            }}
          >
            <RotateCcw size={16} /> Autre sujet
          </Bouton>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <Carte className="h-fit !p-3 lg:!p-6">
          <p className="mb-4 hidden text-[13px] font-bold uppercase tracking-wide text-muted lg:block">Ton parcours</p>
          <ol className="flex justify-between gap-2 lg:flex-col lg:gap-4">
            {parcours.map((e, i) => (
              <li key={e.titre} className="flex flex-1 flex-col items-center gap-1 text-center lg:flex-none lg:flex-row lg:items-start lg:gap-3 lg:text-left">
                <motion.span
                  animate={{
                    backgroundColor: i < etape ? "var(--ok)" : i === etape ? "var(--accent)" : "var(--line)",
                    color: i <= etape ? "var(--on-accent)" : "var(--muted)",
                  }}
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
                >
                  {i < etape ? <Check size={14} /> : i + 1}
                </motion.span>
                <div>
                  <p className={`text-[12px] font-semibold lg:text-[15px] lg:font-bold ${i > etape ? "text-muted" : ""}`}>{e.titre}</p>
                  <p className="hidden text-[13px] leading-snug text-muted lg:block">{e.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Carte>

        <Carte className="flex h-[calc(100dvh-455px)] min-h-[240px] flex-col !p-0 lg:h-[min(620px,70dvh)]">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <p className="text-[15px] font-bold">Tuteur</p>
            {MODE_IA === "demo" && <BadgeDemo />}
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                      m.de === "moi" ? "self-end rounded-br-md bg-accent text-on-accent" : "self-start rounded-bl-md bg-bg"
                    }`}
                  >
                    {m.texte}
                  </motion.div>
                ))}
              </AnimatePresence>
              {ecrit && (
                <div className="flex gap-1 self-start rounded-2xl rounded-bl-md bg-bg px-4 py-3.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="size-2 rounded-full bg-muted"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              )}
              <div ref={fin} />
            </div>
          </div>
          <form
            className="flex gap-2 border-t border-line p-3"
            onSubmit={(e) => {
              e.preventDefault();
              envoyer();
            }}
          >
            <input
              className={classeSaisie}
              placeholder="Écris ta réponse…"
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
            />
            <Bouton type="submit" className="!px-3.5" aria-label="Envoyer" disabled={!saisie.trim() || ecrit}>
              <ArrowUp size={18} />
            </Bouton>
          </form>
        </Carte>
      </div>
    </div>
  );
}
