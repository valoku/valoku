var canvasContainer = document.getElementById('canvas-container');
var canvasContext = document.getElementById('image-canvas').getContext('2d');
var imageElement = document.getElementById('canvas-image-source');
drawImage();
var brightnessSlider = document.getElementById('brightness-slider');
var bri = document.getElementById('bri')
/* Function trigerred when we leave the input */
//    bri.onblur = function () {
//        var amount = this.value;
//
//        var img = document.getElementById('img');
//
//        /* We change the brightness of the canvas itself */
//        img.setAttribute('style', 'filter:brightness(' + amount + '); -webkit-filter:brightness(' + amount + '); -moz-filter:brightness(' + amount + ')');
//
//    }

var camanFilters = {
    brightness: 0
}

brightnessSlider.onchange = function () {
    var amount = brightnessSlider.value;
    setBrightness(amount);
}

function setBrightness(amount) {
    /* We change the brightness of the canvas itself */
//        canvasContext.style = 'filter:brightness(' + amount + '); -webkit-filter:brightness(' + amount + '); -moz-filter:brightness(' + amount + ')';
    camanFilters.brightness = amount;
    updateImage();
}

function updateImage() {
    Caman('#image-canvas', function () {
        this.revert();
        this.brightness(camanFilters.brightness);
        this.render();
        updating = false;
    });
}

window.onresize = function () {
    drawImage();
}

function drawImage() {
    canvasContext.clearRect(0, 0, 9999, 9999);
    var canvasWidth = canvasContainer.clientWidth;
    var canvasHeight = imageElement.naturalHeight / (imageElement.naturalWidth / canvasWidth);
    canvasContainer.width = canvasWidth;
    canvasContainer.height = canvasHeight;
    canvasContext.canvas.height = canvasHeight;
    canvasContext.canvas.width = canvasWidth;
    canvasContext.drawImage(imageElement, 0, 0, canvasWidth, canvasHeight);
}
