import type { Lecon } from "@/lib/types";
import { LECON_REDACTION } from "./physique-methode";
import { LECON_DERIVATION } from "./maths-derivation";
import { LECON_DISSERTATION, LECON_ETUDE_CRITIQUE } from "./hggsp-methode";
import { LECON_QUESTION_PROBLEMATISEE } from "./histoire-revolution-empire";

/** Leçons rédigées par Claude à la demande (onglet Apprendre). */
export const LECONS: Lecon[] = [LECON_DERIVATION, LECON_ETUDE_CRITIQUE, LECON_DISSERTATION, LECON_QUESTION_PROBLEMATISEE, LECON_REDACTION];
