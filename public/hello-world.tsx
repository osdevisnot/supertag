import { Component, h } from 'supertag';

class HelloWorld extends Component {
	public render() {
		return <div>Hello World</div>;
	}
}

customElements.define('hello-world', HelloWorld);
