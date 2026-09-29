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
 *   nomCourt libellé court facultatif (filtre, listes de résultats) ; à défaut, `nom`
 *   prefixe  préfixe de l'identifiant interne composite « <prefixe>:<legacyId> »,
 *            et nom du dossier des photographies img/<prefixe>/
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
 * Le corpus d'un thème est, par convention, js/data/<id>-fr.js : l'outillage
 * (tools/fiches/, tools/photos/) le déduit de cette clé, sans table séparée.
 *
 * Cinq thèmes, dans l'ordre de THEMES_ORDRE : châteaux, édifices religieux,
 * sites templiers, patrimoine civil et urbain, patrimoine militaire. Un thème
 * dont le corpus ne compte encore aucune fiche n'est pas proposé dans le
 * filtre (voir PATRIMOINE.themesAvecFiches).
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
  },

  /* Thèmes à proposer dans le filtre : ceux dont le corpus enregistré compte au
   * moins une fiche, dans l'ordre de THEMES_ORDRE. Un thème déclaré mais encore
   * vide reste invisible, et apparaît de lui-même avec sa première fiche : il
   * n'y a aucune liste de thèmes visibles à tenir. */
  themesAvecFiches() {
    return THEMES_ORDRE.filter((t) => this.corpus.some((c) => c.theme === t && c.sites.length > 0));
  },

  /* ---------- Nature d'une illustration ----------
   * Point de décision UNIQUE, partagé par la fiche (js/app.js) et la page des
   * crédits (js/credits.js), qui divergeaient auparavant.
   *
   * `typeIllustration` fait foi quand il est présent. En son absence :
   *   · une photographie personnelle est, par construction, une prise de vue
   *     récente ;
   *   · sinon, seul `date` — le millésime de l'ŒUVRE, que portent les 52 vues
   *     anciennes du corpus châteaux — désigne un document ancien.
   *
   * Ni `titre` ni `datePrise` ne prouvent quoi que ce soit : une photographie
   * moderne peut porter les deux. La règle précédente, qui basculait en « Vue
   * ancienne » dès qu'un `titre` existait, affichait la photographie
   * personnelle de Quéribus (2024) comme une gravure d'Ancien Régime.
   */
  TYPES_ILLUSTRATION: {
    'photographie-moderne': { ancien: false, libelle: 'Photographie' },
    'photographie-ancienne': { ancien: true, libelle: 'Photographie ancienne' },
    'gravure': { ancien: true, libelle: 'Gravure' },
    'dessin': { ancien: true, libelle: 'Dessin' },
    'plan': { ancien: true, libelle: 'Plan' },
    'carte-postale': { ancien: true, libelle: 'Carte postale' },
    'vue-aerienne-historique': { ancien: true, libelle: 'Vue aérienne ancienne' }
  },

  classerIllustration(p) {
    if (!p) return { ancien: false, libelle: 'Photographie' };
    const declare = this.TYPES_ILLUSTRATION[p.typeIllustration];
    if (declare) return declare;
    if (p.origine === 'personnelle') return this.TYPES_ILLUSTRATION['photographie-moderne'];
    /* Repli rétrocompatible : « Vue ancienne » reste le libellé historique des
     * 52 fiches qui ne portent pas encore `typeIllustration`. */
    if (p.date) return { ancien: true, libelle: 'Vue ancienne' };
    return this.TYPES_ILLUSTRATION['photographie-moderne'];
  },

  /* Description du crédit à afficher, indépendante de tout rendu : la fiche et
   * la page des crédits en construisent leur DOM par createElement/textContent.
   *
   * Renvoie une liste de lignes { texte, href? }. Une illustration externe tient
   * sur une seule ligne, comme aujourd'hui pour les 385 crédits existants ; une
   * photographie personnelle en occupe plusieurs, faute de page source à citer.
   */
  creditPhoto(p) {
    const nature = this.classerIllustration(p);
    const perso = p.origine === 'personnelle';
    const lignes = [];

    if (perso) {
      lignes.push({ texte: 'Photographie : ' + p.auteur });
      if (p.datePrise) {
        const d = new Date(p.datePrise + 'T00:00:00');
        lignes.push({ texte: 'Date : ' + (isNaN(d.getTime()) ? p.datePrise
          : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })) });
      }
      const collection = p.sourceLibelle && p.sourceLibelle !== 'Photographie personnelle'
        ? p.sourceLibelle : 'Collection personnelle';
      /* « Tous droits réservés » n'ouvre aucun droit : afficher un lien de
       * licence serait trompeur. La mention tient alors sur la même ligne. */
      if (/^tous droits réservés$/i.test(String(p.licence || '').trim())) {
        lignes.push({ texte: collection + ' — ' + p.licence });
      } else {
        lignes.push({ texte: collection });
        lignes.push({ texte: 'Licence : ' + p.licence, href: p.licenceUrl || null });
      }
    } else {
      lignes.push({
        texte: (nature.ancien
          ? nature.libelle + (p.date ? ' (' + p.date + ')' : '')
          : '📷') + ' ' + p.auteur + ' — ' + p.licence,
        /* Le lien de source suit sur la MÊME ligne, séparé par « · ». */
        suite: p.source ? { href: p.source, texte: 'Wikimedia Commons ↗' } : null
      });
    }

    return { nature, perso, lignes, titre: p.titre || null };
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
/* Thème civil : une rangée de maisons pour la place ou l'ensemble urbain, un
 * hôtel de ville à beffroi et horloge pour l'édifice public, un hôtel à
 * cheminées pour la demeure, des sheds et une cheminée d'usine pour le
 * patrimoine industriel, une tour à lanterne et faisceaux pour le phare ou feu
 * maritime, une tour à calotte et quatre ailes en X pour le moulin, une tour
 * effilée portant une plateforme à garde-corps pour la tour ou le belvédère
 * d'observation. Ouvertures évidées (fill-rule="evenodd") : le glyphe reste
 * d'une seule couleur, quelle que soit celle de l'épingle. Les ailes du moulin
 * forment un second tracé, en règle par défaut (nonzero), pour rester pleines
 * là où elles recouvrent la tour. */
