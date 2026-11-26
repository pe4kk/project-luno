import type { ExosTypes, Schema } from "@/lib/types";

/**
 * Onglet « Exos types » des chapitres scientifiques (demandé le 2026-11-15, maquettes A + B
 * choisies le 2026-11-16) : le moins d'exercices entiers possible qui, à eux tous,
 * couvrent chaque type de question du chapitre. Sujet d'un côté, correction rédigée comme
 * le prof l'attend de l'autre. Clé : l'`id` du chapitre publié.
 *
 * Règles de rédaction :
 * - chaque type de question est couvert au moins une fois, et les exos sont le moins
 *   nombreux possible ;
 * - sujets inspirés de sujets type bac et de manuels de Première, ou exercices du prof
 *   quand il les envoie (`source`) ; jamais le DM ;
 * - correction comme le prof : physique « Par définition… », formule [[encadrée]],
 *   « avec » et les données converties (chaque unité, jamais « × 3,6 »), « A.N. : »,
 *   résultat __souligné__ avec unité et chiffres significatifs ; maths : ensemble de
 *   dérivabilité justifié, u et v nommés, conclusion « Donc, ∀x ∈ … » encadrée ;
 * - chaque calcul refait avant publication.
 */

/** Chronophotographie d'un palet : 7 positions alignées, régulièrement espacées. */
const PALET: Schema = {
  l: 330,
  h: 92,
  elements: [
    { f: "trait", points: [[18, 46], [312, 46]], ton: "doux", pointille: true, fin: true },
    ...[0, 1, 2, 3, 4, 5, 6].map((i) => ({
      f: "point" as const,
      en: [25 + i * 46, 46] as [number, number],
      forme: "croix" as const,
      nom: `M${"₀₁₂₃₄₅₆"[i]}`,
      pos: [25 + i * 46, 70] as [number, number],
    })),
    { f: "texte", en: [165, 18], t: "une position toutes les τ = 40 ms · 1 cm sur le document ↔ 10 cm en réalité", main: true },
  ],
};

