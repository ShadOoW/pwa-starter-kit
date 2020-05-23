/* eslint-env browser */

// A Promise polyfill, as used by
// https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/Promise/config.json
import 'yaku/dist/yaku.browser.global.min.js';
// A fetch polyfill, as used by
// https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/fetch/config.json
import 'whatwg-fetch/fetch';

class Main {
  constructor() {
    this.setupServiceWorker();
  }

  /**
   * Register service worker.
   */
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((r) => {
        console.log('REGISTRATION', r);
      });
    } else {
      console.log(
        'SW not registered; navigator.serviceWorker is not available',
      );
    }
  }
}

window.mainHDI = new Main();
