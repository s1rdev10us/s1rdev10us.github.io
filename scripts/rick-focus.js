document.currentScript.outerHTML='';
{
    let y = document.createElement('div');
    var idy = 'asldfhasjebflkjasdbgkWBFGJWVFJKGBwjkgbWJKBGWGWJGBAW,KGBWRKBF,KJBDSNKbnkblkjbnslkjerglkjdbntgjkb'
    y.id = idy;
    document.body.prepend(y);
}
var x = false;
setInterval(function () {
    if (x != document.hasFocus()) {
        x = document.hasFocus();
        switch (x) {
            case true:
                console.log('gained focus');
                document.getElementById(idy).innerHTML = '';
                break;
            case false:
                console.log('Lost focus');
                let temp = document.createElement('iframe');
                //html = html.trim(); // Never return a space text node as a result

                temp.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0&autoplay=1&loop=1';
                temp.allow = 'autoplay';
                temp.height = 0;
                temp.width = 0;
                temp.style.display = 'none';
                document.getElementById(idy).prepend(temp);
                break;
            default:
                break;
        }
    }
}, 1000)