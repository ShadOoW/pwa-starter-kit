/* eslint-env browser */

export default class Shell {
  constructor(document) {
    this.document = document;
    this.backlink = document.querySelector('#backlink');
    this.tabs = Array.from(
      document.querySelectorAll('#installable, #newest, #score, #tabs'),
    );
    this.subtitle = document.querySelector('#subtitle');
    this.search = document.querySelector('#search');
    this.states = new Map();
  }

  setStateForRoute(route, shellState) {
    this.states.set(route, shellState);
  }

  showElement(element, visible) {
    if (visible) {
      element.classList.remove('hidden');
      return;
    }
    element.classList.add('hidden');
  }

  updateTab(tab, options) {
    this.showElement(tab, options.showTabs);
    if (!options.currentTab) {
      return;
    }

    if (tab.id === options.currentTab) {
      tab.classList.add('activetab');
      return;
    }
    tab.classList.remove('activetab');
  }

  onRouteChange(route) {
    const options = this.states.get(route);
    this.showElement(this.backlink, options.backlink);
    this.showElement(this.subtitle, options.subtitle);
    this.showElement(this.search, options.search);
    this.tabs.forEach((tab) => this.updateTab(tab, options));
  }
}
