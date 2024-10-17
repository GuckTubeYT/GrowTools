const canvas1 = document.getElementById('tile_image_canvas');
const canvas2 = document.getElementById('image_single_tile');
const canvas3 = document.getElementById("single_tile_original");
const canvas4 = document.getElementById("tile_image_canvas_original");
const canvas_temp = document.getElementById("temp_canvas");
const manual_size = document.getElementById("manual_size");
const tile_div = document.getElementById("tile_div");
const single_tile_div = document.getElementById("single_tile_div");
const tileWidthInput = document.getElementById('tileWidth');
const tileHeightInput = document.getElementById('tileHeight');
const prev_width = document.getElementById("prev_width");
const prev_height = document.getElementById("prev_height");
const prev_img_filter = document.getElementById("prev_img_filter");
const dw_tile = document.getElementById("dw_tile");
const extract_tile_to_per_image_btn = document.getElementById("extract_tile_to_per_image");
const result_img_filter = document.getElementById("result_img_filter");
const reposition_tile_btn = document.getElementById("reposition_tile_btn");
const image_width_create_tile = document.getElementById("image_width_create_tile");
const image_height_create_tile = document.getElementById("image_height_create_tile");
const total_tile_in_x = document.getElementById("total_tile_in_x");
const total_tile_in_y = document.getElementById("total_tile_in_y");
const mouse_event_log = document.getElementById("mouse_event_log");
const using_mouse_event = document.getElementById("using_mouse_event");
const mouse_event_plaintext = document.getElementById("mouse_event_plaintext");
const mouse_event_action = document.getElementById("mouse_event_action");

const context1 = canvas1.getContext('2d');
const context2 = canvas2.getContext('2d');
const context3 = canvas3.getContext('2d');
const context4 = canvas4.getContext('2d');
const context5 = canvas_temp.getContext('2d');

const download_element = document.createElement("a");
const input = document.createElement('input');

input.type = 'file';
input.accept = "image/*";
input.style.display = 'none';

let current_size_tile_div = [tile_div.style.height, tile_div.style.width];
let current_size_single_tile_div = [single_tile_div.style.height, single_tile_div.style.width];
const current_tile_pos = [];

let img = null;
let img_change = null;
let tile_click = false;
let current_tile = [];

