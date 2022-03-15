class RickRoll extends HTMLElement {
	constructor() {
		super();
		var tempThree = document.createElement('div');
		const tempthreeid = 'soigfbsrelkghf-tgesji-rges-fsidvblwdfbjlwdf-dsjlfbesdjifbwefjbewjfbdbvdaf';
		tempThree.id = tempthreeid;
		document.body.appendChild(tempThree);
		this.addEventListener('click', e => {
			if (this.disabled) {
				return;
			}
			
			let temp = document.createElement('iframe');
			//html = html.trim(); // Never return a space text node as a result
			
			temp.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0&autoplay=1&loop=1';
			temp.allow = 'autoplay';
			temp.height = 0;
			temp.width = 0;
			temp.classList.add('jsfdhghsfjlvbsflksfbgfjdlibgfejibg-keyboard-spam');
			document.getElementById(tempthreeid).prepend(temp);
			const counterSpam ='counter-spam-asdgfkjsjbgskdjgbasdfgksb';
			if (!document.getElementById(counterSpam)) {
				let tempTwo = document.createElement('div');
				tempTwo.innerHTML = 0
				tempTwo.id = counterSpam;
				document.body.appendChild(tempTwo);
			}
			document.getElementById(counterSpam).innerHTML = parseInt(document.getElementById(counterSpam).innerHTML)+1	;
		});
		//let shadowRoot = this.attachShadow({ mode: 'open' });
		let html = '.jsfdhghsfjlvbsflksfbgfjdlibgfejibg-keyboard-spam {border-width:0px}but-ton {        appearance: auto;        writing-mode: horizontal-tb!important;text-rendering: auto;        color: -internal-light-dark(black, white);        letter-spacing: normal;        word-spacing: normal;        line-height: normal;        text-transform: none;        text-indent: 0px;       text-shadow: none;        display: inline-block;        text-align: center;        align-items: flex-start;        cursor: default;    box-sizing: border-box;background-color: -internal-light-dark(rgb(239, 239, 239), rgb(59, 59, 59));margin: 0em;padding: 1px 6px;border-width: 2px;border-style: outset;border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));border-image: initial;}';
		let temp = document.createElement('style');
		//html = html.trim(); // Never return a space text node as a result
		temp.innerHTML = html;
		document.head.prepend(temp);
		//shadowRoot.appendChild(temp.content.firstChild);
		//temp.remove();
	}
}
customElements.define('but-ton', RickRoll);
