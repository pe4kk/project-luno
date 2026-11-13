import type { DefinitionCours } from "@/lib/types";
import {
  ENCADREMENT,
  TRAJECTOIRES,
  VITESSE_INSTANTANEE,
  VITESSE_MOYENNE,
} from "./schemas-physique";
import { SECANTE, TANGENTE_EQUATION, VALEUR_ABSOLUE } from "./schemas-maths";

/**
 * Onglet « Déf » des chapitres publiés : les définitions et propriétés telles qu'elles
 * sont écrites dans les cours (polycopiés et PDF du prof, fiches reprises de Claude Docs),
 * relevées le 2026-11-12. Pour un nouveau cours, recopier les encadrés « Définition »,
 * « Propriété », « Loi »… mot pour mot, dans l'ordre du cours.
 */

const d = (terme: string, texte: string, precision?: string): DefinitionCours => ({
  type: "definition",
  terme,
  texte,
  ...(precision ? { precision } : {}),
});
const p = (terme: string, texte: string, precision?: string): DefinitionCours => ({
  type: "propriete",
  terme,
  texte,
  ...(precision ? { precision } : {}),
});

// ————————————————————————————— Physique-Chimie —————————————————————————————

export const DEF_PC_CHAP9: DefinitionCours[] = [
  d("Système", "Le système est l'objet dont on étudie le mouvement."),
  d(
    "Point matériel",
    "Pour simplifier l'étude, on modélise le système mobile par un seul point particulier, appelé « point matériel », en général le centre de gravité du système, auquel on associe toute la masse m du système.",
    "La modélisation d'un système par un point matériel peut toutefois faire perdre des informations sur le mouvement (exemple : la rotation d'un marteau qui tourne sur lui-même).",
  ),
  d(
    "Référentiel",
    "Le référentiel est l'objet de référence, supposé fixe, par rapport auquel on étudie le mouvement du système. On lui associe toujours :\n• un repère d'espace pour décrire les positions du système (exemple : le repère cartésien) ;\n• une horloge (repère temporel) pour mesurer, à partir d'une origine t = 0, les instants t correspondant aux positions du système.",
    "Terrestre : mouvements à la surface de la Terre, de durée inférieure à la durée de rotation de la Terre. Géocentrique : à l'échelle de la planète (Lune, satellites). Héliocentrique : à l'échelle du système solaire.",
  ),
  p("Relativité du mouvement", "Le mouvement d'un système dépend du référentiel."),
  d(
    "Position d'un point matériel",
    "La position d'un point matériel est définie par ses coordonnées définies dans un repère d'espace gradué à l'aide d'une échelle spatiale adaptée. On associe aux coordonnées du point mobile un instant t compté à partir d'une origine des temps t = 0.",
  ),
  d(
    "Chronophotographie",
    "Une chronophotographie est une succession de photographies prises à intervalles de temps égaux, permettant de décomposer un mouvement.",
  ),
  {
    type: "definition",
    terme: "Trajectoire d'un point matériel",
    texte:
      "La trajectoire d'un point matériel en mouvement est une courbe orientée qui indique le sens et la direction du mouvement. Cette courbe traduit l'ensemble des positions successives occupées par ce point au cours de son mouvement.",
    precision: "Trajectoire rectiligne : une droite. Circulaire : un cercle. Curviligne : une courbe.",
    schema: TRAJECTOIRES,
  },
  d(
    "Vecteur déplacement",
    "2 positions successives voisines M et M' prises par un point du système définissent le vecteur MM'⃗ appelé « vecteur déplacement ». Il se représente par un segment orienté (flèche dans le sens du mouvement) qui relie le point de départ et le point d'arrivée.",
  ),
  {
    type: "formule",
    terme: "Vecteur vitesse moyenne",
    texte:
      "Pour un parcours d'un point M à un point M', le vecteur vitesse moyenne v⃗ d'un point matériel est tel que : v⃗ = {{MM'⃗ // Δt}}, avec MM'⃗ le vecteur déplacement et Δt la durée du parcours de M à M'.",
    schema: VITESSE_MOYENNE,
  },
  p("Tangence", "Le vecteur vitesse est toujours tangent à la trajectoire au point considéré."),
  {
    type: "formule",
    terme: "Vecteur vitesse instantanée",
    texte:
      "Si on décompose la trajectoire d'un point en une succession de positions [M₀, M₁, …, Mᵢ, Mᵢ₊₁], le vecteur vitesse v⃗ᵢ à l'instant tᵢ, appelé « vecteur vitesse instantanée », est défini par : v⃗ᵢ = {{MᵢMᵢ₊₁⃗ // tᵢ₊₁ − tᵢ}}, avec tᵢ₊₁ − tᵢ la durée de parcours entre Mᵢ et Mᵢ₊₁ (en s) et MᵢMᵢ₊₁⃗ le vecteur déplacement (en m).",
    schema: VITESSE_INSTANTANEE,
  },
  p(
    "Caractéristiques du vecteur vitesse en Mᵢ",
    "• Sa direction : celle du vecteur MᵢMᵢ₊₁⃗ (donc celle du segment [MᵢMᵢ₊₁]) ;\n• son sens : celui du mouvement ;\n• sa norme : proportionnelle, selon l'échelle choisie pour représenter les vitesses, à la valeur de la vitesse instantanée vᵢ. Une vitesse s'exprime en m/s.",
  ),
  p(
    "Caractérisation du mouvement",
    "La variation du vecteur vitesse permet de caractériser un mouvement : dans le cas d'une trajectoire rectiligne,\n• si le vecteur vitesse ne varie pas : le mouvement est rectiligne uniforme ;\n• si le vecteur vitesse varie : le mouvement est rectiligne non uniforme.",
  ),
  d(
    "Vitesse (fiche méthode Euler)",
    "La vitesse est le taux de variation de la position (en mathématiques, on parle de dérivée de la position). Une dérivée (ou un taux de variation) indique comment varie la position le long de la trajectoire.",
    "Uniforme : taux de variation nul, vitesse constante. Accéléré : taux de variation > 0, la vitesse augmente. Décéléré : taux de variation < 0, la vitesse diminue.",
  ),
  {
    type: "formule",
    terme: "Méthode d'Euler",
    texte:
      "v⃗₂ = {{M₁M₃⃗ // t₃ − t₁}} = {{OM₃⃗ − OM₁⃗ // t₃ − t₁}} (relation de Chasles), d'où, en tout point i de la trajectoire :\nvₓᵢ = {{xᵢ₊₁ − xᵢ₋₁ // tᵢ₊₁ − tᵢ₋₁}} et vᵧᵢ = {{yᵢ₊₁ − yᵢ₋₁ // tᵢ₊₁ − tᵢ₋₁}}.",
    precision: "On calcule ainsi les coordonnées des vecteurs vitesse à partir des coordonnées des vecteurs position : c'est une méthode numérique.",
    schema: ENCADREMENT,
  },
];

