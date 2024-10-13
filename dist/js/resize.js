const canvas_result_div = document.getElementById("canvas_result_div");
const canvas1 = document.getElementById("canvas_result");
const img_height = document.getElementById("img_height");
const img_width = document.getElementById("img_width");
const img_filter = document.getElementById("img_filter");

const context1 = canvas1.getContext("2d");

const download_element = document.createElement("a");
const input = document.createElement('input');

let current_size = [canvas_result_div.style.height, canvas_result_div.style.width]
let img = null;

input.type = 'file';
input.accept = "image/*";
input.style.display = 'none';

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
                canvas_result_div.style.height = Number(current_size[0].slice(0, -2)) >= img.height ? `${img.height}px` : current_size[0];
                canvas_result_div.style.width = Number(current_size[1].slice(0, -2)) >= img.width ? `${img.width}px` : current_size[1];
                canvas_result_div.style.display = ""

                img_width.value = img.width;
                img_height.value = img.height;

                context1.clearRect(0, 0, canvas1.width, canvas1.height);
                context1.imageSmoothingEnabled = img_filter.value === "Nearest" ? false : true;
                context1.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas1.width, canvas1.height);
            }
        }
    };

    input.click();
});

function apply_img() {
    canvas1.width = img_width.value;
    canvas1.height = img_height.value;

    canvas_result_div.style.height = Number(current_size[0].slice(0, -2)) >= canvas1.height ? `${canvas1.height}px` : current_size[0];
    canvas_result_div.style.width = Number(current_size[1].slice(0, -2)) >= canvas1.width ? `${canvas1.width}px` : current_size[1];

    context1.clearRect(0, 0, canvas1.width, canvas1.height);
    context1.imageSmoothingEnabled = img_filter.value === "Nearest" ? false : true;
    context1.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas1.width, canvas1.height);
}

function download_img() {
    download_element.download = 'result.png';
    download_element.href = canvas1.toDataURL();
    download_element.click();
}