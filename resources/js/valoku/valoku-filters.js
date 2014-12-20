/**
 * Created by Niklas on 19.12.2014.
 */
var camanFilters = getDefaultFilters();

function getDefaultFilters() {
    return {
        brightness: 0,
        contrast: 0,
        hue: 100,
        saturation: 0,
        vignette: "0%"
    }
}

function updateFilters(camanFilters, values) {
    camanFilters.brightness = values.brightness.value;
    camanFilters.contrast = parseInt(values.contrast.value, 10);
    camanFilters.hue = values.hue.value;
    camanFilters.saturation = values.saturation.value;
    camanFilters.vignette = values.vignette.value + "%";
}