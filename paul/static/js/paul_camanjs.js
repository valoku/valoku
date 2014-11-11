var myImage = $("#canvas-image-source");
myImage.load(imageLoaded);

function imageLoaded() {
    var canvasContainer = document.getElementById('canvas-container');
    var canvasContext = document.getElementById('image-canvas').getContext('2d');
    var imageElement = document.getElementById('canvas-image-source');
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

    function drawImage() {
        updateCanvasSize();
        Caman(canvasContext.canvas, imageElement.src, function () {
            this.revert();
            if (canvasContext.canvas != null) {
                this.resize({
                    width: canvasContainer.width,
                    height: canvasContainer.height
                });
            }
            this.brightness(camanFilters.brightness);
            this.contrast(camanFilters.contrast);
            this.hue(camanFilters.hue);
            this.saturation(camanFilters.saturation);
            this.vignette(camanFilters.vignette);
            this.render();
        });
    }

    function applyFilters() {
        updateCanvasSize();
        Caman(canvasContext.canvas, function () {
            this.revert(false);
            this.brightness(camanFilters.brightness);
            this.contrast(camanFilters.contrast);
            this.hue(camanFilters.hue);
            this.saturation(camanFilters.saturation);
            this.vignette(camanFilters.vignette);
            this.render();
        });
    }

    function update() {
        updateCanvasSize();
        drawImage();
    }

    function updateCanvasSize() {
        var canvasWidth = canvasContainer.clientWidth;
        var canvasHeight = imageElement.naturalHeight / (imageElement.naturalWidth / canvasWidth);
        canvasContainer.width = canvasWidth;
        canvasContainer.height = canvasHeight;
        canvasContext.canvas.height = canvasHeight;
        canvasContext.canvas.width = canvasWidth;
    }

    window.onresize = Foundation.utils.debounce(update, 700);

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
        Caman("#canvas-image-source", function () {
            //Apply filters here ??
            this.render(function () {
                var image = this.toBase64();
                saveToServer(image);
            });
        });
    }

    /**Start of copy pasted csrf django stuff */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }


    /**End of copy pasted csrf django stuff */

    function saveToServer(image) {
        var csrftoken = $.cookie('csrftoken');
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                    // Send the token to same-origin, relative URLs only.
                    // Send the token only if the method warrants CSRF protection
                    // Using the CSRFToken value acquired earlier
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
        jQuery.ajax({
            url: '/save_edited_file/',
            type: 'POST',
            data: image,
//            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log(data);
            }
        });
    }
}

