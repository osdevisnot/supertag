import { Component, h } from '../src/supertag'

class HelloWorld extends Component {
  render() {
    return <div>Hello World</div>
  }
}

customElements.define('hello-world', HelloWorld)

class HelloCounter extends Component {
  get count(): any {
    return this.getAttribute('count') || 0
  }
  set count(value: any) {
    this.setAttribute('count', value)
  }
  static get observedAttributes() {
    return ['count']
  }
  render() {
    return h('div', {}, [
      h('h1', {}, this.count),
      h('button', { onclick: () => this.count-- }, '-'),
      h('button', { onclick: () => this.count++ }, '+')
    ])
  }
}

customElements.define('hello-counter', HelloCounter)
