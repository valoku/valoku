function createDownloadLink(camanContext) {
    // atob to base64_decode the data-URI
    var base64_data = camanContext.toBase64('jpeg');
    var image_data = atob(base64_data.split(',')[1]);
    // Use typed arrays to convert the binary data to a Blob
    var arraybuffer = new ArrayBuffer(image_data.length);
    var view = new Uint8Array(arraybuffer);
    for (var i = 0; i < image_data.length; i++) {
        view[i] = image_data.charCodeAt(i) & 0xff;
    }
    try {
        // This is the recommended method:
        var blob = new Blob([arraybuffer], {type: 'application/octet-stream'});
    } catch (e) {
        // The BlobBuilder API has been deprecated in favour of Blob, but older
        // browsers don't know about the Blob constructor
        // IE10 also supports BlobBuilder, but since the `Blob` constructor
        //  also works, there's no need to add `MSBlobBuilder`.
        var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
        bb.append(arraybuffer);
        var blob = bb.getBlob('application/octet-stream'); // <-- Here's the Blob
    }
    // Use the URL object to create a temporary URL
    var url = (window.webkitURL || window.URL).createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "file.jpeg";
    return a;
}