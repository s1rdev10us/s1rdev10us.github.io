let tmpl = document.querySelector('#shadow-template');
customElements.define('shadow-dom', class extends HTMLElement {
	constructor() {
		super(); // always call super() first in the constructor.
		let shadowRoot = this.attachShadow({ mode: 'open' });
		shadowRoot.appendChild(tmpl.content.cloneNode(true));
	}
});
document.querySelector('#shadow-template').remove();