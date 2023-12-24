var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    /**
     * @param {ArrayBuffer} data
     * @param {string} fileName
     */
    return function (data, fileName) {
            blob = new Blob([data], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

var saveDataBuffer = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    /**
     * @param {ArrayBuffer} data
     * @param {string} fileName
     */
    return function (data, fileName) {
            blob = new Blob([new Uint8Array(data)], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

function hash_buffer(buffer, element, text) {
    var hash = 0x55555555;
    var toBuffer = new Uint8Array(buffer);
    for (let a = 0; a < toBuffer.length; a++) hash = (hash >>> 27) + (hash << 5) + toBuffer[a]
    document.getElementById(element).innerHTML = text + hash
}

/**
 * @param {ArrayBuffer} buffer
 * @param {number} pos
 * @param {number} len
 * @return {string}
 */
function read_buffer_number(buffer, pos, len) {
    let value = 0;
    for (let a = 0; a < len; a++) value += buffer[pos + a] << (a * 8)

    return value;
}

/**
 * @param {number} pos
 * @param {number} len
 * @param {number} value
 */
function write_buffer_number(dest, pos, len, value) {
    for (let a = 0; a < len; a++) {
        dest[pos + a] = (value >> (a * 8)) & 255;
    }
}

/**
 * Convert a hex string to an ArrayBuffer.
 * 
 * @param {string} hexString - hex representation of bytes
 * @return {ArrayBuffer} - The bytes in an ArrayBuffer.
 */
function hexStringToArrayBuffer(pos, hexString) { //https://gist.github.com/don/871170d88cf6b9007f7663fdbc23fe09
    // remove the space
    hexString = hexString.replace(/ /g, '');
    if (hexString.length % 2 != 0) console.log('WARNING: expecting an even number of characters in the hexString');
    
    // check for some non-hex characters
    var bad = hexString.match(/[G-Z\s]/i);
    if (bad) console.log('WARNING: found non-hex characters', bad);

    // convert the octets to integers
    var integers = hexString.match(/[\dA-F]{2}/gi).map(function(s) {
        encoded_buffer_file[pos++] = parseInt(s, 16)
    });

    return integers
}

document.getElementById('rttex_to_png').addEventListener('click', function () {
    var input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';

    input.onchange = function (e) {
        var file = e.target.files[0];
        rttex_to_png(file);
    };

    document.body.appendChild(input);
    input.click();
});

document.getElementById('png_to_rttex').addEventListener('click', function () {
    var input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';

    input.onchange = function (e) {
        var file = e.target.files[0];
        png_to_rttex(file)
    };

    document.body.appendChild(input);
    input.click();
});

function read_buffer_string(buffer, pos, len) {
    var result = "";
    for (let a = 0; a < len; a++) result += String.fromCharCode(buffer[a + pos])
    
    return result;
}

function rttex_to_png(file) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function (e) {
        var arrayBuffer = new Uint8Array(e.target.result);
        
        if (read_buffer_string(arrayBuffer, 0, 6) == "RTPACK") arrayBuffer = pako.inflate(arrayBuffer.slice(32));
        if (read_buffer_string(arrayBuffer, 0, 6) == "RTTXTR") {
            var packedHeight = read_buffer_number(arrayBuffer, 8, 4);
            var packedWidth = read_buffer_number(arrayBuffer, 12, 2);
            var usesAlpha = arrayBuffer[0x1c];

            const canvasT = document.getElementById("canvas_temporary");
            const contextT = canvasT.getContext('2d');

            canvasT.width = packedWidth;
            canvasT.height = packedHeight;

            const imageData = contextT.createImageData(packedWidth, packedHeight);
            imageData.data.set(new Uint8ClampedArray(arrayBuffer.slice(0x7c, 0x7c + packedHeight * packedWidth * (3 + usesAlpha))));
            contextT.putImageData(imageData, 0, 0);

            var img = new Image()
            img.src = canvasT.toDataURL()

            img.onload = function() {
                var canvas = document.getElementById("canvas_result");
                var context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context.scale(1, -1);
                context.drawImage(img, 0, -img.height);
                var aDownloadLink = document.createElement('a');
                aDownloadLink.download = file.name.split(".")[0] + ".png";
                aDownloadLink.href = canvas.toDataURL();
                aDownloadLink.click();
            }
        }
        else {
            return Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            }).fire({
                icon: 'error',
                title: 'Not a valid RTTEX File'
            })
        }
    }
}

function png_to_rttex(file) {
    if (!file.type.includes("image")) {
        return Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        }).fire({
            icon: 'error',
            title: 'Not a valid Image File'
        })
    }

    var reader = new FileReader();

    reader.onload = function (e) {
        var img = new Image()
        img.src = reader.result

        img.onload = function() {
            var canvas = document.getElementById("canvas_temporary");
            var context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.scale(1, -1);
            context.drawImage(img, 0, -img.height);
            var imageData = context.getImageData(0, 0, img.width, img.height);
            const pixelBuffer = new Uint8Array(imageData.data.buffer);
            var RTTEXBuffer = [0x52, 0x54, 0x54, 0x58, 0x54, 0x52]

            write_buffer_number(RTTEXBuffer, 8, 4, img.height)
            write_buffer_number(RTTEXBuffer, 12, 4, img.width)
            write_buffer_number(RTTEXBuffer, 16, 4, 5121)
            write_buffer_number(RTTEXBuffer, 20, 4, img.height)
            write_buffer_number(RTTEXBuffer, 24, 4, img.width)
            RTTEXBuffer[28] = 1;
            RTTEXBuffer[29] = 0;
            write_buffer_number(RTTEXBuffer, 32, 4, 1)
            write_buffer_number(RTTEXBuffer, 100, 4, img.height)
            write_buffer_number(RTTEXBuffer, 104, 4, img.width)
            write_buffer_number(RTTEXBuffer, 108, 4, pixelBuffer.length);
            write_buffer_number(RTTEXBuffer, 112, 4, 0)
            write_buffer_number(RTTEXBuffer, 116, 4, 0)
            write_buffer_number(RTTEXBuffer, 120, 4, 0)

            var deflateBuffer = pako.deflate(new Uint8Array([...RTTEXBuffer, ...pixelBuffer]));
            var RTPACKBuffer = [0x52, 0x54, 0x50, 0x41, 0x43, 0x4B]
            
            write_buffer_number(RTPACKBuffer, 8, 4, deflateBuffer.length);
            write_buffer_number(RTPACKBuffer, 12, 4, 0x7c + pixelBuffer.length)
            RTPACKBuffer[16] = 1
            for (let a = 17; a < 32; a++) RTPACKBuffer[a] = 0;
            hash_buffer(new Uint8Array([...RTPACKBuffer, ...deflateBuffer]), "rttex_hash_file", "RTTEX Hash File: ")
            saveDataBuffer(new Uint8Array([...RTPACKBuffer, ...deflateBuffer]), file.name.split(".")[0] + ".rttex")
        };
    }

    reader.readAsDataURL(file);
}
