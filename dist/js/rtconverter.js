document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("rtfont").classList.add("active");
    $('[data-toggle="toggle"]').bootstrapToggle();
    $('#use_editor').bootstrapToggle('off')
    document.getElementById("rtfont").classList.remove("active");
});

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

function read_buffer_signed_number(buffer, pos, len) {
    let value = 0;
    let signBit = buffer[pos + len - 1] & 0x80;
    for (let a = 0; a < len; a++) {
        let shift = a * 8;
        value |= buffer[pos + a] << shift;
    }
    if (signBit) {
        let maxVal = Math.pow(2, len * 8);
        value -= maxVal;
    }

    return value;
}

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

function checkArray(arr, val) {
    for (let a = 0; a < arr.length; a++) {
        if (arr[a].includes(val)) return a;
    }
    return 0;
}

function checkTotal(arr, val) {
    let res = 0;
    for (let a = 0; a < arr.length; a++) {
        if (arr[a].includes(val)) res++;
    }
    return res;
}

function extractArray(arr, val) {
    var res = []

    for (let a = 0, b = 0; a < arr.length; a++) {
        if (arr[a].includes(val)) res[b++] = arr[a].slice(val.length)
    }
    return res;
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

document.getElementById('open_rtfont_file').addEventListener('click', function () {
    var input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';

    input.onchange = function (e) {
        var file = e.target.files[0];
        process_open_rtfont(file)
    };

    document.body.appendChild(input);
    input.click();
});

document.getElementById('rtfont_unpacker').addEventListener('click', function () {
    var input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';

    input.onchange = function (e) {
        var file = e.target.files[0];
        rtfont_unpacker(file)
    };

    document.body.appendChild(input);
    input.click();
});

document.getElementById('rtfont_packer').addEventListener('click', function () {
    var input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';

    input.onchange = function (e) {
        var file = e.target.files[0];
        rtfont_packer(file)
    };

    document.body.appendChild(input);
    input.click();
});

document.getElementById("change_png_rtfont").addEventListener('click', function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';

    input.onchange = function (e) {
        var file = e.target.files[0];
        change_png_rtfont(file)
    };

    document.body.appendChild(input);
    input.click();
})

function read_buffer_string(buffer, pos, len) {
    var result = "";
    for (let a = 0; a < len; a++) result += String.fromCharCode(buffer[a + pos])
    
    return result;
}

function arrayBufferToURL(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    for (var i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return 'data:image/png;base64,' + btoa(binary);
}

function process_rttex_to_png(arrayBuffer, canvasTempCtx, using_rtfont) {
    if (read_buffer_string(arrayBuffer, 0, 6) == "RTPACK") arrayBuffer = pako.inflate(arrayBuffer.slice(32));
    if (read_buffer_string(arrayBuffer, 0, 6) == "RTTXTR") {
        var packedHeight = read_buffer_number(arrayBuffer, 8, 4);
        var packedWidth = read_buffer_number(arrayBuffer, 12, 2);
        var usesAlpha = arrayBuffer[0x1c];

        const canvasT = document.getElementById(canvasTempCtx);
        const contextT = canvasT.getContext('2d');

        canvasT.width = packedWidth;
        canvasT.height = packedHeight;

        const imageData = contextT.createImageData(packedWidth, packedHeight);
        imageData.data.set(new Uint8ClampedArray(arrayBuffer.slice(0x7c, 0x7c + packedHeight * packedWidth * (3 + usesAlpha))));
        contextT.putImageData(imageData, 0, 0);
        
        return canvasT.toDataURL()
    }
    else {
        Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        }).fire({
            icon: 'error',
            title: using_rtfont ? 'Not a vaild RTFONT File' : 'Not a valid RTTEX File'
        })
        return 0;
    }
}

