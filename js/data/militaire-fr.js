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
    }
  ]
});
