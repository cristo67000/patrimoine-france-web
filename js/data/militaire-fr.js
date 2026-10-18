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
    }
  ]
});
