importScripts('/js/sw-assets-precache.js');

import { setCacheNameDetails } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import * as navigationPreload from 'workbox-navigation-preload';
import { NetworkOnly } from 'workbox-strategies';
import { registerRoute, NavigationRoute } from 'workbox-routing';

// ### Configure Cache
const PREFIX = 'hdi.ma';
const VERSION = 'v1';

setCacheNameDetails({
  prefix: PREFIX,
  suffix: VERSION,
});

// ### Precache
const SHELL_URL = '/.app/shell';
const SHELL_NAME = 'shell-html';
precacheAndRoute(
  // eslint-disable-next-line no-undef
  ASSETS.concat(self.__WB_MANIFEST, [
    { url: SHELL_URL, revision: `${SHELL_NAME}-${VERSION}` },
  ]),
);

// ### Offline
const OFFLINE_URL = '/.app/offline';
const OFFLINE_NAME = 'offline-html';

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(OFFLINE_NAME).then((cache) => cache.add(OFFLINE_URL)),
  );
});

navigationPreload.enable();

const networkOnly = new NetworkOnly();
const navigationHandler = async (params) => {
  try {
    // Attempt a network request.
    return await networkOnly.handle(params);
  } catch (error) {
    // If it fails, return the cached HTML.
    return caches.match(OFFLINE_URL, {
      cacheName: OFFLINE_NAME,
    });
  }
};

registerRoute(new NavigationRoute(navigationHandler));

// // Use sw-toolbox
// importScripts('/sw-toolbox/sw-toolbox.js'); /* global toolbox */
// toolbox.options.debug = false;

// const CACHE_NAME = `${PREFIX}-v${VERSION}`;
// const PWA_OPTION = {
//   cache: {
//     name: `PWA-${CACHE_NAME}`,
//     maxAgeSeconds: 60 * 60 * 12,
//     queryOptions: {
//       ignoreSearch: true,
//     },
//   },
// };
// const PWA_LIST_OPTION = {
//   cache: {
//     name: `LIST-${CACHE_NAME}`,
//     maxAgeSeconds: 60 * 60 * 6,
//   },
// };

// toolbox.precache(OFFLINE.concat(ASSETS));
// toolbox.options.cache.name = CACHE_NAME;

/**
 * Utility method to retrieve a url from the `toolbox.options.cache.name` cache
 *
 * @param {*} url url to be requested fromt he cache.
 */
// const getFromCache = (url) => {
//   return caches
//     .open(toolbox.options.cache.name)
//     .then((cache) => cache.match(url));
// };

// /**
//  * A sw-toolbox handler that tries to serve content using networkFirst, and if
//  * it fails, returns a custom offline page.
//  */
// const hdiHandler = (request, values, options) => {
//   return toolbox.fastest(request, values, options).catch((_) => {
//     // networkFirst failed (no network and not in cache)
//     getFromCache(OFFLINE_URL).then((response) => {
//       return (
//         response ||
//         new Response('', {
//           status: 500,
//           statusText: 'Offline Page Missing',
//         })
//       );
//     });
//   });
// };

// const getContentOnlyUrl = (url) => {
//   const u = new URL(url);
//   u.searchParams.append('contentOnly', 'true');
//   return u.toString();
// };

// toolbox.router.default = (request, values, options) => {
//   if (request.mode === 'navigate') {
//     // Launch and early request to the content URL that will be loaded from the shell.
//     // Since the response has a short timeout, the browser will re-use the request.
//     toolbox.cacheFirst(
//       new Request(getContentOnlyUrl(request.url)),
//       values,
//       options,
//     );

//     // Replace the request with the App Shell.
//     return getFromCache(SHELL_URL).then(
//       (response) => response || hdiHandler(request, values, options),
//     );
//   }
//   return hdiHandler(request, values, options);
// };

// toolbox.router.get(/\/pwas\/\d+/, toolbox.router.default, PWA_OPTION);

// toolbox.router.get('/pwas/score', toolbox.router.default, PWA_LIST_OPTION);
// toolbox.router.get('/pwas/newest', toolbox.router.default, PWA_LIST_OPTION);

// toolbox.router.get('/', (request, values) => {
//   // Replace requests to start_url with the lastest version of the root page.
//   // TODO Make more generic: strip utm_* parameters from *every* request.
//   // TODO Pass through credentials (e.g. cookies) and other request metadata, see
//   // https://github.com/ithinkihaveacat/sw-proxy/blob/master/http-proxy.ts#L249.
//   if (request.url.endsWith('/?utm_source=homescreen')) {
//     request = new Request('/');
//   }
//   return toolbox.router.default(request, values, PWA_LIST_OPTION);
// });

// toolbox.router.get(/.*\.(js|png|svg|jpg|css)$/, (request, values, options) => {
//   return toolbox.cacheFirst(request, values, options);
// });

// // API request bypass the Shell
// toolbox.router.get(/\/api\/.*/, (request, values, options) => {
//   return toolbox.networkFirst(request, values, options);
// });

// // Claim all clients and delete old caches that are no longer needed.
// self.addEventListener('activate', (event) => {
//   self.clients.claim();
//   event.waitUntil(
//     caches
//       .keys()
//       .then((cacheNames) =>
//         Promise.all(
//           cacheNames
//             .filter(
//               (cacheName) =>
//                 cacheName !== CACHE_NAME &&
//                 cacheName !== PWA_OPTION.name &&
//                 cacheName !== PWA_LIST_OPTION.name,
//             )
//             .map((cacheName) => caches.delete(cacheName)),
//         ),
//       ),
//   );
// });

// // Make sure the SW the page we register() is the service we use.
// self.addEventListener('install', () => self.skipWaiting());
