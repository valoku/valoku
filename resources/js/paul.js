function showImage() {
    hideLoadingSpinner();
    var imageElement = document.getElementById('canvas-image-source');
    if (imageElement == null) return;
    var canvasContainer = document.getElementById('canvas-container');
    var canvasElement = document.getElementById('image-canvas');
    var canvasContext = document.getElementById('image-canvas').getContext('2d');
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
        camanFilters.vignette = vignetteSlider.value + "%";
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
        //We need to clone the image element and later add it
        //to the DOM because the call to Caman's render()
        //replaces the img element with canvas
        var imageElementClone = imageElement.cloneNode(true)
        Caman(imageElement, function () {
            setContextFilters(this);
            this.render(function () {
                // atob to base64_decode the data-URI
                var base64_data = this.toBase64('jpeg');
                var image_data = atob(base64_data.split(',')[1]);
                // Use typed arrays to convert the binary data to a Blob
                var arraybuffer = new ArrayBuffer(image_data.length);
                var view = new Uint8Array(arraybuffer);
                for (var i=0; i<image_data.length; i++) {
                    view[i] = image_data.charCodeAt(i) & 0xff;
                }
                try {
                    // This is the recommended method:
                    var blob = new Blob([arraybuffer], {type: 'application/octet-stream'});
                } catch (e) {
                    // The BlobBuilder API has been deprecated in favour of Blob, but older
                    // browsers don't know about the Blob constructor
                    // IE10 also supports BlobBuilder, but since the `Blob` constructor
                    //  also works, there's no need to add `MSBlobBuilder`.
                    var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
                    bb.append(arraybuffer);
                    var blob = bb.getBlob('application/octet-stream'); // <-- Here's the Blob
                }

                // Use the URL object to create a temporary URL
                var url = (window.webkitURL || window.URL).createObjectURL(blob);
                //location.href = url; // <-- Download!
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = url;
                a.download = "file.jpeg";
                a.click();


                //We now remove the canvas element that took the place of the img
                imageElement = document.getElementById("canvas-image-source");
                imageElement.parentNode.removeChild(imageElement);
                //Then we add the clone to the DOM and assign it to imageElement
                document.body.appendChild(imageElementClone);
                imageElement = imageElementClone;
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
                    setEditorMode(true);
                };
            };
        }
        ev.preventDefault();
    }
}

function setEditorMode(editorVisible) {
    var dropanywhere = document.getElementById("dropanywhere");
    var editor = document.getElementById("editor");
    if (editorVisible) {
        dropanywhere.style.display = "none";
        editor.style.display = "block";
    }
    else {
        dropanywhere.style.display = "block";
        editor.style.display = "none";
    }
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