export const DEF_PC_CHAP11: DefinitionCours[] = [
  d(
    "Cinématique",
    "La cinématique (du grec kinêma = le mouvement) est l'étude des mouvements indépendamment des causes (= les forces) qui les produisent.",
  ),
  d(
    "Système ponctuel",
    "Le corps qu'on étudie en physique est appelé : système. Si ses dimensions sont petites devant la taille de la région de l'espace où il évolue, on dit que le système est ponctuel. Il peut alors être représenté comme un point matériel M de même masse m que le système et situé en son centre de gravité.",
  ),
  d(
    "Référentiel",
    "Un référentiel est le solide de référence associé à un repère d'espace pour repérer les positions et à une horloge pour repérer le temps.",
    "Un des repères les plus commodes est le repère cartésien (O, i⃗, j⃗, k⃗), où i⃗, j⃗, k⃗ sont les 3 vecteurs unitaires qui définissent les 3 directions de l'espace.",
  ),
  d(
    "Référentiel galiléen",
    "Un référentiel galiléen est un référentiel dans lequel le principe d'inertie est vérifié. C'est donc un référentiel en translation rectiligne uniforme par rapport à un autre référentiel galiléen.",
    "Les 3 lois de Newton ne sont valides que dans un référentiel galiléen. Le référentiel héliocentrique est galiléen ; les référentiels géocentrique et terrestre ne le sont que sur des temps courts (de l'ordre d'une expérience en laboratoire).",
  ),
  d(
    "Trajectoire",
    "La trajectoire est l'ensemble des positions prises par le point matériel M au cours du temps. C'est une courbe orientée dans le même sens de parcours que celui du système. Le vecteur vitesse est toujours tangent à la trajectoire.",
  ),
  {
    type: "formule",
    terme: "Vecteur vitesse par encadrement",
    texte:
      "Si on décompose la trajectoire d'un point en une succession de positions à intervalle de temps régulier Δt (M₀, M₁, … Mᵢ, Mᵢ₊₁), on peut construire le vecteur vitesse v⃗ᵢ au point Mᵢ en encadrant Mᵢ par les points Mᵢ₋₁ et Mᵢ₊₁. Ainsi le vecteur v⃗ᵢ est défini à partir du vecteur déplacement Mᵢ₋₁Mᵢ₊₁⃗ sur une durée de 2·Δt : v⃗ᵢ = {{Mᵢ₋₁Mᵢ₊₁⃗ // 2·Δt}}.",
    schema: ENCADREMENT,
  },
  {
    type: "formule",
    terme: "Vecteur variation de vitesse",
    texte:
      "Le vecteur variation de vitesse Δv⃗ᵢ en Mᵢ est défini à partir du vecteur vitesse v⃗ᵢ₊₁ en Mᵢ₊₁ et v⃗ᵢ₋₁ en Mᵢ₋₁ par la relation : Δv⃗ᵢ = v⃗ᵢ₊₁ − v⃗ᵢ₋₁.",
    precision: "Mouvement rectiligne uniforme : Δv⃗ = 0⃗. Accéléré : Δv⃗ dans le sens du mouvement. Ralenti : Δv⃗ dans le sens opposé.",
  },
  d(
    "Force",
    "On modélise une action mécanique par une force représentée par un vecteur F⃗_syst.ext./syst.étudié dont :\n• l'origine est le point représentant le système ;\n• la direction est celle de l'action mécanique ;\n• le sens est celui de l'action mécanique ;\n• la longueur est proportionnelle à la norme (ou valeur) en newton (N).",
  ),
  d(
    "Somme des forces (résultante)",
    "Plusieurs actions mécaniques peuvent agir sur un système, chacune pouvant se modéliser par une force représentée par un vecteur. À partir du point M modélisant le système, on effectue la somme des forces. Elle se note ΣF⃗ et se nomme aussi résultante des forces.",
  ),
  {
    type: "loi",
    terme: "2e loi de Newton (principe fondamental de la dynamique)",
    texte:
      "Dans un référentiel galiléen, le vecteur variation de vitesse d'un point matériel est proportionnel à la somme vectorielle des forces auxquelles il est soumis : ΣF⃗ = m·{{Δv⃗ // Δt}}.",
    precision: "Signification : un système ne peut accélérer ou changer de direction que si des forces lui sont appliquées.",
  },
  p(
    "ΣF⃗ et Δv⃗",
    "Le vecteur somme des forces ΣF⃗ a même direction et même sens que le vecteur variation de vitesse Δv⃗. Sa valeur est proportionnelle à la variation de vitesse.",
  ),
  {
    type: "loi",
    terme: "1re loi de Newton (principe d'inertie)",
    texte:
      "Un système isolé (= aucune force extérieure appliquée au système) ou pseudo-isolé (= la somme des forces extérieures se compensent) :\n• soit persiste dans son état de repos (si v₀ = 0) ;\n• soit est animé d'un mouvement rectiligne uniforme (si v₀ ≠ 0).",
    precision: "Ce principe montre qu'il n'est pas nécessaire d'appliquer des forces extérieures pour qu'un système soit animé d'un mouvement.",
  },
  d("Inertie", "L'inertie est la capacité d'un système à résister aux changements (de vitesse)."),
  {
    type: "loi",
    terme: "3e loi de Newton (principe des actions réciproques)",
    texte:
      "À toute action d'un système A sur un système B correspond une réaction égale et opposée de B sur A : F⃗_A→B = −F⃗_B→A.",
    precision: "Exemple : la fusée exerce une action sur les gaz en les expulsant vers le bas ; les gaz exercent une action sur la fusée vers le haut.",
  },
];

