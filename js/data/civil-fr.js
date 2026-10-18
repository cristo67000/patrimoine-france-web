'use strict';
/*
 * Corpus « Patrimoine civil et urbain » — corpus de référence de Patrimoine de
 * France.
 *
 * CORPUS DE RÉFÉRENCE — ouvert vide en septembre 2026, sans dépôt d'origine ni
 * migration historique : chaque fiche y entre par un lot contrôlé. Tant que le
 * tableau `sites` est vide, l'application ne propose pas ce thème dans son
 * filtre ; il y apparaît de lui-même avec la première fiche.
 *
 * En cas de perte ou de corruption, le restaurer depuis Git. Nouvelles fiches et
 * enrichissements : tools/fiches/ (lots sous lots/). Photographies :
 * tools/photos/.
 *
 * Identifiants : `id` interne composite « civ:<legacyId> » ; `legacyId` est seul
 * à paraître dans l'URL publique (?theme=civil&site=<legacyId>). Catégories
 * préfixées (civ-urbain, civ-public, civ-demeure, civ-industriel, civ-phare,
 * civ-moulin, civ-belvedere). Le patrimoine industriel est une catégorie de ce
 * thème, non un thème distinct.
 *
 * Le corpus s'enregistre lui-même auprès du registre PATRIMOINE (js/themes.js) :
 * aucune constante globale n'est laissée derrière lui, et le châssis n'a pas à
 * connaître le nom de ce fichier.
 */
