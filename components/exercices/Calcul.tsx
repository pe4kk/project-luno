"use client";

import { useState } from "react";
import { AvecBrouillon } from "@/components/Brouillon";
import { motion } from "motion/react";
import { Eye, RefreshCw, X } from "lucide-react";
import { formule } from "@/components/Formule";
import { SaisieFormule } from "@/components/SaisieFormule";
import { Bouton, BoutonIcone, classeSaisie } from "@/components/ui";
import { remplir, tirer, verifier, type Verdict, type Version } from "@/lib/calcul";
import type { Calcul } from "@/lib/types";

/** Valeur numérique + unité, comme la ligne « A.N. » d'une copie. */
export function ChampAN({
  calcul,
  valeur,
  unite,
  changer,
  desactive = false,
}: {
  calcul: Calcul;
  valeur: string;
  unite: string;
  changer: (valeur: string, unite: string) => void;
  desactive?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 text-[15px] font-semibold">{formule(calcul.inconnue)} =</span>
      <input
        inputMode="decimal"
        aria-label={`Valeur de ${calcul.inconnue}`}
        placeholder="ex. 2,9 ou 7,5×10^3"
        disabled={desactive}
        value={valeur}
        onChange={(e) => changer(e.target.value, unite)}
        className={classeSaisie + " min-w-0 flex-1"}
      />
      <select
        aria-label="Unité"
        disabled={desactive}
        value={unite}
        onChange={(e) => changer(valeur, e.target.value)}
        className={classeSaisie + " !w-auto shrink-0 !px-2.5"}
      >
        <option value="">unité</option>
        {calcul.unitesProposees.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Retour détaillé sur une A.N. : valeur, unité, chiffres significatifs. */
export function RetourAN({ verdict, version }: { verdict: Verdict; version: Version }) {
  const tout = verdict.valeur && verdict.unite && verdict.cs;
  const lignes = [
    verdict.valeur ? "✓ Valeur juste." : "✗ La valeur ne correspond pas : reprends ton expression littérale et tes conversions.",
    verdict.unite ? "✓ Unité juste." : "✗ Unité : pense à celle de la grandeur cherchée.",
    verdict.cs
      ? `✓ ${version.cs} chiffres significatifs, comme la donnée la moins précise.`
      : `✗ Tu as écrit ${verdict.csDonnes} chiffre${verdict.csDonnes > 1 ? "s" : ""} significatif${verdict.csDonnes > 1 ? "s" : ""} : il en faut ${version.cs}, comme la donnée la moins précise.`,
  ];
  return (
    <div className={`mt-3 rounded-xl p-3.5 text-[14px] leading-relaxed ${tout ? "bg-ok/10" : "bg-bad/10"}`} role="status">
      {lignes.map((l) => (
        <p key={l} className={l.startsWith("✓") ? "text-ok" : "text-bad"}>
          {l}
        </p>
      ))}
      {!tout && <p className="mt-1.5 font-semibold text-ink">Ton prof attend : {verdict.attendu}</p>}
    </div>
  );
}

/** Un calcul à valeurs changeantes : expression littérale, A.N., puis nouvelles valeurs. */
export function LecteurCalcul({ calcul, quitter }: { calcul: Calcul; quitter: () => void }) {
  const [version, setVersion] = useState(() => tirer(calcul));
  const [numero, setNumero] = useState(1);
  const [litterale, setLitterale] = useState("");
  const [litteraleVue, setLitteraleVue] = useState(false);
  const [valeur, setValeur] = useState("");
  const [unite, setUnite] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [illisible, setIllisible] = useState(false);
  const [methode, setMethode] = useState(false);

  const nouvelle = () => {
    setVersion(tirer(calcul));
    setNumero((n) => n + 1);
    setValeur("");
    setUnite("");
    setVerdict(null);
    setMethode(false);
    // L'expression littérale ne change pas avec les valeurs : on la garde.
  };

  return (
    <AvecBrouillon
      cle={`calc-${calcul.id}-${numero}`}
      cs={version.cs}
      versAN={(t) => {
        setValeur(t);
        setVerdict(null);
        setIllisible(false);
      }}
    >
    <div className="mx-auto max-w-[640px]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-ink/5 px-3 py-1 text-[12.5px] font-semibold text-muted">
          Version n° {numero}
        </span>
        <BoutonIcone label="Quitter le calcul" onClick={quitter} className="-mr-2">
          <X size={18} />
        </BoutonIcone>
      </div>
      <motion.div
        key={numero}
        initial={{ opacity: 0, transform: "translate3d(0, 10px, 0)" }}
        animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
        className="rounded-[18px] border border-line border-l-4 bg-surface p-5 shadow-card"
        style={{ borderLeftColor: "var(--copper)" }}
      >
        <p className="surtitre text-accent">Énoncé</p>
        <h2 className="mt-1 text-[24px] leading-tight">{calcul.titre}</h2>
        <p className="mt-2 text-[15px] leading-relaxed">{formule(remplir(calcul.enonce, version))}</p>
        <p className="mt-2 text-[15px] font-semibold leading-relaxed">{formule(remplir(calcul.question, version))}</p>
      </motion.div>

      <div className="mt-4 rounded-[18px] border border-line bg-surface p-5 shadow-card">
        <p className="text-[15px] font-semibold">1. Expression littérale</p>
        <p className="text-[13px] text-muted">Avec des lettres seulement, avant le moindre nombre.</p>
        <div className="mt-2">
          <SaisieFormule
            label="Expression littérale"
            valeur={litterale}
            changer={setLitterale}
            placeholder={`${calcul.inconnue.replace(/\{\{|\}\}/g, "")} = …`}
          />
        </div>
        {!litteraleVue ? (
          <Bouton variante="contour" className="mt-2 w-full !py-2" onClick={() => setLitteraleVue(true)}>
            <Eye size={16} /> Comparer avec la bonne
          </Bouton>
        ) : (
          <p className="mt-2 rounded-xl bg-accent-soft px-3.5 py-2.5 text-[15px]">
            <span className="mr-2 text-[12px] font-semibold uppercase tracking-wider text-accent">Encadrée</span>
            {formule(calcul.litterale)}
          </p>
        )}

        <p className="mt-5 text-[15px] font-semibold">2. A.N.</p>
        <p className="text-[13px] text-muted">Résultat avec son unité, au bon nombre de chiffres significatifs.</p>
        <div className="mt-2">
          <ChampAN
            calcul={calcul}
            valeur={valeur}
            unite={unite}
            changer={(v, u) => {
              setValeur(v);
              setUnite(u);
              setVerdict(null);
              setIllisible(false);
            }}
          />
        </div>
        {illisible && <p className="mt-2 text-[13.5px] text-bad">Écris un nombre, par exemple 2,9 ou 7,5×10^3.</p>}
        {verdict && <RetourAN verdict={verdict} version={version} />}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Bouton
            onClick={() => {
              const v = verifier(calcul, version, valeur, unite);
              if (!v) return setIllisible(true);
              setVerdict(v);
            }}
          >
            Vérifier
          </Bouton>
          <Bouton variante="contour" onClick={() => setMethode((m) => !m)}>
            {methode ? "Cacher" : "Voir"} la méthode
          </Bouton>
        </div>
        {methode && (
          <p className="mt-3 whitespace-pre-line rounded-xl bg-bg/70 p-3.5 text-[14.5px] leading-relaxed">
            {formule(remplir(calcul.methode, version))}
          </p>
        )}
      </div>

      <Bouton className="mt-4 w-full" onClick={nouvelle}>
        <RefreshCw size={16} /> Nouvelles valeurs
      </Bouton>
      <p className="mt-2 text-center text-[13px] text-muted">
        Même situation, autres nombres : refais la méthode jusqu&apos;à ce qu&apos;elle devienne automatique.
      </p>
    </div>
    </AvecBrouillon>
  );
}