export const DEF_PC_FORCES: DefinitionCours[] = [
  d(
    "Réaction normale R⃗_N d'un support",
    "Force de contact exercée par un support sur l'objet : verticale, vers le haut pour un support horizontal.",
    "Bille sur une table : P⃗ + R⃗_N = 0⃗, donc P⃗ = −R⃗_N (les forces se compensent).",
  ),
  d("Tension T⃗ d'un fil", "Force de contact le long du fil, dirigée vers le point d'attache."),
  d(
    "Force de frottement fluide f⃗",
    "Force de contact opposée au mouvement dans un fluide (air, eau).",
    "Chute avec frottements : il existe une vitesse limite quand f⃗ compense P⃗. Chute libre : seul le poids s'exerce.",
  ),
  {
    type: "loi",
    terme: "Force de rappel d'un ressort (loi de Hooke)",
    texte: "F⃗_r = −k·Δl⃗, avec k la constante de raideur du ressort et Δl⃗ le vecteur allongement du ressort.",
    precision: "D'après ta fiche : très marginal en Première, pas en DST.",
  },
  d(
    "Force de gravitation F⃗_g",
    "Force à distance qui s'exerce uniquement dans l'espace (loin de la surface de la Terre), dirigée vers le point attracteur.",
  ),
  d(
    "Poids P⃗",
    "P⃗ = F⃗_g à la surface terrestre, avec P⃗ = m·g⃗ : vertical, vers le bas.",
    "Le poids ne s'exerce qu'à la surface d'une planète. Sur Terre, g = 9,81 N/kg.",
  ),
  d(
    "Poussée d'Archimède Π⃗_A",
    "Force exercée par un fluide sur un objet immergé, verticale, vers le haut : Π⃗_A = −ρ_fluide × V_immergé × g⃗.",
    "Elle dépend du volume immergé dans le fluide (le volume de fluide déplacé), pas de la masse de l'objet.",
  ),
  d(
    "Force électrostatique de Coulomb F⃗_e",
    "Elle s'exerce entre 2 porteurs de charges électriques uniquement : 2 charges de signes opposés s'attirent, 2 charges de même signe se repoussent.",
    "F⃗_e(q₁ sur q₂) = −F⃗_e(q₂ sur q₁) : illustration de la 3e loi de Newton.",
  ),
];

