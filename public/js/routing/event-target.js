export default class EventTarget {
  constructor() {
    this._listeners = new Map();
  }

  addEventListener(type, callback) {
    let typeListeners = this._listeners.get(type);
    if (!typeListeners) {
      typeListeners = new Set();
      this._listeners.set(type, typeListeners);
    }
    typeListeners.add(callback);
  }

  removeEventListener(type, callback) {
    const typeListeners = this._listeners.get(type);
    if (!typeListeners) {
      return;
    }
    typeListeners.delete(callback);
  }

  getEventListeners(type) {
    return this._listeners.get(type);
  }

  dispatchEvent(event) {
    if (!event.type) {
      return;
    }

    const typeListeners = this._listeners.get(event.type);
    if (!typeListeners) {
      return;
    }

    typeListeners.forEach((callback) => callback(event));
  }
}