function process_png_to_rttex(img, canvasTempCtx, noCompress) {
    var canvas = document.getElementById(canvasTempCtx);
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
    if (noCompress) return new Uint8Array([...RTTEXBuffer, ...pixelBuffer])
    var RTPACKBuffer = [0x52, 0x54, 0x50, 0x41, 0x43, 0x4B]
    
    write_buffer_number(RTPACKBuffer, 8, 4, deflateBuffer.length);
    write_buffer_number(RTPACKBuffer, 12, 4, 0x7c + pixelBuffer.length)
    RTPACKBuffer[16] = 1
    for (let a = 17; a < 32; a++) RTPACKBuffer[a] = 0;
    return new Uint8Array([...RTPACKBuffer, ...deflateBuffer])
}

function download_image(file, canvas) {
    var aDownloadLink = document.createElement('a');
    aDownloadLink.download = file.name.split(".")[0] + ".png";
    aDownloadLink.href = canvas.toDataURL();
    aDownloadLink.click();
}

function rttex_to_png(file) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function (e) {
        var img = new Image()
        img.src = process_rttex_to_png(new Uint8Array(reader.result), "canvas_temporary")
        img.onload = function() {
            var canvas = document.getElementById("canvas_result");
            var context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.scale(1, -1);
            context.drawImage(img, 0, -img.height);
            if (document.getElementById("auto_download_image").checked) download_image(file, canvas)
            document.getElementById("download_image").onclick = function() {
                download_image(file, canvas);
            }
            document.getElementById("download_image").classList.remove("d-none")
        };
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
        img.src = e.target.result
        img.onload = function(e) {
            var result = process_png_to_rttex(img, "canvas_temporary")
            hash_buffer(result, "rttex_hash_file", "RTTEX Hash File: ")
            saveDataBuffer(result, file.name.split(".")[0] + ".rttex")
        }
    }

    reader.readAsDataURL(file);
}

const XMLOptions = {
    format: true,
    ignoreAttributes : false
};

