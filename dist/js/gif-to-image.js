const using_ori_size_image = document.getElementById("using_ori_size_image");
const custom_image_size_output_div = document.getElementById("custom_image_size_output_div");
const gif_opt_div = document.getElementById("gif_opt_div");
const extract_to_single_image_btn = document.getElementById("extract_to_single_image_btn");
const custom_out_img_width = document.getElementById("custom_out_img_width");
const custom_out_img_height = document.getElementById("custom_out_img_height");
const img_filter = document.getElementById("img_filter");

const temp_canvas = document.createElement("canvas");
const context = temp_canvas.getContext("2d");
const input = document.createElement('input');

const download_element = document.createElement("a");

input.type = 'file';
input.accept = "image/gif";
input.style.display = 'none';

let gif_img = null;
let is_hidden = true;

window.onload = function() {
    temp_canvas.style.display = "none";
}

var saveDataBuffer = (function () {
    download_element.style = "display: none";
    /**
     * @param {ArrayBuffer} data
     * @param {string} fileName
     */
    return function (data, fileName) {
        blob = new Blob([new Uint8Array(data)], {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);
        download_element.href = url;
        download_element.download = fileName;
        download_element.click();
        window.URL.revokeObjectURL(url);
    };
}());

document.getElementById("using_ori_size_image").onchange = function(e) {
    custom_image_size_output_div.style.display = e.target.checked ? "none" : "";
}

function canvasToBlob(canvas, type = 'image/png') {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, type);
    });
}

document.getElementById('browse_gif_file').addEventListener('click', function() {
    input.onchange = function (ev) {
        document.getElementById("file_name").innerText = `File Name: ${ev.target.files[0].name}`;
        const freader = new FileReader();
        gif_img = freader.readAsDataURL(ev.target.files[0]);

        freader.onloadend = function(e) {
            const image = new Image();
            image.src = e.target.result;

            image.onload = function(event) {
                gif_img = event.target;

                if (is_hidden) {
                    gif_opt_div.style.display = "";
                    is_hidden = false;
                    $('#using_ori_size_image').bootstrapToggle('destroy');
                    $('#using_ori_size_image').bootstrapToggle();
                    $("#using_ori_size_image").bootstrapToggle("on");
                }
            }
        }
    };

    input.click();
});

async function extract_to_single_image() {
    const gif = new SuperGif({ gif: gif_img } );
    const zip = new JSZip();

    gif.load(async function() {
        extract_to_single_image_btn.disabled = true;
        extract_to_single_image_btn.innerText = `Extract it to to Zipped Single Image! (Processing...)`
        
        const gif_len = gif.get_length();
        for (let a = 0; a < gif_len; a++) {
            gif.move_to(a);
            const result_canvas = gif.get_canvas();
            if (!using_ori_size_image.checked) {
                temp_canvas.width = Number(custom_out_img_width.value);
                temp_canvas.height = Number(custom_out_img_height.value);
                context.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
                context.imageSmoothingEnabled = img_filter.value === "Nearest" ? false : true
                context.drawImage(result_canvas, 0, 0, result_canvas.width, result_canvas.height, 0, 0, temp_canvas.width, temp_canvas.height)
                await zip.file(`${a}.png`, await canvasToBlob(temp_canvas));
            } else {
                await zip.file(`${a}.png`, await canvasToBlob(gif.get_canvas()));
            }
        }

        await zip.generateAsync({type:"arrayBuffer"}).then(function(content) {
            saveDataBuffer(content, "result.zip")
            extract_to_single_image_btn.disabled = false;
            extract_to_single_image_btn.innerText = `Extract it to to Zipped Single Image!`
        });
    })
    
}