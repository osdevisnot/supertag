const { Component, h } = supertag

class HelloWorld extends Component {
  render() {
    return h('div', {}, 'Hello World')
  }
}

customElements.define('hello-world', HelloWorld)
