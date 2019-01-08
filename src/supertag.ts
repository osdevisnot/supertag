/**
 * Copyright (c) 2019 osdevisnot
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { h, patch } from 'superfine'

const NEEDS_RENDER = Symbol('needsRender')

/**
 * Base Class for Web Components
 */
abstract class Component extends HTMLElement {
  /**
   * Root node of Shadow DOM
   */
  private __root__: ShadowRoot
  /**
   * vdom storage for this Web Component
   */
  private __vdom__: any
  /**
   * Render method should return the vdom representation of how the view should look like
   */
  public abstract render(): any
  constructor() {
    super()
    this.__root__ = this.createRoot()
    // See: https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
    Object.getOwnPropertyNames(this).forEach(prop => {
      const val = (this as any)[prop]
      delete (this as any)[prop]
      ;(this as any)[prop] = val
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
    ;(this as any)[NEEDS_RENDER] = false
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
    return this.__root__.querySelector(selector)
  }
  /**
   * Returns the list of DOM nodes attached to root for given query selector
   * @param selector query selector withing this Custom Element
   */
  public $$(selector: string): NodeListOf<HTMLElement> {
    return this.__root__.querySelectorAll(selector)
  }
  /**
   * Asynchronously flush render cache to DOM. Once rendered, we use
   * the existing vDOM to diff against the new vDOM instead of rendering
   * the whole view again...
   */
  private async __flush__() {
    ;(this as any)[NEEDS_RENDER] = true
    await 0
    if ((this as any)[NEEDS_RENDER]) {
      ;(this as any)[NEEDS_RENDER] = false
      this.__vdom__ = patch(this.__vdom__, this.render(), <any>this.__root__)
    }
  }
}

export { Component, h, patch }
