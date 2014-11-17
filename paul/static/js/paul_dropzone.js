Dropzone.options.myDropzone = {
    acceptedFiles: "image/*",
    // Prevents Dropzone from uploading dropped files immediately
    autoProcessQueue: false,
    maxFilesize: 3, // MB
    init: function () {
        var submitButton = document.querySelector("#submit-all");
        myDropzone = this;
        submitButton.addEventListener("click", function () {
            myDropzone.processQueue();
            // Tell Dropzone to process all queued files.
        });
        // You might want to show the submit button only when
        // files are dropped here:
        this.on("addedfile", function () {
            // Show submit button here and/or inform user to click it.
        });
        this.on("processing", function () {
            this.options.autoProcessQueue = true;
        });
    }
};