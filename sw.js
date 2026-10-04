'use strict';
/*
 * Patrimoine de France — service worker (étape 7).
 *
 * Deux caches volontairement séparés :
 *   - patrimoine-shell-vN  : interface + données, pré-caché à l'installation,
 *     jamais les photographies, jamais les tuiles.
 *   - patrimoine-images-v1 : photographies, peuplé uniquement à la demande,
 *     indépendant du numéro de version du shell (voir README, section
 *     « Mode hors ligne »). Ce nom n'est PAS immuable pour toujours : si une
 *     photographie existante devait être remplacée sans changer son nom de
 *     fichier, incrémenter manuellement vers patrimoine-images-v2.
 *
 * Les tuiles OpenFreeMap et tout domaine externe (Wikimedia, Google Maps) ne
 * sont jamais interceptés ici : leur échec hors ligne suit le comportement
 * natif du navigateur (voir README, section « Fond de carte hors connexion »).
 */

const CACHE_VERSION = 17;
const SHELL_CACHE = 'patrimoine-shell-v' + CACHE_VERSION;
const IMAGES_CACHE = 'patrimoine-images-v2';

/* Liste exhaustive des ressources essentielles. cache.addAll() rejette
 * l'installation entière si l'une d'elles est absente ou répond en erreur :
 * volontaire, pour ne jamais produire silencieusement un cache incomplet. */
const PRECACHE_URLS = [
  './index.html',
  './confidentialite.html',
  './credits-photographiques.html',
  './manifest.webmanifest',
  './css/app.css',
  './css/page.css',
  './css/credits.css',
  './vendor/leaflet/leaflet.css',
  './vendor/maplibre/maplibre-gl.css',
  './js/app.js',
  './js/credits.js',
  './js/themes.js',
  './js/geographie-data.js',
  './js/relations.js',
  './js/data/chateaux-fr.js',
  './js/data/religieux-fr.js',
  './js/data/templiers-fr.js',
  './js/data/civil-fr.js',
  './js/data/militaire-fr.js',
  './vendor/leaflet/leaflet.js',
  './vendor/maplibre/maplibre-gl.js',
  './vendor/maplibre/leaflet-maplibre-gl.js',
  './data/fleuves.geojson',
  './vendor/leaflet/images/layers.png',
  './vendor/leaflet/images/layers-2x.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png'
];

/* Dossiers d'images locales éligibles au cache runtime : un par préfixe de
 * thème du registre (js/themes.js), que le service worker ne charge pas. La
 * liste est donc recopiée ici ; tools/coherence-themes.test.js vérifie qu'elle
 * couvre chaque préfixe du registre. img/civ/ et img/mil/ sont inclus par
 * anticipation : la règle s'appliquera sans modification le jour où leur
 * première photographie existera. */
const IMAGE_PATH_RE = /\/img\/(cha|rel|tpl|civ|mil)\//;

self.addEventListener('install', (event) => {
  /* cache: 'reload' : chaque ressource est relue sur le réseau, jamais dans
   * le cache HTTP du navigateur (GitHub Pages : max-age=600), pour ne pas
   * figer dans le nouveau cache un fichier de la version précédente. */
  const requetes = PRECACHE_URLS.map((url) => new Request(url, { cache: 'reload' }));
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(requetes))
      /* Activation automatique, mais seulement une fois le pré-cache
       * complet : si addAll() échoue, l'installation échoue avec lui et
       * l'ancien service worker reste en place, intact. En cas de succès,
       * les pages ouvertes se rechargent une fois sur 'controllerchange'
       * (js/app.js). */
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(
        noms
          .filter((nom) => nom.startsWith('patrimoine-shell-') && nom !== SHELL_CACHE)
          .map((nom) => caches.delete(nom))
        /* patrimoine-images-* n'est jamais inclus dans ce filtre : il
         * survit à toute mise à jour du shell. */
      ))
      .then(() => self.clients.claim())
  );
});

/* Conservé pour le bandeau « Mettre à jour » des clients v16 et antérieurs,
 * qui l'envoient encore à un worker en attente. */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

async function repondreNavigation(request) {
  try {
    return await fetch(request);
  } catch (err) {
    /* La page précisément demandée d'abord (confidentialite.html,
     * credits-photographiques.html ont chacune leur propre entrée en
     * cache) : ne replier sur index.html que si elle n'y est pas. */
    const cache = await caches.open(SHELL_CACHE);
    const exact = await cache.match(request);
    if (exact) return exact;
    const secours = await cache.match('./index.html');
    if (secours) return secours;
    throw err;
  }
}

async function repondreShell(request) {
  const cache = await caches.open(SHELL_CACHE);
  const enCache = await cache.match(request);
  if (enCache) return enCache;
  return fetch(request);
}

async function repondreImage(request) {
  const cache = await caches.open(IMAGES_CACHE);
  const enCache = await cache.match(request);
  if (enCache) return enCache;
  const reseau = await fetch(request);
  if (reseau && reseau.ok) cache.put(request, reseau.clone());
  return reseau;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // jamais les tuiles, Wikimedia, etc.

  if (request.mode === 'navigate') {
    event.respondWith(repondreNavigation(request));
    return;
  }

  if (IMAGE_PATH_RE.test(url.pathname)) {
    event.respondWith(repondreImage(request));
    return;
  }

  if (PRECACHE_URLS.some((chemin) => url.pathname.endsWith(chemin.replace(/^\.\//, '/')))) {
    event.respondWith(repondreShell(request));
  }
  /* Toute autre requête same-origin non reconnue traverse sans
   * interception : pas de respondWith(). En cas d'échec réseau pour une
   * image, l'erreur remonte au composant photo (js/app.js), qui masque déjà
   * proprement la figure via figImg.onerror. */
});
