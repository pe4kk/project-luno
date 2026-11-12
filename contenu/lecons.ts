import type { Lecon } from "@/lib/types";
import { LECON_REDACTION } from "./physique-methode";
import { LECON_DERIVATION } from "./maths-derivation";
import { LECON_DISSERTATION, LECON_ETUDE_CRITIQUE } from "./hggsp-methode";

/** Leçons rédigées par Claude à la demande (onglet Apprendre). */
export const LECONS: Lecon[] = [LECON_DERIVATION, LECON_ETUDE_CRITIQUE, LECON_DISSERTATION, LECON_REDACTION];
