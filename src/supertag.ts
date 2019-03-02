/**
 * Copyright (c) 2019 osdevisnot
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { h, patch, recycle } from './vdom'

const NEEDS_RENDER = Symbol('needsRender')
const ROOT = Symbol('root')
const VDOM = Symbol('vdom')

/**
 * Base Class for Web Components
 */
abstract class Component extends HTMLElement {
  /**
   * Render method should return the vdom representation of how the view should look like
   */
  public abstract render(): any

  constructor() {
    super()
    this[ROOT] = this.createRoot()
    // See: https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
    Object.getOwnPropertyNames(this).forEach(prop => {
      const val = this[prop]
      delete this[prop]
      this[prop] = val
    })
  }

  /**
   * Creates a shadow root for this Web Component
   * Override this method to customize the behavior
   * For example, `return this` to avoid using Shadow Dom
   */
  public createRoot() {
    return this.attachShadow({ mode: 'open' })
  }

  /**
   * Gets called each time a Component is connected to DOM
   */
  public connectedCallback() {
    this.__flush__()
  }

  /**
   * Gets called each time a Component is removed from DOM
   */
  public disconnectedCallback() {
    this[NEEDS_RENDER] = false
  }

  /**
   * Gets called each time an observed attribute changes for this Component
   * To declare an attribute as observed attribute, create a static method on class
   * For example: To declare `width` as observed attribute:
   * `static get observedAttributes() { return ['width']; }`
   */
  public attributeChangedCallback() {
    this.__flush__()
  }

  /**
   * Returns the DOM node attached to root for given query selector
   * @param selector query selector within this Custom Element
   */
  public $(selector: string): HTMLElement | null {
    return this[ROOT].querySelector(selector)
  }

  /**
   * Returns the list of DOM nodes attached to root for given query selector
   * @param selector query selector withing this Custom Element
   */
  public $$(selector: string): NodeListOf<HTMLElement> {
    return this[ROOT].querySelectorAll(selector)
  }

  /**
   * Asynchronously flush render cache to DOM using microtasks.
   * See: https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
   * Once rendered, we use the existing vDOM to diff against the new vDOM
   * ... instead of rendering the whole view again.
   */
  private async __flush__() {
    this[NEEDS_RENDER] = true
    await 0
    if (this[NEEDS_RENDER]) {
      this[NEEDS_RENDER] = false
      this[VDOM] = patch(this[VDOM], this.render(), this[ROOT])
    }
  }
}

export { Component, h, patch, recycle }
