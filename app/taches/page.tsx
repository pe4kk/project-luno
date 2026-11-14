"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarClock, Check, ChevronDown, ClipboardPaste, ListTodo, Plus, Trash2 } from "lucide-react";
import { useLuno } from "@/lib/store";
import { lireListe } from "@/lib/contenu";
import type { Tache } from "@/lib/types";
import { compteARebours, dateLongue, joursAvant } from "@/lib/dates";
import { reconnaitreDate } from "@/lib/echeance";

const fmtCourt = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "numeric" });
const dateCourte = (iso: string) => {
  const [a, m, j] = iso.split("-").map(Number);
  return fmtCourt.format(new Date(a, m - 1, j));
};
/** « Dans 2 jours », « Demain », « Aujourd'hui ». */
const dans = (iso: string) => {
  const j = joursAvant(iso);
  return j === 0 ? "aujourd'hui" : j === 1 ? "demain" : `dans ${j} jours`;
};
/** « Lundi 16 » : le titre d'un groupe. */
const titreJour = (iso: string) => {
  const j = joursAvant(iso);
  if (j === 0) return "Aujourd'hui";
  if (j === 1) return "Demain";
  return dateLongue(iso).replace(/ (janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)$/, "");
};

type Groupe = { cle: string; titre: string; detail?: string; retard?: boolean; taches: Tache[] };

/** En retard, puis un groupe par jour (du plus proche au plus loin), puis « Sans date ». */
function grouper(taches: Tache[]): Groupe[] {
  const retard = taches.filter((t) => t.echeance && joursAvant(t.echeance) < 0);
  const datees = taches.filter((t) => t.echeance && joursAvant(t.echeance) >= 0);
  const sans = taches.filter((t) => !t.echeance);
  const groupes: Groupe[] = [];
  if (retard.length)
    groupes.push({
      cle: "retard",
      titre: "En retard",
      retard: true,
      taches: retard.sort((a, b) => a.echeance.localeCompare(b.echeance)),
    });
  const jours = [...new Set(datees.map((t) => t.echeance))].sort();
  for (const iso of jours) {
    const l = datees.filter((t) => t.echeance === iso);
    groupes.push({
      cle: iso,
      titre: titreJour(iso),
      detail: [joursAvant(iso) > 1 ? dans(iso) : "", l.length > 1 ? pluriel(l.length, "tâche") : ""].filter(Boolean).join(" · "),
      taches: l,
    });
  }
  if (sans.length) groupes.push({ cle: "sans", titre: "Sans date", taches: sans });
  return groupes;
}

/** Le texte de la tâche, avec le mot qui donne la date souligné en cuivre. */
function TexteSouligne({ texte, fait }: { texte: string; fait?: boolean }) {
  const r = fait ? null : reconnaitreDate(texte);
  if (!r) return <>{texte}</>;
  return (
    <>
      {texte.slice(0, r.debut)}
      <span className="underline decoration-copper decoration-2 underline-offset-4">{texte.slice(r.debut, r.fin)}</span>
      {texte.slice(r.fin)}
    </>
  );
}
import { Bouton, Champ, EnTete, EtatVide, Fenetre, classeSaisie, pluriel } from "@/components/ui";

