/* eslint-env browser */

import EventTarget from './event-target';

export default class Router {
  constructor(window, container) {
    this.routes = [];
    this.window = window;
    this.container = container;
    this.document = window.document;
    this.eventTarget = new EventTarget();

    // Update UI when back is pressed.
    this.window.addEventListener('popstate', this.updateContent.bind(this));
    this.takeOverAnchorLinks(this.window.document);
  }

  findRoute(url) {
    return this.routes.find((route) => route.matches(url));
  }

  addEventListener(type, callback) {
    this.eventTarget.addEventListener(type, callback);
  }

  updateContent() {
    const location = this.window.document.location.href;
    const route = this.findRoute(location);
    console.log('Updating Content from JS');
    if (!route) {
      console.error('Url did not match any router: ', location);
      // TODO: navigate to 404?
      return;
    }

    this.window.scrollTo(0, 0);
    route.transitionOut(this.container);
    route
      .retrieveContent(location)
      .then((content) => {
        this.container.innerHTML = content;
        route.transitionIn(this.container);
        this.takeOverAnchorLinks(this.container);
        route.onAttached();
        this.dispatchNavigateEvent(location, route);
      })
      .catch((err) => {
        console.error(
          'Error getting page content for: ',
          location,
          ' Error: ',
          err,
        );
      });
  }

  addRoute(route) {
    this.routes.push(route);
  }

  navigate(url) {
    console.log('Navigating To: ', url);
    this.window.history.pushState(null, null, url);
    this.updateContent();
  }

  setupInitialRoute() {
    const body = this.document.querySelector('body');
    if (body.hasAttribute('data-empty-shell')) {
      this.updateContent();
      return;
    }
    const location = this.document.location.href;
    const route = this.findRoute(location);
    this.takeOverAnchorLinks(this.container);
    route.onAttached();
  }

  dispatchNavigateEvent(url, route) {
    const event = this.document.createEvent('CustomEvent');
    const detail = {
      url: url,
      route: route,
    };
    event.initCustomEvent(
      'navigate',
      /* bubbles */ false,
      /* cancelable */ false,
      detail,
    );
    this.eventTarget.dispatchEvent(event);
  }

  dispatchOutboundNavigationEvent(url) {
    const event = this.document.createEvent('CustomEvent');
    const detail = {
      url: url,
    };
    event.initCustomEvent('navigateoutbound', false, false, detail);
    this.eventTarget.dispatchEvent(event);
  }

  isNotLeftClickWithoutModifiers(e) {
    return e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;
  }

  takeOverAnchorLinks(root) {
    root.querySelectorAll('a').forEach((element) => {
      element.addEventListener('click', (e) => {
        if (this.isNotLeftClickWithoutModifiers(e)) {
          return true;
        }

        // Link does not have an url.
        if (!e.currentTarget.href) {
          return true;
        }

        // Never catch links to external websites.
        if (!e.currentTarget.href.startsWith(this.window.location.origin)) {
          this.dispatchOutboundNavigationEvent(e.currentTarget.href);
          return true;
        }

        // Check if there's a route for this url.
        const route = this.findRoute(e.currentTarget.href);
        if (!route) {
          return true;
        }

        e.preventDefault();
        this.navigate(e.currentTarget.href);
        return false;
      });
    });
  }
}
