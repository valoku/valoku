function getValokuFileDroppedCallback(imageDroppedCallback) {
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