export const EXOS_TYPES: Record<string, ExosTypes> = {
  // ———————————————————————— Chap. 9 · Décrire un mouvement ————————————————————————
  "pc-1re-chap9-mouvement": {
    types: [
      { id: "ref", court: "référentiel", titre: "Choisir un référentiel, relativité du mouvement", rappel: "Le mouvement dépend du référentiel : dis toujours par rapport à quoi." },
      { id: "nature", court: "nature du mouvement", titre: "Trajectoire et nature du mouvement (chronophotographie)", rappel: "Alignés : rectiligne. Écarts égaux pendant des durées égales : uniforme." },
      { id: "vinst", court: "vitesse instantanée", titre: "Calculer une vitesse instantanée avec l'échelle", rappel: "vᵢ = {{MᵢMᵢ₊₁ // tᵢ₊₁ − tᵢ}}, distance convertie en m grâce à l'échelle." },
      { id: "vecteur", court: "représenter v⃗", titre: "Représenter un vecteur vitesse à l'échelle", rappel: "Origine au point, direction de la trajectoire, sens du mouvement, longueur à l'échelle." },
      { id: "vmoy", court: "vitesse moyenne", titre: "Vitesse moyenne et conversion d'unités", rappel: "Convertis chaque unité : 1 m = 10⁻³ km, 1 s = {{1 // 3600}} h." },
      { id: "euler", court: "méthode d'Euler", titre: "Coordonnées d'un vecteur vitesse (méthode d'Euler)", rappel: "vₓᵢ = {{xᵢ₊₁ − xᵢ₋₁ // tᵢ₊₁ − tᵢ₋₁}}, de même pour y." },
      { id: "norme", court: "norme de v⃗", titre: "Norme d'un vecteur vitesse à partir de ses coordonnées", rappel: "v = √(vₓ² + v_y²)." },
    ],
    exos: [
      {
        id: "palet",
        titre: "Le palet sur la glace",
        duree: "20 min",
        source: "Inspiré des exercices de chronophotographie des manuels de Première",
        schema: PALET,
        enonce:
          "Un joueur de hockey lance un palet sur la glace d'une patinoire. On a enregistré ses positions successives M₀ à M₆, toutes les τ = 40 ms. Sur le document, deux positions successives sont séparées de 2,0 cm ; l'échelle est 1 cm sur le document pour 10 cm en réalité.",
        questions: [
          {
            texte: "Dans quel référentiel étudie-t-on le mouvement du palet ? Justifie ce choix.",
            types: ["ref"],
            correction:
              "On étudie le mouvement du palet dans le ==référentiel terrestre==, lié à la patinoire.\nIl convient car le mouvement est court (quelques dixièmes de seconde) devant la durée d'une rotation de la Terre sur elle-même.",
          },
          {
            texte: "Décris la trajectoire, puis la nature du mouvement du palet. Justifie.",
            types: ["nature"],
            correction:
              "Les positions sont alignées : la trajectoire est une portion de droite, le mouvement est ==rectiligne==.\nLes positions sont séparées de distances égales (2,0 cm) pendant des durées égales (τ) : la vitesse ne change pas, le mouvement est ==uniforme==.\n__Le mouvement est rectiligne uniforme.__",
            points: 2,
          },
          {
            texte: "Calcule la valeur de la vitesse v₃ du palet en M₃.",
            types: ["vinst"],
            correction:
              "__Vitesse en M₃__\nPar définition de la vitesse instantanée : [[v₃ = {{M₃M₄ // t₄ − t₃}}]]\navec M₃M₄ = 2,0 cm sur le document, soit 2,0 × 10 = 20 cm = 20 × 10⁻² m en réalité, et t₄ − t₃ = τ = 40 ms = 40 × 10⁻³ s.\nA.N. : v₃ = {{20 × 10⁻² // 40 × 10⁻³}}\n__v₃ = 5,0 m·s⁻¹__ (2 chiffres significatifs, comme les données).",
            points: 2,
          },
          {
            texte: "Représente le vecteur vitesse v⃗₃ avec l'échelle 1 cm pour 2 m·s⁻¹. Donne ses quatre caractéristiques.",
            types: ["vecteur"],
            correction:
              "Caractéristiques de v⃗₃ :\n• origine : le point M₃ ;\n• direction : celle de la droite (M₃M₄), la trajectoire ;\n• sens : celui du mouvement (de M₃ vers M₄) ;\n• norme : v₃ = 5,0 m·s⁻¹, soit une flèche de {{5,0 // 2}} = ==2,5 cm== avec l'échelle donnée.",
            points: 2,
          },
          {
            texte: "Calcule la vitesse moyenne du palet entre M₀ et M₆, en m·s⁻¹ puis en km·h⁻¹.",
            types: ["vmoy"],
            correction:
              "__Vitesse moyenne entre M₀ et M₆__\nPar définition de la vitesse moyenne : [[v_moy = {{M₀M₆ // t₆ − t₀}}]]\navec M₀M₆ = 6 × 2,0 = 12 cm sur le document, soit 120 cm = 1,2 m en réalité, et t₆ − t₀ = 6τ = 6 × 40 × 10⁻³ = 0,24 s.\nA.N. : v_moy = {{1,2 // 0,24}} = 5,0 m·s⁻¹\nConversion, unité par unité : 1 m = 10⁻³ km et 1 s = {{1 // 3600}} h, donc 5,0 m·s⁻¹ = {{5,0 × 10⁻³ km // (1/3600) h}} = 5,0 × 10⁻³ × 3600 km·h⁻¹.\n__v_moy = 18 km·h⁻¹__\nC'est aussi v₃ : normal, le mouvement est uniforme.",
            points: 2,
          },
        ],
      },
      {
        id: "ballon",
        titre: "Le lancer franc",
        duree: "25 min",
        source: "Inspiré d'un sujet type bac (étude d'une trajectoire par pointage)",
        enonce:
          "Un logiciel de pointage donne les coordonnées du centre d'un ballon de basket après un lancer, dans le référentiel terrestre, toutes les 0,10 s :\n\nt (s) : 0,10 · 0,20 · 0,30 · 0,40 · 0,50\nx (m) : 0,50 · 1,00 · 1,50 · 2,00 · 2,50\ny (m) : 1,80 · 2,15 · 2,40 · 2,55 · 2,60\n\nOn note M₁ à M₅ les positions correspondantes.",
        questions: [
          {
            texte: "D'après le tableau, la trajectoire est-elle rectiligne ? Justifie.",
            types: ["nature"],
            correction:
              "x augmente de 0,50 m à chaque intervalle, mais y augmente de moins en moins (0,35 ; 0,25 ; 0,15 ; 0,05 m) : les points ne sont pas alignés.\n__La trajectoire est curviligne__ (c'est une portion de parabole).",
          },
          {
            texte: "Calcule les coordonnées vₓ₂ et v_y2 du vecteur vitesse en M₂ par la méthode d'Euler, puis celles en M₄.",
            types: ["euler"],
            correction:
              "__Coordonnées de v⃗₂__\nPar la méthode d'Euler : [[vₓ₂ = {{x₃ − x₁ // t₃ − t₁}}]] et [[v_y2 = {{y₃ − y₁ // t₃ − t₁}}]]\nA.N. : vₓ₂ = {{1,50 − 0,50 // 0,30 − 0,10}} = {{1,00 // 0,20}} = 5,0 m·s⁻¹ ; v_y2 = {{2,40 − 1,80 // 0,20}} = {{0,60 // 0,20}} = 3,0 m·s⁻¹\n__v⃗₂ (5,0 ; 3,0) en m·s⁻¹__\nDe même en M₄ : vₓ₄ = {{2,50 − 1,50 // 0,20}} = 5,0 m·s⁻¹ ; v_y4 = {{2,60 − 2,40 // 0,20}} = 1,0 m·s⁻¹\n__v⃗₄ (5,0 ; 1,0) en m·s⁻¹__",
            points: 3,
          },
          {
            texte: "Calcule la valeur v₂ de la vitesse en M₂. Le ballon accélère-t-il ou ralentit-il entre M₂ et M₄ ?",
            types: ["norme", "nature"],
            correction:
              "__Valeur de la vitesse en M₂__\nPar définition de la norme d'un vecteur : [[v₂ = √(vₓ₂² + v_y2²)]]\nA.N. : v₂ = √(5,0² + 3,0²) = √34\n__v₂ = 5,8 m·s⁻¹__\nDe même v₄ = √(5,0² + 1,0²) = √26 = 5,1 m·s⁻¹.\nv₄ < v₂ : ==le ballon ralentit== en montant (et la direction de v⃗ change aussi).",
            points: 2,
          },
          {
            texte: "Un joueur court sous le ballon à 5,0 m·s⁻¹ dans la même direction horizontale. Quelle trajectoire du ballon voit-il ?",
            types: ["ref"],
            correction:
              "Dans le référentiel lié au joueur, la vitesse horizontale du ballon est vₓ − 5,0 = 5,0 − 5,0 = 0 m·s⁻¹ : le ballon ne se déplace plus horizontalement.\n__Pour le joueur, le ballon monte puis redescend à la verticale : sa trajectoire est rectiligne.__\nLe mouvement dépend du référentiel : curviligne pour le spectateur, rectiligne pour le joueur.",
            points: 2,
          },
        ],
      },
    ],
  },

  // ———————————————————— Chap. 13 · Mouvement d'un système et lois de Newton ————————————————————
  "pc-1re-chap11-newton": {
    types: [
      { id: "bilan", court: "bilan des forces", titre: "Bilan des forces et schéma", rappel: "Système, référentiel, puis chaque force : nom, direction, sens." },
      { id: "inertie", court: "principe d'inertie", titre: "Principe d'inertie : justifier ou utiliser", rappel: "Dans un référentiel galiléen : ΣF⃗ = 0⃗ ⟺ repos ou mouvement rectiligne uniforme." },
      { id: "dv", court: "construire Δv⃗", titre: "Construire Δv⃗ = v⃗ᵢ₊₁ − v⃗ᵢ₋₁", rappel: "Reporter v⃗ᵢ₊₁ en Mᵢ, ajouter −v⃗ᵢ₋₁ au bout, relier Mᵢ à l'extrémité." },
      { id: "qualitatif", court: "2e loi (direction)", titre: "2e loi : relier ΣF⃗ et Δv⃗ (direction, sens)", rappel: "ΣF⃗ et Δv⃗ ont même direction et même sens." },
      { id: "force", court: "2e loi (force)", titre: "2e loi : calculer une force", rappel: "ΣF⃗ = m · {{Δv⃗ // Δt}}, projetée sur un axe." },
      { id: "duree", court: "2e loi (durée)", titre: "2e loi : calculer une durée", rappel: "Projeter, puis isoler Δt dans ΣF = m · {{Δv // Δt}}." },
      { id: "troisieme", court: "3e loi", titre: "3e loi : forces réciproques", rappel: "F⃗_A/B = −F⃗_B/A : même droite, sens opposés, même valeur." },
    ],
    exos: [
      {
        id: "skieur",
        titre: "Le skieur au téléski",
        duree: "25 min",
        source: "Inspiré des exercices de manuels de Première sur les lois de Newton",
        enonce:
          "Un skieur de masse m = 72 kg est tiré par la perche d'un téléski. Sur une partie de la piste, il monte en ligne droite à vitesse constante. Les frottements de la neige sont modélisés par une force f⃗ de valeur f = 60 N, parallèle à la piste. On étudie le skieur dans le référentiel terrestre, supposé galiléen. Donnée : g = 9,81 N/kg.",
        questions: [
          {
            texte: "Fais le bilan des forces qui s'exercent sur le skieur pendant la montée et représente-les sans souci d'échelle. Calcule la valeur du poids.",
            types: ["bilan"],
            correction:
              "Système : {le skieur}, modélisé par un point. Référentiel : terrestre, supposé galiléen.\nBilan des forces :\n• le poids P⃗ : vertical, vers le bas ;\n• la réaction normale R⃗_N de la piste : perpendiculaire à la piste, vers le haut ;\n• la force de frottement f⃗ : parallèle à la piste, opposée au mouvement ;\n• la tension T⃗ de la perche : le long de la perche, vers le point d'attache.\n__Valeur du poids__\nPar définition : [[P = m · g]]\navec m = 72 kg et g = 9,81 N/kg.\nA.N. : P = 72 × 9,81\n__P = 7,1 × 10² N__",
            points: 3,
          },
          {
            texte: "Que peut-on dire de la somme des forces qui s'exercent sur le skieur pendant la montée ? Justifie.",
            types: ["inertie"],
            correction:
              "Le skieur a un ==mouvement rectiligne uniforme== dans un référentiel galiléen.\nD'après le principe d'inertie (1re loi de Newton), les forces qui s'exercent sur lui se compensent :\n__ΣF⃗ = P⃗ + R⃗_N + f⃗ + T⃗ = 0⃗__",
            points: 2,
          },
          {
            texte: "La perche exerce la force T⃗ sur le skieur. Quelle force le skieur exerce-t-il sur la perche ?",
            types: ["troisieme"],
            correction:
              "D'après la 3e loi de Newton (principe des actions réciproques), le skieur exerce sur la perche une force F⃗_skieur/perche telle que :\n__F⃗_skieur/perche = −T⃗__\nMême droite d'action, ==sens opposé==, même valeur.",
          },
          {
            texte: "En haut, le skieur lâche la perche sur une partie horizontale, à la vitesse v = 3,0 m·s⁻¹. Le poids et la réaction se compensent ; seule f⃗ freine le skieur. Quelle est la direction et le sens de Δv⃗ pendant ce freinage ?",
            types: ["qualitatif"],
            correction:
              "ΣF⃗ = P⃗ + R⃗_N + f⃗ = f⃗, puisque P⃗ et R⃗_N se compensent.\nD'après la 2e loi de Newton, Δv⃗ a la même direction et le même sens que ΣF⃗.\n__Δv⃗ est horizontal, de sens opposé au mouvement : le skieur ralentit.__",
            points: 2,
          },
          {
            texte: "Calcule la durée Δt nécessaire à l'arrêt du skieur, en supposant f constante.",
            types: ["duree"],
            correction:
              "__Durée de l'arrêt__\nD'après la 2e loi de Newton : [[ΣF⃗ = m · {{Δv⃗ // Δt}}]]\nProjection sur un axe horizontal orienté dans le sens du mouvement : −f = m · {{0 − v // Δt}}, donc [[Δt = {{m · v // f}}]]\navec m = 72 kg, v = 3,0 m·s⁻¹ et f = 60 N.\nA.N. : Δt = {{72 × 3,0 // 60}}\n__Δt = 3,6 s__",
            points: 3,
          },
        ],
      },
      {
        id: "lancer",
        titre: "Le ballon lancé",
        duree: "20 min",
        source: "Inspiré d'un sujet type bac (chronophotographie et 2e loi)",
        enonce:
          "On étudie le mouvement d'un ballon de masse m = 0,60 kg après un lancer, dans le référentiel terrestre supposé galiléen. Une chronophotographie donne les vecteurs vitesse en M₂ et en M₄, à 0,10 s d'intervalle entre deux positions :\nv⃗₂ (5,0 ; 3,0) et v⃗₄ (5,0 ; 1,0), en m·s⁻¹, dans un repère (Ox horizontal, Oy vertical vers le haut).\nDonnée : g = 9,81 N/kg.",
        questions: [
          {
            texte: "Le mouvement du ballon est-il rectiligne uniforme ? Qu'en déduis-tu sur les forces qui s'exercent sur lui ?",
            types: ["inertie"],
            correction:
              "Le vecteur vitesse change entre M₂ et M₄ (sa coordonnée verticale passe de 3,0 à 1,0 m·s⁻¹) : le mouvement ==n'est pas rectiligne uniforme==.\nD'après le principe d'inertie (sa contraposée), dans un référentiel galiléen :\n__ΣF⃗ ≠ 0⃗ : les forces ne se compensent pas.__",
            points: 2,
          },
          {
            texte: "Explique comment construire le vecteur variation de vitesse Δv⃗₃ en M₃, puis calcule ses coordonnées.",
            types: ["dv"],
            correction:
              "__Construction de Δv⃗₃ = v⃗₄ − v⃗₂__\n1. On reporte v⃗₄ à partir du point M₃ ;\n2. au bout de v⃗₄, on ajoute le vecteur −v⃗₂ (même direction et même longueur que v⃗₂, sens opposé) ;\n3. on relie M₃ à l'extrémité obtenue : c'est Δv⃗₃.\nCoordonnées : Δvₓ = 5,0 − 5,0 = 0 m·s⁻¹ et Δv_y = 1,0 − 3,0 = −2,0 m·s⁻¹.\n__Δv⃗₃ (0 ; −2,0) : vertical, vers le bas, de valeur 2,0 m·s⁻¹.__",
            points: 3,
          },
          {
            texte: "D'après la 2e loi de Newton, quelle est la direction et le sens de la somme des forces ? Quelle force peut-on reconnaître ?",
            types: ["qualitatif"],
            correction:
              "ΣF⃗ a la même direction et le même sens que Δv⃗₃ : ==verticale, vers le bas==.\nC'est la direction et le sens du poids : __le ballon est en chute libre, seul son poids agit__ (frottements de l'air négligeables).",
            points: 2,
          },
          {
            texte: "Calcule la valeur de ΣF⃗ et compare-la au poids du ballon.",
            types: ["force"],
            correction:
              "__Valeur de la somme des forces__\nD'après la 2e loi de Newton : [[ΣF = m · {{Δv // Δt}}]]\navec m = 0,60 kg, Δv = 2,0 m·s⁻¹ et Δt = t₄ − t₂ = 2 × 0,10 = 0,20 s.\nA.N. : ΣF = 0,60 × {{2,0 // 0,20}}\n__ΣF = 6,0 N__\nPoids : P = m · g = 0,60 × 9,81 = 5,9 N.\nLes deux valeurs sont très proches : ==cela confirme que seul le poids agit== (l'écart vient des mesures sur la chronophotographie).",
            points: 3,
          },
        ],
      },
    ],
  },

  // ———————————————————————— Les forces en spé PC ————————————————————————
  "pc-1re-forces": {
    types: [
      { id: "inventaire", court: "inventaire", titre: "Inventaire des forces (contact ou à distance)", rappel: "À distance : poids, Coulomb. De contact : réaction, tension, frottement, Archimède." },
      { id: "caracteristiques", court: "direction et sens", titre: "Direction et sens de chaque force, représentation", rappel: "T⃗ vers le point d'attache, R⃗_N perpendiculaire au support, P⃗ vertical vers le bas." },
      { id: "poids", court: "poids", titre: "Calculer un poids", rappel: "P = m · g, masse en kg, g = 9,81 N/kg." },
      { id: "archimede", court: "Archimède", titre: "Calculer une poussée d'Archimède", rappel: "Π = ρ_fluide · V_immergé · g, volume en m³." },
      { id: "comparer", court: "comparer les forces", titre: "Comparer des forces pour prévoir le mouvement", rappel: "Le système va dans le sens de la somme des forces (2e loi)." },
      { id: "frottement", court: "vitesse limite", titre: "Frottements fluides et vitesse limite", rappel: "Quand f⃗ compense les autres forces : mouvement rectiligne uniforme." },
      { id: "coulomb", court: "Coulomb", titre: "Force de Coulomb : attraction, répulsion, 3e loi", rappel: "Signes opposés : attraction. Même signe : répulsion." },
    ],
    exos: [
      {
        id: "bouchon",
        titre: "Le bouchon qui remonte",
        duree: "20 min",
        source: "Inspiré des exercices de manuels de Première sur la poussée d'Archimède",
        enonce:
          "Un bouchon en liège de masse m = 4,0 g et de volume V = 16 cm³ est maintenu entièrement sous l'eau, puis lâché. Il remonte vers la surface.\nDonnées : ρ_eau = 1,00 × 10³ kg·m⁻³ ; g = 9,81 N/kg.",
        questions: [
          {
            texte: "Juste après le lâcher, fais l'inventaire des forces qui s'exercent sur le bouchon. Précise pour chacune si c'est une force de contact ou à distance.",
            types: ["inventaire"],
            correction:
              "Système : {le bouchon}.\n• Le poids P⃗ : ==force à distance==, exercée par la Terre ;\n• la poussée d'Archimède Π⃗_A : ==force de contact==, exercée par l'eau.\n(Juste après le lâcher, la vitesse est nulle : les frottements de l'eau sont encore nuls.)",
            points: 2,
          },
          {
            texte: "Calcule la valeur du poids P du bouchon.",
            types: ["poids"],
            correction:
              "__Valeur du poids__\nPar définition : [[P = m · g]]\navec m = 4,0 g = 4,0 × 10⁻³ kg et g = 9,81 N/kg.\nA.N. : P = 4,0 × 10⁻³ × 9,81\n__P = 3,9 × 10⁻² N__",
            points: 2,
          },
          {
            texte: "Calcule la valeur de la poussée d'Archimède Π exercée par l'eau sur le bouchon.",
            types: ["archimede"],
            correction:
              "__Valeur de la poussée d'Archimède__\nPar définition : [[Π = ρ_eau · V · g]]\navec ρ_eau = 1,00 × 10³ kg·m⁻³, V = 16 cm³ = 16 × (10⁻² m)³ = 16 × 10⁻⁶ m³ et g = 9,81 N/kg.\nA.N. : Π = 1,00 × 10³ × 16 × 10⁻⁶ × 9,81\n__Π = 0,16 N__ (2 chiffres significatifs, comme V)",
            points: 2,
          },
          {
            texte: "Représente P⃗ et Π⃗_A avec l'échelle 1 cm pour 0,04 N, puis explique pourquoi le bouchon remonte.",
            types: ["caracteristiques", "comparer"],
            correction:
              "• P⃗ : vertical, vers le bas, longueur {{3,9 × 10⁻² // 0,04}} ≈ ==1,0 cm== ;\n• Π⃗_A : verticale, vers le haut, longueur {{0,16 // 0,04}} = ==4,0 cm==.\nΠ > P (environ 4 fois plus grande) : la somme des forces est verticale, vers le haut.\nD'après la 2e loi de Newton, Δv⃗ est dans le même sens : __le bouchon accélère vers le haut, il remonte.__",
            points: 3,
          },
          {
            texte: "Pendant la remontée, l'eau exerce une force de frottement f⃗ qui augmente avec la vitesse. Donne sa direction et son sens, puis explique pourquoi la vitesse finit par devenir constante.",
            types: ["frottement"],
            correction:
              "f⃗ est une force de contact ==opposée au mouvement== : verticale, vers le bas.\nPlus le bouchon va vite, plus f augmente, jusqu'à ce que P⃗ + f⃗ compense Π⃗_A : alors ΣF⃗ = 0⃗.\nD'après le principe d'inertie, __le bouchon a ensuite un mouvement rectiligne uniforme : il a atteint sa vitesse limite.__",
            points: 2,
          },
        ],
      },
      {
        id: "pendule",
        titre: "Le pendule électrostatique",
        duree: "15 min",
        source: "Inspiré des exercices de manuels de Première sur les forces",
        enonce:
          "Une petite boule A, de masse m = 2,0 g, chargée positivement, est suspendue à un fil. On approche une tige chargée B : le fil s'incline et la boule reste immobile, écartée vers la tige. Le référentiel terrestre est supposé galiléen. Donnée : g = 9,81 N/kg.",
        questions: [
          {
            texte: "Fais l'inventaire des forces qui s'exercent sur la boule A et donne la direction et le sens de chacune.",
            types: ["inventaire", "caracteristiques"],
            correction:
              "Système : {la boule A}.\n• Le poids P⃗ (à distance) : vertical, vers le bas ;\n• la tension T⃗ du fil (contact) : ==le long du fil, vers le point d'attache== ;\n• la force électrostatique F⃗_e exercée par B (à distance) : horizontale (droite qui joint A et B), vers la tige.",
            points: 3,
          },
          {
            texte: "La boule est attirée par la tige. Quel est le signe de la charge de la tige ? Que vaut la force exercée par A sur B ?",
            types: ["coulomb"],
            correction:
              "Deux charges de signes opposés s'attirent : A est positive, donc ==la tige B est chargée négativement==.\nD'après la 3e loi de Newton : __F⃗_e(A sur B) = −F⃗_e(B sur A)__ : même droite, sens opposés, même valeur.",
            points: 2,
          },
          {
            texte: "La boule est immobile. Que peux-tu dire de P⃗ + T⃗ + F⃗_e ? Que vaut P ?",
            types: ["comparer", "poids"],
            correction:
              "La boule est immobile dans un référentiel galiléen : d'après le principe d'inertie, les forces se compensent :\n__P⃗ + T⃗ + F⃗_e = 0⃗__ (mises bout à bout, elles forment un triangle fermé).\n__Valeur du poids__ : [[P = m · g]], avec m = 2,0 g = 2,0 × 10⁻³ kg.\nA.N. : P = 2,0 × 10⁻³ × 9,81\n__P = 2,0 × 10⁻² N__",
            points: 2,
          },
        ],
      },
    ],
  },

  // ———————————————————————— Chap. 3 · Tableau d'avancement ————————————————————————
  "pc-1re-chap3-avancement": {
    types: [
      { id: "tableau", court: "dresser le tableau", titre: "Dresser un tableau d'avancement", rappel: "Réactif : n₀ − a·x ; produit : 0 + c·x ; trois lignes : initial, en cours, final." },
      { id: "quantites", court: "quantités initiales", titre: "Calculer les quantités initiales (n = m/M, n = C·V)", rappel: "Convertir chaque unité avant le calcul (mL → L)." },
      { id: "limitant", court: "réactif limitant", titre: "Déterminer le réactif limitant et x_max", rappel: "Une hypothèse par réactif ; la plus petite valeur de x_max." },
      { id: "bilan", court: "bilan de matière", titre: "Faire le bilan de matière à l'état final", rappel: "Remplacer x par x_f (= x_max si la transformation est totale)." },
      { id: "nature", court: "totale ou limitée", titre: "Dire si une transformation est totale ou limitée", rappel: "x_f = x_max : totale ; x_f < x_max : limitée." },
      { id: "stoechio", court: "mélange stœchiométrique", titre: "Reconnaître ou réaliser un mélange stœchiométrique", rappel: "n₀(A)/a = n₀(B)/b." },
    ],
    exos: [
      {
        id: "methane",
        titre: "La combustion du méthane",
        duree: "15 min",
        source: "Inspiré des exercices de manuels de Première",
        enonce:
          "Le méthane CH₄(g), principal constituant du gaz naturel, brûle dans le dioxygène :\nCH₄(g) + 2 O₂(g) → CO₂(g) + 2 H₂O(g)\nÀ l'état initial, le système contient n₀(CH₄) = 3,0 mol et n₀(O₂) = 5,0 mol.",
        questions: [
          {
            texte: "Dresse le tableau d'avancement (état initial, en cours, état final).",
            types: ["tableau"],
            correction:
              "État initial (x = 0) : n(CH₄) = 3,0 ; n(O₂) = 5,0 ; n(CO₂) = 0 ; n(H₂O) = 0.\nEn cours (x) : 3,0 − x ; 5,0 − 2x ; x ; 2x.\nÉtat final (x_f) : 3,0 − x_f ; 5,0 − 2x_f ; x_f ; 2x_f.\n==Le coefficient devant x est le coefficient stœchiométrique==, avec « − » pour les réactifs et « + » pour les produits.",
            points: 2,
          },
          {
            texte: "Détermine l'avancement maximal et le réactif limitant.",
            types: ["limitant"],
            correction:
              "Hypothèse 1 : si CH₄ est limitant, 3,0 − x_max = 0, soit x_max = 3,0 mol.\nHypothèse 2 : si O₂ est limitant, 5,0 − 2x_max = 0, soit x_max = {{5,0 // 2}} = 2,5 mol.\nLa plus petite valeur : [[x_max = 2,5 mol]]. ==Le dioxygène est le réactif limitant==, alors qu'il y en a plus au départ : c'est le coefficient 2 qui compte.",
            points: 2,
          },
          {
            texte: "On mesure x_f = 2,5 mol. La transformation est-elle totale ? Fais le bilan de matière à l'état final.",
            types: ["nature", "bilan"],
            correction:
              "x_f = x_max = 2,5 mol : ==la transformation est totale.==\nn_f(CH₄) = 3,0 − 2,5 = 0,5 mol\nn_f(O₂) = 5,0 − 2 × 2,5 = 0 mol\nn_f(CO₂) = 2,5 mol\nn_f(H₂O) = 2 × 2,5 = __5,0 mol__",
            points: 2,
          },
          {
            texte: "Quelle quantité de dioxygène aurait-il fallu pour un mélange stœchiométrique ?",
            types: ["stoechio"],
            correction:
              "Mélange stœchiométrique : {{n₀(CH₄) // 1}} = {{n₀(O₂) // 2}}, donc n₀(O₂) = 2 × 3,0 = __6,0 mol__. Les deux réactifs auraient alors été entièrement consommés.",
          },
        ],
      },
      {
        id: "cuivre-argent",
        titre: "Le fil de cuivre dans le nitrate d'argent",
        duree: "20 min",
        source: "Inspiré d'un sujet type bac (arbre de Diane)",
        enonce:
          "On plonge m = 0,635 g de cuivre Cu(s) dans V = 20,0 mL d'une solution de nitrate d'argent de concentration en ions Ag⁺(aq) C = 0,500 mol·L⁻¹ :\nCu(s) + 2 Ag⁺(aq) → Cu²⁺(aq) + 2 Ag(s)\nDonnées : M(Cu) = 63,5 g·mol⁻¹ ; M(Ag) = 107,9 g·mol⁻¹.",
        questions: [
          {
            texte: "Calcule les quantités initiales de cuivre et d'ions argent.",
            types: ["quantites"],
            correction:
              "Par définition, [[n = {{m // M}}]], avec m = 0,635 g et M(Cu) = 63,5 g·mol⁻¹.\nA.N. : n₀(Cu) = {{0,635 // 63,5}} = __1,00 × 10⁻² mol__\nPar définition, [[n = C × V]], avec C = 0,500 mol·L⁻¹ et V = 20,0 mL = 20,0 × 10⁻³ L.\nA.N. : n₀(Ag⁺) = 0,500 × 20,0 × 10⁻³ = __1,00 × 10⁻² mol__",
            points: 2,
          },
          {
            texte: "Dresse le tableau d'avancement et détermine le réactif limitant.",
            types: ["tableau", "limitant"],
            correction:
              "État initial : 1,00 × 10⁻² ; 1,00 × 10⁻² ; 0 ; 0. En cours : 1,00 × 10⁻² − x ; 1,00 × 10⁻² − 2x ; x ; 2x.\nHypothèse 1 : si Cu est limitant, x_max = 1,00 × 10⁻² mol.\nHypothèse 2 : si Ag⁺ est limitant, 1,00 × 10⁻² − 2x_max = 0, soit x_max = 5,00 × 10⁻³ mol.\n[[x_max = 5,00 × 10⁻³ mol]] : ==les ions argent sont le réactif limitant==, à quantités initiales égales.",
            points: 3,
          },
          {
            texte: "La transformation est totale. Calcule la quantité de cuivre restante et la masse d'argent formée.",
            types: ["bilan"],
            correction:
              "x_f = x_max = 5,00 × 10⁻³ mol.\nn_f(Cu) = 1,00 × 10⁻² − 5,00 × 10⁻³ = __5,00 × 10⁻³ mol__\nn_f(Ag) = 2x_max = 1,00 × 10⁻² mol\nPar définition, [[m = n × M]], avec n = 1,00 × 10⁻² mol et M(Ag) = 107,9 g·mol⁻¹.\nA.N. : m(Ag) = 1,00 × 10⁻² × 107,9 = __1,08 g__",
            points: 3,
          },
          {
            texte: "Quel volume de solution d'argent faudrait-il pour un mélange stœchiométrique ?",
            types: ["stoechio"],
            correction:
              "{{n₀(Cu) // 1}} = {{n₀(Ag⁺) // 2}}, donc n₀(Ag⁺) = 2 × 1,00 × 10⁻² = 2,00 × 10⁻² mol.\nOr n = C × V, donc [[V = {{n // C}}]].\nA.N. : V = {{2,00 × 10⁻² // 0,500}} = 4,00 × 10⁻² L = __40,0 mL__",
            points: 2,
          },
        ],
      },
    ],
  },

  // ———————————————————————— Chap. 4 · Les réactions d'oxydoréduction ————————————————————————
  "pc-1re-chap4-oxydoreduction": {
    types: [
      { id: "couple", court: "oxydant / réducteur", titre: "Reconnaître oxydant et réducteur, écrire le couple Ox/Red", rappel: "Oxydant : capte des électrons. Couple écrit Ox/Red." },
      { id: "demi-simple", court: "demi-équation simple", titre: "Demi-équation d'un couple ion métallique / métal", rappel: "Cu²⁺(aq) + 2 e⁻ ⇄ Cu(s) : les électrons du côté de l'oxydant." },
      { id: "demi-acide", court: "demi-équation (milieu acide)", titre: "Demi-équation en milieu acide (H₂O, H⁺)", rappel: "1. atomes autres que O et H ; 2. O avec H₂O ; 3. H avec H⁺ ; 4. charges avec e⁻." },
      { id: "combiner", court: "équation-bilan", titre: "Combiner deux demi-équations en équation-bilan", rappel: "Multiplier pour que les électrons cédés égalent les électrons captés." },
      { id: "roles", court: "oxydé / réduit", titre: "Dire qui est oxydé, qui est réduit", rappel: "Le réducteur est oxydé ; l'oxydant est réduit." },
      { id: "verifier", court: "vérifier", titre: "Simplifier et vérifier une équation (éléments, charges)", rappel: "Pas d'électrons dans l'équation-bilan ; mêmes atomes et même charge de chaque côté." },
    ],
    exos: [
      {
        id: "arbre-diane",
        titre: "L'arbre de Diane",
        duree: "15 min",
        source: "Expérience classique des manuels de Première",
        enonce:
          "On plonge un fil de cuivre Cu(s) dans une solution incolore de nitrate d'argent contenant des ions argent Ag⁺(aq). Au bout de quelques minutes, des cristaux d'argent Ag(s) se forment sur le fil et la solution devient bleue, couleur des ions cuivre(II) Cu²⁺(aq).\nCouples : Ag⁺(aq)/Ag(s) et Cu²⁺(aq)/Cu(s).",
        questions: [
          {
            texte: "Dans chaque couple, quel est l'oxydant et quel est le réducteur ?",
            types: ["couple"],
            correction:
              "Un couple s'écrit Ox/Red :\n• Ag⁺/Ag : ==l'oxydant est Ag⁺==, le réducteur est Ag ;\n• Cu²⁺/Cu : l'oxydant est Cu²⁺, ==le réducteur est Cu==.",
          },
          {
            texte: "Écris les deux demi-équations électroniques, avec les réactifs de l'expérience à gauche.",
            types: ["demi-simple"],
            correction:
              "Les réactifs sont Ag⁺ (il disparaît) et Cu (le fil est rongé).\n• [[Ag⁺(aq) + e⁻ → Ag(s)]] (Ag⁺ capte un électron)\n• [[Cu(s) → Cu²⁺(aq) + 2 e⁻]] (Cu cède deux électrons)",
            points: 2,
          },
          {
            texte: "Écris l'équation de la réaction, puis vérifie-la.",
            types: ["combiner", "verifier"],
            correction:
              "Cu cède 2 électrons, Ag⁺ n'en capte qu'un : on multiplie la première demi-équation par 2.\n2 Ag⁺(aq) + 2 e⁻ → 2 Ag(s)\nCu(s) → Cu²⁺(aq) + 2 e⁻\nOn additionne, les électrons disparaissent :\n__Cu(s) + 2 Ag⁺(aq) → Cu²⁺(aq) + 2 Ag(s)__\nVérification : 1 Cu et 2 Ag de chaque côté ; charges : à gauche 2 × (+1) = +2, à droite +2. ==L'équation est équilibrée.==",
            points: 2,
          },
          {
            texte: "Quelle espèce est oxydée ? Quelle espèce est réduite ?",
            types: ["roles"],
            correction:
              "Le réducteur Cu cède des électrons : ==le cuivre est oxydé== (oxydation).\nL'oxydant Ag⁺ capte des électrons : ==les ions argent sont réduits== (réduction).",
          },
        ],
      },
      {
        id: "eau-oxygenee",
        titre: "Eau oxygénée et permanganate",
        duree: "20 min",
        source: "Inspiré d'un sujet type bac (titrage de l'eau oxygénée)",
        enonce:
          "En milieu acide, les ions permanganate MnO₄⁻(aq), violets, réagissent avec l'eau oxygénée H₂O₂(aq). Il se forme des ions manganèse Mn²⁺(aq), incolores, et un dégagement de dioxygène O₂(g).\nCouples : MnO₄⁻(aq)/Mn²⁺(aq) et O₂(g)/H₂O₂(aq).",
        questions: [
          {
            texte: "Écris la demi-équation du couple O₂/H₂O₂ en milieu acide, en suivant les quatre étapes.",
            types: ["demi-acide"],
            correction:
              "L'eau oxygénée est un réactif : elle s'écrit à gauche.\n1. Atomes autres que O et H : aucun.\n2. Oxygène : 2 O de chaque côté, déjà équilibré : H₂O₂ → O₂\n3. Hydrogène : 2 H à gauche, on ajoute 2 H⁺ à droite : H₂O₂ → O₂ + 2 H⁺\n4. Charges : 0 à gauche, +2 à droite : on ajoute 2 e⁻ à droite.\n__H₂O₂(aq) → O₂(g) + 2 H⁺(aq) + 2 e⁻__",
            points: 3,
          },
          {
            texte: "Écris la demi-équation du couple MnO₄⁻/Mn²⁺ en milieu acide.",
            types: ["demi-acide"],
            correction:
              "1. Mn : 1 de chaque côté : MnO₄⁻ → Mn²⁺\n2. Oxygène : 4 O à gauche, on ajoute 4 H₂O à droite : MnO₄⁻ → Mn²⁺ + 4 H₂O\n3. Hydrogène : 8 H à droite, on ajoute 8 H⁺ à gauche : MnO₄⁻ + 8 H⁺ → Mn²⁺ + 4 H₂O\n4. Charges : à gauche −1 + 8 = +7, à droite +2 : on ajoute 5 e⁻ à gauche.\n__MnO₄⁻(aq) + 8 H⁺(aq) + 5 e⁻ → Mn²⁺(aq) + 4 H₂O(l)__",
            points: 2,
          },
          {
            texte: "Écris l'équation de la réaction, simplifie-la et vérifie-la.",
            types: ["combiner", "verifier"],
            correction:
              "H₂O₂ cède 2 électrons, MnO₄⁻ en capte 5 : on multiplie par 5 et par 2 pour avoir 10 électrons de chaque côté.\n5 H₂O₂ → 5 O₂ + 10 H⁺ + 10 e⁻\n2 MnO₄⁻ + 16 H⁺ + 10 e⁻ → 2 Mn²⁺ + 8 H₂O\nSomme : 2 MnO₄⁻ + 16 H⁺ + 5 H₂O₂ → 2 Mn²⁺ + 8 H₂O + 5 O₂ + 10 H⁺\nOn simplifie les H⁺ (16 − 10 = 6 à gauche) :\n__2 MnO₄⁻(aq) + 6 H⁺(aq) + 5 H₂O₂(aq) → 2 Mn²⁺(aq) + 8 H₂O(l) + 5 O₂(g)__\nVérification : Mn 2 = 2 ; O : 8 + 10 = 18 et 8 + 10 = 18 ; H : 6 + 10 = 16 et 16 ; charges : −2 + 6 = +4 et 2 × (+2) = +4. ==Équilibrée.==",
            points: 3,
          },
          {
            texte: "Quel est le rôle de l'eau oxygénée dans cette réaction ?",
            types: ["roles", "couple"],
            correction:
              "H₂O₂ cède des électrons : ==c'est le réducteur== du couple O₂/H₂O₂ ; il est oxydé en dioxygène.\nMnO₄⁻ est l'oxydant, il est réduit en Mn²⁺ (la solution se décolore).",
          },
        ],
      },
    ],
  },

  // ———————————————————————— Maths · Séquence 2 · Dérivation ————————————————————————
  "maths-1re-derivation": {
    types: [
      { id: "taux", court: "taux de variation", titre: "Nombre dérivé par le taux de variation", rappel: "f'(a) = lim quand h → 0 de {{f(a + h) − f(a) // h}}." },
      { id: "usuelles", court: "formules usuelles", titre: "Dériver avec les formules usuelles (somme, polynôme)", rappel: "(xⁿ)' = n·xⁿ⁻¹ ; (ku)' = ku' ; (u + v)' = u' + v'." },
      { id: "tangente", court: "tangente", titre: "Équation d'une tangente", rappel: "y = f'(a)(x − a) + f(a)." },
      { id: "pente", court: "pente", titre: "Lire f'(a) comme une pente (tangente horizontale, lecture graphique)", rappel: "f'(a) est le coefficient directeur de la tangente en a." },
      { id: "produit", court: "produit", titre: "Dériver un produit", rappel: "(uv)' = u'v + uv'." },
      { id: "quotient", court: "quotient", titre: "Dériver un quotient", rappel: "({{u // v}})' = {{u'v − uv' // v²}}, avec v ≠ 0." },
      { id: "compose", court: "composée", titre: "Dériver une fonction composée g(ax + b)", rappel: "x ↦ g(ax + b) a pour dérivée x ↦ a·g'(ax + b)." },
      { id: "nonderivable", court: "non dérivable", titre: "Justifier qu'une fonction n'est pas dérivable en un point", rappel: "Le taux de variation n'a pas de limite finie (pointe, tangente verticale)." },
    ],
    exos: [
      {
        id: "polynome",
        titre: "Une parabole et ses tangentes",
        duree: "25 min",
        source: "Inspiré des exercices du chapitre Dérivation des manuels de Première",
        enonce:
          "Soit f la fonction définie sur ℝ par f(x) = x² − 3x + 1, et C_f sa courbe représentative dans un repère.",
        questions: [
          {
            texte: "Pour h ≠ 0, calcule le taux de variation de f entre 2 et 2 + h. En déduire que f est dérivable en 2 et donne f'(2).",
            types: ["taux"],
            correction:
              "f(2 + h) = (2 + h)² − 3(2 + h) + 1 = 4 + 4h + h² − 6 − 3h + 1 = h² + h − 1\nf(2) = 4 − 6 + 1 = −1\nPour h ≠ 0 : {{f(2 + h) − f(2) // h}} = {{h² + h − 1 + 1 // h}} = {{h(h + 1) // h}} = h + 1\nQuand h tend vers 0, h + 1 tend vers 1, une limite finie.\n[[Donc f est dérivable en 2 et f'(2) = 1.]]",
            points: 3,
          },
          {
            texte: "Détermine f'(x) pour tout réel x, et vérifie la valeur de f'(2).",
            types: ["usuelles"],
            correction:
              "f est une fonction polynôme, donc dérivable sur ℝ.\nf'(x) = 2x − 3 (dérivée de x² : 2x ; de −3x : −3 ; d'une constante : 0).\n[[Donc, ∀x ∈ ℝ, f'(x) = 2x − 3.]]\nVérification : f'(2) = 2 × 2 − 3 = 1, comme à la question 1.",
            points: 2,
          },
          {
            texte: "Donne une équation de la tangente T à C_f au point d'abscisse 2.",
            types: ["tangente"],
            correction:
              "Une équation de la tangente au point d'abscisse a est y = f'(a)(x − a) + f(a).\nAvec a = 2, f'(2) = 1 et f(2) = −1 : y = 1 × (x − 2) + (−1)\n[[T : y = x − 3]]",
            points: 2,
          },
          {
            texte: "En quel point de C_f la tangente est-elle horizontale ?",
            types: ["pente"],
            correction:
              "La tangente est horizontale quand son coefficient directeur est nul : f'(x) = 0 ⟺ 2x − 3 = 0 ⟺ x = {{3 // 2}}.\nf({{3 // 2}}) = {{9 // 4}} − {{9 // 2}} + 1 = {{9 − 18 + 4 // 4}} = −{{5 // 4}}\n[[La tangente est horizontale au point de coordonnées ({{3 // 2}} ; −{{5 // 4}}).]]",
            points: 2,
          },
          {
            texte: "Une autre fonction g a une courbe qui passe par A(1 ; 2). La tangente en A passe aussi par B(3 ; 6). Que vaut g'(1) ?",
            types: ["pente"],
            correction:
              "g'(1) est le coefficient directeur de la tangente en A, qui passe par A(1 ; 2) et B(3 ; 6) :\ng'(1) = {{y_B − y_A // x_B − x_A}} = {{6 − 2 // 3 − 1}} = {{4 // 2}}\n[[g'(1) = 2]]",
          },
        ],
      },
      {
        id: "operations",
        titre: "Quatre fonctions à dériver",
        duree: "25 min",
        source: "Inspiré des exercices du chapitre Dérivation des manuels de Première",
        enonce:
          "On considère les fonctions suivantes :\n• f(x) = (2x + 1)(x² − 4), définie sur ℝ ;\n• g(x) = {{3x − 1 // x² + 1}}, définie sur ℝ ;\n• h(x) = √(4x − 2), définie sur [{{1 // 2}} ; +∞[ ;\n• la fonction valeur absolue x ↦ |x|, définie sur ℝ.",
        questions: [
          {
            texte: "Justifie que f est dérivable sur ℝ et calcule f'(x).",
            types: ["produit"],
            correction:
              "f est de la forme u × v avec u(x) = 2x + 1 et v(x) = x² − 4, fonctions polynômes dérivables sur ℝ ; donc f est dérivable sur ℝ.\nu'(x) = 2 et v'(x) = 2x.\nf'(x) = u'(x)v(x) + u(x)v'(x) = 2(x² − 4) + (2x + 1) × 2x = 2x² − 8 + 4x² + 2x\n[[Donc, ∀x ∈ ℝ, f'(x) = 6x² + 2x − 8.]]",
            points: 3,
          },
          {
            texte: "Justifie que g est dérivable sur ℝ et calcule g'(x).",
            types: ["quotient"],
            correction:
              "g est de la forme {{u // v}} avec u(x) = 3x − 1 et v(x) = x² + 1, dérivables sur ℝ en tant que fonctions polynômes, et x² + 1 ≠ 0 sur ℝ (x² + 1 ≥ 1) ; donc g est dérivable sur ℝ.\nu'(x) = 3 et v'(x) = 2x.\ng'(x) = {{u'(x)v(x) − u(x)v'(x) // v²(x)}} = {{3(x² + 1) − (3x − 1) × 2x // (x² + 1)²}} = {{3x² + 3 − 6x² + 2x // (x² + 1)²}}\n[[Donc, ∀x ∈ ℝ, g'(x) = {{−3x² + 2x + 3 // (x² + 1)²}}.]]",
            points: 3,
          },
          {
            texte: "Sur quel intervalle h est-elle dérivable ? Calcule h'(x).",
            types: ["compose"],
            correction:
              "h est de la forme x ↦ g(ax + b) avec g = √, a = 4 et b = −2. La fonction racine est dérivable sur ]0 ; +∞[, et 4x − 2 > 0 ⟺ x > {{1 // 2}} : h est dérivable sur ]{{1 // 2}} ; +∞[.\nh'(x) = a · g'(ax + b) = 4 × {{1 // 2√(4x − 2)}}\n[[Donc, ∀x ∈ ]{{1 // 2}} ; +∞[, h'(x) = {{2 // √(4x − 2)}}.]]\nEn {{1 // 2}}, h n'est pas dérivable (tangente verticale, comme la racine en 0).",
            points: 3,
          },
          {
            texte: "La fonction valeur absolue est-elle dérivable en 0 ? Justifie avec le taux de variation.",
            types: ["nonderivable"],
            correction:
              "Pour h ≠ 0, le taux de variation en 0 vaut {{|0 + h| − |0| // h}} = {{|h| // h}}.\n• Si h > 0 : {{|h| // h}} = 1 ;\n• si h < 0 : {{|h| // h}} = −1.\nQuand h tend vers 0, le taux ne tend pas vers une même valeur : il n'a pas de limite.\n[[Donc la fonction valeur absolue n'est pas dérivable en 0]] (sa courbe y forme une pointe).",
            points: 2,
          },
        ],
      },
    ],
  },
};
