(function(window){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'components.json', false);
    xhr.addEventListener('load', function() {
        window.components = JSON.parse(this.responseText);
    });
    xhr.send();
}(window))