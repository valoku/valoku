/**
 * Created by Niklas on 19.12.2014.
 */
function ValokuUI() {
    this.valokuCanvas;
    this.resetButton = document.getElementById('reset-button');

    function imageDroppedCallback(file) {
        showImage(file);
        showEditor();
    }

    function showImage(file) {
        this.valokuCanvas = new ValokuCanvas(file);
        this.valokuCanvas.draw();
    }

    fileDropListener = new FileDropListener(imageDroppedCallback, document.body);

    function showEditor() {
        var dropanywhere = document.getElementById("dropanywhere");
        var editor = document.getElementById("editor");
        dropanywhere.style.display = "none";
        editor.style.display = "block";
    }

    function applyFilters() {
        this.valokuCanvas.applyFilters();
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
        })
        //Override vignette slider value because of parseInt :(
        sliders.vignette.value = parseInt(camanFilters.vignette);
        Foundation.utils.debounce(applyFilters(), 500);
    }
}