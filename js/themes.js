'use strict';
/*
 * Registre des thèmes de « Patrimoine de France ».
 *
 * Le châssis (js/app.js) ne connaît AUCUNE catégorie de site : il lit tout ici.
 * Ajouter un thème = ajouter une entrée dans THEMES + un fichier de données ;
 * aucune ligne du châssis ne doit être touchée.
 *
 * Structure d'un thème :
 *   id       clé du registre, reprise dans le champ `theme` des fiches et dans
 *            le paramètre d'URL `?theme=`
 *   nom      libellé affiché
 *   prefixe  préfixe de l'identifiant interne composite « <prefixe>:<legacyId> »
 *   accent   couleur d'accent du thème (provisoire à ce stade)
 *   glyphe   SVG par défaut de l'épingle, embarqué (aucune ressource distante)
 *   cats     catégories du thème : clé -> { nom, pluriel, c, ordre, glyphe? }
 *            `nom`    libellé affiché dans la fiche et la légende
 *            `pluriel` libellé du contrôle des couches
 *            `c`      couleur, appliquée par CSSOM (element.style), jamais par
 *                     un attribut style dans le HTML : la CSP « style-src
 *                     'self' » l'interdirait
 *            `ordre`  ordre d'affichage (couches, légende, futurs filtres)
 *            `glyphe` SVG propre à la catégorie ; à défaut, celui du thème
 *
 * Les clés de catégorie sont PRÉFIXÉES (cha-fort…) : « fort » désigne un
 * château fort ici mais un village templier fortifié dans le thème templiers,
 * et « eglise » n'a pas le même sens chez les templiers et dans le thème
 * religieux. Sans préfixe, les classes CSS et les groupes de calques entreraient
 * en collision dès le deuxième corpus chargé.
 *
 * ÉTAPE 4 : deux thèmes, « chateaux » et « religieux », avec leurs quatre
 * catégories chacun. Le thème « templiers » viendra plus tard ; les couleurs et
 * glyphes restent provisoires jusqu'à l'étape 8 (identité visuelle).
 */

/* ---------- Registre des corpus ----------
 * Chaque fichier de données s'enregistre lui-même en appelant
 * PATRIMOINE.enregistrer({ theme, version, source, sites }). Le châssis ne
 * connaît donc AUCUN nom de fichier ni aucun nom de variable de corpus : il lit
 * PATRIMOINE.corpus. Ajouter un thème = déposer un fichier de données de plus
 * et l'appeler depuis index.html, sans toucher à js/app.js.
 *
 * Cette forme évite aussi de multiplier les constantes globales : les corpus ne
 * laissent aucun identifiant derrière eux, seul PATRIMOINE existe.
 */
const PATRIMOINE = {
  corpus: [],
  enregistrer(c) {
    if (!c || !c.theme || !Array.isArray(c.sites)) {
      throw new Error('corpus invalide : { theme, sites } attendus.');
    }
    if (!THEMES[c.theme]) {
      throw new Error('corpus « ' + c.theme + ' » : thème non déclaré dans THEMES.');
    }
    if (this.corpus.some((x) => x.theme === c.theme)) {
      throw new Error('corpus « ' + c.theme + ' » enregistré deux fois.');
    }
    this.corpus.push(c);
    return c;
  }
};

/* Glyphes provisoires, dessinés pour l'application (24×24). */
const G_TOUR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V9h2V6h2V9h2V6h2V9h2V6h2V9h2v12h-5v-4a2 2 0 0 0-4 0v4Z"/></svg>';
const G_RUINE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V10h2V7h2v3h2V6h2v6h2V9h2v3h2v9h-4v-5h-3v5Z" opacity=".95"/><path d="M3 21h18v1.6H3Z"/></svg>';
const G_RENAISSANCE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V11l3-2.5V6h2v1.2l4-3.2 4 3.2V6h2v2.5l3 2.5v10h-6v-5a3 3 0 0 0-6 0v5Z"/></svg>';
const G_CLASSIQUE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 22 9v1.6H2V9Zm-8 9h2v6H4Zm4.5 0h2v6h-2Zm4.5 0h2v6h-2Zm4.5 0h2v6h-2ZM2 19.4h20V21H2Z"/></svg>';
/* Thème religieux : deux tours et une rose pour la cathédrale, une galerie de
 * cloître pour l'abbaye, un clocher unique pour l'église, un simple oratoire
 * pour la chapelle. */