function mouse_event_listener() {
    if (using_mouse_event.checked) {
        mouse_event_log.style.display = "";

        canvas1.onmouseleave = function(event) {
            if (tile_click) {
                tile_click = false;
                current_tile = []

                mouse_event_action.innerText = `Action: None`
            }
        }
        canvas1.onmousemove = function(event) {
            const rect = canvas1.getBoundingClientRect();
            const tileX = Math.floor((event.clientX - rect.left) / (parseInt(tileWidthInput.value) || 32));
            const tileY = Math.floor((event.clientY - rect.top) / (parseInt(tileHeightInput.value) || 32));
            
            mouse_event_plaintext.innerText = `Your mouse position is in tile X: ${tileX} and Y: ${tileY}`
            if (tile_click) {
                mouse_event_action.innerText = `Action: Move tile from X: ${current_tile[0]} and Y: ${current_tile[1]} to X: ${tileX} and Y: ${tileY}`
            }
        }
        canvas1.onmousedown = function(event) {
            const rect = canvas1.getBoundingClientRect();
            tile_click = true;
            current_tile = [Math.floor((event.clientX - rect.left) / (parseInt(tileWidthInput.value) || 32)), Math.floor((event.clientY - rect.top) / (parseInt(tileHeightInput.value) || 32))]
        }
        canvas1.onmouseup = function(event) {
            if (!tile_click) return;
            tile_click = false;

            const rect = canvas1.getBoundingClientRect();
            const tileX = Math.floor((event.clientX - rect.left) / (parseInt(tileWidthInput.value) || 32));
            const tileY = Math.floor((event.clientY - rect.top) / (parseInt(tileHeightInput.value) || 32));

            if (current_tile[0] == tileX && current_tile[1] == tileY) {
                $("#modal-tile-modify").modal("show");
                canvas2.width = Number(tileWidthInput.value) * 3;
                canvas2.height = Number(tileHeightInput.value) * 3;

                single_tile_div.style.height = Number(current_size_single_tile_div[0].slice(0, -2)) >= (Number(tileHeightInput.value) * 3) ? `${Number(tileHeightInput.value) * 3}px` : current_size_single_tile_div[0];
                single_tile_div.style.width = Number(current_size_single_tile_div[1].slice(0, -2)) >= (Number(tileWidthInput.value) * 3) ? `${Number(tileWidthInput.value) * 3}px` : current_size_single_tile_div[1];

                prev_height.value = single_tile_div.style.height.slice(0, -2);
                prev_width.value = single_tile_div.style.width.slice(0, -2);
                context2.imageSmoothingEnabled = prev_img_filter.value === "Nearest" ? false : true;

                context2.clearRect(0, 0, canvas2.width, canvas2.height);

                current_tile_pos[0] = tileX
                current_tile_pos[1] = tileY

                context2.drawImage(canvas4, tileX * Number(tileWidthInput.value), tileY * Number(tileHeightInput.value), Number(tileWidthInput.value), Number(tileHeightInput.value), 0, 0, canvas2.width, canvas2.height);
                
                canvas3.width = Number(tileWidthInput.value)
                canvas3.height = Number(tileHeightInput.value);

                context3.clearRect(0, 0, canvas3.width, canvas3.height);
                context3.drawImage(canvas4, tileX * Number(tileWidthInput.value), tileY * Number(tileHeightInput.value), Number(tileWidthInput.value), Number(tileHeightInput.value), 0, 0, canvas3.width, canvas3.height);
                
                document.getElementById("modal-title-tile").innerHTML = `Edit Tile (X: ${tileX}, Y: ${tileY})`;
            } else {
                canvas_temp.width = Number(tileWidthInput.value);
                canvas_temp.height = Number(tileHeightInput.value);
                context5.clearRect(0, 0, canvas_temp.width, canvas_temp.height);
                context5.drawImage(canvas4, canvas_temp.width * current_tile[0], canvas_temp.height * current_tile[1], canvas_temp.width, canvas_temp.height, 0, 0, canvas_temp.width, canvas_temp.height);
                context4.clearRect(canvas_temp.width * current_tile[0], canvas_temp.height * current_tile[1], canvas_temp.width, canvas_temp.height);
                context4.drawImage(canvas4, canvas_temp.width * tileX, canvas_temp.height * tileY, canvas_temp.width, canvas_temp.height, canvas_temp.width * current_tile[0], canvas_temp.height * current_tile[1], canvas_temp.width, canvas_temp.height);
                context4.clearRect(canvas_temp.width * tileX, canvas_temp.height * tileY, canvas_temp.width, canvas_temp.height);
                context4.drawImage(canvas_temp, 0, 0, canvas_temp.width, canvas_temp.height, canvas_temp.width * tileX, canvas_temp.height * tileY, canvas_temp.width, canvas_temp.height);
                canvas_draw();

                mouse_event_action.innerText = `Action: None`
            }
        }

        canvas1.onclick = null;
    } else {
        mouse_event_log.style.display = "none";

        canvas1.onmousedown = null
        canvas1.onmouseleave = null
        canvas1.onmousemove = null
        canvas1.onmouseup = null

        canvas1.onclick = function(event) {
            const rect = canvas1.getBoundingClientRect();
            const tileX = Math.floor((event.clientX - rect.left) / (parseInt(tileWidthInput.value) || 32));
            const tileY = Math.floor((event.clientY - rect.top) / (parseInt(tileHeightInput.value) || 32));

            $("#modal-tile-modify").modal("show");
            canvas2.width = Number(tileWidthInput.value) * 3;
            canvas2.height = Number(tileHeightInput.value) * 3;

            single_tile_div.style.height = Number(current_size_single_tile_div[0].slice(0, -2)) >= (Number(tileHeightInput.value) * 3) ? `${Number(tileHeightInput.value) * 3}px` : current_size_single_tile_div[0];
            single_tile_div.style.width = Number(current_size_single_tile_div[1].slice(0, -2)) >= (Number(tileWidthInput.value) * 3) ? `${Number(tileWidthInput.value) * 3}px` : current_size_single_tile_div[1];

            prev_height.value = single_tile_div.style.height.slice(0, -2);
            prev_width.value = single_tile_div.style.width.slice(0, -2);
            context2.imageSmoothingEnabled = prev_img_filter.value === "Nearest" ? false : true;

            context2.clearRect(0, 0, canvas2.width, canvas2.height);

            current_tile_pos[0] = tileX
            current_tile_pos[1] = tileY

            context2.drawImage(canvas4, tileX * Number(tileWidthInput.value), tileY * Number(tileHeightInput.value), Number(tileWidthInput.value), Number(tileHeightInput.value), 0, 0, canvas2.width, canvas2.height);

            canvas3.width = Number(tileWidthInput.value)
            canvas3.height = Number(tileHeightInput.value);

            context3.clearRect(0, 0, canvas3.width, canvas3.height);
            context3.drawImage(canvas4, tileX * Number(tileWidthInput.value), tileY * Number(tileHeightInput.value), Number(tileWidthInput.value), Number(tileHeightInput.value), 0, 0, canvas3.width, canvas3.height);

            document.getElementById("modal-title-tile").innerHTML = `Edit Tile (X: ${tileX}, Y: ${tileY})`;
        }

    }
}