export const DEF_PC_METHODE: DefinitionCours[] = [
  {
    type: "methode",
    terme: "La méthode générale",
    texte:
      "1. Un titre souligné qui rappelle la question.\n2. « Par définition de … » : la formule littérale, encadrée.\n3. « avec » : les données, converties dans les bonnes unités.\n4. « A.N. : » les valeurs remplacées, le calcul.\n5. Le résultat final souligné, avec unité et chiffres significatifs.",
    precision: "Valable dans tous les chapitres. Selon le type d'exercice, une méthode propre s'y ajoute (lois de Newton, méthode descendante, demi-équations).",
  },
  {
    type: "methode",
    terme: "Lois de Newton (chap. 9 et 11)",
    texte:
      "Les données : système, point matériel, référentiel, valeurs avec unités, bilan des forces. La loi annoncée (« D'après la 2e loi de Newton… »), puis la projection sur l'axe du mouvement, puis l'expression littérale de l'inconnue, encadrée.",
  },
  {
    type: "methode",
    terme: "La méthode descendante (dilutions, dosages)",
    texte:
      "On part de la formule de base de ce qu'on cherche, puis on exprime chaque inconnue à son tour (relations encadrées et numérotées (1), (2), (3)), jusqu'à n'avoir plus que des données. On insère (3) dans (2), puis (2) dans (1) : une seule expression littérale complète, encadrée, puis une seule A.N.",
    precision: "Dilution : « au cours d'une dilution, la masse de soluté se conserve », donc C_m,mère × V_mère = C_m,fille × V_fille.",
  },
  {
    type: "methode",
    terme: "Expression littérale",
    texte: "On isole l'inconnue avec des lettres, avant tout nombre, et on l'encadre : Δt = {{Δv // g}}. Puis on définit chaque lettre.",
  },
  {
    type: "methode",
    terme: "A.N. et chiffres significatifs",
    texte:
      "On écrit « A.N. : », on remplace les lettres par les valeurs et on souligne le résultat avec son unité. Le résultat garde autant de chiffres significatifs que la donnée la moins précise, noté « (2 c.s) ».",
  },
];

// ——————————————————————————————— Mathématiques ———————————————————————————————

