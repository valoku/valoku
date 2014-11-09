var myImage = document.getElementById('canvas-image-source');

myImage.onload = function () {
    var canvasContainer = document.getElementById('canvas-container');
    var canvasContext = document.getElementById('image-canvas').getContext('2d');
    var imageElement = document.getElementById('canvas-image-source');
    drawImage();


    var camanFilters = {
        brightness: 0,
        contrast: 0,
        hue: 50,
        saturation: 0
    }

    function drawImage() {
        updateCanvasSize();
        Caman(canvasContext.canvas, imageElement.src, function () {
            this.reset();
            if (canvasContext.canvas != null) {
                this.resize({
                    width: canvasContainer.width,
                    height: canvasContainer.height
                });
            }
            this.brightness(camanFilters.brightness);
            this.contrast(camanFilters.contrast);
            this.render();
        });
    }

    function applyFilters() {
        updateCanvasSize();
        Caman(canvasContext.canvas, function () {
            this.revert(false);
            this.brightness(camanFilters.brightness);
            this.contrast(camanFilters.contrast);
            this.hue(camanFilters.hue);
            this.saturation(camanFilters.saturation);
            this.render();
        });
    }

    function update() {
        updateCanvasSize();
        drawImage();
    }

    function updateCanvasSize() {
        var canvasWidth = canvasContainer.clientWidth;
        var canvasHeight = imageElement.naturalHeight / (imageElement.naturalWidth / canvasWidth);
        canvasContainer.width = canvasWidth;
        canvasContainer.height = canvasHeight;
        canvasContext.canvas.height = canvasHeight;
        canvasContext.canvas.width = canvasWidth;
    }

    window.onresize = Foundation.utils.debounce(update, 700);

    var brightnessSlider = document.getElementById('brightness-slider');
    var contrastSlider = document.getElementById('contrast-slider');
    var saturationSlider = document.getElementById('saturation-slider');
    var hueSlider = document.getElementById('hue-slider');


    brightnessSlider.oninput = Foundation.utils.debounce(brightnessChanged, 500);
    function brightnessChanged() {
        camanFilters.brightness = brightnessSlider.value;
        applyFilters();
    }

    contrastSlider.onchange = Foundation.utils.debounce(contrastChanged, 500);
    function contrastChanged() {
        camanFilters.contrast = parseInt(contrastSlider.value);
        applyFilters();
    }


    saturationSlider.oninput = Foundation.utils.throttle(saturationChanged, 700);
    function saturationChanged() {
        camanFilters.saturation = saturationSlider.value;
        applyFilters();
    }

    hueSlider.oninput = Foundation.utils.throttle(hueChanged, 700);
    function hueChanged() {
        camanFilters.hue = hueSlider.value;
        applyFilters();
    }
}