function process_rtfont_unpacker(arrayBuffer, using_editor) {
    if (read_buffer_string(arrayBuffer, 0, 6) == "RTPACK") arrayBuffer = pako.inflate(arrayBuffer.slice(32));
    if (read_buffer_string(arrayBuffer, 0, 6) == "RTFONT") {
        let memPos = 8;
        var fontState = using_editor ? "" : `image|rtfont.png\nfnt_file|rtfont.fnt\n`;
        var XMLTemp = {
            font: {
                common: {},
                chars: {char: []},
                kernings: {kerning: []}
            }
        }

        var charSpacing = read_buffer_number(arrayBuffer, memPos, 2);
        memPos += 2;
        var lineHeight = read_buffer_number(arrayBuffer, memPos, 2);
        memPos += 2;
        var lineSpacing = read_buffer_number(arrayBuffer, memPos, 2);
        memPos += 2;
        var shadowXOffset = read_buffer_number(arrayBuffer, memPos, 2);
        memPos += 2;
        var shadowYOffset = read_buffer_number(arrayBuffer, memPos, 2);
        memPos += 2;
        var firstChar = read_buffer_number(arrayBuffer, memPos, 2);
        memPos += 2;
        var lastChar = read_buffer_number(arrayBuffer, memPos, 2);
        memPos += 2;
        var blankCharWidth = read_buffer_number(arrayBuffer, memPos, 2);
        memPos += 2;
        var fontStateCount = read_buffer_number(arrayBuffer, memPos, 2);
        memPos += 2;
        var kerningPairCount = read_buffer_number(arrayBuffer, memPos, 2);
        memPos += 126;

        fontState += `blank_space_width|${blankCharWidth}\n`
        XMLTemp.font.common["@_lineHeight"] = lineHeight
        XMLTemp.font.chars["@_count"] = lastChar - firstChar
        XMLTemp.font.kernings["@_count"] = kerningPairCount

        for (let a = 0; a < lastChar - firstChar; a++) {
            XMLTemp.font.chars.char[a] = {}
            XMLTemp.font.chars.char[a]["@_id"] = 32 + a
            XMLTemp.font.chars.char[a]["@_x"] = read_buffer_number(arrayBuffer, memPos, 2);
            memPos += 2;
            XMLTemp.font.chars.char[a]["@_y"] = read_buffer_number(arrayBuffer, memPos, 2);
            memPos += 2;
            XMLTemp.font.chars.char[a]["@_width"] = read_buffer_number(arrayBuffer, memPos, 2);
            memPos += 2;
            XMLTemp.font.chars.char[a]["@_height"] = read_buffer_number(arrayBuffer, memPos, 2);
            memPos += 2;
            XMLTemp.font.chars.char[a]["@_xoffset"] = read_buffer_signed_number(arrayBuffer, memPos, 2);
            memPos += 2;
            XMLTemp.font.chars.char[a]["@_yoffset"] = read_buffer_signed_number(arrayBuffer, memPos, 2);
            memPos += 18; // 2 + 16
            XMLTemp.font.chars.char[a]["@_xadvance"] = read_buffer_number(arrayBuffer, memPos, 2);
            memPos += 2;
            XMLTemp.font.chars.char[a]["@_page"] = 0
            XMLTemp.font.chars.char[a]["@_chnl"] = 15
            memPos += 2;
        }

        for (let a = 0; a < kerningPairCount; a++) {
            XMLTemp.font.kernings.kerning[a] = {}
            XMLTemp.font.kernings.kerning[a]["@_first"] = read_buffer_signed_number(arrayBuffer, memPos, 2);
            memPos += 2;
            XMLTemp.font.kernings.kerning[a]["@_second"] = read_buffer_signed_number(arrayBuffer, memPos, 2);
            memPos += 2;
            XMLTemp.font.kernings.kerning[a]["@_amount"] = read_buffer_signed_number(arrayBuffer, memPos, 1);
            memPos += 2;
        }

        for (let a = 0; a < fontStateCount; a++) {
            fontState += `add_format_color|${String.fromCharCode(arrayBuffer[memPos + 4])}|${arrayBuffer[memPos + 1]},${arrayBuffer[memPos + 2]},${arrayBuffer[memPos + 3]}|\n`
            memPos += 8;
        }

        var img = new Image()
        img.src = process_rttex_to_png(new Uint8Array(arrayBuffer.slice(memPos)), "canvas_temporary_2", true)

        img.onload = async function() {
            if (using_editor) {
                document.getElementById("txt_file").value = fontState
                document.getElementById("fnt_file").value = new XMLBuilder(XMLOptions).build(XMLTemp)
                document.getElementById("rtfont_opened").classList.remove("d-none")
                CodeMirror.fromTextArea(document.getElementById("txt_file"), {
                    mode: "htmlmixed",
                    theme: "monokai"
                });
                CodeMirror.fromTextArea(document.getElementById("fnt_file"), {
                    mode: "htmlmixed",
                    theme: "monokai"
                });
                var canvas = document.getElementById("image_rtfont");
                var context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context.scale(1, -1);
                context.drawImage(img, 0, -img.height);
                return;
            }
            var canvas = document.getElementById("canvas_temporary_3");
            var context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.scale(1, -1);
            context.drawImage(img, 0, -img.height);
            var PNGBuffer = (await fetch(canvas.toDataURL())).arrayBuffer()
            var zip = new JSZip();
            zip.file("rtfont.txt", fontState);
            zip.file("rtfont.fnt", new XMLBuilder(XMLOptions).build(XMLTemp));
            zip.file("rtfont.png", PNGBuffer);
            
            zip.generateAsync({type:"arrayBuffer"}).then(function(content) {
                saveDataBuffer(content, file.name.split(".")[0] + ".zip")
            });
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
            title: 'Not a valid RTFONT File'
        })
    }
}