window.onload = function() {
    document.getElementById("visitor_img").src = "https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2FGuckTubeYT%2FGrowTools&countColor=%2337d67a"
    dw_tile.disabled = true;
    extract_tile_to_per_image_btn.disabled = true;
    reposition_tile_btn.disabled = true;
    mouse_event_listener();
}

using_mouse_event.onchange = mouse_event_listener

function is_image_empty(imageData) {
    for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] !== 0) return false;
    }
    return true;
}

function canvasToBlob(canvas, type = 'image/png') {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, type);
    });
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

function drawGrid(tileWidth, tileHeight) {
    context1.strokeStyle = 'rgba(255, 255, 255, 1)';
    context1.beginPath();

    for (let x = 0; x <= canvas1.width; x += tileWidth) {
        context1.moveTo(x, 0);
        context1.lineTo(x, canvas1.height);
    }

    for (let y = 0; y <= canvas1.height; y += tileHeight) {
        context1.moveTo(0, y);
        context1.lineTo(canvas1.width, y);
    }

    context1.stroke();
}

function canvas_draw() {
    context1.clearRect(0, 0, canvas1.width, canvas1.height);
    context1.drawImage(canvas4, 0, 0);

    drawGrid(Number(tileWidthInput.value) || 32, Number(tileHeightInput.value) || 32);
}

prev_img_filter.addEventListener("change", function(event) {
    context2.imageSmoothingEnabled = event.target.value === "Nearest" ? false : true;
    context2.clearRect(0, 0, canvas2.width, canvas2.height);
    if (img_change) context2.drawImage(img_change, 0, 0, img_change.width, img_change.height, 0, 0, canvas2.width, canvas2.height);
    else context2.drawImage(canvas4, current_tile_pos[0] * Number(tileWidthInput.value), current_tile_pos[1] * Number(tileHeightInput.value), Number(tileWidthInput.value), Number(tileHeightInput.value), 0, 0, canvas2.width, canvas2.height);
});

document.getElementById('browse_file_image').addEventListener('click', function() {
    input.onchange = function (ev) {
        document.getElementById("file_name").innerText = `File Name: ${ev.target.files[0].name}`;
        const freader = new FileReader();
        img = freader.readAsDataURL(ev.target.files[0]);

        freader.onloadend = function(e) {
            const image = new Image();
            image.src = e.target.result;

            image.onload = function(event) {
                img = event.target;

                canvas1.width = img.width;
                canvas1.height = img.height;
                canvas4.width = img.width;
                canvas4.height = img.height;

                tile_div.style.height = Number(tile_div.style.height.slice(0, -2)) >= img.height ? `${img.height}px` : current_size_tile_div[0];
                tile_div.style.width = Number(tile_div.style.width.slice(0, -2)) >= img.width ? `${img.width}px` : current_size_tile_div[1];
                tile_div.style.display = ""

                context4.clearRect(0, 0, canvas4.width, canvas4.height);
                context4.drawImage(img, 0, 0);

                canvas_draw();

                dw_tile.disabled = false;
                extract_tile_to_per_image_btn.disabled = false;
                reposition_tile_btn.disabled = false;
            }
        }
    };

    input.click();
});

tileWidthInput.addEventListener('input', canvas_draw);
tileHeightInput.addEventListener('input', canvas_draw);

