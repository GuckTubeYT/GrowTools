const canvas1 = document.getElementById("tile_image");
const canvas2 = document.getElementById("per_tile_image");
const canvas3 = document.getElementById("loaded_tile_preview");
const loaded_tile_preview_div = document.getElementById("loaded_tile_preview_div");
const image_per_tile_width = document.getElementById("image_per_tile_width");
const image_per_tile_height = document.getElementById("image_per_tile_height");
const using_ori_size_image = document.getElementById("using_ori_size_image");
const custom_image_size_div = document.getElementById("custom_image_size_div");
const custom_gif_width = document.getElementById("custom_gif_width");
const custom_gif_height = document.getElementById("custom_gif_height");
const img_filter = document.getElementById("img_filter");
const max_loop = document.getElementById("max_loop");
const delay_per_frame = document.getElementById("delay_per_frame");
const download_result_gif_btn = document.getElementById("download_result_gif_btn");
const apply_and_preview_btn = document.getElementById("apply_and_preview_btn");

const context1 = canvas1.getContext("2d");
const context2 = canvas2.getContext("2d");
const context3 = canvas3.getContext("2d");

const download_element = document.createElement("a");
const input = document.createElement('input');

input.type = 'file';
input.accept = "image/*";
input.style.display = 'none';

img = null;
let is_hidden = true;

document.getElementById("using_ori_size_image").onchange = function(e) {
    custom_image_size_div.style.display = e.target.checked ? "none" : "";
}

function encode64(input) {
	var output = "", i = 0, l = input.length,
	key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", 
	chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	while (i < l) {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) enc3 = enc4 = 64;
		else if (isNaN(chr3)) enc4 = 64;
		output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
	}
	return output;
}

function drawGrid(tileWidth, tileHeight) {
    context3.strokeStyle = 'rgba(255, 255, 255, 1)';
    context3.beginPath();

    for (let x = 0; x <= canvas1.width; x += tileWidth) {
        context3.moveTo(x, 0);
        context3.lineTo(x, canvas1.height);
    }

    for (let y = 0; y <= canvas1.height; y += tileHeight) {
        context3.moveTo(0, y);
        context3.lineTo(canvas1.width, y);
    }

    context3.stroke();
}

function canvas_draw() {
    context3.clearRect(0, 0, canvas1.width, canvas1.height);
    context3.drawImage(canvas1, 0, 0);

    drawGrid(Number(image_per_tile_width.value) || 32, Number(image_per_tile_height.value) || 32);
}

image_per_tile_width.addEventListener("input", canvas_draw)
image_per_tile_height.addEventListener("input", canvas_draw)

document.getElementById('browse_tile_image').addEventListener('click', function() {
    input.onchange = function (ev) {
        document.getElementById("file_name").innerText = `File Name: ${ev.target.files[0].name}`;
        const freader = new FileReader();
        img = freader.readAsDataURL(ev.target.files[0]);

        freader.onloadend = function(e) {
            const image = new Image();
            image.src = e.target.result;

            image.onload = function(event) {
                download_result_gif_btn.disabled = true;
                img = event.target;

                canvas1.width = img.width;
                canvas1.height = img.height;

                canvas3.width = canvas1.width;
                canvas3.height = canvas1.height;
                context1.clearRect(0, 0, canvas1.width, canvas1.height);
                context1.drawImage(img, 0, 0);

                loaded_tile_preview_div.style.height = Number(loaded_tile_preview_div.style.height.slice(0, -2)) >= canvas1.height ? `${canvas1.height}px` : Number(loaded_tile_preview_div.style.height.slice(0, -2));
                loaded_tile_preview_div.style.width = Number(loaded_tile_preview_div.style.width.slice(0, -2)) >= canvas1.width ? `${canvas1.width}px` : Number(loaded_tile_preview_div.style.width.slice(0, -2));

                context3.clearRect(0, 0, img.width, img.height);
                context3.drawImage(img, 0, 0)

                loaded_tile_preview_div.style.display = "";

                if (is_hidden) {
                    document.getElementById("tile_to_gif_div").style.display = "";
                    
                    using_ori_size_image.disabled = false;
                    image_per_tile_width.disabled = false;
                    image_per_tile_height.disabled = false;
                    is_hidden = false;

                    $('#using_ori_size_image').bootstrapToggle('destroy');
                    $('#using_ori_size_image').bootstrapToggle();
                    $("#using_ori_size_image").bootstrapToggle("on");

                    canvas_draw();
                }
            }
        }
    };

    input.click();
});

function apply_and_preview() {
    if (canvas1.width % Number(image_per_tile_width.value) || canvas1.width % Number(image_per_tile_height.value)) return Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    }).fire({
        icon: 'error',
        title: "Please input the correct per tile Width and Height! until it fit per tile image."
    })

    const total_x = canvas1.width / Number(image_per_tile_width.value);
    const total_y = canvas1.height / Number(image_per_tile_height.value);
    const gif_encoder = new GIFEncoder();
    gif_encoder.setRepeat(Number(max_loop.value));
    gif_encoder.setDelay(Number(delay_per_frame.value));
    gif_encoder.start();

    canvas2.width = Number(!using_ori_size_image.checked ? custom_gif_width.value : image_per_tile_width.value);
    canvas2.height = Number(!using_ori_size_image.checked ? custom_gif_height.value : image_per_tile_height.value);

    for (let y = 0; y < total_y; y++) { // width
        for (let x = 0; x < total_x; x++) { // height
            context2.clearRect(0, 0, canvas2.width, canvas2.height);
            context2.imageSmoothingEnabled = img_filter.value === "Nearest" ? false : true;
            context2.drawImage(canvas1, Number(image_per_tile_width.value) * x, Number(image_per_tile_height.value) * y, Number(image_per_tile_width.value) , Number(image_per_tile_height.value) , 0, 0, canvas2.width, canvas2.height);
            gif_encoder.addFrame(context2);
        }
    }

    gif_encoder.finish();
    document.getElementById("gif_result").src = 'data:image/gif;base64,' + encode64(gif_encoder.stream().getData())

    download_result_gif_btn.disabled = false;
    apply_and_preview_btn.disabled = true;

    Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    }).fire({
        icon: 'success',
        title: "The tile was successfully converted into a GIF!"
    })
}

function download_result_gif() {
    download_element.href = document.getElementById("gif_result").src
    download_element.download = "result.gif"
    download_element.click()
}

document.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener("input", function() {
        download_result_gif_btn.disabled = true;
        apply_and_preview_btn.disabled = false;
    })
})

document.getElementById("img_filter").addEventListener("change", function() {
    download_result_gif_btn.disabled = true;
    apply_and_preview_btn.disabled = false;
})

$('#using_ori_size_image').change(function () {
    download_result_gif_btn.disabled = true;
    apply_and_preview_btn.disabled = false;
});