function process_rtfont_packer(bFile, namefile, using_editor) {
    if (bFile[0] && bFile[1] && bFile[2]) {
        var fntData = new XMLParser(XMLOptions).parse(bFile[1])
        var txtData = bFile[0].split("\n")
        let memPos = 10;
        let lineHeight = Number(fntData.font.common["@_lineHeight"])
        let charsCount = Number(fntData.font.chars["@_count"])
        let blankSpaceWidth = Number(txtData[checkArray(txtData, "blank_space_width")].split("|")[1])
        let fontStateCount = checkTotal(txtData, "add_format_color")
        let kerningsCount = Number(fntData.font.kernings["@_count"])
        var fontState = extractArray(txtData, "add_format_color|")

        var RTFONTBuffer = [0x52, 0x54, 0x46, 0x4F, 0x4E, 0x54]
        for (let a = 6; a < 152; a++) RTFONTBuffer[a] = 0
        
        write_buffer_number(RTFONTBuffer, memPos, 2, lineHeight)
        memPos += 2;
        write_buffer_number(RTFONTBuffer, memPos, 2, lineHeight)
        memPos += 2;
        write_buffer_number(RTFONTBuffer, memPos, 4, 0);
        memPos += 4;
        write_buffer_number(RTFONTBuffer, memPos, 2, 32)
        memPos += 2;
        write_buffer_number(RTFONTBuffer, memPos, 2, charsCount + 32);
        memPos += 2;
        write_buffer_number(RTFONTBuffer, memPos, 2, blankSpaceWidth);
        memPos += 2;
        write_buffer_number(RTFONTBuffer, memPos, 2, fontStateCount);
        memPos += 2;
        write_buffer_number(RTFONTBuffer, memPos, 2, kerningsCount);
        memPos += 126;

        for (let a = 0; a < charsCount; a++) {
            write_buffer_number(RTFONTBuffer, memPos, 2, Number(fntData.font.chars.char[a]["@_x"]));
            memPos += 2;
            write_buffer_number(RTFONTBuffer, memPos, 2, Number(fntData.font.chars.char[a]["@_y"]));
            memPos += 2;
            write_buffer_number(RTFONTBuffer, memPos, 2, Number(fntData.font.chars.char[a]["@_width"]));
            memPos += 2;
            write_buffer_number(RTFONTBuffer, memPos, 2, Number(fntData.font.chars.char[a]["@_height"]));
            memPos += 2;
            write_buffer_number(RTFONTBuffer, memPos, 2, Number(fntData.font.chars.char[a]["@_xoffset"]));
            memPos += 2;
            write_buffer_number(RTFONTBuffer, memPos, 2, Number(fntData.font.chars.char[a]["@_yoffset"]));
            memPos += 2;
            write_buffer_number(RTFONTBuffer, memPos, 16, 0);
            memPos += 16;
            write_buffer_number(RTFONTBuffer, memPos, 2, Number(fntData.font.chars.char[a]["@_xadvance"]));
            memPos += 2;
            write_buffer_number(RTFONTBuffer, memPos, 2, 0);
            memPos += 2;
        }
    
        for (let a = 0; a < kerningsCount; a++) {
            write_buffer_number(RTFONTBuffer, memPos, 2, Number(fntData.font.kernings.kerning[a]["@_first"]));
            memPos += 2;
            write_buffer_number(RTFONTBuffer, memPos, 2, Number(fntData.font.kernings.kerning[a]["@_first"]));
            memPos += 2;
            RTFONTBuffer[memPos++] = Number(fntData.font.kernings.kerning[a]["@_amount"])
            RTFONTBuffer[memPos++] = 0
        }
    
        for (let a = 0; a < fontStateCount; a++) {
            var readFontState = fontState[a].split("|")
            var readFontStateColor = readFontState[1].split(",")
            RTFONTBuffer[memPos++] = 0;
            RTFONTBuffer[memPos++] = readFontStateColor[0]
            RTFONTBuffer[memPos++] = readFontStateColor[1]
            RTFONTBuffer[memPos++] = readFontStateColor[2]
            RTFONTBuffer[memPos++] = readFontState[0].charCodeAt(0)
            write_buffer_number(RTFONTBuffer, memPos, 3, 0)
            memPos += 3;
        }

        if (bFile[3]) {
            RTFONTBuffer = new Uint8Array([...RTFONTBuffer, ...bFile[2]])
            var deflateBuffer = pako.deflate(RTFONTBuffer)
            var RTPACKBuffer = [0x52, 0x54, 0x50, 0x41, 0x43, 0x4B]

            write_buffer_number(RTPACKBuffer, 8, 4, deflateBuffer.length);
            write_buffer_number(RTPACKBuffer, 12, 4, RTFONTBuffer.length)
            RTPACKBuffer[16] = 1
            for (let a = 17; a < 32; a++) RTPACKBuffer[a] = 0;
            var resultData = new Uint8Array([...RTPACKBuffer, ...deflateBuffer])
            saveDataBuffer(resultData, namefile)
            hash_buffer(resultData, using_editor ? "rtfont_hash_2" : "rtfont_hash_1", "RTFont Hash File: ")
        }
        else {
            var img = new Image()
            img.src = using_editor ? bFile[2] : arrayBufferToURL(bFile[2])
            img.onload = function() {
                RTFONTBuffer = new Uint8Array([...RTFONTBuffer, ...process_png_to_rttex(img, "canvas_temporary_2", true)])
                var deflateBuffer = pako.deflate(RTFONTBuffer)
                var RTPACKBuffer = [0x52, 0x54, 0x50, 0x41, 0x43, 0x4B]
                write_buffer_number(RTPACKBuffer, 8, 4, deflateBuffer.length);
                write_buffer_number(RTPACKBuffer, 12, 4, RTFONTBuffer.length)
                RTPACKBuffer[16] = 1
                for (let a = 17; a < 32; a++) RTPACKBuffer[a] = 0;
                var resultData = new Uint8Array([...RTPACKBuffer, ...deflateBuffer])
                saveDataBuffer(resultData, namefile)
                hash_buffer(resultData, using_editor ? "rtfont_hash_2" : "rtfont_hash_1", "RTFont Hash File: ")
            }
        }
        
    } else {
        return Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        }).fire({
            icon: 'error',
            title: 'Missing file! Please put png/rttex, fnt, txt (must be rtfont format) to ZIP and send here again'
        })
    }
}

