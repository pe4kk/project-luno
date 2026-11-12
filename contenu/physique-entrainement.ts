import type { Calcul, Probleme, Schema } from "@/lib/types";

/**
 * Entraînement de physique (S'exercer → Problèmes, Calculs, Interro blanche).
 *
 * Des situations réelles, rédigées comme le prof l'attend (système, référentiel, bilan
 * des forces, loi, projection, expression littérale, A.N., conclusion). Elles sont
 * parallèles aux exercices du cours, mais ne reprennent pas celles du DM du 16/11
 * (vitesse d'un parachutiste après 12 s, vitesse limite, construction de Δv⃗ de l'ex. 1) :
 * il doit le rédiger lui-même.
 *
 * Dans un calcul, `{nom}` est remplacé par la valeur tirée et `{resultat}` par le
 * résultat attendu, écrit avec le bon nombre de chiffres significatifs.
 */

const PALET: Schema = {
  l: 340,
  h: 110,
  legende: "Chronophotographie du palet, vue de dessus (τ = 40 ms, en vraie grandeur)",
  elements: [
    ...[0, 1, 2, 3, 4, 5].map((i) => ({
      f: "point" as const,
      en: [40 + i * 48, 52] as [number, number],
      nom: `M${"₀₁₂₃₄₅"[i]}`,
      pos: [40 + i * 48, 30] as [number, number],
      forme: "croix" as const,
    })),
    { f: "trait", points: [[40, 78], [88, 78]], ton: "doux" },
    { f: "texte", en: [64, 98], t: "1,2 cm", main: true, ton: "doux", ancre: "middle" },
  ],
};

// ———————————————————— Problèmes (mode A) ————————————————————

