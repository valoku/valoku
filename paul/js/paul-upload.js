Dropzone.options.myDropzone = {
    acceptedFiles: "image/*",
    // Prevents Dropzone from uploading dropped files immediately
    autoProcessQueue: true,
    maxFiles: 1,
    maxFilesize: 3, // 3 MiB = 3.15MB (same limit is set on client side)
    init: function () {
        myDropzone = this;
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