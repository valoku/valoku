function showImage() {
    hideLoadingSpinner();
    var imageElement = document.getElementById('canvas-image-source');
    if (imageElement == null) return;
    var canvasContainer = document.getElementById('canvas-container');
    var canvasElement = document.getElementById('image-canvas');
    var canvasContext = document.getElementById('image-canvas').getContext('2d');
    drawImage();

    var sliders = getSliderElements();

    function getDefaultFilters() {
        return {
            brightness: 0,
            contrast: 0,
            hue: 100,
            saturation: 0,
            vignette: "0%"
        }
    }


    function setSliderPositions() {
        //TODO set slider positions based on camanfilters!
    }

    var camanFilters = getDefaultFilters();
    setSliderPositions();

    function setContextFilters(context) {
        context.brightness(camanFilters.brightness);
        context.contrast(camanFilters.contrast);
        context.hue(camanFilters.hue);
        context.saturation(camanFilters.saturation);
        context.vignette(camanFilters.vignette);
    }

    function drawImage() {
        var canvasId = canvasElement.id;
        var newCanvas = document.createElement("canvas");
        newCanvas.id = canvasId;

        setCanvasInitSize();
        Caman(canvasContext.canvas, imageElement.src, function () {
            this.replaceCanvas(newCanvas);
            this.reset();
            if (canvasContext.canvas != null) {
                this.resize({
                    width: canvasContainer.width,
                    height: canvasContainer.height
                });
            }
            setContextFilters(this);
            this.render();
        });
    }

    function applyFilters() {
        showLoadingSpinner();
        Caman(canvasContext.canvas, function () {
            this.revert(false);
            setContextFilters(this);
            this.render(hideLoadingSpinner);
        });
    }

    function setCanvasInitSize() {
        var maxCanvasWidth = 750;
        var canvasWidth = maxCanvasWidth;
        var canvasHeight = imageElement.naturalHeight / (imageElement.naturalWidth / canvasWidth);
        canvasContainer.width = canvasWidth;
        canvasContainer.height = canvasHeight;
        canvasContext.canvas.height = canvasHeight;
        canvasContext.canvas.width = canvasWidth;
    }

    //Bind onSliderInput function to each slider onchange event
    $.each(sliders, function(sliderName, sliderElement) {
        sliderElement.onchange= onSliderInput;
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
        var imageElementClone = imageElement.cloneNode(true)
        Caman(imageElementClone, function () {
            setContextFilters(this);
            this.render(function () {
                var a = createDownloadLink(this);
                a.click();
                hideLoadingSpinner();
            });
        });
    }
}

function setupDragAndDrop() {

    document.body.addEventListener('dragover', function (evt) {
        evt.preventDefault();
    }, false);

    document.body.addEventListener('drop', fileDropped, false);

    function fileDropped(ev) {
        var files = ev.dataTransfer.files;
        if (files.length > 0) {
            var file = files[0];
            if (file.type.indexOf('image') === -1) {
                return;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (ev) {
                var img = new Image();
                img.src = ev.target.result;
                img.id = 'canvas-image-source';
                img.onload = function () {
                    var imageElement = document.getElementById('canvas-image-source');
                    imageElement.parentNode.replaceChild(img, imageElement);
                    imageElement.onload = showImage();
                    showEditor();
                };
            };
        }
        ev.preventDefault();
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

$(window).load(setupDragAndDrop);

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