function update_prev_image() {
    canvas2.width = Number(prev_width.value);
    canvas2.height = Number(prev_height.value);

    single_tile_div.style.height = Number(current_size_single_tile_div[0].slice(0, -2)) >= (canvas2.height) ? `${canvas2.height}px` : current_size_single_tile_div[0];
    single_tile_div.style.width = Number(current_size_single_tile_div[1].slice(0, -2)) >= (canvas2.width) ? `${canvas2.width}px` : current_size_single_tile_div[1];

    context2.clearRect(0, 0, canvas2.width, canvas2.height);

    context2.imageSmoothingEnabled = prev_img_filter.value === "Nearest" ? false : true;
    if (img_change) context2.drawImage(img_change, 0, 0, img_change.width, img_change.height, 0, 0, canvas2.width, canvas2.height);
    else context2.drawImage(canvas4, current_tile_pos[0] * Number(tileWidthInput.value), current_tile_pos[1] * Number(tileHeightInput.value), Number(tileWidthInput.value), Number(tileHeightInput.value), 0, 0, canvas2.width, canvas2.height);
}

function download_img() {
    download_element.download = 'result-original.png';
    download_element.href = canvas3.toDataURL();
    download_element.click();
}

function download_prev_img() {
    download_element.download = 'result-preview.png';
    download_element.href = canvas2.toDataURL();
    download_element.click();
}

function change_img_tile() {
    input.onchange = function (ev) {
        const freader = new FileReader();
        img_change = freader.readAsDataURL(ev.target.files[0]);

        freader.onloadend = function(e) {
            const image = new Image();
            image.src = e.target.result;

            image.onload = function(event) {
                img_change = event.target;

                canvas2.width = img_change.width;
                canvas2.height = img_change.height;
                canvas3.width = img_change.width;
                canvas3.height = img_change.height;
                single_tile_div.style.height = Number(current_size_single_tile_div[0].slice(0, -2)) >= img_change.height ? `${img_change.height}px` : current_size_tile_div[0];
                single_tile_div.style.width = Number(current_size_single_tile_div[1].slice(0, -2)) >= img_change.width ? `${img_change.width}px` : current_size_tile_div[1];

                context2.imageSmoothingEnabled = prev_img_filter.value === "Nearest" ? false : true;
                context2.drawImage(img_change, 0, 0, canvas2.width, canvas2.height, 0, 0, canvas2.width, canvas2.height);
                context3.drawImage(img_change, 0, 0, canvas3.width, canvas3.height, 0, 0, canvas3.width, canvas3.height);
                prev_height.value = single_tile_div.style.height.slice(0, -2);
                prev_width.value = single_tile_div.style.width.slice(0, -2);
            }
        }
    };

    input.click();
}

function reposition_tile() {
    Swal.fire({
        icon: 'warning',
        title: 'Reposition Tile',
        text: "Are you sure to reposition the tile?",
        showDenyButton: true,
        denyButtonColor: '#3085d6',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes (Enter)',
        denyButtonText: `No (Esc)`,
      }).then(async result => {
        if (result.isConfirmed) {
            const total_x = canvas4.width / Number(tileWidthInput.value);
            const total_y = canvas4.height / Number(tileHeightInput.value);

            let empty_tile_coordinate = []
            for (let y1 = 0; y1 < total_y; y1++) { // height
                for (let x1 = 0; x1 < total_x; x1++) { // width
                    if (is_image_empty(context4.getImageData(x1 * Number(tileWidthInput.value), y1 * Number(tileHeightInput.value), Number(tileWidthInput.value), Number(tileHeightInput.value)))) {
                        if (y1 != (total_y - 1) || x1 != (total_x - 1)) empty_tile_coordinate.push([x1, y1])
                    }
                }
            }

            for (let a = empty_tile_coordinate.length - 1; a > -1; a--) {
                let cur_x = empty_tile_coordinate[a][0], cur_y = empty_tile_coordinate[a][1], cur_x2 = empty_tile_coordinate[a][0];

                for (let y1 = empty_tile_coordinate[a][1]; y1 < total_y; y1++) { // height
                    for (let x1 = cur_x2; x1 < total_x; x1++) { // width
                        if ((cur_x + 1) >= total_x) cur_x = 0, cur_y++;
                        else cur_x++;
                        
                        if (is_image_empty(context4.getImageData(cur_x * Number(tileWidthInput.value), cur_y * Number(tileHeightInput.value), Number(tileWidthInput.value), Number(tileHeightInput.value)))) break;
                        context4.drawImage(canvas4, Number(tileWidthInput.value) * cur_x, Number(tileHeightInput.value) * cur_y, Number(tileWidthInput.value), Number(tileHeightInput.value), Number(tileWidthInput.value) * x1, Number(tileHeightInput.value) * y1, Number(tileWidthInput.value), Number(tileHeightInput.value))
                        context4.clearRect(Number(tileWidthInput.value) * cur_x, Number(tileHeightInput.value) * cur_y, Number(tileWidthInput.value), Number(tileHeightInput.value));
                    }
                    cur_x2 = 0
                }
            }
            canvas_draw();

            Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            }).fire({
                icon: 'success',
                title: "The tile was successfully repositioned!"
            })
        }
    })
}