const G_CATHEDRALE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V8l2-2 2 2v2h1V6l3-4 3 4v4h1V8l2-2 2 2v13h-6v-4a2 2 0 0 0-4 0v4Z"/><circle cx="12" cy="10.5" r="1.5" fill="#fff" opacity=".85"/></svg>';
const G_ABBAYE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 2h2v3h3v2h-3v4h5v10h-4v-4a2 2 0 0 0-4 0v4H3V11h5V7H5V5h3V2h3Z" opacity=".95"/><path d="M5.5 13.5h2v3h-2Zm3.5 0h2v3H9Z" fill="#fff" opacity=".7"/></svg>';
const G_EGLISE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 2h2v2.5h2.5v2H13v3l5 3v9h-4v-3.5a2 2 0 0 0-4 0V21H6v-9l5-3v-3H8.5v-2H11Z"/></svg>';
const G_CHAPELLE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.2 3h1.6v2h1.7v1.6h-1.7v1.7L19 13v8h-4.6v-3a2.4 2.4 0 0 0-4.8 0v3H5v-8l6.2-4.7V6.6H9.5V5h1.7Z"/></svg>';
/* Thème templier : la croix pattée pour le lieu de mémoire, un logis à croix
 * pour la commanderie, une chapelle à croix pour l'église, une enceinte à tours
 * pour le site fortifié. */
const G_CROIX = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.4 3h5.2l-1.5 5.6h5.9l-2 3.4 2 3.4h-5.9L14.6 21H9.4l1.5-5.6H5l2-3.4-2-3.4h5.9Z"/></svg>';
const G_COMMANDERIE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V10l9-6 9 6v11h-6.5v-4.5a2.5 2.5 0 0 0-5 0V21Z"/><path d="M11.1 6.2h1.8v1.9h1.9v1.8h-1.9v1.9h-1.8V9.9H9.2V8.1h1.9Z" fill="#fff" opacity=".9"/></svg>';
const G_CHAPELLE_TPL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.1 2h1.8v1.7h1.7v1.8h-1.7v2.4L19 12.4V21h-4.3v-3.2a2.7 2.7 0 0 0-5.4 0V21H5v-8.6l6.1-4.5V5.5H9.4V3.7h1.7Z"/></svg>';
const G_ENCEINTE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 21V8h3V5h3v3h8V5h3v3h3v13h-6v-4.5a3 3 0 0 0-6 0V21Z"/><path d="M11.2 10.4h1.6v1.7h1.7v1.6h-1.7v1.7h-1.6v-1.7H9.5v-1.6h1.7Z" fill="#fff" opacity=".85"/></svg>';