function rtfont_unpacker(file) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function (e) {
        process_rtfont_unpacker(new Uint8Array(e.target.result))
    }
}

function rtfont_packer(file) {
    var bFile = [null, null, null, 0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var jsZip = new JSZip();
        jsZip.loadAsync(file).then(async function (zip) {
            var promises = Object.keys(zip.files).map(async function (filename) {
                await zip.files[filename].async(filename.includes(".txt") || filename.includes(".fnt") ? 'string' : 'ArrayBuffer').then(function (fileData) {
                    if (filename.includes(".txt")) bFile[0] = fileData;
                    else if (filename.includes(".fnt")) bFile[1] = fileData;
                    else if (filename.includes(".png")) bFile[2] = fileData;
                    else if (filename.includes(".rttex")) {
                        bFile[2] = fileData;
                        bFile[3] = 1;
                    }
                });
            });

            await Promise.all(promises);
            process_rtfont_packer(bFile, file.name.split(".")[0])
        });
    };

    reader.readAsArrayBuffer(file);
}

function process_open_rtfont(file) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function (e) {
        process_rtfont_unpacker(new Uint8Array(e.target.result), true)
    }
}

function change_png_rtfont(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        var img = new Image()
        img.src = e.target.result
        img.onload = function() {
            var canvas = document.getElementById("image_rtfont");
            var context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
        }
    }
}

function save_to_rtfont() {
    var bFile = [document.getElementById("txt_file").value, document.getElementById("fnt_file").value, document.getElementById("image_rtfont").toDataURL(), 0]
    process_rtfont_packer(bFile, "result.rtfont", true)
}