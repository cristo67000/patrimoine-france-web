'use strict';
/*
 * Patrimoine de France — châssis commun (étape 5 sur 9).
 *
 * Extrait des fonctions génériques de `chateaux-de-france/js/app.js` (lu en
 * seule lecture), complété par `majEtatGeo()` et l'affichage pédagogique de la
 * permission de géolocalisation, repris de `cathedrales-de-france/js/app.js`.
 *
 * Ce fichier ne connaît aucun thème : catégories, couleurs, glyphes et libellés
 * sont lus dans le registre `THEMES` (js/themes.js), et les corpus dans
 * `PATRIMOINE.corpus` — donc aucun nom de fichier de données non plus. Le filtre
 * de thèmes et le contrôle des couches sont construits depuis ce registre.
 * Les champs facultatifs (`arch`, `roles`) sont affichés d'après leur présence
 * dans la fiche, jamais d'après son thème. Les rendus spécifiques (typologies,
 * plans, chronologies, vues anciennes, photographies) arriveront à l'étape 7
 * sous forme de fonctions de rendu déclarées par thème.
 *
 * Aucune donnée personnelle ne quitte l'appareil : la géolocalisation est
 * optionnelle, demandée uniquement à l'appui sur le bouton, et le calcul du site
 * le plus proche est fait localement.
 */
