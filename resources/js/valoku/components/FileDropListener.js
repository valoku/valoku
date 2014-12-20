function FileDropListener(imageDroppedCallback, targetAreaElement) {
    targetAreaElement.addEventListener('dragover', function (evt) {
        evt.preventDefault();
    }, false);

    targetAreaElement.addEventListener('drop', fileDropped, false);

    function fileDropped(ev) {
        var file = ev.dataTransfer.files[0];
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
        ev.preventDefault();
    }
}

