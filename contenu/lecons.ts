import type { Lecon } from "@/lib/types";
import { LECON_REDACTION } from "./physique-methode";
import { LECON_DERIVATION } from "./maths-derivation";

/** Leçons rédigées par Claude à la demande (onglet Apprendre). */
export const LECONS: Lecon[] = [LECON_DERIVATION, LECON_REDACTION];
