/* eslint-env browser */
import './../util/requestIdleCallback';

const FADE_OUT_ANIMATION_LENGTH = 500;

/**
 * A CSS only loader showing three dots.
 */
class Loader {
  /**
   * Create a new loader.
   *
   * @param container {HTMLElement} the element containing the loader
   * @param style {String} optional hex color or css class for styling the loader
   */
  constructor(container, style) {
    this.style = style || '';
    this.container = container;
  }

  /**
   * addLoader adds a CSS loader to the given element.
   *
   * @param container {HTMLElement} the element containing the loader.
   */
  show() {
    const loader = document.createElement('div');
    loader.style['align-items'] = 'center';
    loader.classList.add('loader');
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.classList.add('loader-dot');
      if (this.style.startsWith('#')) {
        dot.style['background-color'] = this.style;
      } else if (this.style) {
        dot.classList.add(this.style);
      }
      loader.appendChild(dot);
    }
    this.container.appendChild(loader);
  }

  /**
   * removeLoader removes a CSS loader from the given element.
   *
   * @param container {HTMLElement} the element containing the loader.
   */
  hide() {
    const loaders = this.container.querySelectorAll('.loader');
    loaders.forEach((loader) => {
      loader.classList.add('fadeOut');
      window.requestIdleCallback(() => loader.remove(), {
        timeout: FADE_OUT_ANIMATION_LENGTH,
      });
    });
  }
}

export default Loader;