export const PROBLEMES_CHAP11: Probleme[] = [
  {
    id: "pb-voiture-freine",
    titre: "La voiture qui freine",
    duree: "10 min",
    enonce:
      "Une voiture de masse m = 1,2 t roule sur une route horizontale et rectiligne à 90 km/h. La conductrice freine : la voiture s'arrête en Δt = 4,0 s.\nOn suppose que la force de freinage f⃗ est constante, horizontale et opposée au mouvement, et on néglige les frottements de l'air.",
    question: "Déterminer la valeur f de la force de freinage.",
    etapes: [
      {
        titre: "Système et référentiel",
        consigne: "Définis le système et le référentiel d'étude.",
        attendu:
          "Système : la voiture, modélisée par un point matériel de masse m = 1,2 × 10³ kg.\nRéférentiel : terrestre, supposé galiléen.",
        criteres: [
          "Système nommé et modélisé par un point matériel",
          "Masse convertie en kg : 1,2 × 10³ kg",
          "Référentiel terrestre, supposé galiléen",
        ],
      },
      {
        titre: "Données",
        consigne: "Écris les données utiles, dans les unités du Système international.",
        attendu: "v_i = 90 km/h = {{90 // 3,6}} = 25 m·s⁻¹ ; v_f = 0 m·s⁻¹ (arrêt) ; Δt = 4,0 s.",
        criteres: ["Vitesse convertie en m·s⁻¹ (÷ 3,6)", "v_f = 0 : la voiture s'arrête"],
      },
      {
        titre: "Bilan des forces",
        consigne: "Fais le bilan des forces qui s'exercent sur la voiture.",
        attendu:
          "• Le poids P⃗ : vertical, vers le bas.\n• La réaction normale de la route R⃗_N : verticale, vers le haut.\n• La force de freinage f⃗ : horizontale, opposée au mouvement.\nLe mouvement est horizontal : P⃗ et R⃗_N se compensent.",
        criteres: [
          "Les trois forces : P⃗, R⃗_N et f⃗",
          "Direction et sens de chacune",
          "P⃗ et R⃗_N se compensent",
        ],
        points: 1.5,
      },
      {
        titre: "Loi",
        consigne: "Quelle loi appliques-tu ? Écris-la.",
        attendu: "D'après la 2e loi de Newton, dans le référentiel terrestre supposé galiléen :\nP⃗ + R⃗_N + f⃗ = {{m·Δv⃗ // Δt}}, donc f⃗ = {{m·Δv⃗ // Δt}}.",
        criteres: [
          "2e loi de Newton nommée",
          "Rappel : référentiel galiléen",
          "ΣF⃗ = m·Δv⃗/Δt écrit avec les flèches",
        ],
        points: 1.5,
      },
      {
        titre: "Projection",
        consigne: "Projette la relation sur un axe que tu choisis.",
        attendu:
          "Sur un axe horizontal orienté dans le sens du mouvement :\n−f = {{m·(v_f − v_i) // Δt}} = {{−m·v_i // Δt}}.",
        criteres: ["Axe défini et orienté", "Signe moins de f, opposée au mouvement"],
      },
      {
        titre: "Expression littérale",
        consigne: "Isole f, avec des lettres seulement.",
        attendu: "[[f = {{m·v_i // Δt}}]]",
        criteres: ["Lettres seulement, aucun nombre"],
        encadrer: true,
      },
      {
        titre: "A.N.",
        consigne: "Fais l'application numérique.",
        attendu: "f = {{1,2 × 10³ × 25 // 4,0}} = [[7,5 × 10³ N]]",
        criteres: ["Valeurs en unités SI", "Résultat 7,5 × 10³ N", "Unité N", "2 chiffres significatifs"],
        encadrer: true,
        points: 1.5,
      },
      {
        titre: "Conclusion",
        consigne: "Conclus par une phrase, et vérifie que le résultat est vraisemblable.",
        attendu:
          "La force de freinage vaut 7,5 × 10³ N. C'est cohérent : elle est un peu plus faible que le poids de la voiture (P = m·g ≈ 1,2 × 10⁴ N).",
        criteres: ["Phrase de réponse à la question", "Regard critique sur la valeur"],
        points: 0.5,
      },
    ],
  },
  {
    id: "pb-balle-verticale",
    titre: "La balle lancée vers le haut",
    duree: "8 min",
    enonce:
      "Un joueur lance une balle de masse m = 0,20 kg verticalement vers le haut, avec une vitesse v_0 = 15 m·s⁻¹. On néglige les frottements de l'air. Donnée : g = 9,81 N/kg.",
    question: "Au bout de combien de temps la balle atteint-elle le sommet de sa trajectoire ?",
    etapes: [
      {
        titre: "Système et référentiel",
        consigne: "Définis le système et le référentiel.",
        attendu: "Système : la balle, modélisée par un point matériel de masse m.\nRéférentiel : terrestre, supposé galiléen.",
        criteres: ["Système modélisé par un point matériel", "Référentiel terrestre supposé galiléen"],
      },
      {
        titre: "Bilan des forces",
        consigne: "Quelles forces s'exercent sur la balle après le lancer ?",
        attendu: "Une seule force : le poids P⃗ = m·g⃗, vertical, vers le bas (frottements négligés). La balle est en chute libre.",
        criteres: ["Le poids seul", "Vertical vers le bas", "Mot « chute libre »"],
      },
      {
        titre: "Loi",
        consigne: "Applique la loi qui convient et simplifie.",
        attendu: "D'après la 2e loi de Newton : P⃗ = {{m·Δv⃗ // Δt}}, soit m·g⃗ = {{m·Δv⃗ // Δt}}, donc {{Δv⃗ // Δt}} = g⃗.",
        criteres: ["2e loi de Newton nommée", "La masse se simplifie : Δv⃗/Δt = g⃗"],
        points: 1.5,
      },
      {
        titre: "Projection",
        consigne: "Projette sur un axe vertical orienté vers le haut. Que vaut la vitesse au sommet ?",
        attendu: "Au sommet, la vitesse est nulle : v_f = 0.\nSur l'axe vertical orienté vers le haut : {{0 − v_0 // Δt}} = −g.",
        criteres: ["v = 0 au sommet", "Axe orienté vers le haut, d'où −g"],
      },
      {
        titre: "Expression littérale",
        consigne: "Isole Δt.",
        attendu: "[[Δt = {{v_0 // g}}]]",
        criteres: ["Lettres seulement"],
        encadrer: true,
      },
      {
        titre: "A.N. et conclusion",
        consigne: "Fais l'A.N. et conclus.",
        attendu: "Δt = {{15 // 9,81}} = [[1,5 s]]. La balle atteint le sommet 1,5 s après le lancer ; sa masse n'intervient pas.",
        encadrer: true,
        criteres: ["1,5 s", "Unité s", "2 chiffres significatifs (comme v_0)", "Phrase de conclusion"],
        points: 1.5,
      },
    ],
  },
  {
    id: "pb-palet-coussin-air",
    titre: "Le palet sur coussin d'air",
    duree: "8 min",
    enonce:
      "On lance un palet sur une table horizontale à coussin d'air et on enregistre sa position toutes les τ = 40 ms. Les points obtenus sont alignés et régulièrement espacés de 1,2 cm.",
    question: "Que peut-on dire des forces qui s'exercent sur le palet ? Justifier.",
    schema: PALET,
    etapes: [
      {
        titre: "Décrire le mouvement",
        consigne: "Décris le mouvement du palet dans le référentiel terrestre, en justifiant chaque mot.",
        attendu:
          "Les points sont alignés : le mouvement est rectiligne.\nIls sont régulièrement espacés pendant des durées égales : le mouvement est uniforme.\nLe mouvement est rectiligne uniforme.",
        criteres: ["Rectiligne, car points alignés", "Uniforme, car points équidistants", "Les deux justifications écrites"],
        points: 1.5,
      },
      {
        titre: "Vitesse",
        consigne: "Calcule la valeur de la vitesse du palet.",
        attendu: "v = {{M_0M_1 // τ}} = {{1,2 × 10⁻² // 40 × 10⁻³}} = [[0,30 m·s⁻¹]]",
        encadrer: true,
        criteres: ["Distances en m et durée en s", "0,30 m·s⁻¹ avec son unité", "2 chiffres significatifs"],
      },
      {
        titre: "Variation de vitesse",
        consigne: "Que vaut le vecteur variation de vitesse Δv⃗ ?",
        attendu: "Le vecteur vitesse garde même direction, même sens et même valeur : Δv⃗ = 0⃗.",
        criteres: ["Δv⃗ = 0⃗, avec la flèche sur le 0", "Justifié par v⃗ constant"],
      },
      {
        titre: "Loi et conclusion",
        consigne: "Conclus sur les forces, en citant la loi.",
        attendu:
          "D'après le principe d'inertie (dans le référentiel terrestre supposé galiléen), v⃗ constant ⟺ ΣF⃗ = 0⃗ : les forces qui s'exercent sur le palet se compensent. Le palet est pseudo-isolé : son poids P⃗ est compensé par la force exercée par le coussin d'air.",
        criteres: [
          "Principe d'inertie cité",
          "ΣF⃗ = 0⃗ : les forces se compensent",
          "Mot « pseudo-isolé »",
          "Les forces nommées : poids et action du coussin d'air",
        ],
        points: 2,
      },
    ],
  },
];

