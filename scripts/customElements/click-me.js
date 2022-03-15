class ClickMe extends HTMLElement {
	constructor() {
		super();

		this.addEventListener('click', e => {
			if (this.disabled) {
				return;
			}
			this.innerHTML = this.innerHTML+'clicked ';
		});
	}
}
customElements.define('click-me', ClickMe)