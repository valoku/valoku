/**
 * Created by Niklas on 19.12.2014.
 */
function ValokuUI() {
    var valokuCanvas;
    this.resetButton = document.getElementById('reset-button');
    var saveButton = document.getElementById('save-button');

    function imageDroppedCallback(file) {
        showImage(file);
        showEditor();
    }

    function showImage(file) {
        valokuCanvas = new ValokuCanvas(file);
        valokuCanvas.draw();
    }

    fileDropListener = new FileDropListener(imageDroppedCallback, document.body);

    function showEditor() {
        var dropanywhere = document.getElementById("dropanywhere");
        var editor = document.getElementById("editor");
        dropanywhere.style.display = "none";
        editor.style.display = "block";
    }

    function applyFilters() {
        valokuCanvas.applyFilters();
    }

    //Bind onSliderInput function to each slider onchange event
    $.each(sliders, function (sliderName, sliderElement) {
        sliderElement.onchange = function () {
            updateFilters(camanFilters, sliders);
            applyFilters();
        };
    });

    //Bind reset button
    this.resetButton.onclick = function () {
        camanFilters = getDefaultFilters();
        $.each(sliders, function (filterName) {
            sliders[filterName].value = camanFilters[filterName];
        });
        //Override vignette slider value because of parseInt :(
        sliders.vignette.value = parseInt(camanFilters.vignette);
        Foundation.utils.debounce(applyFilters(), 500);
    };

    //Bind save button
    saveButton.onclick = function() {
        valokuCanvas.showLoadingSpinner();
        var sourceImage = valokuCanvas.getSourceImage();
        var sourceImageClone = sourceImage.cloneNode(true);
        Caman(sourceImageClone, function () {
            setContextFilters(this, camanFilters);
            this.render(function () {
                var a = createDownloadLink(this);
                a.click();
                valokuCanvas.hideLoadingSpinner();
            });
        });
    };
}