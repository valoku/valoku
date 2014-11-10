var myImage = document.getElementById('canvas-image-source');

if (myImage != null) myImage.onload = function () {
    var canvasContainer = document.getElementById('canvas-container');
    var canvasContext = document.getElementById('image-canvas').getContext('2d');
    var imageElement = document.getElementById('canvas-image-source');
    drawImage();

    function getDefaultFilters() {
        return {
            brightness: 0,
            contrast: 0,
            hue: 100,
            saturation: 0,
            vignette: "0%"
        }
    }

    var camanFilters = getDefaultFilters();

    function drawImage() {
        updateCanvasSize();
        Caman(canvasContext.canvas, imageElement.src, function () {
            this.revert();
            if (canvasContext.canvas != null) {
                this.resize({
                    width: canvasContainer.width,
                    height: canvasContainer.height
                });
            }
            this.brightness(camanFilters.brightness);
            this.contrast(camanFilters.contrast);
            this.hue(camanFilters.hue);
            this.saturation(camanFilters.saturation);
            this.vignette(camanFilters.vignette);
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
            this.vignette(camanFilters.vignette);
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
    var vignetteSlider = document.getElementById('vignette-slider');


    brightnessSlider.onchange = onSliderInput;
    contrastSlider.onchange = onSliderInput;
    saturationSlider.onchange = onSliderInput;
    hueSlider.onchange = onSliderInput;
    vignetteSlider.onchange = onSliderInput;

    function onSliderInput() {
        camanFilters.brightness = brightnessSlider.value;
        camanFilters.contrast = parseInt(contrastSlider.value);
        camanFilters.hue = hueSlider.value;
        camanFilters.saturation = saturationSlider.value;
        camanFilters.vignette = vignetteSlider.value+"%";
        Foundation.utils.debounce(applyFilters(), 500);
    }

    var resetButton = document.getElementById('reset-button');
    resetButton.onclick = resetButtonPressed;

    function resetButtonPressed() {
        camanFilters = getDefaultFilters();
        brightnessSlider.value = camanFilters.brightness;
        contrastSlider.value = camanFilters.contrast;
        hueSlider.value = camanFilters.hue;
        saturationSlider.value = camanFilters.saturation;
        Foundation.utils.debounce(applyFilters(), 500);
    }
}