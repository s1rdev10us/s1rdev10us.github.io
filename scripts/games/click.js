function powerUp(type='cookie'){
    var temp = document.getElementsByTagName("template")[0]
    var clon=temp.content.cloneNode(true);
    
    document.body.appendChild(clon);
    
    clon.classList.add(type);
}