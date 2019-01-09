import { Component, h } from '../src/supertag'

class HelloWorld extends Component {
  render() {
    return <div>Hello World</div>
  }
}

customElements.define('hello-world', HelloWorld)

class HelloCounter extends Component {
  get count() {
    return Number(this.getAttribute('count') || 0)
  }
  set count(value) {
    this.setAttribute('count', String(value))
  }
  static get observedAttributes() {
    return ['count']
  }
  render() {
    return (
      <div>
        <h1>{this.count}</h1>
        <button onclick={() => this.count--}>-</button>
        <button onclick={() => this.count++}>+</button>
        <button onclick={() => (this.count = this.count + 10)}>+10</button>
      </div>
    )
  }
}

customElements.define('hello-counter', HelloCounter)