export const DEF_MATHS_DERIVATION: DefinitionCours[] = [
  {
    type: "definition",
    terme: "Taux de variation",
    texte:
      "Soit f une fonction définie sur un intervalle I, a un réel de cet intervalle, h un nombre réel non nul tel que (a + h) ∈ I. Le taux de variation de f entre a et a + h est le rapport : t(h) = {{f(a + h) − f(a) // h}}.",
    precision:
      "Interprétation géométrique : t(h) représente la pente (le coefficient directeur) de la droite (AM), où A et M sont les points de la courbe d'abscisses a et a + h. En effet, t(h) = {{y_M − y_A // x_M − x_A}}.",
    schema: SECANTE,
  },
  d(
    "Dérivabilité en un point, nombre dérivé",
    "Si le taux de variation t(h) tend vers un nombre réel quand h tend vers 0, on dit que f est dérivable en a. Ce nombre est appelé nombre dérivé de f en a et est noté f'(a) :\nf'(a) = lim (h → 0) {{f(a + h) − f(a) // h}}.",
    "Exemples du cours : la fonction carré est dérivable en 3 et f'(3) = 6 ; la fonction inverse est dérivable en 1 et f'(1) = −1.",
  ),
  d(
    "Tangente à une courbe en un point",
    "f est une fonction dérivable en a. La tangente en A à la courbe 𝒞 est la droite qui passe par le point A et de pente f'(a).",
    "Graphiquement, lorsque h tend vers 0, le point M de 𝒞 se rapproche du point A : la pente de (AM) tend vers f'(a).",
  ),
  {
    type: "propriete",
    terme: "Équation de la tangente",
    texte:
      "Si la fonction f est dérivable en a, alors la tangente à la courbe 𝒞 au point A(a ; f(a)) a pour équation : y = f(a) + f'(a)(x − a).",
    precision: "Exemple du cours : f(x) = 3x², f(1) = 3 et f'(1) = 6, donc y = 3 + 6(x − 1), soit y = 6x − 3 (équation réduite).",
    schema: TANGENTE_EQUATION,
  },
  d(
    "Dérivabilité sur un intervalle, fonction dérivée",
    "Soit f une fonction définie sur un intervalle I. Si f est dérivable en tout réel a de I, on dit que f est dérivable sur l'intervalle I. La fonction qui, à tout réel x de I, associe le nombre dérivé f'(x) est appelée fonction dérivée de f. Elle est notée f' et est définie sur I par f' : x ↦ f'(x).",
  ),
  p("Fonction carré", "f : x ↦ x² est dérivable sur ℝ et, pour tout x ∈ ℝ, f'(x) = 2x."),
  p("Fonction inverse", "f : x ↦ {{1 // x}} est dérivable sur ℝ* et, pour tout x ∈ ℝ*, f'(x) = −{{1 // x²}}."),
  p(
    "Fonction racine carrée",
    "La fonction racine carrée n'est pas dérivable en 0. Elle est dérivable sur ]0 ; +∞[ et f'(x) = {{1 // 2√x}}.",
    "Remarque : la fonction racine carrée est définie en 0 mais n'est pas dérivable en 0.",
  ),
  p(
    "Fonction puissance xⁿ",
    "∀n ∈ ℤ*, la fonction f définie par f : x ↦ xⁿ est dérivable sur ℝ si n > 0, sur ℝ* si n < 0, et f'(x) = nxⁿ⁻¹.",
  ),
  p("Fonctions constante, identité, affine", "(k)' = 0 ; (x)' = 1 ; (ax + b)' = a, sur ℝ."),
  p(
    "Dérivée d'une somme",
    "Soit u et v deux fonctions dérivables sur un intervalle I. La somme u + v est dérivable et (u + v)' = u' + v'.",
  ),
  p("Produit par un réel", "∀k ∈ ℝ, le produit ku est dérivable et (ku)' = ku'."),
  p(
    "Dérivée d'un produit",
    "Soit u et v deux fonctions dérivables sur un intervalle I. Le produit uv est dérivable et (uv)' = u'v + uv'.",
  ),
  p("Dérivée d'un carré", "Le carré de u, noté u², est dérivable sur I et (u²)' = 2uu'."),
  p(
    "Dérivée de l'inverse",
    "Si v(x) ≠ 0 sur I, alors l'inverse de v est dérivable sur I et ({{1 // v}})' = −{{v' // v²}}.",
  ),
  p(
    "Dérivée d'un quotient",
    "∀x ∈ I, si v(x) ≠ 0, alors le quotient {{u // v}} est dérivable sur I et ({{u // v}})' = {{u'v − uv' // v²}}.",
  ),
  p(
    "Dérivée de x ↦ g(ax + b)",
    "Si g est une fonction dérivable sur I, et si J est un intervalle tel que, ∀x ∈ J, (ax + b) ∈ I, alors la fonction f définie sur J par f(x) = g(ax + b) est dérivable sur J et ∀x ∈ J, f'(x) = a × g'(ax + b).",
  ),
  p("À connaître", "(√u)' = {{u' // 2√u}} et, ∀n ∈ ℤ*, (uⁿ)' = nu'uⁿ⁻¹."),
  d(
    "Fonction valeur absolue",
    "On appelle fonction valeur absolue la fonction f définie sur ℝ par f : x ↦ |x|, avec |x| = x si x ≥ 0 et |x| = −x si x < 0.",
    "Exemples : |3| = |−3| = 3 ; √5 − 2 > 0 donc |√5 − 2| = √5 − 2 ; |2 − √5| = −(2 − √5).",
  ),
  p(
    "Propriétés de la valeur absolue",
    "Soit x et y deux nombres réels :\n① |−x| = |x| ; ② √(x²) = |x| ; ③ |x| = |y| ⟺ x = y ou x = −y ; ④ |x| ≤ y ⟺ −y ≤ x ≤ y ; ⑤ |xy| = |x| × |y| ; ⑥ pour y ≠ 0, |{{x // y}}| = {{|x| // |y|}} ; ⑦ |x + y| ≤ |x| + |y| (inégalité triangulaire) ; ⑧ |x − y| ≥ ||x| − |y||.",
    "Le polycopié écrit ⑧ avec « > » : c'est « ≥ », car pour x = y les deux côtés valent 0.",
  ),
  {
    type: "propriete",
    terme: "Dérivabilité de la valeur absolue",
    texte:
      "La fonction valeur absolue est ① continue sur ℝ, ② dérivable sur ℝ* et ③ non dérivable en 0. Pour x < 0, f'(x) = −1 ; pour x > 0, f'(x) = 1.",
    schema: VALEUR_ABSOLUE,
  },
];

