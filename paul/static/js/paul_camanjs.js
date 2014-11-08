var myImage = document.getElementById('canvas-image-source');

myImage.onload = function () {
    var canvasContainer = document.getElementById('canvas-container');
    var canvasContext = document.getElementById('image-canvas').getContext('2d');
    var imageElement = document.getElementById('canvas-image-source');
    drawImage();
//    applyFilters();

    var brightnessSlider = document.getElementById('brightness-slider');

    var camanFilters = {
        brightness: 0
    }

    brightnessSlider.oninput = Foundation.utils.throttle(brightnessChanged, 700);


    function brightnessChanged() {
        var amount = brightnessSlider.value;
        setBrightness(amount);
    }

    function setBrightness(amount) {
        camanFilters.brightness = amount;
        drawImage();
    }

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

    window.onresize = Foundation.utils.throttle(update, 700);
}