(function () {
  const APP = { version: '0.5.0 — châteaux, édifices religieux et sites templiers' };
  /* Les corpus se sont enregistrés eux-mêmes auprès de PATRIMOINE (js/themes.js)
   * au moment de leur chargement par index.html. Le châssis ne connaît donc ni
   * leur nombre, ni leurs noms de fichiers, ni aucun nom de variable.
   * Ils sont présentés dans l'ordre déclaré par THEMES_ORDRE, pas dans l'ordre
   * des balises <script>. */
  const CORPUS = PATRIMOINE.corpus.slice()
    .sort((a, b) => THEMES_ORDRE.indexOf(a.theme) - THEMES_ORDRE.indexOf(b.theme));
  const SITES = CORPUS.reduce((acc, c) => acc.concat(c.sites), []);

  /* ---------- Carte ---------- */
  const map = L.map('map', {
    center: [46.6, 2.6],
    zoom: 6,
    minZoom: 5,
    maxZoom: 18,
    maxBounds: [[39.5, -9.0], [53.0, 12.5]],
    maxBoundsViscosity: 0.7,
    zoomControl: false
  });
  L.control.zoom({ position: 'topright', zoomInTitle: 'Zoomer', zoomOutTitle: 'Dézoomer' }).addTo(map);
  const EN_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (EN_LOCAL) window.__map = map;
  L.control.scale({ imperial: false, position: 'bottomright' }).addTo(map);

  /* Fonds vectoriels OpenFreeMap (gratuits, usage commercial autorisé). */
  const OFM_ATTRIB = '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> — données © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';
  const fondPlan = L.maplibreGL({ style: 'https://tiles.openfreemap.org/styles/liberty', attribution: OFM_ATTRIB });
  const fondEpure = L.maplibreGL({ style: 'https://tiles.openfreemap.org/styles/positron', attribution: OFM_ATTRIB });
  fondPlan.addTo(map);

  function updateZoomClass() {
    const c = map.getContainer();
    c.classList.toggle('zoom-far', map.getZoom() < 7);
    c.classList.toggle('zoom-near', map.getZoom() >= 9);
  }
  map.on('zoomend', updateZoomClass);
  updateZoomClass();

  /* ---------- Étiquettes géographiques ---------- */
  function labelMarker(item, cls, html) {
    return L.marker(item.ll, {
      interactive: false,
      keyboard: false,
      icon: L.divIcon({ className: 'geo-wrap', html: '<span class="geo-lbl ' + cls + '">' + html + '</span>', iconSize: null })
    });
  }
  const fmtAlt = (m) => m.toLocaleString('fr-FR') + ' m';
  const mersGroup = L.layerGroup(
    GEO_LABELS.mers.map((i) => labelMarker(i, 'lbl-mer', i.n))
      .concat(GEO_LABELS.cotes.map((i) => labelMarker(i, 'lbl-cote', i.n)))
  );
  const ilesGroup = L.layerGroup(GEO_LABELS.iles.map((i) => labelMarker(i, 'lbl-ile', i.n)));
  const montagnesGroup = L.layerGroup(
    GEO_LABELS.massifs.map((i) => labelMarker(i, 'lbl-massif', i.n))
      .concat(GEO_LABELS.sommets.map((i) => labelMarker(i, 'lbl-sommet', '▲ ' + i.n + ' <em>' + fmtAlt(i.alt) + '</em>')))
  );
  const fleuveLabels = GEO_LABELS.fleuves.map((i) => labelMarker(i, 'lbl-fleuve', i.n));
  const fleuvesLayer = L.layerGroup();

  /* ---------- Identifiants et URL ----------
   * Identifiant interne : « <prefixe>:<legacyId> » (ex. cha:chinon).
   * URL publique        : ?theme=chateaux&site=chinon — jamais de « : ».
   */
  function theme(s) { return THEMES[s.theme]; }
  function categorie(s) { return theme(s).cats[s.cat]; }
  /* Glyphe de la catégorie, à défaut celui du thème. */
  function glyphe(s) { return categorie(s).glyphe || theme(s).glyphe; }
  function idInterne(themeId, legacyId) {
    const t = THEMES[themeId];
    return t ? t.prefixe + ':' + legacyId : null;
  }

  /* Nom court du thème, pour les listes où le libellé complet serait trop long. */
  function nomTheme(t) { return t.nomCourt || t.nom; }

  /* Résolution des URL historiques sans paramètre `theme` (?site=josselin),
   * héritées des trois applications d'origine.
   * Règle arrêtée : si l'identifiant ne correspond qu'à une seule fiche, ouvrir
   * cette fiche ; s'il correspond à plusieurs thèmes, afficher un choix à
   * l'utilisateur. AUCUNE priorité automatique entre thèmes.
   * Cette fonction renvoie donc TOUTES les correspondances — jamais une fiche
   * unique choisie d'office — et l'appelant décide de l'affichage.
   * Le filtre de thèmes n'entre pas en jeu ici : un lien reçu de l'extérieur
   * doit aboutir quel que soit l'état de l'affichage. */
  function resoudreIdHistorique(legacyId) {
    return SITES.filter((s) => s.legacyId === legacyId);
  }

  /* Fiches décrivant le MÊME MONUMENT dans un autre thème.
   *
   * Lu dans le registre explicite js/relations.js, jamais déduit. Un identifiant
   * historique commun ne suffit pas : `josselin` désigne le château dans un
   * corpus et la basilique dans l'autre — deux monuments distincts de la même
   * commune. La collision d'identifiants sert à résoudre les anciennes URL
   * (resoudreIdHistorique), la relation patrimoniale à afficher le renvoi ;
   * ce sont deux notions séparées, qui ne coïncident pas toujours. */
  function memeMonumentAutresThemes(s) {
    return RELATIONS.liees(s.id)
      .map((id) => SITES.find((x) => x.id === id))
      .filter(Boolean);
  }

  /* Renvoie { id } à ouvrir, ou { ambigu, legacyId } à faire trancher. */
  function lireURL() {
    const p = new URLSearchParams(window.location.search);
    const themeId = p.get('theme');
    const legacyId = p.get('site');
    if (!legacyId) return null;
    if (themeId && THEMES[themeId]) {
      const id = idInterne(themeId, legacyId);
      /* Un thème explicite mais un identifiant inconnu dans ce thème : on ne se
       * rabat pas silencieusement sur un autre thème. */
      return SITES.some((s) => s.id === id) ? { id } : null;
    }
    const trouves = resoudreIdHistorique(legacyId);
    if (trouves.length === 1) return { id: trouves[0].id };
    if (trouves.length > 1) return { ambigu: trouves, legacyId };
    return null;
  }

  function majURL(s) {
    const q = '?theme=' + encodeURIComponent(s.theme) + '&site=' + encodeURIComponent(s.legacyId);
    window.history.replaceState(null, '', q);
  }

  /* ---------- Marqueurs ----------
   * Aucune catégorie codée en dur : tout vient du registre des thèmes.
   * La couleur est posée par CSSOM après insertion dans le DOM — un attribut
   * style dans le HTML du divIcon serait bloqué par « style-src 'self' ».
   */
  const catGroups = {};
  const markersById = {};

  function cleGroupe(themeId, catId) { return themeId + ':' + catId; }

  SITES.forEach((s) => {
    const cle = cleGroupe(s.theme, s.cat);
    if (!catGroups[cle]) catGroups[cle] = L.layerGroup();
    const marker = L.marker(s.ll, {
      icon: L.divIcon({
        className: 'site-wrap',
        html: '<span class="site-pin' + (s.top ? ' pin-top' : '') + '">' + glyphe(s) + '</span>',
        iconSize: null
      }),
      riseOnHover: true,
      zIndexOffset: s.top ? 250 : 0,
      keyboard: false
    });
    marker.bindTooltip(s.nom, { direction: 'top', offset: [0, -14] });
    marker.on('click', () => selectSite(s.id, {}));
    markersById[s.id] = marker;
    catGroups[cle].addLayer(marker);
  });
  Object.values(catGroups).forEach((g) => g.addTo(map));

  /* Couleur de catégorie : une fois les éléments présents dans le DOM.
   * À REJOUER après chaque retrait/remise d'un groupe de calques : Leaflet
   * recrée alors l'élément du marqueur, et la propriété posée par CSSOM est
   * perdue — les épingles retombaient sur la couleur d'accent par défaut, donc
   * toutes identiques. Un attribut style dans le HTML du divIcon règlerait le
   * problème, mais « style-src 'self' » l'interdit. */
  function colorierMarqueurs() {
    SITES.forEach((s) => {
      const m = markersById[s.id];
      const dom = m && m.getElement();
      const pin = dom && dom.querySelector('.site-pin');
      if (pin && pin.style.getPropertyValue('--c') !== categorie(s).c) {
        pin.style.setProperty('--c', categorie(s).c);
      }
    });
  }
  colorierMarqueurs();
  /* Même perte quand l'utilisateur recoche une catégorie dans le contrôle des
   * couches : l'évènement est émis par la carte, il survit donc à la
   * reconstruction du contrôle à chaque changement de thème. */
  map.on('overlayadd', colorierMarqueurs);

  /* ---------- Filtre de thèmes ----------
   * Construit depuis THEMES_ORDRE : aucun thème n'est écrit ici ni dans le HTML.
   * Un groupe de boutons radio — accessible au clavier nativement (flèches),
   * et confortable au doigt grâce aux cibles de 44 px du CSS.
   */
  const themesVisibles = new Set(THEMES_ORDRE.filter((t) => THEMES[t]));
  const THEMES_CHARGES = THEMES_ORDRE.filter((t) => CORPUS.some((c) => c.theme === t));

  function themeVisible(s) { return themesVisibles.has(s.theme); }
  function sitesVisibles() { return SITES.filter(themeVisible); }

  /* getElementById direct : le raccourci el() est défini plus bas, avec le
   * panneau de fiche. */
  const filtre = document.getElementById('theme-filter');
  const radios = {};

  function construireFiltre() {
    const choix = [{ v: '*', lbl: 'Tous les sites' }]
      .concat(THEMES_CHARGES.map((t) => ({ v: t, lbl: nomTheme(THEMES[t]), c: THEMES[t].accent })));
    /* Un seul thème chargé : le filtre n'aurait rien à filtrer. */
    if (THEMES_CHARGES.length < 2) { filtre.hidden = true; return; }
    choix.forEach((o) => {
      const lab = document.createElement('label');
      lab.className = 'tf-opt';
      const inp = document.createElement('input');
      inp.type = 'radio';
      inp.name = 'theme-filter';
      inp.value = o.v;
      inp.checked = o.v === '*';
      inp.addEventListener('change', () => { if (inp.checked) appliquerFiltre(o.v); });
      const txt = document.createElement('span');
      txt.textContent = o.lbl;
      if (o.c) txt.style.setProperty('--tf-c', o.c);
      lab.appendChild(inp);
      lab.appendChild(txt);
      filtre.appendChild(lab);
      radios[o.v] = inp;
    });
  }

  /* Le contrôle des couches est reconstruit à chaque changement : les catégories
   * d'un thème masqué doivent disparaître de la liste, pas seulement de la carte. */
  let controleCouches = null;
  let couchesPretes = false;

  function majControleCouches() {
    if (!couchesPretes) return;
    if (controleCouches) { map.removeControl(controleCouches); controleCouches = null; }
    const overlays = {};
    Object.keys(catGroups)
      .map((cle) => {
        const part = cle.split(':');
        return { cle, t: THEMES[part[0]], cat: THEMES[part[0]].cats[part[1]] };
      })
      .filter((e) => themesVisibles.has(e.t.id))
      .sort((a, b) =>
        THEMES_ORDRE.indexOf(a.t.id) - THEMES_ORDRE.indexOf(b.t.id) ||
        (a.cat.ordre || 0) - (b.cat.ordre || 0))
      .forEach((e) => {
        const n = catGroups[e.cle].getLayers().length;
        overlays[nomTheme(e.t) + ' — ' + e.cat.pluriel + ' (' + n + ')'] = catGroups[e.cle];
      });
    overlays['Fleuves & rivières'] = fleuvesLayer;
    overlays['Mers & côtes'] = mersGroup;
    overlays['Montagnes & sommets'] = montagnesGroup;
    overlays['Îles'] = ilesGroup;
    controleCouches = L.control.layers(
      { 'Plan (Liberty)': fondPlan, 'Épuré (Positron)': fondEpure },
      overlays,
      { collapsed: true, position: 'topright' }
    ).addTo(map);
  }

  function appliquerFiltre(valeur) {
    themesVisibles.clear();
    if (valeur === '*') THEMES_CHARGES.forEach((t) => themesVisibles.add(t));
    else themesVisibles.add(valeur);
    if (radios[valeur]) radios[valeur].checked = true;

    Object.keys(catGroups).forEach((cle) => {
      const themeId = cle.split(':')[0];
      const g = catGroups[cle];
      if (themesVisibles.has(themeId)) { if (!map.hasLayer(g)) g.addTo(map); }
      else if (map.hasLayer(g)) map.removeLayer(g);
    });

    /* Les marqueurs réaffichés ont un élément DOM tout neuf : recolorer. */
    colorierMarqueurs();
    majDatalist();
    majControleCouches();

    /* Une fiche ou une liste devenue hors filtre ne doit pas rester à l'écran. */
    if (selectedId) {
      const s = SITES.find((x) => x.id === selectedId);
      if (s && !themeVisible(s)) fermerPanneau();
    }
    if (!results.hidden && dernierResultat) {
      const restants = dernierResultat.liste.filter((x) => themeVisible(x.e.s));
      if (!restants.length) fermerResultats();
      else afficherResultats(dernierResultat.requete, restants, dernierResultat.titre);
    }
  }

  /* ---------- Distances (calcul local) ---------- */
  function haversineKm(a, b) {
    const r = Math.PI / 180;
    const la1 = a[0] * r, la2 = b[0] * r;
    const h = Math.sin((la2 - la1) / 2) ** 2 +
      Math.cos(la1) * Math.cos(la2) * Math.sin((b[1] - a[1]) * r / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(h));
  }
  /* Sous le kilomètre, on affiche des mètres : les renvois entre thèmes portent
   * sur le même monument (14 m à Chinon), et « 0,0 km » ne voulait rien dire.
   * toLocaleString est appliqué au NOMBRE, pas à la chaîne de toFixed — sans
   * quoi la virgule décimale française n'était jamais posée. */
  function fmtKm(d) {
    if (d < 1) return Math.round(d * 1000).toLocaleString('fr-FR') + ' m';
    if (d < 10) return d.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' km';
    return Math.round(d).toLocaleString('fr-FR') + ' km';
  }
  /* `exclus` : identifiants déjà présentés ailleurs dans la fiche — la fiche du
   * même lieu dans un autre thème figure dans l'encart de renvoi, la répéter
   * à 14 m dans « sites à proximité » n'apprendrait rien. */
  function nearestSites(ll, n, excludeId, exclus) {
    const hors = exclus || [];
    return SITES
      .filter((s) => s.id !== excludeId && hors.indexOf(s.id) === -1 && themeVisible(s))
      .map((s) => ({ s, d: haversineKm(ll, s.ll) }))
      .sort((x, y) => x.d - y.d)
      .slice(0, n);
  }

  /* ---------- Panneau de fiche ---------- */
  const panel = document.getElementById('panel');
  const el = (id) => document.getElementById(id);
  let selectedId = null;
  let userPos = null;
  /* Liste à restituer par « Retour aux résultats » ; null si la fiche a été
   * ouverte depuis la carte, un voisin ou une URL. */
  let retourListe = null;
  /* Élément ayant déclenché l'ouverture de la fiche (bouton de résultat, de
   * voisinage…), pour restituer le focus à la fermeture. Les marqueurs de
   * carte sont volontairement non focusables (keyboard: false) : dans ce cas
   * l'élément capturé n'est pas pertinent et la restitution est ignorée. */
  let elementDeclencheur = null;

  /* Ne retire theme et site de l'URL que sur une fermeture explicite ; les
   * autres paramètres éventuels (aucun aujourd'hui hors mode debug ?pos=) ne
   * sont jamais touchés. */
  function nettoyerURL() {
    const p = new URLSearchParams(window.location.search);
    if (!p.has('theme') && !p.has('site')) return;
    p.delete('theme');
    p.delete('site');
    const q = p.toString();
    window.history.replaceState(null, '', window.location.pathname + (q ? '?' + q : ''));
  }

  function setPinSelected(id, on) {
    const m = markersById[id];
    if (!m) return;
    const dom = m.getElement();
    if (!dom) return;
    const pin = dom.querySelector('.site-pin');
    if (pin) pin.classList.toggle('pin-sel', on);
  }

  function fermerPanneau() {
    panel.hidden = true;
    retourListe = null;
    if (selectedId) { setPinSelected(selectedId, false); selectedId = null; }
    nettoyerURL();
    /* Restitution du focus « lorsque cela est possible » : l'élément qui a
     * ouvert la fiche doit encore exister et être focusable (un marqueur de
     * carte ne l'est jamais, cf. elementDeclencheur ci-dessus). */
    const cible = elementDeclencheur;
    elementDeclencheur = null;
    if (cible && cible !== document.body && document.contains(cible) && typeof cible.focus === 'function') {
      cible.focus();
    }
  }

  /* ---------- Photographie ----------
   * Schéma commun aux trois thèmes : photo: { fichier, auteur, licence, source,
   * titre?, date? }. titre et date sont facultatifs (seul le corpus châteaux
   * les fournit, pour ses 52 vues anciennes) : absents, ils ne sont jamais
   * affichés à leur place ni remplacés par une valeur inventée.
   *
   * Une fiche sans `photo` (247 sur 584) n'affiche RIEN : pas de cadre vide, pas
   * de pictogramme générique, pas de message. Le bloc <figure> reste hidden.
   *
   * Construit entièrement par createElement/textContent : aucune donnée de
   * fiche ne passe par innerHTML.
   */
  const figure = el('p-figure');
  const figImg = el('p-figure-img');
  const figBtn = el('p-figure-btn');
  const figCaption = el('p-figure-caption');
  let photoCourante = null;   /* { s, credit } pour le dialogue d'agrandissement */

  /* Un même texte de crédit sert à la fiche et au dialogue : une seule
   * construction, jamais dupliquée en deux endroits divergents. */
  function construireCredit(s, conteneur) {
    conteneur.textContent = '';
    const p = s.photo;
    const estVue = !!(p.titre || p.date);
    const intro = document.createElement('span');
    intro.className = 'credit-intro';
    intro.textContent = estVue
      ? 'Vue ancienne' + (p.date ? ' (' + p.date + ')' : '') + ' — ' + p.auteur + ' — ' + p.licence + ' · '
      : '📷 ' + p.auteur + ' — ' + p.licence + ' · ';
    conteneur.appendChild(intro);
    const lien = document.createElement('a');
    lien.href = p.source;
    lien.target = '_blank';
    lien.rel = 'noopener noreferrer';
    lien.textContent = 'Wikimedia Commons ↗';
    conteneur.appendChild(lien);
    if (p.titre) {
      const titre = document.createElement('span');
      titre.className = 'credit-titre';
      titre.textContent = ' « ' + p.titre + ' »';
      conteneur.appendChild(titre);
    }
  }

  function renderPhoto(s) {
    if (!s.photo) {
      figure.hidden = true;
      figImg.removeAttribute('src');
      photoCourante = null;
      return;
    }
    const p = s.photo;
    const estVue = !!(p.titre || p.date);
    figImg.src = 'img/' + theme(s).prefixe + '/' + p.fichier;
    figImg.alt = estVue ? 'Vue ancienne de ' + s.nom : s.nom;
    /* Échec de chargement (image pas encore en cache hors ligne, par exemple) :
     * masquer tout le bloc, sans icône cassée ni erreur JS. onerror se
     * désarme lui-même pour ne pas boucler si src est retouché ailleurs. */
    figImg.onerror = () => { figure.hidden = true; figImg.onerror = null; };
    figure.hidden = false;
    construireCredit(s, figCaption);
    photoCourante = s;
  }

  /* ---------- Dialogue d'agrandissement ---------- */
  const dialoguePhoto = el('dialogue-photo');
  const dialogueImg = el('dialogue-photo-img');
  const dialogueCredit = el('dialogue-photo-credit');
  let dernierFocusPhoto = null;

  function ouvrirPhoto() {
    if (!photoCourante) return;
    dernierFocusPhoto = document.activeElement;
    dialogueImg.src = figImg.src;
    dialogueImg.alt = figImg.alt;
    construireCredit(photoCourante, dialogueCredit);
    dialoguePhoto.showModal();
  }
  function fermerPhoto() {
    dialoguePhoto.close();
    dialogueImg.removeAttribute('src');
    if (dernierFocusPhoto) dernierFocusPhoto.focus();
  }
  figBtn.addEventListener('click', ouvrirPhoto);
  el('dialogue-photo-close').addEventListener('click', fermerPhoto);
  /* <dialog> ferme déjà sur Échap nativement ; on n'intercepte que pour
   * restituer le focus, qui ne fait pas partie du comportement natif. */
  dialoguePhoto.addEventListener('close', () => {
    dialogueImg.removeAttribute('src');
    if (dernierFocusPhoto) dernierFocusPhoto.focus();
  });

  function selectSite(id, opts) {
    const s = SITES.find((x) => x.id === id);
    if (!s) return;
    /* Capturé avant toute manipulation du DOM : un clic réel sur un bouton
     * (résultat, voisin) l'a déjà mis au focus ; un marqueur de carte,
     * volontairement non focusable, laisse document.activeElement inchangé. */
    elementDeclencheur = document.activeElement;
    /* Un lien profond vers un thème masqué doit aboutir : on rétablit
     * l'affichage du thème plutôt que d'ignorer la demande en silence. */
    if (!themeVisible(s)) {
      appliquerFiltre('*');
      toast('Affichage de tous les thèmes rétabli pour ouvrir ce site.');
    }
    /* Le retour n'est proposé que si la fiche vient d'une liste. Mémorisé avant
     * fermerResultats(), qui ne doit pas effacer la liste à restituer. */
    const retour = opts.depuisListe && dernierResultat
      ? { requete: dernierResultat.requete, liste: dernierResultat.liste, titre: dernierResultat.titre, focusId: id }
      : null;
    fermerResultats();
    if (selectedId) setPinSelected(selectedId, false);
    selectedId = id;
    setPinSelected(id, true);
    if (opts.zoom) map.setView(s.ll, Math.max(map.getZoom(), 13));

    const cat = categorie(s);
    el('p-chip').style.background = cat.c;
    el('p-theme').textContent = theme(s).nom;
    el('p-cat-txt').textContent = cat.nom;
    el('p-top').hidden = !s.top;
    el('p-nom').textContent = s.nom;
    el('p-lieu').textContent = s.commune + ' — ' + s.dept + ' · ' + s.region +
      (s.prec === 'commune' ? ' · position au bourg le plus proche' : '');
    renderPhoto(s);
    const v = VISITES[s.vis] || VISITES.exterieur;
    el('p-badge').textContent = v.txt;
    el('p-badge').className = 'badge ' + v.cls;
    el('p-epoque').textContent = s.epoque;
    /* Champs facultatifs affichés dès qu'ils existent : le châssis n'interroge
     * pas le thème, seulement la présence du champ. Le corpus religieux les
     * renseigne (arch sur les 285 fiches, roles sur 171) ; un autre corpus qui
     * les fournirait en bénéficierait sans modifier une ligne ici. */
    el('p-arch-bloc').hidden = !s.arch;
    if (s.arch) el('p-arch').textContent = s.arch;
    el('p-roles-bloc').hidden = !s.roles;
    if (s.roles) el('p-roles').textContent = s.roles;
    el('p-hist').textContent = s.hist;
    el('p-etat').textContent = s.etat;
    el('p-visite').textContent = s.visNote;
    el('p-note').hidden = !s.note;
    if (s.note) el('p-note').textContent = '⚖️ ' + s.note;

    const note = el('p-locate-note');
    if (userPos) {
      note.textContent = '📍 À ' + fmtKm(haversineKm(userPos, s.ll)) + ' de votre position (à vol d’oiseau).';
      note.hidden = false;
    } else {
      note.hidden = true;
    }

    /* Renvoi explicite : relation patrimoniale déclarée dans js/relations.js.
     * Construit par createElement/textContent, comme toute donnée de fiche. */
    const memes = memeMonumentAutresThemes(s);
    const renvoi = el('p-renvoi');
    const renvoiListe = el('p-renvoi-liste');
    renvoiListe.textContent = '';
    memes.forEach((autre) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rv-item';

      const chip = document.createElement('span');
      chip.className = 'rv-chip';
      chip.style.background = categorie(autre).c;
      const nom = document.createElement('span');
      nom.className = 'rv-nom';
      nom.textContent = autre.nom;
      const meta = document.createElement('span');
      meta.className = 'rv-meta';
      const d = haversineKm(s.ll, autre.ll);
      meta.textContent = nomTheme(theme(autre)) + ' · ' + categorie(autre).nom +
        ' — à ' + fmtKm(d) + ' de ce point';

      btn.appendChild(chip);
      btn.appendChild(nom);
      btn.appendChild(meta);
      /* Le renvoi est symétrique : la fiche d'arrivée en porte un vers celle-ci,
       * ce qui suffit à revenir en arrière sans historique dédié. */
      btn.addEventListener('click', () => selectSite(autre.id, { zoom: true }));
      li.appendChild(btn);
      renvoiListe.appendChild(li);
    });
    renvoi.hidden = memes.length === 0;

    /* Voisins : inter-thèmes par construction — aucun filtre sur `theme`, seul
     * le filtre d'affichage choisi par l'utilisateur s'applique, pour qu'un
     * voisin proposé corresponde toujours à un marqueur présent sur la carte. */
    const nearby = nearestSites(s.ll, 3, s.id, memes.map((x) => x.id));
    const list = el('p-nearby-list');
    list.textContent = '';
    nearby.forEach((n) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nb-item';

      const chip = document.createElement('span');
      chip.className = 'nb-chip';
      chip.style.background = categorie(n.s).c;
      const nom = document.createElement('span');
      nom.className = 'nb-nom';
      nom.textContent = n.s.nom;
      /* Chaque voisin annonce son thème et sa catégorie : sans cela, rien ne
       * distinguerait le château de Josselin de la basilique voisine. */
      const meta = document.createElement('span');
      meta.className = 'nb-meta';
      meta.textContent = nomTheme(theme(n.s)) + ' · ' + categorie(n.s).nom + ' — ' + fmtKm(n.d);

      btn.appendChild(chip);
      btn.appendChild(nom);
      btn.appendChild(meta);
      btn.addEventListener('click', () => selectSite(n.s.id, { zoom: true }));
      li.appendChild(btn);
      list.appendChild(li);
    });
    el('p-nearby').hidden = nearby.length === 0;

    /* Retour aux résultats : présent seulement si la fiche vient d'une liste. */
    retourListe = retour;
    const btnRetour = el('p-retour');
    btnRetour.hidden = !retour;

    el('p-route').href = 'https://www.google.com/maps/dir/?api=1&destination=' + s.ll[0] + ',' + s.ll[1];
    el('p-zoom').onclick = () => selectSite(id, { zoom: true });
    panel.hidden = false;
    panel.scrollTop = 0;
    majURL(s);
  }
  el('p-close').addEventListener('click', fermerPanneau);

  /* Restitution de la liste : même requête, même ordre, même titre, et le focus
   * rendu au résultat d'où l'on venait. */
  el('p-retour').addEventListener('click', () => {
    if (!retourListe) return;
    const cible = retourListe.focusId;
    afficherResultats(retourListe.requete, retourListe.liste, retourListe.titre);
    const idx = retourListe.liste.findIndex((x) => x.e.s.id === cible);
    const boutons = el('r-list').querySelectorAll('.r-item');
    const btn = idx >= 0 ? boutons[idx] : boutons[0];
    if (btn) { btn.focus(); btn.classList.add('r-item-vu'); }
  });

  /* ---------- Recherche ----------
   * NFD seul ne suffit pas : la décomposition canonique ne touche pas les
   * ligatures (œ, æ) ni ß, qui ne sont pas des lettres accentuées mais des
   * caractères à part entière. « koenigsbourg » ne trouvait donc pas
   * « Haut-Kœnigsbourg ». On les remplace explicitement AVANT la décomposition.
   */
  const LIGATURES = {
    'œ': 'oe', 'æ': 'ae', 'ß': 'ss',
    'ø': 'o', 'đ': 'd', 'ð': 'd', 'ł': 'l', 'þ': 'th'
  };

  /* Normalisation « lisible » : casse, accents, ligatures et apostrophes
   * typographiques neutralisés ; séparateurs réduits à une espace simple. */
  function norm(s) {
    return s
      .toLowerCase()
      .replace(/[œæßøđðłþ]/g, (c) => LIGATURES[c])
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/['’‘`´]/g, ' ')
      .replace(/[-–—_/.]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Clé de comparaison : en plus, séparateurs et ponctuation supprimés, pour
   * que « haut koenigsbourg », « Haut-Kœnigsbourg » et « hautkœnigsbourg »
   * donnent la même chaîne. Utilisée à l'indexation comme à la saisie. */
  function normCle(s) { return norm(s).replace(/[^a-z0-9]+/g, ''); }

  const search = el('search');
  const datalist = el('site-list');
  /* Libellé d'une entrée du datalist. Une seule définition, réutilisée par
   * l'index : choisir une suggestion doit donc toujours ouvrir la fiche
   * correspondante, sans passer par la liste de résultats. */
  function entreeDatalist(s) {
    return s.nom + ' — ' + s.commune + ' (' + s.dept.slice(0, 2) + ')';
  }
  /* Les suggestions suivent le filtre de thèmes : un thème masqué ne doit plus
   * être proposé. Reconstruite à chaque changement de filtre. */
  function majDatalist() {
    datalist.textContent = '';
    sitesVisibles()
      .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
      .forEach((s) => {
        const opt = document.createElement('option');
        opt.value = entreeDatalist(s);
        datalist.appendChild(opt);
      });
  }
  /* Index de recherche : les clés sont calculées une fois, avec exactement la
   * même fonction que la saisie de l'utilisateur. Aucun thème, aucune catégorie
   * n'est écrit ici : le moteur ne connaît que des champs. */
  const INDEX = SITES.map((s) => ({
    s,
    nom: normCle(s.nom),
    legacy: normCle(s.legacyId),
    entree: normCle(entreeDatalist(s)),
    commune: normCle(s.commune),
    dept: normCle(s.dept),
    region: normCle(s.region),
    /* Libellés de la CATÉGORIE, lus dans le registre : « Lieu de mémoire » ou
     * « Commanderie » ne figurent dans aucun autre champ, et une recherche par
     * type de site ne trouvait donc rien. Aucune catégorie n'est écrite ici —
     * elles viennent toutes de THEMES.
     * Le nom du THÈME est volontairement exclu : « Cathédrales et édifices
     * religieux » ferait correspondre les 285 fiches du thème à la requête
     * « cathédrale », alors que 112 seulement sont des cathédrales. Le filtre
     * de thèmes est là pour cet usage. */
    type: normCle(categorie(s).nom + ' ' + categorie(s).pluriel)
  }));

  /* Rang de correspondance, du plus précis au plus large. 0 = aucune.
   * Les rangs 1 à 6 sont inchangés ; le type de site est délibérément le plus
   * large, pour ne jamais passer devant un nom, une commune ou une région. */
  function rang(e, q) {
    if (e.nom === q) return 1;
    if (e.nom.indexOf(q) === 0) return 2;
    if (e.nom.indexOf(q) !== -1) return 3;
    if (e.commune.indexOf(q) !== -1) return 4;
    if (e.dept.indexOf(q) !== -1) return 5;
    if (e.region.indexOf(q) !== -1) return 6;
    if (e.type.indexOf(q) !== -1) return 7;
    return 0;
  }

  /* Renvoie { direct, liste } : `direct` est une fiche à ouvrir sans détour,
   * `liste` l'ensemble classé des correspondances. Jamais de sélection
   * arbitraire du premier résultat quand plusieurs fiches conviennent. */
  /* La recherche ordinaire ne voit que les thèmes affichés : masquer un thème
   * doit réellement le retirer des résultats, pas seulement de la carte. */
  function rechercher(brut) {
    const complet = normCle(brut);
    const q = normCle(brut.split(' — ')[0]);
    if (!q) return null;
    const visible = INDEX.filter((e) => themeVisible(e.s));

    /* A — correspondance exacte et unique : entrée du datalist, puis
     * identifiant historique. Ces deux formes désignent une fiche précise.
     * Un legacyId présent dans deux thèmes visibles reste ambigu : on ne
     * tranche pas, la liste s'affiche. */
    const parEntree = visible.filter((e) => e.entree === complet);
    if (parEntree.length === 1) return { direct: parEntree[0].s, liste: [] };
    const parLegacy = visible.filter((e) => e.legacy === q);
    if (parLegacy.length === 1) return { direct: parLegacy[0].s, liste: [] };

    const liste = visible
      .map((e) => ({ e, r: rang(e, q) }))
      .filter((x) => x.r > 0)
      .sort((a, b) => a.r - b.r || a.e.s.nom.localeCompare(b.e.s.nom, 'fr'));

    if (!liste.length) return { direct: null, liste: [] };
    /* A — nom complet exact, s'il ne désigne qu'une fiche. */
    const exacts = liste.filter((x) => x.r === 1);
    if (exacts.length === 1) return { direct: exacts[0].e.s, liste };
    /* B — résultat unique. */
    if (liste.length === 1) return { direct: liste[0].e.s, liste };
    /* C — plusieurs fiches : on laisse choisir. */
    return { direct: null, liste };
  }

  /* ---------- Panneau de résultats ---------- */
  const results = document.getElementById('results');
  /* Dernière liste affichée : conservée telle quelle (requête, ordre, titre) pour
   * que « Retour aux résultats » la restitue à l'identique. */
  let dernierResultat = null;

  function fermerResultats() {
    results.hidden = true;
    el('r-list').textContent = '';
  }

  /* `titre` facultatif : sert au panneau de choix des identifiants ambigus, qui
   * n'est pas une recherche et ne doit pas s'annoncer comme telle. */
  function afficherResultats(requete, liste, titre) {
    /* La fiche et la liste occupent le même emplacement : elles ne cohabitent pas. */
    panel.hidden = true;
    if (selectedId) { setPinSelected(selectedId, false); selectedId = null; }

    dernierResultat = { requete, liste, titre };
    el('r-title').textContent = titre ||
      (liste.length + ' résultats pour « ' + requete + ' »');
    const ol = el('r-list');
    ol.textContent = '';
    liste.forEach((x) => {
      const s = x.e.s;
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'r-item';

      const chip = document.createElement('span');
      chip.className = 'r-chip';
      chip.style.background = categorie(s).c;

      const nom = document.createElement('span');
      nom.className = 'r-nom';
      nom.textContent = s.nom;

      /* Thème sur sa propre ligne : avec deux corpus, savoir de quel thème
       * relève un résultat prime sur la compacité. */
      const th = document.createElement('span');
      th.className = 'r-theme';
      th.textContent = nomTheme(theme(s)) + ' · ' + categorie(s).nom;
      th.style.setProperty('--tc', categorie(s).c);

      const meta = document.createElement('span');
      meta.className = 'r-meta';
      let txt = s.commune + ' — ' + s.dept + ' · ' + s.region;
      /* Distance seulement si la position est déjà connue : jamais de demande
       * de permission déclenchée par une recherche. */
      if (userPos) txt += ' · ' + fmtKm(haversineKm(userPos, s.ll));
      meta.textContent = txt;

      btn.appendChild(chip);
      btn.appendChild(nom);
      btn.appendChild(th);
      btn.appendChild(meta);
      btn.addEventListener('click', () => selectSite(s.id, { zoom: true, depuisListe: true }));
      li.appendChild(btn);
      ol.appendChild(li);
    });
    results.hidden = false;
    results.scrollTop = 0;
  }

  /* Panneau de choix pour un identifiant historique porté par plusieurs thèmes.
   * Aucune priorité entre thèmes : les fiches sont présentées dans l'ordre du
   * registre, et rien n'est ouvert tant que l'utilisateur n'a pas tranché. */
  function afficherAmbiguite(legacyId, trouves) {
    const liste = trouves
      .slice()
      .sort((a, b) =>
        THEMES_ORDRE.indexOf(a.theme) - THEMES_ORDRE.indexOf(b.theme) ||
        a.nom.localeCompare(b.nom, 'fr'))
      .map((s) => ({ e: { s } }));
    afficherResultats(legacyId, liste,
      'L’identifiant « ' + legacyId + ' » désigne ' + liste.length +
      ' sites dans des thèmes différents. Choisissez :');
    toast('Ancien lien sans thème : plusieurs sites portent l’identifiant « ' + legacyId +' ».');
  }

  el('r-close').addEventListener('click', () => {
    fermerResultats();
    dernierResultat = null;
    search.focus();
  });

  /* Échap ferme la liste, puis la fiche. Les dialogues « À propos » et
   * « Photographie » gèrent eux-mêmes leur touche Échap (comportement natif de
   * <dialog>) : si l'un des deux est ouvert, on ne leur prend pas la main —
   * sans ce garde-fou, Échap aurait aussi refermé la fiche sous la photo
   * agrandie, en plus de l'image. */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || about.open || dialoguePhoto.open) return;
    if (!results.hidden) { fermerResultats(); search.focus(); return; }
    if (!panel.hidden) fermerPanneau();
  });

  function runSearch() {
    const brut = search.value.trim();
    const r = rechercher(brut);
    if (!r) return;
    if (r.direct) {
      selectSite(r.direct.id, { zoom: true });
      search.blur();
      return;
    }
    if (!r.liste.length) {
      fermerResultats();
      toast('Aucun site trouvé pour « ' + brut + ' »');
      return;
    }
    afficherResultats(brut, r.liste);
  }
  search.addEventListener('change', runSearch);
  search.addEventListener('keydown', (e) => { if (e.key === 'Enter') runSearch(); });

  /* ---------- Toast ---------- */
  const toastEl = el('toast');
  let toastTimer = null;
  function toast(msg, sticky) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    /* Les messages persistants doivent pouvoir être écartés à la main. */
    toastEl.classList.toggle('toast-sticky', !!sticky);
    clearTimeout(toastTimer);
    if (!sticky) toastTimer = setTimeout(() => { toastEl.hidden = true; }, 4500);
  }
  toastEl.addEventListener('click', () => { toastEl.hidden = true; });

  /* ---------- Géolocalisation (optionnelle, traitement 100 % local) ---------- */
  let posMarker = null;
  function onPosition(lat, lng, accuracy) {
    userPos = [lat, lng];
    if (posMarker) map.removeLayer(posMarker);
    posMarker = L.layerGroup([
      L.circle([lat, lng], { radius: Math.min(accuracy || 50, 5000), color: '#1d6fb8', weight: 1, fillOpacity: 0.12 }),
      L.circleMarker([lat, lng], { radius: 7, color: '#fff', weight: 2, fillColor: '#1d6fb8', fillOpacity: 1 })
    ]).addTo(map);
    const near = nearestSites(userPos, 1, null);
    if (!near.length) return;
    const proche = near[0];
    toastEl.hidden = true;
    if (proche.d > 400) {
      map.setView([lat, lng], Math.max(map.getZoom(), 7));
      toast('Vous êtes loin des sites recensés — le plus proche est ' + proche.s.nom + ' (' + fmtKm(proche.d) + ').');
    } else {
      map.fitBounds(L.latLngBounds([lat, lng], proche.s.ll).pad(0.4));
      toast('Site le plus proche : ' + proche.s.nom + ' à ' + fmtKm(proche.d) + '.');
    }
    selectSite(proche.s.id, {});
  }
  /* Quand la permission est déjà refusée, le navigateur n'affiche AUCUNE invite et
   * rappelle aussitôt le callback d'erreur : sans message explicite, l'appui sur le
   * bouton semble sans effet. D'où le pré-contrôle et le message actionnable. */
  const GEO_BLOQUE = 'Localisation bloquée pour ce site. Pour l’autoriser : appuyez sur ' +
    'l’icône à gauche de l’adresse (cadenas ou ⓘ) → Autorisations → Position → Autoriser, ' +
    'puis rechargez la page.';
  const GEO_ERRORS = {
    1: GEO_BLOQUE,
    2: 'Position indisponible. Vérifiez que la localisation est activée dans les réglages de l’appareil.',
    3: 'Délai dépassé. Réessayez, de préférence à l’extérieur ou près d’une fenêtre.'
  };
  function demanderPosition() {
    toast('Recherche de votre position…', true);
    navigator.geolocation.getCurrentPosition(
      (p) => onPosition(p.coords.latitude, p.coords.longitude, p.coords.accuracy),
      (err) => toast(GEO_ERRORS[err.code] || 'Erreur de géolocalisation.', err.code === 1),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }
  function locate() {
    /* Mode debug : ?pos=lat,lng simule une position, UNIQUEMENT en développement.
     * En production ce raccourci afficherait une position fabriquée présentée comme
     * réelle, sans passer par l'API de géolocalisation ni par aucune permission. */
    const m = EN_LOCAL && /[?&]pos=([0-9.-]+),([0-9.-]+)/.exec(window.location.search);
    if (m) { onPosition(parseFloat(m[1]), parseFloat(m[2]), 30); return; }
    if (!('geolocation' in navigator)) { toast('Géolocalisation non disponible sur cet appareil.', true); return; }
    if (!window.isSecureContext) { toast('La géolocalisation exige une connexion sécurisée (HTTPS).', true); return; }
    /* L'API Permissions manque sur d'anciens Safari : on tente directement. */
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((p) => { if (p.state === 'denied') toast(GEO_BLOQUE, true); else demanderPosition(); })
        .catch(demanderPosition);
      return;
    }
    demanderPosition();
  }
  const LocateControl = L.Control.extend({
    onAdd() {
      const btn = L.DomUtil.create('button', 'locate-btn');
      btn.type = 'button';
      btn.title = 'Près de quel site suis-je ?';
      btn.setAttribute('aria-label', 'Me localiser');
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 3h-2.07A7 7 0 0 0 13 5.07V3h-2v2.07A7 7 0 0 0 5.07 11H3v2h2.07A7 7 0 0 0 11 18.93V21h2v-2.07A7 7 0 0 0 18.93 13H21Z"/></svg>';
      L.DomEvent.disableClickPropagation(btn);
      btn.addEventListener('click', locate);
      return btn;
    }
  });
  new LocateControl({ position: 'topright' }).addTo(map);

  /* ---------- Fleuves + contrôle des couches ---------- */
  fetch('data/fleuves.geojson')
    .then((r) => { if (!r.ok) throw new Error('fleuves ' + r.status); return r.json(); })
    .then((fleuves) => {
      const lines = L.geoJSON(fleuves, {
        style: { color: '#3d8bd4', weight: 2, opacity: 0.85 },
        onEachFeature: (f, l) => l.bindTooltip(f.properties.name, { sticky: true })
      });
      fleuvesLayer.addLayer(lines);
      fleuveLabels.forEach((m) => fleuvesLayer.addLayer(m));
      fleuvesLayer.addTo(map);
      mersGroup.addTo(map);
      montagnesGroup.addTo(map);
      ilesGroup.addTo(map);

      /* Les entrées de catégories sont construites depuis le registre, dans
       * l'ordre d'affichage qu'il déclare, avec l'effectif de chaque groupe —
       * et limitées aux thèmes actuellement visibles. */
      couchesPretes = true;
      majControleCouches();
    })
    .catch((err) => {
      console.error(err);
      toast('Erreur de chargement des données cartographiques.', true);
    });

  /* ---------- Dialogue « À propos » ---------- */
  const about = document.getElementById('about');
  /* État de la permission, affiché à l'ouverture du dialogue : permet de comprendre
   * pourquoi le navigateur demande — ou ne demande plus — l'autorisation.
   * Repris de l'application « Cathédrales et Églises de France ». */
  const GEO_ETATS = {
    granted: 'accordée (le navigateur ne redemandera pas)',
    prompt: 'pas encore demandée (elle le sera à l’appui sur le bouton ⊕)',
    denied: 'refusée — à réactiver dans les réglages du site'
  };
  function majEtatGeo() {
    const cible = el('geo-etat-val');
    if (!navigator.permissions || !navigator.permissions.query) {
      cible.textContent = 'non consultable sur ce navigateur';
      return;
    }
    navigator.permissions.query({ name: 'geolocation' })
      .then((p) => { cible.textContent = GEO_ETATS[p.state] || p.state; })
      .catch(() => { cible.textContent = 'non consultable sur ce navigateur'; });
  }
  el('btn-about').addEventListener('click', () => { majEtatGeo(); about.showModal(); });
  el('about-close').addEventListener('click', () => about.close());
  el('app-version').textContent = APP.version;

  /* Corpus effectivement chargés : effectifs réels, jamais un nombre écrit en dur. */
  el('corpus-nb').textContent = SITES.length.toLocaleString('fr-FR');
  el('corpus-liste').textContent = CORPUS
    .map((c) => nomTheme(THEMES[c.theme]) + ' (' + c.sites.length.toLocaleString('fr-FR') + ')')
    .join(', ');

  /* ---------- Démarrage ---------- */
  construireFiltre();
  majDatalist();

  /* Le registre des relations désigne des fiches par leur identifiant interne :
   * une faute de frappe y serait invisible, le renvoi disparaissant en silence.
   * On le confronte donc aux fiches réellement chargées. Signalé en console
   * seulement : une relation fautive ne doit pas empêcher la carte de
   * fonctionner. Les identifiants absents sont déjà ignorés par
   * memeMonumentAutresThemes(). */
  const erreursRelations = RELATIONS.verifier(new Set(SITES.map((s) => s.id)));
  if (erreursRelations.length) {
    console.warn('js/relations.js — ' + erreursRelations.length + ' anomalie(s) :\n  ' +
      erreursRelations.join('\n  '));
  }

  /* Ouverture depuis l'URL. Un identifiant historique porté par plusieurs
   * thèmes n'ouvre rien : il présente un choix. */
  const cible = lireURL();
  if (cible && cible.ambigu) afficherAmbiguite(cible.legacyId, cible.ambigu);
  else if (cible && markersById[cible.id]) selectSite(cible.id, { zoom: true });

  /* ---------- Service worker : enregistrement et mise à jour ----------
   * Chemin et portée relatifs (« ./sw.js », pas « /sw.js ») : compatibles
   * avec une publication dans un sous-répertoire GitHub Pages comme avec un
   * futur domaine dédié. Aucune autorisation demandée, aucun message à la
   * première installation — seulement à une mise à jour ultérieure. */
  const majBandeau = el('maj-bandeau');
  const majBtn = el('maj-btn');
  const majTexte = el('maj-texte');
  let rechargementDemande = false;
  /* Verrou posé au premier clic : ignore tout clic supplémentaire et toute
   * proposition de mise à jour concurrente (plusieurs 'updatefound' ne
   * doivent jamais réarmer un bouton déjà cliqué). C'est la cause du bandeau
   * qui restait affiché : le clic désactivait bien le bouton, mais rien
   * n'empêchait un appel ultérieur à proposerMiseAJour() — ni ne signalait à
   * l'utilisateur qu'un clic avait déjà été pris en compte pendant les
   * quelques secondes d'activation réelle. */
  let updateEnCours = false;
  let delaiSecours = null;

  function proposerMiseAJour(worker) {
    if (updateEnCours) return;
    majTexte.textContent = 'Nouvelle version disponible';
    majBtn.disabled = false;
    majBtn.textContent = 'Mettre à jour';
    majBandeau.hidden = false;
    majBtn.onclick = () => {
      if (updateEnCours) return;
      updateEnCours = true;
      majBtn.disabled = true;
      majBtn.textContent = 'Mise à jour…';
      majTexte.textContent = 'Mise à jour en cours…';
      /* L'écouteur global 'controllerchange' est déjà en place depuis le
       * chargement de la page (voir plus bas) : il est donc bien installé
       * avant cet envoi, jamais après. */
      worker.postMessage('SKIP_WAITING');
      /* Garde-fou : si aucune activation réelle ne survient (worker déjà
       * périmé, échec silencieux), ne pas laisser le bandeau indéfiniment
       * dans un état « en cours » sans retour ni possibilité de réessayer. */
      delaiSecours = window.setTimeout(() => {
        if (rechargementDemande) return;
        updateEnCours = false;
        majTexte.textContent = 'La mise à jour n’a pas pu s’activer. Réessayez, ou fermez les autres onglets ouverts sur cette application.';
        majBtn.disabled = false;
        majBtn.textContent = 'Réessayer';
      }, 10000);
    };
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then((registration) => {
          /* Un enregistrement en attente au chargement (onglet ouvert lors
           * d'un déploiement précédent) doit aussi proposer la mise à jour. */
          if (registration.waiting) proposerMiseAJour(registration.waiting);
          registration.addEventListener('updatefound', () => {
            const worker = registration.installing;
            if (!worker) return;
            worker.addEventListener('statechange', () => {
              /* `controller` déjà défini = ce n'est pas la toute première
               * installation, mais une mise à jour d'un SW déjà actif. */
              if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                proposerMiseAJour(worker);
              }
            });
          });
        })
        .catch((err) => console.error('Échec de l’enregistrement du service worker :', err));

      /* Un seul rechargement, déclenché uniquement par le clic sur
       * « Mettre à jour » (jamais automatique, jamais en boucle). Installé
       * dès le chargement de la page, donc toujours en place avant qu'un
       * SKIP_WAITING ne soit envoyé, quel que soit le moment du clic. */
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (rechargementDemande) return;
        rechargementDemande = true;
        if (delaiSecours) window.clearTimeout(delaiSecours);
        window.location.reload();
      });
    });
  }

  /* ---------- Fond de carte hors connexion ----------
   * Une seule tuile en échec ne prouve rien : c'est l'état réseau du
   * navigateur (online/offline) qui déclenche le message, pas une erreur de
   * chargement MapLibre ponctuelle. Affiché une fois par passage hors ligne,
   * jamais répété tant que l'état ne change pas. */
  let messageHorsLigneAffiche = false;
  function majEtatReseau() {
    if (!navigator.onLine) {
      if (messageHorsLigneAffiche) return;
      messageHorsLigneAffiche = true;
      toast('Fond cartographique indisponible hors connexion. Les sites et les fiches restent consultables.', true);
    } else {
      messageHorsLigneAffiche = false;
      toastEl.hidden = true;
      /* Le fond vectoriel reprend ses requêtes normalement dès que le
       * navigateur retrouve une connexion : aucune action supplémentaire
       * n'est nécessaire, MapLibre relance lui-même les tuiles en échec. */
    }
  }
  window.addEventListener('offline', majEtatReseau);
  window.addEventListener('online', majEtatReseau);
  if (!navigator.onLine) majEtatReseau();
})();