// ———————————————————————————————————— HGGSP ————————————————————————————————————

export const DEF_HGGSP_INTRO: DefinitionCours[] = [
  d("Information", "Nouvelle d'actualité vérifiée, puis hiérarchisée, mise en forme et portée à la connaissance du public."),
  d(
    "Communication",
    "Production de messages destinés à promouvoir un intérêt particulier (commercial, politique ou institutionnel).",
    "À distinguer de l'information.",
  ),
  d(
    "Média",
    "Couple formé par un support technique de diffusion (smartphone, journal papier…) et une organisation, souvent une entreprise, qui produit de l'information ou de la communication.",
  ),
  d(
    "Infobésité",
    "Surabondance d'informations, liée à l'hyperconnexion et à la facilité d'accès : l'individu devient incapable de traiter toute l'information.",
  ),
  d("Fatigue informationnelle", "Lassitude face au flux d'informations, qui pousse certains à se couper de l'actualité."),
  d("Désinformation", "Fausse information diffusée volontairement pour tromper."),
  d("Mésinformation", "Fausse information relayée de bonne foi."),
  d("Pluralisme", "Possibilité de s'informer auprès de sources diverses, dans toutes les directions."),
  d(
    "Convergence numérique",
    "Tout passe désormais par le téléphone ; publicité, information et divertissement s'y mélangent.",
  ),
  d(
    "Économie de l'attention",
    "Pour capter l'attention, les médias privilégient des contenus émotionnels, spectaculaires, voire clivants.",
    "C'est une racine du sensationnalisme.",
  ),
];

export const DEF_HGGSP_AXE1: DefinitionCours[] = [
  d("Canards", "Feuilles du XVIe siècle qui racontent prodiges et nouvelles : ancêtres du journal, déjà tournés vers le sensationnel."),
  d("Éditorial", "Texte d'opinion du rédacteur en chef ou d'un journaliste important sur l'actualité."),
  d("Ligne éditoriale", "Orientation idéologique d'un journal, faite de choix."),
  d("Rotative", "Machine du XIXe siècle qui imprime très vite : elle rend possible la presse à grand tirage."),
  d(
    "4e pouvoir",
    "La presse comme contre-pouvoir, après le législatif, l'exécutif et le judiciaire : elle exerce une veille démocratique.",
  ),
  d("Transistor", "Poste de radio portatif (années 1960) : l'écoute devient mobile et individuelle."),
  d(
    "ORTF",
    "Office de radiodiffusion-télévision française, créé par la loi du 27 juin 1964 et démantelé en 1974 : la télévision est alors un monopole d'État.",
  ),
  d("Arcom", "Autorité de régulation de l'audiovisuel et du numérique : elle surveille les chaînes publiques et privées."),
  d(
    "Internet et le web",
    "Internet est l'infrastructure (câbles, fibre optique, satellites). Le web est une application qui circule dessus et permet de naviguer de page en page.",
  ),
  d("Web 2.0", "Milieu des années 2000 : les particuliers créent eux-mêmes du contenu, le web devient participatif."),
  d("GAFAM", "Google, Apple, Facebook (Meta), Amazon, Microsoft : de grandes entreprises privées qui dominent le numérique."),
  d(
    "Bulle de filtre (enclos informationnel)",
    "Enfermement dans les contenus que les algorithmes nous proposent, à partir des informations accumulées sur nous.",
  ),
];

