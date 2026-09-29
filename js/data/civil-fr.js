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
    }
  ]
});
