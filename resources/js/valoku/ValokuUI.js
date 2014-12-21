/**
 * Created by Niklas on 19.12.2014.
 */
function ValokuUI() {
    var valokuCanvas;
    var fileDropListener = new FileDropListener(imageDroppedCallback, document.body);
    var resetButton = document.getElementById('reset-button');
    var saveButton = document.getElementById('save-button');
    var sliders = {
        brightness: document.getElementById('brightness-slider'),
        contrast: document.getElementById('contrast-slider'),
        saturation: document.getElementById('saturation-slider'),
        hue: document.getElementById('hue-slider'),
        vignette: document.getElementById('vignette-slider'),
    };

    function imageDroppedCallback(file) {
        showImage(file);
        showEditor();
    }

    function showImage(file) {
        valokuCanvas = new ValokuCanvas(file);
        valokuCanvas.initCanvas();
    }

    function showEditor() {
        var dropanywhere = document.getElementById("dropanywhere");
        var editor = document.getElementById("editor");
        dropanywhere.style.display = "none";
        editor.style.display = "block";
    }

    function applyFilters() {
        valokuCanvas.applyPreviewFilters();
//        valokuCanvas.applyFilters();
    }

    var onSliderInput = Foundation.utils.debounce(function () {
        updateFilters(camanFilters, sliders);
        applyFilters();
    }, 100);

    //Bind onSliderInput function to each slider onchange event
    $.each(sliders, function (sliderName, sliderElement) {
        sliderElement.onchange = onSliderInput;
    });

    //Bind reset button
    resetButton.onclick = function () {
        camanFilters = getDefaultFilters();
        $.each(sliders, function (filterName) {
            sliders[filterName].value = camanFilters[filterName];
        });
        //Override vignette slider value because of parseInt :(
        sliders.vignette.value = parseInt(camanFilters.vignette);
        applyFilters();
    };

    //Bind save button
    saveButton.onclick = function () {
        valokuCanvas.showLoadingSpinner();
        var sourceImage = valokuCanvas.getSourceImage();
        Caman(sourceImage, function () {
            setContextFilters(this, camanFilters);
            this.render(function () {
                var base64 = this.toBase64('jpeg');
                var fileName = "image.jpeg";
                downloadBase64AsFile(base64, fileName);
                valokuCanvas.hideLoadingSpinner();
            });
        });
    };
}