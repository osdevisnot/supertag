const { Component, h } = supertag

class HelloCounter extends Component {
  get count() {
    return this.getAttribute('count')
  }
  set count(value) {
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
