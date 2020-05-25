importScripts('/js/sw-assets-precache.js');

import { setCacheNameDetails } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import * as navigationPreload from 'workbox-navigation-preload';
import { NetworkFirst } from 'workbox-strategies';
import { registerRoute, NavigationRoute } from 'workbox-routing';

// ### Configure Cache Name
const PREFIX = 'hdi.ma';
const VERSION = 'v1';

setCacheNameDetails({
  prefix: PREFIX,
  suffix: VERSION,
});

const getCacheName = (name) => `${PREFIX}-${name}-${VERSION}`;

// ### Precache
precacheAndRoute(
  // eslint-disable-next-line no-undef
  ASSETS.concat(self.__WB_MANIFEST),
);

// ### Install
const SHELL_URL = '/.app/shell';
const SHELL_NAME = getCacheName('shell-html');

const OFFLINE_URL = '/.app/offline';
const OFFLINE_NAME = getCacheName('offline-html');

self.addEventListener('install', async (event) => {
  event.waitUntil([
    caches.open(OFFLINE_NAME).then((cache) => cache.add(OFFLINE_URL)),
    caches.open(SHELL_NAME).then((cache) => cache.add(SHELL_URL)),
  ]);
});

navigationPreload.enable();

// ### GetContentOnly, SHELL and Offline

const getContentOnlyUrl = (url) => {
  const u = new URL(url);
  u.searchParams.append('contentOnly', 'true');
  return u.toString();
};

const navigationHandler = async ({ event, params }) => {
  console.log(params);
  try {
    const strategy = new NetworkFirst();

    strategy.handle({
      request: new Request(getContentOnlyUrl(event.request.url)),
    });

    return caches.match(SHELL_URL, { cacheName: SHELL_NAME });
  } catch (error) {
    return caches.match(OFFLINE_URL, {
      cacheName: OFFLINE_NAME,
    });
  }
};

registerRoute(new NavigationRoute(navigationHandler));