const G_PLACE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M2 21v-8l3-3 3 3v-3l4-4 4 4v3l3-3 3 3v8Zm8.5 0v-4h3v4ZM4 15h2v2H4Zm14 0h2v2h-2Zm-7-5h2v2h-2Z"/></svg>';
const G_MAIRIE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M3 21V11h6V7l3-4 3 4v4h6v10h-7v-4h-4v4Zm9-14.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 1 0 0-2.4ZM5 13h2v2H5Zm12 0h2v2h-2Z"/></svg>';
const G_DEMEURE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M3 21V11l2-4h3V4h2v3h4V4h2v3h3l2 4v10h-7v-4h-4v4Zm3-8h2v2H6Zm10 0h2v2h-2Z"/></svg>';
const G_USINE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M2 21V11l5 3v-3l5 3v-3l5 3V3h3v18Zm2.5-4h2v2h-2Zm5 0h2v2h-2Zm5 0h2v2h-2Z"/></svg>';
const G_PHARE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2l2.2 2.6H9.8Zm-1.7 3h3.4v3h-3.4Zm0 1.5-6.8-2.2v4.4Zm3.4 0 6.8-2.2v4.4ZM8.6 8h6.8v1.4H8.6Zm1.4 1.4h4l1.9 10.6H8.1Zm1 10.6v-2.6a1 1 0 0 1 2 0V20ZM5 20h14v1.6H5Z"/></svg>';
const G_MOULIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M8.2 21l1.7-11h4.2l1.7 11Zm1.2-11a2.6 2.6 0 0 1 5.2 0Zm1.4 11v-2.2a1.2 1.2 0 0 1 2.4 0V21Z"/><path d="M11.6 8.4 10.4 7.1 9.8 7.7 5.2 3.1 7.1 1.2 11.7 5.8 11.1 6.4 12.4 7.6ZM11.6 7.6 12.9 6.4 12.3 5.8 16.9 1.2 18.8 3.1 14.2 7.7 13.6 7.1 12.4 8.4ZM12.4 7.6 13.6 8.9 14.2 8.3 18.8 12.9 16.9 14.8 12.3 10.2 12.9 9.6 11.6 8.4ZM12.4 8.4 11.1 9.6 11.7 10.2 7.1 14.8 5.2 12.9 9.8 8.3 10.4 8.9 11.6 7.6ZM10.8 8a1.2 1.2 0 1 1 2.4 0a1.2 1.2 0 1 1-2.4 0Z"/></svg>';
const G_BELVEDERE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M6 3h12v4h1v1.6h-3.4L17 21H7l1.4-12.4H5V7h1Zm1.2 1.4V7h4.2V4.4Zm5.4 0V7h4.2V4.4ZM11.3 11h1.4v2.6h-1.4Zm-.5 10v-3a1.2 1.2 0 0 1 2.4 0v3Z"/></svg>';
/* Thème militaire : une porte de ville entre deux tours crénelées pour
 * l'enceinte, un fort bastionné en étoile pour le fort ou la citadelle, une
 * cloche cuirassée à créneau de tir pour la Ligne Maginot, un blockhaus à
 * antenne pour les autres ouvrages modernes. */