export default function Taches() {
  const { taches, ajouterTaches, modifierTache, supprimerTache, effacerTachesFaites } = useLuno();
  const [saisie, setSaisie] = useState("");
  const [collage, setCollage] = useState<string | null>(null);
  const [edition, setEdition] = useState<Tache | null>(null);
  const [voirFaites, setVoirFaites] = useState(false);

  const aFaire = taches.filter((t) => !t.fait);
  const groupes = grouper(aFaire);
  const reconnue = saisie.trim() ? reconnaitreDate(saisie) : null;
  const faites = taches.filter((t) => t.fait);
  const lignes = collage ? lireListe(collage) : [];

  return (
    <div className="mx-auto max-w-[760px]">
      <EnTete
        titre="À faire"
        sousTitre="Tes devoirs et tout ce que tu ne veux pas oublier."
        action={
          <Bouton variante="contour" onClick={() => setCollage("")}>
            <ClipboardPaste size={16} /> Coller une liste
          </Bouton>
        }
      />

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (ajouterTaches([saisie])) setSaisie("");
        }}
      >
        <input
          aria-label="Nouvelle tâche"
          required
          className={classeSaisie + " !bg-surface"}
          placeholder="Ex. Exercice 12 de maths pour jeudi"
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
        />
        <Bouton type="submit" className="shrink-0">
          <Plus size={17} /> Ajouter
        </Bouton>
      </form>
      <p className="mb-5 mt-1.5 min-h-5 px-1 text-[12.5px] text-muted" aria-live="polite">
        {reconnue ? (
          <>
            Échéance reconnue :{" "}
            <span className="rounded-full bg-accent-soft px-2 py-px font-semibold text-accent">{dateCourte(reconnue.iso)}</span>
            {" · "}tu pourras la changer en touchant la tâche
          </>
        ) : (
          "Écris le jour dans la tâche (« pour vendredi », « demain », « 20/11 ») : elle se range toute seule."
        )}
      </p>

      {taches.length === 0 ? (
        <EtatVide
          icone={<ListTodo size={26} />}
          titre="Rien à faire pour l'instant"
          texte="Écris une tâche ci-dessus, ou colle une liste entière : chaque ligne devient une tâche. Tu peux aussi dicter tes tâches à Claude, qui te renvoie une liste propre à coller ici."
        />
      ) : (
        <>
          {aFaire.length === 0 && (
            <p className="mb-4 rounded-2xl bg-accent-soft px-4 py-3 text-[14.5px]">
              <strong>Tout est fait.</strong> Rien ne reste en attente.
            </p>
          )}
          {groupes.map((g) => (
            <section key={g.cle} className="mb-4">
              <div className="mb-1.5 flex items-baseline justify-between gap-3 px-1">
                <h2 className={`font-display text-[19px] ${g.retard ? "text-bad" : ""}`}>{g.titre}</h2>
                {g.detail && <span className="text-[12.5px] text-muted">{g.detail}</span>}
              </div>
              <ul className="flex flex-col gap-2">
                <AnimatePresence initial={false}>
                  {g.taches.map((t) => (
                    <Ligne
                      key={t.id}
                      t={t}
                      groupe
                      basculer={() => modifierTache(t.id, { fait: true })}
                      ouvrir={() => setEdition(t)}
                      dater={(iso) => modifierTache(t.id, { echeance: iso })}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </section>
          ))}

          {faites.length > 0 && (
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => setVoirFaites((v) => !v)}
                  aria-expanded={voirFaites}
                  className="inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-muted"
                >
                  <ChevronDown size={16} className={`transition-transform ${voirFaites ? "" : "-rotate-90"}`} />
                  {pluriel(faites.length, "tâche terminée", "tâches terminées")}
                </button>
                {voirFaites && (
                  <Bouton variante="fantome" onClick={effacerTachesFaites}>
                    <Trash2 size={15} /> Effacer
                  </Bouton>
                )}
              </div>
              {voirFaites && (
                <ul className="flex flex-col gap-2">
                  <AnimatePresence initial={false}>
                    {faites.map((t) => (
                      <Ligne key={t.id} t={t} basculer={() => modifierTache(t.id, { fait: false })} ouvrir={() => setEdition(t)} />
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          )}
        </>
      )}

      {/* Coller une liste */}
      <Fenetre ouverte={collage !== null} fermer={() => setCollage(null)} titre="Coller une liste">
        <p className="text-[14.5px] text-muted">
          Une tâche par ligne. Les tirets, puces et numéros en début de ligne sont retirés tout seuls ; une
          date entre parenthèses en fin de ligne, comme « (13/11) », devient l&apos;échéance.
        </p>
        <textarea
          autoFocus
          rows={7}
          aria-label="Liste à coller"
          className={classeSaisie + " mt-3"}
          placeholder={"- Réviser le thème 4 d'HGGSP\n- Lire « Ma Bohème » (14/11)\n- Rendre le DM de maths (ven. 13/11)"}
          value={collage ?? ""}
          onChange={(e) => setCollage(e.target.value)}
        />
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-[13.5px] text-muted">{pluriel(lignes.length, "tâche")} à ajouter</span>
          <Bouton
            disabled={lignes.length === 0}
            onClick={() => {
              ajouterTaches(lignes);
              setCollage(null);
            }}
          >
            Ajouter
          </Bouton>
        </div>
      </Fenetre>

      {/* Modifier une tâche */}
      {edition && (
        <FenetreTache
          key={edition.id}
          t={edition}
          fermer={() => setEdition(null)}
          enregistrer={(p) => modifierTache(edition.id, p)}
          supprimer={() => supprimerTache(edition.id)}
        />
      )}
    </div>
  );
}

function Ligne({
  t,
  basculer,
  ouvrir,
  groupe = false,
  dater,
}: {
  t: Tache;
  basculer: () => void;
  ouvrir: () => void;
  /** Dans un groupe par jour : la date est déjà dans le titre du groupe. */
  groupe?: boolean;
  /** Pour une tâche sans date qui en mentionne une : la lui donner d'un toucher. */
  dater?: (iso: string) => void;
}) {
  const retard = !t.fait && t.echeance && joursAvant(t.echeance) < 0;
  const suggestion = !t.fait && !t.echeance && dater ? reconnaitreDate(t.texte) : null;
  return (
    <motion.li
      initial={{ opacity: 0, transform: "translate3d(0, 8px, 0)" }}
      animate={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
      exit={{ opacity: 0, transform: "translate3d(24px, 0, 0)" }}
      transition={{ duration: 0.2 }}
      className="flex items-stretch rounded-2xl border border-line bg-surface shadow-card"
    >
      <button
        onClick={basculer}
        role="checkbox"
        aria-checked={t.fait}
        aria-label={t.fait ? `Remettre à faire : ${t.texte}` : `Marquer comme fait : ${t.texte}`}
        className="flex w-14 shrink-0 items-center justify-center"
      >
        <span
          className={`flex size-6 items-center justify-center rounded-full border-2 transition-colors ${
            t.fait ? "border-ok bg-ok text-surface" : "border-ink/35"
          }`}
        >
          {t.fait && <Check size={14} strokeWidth={3} />}
        </span>
      </button>
      <button onClick={ouvrir} className="min-w-0 flex-1 py-3 pr-4 text-left" aria-label={`Modifier : ${t.texte}`}>
        <span className={`block text-[15.5px] leading-snug ${t.fait ? "text-muted line-through" : ""}`}>
          <TexteSouligne texte={t.texte} fait={t.fait} />
        </span>
        {t.echeance && (!groupe || retard) && (
          <span
            className={`mt-1 inline-flex items-center gap-1 text-[12.5px] font-semibold ${
              retard ? "text-bad" : "text-muted"
            }`}
          >
            <CalendarClock size={12} /> {dateLongue(t.echeance)}
            {!t.fait && ` · ${retard ? "en retard" : compteARebours(t.echeance)}`}
          </span>
        )}
      </button>
      {suggestion && (
        <button
          onClick={() => dater!(suggestion.iso)}
          className="mr-2 self-center whitespace-nowrap rounded-full bg-accent-soft px-2.5 py-1.5 text-[12px] font-semibold text-accent transition-colors hover:bg-accent hover:text-on-accent"
        >
          Mettre au {dateCourte(suggestion.iso)}
        </button>
      )}
    </motion.li>
  );
}

function FenetreTache({
  t,
  fermer,
  enregistrer,
  supprimer,
}: {
  t: Tache;
  fermer: () => void;
  enregistrer: (p: Partial<Tache>) => void;
  supprimer: () => void;
}) {
  const [texte, setTexte] = useState(t.texte);
  const [echeance, setEcheance] = useState(t.echeance);
  return (
    <Fenetre ouverte fermer={fermer} titre="Modifier la tâche">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!texte.trim()) return;
          enregistrer({ texte: texte.trim(), echeance });
          fermer();
        }}
      >
        <Champ label="Tâche">
          <textarea autoFocus required rows={2} className={classeSaisie} value={texte} onChange={(e) => setTexte(e.target.value)} />
        </Champ>
        <Champ label="Pour le (facultatif)">
          <input type="date" className={classeSaisie} value={echeance} onChange={(e) => setEcheance(e.target.value)} />
        </Champ>
        <div className="flex items-center justify-between">
          <Bouton
            type="button"
            variante="fantome"
            className="!text-bad"
            onClick={() => {
              supprimer();
              fermer();
            }}
          >
            <Trash2 size={16} /> Supprimer
          </Bouton>
          <Bouton type="submit">Enregistrer</Bouton>
        </div>
      </form>
    </Fenetre>
  );
}