// ———————————————————— Calculs à valeurs changeantes (mode C) ————————————————————

export const CALCULS_CHAP11: Calcul[] = [
  {
    id: "calc-freinage",
    titre: "Force de freinage",
    enonce:
      "Une voiture de masse {m} t roule à {v} km/h sur une route horizontale. Elle freine et s'arrête en {dt} s. La force de freinage est constante et on néglige les autres frottements.",
    question: "Calcule la valeur f de la force de freinage.",
    variables: [
      { nom: "m", min: 1.0, max: 1.6, pas: 0.1 },
      { nom: "v", min: 50, max: 90, pas: 10 },
      { nom: "dt", min: 3.0, max: 8.0, pas: 0.5 },
    ],
    litterale: "f = {{m·v_i // Δt}}",
    formule: "m * 1000 * (v / 3.6) / dt",
    inconnue: "f",
    unite: "N",
    unitesProposees: ["N", "kg", "m·s⁻²", "N·s", "J"],
    methode:
      "2e loi de Newton projetée sur l'axe du mouvement : −f = m·(0 − v_i)/Δt, donc f = m·v_i/Δt.\nConversions : m = {m} × 10³ kg ; v_i = {v}/3,6 m·s⁻¹.\nA.N. : f = {resultat} N (autant de chiffres significatifs que la donnée la moins précise).",
  },
  {
    id: "calc-cycliste",
    titre: "Durée d'un démarrage",
    enonce:
      "Un cycliste et son vélo (masse totale {m} kg) démarrent sur une route horizontale. La somme des forces qui s'exercent sur eux est constante, de valeur {F} N, dans le sens du mouvement. Leur vitesse augmente de {dv} m·s⁻¹.",
    question: "Calcule la durée Δt de cette accélération.",
    variables: [
      { nom: "m", min: 60, max: 95, pas: 1 },
      { nom: "F", min: 40, max: 90, pas: 5 },
      { nom: "dv", min: 4.0, max: 9.0, pas: 0.5 },
    ],
    litterale: "Δt = {{m·Δv // F}}",
    formule: "m * dv / F",
    inconnue: "Δt",
    unite: "s",
    unitesProposees: ["s", "min", "m·s⁻¹", "N"],
    methode:
      "2e loi de Newton : ΣF⃗ = m·Δv⃗/Δt. En projection sur l'axe du mouvement : F = m·Δv/Δt, donc Δt = m·Δv/F.\nA.N. : Δt = {m} × {dv} / {F} = {resultat} s.",
  },
  {
    id: "calc-homme-canon",
    titre: "L'homme-canon au sommet",
    enonce:
      "Au cirque, un homme-canon est projeté verticalement vers le haut à {v0} m·s⁻¹. On néglige les frottements de l'air. Donnée : g = {g} N/kg.",
    question: "Combien de temps met-il pour atteindre le sommet de sa trajectoire ?",
    variables: [{ nom: "v0", min: 12, max: 30, pas: 1 }],
    constantes: { g: 9.81 },
    litterale: "Δt = {{v_0 // g}}",
    formule: "v0 / g",
    inconnue: "Δt",
    unite: "s",
    unitesProposees: ["s", "m·s⁻¹", "m·s⁻²", "m"],
    methode:
      "Chute libre : seul le poids agit, la 2e loi donne Δv⃗/Δt = g⃗.\nSur un axe vertical vers le haut, entre le départ et le sommet (v = 0) : (0 − v_0)/Δt = −g, donc Δt = v_0/g.\nA.N. : Δt = {v0} / {g} = {resultat} s.",
  },
];