PATRIMOINE.enregistrer({
  theme: "civil",
  version: "2026.09",
  source: "cristo67000/patrimoine-france",
  sites: [
    /* ================= OCCITANIE ================= */
    {
      id: "civ:moulin-d-omer",
      legacyId: "moulin-d-omer",
      theme: "civil",
      nom: "Moulin d'Omer",
      cat: "civ-moulin",
      commune: "Cucugnan",
      dept: "11 — Aude",
      region: "Occitanie",
      ll: [42.851245, 2.601794],
      prec: "exact",
      epoque: "Première mention en 1692 ; réhabilité en 2003",
      hist: "Moulin à vent surplombant le village de Cucugnan, dans les Corbières. Il apparaît pour la première fois dans les archives en 1692, sans que sa date de construction soit connue, et il est considéré en ruines en 1838. Le bâtiment et son mécanisme ont été réhabilités en 2003, et l'exploitation du moulin a repris en 2006.",
      etat: "Moulin réhabilité et remis en exploitation : le grain y est moulu sur place pour la boulangerie installée au moulin.",
      vis: "exterieur",
      visNote: "Abords visibles depuis le village ; pour découvrir l'intérieur, la commune invite à s'adresser à la boulangerie du moulin, qui organise des visites commentées pour les groupes. Modalités et éventuel tarif à demander à l'établissement.",
      photo: {
        fichier: "moulin-d-omer.webp",
        auteur: "Cristo6772",
        licence: "Tous droits réservés",
        origine: "personnelle",
        sourceLibelle: "Photographie personnelle",
        datePrise: "2024-08-29",
        alt: "Moulin d’Omer à Cucugnan : tour ronde en pierre, toit conique en bois et ailes du moulin sous un ciel bleu.",
        modifications: "Redimensionnement à 960 px, conversion WebP, suppression des métadonnées"
      }
    },
    {
      id: "civ:pont-valentre",
      legacyId: "pont-valentre",
      theme: "civil",
      nom: "Pont Valentré",
      cat: "civ-pont",
      commune: "Cahors",
      dept: "46 — Lot",
      region: "Occitanie",
      ll: [44.44505, 1.43169],
      prec: "exact",
      epoque: "XIVe siècle (chantier à partir de 1308)",
      hist: "Le pont Valentré franchit le Lot à l'ouest de Cahors. Sa construction, engagée en 1308, s'est prolongée pendant le XIVe siècle. Ses trois tours et ses arches rappellent sa double fonction de passage et de protection des accès à la cité médiévale. L'ouvrage a fait l'objet d'une restauration importante au XIXe siècle et reste l'un des monuments emblématiques de Cahors.",
      etat: "Pont classé monument historique par liste de 1840.",
      vis: "libre",
      visNote: "Pont piéton en accès libre toute l’année ; visites guidées distinctes possibles."
    },

    /* ================= GRAND EST ================= */
    {
      id: "civ:tour-du-champ-du-feu",
      legacyId: "tour-du-champ-du-feu",
      theme: "civil",
      nom: "Tour du Champ du Feu",
      cat: "civ-belvedere",
      commune: "Bellefosse",
      dept: "67 — Bas-Rhin",
      region: "Grand Est",
      ll: [48.394404, 7.269153],
      prec: "exact",
      epoque: "Fin du XIXe siècle",
      hist: "Tour d'observation inaugurée en 1898 par le Club vosgien, pour les vingt-cinq ans de l'association, au sommet du Champ du Feu, point culminant du Bas-Rhin à 1 099 m. Emblème de la station du Champ du Feu, elle n'appartient plus au Club vosgien mais à la commune de Bellefosse.",
      etat: "Tour de 23 m en béton et pierre de taille, au centre d'un giratoire de la route départementale. Longtemps fermée pour des raisons de sécurité, elle a été rénovée par la commune de Bellefosse, rénovation constatée comme achevée en 2023 en vue de sa réouverture au public.",
      vis: "exterieur",
      visNote: "Tour visible depuis le sommet et les sentiers du Champ du Feu ; sa réouverture au public était annoncée pour 2023, mais l'accès actuel à la plateforme n'est pas confirmé : se renseigner auprès de la commune de Bellefosse.",
      photo: {
        fichier: "tour-du-champ-du-feu.webp",
        auteur: "Cristo6772",
        licence: "Tous droits réservés",
        origine: "personnelle",
        sourceLibelle: "Photographie personnelle",
        datePrise: "2024-04-14",
        alt: "Tour du Champ du Feu : haute tour d’observation grise avec une plateforme au sommet, entre des arbres sous un ciel nuageux.",
        modifications: "Redimensionnement à 960 px, conversion WebP, suppression des métadonnées"
      }
    },

    /* ================= NOUVELLE-AQUITAINE ================= */
    {
      id: "civ:phare-de-cordouan",
      legacyId: "phare-de-cordouan",
      theme: "civil",
      nom: "Phare de Cordouan",
      cat: "civ-phare",
      commune: "Le Verdon-sur-Mer",
      dept: "33 — Gironde",
      region: "Nouvelle-Aquitaine",
      ll: [45.58632, -1.17333],
      prec: "exact",
      epoque: "XVIe-XVIIe siècles ; élévation XVIIIe siècle",
      hist: "Situé sur un plateau rocheux à l'embouchure de la Gironde, Cordouan est un grand phare historique dont l'édifice actuel résulte notamment des travaux de Louis de Foix à la fin du XVIe et au début du XVIIe siècle, puis de sa surélévation par l'ingénieur Teulère à la fin du XVIIIe. Il comprend une chapelle et plusieurs niveaux monumentaux. En 1823, il reçut un équipement lenticulaire expérimental conçu par Fresnel.",
      etat: "Classé monument historique en 1862, selon la notice d'Inventaire.",
      vis: "reservation",
      visNote: "Visite saisonnière d’avril à octobre ; accès en bateau et réservation, horaires variables selon les marées."
    },
    {
      id: "civ:phare-des-baleines",
      legacyId: "phare-des-baleines",
      theme: "civil",
      nom: "Phare des Baleines",
      cat: "civ-phare",
      commune: "Saint-Clément-des-Baleines",
      dept: "17 — Charente-Maritime",
      region: "Nouvelle-Aquitaine",
      ll: [46.24419, -1.56112],
      prec: "exact",
      epoque: "Milieu XIXe siècle (1849-1854)",
      hist: "À la pointe occidentale de l'île de Ré, le phare des Baleines fut bâti entre 1849 et 1854 pour remplacer une tour de signalisation élevée au XVIIe siècle. La tour nouvelle, associée à des locaux techniques, appartient à la grande période de modernisation des phares. Elle ne doit pas être confondue avec l'ancien phare des Baleines ni avec le phare des Baleineaux, implanté en mer.",
      etat: "L'ensemble des édifices du site fait l'objet de protections distinctes, notamment un classement de 2012 pour le phare du XIXe siècle.",
      vis: "payant",
      visNote: "Visite payante du grand phare, distinct de l'ancienne tour et du musée installés sur le site."
    },

    /* ================= NORMANDIE ================= */
    {
      id: "civ:phare-de-gatteville",
      legacyId: "phare-de-gatteville",
      theme: "civil",
      nom: "Phare de Gatteville",
      cat: "civ-phare",
      commune: "Gatteville-le-Phare",
      dept: "50 — Manche",
      region: "Normandie",
      ll: [49.69645, -1.26589],
      prec: "exact",
      epoque: "XIXe siècle (1835)",
      hist: "Établi sur la pointe de Barfleur, le grand phare de Gatteville est une tour monumentale en pierre mise en service en 1835. Elle remplaça une installation plus ancienne devenue insuffisante pour accueillir l'optique requise. Son élévation et la proximité de l'ancienne tour témoignent des transformations de la signalisation maritime au XIXe siècle.",
      etat: "Grand phare recensé par l'Inventaire général du patrimoine culturel, avec l'ancienne tour conservée à proximité.",
      vis: "payant",
      visNote: "Montée payante au phare selon calendrier ; fermeture possible en cas de vent fort ou d’orage."
    },

    /* ================= BRETAGNE ================= */
    {
      id: "civ:grand-phare-ile-vierge",
      legacyId: "grand-phare-ile-vierge",
      theme: "civil",
      nom: "Grand phare de l’Île Vierge",
      cat: "civ-phare",
      commune: "Plouguerneau",
      dept: "29 — Finistère",
      region: "Bretagne",
      ll: [48.63885, -4.5675],
      prec: "exact",
      epoque: "Fin XIXe-début XXe siècle (1897-1902)",
      hist: "Le grand phare de l'île Vierge fut construit entre 1897 et 1902 pour renforcer la signalisation maritime au large de Plouguerneau. Sa haute tour de pierre, dotée d'un escalier intérieur et de parois revêtues d'opaline, prit le relais d'un premier phare mis en service en 1845. Les deux édifices forment un ensemble historique, dont le grand phare est l'élément principal.",
      etat: "Les deux phares de l'île ont fait l'objet d'une protection commune ; notice Mérimée PA29000071.",
      vis: "exterieur",
      visNote: "Montée au grand phare fermée pendant les travaux de rénovation de 2026–2027 (information d'octobre 2026) ; l'île se visite selon les liaisons maritimes, sans accès à l'intérieur du grand phare."
    },
    {
      id: "civ:moulin-a-maree-birlot",
      legacyId: "moulin-a-maree-birlot",
      theme: "civil",
      nom: "Moulin à marée du Birlot",
      cat: "civ-moulin",
      commune: "Île-de-Bréhat",
      dept: "22 — Côtes-d'Armor",
      region: "Bretagne",
      ll: [48.84735, -3.00998],
      prec: "exact",
      epoque: "XVIIe siècle ; transformations ultérieures",
      hist: "Le moulin du Birlot exploite la retenue d'eau d'un bassin de marée sur l'île de Bréhat. Attesté dès le XVIIe siècle, il transforma pendant plusieurs siècles les céréales en farine grâce à l'énergie des marées. Après l'arrêt de son activité au début du XXe siècle, le bâtiment, sa digue et son mécanisme furent progressivement restaurés ; une nouvelle roue permit une remise en fonctionnement au début des années 2000.",
      etat: "Moulin restauré avec sa digue et son mécanisme, recensé par l'Inventaire général du patrimoine culturel.",
      vis: "evenement",
      visNote: "Extérieur visible selon la marée ; visites intérieures surtout en été, à dates particulières ou sur rendez-vous pour groupes."
    },

    /* ================= ÎLE-DE-FRANCE ================= */
    {
      id: "civ:halle-de-mereville",
      legacyId: "halle-de-mereville",
      theme: "civil",
      nom: "Halle de Méréville",
      cat: "civ-public",
      commune: "Le Mérévillois",
      dept: "91 — Essonne",
      region: "Île-de-France",
      ll: [48.31937, 2.08915],
      prec: "exact",
      epoque: "Première moitié XVIe siècle",
      hist: "La halle historique de Méréville témoigne de l'activité commerciale ancienne de cette localité du sud de l'Essonne. Construite dans la première moitié du XVIe siècle, elle figure parmi les édifices protégés au titre des monuments historiques. Depuis la création de la commune nouvelle en 2019, le monument se trouve administrativement au Mérévillois, Méréville demeurant une commune déléguée.",
      etat: "Halle classée monument historique par arrêté du 13 août 1921.",
      vis: "libre",
      visNote: "Halle et place en accès libre toute l’année."
    }
  ]
});
