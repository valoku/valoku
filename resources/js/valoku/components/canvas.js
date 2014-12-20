/**
 * Created by Niklas on 19.12.2014.
 */
function ValokuCanvas(sourceImageElement) {
    this.container = document.getElementById('canvas-container');
    this.element = document.getElementById('image-canvas');
    this.context = document.getElementById('image-canvas').getContext('2d');

    this.initSize = function () {
        var maxCanvasWidth = 750;
        var canvasWidth = maxCanvasWidth;
        var canvasHeight = sourceImageElement.naturalHeight / (sourceImageElement.naturalWidth / canvasWidth);
        this.container.width = canvasWidth;
        this.container.height = canvasHeight;
        this.context.canvas.height = canvasHeight;
        this.context.canvas.width = canvasWidth;
    };

    this.draw = function () {
        this.showLoadingSpinner();
        var canvasId = this.element.id;
        var newCanvas = document.createElement("canvas");
        newCanvas.id = canvasId;
        this.initSize();
        canvas = this.context.canvas;
        canvasContainer = this.container;
        Caman(this.context.canvas, sourceImageElement.src, function () {
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
        this.showLoadingSpinner();
        canvas = this.context.canvas;
        Caman(canvas, function () {
            this.revert(false);
            setContextFilters(this, camanFilters);
            this.render(renderCompleteCallback);
        })
    }, 500);

    function renderCompleteCallback() {
        this.hideLoadingSpinner();
    }

    this.showLoadingSpinner = function () {
        var canvasContainerDiv = document.getElementById('canvas-container');
        if (this.spinner != null) this.spinner.spin(canvasContainerDiv);
        else {
            spinnerOptions = {};
            this.spinner = new Spinner(spinnerOptions).spin(canvasContainerDiv);
        }
    }

    this.hideLoadingSpinner = function () {
        if (this.spinner) {
            this.spinner.stop();
        }
    }
}