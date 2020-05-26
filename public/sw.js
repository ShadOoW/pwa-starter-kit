importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/sw-toolbox/3.6.1/sw-toolbox.js',
);
/* global toolbox */
toolbox.options.debug = true;

importScripts('/js/sw-assets-precache.js'); /* global ASSETS */

const VERSION = '1';
const PREFIX = 'pwa-starter-kit';
const CACHE_NAME = `${PREFIX}-v${VERSION}`;
const CHARACTER_OPTION = {
  cache: {
    name: `CHARACTER-${CACHE_NAME}`,
    maxAgeSeconds: 60 * 60 * 12,
    queryOptions: {
      ignoreSearch: true,
    },
  },
};
const CHARACTERS_LIST_OPTION = {
  cache: {
    name: `CHARACTERS-${CACHE_NAME}`,
    maxAgeSeconds: 60 * 60 * 6,
  },
};

// URL to return in place of the "offline dino" when client is
// offline and requests a URL that's not in the cache.
const OFFLINE_URL = '/.app/offline';
const SHELL_URL = '/.app/shell';

const OFFLINE = [
  OFFLINE_URL,
  SHELL_URL,
  '/?cacheOnly=true',
  '/favicons/android-chrome-72x72.png',
  'images/github-24px.png',
  'images/github-48px.png',
  'images/rick-morty-logo.png',
  'images/rick-morty.png',
  'manifest.json',
];

toolbox.precache(OFFLINE.concat(ASSETS));
toolbox.options.cache.name = CACHE_NAME;

/**
 * Utility method to retrieve a url from the `toolbox.options.cache.name` cache
 *
 * @param {*} url url to be requested fromt he cache.
 */
const getFromCache = (url) => {
  return caches
    .open(toolbox.options.cache.name)
    .then((cache) => cache.match(url));
};

/**
 * A sw-toolbox handler that tries to serve content using networkFirst, and if
 * it fails, returns a custom offline page.
 */
const mainHandler = (request, values, options) => {
  return toolbox.fastest(request, values, options).catch(() => {
    // networkFirst failed (no network and not in cache)
    getFromCache(OFFLINE_URL).then((response) => {
      return (
        response ||
        new Response('', {
          status: 500,
          statusText: 'Offline Page Missing',
        })
      );
    });
  });
};

const getContentOnlyUrl = (url) => {
  const u = new URL(url);
  u.searchParams.append('contentOnly', 'true');
  return u.toString();
};

toolbox.router.default = (request, values, options) => {
  if (request.mode === 'navigate') {
    // Launch and early request to the content URL that will be loaded from the shell.
    // Since the response has a short timeout, the browser will re-use the request.
    toolbox.cacheFirst(
      new Request(getContentOnlyUrl(request.url)),
      values,
      options,
    );

    // Replace the request with the App Shell.
    return getFromCache(SHELL_URL).then(
      (response) => response || mainHandler(request, values, options),
    );
  }
  return mainHandler(request, values, options);
};

// toolbox.router.get(/\/characters\/\d+/, toolbox.router.default, PWA_OPTION);

toolbox.router.get(
  '/characters/humans',
  toolbox.router.default,
  CHARACTERS_LIST_OPTION,
);
toolbox.router.get(
  '/characters/aliens',
  toolbox.router.default,
  CHARACTERS_LIST_OPTION,
);
toolbox.router.get(
  '/characters/poopybuttholes',
  toolbox.router.default,
  CHARACTERS_LIST_OPTION,
);

toolbox.router.get('/', (request, values) => {
  // Replace requests to start_url with the lastest version of the root page.
  // TODO Make more generic: strip utm_* parameters from *every* request.
  // TODO Pass through credentials (e.g. cookies) and other request metadata, see
  // https://github.com/ithinkihaveacat/sw-proxy/blob/master/http-proxy.ts#L249.
  if (request.url.endsWith('/?utm_source=homescreen')) {
    request = new Request('/');
  }
  return toolbox.router.default(request, values, CHARACTERS_LIST_OPTION);
});

toolbox.router.get(
  /.*\.(js|png|svg|jpg|jpeg|css)$/,
  (request, values, options) => {
    return toolbox.cacheFirst(request, values, options);
  },
);

// API request bypass the Shell
toolbox.router.get(/\/api\/.*/, (request, values, options) => {
  return toolbox.networkFirst(request, values, options);
});

// Claim all clients and delete old caches that are no longer needed.
self.addEventListener('activate', (event) => {
  self.clients.claim();
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName !== CACHE_NAME &&
                cacheName !== CHARACTER_OPTION.name &&
                cacheName !== CHARACTERS_LIST_OPTION.name,
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      ),
  );
});

// Make sure the SW the page we register() is the service we use.
self.addEventListener('install', () => self.skipWaiting());
