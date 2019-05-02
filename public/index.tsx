import { Component, h, store } from '../src/supertag'

store.use(
  { count: 0, sum: 0 },
  {
    add: state => ({ sum: state.sum + 1 }),
    sub: state => ({ count: state.count - 1 })
  }
)

class SuperApp extends Component {
  render(state, dispatch) {
    return (
      <div>
        <h1>{state.count}</h1>
        <button onclick={() => dispatch('add')}>++</button>
        <button onclick={() => dispatch('sub')}>--</button>
      </div>
    )
  }
}
customElements.define('super-app', SuperApp)

// class HelloWorld extends Component {
//   render() {
//     return <div>Hello World</div>
//   }
// }

// customElements.define('hello-world', HelloWorld)

// class HelloCounter extends Component {
//   get count() {
//     return Number(this.getAttribute('count') || 0)
//   }
//   set count(value) {
//     this.setAttribute('count', String(value))
//   }
//   static get observedAttributes() {
//     return ['count']
//   }
//   render() {
//     return (
//       <div>
//         <h1>{this.count}</h1>
//         <button onclick={() => this.count--}>-</button>
//         <button onclick={() => this.count++}>+</button>
//         <button onclick={() => (this.count = this.count + 10)}>+10</button>
//       </div>
//     )
//   }
// }

// customElements.define('hello-counter', HelloCounter)
