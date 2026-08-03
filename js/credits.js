'use strict';
/*
 * Page des crédits photographiques.
 *
 * Construite à partir des MÊMES corpus que la carte (PATRIMOINE.corpus) : les
 * 337 crédits ne sont jamais recopiés à la main, donc jamais susceptibles de
 * diverger des fiches. Aucune image n'est chargée ici — volontairement, pour
 * que la page reste légère et utilisable hors ligne dès que l'interface sera
 * pré-cachée.
 *
 * Construction du DOM par createElement/textContent uniquement.
 */
(function () {
  const SITES = PATRIMOINE.corpus.reduce((acc, c) => acc.concat(c.sites), []);
  const AVEC_PHOTO = SITES.filter((s) => s.photo);

  const el = (id) => document.getElementById(id);
  const normCle = (s) => String(s).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');

  /* ---------- Nom court du thème, comme dans js/app.js ---------- */
  function nomTheme(t) { return t.nomCourt || t.nom; }

  /* ---------- Regroupement par thème, dans l'ordre du registre ---------- */
  const parTheme = {};
  AVEC_PHOTO.forEach((s) => {
    (parTheme[s.theme] = parTheme[s.theme] || []).push(s);
  });
  const themesPresents = THEMES_ORDRE.filter((t) => parTheme[t]);

  /* ---------- Filtre de thème ---------- */
  const nav = el('c-themes');
  let themeActif = '*';
  const boutons = {};

  function construireNav() {
    const options = [{ v: '*', lbl: 'Tous (' + AVEC_PHOTO.length + ')' }]
      .concat(themesPresents.map((t) => ({ v: t, lbl: nomTheme(THEMES[t]) + ' (' + parTheme[t].length + ')' })));
    options.forEach((o) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = o.lbl;
      btn.className = 'c-theme-btn';
      btn.setAttribute('aria-pressed', o.v === '*' ? 'true' : 'false');
      btn.addEventListener('click', () => {
        themeActif = o.v;
        Object.values(boutons).forEach((b) => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        rendre();
      });
      boutons[o.v] = btn;
      nav.appendChild(btn);
    });
  }

  /* ---------- Une ligne de crédit ---------- */
  function ligne(s) {
    const p = s.photo;
    const li = document.createElement('li');
    li.className = 'c-item';

    const nom = document.createElement('strong');
    nom.className = 'c-nom';
    nom.textContent = s.nom;
    li.appendChild(nom);

    const theme = document.createElement('span');
    theme.className = 'c-theme-tag';
    theme.textContent = nomTheme(THEMES[s.theme]);
    li.appendChild(theme);

    /* Même point de décision que la fiche : PATRIMOINE.creditPhoto. Cette page
     * dupliquait auparavant la règle « titre ou date => vue ancienne », et
     * produisait un lien de source vide pour une photographie personnelle. */
    const meta = document.createElement('div');
    meta.className = 'c-meta';
    const credit = PATRIMOINE.creditPhoto(p);
    credit.lignes.forEach((l) => {
      const ligne = document.createElement('span');
      ligne.className = 'c-ligne';
      if (l.href) {
        const a = document.createElement('a');
        a.href = l.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = l.texte;
        ligne.appendChild(a);
      } else {
        ligne.textContent = l.texte;
      }
      if (l.suite) {
        ligne.appendChild(document.createTextNode(' · '));
        const a = document.createElement('a');
        a.href = l.suite.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = l.suite.texte;
        ligne.appendChild(a);
      }
      meta.appendChild(ligne);
    });
    if (credit.titre) {
      const titre = document.createElement('span');
      titre.className = 'c-titre';
      titre.textContent = ' « ' + credit.titre + ' »';
      meta.appendChild(titre);
    }
    li.appendChild(meta);

    /* Clé de recherche, calculée une fois. */
    li.dataset.cle = normCle([s.nom, p.auteur, p.licence, s.theme].join(' '));
    return li;
  }

  /* ---------- Rendu ---------- */
  const liste = el('c-liste');
  const compte = el('c-compte');
  const recherche = el('c-recherche');

  function rendre() {
    liste.textContent = '';
    const q = normCle(recherche.value.trim());
    const cibles = themesPresents.filter((t) => themeActif === '*' || t === themeActif);
    let n = 0;
    cibles.forEach((t) => {
      const items = parTheme[t]
        .slice()
        .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
        .map(ligne)
        .filter((li) => !q || li.dataset.cle.indexOf(q) !== -1);
      if (!items.length) return;
      const section = document.createElement('section');
      const h2 = document.createElement('h2');
      h2.textContent = nomTheme(THEMES[t]) + ' — ' + items.length;
      section.appendChild(h2);
      const ol = document.createElement('ol');
      ol.className = 'c-ol';
      items.forEach((li) => ol.appendChild(li));
      section.appendChild(ol);
      liste.appendChild(section);
      n += items.length;
    });
    compte.textContent = n + ' photographie' + (n === 1 ? '' : 's') +
      (q ? ' pour « ' + recherche.value.trim() + ' »' : '');
  }

  recherche.addEventListener('input', rendre);
  construireNav();
  rendre();
})();
