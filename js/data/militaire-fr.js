'use strict';
/*
 * Corpus « Patrimoine militaire » — corpus de référence de Patrimoine de France.
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
 * Identifiants : `id` interne composite « mil:<legacyId> » ; `legacyId` est seul
 * à paraître dans l'URL publique (?theme=militaire&site=<legacyId>). Catégories
 * préfixées (mil-enceinte, mil-fort, mil-maginot, mil-moderne). La Ligne Maginot
 * est une catégorie de ce thème, non un thème distinct.
 *
 * Le corpus s'enregistre lui-même auprès du registre PATRIMOINE (js/themes.js) :
 * aucune constante globale n'est laissée derrière lui, et le châssis n'a pas à
 * connaître le nom de ce fichier.
 */
PATRIMOINE.enregistrer({
  theme: "militaire",
  version: "2026.09",
  source: "cristo67000/patrimoine-france",
  sites: [
    /* ================= GRAND EST ================= */
    {
      id: "mil:porte-des-allemands",
      legacyId: "porte-des-allemands",
      theme: "militaire",
      nom: "Porte des Allemands",
      cat: "mil-enceinte",
      commune: "Metz",
      dept: "57 — Moselle",
      region: "Grand Est",
      ll: [49.11786, 6.18556],
      prec: "exact",
      epoque: "XIIIe–XVe siècle",
      hist: "Porte fortifiée dominant le quartier Outre-Seille, seul vestige encore en élévation des portes médiévales de Metz. Son nom rappelle l'hospice que les chevaliers Teutoniques, et non les Templiers, furent autorisés à bâtir en 1229 dans la rue voisine. La partie tournée vers la ville, à deux tours semi-cylindriques, date du XIIIe siècle ; une seconde porte encadrée de deux tours circulaires lui fut ajoutée en 1445, puis reliée à la première par un pont vers 1480. Vauban l'intégra ensuite à ses fortifications sans la détruire ; elle fut restaurée en 1860-1862 et en 1892.",
      etat: "Ensemble conservé des deux portes et de leur pont, classé monument historique par arrêté du 3 décembre 1966. Rouvert au public le 7 juin 2014, il accueille expositions et manifestations culturelles dans plusieurs salles, avec jardin et terrasse panoramique.",
      vis: "libre",
      visNote: "Abords en accès libre depuis le boulevard André-Maginot ; salles d'exposition ouvertes du mardi au dimanche l'après-midi, selon les horaires publiés par la Ville de Metz.",
      photo: {
        fichier: "porte-des-allemands.webp",
        auteur: "Cristo6772",
        licence: "Tous droits réservés",
        origine: "personnelle",
        sourceLibelle: "Photographie personnelle",
        alt: "Porte des Allemands à Metz : tour ronde crénelée au premier plan, deux tours à toits pointus et pont fortifié en arrière-plan, sous un ciel bleu.",
        modifications: "Redimensionnement à 960 px, conversion WebP, suppression des métadonnées"
      }
    },
    {
      id: "mil:ouvrage-du-hackenberg",
      legacyId: "ouvrage-du-hackenberg",
      theme: "militaire",
      nom: "Ouvrage du Hackenberg",
      cat: "mil-maginot",
      commune: "Veckring",
      dept: "57 — Moselle",
      region: "Grand Est",
      ll: [49.341521, 6.365528],
      prec: "exact",
      epoque: "XXe siècle (1929-1935)",
      hist: "Gros ouvrage d'artillerie du secteur fortifié de Boulay, le Hackenberg fut construit de 1929 à 1935 pour environ un millier d'hommes ; ses 19 blocs sont reliés par des galeries parcourues par un petit train électrique. Non attaqué en juin 1940, il appuya les ouvrages voisins et fut évacué le 4 juillet 1940. En novembre 1944, son bloc 8, tenu par les Allemands, repoussa des troupes américaines avant d'être neutralisé. L'association AMIFORT-Veckring le fait visiter depuis 1975.",
      etat: "Aucune protection au titre des monuments historiques relevée ; ouvrage-musée géré par une association.",
      vis: "payant",
      visNote: "Visites guidées payantes toute l'année, à jours et heures fixes ; seul le demi-ouvrage ouest se visite."
    },
    {
      id: "mil:ouvrage-du-simserhof",
      legacyId: "ouvrage-du-simserhof",
      theme: "militaire",
      nom: "Ouvrage du Simserhof",
      cat: "mil-maginot",
      commune: "Siersthal",
      dept: "57 — Moselle",
      region: "Grand Est",
      ll: [49.062946, 7.373405],
      prec: "exact",
      epoque: "XXe siècle (1929-1936)",
      hist: "Gros ouvrage d'artillerie du secteur fortifié de Rohrbach, près de Bitche, le Simserhof fut bâti dans les années 1929-1936 ; il compte dix blocs et environ 5 km de galeries. Il tint après l'armistice de 1940 et ne se rendit que sur ordre. Abandonné par les Allemands en novembre 1944, il appartient depuis 2012 à la communauté de communes du Pays de Bitche et est ouvert au public depuis 2002.",
      etat: "Aucune protection au titre des monuments historiques relevée ; site touristique intercommunal.",
      vis: "reservation",
      visNote: "Visites uniquement sur réservation."
    },
    {
      id: "mil:ouvrage-de-schoenenbourg",
      legacyId: "ouvrage-de-schoenenbourg",
      theme: "militaire",
      nom: "Ouvrage de Schoenenbourg",
      cat: "mil-maginot",
      commune: "Hunspach",
      dept: "67 — Bas-Rhin",
      region: "Grand Est",
      ll: [48.96545, 7.91421],
      prec: "exact",
      epoque: "XXe siècle (1930-1935)",
      hist: "Conçu en 1929 et construit en béton armé de 1930 à 1935 dans le secteur fortifié de Haguenau, l'ouvrage de Schoenenbourg comprend deux blocs d'entrée, six blocs de combat et trois kilomètres de galeries, pour une garnison de 600 hommes. Attaqué en 1940, il résistait encore à l'armistice ; ses défenseurs se rendirent le 1er juillet 1940. Abandonné en 1968, il a été restauré et ouvert en musée en 1982.",
      etat: "Ouvrage inscrit monument historique par arrêté du 5 octobre 1992, modifié le 14 janvier 1993 ; propriété de l'État.",
      vis: "payant",
      visNote: "Ouvert d'avril à décembre selon un calendrier saisonnier ; visite payante, conditions à vérifier."
    },
    {
      id: "mil:fort-de-mutzig",
      legacyId: "fort-de-mutzig",
      theme: "militaire",
      nom: "Fort de Mutzig",
      cat: "mil-fort",
      commune: "Mutzig",
      dept: "67 — Bas-Rhin",
      region: "Grand Est",
      ll: [48.558697, 7.457191],
      prec: "exact",
      epoque: "Fin XIXe-début XXe siècle (1893-1916)",
      hist: "Construite à partir de 1893 sur la colline de Mutzig et modernisée jusqu'en 1916, la Feste Kaiser Wilhelm II fut la plus grande fortification allemande avant 1918. Ses ouvrages, dispersés sur environ 260 ha et reliés par des souterrains, marquent l'emploi systématique du béton et des cuirassements, ainsi que de centrales électriques propres. Elle ne tira qu'en août 1914 et fut reprise par l'armée française après 1918 ; une partie du site reste militaire.",
      etat: "Ensemble étudié par l'Inventaire général (IA67011542) ; aucune protection au titre des monuments historiques relevée. Partie restaurée ouverte à la visite.",
      vis: "reservation",
      visNote: "Visites guidées sur réservation ; la partie militaire du site n'est pas accessible."
    },
    {
      id: "mil:fort-de-douaumont",
      legacyId: "fort-de-douaumont",
      theme: "militaire",
      nom: "Fort de Douaumont",
      cat: "mil-fort",
      commune: "Douaumont-Vaux",
      dept: "55 — Meuse",
      region: "Grand Est",
      ll: [49.21663, 5.43877],
      prec: "exact",
      epoque: "XIXe-XXe siècles (1885-1913)",
      hist: "Construit en 1885 selon le système Séré de Rivières, renforcé en 1887 et 1890 puis remanié jusqu'en 1913, le fort de Douaumont était le plus important et le plus armé du secteur de Verdun, avec trois étages de galeries et de casemates. Pris le 25 février 1916 et repris le 24 octobre suivant, il reçut près de 120 000 obus pendant la bataille.",
      etat: "Fort classé monument historique par arrêté du 25 novembre 1970 ; propriété de l'État.",
      vis: "payant",
      visNote: "Visite payante, ouverte tous les jours une grande partie de l'année ; horaires saisonniers."
    },
    {
      id: "mil:fort-de-la-pompelle",
      legacyId: "fort-de-la-pompelle",
      theme: "militaire",
      nom: "Fort de la Pompelle",
      cat: "mil-fort",
      commune: "Puisieulx",
      dept: "51 — Marne",
      region: "Grand Est",
      ll: [49.21644, 4.1281],
      prec: "exact",
      epoque: "XIXe siècle (1880-1883)",
      hist: "Fort intermédiaire de la ceinture fortifiée de Reims, bâti de 1880 à 1883 selon le système Séré de Rivières, le fort de la Pompelle fut occupé sans combat le 4 septembre 1914, puis repris par les Français le 24 septembre ; il ne fut plus jamais pris ensuite. Cédé à la Ville de Reims, il accueille depuis 1972 un musée de la Grande Guerre, rénové en 2014, qui conserve notamment une importante collection de casques allemands.",
      etat: "Restes du fort classés monument historique par arrêté du 10 août 1951 ; abords inscrits en 1952.",
      vis: "payant",
      visNote: "Musée ouvert au public ; horaires et tarifs à vérifier."
    },
    {
      id: "mil:fort-de-vaux",
      legacyId: "fort-de-vaux",
      theme: "militaire",
      nom: "Fort de Vaux",
      cat: "mil-fort",
      commune: "Douaumont-Vaux",
      dept: "55 — Meuse",
      region: "Grand Est",
      ll: [49.20063, 5.47017],
      prec: "exact",
      epoque: "XIXe-XXe siècles (1881-1906)",
      hist: "Construit de 1881 à 1884 selon le système Séré de Rivières, renforcé en 1888-1889 puis en 1904-1906 par une tourelle de 75 mm et deux casemates de Bourges, le fort de Vaux fut désarmé en 1915. En juin 1916, sa garnison commandée par le commandant Raynal y résista plusieurs jours avant de se rendre ; le fort fut repris par les Français le 2 novembre 1916.",
      etat: "Fort classé monument historique par arrêté du 25 novembre 1970 ; propriété de l'État. Rouvert en juillet 2026 après travaux.",
      vis: "reservation",
      visNote: "Visite payante avec réservation obligatoire d'un créneau ; accès par navette depuis Verdun."
    },
    {
      id: "mil:ouvrage-du-four-a-chaux",
      legacyId: "ouvrage-du-four-a-chaux",
      theme: "militaire",
      nom: "Ouvrage du Four-à-Chaux",
      cat: "mil-maginot",
      commune: "Lembach",
      dept: "67 — Bas-Rhin",
      region: "Grand Est",
      ll: [48.994008, 7.79578],
      prec: "exact",
      epoque: "XXe siècle (1930-1935)",
      hist: "Construit de 1930 à 1935 au lieu-dit Four à chaux, près de Lembach, cet ouvrage d'artillerie de la ligne Maginot compte huit blocs ; il abrite en sous-sol une caserne, une centrale électrique et un central téléphonique. Massivement bombardé le 19 juin 1940, il se rendit avec les honneurs le 1er juillet. Occupé par l'armée allemande jusqu'en 1944, puis restauré en 1951-1953, il est ouvert au public depuis 1983.",
      etat: "Ouvrage étudié par l'Inventaire général (IA67008575) ; aucune protection au titre des monuments historiques relevée.",
      vis: "payant",
      visNote: "Visites guidées payantes, plus nombreuses de mai à septembre ; calendrier à vérifier."
    },
    {
      id: "mil:ouvrage-de-fermont",
      legacyId: "ouvrage-de-fermont",
      theme: "militaire",
      nom: "Ouvrage de Fermont",
      cat: "mil-maginot",
      commune: "Beuveille",
      dept: "54 — Meurthe-et-Moselle",
      region: "Grand Est",
      ll: [49.449316, 5.667746],
      prec: "exact",
      epoque: "XXe siècle (1931-1935)",
      hist: "Situé aux limites de plusieurs communes, dont Beuveille, le gros ouvrage de Fermont appartient au secteur fortifié de la Crusnes ; achevé en 1935, il compte neuf blocs et une galerie parcourue en petit train électrique. En juin 1940, il subit des tirs de 88 mm et repoussa un assaut allemand le 21 juin, avant d'être remis aux Allemands le 27 juin. Une association le fait visiter et y présente un musée de plein air.",
      etat: "Aucune protection au titre des monuments historiques relevée ; ouvrage-musée associatif.",
      vis: "payant",
      visNote: "Visites guidées payantes d'avril à novembre, à heures fixes."
    },

    /* ================= HAUTS-DE-FRANCE ================= */
    {
      id: "mil:citadelle-arras",
      legacyId: "citadelle-arras",
      theme: "militaire",
      nom: "Citadelle d’Arras",
      cat: "mil-fort",
      commune: "Arras",
      dept: "62 — Pas-de-Calais",
      region: "Hauts-de-France",
      ll: [50.282977, 2.759999],
      prec: "exact",
      epoque: "Seconde moitié XVIIe siècle",
      hist: "La citadelle d'Arras a été conçue par Vauban à partir de 1668. Elle adopte un plan bastionné pentagonal et associe ouvrages de défense, place d'armes, casernements, arsenal et chapelle. Son système extérieur fut modifié aux siècles suivants. Elle appartient aujourd'hui au patrimoine des grandes places fortes de la période moderne.",
      etat: "Citadelle classée monument historique dans son ensemble le 23 octobre 2012 ; composante du bien en série UNESCO des fortifications de Vauban.",
      vis: "libre",
      visNote: "Accès libre aux espaces de promenade ; certaines visites intérieures et animations sont programmées séparément."
    },

    /* ================= NORMANDIE ================= */
    {
      id: "mil:tour-de-la-hougue",
      legacyId: "tour-de-la-hougue",
      theme: "militaire",
      nom: "Tour de la Hougue",
      cat: "mil-tour",
      commune: "Saint-Vaast-la-Hougue",
      dept: "50 — Manche",
      region: "Normandie",
      ll: [49.5727705, -1.2747826],
      prec: "exact",
      epoque: "Fin XVIIe siècle (1694-1699)",
      hist: "À l'extrémité du fort de la Hougue, une tour à canons fut élevée à partir de 1694 par l'ingénieur de Combes, dans le dispositif côtier imaginé sous Vauban. Achevée avant la fin du XVIIe siècle, elle répond à la tour implantée sur l'île de Tatihou pour défendre la baie de Saint-Vaast. Les fortifications ont ensuite été renforcées et adaptées à de nouveaux moyens d'artillerie.",
      etat: "Le fort comprenant la tour est classé dans sa totalité par arrêté du 20 novembre 2015, se substituant à la protection de 1929.",
      vis: "payant",
      visNote: "Accès payant en saison ; selon la formule choisie, la visite comprend ou non l'accès à la tour. Dates et modalités auprès de l'office de tourisme de Saint-Vaast-la-Hougue."
    },
    {
      id: "mil:tour-de-tatihou",
      legacyId: "tour-de-tatihou",
      theme: "militaire",
      nom: "Tour Vauban de Tatihou",
      cat: "mil-tour",
      commune: "Saint-Vaast-la-Hougue",
      dept: "50 — Manche",
      region: "Normandie",
      ll: [49.58631, -1.24113],
      prec: "exact",
      epoque: "Fin XVIIe siècle (à partir de 1694)",
      hist: "Sur l'île de Tatihou, une tour de défense côtière fut construite à la fin du XVIIe siècle dans le cadre du système de surveillance et d'artillerie de la rade de Saint-Vaast. Elle fonctionne historiquement en complément de la tour de la Hougue, située sur le continent. L'île comporte aussi un fort, d'autres ouvrages militaires et un ancien lazaret, distincts de la tour.",
      etat: "La tour et les ouvrages fortifiés de Tatihou figurent dans l'ensemble protégé de l'île, notamment classé en 2008.",
      vis: "reservation",
      visNote: "Accès par navette à réserver ; forfait payant incluant l’île et la tour Vauban selon l’offre publiée."
    },

    /* ================= BOURGOGNE-FRANCHE-COMTÉ ================= */
    {
      id: "mil:fort-saint-andre-salins",
      legacyId: "fort-saint-andre-salins",
      theme: "militaire",
      nom: "Fort Saint-André",
      cat: "mil-fort",
      commune: "Salins-les-Bains",
      dept: "39 — Jura",
      region: "Bourgogne-Franche-Comté",
      ll: [46.94124, 5.86997],
      prec: "exact",
      epoque: "Seconde moitié XVIIe siècle",
      hist: "Établi sur les hauteurs de Salins-les-Bains, le fort Saint-André appartient au dispositif de défense de la cité et de ses salines. Les fortifications furent adaptées à partir des années 1670 selon les conceptions de Vauban. Le site conserva ensuite différentes fonctions, notamment celle de prison d'État au XIXe siècle.",
      etat: "Parties inscrites en 1991, ensemble des fortifications et bâtiments concernés classé en 1993.",
      vis: "evenement",
      visNote: "Fort principalement réservé aux réceptions et aux groupes ; accessible aux particuliers lors d'événements ou d'ouvertures ponctuelles."
    },

    /* ================= CORSE ================= */
    {
      id: "mil:tour-de-la-parata",
      legacyId: "tour-de-la-parata",
      theme: "militaire",
      nom: "Tour de la Parata",
      cat: "mil-tour",
      commune: "Ajaccio",
      dept: "2A — Corse-du-Sud",
      region: "Corse",
      ll: [41.89538, 8.60841],
      prec: "exact",
      epoque: "XVIe siècle (1550-1551)",
      hist: "Située sur la presqu'île de la Parata, à l'entrée du golfe d'Ajaccio, cette tour de surveillance littorale fut édifiée dans les années 1550-1551, durant la domination génoise. Elle contribuait au réseau de guet destiné à surveiller les approches maritimes. La tour demeure un repère majeur du paysage des îles Sanguinaires.",
      etat: "Tour toujours en place sur la presqu'île de la Parata ; seul l'extérieur est accessible.",
      vis: "exterieur",
      visNote: "Approche extérieure par sentier ; intérieur normalement fermé, ouvert seulement lors de visites exceptionnelles."
    },

    /* ================= OCCITANIE ================= */
    {
      id: "mil:fort-de-bellegarde",
      legacyId: "fort-de-bellegarde",
      theme: "militaire",
      nom: "Fort de Bellegarde",
      cat: "mil-fort",
      commune: "Le Perthus",
      dept: "66 — Pyrénées-Orientales",
      region: "Occitanie",
      ll: [42.4574, 2.8595],
      prec: "exact",
      epoque: "XIVe siècle (origine) ; 1679-1697 et XVIIIe siècle",
      hist: "Dominant le col du Perthus, le fort de Bellegarde succède à une fortification mentionnée à la fin du royaume de Majorque. Pris par les Espagnols en 1674 et repris en 1675, il fut transformé après l'inspection de Vauban en 1679 : l'ancien donjon fut rasé et une seconde enceinte élevée en 1680. Les travaux se poursuivirent à la fin du XVIIe siècle et au XVIIIe siècle ; la redoute isolée de Panissars complète l'ensemble.",
      etat: "Ensemble des ouvrages, avec la redoute de Panissars, classé monument historique par arrêté du 26 juin 1967 ; propriété de l'État.",
      vis: "payant",
      visNote: "Visite payante, libre ou guidée à heures fixes ; dernier accès à 16 h 45."
    },

    /* ================= NOUVELLE-AQUITAINE ================= */
    {
      id: "mil:fort-medoc",
      legacyId: "fort-medoc",
      theme: "militaire",
      nom: "Fort Médoc",
      cat: "mil-fort",
      commune: "Cussac-Fort-Médoc",
      dept: "33 — Gironde",
      region: "Nouvelle-Aquitaine",
      ll: [45.11112, -0.70388],
      prec: "exact",
      epoque: "Fin XVIIe siècle (1689-1691)",
      hist: "Sur la rive gauche de la Gironde, face à la citadelle de Blaye, le fort Médoc fut élevé de 1689 à 1691 dans le système de défense de l'estuaire établi d'après les plans de Vauban. Son intérêt militaire fut contesté et il fut laissé sans entretien dès le début du XVIIIe siècle. Son plan quadrangulaire à quatre bastions, sa porte monumentale et les vestiges de ses casernes, de sa chapelle, de sa boulangerie et de sa poudrière restent lisibles.",
      etat: "Poudrière et vestiges inscrits en 1956 ; ensemble classé par arrêté du 20 juin 2008, sauf la chapelle et la boulangerie ; propriété communale.",
      vis: "payant",
      visNote: "Visite payante en saison, horaires réduits hors saison et fermeture en hiver selon des guides ; calendrier à vérifier."
    },
    {
      id: "mil:fort-liedot",
      legacyId: "fort-liedot",
      theme: "militaire",
      nom: "Fort Liédot",
      cat: "mil-fort",
      commune: "Île-d'Aix",
      dept: "17 — Charente-Maritime",
      region: "Nouvelle-Aquitaine",
      ll: [46.02257, -1.16455],
      prec: "exact",
      epoque: "XIXe siècle (1810-1834 ; 1878-1889)",
      hist: "Au nord-est de l'île d'Aix, le fort Liédot fut décidé par Napoléon après sa visite de 1808 et construit de 1810 à 1834 pour défendre l'embouchure de la Charente et l'arsenal de Rochefort. Ce fort carré à quatre bastions, en partie enterré, servit de lieu de détention, notamment pour des communards en 1871 et pour Ahmed Ben Bella de 1959 à 1961. Distinct du fort Boyard, bâti en mer, il fut remanié à la fin du XIXe siècle.",
      etat: "Fort, fossés et glacis classés monument historique par arrêté du 8 septembre 1995 ; propriété du Conservatoire du littoral.",
      vis: "payant",
      visNote: "Visites guidées payantes selon le calendrier publié."
    },

    /* ================= AUVERGNE-RHÔNE-ALPES ================= */
    {
      id: "mil:fort-l-ecluse",
      legacyId: "fort-l-ecluse",
      theme: "militaire",
      nom: "Fort l'Écluse",
      cat: "mil-fort",
      commune: "Léaz",
      dept: "01 — Ain",
      region: "Auvergne-Rhône-Alpes",
      ll: [46.120658, 5.892688],
      prec: "exact",
      epoque: "XIIIe siècle (origine) ; 1820-1841",
      hist: "Verrou de la cluse du Rhône sur la route de Genève, le fort l'Écluse succède à un château des sires de Gex du XIIIe siècle, savoyard en 1293 puis français en 1601. Ruiné en 1814-1815, il fut reconstruit à partir de 1820 ; le fort supérieur, engagé en 1827, est relié au fort inférieur, adossé à la falaise, par un long escalier souterrain. Il appartient depuis 1997 à la communauté de communes du Pays de Gex.",
      etat: "Aucune protection au titre des monuments historiques relevée ; site classé au titre des sites. Propriété intercommunale.",
      vis: "payant",
      visNote: "Visite payante en saison, de mi-juin à mi-septembre, selon les horaires publiés par le site ; hors saison, groupes sur réservation."
    },
    {
      id: "mil:fort-victor-emmanuel",
      legacyId: "fort-victor-emmanuel",
      theme: "militaire",
      nom: "Fort Victor-Emmanuel",
      cat: "mil-fort",
      commune: "Aussois",
      dept: "73 — Savoie",
      region: "Auvergne-Rhône-Alpes",
      ll: [45.21275, 6.73595],
      prec: "exact",
      epoque: "XIXe siècle (1820-1833)",
      hist: "Plus grand ouvrage de la barrière de l'Esseillon, le fort Victor-Emmanuel fut bâti par le royaume de Sardaigne entre 1820 et 1833 pour fermer la route du Mont-Cenis, grâce aux indemnités versées par la France après 1815. Inspirée du modèle de Montalembert, la barrière ne connut jamais le combat ; réutilisée par l'armée française après 1860, elle fut abandonnée par les militaires en 1967.",
      etat: "Fort classé monument historique avec le cimetière sarde par arrêté du 30 décembre 1991 ; propriété communale, restauration en cours.",
      vis: "libre",
      visNote: "Accès libre et gratuit ; visites guidées et nocturnes sur réservation auprès de l'office de tourisme d'Aussois ou de la Facim."
    },

    /* ================= BRETAGNE ================= */
    {
      id: "mil:citadelle-de-belle-ile",
      legacyId: "citadelle-de-belle-ile",
      theme: "militaire",
      nom: "Citadelle Vauban de Belle-Île",
      cat: "mil-fort",
      commune: "Le Palais",
      dept: "56 — Morbihan",
      region: "Bretagne",
      ll: [47.35062, -3.15514],
      prec: "exact",
      epoque: "XVIe siècle (fort de 1549) ; années 1680 (Vauban)",
      hist: "Dominant le port du Palais, la citadelle de Belle-Île trouve son origine dans un fort élevé à partir de 1549, agrandi par les Gondi puis remanié par Vauban dans les années 1680. Elle conserve notamment une poudrière circulaire et des vestiges de casemates. Au XIXe siècle, une maison de détention fut établie sur ses glacis, à Haute-Boulogne, où furent enfermés Barbès et Blanqui.",
      etat: "Mur de Haute-Boulogne inscrit en 1994 ; citadelle classée par arrêté du 22 juin 2007. En travaux pour devenir un hôtel-musée, avec une ouverture annoncée pour l'été 2027.",
      vis: "exterieur",
      visNote: "Fermée pour travaux ; réouverture annoncée pour l'été 2027."
    },
    {
      id: "mil:citadelle-de-port-louis",
      legacyId: "citadelle-de-port-louis",
      theme: "militaire",
      nom: "Citadelle de Port-Louis",
      cat: "mil-fort",
      commune: "Port-Louis",
      dept: "56 — Morbihan",
      region: "Bretagne",
      ll: [47.710089, -3.363237],
      prec: "exact",
      epoque: "Fin XVIe siècle ; XVIIe-XVIIIe siècles",
      hist: "Gardant l'entrée de la rade de Lorient, la citadelle de Port-Louis succède à un fort espagnol commencé vers 1590-1591, en partie démantelé après la paix de Vervins. Reconstruite sous Louis XIII, entre 1616 et 1622 selon la notice Mérimée, elle fut complétée par une demi-lune en 1636, puis par l'enceinte de la ville. Elle abrite le Musée national de la Marine et le musée de la Compagnie des Indes.",
      etat: "Remparts inscrits en 1933 ; citadelle et remparts classés en 1948 ; grande poudrière classée en 1999.",
      vis: "payant",
      visNote: "Visite payante des musées, avec horaires saisonniers."
    }
  ]
});
