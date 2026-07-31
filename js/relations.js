'use strict';
/*
 * Registre des relations patrimoniales entre thèmes.
 *
 * Une relation affirme que DEUX FICHES DÉCRIVENT LE MÊME MONUMENT, vu sous
 * l'angle de deux thèmes différents. C'est une assertion éditoriale : elle est
 * inscrite ici à la main, fiche par fiche, et jamais déduite.
 *
 * NE PAS CONFONDRE avec la collision d'identifiants historiques, qui relève de
 * js/app.js et sert uniquement à résoudre une ancienne URL sans thème
 * (?site=chinon). Les deux notions ont failli être confondues, parce qu'elles
 * coïncident pour Chinon et Gisors — mais pas pour Josselin :
 *
 *   cha:josselin  Château de Josselin
 *   rel:josselin  Basilique Notre-Dame-du-Roncier de Josselin
 *
 * Deux monuments DISTINCTS de la même commune, à 152 m l'un de l'autre, qui
 * partagent un identifiant par simple homonymie de lieu. `?site=josselin` doit
 * donc continuer à proposer un choix, mais aucune fiche ne doit annoncer que
 * l'autre décrit le même monument : ce serait faux.
 *
 * AUCUNE relation ne doit être créée à partir d'un identifiant commun, d'une
 * commune commune, d'une distance faible ou d'un nom ressemblant. La proximité
 * ne prouve rien : l'enclos du Temple de Paris a treize édifices religieux à
 * moins de 2 km sans le moindre lien avec lui, et la Maison du Temple de
 * Toulouse est à 259 m du couvent des Jacobins sans qu'il s'agisse du même
 * ensemble. Ces voisinages relèvent de « Autres sites à proximité », qui
 * n'affirme rien de plus qu'une distance.
 *
 * Pour ajouter une relation : vérifier que les deux fiches décrivent bien le
 * même édifice, puis ajouter UNE seule paire ci-dessous. La réciproque est
 * dérivée automatiquement — il n'y a jamais deux entrées à tenir cohérentes.
 */
const RELATIONS = {

  /* Chaque paire est déclarée une fois, dans un sens quelconque.
   * `motif` documente ce qui justifie l'assertion ; il n'est pas affiché. */
  paires: [
    {
      a: 'cha:chinon',
      b: 'tpl:chinon',
      motif: 'Même forteresse royale de Chinon : le corpus châteaux la décrit ' +
        'comme place forte des Plantagenêts, le corpus templier comme lieu de ' +
        'détention des dignitaires de l\'ordre en 1308. Coordonnées à 14 m.'
    },
    {
      a: 'cha:gisors',
      b: 'tpl:gisors',
      motif: 'Même château de Gisors : forteresse normande côté châteaux, ' +
        'garde templière de 1158 et graffiti de la tour du Prisonnier côté ' +
        'templiers. Coordonnées à 97 m.'
    }
  ],

  /* Index bidirectionnel construit au chargement : id -> [ids liés].
   * Déclarer « a ↔ b » suffit, les deux sens sont peuplés ici. */
  index: Object.create(null),

  /* Identifiants liés à `id`, dans un ordre stable. Tableau vide si aucun. */
  liees(id) {
    return this.index[id] || [];
  },

  /* Contrôle d'intégrité, appelé par le châssis avec les identifiants réellement
   * chargés. Renvoie la liste des anomalies plutôt que de lever : une relation
   * fautive ne doit pas empêcher la carte de s'afficher. */
  verifier(idsConnus) {
    const erreurs = [];
    const vues = Object.create(null);
    this.paires.forEach((p, i) => {
      const ou = 'paire ' + (i + 1) + ' (' + p.a + ' ↔ ' + p.b + ')';
      if (!p.a || !p.b) { erreurs.push(ou + ' : identifiant manquant.'); return; }
      if (p.a === p.b) { erreurs.push(ou + ' : une fiche liée à elle-même.'); return; }
      if (!idsConnus.has(p.a)) erreurs.push(ou + ' : « ' + p.a + ' » ne correspond à aucune fiche chargée.');
      if (!idsConnus.has(p.b)) erreurs.push(ou + ' : « ' + p.b + ' » ne correspond à aucune fiche chargée.');
      /* Une même paire déclarée deux fois, dans un sens ou dans l'autre. */
      const cle = [p.a, p.b].sort().join('|');
      if (vues[cle]) erreurs.push(ou + ' : paire déjà déclarée.');
      vues[cle] = true;
    });
    return erreurs;
  }
};

/* Peuplement de l'index, dans les deux sens. */
RELATIONS.paires.forEach((p) => {
  if (!p.a || !p.b || p.a === p.b) return;
  (RELATIONS.index[p.a] = RELATIONS.index[p.a] || []).push(p.b);
  (RELATIONS.index[p.b] = RELATIONS.index[p.b] || []).push(p.a);
});
