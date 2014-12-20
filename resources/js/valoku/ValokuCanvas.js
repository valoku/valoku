/**
 * Created by Niklas on 19.12.2014.
 */
function ValokuCanvas(sourceImageElement) {
    var container = document.getElementById('canvas-container');
    var element = document.getElementById('image-canvas');
    var context = document.getElementById('image-canvas').getContext('2d')
    var spinnerOptions = {};
    var spinner = new Spinner(spinnerOptions);

    this.initSize = function () {
        var maxCanvasWidth = 750;
        var canvasWidth = maxCanvasWidth;
        var canvasHeight = sourceImageElement.naturalHeight / (sourceImageElement.naturalWidth / canvasWidth);
        container.width = canvasWidth;
        container.height = canvasHeight;
        context.canvas.height = canvasHeight;
        context.canvas.width = canvasWidth;
    };

    this.draw = function () {
        this.showLoadingSpinner();
        var canvasId = element.id;
        var newCanvas = document.createElement("canvas");
        newCanvas.id = canvasId;
        this.initSize();
        var canvas = context.canvas;
        var canvasContainer = container;
        Caman(context.canvas, sourceImageElement.src, function () {
            this.replaceCanvas(newCanvas);
            this.reset();
            if (canvas != null) {
                this.resize({
                    width: canvasContainer.width,
                    height: canvasContainer.height
                });
            }
            setContextFilters(this, camanFilters);
            this.render();
        });
        this.hideLoadingSpinner();
    };

    this.applyFilters = Foundation.utils.debounce(function () {
        var canvas = context.canvas;
        var onRenderStart = this.showLoadingSpinner;
        var onRenderComplete = this.hideLoadingSpinner;
        Caman(canvas, function () {
            onRenderStart();
            this.revert(false);
            setContextFilters(this, camanFilters);
            this.render(onRenderComplete);
        })
    }, 500);


    this.showLoadingSpinner = function () {
        if (spinner != null) {
            spinner.spin(container);
        }
    }

    this.hideLoadingSpinner = function () {
        if (spinner) spinner.stop();
    }

    this.getSourceImage = function() {
        return sourceImageElement;
    }
}