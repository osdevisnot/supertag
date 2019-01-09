# Supertag

> ## 🛠 Status: In Development
>
> Expect breaking changes in patch version until this library reaches **1.0 Milestone**

Supertag is a light weight library to create self contained, reusable **Web Components**.

## Features

- **Standards Based:** `Supertag` uses latest features of web platform such as [Custom Elements](https://developers.google.com/web/fundamentals/web-components/customelements) and [Shadow DOM](https://developers.google.com/web/fundamentals/web-components/shadowdom) and combines them with [Superfine](https://github.com/jorgebucaran/superfine) - a fast and efficient vDOM rendering library.

- **Lightweight: < 2 kb min & gzipped** - extremely light weight solution for creating self contained, reusable **Web Components**

- **Fast** - `Supertag` enables async rendering at next [micro-task timing](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/). Multiple calls to render are automatically batched for fast view updates.

## Installation

Grab a copy from [unpkg](https://unpkg.com/supertag) CDN:

```html
<script src="https://unpkg.com/supertag"></script>
```

Need that in ESM format?

```html
<script src="https://unpkg.com/supertag?module"></script>
```

Or install it from NPM:

```bash
npm i supertag
```

and use it with module bundlers like `webpack` or `parcel` as you normally would.

## Usage

Our first example is a component that can increment and decrement a counter

```js
import { Component, h } from 'supertag'

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
```

## Contributing

**Found a problem ?**

[Open an issue](https://github.com/osdevisnot/supertag/issues), or better yet [open a pull request](https://github.com/osdevisnot/supertag/pulls)

**Want to hack code?**

Clone this repo, and run `setup` script within repo root:

```
yarn run setup
```

Once setup, review `public` directory, or launch examples locally using `yarn start`

**Ready to fix an issue?**

Add your example to demonstrate your use case and [open a pull request](https://github.com/osdevisnot/supertag/pulls) with your changes.

## License

Supertag is MIT licensed. See [LICENSE](/LICENSE.md).