export const CALCULS_CHAP9: Calcul[] = [
  {
    id: "calc-vitesse-encadrement",
    titre: "Vitesse sur une chronophotographie",
    enonce:
      "Sur la chronophotographie d'un skateur, en vraie grandeur à l'échelle indiquée, les positions sont prises toutes les τ = {tau} ms. On mesure M_2M_4 = {d} cm.",
    question: "Calcule la valeur de la vitesse v_3 du skateur au point M_3.",
    variables: [
      { nom: "d", min: 3.0, max: 9.0, pas: 0.2 },
      { nom: "tau", min: 20, max: 60, pas: 10 },
    ],
    litterale: "v_3 = {{M_2M_4 // 2τ}}",
    formule: "(d / 100) / (2 * tau / 1000)",
    inconnue: "v_3",
    unite: "m·s⁻¹",
    unitesProposees: ["m·s⁻¹", "cm·s⁻¹", "km/h", "m"],
    methode:
      "On encadre M_3 par les points voisins : v_3 = M_2M_4 / (t_4 − t_2) = M_2M_4 / 2τ.\nConversions : M_2M_4 = {d} × 10⁻² m ; τ = {tau} × 10⁻³ s.\nA.N. : v_3 = {resultat} m·s⁻¹.",
  },
];

export const CALCULS_FORCES: Calcul[] = [
  {
    id: "calc-poids",
    titre: "Poids d'un randonneur",
    enonce: "Un randonneur et son sac ont une masse totale de {m} kg. Donnée : g = {g} N/kg.",
    question: "Calcule la valeur P de leur poids.",
    variables: [{ nom: "m", min: 50, max: 99.5, pas: 0.5 }],
    constantes: { g: 9.81 },
    litterale: "P = m·g",
    formule: "m * g",
    inconnue: "P",
    unite: "N",
    unitesProposees: ["N", "kg", "N/kg", "J"],
    methode: "P = m·g, avec m en kg et g en N/kg.\nA.N. : P = {m} × {g} = {resultat} N.",
  },
  {
    id: "calc-archimede",
    titre: "Poussée d'Archimède sur une bouée",
    enonce:
      "Une bouée est enfoncée dans l'eau sur un volume V = {V} L. Données : ρ_eau = 1,00 × 10³ kg·m⁻³ ; g = {g} N/kg.",
    question: "Calcule la valeur Π de la poussée d'Archimède.",
    variables: [{ nom: "V", min: 1.0, max: 5.0, pas: 0.1 }],
    constantes: { g: 9.81 },
    litterale: "Π = ρ_eau·V·g",
    formule: "1000 * (V / 1000) * g",
    inconnue: "Π",
    unite: "N",
    unitesProposees: ["N", "kg", "m³", "Pa"],
    methode:
      "Π = ρ_fluide·V_immergé·g, avec V en m³ : 1 L = 10⁻³ m³, donc V = {V} × 10⁻³ m³.\nA.N. : Π = 1,00 × 10³ × {V} × 10⁻³ × {g} = {resultat} N.",
  },
];
