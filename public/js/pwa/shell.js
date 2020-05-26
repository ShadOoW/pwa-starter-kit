/* eslint-env browser */

export default class Shell {
  constructor(document) {
    this.document = document;
    this.backlink = document.querySelector('#backlink');
    this.tabs = Array.from(
      document.querySelectorAll('#home, #humans, #aliens, #poopybuttholes'),
    );
    this.subtitle = document.querySelector('#subtitle');
    this.search = document.querySelector('#search');
    this.states = new Map();
  }

  setStateForRoute(route, shellState) {
    this.states.set(route, shellState);
  }

  updateTab(tab, options) {
    if (!options.currentTab) {
      return;
    }

    if (tab.id === options.currentTab) {
      tab.classList.add('active');
      return;
    }
    tab.classList.remove('active');
  }

  onRouteChange(route) {
    const options = this.states.get(route);
    this.tabs.forEach((tab) => this.updateTab(tab, options));
  }
}
