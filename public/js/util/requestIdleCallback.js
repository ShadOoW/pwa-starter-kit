/* eslint-env browser */

/*
 * @see https://developers.google.com/web/updates/2015/08/using-requestidlecallback
 */
window.requestIdleCallback =
  window.requestIdleCallback ||
  ((cb) => {
    return setTimeout(() => {
      let start = Date.now();
      cb({
        didTimeout: false,
        timeRemaining: () => {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  });

window.cancelIdleCallback =
  window.cancelIdleCallback ||
  ((id) => {
    clearTimeout(id);
  });
