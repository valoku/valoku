function updateCamanFilters(camanFilters, sliders) {
    camanFilters.brightness = sliders.brightness.value;
    camanFilters.contrast = parseInt(sliders.contrast.value, 10);
    camanFilters.hue = sliders.hue.value;
    camanFilters.saturation = sliders.saturation.value;
    camanFilters.vignette = sliders.vignette.value + "%";
}