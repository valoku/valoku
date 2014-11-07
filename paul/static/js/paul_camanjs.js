window.onload = function () {
    var canvasContainer = document.getElementById('canvas-container');
    var canvas = document.getElementById('image-canvas').getContext('2d');
    var imageElement = document.getElementById('canvas-image-source');
    drawImage();

    var bri = document.getElementById('bri')
    /* Function trigerred when we leave the input */
    bri.onblur = function () {
        var amount = this.value;

        var img = document.getElementById('img');

        /* We change the brightness of the canvas itself */
        img.setAttribute('style', 'filter:brightness(' + amount + '); -webkit-filter:brightness(' + amount + '); -moz-filter:brightness(' + amount + ')');

    }

    window.onresize = function () {
        drawImage();
    }

    function drawImage() {
        canvas.clearRect (0 , 0 , 9999 , 9999);
        var canvasWidth = (imageElement.naturalHeight * canvasContainer.clientWidth) / imageElement.naturalWidth;
        var canvasHeight =(imageElement.naturalHeight * canvasWidth) / imageElement.naturalHeight;
        canvas.drawImage(imageElement, 0, 0, canvasWidth, canvasHeight);
        canvas.height = 500;
        canvas.width = 500;
    }
};