document.getElementById('hash_file').addEventListener('click', function () {
    var input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';

    input.onchange = function (e) {
        var file = e.target.files[0];
        hash_file(file);
    };

    document.body.appendChild(input);
    input.click();
});

function hash_file(file) {
    document.getElementById("file_name").innerHTML = "File Name: " + file.name
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = function (e) {
        var hash = 0x55555555;
        var toBuffer = new Uint8Array(reader.result);
        for (let a = 0; a < toBuffer.length; a++) hash = (hash >>> 27) + (hash << 5) + toBuffer[a]
        document.getElementById("result_hash").innerHTML = "Result Hash: " + hash
    }
}