const G_PORTE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 21V5h2v2h2V5h2v2h2v3h4V7h2V5h2v2h2V5h2v16h-7v-5a3 3 0 0 0-6 0v5Z"/></svg>';
const G_BASTION = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2.4l3.3 5.7 6.4 1.3-4.4 4.9.7 6.6-6-2.7-6 2.7.7-6.6-4.4-4.9 6.4-1.3Zm0 8.2a2 2 0 1 0 0 4 2 2 0 1 0 0-4Z"/></svg>';
const G_CLOCHE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M3 21v-5h3v-2a6 6 0 0 1 12 0v2h3v5ZM8.5 12h7v1.6h-7Z"/></svg>';
const G_BLOCKHAUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M2 21l2.5-6H7v-3h10v3h2.5L22 21ZM9 16.5h6v1.6H9Z"/><path d="M11.3 12V4h1.4v8Z"/></svg>';

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
  },

  /* Patrimoine civil et urbain : le patrimoine industriel en est une
   * catégorie, non un thème distinct. Famille ocre, framboise, vert et brique,
   * à l'écart des couleurs des trois premiers thèmes ; bleu marine pour le
   * phare, plus saturé que les bleus du thème religieux ; brun meunier pour le
   * moulin, plus sombre et plus saturé que le brun du château fort ; violet
   * pour la tour ou le belvédère d'observation, plus rouge que celui du
   * château classique. */
  civil: {
    id: 'civil',
    nom: 'Patrimoine civil et urbain',
    nomCourt: 'Civil et urbain',
    prefixe: 'civ',
    accent: '#9a6a00',
    glyphe: G_MAIRIE,
    cats: {
      'civ-urbain': {
        nom: 'Place ou ensemble urbain',
        pluriel: 'Places & ensembles urbains',
        c: '#9a6a00', ordre: 1, glyphe: G_PLACE
      },
      'civ-public': {
        nom: 'Édifice public',
        pluriel: 'Édifices publics',
        c: '#b03a6e', ordre: 2, glyphe: G_MAIRIE
      },
      'civ-demeure': {
        nom: 'Demeure ou palais civil',
        pluriel: 'Demeures & palais civils',
        c: '#3d7a26', ordre: 3, glyphe: G_DEMEURE
      },
      'civ-industriel': {
        nom: 'Patrimoine industriel',
        pluriel: 'Patrimoine industriel',
        c: '#a0442a', ordre: 4, glyphe: G_USINE
      },
      'civ-phare': {
        nom: 'Phare ou feu maritime',
        pluriel: 'Phares & feux maritimes',
        c: '#005e9e', ordre: 5, glyphe: G_PHARE
      },
      'civ-moulin': {
        /* Fonction meunière comme intérêt patrimonial principal (moulins à
         * eau, à vent, à marée) ; un ensemble industriel plus général relève
         * de civ-industriel. */
        nom: 'Moulin et patrimoine meunier',
        pluriel: 'Moulins & patrimoine meunier',
        c: '#7a4a0e', ordre: 6, glyphe: G_MOULIN
      },
      'civ-belvedere': {
        /* Tour ou belvédère dont l'observation du paysage est la fonction
         * principale ; un édifice dont le belvédère n'est qu'un élément relève
         * de sa propre catégorie. */
        nom: 'Tour ou belvédère d’observation',
        pluriel: 'Tours & belvédères d’observation',
        c: '#7b3fa0', ordre: 7, glyphe: G_BELVEDERE
      }
    }
  },

  /* Patrimoine militaire : la Ligne Maginot en est une catégorie, non un thème
   * distinct. Famille kaki, olive, acier et anthracite. */
  militaire: {
    id: 'militaire',
    nom: 'Patrimoine militaire',
    nomCourt: 'Militaire',
    prefixe: 'mil',
    accent: '#4b5a2b',
    glyphe: G_BASTION,
    cats: {
      'mil-enceinte': {
        nom: 'Enceinte ou porte fortifiée',
        pluriel: 'Enceintes & portes fortifiées',
        c: '#857a3a', ordre: 1, glyphe: G_PORTE
      },
      'mil-fort': {
        nom: 'Fort ou citadelle',
        pluriel: 'Forts & citadelles',
        c: '#4b5a2b', ordre: 2, glyphe: G_BASTION
      },
      'mil-maginot': {
        nom: 'Ouvrage de la Ligne Maginot',
        pluriel: 'Ouvrages de la Ligne Maginot',
        c: '#2d4459', ordre: 3, glyphe: G_CLOCHE
      },
      'mil-moderne': {
        nom: 'Autre ouvrage militaire moderne',
        pluriel: 'Autres ouvrages militaires modernes',
        c: '#46464a', ordre: 4, glyphe: G_BLOCKHAUS
      }
    }
  }
};

/* Ordre d'affichage des thèmes ; sert aussi de thème par défaut (premier).
 * Les trois premiers gardent leur rang ; les thèmes ajoutés viennent à la fin. */
const THEMES_ORDRE = ['chateaux', 'religieux', 'templiers', 'civil', 'militaire'];

/* Conditions de visite : vocabulaire commun à tous les thèmes.
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
