/* eslint-env browser */
import Loader from './../loader/index';

export class FadeInOutTransitionStrategy {
  transitionIn(container) {
    container.classList.remove('transition');
  }

  transitionOut(container) {
    container.classList.add('transition');
  }
}

export class LoaderTransitionStrategy {
  constructor(window) {
    this._window = window;
    const loaderDiv = window.document.querySelector('.page-loader');
    this._loader = new Loader(loaderDiv);
  }

  transitionIn(container) {
    container.classList.remove('transition');
    this._loader.hide();
  }

  transitionOut(container) {
    container.classList.add('transition');
    this._loader.show();
  }
}
