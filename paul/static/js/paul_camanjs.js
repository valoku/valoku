window.onload = function () {
    var canvas = document.getElementById('image-canvas').getContext('2d');
    var image_element = document.getElementById('canvas-image-source');
    canvas.drawImage(image_element, 0, 0);

    var bri = document.getElementById('bri')
    /* Function trigerred when we leave the input */
    bri.onblur = function () {
        var amount = this.value;

        var img = document.getElementById('img');

        /* We change the brightness of the canvas itself */
        img.setAttribute('style', 'filter:brightness(' + amount + '); -webkit-filter:brightness(' + amount + '); -moz-filter:brightness(' + amount + ')');

    }
};