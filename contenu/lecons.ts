import type { Lecon } from "@/lib/types";
import { LECON_REDACTION } from "./physique-methode";

/** Leçons rédigées par Claude à la demande (onglet Apprendre). */
export const LECONS: Lecon[] = [
  LECON_REDACTION,
  {
    id: "photosynthese",
    titre: "La photosynthèse",
    matiere: "SVT",
    niveau: "Seconde",
    duree: "8 min",
    intro:
      "Comment une plante fabrique-t-elle sa propre matière à partir d'air, d'eau et de lumière ? On avance en quatre étapes, avec une question à chaque fois pour vérifier que c'est clair.",
    etapes: [
      {
        titre: "L'idée générale",
        texte: [
          "Une plante verte ne mange pas : elle fabrique elle-même sa matière organique. On dit qu'elle est autotrophe.",
          "Pour cela, elle utilise l'énergie de la lumière pour transformer du dioxyde de carbone (CO₂) et de l'eau (H₂O) en glucose, un sucre. Cette transformation s'appelle la photosynthèse.",
        ],
        exemple:
          "Un arbre de plusieurs tonnes a construit l'essentiel de sa masse à partir du CO₂ de l'air, pas à partir de la terre.",
        question: {
          q: "D'où vient le carbone qui compose le bois d'un arbre ?",
          r: "Du dioxyde de carbone de l'air, fixé par la photosynthèse.",
        },
      },
      {
        titre: "Le bilan",
        texte: [
          "On résume la photosynthèse par une équation bilan : 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂, en présence de lumière.",
          "Ce qui entre : du dioxyde de carbone, de l'eau et de l'énergie lumineuse. Ce qui sort : du glucose, gardé par la plante, et du dioxygène, rejeté dans l'air.",
        ],
        question: {
          q: "Quel gaz la photosynthèse rejette-t-elle ?",
          r: "Du dioxygène (O₂). Il provient de l'eau utilisée par la plante.",
        },
      },
      {
        titre: "Où ça se passe",
        texte: [
          "La photosynthèse a lieu dans les cellules des feuilles, à l'intérieur d'organites appelés chloroplastes.",
          "Les chloroplastes contiennent la chlorophylle, un pigment vert qui capte la lumière. C'est elle qui donne leur couleur aux feuilles.",
          "Le CO₂ entre par de petits orifices de la feuille, les stomates ; l'eau arrive des racines par les vaisseaux de la plante.",
        ],
        question: {
          q: "Quel pigment capte l'énergie lumineuse ?",
          r: "La chlorophylle, contenue dans les chloroplastes.",
        },
      },
      {
        titre: "Pourquoi c'est important",
        texte: [
          "La matière organique produite nourrit la plante, puis les animaux qui la mangent : les plantes sont à la base de presque toutes les chaînes alimentaires. On les appelle des producteurs primaires.",
          "La photosynthèse produit aussi le dioxygène que respirent la plupart des êtres vivants, et elle retire du CO₂ de l'atmosphère.",
        ],
        question: {
          q: "Pourquoi dit-on que les plantes sont des producteurs primaires ?",
          r: "Parce qu'elles fabriquent de la matière organique à partir de matière minérale, et que les autres êtres vivants en dépendent pour se nourrir.",
        },
      },
    ],
  },
];
