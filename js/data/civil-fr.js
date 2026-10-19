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
    {
      id: "civ:phare-de-l-espiguette",
      legacyId: "phare-de-l-espiguette",
      theme: "civil",
      nom: "Phare de l'Espiguette",
      cat: "civ-phare",
      commune: "Le Grau-du-Roi",
      dept: "30 — Gard",
      region: "Occitanie",
      ll: [43.48767, 4.14181],
      prec: "exact",
      epoque: "XIXe siècle (1865-1869)",
      hist: "Le phare de l'Espiguette, au Grau-du-Roi, forme un ensemble homogène construit de 1865 à 1869 sous la direction de l'ingénieur Charles Lenthéric et allumé en 1869. Sa tour carrée de 27 m, en pierre apparente à chaînes d'angle, s'élève au-dessus d'un bâtiment rectangulaire ; une cour close avec puits complète l'ensemble. Il témoigne du grand programme d'équipement des côtes conduit par le service des Phares et Balises.",
      etat: "Tour, logements, cour, puits et clôture classés monument historique par arrêté du 9 octobre 2012 ; propriété de l'État.",
      vis: "payant",
      visNote: "Visite payante du phare et du musée toute l'année, du mercredi au lundi ; réservation conseillée."
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
    {
      id: "civ:phare-de-chassiron",
      legacyId: "phare-de-chassiron",
      theme: "civil",
      nom: "Phare de Chassiron",
      cat: "civ-phare",
      commune: "Saint-Denis-d'Oléron",
      dept: "17 — Charente-Maritime",
      region: "Nouvelle-Aquitaine",
      ll: [46.04673, -1.41029],
      prec: "exact",
      epoque: "XIXe siècle (1834-1836)",
      hist: "À l'extrémité nord de l'île d'Oléron, le phare de Chassiron fut construit de 1834 à 1836 sous la conduite de l'ingénieur Lescure Bellerive, pour remplacer une tour de 1685 qui signalait la passe menant à l'arsenal de Rochefort. Sa tour, ornée de trois bandes noires depuis 1936, compte 224 marches. Les anciens logements des gardiens, dans la rotonde basse, accueillent un musée entouré d'un jardin.",
      etat: "Phare et dépendances classés monument historique par arrêté du 23 octobre 2012 ; propriété de l'État.",
      vis: "payant",
      visNote: "Visite payante du phare et du musée, toute l'année sauf le 1er janvier, le 25 décembre et une fermeture en janvier ; horaires saisonniers."
    },
    {
      id: "civ:phare-de-la-coubre",
      legacyId: "phare-de-la-coubre",
      theme: "civil",
      nom: "Phare de la Coubre",
      cat: "civ-phare",
      commune: "La Tremblade",
      dept: "17 — Charente-Maritime",
      region: "Nouvelle-Aquitaine",
      ll: [45.69605, -1.2337],
      prec: "exact",
      epoque: "Début XXe siècle (1904-1905)",
      hist: "À la pointe de la Coubre, sur la côte Sauvage, plusieurs feux se succédèrent depuis la fin du XVIIe siècle face à l'avancée des dunes et à l'érosion. La tour actuelle, conçue par les ingénieurs Alexandre et Modelsky, fut commencée en décembre 1904 et allumée en octobre 1905 ; la tour précédente s'écroula en 1907. Haute de 64 m, elle est en béton, de plan cylindrique et du type dit « trompette ».",
      etat: "Phare et dépendances inscrits monument historique par arrêté du 15 avril 2011 ; propriété de l'État. Une démolition à terme a été annoncée en 2026 selon la presse, sans date fixée.",
      vis: "payant",
      visNote: "Phare et écomusée ouverts au public en saison, accès payant ; horaires à vérifier."
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
    {
      id: "civ:phare-de-la-heve",
      legacyId: "phare-de-la-heve",
      theme: "civil",
      nom: "Phare de la Hève",
      cat: "civ-phare",
      commune: "Sainte-Adresse",
      dept: "76 — Seine-Maritime",
      region: "Normandie",
      ll: [49.51255, 0.06967],
      prec: "exact",
      epoque: "Milieu XXe siècle (1951-1952)",
      hist: "Au cap de la Hève, les deux phares édifiés en 1775 furent détruits par les bombardements de 1944. Un phare unique fut reconstruit en 1951-1952 par l'architecte Henri Colboc : une tour octogonale en béton, enserrée par un bâtiment technique en pierre de taille et dotée d'un escalier suspendu en calcaire et d'un ascenseur. La maison du gardien et une remise complètent l'ensemble.",
      etat: "Tour, bâtiment technique, maison du gardien et remise inscrits monument historique par arrêté du 24 novembre 2010 ; propriété de l'État.",
      vis: "exterieur",
      visNote: "Aucune visite intérieure signalée."
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
    {
      id: "civ:phare-du-creach",
      legacyId: "phare-du-creach",
      theme: "civil",
      nom: "Phare du Créac'h",
      cat: "civ-phare",
      commune: "Ouessant",
      dept: "29 — Finistère",
      region: "Bretagne",
      ll: [48.45923, -5.12904],
      prec: "exact",
      epoque: "XIXe siècle (1863) ; bâtiments et lanterne 1937-1941",
      hist: "Le phare du Créac'h fut demandé en 1857 par le conseil municipal d'Ouessant pour prévenir les dangers de l'écueil de la Jument ; l'avant-projet de l'ingénieur Maitrot de Varennes date de 1859. Sa tour tronconique repose sur un soubassement en granit de Kersanton. Ses bâtiments, agrandis lors de l'électrification de 1888, furent reconstruits en 1940-1941, et sa lanterne, présentée à l'Exposition universelle de 1937, en fit alors le phare le plus puissant du monde selon la notice Mérimée.",
      etat: "Phare classé monument historique par arrêté du 23 mai 2011, avec ses annexes et son enclos ; propriété de l'État.",
      vis: "inconnu",
      visNote: "Conditions de visite non confirmées : le musée des Phares et Balises, au pied du phare, a fermé en novembre 2023 pour rénovation, sans réouverture confirmée."
    },
    {
      id: "civ:phare-de-la-jument",
      legacyId: "phare-de-la-jument",
      theme: "civil",
      nom: "Phare de la Jument",
      cat: "civ-phare",
      commune: "Ouessant",
      dept: "29 — Finistère",
      region: "Bretagne",
      ll: [48.42223, -5.13389],
      prec: "exact",
      epoque: "Début XXe siècle (1904-1911)",
      hist: "Bâti en mer sur la roche Ar-Gazec, à l'entrée du passage du Fromveur au sud-ouest d'Ouessant, le phare de la Jument fut financé par un legs de Charles-Eugène Potron. Le projet fut approuvé en 1904 et le feu allumé le 15 octobre 1911. Automatisé, le phare fut quitté par ses gardiens en 1991. Les photographies de Jean Guichard, prises pendant la tempête du 21 décembre 1989, l'ont rendu célèbre.",
      etat: "Inscrit monument historique en 2015, puis classé par arrêté du 20 avril 2017 ; propriété de l'État.",
      vis: "exterieur",
      visNote: "Phare en mer non ouvert au public ; visible seulement à distance."
    },
    {
      id: "civ:phare-d-ar-men",
      legacyId: "phare-d-ar-men",
      theme: "civil",
      nom: "Phare d'Ar-Men",
      cat: "civ-phare",
      commune: "Île-de-Sein",
      dept: "29 — Finistère",
      region: "Bretagne",
      ll: [48.05013, -4.99777],
      prec: "exact",
      epoque: "XIXe siècle (1869-1881 ; achevé en 1897)",
      hist: "Le phare d'Ar-Men se dresse sur une roche isolée, à l'extrémité ouest de la chaussée de Sein. Son chantier, engagé en 1869 selon la notice Mérimée sous l'autorité de l'ingénieur Léonce Reynaud, constitua un exploit technique et humain sur une roche exiguë. Mis en service en août 1881, l'ouvrage ne fut considéré comme abouti qu'en 1897. Il fut le premier phare automatisé du littoral finistérien, en avril 1990.",
      etat: "Inscrit monument historique en 2015, puis classé le 20 avril 2017 ; propriété de l'État.",
      vis: "exterieur",
      visNote: "Phare en mer sans accès public ; visible seulement à distance."
    },
    {
      id: "civ:phare-d-eckmuhl",
      legacyId: "phare-d-eckmuhl",
      theme: "civil",
      nom: "Phare d'Eckmühl",
      cat: "civ-phare",
      commune: "Penmarc'h",
      dept: "29 — Finistère",
      region: "Bretagne",
      ll: [47.798197, -4.372757],
      prec: "exact",
      epoque: "Fin XIXe siècle (1892-1897)",
      hist: "Construit à partir de 1892 et allumé le 17 octobre 1897 à la pointe de Penmarc'h, le phare d'Eckmühl fut financé par la marquise de Blocqueville, fille du maréchal Davout, prince d'Eckmühl. Sa tour octogonale en granit de Kersanton, haute d'environ 65 m, abrite un escalier de bronze et de laiton, un parement intérieur d'opaline et une chambre de veille lambrissée de chêne. L'ancien phare de 1835 subsiste à proximité.",
      etat: "Inscrit en 2005, puis classé avec l'ancien phare de Penmarc'h par arrêté du 23 mai 2011 ; propriété de l'État.",
      vis: "payant",
      visNote: "Montée payante habituellement proposée d'avril à la Toussaint ; fermeture temporaire signalée en septembre 2026, réouverture à vérifier."
    },
    {
      id: "civ:phare-de-kermorvan",
      legacyId: "phare-de-kermorvan",
      theme: "civil",
      nom: "Phare de Kermorvan",
      cat: "civ-phare",
      commune: "Le Conquet",
      dept: "29 — Finistère",
      region: "Bretagne",
      ll: [48.362004, -4.789877],
      prec: "exact",
      epoque: "XIXe siècle (1849)",
      hist: "Sur la presqu'île de Kermorvan, au Conquet, ce phare à tour carrée d'environ 18 m fut allumé en 1849 d'après le projet des ingénieurs Plantier et Menu du Mesnil. Il est aligné sur les feux de Lochrist, Trézien et Saint-Mathieu. Automatisé en 1994, il est accessible à pied par la passerelle du Croaë.",
      etat: "Phare étudié par l'Inventaire général (dossier IA29001132) ; aucune protection au titre des monuments historiques relevée. Presqu'île en site classé, propriété du Conservatoire du littoral.",
      vis: "evenement",
      visNote: "Abords accessibles à pied ; visites intérieures ponctuelles, en été et lors des Journées du patrimoine."
    },
    {
      id: "civ:phares-du-cap-frehel",
      legacyId: "phares-du-cap-frehel",
      theme: "civil",
      nom: "Phares du cap Fréhel",
      cat: "civ-phare",
      commune: "Plévenon",
      dept: "22 — Côtes-d'Armor",
      region: "Bretagne",
      ll: [48.68386, -2.31883],
      prec: "exact",
      epoque: "XVIIIe siècle (tour de 1702) ; milieu XXe siècle (phare actuel)",
      hist: "Au cap Fréhel, la tour élevée par l'ingénieur Garangeau et mise en service en 1702 fonctionna jusqu'en 1847 ; elle demeure visible près du phare actuel. Le phare de Léonce Reynaud, allumé en 1847, fut détruit en 1944. Son successeur, reconstruit après la guerre par l'architecte Hémar dans un style régionaliste d'inspiration néo-médiévale, conserve un décor intérieur consacré à la faune et à la flore sous-marines.",
      etat: "Phare en service, ancien phare et bâtiment de l'ancienne sirène classés par arrêté du 23 mai 2011 ; propriété de l'État.",
      vis: "evenement",
      visNote: "Ouvertures ponctuelles, notamment lors des Journées du patrimoine ; une ouverture saisonnière est signalée, à vérifier."
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
    },

    /* ================= PROVENCE-ALPES-CÔTE D'AZUR ================= */
    {
      id: "civ:phare-du-planier",
      legacyId: "phare-du-planier",
      theme: "civil",
      nom: "Phare du Planier",
      cat: "civ-phare",
      commune: "Marseille",
      dept: "13 — Bouches-du-Rhône",
      region: "Provence-Alpes-Côte d'Azur",
      ll: [43.19823, 5.22985],
      prec: "exact",
      epoque: "Milieu XXe siècle (1947-1959)",
      hist: "L'îlot du Planier, au large de Marseille, porte un feu depuis le Moyen Âge ; le phare actuel est le cinquième. Celui de 1881 ayant été détruit en août 1944, la reconstruction fut confiée à partir de 1947 au cabinet Arbus et Crillon et resta inachevée. La tour-colonne en pierre, haute de 71,66 m, et ses annexes ordonnancées autour d'une vaste cour composent un ensemble monumental.",
      etat: "Phare, annexes et île classés monument historique par arrêté du 13 septembre 2012 ; propriété de l'État.",
      vis: "exterieur",
      visNote: "Île accessible seulement par bateau ; le site et la tour sont fermés au public."
    },
    {
      id: "civ:phare-de-la-garoupe",
      legacyId: "phare-de-la-garoupe",
      theme: "civil",
      nom: "Phare de la Garoupe",
      cat: "civ-phare",
      commune: "Antibes",
      dept: "06 — Alpes-Maritimes",
      region: "Provence-Alpes-Côte d'Azur",
      ll: [43.56432, 7.1327],
      prec: "exact",
      epoque: "XIXe siècle (1837) ; reconstruction en 1948",
      hist: "Au cap d'Antibes, un premier feu fut allumé le 1er juillet 1837 sur une tour cylindrique, en partie détruite par les troupes allemandes le 11 août 1944. Le phare actuel, une tour carrée de 26 m en pierres apparentes, fut élevé sur l'ancien soubassement rénové et mis en service en 1948. Fermé au public pendant environ vingt-cinq ans, il a rouvert ses portes en 2023.",
      etat: "Phare étudié par l'Inventaire général (IA06001351) ; aucune protection au titre des monuments historiques relevée. Propriété de l'État ; ouverture assurée par la Ville d'Antibes.",
      vis: "libre",
      visNote: "Ascension gratuite par petits groupes, à certains jours seulement ; jours et horaires à vérifier."
    },

    /* ================= CORSE ================= */
    {
      id: "civ:phare-de-pertusato",
      legacyId: "phare-de-pertusato",
      theme: "civil",
      nom: "Phare de Pertusato",
      cat: "civ-phare",
      commune: "Bonifacio",
      dept: "2A — Corse-du-Sud",
      region: "Corse",
      ll: [41.367514, 9.184428],
      prec: "exact",
      epoque: "XIXe siècle (1839-1844)",
      hist: "À la pointe sud de la Corse, face aux bouches de Bonifacio, le phare de Pertusato fut décidé par la Commission des phares en 1839, dans le programme des grands feux de l'île ; sa première optique fut allumée le 15 novembre 1844. Sa tour carrée en pierres apparentes domine un bâtiment rectangulaire, à près de 100 m au-dessus de la mer. Il est automatisé depuis 1985.",
      etat: "Phare étudié par l'Inventaire général (IA2A001276) ; aucune protection au titre des monuments historiques relevée. Propriété de l'État.",
      vis: "exterieur",
      visNote: "Phare non visitable ; abords accessibles par un sentier de falaise."
    },
    {
      id: "civ:phare-des-sanguinaires",
      legacyId: "phare-des-sanguinaires",
      theme: "civil",
      nom: "Phare des Sanguinaires",
      cat: "civ-phare",
      commune: "Ajaccio",
      dept: "2A — Corse-du-Sud",
      region: "Corse",
      ll: [41.878791, 8.594361],
      prec: "exact",
      epoque: "XIXe siècle (1838-1844)",
      hist: "Sur la Grande Sanguinaire, à l'entrée du golfe d'Ajaccio, ce phare fut le premier retenu par la commission chargée en 1838 d'éclairer les côtes corses. Les travaux durèrent six ans, les pierres étant acheminées par barge puis à dos d'âne ; la première optique fut allumée le 15 novembre 1844. Sa tour carrée s'élève sur un soubassement crénelé d'allure médiévale.",
      etat: "Phare étudié par l'Inventaire général (IA2A001274) ; aucune protection au titre des monuments historiques relevée. Propriété de l'État ; état jugé mauvais lors de l'enquête de 2001.",
      vis: "exterieur",
      visNote: "Île accessible par des excursions en bateau ; ouverture de l'intérieur du phare non attestée."
    },

    /* ================= HAUTS-DE-FRANCE ================= */
    {
      id: "civ:phare-de-la-canche",
      legacyId: "phare-de-la-canche",
      theme: "civil",
      nom: "Phare de la Canche",
      cat: "civ-phare",
      commune: "Le Touquet-Paris-Plage",
      dept: "62 — Pas-de-Calais",
      region: "Hauts-de-France",
      ll: [50.52338, 1.59219],
      prec: "exact",
      epoque: "Milieu XXe siècle (1947-1952)",
      hist: "Deux phares inaugurés en 1852 signalaient l'entrée de la baie de la Canche ; ils furent détruits en septembre 1944. Le phare actuel, dessiné par l'architecte Louis Quételart, fut construit de 1947 à 1952 et allumé dès septembre 1951. Sa tour en briques de parement se dresse au centre d'un jardin octogonal, près du bâtiment de 1852, réparé et conservé.",
      etat: "Bâtiments inscrits en 2010 ; tour classée monument historique par arrêté du 19 avril 2011 ; propriété de l'État.",
      vis: "evenement",
      visNote: "Montée possible certains jours et lors d'événements ; se renseigner auprès de l'office de tourisme."
    },
    {
      id: "civ:phare-du-risban",
      legacyId: "phare-du-risban",
      theme: "civil",
      nom: "Phare du Risban",
      cat: "civ-phare",
      commune: "Dunkerque",
      dept: "59 — Nord",
      region: "Hauts-de-France",
      ll: [51.04886, 2.3644],
      prec: "exact",
      epoque: "XIXe siècle (1839-1842 ; électrification en 1883)",
      hist: "Élevé à l'emplacement de l'ancien fort du Risban, le phare de Dunkerque associe une tour cylindrique, dont la maçonnerie fut achevée en 1841, à un bâtiment d'assise carré terminé en 1842. Il reçut l'éclairage électrique et des annexes en 1883. Endommagé pendant la Seconde Guerre mondiale, il conserve sa tour blanche à sommet noir et une lanterne reconstruite après la guerre.",
      etat: "Phare, bâtiment d'assise et annexe classés monument historique par arrêté du 19 avril 2011 ; propriété de l'État.",
      vis: "evenement",
      visNote: "Montée possible selon les périodes ; horaires et conditions à vérifier."
    }
  ]
});
