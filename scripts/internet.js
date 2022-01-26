let myVar = setInterval(myTimer, 1000);
var online = true;
function myTimer() {
	if (navigator.onLine != online) {
		if (navigator.onLine == true) {
			console.log('now online');
			alert('now online');
			online = navigator.onLine;
		} else {
			console.log('now offline');
			alert('now offline');
			online = navigator.onLine;
        }
	}
	//console.log(navigator.onLine);

}