function delete_img_tile() {
    Swal.fire({
        icon: 'warning',
        title: 'Delete Tile',
        text: "Are you sure to delete the tile?",
        showDenyButton: true,
        denyButtonColor: '#3085d6',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes (Enter)',
        denyButtonText: `No (Esc)`,
      }).then(async result => {
        if (result.isConfirmed) {
            const x = current_tile_pos[0];
            const y = current_tile_pos[1];

            if (document.getElementById("reposition_tile").checked) {
                let cur_x = x, cur_y = y;
                const total_x = canvas4.width / Number(tileWidthInput.value);
                const total_y = canvas4.height / Number(tileHeightInput.value);

                for (let y1 = y; y1 < total_y; y1++) { // height
                    for (let x1 = x; x1 < total_x; x1++) { // width
                        if ((cur_x + 1) >= total_x) cur_x = 0, cur_y++;
                        else cur_x++;
                        context4.clearRect(Number(tileWidthInput.value) * x1, Number(tileHeightInput.value) * y1, Number(tileWidthInput.value), Number(tileHeightInput.value));
                        context4.drawImage(canvas4, Number(tileWidthInput.value) * cur_x, Number(tileHeightInput.value) * cur_y, Number(tileWidthInput.value), Number(tileHeightInput.value), Number(tileWidthInput.value) * x1, Number(tileHeightInput.value) * y1, Number(tileWidthInput.value), Number(tileHeightInput.value))
                    }
                }

                canvas_draw();
            } else context4.clearRect(x * Number(tileWidthInput.value), y * Number(tileHeightInput.value), Number(tileWidthInput.value), Number(tileHeightInput.value));
            canvas_draw();

            $("#modal-tile-modify").modal("hide");
            Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            }).fire({
                icon: 'success',
                title: "The tile was successfully deleted!"
            })
        }
    })
}

function save_to_tile() {
    if (img_change) {
        const x = Number(tileWidthInput.value) * current_tile_pos[0];
        const y = Number(tileHeightInput.value) * current_tile_pos[1];

        context4.clearRect(x, y, Number(tileWidthInput.value), Number(tileHeightInput.value));
        context4.imageSmoothingEnabled = prev_img_filter.value === "Nearest" ? false : true;
        context4.drawImage(img_change, 0, 0, img_change.width, img_change.height, x, y, Number(tileWidthInput.value), Number(tileHeightInput.value));
        canvas_draw();

        img_change = null;

        Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        }).fire({
            icon: 'success',
            title: "The image tile was successfully changed!"
        })
    }
    $("#modal-tile-modify").modal("hide");
}

function download_tile() {
    download_element.download = 'result.png';
    download_element.href = canvas4.toDataURL();
    download_element.click();
}

function show_tile_zip_dialog() {
    if (canvas4.width % Number(tileWidthInput.value) || canvas4.height % Number(tileWidthInput.value)) return Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    }).fire({
        icon: 'error',
        title: "Please input the correct per tile Width and Height! until it fit per Tile Editor."
    })
    
    $("#modal-tile-to-per-image-zip").modal("show");
}

$("#modal-tile-modify").on("shown.bs.modal", function() {
    $('#reposition_tile').bootstrapToggle('destroy');
    $('#reposition_tile').bootstrapToggle();
    $('#reposition_tile').bootstrapToggle("off");
})

$('#modal-tile-to-per-image-zip').on('shown.bs.modal', function () {
    $('#using_ori_size_image').bootstrapToggle('destroy');
    $('#using_ori_size_image').bootstrapToggle();
    $('#using_ori_size_image').bootstrapToggle("on");

    $('#ignore_empty_image').bootstrapToggle('destroy');
    $('#ignore_empty_image').bootstrapToggle();

    manual_size.style.display = "none";
})

