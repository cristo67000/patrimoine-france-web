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

const CACHE_VERSION = 9;
const SHELL_CACHE = 'patrimoine-shell-v' + CACHE_VERSION;
const IMAGES_CACHE = 'patrimoine-images-v1';

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

/* Dossiers d'images locales éligibles au cache runtime. img/tpl/ est inclus
 * par anticipation : le dossier n'existe pas encore (corpus templier sans
 * photographie), mais la règle s'appliquera sans modification du code le
 * jour où il existera réellement. */
const IMAGE_PATH_RE = /\/img\/(cha|rel|tpl)\//;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  /* Pas de skipWaiting() ici : un nouveau service worker reste en attente
   * tant que l'utilisateur n'a pas validé la mise à jour (voir js/app.js). */
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
