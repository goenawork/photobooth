const video = document.getElementById("video");
const button = document.getElementById("startCamera");

button.addEventListener("click", async () => {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video:true
            });

        video.srcObject = stream;

    } catch(error) {

        alert("Kamera tidak dapat diakses");

        console.error(error);
    }

});
const video = document.getElementById("video");
const startCamera = document.getElementById("startCamera");

const takePhoto = document.getElementById("takePhoto");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const photo = document.getElementById("photo");

startCamera.addEventListener("click", async () => {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: true
            });

        video.srcObject = stream;

    } catch(err) {

        alert("Kamera tidak dapat diakses");
        console.error(err);

    }

});

takePhoto.addEventListener("click", () => {

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const imageData =
        canvas.toDataURL("image/png");

    photo.src = imageData;

});
