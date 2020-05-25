/* eslint-env browser */
import 'url-polyfill/url-polyfill';

export default class Route {
  constructor(matchRegex, transitionStrategy, onAttached) {
    this.transitionStrategy = transitionStrategy;
    this.matchRegex = matchRegex;
    this.onAttached = onAttached;
  }

  matches(url) {
    return this.matchRegex.test(url);
  }

  retrieveContent(url) {
    const contentUrl = this.getContentOnlyUrl(url);
    return fetch(contentUrl).then((response) => response.text());
  }

  transitionOut(container) {
    this.transitionStrategy.transitionOut(container);
  }

  transitionIn(container) {
    this.transitionStrategy.transitionIn(container);
  }

  onAttached() {
    if (this.onAttached && Array.isArray(this.onAttached)) {
      this.onAttached.forEach((onAttached) => {
        onAttached && onAttached();
      });
      return;
    }
    return this.onAttached && this.onAttached();
  }

  getContentOnlyUrl(url) {
    const u = new URL(url);
    u.searchParams.append('contentOnly', 'true');
    return u.toString();
  }
}
