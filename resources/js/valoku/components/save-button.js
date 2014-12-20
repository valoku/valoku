/**
 * Created by Niklas on 19.12.2014.
 */
var saveButton = document.getElementById('save-button');
saveButton.onclick = saveButtonPressed;

function saveButtonPressed() {
    showLoadingSpinner();
    var sourceImageClone = sourceImage.cloneNode(true)
    Caman(sourceImageClone, function () {
        setContextFilters(this, camanFilters);
        this.render(function () {
            var a = createDownloadLink(this);
            a.click();
            hideLoadingSpinner();
        });
    });
}