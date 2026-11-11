"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudOff, LogOut, RefreshCw } from "lucide-react";
import {
  demarrerSynchro,
  seConnecter,
  seDeconnecter,
  synchroDisponible,
  synchroniser,
  useSynchro,
} from "@/lib/synchro";
import { demarrerDemandes } from "@/lib/demandes";
import { Bouton, Champ, classeSaisie } from "./ui";

/** Lance la synchronisation au chargement du site. */
export function MoteurSynchro() {
  useEffect(() => {
    demarrerSynchro();
    demarrerDemandes();
  }, []);
  return null;
}

/** Petit point sur le bouton « Mes données » : vert quand tout est à jour. */
export function PastilleSynchro() {
  const { session, statut } = useSynchro();
  if (!session) return null;
  const couleur =
    statut === "a-jour" ? "bg-ok" : statut === "erreur" ? "bg-bad" : "bg-muted";
  return (
    <span
      aria-hidden
      className={`absolute right-1.5 top-1.5 size-2 rounded-full ring-2 ring-surface ${couleur} ${
        statut === "synchro" ? "animate-pulse" : ""
      }`}
    />
  );
}

function heure(t: number) {
  return new Date(t).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function messageErreur(e: unknown) {
  const m = e instanceof Error ? e.message : String(e);
  if (/invalid login credentials/i.test(m)) return "Adresse ou mot de passe incorrect.";
  if (/already registered|already exists/i.test(m))
    return "Un compte existe déjà avec cette adresse : connecte-toi plutôt.";
  if (/at least 6|password should/i.test(m))
    return "Le mot de passe doit faire au moins 6 caractères.";
  if (/email not confirmed/i.test(m))
    return "Cette adresse n'est pas encore confirmée : ouvre le mail reçu.";
  if (/failed to fetch|network/i.test(m)) return "Pas de connexion à Internet.";
  return m;
}

/** Section « Synchronisation » de la fenêtre « Mes données ». */
export function CompteSynchro() {
  const { session, statut, derniere } = useSynchro();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [nouveau, setNouveau] = useState(false);
  const [attente, setAttente] = useState(false);
  const [erreur, setErreur] = useState("");
  const [info, setInfo] = useState("");

  if (!synchroDisponible()) return null;

  if (session) {
    const texte =
      statut === "a-jour"
        ? `À jour${derniere ? ` depuis ${heure(derniere)}` : ""}`
        : statut === "synchro"
          ? "Synchronisation…"
          : statut === "hors-ligne"
            ? "Hors connexion : tes changements partiront au retour du réseau."
            : statut === "erreur"
              ? "La synchronisation a échoué. Elle réessaiera toute seule."
              : "";
    return (
      <div className="mb-5 rounded-2xl bg-accent-soft p-4">
        <p className="surtitre mb-1 flex items-center gap-1.5 text-accent">
          {statut === "hors-ligne" || statut === "erreur" ? (
            <CloudOff size={14} />
          ) : (
            <Cloud size={14} />
          )}
          Synchronisé
        </p>
        <p className="break-all text-[15px] font-semibold">{session.user.email}</p>
        <p className="mt-0.5 text-[13.5px] text-muted" role="status">
          {texte}
        </p>
        <p className="mt-2 text-[13px] leading-snug text-muted">
          Tes tâches, DST, matières et ta progression sont les mêmes sur tous les
          appareils connectés à ce compte.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Bouton
            variante="contour"
            className="!py-2"
            disabled={statut === "synchro"}
            onClick={() => void synchroniser()}
          >
            <RefreshCw size={15} /> Synchroniser
          </Bouton>
          <Bouton variante="fantome" className="!py-2" onClick={() => void seDeconnecter()}>
            <LogOut size={15} /> Se déconnecter
          </Bouton>
        </div>
      </div>
    );
  }

  return (
    <form
      className="mb-5 flex flex-col gap-3 rounded-2xl bg-accent-soft p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setErreur("");
        setInfo("");
        setAttente(true);
        try {
          await seConnecter(email.trim(), motDePasse, nouveau);
          if (nouveau && !useSynchro.getState().session)
            setInfo("Compte créé : ouvre le mail de confirmation, puis connecte-toi.");
        } catch (err) {
          setErreur(messageErreur(err));
        } finally {
          setAttente(false);
        }
      }}
    >
      <div>
        <p className="surtitre mb-1 flex items-center gap-1.5 text-accent">
          <Cloud size={14} /> Synchroniser mes appareils
        </p>
        <p className="text-[13.5px] leading-snug text-muted">
          Connecte-toi avec le même compte sur ton téléphone et ton ordinateur : ils
          afficheront les mêmes tâches, DST et révisions. Ce qui est déjà sur cet
          appareil est gardé et réuni avec le compte.
        </p>
      </div>
      <Champ label="Adresse mail">
        <input
          type="email"
          required
          autoComplete="email"
          className={classeSaisie}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Champ>
      <Champ label="Mot de passe">
        <input
          type="password"
          required
          minLength={6}
          autoComplete={nouveau ? "new-password" : "current-password"}
          className={classeSaisie}
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />
      </Champ>
      {erreur && (
        <p className="text-[13.5px] text-bad" role="alert">
          {erreur}
        </p>
      )}
      {info && (
        <p className="text-[13.5px] text-ok" role="status">
          {info}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          className="text-[13.5px] font-semibold text-accent underline-offset-2 hover:underline"
          onClick={() => {
            setNouveau((n) => !n);
            setErreur("");
          }}
        >
          {nouveau ? "J'ai déjà un compte" : "Créer un compte"}
        </button>
        <Bouton type="submit" disabled={attente}>
          {attente ? "Un instant…" : nouveau ? "Créer mon compte" : "Se connecter"}
        </Bouton>
      </div>
    </form>
  );
}
