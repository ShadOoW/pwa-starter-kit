/* eslint-env browser */

export default class Offline {
  constructor(window, router) {
    this.window = window;
    this.router = router;
    this.setupEventhandlers();
  }

  /**
   * All elements with class .gulliver-online-aware will:
   * have an 'online' dataset property that reflects the current online state.
   * receive a 'change' event whenever the state changes.
   */
  setupEventhandlers() {
    const body = this.window.document.querySelector('body');
    this.window.addEventListener('online', () => {
      body.removeAttribute('offline');
    });

    this.window.addEventListener('offline', () => {
      body.setAttribute('offline', 'true');
      this.markAsCached(
        this.window.document.querySelectorAll('.offline-aware'),
      );
    });

    const onLine = this.window.navigator.onLine;
    if (onLine !== undefined && !onLine) {
      body.setAttribute('offline', 'true');
    }
  }

  /**
   * Check if a Url is navigable.
   * @param url the url to be checke for availability
   * @returns true if the user is online or the URL is cached
   */
  isAvailable(href) {
    if (!href || this.window.navigator.onLine) return Promise.resolve(true);
    return caches
      .match(href)
      .then((response) => response.status === 200)
      .catch(() => false);
  }

  /**
   * Checks if the href on the anchor is available in the cached
   * and marks the element with the cached attribute.
   *
   * If the url is available, the `cached` attribute is added with
   * the value `true`. Otherwise, the `cached` attribute is removed.
   * @param {@NodeList} a list of anchors.
   */
  markAsCached(anchors) {
    anchors.forEach((anchor) => {
      if (!anchor.href) {
        return;
      }
      const route = this.router.findRoute(anchor.href);
      if (!route) {
        return;
      }
      const contentHref = route.getContentOnlyUrl(anchor.href);
      this.isAvailable(contentHref).then((available) => {
        if (available) {
          anchor.setAttribute('cached', 'true');
          return;
        }
        anchor.removeAttribute('cached');
      });
    });
  }
}