export const DEF_HGGSP_AXE2: DefinitionCours[] = [
  d("Contre-pouvoir", "Rôle de la presse, 4e pouvoir, censée surveiller les trois premiers : législatif, exécutif, judiciaire."),
  d(
    "Intellectuel engagé",
    "Figure née avec l'affaire Dreyfus : la presse permet à des intellectuels, comme Zola, de s'engager publiquement pour une cause.",
  ),
  d(
    "Antidreyfusards",
    "Camp hostile à Dreyfus : souvent catholiques, antisémites, ils refusent de remettre en cause le jugement de l'armée.",
  ),
  d("Antisémitisme", "Hostilité envers les Juifs, sous trois formes : religieuse, sociale, raciale."),
  d(
    "Agence de presse",
    "Entreprise qui collecte l'information, la vérifie et la vend aux autres médias : un média qui fournit les médias.",
  ),
  d("Règle des 5W", "Who, what, where, when, why : les cinq questions auxquelles une dépêche doit répondre."),
  d("Pyramide inversée", "Article écrit du plus important au plus accessoire."),
  d(
    "Droits voisins",
    "Droit des éditeurs et agences de presse d'être rémunérés quand les plateformes (Google, Meta) reprennent leurs contenus.",
    "La loi du 24 juillet 2019 fait de la France le premier pays de l'UE à transposer la directive européenne de 2019.",
  ),
  {
    type: "loi",
    terme: "Loi du 29 juillet 1881",
    texte: "Loi sur la liberté de la presse (IIIe République).",
  },
];

// ——————————————————————————————————— Français ———————————————————————————————————

export const DEF_FRANCAIS_RIMBAUD: DefinitionCours[] = [
  d(
    "Émancipation",
    "S'émanciper, c'est se libérer d'une tutelle (mère, école, morale bourgeoise, Empire, modèles poétiques).",
    "« Créatrice » : cette libération produit une œuvre.",
  ),
  d("Polysémie", "Fait d'avoir plusieurs sens à la fois. Chez Rimbaud, un même poème programme plusieurs lectures."),
  d(
    "Intertextualité externe",
    "Le poème réécrit le texte d'un autre auteur (palimpseste).",
    "Exemples : Villon pour « Le Bal des pendus », Molière pour « Le Châtiment de Tartufe ».",
  ),
  d(
    "Intertextualité interne",
    "Les poèmes de Rimbaud s'éclairent entre eux.",
    "Exemple : « Rages de Césars » éclaire « Le Châtiment de Tartufe » et « Le Bal des pendus ».",
  ),
  d("Herméneutique", "Art d'interpréter les textes."),
  d(
    "Syllepse de sens",
    "Un mot pris à la fois au sens propre et au sens figuré.",
    "Exemple : « un pied », le pied du marcheur et le pied du vers.",
  ),
  d(
    "Hypallage",
    "Adjectif rattaché à un autre mot que celui qu'il qualifie logiquement.",
    "Exemple : « Le Boulanger au gras sourire ».",
  ),
  d("Palimpseste", "Texte écrit par-dessus un texte ancien, qui reste lisible dessous."),
  d(
    "Pastiche et parodie",
    "Le pastiche est une imitation ; la parodie, une imitation moqueuse.",
    "Chez Rimbaud, le pastiche tourne souvent à la parodie.",
  ),
  d(
    "« Je est un autre »",
    "Le « je » du poème n'est pas l'homme Rimbaud : il y a toujours une distance entre le poète et ce qu'il écrit.",
    "Formule des lettres du Voyant (13 et 15 mai 1871).",
  ),
];
