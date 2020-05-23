(function () {
  /* eslint-env browser */

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

}());
//# sourceMappingURL=main.js.map