const THEMES = {
  chateaux: {
    id: 'chateaux',
    nom: 'Châteaux',
    prefixe: 'cha',
    accent: '#5b6b7a',
    glyphe: G_TOUR,
    cats: {
      'cha-fort': {
        nom: 'Château fort / forteresse',
        pluriel: 'Châteaux forts & forteresses',
        c: '#7c5b3a', ordre: 1, glyphe: G_TOUR
      },
      'cha-ruine': {
        nom: 'Château en ruine',
        pluriel: 'Ruines & vestiges',
        c: '#8a7256', ordre: 2, glyphe: G_RUINE
      },
      'cha-renaissance': {
        nom: 'Château Renaissance',
        pluriel: 'Châteaux Renaissance',
        c: '#9c2007', ordre: 3, glyphe: G_RENAISSANCE
      },
      'cha-classique': {
        nom: 'Château classique / palais',
        pluriel: 'Châteaux classiques & palais',
        c: '#5a4a9f', ordre: 4, glyphe: G_CLASSIQUE
      }
    }
  },

  religieux: {
    id: 'religieux',
    nom: 'Cathédrales et édifices religieux',
    /* Libellé court, pour les listes de résultats et le sélecteur, où le nom
     * complet du thème serait trop long. */
    nomCourt: 'Édifices religieux',
    prefixe: 'rel',
    accent: '#2b6a86',
    glyphe: G_EGLISE,
    cats: {
      'rel-cathedrale': {
        nom: 'Cathédrale ou ancienne cathédrale',
        pluriel: 'Cathédrales',
        c: '#17607e', ordre: 1, glyphe: G_CATHEDRALE
      },
      'rel-abbaye': {
        nom: 'Abbaye, abbatiale ou monastère',
        pluriel: 'Abbayes & monastères',
        c: '#2e7d5b', ordre: 2, glyphe: G_ABBAYE
      },
      'rel-eglise': {
        nom: 'Église ou collégiale',
        pluriel: 'Églises & collégiales',
        c: '#4a6fa5', ordre: 3, glyphe: G_EGLISE
      },
      'rel-chapelle': {
        nom: 'Chapelle ou baptistère',
        pluriel: 'Chapelles & baptistères',
        c: '#0f8f8f', ordre: 4, glyphe: G_CHAPELLE
      }
    }
  },

  templiers: {
    id: 'templiers',
    nom: 'Sites templiers',
    prefixe: 'tpl',
    /* Corpus limité à la France, comme toute l'application : le champ n'est pas
     * porté par les fiches, seulement par l'en-tête du corpus. */
    pays: 'fr',
    accent: '#a3123c',
    glyphe: G_CROIX,
    cats: {
      'tpl-commanderie': {
        nom: 'Commanderie',
        pluriel: 'Commanderies',
        c: '#a3123c', ordre: 1, glyphe: G_COMMANDERIE
      },
      'tpl-eglise': {
        nom: 'Église ou chapelle templière',
        pluriel: 'Églises & chapelles templières',
        c: '#8c2d6b', ordre: 2, glyphe: G_CHAPELLE_TPL
      },
      'tpl-fort': {
        nom: 'Site fortifié templier',
        pluriel: 'Sites fortifiés templiers',
        c: '#cf6a1a', ordre: 3, glyphe: G_ENCEINTE
      },
      'tpl-memoire': {
        /* Placée en dernier : ces lieux n'ont pas de vestige monumental. */
        nom: 'Lieu de mémoire',
        pluriel: 'Lieux de mémoire',
        c: '#6b7078', ordre: 4, glyphe: G_CROIX
      }
    }
  }
};

/* Ordre d'affichage des thèmes ; sert aussi de thème par défaut (premier). */
const THEMES_ORDRE = ['chateaux', 'religieux', 'templiers'];

/* Conditions de visite : vocabulaire commun aux trois thèmes.
 *
 * `memoire` n'est pas une condition d'accès mais l'absence de vestige à voir :
 * le lieu est libre d'accès, il n'y a simplement rien de monumental. D'où un
 * badge neutre et grisé, volontairement distinct des badges d'accès, pour qu'il
 * ne se lise pas comme une invitation à la visite.
 *
 * `vis` et `cat` restent INDÉPENDANTS : trois fiches `tpl-memoire` ont une
 * visite réelle (le-bezu, payns, troyes). Ne jamais déduire l'un de l'autre. */
const VISITES = {
  libre: { txt: 'Accès libre', cls: 'badge-libre' },
  office: { txt: 'Ouvert hors offices', cls: 'badge-office' },
  payant: { txt: 'Visite payante', cls: 'badge-payant' },
  reservation: { txt: 'Visite sur réservation', cls: 'badge-reservation' },
  exterieur: { txt: 'Extérieur visible seulement', cls: 'badge-exterieur' },
  evenement: { txt: 'Ouvertures ponctuelles', cls: 'badge-evenement' },
  prive: { txt: 'Propriété privée — non visitable', cls: 'badge-prive' },
  memoire: { txt: 'Lieu de mémoire — aucun vestige visible', cls: 'badge-memoire' }
};
