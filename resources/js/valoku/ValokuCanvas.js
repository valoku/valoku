/**
 * Created by Niklas on 19.12.2014.
 */
function ValokuCanvas(sourceImageElement) {
    this.sourceWidth = sourceImageElement.width;
    this.sourceHeight = sourceImageElement.height;
    var container = document.getElementById('canvas-container');
    var element = document.getElementById('image-canvas');
    var context = document.getElementById('image-canvas').getContext('2d');
    var previewElement = document.getElementById('image-preview-canvas');
    var previewContext = document.getElementById('image-preview-canvas').getContext('2d');
    var spinnerOptions = {};
    var spinner = new Spinner(spinnerOptions);

    this.showLoadingSpinner = function () {
        if (spinner != null) {
            spinner.spin(container);
        }
    };

    this.hideLoadingSpinner = function () {
        if (spinner) spinner.stop();
    };

    this.initSize = function () {
        var maxCanvasWidth = 750;
        var canvasWidth = maxCanvasWidth;
        var canvasHeight = sourceImageElement.naturalHeight / (sourceImageElement.naturalWidth / canvasWidth);
        container.width = canvasWidth;
        container.height = canvasHeight;
        context.canvas.height = canvasHeight;
        context.canvas.width = canvasWidth;
    };

    this.initCanvas = function () {
        this.showLoadingSpinner();
        var canvasId = element.id;
        var newCanvas = document.createElement("canvas");
        newCanvas.id = canvasId;
        this.initSize();
        var canvas = context.canvas;
        Caman(context.canvas, sourceImageElement.src, function () {
            this.replaceCanvas(newCanvas);
            this.reset();
            if (canvas != null) {
                this.resize(getCanvasDimensions());
            }
            setContextFilters(this, camanFilters);
            this.render();
        });
        this.hideLoadingSpinner();
        this.initPreview();
    };

    this.initPreview = function () {
        var canvasId = previewElement.id;
        var newCanvas = document.createElement("canvas");
        newCanvas.id = canvasId;
        var canvas = previewContext.canvas;
        var sourceImageElementClone = sourceImageElement.cloneNode();
        sourceImageElementClone.height = 100;
        sourceImageElementClone.width = (sourceImageElement.width * sourceImageElementClone.height) / sourceImageElement.height;
        Caman(previewContext.canvas, sourceImageElementClone.src, function () {
            this.replaceCanvas(newCanvas);
            this.reset();
            if (canvas != null) {
                this.resize({
                    width: sourceImageElementClone.width,
                    height: sourceImageElementClone.height
                });
            }
            setContextFilters(this, camanFilters);
            this.render();
        });
    }

    var getCanvasDimensions = function () {
        var canvasContainer = container;
        return {
            width: canvasContainer.width,
            height: canvasContainer.height
        };
    };

    var applyFiltersRunning = false;
    var applyFiltersPending = false;

    this.applyFilters = function () {
        if (applyFiltersRunning) {
            applyFiltersPending = true;
            return;
        }
        if (applyFiltersPending) {
            applyFiltersPending = false;
            applyFiltersRunning = true;
        }
        var canvas = context.canvas;
        this.showLoadingSpinner();
        var hideLoadingSpinner = this.hideLoadingSpinner;
        var that = this;
        var onRenderComplete = function () {
            hideLoadingSpinner();
            applyFiltersRunning = false;
            if (applyFiltersPending) this.applyFilters();
            that.hidePreview();
        };
        Caman(canvas, function () {
            this.revert(false);
            setContextFilters(this, camanFilters);
            this.render(onRenderComplete);
        });
    };

    var applyPreviewFiltersRunning = false;
    var applyPreviewFiltersPending = false;

    this.applyPreviewFilters = function () {
        if (applyPreviewFiltersRunning) {
            applyPreviewFiltersPending = true;
            return;
        }
        if (applyPreviewFiltersPending) {
            applyPreviewFiltersPending = false;
            applyPreviewFiltersRunning = true;
        }
        var canvas = previewContext.canvas;
        var that = this;

        var onRenderComplete = function () {
            that.showPreview();
            applyPreviewFiltersRunning = false;
            if (applyFiltersPending) {
                this.applyPreviewFilters();
                return;
            }
            that.applyFilters();
        };
        var sourceWidth = 100;
        var sourceHeight = (this.sourceWidth * 100) / this.sourceHeight;
        Caman(canvas, function () {
                this.revert();
                this.resize({
                    height : sourceWidth,
                    width : sourceHeight
                    });
                setContextFilters(this, camanFilters);
                this.render(onRenderComplete);
            }
        )
        ;
    };

    this.showPreview = function () {
//        var imageCanvas = document.getElementById("image-canvas").getContext('2d');
        document.getElementById("image-canvas").style.display = "none";
        document.getElementById("image-preview-canvas").style.display = "block";
        var canvas = document.getElementById("image-preview-canvas");
//        var data= canvas.toDataURL();

        // resize the canvas
        canvas.style.width = document.getElementById("image-canvas").getContext('2d').canvas.width;
        canvas.style.height =document.getElementById("image-canvas").getContext('2d').canvas.height;
//
//        // scale and redraw the canvas content
//        var img=new Image();
//        img.onload=function(){
//            canvas.getContext('2d').drawImage(img,0,0,img.width,img.height,0,0,canvas.width,canvas.height);
//        }
//        img.src=data;
//        canvas.getContext('2d').width = document.getElementById("image-canvas").getContext('2d').canvas.width;
//        canvas.getContext('2d').height = document.getElementById("image-canvas").getContext('2d').canvas.height;
    }

    this.hidePreview = function () {
        document.getElementById("image-canvas").style.display = "block";
        document.getElementById("image-preview-canvas").style.display = "none";
    }

    this.getSourceImage = function () {
        return sourceImageElement;
    }
}