document.getElementById("using_ori_size_image").onchange = function(e) {
    manual_size.style.display = e.target.checked ? "none" : "";
}

async function extract_tile_to_per_image() {
    const total_y = canvas4.height / Number(tileHeightInput.value);
    const total_x = canvas4.width / Number(tileWidthInput.value);

    if (!document.getElementById("using_ori_size_image").checked) {
        canvas_temp.width = Number(document.getElementById("image_width").value);
        canvas_temp.height = Number(document.getElementById("image_height").value);
    } else {
        canvas_temp.width = Number(tileWidthInput.value);
        canvas_temp.height = Number(tileHeightInput.value);
    }
    
    let index = 0;
    const ignore_empty_image = document.getElementById("ignore_empty_image").checked
    extract_tile_to_per_image_btn.disabled = true;
    extract_tile_to_per_image_btn.innerText = `Extract and ZIP (Processing...)`
    var zip = new JSZip();

    if (document.getElementById("name_image_as").value === "Index (0.png)") {
        for (let y = 0; y < total_y; y++) {
            for (let x = 0; x < total_x; x++) {
                if (ignore_empty_image && is_image_empty(context4.getImageData(x * Number(tileWidthInput.value), y * Number(tileHeightInput.value), Number(tileWidthInput.value), Number(tileHeightInput.value)))) break;
                await context5.clearRect(0, 0, Number(tileWidthInput.value), Number(tileHeightInput.value));
                context5.imageSmoothingEnabled = result_img_filter.value === "Nearest" ? false : true;
                await context5.drawImage(canvas4, Number(tileWidthInput.value) * x, Number(tileHeightInput.value) * y, Number(tileWidthInput.value), Number(tileHeightInput.value), 0, 0, canvas_temp.width, canvas_temp.height);
                await zip.file(`${index++}.png`, await canvasToBlob(canvas_temp, "image/png"));
            }
        }
    } else {
        for (let y = 0; y < total_y; y++) {
            for (let x = 0; x < total_x; x++) {
                if (ignore_empty_image && is_image_empty(context4.getImageData(x * Number(tileWidthInput.value), y * Number(tileHeightInput.value), Number(tileWidthInput.value), Number(tileHeightInput.value)))) break;
                await context5.clearRect(0, 0, Number(tileWidthInput.value), Number(tileHeightInput.value));
                context5.imageSmoothingEnabled = result_img_filter.value === "Nearest" ? false : true;
                await context5.drawImage(canvas4, Number(tileWidthInput.value) * x, Number(tileHeightInput.value) * y, Number(tileWidthInput.value), Number(tileHeightInput.value), 0, 0, canvas_temp.width, canvas_temp.height);
                await zip.file(`x${x}y${y}.png`, await canvasToBlob(canvas_temp, "image/png"));
            }
        }
    }

    await zip.generateAsync({type:"arrayBuffer"}).then(function(content) {
        saveDataBuffer(content, "result.zip")
        extract_tile_to_per_image_btn.disabled = false;
        extract_tile_to_per_image_btn.innerText = `Extract and ZIP`
    });

    $("#using_ori_size_image").modal("hide");
    Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    }).fire({
        icon: 'success',
        title: "The Tile Editor was successfully extracted into a single PNGs!"
    })
}

async function create_image_tile() {
    canvas4.width = Number(image_width_create_tile.value) * Number(total_tile_in_x.value);
    canvas4.height = Number(image_height_create_tile.value) * Number(total_tile_in_y.value);
    
    canvas1.width = canvas4.width
    canvas1.height = canvas4.height

    context4.clearRect(0, 0, canvas4.width, canvas4.height);

    tileWidthInput.value = image_width_create_tile.value
    tileHeightInput.value = image_height_create_tile.value
    tile_div.style.height = Number(tile_div.style.height.slice(0, -2)) >= canvas1.height ? `${canvas1.height}px` : current_size_tile_div[0];
    tile_div.style.width = Number(tile_div.style.width.slice(0, -2)) >= canvas1.width ? `${canvas1.width}px` : current_size_tile_div[1];

    tile_div.style.display = "";
    dw_tile.disabled = false;
    extract_tile_to_per_image_btn.disabled = false;
    reposition_tile_btn.disabled = false;
    canvas_draw();

    $("#modal-create-new-tile").modal("hide");

    Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    }).fire({
        icon: 'success',
        title: "The tile was successfully created!"
    })
}