# Supertag

> ## 🛠 Status: In Development
>
> Expect breaking changes in patch version until this library reaches **1.0 Milestone**

Supertag is a light weight library to create self contained, reusable **Web Components**.

[![The GZIP size of Supertag](http://img.badgesize.io/https://unpkg.com/supertag?compression=gzip&label=GZIP%20Size)](https://unpkg.com/supertag)
[![The Brotli size of Supertag](http://img.badgesize.io/https://unpkg.com/supertag?compression=brotli&label=Brotli%20Size)](https://unpkg.com/supertag)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Features

- **Standards Based:** `Supertag` uses latest features of web platform such as [**Custom Elements**](https://developers.google.com/web/fundamentals/web-components/customelements) and [**Shadow DOM**](https://developers.google.com/web/fundamentals/web-components/shadowdom) and combines them with fast and efficient vDOM rendering based on [**Superfine**](https://github.com/jorgebucaran/superfine).

- **Lightweight: < 2 kb min & gzipped** - extremely light weight solution for creating self contained, reusable [**Web Components**](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

- **Fast** - `Supertag` enables async rendering at next [micro-task timing](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/). Multiple calls to render are automatically batched for blazing fast view updates.

## Motivation

We believe, that the emerging [**Web Components**](https://developer.mozilla.org/en-US/docs/Web/Web_Components) standard has reached a level where **truly reusable component can now become a reality**. Browser support for [**Custom Elements**](https://caniuse.com/#feat=custom-elementsv1) & [**Shadow DOM**](https://caniuse.com/#feat=shadowdomv1) is comprehensive and Framework support for Web Components is at par.

> See [**Custom Elements Everywhere**](https://custom-elements-everywhere.com/) - a fantastic initiative by [Rob Dodson](https://github.com/robdodson) which tracks support for many popular frameworks.

However, the ergonomics around vanilla web components are too low level and often inconvenient, which is where `Supertag` plays a role.

Primary focus for `Supertag` is to make **authoring and shipping** web components as painless as possible while still staying true to its minimalism promise.

## Installation

Grab a copy from [CDN](https://unpkg.com/supertag):

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
```

Every time a `count` changes, we create a virtual DOM representation as described by `render` method. We then diff it against an existing virtual DOM representation and patch the real DOM using efficient diff and patch algorithm.

## Contributing

**Found a problem ?**

[Open an issue](https://github.com/osdevisnot/supertag/issues), or better yet [open a pull request](https://github.com/osdevisnot/supertag/pulls)

**Want to hack code?**

Clone this repo, and run `setup` script in repo root:

```
yarn run setup
```

Once setup, review `public` directory, or launch examples locally using `yarn start`

**Ready to fix an issue?**

Add an example in `public` folder to demonstrate your use case and [open a pull request](https://github.com/osdevisnot/supertag/pulls) with your changes.

## License

Supertag is MIT licensed. See [LICENSE](/LICENSE.md).
