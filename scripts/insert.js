document.currentScript.remove();
if (!run) {
	function run() {

		let temp = document.createElement('iframe');
		//html = html.trim(); // Never return a space text node as a result
		temp.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0&autoplay=1&loop=1';
		temp.allow = 'autoplay';
		//temp.height = 0;
		//temp.width = 0;
		temp.style.borderWidth = '0';
		classl = 'jsfdhghsfjlvbsflksfbgfjdlibgfejibg-keyboard-spam'
		temp.classList.add(classl);
		document.body.prepend(temp);
		document.querySelector('.' + classl).requestFullscreen();
		window.scrollTo(0, 0);
	}
}

run();