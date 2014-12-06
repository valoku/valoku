/**
 * Sets up drag and drop for document's body and calls the callback given as param when a file is dropped.
 * @param fileDroppedCallback
 */
function setupDragAndDrop(fileDroppedCallback) {

    document.body.addEventListener('dragover', function (evt) {
        evt.preventDefault();
    }, false);

    document.body.addEventListener('drop', fileDropped, false);

    function fileDropped(ev) {
        var file = ev.dataTransfer.files[0];
        fileDroppedCallback(file);
        ev.preventDefault();
    }
}