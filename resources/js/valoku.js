function showImage(sourceImage) {
    hideLoadingSpinner();

    var canvasContainer = document.getElementById('canvas-container');
    var canvasElement = document.getElementById('image-canvas');
    var canvasContext = document.getElementById('image-canvas').getContext('2d');
    var sliders = getSliderElements();

    drawImage();

    function setSliderPositions() {
        //TODO set slider positions based on camanfilters!
    }

    var camanFilters = getDefaultFilters();
    setSliderPositions();



    function drawImage() {
        var canvasId = canvasElement.id;
        var newCanvas = document.createElement("canvas");
        newCanvas.id = canvasId;

        setCanvasInitSize();

        Caman(canvasContext.canvas, sourceImage.src, function () {
            this.replaceCanvas(newCanvas);
            this.reset();
            if (canvasContext.canvas != null) {
                this.resize({
                    width: canvasContainer.width,
                    height: canvasContainer.height
                });
            }
            setContextFilters(this, camanFilters);
            this.render();
        });
    }

    function applyFilters() {
        showLoadingSpinner();
        Caman(canvasContext.canvas, function () {
            this.revert(false);
            setContextFilters(this, camanFilters);
            this.render(hideLoadingSpinner);
        });
    }

    function setCanvasInitSize() {
        var maxCanvasWidth = 750;
        var canvasWidth = maxCanvasWidth;
        var canvasHeight = sourceImage.naturalHeight / (sourceImage.naturalWidth / canvasWidth);
        canvasContainer.width = canvasWidth;
        canvasContainer.height = canvasHeight;
        canvasContext.canvas.height = canvasHeight;
        canvasContext.canvas.width = canvasWidth;
    }

    //Bind onSliderInput function to each slider onchange event
    $.each(sliders, function (sliderName, sliderElement) {
        sliderElement.onchange = onSliderInput;
    })

    function onSliderInput() {
        updateCamanFilters(camanFilters, sliders);
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
        vignetteSlider.value = parseInt(camanFilters.saturation);
        Foundation.utils.debounce(applyFilters(), 500);
    }

    var saveButton = document.getElementById('save-button');
    saveButton.onclick = saveButtonPressed;

    function saveButtonPressed() {
        showLoadingSpinner();
        var sourceImageClone = sourceImage.cloneNode(true)
        Caman(sourceImageClone, function () {
            setContextFilters(this, camanFilters);
            this.render(function () {
                var a = createDownloadLink(this);
                a.click();
                hideLoadingSpinner();
            });
        });
    }
}

function imageDroppedCallback(file) {
    showImage(file);
    showEditor();
}

function getFileDroppedCallback(imageDroppedCallback) {
    return function fileDroppedCallback(file) {
        if (file.type.indexOf('image') === -1) {
            return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (ev) {
            var img = new Image();
            img.src = ev.target.result;
            img.onload = function () {
                imageDroppedCallback(img);
            };
        };
    }
}

function showEditor() {
    var dropanywhere = document.getElementById("dropanywhere");
    var editor = document.getElementById("editor");
    dropanywhere.style.display = "none";
    editor.style.display = "block";
}

function showDropanywhere() {
    var dropanywhere = document.getElementById("dropanywhere");
    var editor = document.getElementById("editor");
    dropanywhere.style.display = "block";
    editor.style.display = "none";

}

$(window).load(onWindowLoaded);

function onWindowLoaded() {
    setupDragAndDrop(getFileDroppedCallback(imageDroppedCallback));
}

var spinner;
function showLoadingSpinner() {
    var canvasContainerDiv = document.getElementById('canvas-container');
    if (spinner != null) {
        spinner.spin(canvasContainerDiv);
    }
    else {
        spinnerOptions = {};
        spinner = new Spinner(spinnerOptions).spin(canvasContainerDiv);
    }

}

function hideLoadingSpinner() {
    if (spinner) {
        spinner.stop();
    }
}

