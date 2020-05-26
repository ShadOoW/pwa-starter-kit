/* eslint-env browser */

// A Promise polyfill, as used by
// https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/Promise/config.json
import 'yaku/dist/yaku.browser.global.min.js';
// A fetch polyfill, as used by
// https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/fetch/config.json
import 'whatwg-fetch/fetch';

import { Shell, Offline } from './pwa';
import { Router, Route, LoaderTransitionStrategy } from './routing';

class Main {
  constructor() {
    this.shell = new Shell(document);
    this.router = new Router(window, document.querySelector('main'));
    this.offline = new Offline(window, this.router);

    this.router.addEventListener('navigate', (e) => {
      // this.analytics.trackPageView(e.detail.url);
      this.shell.onRouteChange(e.detail.route);
      this.offline.markAsCached(document.querySelectorAll('.offline-aware'));
    });

    this.setupRoutes();
    // this.setupBacklink();
    this.setupServiceWorker();
    // this.setupMessaging();
  }

  _addRoute(regexp, transitionStrategy, onRouteAttached, shellState) {
    const route = new Route(regexp, transitionStrategy, onRouteAttached);
    this.shell.setStateForRoute(route, shellState);
    this.router.addRoute(route);
  }

  setupRoutes() {
    const transitionStrategy = new LoaderTransitionStrategy(window);
    // Route for `/pwas/add`.
    // const setupPwaForm = () => {
    // const pwaForm = new PwaForm(window, this.signIn);
    // pwaForm.setup();
    // };

    // Link search-input value to search query paramter
    // const setupSearchInput = () => {
    //   const urlParams = new URLSearchParams(window.location.search);
    //   document.querySelector('#search-input').value = urlParams.get('query');
    // };

    // const setupCharts = () => {
    //   const generateChartConfig = (chartElement) => {
    //     const pwaId = chartElement.getAttribute('pwa');
    //     const type = chartElement.getAttribute('type');
    //     const url = CHART_BASE_URLS[type].replace('PWAID', pwaId);
    //     return { chartElement: chartElement, url: url };
    //   };
    //   const charts = Array.from(document.getElementsByClassName('chart'));
    //   charts.forEach((chart) => new Chart(generateChartConfig(chart)).load());
    // };

    // Route for `/pwas/score`.
    // this._addRoute(/\/pwas\/score/, transitionStrategy, setupSearchInput, {
    //   showTabs: true,
    //   backlink: false,
    //   subtitle: true,
    //   search: true,
    //   currentTab: 'score',
    // });

    // // Route for `/pwas/newest`.
    // this._addRoute(/\/pwas\/newest/, transitionStrategy, setupSearchInput, {
    //   showTabs: true,
    //   backlink: false,
    //   subtitle: true,
    //   search: true,
    //   currentTab: 'newest',
    // });

    // // Route for `/pwas/[id]`. Allow most characters (but will only ever be encodedURIComponent).
    // this._addRoute(
    //   /\/pwas\/.+/,
    //   transitionStrategy,
    //   [setupCharts, setupSearchInput],
    //   {
    //     showTabs: false,
    //     backlink: true,
    //     subtitle: true,
    //     search: true,
    //   },
    // );

    // // Route for `/?search=`.
    // this._addRoute(
    //   /\/pwas\/search\?query/,
    //   transitionStrategy,
    //   setupSearchInput,
    //   {
    //     showTabs: false,
    //     backlink: true,
    //     subtitle: true,
    //     search: true,
    //   },
    // );

    // Route for human's characters page
    this._addRoute(
      /characters\/humans((\/\w+)+|\/?)/,
      transitionStrategy,
      () => {},
      {
        currentTab: 'humans',
      },
    );

    // Route for alien's characters page
    this._addRoute(
      /characters\/aliens((\/\w+)+|\/?)/,
      transitionStrategy,
      () => {},
      {
        currentTab: 'aliens',
      },
    );

    // Route for poopybutthole's characters page
    this._addRoute(
      /characters\/poopybuttholes((\/\w+)+|\/?)/,
      transitionStrategy,
      () => {},
      {
        currentTab: 'poopybuttholes',
      },
    );

    // Route for home page.
    this._addRoute(/.+/, transitionStrategy, () => {}, {
      currentTab: 'home',
    });

    this.router.setupInitialRoute();
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

window.__MAIN__ = new Main();
